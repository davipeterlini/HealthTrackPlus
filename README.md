# HealthTrackPlus

A comprehensive health tracking application with responsive design for both mobile and web interfaces.

## Features

- Health and activity tracking
- Medical exam records
- Responsive UI for mobile and desktop
- Dark mode support

## System Requirements

- Node.js 18+ 
- npm 8+ or Yarn 1.22+
- PostgreSQL 14+ (for the database)
- Android Studio / Xcode (for mobile development)

## Project Structure

```
HealthTrackPlus/
├── src/                    # Source code
│   ├── components/         # UI components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── pages/              # Application pages
│   ├── styles/             # CSS stylesheets
│   └── main.tsx            # Application entry point
├── server/                 # Backend server code
├── scripts/                # Utility scripts
│   └── setup.sh            # Setup script
├── index.html              # HTML entry point
└── package.json            # Project dependencies
```

## Quick Start (Development)

### 1. Clone the Repository and Install Dependencies

```bash
# Clone the repository (if you haven't already)
git clone https://github.com/yourusername/HealthTrackPlus.git
cd HealthTrackPlus

# Install project dependencies
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and configure it for your system:

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your specific settings
# Especially update DATABASE_URL with your username
# You can find your username by running: whoami
```

### 3. Install and Set up PostgreSQL

The application requires PostgreSQL to be installed and running.

#### On macOS:

```bash
# Install PostgreSQL using the provided script
npm run postgres:install:mac
```

This script will:
- Install PostgreSQL via Homebrew
- Start the PostgreSQL service
- Create the 'healthtrackplus' database
- Use your system username as the PostgreSQL user

#### On Windows:

Download and install PostgreSQL from the [official website](https://www.postgresql.org/download/windows/).
During installation:
- Use password 'postgres' for the default user
- Keep the default port (5432)
- After installation, create the database by running:
  ```
  npm run db:create
  ```

#### If PostgreSQL is already installed:

```bash
# Just create the database and set up schema
npm run db:setup
```

This script will:
- Check if PostgreSQL is installed
- Create the database if it doesn't exist
- Push the database schema using Drizzle

If you prefer to do these steps manually:

```bash
# Create the database only
npm run db:create

# Push the schema only
npm run db:push
```

### 3. Configure Environment Variables

The `.env.example` file was copied to `.env` in the previous step. Make sure to edit the `.env` file with your specific settings:

```
# Database URL for PostgreSQL (macOS)
DATABASE_URL=postgres://YOURUSERNAME@localhost:5432/healthtrackplus

# Server configuration
PORT=5001
NODE_ENV=development

# JWT configuration
JWT_SECRET=your_jwt_secret_key_replace_with_secure_random_string
```

Replace `YOURUSERNAME` with your system username, which you can find by running: `whoami`

Adjust other values as needed for your local setup.

### 4. Run Development Server

```bash
# Start both frontend and backend in development mode
npm run dev:start
```

The application will be available at `http://localhost:5001` (or whichever port you specified in the .env file).

## Mobile Development

### Prerequisites

- Android Studio for Android development
- Xcode for iOS development (macOS only)
- Capacitor CLI (installed with project dependencies)

### Setup Mobile Environment

```bash
# Setup mobile development environment
npm run mobile:setup
```

### Run on Mobile

```bash
# For Android
npm run mobile:android

# For iOS (macOS only)
npm run mobile:ios

# For both platforms (macOS only)
npm run mobile:both
```

## Production Deployment

### 1. Build the Application

```bash
# Build both frontend and backend
npm run build
```

### 2. Start Production Server

```bash
# Run in production mode
npm run start
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run start` - Start the production server
- `npm run check` - TypeScript type checking
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run db:push` - Push database schema changes

### Mobile Scripts

- `npm run mobile:setup` - Set up mobile development environment
- `npm run mobile:android` - Build and run on Android
- `npm run mobile:ios` - Build and run on iOS (macOS only)
- `npm run mobile:both` - Build and run on both platforms (macOS only)
- `npm run mobile:clean` - Clean mobile build files

## Environment Configuration

Create a `.env` file in the project root with the following variables:

```
# Database
DATABASE_URL=postgres://username:password@localhost:5432/healthtrackplus

# Server
PORT=3000
NODE_ENV=development

# Auth (if using authentication)
JWT_SECRET=your_jwt_secret

# External Services (optional)
STRIPE_SECRET_KEY=your_stripe_key
```

## Android Studio Installation

For Android development, you can use the included script:

```bash
chmod +x install_android_studio.sh
./install_android_studio.sh
```

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is installed and running:
  ```bash
  # On macOS
  brew services list  # Check if PostgreSQL is running
  brew services start postgresql@15  # Start if not running
  
  # On Windows
  pg_ctl status  # Check status
  pg_ctl start  # Start if not running
  ```
- Check the DATABASE_URL in your .env file matches your PostgreSQL configuration
- If you get ECONNREFUSED errors, PostgreSQL is not running. Start it using:
  ```bash
  npm run postgres:start
  ```
- Try running `npm run db:push` to recreate the schema after PostgreSQL is running

### Mobile Development Issues

- Run `npm run mobile:clean` and try again
- Ensure Android Studio / Xcode is installed correctly
- Check the output of `npx cap doctor` for environment issues

## License

This project is licensed under the MIT License.