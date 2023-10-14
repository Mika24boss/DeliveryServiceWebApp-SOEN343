const graphql = require('graphql')
const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema, GraphQLList} = graphql

const Person = require('../models/personModel')
const Admin = require('../models/adminModel')
const PersonType = new GraphQLObjectType({
    name: 'Person',
    field:() => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        phoneNumber: {type: GraphQLString},
        emailAddress: {type: GraphQLString},
        loginInfo: {type: GraphQLString}
    }),
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        persons : {
            type: new GraphQLList(PersonType),
            resolve(parent, args){
                return Person.find();
            }
        },
        person: {
            type: PersonType,
            args: {id: {type : GraphQLID}},
            resolve(parent, args) {
                return Person.findById(args.id);
            },
        },
    },
});
