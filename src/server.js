import app from './app.js';

if (process.env.NODE_ENV === 'development') {
  console.info(process.env);
}

const server = app.listen(3003, () => {
  console.log('Server running on port 3003!!!');
});

process.on('uncaughtException', err => {
  console.error(err.name, err.message);
  console.error('Uncaught Exception occured! Shutting down...');
  process.exit(1);
});

process.on('unhandledRejection', err => {
  console.error(err.name, err.message);
  console.error('Unhandled rejection occured! Shutting down...');

  server.close(() => {
    process.exit(1);
  })
});