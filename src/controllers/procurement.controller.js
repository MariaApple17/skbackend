import * as procurementService from '../services/procurement.service.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

/* ================= RESPONSE HELPERS ================= */

const sendSuccess = (res, status = 200, payload = {}) =>
  res.status(status).json({
    success: true,
    ...payload,
  });

const sendError = (res, error) => {
  console.error('PROCUREMENT ERROR:', error);

  return res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    code: error.code || 'INTERNAL_SERVER_ERROR',
    details: error.details ?? null,
  });
};

const parseId = (value, name = 'id') => {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    throw {
      statusCode: 400,
      message: `Invalid ${name}`,
      code: 'INVALID_ID',
    };
  }
  return n;
};

/* ================= CREATE REQUEST ================= */

export const createRequest = async (req, res) => {
  try {
    const data = await procurementService.createRequest(
      req.body,
      req.user.id,
      req.activeFiscalYearId
    );

    return sendSuccess(res, 201, {
      message: 'Procurement request created successfully',
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= UPDATE REQUEST ================= */

export const updateRequest = async (req, res) => {
  try {
    const id = parseId(req.params.id, 'requestId');

    const data = await procurementService.updateRequest(
      id,
      req.body
    );

    return sendSuccess(res, 200, {
      message: 'Procurement request updated successfully',
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= SUBMIT REQUEST ================= */

export const submitRequest = async (req, res) => {
  try {
    const id = parseId(req.params.id, 'requestId');

    const data = await procurementService.submitRequest(id);

    return sendSuccess(res, 200, {
      message: 'Procurement request submitted',
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= APPROVE REQUEST ================= */

export const approveRequest = async (req, res) => {
  try {
    const id = parseId(req.params.id, 'requestId');

    const data = await procurementService.approveRequest(
      id,
      req.user.id,
      req.body?.remarks ?? null
    );

    return sendSuccess(res, 200, {
      message: 'Procurement request approved',
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= REJECT REQUEST ================= */

export const rejectRequest = async (req, res) => {
  try {
    const id = parseId(req.params.id, 'requestId');

    const data = await procurementService.rejectRequest(
      id,
      req.user.id,
      req.body?.remarks ?? null
    );

    return sendSuccess(res, 200, {
      message: 'Procurement request rejected',
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= MARK AS PURCHASED ================= */

export const markPurchased = async (req, res) => {
  try {
    const id = parseId(req.params.id, 'requestId');

    const data = await procurementService.markPurchased(id);

    return sendSuccess(res, 200, {
      message: 'Procurement request marked as purchased',
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= COMPLETE REQUEST ================= */

export const completeRequest = async (req, res) => {
  try {
    const id = parseId(req.params.id, 'requestId');

    const data = await procurementService.completeRequest(id);

    return sendSuccess(res, 200, {
      message: 'Procurement request completed',
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= UPLOAD PROOF ================= */

export const uploadProof = async (req, res) => {
  try {
    if (!req.file) {
      throw {
        statusCode: 400,
        message: 'File is required',
        code: 'FILE_REQUIRED',
      };
    }

    const requestId = parseId(req.body.requestId, 'requestId');

    if (!req.body.type?.trim()) {
      throw {
        statusCode: 400,
        message: 'Proof type is required',
        code: 'TYPE_REQUIRED',
      };
    }

    const fileUrl = await uploadToCloudinary(
      req.file,
      process.env.CLOUDINARY_PROCUREMENT_FOLDER,
      'auto'
    );

    const payload = {
      requestId,
      type: req.body.type.trim(),
      description: req.body.description?.trim() || null,
      fileUrl,
    };

    const data = await procurementService.uploadProof(
      payload,
      req.user.id
    );

    return sendSuccess(res, 201, {
      message: 'Proof uploaded successfully',
      data,
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= GET ALL REQUESTS ================= */

export const getAllRequests = async (req, res) => {
  try {
    const result = await procurementService.getAllRequests({
      q: typeof req.query.q === 'string' ? req.query.q : '',
      status:
        typeof req.query.status === 'string'
          ? req.query.status
          : undefined,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      fiscalYearId: req.activeFiscalYearId,
    });

    return sendSuccess(res, 200, result);
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= DELETE REQUEST ================= */

export const deleteRequest = async (req, res) => {
  try {
    const id = parseId(req.params.id, 'requestId');

    await procurementService.deleteRequest(id);

    return sendSuccess(res, 200, {
      message: 'Procurement request deleted successfully',
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/* ================= GET DRAFT REQUEST ================= */

export const getDraftRequest = async (req, res) => {
  try {
    const id = parseId(req.params.id, 'requestId');

    const data = await procurementService.getDraftRequestById(id);

    return sendSuccess(res, 200, { data });
  } catch (error) {
    return sendError(res, error);
  }
};
