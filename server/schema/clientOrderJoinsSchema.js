const graphql = require('graphql')
const {
    GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean
} = graphql
const {GraphQLDateTime} = require('graphql-iso-date')
const ClientOrderJoin = require('../models/ClientOrderModel')
const Order = require('../models/orderModel')
const Client = require('../models/clientModel')
const {ClientOrderJoinType} = require('./graphQLType')

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        clientOrders: {
            type: new GraphQLList(ClientOrderJoinType),
            resolve() {
                return ClientOrderJoin.find();
            }
        },
        clientOrder: {
            type: ClientOrderJoinType,
            args: {
                clientID: {type: GraphQLID},
                orderID: {type: GraphQLID},
            },
            resolve(parent, args) {
                return ClientOrderJoin.find({clientID: args.clientID, orderID: args.orderID});
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
                clientID: {type: GraphQLID},
                orderID: {type: GraphQLID},
                location: {type: GraphQLString},
                arrivalEstimatedTime: {type: GraphQLDateTime},
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
        },
        deleteClientOrderJoin: {
            type: ClientOrderJoinType,
            args: {
                orderID: {type: GraphQLID},
            },
            resolve: async (_, args) => {
                const clientOrderJoin = await ClientOrderJoin.findOne({orderID: args.orderID});

                if (!clientOrderJoin) {
                    throw new Error('ClientOrderJoin Entry not found')
                }

                const client = await Client.findByIdAndRemove(clientOrderJoin.clientID);

                // Delete the order
                const deletedOrder = await Order.findByIdAndRemove(orderID);

                // If the order is found and deleted, delete the ClientOrderJoin entry
                if (deletedOrder) {
                    return await clientOrderJoin.remove();
                }
            }
        }
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
