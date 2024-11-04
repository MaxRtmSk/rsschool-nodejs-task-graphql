import { PrismaClient } from '@prisma/client';
import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLFloat, GraphQLID } from 'graphql';


const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
      id: { type: new GraphQLNonNull(GraphQLID) },
      name: { type:  new GraphQLNonNull(GraphQLString) },
      balance: { type: new GraphQLNonNull(GraphQLFloat) },
    }),
  });

export const query = (prisma: PrismaClient) => new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
        resolve: () => prisma.user.findMany(),
      },
      user: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: (_, args) => prisma.user.findUnique({
          where: { id: args.id },
        }),
      },
    },
})

export const mutation = (prisma: PrismaClient) => new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createUser: {
        type: new GraphQLNonNull(UserType),
        args: {
          name: { type: new GraphQLNonNull(GraphQLString) },
          balance: { type: new GraphQLNonNull(GraphQLFloat) },
        },
        resolve: (_, args) => prisma.user.create({
          data: args,
        }),
      },
      updateUser: {
        type: UserType,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
          name: { type: GraphQLString },
          balance: { type: GraphQLFloat },
        },
        resolve: (_, args) => {
          const { id, ...data } = args;
          return prisma.user.update({
            where: { id },
            data,
          });
        },
      },
      deleteUser: {
        type: GraphQLString,
        args: {
          id: { type: new GraphQLNonNull(GraphQLID) },
        },
        resolve: async (_, args) => {
          await prisma.user.delete({
            where: { id: args.id },
          });
          return "User deleted successfully";
        },
      },
    },
});