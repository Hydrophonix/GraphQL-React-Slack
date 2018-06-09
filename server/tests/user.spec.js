import axios from 'axios';

const PORT = 8080;

describe('user resolvers', () => {
  test('allUsers', async () => {
    const response = await axios.post(`http://localhost:${PORT}/graphql`, {
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
        allUsers: [
          {
            id: 1,
            email: 'hydro@hydro.hydro',
            username: 'hydro',
          },
          {
            id: 2,
            email: 'hydro2@hydro.hydro',
            username: 'hydrophonix',
          },
          {
            id: 3,
            email: 'goose@goose.goose',
            username: 'goose',
          },
        ],
      },
    });
  });
});
