const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'nodecourse')
        //console.log(decoded)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user) {
            //res.status()
            throw new Error()
        }
        //it helps to remove only specific token out of 
        // possible many tokens of a user
        req.token = token
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({error: 'Please authenticate'})
    }
}

module.exports = auth;