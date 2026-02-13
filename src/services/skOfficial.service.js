import { db } from '../config/db.config.js';

/* ================= HELPERS ================= */

const isPositiveInt = (v) =>
  Number.isInteger(v) && v > 0;

const isValidGender = (v) =>
  ['MALE', 'FEMALE', 'OTHER'].includes(v);

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const parseBoolean = (v) => {
  if (v === true || v === false) return v;
  if (v === 'true') return true;
  if (v === 'false') return false;
  return undefined;
};

const assert = (condition, message) => {
  if (!condition) {
    const err = new Error(message);
    err.statusCode = 400;
    throw err;
  }
};

/* ================= CREATE ================= */

export const createSkOfficial = (data) => {
  const {
    fiscalYearId,
    position,
    fullName,
    responsibility,
    birthDate,
    email,
    gender,
    isActive,
    profileImageUrl, // ✅ INCLUDE THIS
  } = data;

  assert(isPositiveInt(fiscalYearId), 'Invalid fiscalYearId');
  assert(typeof position === 'string' && position.trim(), 'Position is required');
  assert(typeof fullName === 'string' && fullName.trim(), 'Full name is required');
  assert(!email || isValidEmail(email), 'Invalid email');
  assert(isValidGender(gender), 'Invalid gender');
  assert(!isNaN(Date.parse(birthDate)), 'Invalid birthDate');
  assert(isActive === undefined || typeof isActive === 'boolean', 'Invalid isActive');

  return db.skOfficial.create({
    data: {
      fiscalYearId,
      position: position.trim(),
      fullName: fullName.trim(),
      responsibility: responsibility?.trim() || null,
      birthDate: new Date(birthDate),
      email: email || null,
      gender,
      isActive: isActive ?? true,
      profileImageUrl: profileImageUrl || null, // ✅ SAVED
    },
  });
};

/* ================= LIST ================= */

export const getSkOfficials = async ({
  fiscalYearId,
  page = 1,
  limit = 10,
  position,
  fullName,
  gender,
  isActive,
}) => {
  page = Number(page);
  limit = Number(limit);

  assert(isPositiveInt(fiscalYearId), 'Invalid fiscalYearId');
  assert(isPositiveInt(page), 'Invalid page');
  assert(isPositiveInt(limit) && limit <= 100, 'Invalid limit');

  if (gender) {
    assert(isValidGender(gender), 'Invalid gender filter');
  }

  const parsedIsActive = parseBoolean(isActive);

  const where = {
    fiscalYearId,
    deletedAt: null,
    ...(position && { position: { contains: position.trim() } }),
    ...(fullName && { fullName: { contains: fullName.trim() } }),
    ...(gender && { gender }),
    ...(parsedIsActive !== undefined && { isActive: parsedIsActive }),
  };

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    db.skOfficial.findMany({
      where,
      skip,
      take: limit,
      orderBy: { position: 'asc' },
    }),
    db.skOfficial.count({ where }),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/* ================= GET BY ID ================= */

export const getSkOfficialById = (id) => {
  assert(isPositiveInt(id), 'Invalid SK Official ID');

  return db.skOfficial.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });
};

/* ================= UPDATE ================= */

export const updateSkOfficial = (id, data) => {
  assert(isPositiveInt(id), 'Invalid SK Official ID');

  if (data.gender !== undefined) {
    assert(isValidGender(data.gender), 'Invalid gender');
  }

  if (data.email !== undefined) {
    assert(!data.email || isValidEmail(data.email), 'Invalid email');
  }

  if (data.birthDate !== undefined) {
    assert(!isNaN(Date.parse(data.birthDate)), 'Invalid birthDate');
  }

  if (data.isActive !== undefined) {
    assert(typeof data.isActive === 'boolean', 'Invalid isActive');
  }

  const updateData = {};

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      updateData[key] = value;
    }
  }

  if (updateData.responsibility !== undefined) {
    updateData.responsibility =
      updateData.responsibility?.trim() || null;
  }

  if (updateData.birthDate !== undefined) {
    updateData.birthDate = new Date(updateData.birthDate);
  }

  return db.skOfficial.update({
    where: { id },
    data: updateData, // ✅ profileImageUrl preserved
  });
};

/* ================= SOFT DELETE ================= */

export const deleteSkOfficial = (id) => {
  assert(isPositiveInt(id), 'Invalid SK Official ID');

  return db.skOfficial.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

/* ================= TOGGLE STATUS ================= */

export const toggleSkOfficialStatus = (id, isActive) => {
  assert(isPositiveInt(id), 'Invalid SK Official ID');
  assert(typeof isActive === 'boolean', 'Invalid isActive');

  return db.skOfficial.update({
    where: { id },
    data: { isActive },
  });
};
