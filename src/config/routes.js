import Router from 'express';
import UsersController from '../controllers/users.js';
import UserSessionsController from '../controllers/userSessions.js';
import LocationsController from '../controllers/locations.js';
import SchedulingsController from '../controllers/schedulings.js';
import AuthMiddleware from '../middlewares/authByJWT.js';

const routes = new Router();
routes.use(AuthMiddleware);

routes.get('/users', UsersController.index);
routes.post('/users', UsersController.create);

routes.get('/locations', LocationsController.index);
routes.post('/locations', LocationsController.create);

routes.get('/schedulings', SchedulingsController.index);
routes.post('/schedulings', SchedulingsController.create);

routes.post('/session', UserSessionsController.create);

export default routes;