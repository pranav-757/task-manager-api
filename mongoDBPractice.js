const MONGODB = require('mongodb')
const {MongoClient, ObjectID} = MONGODB;

const connectionURL = "mongodb://127.0.0.1:27017"
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, {useNewUrlParser: true}, async (error, client) => {
    if(error) {
        console.log('error in connecting to mongoDB')
        return;
    }
    const db = client.db(databaseName)

   await db.collection('test').insertMany([
        {
        age: 20,
        status: 'good',
        name: 'A' 
        },
        {
            age: 15,
            status: 'bad',
            name: 'e'
        },
        {
            age: 25,
            status: 'bad',
            name: 'b'
        },
        {
            age: 28,
            status: 'good',
            name: 'c'
        },
        {
            age: 18,
            status: 'best',
            name: 'd'
        }
    ])

    console.log("data inserted successfully")
    //find all with age>=20
    db.collection('test').find({age: {$gte: 20}}).toArray((error, result) => {
       // console.log("#1", result)
    })

    //find all with status good or bad
    db.collection('test').find({
        $or : [{status: 'good'}, {status: 'best'}]
    }).toArray((error, result) => {
        //console.log("#2", result)
    })

    //find all >=20 and good
    db.collection('test').find(
        {age: {$gte : 20}, status: 'good'},
        {name: 1, _id:0}  // only fields with 1 will be shown
        //this seems tobe working in robo-3t but not here
    ).toArray((error, result) => {
        if(error) {
            console.log("#3", error)
        }
        console.log("#3",result)
    })
})