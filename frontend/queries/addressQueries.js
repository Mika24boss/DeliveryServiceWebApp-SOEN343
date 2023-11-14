import { gql } from '@apollo/client';

const GET_ADDRESSES = gql`
	query Addresses {
		addresses {
			id
			street
			city
			state
			province
			country
			postalCode
		}
	}
`;

const GET_ADDRESS = gql`
	query Address($id: ID!) {
		address(id: $id) {
			id
			street
			city
			state
			province
			country
			postalCode
		}
	}
`;

export { GET_ADDRESSES, GET_ADDRESS };
