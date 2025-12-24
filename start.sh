#!/bin/bash

# Function to kill background processes on exit
cleanup() {
    echo "Stopping PocketBase..."
    kill $PB_PID
    exit
}

trap cleanup SIGINT SIGTERM

echo "Starting PocketBase Backend..."
./backend/pocketbase serve --http=127.0.0.1:8090 &
PB_PID=$!

echo "Waiting for Backend to initialize..."
sleep 2

echo "Starting Quasar Frontend..."
cd frontend
npx quasar dev
