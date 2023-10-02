import Location from '../models/location.js';
import CustomError from '../lib/customError.js';

class LocationsController {
  async index(req, res) {
    const locations = await Location.findAll();
    res.status(200).json({ locations });
  }

  async create(req, res, next) {
    const location = new Location();

    try {
      await location.create(req.body);
      return res.status(201).json();
    } catch (err) {
      const error = new CustomError(err, 209);
      return next(error);
    }
  }
}

export default new LocationsController();
