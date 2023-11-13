import { gql } from '@apollo/client';

const ADD_PERSON = gql`
	mutation addPerson($name: String!, $emailAddress: String!, $phoneNumber: String!) {
		addClient(name: $name, emailAddress: $emailAddress, phoneNumber: $phoneNumber) {
			id
			name
			email
			phoneNumber
		}
	}
`;
// Mutation to delete a person
const DELETE_PERSON = gql`
	mutation DeletePerson($emailAddress: String!) {
		deletePerson(emailAddress: $emailAddress) {
			id
			name
			phoneNumber
			emailAddress
			loginInfo
			token
		}
	}
`;

// Mutation to update a person
const UPDATE_PERSON = gql`
	mutation UpdatePerson(
		$id: ID!
		$name: String!
		$emailAddress: String!
		$phoneNumber: String!
		$loginInfo: String!
	) {
		updatePerson(
			id: $id
			name: $name
			emailAddress: $emailAddress
			phoneNumber: $phoneNumber
			loginInfo: $loginInfo
		) {
			id
			name
			phoneNumber
			emailAddress
			loginInfo
			token
		}
	}
`;

// Mutation to perform login
const LOGIN = gql`
	mutation Login($emailAddress: String!, $password: String!) {
		login(emailAddress: $emailAddress, password: $password) {
			id
			name
			phoneNumber
			emailAddress
			loginInfo
			token
		}
	}
`;

export { ADD_PERSON, DELETE_PERSON, UPDATE_PERSON, LOGIN };
