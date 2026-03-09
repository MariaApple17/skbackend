import { db } from '../config/db.config.js'

const isNonEmptyString = (val) =>
  typeof val === 'string' && val.trim().length > 0

/* ======================================================
   GET SYSTEM PROFILE (GLOBAL)
====================================================== */
export const getSystemProfile = async () => {

  let profile = await db.systemProfile.findFirst()

  /* AUTO CREATE DEFAULT PROFILE */
  if(!profile){

    profile = await db.systemProfile.create({
      data:{
        systemName:'SK360',
        systemDescription:'Project, Budget, and Report Monitoring System',
        location:'Bongbong, Trinidad, Bohol',
        logoUrl:''
      }
    })
  }

  /* ================= ACTIVE FISCAL YEAR ================= */

  const activeFiscalYear = await db.fiscalYear.findFirst({
    where:{
      isActive:true,
      deletedAt:null
    }
  })

  /* ================= RETURN CLEAN RESPONSE ================= */

  return {
    id: profile.id,
    systemName: profile.systemName,
    systemDescription: profile.systemDescription,
    location: profile.location,
    logoUrl: profile.logoUrl,

    fiscalYear: activeFiscalYear
      ? {
          id: activeFiscalYear.id,
          year: activeFiscalYear.year,
          isActive: activeFiscalYear.isActive
        }
      : null
  }
}


/* ======================================================
   UPDATE SYSTEM PROFILE (GLOBAL)
====================================================== */
export const updateSystemProfile = async (payload) => {

  const profile = await db.systemProfile.findFirst()

  if(!profile){
    throw{
      statusCode:404,
      message:'System profile not found'
    }
  }

  /* ================= VALIDATION ================= */

  if(
    payload.systemName !== undefined &&
    !isNonEmptyString(payload.systemName)
  ){
    throw{
      statusCode:400,
      message:'System name must be a non-empty string'
    }
  }

  if(
    payload.systemDescription !== undefined &&
    typeof payload.systemDescription !== 'string'
  ){
    throw{
      statusCode:400,
      message:'System description must be a string'
    }
  }

  if(
    payload.location !== undefined &&
    typeof payload.location !== 'string'
  ){
    throw{
      statusCode:400,
      message:'Location must be a string'
    }
  }

  if(
    payload.logoUrl !== undefined &&
    typeof payload.logoUrl !== 'string'
  ){
    throw{
      statusCode:400,
      message:'Logo URL must be a string'
    }
  }

  if(Object.keys(payload).length === 0){
    throw{
      statusCode:400,
      message:'No valid fields provided for update'
    }
  }

  /* ================= UPDATE PROFILE ================= */

  const updated = await db.systemProfile.update({
    where:{ id:profile.id },
    data:{
      systemName:payload.systemName,
      systemDescription:payload.systemDescription,
      location:payload.location,
      logoUrl:payload.logoUrl
    }
  })

  /* ================= GET ACTIVE FISCAL YEAR ================= */

  const activeFiscalYear = await db.fiscalYear.findFirst({
    where:{
      isActive:true,
      deletedAt:null
    }
  })

  /* ================= RETURN CLEAN RESPONSE ================= */

  return {
    id: updated.id,
    systemName: updated.systemName,
    systemDescription: updated.systemDescription,
    location: updated.location,
    logoUrl: updated.logoUrl,

    fiscalYear: activeFiscalYear
      ? {
          id: activeFiscalYear.id,
          year: activeFiscalYear.year,
          isActive: activeFiscalYear.isActive
        }
      : null
  }
}