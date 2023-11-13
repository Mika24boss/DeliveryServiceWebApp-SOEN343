import {gql} from '@apollo/client';

// Mutation to add an address
const ADD_ADDRESS = gql`
	mutation AddAddress(
		$street: String!
		$city: String!
		$state: String!
		$province: String!
		$country: String!
		$postalCode: String!
	) {
		addAddress(
			street: $street
			city: $city
			state: $state
			province: $province
			country: $country
			postalCode: $postalCode
		) {
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

// Mutation to delete an address
const DELETE_ADDRESS = gql`
	mutation DeleteAddress($id: ID!) {
		deleteAddress(id: $id) {
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

export { ADD_ADDRESS, DELETE_ADDRESS };
