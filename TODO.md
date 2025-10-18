# TODO: Implement File Upload for Images and Videos in Poste

## Backend Changes
- [x] Install multer dependency
- [x] Update posteRoutes to handle multipart/form-data for file uploads
- [x] Modify posteController.createPoste to process uploaded files
- [x] Update posteService.createPoste to save file paths in database

## Frontend Changes
- [x] Update publication-post.component.ts to handle file selection and FormData
- [x] Modify poste.service.ts to send FormData instead of JSON
- [x] Update publication-post.component.html to bind file inputs properly

## Testing
- [ ] Test image upload and verify file is saved in uploads folder
- [ ] Test video upload and verify file is saved in uploads folder
- [ ] Verify that lienImage and lienVideo are stored correctly in Poste schema
