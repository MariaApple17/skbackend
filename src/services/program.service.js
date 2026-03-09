import { db } from "../config/db.config.js"

/* ======================================================
   HELPER: COUNT COUNCIL MEMBERS
====================================================== */

const getCouncilMembersCount = async () => {

  const total = await db.user.count({
    where:{
      deletedAt:null,
      status:"ACTIVE",
      role:{
        name:{
          in:["SK CHAIRPERSON","SK KAGAWAD"]
        }
      }
    }
  })

  return total
}

/* ======================================================
   CREATE PROGRAM
====================================================== */

export const createProgramService = async (data) => {

  const {
    code,
    name,
    description,
    committeeInCharge,
    beneficiaries,
    startDate,
    endDate,
    isActive = true,
    documents = []
  } = data

  const existing = await db.program.findFirst({
    where:{ code, deletedAt:null }
  })

  if(existing){
    throw new Error("Program code already exists")
  }

  const activeFiscalYear = await db.fiscalYear.findFirst({
    where:{ isActive:true, deletedAt:null }
  })

  if(!activeFiscalYear){
    throw new Error("No active fiscal year found")
  }

  return db.program.create({

    data:{
      code,
      name,
      description,
      committeeInCharge,
      beneficiaries,

      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,

      isActive,

      fiscalYearId:activeFiscalYear.id,

      ...(documents?.length > 0 && {
        proofPhotos:{
          create:documents.map(d=>({
            imageUrl:d.imageUrl,
            title:d.title ?? null,
            description:d.description ?? null,
            uploadedBy:d.uploadedBy ?? null
          }))
        }
      })

    },

    include:{
      proofPhotos:true
    }

  })

}

/* ======================================================
   UPLOAD PROGRAM PROOF (NEW)
====================================================== */

export const uploadProgramProofService = async (programId,fileUrl,userName)=>{

  const program = await db.program.findUnique({
    where:{ id:Number(programId) }
  })

  if(!program){
    throw new Error("Program not found")
  }

  const proof = await db.programDocumentImage.create({

    data:{
      programId:Number(programId),
      imageUrl:fileUrl,
      uploadedBy:userName ?? "SK Official"
    }

  })

  const now = new Date()

  if(program.endDate && now > program.endDate){

    await db.program.update({
      where:{ id:Number(programId) },
      data:{ status:"COMPLETED" }
    })

  }

  return proof

}

/* ======================================================
   GET ALL PROGRAMS
====================================================== */

export const getAllProgramsService = async (query)=>{

  const {
    q,
    startDateFrom,
    startDateTo,
    sortBy="createdAt",
    sortOrder="desc",
    page=1,
    limit=10
  } = query

  const activeFiscalYear = await db.fiscalYear.findFirst({
    where:{ isActive:true, deletedAt:null }
  })

  if(!activeFiscalYear){

    return{
      data:[],
      meta:{ total:0,page:1,limit:Number(limit),totalPages:0 }
    }

  }

  const where = {

    deletedAt:null,
    fiscalYearId:activeFiscalYear.id,

    ...(q && {
      OR:[
        { code:{ contains:q,mode:"insensitive"} },
        { name:{ contains:q,mode:"insensitive"} },
        { description:{ contains:q,mode:"insensitive"} },
        { committeeInCharge:{ contains:q,mode:"insensitive"} },
        { beneficiaries:{ contains:q,mode:"insensitive"} }
      ]
    }),

    ...((startDateFrom || startDateTo) && {
      startDate:{
        ...(startDateFrom && { gte:new Date(startDateFrom)}),
        ...(startDateTo && { lte:new Date(startDateTo)})
      }
    })

  }

  const skip = (Number(page)-1) * Number(limit)

  const [data,total] = await Promise.all([

    db.program.findMany({

      where,
      orderBy:{ [sortBy]:sortOrder },
      skip,
      take:Number(limit),

      include:{
        proofPhotos:true,
        approvals:{
          include:{ approver:true }
        }
      }

    }),

    db.program.count({ where })

  ])

  return{
    data:data.map(p=>({

      ...p,

      documents:p.proofPhotos ?? [],

      approvalStatus:p.status,

      approvals:(p.approvals ?? []).map(a=>({
        member:a.approver?.fullName ?? "Unknown",
        userId:a.approverId,
        decision:a.status.toLowerCase(),
        date:a.createdAt
      }))

    })),

    meta:{
      total,
      page:Number(page),
      limit:Number(limit),
      totalPages:Math.ceil(total/limit)
    }
  }

}

/* ======================================================
   GET PROGRAM BY ID
====================================================== */

export const getProgramByIdService = async(id)=>{

  const program = await db.program.findFirst({

    where:{ id:Number(id), deletedAt:null },

    include:{
      proofPhotos:true,
      approvals:{
        include:{ approver:true }
      }
    }

  })

  if(!program){
    throw new Error("Program not found")
  }

  return{
    ...program,
    documents:program.proofPhotos ?? []
  }

}

/* ======================================================
   APPROVE PROGRAM
====================================================== */

export const approveProgramService = async (programId,userId)=>{

  programId = Number(programId)

  const program = await db.program.findUnique({
    where:{ id:programId }
  })

  if(!program) throw new Error("Program not found")

  if(program.status === "APPROVED")
  throw new Error("Program already approved")

  if(program.status === "REJECTED")
  throw new Error("Program already rejected")

  const existingVote = await db.programApproval.findFirst({
    where:{
      programId,
      approverId:userId
    }
  })

  if(existingVote){
    throw new Error("You already voted for this program")
  }

  await db.programApproval.create({
    data:{
      programId,
      approverId:userId,
      status:"APPROVED"
    }
  })

  const approvals = await db.programApproval.count({
    where:{
      programId,
      status:"APPROVED"
    }
  })

  const totalOfficials = await getCouncilMembersCount()

  const majority = Math.floor(totalOfficials / 2) + 1

  let newStatus = program.status

  if(approvals >= majority){

    newStatus = "APPROVED"

    await db.program.update({
      where:{ id:programId },
      data:{ status:newStatus }
    })

  }

  return{
    message:"Approval recorded",
    approvals,
    officials:totalOfficials,
    majority,
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

  if(!program) throw new Error("Program not found")

  const existingVote = await db.programApproval.findFirst({
    where:{
      programId,
      approverId:userId
    }
  })

  if(existingVote){
    throw new Error("You already voted")
  }

  await db.programApproval.create({
    data:{
      programId,
      approverId:userId,
      status:"REJECTED"
    }
  })

  const rejections = await db.programApproval.count({
    where:{
      programId,
      status:"REJECTED"
    }
  })

  const totalOfficials = await getCouncilMembersCount()

  const majority = Math.floor(totalOfficials / 2) + 1

  let newStatus = program.status

  if(rejections >= majority){

    newStatus = "REJECTED"

    await db.program.update({
      where:{ id:programId },
      data:{ status:newStatus }
    })

  }

  return{
    message:"Rejection recorded",
    rejections,
    officials:totalOfficials,
    majority,
    programStatus:newStatus
  }

}

/* ======================================================
   DELETE PROGRAM
====================================================== */

export const deleteProgramService = async(id)=>{

  await getProgramByIdService(id)

  return db.program.update({

    where:{ id:Number(id) },

    data:{ deletedAt:new Date() }

  })

}