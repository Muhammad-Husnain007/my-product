
import jwt from 'jsonwebtoken';

const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, phone: user.phone.phoneNumber },
     process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_SECRET_EXPIRED }
  );
};

export default generateToken ;