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
    quality,
  };
};

const fallthroughResolver = (): unknown => ({});

export { siteDocToType, templateDocToType, fallthroughResolver };
