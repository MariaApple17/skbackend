import { db } from "../config/db.config.js"

/* ======================================================
   APPROVE PROGRAM
====================================================== */

export const approveProgramService = async (programId, userId) => {

  programId = Number(programId)

  /* ================= CHECK PROGRAM ================= */

  const program = await db.program.findUnique({
    where: { id: programId }
  })

  if (!program) {
    throw new Error("Program not found")
  }

  if (program.status === "UPCOMING") {
    throw new Error("Program already approved")
  }

  if (program.status === "REJECTED") {
    throw new Error("Program already rejected")
  }

  /* ================= CHECK USER ================= */

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { role: true }
  })

  if (!user) {
    throw new Error("User not found")
  }

  const allowedRoles = ["SK CHAIRPERSON", "SK KAGAWAD"]

  if (!allowedRoles.includes(user.role.name)) {
    throw new Error("You are not allowed to approve programs")
  }

  /* ================= PREVENT DOUBLE VOTE ================= */

  const existingVote = await db.programApproval.findFirst({
    where: {
      programId,
      approverId: userId
    }
  })

  if (existingVote) {
    throw new Error("You already voted on this program")
  }

  /* ================= SAVE APPROVAL ================= */

  await db.programApproval.create({
    data: {
      programId,
      approverId: userId,
      status: "APPROVED"
    }
  })

  /* ================= COUNT APPROVALS ================= */

  const approvals = await db.programApproval.count({
    where: {
      programId,
      status: "APPROVED"
    }
  })

  /* ================= COUNT REJECTIONS ================= */

  const rejections = await db.programApproval.count({
    where: {
      programId,
      status: "REJECTED"
    }
  })

  /* ================= COUNT OFFICIALS ================= */

  const officials = await db.user.count({
    where: {
      deletedAt: null,
      status: "ACTIVE",
      role: {
        name: {
          in: ["SK CHAIRPERSON", "SK KAGAWAD"]
        }
      }
    }
  })

  /* ================= COMPUTE MAJORITY ================= */

  const majority = Math.floor(officials / 2) + 1

  let newStatus = program.status

  /* ================= APPROVAL LOGIC ================= */

  if (approvals >= majority) {

    newStatus = "UPCOMING"

    await db.program.update({
      where: { id: programId },
      data: { status: newStatus }
    })

  }

  /* ================= REJECTION LOGIC ================= */

  if (rejections >= majority) {

    newStatus = "REJECTED"

    await db.program.update({
      where: { id: programId },
      data: { status: newStatus }
    })

  }

  return {
    message: "Approval recorded",
    approvals,
    rejections,
    officials,
    majority,
    programStatus: newStatus
  }

}



/* ======================================================
   REJECT PROGRAM
====================================================== */

export const rejectProgramService = async (programId, userId) => {

  programId = Number(programId)

  /* ================= CHECK PROGRAM ================= */

  const program = await db.program.findUnique({
    where: { id: programId }
  })

  if (!program) {
    throw new Error("Program not found")
  }

  if (program.status === "UPCOMING") {
    throw new Error("Program already approved")
  }

  if (program.status === "REJECTED") {
    throw new Error("Program already rejected")
  }

  /* ================= CHECK USER ================= */

  const user = await db.user.findUnique({
    where: { id: userId },
    include: { role: true }
  })

  if (!user) {
    throw new Error("User not found")
  }

  const allowedRoles = ["SK CHAIRPERSON", "SK KAGAWAD"]

  if (!allowedRoles.includes(user.role.name)) {
    throw new Error("You are not allowed to reject programs")
  }

  /* ================= PREVENT DOUBLE VOTE ================= */

  const existingVote = await db.programApproval.findFirst({
    where: {
      programId,
      approverId: userId
    }
  })

  if (existingVote) {
    throw new Error("You already voted on this program")
  }

  /* ================= SAVE REJECTION ================= */

  await db.programApproval.create({
    data: {
      programId,
      approverId: userId,
      status: "REJECTED"
    }
  })

  /* ================= COUNT REJECTIONS ================= */

  const rejections = await db.programApproval.count({
    where: {
      programId,
      status: "REJECTED"
    }
  })

  /* ================= COUNT OFFICIALS ================= */

  const officials = await db.user.count({
    where: {
      deletedAt: null,
      status: "ACTIVE",
      role: {
        name: {
          in: ["SK CHAIRPERSON", "SK KAGAWAD"]
        }
      }
    }
  })

  /* ================= COMPUTE MAJORITY ================= */

  const majority = Math.floor(officials / 2) + 1

  let newStatus = program.status

  /* ================= FINAL REJECTION ================= */

  if (rejections >= majority) {

    newStatus = "REJECTED"

    await db.program.update({
      where: { id: programId },
      data: { status: newStatus }
    })

  }

  return {
    message: "Rejection recorded",
    rejections,
    officials,
    majority,
    programStatus: newStatus
  }

}