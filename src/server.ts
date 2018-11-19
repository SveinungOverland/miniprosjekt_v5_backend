import { config as dotenvConfig } from 'dotenv'
// Initialize .env file
dotenvConfig()
import * as express from 'express'
import { json as bodyParserJSON } from 'body-parser'
import * as mongoose from 'mongoose'

import * as morgan from 'morgan'

import * as socket from 'socket.io'

// Import routes
import routes from './api/routes'

import { NewsModel } from './api/models'


// Init server and bodyparser
export const server = express()
server.use(bodyParserJSON())


const PORT = process.env.PORT || 3000
const URI: string = process.env.MONGODB_URI || "Something went wrong"

mongoose.connect(URI, { useNewUrlParser: true })
    .then(() => console.log("DB connected"))
    .catch((err: Error) => console.log("Connection error " + err))


server.use(morgan('dev'))


server.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*")
    response.header("Access-Control-Allow-Headers", "*")
    response.header("Access-Control-Allow-Methods", "*")
    if (request.method === 'OPTIONS') {
        response.sendStatus(200)
    } else {
        next()
    }
}) 
server.use("/api", routes)

export const http = server.listen(PORT, () => console.log(`Listening on port: ${ PORT }`))

export const io = socket(http)

io.on('connection', (_) => {
    console.log("User connected to socket")
    NewsModel.find({}).sort({ timestamp: 'desc'}).limit(5)
        .then(res => {
            res.reverse().forEach(item => {
                io.emit("news", item)
            })
        })
})

