import { rule, shield } from 'graphql-shield';
import { Context } from '../../types';
import { unauthorizedError } from '../helpers';

const isAuthenticated = rule({ cache: 'contextual' })(async (_, _args, { user }: Context) => {
  if (!user) {
    return unauthorizedError('User is not authorized.');
  }

  return true;
});

const permissions = shield({
  Query: {
    me: isAuthenticated,
  },
  Mutation: {
    createSite: isAuthenticated,
    updateSite: isAuthenticated,
  },
});

export { permissions };
