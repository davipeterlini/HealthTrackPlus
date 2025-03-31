import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Express, Request } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "healthtrack-super-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Check if username is email format
        const isEmail = /\S+@\S+\.\S+/.test(username);
        
        let user;
        if (isEmail) {
          user = await storage.getUserByEmail(username);
        } else {
          user = await storage.getUserByUsername(username);
        }
        
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Invalid credentials" });
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );
  
  // Configure Google OAuth Strategy if credentials are available
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (googleClientId && googleClientSecret) {
    // Determine callback URL based on the environment
    let callbackURL = 'http://localhost:5000/api/auth/google/callback';
    
    // In Replit environment, use the replit.dev domain which is the actual domain being used
    if (process.env.REPLIT_DOMAINS) {
      // Use the first domain from REPLIT_DOMAINS environment variable
      const replitDomain = process.env.REPLIT_DOMAINS.split(',')[0].trim();
      callbackURL = `https://${replitDomain}/api/auth/google/callback`;
    }
      
    console.log('Google OAuth configured with callback URL:', callbackURL);
      
    passport.use(
      new GoogleStrategy(
        {
          clientID: googleClientId,
          clientSecret: googleClientSecret,
          callbackURL,
          scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user exists by email
            const email = profile.emails?.[0]?.value;
            if (!email) {
              return done(new Error('No email found in Google profile'));
            }
            
            let user = await storage.getUserByEmail(email);
            
            // If user doesn't exist, create a new one
            if (!user) {
              const username = `google_${profile.id}`;
              const name = profile.displayName || 'Google User';
              
              // Generate a random password for the Google user
              const randomPass = randomBytes(16).toString('hex');
              
              // Create user with Google profile data
              user = await storage.createUser({
                username,
                email,
                password: await hashPassword(randomPass),
                name
              });
            }
            
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, email, password, name } = req.body;
      
      // Validate input
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email, and password are required" });
      }
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create user
      const user = await storage.createUser({
        username,
        email,
        password: await hashPassword(password),
        name: name || username,
      });

      // Strip password from response
      const { password: _, ...userWithoutPassword } = user;
      
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        // Strip password from response
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Strip password from response
    const { password: _, ...userWithoutPassword } = req.user as SelectUser;
    res.json(userWithoutPassword);
  });
  
  // Verify 2FA code endpoint - in a real app this would validate against a stored secret
  app.post("/api/verify-2fa", (req, res) => {
    const { code } = req.body;
    
    if (!code || code.length !== 6) {
      return res.status(400).json({ message: "Invalid code" });
    }
    
    // For demo purposes, any 6-digit code is accepted
    // In a real app, this would validate against a TOTP algorithm
    if (code.match(/^\d{6}$/)) {
      return res.status(200).json({ message: "2FA verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid verification code" });
    }
  });
  
  // Google OAuth routes
  if (googleClientId && googleClientSecret) {
    // Check if Google OAuth is configured
    app.get("/api/auth/google/is-configured", (req, res) => {
      res.json({ isConfigured: true });
    });
    
    // Route to initiate Google OAuth
    app.get("/api/auth/google", (req, res, next) => {
      console.log('Starting Google OAuth flow');
      passport.authenticate("google", {
        scope: ["profile", "email"]
      })(req, res, next);
    });
    
    // Callback route after Google authenticates the user
    app.get(
      "/api/auth/google/callback",
      (req, res, next) => {
        console.log('Google callback received:', req.url);
        next();
      },
      (req, res, next) => {
        passport.authenticate("google", (err, user, info) => {
          if (err) {
            console.error('Google authentication error:', err);
            return res.redirect("/auth?error=google_auth_failed");
          }
          
          if (!user) {
            console.error('Google authentication failed:', info);
            return res.redirect("/auth?error=google_auth_failed");
          }
          
          req.login(user, (loginErr) => {
            if (loginErr) {
              console.error('Login error after Google auth:', loginErr);
              return res.redirect("/auth?error=login_failed");
            }
            
            next();
          });
        })(req, res, next);
      },
      (req, res) => {
        // Successful authentication, redirect to dashboard
        console.log('Google authentication successful, redirecting to dashboard');
        res.redirect("/dashboard");
      }
    );
  } else {
    // Return not configured if Google credentials are missing
    app.get("/api/auth/google/is-configured", (req, res) => {
      res.json({ isConfigured: false });
    });
    
    // Placeholder route for when Google OAuth is not configured
    app.get("/api/auth/google", (req, res) => {
      res.status(501).json({ 
        error: "Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables." 
      });
    });
  }
}
