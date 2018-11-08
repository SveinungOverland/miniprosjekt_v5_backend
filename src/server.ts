import { config as dotenvConfig } from 'dotenv'
// Initialize .env file
dotenvConfig()
import * as express from 'express'
import { json as bodyParserJSON } from 'body-parser'
import * as mongoose from 'mongoose'

import * as morgan from 'morgan'

// Import routes
import routes from './api/routes'


// Init server and bodyparser
const server = express()
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
        response.send(200)
    } else {
        next()
    }
}) 
server.use("/api", routes)

server.listen(PORT, () => console.log(`Listening on port: ${ PORT }`))

export default server