const userController = require("../controllers/users");
const multer = require("fastify-multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });


const {
  userpassSchema,
  OKResponse,
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
    preHandler: [upload.single("file")],
    handler: userController.uploadFileReq(fastify),
  };
};

const executeFileOpts = (fastify) => {
  return {
    onRequest: [fastify.authenticate],
    handler: userController.executeFileReq(fastify),
  };
};

const statusFileOpts = (fastify) => {
  return {
    onRequest: [fastify.authenticate],
    handler: userController.statusFileReq(fastify),
  };
};

function userRoutes(fastify, options, done) {
  // login
  fastify.post("/login", loginOpts(fastify));

  //upload file
  fastify.post("/upload", uploadFileOpts(fastify));

  //execute file
  fastify.post("/execute", executeFileOpts(fastify));

  //get status
  fastify.post("/staus", statusFileOpts(fastify));

  done();
}

module.exports = userRoutes;
