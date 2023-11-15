import { gql } from '@apollo/client';

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

export { GET_ORDERS, GET_ORDER };
