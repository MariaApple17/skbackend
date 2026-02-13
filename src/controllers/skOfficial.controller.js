import * as service from '../services/skOfficial.service.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

/* ================= ERROR HELPER ================= */
const badRequest = (res, error, fallback) => {
  return res.status(error?.statusCode || 400).json({
    success: false,
    message: error?.message || fallback,
  });
};

/* ======================================================
   CREATE
====================================================== */
export const create = async (req, res) => {
  try {
    const profileImageUrl = req.file
      ? await uploadToCloudinary(
          req.file,
          process.env.CLOUDINARY_SK_OFFICIALS_FOLDER,
          'image'
        )
      : null;

    const official = await service.createSkOfficial({
      fiscalYearId: Number(req.body.fiscalYearId),
      position: req.body.position,
      fullName: req.body.fullName,
      responsibility: req.body.responsibility || null,
      birthDate: req.body.birthDate
        ? new Date(req.body.birthDate)
        : null,
      email: req.body.email || null,
      gender: req.body.gender,
      profileImageUrl,
      isActive:
        req.body.isActive !== undefined
          ? req.body.isActive === 'true'
          : true,
    });

    return res.status(201).json({
      success: true,
      message: 'SK Official created successfully',
      data: official,
    });
  } catch (error) {
    console.error('CREATE SK OFFICIAL ERROR:', error);
    return badRequest(res, error, 'Failed to create SK Official');
  }
};

/* ======================================================
   LIST
====================================================== */
export const list = async (req, res) => {
  try {
    const result = await service.getSkOfficials({
      fiscalYearId: Number(req.params.fiscalYearId),
      page: req.query.page,
      limit: req.query.limit,
      position: req.query.position,
      fullName: req.query.fullName,
      gender: req.query.gender,
      isActive: req.query.isActive,
    });

    return res.json({
      success: true,
      message: 'SK Officials retrieved successfully',
      ...result,
    });
  } catch (error) {
    return badRequest(res, error, 'Failed to retrieve SK Officials');
  }
};

/* ======================================================
   GET BY ID
====================================================== */
export const getById = async (req, res) => {
  try {
    const official = await service.getSkOfficialById(
      Number(req.params.id)
    );

    if (!official) {
      return res.status(404).json({
        success: false,
        message: 'SK Official not found',
      });
    }

    return res.json({
      success: true,
      message: 'SK Official retrieved successfully',
      data: official,
    });
  } catch (error) {
    return badRequest(res, error, 'Failed to retrieve SK Official');
  }
};

/* ======================================================
   UPDATE
====================================================== */
export const update = async (req, res) => {
  try {
    const data = {};

    if (req.body.position !== undefined)
      data.position = req.body.position;

    if (req.body.fullName !== undefined)
      data.fullName = req.body.fullName;

    if (req.body.responsibility !== undefined)
      data.responsibility = req.body.responsibility || null;

    if (req.body.birthDate !== undefined)
      data.birthDate = new Date(req.body.birthDate);

    if (req.body.email !== undefined)
      data.email = req.body.email || null;

    if (req.body.gender !== undefined)
      data.gender = req.body.gender;

    if (req.body.isActive !== undefined)
      data.isActive = req.body.isActive === 'true';

    // ✅ upload only when file exists
    if (req.file) {
      data.profileImageUrl = await uploadToCloudinary(
        req.file,
        process.env.CLOUDINARY_SK_OFFICIALS_FOLDER,
        'image'
      );
    }

    const official = await service.updateSkOfficial(
      Number(req.params.id),
      data
    );

    return res.json({
      success: true,
      message: 'SK Official updated successfully',
      data: official,
    });
  } catch (error) {
    console.error('UPDATE SK OFFICIAL ERROR:', error);
    return badRequest(res, error, 'Failed to update SK Official');
  }
};

/* ======================================================
   DELETE
====================================================== */
export const remove = async (req, res) => {
  try {
    await service.deleteSkOfficial(Number(req.params.id));

    return res.json({
      success: true,
      message: 'SK Official deleted successfully',
    });
  } catch (error) {
    return badRequest(res, error, 'Failed to delete SK Official');
  }
};

/* ======================================================
   TOGGLE STATUS
====================================================== */
export const toggleStatus = async (req, res) => {
  try {
    const isActive =
      req.body.isActive === true ||
      req.body.isActive === 'true';

    const official = await service.toggleSkOfficialStatus(
      Number(req.params.id),
      isActive
    );

    return res.json({
      success: true,
      message: `SK Official ${
        isActive ? 'activated' : 'deactivated'
      } successfully`,
      data: official,
    });
  } catch (error) {
    return badRequest(
      res,
      error,
      'Failed to update SK Official status'
    );
  }
};
