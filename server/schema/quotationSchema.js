const graphql = require('graphql')
const {
    GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean
} = graphql
const Quotation = require('../models/quotationModel')
const {QuotationType, AdminType} = require('./graphQLType')
const Admin = require("../models/adminModel");
const Client = require("../models/clientModel");
const protect = require("../middleware/authMiddleware");
const DeliveryMan = require("../models/deliverManModel");
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
                name: {type: GraphQLNonNull(GraphQLString)},
                pickUpAddress: {type: GraphQLNonNull(GraphQLID)},
                distance: {type: GraphQLFloat}, // Adjust the data type as needed
                shippingAddress: {type: GraphQLNonNull(GraphQLID)},
                billingAddress: {type: GraphQLNonNull(GraphQLID)},
                price: {type: GraphQLNonNull(GraphQLFloat)}, // Adjust the data type as needed
                order: {type: GraphQLNonNull(GraphQLID)},
            },
            async resolve(parent, args, context) {
                const client = await Client.findById(protect(context.headers['authorization']).id).select('-password');
                if (!client) {
                    throw new Error("No authority")
                }

                const quotation = new Quotation({
                    name: args.name,
                    pickUpAddress: args.pickUpAddress,
                    distance: args.distance,
                    shippingAddress: args.shippingAddress,
                    // billingAddress: args.billingAddress,
                    price: args.price,
                    order: args.order,
                });
                await quotation.save();
                await Client.findOneAndUpdate(
                    {_id: client._id},
                    {$push: {'quotations': quotation._id}},
                    {new: true}
                )
            },
        },
        // Delete an order
        deleteQuotation: {
            type: QuotationType,
            args: {
                quotationID: {type: GraphQLNonNull(GraphQLID)},
            },
            async resolve(parent, args, context) {
                const client = await Client.findById(protect(context.headers['authorization']).id).select('-password');
                const admin = await Admin.findById(protect(context.headers['authorization']).id).select('-password');
                if (!admin && !client) {
                    throw new Error("No Authority")
                }
                if (!client) {
                    const client = await Client.findOne({quotations: {$in: [args.quotationID]}})
                    await Client.findByIdAndUpdate(
                        {_id: client._id},
                        {$pull: {'quotations': quotation._id}},
                        {new: true}
                    )
                } else {
                    await Client.findByIdAndUpdate(
                        {_id: client._id},
                        {$pull: {'quotations': quotation._id}},
                        {new: true}
                    )
                }
                await Quotation.findByIdAndRemove(args.id);
            },
        },
        // updateQuotation by client with the price
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
