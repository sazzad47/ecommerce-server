const router = require("express").Router();
router.route("/").post(async (req, res) => {
  res.status(200).json({ msg: "Connected Succefully" });
});
module.exports = router