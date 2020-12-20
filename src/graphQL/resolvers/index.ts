import { mergeResolvers } from 'graphql-tools';

import meResolver from './me';
import siteResolver from './site';
import templateResolver from './template';

const resolvers = mergeResolvers([meResolver, siteResolver, templateResolver]);

export default resolvers;
