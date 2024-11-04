import { GraphQLScalarType, Kind } from 'graphql';
import { MemberTypeId as MemberTypeIdEnum } from '../../member-types/schemas.js';

// Function to check if the value is a valid MemberTypeId
const isMemberTypeId = (value: unknown): value is MemberTypeIdEnum =>
  Object.values(MemberTypeIdEnum).includes(value as MemberTypeIdEnum);

export const MemberTypeId = new GraphQLScalarType({
  name: 'MemberTypeId',
  serialize(value) {
    if (!isMemberTypeId(value)) {
      throw new TypeError(`Invalid MemberTypeId.`);
    }
    return value;
  },
  parseValue(value) {
    if (!isMemberTypeId(value)) {
      throw new TypeError(`Invalid MemberTypeId.`);
    }
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      if (isMemberTypeId(ast.value)) {
        return ast.value;
      }
    }
    return undefined;
  },
}); 