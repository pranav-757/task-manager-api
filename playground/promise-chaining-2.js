require('../src/db/mongoose') //simply loads file, thus setting up connection with db
const Task = require('../src/models/task')


// Task.findByIdAndDelete('5d91305567647f6af0ec2d0c').then(tasks => {
//     console.log(tasks)
//     return Task.countDocuments({completed : false})
// }).then(result =>{
//     console.log(result)
// }).catch(e => {
//     console.log(e)
// })

const deleteTaskAndCount = async (id) => {
    //try {
        const task = await Task.findByIdAndDelete(id)
        if(!task)
            throw new Error('unable to find task')
        const count = await Task.countDocuments({completed : false})
        return count
   // } 
    
}

deleteTaskAndCount('5d91305567647f6af0ec2d0c').then(count => {
    console.log("count:", count);
}).catch(e => {
    console.log(e);
})