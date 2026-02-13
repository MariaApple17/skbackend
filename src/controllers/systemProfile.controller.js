import * as systemProfileService from '../services/systemProfile.service.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

const SYSTEM_PROFILE_FOLDER =
  process.env.CLOUDINARY_SYSTEM_PROFILE_FOLDER || 'system-profile';

/* ================= GET ================= */
export const get = async (req, res) => {
  try {
    const data = await systemProfileService.getSystemProfile();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to fetch system profile',
    });
  }
};

/* ================= UPDATE ================= */
export const update = async (req, res) => {
  try {
    const { systemName, systemDescription, location } = req.body;

    let logoUrl;

    if (req.file) {
      logoUrl = await uploadToCloudinary(
        req.file,
        SYSTEM_PROFILE_FOLDER,
        'image'
      );
    }

    const data = await systemProfileService.updateSystemProfile({
      systemName,
      systemDescription,
      location,
      ...(logoUrl && { logoUrl }),
    });

    return res.status(200).json({
      success: true,
      message: 'System profile updated successfully',
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to update system profile',
    });
  }
};
