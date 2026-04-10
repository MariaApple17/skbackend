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

/* ================= FILTERS ================= */

const imageOnly = (_req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(
      new Error('Only image files are allowed'),
      false
    );
  }
  cb(null, true);
};

const PROOF_FILE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'application/pdf',
]);

const proofFileFilter = (_req, file, cb) => {
  if (!PROOF_FILE_TYPES.has(file.mimetype)) {
    return cb(
      new Error('Only JPG, PNG, or PDF files are allowed'),
      false
    );
  }

  cb(null, true);
};

/* ================= UPLOAD FACTORY ================= */

const createUpload = (fileFilter, fileSize) =>
  multer({
    storage,
    fileFilter,
    limits: {
      fileSize,
    },
  });

/* ================= UPLOAD INSTANCES ================= */

const imageUpload = createUpload(
  imageOnly,
  2 * 1024 * 1024
);

export const uploadProofFile = createUpload(
  proofFileFilter,
  5 * 1024 * 1024
);

/* ================= EXPORTS ================= */

// keep explicit intent
export const uploadProgramImage = imageUpload;
export const uploadSkOfficialImage = imageUpload;

// optional default
export default imageUpload;
