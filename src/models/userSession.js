import jwt from 'jsonwebtoken';
import UserAuthDB from './userAuthDB.js';
import CustomError from '../lib/customError.js';

class UserSession {
  constructor(email='', password='') {
    this.email = email;
    this.password = password;
    this.error = {
      base: ''
    }
  }

  generateAccessToken(userId) {
    return jwt.sign({
      sub: userId,
    }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
  }

  generateRefreshToken(userId) {
    return jwt.sign({
      sub: userId,
    }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
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

    const accessToken = this.generateAccessToken(user.id);
    const refreshToken = this.generateRefreshToken(user.id);
   
    return [accessToken, refreshToken];
   }

  renovate(refreshToken) {
    try {
      const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET);
      if(decodedToken) {
        const accessToken = this.generateAccessToken(decodedToken.sub);
        const refreshToken = this.generateRefreshToken(decodedToken.sub);
        return [accessToken, refreshToken];
      }
    } catch (err) {
      return false;
    }
  }
}

export default UserSession;