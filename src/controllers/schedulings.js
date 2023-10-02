import Scheduling from '../models/scheduling.js';
import CustomError from '../lib/customError.js';

class SchedulingsController {
  async index(req, res) {
    const schedulings = await Scheduling.findAll();
    res.status(200).json({ schedulings });
  }

  async create(req, res, next) {
    const scheduling = new Scheduling();

    try {
      await scheduling.create(req.body);
      return res.status(201).json();
    } catch (err) {
      const error = new CustomError(err, 209);
      return next(error);
    }
  }
}

export default new SchedulingsController();
