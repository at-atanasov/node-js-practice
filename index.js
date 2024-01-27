const fs = require("fs"); //require file system in order to be able to work with files
const http = require("http");

//Node.js Built-in Modules https://www.w3schools.com/nodejs/ref_modules.asp

////////////////////////////////
//FILES
//synchronous way
const textIn = fs.readFileSync("./txt/input.txt", "utf-8"); //read the file

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut); //write the file

//asynchronous way
fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
  console.log(data);
});
console.log("Will read file");

//asynchronous way callback hell

fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
  console.log(data);
  fs.readFile(`./txt/${data}.txt`, "utf-8", (err2, data2) => {
    console.log(data2);
    fs.readFile("./txt/append.txt", "utf-8", (err3, data3) => {
      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        console.log("Your file has been written");
      });
    });
  });
});
console.log("Will read file");

////////////////////////////////////
//SERVER
