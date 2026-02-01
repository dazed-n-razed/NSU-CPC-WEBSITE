================================================================================
DEVELOPMENT vs PRODUCTION DOCKER SETUP
================================================================================

This guide explains how to work with Docker in development vs production mode.

================================================================================
THE PROBLEM: IMMUTABLE IMAGES
================================================================================

Docker images are IMMUTABLE (frozen). Once built, they don't change.

Example:
1. You build an image with HomePage.js containing "Hello World"
2. Image is frozen with this code
3. You change HomePage.js to "Hello Docker"
4. Container still shows "Hello World" ❌
5. Why? Because it's using the frozen image code!

================================================================================
TWO SOLUTIONS
================================================================================

1. DEVELOPMENT MODE (with volumes + hot reload)
   - Code changes reflect immediately
   - Use during daily development
   - Command: docker-compose -f docker-compose.dev.yml up

2. PRODUCTION MODE (immutable images)
   - Must rebuild to see changes
   - Use for testing production build
   - Command: docker-compose up

================================================================================
DEVELOPMENT MODE (Daily Coding)
================================================================================

Use this mode when actively developing:

# Stop production containers first
docker-compose down

# Start development environment
docker-compose -f docker-compose.dev.yml up -d

What happens:
✅ React dev server runs (npm start)
✅ Nodemon runs backend (auto-restart on changes)
✅ Code syncs from your machine to container (volumes)
✅ Changes reflect IMMEDIATELY (hot reload)
✅ Fast feedback loop

Frontend: Edit HomePage.js → Save → Browser auto-refreshes ✨
Backend: Edit index.js → Save → Server auto-restarts ✨

Files:
- docker-compose.dev.yml    (development config)
- frontend/Dockerfile.dev   (dev frontend setup)
- backend/Dockerfile.dev    (dev backend setup)

Workflow:
1. Edit code in VSCode
2. Save file
3. See changes instantly!

No rebuild needed! 🚀

================================================================================
PRODUCTION MODE (Testing Builds)
================================================================================

Use this mode to test production builds:

# Stop development containers
docker-compose -f docker-compose.dev.yml down

# Build production images
docker-compose build

# Start production environment
docker-compose up -d

What happens:
✅ React app is built (optimized bundles)
✅ Frontend served with 'serve' (fast static server)
✅ Backend uses node (not nodemon)
✅ Immutable - code frozen in image
❌ Changes require rebuild

Frontend: Edit HomePage.js → Rebuild image → Recreate container
Backend: Edit index.js → Rebuild image → Recreate container

Files:
- docker-compose.yml     (production config)
- frontend/Dockerfile    (production frontend)
- backend/Dockerfile     (production backend)

Workflow:
1. Make changes
2. docker-compose build
3. docker-compose up -d --force-recreate
4. See changes

Slower, but tests production setup! 🏭

================================================================================
WHEN TO USE EACH MODE
================================================================================

DEVELOPMENT MODE (docker-compose.dev.yml):
✅ Daily coding
✅ Feature development
✅ Bug fixing
✅ Testing changes quickly
✅ Hot reload needed

PRODUCTION MODE (docker-compose.yml):
✅ Testing production build
✅ Performance testing
✅ Pre-deployment verification
✅ Checking optimized bundles
✅ Simulating real deployment

================================================================================
VOLUME MOUNTS EXPLAINED
================================================================================

Volumes = Bridge between your machine and container

Without volumes:
┌─────────────┐              ┌─────────────┐
│  Your PC    │              │  Container  │
│             │    X         │             │
│ HomePage.js │──────────────│ HomePage.js │
│ (new code)  │   isolated   │ (old code)  │
└─────────────┘              └─────────────┘
Changes don't sync ❌

With volumes:
┌─────────────┐              ┌─────────────┐
│  Your PC    │              │  Container  │
│             │    ✓         │             │
│ HomePage.js │◄═════════════│ HomePage.js │
│ (new code)  │   synced!    │ (new code)  │
└─────────────┘              └─────────────┘
Changes sync immediately ✅

In docker-compose.dev.yml:
volumes:
  - ./frontend:/app        # Your code → Container
  - /app/node_modules      # Keep node_modules in container

================================================================================
QUICK REFERENCE COMMANDS
================================================================================

DEVELOPMENT MODE:
─────────────────
# Start
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop
docker-compose -f docker-compose.dev.yml down

