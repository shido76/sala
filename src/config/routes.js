import Router from 'express';
import UsersController from '../controllers/users.js';
import AuthMiddleware from '../middlewares/auth.js';

const routes = new Router();
routes.use(AuthMiddleware);

routes.get('/users', UsersController.index);
routes.post('/users', UsersController.create);

export default routes;