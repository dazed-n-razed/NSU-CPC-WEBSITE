# Project Startup Guide

## Prerequisites
- **Node.js LTS** (v20 or later): Download from [nodejs.org](https://nodejs.org/) and install.
- **MongoDB Community Server**: Download from [mongodb.com](https://www.mongodb.com/try/download/community) and install (ensure the service starts automatically).
- **Git Bash** (if on Windows): Comes with Git installation.

## Project Structure
- `backend/`: Node.js/Express server with MongoDB.
- `frontend/`: React app with Tailwind CSS and DaisyUI.
- `start.sh`: Automation script for starting both servers.

## Starting the Project

### Option 1: Using the Automation Script (Recommended)
1. Open Git Bash (or WSL on Windows).
2. Navigate to the project root: `cd /path/to/CSE-299-NSU-CPC`
3. Make the script executable (if needed): `chmod +x start.sh`
4. Run the script: `./start.sh`
   - This installs dependencies, starts the backend on port 3000, and frontend on port 5000.
   - The frontend opens automatically in your browser.

### Option 2: Manual Startup
1. **Backend**:
   - Open a terminal and go to `backend/`.
   - Install dependencies: `npm install`
   - Start server: `PORT=3000 npm start`
   - Server runs on `http://localhost:3000`.

2. **Frontend**:
   - Open another terminal and go to `frontend/`.
   - Install dependencies: `npm install`
   - Start app: `PORT=5000 npm start`
   - App runs on `http://localhost:5000` and opens in browser.

## Configuration
- **Backend .env** (`backend/.env`):
  - Ensure `MONGO_URI=mongodb://localhost:27017/yourdb` (update 'yourdb' to your preferred database name).
  - Other vars like `JWT_SECRET`, `GOOGLE_CLIENT_ID`, etc., are already set.
- **Frontend .env** (`frontend/.env`):
  - Firebase config is present; no changes needed unless updating keys.

## Troubleshooting
- **MongoDB Issues**: Ensure MongoDB service is running (`net start MongoDB` on Windows).
- **Port Conflicts**: Kill processes on 3000/5000 if needed (use Task Manager or `lsof` in Unix).
- **Node Version**: Use LTS to avoid compatibility issues.
- **Errors**: Check terminal output; common issues are missing dependencies or DB connection.

## Stopping the Project
- Press Ctrl+C in each terminal to stop servers.
- Or kill processes via Task Manager.

## Notes
- The project uses Express, Mongoose, Passport for auth, and React for the UI.
- For development, nodemon restarts the backend on file changes.
- Convert this guide to PDF using Pandoc: `pandoc START_GUIDE.md -o START_GUIDE.pdf`