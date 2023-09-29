import Router from 'express';
import UsersController from '../controllers/users.js';
import UserSessionsController from '../controllers/userSessions.js';
import AuthMiddleware from '../middlewares/authByJWT.js';

const routes = new Router();
routes.use(AuthMiddleware);

routes.get('/users', UsersController.index);
routes.post('/users', UsersController.create);
routes.post('/session', UserSessionsController.create);

export default routes;