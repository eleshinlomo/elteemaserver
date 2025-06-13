import multer from 'multer'
import path from 'path'
import fs from 'fs';
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create absolute path to upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    
    // Ensure directory exists
    fs.mkdirSync(uploadDir, { recursive: true });
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

// File filter to only accept images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed!'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit per file
  }
})

export const productImagesUpload = upload.array('images', 4) // Max 4 images

export default upload