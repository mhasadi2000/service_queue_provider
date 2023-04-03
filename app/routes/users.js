const userController = require("../controllers/users");

const {
  userpassSchema,
  OKResponse,
  followersListResponse,
} = require("../schemas/users");

const loginOpts = (fastify) => {
  return {
    schema: {
      body: userpassSchema,
      response: {
        200: OKResponse,
      },
    },
    handler: userController.loginReq(fastify),
  };
};

const uploadFileOpts = (fastify) => {
  return {
    onRequest: [fastify.authenticate],
    preHandler: [upload("image").single("image")],
    handler: userController.uploadFileReq(fastify),
  };
};

function userRoutes(fastify, options, done) {
  // login
  fastify.post("/login", loginOpts(fastify));

  //upload file
  fastify.post("/upload", uploadFileOpts(fastify));

  done();
}

module.exports = userRoutes;
