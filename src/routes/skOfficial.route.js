import express from 'express';

import * as controller from '../controllers/skOfficial.controller.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/', upload.single('profileImage'), controller.create);
router.get('/fiscal/:fiscalYearId', controller.list);
router.get('/:id', controller.getById);
router.put('/:id', upload.single('profileImage'), controller.update);
router.delete('/:id', controller.remove);
router.patch('/:id/status', controller.toggleStatus);

export default router;
