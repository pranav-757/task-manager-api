const mongoose = require('mongoose')

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
    },
    completed: {
        type: Boolean,
        default: false
    }
})

module.exports = Task