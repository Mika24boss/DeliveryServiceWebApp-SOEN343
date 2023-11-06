const graphql = require('graphql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean } = graphql
const Payment = require('../models/paymentModel')
const { PaymentType} = require('./graphQLType')

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        payments: {
            type: new GraphQLList(PaymentType),
            resolve() {
                return Payment.find();
            }
        },
    },
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // @desc Register new Payment
        // @access Public
        addPayment: {
            type: PaymentType, // Assuming you have a PaymentType defined
            args: {
                methodOfPayment: { type: GraphQLString },
                dateOfPayment: { type: GraphQLString },
                amount: { type: GraphQLFloat },
            },
            resolve(parent, args) {
                const payment = new Payment({
                    methodOfPayment: args.methodOfPayment,
                    dateOfPayment: args.dateOfPayment,
                    amount: args.amount,
                });
                return payment.save();
            },
        },
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
