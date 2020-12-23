import { composeResolvers, IResolvers, ISchemaLevelResolver } from 'graphql-tools';
import { Context } from '../../types';
import { JobType, MutationIdResult, NewJobInput } from '../types';
import { createMutationIdResult, jobDocToType } from './utils';
import { ObjectID } from 'mongodb';
import validationResolvers from './validation/job';

type JobResolver = ISchemaLevelResolver<void, Context, { id: string }, Promise<JobType | null>>;
type RunJobResolver = ISchemaLevelResolver<void, Context, { job: NewJobInput }, Promise<MutationIdResult>>;

const anonymousJob: JobResolver = async (_, { id }, { db }) => {
  const job = await db.jobModel.findOne({ $and: [{ _id: id }, { userId: { $exists: false } }] });
  if (!job) {
    return null;
  }

  return jobDocToType(job);
};

const runAnonymousJob: RunJobResolver = async (_, { job }, { db }) => {
  const doc = {
    _id: new ObjectID(),
    url: job.url,
    quality: job.quality,
    subsites: [],
    viewports: job.viewports,
    status: false,
    aquired: false,
    progress: 0,
  };
  db.jobModel.create(doc);

  return createMutationIdResult(doc._id.toString(), 'OK');
};

const resolvers: IResolvers = {
  Query: { anonymousJob },
  Mutation: { runAnonymousJob },
};

export default composeResolvers(resolvers, validationResolvers);
