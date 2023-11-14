import {gql} from '@apollo/client/core';

// Mutation to add a quotation
const ADD_QUOTATION = gql`
  mutation AddQuotation(
    $name: String!
    $pickUpAddress: String!
    $shippingAddress: String!
    $billingAddress: String!
    $price: Float!
    $order: ID!
    $distance: Float!
  ) {
    addQuotation(
      name: $name!
      pickUpAddress: $pickUpAddress!
      shippingAddress: $shippingAddress!
      billingAddress: $billingAddress!
      price: $price!
      order: $order!
      distance: $distance!
    ) {
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

// Mutation to delete a quotation
const DELETE_QUOTATION = gql`
	mutation DeleteQuotation($quotationID: ID!) {
		deleteQuotation(quotationID: $quotationID) {
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

export { ADD_QUOTATION, DELETE_QUOTATION };
