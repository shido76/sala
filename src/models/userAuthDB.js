import bcryptjs from 'bcryptjs';
import User from './user.js';

class UserAuthDB {
  static async authenticate(email, password) {
    let user = await User.findBy('email', email);
    user = user?.active ? user : null;

    if (user === null) return false;
    if (await bcryptjs.compare(password, user.passwordHash)) return user;
    return false;
  }
}

export default UserAuthDB;