const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth')
const User = require('../models/user')
const sharp = require('sharp')
const multer = require('multer')
const { sendWelcomeEmail, sendGoodByeEmail } =require('../emails/account')

//adding async here doesn't change the behavior of this function
// also express only cares about what functions being called on req and res
//so exress doesn't have any effect of adding async
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.genrateAuthToken()
        //res.status(201).send({user: user.getPublicProfile(), token})
        res.status(201).send({user, token})
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

router.post('/users/login', async (req, res) => {
    try {
        //findByCredentials is generic, defined on schema for all 
        const user = await User.findByCredentials(req.body)
        //genrateAuthToken is specific method as each user will have its own token
        //therefore its being executed on user instance
        const token = await user.genrateAuthToken()

        res.send({user, token})
    } catch (error) {
        //[pranavg]unable to send error
        res.status(400).send({error})
    }
})
/*
router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        //using 500 becoz error could be 
        //unable to connect to DB
        res.status(500).send(error)
    }
})
*/
router.get('/users/me', auth, async (req, res) => {
   res.send(req.user)
})

router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token != req.token
        })

        await req.user.save()
        res.send()
    }catch(error) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []

        await req.user.save()
        res.send()
    }catch(error) {
        res.status(500).send()
    }
})

//[pranavg] why call to '/users/me firring call to this route also'
// router.get('/users/:id', auth, async (req, res) => {
//     const _id = req.params.id

//     try {
//          //since using mongoose no need to convert _id(string) to new ObjectID(_id)
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })

router.patch('/users/me', auth, async(req, res) => {
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
        /*
        adding auth
        const user = await User.findById(req.params.id)

        if(!user) {
            return res.status(404).send(user)
        }
        */ 
       
        updates.forEach(key => {
            req.user[key] = req.body[key]
        })

        await req.user.save()
        res.send(req.user)
    } catch(e) {
        res.status(400).send(e)
    }
    
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.params.id);
        // if(!user)
        //    return res.status(404).send({error: "no user"})

        await req.user.remove()
        sendGoodByeEmail( req.user.email, req.user.name)
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error)
    }
})

const upload = multer({
    //dest: 'avaatar',
    limits: {
        fileSize: 100000000
    },
    fileFilter(req, file, cb) {
        file.originalname.endsWith('.jpg')
        if(!file.originalname.match(/\.(jpeg|png|jpg)/)) {
            return cb(new Error('unsupported file format'))
        }

        cb(undefined, true)
        //cb(undefined, false) simply reject the upload
    }
})
router.post('/users/me/avaatar', auth, upload.single('avaatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    //req.user.avaatar = req.file.buffer
    req.user.avaatar = buffer
    await req.user.save()
    res.send()
},(error, req, res, next) =>{
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avaatar',auth,  async (req, res) => {
    req.user.avaatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avaatar', async (req, res) => {
    try {
        const user = User.findById(req.user._id)

        if(!user || !user.avaatar) 
            throw new Error()
        res.set('Content-Type', 'image/png')
        res.send(user.avaatar)
    } catch (error) {
        res.status(400).send()
    }
})


module.exports = router;
