const mongodb = require('mongodb')

const {MongoClient, ObjectID} = mongodb

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'


//connect is an async operation. that's why all insertion statements are in callback 
MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if(error) {
        return console.log('Unable to connect to database');
    }

    console.log('Connected correctly')
    const db = client.db(databaseName)
    const myId = new ObjectID()

    /* both prints the string version of id
    console.log(myId);
    console.log(myId.toHexString())
    */

    // db.collection('users').insertOne({
    //     name : 'pranav',
    //     age :27
    // }, (error, result) => {
    //     if(error) {
    //         return console.log('unable to insert user')
    //     }

    //     console.log(result.ops)
    // })

   /* db.collection('tasks').insertMany([
        {
            description : 'clean house',
            completed :true
        },
        {
            description : 'watering the plants',
            completed: true
        },
        {
            description : 'take medicine',
            completed: false
        }
    ], (error, result) => {
        if(error) {
           return console.log('unable to insert data')
        }

        console.log(result.ops)
    })*/

    /*
    db.collection('users').findOne({name : 'pranav', age : 27}, (error, user) => {
        if(error) {
            return console.log('Unable to find user');
        }

        console.log(user)
    })*/

    // //to search by ID we have to do differently

    /*db.collection('users').findOne({_id: new ObjectID("5d90894238099268dc6e4d66")}, (error, user) => {
        if(error) {
            return console.log('Unable to find user');
        }

        console.log(user)
    })*/

    //multiple search results must call toArray()
    // db.collection('tasks').find({completed:true}).toArray((error, tasks) => {
    //     console.log(tasks)
    // })

    db.collection('test').insertOne({
        _id: myId,
        text : 'sample docs fro practice'
    })
})