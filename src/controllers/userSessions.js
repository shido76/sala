import UserSession from "../models/userSession.js";

class UserSessionsController {
  async create(req, res) {
    const { email, password } = req.body;
    const userSession = await new UserSession(email, password);

    const token = await userSession.authenticate();
    const accessToken = token[0];
    const refreshToken = token[1];

    if (!accessToken)
      return res.status(401).json({ error: userSession.error['base']});

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'None', 
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    res.status(200).json({ accessToken });
  }

  update(req, res) {
    const userSession = new UserSession();

    if (!req.cookies?.refreshToken)
      return res.status(406).json({ error: 'Unauthorized' });

    const token = userSession.renovate(req.cookies.refreshToken);

    if(!token)
      return res.status(406).json({ error: 'Unauthorized' });

    const accessToken = token[0];
    const refreshToken = token[1];

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    res.status(200).json({ accessToken });
  }
}

export default new UserSessionsController();