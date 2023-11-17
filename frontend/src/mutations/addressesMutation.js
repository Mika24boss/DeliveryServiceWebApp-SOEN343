import {gql} from '@apollo/client/core';

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

export { ADD_ADDRESS, DELETE_ADDRESS, GET_ADDRESS, GET_ADDRESSES };
