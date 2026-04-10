import * as service from '../services/objectOfExpenditure.service.js';

const sendErrorResponse = (res, err) => {
  const message = err?.message || 'Something went wrong'
  const status = message.includes('not found')
    ? 404
    : message.includes('Invalid') || message.includes('required')
    ? 400
    : 400

  res.status(status).json({ success: false, message })
}

/* ================= CREATE ================= */
export const createObjectOfExpenditure = async (req, res) => {
  try {
    const data = await service.createObjectOfExpenditureService(req.body)
    res.status(201).json({ success: true, data })
  } catch (err) {
    sendErrorResponse(res, err)
  }
}

/* ================= READ (LIST) ================= */
export const getObjectsOfExpenditure = async (req, res) => {
  try {
    const result = await service.getObjectsOfExpenditureService(req.query)
    res.json({ success: true, ...result })
  } catch (err) {
    sendErrorResponse(res, err)
  }
}

/* ================= READ (SINGLE) ================= */
export const getObjectOfExpenditureById = async (req, res) => {
  try {
    const data = await service.getObjectOfExpenditureByIdService(
      req.params.id
    )
    res.json({ success: true, data })
  } catch (err) {
    sendErrorResponse(res, err)
  }
}

/* ================= UPDATE ================= */
export const updateObjectOfExpenditure = async (req, res) => {
  try {
    const data = await service.updateObjectOfExpenditureService(
      req.params.id,
      req.body
    )
    res.json({ success: true, data })
  } catch (err) {
    sendErrorResponse(res, err)
  }
}

/* ================= DELETE ================= */
export const deleteObjectOfExpenditure = async (req, res) => {
  try {
    await service.deleteObjectOfExpenditureService(req.params.id)
    res.json({ success: true, message: 'Object of expenditure deleted' })
  } catch (err) {
    sendErrorResponse(res, err)
  }
}
