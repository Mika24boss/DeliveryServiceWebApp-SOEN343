import {gql} from '@apollo/client/core';

// Mutation to add a client
const ADD_CLIENT = gql`
	mutation AddClient(
		$name: String!
		$phoneNumber: String!
		$emailAddress: String!
		$loginInfo: String!
	) {
		addClient(
			name: $name
			phoneNumber: $phoneNumber
			emailAddress: $emailAddress
			loginInfo: $loginInfo
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
const GET_CLIENTS = gql`
	mutation getClients {
		clients {
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
const GET_CLIENT = gql`
	mutation getClient($id: ID!) {
		client(id: $id) {
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
export { ADD_CLIENT, DELETE_CLIENT, GET_CLIENT, GET_CLIENTS };
