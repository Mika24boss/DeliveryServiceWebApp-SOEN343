const graphql = require('graphql')
const {
    GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema,
    GraphQLList, GraphQLNonNull, GraphQLFloat,
    GraphQLInt, GraphQLBoolean
} = graphql
const {GraphQLDateTime} = require('graphql-iso-date')
const PersonType = new GraphQLObjectType({
    name: 'Person',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        phoneNumber: {type: GraphQLString},
        emailAddress: {type: GraphQLString},
        loginInfo: {type: GraphQLString},
        token: {type: GraphQLString},
        role: {type: GraphQLString},
    }),
});

const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        phoneNumber: {type: GraphQLString},
        emailAddress: {type: GraphQLString},
        loginInfo: {type: GraphQLString},
        role: {type: GraphQLString},
        quotations: {type: new GraphQLList(GraphQLID)},
        order: {type: new GraphQLList(GraphQLID)},
        token: {type: GraphQLString},
    })
})
const AdminType = new GraphQLObjectType({
    name: 'Admin',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        phoneNumber: {type: GraphQLString},
        emailAddress: {type: GraphQLString},
        loginInfo: {type: GraphQLString},
        role: {type: GraphQLString},
        token: {type: GraphQLString},
    })
})
const DeliveryManType = new GraphQLObjectType({
    name: 'DeliveryMan',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        phoneNumber: {type: GraphQLString},
        emailAddress: {type: GraphQLString},
        loginInfo: {type: GraphQLString},
        role: {type: GraphQLString},
        numberOfOrder: {type: GraphQLInt},
        orders: {type: new GraphQLList(GraphQLID)},
        token: {type: GraphQLString},
    })
})
const OrderType = new GraphQLObjectType({
    name: 'Order',
    fields: () => ({
        id: {type: GraphQLID},
        orderID: {type: GraphQLID},
        orderDate: {type: GraphQLString},
        status: {type: GraphQLString},
        payment: {type: GraphQLID},
        orderItems: {type: new GraphQLList(GraphQLID)},
    }),
});

const QuotationType = new GraphQLObjectType({
    name: 'Quotation',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        pickUpAddress: {type: GraphQLID},
        distance: {type: GraphQLFloat},
        shippingAddress: {type: GraphQLID},
        billingAddress: {type: GraphQLID},
        price: {type: GraphQLFloat},
        order: {type: GraphQLID},
    }),
});
const AddressType = new GraphQLObjectType({
    name: 'Address',
    fields: () => ({
        id: {type: GraphQLID},
        street: {type: GraphQLString},
        city: {type: GraphQLString},
        state: {type: GraphQLString},
        province: {type: GraphQLString},
        country: {type: GraphQLString},
        postalCode: {type: GraphQLString},
    }),
});
const ItemType = new GraphQLObjectType({
    name: 'Item',
    fields: () => ({
        name: {type: GraphQLString},
        isFragile: {type: GraphQLBoolean},
        price: {type: GraphQLFloat},
    }),
});
const PaymentType = new GraphQLObjectType({
    name: 'Payment',
    fields: () => ({
        methodOfPayment: {type: GraphQLString},
        dateOfPayment: {type: GraphQLString},
        amount: {type: GraphQLFloat},
    }),
});
const OrderedItemType = new GraphQLObjectType({
    name: 'OrderedItem',
    fields: () => ({
        size: {type: GraphQLString},
        quantity: {type: GraphQLInt},
        items: {type: new GraphQLList(GraphQLID)}, // Assuming you store item IDs as strings
    }),
});
const ClientOrderJoinType = new GraphQLObjectType({
    name: 'ClientOrderJoin',
    fields: () => ({
        clientID: {type: GraphQLID},
        orderID: {type: GraphQLID},
        location: {type: GraphQLString},
        arrivalEstimatedTime: {type: GraphQLDateTime},
    }),
});
module.exports = {
    PersonType,
    AdminType,
    ClientType,
    DeliveryManType,
    QuotationType,
    OrderType,
    AddressType,
    ItemType,
    PaymentType,
    OrderedItemType,
    ClientOrderJoinType
}