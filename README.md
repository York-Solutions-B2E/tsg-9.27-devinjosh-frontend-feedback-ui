# Frontend Feedback UI
A simple frontend for sending and recieveing feedback events

## Requirements
 - Node.js 20+
 - Docker and Docker Compose

## Running in Developement
```bash
# install dependencies
npm install

# Start the vite dev server
npm run dev
```

## Running in Prod
To run the front end for production you must run the **compose** file located in the **top level directory** of this project.

You must include the app profile to run all services
```bash
# Run all services
docker compose --profile app up -d
```
