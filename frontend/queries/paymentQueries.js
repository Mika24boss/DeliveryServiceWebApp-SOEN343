import { gql } from '@apollo/client';

const GET_PAYMENTS = gql`
	query Payments {
		payments {
			methodOfPayment
			dateOfPayment
			amount
		}
	}
`;

const GET_PAYMENT = gql`
	query Payment($id: ID!) {
		payment(id: $id) {
			methodOfPayment
			dateOfPayment
			amount
		}
	}
`;

export { GET_PAYMENTS, GET_PAYMENT };
