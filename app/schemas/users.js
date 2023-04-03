const userDataProperties = {
  id: { type: "integer" },
  email: { type: "string", maxLength: 255 },
  password: { type: "string", maxLength: 255 },
};

const userpassSchema = {
  type: "object",
  properties: {
    email: { type: "string" },
    password: {
      type: "string",
    },
  },
};

// responses

const OKResponse = {
  type: "object",
  properties: {
    data: {
      type: "object",
      properties: {
        user: {
          type: "object",
          properties: {
            email: { type: "string" },
            id: { type: "integer" },
          },
        },
        successful: { type: "boolean" },
        access_token: {
          type: "string",
        },
        user_id:{
          type: "integer"
        }
      },
    },
  },
};

module.exports = {
  userpassSchema,
  OKResponse,
};
