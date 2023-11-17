import { gql } from '@apollo/client/core';

const GET_QUOTATIONS = gql`
	query Quotations {
		quotations {
			id
			quotationID
			pickUpAddress
			distance
			shippingAddress
			price
		}
	}
`;

const GET_QUOTATION = gql`
	query Quotation($id: ID!) {
		quotation(id: $id) {
			id
			quotationID
			pickUpAddress
			distance
			shippingAddress
			price
		}
	}
`;

export { GET_QUOTATIONS, GET_QUOTATION };
