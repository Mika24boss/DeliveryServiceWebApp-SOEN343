const graphql = require('graphql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean } = graphql
const {GraphQLDateTime} = require('graphql-iso-date')
const Person = require('../models/personModel')
const Admin = require('../models/adminModel')
const Client = require('../models/clientModel')
const Quotation = require('../models/quotationModel')
const Order = require('../models/orderModel')
const Address = require('../models/addressModel')
const Item = require('../models/itemModel')
const DeliveryMan = require('../models/deliverManModel')
const Payment = require('../models/paymentModel')
const OrderedItems = require('../models/orderedItems')
const ClientOrderJoin = require('../models/ClientOrderModel')
const { PersonType,
    AdminType,
    ClientType,
    QuotationType,
    OrderType,
    AddressType,
    ItemType,
    DeliveryManType,
    PaymentType,
    OrderedItemType,
    ClientOrderJoinType } = require('./graphQLType')

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        persons: {
            type: new GraphQLList(PersonType),
            resolve(parent, args) {
                return Person.find();
            }
        },
        person: {
            type: PersonType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Person.findById(args.id);
            },
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve() {
                return Client.find();
            }
        },
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Client.findById(args.id);
            },
        },
        admins: {
            type: new GraphQLList(AdminType),
            resolve() {
                return Admin.find();
            }
        },
        admin: {
            type: AdminType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Admin.findById(args.id);
            },
        },
        deliverymans: {
            type: new GraphQLList(DeliveryManType),
            resolve() {
                return DeliveryMan.find();
            }
        },
        deliveryman: {
            type: DeliveryManType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return DeliveryMan.findById(args.id);
            },
        },
        quotations: {
            type: new GraphQLList(QuotationType),
            resolve() {
                return Quotation.find();
            }
        },
        addresses: {
            type: new GraphQLList(AddressType),
            resolve() {
                return Address.find();
            }
        },
        orders: {
            type: new GraphQLList(OrderType),
            resolve() {
                return Order.find();
            }
        },
        items: {
            type: new GraphQLList(ItemType),
            resolve() {
                return Item.find();
            }
        },
        payments: {
            type: new GraphQLList(PaymentType),
            resolve() {
                return Payment.find();
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
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
