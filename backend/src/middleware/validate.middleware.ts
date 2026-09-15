import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

interface ValidationSchema {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
}

export function validate(schema: ValidationSchema | AnyZodObject) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if ('safeParseAsync' in schema || 'parseAsync' in schema) {
        // Direct body schema provided
        req.body = await (schema as AnyZodObject).parseAsync(req.body);
      } else {
        const { body, query, params } = schema;
        if (body) {
          req.body = await body.parseAsync(req.body);
        }
        if (query) {
          req.query = await query.parseAsync(req.query);
        }
        if (params) {
          req.params = await params.parseAsync(req.params);
        }
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
      } else {
        next(error);
      }
    }
  };
}
