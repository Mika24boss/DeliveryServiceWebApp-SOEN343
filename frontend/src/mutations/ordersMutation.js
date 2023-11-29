import {gql} from '@apollo/client/core';

// Mutation to add an order
const ADD_ORDER = gql`
	mutation AddOrder(
		$orderID: ID!
		$status: String!
		$orderItems: [String]!
		$payment: Float!
		$pickUpDate: Date!
	) {
		addOrder(
			orderID: $orderID
			status: $status
			orderItems: $orderItems
			payment: $payment
			pickUpDate: $pickUpDate
		) {
			id
			orderID
			orderDate
			status
			pickUpDate
			payment
			orderItems
		}
	}
`;

// Mutation to assign an order
const ASSIGN_ORDER = gql`
	mutation AssignOrder($orderID: ID!) {
		assignOrder(orderID: $orderID) {
			id
			orderID
			orderDate
			status
			payment
			orderItems
			pickUpDate
		}
	}
`;

// Mutation to delete an order by ADMIN
const DELETE_ORDER = gql`
	mutation DeleteOrder($id: ID!) {
		deleteOrder(id: $id) {
			id
			orderID
			orderDate
			status
			payment
			orderItems
			pickUpDate
		}
	}
`;

const UPDATE_ORDER_STATUS = gql`
	mutation UpdateOrderStatus($orderID: ID!, $status: String!) {
		updateOrderStatus(orderID: $orderID, status: $status) {
			id
			orderID
			orderDate
			status
			payment
			orderItems
			pickUpDate
		}
	}
`;
const UPDATE_ORDER = gql`
	mutation UpdateOrder(
		$orderID: ID
		$orderDate: String
		$status: String
		$payment: Float
		$orderItems: [String]
		$pickUpDate: Date!
	) {
		updateOrder(
			orderID: $orderID
			orderDate: $orderDate
			status: $status
			payment: $payment
			orderItems: $orderItems
			pickUpDate: $pickUpDate
		) {
			id
			orderID
			orderDate
			pickUpDate
			status
			payment
			orderItems
		}
	}
`;
const GET_ORDERS_FOR_EACH_CLIENT = gql`
	mutation OrdersForEachClient($clientID: ID!) {
		ordersForEachClient(clientID: $clientID) {
			id
			orderID
			orderDate
			pickUpDate
			status
			payment
			orderItems
		}
	}
`;

const GET_ORDERS_FOR_EACH_DELIVERY_MAN = gql`
	mutation OrdersForEachDeliveryMan($deliveryManID: ID!) {
		ordersForEachDeliveryMan(deliveryManID: $deliveryManID) {
			id
			orderID
			orderDate
			pickUpDate
			status
			payment
			orderItems
		}
	}
`;

const GET_ORDER = gql`
	mutation getOrder($id: ID!) {
		order(id: $id) {
			id
			orderID
			orderDate
			status
			pickUpDate
			payment
			orderItems
		}
	}
`;
const GET_ORDER_FOR_CLIENT = gql`
	mutation OrderForEachClient($orderID: Int!, $clientID: ID!) {
		orderForEachClient(orderID: $orderID, clientID: $clientID) {
			id
			orderID
			orderDate
			pickUpDate
			status
			payment
			orderItems
		}
	}
`;
const GET_ORDER_FOR_DELIVERY_MAN = gql`
	mutation OrderForEachDeliveryMan($orderID: ID!, $deliveryManID: ID!) {
		orderForEachDeliveryMan(orderID: $orderID, deliveryManID: $deliveryManID) {
			id
			orderID
			orderDate
			pickUpDate
			status
			payment
			orderItems
		}
	}
`;
const GET_ORDERS = gql`
	mutation getOrders {
		orders {
			id
			orderID
			orderDate
			status
			pickUpDate
			payment
			orderItems
		}
	}
`;

export {
	ADD_ORDER,
	ASSIGN_ORDER,
	DELETE_ORDER,
	UPDATE_ORDER_STATUS,
	UPDATE_ORDER,
	GET_ORDERS_FOR_EACH_CLIENT,
	GET_ORDER,
	GET_ORDERS_FOR_EACH_DELIVERY_MAN,
	GET_ORDER_FOR_CLIENT,
	GET_ORDER_FOR_DELIVERY_MAN,
	GET_ORDERS
};
