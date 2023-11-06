import { gql } from '@apollo/client';

const GET_PERSON = gql`
  query getPersons {
    persons {
      id
      name
      emailAddress
      phoneNumber
    }
  }
`;

export { GET_PERSON };