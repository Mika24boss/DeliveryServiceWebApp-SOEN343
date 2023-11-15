import {gql} from '@apollo/client/core';

// Mutation to add a payment
const ADD_PAYMENT = gql`
	mutation AddPayment($methodOfPayment: String!, $dateOfPayment: String!, $amount: Float!) {
		addPayment(methodOfPayment: $methodOfPayment, dateOfPayment: $dateOfPayment, amount: $amount) {
			methodOfPayment
			dateOfPayment
			amount
		}
	}
`;

// Mutation to delete a payment
const DELETE_PAYMENT = gql`
	mutation DeletePayment($orderID: ID!) {
		deletePayment(orderID: $orderID) {
			methodOfPayment
			dateOfPayment
			amount
		}
	}
`;

export { ADD_PAYMENT, DELETE_PAYMENT };
