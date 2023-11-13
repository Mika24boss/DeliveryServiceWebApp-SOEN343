import {gql} from '@apollo/client';

// Mutation to add an order
const ADD_ORDER = gql`
	mutation AddOrder($orderID: ID!, $status: String!, $orderItems: [String]!, $payment: Float!) {
		addOrder(orderID: $orderID, status: $status, orderItems: $orderItems, payment: $payment) {
			id
			orderID
			orderDate
			status
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
	) {
		updateOrder(
			orderID: $orderID
			orderDate: $orderDate
			status: $status
			payment: $payment
			orderItems: $orderItems
		) {
			id
			orderID
			orderDate
			status
			payment
			orderItems
		}
	}
`;

export { ADD_ORDER, ASSIGN_ORDER, DELETE_ORDER, UPDATE_ORDER_STATUS, UPDATE_ORDER };
