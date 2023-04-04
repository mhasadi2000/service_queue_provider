const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.hashPass = (pass) => {
  const hashed = bcrypt.hashSync(pass, saltRounds);
  return hashed;
};

exports.checkPass = async (pass, hash) => {
  const res = bcrypt.compareSync(pass, hash);
  return res;
};