# Restart after package.json changes
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up -d --force-recreate


PRODUCTION MODE:
────────────────
# Build images
docker-compose build

# Start
docker-compose up -d

# After code changes (need rebuild)
docker-compose build
docker-compose up -d --force-recreate

# View logs
docker-compose logs -f

# Stop
docker-compose down


SWITCH BETWEEN MODES:
─────────────────────
# From production to development:
docker-compose down
docker-compose -f docker-compose.dev.yml up -d

# From development to production:
docker-compose -f docker-compose.dev.yml down
docker-compose build
docker-compose up -d

================================================================================
HOW IT WORKS: DEVELOPMENT MODE
================================================================================

React Development Server (Frontend):
1. npm start runs inside container
2. Watches files for changes
3. Your code is mounted via volumes
4. Change HomePage.js on Windows
5. Volume syncs change to container
6. React dev server detects change
7. Rebuilds and hot-reloads
8. Browser auto-refreshes
9. You see changes in ~2 seconds! ✨

Nodemon (Backend):
1. npm start (nodemon) runs inside container
2. Watches files for changes
3. Your code is mounted via volumes
4. Change index.js on Windows
5. Volume syncs change to container
6. Nodemon detects change
7. Restarts Node.js server
8. API updated in ~1 second! ✨

================================================================================
HOW IT WORKS: PRODUCTION MODE
================================================================================

React Production Build (Frontend):
1. npm run build creates optimized files
2. Files baked into Docker image (immutable)
3. serve serves static files
4. No file watching, no hot reload
5. Change HomePage.js on Windows
6. Change NOT synced (no volumes)
7. Must rebuild image to see changes
8. docker-compose build frontend
9. docker-compose up -d --force-recreate frontend
10. See changes after ~2 minutes

Production Backend:
1. node index.js runs (no nodemon)
2. Code baked into image
3. No file watching, no auto-restart
4. Change index.js on Windows
5. Change NOT synced
6. Must rebuild image
7. Restart container
8. See changes after rebuild

================================================================================
TYPICAL DEVELOPER WORKFLOW
================================================================================

MORNING (Start work):
───────────────────────
docker-compose -f docker-compose.dev.yml up -d
# Containers start, you start coding


DURING THE DAY (Coding):
─────────────────────────
# Edit files in VSCode
# Save files
# See changes automatically
# No docker commands needed! 🎉


AFTER PACKAGE CHANGES (Rare):
──────────────────────────────
# If you add new npm packages:
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up -d --force-recreate


BEFORE COMMITTING (Good practice):
───────────────────────────────────
# Test production build:
docker-compose -f docker-compose.dev.yml down
docker-compose build
docker-compose up -d
# Verify everything works
# Then git push


EVENING (End work):
───────────────────
docker-compose -f docker-compose.dev.yml down
# Containers stop, you stop working

================================================================================
PROS & CONS
================================================================================

DEVELOPMENT MODE:
─────────────────
Pros:
✅ Instant feedback (hot reload)
✅ Fast development cycle
✅ No rebuild needed
✅ Better developer experience
✅ Mimics normal npm start workflow

Cons:
❌ Larger containers (includes dev dependencies)
❌ Not production-like
❌ Slightly slower startup


PRODUCTION MODE:
────────────────
Pros:
✅ Smaller containers (production dependencies only)
✅ Optimized builds
✅ Tests production setup
✅ Matches deployment environment
✅ True immutability

Cons:
❌ Slow feedback (need rebuild)
❌ Tedious for development
❌ Wastes time during coding

================================================================================
BEST PRACTICE
================================================================================

Use DEVELOPMENT MODE for:
- 95% of your work
- Daily coding
- Feature development
- Bug fixes

Use PRODUCTION MODE for:
- 5% of your work
- Testing builds before deployment
- Performance testing
- Final verification

================================================================================
SUMMARY
================================================================================

Question: "If I make changes to frontend, how will it take effect 
           since images are immutable?"

Answer:
1. PRODUCTION MODE (current): Must rebuild image to see changes
2. DEVELOPMENT MODE (recommended): Changes reflect immediately

Commands:
# Daily work (development mode)
docker-compose -f docker-compose.dev.yml up -d
# Edit code → Save → See changes instantly! ✨

# Testing (production mode)
docker-compose build
docker-compose up -d
# Edit code → Rebuild → Restart → See changes

Use development mode for coding!
Use production mode for testing!

================================================================================
