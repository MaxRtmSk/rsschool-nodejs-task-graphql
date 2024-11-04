import { PrismaClient } from '@prisma/client';
import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLFloat, GraphQLID, GraphQLInt, GraphQLBoolean } from 'graphql';
import { UUIDType } from './types/uuid.js';
import { MemberTypeId } from './types/memberTypeId.js';

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
      id: { type: new GraphQLNonNull(GraphQLString) },
      discount: { type: GraphQLFloat },
      postsLimitPerMonth: { type: GraphQLInt },
  },
});

export const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: {
      id: { type: new GraphQLNonNull(GraphQLString) },
      title: { type: new GraphQLNonNull(GraphQLString) },
      content: { type: GraphQLString },
  },
});

export const ProfileType = new GraphQLObjectType({
  name: 'ProfileType',
  fields: {
      id: { type: new GraphQLNonNull(GraphQLString) },
      isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
      yearOfBirth: { type: GraphQLInt },
      memberType: {
        type: new GraphQLNonNull(MemberType),
        resolve: async (parent, _, context) => {
          return context.prisma.memberType.findUnique({
            where: { id: parent.memberTypeId },
          });
        },
      },
  },
});

const PostsType = new GraphQLList(new GraphQLNonNull(PostType));

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve: async (parent, _, context) => {
        return context.prisma.profile.findUnique({
          where: { userId: parent.id },
        });
      },
    },
    posts: {
      type: new GraphQLNonNull(PostsType),
      resolve: async (parent, _, context) => {
        return parent.id ? context.prisma.post.findMany({
          where: { authorId: parent.id },
        }) : null;
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      resolve: async (parent, _, context) => {
        return context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: parent.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(UserType)),
      resolve: async (parent, _, context) => {
        return context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: parent.id,
              },
            },
          },
        });
      },
    },
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
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: (_, args) => prisma.user.findUnique({
          where: { id: args.id },
        }),
      },
      memberTypes: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
        resolve: () => prisma.memberType.findMany(),
      },
      memberType: {
        type: MemberType,
        args: {
          id: { type: new GraphQLNonNull(MemberTypeId) },
        },
        resolve: async (_, args) => prisma.memberType.findFirst({
          where: { id: args.id },
        }),
      },
      posts: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
        resolve: () => prisma.post.findMany(),
      },
      post: {
        type: PostType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: (_, args) => prisma.post.findUnique({
          where: { id: args.id },
        }),
      },
      profiles: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
        resolve: () => prisma.profile.findMany(),
      },
      profile: {
        type: ProfileType,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: (_, args) => prisma.profile.findUnique({
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