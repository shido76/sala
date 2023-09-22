import Router from 'express';
//import WhatsAppController from '../controllers/whatsapp.js';
import AuthMiddleware from '../middlewares/auth.js';

const routes = new Router();
routes.use(AuthMiddleware);

//routes.get('/', WhatsAppController.index);
//routes.post('/sendText', WhatsAppController.sendText);

export default routes;