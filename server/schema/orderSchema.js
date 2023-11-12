const graphql = require('graphql')
const {
    GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean
} = graphql
const {GraphQLDateTime} = require('graphql-iso-date')
const Order = require('../models/orderModel')
const ClientOrderJoin = require('../models/ClientOrderModel')
const {OrderType} = require('./graphQLType')
const DeliveryMan = require('../models/deliverManModel')
const {protect} = require('../middleware/authMiddleware')
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        orders: {
            type: new GraphQLList(OrderType),
            resolve() {
                return Order.find();
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
                orderID: {type: GraphQLNonNull(GraphQLInt)},
                status: {type: GraphQLString},
                orderItems: {type: new GraphQLList(GraphQLID)},
                payment: {type: GraphQLID}
            },
            async resolve(parent, args, context) {
                const {req} = context;
                console.log(req.headers['authorization']);
                await protect(req);
                if (!req.user) {
                    throw new Error('User not found')
                }

                const order = new Order({
                    orderID: args.orderID,
                    orderDate: new Date(),
                    status: args.status,
                    orderItems: args.orderItems,
                    payment: args.payment,
                });
                await order.save();

                await Client.findOneAndUpdate(
                    {_id: req.user.id}, // Assuming req.user.id is the client's ID
                    {$push: {order: order._id}},
                    {new: true}
                );
                return order;
            },
        },
        // Delete an order
        deleteOrder: {
            type: OrderType,
            args: {
                orderID: {type: GraphQLNonNull(GraphQLID)},
            },
            async resolve(parent, args, context) {
                const {req} = context;

                await protect(req);

                if (!req.user) {
                    throw new Error('User not found')
                }

                if (req.user.role !== "HR-ADMIN" || req.user.role !== "TECHNOLOGY-ADMIN" || req.user.role !== "FINANCE-ADMIN" ||
                    req.user.role !== "GENERAL-ADMIN") {
                    throw new Error('User not authorized')
                }
                const order = await Order.findById(args.orderID);

                if (order.status != "DELIVERED" || order.status != "DONE") {
                    throw new Error("Cannot delete Order")
                } else {
                    const deliveryMan = await DeliveryMan.findOne({orders: {$in: [args.orderID]}})
                    if (deliveryMan) {
                        await DeliveryMan.findOneAndUpdate(
                            {_id: deliveryMan._id},
                            {$pull: {'orders': args.orderID}},
                            {new: true}
                        )
                    }
                    return Order.findByIdAndRemove(args.orderID);
                }
            },
        },
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
