import express from 'express';
import cors from 'cors';
import { registerRoutes } from '../backend/routes';
import { createServer } from 'http';
import path from 'path';
import { setupVite, log } from '../backend/vite';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Register API routes
(async function() {
  try {
    // Create HTTP server
    const server = createServer(app);

    // Register API routes
    await registerRoutes(app);

    // Setup Vite for serving frontend
    await setupVite(app, server);

    // Start server on port 5000
    server.listen(5000, '0.0.0.0', () => {
      log('serving on port 5000');
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();