const test = (req, res) => {
  console.log(req.user);
  res.send("reached dashboard");
};

module.exports = {
  test,
};
