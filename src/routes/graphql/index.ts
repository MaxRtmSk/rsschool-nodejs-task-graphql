import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const query = req.body.query;
      const variableValues = req.body.variables;

      const errors = validate(schema(prisma), parse(query), [depthLimit(5)]);

      if (errors.length > 0) {
        return {
          errors: errors.map(error => ({
            message: error.message,
            locations: error.locations,
            path: error.path,
          }))
        }
      }

      return graphql({
        schema: schema(prisma),
        source: query,
        variableValues: variableValues,
        contextValue: { prisma },
      });
    },
  });
};

export default plugin;
