const graphql = require('graphql')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean } = graphql
const Item = require('../models/itemModel')
const {ItemType} = require('./graphQLType')

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        items: {
            type: new GraphQLList(ItemType),
            resolve() {
                return Item.find();
            }
        },
    },
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // @desc Register new Item
        // @access Public
        addItem: {
            type: ItemType, // Assuming you have an ItemType defined
            args: {
                name: { type: GraphQLString },
                isFragile: { type: GraphQLBoolean },
                price: { type: GraphQLFloat },
            },
            resolve(parent, args) {
                const item = new Item({
                    name: args.name,
                    isFragile: args.isFragile,
                    price: args.price,
                });
                return item.save();
            },
        },
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});