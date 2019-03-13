const express = require('express');
const app = express();
const log = require('./logging');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

//routes
const home = require('./routes/home');
const courses = require('./routes/courses');

//start web server
const port = process.env.PORT || 3000;
app.listen(port, ()=>{console.log(`Listening on port ${port}...`)});

console.log('Application Name', config.get('name'));
console.log('Mail Server', config.get('mail.host'));
console.log('Mail Password', config.get('mail.password'));
//console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
//console.log(`app: $app.get('env')`);
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public')); //css, images
app.use(helmet());
if(app.get('env') === 'development'){
  app.use(morgan('tiny'));
  startupDebugger('Morgan enabled....');
  app.use(log);
}

//routing
app.use('/', home);
app.use('/api/courses', courses);
