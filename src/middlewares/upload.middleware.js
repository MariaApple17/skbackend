import fs from 'fs';
import multer from 'multer';
import path from 'path';

/* ================= BASE DIR ================= */

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

/* ================= FILTER ================= */

const imageOnly = (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(
      new Error('Only image files are allowed'),
      false
    );
  }
  cb(null, true);
};

/* ================= BASE UPLOAD ================= */

const baseUpload = multer({
  storage,
  fileFilter: imageOnly,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

/* ================= EXPORTS ================= */

// keep explicit intent
export const uploadProgramImage = baseUpload;
export const uploadSkOfficialImage = baseUpload;

// optional default
export default baseUpload;
