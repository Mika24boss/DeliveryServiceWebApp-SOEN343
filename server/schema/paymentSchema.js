const graphql = require('graphql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {
    GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean
} = graphql
const Payment = require('../models/paymentModel')
const { PaymentType, OrderedItemType } = require('./graphQLType')
const OrderedItems = require("../models/orderedItems");

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        payments: {
            type: new GraphQLList(PaymentType),
            resolve() {
                return Payment.find();
            }
        },
        payment: {
            type: PaymentType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Payment.findById(args.id);
            },
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
            async resolve(parent, args) {
                const payment = new Payment({
                    methodOfPayment: args.methodOfPayment,
                    dateOfPayment: new Date(),
                    amount: args.amount,
                });
                return payment.save();
            },
        },
        // Delete an order
        deletePayment: {
            type: PaymentType,
            args: {
                orderID: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return Payment.findByIdAndRemove(args.id);
            },
        },
        payments: {
            type: new GraphQLList(PaymentType),
            resolve() {
                return Payment.find();
            }
        },
        payment: {
            type: PaymentType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Payment.findById(args.id);
            },
        },
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
