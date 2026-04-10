import express from "express"
import {
addProgramDocuments,
createProgram,
deleteProgram,
getProgramById,
getPrograms,
toggleProgramStatus,
updateProgram,
approveProgram,
rejectProgram,
uploadProgramProof
} from "../controllers/program.controller.js"

import { authMiddleware } from "../middlewares/auth.middleware.js"
import {
uploadProgramImage,
uploadProofFile
} from "../middlewares/upload.middleware.js"

const router = express.Router()

/* ======================================================
   CREATE PROGRAM (WITH DOCUMENT IMAGES)
====================================================== */

router.post(
"/",
authMiddleware,
uploadProgramImage.array("documents",10),
createProgram
)

/* ======================================================
   UPLOAD PROGRAM PROOF (FOR COMPLETED PROGRAM)
====================================================== */

router.post(
"/:id/upload-proof",
authMiddleware,
uploadProofFile.single("proof"),
uploadProgramProof
)
/* ======================================================
   GET ALL PROGRAMS
====================================================== */

router.get(
"/",
authMiddleware,
getPrograms
)


/* ======================================================
   GET PROGRAM BY ID
====================================================== */

router.get(
"/:id",
authMiddleware,
getProgramById
)


/* ======================================================
   UPDATE PROGRAM
====================================================== */

router.put(
"/:id",
authMiddleware,
updateProgram
)


/* ======================================================
   ADD PROGRAM DOCUMENTS
====================================================== */

router.post(
"/:id/documents",
authMiddleware,
uploadProgramImage.array("documents",10),
addProgramDocuments
)


/* ======================================================
   TOGGLE ACTIVE STATUS
====================================================== */

router.patch(
"/:id/toggle-status",
authMiddleware,
toggleProgramStatus
)


/* ======================================================
   APPROVE PROGRAM (COUNCIL VOTE)
====================================================== */

router.patch(
"/:id/approve",
authMiddleware,
approveProgram
)


/* ======================================================
   REJECT PROGRAM (COUNCIL VOTE)
====================================================== */

router.patch(
"/:id/reject",
authMiddleware,
rejectProgram
)


/* ======================================================
   DELETE PROGRAM (SOFT DELETE)
====================================================== */

router.delete(
"/:id",
authMiddleware,
deleteProgram
)

export default router
