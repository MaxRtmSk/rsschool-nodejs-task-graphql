import { PrismaClient } from "@prisma/client";
import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLFloat, GraphQLID, GraphQLInputObjectType, GraphQLBoolean, GraphQLInt } from "graphql";
import { UserType, PostType, ProfileType } from './query.js';
import { UUIDType } from "./types/uuid.js";

const CreatePostInput = new GraphQLInputObjectType({
    name: 'CreatePostInput',
    fields: {
        title: { type: new GraphQLNonNull(UUIDType) },
        content: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
    },
});

const ChangeUserInput = new GraphQLInputObjectType({
    name: "ChangeUserInput",
    fields: {
        name: { type: GraphQLString },
    }
})


const CreateUserInput = new GraphQLInputObjectType({
    name: 'CreateUserInput',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        balance: { type: new GraphQLNonNull(GraphQLFloat) },
    },
});

const CreateProfileInput = new GraphQLInputObjectType({
    name: 'CreateProfileInput',
    fields: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
        isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
        yearOfBirth: { type: GraphQLInt },
        memberTypeId: { type: new GraphQLNonNull(GraphQLID) },
    },
});

const ChangePostInput = new GraphQLInputObjectType({
    name: 'ChangePostInput',
    fields: {
        title: { type: GraphQLString },
    },
});

const ChangeProfileInput = new GraphQLInputObjectType({
    name: 'ChangeProfileInput',
    fields: {
        isMale: { type: GraphQLBoolean },
        yearOfBirth: { type: GraphQLInt },
    },
});

export const mutation = (prisma: PrismaClient) => new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: new GraphQLNonNull(UserType),
            args: {
                dto: {
                    type: new GraphQLNonNull(CreateUserInput),
                },
            },
            resolve: (_, {dto}) => prisma.user.create({
                data: dto,
            }),
        },
        changeUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(ChangeUserInput) },
            },
            resolve: (_, args) => {
                const { id, dto } = args;
                return prisma.user.update({
                    where: { id },
                    data: dto,
                });
            },
        },
        deleteUser: {
            type: GraphQLString,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (_, args) => {
                await prisma.user.delete({
                    where: { id: args.id },
                });
                return "User deleted successfully";
            },
        },
        createPost: {
            type: new GraphQLNonNull(PostType),
            args: {
                dto: {
                    type: new GraphQLNonNull(CreatePostInput),
                },
            },
            resolve: async (_, { dto }) => {
                return await prisma.post.create({
                    data: dto,
                });
            },
        },
        createProfile: {
            type: new GraphQLNonNull(ProfileType),
            args: {
                dto: { type: new GraphQLNonNull(CreateProfileInput) },
            },
            resolve: (_, { dto }) => prisma.profile.create({
                data: dto,
            }),
        },
        deleteProfile: {
            type: GraphQLString,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (_, args) => {
                await prisma.profile.delete({
                    where: { id: args.id },
                });
                return "Profile deleted successfully";
            },
        },
        deletePost: {
            type: GraphQLString,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (_, args) => {
                await prisma.post.delete({
                    where: { id: args.id },
                });
                return "Post deleted successfully";
            },
        },
        changePost: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(ChangePostInput) },
            },
            resolve: (_, { id, dto }) => prisma.post.update({
                where: { id },
                data: dto,
            }),
        },
        changeProfile: {
            type: ProfileType,
            args: {
                id: { type: new GraphQLNonNull(UUIDType) },
                dto: { type: new GraphQLNonNull(ChangeProfileInput) },
            },
            resolve: (_, { id, dto }) => prisma.profile.update({
                where: { id },
                data: dto,
            }),
        },
        subscribeTo: {
            type: GraphQLString,
            args: {
                userId: { type: new GraphQLNonNull(UUIDType) },
                authorId: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (_, { userId, authorId }) => {
                await prisma.subscribersOnAuthors.create({
                    data: { subscriberId: userId, authorId },
                });
                return "Subscribed successfully";
            },
        },
        unsubscribeFrom: {
            type: GraphQLString,
            args: {
                userId: { type: new GraphQLNonNull(UUIDType) },
                authorId: { type: new GraphQLNonNull(UUIDType) },
            },
            resolve: async (_, { userId, authorId }) => {
                await prisma.subscribersOnAuthors.deleteMany({
                    where: { subscriberId: userId, authorId },
                });
                return "Unsubscribed successfully";
            },
        },
    },
});