import express from 'express';
import skPlantillaController from '../controllers/sk-plantilla.controller.js';

const router = express.Router();

router.post('/', (req, res) =>
  skPlantillaController.create(req, res)
);

router.get('/', (req, res) =>
  skPlantillaController.getAll(req, res)
);

router.put('/:id', (req, res) =>
  skPlantillaController.update(req, res)
);

router.delete('/:id', (req, res) =>
  skPlantillaController.delete(req, res)
);

export default router;