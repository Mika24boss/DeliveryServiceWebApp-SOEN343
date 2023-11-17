import {gql} from '@apollo/client/core';

// Mutation to add a quotation
const ADD_QUOTATION = gql`
  mutation AddQuotation(
    $pickUpAddress: String!
    $shippingAddress: String!
    $distance: Float!
  ) {
    addQuotation(
      pickUpAddress: $pickUpAddress!
      shippingAddress: $shippingAddress!
      distance: $distance!
    ) {
      id
      quotationID
      pickUpAddress
      distance
      shippingAddress
      price
    }
  }
`;

// Mutation to delete a quotation
const DELETE_QUOTATION = gql`
	mutation DeleteQuotation($quotationID: ID!) {
		deleteQuotation(quotationID: $quotationID) {
			id
			quotationID
			pickUpAddress
			distance
			shippingAddress
			price
		}
	}
`;
const GET_QUOTATIONS_FOR_EACH_CLIENT = gql`
	mutation quotationForEachClient($clientID: ID!) {
		quotationForEachClient(clientID: $clientID) {
			id
			quotationID
			pickUpAddress
			distance
			shippingAddress
			price
		}
	}
`;
const UPDATE_PRICE = gql`
mutation updateQuotationPrice($quotationID: ID!, $price: Int!) {
updateQuotationPrice(quotationID: $quotationID, price: $price) {
            id
			quotationID
			pickUpAddress
			distance
			shippingAddress
			price
	}			
}`;
const GET_QUOTATIONS = gql`
	mutation Quotations {
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
	mutation Quotation($id: ID!) {
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
export {
	ADD_QUOTATION,
	DELETE_QUOTATION,
	GET_QUOTATIONS_FOR_EACH_CLIENT,
	GET_QUOTATION,
	GET_QUOTATIONS,
	UPDATE_PRICE
};
