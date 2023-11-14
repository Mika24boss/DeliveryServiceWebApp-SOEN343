import {gql} from '@apollo/client/core';

// Mutation to add a client
const ADD_CLIENT = gql`
	mutation AddClient(
		$name: String!
		$phoneNumber: String!
		$emailAddress: String!
		$loginInfo: String!
		$role: String!
	) {
		addClient(
			name: $name
			phoneNumber: $phoneNumber
			emailAddress: $emailAddress
			loginInfo: $loginInfo
			role: $role
		) {
			id
			name
			phoneNumber
			emailAddress
			loginInfo
			role
			quotations
			order
			token
		}
	}
`;
// Mutation to delete a client
const DELETE_CLIENT = gql`
	mutation DeleteClient($emailAddress: String!) {
		deleteClient(emailAddress: $emailAddress) {
			id
			name
			phoneNumber
			emailAddress
			loginInfo
			token
		}
	}
`;
export { ADD_CLIENT, DELETE_CLIENT };
