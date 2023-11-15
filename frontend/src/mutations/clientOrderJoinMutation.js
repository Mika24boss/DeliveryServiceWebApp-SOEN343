import {gql} from '@apollo/client/core';

// Mutation to add a client-order join
const ADD_CLIENT_ORDER_JOIN = gql`
	mutation AddClientOrderJoin(
		$clientID: ID!
		$orderID: ID!
		$location: String!
		$arrivalEstimatedTime: String!
	) {
		addClientOrderJoin(
			clientID: $clientID
			orderID: $orderID
			location: $location
			arrivalEstimatedTime: $arrivalEstimatedTime
		) {
			clientID
			orderID
			location
			arrivalEstimatedTime
		}
	}
`;

// Mutation to delete a client-order join
const DELETE_CLIENT_ORDER_JOIN = gql`
	mutation DeleteClientOrderJoin($orderID: ID!) {
		deleteClientOrderJoin(orderID: $orderID) {
			clientID
			orderID
			location
			arrivalEstimatedTime
		}
	}
`;

export { ADD_CLIENT_ORDER_JOIN, DELETE_CLIENT_ORDER_JOIN };
