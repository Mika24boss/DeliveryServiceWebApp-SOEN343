const graphql = require('graphql')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean } = graphql
const {GraphQLDateTime} = require('graphql-iso-date')
const ClientOrderJoin = require('../models/ClientOrderModel')
const {ClientOrderJoinType } = require('./graphQLType')

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
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
        // @desc Register new ClientOrderJoin
        // @access Public
        addClientOrderJoin: {
            type: ClientOrderJoinType, // Assuming you have a ClientOrderJoinType defined
            args: {
                clientID: { type: GraphQLID },
                orderID: { type: new GraphQLList(GraphQLID) },
                location: { type: GraphQLString },
                arrivalEstimatedTime: { type: GraphQLDateTime },
            },
            resolve(parent, args) {
                const clientOrderJoin = new ClientOrderJoin({
                    clientID: args.clientID,
                    orderID: args.orderID,
                    location: args.location,
                    arrivalEstimatedTime: args.arrivalEstimatedTime,
                });
                return clientOrderJoin.save();
            },
        }
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
