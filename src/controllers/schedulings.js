import Scheduling from '../models/scheduling.js';
import CustomError from '../lib/customError.js';

class SchedulingsController {
  async index(req, res) {
    const schedulings = await Scheduling.findAll();
    res.status(200).json({ schedulings });
  }

  async show(req, res) {
    const scheduling = await Scheduling.find(req.params.id);
    return res.status(200).json(scheduling);
  }

  async create(req, res, next) {
    try {
      const scheduling = await new Scheduling(req.body).create();
      return res.status(201).json(scheduling);
    } catch (err) {
      const error = new CustomError(err, 209);
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const scheduling = await new Scheduling(req.body).update(req.params.id);
      return res.status(200).json(scheduling);
    } catch (err) {
      const error = new CustomError(err, 209);
      return next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      await Scheduling.destroy(req.params.id);
      return res.status(200).json();
    } catch (err) {
      const error = new CustomError(err, 209);
      return next(error);
    }
  }
}

export default new SchedulingsController();
