#!/bin/bash
clear

# 1. Configuration
OUTPUT_FILE="project-backup.zip"
# WSL paths to your keys
CERTS_IOS_PATH="/mnt/d/dev/sweetrush/_keys/apple/2025"
CERTS_ANDROID_PATH="/mnt/d/dev/sweetrush/_keys/google"

# 2. Check if 'zip' is installed
if ! command -v zip &> /dev/null; then
    echo "Error: 'zip' is not installed. Please run 'sudo apt install zip' first."
    exit 1
fi

# 3. Clean up existing zip if it exists
if [ -f "$OUTPUT_FILE" ]; then
    echo "🗑️  Found existing $OUTPUT_FILE. Deleting it..."
    rm "$OUTPUT_FILE"
fi

# 4. Prepare the certs folders
# We check if the source paths exist first
if [ -d "$CERTS_IOS_PATH" ] && [ -d "$CERTS_ANDROID_PATH" ]; then
    echo "📂 Creating folder structure..."
    # Explicitly create the destination subfolders
    mkdir -p ./certs/ios
    mkdir -p ./certs/google

    echo "📂 Copying certificates from D: drive..."
    # Copy contents ( using /. ) into the created folders
    cp -r "$CERTS_IOS_PATH/." ./certs/ios/
    cp -r "$CERTS_ANDROID_PATH/." ./certs/google/
else
    echo "⚠️  WARNING: Could not find certificate source folders."
    echo "   Checked: $CERTS_IOS_PATH"
    echo "   Checked: $CERTS_ANDROID_PATH"
    exit 1
fi

echo "📦 Zipping current folder into $OUTPUT_FILE..."

# 5. Run the zip command
zip -r "$OUTPUT_FILE" . \
    -x "node_modules/*" \
    -x "*/node_modules/*" \
    -x ".git/*" \
    -x "dist/*" \
    -x "$OUTPUT_FILE"

# 6. Cleanup (Remove the temporary certs folder)
echo "🧹 Cleaning up temporary 'certs' folder..."
rm -rf ./certs

# 7. Success message
if [ $? -eq 0 ]; then
    echo "-----------------------------------"
    echo "✅ Success! Created: $OUTPUT_FILE"
else
    echo "❌ An error occurred during zipping."
fi