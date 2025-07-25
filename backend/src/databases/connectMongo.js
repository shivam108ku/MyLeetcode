const mongoose = require('mongoose')

const connectMongo = async()=>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL)
        console.log("MongoDb Connected")        
    } catch (error) {
        console.log("Error in connection",error.message)
        process.exit(1)
    }
}

module.exports = connectMongo;