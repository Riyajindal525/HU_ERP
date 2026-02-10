import { asyncHandler } from '../middlewares/errorHandler.js';
import departmentService from '../services/department.service.js';

class DepartmentController {
  getAll = asyncHandler(async (req, res) => {
    const departments = await departmentService.getAll();
    res.json({ success: true, data: departments });
  });

  getById = asyncHandler(async (req, res) => {
    const department = await departmentService.getById(req.params.id);
    res.json({ success: true, data: department });
  });

  create = asyncHandler(async (req, res) => {
    const department = await departmentService.create(req.body);
    res.status(201).json({ success: true, data: department });
  });

  update = asyncHandler(async (req, res) => {
    const department = await departmentService.update(req.params.id, req.body);
    res.json({ success: true, data: department });
  });

  delete = asyncHandler(async (req, res) => {
    await departmentService.delete(req.params.id);
    res.json({ success: true, message: 'Department deleted successfully' });
  });

  getStatistics = asyncHandler(async (req, res) => {
    const statistics = await departmentService.getStatistics(req.params.id);
    res.json({ success: true, data: statistics });
  });
}

export default new DepartmentController();
