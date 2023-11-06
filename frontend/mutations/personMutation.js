import { gql } from '@apollo/client';

const ADD_PERSON = gql`
    mutation addPerson($name: String!, $emailAddress: String!, $phoneNumber: String!){
        addClient(name: $name, emailAddress: $emailAddress, phoneNumber: $phoneNumber){
        id
        name
        email
        phoneNumber
    }
}
`;
