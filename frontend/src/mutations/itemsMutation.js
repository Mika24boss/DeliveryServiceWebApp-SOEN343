import {gql} from '@apollo/client/core';

// Mutation to add an item
const ADD_ITEM = gql`
	mutation AddItem($name: String!, $quantity: Int!) {
		addItem(name: $name, quantity: $quantity) {
			name
			quantity
		}
	}
`;

// Mutation to delete an item
// const DELETE_ITEM = gql`
// 	mutation DeleteItem($name: String!) {
// 		deleteItem(name: $name) {
// 			name
// 			quantity
// 		}
// 	}
// `;
const GET_ITEMS = gql`
	mutation Items {
		items {
			name
			quantity
		}
	}
`;

const GET_ITEM = gql`
	mutation Item($id: ID!) {
		item(id: $id) {
			name
			quantity
		}
	}
`;
export { ADD_ITEM, GET_ITEMS, GET_ITEM };
