const { Router } = require("express");
const { userRoutes } = require("./userRoute");

const frontendRoutes = Router();

frontendRoutes.use("/web", userRoutes);

module.exports = { frontendRoutes };