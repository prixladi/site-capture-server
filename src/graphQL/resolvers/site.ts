import { IResolvers, ISchemaLevelResolver } from 'graphql-tools';
import { Context } from '../../types';
import { NewSiteInput, SiteType, UpdateSiteInput } from '../types';
import { ObjectID } from 'mongodb';
import { notFoundError, siteDocToType } from '../helpers';

type SitesResolver = ISchemaLevelResolver<void, Context, Record<string, string>, Promise<SiteType[]>>;
type SiteResolver = ISchemaLevelResolver<void, Context, { id: string }, Promise<SiteType>>;
type CreateSiteResolver = ISchemaLevelResolver<void, Context, { site: NewSiteInput }, Promise<SiteType>>;
type UpdateSiteResolver = ISchemaLevelResolver<void, Context, { id: string; update: UpdateSiteInput }, Promise<SiteType>>;

const sites: SitesResolver = async (_, _args, { db }) => {
  const sites = await db.SiteModel.find();
  return sites.map(siteDocToType);
};

const site: SiteResolver = async (_, { id }, { db }) => {
  const site = await db.SiteModel.findById(id);
  if (site == null) {
    throw notFoundError(`Site with id '${id}' was not found`);
  }

  return siteDocToType(site);
};

const createSite: CreateSiteResolver = async (_, { site }, { user, db }) => {
  const doc = { ...site, _id: new ObjectID(), userId: new ObjectID(user!.id) };
  await db.SiteModel.create(doc);
  return siteDocToType(doc);
};

const updateSite: UpdateSiteResolver = async (_, { id, update }, { db }) => {
  const site = await db.SiteModel.findOneAndUpdate({ _id: id }, update, { new: true });
  if (site == null) {
    throw notFoundError(`Site with id '${id}' was not found`);
  }

  return siteDocToType(site);
};

const resolvers: IResolvers = {
  Query: { sites, site },
  Mutation: { createSite, updateSite },
};

export default resolvers;
