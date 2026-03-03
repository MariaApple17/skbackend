import skPlantillaService from '../services/sk-plantilla.service.js';

class SkPlantillaController {

  /* ================= CREATE ================= */
  async create(req, res) {
    try {
      const result = await skPlantillaService.createPlantilla(req.body);

      return res.status(201).json({
        success: true,
        message: 'Plantilla created successfully',
        data: result,
      });

    } catch (error) {
      console.error('CREATE PLANTILLA ERROR:', error);

      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create plantilla',
      });
    }
  }

  /* ================= GET ALL ================= */
  async getAll(req, res) {
  try {
    const { fiscalYearId } = req.query;

    console.log("QUERY fiscalYearId:", fiscalYearId);

    const result = await skPlantillaService.getAllPlantilla(fiscalYearId);

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("GET PLANTILLA ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

  /* ================= UPDATE ================= */
  async update(req, res) {
    try {
      const id = Number(req.params.id);

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid plantilla ID',
        });
      }

      const result = await skPlantillaService.updatePlantilla(id, req.body);

      return res.status(200).json({
        success: true,
        message: 'Plantilla updated successfully',
        data: result,
      });

    } catch (error) {
      console.error('UPDATE PLANTILLA ERROR:', error);

      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to update plantilla',
      });
    }
  }

  /* ================= DELETE ================= */
  async delete(req, res) {
    try {
      const id = Number(req.params.id);

      if (!id || isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid plantilla ID',
        });
      }

      await skPlantillaService.deletePlantilla(id);

      return res.status(200).json({
        success: true,
        message: 'Plantilla deleted successfully',
      });

    } catch (error) {
      console.error('DELETE PLANTILLA ERROR:', error);

      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete plantilla',
      });
    }
  }
}

export default new SkPlantillaController();