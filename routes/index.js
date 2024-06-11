const router = require("express").Router();

const dbRouter = require("./db");

router.use("/notes", dbRouter);

module.exports = router;
