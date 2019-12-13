const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth')
const Task = require('../models/task')

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }  
})

router.get('/tasks', auth, async (req, res) => {
    var
        match = {},
        options = {},
        sort = {}

    //works for both true and false as query value is string
    if(req.query.completed) {
        match.completed = req.query.completed === 'true' ? true:false
    }

    //limit and skip
    if(req.query.limit && parseInt(req.query.limit) !=NaN) {
        options.limit = parseInt(req.query.limit)
    }
    if(req.query.skip && parseInt(req.query.skip) !=NaN) {
        options.skip = parseInt(req.query.skip)
    }
    //if options.limit is set only then pageNum makes sense
    if(options.limit && req.query.pageNum && parseInt(req.query.pageNum) !=NaN) {
        options.skip = parseInt(req.query.pageNum)*options.limit
    }

    //Sorting
    if(req.query.sortBy) {
        var parts = req.query.sortBy.split(":")
        sort[parts[0]] = parts[1] === 'desc'? -1:1
        options.sort = sort
    }

    try {
        //const tasks = await Task.find({owner: req.user._id})
        //await req.user.populate('tasks').execPopulate()
        await req.user.populate({
            path:'tasks',
            match: match,
            options : options
        }).execPopulate()

        res.send(req.user.tasks)
    } catch (error) {
        //using 500 becoz error could be 
        //unable to connect to DB
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
         //since using mongoose no need to convert _id(string) to new ObjectID(_id)
        //const task = await Task.findById(_id);
        const task = await Task.findOne({_id, owner: req.user._id})
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
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        const task = await Task.findById(req.params.id)
        if(!task) {
           return res.status(404).send()
        }

        updates.forEach(key => {
            task[key] = req.body[key]
        })
        await task.save()
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
