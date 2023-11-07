// const graphql = require('graphql')
// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
// const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
//     GraphQLList, GraphQLNonNull,
//     GraphQLFloat, GraphQLInt, GraphQLBoolean } = graphql
// const {GraphQLDateTime} = require('graphql-iso-date')
// const Person = require('../models/personModel')
// const Admin = require('../models/adminModel')
// const Client = require('../models/clientModel')
// const Quotation = require('../models/quotationModel')
// const Order = require('../models/orderModel')
// const Address = require('../models/addressModel')
// const Item = require('../models/itemModel')
// const DeliveryMan = require('../models/deliverManModel')
// const Payment = require('../models/paymentModel')
// const OrderedItems = require('../models/orderedItems')
// const ClientOrderJoin = require('../models/ClientOrderModel')
// const { PersonType,
//     AdminType,
//     ClientType,
//     QuotationType,
//     OrderType,
//     AddressType,
//     ItemType,
//     DeliveryManType,
//     PaymentType,
//     OrderedItemType,
//     ClientOrderJoinType } = require('./graphQLType')
//
// const RootQuery = new GraphQLObjectType({
//     name: 'RootQueryType',
//     fields: {
//         persons: {
//             type: new GraphQLList(PersonType),
//             resolve(parent, args) {
//                 return Person.find();
//             }
//         },
//         person: {
//             type: PersonType,
//             args: { id: { type: GraphQLID } },
//             resolve(parent, args) {
//                 return Person.findById(args.id);
//             },
//         },
//         clients: {
//             type: new GraphQLList(ClientType),
//             resolve() {
//                 return Client.find();
//             }
//         },
//         client: {
//             type: ClientType,
//             args: { id: { type: GraphQLID } },
//             resolve(parent, args) {
//                 return Client.findById(args.id);
//             },
//         },
//         admins: {
//             type: new GraphQLList(AdminType),
//             resolve() {
//                 return Admin.find();
//             }
//         },
//         admin: {
//             type: AdminType,
//             args: { id: { type: GraphQLID } },
//             resolve(parent, args) {
//                 return Admin.findById(args.id);
//             },
//         },
//         deliverymans: {
//             type: new GraphQLList(DeliveryManType),
//             resolve() {
//                 return DeliveryMan.find();
//             }
//         },
//         deliveryman: {
//             type: DeliveryManType,
//             args: { id: { type: GraphQLID } },
//             resolve(parent, args) {
//                 return DeliveryMan.findById(args.id);
//             },
//         },
//         quotations: {
//             type: new GraphQLList(QuotationType),
//             resolve() {
//                 return Quotation.find();
//             }
//         },
//         addresses: {
//             type: new GraphQLList(AddressType),
//             resolve() {
//                 return Address.find();
//             }
//         },
//         orders: {
//             type: new GraphQLList(OrderType),
//             resolve() {
//                 return Order.find();
//             }
//         },
//         items: {
//             type: new GraphQLList(ItemType),
//             resolve() {
//                 return Item.find();
//             }
//         },
//         payments: {
//             type: new GraphQLList(PaymentType),
//             resolve() {
//                 return Payment.find();
//             }
//         },
//         clientOrders: {
//             type: new GraphQLList(ClientOrderJoinType),
//             resolve() {
//                 return ClientOrderJoin.find();
//             }
//         },
//     },
// });
//
// const mutation = new GraphQLObjectType({
//     name: 'Mutation',
//     fields: {
//         // @desc Register new Person
//         // @access Public
//         addPerson: {
//             type: PersonType,
//             args: {
//                 name: { type: GraphQLNonNull(GraphQLString) },
//                 phoneNumber: { type: GraphQLNonNull(GraphQLInt) },
//                 emailAddress: { type: GraphQLNonNull(GraphQLString) },
//                 loginInfo: { type: GraphQLNonNull(GraphQLString) }
//             },
//             async resolve(parent, args) {
//                 const password = args.loginInfo
//
//                 const salt = await bcrypt.genSalt(10)
//                 const hashedPassword = await bcrypt.hash(password, salt);
//                 const person = new Person({
//                     name: args.name,
//                     emailAddress: args.emailAddress,
//                     phoneNumber: args.phoneNumber,
//                     loginInfo: args.emailAddress,
//                 });
//                 return person.save();
//             },
//         },
//         deletePerson: {
//             type: PersonType,
//             args: {//delete person's info through email
//                 emailAddress: { type: GraphQLNonNull(GraphQLString) },
//             },
//             async resolve(parent, args){
//                 return Person.findOneAndDelete(args.emailAddress);
//             },
//         },
//         deleteAdmin: {
//             type: PersonType,
//             args: {//delete person's info through email
//                 emailAddress: { type: GraphQLNonNull(GraphQLString) },
//             },
//             async resolve(parent, args){
//                 return Admin.findOneAndDelete(args.emailAddress);
//             },
//         },
//         // deleteClient: {
//         //     type: PersonType,
//         //     args: {//delete person's info through their name
//         //         emailAddress: { type: GraphQLNonNull(GraphQLString) },
//         //     },
//         //     async resolve(parent, args){
//         //         return Client.findOneAndDelete(args.emailAddress);
//         //     },
//         // },
//         // @desc Register new Client
//         // @access Public
//         addClient: {
//             type: ClientType,
//             args: {
//                 name: { type: GraphQLNonNull(GraphQLString) },
//                 phoneNumber: { type: GraphQLNonNull(GraphQLInt) },
//                 emailAddress: { type: GraphQLNonNull(GraphQLString) },
//                 loginInfo: { type: GraphQLNonNull(GraphQLString) },
//                 role: { type: GraphQLString },
//             },
//             async resolve(parent, args) {
//                 const password = args.loginInfo
//
//                 const salt = await bcrypt.genSalt(10)
//                 const hashedPassword = await bcrypt.hash(password, salt);
//                 const client = new Client({
//                     name: args.name,
//                     emailAddress: args.emailAddress,
//                     phoneNumber: args.phoneNumber,
//                     loginInfo: hashedPassword,
//                     role: args.role
//                 });
//                 return client.save();
//             },
//         },
//         // @desc Register new DeliveryMan
//         // @access Public
//         addDeliveryMan: {
//             type: DeliveryManType,
//             args: {
//                 name: { type: GraphQLNonNull(GraphQLString) },
//                 phoneNumber: { type: GraphQLNonNull(GraphQLInt) },
//                 emailAddress: { type: GraphQLNonNull(GraphQLString) },
//                 loginInfo: { type: GraphQLNonNull(GraphQLString) },
//                 role: { type: GraphQLString },
//             },
//             async resolve(parent, args) {
//                 const password = args.loginInfo
//
//                 const salt = await bcrypt.genSalt(10)
//                 const hashedPassword = await bcrypt.hash(password, salt)
//                 const deliveryMan = new DeliveryMan({
//                     name: args.name,
//                     emailAddress: args.emailAddress,
//                     phoneNumber: args.phoneNumber,
//                     loginInfo: hashedPassword,
//                     role: args.role
//                 });
//                 return deliveryMan.save();
//             },
//         },
//         // @desc Register new Admin
//         // @access Public
//         addAdmin: {
//             type: AdminType,
//             args: {
//                 name: { type: GraphQLNonNull(GraphQLString) },
//                 phoneNumber: { type: GraphQLNonNull(GraphQLInt) },
//                 emailAddress: { type: GraphQLNonNull(GraphQLString) },
//                 loginInfo: { type: GraphQLNonNull(GraphQLString) },
//                 role: { type: GraphQLString },
//             },
//             async resolve(parent, args) {
//                 const password = args.loginInfo
//
//                 const salt = await bcrypt.genSalt(10)
//                 const hashedPassword = await bcrypt.hash(password, salt);
//                 const admin = new Admin({
//                     name: args.name,
//                     emailAddress: args.emailAddress,
//                     phoneNumber: args.phoneNumber,
//                     loginInfo: args.emailAddress,
//                     role: args.role
//                 });
//                 return admin.save();
//             },
//         },
//         // @desc Register new Order
//         // @access Public
//         addOrder: {
//             type: OrderType, // Assuming you have an OrderType defined
//             args: {
//                 orderID: { type: GraphQLNonNull(GraphQLInt) },
//                 orderDate: { type: GraphQLNonNull(GraphQLString) },
//                 status: { type: GraphQLNonNull(GraphQLString) },
//                 payment: { type: GraphQLNonNull(GraphQLID) },
//                 orderItems: { type: GraphQLNonNull(new GraphQLList(GraphQLID)) },
//             },
//             resolve(parent, args) {
//                 const order = new Order({
//                     orderID: args.orderID,
//                     orderDate: args.orderDate,
//                     status: args.status,
//                     payment: args.payment,
//                     orderItems: args.orderItems,
//                 });
//                 return order.save();
//             },
//         },
//         // @desc Register new Quotation
//         // @access Public
//         addQuotation: {
//             type: QuotationType, // Assuming you have a QuotationType defined
//             args: {
//                 name: { type: GraphQLNonNull(GraphQLString) },
//                 pickUpAddress: { type: GraphQLNonNull(GraphQLID) },
//                 distance: { type: GraphQLFloat }, // Adjust the data type as needed
//                 shippingAddress: { type: GraphQLNonNull(GraphQLID) },
//                 billingAddress: { type: GraphQLNonNull(GraphQLID) },
//                 price: { type: GraphQLNonNull(GraphQLFloat) }, // Adjust the data type as needed
//                 order: { type: GraphQLNonNull(GraphQLID) },
//             },
//             resolve(parent, args) {
//                 const quotation = new Quotation({
//                     name: args.name,
//                     pickUpAddress: args.pickUpAddress,
//                     distance: args.distance,
//                     shippingAddress: args.shippingAddress,
//                     billingAddress: args.billingAddress,
//                     price: args.price,
//                     order: args.order,
//                 });
//                 return quotation.save();
//             },
//         },
//         // @desc Register new Address
//         // @access Public
//         addAddress: {
//             type: AddressType, // Assuming you have an AddressType defined
//             args: {
//                 street: { type: GraphQLString },
//                 city: { type: GraphQLString },
//                 state: { type: GraphQLString },
//                 province: { type: GraphQLString },
//                 country: { type: GraphQLString },
//                 postalCode: { type: GraphQLString },
//             },
//             resolve(parent, args) {
//                 const address = new Address({
//                     street: args.street,
//                     city: args.city,
//                     state: args.state,
//                     province: args.province,
//                     country: args.country,
//                     postalCode: args.postalCode,
//                 });
//                 return address.save();
//             },
//         },
//         // @desc Register new Item
//         // @access Public
//         addItem: {
//             type: ItemType, // Assuming you have an ItemType defined
//             args: {
//                 name: { type: GraphQLString },
//                 isFragile: { type: GraphQLBoolean },
//                 price: { type: GraphQLFloat },
//             },
//             resolve(parent, args) {
//                 const item = new Item({
//                     name: args.name,
//                     isFragile: args.isFragile,
//                     price: args.price,
//                 });
//                 return item.save();
//             },
//         },
//         // @desc Register new Payment
//         // @access Public
//         addPayment: {
//             type: PaymentType, // Assuming you have a PaymentType defined
//             args: {
//                 methodOfPayment: { type: GraphQLString },
//                 dateOfPayment: { type: GraphQLString },
//                 amount: { type: GraphQLFloat },
//             },
//             resolve(parent, args) {
//                 const payment = new Payment({
//                     methodOfPayment: args.methodOfPayment,
//                     dateOfPayment: args.dateOfPayment,
//                     amount: args.amount,
//                 });
//                 return payment.save();
//             },
//         },
//         // @desc Register new OrderedItem
//         // @access Public
//         addOrderedItem: {
//             type: OrderedItemType, // Assuming you have an OrderedItemType defined
//             args: {
//                 size: { type: GraphQLString },
//                 quantity: { type: GraphQLInt },
//                 items: { type: new GraphQLList(GraphQLString) }, // Assuming you store item IDs as strings
//             },
//             resolve(parent, args) {
//                 const orderedItem = new OrderedItems({
//                     size: args.size,
//                     quantity: args.quantity,
//                     items: args.items,
//                 });
//                 return orderedItem.save();
//             },
//         },
//         // @desc Register new ClientOrderJoin
//         // @access Public
//         addClientOrderJoin: {
//             type: ClientOrderJoinType, // Assuming you have a ClientOrderJoinType defined
//             args: {
//                 clientID: { type: GraphQLID },
//                 orderID: { type: new GraphQLList(GraphQLID) },
//                 location: { type: GraphQLString },
//                 arrivalEstimatedTime: { type: GraphQLDateTime },
//             },
//             resolve(parent, args) {
//                 const clientOrderJoin = new ClientOrderJoin({
//                     clientID: args.clientID,
//                     orderID: args.orderID,
//                     location: args.location,
//                     arrivalEstimatedTime: args.arrivalEstimatedTime,
//                 });
//                 return clientOrderJoin.save();
//             },
//         }
//     },
// });
//
//
// module.exports = new GraphQLSchema({
//     query: RootQuery,
//     mutation,
// });
