import { composeResolvers, IResolvers, ISchemaLevelResolver } from 'graphql-tools';
import { Context } from '../../types';
import { fallthroughResolver, siteDocToType, templateDocToType } from './utils';
import { MeType, SiteType, TemplateType } from '../types';
import validationResolvers from './validation/me';

type TemplatesResolver = ISchemaLevelResolver<void, Context, Record<string, string>, Promise<TemplateType[]>>;
type TemplateResolver = ISchemaLevelResolver<void, Context, { id: string }, Promise<TemplateType | null>>;
type SitesResolver = ISchemaLevelResolver<void, Context, Record<string, string>, Promise<SiteType[]>>;
type SiteResolver = ISchemaLevelResolver<void, Context, { id: string }, Promise<SiteType | null>>;

type MeResolver = ISchemaLevelResolver<void, void, Record<string, string>, MeType>;

const site: SiteResolver = async (_, { id }, { db, getUser }) => {
  const site = await db.siteModel.findOne({ _id: id, userId: getUser().id });
  if (!site) {
    return null;
  }

  return siteDocToType(site);
};

const template: TemplateResolver = async (_, { id }, { db, getUser }) => {
  const template = await db.templateModel.findOne({ _id: id, userId: getUser().id });
  if (!template) {
    return null;
  }

  return templateDocToType(template);
};
const me: MeResolver = fallthroughResolver;

const templates: TemplatesResolver = async (_, _args, { db, getUser }) => {
  const templates = await db.templateModel.find({ userId: getUser().id });
  return templates.map(templateDocToType);
};

const sites: SitesResolver = async (_, _args, { db, getUser }) => {
  const sites = await db.siteModel.find({ userId: getUser().id });
  return sites.map(siteDocToType);
};

const resolvers: IResolvers = {
  Query: { me },
  Me: { templates, template, sites, site },
};

export default composeResolvers(resolvers, validationResolvers);
