class SiteController {
  index(req, res) {
    return res.status(200).json({ message: 'Welcome to the API' });
  }
}

export default new SiteController();