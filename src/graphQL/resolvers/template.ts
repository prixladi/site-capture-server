import { IResolvers, ISchemaLevelResolver } from 'graphql-tools';
import { Context } from '../../types';
import { MutationIdResult, MutationResult, NewTemplateInput, TemplateType, UpdateTemplateInput } from '../types';
import { ObjectID } from 'mongodb';
import { fallthroughResolver, templateDocToType } from '../helpers';

type TemplateResolver = ISchemaLevelResolver<void, Context, { id: string }, Promise<TemplateType | null>>;

type CreateTemplateResolver = ISchemaLevelResolver<void, Context, { template: NewTemplateInput }, Promise<MutationIdResult>>;
type UpdateTemplateResolver = ISchemaLevelResolver<void, Context, { id: string; update: UpdateTemplateInput }, Promise<MutationResult>>;
type DeleteTemplateResolver = ISchemaLevelResolver<void, Context, { id: string }, Promise<MutationResult>>;

const template: TemplateResolver = async (_, { id }, { db }) => {
  const template = await db.TemplateModel.findById(id);
  if (!template) {
    return null;
  }

  return templateDocToType(template);
};

const create: CreateTemplateResolver = async (_, { template }, { db, user }) => {
  const doc = { ...template, _id: new ObjectID(), userId: new ObjectID(user!.id) };
  await db.TemplateModel.create(doc);
  return { id: doc._id.toString(), query: {}, status: 'OK' };
};

const update: UpdateTemplateResolver = async (_, { id, update }, { user, db }) => {
  const template = await db.TemplateModel.findOne({ _id: id });
  if (template == null || template.userId.toString() !== user!.id) {
    return { query: {}, status: 'NOT_FOUND' };
  }

  const updatedSite = await db.TemplateModel.findOneAndUpdate({ _id: id }, update, { new: true });
  if (updatedSite == null) {
    return { query: {}, status: 'NOT_FOUND' };
  }

  return { query: {}, status: 'OK' };
};

const _delete: DeleteTemplateResolver = async (_, { id }, { user, db }) => {
  const template = await db.TemplateModel.findOneAndDelete({ _id: id, userId: user!.id });
  if (template == null) {
    return { query: {}, status: 'NOT_FOUND' };
  }

  return { query: {}, status: 'OK' };
};

const resolvers: IResolvers = {
  Query: { template },
  Mutation: { template: fallthroughResolver },
  TemplateMutation: { create, update, delete: _delete },
};

export default resolvers;
