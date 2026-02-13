import { db } from '../config/db.config.js';

/* ================= ERROR HELPER ================= */
class AppError extends Error {
  constructor(message, statusCode = 400, code = 'BAD_REQUEST', details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

/* ================= HELPERS ================= */
const toNumber = (v, name = 'id') => {
  const n = Number(v);
  if (!Number.isFinite(n)) {
    throw new AppError(`Invalid ${name}`, 400, 'INVALID_NUMBER');
  }
  return n;
};

const normalizeItems = (items = []) => {
  if (!Array.isArray(items)) return [];

  return items
    .filter(i => i && typeof i === 'object')
    .map(i => {
      const quantity = Math.max(1, Number(i.quantity) || 1);
      const unitCost = Math.max(0, Number(i.unitCost ?? i.unitPrice) || 0);

      return {
        name: i.name?.trim(),
        description: i.description ?? null,
        quantity,
        unitCost,
        totalPrice: quantity * unitCost,
      };
    })
    .filter(i => i.name);
};

const VALID_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'APPROVED',
  'REJECTED',
  'PURCHASED',
  'COMPLETED',
];

/* ================= CREATE REQUEST ================= */
export const createRequest = async (data, userId) => {
  const allocationId = toNumber(data.allocationId, 'allocationId');
  const items = normalizeItems(data.items);

  if (!items.length) {
    throw new AppError(
      'At least one procurement item is required',
      400,
      'EMPTY_ITEMS'
    );
  }

  const computedAmount = items.reduce(
    (sum, i) => sum + i.totalPrice,
    0
  );

  const amount =
    data.amount != null
      ? toNumber(data.amount, 'amount')
      : computedAmount;

  if (amount <= 0) {
    throw new AppError(
      'Total amount must be greater than zero',
      400,
      'INVALID_AMOUNT'
    );
  }

  return db.procurementRequest.create({
    data: {
      title: data.title?.trim(),
      description: data.description ?? null,
      amount,
      allocationId,
      vendorId: data.vendorId
        ? toNumber(data.vendorId, 'vendorId')
        : null,
      createdById: toNumber(userId, 'userId'),
      items: { create: items },
    },
    include: { items: true, allocation: true },
  });
};

/* ================= UPDATE REQUEST ================= */
export const updateRequest = async (id, data) => {
  id = toNumber(id, 'requestId');

  const request = await db.procurementRequest.findFirst({
    where: { id, deletedAt: null },
  });

  if (!request) {
    throw new AppError('Request not found', 404, 'NOT_FOUND');
  }

  if (request.status !== 'DRAFT') {
    throw new AppError(
      'Only draft requests can be updated',
      400,
      'INVALID_STATUS_TRANSITION',
      { currentStatus: request.status }
    );
  }

  return db.procurementRequest.update({
    where: { id },
    data: {
      title: data.title?.trim(),
      description: data.description ?? null,
      amount: toNumber(data.amount, 'amount'),
    },
  });
};

/* ================= SUBMIT REQUEST ================= */
export const submitRequest = async (id) => {
  id = toNumber(id, 'requestId');

  const request = await db.procurementRequest.findFirst({
    where: { id, deletedAt: null },
    include: { items: true },
  });

  if (!request) {
    throw new AppError('Request not found', 404, 'NOT_FOUND');
  }

  if (request.status !== 'DRAFT') {
    throw new AppError(
      'Only draft requests can be submitted',
      400,
      'INVALID_STATUS_TRANSITION',
      { currentStatus: request.status }
    );
  }

  if (!request.items.length) {
    throw new AppError(
      'Cannot submit request without items',
      400,
      'EMPTY_ITEMS'
    );
  }

  return db.procurementRequest.update({
    where: { id },
    data: { status: 'SUBMITTED' },
  });
};

/* ================= APPROVE REQUEST ================= */
export const approveRequest = async (requestId, approverId, remarks) => {
  requestId = toNumber(requestId, 'requestId');
  approverId = toNumber(approverId, 'approverId');

  return db.$transaction(async tx => {
    const request = await tx.procurementRequest.findFirst({
      where: { id: requestId, deletedAt: null },
      include: { allocation: true },
    });

    if (!request) {
      throw new AppError('Request not found', 404, 'NOT_FOUND');
    }

    if (request.status !== 'SUBMITTED') {
      throw new AppError(
        'Only submitted requests can be approved',
        400,
        'INVALID_STATUS_TRANSITION',
        { currentStatus: request.status }
      );
    }

    const remaining =
      request.allocation.allocatedAmount -
      request.allocation.usedAmount;

    if (request.amount > remaining) {
      throw new AppError(
        'Insufficient budget allocation',
        400,
        'INSUFFICIENT_BUDGET',
        {
          requested: request.amount,
          remaining,
        }
      );
    }

    await tx.approval.create({
      data: {
        requestId,
        approverId,
        remarks: remarks?.trim() || null,
        status: 'APPROVED',
      },
    });

    return tx.procurementRequest.update({
      where: { id: requestId },
      data: { status: 'APPROVED' },
    });
  });
};

/* ================= REJECT REQUEST ================= */
export const rejectRequest = async (requestId, approverId, remarks) => {
  requestId = toNumber(requestId, 'requestId');
  approverId = toNumber(approverId, 'approverId');

  if (!remarks || !remarks.trim()) {
    throw new AppError(
      'Rejection remarks are required',
      400,
      'REMARKS_REQUIRED'
    );
  }

  return db.$transaction(async tx => {
    const request = await tx.procurementRequest.findFirst({
      where: { id: requestId, deletedAt: null },
    });

    if (!request) {
      throw new AppError('Request not found', 404, 'NOT_FOUND');
    }

    if (request.status !== 'SUBMITTED') {
      throw new AppError(
        'Only submitted requests can be rejected',
        400,
        'INVALID_STATUS_TRANSITION',
        { currentStatus: request.status }
      );
    }

    await tx.approval.create({
      data: {
        requestId,
        approverId,
        remarks: remarks.trim(),
        status: 'REJECTED',
      },
    });

    return tx.procurementRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });
  });
};

