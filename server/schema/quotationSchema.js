const graphql = require('graphql')
const {
    GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean
} = graphql
const Quotation = require('../models/quotationModel')
const {QuotationType, AdminType, OrderType} = require('./graphQLType')
const Admin = require("../models/adminModel");
const Client = require("../models/clientModel");
const protect = require("../middleware/authMiddleware");
const DeliveryMan = require("../models/deliverManModel");
const Order = require("../models/orderModel");
const {GraphQLDateTime} = require("graphql-iso-date");
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        quotations: {
            type: new GraphQLList(QuotationType),
            resolve() {
                return Quotation.find();
            }
        },
        quotation: {
            type: QuotationType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Quotation.findById(args.id);
            },
        },
    },
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
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
                    price: 0,
                    quotationID: 0,
                    orderItems: args.orderItems,
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
        // Delete an order
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
        quotations: {
            type: new GraphQLList(QuotationType),
            resolve() {
                return Quotation.find();
            }
        },
        quotation: {
            type: QuotationType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Quotation.findById(args.id);
            },
        },
        // updateQuotation by client with the price
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
        }
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
