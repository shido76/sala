import Router from 'express';
import SiteController from '../controllers/site.js';
import UsersController from '../controllers/users.js';
import UserSessionsController from '../controllers/userSessions.js';
import LocationsController from '../controllers/locations.js';
import SchedulingsController from '../controllers/schedulings.js';
import AuthMiddleware from '../middlewares/authByJWT.js';

const routes = new Router();
routes.use(AuthMiddleware);

routes.get('/', SiteController.index);

routes.get('/users', UsersController.index);
routes.post('/users', UsersController.create);
routes.get('/users/:id', UsersController.show);
routes.put('/users/:id', UsersController.update);
routes.delete('/users/:id', UsersController.destroy);

routes.get('/locations', LocationsController.index);
routes.post('/locations', LocationsController.create);
routes.get('/locations/:id', LocationsController.show);
routes.put('/locations/:id', LocationsController.update);
routes.delete('/locations/:id', LocationsController.destroy);

routes.get('/schedulings', SchedulingsController.index);
routes.post('/schedulings', SchedulingsController.create);
routes.get('/schedulings/:id', SchedulingsController.show);
routes.put('/schedulings/:id', SchedulingsController.update);
routes.delete('/schedulings/:id', SchedulingsController.destroy);

routes.post('/session', UserSessionsController.create);
routes.post('/session/renovate', UserSessionsController.update);

export default routes;