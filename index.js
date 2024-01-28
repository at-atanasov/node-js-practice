const fs = require("fs"); //require file system in order to be able to work with files
const http = require("http");
const url = require("url");

//Node.js Built-in Modules https://www.w3schools.com/nodejs/ref_modules.asp

// ////////////////////////////////
// //FILES
// //synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8"); //read the file

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut); //write the file

// //asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   console.log(data);
// });
// console.log("Will read file");

// //asynchronous way callback hell

// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   console.log(data);
//   fs.readFile(`./txt/${data}.txt`, "utf-8", (err2, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err3, data3) => {
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written");
//       });
//     });
//   });
// });
// console.log("Will read file");

////////////////////////////////////
//SERVER
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName); // /{%PRODUCTNAME%}/g наклонките отбелязват regular expression, а g, че е глобал и се отнася за всички пъти в които се срещне
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8"); //__dirname is an environment variable that tells you the absolute path of the directory containing the currently executing file
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  //Overview page

  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    // Product page
  } else if (pathName === "/product") {
    res.end("This is the product!");

    // Api
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "My-header": "test header",
    });
    res.end("<h1>This page could not be found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000!");
});
