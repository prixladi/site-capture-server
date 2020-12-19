import { ApolloError } from 'apollo-server-express';
import { RawDoc } from '../db';
import { SiteDoc } from '../db/site';
import { TemplateDoc } from '../db/template';
import { SiteType, TemplateType } from './types';

const siteDocToType = (doc: RawDoc<SiteDoc>): SiteType => {
  const { _id, name, url, sizes, quality, isPublic, userId } = doc;

  return {
    id: _id.toString(),
    userId: userId.toString(),
    name,
    url,
    sizes,
    quality,
    isPublic,
  };
};

const templateDocToType = (doc: RawDoc<TemplateDoc>): TemplateType => {
  const { _id, name, sizes, quality, userId } = doc;

  return {
    id: _id.toString(),
    userId: userId.toString(),
    name,
    sizes,
    quality
  };
};

const notFoundError = (message: string) => {
  return new ApolloError(message, 'NOT_FOUND');
};

const unauthorizedError = (message: string) => {
  return new ApolloError(message, 'UNAUTHORIZED');
};

export { notFoundError, unauthorizedError, siteDocToType, templateDocToType };