/* ================= MARK AS PURCHASED ================= */
export const markPurchased = async requestId => {
  requestId = toNumber(requestId, 'requestId');

  const request = await db.procurementRequest.findFirst({
    where: { id: requestId, deletedAt: null },
  });

  if (!request) {
    throw new AppError('Request not found', 404, 'NOT_FOUND');
  }

  if (request.status !== 'APPROVED') {
    throw new AppError(
      'Request must be approved before purchase',
      400,
      'INVALID_STATUS_TRANSITION',
      { currentStatus: request.status }
    );
  }

  return db.procurementRequest.update({
    where: { id: requestId },
    data: { status: 'PURCHASED' },
  });
};

/* ================= COMPLETE REQUEST ================= */
export const completeRequest = async requestId => {
  requestId = toNumber(requestId, 'requestId');

  return db.$transaction(async tx => {
    const request = await tx.procurementRequest.findFirst({
      where: { id: requestId, deletedAt: null },
      include: { allocation: true },
    });

    if (!request) {
      throw new AppError('Request not found', 404, 'NOT_FOUND');
    }

    if (request.status !== 'PURCHASED') {
      throw new AppError(
        'Only purchased requests can be completed',
        400,
        'INVALID_STATUS_TRANSITION',
        { currentStatus: request.status }
      );
    }

    await tx.budgetAllocation.update({
      where: { id: request.allocationId },
      data: {
        usedAmount: { increment: request.amount },
      },
    });

    return tx.procurementRequest.update({
      where: { id: requestId },
      data: { status: 'COMPLETED' },
    });
  });
};

/* ================= UPLOAD PROOF ================= */
export const uploadProof = async (data, userId) => {
  const requestId = toNumber(data.requestId, 'requestId');

  const request = await db.procurementRequest.findFirst({
    where: { id: requestId, deletedAt: null },
  });

  if (!request) {
    throw new AppError('Request not found', 404, 'NOT_FOUND');
  }

  return db.procurementProof.create({
    data: {
      requestId,
      type: data.type,
      fileUrl: data.fileUrl,
      description: data.description ?? null,
      uploadedById: toNumber(userId, 'userId'),
    },
  });
};

/* ================= GET ALL REQUESTS ================= */
export const getAllRequests = async ({
  q = '',
  status,
  page = 1,
  limit = 10,
}) => {
  page = toNumber(page, 'page');
  limit = toNumber(limit, 'limit');

  if (status && !VALID_STATUSES.includes(status)) {
    throw new AppError('Invalid request status', 400, 'INVALID_STATUS');
  }

  const where = {
    deletedAt: null,
    ...(q && { title: { contains: q } }),
    ...(status && { status }),
  };

  const skip = (page - 1) * limit;

  const [rows, total] = await Promise.all([
    db.procurementRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        proofs: true,
        vendor: true,
        allocation: true,
        createdBy: true,
        approvals: {
          orderBy: { createdAt: 'desc' }, // 👈 latest first
          select: {
            id: true,
            status: true,
            remarks: true,
            approverId: true,
            createdAt: true,
          },
        },
      },
    }),
    db.procurementRequest.count({ where }),
  ]);

  // 👇 expose latest remarks directly (UX-friendly)
  const data = rows.map(r => ({
    ...r,
    latestRemark: r.approvals[0]?.remarks ?? null,
    latestDecision: r.approvals[0]?.status ?? null,
  }));

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};


/* ================= SOFT DELETE ================= */
export const deleteRequest = async id => {
  id = toNumber(id, 'requestId');

  const request = await db.procurementRequest.findFirst({
    where: { id, deletedAt: null },
  });

  if (!request) {
    throw new AppError('Request not found', 404, 'NOT_FOUND');
  }

  if (request.status !== 'DRAFT') {
    throw new AppError(
      'Only draft requests can be deleted',
      400,
      'INVALID_STATUS_TRANSITION',
      { currentStatus: request.status }
    );
  }

  return db.procurementRequest.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

/* ================= GET DRAFT REQUEST BY ID ================= */
export const getDraftRequestById = async id => {
  id = toNumber(id, 'requestId');

  const request = await db.procurementRequest.findFirst({
    where: {
      id,
      status: 'DRAFT',
      deletedAt: null,
    },
    include: {
      items: true,
      allocation: true,
      vendor: true,
      createdBy: true,
    },
  });

  if (!request) {
    throw new AppError(
      'Draft procurement request not found',
      404,
      'NOT_FOUND'
    );
  }

  return request;
};
