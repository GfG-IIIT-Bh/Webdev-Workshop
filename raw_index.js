const http = require("http");

const reqListener = (req, res) => {
  res.end("hi");
};

const server = http.createServer(reqListener);

server.listen(3003, () => {
  console.log("running at 3000");
});
