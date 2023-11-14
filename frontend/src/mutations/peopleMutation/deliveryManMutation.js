import {gql} from '@apollo/client/core';

// Mutation to add a delivery man
const ADD_DELIVERY_MAN = gql`
	mutation AddDeliveryMan(
		$name: String!
		$phoneNumber: String!
		$emailAddress: String!
		$loginInfo: String!
		$role: String!
	) {
		addDeliveryMan(
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

export { ADD_DELIVERY_MAN, DELETE_DELIVERY_MAN, DELETE_ORDER };
