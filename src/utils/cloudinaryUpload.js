import fs from 'fs';
import cloudinary from '../config/cloudinary.config.js';

const ROOT =
  process.env.CLOUDINARY_ROOT_FOLDER || 'sk_systems';

export const uploadToCloudinary = async (
  file,
  subFolder,
  resourceType = 'auto'
) => {
  const folder = `${ROOT}/${subFolder}`;

  try {
    const result = await cloudinary.uploader.upload(
      file.path,
      {
        folder,
        resource_type: resourceType, // auto supports PDF + images
      }
    );

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw error;
  } finally {
    // Always delete temp file
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
};
