const express = require('express')
const dotenv = require('dotenv').config();
const cors = require('cors')
const {graphqlHTTP} = require('express-graphql')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const port = process.env.PORT || 8000
const addressSchema = require("./schema/addressSchema");
const clientOrderJoinsSchema = require("./schema/clientOrderJoinsSchema")
const itemSchema = require("./schema/itemSchema")
const orderedItemSchema = require("./schema/orderedItemSchema")
const orderSchema = require('./schema/orderSchema')
const paymentSchema = require('./schema/paymentSchema')
const peopleSchema = require("./schema/peopleSchema")
const quotationSchema = require("./schema/quotationSchema")
const requestSchema = require('./schema/requestSchema')
connectDB();

const app = express()
app.use(cors())
app.use(express.json())
app.use('/graphql/people', graphqlHTTP({
            schema: peopleSchema,
            graphiql: process.env.NODE_ENV === 'development'
        }
    )
)
app.use('/graphql/addresses', graphqlHTTP({
            schema: addressSchema,
            graphiql: process.env.NODE_ENV === 'development'
        }
    )
)
app.use('/graphql/clientOrderJoins', graphqlHTTP({
            schema: clientOrderJoinsSchema,
            graphiql: process.env.NODE_ENV === 'development'
        }
    )
)
app.use('/graphql/items', graphqlHTTP({
            schema: itemSchema,
            graphiql: process.env.NODE_ENV === 'development'
        }
    )
)
app.use('/graphql/orderedItems',
    graphqlHTTP({
            schema: orderedItemSchema,
            graphiql: process.env.NODE_ENV === 'development'
        }
    )
)
app.use('/graphql/orders',
    graphqlHTTP({
            schema: orderSchema,
            graphiql: process.env.NODE_ENV === 'development'
        }
    )
)
app.use('/graphql/create_request', graphqlHTTP({
    schema: requestSchema,
    graphiql: process.env.NODE_ENV === 'development'
}))
app.use('/graphql/payments',
    graphqlHTTP({
            schema: paymentSchema,
            graphiql: process.env.NODE_ENV === 'development'
        }
    )
)
app.use('/graphql/quotations',
    graphqlHTTP({
            schema: quotationSchema,
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