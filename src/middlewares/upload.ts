import multer from 'multer';
import path from 'path';

// File storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be saved in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

// File filter for allowed types
const fileFilter = (req: any, file: any, cb: any) => {
  const filetypes = /jpeg|jpg|png|mp4|mov|avi|gif|webp|svg|mp3|wav|ogg|flac|aac/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png, gif, webp, svg) and videos (mp4, mov, avi) and audios (mp3, wav, ogg, flac, aac) are allowed!'), false);
  }
};

// Multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limit file size to 100MB
});

export default upload;