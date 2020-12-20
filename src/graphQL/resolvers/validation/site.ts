import { IResolvers, UserInputError } from 'apollo-server-express';
import { ISchemaLevelResolver } from 'graphql-tools';
import { Context } from '../../../types';
import { MutationIdResult, MutationResult, NewSiteInput, PaginationInput, SiteType, UpdateSiteInput } from '../../types';
import { idSchema, inputError, paginationSchema, quealitySchema, sizesSchema, validate } from './utils';
import joi from 'joi';

type SitesResolver = ISchemaLevelResolver<void, Context, { filter: PaginationInput }, Promise<SiteType[] | UserInputError>>;
type SiteResolver = ISchemaLevelResolver<void, Context, { id: string }, Promise<SiteType | null | UserInputError>>;

type CreateSiteResolver = ISchemaLevelResolver<void, Context, { site: NewSiteInput }, Promise<MutationIdResult | UserInputError>>;
type UpdateSiteResolver = ISchemaLevelResolver<
  void,
  Context,
  { id: string; update: UpdateSiteInput },
  Promise<MutationResult | UserInputError>
>;
type DeleteSiteResolver = ISchemaLevelResolver<void, Context, { id: string }, Promise<MutationResult | UserInputError>>;

const sites = (next: SitesResolver): SitesResolver => async (root, args, context, info) => {
  const errors = validate(paginationSchema, args.filter);
  if (errors) {
    return inputError(errors);
  }

  return next(root, args, context, info);
};

const site = (next: SiteResolver): SiteResolver => async (root, args, context, info) => {
  const errors = validate(idSchema, args.id);
  if (errors) {
    return inputError(errors);
  }

  return next(root, args, context, info);
};

const newSiteInputSchema = joi.object<NewSiteInput>({
  name: joi.string().min(1).max(50),
  url: joi.string().uri().required(),
  sizes: sizesSchema,
  quality: quealitySchema,
  isPublic: joi.boolean().required(),
});

const create = (next: CreateSiteResolver): CreateSiteResolver => async (root, args, context, info) => {
  const errors = validate(newSiteInputSchema, args.site);
  if (errors) {
    return inputError(errors);
  }

  return next(root, args, context, info);
};

const updateSiteInputSchema = joi.object<UpdateSiteInput>({
  name: joi.string().min(1).max(50).optional().disallow(null),
  url: joi.string().uri().required().optional().disallow(null),
  sizes: sizesSchema.optional().disallow(null),
  quality: quealitySchema.optional().disallow(null),
  isPublic: joi.boolean().optional().disallow(null),
});

const update = (next: UpdateSiteResolver): UpdateSiteResolver => async (root, args, context, info) => {
  let errors = validate(idSchema, args.id);
  errors = validate(updateSiteInputSchema, args.update, errors);
  if (errors) {
    return inputError(errors);
  }

  return next(root, args, context, info);
};

const _delete = (next: DeleteSiteResolver): DeleteSiteResolver => async (root, args, context, info) => {
  const errors = validate(idSchema, args.id);
  if (errors) {
    return inputError(errors);
  }

  return next(root, args, context, info);
};

const resolvers: IResolvers = {
  Query: { sites, site },
  SiteMutation: { create, update, delete: _delete },
};

export default resolvers;
