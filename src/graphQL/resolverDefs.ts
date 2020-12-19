import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';
import * as path from 'path';

const resolversArray = fileLoader(path.join(__dirname, './resolvers'));
const resolvers = mergeResolvers(resolversArray);

export default resolvers;
