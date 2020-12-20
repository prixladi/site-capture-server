type Size = {
  width: number;
  height: number;
};

type NewTemplateInput = {
  name: string;
  sizes: Size[];
  quality: number;
};

type UpdateTemplateInput = Partial<NewTemplateInput>;

type TemplateType = {
  id: string;
  name: string;
  sizes: Size[];
  quality: number;
  userId: string;
};

type NewSiteInput = {
  name: string;
  url: string;
  sizes: Size[];
  quality: number;
  isPublic: boolean;
};

type UpdateSiteInput = Partial<NewSiteInput>;

type SiteType = {
  name: string;
  id: string;
  url: string;
  sizes: Size[];
  quality: number;
  isPublic: boolean;
  userId: string;
};

type MeType = unknown;

type PaginationInput = {
  skip: number;
  limit: number;
};

type MutationStatus = 'OK' | 'NOT_FOUND';

type MutationResult = {
  status: MutationStatus;
  query: unknown;
};

type MutationIdResult = MutationResult & {
  id: string;
};

export {
  Size,
  NewTemplateInput,
  UpdateTemplateInput,
  TemplateType,
  NewSiteInput,
  UpdateSiteInput,
  SiteType,
  MeType,
  PaginationInput,
  MutationResult,
  MutationIdResult,
};
