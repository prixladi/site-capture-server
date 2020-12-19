import { IResolvers, ISchemaLevelResolver } from 'graphql-tools';
import { Context } from '../../types';
import { NewTemplateInput, TemplateType } from '../types';
import { ObjectID } from 'mongodb';
import { notFoundError, templateDocToType } from '../helpers';

type TemplateResolver = ISchemaLevelResolver<void, Context, { id: string }, Promise<TemplateType>>;
type CreateTemplateResolver = ISchemaLevelResolver<void, Context, { template: NewTemplateInput }, Promise<TemplateType>>;

const template: TemplateResolver = async (_, { id }, { db }) => {
  const template = await db.TemplateModel.findById(id);
  if (template == null) {
    throw notFoundError(`Template with id '${id}' was not found`);
  }

  return templateDocToType(template);
};

const createTemplate: CreateTemplateResolver = async (_, { template }, { db, user }) => {
  const doc = { ...template, _id: new ObjectID(), userId: new ObjectID(user!.id) };
  await db.TemplateModel.create(doc);
  return templateDocToType(doc);
};

const resolvers: IResolvers = {
  Query: { template },
  Mutation: { createTemplate },
};

export default resolvers;
