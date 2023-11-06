const express = require('express')
const path = require('path')
const dotenv = require('dotenv').config();
const cors = require('cors')
const { graphqlHTTP} = require('express-graphql')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const schema = require('./schema/schema')
const port = process.env.PORT || 8000
connectDB();

const app = express()
app.use(cors())
app.use(express.json())
app.use('/graphql',
        graphqlHTTP({
                schema,
                graphiql: process.env.NODE_ENV === 'development'
            }
        )
)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(port, () => console.log(`Server is running at port ${port}`));
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})