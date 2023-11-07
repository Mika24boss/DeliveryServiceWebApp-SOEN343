const graphql = require('graphql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {
    GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLInt, GraphQLBoolean, GraphQLError
} = graphql
const { GraphQLDateTime } = require('graphql-iso-date')
const Person = require('../models/personModel')
const Admin = require('../models/adminModel')
const Client = require('../models/clientModel')
const DeliveryMan = require('../models/deliverManModel')
const {
    PersonType,
    AdminType,
    ClientType,
    DeliveryManType
} = require('./graphQLType')
const { validateRegisterInput, validateLoginInput } = require('../middleware/validators')
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
    },
});

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        // @desc Register new Person
        // @access Public
        addPerson: {
            type: PersonType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                phoneNumber: { type: GraphQLNonNull(GraphQLInt) },
                emailAddress: { type: GraphQLNonNull(GraphQLString) },
                loginInfo: { type: GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                const password = args.loginInfo

                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt);
                const person = new Person({
                    name: args.name,
                    emailAddress: args.emailAddress,
                    phoneNumber: args.phoneNumber,
                    loginInfo: args.emailAddress,
                });
                return person.save();
            },
        },
        // @desc Register new Client
        // @access Public
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                phoneNumber: { type: GraphQLNonNull(GraphQLInt) },
                emailAddress: { type: GraphQLNonNull(GraphQLString) },
                loginInfo: { type: GraphQLNonNull(GraphQLString) },
                role: { type: GraphQLString },
            },
            async resolve(parent, args) {
                const password = args.loginInfo

                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt);
                const client = new Client({
                    name: args.name,
                    emailAddress: args.emailAddress,
                    phoneNumber: args.phoneNumber,
                    loginInfo: hashedPassword,
                    role: args.role || "REGULAR-CLIENT"
                });
                await client.save();
                return {
                    ...client._doc,
                    id: client._id,
                    token: generateToken(client)
                };
            },
        },
        // @desc Register new DeliveryMan
        // @access Public
        addDeliveryMan: {
            type: DeliveryManType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                phoneNumber: { type: GraphQLNonNull(GraphQLInt) },
                emailAddress: { type: GraphQLNonNull(GraphQLString) },
                loginInfo: { type: GraphQLNonNull(GraphQLString) },
                role: { type: GraphQLString },
            },
            async resolve(parent, args) {
                const password = args.loginInfo

                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)
                const deliveryMan = new DeliveryMan({
                    name: args.name,
                    emailAddress: args.emailAddress,
                    phoneNumber: args.phoneNumber,
                    loginInfo: hashedPassword,
                    role: args.role
                });
                return deliveryMan.save();
            },
        },
        // @desc Register new Admin
        // @access Public
        addAdmin: {
            type: AdminType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                phoneNumber: { type: GraphQLNonNull(GraphQLInt) },
                emailAddress: { type: GraphQLNonNull(GraphQLString) },
                loginInfo: { type: GraphQLNonNull(GraphQLString) },
                role: { type: GraphQLString },
            },
            async resolve(parent, args) {
                const password = args.loginInfo

                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt);
                const admin = new Admin({
                    name: args.name,
                    emailAddress: args.emailAddress,
                    phoneNumber: args.phoneNumber,
                    loginInfo: args.emailAddress,
                    role: args.role
                });
                return admin.save();
            },
        },
        deleteClient: {
            type: PersonType,
            args: {//delete person's info through their name
                emailAddress: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(parent, args) {
                return Client.findOneAndDelete(args.emailAddress);
            },
        },
        login: {
            type: PersonType,
            args: {
                emailAddress: { type: GraphQLNonNull(GraphQLString) },
                password: { type: GraphQLNonNull(GraphQLString) },
            },
            async resolve(_, args) {
                const { error, valid } = validateLoginInput(args.emailAddress, args.password);

                if (!valid) {
                    throw new GraphQLError(error, {
                        extensions: {
                            code: 'INVALID',
                        },
                    });
                }

                const user = await Person.findOne({ emailAddress: args.emailAddress });

                if (!user) {
                    throw new Error('User not found');
                }

                const passwordMatch = await bcrypt.compare(args.password, user.loginInfo);

                if (!passwordMatch) {
                    throw new Error('Invalid password');
                }

                const token = generateToken(user);
                console.log(token)
                return {
                    ...user._doc,
                    id: user._id,
                    token
                };
            },
        },
    },
});

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.emailAddress,
            username: user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
}
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
