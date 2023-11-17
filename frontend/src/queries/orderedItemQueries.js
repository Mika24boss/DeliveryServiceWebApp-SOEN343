import { gql } from '@apollo/client/core';

const GET_ORDERED_ITEMS = gql`
	query OrderedItems {
		orderedItems {
			size
			quantity
			items
		}
	}
`;

const GET_ORDERED_ITEM = gql`
	query OrderedItem($id: ID!) {
		orderedItem(id: $id) {
			size
			quantity
			items
		}
	}
`;

export { GET_ORDERED_ITEMS, GET_ORDERED_ITEM };
