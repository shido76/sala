import { z } from 'zod';
import User from '../model/user.js';

class UsersController {
  async index(req, res) {
    res.status(200).json({ msg: 'Start ok!' });
  }

  async create(req, res) {
    const registerBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string(),
      numusp: z.string(),
      phone: z.string(),
    });

    const { email, password, name, numusp, phone } = registerBodySchema.parse(req.body);

    const user = new User();
  
    try {
      await user.create({ email, password, name, numusp, phone })
      return res.status(201).json();
    } catch (error) {
      return res.status(409).json({ message: error.message });
    }

  }

}

export default new UsersController();
