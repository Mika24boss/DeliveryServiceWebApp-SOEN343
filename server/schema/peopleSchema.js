const graphql = require('graphql')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {
    GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull,
    GraphQLFloat, GraphQLBoolean, GraphQLError
} = graphql
const {GraphQLDateTime} = require('graphql-iso-date')
const Person = require('../models/personModel')
const Admin = require('../models/adminModel')
const Client = require('../models/clientModel')
const DeliveryMan = require('../models/deliverManModel')
const orderModel = require('../models/orderModel')

const {
    PersonType,
    AdminType,
    ClientType,
    DeliveryManType, OrderedItemType, OrderType
} = require('./graphQLType')
const {validateRegisterInput, validateLoginInput} = require('../middleware/validators')
const OrderedItems = require("../models/orderedItems");
const Order = require("../models/orderModel");
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
            args: {id: {type: GraphQLID}},
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
            args: {id: {type: GraphQLID}},
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
            args: {id: {type: GraphQLID}},
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
            args: {id: {type: GraphQLID}},
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
                name: {type: GraphQLNonNull(GraphQLString)},
                phoneNumber: {type: GraphQLNonNull(GraphQLString)},
                emailAddress: {type: GraphQLNonNull(GraphQLString)},
                loginInfo: {type: GraphQLNonNull(GraphQLString)}
            },
            async resolve(parent, args) {
                const password = args.loginInfo

                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt);
                const person = new Person({
                    name: args.name,
                    emailAddress: args.emailAddress,
                    phoneNumber: args.phoneNumber,
                    loginInfo: hashedPassword,
                });
                return person.save();
            },
        },
        // @desc Register new Client
        // @access Public
        addClient: {
            type: ClientType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                phoneNumber: {type: GraphQLNonNull(GraphQLString)},
                emailAddress: {type: GraphQLNonNull(GraphQLString)},
                loginInfo: {type: GraphQLNonNull(GraphQLString)},
                role: {type: GraphQLString},
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
                    token: generateToken(client._id)
                };
            },
        },
        // @desc Register new DeliveryMan
        // @access Public
        addDeliveryMan: {
            type: DeliveryManType,
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                phoneNumber: {type: GraphQLNonNull(GraphQLString)},
                emailAddress: {type: GraphQLNonNull(GraphQLString)},
                loginInfo: {type: GraphQLNonNull(GraphQLString)},
                role: {type: GraphQLString},
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
                name: {type: GraphQLNonNull(GraphQLString)},
                phoneNumber: {type: GraphQLNonNull(GraphQLString)},
                emailAddress: {type: GraphQLNonNull(GraphQLString)},
                loginInfo: {type: GraphQLNonNull(GraphQLString)},
                role: {type: GraphQLString},
            },
            async resolve(parent, args) {
                const password = args.loginInfo

                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt);
                const admin = new Admin({
                    name: args.name,
                    emailAddress: args.emailAddress,
                    phoneNumber: args.phoneNumber,
                    loginInfo: hashedPassword,
                    role: args.role
                });
                return admin.save();
            },
        },//ji
        deleteClient: {
            type: PersonType,
            args: {//delete person's info through their name
                emailAddress: {type: GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent, args) {
                const client = Client.findOne(args.emailAddress);
                for (const order of client.order) {
                    if (order != "DELIVERED" || order != "NONE") {
                        throw new Error("unable to delete");
                    }
                }
                return Client.findOneAndDelete(args.emailAddress);
            },
        },
        deletePerson: {
            type: PersonType,
            args: {//delete person's info through email
                emailAddress: {type: GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent, args) {
                return Person.findOneAndDelete(args.emailAddress);
            },
        },
        deleteAdmin: {
            type: PersonType,
            args: {//delete person's info through email
                emailAddress: {type: GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent, args) {
                return Admin.findOneAndDelete(args.emailAddress);
            },
        },
        // Delete an order
        deleteOrder: {
            type: OrderType,
            args: {
                orderID: {type: GraphQLNonNull(GraphQLID)},
            },
            resolve(parent, args) {
                return Order.findByIdAndRemove(args.id);
            },
        },
        deleteDeliveryMan: {
            type: PersonType,
            args: {//delete person's info through email also has to delete the order itself
                emailAddress: {type: GraphQLNonNull(GraphQLString)},
            },

            async resolve(parent, args) {
                return Person.findOneAndDelete(args.emailAddress);
            },
        },


        updatePerson: {
            type: PersonType,
            args: {
                id: {type: GraphQLID},
                name: {type: GraphQLString},
                emailAddress: {type: GraphQLString},
                phoneNumber: {type: GraphQLString},
                loginInfo: {type: GraphQLString},
            },
            async resolve(parent, args) {
                const person = await Person.findById(args.id);

                if (!person) {
                    throw new Error("Person Not found")
                }
                if (args.name) {
                    person.name = args.name;
                }
                if (args.emailAddress) {
                    person.emailAddress = args.emailAddress;
                }
                if (args.phoneNumber) {
                    person.phoneNumber = args.phoneNumber;
                }
                if (args.loginInfo) {
                    person.loginInfo = args.loginInfo
                }
                await person.save();
                return person;
            }
        },
        login: {
            type: PersonType,
            args: {
                emailAddress: {type: GraphQLNonNull(GraphQLString)},
                password: {type: GraphQLNonNull(GraphQLString)},
            },
            async resolve(_, args) {
                const {error, valid} = validateLoginInput(args.emailAddress, args.password);

                if (!valid) {
                    throw new GraphQLError(error, {
                        extensions: {
                            code: 'INVALID',
                        },
                    });
                }

                const user = await Person.findOne({emailAddress: args.emailAddress});

                if (!user) {
                    throw new Error('User not found');
                }

                const passwordMatch = await bcrypt.compare(args.password, user.loginInfo);

                if (!passwordMatch) {
                    throw new Error('Invalid password');
                }

                const token = generateToken(user._id);
                let userRole;

                // Determine user role based on the type of user (Client, Admin, DeliveryMan)
                const client = await Client.findById(user._id);
                if (client) {
                    userRole = "CLIENT";
                } else {
                    const admin = await Admin.findById(user._id);
                    if (admin) {
                        userRole = "ADMIN";
                    } else {
                        const deliveryMan = await DeliveryMan.findById(user._id);
                        if (deliveryMan) {
                            userRole = "DELIVERYMAN";
                        } else {
                            userRole = "NONE";
                        }
                    }
                }
                return {
                    ...user._doc,
                    id: user._id,
                    token,
                    role: userRole,
                };
            },
        },

    },
});

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
});
