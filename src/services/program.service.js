import { db } from "../config/db.config.js"

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

startDate:startDate ? new Date(startDate) : null,
endDate:endDate ? new Date(endDate) : null,

isActive,

fiscalYearId:activeFiscalYear.id,

...(documents.length>0 && {
documents:{
create:documents.map(d=>({
imageUrl:d.imageUrl,
title:d.title ?? null,
description:d.description ?? null,
uploadedBy:d.uploadedBy ?? null
}))
}
})

},

include:{ documents:true }

})

}


/* ======================================================
   GET ALL PROGRAMS
====================================================== */

export const getAllProgramsService = async (query)=>{

const {
q,
isActive,
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
documents:true,
approvals:{
include:{ approver:true }
}
}

}),

db.program.count({ where })

])


/* ============================================
   AUTO STATUS + AUTO ACTIVE
============================================ */

const now = new Date()

const formatted = data.map(program => {

const start = program.startDate ? new Date(program.startDate) : null
const end = program.endDate ? new Date(program.endDate) : null

let autoActive = false

if(program.status === "APPROVED"){

if(start && now < start){
autoActive = true
}

if(start && end && now >= start && now <= end){
autoActive = true
}

}

if(end && now > end){
autoActive = false
}

/* FILTER ACTIVE DROPDOWN */

if(isActive !== undefined && isActive !== ""){

const filterActive = isActive === true || isActive === "true"

if(autoActive !== filterActive){
return null
}

}

return{

...program,

isActive:autoActive,

approvalStatus:program.status.toLowerCase(),

approvals:(program.approvals ?? []).map(a=>({
member:a.approver?.fullName ?? "Unknown",
userId:a.approverId,
decision:a.status.toLowerCase(),
date:a.createdAt
}))

}

}).filter(Boolean)


return{

data:formatted,

meta:{
total:formatted.length,
page:Number(page),
limit:Number(limit),
totalPages:Math.ceil(formatted.length/limit)
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
documents:true,
approvals:{
include:{ approver:true }
}
}

})

if(!program){
throw new Error("Program not found")
}

return program

}


/* ======================================================
   APPROVE PROGRAM
====================================================== */

export const approveProgramService = async(programId,userId)=>{

programId = Number(programId)

await getProgramByIdService(programId)

const existingVote = await db.programApproval.findFirst({
where:{ programId, approverId:userId }
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

const majority = 3

if(approvals >= majority){

await db.program.update({

where:{ id:programId },

data:{ status:"APPROVED" }

})

}

return { message:"Vote recorded" }

}


/* ======================================================
   REJECT PROGRAM
====================================================== */

export const rejectProgramService = async(programId,userId)=>{

programId = Number(programId)

await getProgramByIdService(programId)

const existingVote = await db.programApproval.findFirst({
where:{ programId, approverId:userId }
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

const majority = 3

if(rejections >= majority){

await db.program.update({

where:{ id:programId },

data:{ status:"REJECTED" }

})

}

return { message:"Vote recorded" }

}


/* ======================================================
   UPDATE PROGRAM
====================================================== */

export const updateProgramService = async(id,data)=>{

const programId = Number(id)

await getProgramByIdService(programId)

const updateData={

...(data.code && { code:data.code }),
...(data.name && { name:data.name }),
...(data.description && { description:data.description }),
...(data.committeeInCharge && { committeeInCharge:data.committeeInCharge }),
...(data.beneficiaries && { beneficiaries:data.beneficiaries }),

...(data.isActive!==undefined && {
isActive:data.isActive===true || data.isActive==="true"
}),

...(data.startDate && { startDate:new Date(data.startDate) }),
...(data.endDate && { endDate:new Date(data.endDate) })

}

return db.program.update({

where:{ id:programId },

data:updateData,

include:{ documents:true }

})

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