# Docker Setup Guide for NSU-CPC-WEBSITE

## Overview
This guide explains how to use Docker to containerize your full-stack application (React Frontend + Node.js Backend + MongoDB Database).

## Prerequisites
- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- Docker Compose (comes with Docker Desktop)
- Basic understanding of Docker concepts

## Project Architecture

```
┌─────────────────────────────────────────────────┐
│          Docker Network (nsu-cpc-network)       │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐  ┌──────────────┐            │
│  │  Frontend    │  │   Backend    │            │
│  │  (React)     │  │  (Express)   │            │
│  │  Port 3000   │  │  Port 5000   │            │
│  └──────────────┘  └──────────────┘            │
│         │                  │                    │
│         └──────────────────┴──────────────┐     │
│                                           │     │
│                            ┌──────────────▼──┐  │
│                            │   MongoDB        │  │
│                            │   Port 27017     │  │
│                            └──────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Create Environment File
```bash
# Copy the example env file to create your local .env
cp .env.example .env
```

### 2. Update .env with Your Configuration
Edit the `.env` file and add your credentials:
```env
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=your_strong_password
MONGO_DATABASE=nsu_cpc_db
JWT_SECRET=your_secure_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
REACT_APP_FIREBASE_API_KEY=your_firebase_key
# ... add other Firebase and OAuth configs
```

### 3. Build Docker Images
```bash
# Build all services (from project root)
docker-compose build

# Or rebuild without cache
docker-compose build --no-cache
```

### 4. Run Containers
```bash
# Start all services in the background
docker-compose up -d

# Or start with logs visible
docker-compose up

# Stop all services
docker-compose down

# Stop and remove volumes (careful - removes data!)
docker-compose down -v
```

### 5. Access Your Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://admin:password@localhost:27017

## Docker Commands Reference

### View Running Containers
```bash
# List all running containers
docker-compose ps

# View logs for all services
docker-compose logs

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Follow logs in real-time
docker-compose logs -f backend
```

### Execute Commands in Container
```bash
# Access backend shell
docker-compose exec backend sh

# Run npm commands in backend
docker-compose exec backend npm install package-name

# Access frontend shell
docker-compose exec frontend sh

# MongoDB shell
docker-compose exec mongodb mongosh
```

### Database Management
```bash
# View MongoDB collections
docker-compose exec mongodb mongosh -u admin -p password
# Then in mongosh:
# use nsu_cpc_db
# db.collection_name.find()

# Reset database (removes all data)
docker-compose down -v
docker-compose up -d
```

### Rebuild Services
```bash
# Rebuild and restart specific service
docker-compose up -d --build backend
docker-compose up -d --build frontend

# Rebuild all
docker-compose up -d --build
```

## File Structure

```
project/
├── docker-compose.yml          # Main Docker orchestration file
├── .env.example                # Environment variables template
├── .env                        # Your actual env config (keep secret!)
├── backend/
│   ├── Dockerfile              # Backend container definition
│   ├── .dockerignore          # Files to exclude from Docker build
│   └── ...other backend files
├── frontend/
│   ├── Dockerfile             # Frontend container definition
│   ├── .dockerignore          # Files to exclude from Docker build
│   └── ...other frontend files
└── DOCKER_GUIDE.md            # This file
```

## Development Workflow

### Hot Reload / Live Development
Both frontend and backend containers are configured with volumes, so changes to your code are reflected immediately without rebuilding:

```bash
# Start containers
docker-compose up

# Edit your files locally
# Changes will be reflected in the running containers automatically
```

### Adding New Backend Dependencies
```bash
# Install npm package
docker-compose exec backend npm install axios

# This updates package.json, which is shared via volume
# Rebuild to ensure it's in the image
docker-compose up -d --build backend
```

### Adding New Frontend Dependencies
```bash
# Install npm package
docker-compose exec frontend npm install react-router-dom

# Rebuild to ensure it's in the image
docker-compose up -d --build frontend
```

## Troubleshooting

### Containers Won't Start
```bash
# Check logs
docker-compose logs

# Specific service logs
docker-compose logs backend

# Rebuild and start fresh
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### MongoDB Connection Issues
```bash
# Check if MongoDB is healthy
docker-compose ps

# Verify MongoDB is running
docker-compose logs mongodb

# Check connection string in backend
# Should be: mongodb://admin:password@mongodb:27017/nsu_cpc_db?authSource=admin
```

### Port Already in Use
If port 3000, 5000, or 27017 are already in use:

Edit `docker-compose.yml`:
```yaml
services:
  backend:
    ports:
      - "5001:5000"  # Change left number to available port
  frontend:
    ports:
      - "3001:3000"  # Change left number to available port
  mongodb:
    ports:
      - "27018:27017"  # Change left number to available port
```

### Container Keeps Restarting
```bash
# Check the logs
docker-compose logs backend

# Common issues:
# - Missing environment variables
# - MongoDB not ready yet
# - Port conflicts
```

## Production Deployment

For production deployment, consider:

1. **Use Docker Hub or Container Registry**
   ```bash
   docker build -t yourusername/nsu-cpc-backend:latest ./backend
   docker push yourusername/nsu-cpc-backend:latest
   ```

2. **Production Environment File**
   Create `.env.production`:
   ```env
   NODE_ENV=production
   MONGO_ROOT_PASSWORD=very_strong_password_here
   JWT_SECRET=very_secure_jwt_secret_here
   ```

3. **Use Production Docker Compose**
   Create `docker-compose.prod.yml` with:
   - Removed volumes (no live reload)
   - Proper restart policies
   - Resource limits
   - Health checks

4. **Database Backup**
   ```bash
   docker-compose exec mongodb mongodump --out /backup
   ```

## Useful Docker Compose Commands

```bash
# Check service status
docker-compose ps

# View resource usage
docker stats

# Restart services
docker-compose restart

# Pause services
docker-compose pause

# Unpause services
docker-compose unpause

# Remove unused images/volumes
docker image prune
docker volume prune
```

## Next Steps

1. ✅ Copy `.env.example` to `.env`
2. ✅ Fill in your configuration values in `.env`
3. ✅ Run `docker-compose build`
4. ✅ Run `docker-compose up -d`
5. ✅ Access http://localhost:3000
6. ✅ Check logs if anything doesn't work

## Additional Resources
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Need Help?** Check the logs with `docker-compose logs` to diagnose issues.
