const graphql = require('graphql')
const {
    GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean
} = graphql
const { OrderedItemType, AddressType, ItemType, QuotationType } = require('./graphQLType')
const Client = require("../models/clientModel");
const protect = require("../middleware/authMiddleware");
const Quotation = require("../models/quotationModel");

const Address = require("../models/addressModel");
const OrderedItems = require("../models/orderedItems")
const Item = require("../models/itemModel");
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
        addAddress: {
            type: AddressType, // Assuming you have an AddressType defined
            args: {
                street: { type: GraphQLString },
                city: { type: GraphQLString },
                state: { type: GraphQLString },
                province: { type: GraphQLString },
                country: { type: GraphQLString },
                postalCode: { type: GraphQLString },
            },
            resolve(parent, args) {
                const address = new Address({
                    street: args.street,
                    city: args.city,
                    state: args.state,
                    province: args.province,
                    country: args.country,
                    postalCode: args.postalCode,
                });
                return address.save();
            },
        },
        // Delete a client
        deleteAddress: {
            type: AddressType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return Client.findByIdAndRemove(args.id);
            },
        },
        addresses: {
            type: new GraphQLList(AddressType),
            resolve() {
                return Address.find();
            }
        },
        address: {
            type: AddressType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Address.findById(args.id);
            },
        },
        items: {
            type: new GraphQLList(ItemType),
            resolve() {
                return Item.find();
            }
        },
        item: {
            type: ItemType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Item.findById(args.id);
            },
        },
        addItem: {
            type: ItemType, // Assuming you have an ItemType defined
            args: {
                name: { type: GraphQLString },
                quantity: { type: GraphQLInt },
            },
            resolve(parent, args) {
                const item = new Item({
                    name: args.name,
                    quantity: args.quantity,
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
