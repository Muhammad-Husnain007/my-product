
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, phone: user.phone.phoneNumber },
     process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

export default generateToken ;