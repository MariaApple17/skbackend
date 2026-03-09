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
   GET PROGRAMS
====================================================== */

export const getProgramsService = async () => {

const programs = await db.program.findMany({

include:{
approvals:{
include:{
approver:{
select:{
id:true,
fullName:true
}
}
},
orderBy:{
createdAt:"asc"
}
}
},

orderBy:{
createdAt:"desc"
}

})

return programs.map(p => ({

id: p.id,
name: p.name,
description: p.description,
approvalStatus: p.status,

approvals: p.approvals.map(a => ({
member: a.approver?.fullName ?? "Unknown",
userId: a.approver?.id,
decision: a.status === "APPROVED" ? "approved" : "rejected",
date: a.createdAt
}))

}))

}

/* ======================================================
   APPROVE PROGRAM
====================================================== */

export const approveProgramService = async (programId,userId)=>{

programId = Number(programId)

/* ================= CHECK PROGRAM ================= */

const program = await db.program.findUnique({
where:{ id:programId }
})

if(!program) throw new Error("Program not found")

if(program.status === "APPROVED")
throw new Error("Program already approved")

if(program.status === "REJECTED")
throw new Error("Program already rejected")

/* ================= CHECK USER ================= */

const user = await db.user.findUnique({
where:{ id:userId },
include:{ role:true }
})

if(!user) throw new Error("User not found")

const roleName = user.role?.name

if(!["SK CHAIRPERSON","SK KAGAWAD"].includes(roleName)){
throw new Error("You are not allowed to vote")
}

/* ================= PREVENT DOUBLE VOTE ================= */

const existingVote = await db.programApproval.findFirst({
where:{
programId,
approverId:userId
}
})

if(existingVote){
throw new Error("You already voted for this program")
}

/* ================= SAVE APPROVAL ================= */

await db.programApproval.create({
data:{
programId,
approverId:userId,
status:"APPROVED"
}
})

/* ================= COUNT APPROVALS ================= */

const approvals = await db.programApproval.count({
where:{
programId,
status:"APPROVED"
}
})

/* ================= GET COUNCIL MEMBERS ================= */

const totalOfficials = await getCouncilMembersCount()

/* ================= CALCULATE MAJORITY ================= */

const majority = Math.floor(totalOfficials / 2) + 1

let newStatus = program.status

/* ================= UPDATE STATUS IF MAJORITY ================= */

if(approvals >= majority){

newStatus = "APPROVED"

await db.program.update({
where:{ id:programId },
data:{ status:newStatus }
})

}

/* ================= RETURN RESULT ================= */

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

/* ================= CHECK PROGRAM ================= */

const program = await db.program.findUnique({
where:{ id:programId }
})

if(!program) throw new Error("Program not found")

if(program.status === "APPROVED")
throw new Error("Program already approved")

if(program.status === "REJECTED")
throw new Error("Program already rejected")

/* ================= CHECK USER ================= */

const user = await db.user.findUnique({
where:{ id:userId },
include:{ role:true }
})

if(!user) throw new Error("User not found")

const roleName = user.role?.name

if(!["SK CHAIRPERSON","SK KAGAWAD"].includes(roleName)){
throw new Error("You are not allowed to vote")
}

/* ================= PREVENT DOUBLE VOTE ================= */

const existingVote = await db.programApproval.findFirst({
where:{
programId,
approverId:userId
}
})

if(existingVote){
throw new Error("You already voted for this program")
}

/* ================= SAVE REJECTION ================= */

await db.programApproval.create({
data:{
programId,
approverId:userId,
status:"REJECTED"
}
})

/* ================= COUNT REJECTIONS ================= */

const rejections = await db.programApproval.count({
where:{
programId,
status:"REJECTED"
}
})

/* ================= GET COUNCIL MEMBERS ================= */

const totalOfficials = await getCouncilMembersCount()

/* ================= CALCULATE MAJORITY ================= */

const majority = Math.floor(totalOfficials / 2) + 1

let newStatus = program.status

/* ================= UPDATE STATUS IF MAJORITY ================= */

if(rejections >= majority){

newStatus = "REJECTED"

await db.program.update({
where:{ id:programId },
data:{ status:newStatus }
})

}

/* ================= RETURN RESULT ================= */

return{
message:"Rejection recorded",
rejections,
officials:totalOfficials,
majority,
programStatus:newStatus
}

}