#!/bin/bash

# Install inotify-tools jika belum ada
if ! command -v inotifywait &> /dev/null; then
    echo "Installing inotify-tools..."
    sudo pacman -S inotify-tools
fi

echo "Starting Go server with auto-reload..."
echo "Press Ctrl+C to stop"

# Kill existing process
pkill -f "go run main.go"

# Start the server in background
go run main.go &
PID=$!

# Watch for file changes
while inotifywait -r -e modify,create,delete --exclude="tmp|\.git" .; do
    echo "File changed, restarting server..."
    kill $PID 2>/dev/null
    go run main.go &
    PID=$!
done
