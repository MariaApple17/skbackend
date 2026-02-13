import * as ProgramService from '../services/program.service.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

/* ======================================================
   CREATE PROGRAM (WITH DOCUMENT IMAGES)
====================================================== */
export const createProgram = async (req, res) => {
  try {
    // ✅ handle multiple documentation images
    const documents = [];

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(
          file,
          process.env.CLOUDINARY_PROGRAMS_FOLDER,
          'image'
        );

        documents.push({
          imageUrl,
          title: file.originalname,
          uploadedBy: req.user?.fullName ?? null,
        });
      }
    }

    const program = await ProgramService.createProgramService({
      code: req.body.code,
      name: req.body.name,
      description: req.body.description,
      committeeInCharge: req.body.committeeInCharge,
      beneficiaries: req.body.beneficiaries,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      isActive:
        req.body.isActive !== undefined
          ? req.body.isActive === 'true'
          : true,
      documents,
    });

    return res.status(201).json({
      success: true,
      data: program,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   GET ALL PROGRAMS
====================================================== */
export const getPrograms = async (req, res) => {
  try {
    const result =
      await ProgramService.getAllProgramsService(req.query);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   GET PROGRAM BY ID
====================================================== */
export const getProgramById = async (req, res) => {
  try {
    const program =
      await ProgramService.getProgramByIdService(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   UPDATE PROGRAM (NO IMAGE REPLACE — METADATA ONLY)
====================================================== */
export const updateProgram = async (req, res) => {
  try {
    const data = {};

    const parseBoolean = (value) => {
      if (value === true || value === 'true') return true;
      if (value === false || value === 'false') return false;
      return undefined;
    };

    const parseDate = (value) => {
      if (value === undefined) return undefined;
      if (value === null || value === '') return null;

      const d = new Date(value);
      if (Number.isNaN(d.getTime())) {
        throw new Error(`Invalid date format: ${value}`);
      }
      return d;
    };

    if (typeof req.body.code === 'string') data.code = req.body.code;
    if (typeof req.body.name === 'string') data.name = req.body.name;
    if (typeof req.body.description === 'string')
      data.description = req.body.description;
    if (typeof req.body.committeeInCharge === 'string')
      data.committeeInCharge = req.body.committeeInCharge;
    if (typeof req.body.beneficiaries === 'string')
      data.beneficiaries = req.body.beneficiaries;

    const isActive = parseBoolean(req.body.isActive);
    if (isActive !== undefined) data.isActive = isActive;

    const startDate = parseDate(req.body.startDate);
    if (startDate !== undefined) data.startDate = startDate;

    const endDate = parseDate(req.body.endDate);
    if (endDate !== undefined) data.endDate = endDate;

    if (
      data.startDate &&
      data.endDate &&
      data.startDate > data.endDate
    ) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be after end date',
      });
    }

    const program =
      await ProgramService.updateProgramService(
        req.params.id,
        data
      );

    return res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   ADD PROGRAM DOCUMENT IMAGES
====================================================== */
export const addProgramDocuments = async (req, res) => {
  try {
    console.log('addProgramDocuments called');
    console.log('req.files:', req.files);
    console.log('req.params.id:', req.params.id);

    // Validate files exist
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded. Please select at least one image.',
      });
    }

    const documents = [];

    for (const file of req.files) {
      console.log('Uploading file:', file.originalname);
      
      const imageUrl = await uploadToCloudinary(
        file,
        process.env.CLOUDINARY_PROGRAMS_FOLDER,
        'image'
      );

      documents.push({
        imageUrl,
        title: file.originalname,
        uploadedBy: req.user?.fullName ?? null,
      });
    }

    console.log('Documents prepared:', documents.length);

    const program =
      await ProgramService.addProgramDocumentsService(
        req.params.id,
        documents
      );

    return res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    console.error('addProgramDocuments error:', error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   TOGGLE STATUS
====================================================== */
export const toggleProgramStatus = async (req, res) => {
  try {
    const program =
      await ProgramService.toggleProgramStatusService(
        req.params.id
      );

    return res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ======================================================
   DELETE (SOFT)
====================================================== */
export const deleteProgram = async (req, res) => {
  try {
    await ProgramService.deleteProgramService(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: 'Program deleted successfully',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};