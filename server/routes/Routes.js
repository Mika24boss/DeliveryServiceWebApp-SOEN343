const express = require('express')
const router = express.Router()
const {graphqlHTTP} = require("express-graphql");
const schema = require("../schema/schema");
router.route('/:customEndpoint', async (res, req) => {
        if (req.params.customEndpoint ==='people') {
            graphqlHTTP({
                    schema,
                    graphiql: process.env.NODE_ENV === 'development'
                }
            )
        } else if (req.params.customEndpoint ==='addresses') {
            graphqlHTTP({
                    schema,
                    graphiql: process.env.NODE_ENV === 'development'
                }
            )
        } else if (req.params.customEndpoint ==='clientorderjoins') {
            graphqlHTTP({
                    schema,
                    graphiql: process.env.NODE_ENV === 'development'
                }
            )
        } else if (req.params.customEndpoint ==='items') {
            graphqlHTTP({
                    schema,
                    graphiql: process.env.NODE_ENV === 'development'
                }
            )
        } else if (req.params.customEndpoint ==='ordereditems') {
            graphqlHTTP({
                    schema,
                    graphiql: process.env.NODE_ENV === 'development'
                }
            )
        } else if (req.params.customEndpoint ==='orders') {
            graphqlHTTP({
                    schema,
                    graphiql: process.env.NODE_ENV === 'development'
                }
            )
        } else if (req.params.customEndpoint ==='payments') {
            graphqlHTTP({
                    schema,
                    graphiql: process.env.NODE_ENV === 'development'
                }
            )
        } else if (req.params.customEndpoint ==='quotations') {
            graphqlHTTP({
                    schema,
                    graphiql: process.env.NODE_ENV === 'development'
                }
            )
        }
    }
)
module.exports = router