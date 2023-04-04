module.exports.generateOTP = () => {
  const OTP = Math.floor(10000 + Math.random() * 90000);
  return OTP;
};
