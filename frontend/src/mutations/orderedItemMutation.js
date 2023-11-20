import {gql} from '@apollo/client/core';

// Mutation to add an ordered item
const ADD_ORDERED_ITEM = gql`
	mutation AddOrderedItem($items: [ID]!) {
		addOrderedItem(items: $items) {
			items
		}
	}
`;

// Mutation to delete an ordered item
const DELETE_ORDERED_ITEM = gql`
	mutation DeleteOrderedItem($orderID: ID!) {
		deleteOrderedItem(orderID: $orderID) {
			items
		}
	}
`;
const GET_ORDERED_ITEMS = gql`
	mutation OrderedItems {
		orderedItems {
			items
		}
	}
`;

const GET_ORDERED_ITEM = gql`
	mutation OrderedItem($id: ID!) {
		orderedItem(id: $id) {
			items
		}
	}
`;

export { ADD_ORDERED_ITEM, DELETE_ORDERED_ITEM, GET_ORDERED_ITEM, GET_ORDERED_ITEMS };
