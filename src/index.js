const express = require('express')
require('./db/mongoose')  // simply require file ensures that files run and mongoose is connected to mongoDB
// const User = require('./models/user')
// const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

const multer = require('multer');
const upload = multer({
    dest: 'images'
})
app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
})