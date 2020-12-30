import { IResolvers, ISchemaLevelResolver, composeResolvers } from 'graphql-tools';
import { Context } from '../../types';
import { JobType, MutationIdResult, MutationResult, NewSiteInput, SiteType, UpdateSiteInput } from '../types';
import { ObjectID } from 'mongodb';
import { createMutationIdResult, createMutationResult, fallthroughResolver, jobDocToType } from './utils';
import validationResolvers from './validation/site';

type CreateSiteResolver = ISchemaLevelResolver<void, Context, { site: NewSiteInput }, Promise<MutationIdResult>>;
type UpdateSiteResolver = ISchemaLevelResolver<void, Context, { id: string; update: UpdateSiteInput }, Promise<MutationResult>>;
type DeleteSiteResolver = ISchemaLevelResolver<void, Context, { id: string }, Promise<MutationResult>>;
type RunJobResolver = ISchemaLevelResolver<void, Context, { id: string }, Promise<MutationIdResult>>;

type SiteLatestJobResolver = ISchemaLevelResolver<SiteType, Context, void, Promise<JobType | null>>;

const create: CreateSiteResolver = async (_, { site }, { db, getUser }) => {
  const doc = { ...site, _id: new ObjectID(), userId: new ObjectID(getUser().id) };
  await db.siteModel.create(doc);
  return createMutationIdResult(doc._id.toHexString(), 'OK');
};

const update: UpdateSiteResolver = async (_, { id, update }, { db, getUser }) => {
  const site = await db.siteModel.findOne({ _id: id });
  if (site == null || site.userId.toHexString() !== getUser().id) {
    return createMutationResult('NOT_FOUND');
  }

  const updatedSite = await db.siteModel.findOneAndUpdate({ _id: id }, update, { new: true });
  if (updatedSite == null) {
    return createMutationResult('NOT_FOUND');
  }

  return createMutationResult('OK');
};

const _delete: DeleteSiteResolver = async (_, { id }, { db, getUser }) => {
  const site = await db.siteModel.findOneAndDelete({ _id: id, userId: getUser().id });
  if (site == null) {
    return createMutationResult('NOT_FOUND');
  }

  return createMutationResult('OK');
};

const runJob: RunJobResolver = async (_, { id }, { db, getUser }) => {
  const site = await db.siteModel.findOne({ _id: id, userId: getUser().id });
  if (site == null) {
    return createMutationResult('NOT_FOUND');
  }

  const doc = {
    _id: new ObjectID(),
    userId: new ObjectID(getUser().id),
    url: site.url,
    subsites: site.subsites,
    viewports: site.viewports,
    quality: site.quality,
    status: false,
    aquired: false,
    progress: 0,
  };
  await db.jobModel.create(doc);
  await db.siteModel.updateOne({ _id: id }, { $set: { latestJobId: doc._id } });

  return createMutationIdResult(doc._id.toHexString(),'OK');
};

const latestJob: SiteLatestJobResolver = async (parent, _args, { db }) => {
  if (!parent.latestJobId) {
    return null;
  }

  const doc = await db.jobModel.findOne({ _id: parent.latestJobId });
  if (!doc) {
    return null;
  }

  return jobDocToType(doc);
};

const resolvers: IResolvers = {
  Mutation: { site: fallthroughResolver },
  SiteMutation: { runJob, create, update, delete: _delete },
  SiteWithJob: { latestJob },
};

export default composeResolvers(resolvers, validationResolvers);
