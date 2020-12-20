import { UserInputError } from 'apollo-server-express';
import joi from 'joi';
import { PaginationInput, Size } from '../../types';

type Errors = Record<string, string[]>;

const paginationSchema = joi.object<PaginationInput>({
  skip: joi.number().min(0).required(),
  limit: joi.number().min(1).max(200).required(),
});

const idSchema = joi
  .string()
  .pattern(/^[a-f\d]{24}$/i)
  .required();

const sizesSchema = joi
  .array()
  .min(1)
  .items(
    joi.object<Size>({
      width: joi.number().min(300).max(7000),
      height: joi.number().min(300).max(7000),
    }),
  );

const quealitySchema = joi.number().min(10).max(100).required();

const validate = <T extends unknown>(schema: joi.AnySchema, object: T, extendErrors?: Errors | null): Errors | null => {
  const result = schema.validate(object, { abortEarly: false });
  if (result.error) {
    return result.error.details
      .map((item) => ({ message: item.message, path: item.path.join('.') }))
      .reduce((prev, dto) => {
        if (!prev[dto.path]) {
          prev[dto.path] = [dto.message];
        } else {
          prev[dto.path].push(dto.message);
        }

        return prev;
      }, extendErrors ?? ({} as Errors));
  }

  return null;
};

const inputError = (errors: Errors) => {
  return new UserInputError('Input validation error', errors);
};

export { paginationSchema, idSchema, sizesSchema, quealitySchema, validate, inputError };
