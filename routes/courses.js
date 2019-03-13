const express = require('express');
const router = express.Router();
const Joi = require('joi');


const courses = [
  {id: 1, name: 'course1'},
  {id: 2, name: 'course2'},
  {id: 3, name: 'course3'}
];


router.get('/', (req, res)=>{
  res.send(courses);
});

router.get('/:id',(req, res)=>{
  const course = courses.find((c)=> c.id === parseInt(req.params.id));
  if(!course) return res.status(404).send('The course with given ID was not found.');
  res.send(course);
});

router.post('/', (req, res) => {
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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
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

module.exports = router;