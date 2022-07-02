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
        let tempResponseArray = [];
        const first = data.indexOf(`<li class="latest-stories__item">`);
        const last = data.indexOf(
          `</li>`,
          data.lastIndexOf(`<li class="latest-stories__item">`)
        );
        data
          .slice(first, last)
          .split("\n")
          .forEach((element, index) => {
            if (element.includes("href")) {
              tempResponseArray.push(
                element.slice(
                  element.indexOf(`"`) + 1,
                  element.lastIndexOf(`"`)
                )
              );
            }
            if (element.includes("</h3")) {
              tempResponseArray.push(
                element.slice(
                  element.indexOf(">") + 1,
                  element.lastIndexOf("<")
                )
              );
            }
          });
        let responseArray = [];
        for (let i = 0; i < tempResponseArray.length; i += 2) {
          responseArray.push({
            title: tempResponseArray[i + 1],
            link: `https://time.com${tempResponseArray[i]}`,
          });
        }
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
