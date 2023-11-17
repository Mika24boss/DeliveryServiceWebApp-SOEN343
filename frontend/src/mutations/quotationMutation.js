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

export { ADD_QUOTATION, DELETE_QUOTATION };
