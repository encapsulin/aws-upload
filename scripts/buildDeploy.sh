cd ../file-upload-react/
npm run build
aws s3 sync ./build/ s3://encaps.click/upload/ --delete