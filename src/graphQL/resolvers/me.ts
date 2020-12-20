import { IResolvers, ISchemaLevelResolver } from 'graphql-tools';
import { Context } from '../../types';
import { fallthroughResolver, siteDocToType, templateDocToType } from '../helpers';
import { MeType, SiteType, TemplateType } from '../types';

type TemplatesResolver = ISchemaLevelResolver<void, Context, Record<string, string>, Promise<TemplateType[]>>;
type SitesResolver = ISchemaLevelResolver<void, Context, Record<string, string>, Promise<SiteType[]>>;
type MeResolver = ISchemaLevelResolver<void, void, Record<string, string>, MeType>;

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
  Me: { templates, sites },
};

export default resolvers;
