require('../src/db/mongoose')
const User = require('../src/models/user')

// User.findByIdAndUpdate('5c1a5a34d5a2ec046ca8f6bc', { age: 1 }).then((user) => {
//     console.log(user)
//     return User.countDocuments({ age: 1 })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const updateAge = async (id, age) =>{
    const user = await User.findByIdAndUpdate(id, {age})
    const count = await User.countDocuments({age})

    return count
}

updateAge('5d9086a70a93a568cdd29dbf', 34).then(count => {
    console.log(count)
}).catch(e =>{
    console.log(e)
})
