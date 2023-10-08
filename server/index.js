const express = require('express')
const path = require('path')
require('dotenv').config();
const { graphqlHTTP} = require('express-graphql')
const port = process.env.PORT || 8000
const app = express()

/*app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development'
}))*/

app.listen(port, console.log(`Server running on port ${port}`))