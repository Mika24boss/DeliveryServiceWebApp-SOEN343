const graphql = require('graphql')
const {
    GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean
} = graphql
const {GraphQLDateTime} = require('graphql-iso-date')
const Order = require('../models/orderModel')
const ClientOrderJoin = require('../models/ClientOrderModel')
const {OrderType, AdminType, QuotationType} = require('./graphQLType')
const DeliveryMan = require('../models/deliverManModel')
const protect = require('../middleware/authMiddleware')
const Client = require('../models/clientModel')
const Person = require('../models/personModel')
const Admin = require('../models/adminModel')
const Quotation = require("../models/quotationModel");
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        orders: {
            type: new GraphQLList(OrderType),
            resolve() {
                return Order.find();
            }
        },
        ordersForEachClient: {
            type: new GraphQLList(OrderType),
            args: {
                clientID: {type: GraphQLID}
            },
            async resolve(parent, args) {
                const client = await Client.findById(args.clientID);
                const orders = await Order.find({_id: {$in: client.order}});
                return orders;
            },
        },
        ordersForEachDeliveryMan: {
            type: new GraphQLList(OrderType),
            args: {
                deliveryManID: {type: GraphQLID}
            },
            async resolve(parent, args) {
                const deliveryMan = await DeliveryMan.findById(args.deliveryManID);
                const orders = await Order.find({_id: {$in: deliveryMan.orders}});
                return orders;
            },
        },
        orderForEachClient: {
            type: OrderType,
            args: {
                orderID: {type: GraphQLInt},
                clientID: {type: GraphQLID}
            },
            resolve(parent, args) {
                return Client.findById(args.clientID).order[args.orderID];
            },
        },
        orderForEachDeliveryMan: {
            type: OrderType,
            args: {
                orderID: {type: GraphQLInt},
                deliveryManID: {type: GraphQLID}
            },
            resolve(parent, args) {
                return DeliveryMan.findById(args.deliveryManID).orders[args.orderID];
            },
        },
    },
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        orders: {
            type: new GraphQLList(OrderType),
            resolve() {
                return Order.find();
            }
        },
        order: {
            type: OrderType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Order.findById(args.id);
            },
        },
        ordersForEachDeliveryMan: {
            type: new GraphQLList(OrderType),
            args: {
                deliveryManID: {type: GraphQLID}
            },
            async resolve(parent, args) {
                const deliveryMan = await DeliveryMan.findById(args.deliveryManID);
                const orders = await Order.find({_id: {$in: deliveryMan.orders}});
                return orders;
            },
        },
        orderForEachClient: {
            type: OrderType,
            args: {
                orderID: {type: GraphQLInt},
                clientID: {type: GraphQLID}
            },
            async resolve(parent, args) {
                const client = await Client.findById(args.clientID);
                return Order.findById(client.order[args.orderID])
            },
        },
        orderForEachDeliveryMan: {
            type: OrderType,
            args: {
                orderID: {type: GraphQLInt},
                deliveryManID: {type: GraphQLID}
            },
            async resolve(parent, args) {
                const deliveryMan = await DeliveryMan.findById(args.deliveryManID);
                return Order.findById(deliveryMan.orders[args.orderID])
            },
        },
        // @desc Register new Order
        // @access Public
        addOrder: {
            type: OrderType, // Assuming you have an OrderType defined
            args: {
                orderItems: {type: new GraphQLList(GraphQLID)},
                payment: {type: GraphQLID}
            },
            async resolve(parent, args, context) {
                const client = await Client.findById(protect(context.headers['authorization']).id).select('-password');
                const order = new Order({
                    orderID: 0,
                    orderDate: new Date(),
                    status: "PAID",
                    orderItems: args.orderItems,
                    payment: args.payment,
                });
                await order.save();
                await Client.findOneAndUpdate(
                    {_id: client._id},
                    {$push: {order: order._id}},
                    {new: true}
                );
                await client.save();
                order.orderID = client.order.length;
                await order.save();
                await Promise.all(client.order.map(async (orderID, index) => {
                    await Order.updateOne(
                        {_id: orderID},
                        {$set: {quotationID: index}}
                    );
                }));
                return order;
            },
        },
        ordersForEachClient: {
            type: new GraphQLList(OrderType),
            args: {
                clientID: {type: GraphQLID}
            },
            async resolve(parent, args) {
                const client = await Client.findById(args.clientID);
                const orders = await Order.find({_id: {$in: client.order}});
                return orders;
            },
        },
        assignOrder: {
            type: OrderType,
            args: {
                orderID: {type: GraphQLNonNull(GraphQLID)},
            },
            async resolve(parent, args, context) {
                const admin = await Admin.findById(protect(context.headers['authorization']).id).select('-password');
                if (!admin) {
                    throw new Error('User not authorized')
                }

                const order = await Order.findById(args.orderID);
                const deliveryMen = await DeliveryMan.find();
                if (!deliveryMen) {
                    return "No DeliveryMan to assign"
                }
                const deliveryMan = deliveryMen[Math.floor(Math.random() * deliveryMen.length)]
                await DeliveryMan.findOneAndUpdate(
                    {_id: deliveryMan._id},
                    {
                        $set: {'numberOfOrder': parseInt(deliveryMan.numberOfOrder) + 1},
                        $push: {'orders': order._id}
                    },
                    {new: true}
                )
                return {
                    ...order._doc
                }
            }
        },
        // Delete an order
        deleteOrderForDeliveryMan: {
            type: OrderType,
            args: {
                orderID: {type: GraphQLInt},
            },
            async resolve(parent, args, context) {
                const admin = await Admin.findById(protect(context.headers['authorization']).id).select('-password');

                if (!admin) {
                    throw new Error('User not authorized')
                }
                const order = await Order.findOne({orderID: {$eq: args.orderID}});

                if (order.status != "DELIVERED" || order.status != "DONE") {
                    throw new Error("Cannot delete Order")
                } else {
                    const deliveryMan = await DeliveryMan.findOne({orders: {$in: [args.orderID]}})
                    if (deliveryMan) {
                        await DeliveryMan.findOneAndUpdate(
                            {_id: deliveryMan._id},
                            {
                                $set: {'numberOfOrder': deliveryMan.numberOfOrder - 1},
                                $pull: {'orders': order._id}
                            },
                            {new: true}
                        )
                    }
                    return Order.findByIdAndRemove(args.orderID);
                }
            },
        },
        deleteOrderForClient: {
            type: OrderType,
            args: {
                orderID: {type: GraphQLInt},
                clientID: {type: GraphQLID}
            },
            async resolve(parent, args, context) {
                const admin = await Admin.findById(protect(context.headers['authorization']).id).select('-password');

                if (!admin) {
                    throw new Error('User not authorized')
                }
                let client = await Client.findById(args.clientID)
                const order = client.order[args.orderID];
                if (!order) throw new Error("order ID is not found")
                if (client) {
                    await Client.findOneAndUpdate(
                        {_id: client._id},
                        {
                            $pull: {'order': order._id}
                        },
                        {new: true}
                    )
                } else {
                    throw new Error('No client')
                }
                await client.save();
                client = await Client.findById(client._id);
                await Promise.all(client.quotations.map(async (orderId, index) => {
                    await Order.updateOne(
                        {_id: orderId},
                        {$set: {orderID: index}}
                    );
                }));
                return Order.findByIdAndRemove(order._id);

            }
        },
        updateOrder: {
            type: OrderType,
            args: {
                orderID: {type: GraphQLInt},
                orderDate: {type: GraphQLString},
                status: {type: GraphQLString},
                payment: {type: GraphQLID},
                orderItems: {type: new GraphQLList(GraphQLID)}
            },
            async resolve(args, context) {
                const admin = await Admin.findById(protect(context.headers['authorization']).id).select('-password');
                if (!admin) {
                    throw new Error('User not authorized')
                }
                const order = await Order.findOne({orderID: {$eq: args.orderID}});
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
                orderID: {type: GraphQLInt},
                status: {type: GraphQLString},
            },
            async resolve(args, context) {
                const deliveryMan = await DeliveryMan.findById(protect(context.headers['authorization']).id).select('-password');
                if (!deliveryMan) {
                    throw new Error('User not authorized')
                }
                const order = await Order.findOne({orderID: {$eq: args.orderID}});
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
