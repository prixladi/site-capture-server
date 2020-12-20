import { IResolvers, ISchemaLevelResolver, composeResolvers } from 'graphql-tools';
import { Context } from '../../types';
import { MutationIdResult, MutationResult, NewSiteInput, PaginationInput, SiteType, UpdateSiteInput } from '../types';
import { ObjectID } from 'mongodb';
import { fallthroughResolver, siteDocToType } from '../helpers';
import validationResolvers from './validation/site';

type SitesResolver = ISchemaLevelResolver<void, Context, { filter: PaginationInput }, Promise<SiteType[]>>;
type SiteResolver = ISchemaLevelResolver<void, Context, { id: string }, Promise<SiteType | null>>;

type CreateSiteResolver = ISchemaLevelResolver<void, Context, { site: NewSiteInput }, Promise<MutationIdResult>>;
type UpdateSiteResolver = ISchemaLevelResolver<void, Context, { id: string; update: UpdateSiteInput }, Promise<MutationResult>>;
type DeleteSiteResolver = ISchemaLevelResolver<void, Context, { id: string }, Promise<MutationResult>>;

const sites: SitesResolver = async (_, { filter }, { db }) => {
  const options = { skip: filter.skip, limit: filter.limit };
  const sites = await db.SiteModel.find({ isPublic: true }, null, options);
  return sites.map(siteDocToType);
};

const site: SiteResolver = async (_, { id }, { db }) => {
  const site = await db.SiteModel.findOne({ _id: id, isPublic: true });
  if (!site) {
    return null;
  }

  return siteDocToType(site);
};

const create: CreateSiteResolver = async (_, { site }, { user, db }) => {
  const doc = { ...site, _id: new ObjectID(), userId: new ObjectID(user!.id) };
  await db.SiteModel.create(doc);
  return { id: doc._id.toString(), query: {}, status: 'OK' };
};

const update: UpdateSiteResolver = async (_, { id, update }, { user, db }) => {
  const site = await db.SiteModel.findOne({ _id: id });
  if (site == null || site.userId.toString() !== user!.id) {
    return { query: {}, status: 'NOT_FOUND' };
  }

  const updatedSite = await db.SiteModel.findOneAndUpdate({ _id: id }, update, { new: true });
  if (updatedSite == null) {
    return { query: {}, status: 'NOT_FOUND' };
  }

  return { query: {}, status: 'OK' };
};

const _delete: DeleteSiteResolver = async (_, { id }, { user, db }) => {
  const site = await db.SiteModel.findOneAndDelete({ _id: id, userId: user!.id });
  if (site == null) {
    return { query: {}, status: 'NOT_FOUND' };
  }

  return { query: {}, status: 'OK' };
};

const resolvers: IResolvers = {
  Query: { sites, site },
  Mutation: { site: fallthroughResolver },
  SiteMutation: { create, update, delete: _delete },
};

export default composeResolvers(resolvers, validationResolvers);
