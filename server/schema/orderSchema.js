const graphql = require('graphql')
const {
    GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean
} = graphql
const { GraphQLDateTime } = require('graphql-iso-date')
const Order = require('../models/orderModel')
const ClientOrderJoin = require('../models/ClientOrderModel')
const { OrderType, AdminType } = require('./graphQLType')
const DeliveryMan = require('../models/deliverManModel')
const protect = require('../middleware/authMiddleware')
const Client = require('../models/clientModel')
const Person = require('../models/personModel')
const Admin = require('../models/adminModel')
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        orders: {
            type: new GraphQLList(OrderType),
            resolve() {
                return Order.find();
            }
        },
        order: {
            type: OrderType,
            args: { id: { type: GraphQLInt } },
            resolve(parent, args) {
                return Order.findOne({ orderID: { $eq: args.id } });
            },
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
                orderID: { type: GraphQLInt },
                orderItems: { type: new GraphQLList(GraphQLID) },
                payment: { type: GraphQLID }
            },
            async resolve(parent, args, context) {
                const user = await Person.findById(protect(context.headers['authorization']).id).select('-password');
                const order = new Order({
                    orderID: args.orderID,
                    orderDate: new Date(),
                    status: "PAID",
                    orderItems: args.orderItems,
                    payment: args.payment,
                });
                await order.save();
                await Client.findOneAndUpdate(
                    { _id: user._id },
                    { $push: { order: order._id } },
                    { new: true }
                );
                return order;
            },
        },
        assignOrder: {
            type: OrderType,
            args: {
                orderID: { type: GraphQLNonNull(GraphQLInt) },
                deliveryManID: { type: GraphQLID },
            },
            async resolve(parent, args, context) {
                const admin = await Admin.findById(protect(context.headers['authorization']).id).select('-password');
                if (!admin) {
                    throw new Error('User not authorized')
                }
                console.log(args.deliveryManID)
                const deliveryMan = await DeliveryMan.findById(args.deliveryManID)
                console.log(deliveryMan);
                if (!deliveryMan) {
                    throw new Error('DeliveryMan not found')
                }
                const order = await Order.findOne({ orderID: { $eq: args.orderID } });

                await DeliveryMan.findOneAndUpdate(
                    { _id: deliveryMan._id },
                    {
                        $set: { 'numberOfOrder': deliveryMan.numberOfOrder + 1 },
                        $push: { 'orders': order._id }
                    },
                    { new: true }
                )
                return {
                    ...order._doc
                }
            }
        },
        // Delete an order
        deleteOrder: {
            type: OrderType,
            args: {
                orderID: { type: GraphQLInt },
            },
            async resolve(parent, args, context) {
                const admin = await Admin.findById(protect(context.headers['authorization']).id).select('-password');

                if (!admin) {
                    throw new Error('User not authorized')
                }
                const order = await Order.findOne({ orderID: { $eq: args.orderID } });

                if (order.status != "DELIVERED" || order.status != "DONE") {
                    throw new Error("Cannot delete Order")
                } else {
                    const deliveryMan = await DeliveryMan.findOne({ orders: { $in: [args.orderID] } })
                    if (deliveryMan) {
                        await DeliveryMan.findOneAndUpdate(
                            { _id: deliveryMan._id },
                            {
                                $set: { 'numberOfOrder': deliveryMan.numberOfOrder - 1 },
                                $pull: { 'orders': order._id }
                            },
                            { new: true }
                        )
                    }
                    return Order.findByIdAndRemove(args.orderID);
                }
            },
        },
        updateOrder: {
            type: OrderType,
            args: {
                orderID: { type: GraphQLInt },
                orderDate: { type: GraphQLString },
                status: { type: GraphQLString },
                payment: { type: GraphQLID },
                orderItems: { type: new GraphQLList(GraphQLID) }
            },
            async resolve(args, context) {
                const admin = await Admin.findById(protect(context.headers['authorization']).id).select('-password');
                if (!admin) {
                    throw new Error('User not authorized')
                }
                const order = await Order.findOne({ orderID: { $eq: args.orderID } });
                if (!order) {
                    throw new Error('Order not found')
                }
                if (args.orderDate) {
                    order.orderDate = args.orderDate;
                }
                if (args.status) {
                    order.status = args.status;
                }
                if (args.payment) {
                    order.payment = args.payment;
                }
                if (args.orderItems) {
                    order.orderItems = args.orderItems
                }
                await order.save();
                return order;
            }
        },
        updateOrderStatus: {
            type: OrderType,
            args: {
                orderID: { type: GraphQLInt },
                status: { type: GraphQLString },
            },
            async resolve(args, context) {
                const deliveryMan = await DeliveryMan.findById(protect(context.headers['authorization']).id).select('-password');
                if (!deliveryMan) {
                    throw new Error('User not authorized')
                }
                const order = await Order.findOne({ orderID: { $eq: args.orderID } });
                if (!order) {
                    throw new Error('Order not found')
                }
                if (args.status) {
                    order.status = args.status;
                }
                await order.save();
                return order;
            }
        }
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
