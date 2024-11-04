import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import { GraphQLSchema } from 'graphql';
import { mutation, query } from './userScheme.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const schema = (prisma: PrismaClient) => new GraphQLSchema({
  query: query(prisma),
  mutation: mutation(prisma)
});