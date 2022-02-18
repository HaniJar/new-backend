exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};
exports.customersBoard = (req, res) => {
  res.status(200).send("User Content.");
};
exports.bossmanBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};
exports.receptionistBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
