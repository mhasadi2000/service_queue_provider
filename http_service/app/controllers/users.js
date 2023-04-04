const userService = require("../services/users");


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

exports.executeFileReq = (fastify) =>{
  return (req, reply) => {
    return userService.executeFile(req.body);
  };
}


exports.statusFileReq = (fastify) =>{
  return (req, reply) => {
    return userService.statusFile(req.body);
  };
}