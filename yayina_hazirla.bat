
# Build Frontend
echo "Building Frontend..."
npm run build

# Create server/public directory if not exists
if not exist "server\public" mkdir "server\public"

# Clear old files
del /q "server\public\*"

# Move Files
echo "Moving files to server..."
xcopy /E /Y "dist\*" "server\public\"

echo "Hazır! Artık sadece 'node server/index.js' komutuyla tüm siteyi çalıştırabilirsiniz."
