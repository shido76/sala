import jwt from 'jsonwebtoken';
import UserAuthDB from './userAuthDB.js';

class UserSession {
  constructor(email, password) {
    this.email = email;
    this.password = password;
    this.error = {
      base: ''
    }
  }

  async authenticate() {
    if (!this.email || !this.password) {
      this.error.base = 'Invalid email or password';
      return false;
    }

    const user = await UserAuthDB.authenticate(this.email, this.password);

    if (!user) {
      this.error.base = 'Invalid email or password';
      return false;
    }

    return jwt.sign({
      id: user.id,
    }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
   }
}

export default UserSession;