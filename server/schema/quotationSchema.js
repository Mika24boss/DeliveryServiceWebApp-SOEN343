const graphql = require('graphql')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean } = graphql
const Quotation = require('../models/quotationModel')
const { QuotationType} = require('./graphQLType')

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        quotations: {
            type: new GraphQLList(QuotationType),
            resolve() {
                return Quotation.find();
            }
        },
    },
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addQuotation: {
            type: QuotationType, // Assuming you have a QuotationType defined
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                pickUpAddress: { type: GraphQLNonNull(GraphQLID) },
                distance: { type: GraphQLFloat }, // Adjust the data type as needed
                shippingAddress: { type: GraphQLNonNull(GraphQLID) },
                billingAddress: { type: GraphQLNonNull(GraphQLID) },
                price: { type: GraphQLNonNull(GraphQLFloat) }, // Adjust the data type as needed
                order: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                const quotation = new Quotation({
                    name: args.name,
                    pickUpAddress: args.pickUpAddress,
                    distance: args.distance,
                    shippingAddress: args.shippingAddress,
                    billingAddress: args.billingAddress,
                    price: args.price,
                    order: args.order,
                });
                return quotation.save();
            },
        },
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
