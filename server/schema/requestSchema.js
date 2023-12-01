const graphql = require('graphql')
const {
    GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean
} = graphql
const {OrderedItemType, AddressType, ItemType, QuotationType, OrderType, PaymentType} = require('./graphQLType')
const Client = require("../models/clientModel");
const protect = require("../middleware/authMiddleware");
const Quotation = require("../models/quotationModel");

const Address = require("../models/addressModel");
const OrderedItems = require("../models/orderedItems")
const Item = require("../models/itemModel");
const Admin = require("../models/adminModel");
const {GraphQLDateTime} = require("graphql-iso-date");
const Order = require("../models/orderModel");
const Payment = require("../models/paymentModel");
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
            args: {id: {type: GraphQLID}},
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
                items: {type: new GraphQLList(GraphQLID)}, // Assuming you store item IDs as strings
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
                orderID: {type: GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args) {
                return OrderedItems.findByIdAndRemove(args.id);
            },
        },
        quotationForEachClient: {
            type: new GraphQLList(QuotationType),
            args: {
                clientID: {type: GraphQLID}
            },
            async resolve(parent, args) {
                const client = await Client.findById(args.clientID);
                const quotations = await Quotation.find({_id: {$in: client.quotations}});
                return quotations;
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
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return OrderedItems.findById(args.id);
            },
        },
        addAddress: {
            type: AddressType, // Assuming you have an AddressType defined
            args: {
                street: {type: GraphQLString},
                city: {type: GraphQLString},
                state: {type: GraphQLString},
                province: {type: GraphQLString},
                country: {type: GraphQLString},
                postalCode: {type: GraphQLString},
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

        deleteAddress: {
            type: AddressType,
            args: {
                id: {type: GraphQLNonNull(GraphQLID)},
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
            args: {id: {type: GraphQLID}},
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
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Item.findById(args.id);
            },
        },
        addItem: {
            type: ItemType, // Assuming you have an ItemType defined
            args: {
                name: {type: GraphQLString},
                quantity: {type: GraphQLInt},
            },
            async resolve(parent, args) {
                const item = new Item({
                    name: args.name,
                    quantity: args.quantity,
                });
                await item.save();
                return {
                    ...item._doc,
                    id: item._id
                };
            },
        },
        addQuotation: {
            type: QuotationType, // Assuming you have a QuotationType defined
            args: {
                pickUpAddress: {type: GraphQLNonNull(GraphQLID)},
                distance: {type: GraphQLFloat}, // Adjust the data type as needed
                shippingAddress: {type: GraphQLNonNull(GraphQLID)},
                orderItems: {type: GraphQLID},
                pickUpDate: {type: GraphQLString}
                // Adjust the data type as needed
            },
            async resolve(parent, args, context) {
                let client = await Client.findById(protect(context.headers['authorization']).id).select('-password');
                if (!client) {
                    throw new Error("No authority")
                }

                const quotation = new Quotation({
                    pickUpAddress: args.pickUpAddress,
                    distance: args.distance,
                    shippingAddress: args.shippingAddress,
                    orderItems: args.orderItems,
                    price: 0,
                    quotationID: 0,
                    pickUpDate: args.pickUpDate
                });
                await Client.findOneAndUpdate(
                    {_id: client._id},
                    {$push: {'quotations': quotation._id}},
                    {new: true}
                )
                await client.save();
                quotation.quotationID = client.quotations.length;
                await quotation.save();
                await Promise.all(client.quotations.map(async (quotationId, index) => {
                    await Quotation.updateOne(
                        {_id: quotationId},
                        {$set: {quotationID: index}}
                    );
                }));
                return quotation;
            },
        },
        quotation: {
            type: QuotationType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Quotation.findById(args.id);
            },
        },
        addPayment: {
            type: PaymentType, // Assuming you have a PaymentType defined
            args: {
                methodOfPayment: {type: GraphQLString},
                dateOfPayment: {type: GraphQLString},
                amount: {type: GraphQLFloat},
            },
            async resolve(parent, args) {
                const payment = new Payment({
                    methodOfPayment: args.methodOfPayment,
                    dateOfPayment: new Date(),
                    amount: args.amount,
                });
                return payment.save();
            },
        },
        quotations: {
            type: new GraphQLList(QuotationType),
            resolve() {
                return Quotation.find();
            }
        },
        addOrder: {
            type: OrderType, // Assuming you have an OrderType defined
            args: {
                orderItems: {type: GraphQLID},
                payment: {type: GraphQLID},
                pickUpDate: {type: GraphQLString},
            },
            async resolve(parent, args, context) {
                const client = await Client.findById(protect(context.headers['authorization']).id).select('-password');
                const order = new Order({
                    orderID: 0,
                    orderDate: new Date(),
                    status: "PAID",
                    orderItems: args.orderItems,
                    payment: args.payment,
                    pickUpDate: args.pickUpDate,
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
        updateQuotationPrice: {
            type: QuotationType,
            args: {
                quotationID: {type: GraphQLID},
                price: {type: GraphQLInt}
            },
            async resolve(parent, args, context) {
                let admin = await Admin.findById(protect(context.headers['authorization']).id).select('-password');
                if (!admin) {
                    throw new Error("No authority")
                }
                await Quotation.findOneAndUpdate(
                    {_id: args.quotationID},
                    {$set: {'price': args.price}},
                    {new: true}
                )
                return Quotation.findById(args.quotationID)
            }
        },
        deleteQuotation: {
            type: QuotationType,
            args: {
                quotationID: {type: GraphQLNonNull(GraphQLID)},
            },
            async resolve(parent, args, context) {
                let client = await Client.findById(protect(context.headers['authorization']).id).select('-password');
                const admin = await Admin.findById(protect(context.headers['authorization']).id).select('-password');
                if (!admin && !client) {
                    throw new Error("No Authority")
                }
                const quotation = await Quotation.findById(args.quotationID)
                if (!client) {
                    let client = await Client.findOne({quotations: {$in: [quotation._id]}})
                    await Client.findByIdAndUpdate(
                        {_id: client._id},
                        {$pull: {'quotations': quotation._id}},
                        {new: true}
                    )
                    await client.save();
                    client = await Client.findById(client._id);
                    await Promise.all(client.quotations.map(async (quotationId, index) => {
                        await Quotation.updateOne(
                            {_id: quotationId},
                            {$set: {quotationID: index}}
                        );
                    }));
                } else {
                    await Client.findByIdAndUpdate(
                        {_id: client._id},
                        {$pull: {'quotations': quotation._id}},
                        {new: true}
                    )
                    await client.save();
                    client = await Client.findById(client._id)
                    await Promise.all(client.quotations.map(async (quotationId, index) => {
                        await Quotation.updateOne(
                            {_id: quotationId},
                            {$set: {quotationID: index}}
                        );
                    }));
                }
                await Quotation.findByIdAndRemove(quotation._id);
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
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
