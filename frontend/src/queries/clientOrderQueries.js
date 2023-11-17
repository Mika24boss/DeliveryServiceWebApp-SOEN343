import { gql } from '@apollo/client/core';

const GET_CLIENT_ORDERS = gql`
	query ClientOrders {
		clientOrders {
			clientID
			orderID
			location
			arrivalEstimatedTime
		}
	}
`;

const GET_CLIENT_ORDER = gql`
	query ClientOrder($clientID: ID, $orderID: ID) {
		clientOrder(clientID: $clientID, orderID: $orderID) {
			clientID
			orderID
			location
			arrivalEstimatedTime
		}
	}
`;

export { GET_CLIENT_ORDERS, GET_CLIENT_ORDER };
