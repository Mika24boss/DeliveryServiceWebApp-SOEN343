import {gql} from '@apollo/client/core';

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
const GET_DELIVERYMANS = gql`
	mutation getDeliveryMans {
		deliverymans {
			id
			name
			phoneNumber
			emailAddress
			loginInfo
			role
			numberOfOrder
			orders
			token
		}
	}
`;
const GET_DELIVERYMAN = gql`
	mutation getDeliveryMan($id: ID!) {
		deliveryman(id: $id) {
			id
			name
			phoneNumber
			emailAddress
			loginInfo
			role
			numberOfOrder
			orders
			token
		}
	}
`;
export { DELETE_ADMIN, ADD_ADMIN, GET_DELIVERYMAN, GET_DELIVERYMANS };
