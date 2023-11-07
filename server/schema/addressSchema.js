const graphql = require('graphql')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean } = graphql
const {GraphQLDateTime} = require('graphql-iso-date')
const Address = require('../models/addressModel')
const { AddressType} = require('./graphQLType')

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        addresses: {
            type: new GraphQLList(AddressType),
            resolve() {
                return Address.find();
            }
        },
    },
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // @desc Register new Address
        // @access Public
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
    },
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
