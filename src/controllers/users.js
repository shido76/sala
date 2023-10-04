import User from '../models/user.js';
import CustomError from '../lib/customError.js';

class UsersController {
  async index(req, res) {
    const users = await User.findAll();
    res.status(200).json({ users });
  }

  async show(req, res) {
    const user = await User.find(req.params.id);
    return res.status(200).json(user);
  }

  async create(req, res, next) {
    try {
      const user = await new User(req.body).create();
      return res.status(201).json(user);
    } catch (err) {
      const error = new CustomError(err, 209);
      return next(error);
    }
  }

  async update(req, res, next) {
    try {
      const user = await new User(req.body).update(req.params.id);
      return res.status(200).json(user);
    } catch (err) {
      const error = new CustomError(err, 209);
      return next(error);
    }
  }

  async destroy(req, res, next) {
    try {
      await User.destroy(req.params.id);
      return res.status(200).json();
    } catch (err) {
      const error = new CustomError(err, 209);
      return next(error);
    }
  }
}

export default new UsersController();