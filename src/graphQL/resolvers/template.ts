import { composeResolvers, IResolvers, ISchemaLevelResolver } from 'graphql-tools';
import { Context } from '../../types';
import { MutationIdResult, MutationResult, NewTemplateInput, UpdateTemplateInput } from '../types';
import { ObjectID } from 'mongodb';
import { createMutationIdResult, createMutationResult, fallthroughResolver } from './utils';
import validationResolvers from './validation/template';

type CreateTemplateResolver = ISchemaLevelResolver<void, Context, { template: NewTemplateInput }, Promise<MutationIdResult>>;
type UpdateTemplateResolver = ISchemaLevelResolver<void, Context, { id: string; update: UpdateTemplateInput }, Promise<MutationResult>>;
type DeleteTemplateResolver = ISchemaLevelResolver<void, Context, { id: string }, Promise<MutationResult>>;

const create: CreateTemplateResolver = async (_, { template }, { db, getUser }) => {
  const doc = { ...template, _id: new ObjectID(), userId: new ObjectID(getUser().id) };
  await db.templateModel.create(doc);
  return createMutationIdResult(doc._id.toString(), 'OK');
};

const update: UpdateTemplateResolver = async (_, { id, update }, { db, getUser }) => {
  const template = await db.templateModel.findOne({ _id: id });
  if (template == null || template.userId.toString() !== getUser().id) {
    return createMutationResult('NOT_FOUND');
  }

  const updatedSite = await db.templateModel.findOneAndUpdate({ _id: id }, update, { new: true });
  if (updatedSite == null) {
    return createMutationResult('NOT_FOUND');
  }

  return createMutationResult('OK');
};

const _delete: DeleteTemplateResolver = async (_, { id }, { db, getUser }) => {
  const template = await db.templateModel.findOneAndDelete({ _id: id, userId: getUser().id });
  if (template == null) {
    return createMutationResult('NOT_FOUND');
  }

  return createMutationResult('OK');
};

const resolvers: IResolvers = {
  Mutation: { template: fallthroughResolver },
  TemplateMutation: { create, update, delete: _delete },
};

export default composeResolvers(resolvers, validationResolvers);
