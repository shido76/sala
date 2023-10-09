import Location from '../models/location.js';
import CustomError from '../lib/customError.js';
import LocationPolicy from '../policies/location.js';
import User from '../models/user.js';

async function authorize(userId, record, action) {
  const user = await User.find(userId);
  const rec = (record instanceof String) ? await Location.find(record) : record;

  return new LocationPolicy(user, rec).can(action);
}

class LocationsController {
  async index(req, res) {
    const locations = await Location.findAll();
    res.status(200).json({ locations });
  }

  async show(req, res) {
    const location = await Location.find(req.params.id);

    if (!await authorize(req.userId, location, 'show'))
      return res.status(403).json({ error: 'Show Location Forbidden' });

    return res.status(200).json(location);
  }

  async create(req, res, next) {
    try {
      if (!await authorize(req.userId, req.body, 'create'))
        return res.status(403).json({ error: 'Create Location Forbidden' });

      const location = await new Location(req.body).create();
      return res.status(201).json(location);
    } catch (err) {
      const error = new CustomError(err, 209);
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      if (!await authorize(req.userId, req.params.id, 'update'))
        return res.status(403).json({ error: 'Update Location Forbidden' });

      const location = await new Location(req.body).update(req.params.id);
      return res.status(200).json(location);
    } catch (err) {
      const error = new CustomError(err, 209);
      return next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      if (!await authorize(req.userId, req.params.id, 'destroy'))
        return res.status(403).json({ error: 'Destroy Location Forbidden' });

      await Location.destroy(req.params.id);
      return res.status(200).json();
    } catch (err) {
      const error = new CustomError(err, 209);
      return next(error);
    }
  }
}

export default new LocationsController();
