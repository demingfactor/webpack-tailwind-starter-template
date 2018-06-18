#!/usr/bin/env bash
set -o pipefail # If you pipe one command into another, fail the whole lot if any fail
set -e # fail if there are any errors in the script
set -u # fail if you use an uninitialized variable

# Warn about the dire consequences of this action
read -r -p "THIS WILL WIPE OUT ANY UNCOMMITTED CHANGES - control-c to stop" yn

HEAD=$(git rev-parse HEAD) # Save where you're up to
git reset --hard "$HEAD" # Avoid using uncommitted changes to build the site
BUILD_DIR=$(mktemp -d) # Create a directory to build into (your webpack config or similar will need to read this env var)
GIT_WORK_TREE="$BUILD_DIR" # Tell git where to find the built site
export BUILD_DIR # Make BUILD_DIR available to your build script
export GIT_WORK_TREE # Make GIT_WORK_TREE available to git

npm run build # Replace this with your build script

git add -A "$BUILD_DIR" # Add your changes
git commit -m "Build for $HEAD" # Commit your changes
git push -f origin HEAD:gh-pages # Push your built site to gh-pages

git reset --hard "$HEAD" # Return to the original commit
