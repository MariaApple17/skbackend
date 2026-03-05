import { db } from "../config/db.config.js"

/* ======================================================
   APPROVE PROGRAM
====================================================== */

export const approveProgramService = async (programId,userId)=>{

  programId = Number(programId)

  /* check program */

  const program = await db.program.findUnique({
    where:{ id:programId }
  })

  if(!program){
    throw new Error("Program not found")
  }

  if(program.status === "UPCOMING"){
    throw new Error("Program already approved")
  }

  if(program.status === "REJECTED"){
    throw new Error("Program already rejected")
  }

  /* check user */

  const user = await db.user.findUnique({
    where:{ id:userId },
    include:{ role:true }
  })

  if(!user){
    throw new Error("User not found")
  }

  if(!user.role){
    throw new Error("User role not assigned")
  }

  const allowedRoles = ["SK CHAIRPERSON","SK KAGAWAD"]

  if(!allowedRoles.includes(user.role.name)){
    throw new Error("You are not allowed to approve programs")
  }

  /* prevent double voting */

  const existingVote = await db.programApproval.findUnique({
    where:{
      programId_approverId:{
        programId,
        approverId:userId
      }
    }
  })

  if(existingVote){
    throw new Error("You already voted on this program")
  }

  /* record approval */

  await db.programApproval.create({
    data:{
      programId,
      approverId:userId,
      status:"APPROVED"
    }
  })

  /* count approvals */

  const approvals = await db.programApproval.count({
    where:{
      programId,
      status:"APPROVED"
    }
  })

  /* count eligible officials */

  const officials = await db.user.count({
    where:{
      status:"ACTIVE",
      deletedAt:null,
      role:{
        name:{
          in:["SK CHAIRPERSON","SK KAGAWAD"]
        }
      }
    }
  })

  let newStatus = program.status

  /* if ALL officials approved */

  if(approvals >= officials){

    newStatus = "UPCOMING"

    await db.program.update({
      where:{ id:programId },
      data:{ status:newStatus }
    })

  }

  return{
    message:"Approval recorded",
    approvals,
    officials,
    programStatus:newStatus
  }

}


/* ======================================================
   REJECT PROGRAM
====================================================== */

export const rejectProgramService = async (programId,userId)=>{

  programId = Number(programId)

  const program = await db.program.findUnique({
    where:{ id:programId }
  })

  if(!program){
    throw new Error("Program not found")
  }

  if(program.status === "UPCOMING"){
    throw new Error("Program already approved")
  }

  if(program.status === "REJECTED"){
    throw new Error("Program already rejected")
  }

  /* check user */

  const user = await db.user.findUnique({
    where:{ id:userId },
    include:{ role:true }
  })

  if(!user){
    throw new Error("User not found")
  }

  const allowedRoles = ["SK CHAIRPERSON","SK KAGAWAD"]

  if(!allowedRoles.includes(user.role.name)){
    throw new Error("You are not allowed to reject programs")
  }

  /* prevent double vote */

  const existingVote = await db.programApproval.findUnique({
    where:{
      programId_approverId:{
        programId,
        approverId:userId
      }
    }
  })

  if(existingVote){
    throw new Error("You already voted on this program")
  }

  /* record rejection */

  await db.programApproval.create({
    data:{
      programId,
      approverId:userId,
      status:"REJECTED"
    }
  })

  /* reject program immediately */

  await db.program.update({
    where:{ id:programId },
    data:{ status:"REJECTED" }
  })

  return{
    message:"Program rejected",
    programStatus:"REJECTED"
  }

}