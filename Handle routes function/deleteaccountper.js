const postmodel = require("../models/post");
const usermodel = require("../models/user");

const deletePermanently = async (req, res) => {
  try {
    const { userid } = req.body;

    await usermodel.findByIdAndDelete(userid);
    await postmodel.deleteMany({ owner: userid });

    res.status(200).json({ message: "User and associated posts deleted successfully." });
  } catch (error) {
    console.error("Error deleting user and posts:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.default = deletePermanently;
