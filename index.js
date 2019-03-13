const express = require('express');
const app = express();
const Joi = require('joi');
const log = require('./logging');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');

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
}

app.use(log);

dbDebugger("database connected...");


const courses = [
  {id: 1, name: 'course1'},
  {id: 2, name: 'course2'},
  {id: 3, name: 'course3'}
];

app.get('/', (req, res)=>{
  res.render('index', {title: "My Express App", message: "Hello"})
});

app.get('/api/courses', (req, res)=>{
  res.send(courses);
});

app.get('/api/courses/:id',(req, res)=>{
  const course = courses.find((c)=> c.id === parseInt(req.params.id));
  if(!course) return res.status(404).send('The course with given ID was not found.');
  res.send(course);
});

app.post('/api/courses', (req, res) => {
  const {error} = validateCourse(req.body);
  if(error){
      return res.status(400).send(error.details[0].message);
  }
    const course = {
      id: courses.length + 1,
      name: req.body.name
    };
      courses.push(course);
      res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
  //look for the course
  const course = courses.find((c)=> c.id === parseInt(req.params.id));
  if(!course) {
  //if no course return 404
    return res.status(404).send('The course with given ID was not found.');
  }
  const {error} = validateCourse(req.body);
  //validate new information
  if(error){ return res.status(400).send(error.details[0].message); }
  course.name = req.body.name;
  //update course and return to sender
  res.send(course);

});

app.delete('/api/courses/:id', (req, res) => {
  //look for the course
  const course = courses.find((c)=> c.id === parseInt(req.params.id));
  if(!course) {
  //if no course return 404
    return res.status(404).send('The course with given ID was not found.');
  }
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  res.send(course);
});

function validateCourse(course){
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, ()=>{console.log(`Listening on port ${port}...`)});
