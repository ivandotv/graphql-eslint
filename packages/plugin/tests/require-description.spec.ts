import { GraphQLRuleTester } from '../src';
import rule from '../src/rules/require-description';

const ruleTester = new GraphQLRuleTester();

ruleTester.runGraphQLTests('require-description', rule, {
  valid: [
    {
      code: /* GraphQL */ `
        enum EnumUserLanguagesSkill {
          """
          basic
          """
          basic
          """
          fluent
          """
          fluent
          """
          native
          """
          native
        }
      `,
      options: [{ EnumValueDefinition: true }],
    },
    {
      code: /* GraphQL */ `
        input SalaryDecimalOperatorsFilterUpdateOneUserInput {
          """
          gt
          """
          gt: BSONDecimal
          """
          in
          """
          in: [BSONDecimal]
          " nin "
          nin: [BSONDecimal]
        }
      `,
      options: [{ InputValueDefinition: true }],
    },
    {
      code: /* GraphQL */ `
        " Test "
        type CreateOneUserPayload {
          "Created document ID"
          recordId: MongoID

          "Created document"
          record: User
        }
      `,
      options: [{ types: true, FieldDefinition: true }],
    },
  ],
  invalid: [
    {
      code: /* GraphQL */ `
        input SalaryDecimalOperatorsFilterUpdateOneUserInput {
          gt: BSONDecimal
          gte: BSONDecimal
          lt: BSONDecimal
          lte: BSONDecimal
          ne: BSONDecimal
          in: [BSONDecimal]
          nin: [BSONDecimal]
        }
      `,
      options: [{ InputValueDefinition: true }],
      errors: 7,
    },
    {
      code: /* GraphQL */ `
        enum EnumUserLanguagesSkill {
          basic
          fluent
          native
        }
      `,
      options: [{ EnumValueDefinition: true }],
      errors: [
        { message: 'Description is required for nodes of type "EnumValueDefinition"' },
        { message: 'Description is required for nodes of type "EnumValueDefinition"' },
        { message: 'Description is required for nodes of type "EnumValueDefinition"' },
      ],
    },
    {
      name: 'should disable description for ObjectTypeDefinition',
      code: /* GraphQL */ `
        type CreateOneUserPayload {
          recordId: MongoID
          record: User
        }
      `,
      options: [
        {
          types: true,
          ObjectTypeDefinition: false,
          FieldDefinition: true,
        },
      ],
      errors: 2,
    },
  ],
});
