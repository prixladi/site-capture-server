import { DB } from './db';

type User = {
  id: string;
};

type Context = {
  db: DB;
  user?: User;
  getUser: () => User;
};

export { Context };
