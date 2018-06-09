import axios from 'axios';
import { XMLHttpRequest } from 'xmlhttprequest';

global.XMLHttpRequest = XMLHttpRequest;

const PORT = 8080;
const URL = `http://localhost:${PORT}/graphql`;

describe('user resolvers', () => {
  test('allUsers', async () => {
    const response = await axios.post(URL, {
      query: `
      query {
        allUsers {
          id
          username
          email
        }
      }
      `,
    });

    const { data } = response;
    expect(data).toMatchObject({
      data: {
        allUsers: [],
      },
    });
  });

  test('create team', async () => {
    const response = await axios.post(URL, {
      query: `
      mutation {
        register(username: "testuser", email: "testuser@testuser.com", password: "tester") {
          ok
          errors {
            path
            message
          }
          user {
            username
            email
          }
        }
      }
      `,
    });

    const { data } = response;
    expect(data).toMatchObject({
      data: {
        register: {
          ok: true,
          errors: null,
          user: {
            username: 'testuser',
            email: 'testuser@testuser.com',
          },
        },
      },
    });

    const response2 = await axios.post(URL, {
      query: `
      mutation {
        login(email: "testuser@testuser.com", password: "tester") {
          token
          refreshToken
        }
      }
      `,
    });

    const { data: { login: { token, refreshToken } } } = response2.data;

    const response3 = await axios.post(
      URL,
      {
        query: `
      mutation {
        createTeam(name: "team1") {
          ok
          team {
            name
          }
        }
      }
      `,
      },
      {
        headers: {
          'x-token': token,
          'x-refresh-token': refreshToken,
        },
      },
    );

    expect(response3.data).toMatchObject({
      data: {
        createTeam: {
          ok: true,
          team: {
            name: 'team1',
          },
        },
      },
    });
  });
});
