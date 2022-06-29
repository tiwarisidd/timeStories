const https = require("https");
const http = require("http");

const PORT = 5000;

const server = http.createServer((req, res) => {
  if (req.url == "/getTimeStories") {
    https.get("https://time.com/", response => {
      let data;
      response.on("data", chunk => {
        data += chunk;
      });
      response.on("end", () => {
        let responseArray = [];
        data
          .match(/<li class="latest-stories__item">>*\n.*<a .*\n.*\w.*\n.*\w>/g)
          .forEach(v => {
            responseArray.push({
              title: v.split(">")[3].split("<")[0],
              link: `https://time.com${v
                .split(">")[1]
                .split("=")[1]
                .replace(/\"/g, "")}`,
            });
          });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(responseArray));
        res.end();
      });
    });
  } else {
    res.writeHead(404);
    res.write("Uhh Ohh! No data.");
    res.end();
  }
});

server.listen(PORT, () =>
  console.log(`visit http://localhost:${PORT}/getTimeStories`)
);
