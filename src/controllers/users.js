import User from '../model/user.js';
import CustomError from '../lib/customError.js';

class UsersController {
  async index(req, res) {
    res.status(200).json({ msg: 'Start ok!' });
  }

  async create(req, res, next) {
    const user = new User();
  
    try {
      await user.create(req.body);
      return res.status(201).json();
    } catch (err) {
      const error = new CustomError(err, 209);
      return next(error);
    }
  }
}

export default new UsersController();
