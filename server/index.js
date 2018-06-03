import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';

import models from './models';
import { refreshTokens } from './auth';

const SECRET = 'dsrh7gs7hs7dfh7s87h';
const SECRET2 = 'gsegseges423yhdfh35hdfh3';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const PORT = 8080;
const app = express();
app.use(cors('*'));

const addUser = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};

app.use(addUser);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const graphqlEndpoint = '/graphql';

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      user: req.user,
      SECRET,
      SECRET2,
    },
  })),
);

app.use('/graphiql', graphiqlExpress({
  endpointURL: graphqlEndpoint,
  subscriptionsEndpoint: `ws://localhost:${PORT}/subscriptions`,
}));

const server = createServer(app);

models.sequelize.sync({}).then(() => {
  server.listen(PORT, () => {
    // eslint-disable-next-line no-new
    new SubscriptionServer({
      execute,
      subscribe,
      schema,
      onConnect: async ({ token, refreshToken }, webSocket) => {
        if (token && refreshToken) {
          let userok = null;
          try {
            const payload = jwt.verify(token, SECRET);
            userok = payload.user;
          } catch (err) {
            const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
            userok = newTokens.user;
          }
          if (!userok) {
            throw new Error('Invalid auth tokens');
          }

          // const member = await models.Member.findOne({ where: { teamId: 1, userId: userok.id } });
          // if (!member) {
          //   throw new Error('Missing auth tokens!');
          // }
          return true;
        }

        throw new Error('Missing auth tokens!');
      },
    }, {
      server,
      path: '/subscriptions',
    });
  });
});
