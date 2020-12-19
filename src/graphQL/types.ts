type Size = {
  width: number;
  height: number;
};

type NewTemplateInput = {
  name: string;
  sizes: Size[];
  quality: number;
};

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

type UpdateSiteInput = Partial<NewSiteInput>

type SiteType = {
  name: string;
  id: string;
  url: string;
  sizes: Size[];
  quality: number;
  isPublic: boolean;
  userId: string;
};

type MeType = {};

export { NewTemplateInput, TemplateType, NewSiteInput, UpdateSiteInput, SiteType, MeType };
