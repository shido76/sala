import UserSession from "../models/userSession.js";

class UserSessionsController {
  async create(req, res) {
    const { email, password } = req.body;
    const userSession = await new UserSession(email, password);

    const token = await userSession.authenticate();

    if (!token) {
      return res.status(401).json({ error: userSession.error['base']});
    }

    res.status(200).json({ token });
  }
}

export default new UserSessionsController();