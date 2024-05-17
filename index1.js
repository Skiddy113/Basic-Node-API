const Joi = require('joi'); //used to validate responses 
const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Import uuid library and alias v4 method as uuidv4
const app = express();
app.use(express.json());
var mongo = require('mongodb');

const courses = [
    { id: uuidv4(), name: 'course1'},
    { id: uuidv4(), name: 'course2'},
    { id: uuidv4(), name: 'course3'},
];

//http get method for data access
app.get(`/`, (req,res) => {
    res.send('Hello World');
});

//returns all courses through http get method
app.get('/api/courses', (req,res) => {
    res.send(courses);
});

//returns course selected by http get method
app.get('/api/courses/:id', (req,res) => {
    const course = courses.find(c => c.id === req.params.id);
    if (!course) return res.status(404).send('The course with given id was not found');
    res.status(200).send(course);
});

//post method to add new obj to array without duplication of array
app.post('/api/courses', (req, res) => {
    // Check if the course with the same ID already exists
    const existingCourse = courses.find(course => course.id === req.body.id);
    if (existingCourse) {
        return res.status(400).send('Course with the provided ID already exists.');
    }

    const course = {
        id: uuidv4(),
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});


//http put method to update data changed to patch
app.patch('/api/courses/:id', (req,res) => {
    const course = courses.find(c => c.id === req.params.id);//look up course
    if (!course) return res.status(404).send('The course with given id was not found');//if non exist return 404
    
    const { error } = validateCourse(req.body); //object destructor = result.error //validate
    if (error) return res.status(400).send(error.details[0].message);// if invalid return 400 - bad request

    course.name = req.body.name;//update course
    res.send(course);//return the updated course
});

//form validation
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
};

//http delete method for selected id
app.delete('/api/courses/:id', (req,res) => {
    //look up course, if non exist error 404
    const course = courses.find(c => c.id === req.params.id);
    if (!course) return res.status(404).send('The course with given id was not found');

    //delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    //return deleted course
    res.send(course);
});

//selecting/defining a port environment port selected 5000
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Running on port ${port}...`));