const multer = require('fastify-multer');

const { CustomError } = require("../errors/custom-error");

exports.errorHandler = (err, request, reply) => {
  if (err instanceof CustomError) {
    return reply.status(err.statusCode).send({ ...err.serializeErrors() });
  }

  if (err instanceof multer.MulterError) {
    return reply.status(422).send({message: err.message});
  }

  console.error(err);
  reply.status(500).send({ message: "Something went wrong", success: false  });
};
