import {gql} from '@apollo/client/core';

// Mutation to add a delivery man
const ADD_DELIVERY_MAN = gql`
	mutation AddDeliveryMan(
		$name: String!
		$phoneNumber: String!
		$emailAddress: String!
		$loginInfo: String!
	) {
		addDeliveryMan(
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
			numberOfOrder
			orders
			token
		}
	}
`;

// Mutation to delete a delivery man
const DELETE_DELIVERY_MAN = gql`
	mutation DeleteDeliveryMan($emailAddress: String!) {
		deleteDeliveryMan(emailAddress: $emailAddress) {
			id
			name
			phoneNumber
			emailAddress
			loginInfo
			token
		}
	}
`;
const GET_ADMINS = gql`
	mutation getAdmins {
		admins {
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
const GET_ADMIN = gql`
	mutation getAdmin($id: ID!) {
		admin(id: null) {
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
export { ADD_DELIVERY_MAN, DELETE_DELIVERY_MAN, GET_ADMIN, GET_ADMINS };
