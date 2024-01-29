const fs = require('fs'); //require file system in order to be able to work with files
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate'); //own modules are usually included after the core modules

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

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); //__dirname is an environment variable that tells you the absolute path of the directory containing the currently executing file
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // const pathname = req.url;

  //console.log(url.parse(req.url, true)) // с parse превръщаме url-а в обект и можем да вземем променливите. С true парсваме и query string-а

  //Overview page

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);

    // Api
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'My-header': 'test header',
    });
    res.end('<h1>This page could not be found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000!');
});
