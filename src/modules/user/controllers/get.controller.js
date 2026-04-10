import { UserModel } from "../model/user.model";


const getUser = async (req, res) => {
  const { _id } = req.user;
  const user = await UserModel.findById(_id);
  if (!user) {
    return res.status(404).json({ success: false, data: null, message: "User not found" });
  } 
    return res.status(200).json({ success: true, data: user, message: "User retrieved successfully" });
};

export { getUser };