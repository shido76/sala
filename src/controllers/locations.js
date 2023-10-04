import Location from '../models/location.js';
import CustomError from '../lib/customError.js';

class LocationsController {
  async index(req, res) {
    const locations = await Location.findAll();
    res.status(200).json({ locations });
  }

  async show(req, res) {    
    const location = await Location.find(req.params.id);
    return res.status(200).json(location);
  }

  async create(req, res, next) {
    try {
      const location = await new Location(req.body).create();
      return res.status(201).json(location);
    } catch (err) {
      const error = new CustomError(err, 209);
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const location = await new Location(req.body).update(req.params.id);
      return res.status(200).json(location);
    } catch (err) {
      const error = new CustomError(err, 209);
      return next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      await Location.destroy(req.params.id);
      return res.status(200).json();
    } catch (err) {
      const error = new CustomError(err, 209);
      return next(error);
    }
  }
}

export default new LocationsController();
