import { IResolvers, ISchemaLevelResolver } from 'graphql-tools';
import { Context } from '../../types';
import { fallthroughResolver, siteDocToType, templateDocToType } from '../helpers';
import { MeType, SiteType, TemplateType } from '../types';

type TemplatesResolver = ISchemaLevelResolver<void, Context, Record<string, string>, Promise<TemplateType[]>>;
type TemplateResolver = ISchemaLevelResolver<void, Context, { id: string }, Promise<TemplateType | null>>;
type SitesResolver = ISchemaLevelResolver<void, Context, Record<string, string>, Promise<SiteType[]>>;
type SiteResolver = ISchemaLevelResolver<void, Context, { id: string }, Promise<SiteType | null>>;

type MeResolver = ISchemaLevelResolver<void, void, Record<string, string>, MeType>;

const site: SiteResolver = async (_, { id }, { db, user }) => {
  const site = await db.SiteModel.findOne({ _id: id, userId: user!.id });
  if (!site) {
    return null;
  }

  return siteDocToType(site);
};

const template: TemplateResolver = async (_, { id }, { user, db }) => {
  const template = await db.TemplateModel.findOne({ _id: id, userId: user!.id });
  if (!template) {
    return null;
  }

  return templateDocToType(template);
};
const me: MeResolver = fallthroughResolver;

const templates: TemplatesResolver = async (_, _args, { db, user }) => {
  const templates = await db.TemplateModel.find({ userId: user!.id });
  return templates.map(templateDocToType);
};

const sites: SitesResolver = async (_, _args, { db, user }) => {
  const sites = await db.SiteModel.find({ userId: user!.id });
  return sites.map(siteDocToType);
};

const resolvers: IResolvers = {
  Query: { me },
  Me: { templates, template, sites, site },
};

export default resolvers;
