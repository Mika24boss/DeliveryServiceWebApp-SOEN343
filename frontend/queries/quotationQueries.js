import { gql } from '@apollo/client';

const GET_QUOTATIONS = gql`
	query Quotations {
		quotations {
			id
			name
			pickUpAddress
			distance
			shippingAddress
			billingAddress
			price
			order
		}
	}
`;

const GET_QUOTATION = gql`
	query Quotation($id: ID!) {
		quotation(id: $id) {
			id
			name
			pickUpAddress
			distance
			shippingAddress
			billingAddress
			price
			order
		}
	}
`;

export { GET_QUOTATIONS, GET_QUOTATION };
