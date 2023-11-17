const graphql = require('graphql')
const {
    GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean
} = graphql
const OrderedItems = require('../models/orderedItems')
const { OrderedItemType, AddressType } = require('./graphQLType')
const Address = require("../models/addressModel");

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        orderedItems: {
            type: new GraphQLList(OrderedItemType),
            resolve() {
                return OrderedItems.find();
            }
        },
        orderedItem: {
            type: OrderedItemType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return OrderedItems.findById(args.id);
            },
        },
    },
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // @desc Register new OrderedItem
        // @access Public
        addOrderedItem: {
            type: OrderedItemType, // Assuming you have an OrderedItemType defined
            args: {
                size: { type: GraphQLString },
                quantity: { type: GraphQLInt },
                items: { type: new GraphQLList(GraphQLString) }, // Assuming you store item IDs as strings
            },
            resolve(parent, args) {
                const orderedItem = new OrderedItems({
                    size: args.size,
                    quantity: args.quantity,
                    items: args.items,
                });
                return orderedItem.save();
            },
        },
        // Delete an order
        deleteOrderedItem: {
            type: OrderedItemType,
            args: {
                orderID: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return OrderedItems.findByIdAndRemove(args.id);
            },
        },
        orderedItems: {
            type: new GraphQLList(OrderedItemType),
            resolve() {
                return OrderedItems.find();
            }
        },
        orderedItem: {
            type: OrderedItemType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return OrderedItems.findById(args.id);
            },
        },
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
