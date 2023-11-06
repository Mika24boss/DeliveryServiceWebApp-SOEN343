const graphql = require('graphql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean } = graphql
const {GraphQLDateTime} = require('graphql-iso-date')
const Order = require('../models/orderModel')
const ClientOrderJoin = require('../models/ClientOrderModel')
const { OrderType} = require('./graphQLType')

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        orders: {
            type: new GraphQLList(OrderType),
            resolve() {
                return Order.find();
            }
        },
        clientOrders: {
            type: new GraphQLList(ClientOrderJoinType),
            resolve() {
                return ClientOrderJoin.find();
            }
        },
    },
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // @desc Register new Order
        // @access Public
        addOrder: {
            type: OrderType, // Assuming you have an OrderType defined
            args: {
                orderID: { type: GraphQLNonNull(GraphQLInt) },
                orderDate: { type: GraphQLNonNull(GraphQLString) },
                status: { type: GraphQLNonNull(GraphQLString) },
                payment: { type: GraphQLNonNull(GraphQLID) },
                orderItems: { type: GraphQLNonNull(new GraphQLList(GraphQLID)) },
            },
            resolve(parent, args) {
                const order = new Order({
                    orderID: args.orderID,
                    orderDate: args.orderDate,
                    status: args.status,
                    payment: args.payment,
                    orderItems: args.orderItems,
                });
                return order.save();
            },
        },
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
