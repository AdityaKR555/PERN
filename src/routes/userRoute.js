const { Router } = require("express");
const { createdUser, viewUser, deleteUser, updateUser } = require("../conroller/userController");

const userRoutes = Router();

userRoutes.post("/create", createdUser);
userRoutes.get("/view", viewUser);
userRoutes.put("/update/:id", updateUser);
userRoutes.delete("/delete/:id", deleteUser);

module.exports = { userRoutes };
