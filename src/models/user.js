const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,  // need to explore more on mongoose schema validations
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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: "_id",
    foreignField: "owner"
})

//userSchema.methods.getPublicProfile = function() {
userSchema.methods.toJSON = function() {
    const user = this

    //toObject removes all extra functionalities from userObj
    // like save(), find() etc added by mongoose
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens

    return userObj
}

userSchema.methods.genrateAuthToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'nodecourse')

    //user.tokens = user.tokens.concat({token})
    user.tokens.push({token})

    await user.save()
    return token;
}

//no use of this so using new
userSchema.statics.findByCredentials = async ({email, password}) => {
    //NOTE: User isn't declared yet its declared later
    const user = await User.findOne({email})

    if(!user) {
        throw new Error('unable to login')
    }

    var isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch) {
        throw new Error('unable to login')
    }

    return user
}

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