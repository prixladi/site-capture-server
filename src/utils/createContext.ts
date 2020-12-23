import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { validateToken } from '../auth';
import { DB } from '../db';
import { Context } from '../types';
import { Request } from 'express';

const tokenType = 'Bearer';

const getToken = (req: Request) => {
  const token = req.header('Authorization');
  return token && token.startsWith(tokenType) && token.substring(tokenType.length + 1);
};

const createContext = (db: DB) => ({ req }: ExpressContext): Context => {
  const token = getToken(req);

  if (token) {
    const payload = validateToken(token);
    if (payload) {
      const user = {
        id: payload.name,
      };

      return {
        db,
        user,
        getUser: () => {
          return user;
        },
      };
    }
  }

  return {
    db,
    getUser: () => {
      throw new Error('Unable to retrieve user in this context.');
    },
  };
};

export default createContext;
