import {gql} from '@apollo/client/core';

// Mutation to add an ordered item
const ADD_ORDERED_ITEM = gql`
	mutation AddOrderedItem($size: String!, $quantity: Int!, $items: [String]!) {
		addOrderedItem(size: $size, quantity: $quantity, items: $items) {
			size
			quantity
			items
		}
	}
`;

// Mutation to delete an ordered item
const DELETE_ORDERED_ITEM = gql`
	mutation DeleteOrderedItem($orderID: ID!) {
		deleteOrderedItem(orderID: $orderID) {
			size
			quantity
			items
		}
	}
`;
const GET_ORDERED_ITEMS = gql`
	mutation OrderedItems {
		orderedItems {
			size
			quantity
			items
		}
	}
`;

const GET_ORDERED_ITEM = gql`
	mutation OrderedItem($id: ID!) {
		orderedItem(id: $id) {
			size
			quantity
			items
		}
	}
`;

export { ADD_ORDERED_ITEM, DELETE_ORDERED_ITEM, GET_ORDERED_ITEM, GET_ORDERED_ITEMS };
