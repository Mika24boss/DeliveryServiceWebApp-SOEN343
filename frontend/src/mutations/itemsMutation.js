import {gql} from '@apollo/client/core';

// Mutation to add an item
const ADD_ITEM = gql`
	mutation AddItem($name: String!, $isFragile: Boolean!, $price: Float!) {
		addItem(name: $name, isFragile: $isFragile, price: $price) {
			name
			isFragile
			price
		}
	}
`;

// Mutation to delete an item
const DELETE_ITEM = gql`
	mutation DeleteItem($name: String!) {
		deleteItem(name: $name) {
			name
			isFragile
			price
		}
	}
`;

export { ADD_ITEM, DELETE_ITEM };
