import { gql } from '@apollo/client';

const GET_ITEMS = gql`
	query Items {
		items {
			name
			isFragile
			price
		}
	}
`;

const GET_ITEM = gql`
	query Item($id: ID!) {
		item(id: $id) {
			name
			isFragile
			price
		}
	}
`;

export { GET_ITEMS, GET_ITEM };
