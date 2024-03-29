const graphql = require('graphql')
const {
    GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean
} = graphql
const Item = require('../models/itemModel')
const {ItemType, PaymentType} = require('./graphQLType')
const Payment = require("../models/paymentModel");

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        items: {
            type: new GraphQLList(ItemType),
            resolve() {
                return Item.find();
            }
        },
        item: {
            type: ItemType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Item.findById(args.id);
            },
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
                name: {type: GraphQLString},
                quantity: {type: GraphQLInt},
            },
            resolve(parent, args) {
                const item = new Item({
                    name: args.name,
                    quantity: args.quantity,
                });
                return item.save();
            },
        },
        // Deleting an item
        // deleteItem: {
        //     type: ItemType,
        //     args: {
        //         name: { type: GraphQLNonNull(GraphQLID) },
        //     },
        //     resolve(parent, args) {
        //         Item.find({ clientId: args.id }).then((projects) => {
        //             projects.forEach((project) => {
        //                 project.deleteOne();
        //             });
        //         });
        //
        //         return Item.findByIdAndRemove(args.id);
        //     },
        // },
        items: {
            type: new GraphQLList(ItemType),
            resolve() {
                return Item.find();
            }
        },
        item: {
            type: ItemType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Item.findById(args.id);
            },
        },
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
