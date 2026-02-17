import fs from 'fs';

import cloudinary from '../config/cloudinary.config.js';

const ROOT = process.env.CLOUDINARY_ROOT_FOLDER || 'sk_system';

/* ======================================================
   Generic Upload Helper
====================================================== */
export const uploadToCloudinary = async (
  file,
  subFolder,
  resourceType = 'image'
) => {
  const folder = `${ROOT}/${subFolder}`;

  const result = await cloudinary.uploader.upload(file.path, {
    folder,
    resource_type: resourceType,
  });

  // always cleanup temp file
  if (file?.path && fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }

  return result.secure_url;
};
