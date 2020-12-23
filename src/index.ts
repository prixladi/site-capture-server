import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import schema from './graphQL';
import { connect as connectDb, disconnect as disconnectDb } from './db';
import corsHandler from './utils/corsHandler';
import { appPort } from './configs';
import appoloLogger from './utils/appoloLogger';
import createContext from './utils/createContext';
import { startTokenFetching } from './auth';
import { ObjectID } from 'mongodb';
import createFileDownloadHandler from './fileDownload';

const registerShutdown = () => {
  const shutdown = async () => {
    await disconnectDb();
    process.exit();
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

export interface IGridFSObject {
  _id: ObjectID;
  length: number;
  chunkSize: number;
  uploadDate: Date;
  md5: string;
  filename: string;
}

const main = async (): Promise<void> => {
  const db = await connectDb();
  const app = express();
  const apolloServer = new ApolloServer({
    schema,
    playground: true,
    logger: appoloLogger,
    context: createContext(db),
  });

  app.use(corsHandler);
  apolloServer.applyMiddleware({ app, path: '/graphql' });
  startTokenFetching();

  const { fileBucket } = db;
  app.use('/downloads/:fileId', createFileDownloadHandler(fileBucket));

  registerShutdown();

  app.listen(appPort, (): void => {
    console.log(`GraphQL is now running on http://localhost:${appPort}/graphql`);
  });
};

main().catch((err) => {
  console.error(err);
});
