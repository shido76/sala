import User from '../models/user.js';
import CustomError from '../lib/customError.js';

class UsersController {
  async index(req, res) {
    const users = await User.findAll();
    res.status(200).json({ users });
  }

  async create(req, res, next) {
    try {
      await new User().create(req.body);
      return res.status(201).json();
    } catch (err) {
      const error = new CustomError(err, 209);
      return next(error);
    }
  }
}

export default new UsersController();