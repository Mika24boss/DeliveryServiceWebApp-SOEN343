import { gql } from '@apollo/client/core';

const GET_ORDERS = gql`
	query getOrders {
		orders {
			id
			orderID
			orderDate
			status
			payment
			orderItems
		}
	}
`;
const GET_ORDERS_FOR_EACH_CLIENT = gql`
	query OrdersForEachClient($id: ID!) {
		ordersForEachClient(clientID: $id) {
			id
			orderID
			orderDate
			status
			payment
			orderItems
		}
	}
`;

const GET_ORDERS_FOR_EACH_DELIVERY_MAN = gql`
	query OrdersForEachDeliveryMan($id: ID!) {
		ordersForEachDeliveryMan(clientID: $id) {
			id
			orderID
			orderDate
			status
			payment
			orderItems
		}
	}
`;

const GET_ORDER = gql`
	query getOrder($id: ID!) {
		order(id: $id) {
			id
			orderID
			orderDate
			status
			payment
			orderItems
		}
	}
`;
const GET_ORDER_FOR_CLIENT = gql`
	query OrderForEachClient($orderID: ID!, $clientID: ID!) {
		orderForEachClient(orderID: $orderID, clientID: $clientID) {
			id
			orderID
			orderDate
			status
			payment
			orderItems
		}
	}
`;
const GET_ORDER_FOR_DELIVERY_MAN = gql`
	query OrderForEachDeliveryMan($orderID: ID!, $deliveryManID: ID!) {
		orderForEachDeliveryMan(orderID: $orderID, deliveryManID: $deliveryManID) {
			id
			orderID
			orderDate
			status
			payment
			orderItems
		}
	}
`;
export {
	GET_ORDERS,
	GET_ORDER,
	GET_ORDER_FOR_CLIENT,
	GET_ORDERS_FOR_EACH_CLIENT,
	GET_ORDER_FOR_DELIVERY_MAN,
	GET_ORDERS_FOR_EACH_DELIVERY_MAN
};
