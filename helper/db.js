const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost/User',
{ useNewUrlParser: true, 
  useUnifiedTopology: true
 })
.then(()=>{
console.log("Connected to mongodb...")
})
.catch(()=>{
console.log("Cannot connect to mongodb")
})

mongoose.connection.on('connected',()=>{
    console.log("mongoose Connected to db..")
})

mongoose.connection.on('error',(err)=>{
    console.log(err.message)
})

mongoose.connection.on('disconnected',(err)=>{
    console.log("mongoose connection is disconnected")
})


process.on('SIGINT',async()=>{
    await mongoose.connection.close()
    process.exit(0)
})
