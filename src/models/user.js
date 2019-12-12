const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')

const userSchema = {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    }
};

//behind the scenes the function will be added to user object being saved
//with some propery name say 'check'. Now this function will be called
// as user.check() therfore this will refer to user object
userSchema.pre('save', async function(next) {
    const user = this; //this refers to user that is about to be saved

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8);
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User