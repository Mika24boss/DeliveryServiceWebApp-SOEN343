import {gql} from '@apollo/client';

// Mutation to delete an admin
const DELETE_ADMIN = gql`
	mutation DeleteAdmin($emailAddress: String!) {
		deleteAdmin(emailAddress: $emailAddress) {
			id
			name
			phoneNumber
			emailAddress
			loginInfo
			token
		}
	}
`;

// Mutation to add an admin
const ADD_ADMIN = gql`
	mutation AddAdmin(
		$name: String!
		$phoneNumber: String!
		$emailAddress: String!
		$loginInfo: String!
	) {
		addAdmin(
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
			token
		}
	}
`;

export { DELETE_ADMIN, ADD_ADMIN };
