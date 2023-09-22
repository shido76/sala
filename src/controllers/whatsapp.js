class WhatsAppController {
  async index(req, res) {
    res.status(200).json({ msg: 'Start ok!' });
  }

}

export default new WhatsAppController();