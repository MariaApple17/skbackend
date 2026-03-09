import * as systemProfileService from '../services/systemProfile.service.js'
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js'

const SYSTEM_PROFILE_FOLDER =
  process.env.CLOUDINARY_SYSTEM_PROFILE_FOLDER || 'system-profile'

/* =====================================================
   GET SYSTEM PROFILE
===================================================== */
export const get = async (req, res) => {
  try {

    const data = await systemProfileService.getSystemProfile()

    return res.status(200).json({
      success: true,
      data
    })

  } catch (error) {

    console.error('GET SYSTEM PROFILE ERROR:', error)

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to fetch system profile'
    })

  }
}


/* =====================================================
   UPDATE SYSTEM PROFILE
===================================================== */
export const update = async (req, res) => {
  try {

    const { systemName, systemDescription, location } = req.body

    const payload = {}

    if (systemName !== undefined) {
      payload.systemName = systemName
    }

    if (systemDescription !== undefined) {
      payload.systemDescription = systemDescription
    }

    if (location !== undefined) {
      payload.location = location
    }

    /* ================= LOGO UPLOAD ================= */

    if (req.file) {

      const logoUrl = await uploadToCloudinary(
        req.file,
        SYSTEM_PROFILE_FOLDER,
        'image'
      )

      payload.logoUrl = logoUrl
    }

    /* ================= UPDATE ================= */

    const data = await systemProfileService.updateSystemProfile(payload)

    return res.status(200).json({
      success: true,
      message: 'System profile updated successfully',
      data
    })

  } catch (error) {

    console.error('UPDATE SYSTEM PROFILE ERROR:', error)

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update system profile'
    })

  }
}