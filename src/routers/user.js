const express = require('express');
const router = new express.Router();
const User = require('../models/user')

//adding async here doesn't change the behavior of this function
// also express only cares about what functions being called on req and res
//so exress doesn't have any effect of adding async
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try{
        await user.save()
        res.status(201).send(user)
    } catch(e) {
        if(e.name === 'ValidationError')
           return res.status(412).send(e)

        res.status(400).send(e)
    }


    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch(e => {
    //     if(e.name === 'ValidationError')
    //        return res.status(412).send(e)

    //     res.status(400).send(e)
    // })
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        //using 500 becoz error could be 
        //unable to connect to DB
        res.status(500).send(error)
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
         //since using mongoose no need to convert _id(string) to new ObjectID(_id)
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send()
        }

        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/users/:id', async(req, res) => {
    var allowedUpdates = ['name', 'age', 'password', 'email'];
    const updates = Object.keys(req.body)

    const isValidOp = updates.every(update => allowedUpdates.includes(update))

    if(!isValidOp) {
        return res.status(400).send({error : 'Invalid update'});
    } 

    try {
        // findByIdAndUpdate bypasses the mongoose middleware therefore we need to
        //  re organise the code
        //await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});   
        const user = await User.findById(req.params.id)

        if(!user) {
            return res.status(404).send(user)
        }

        updates.forEach(key => {
            user[key] = req.body[key]
        })


        res.send(user)
    } catch(e) {
        res.status(400).send(e)
    }
    
})

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user)
           return res.status(404).send({error: "no user"})

        res.send(user);
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router;
