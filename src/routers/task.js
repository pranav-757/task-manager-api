const express = require('express');
const router = new express.Router();
const Task = require('../models/task')

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }  
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (error) {
        //using 500 becoz error could be 
        //unable to connect to DB
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id

    try {
         //since using mongoose no need to convert _id(string) to new ObjectID(_id)
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', async(req, res) => {
    const allowedUpdates = ['description', 'completed'];
    const  updates = Object.keys(req.body);

    const isValidOp = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOp) {
        res.status(400).send({error: 'Invalid update'})
    }

    try{
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        if(!task) {
           return res.status(404).send()
        }
        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if(!task)
        // return is mandatory else we get error 
        //UnhandledPromiseRejectionWarning: Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
           return res.status(404).send({error: "no task"})

        res.send(task);
    } catch (error) {
        res.status(500).send(error)
    }
})


module.exports = router;
