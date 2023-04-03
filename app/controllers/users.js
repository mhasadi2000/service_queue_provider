const userService = require("../services/users");

const googleApiUrl = "https://www.googleapis.com/oauth2/v2/userinfo";

exports.loginReq = (fastify) => {
  return (req, reply) => {
    return userService.login(fastify.jwt, fastify.pg, req.body);
  };
};


exports.uploadFileReq = (fastify) => {
  return (req, reply) => {
    return userService.uploadFile(fastify.pg, req.user, req.body, req.file);
  };
};
