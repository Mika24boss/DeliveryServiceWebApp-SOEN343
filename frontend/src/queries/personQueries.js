import { gql } from '@apollo/client';

const GET_PERSONS = gql`
	query getPersons {
		persons {
			id
			name
			phoneNumber
			emailAddress
			loginInfo
			token
		}
	}
`;
const GET_PERSON = gql`
	query getPerson($id: ID!) {
		person(id: $id) {
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
	query getClients {
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
	query getClient($id: ID!) {
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
const GET_ADMINS = gql`
	query getAdmins {
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
	query getAdmin($id: ID!) {
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
const GET_DELIVERYMANS = gql`
	query getDeliveryMans {
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
	query getDeliveryMan($id: ID!) {
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
export {
	GET_PERSONS,
	GET_PERSON,
	GET_DELIVERYMANS,
	GET_DELIVERYMAN,
	GET_ADMIN,
	GET_ADMINS,
	GET_CLIENT,
	GET_CLIENTS
};
