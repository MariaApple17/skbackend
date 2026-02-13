import express from 'express';

import * as controller from '../controllers/systemProfile.controller.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/', controller.get);
router.put('/', upload.single('logo'), controller.update);

export default router;
