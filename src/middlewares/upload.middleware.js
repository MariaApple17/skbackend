import fs from 'fs';
import multer from 'multer';
import path from 'path';

/* ================= TEMP DIRECTORY ================= */

const TMP_DIR = 'uploads/tmp';

if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

/* ================= STORAGE ================= */

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, TMP_DIR);
  },
  filename: (_req, file, cb) => {
    const unique =
      Date.now() + '-' + Math.round(Math.random() * 1e9);

    cb(null, unique + path.extname(file.originalname));
  },
});

/* ================= FILE FILTER ================= */

const fileFilter = (_req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error('Only JPG, PNG, and PDF files are allowed'),
      false
    );
  }

  cb(null, true);
};

/* ================= MULTER CONFIG ================= */

const baseUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/* ================= EXPORTS ================= */

// For procurement proof
export const uploadProofFile = baseUpload;

// For program image (image only)
export const uploadProgramImage = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 3 * 1024 * 1024 },
});

// For SK official image
export const uploadSkOfficialImage = uploadProgramImage;

// Default
export default baseUpload;
