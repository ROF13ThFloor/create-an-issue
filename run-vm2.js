const { VM } = require('vm2');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
// const dependencyTree = require('dependency-tree');
const EventEmitter = require('events');
// const json = require('json');
// const bundledCode = fs.readFileSync('dist/index.js', 'utf8');
const Analysor = require('./Analysor.js');

function createProxy(originalModule, moduleName) {
  return new Proxy(originalModule.request, {
    apply(target, thisArg, args) {
      const options = args[0];
      let bodyData = ''; 
      const obj = new Analysor();

      // console.log(`\n Intercepted ${moduleName.toUpperCase()} Request:`);
      // console.log(options.path)
      // console.log(` URL: ${options.protocol || (moduleName + ':')}//${options.hostname || options.host}${options.path}`);
      // console.log(` Method: ${options.method || 'GET'}`);
      // console.log(` Headers:`, options.headers);
      const req = Reflect.apply(target, thisArg, args);

      if (options.method == 'GET'){
        const mockReq = new EventEmitter();
        mockReq.write = (chunk) => {
          bodyData += chunk.toString();
        };
        mockReq.end = () => {
          if (bodyData) {
            console.log(bodyData);
            const bodyObj = JSON.parse(bodyData);
            console.log(`Body:`,  bodyObj.body);
          }
          console.log(`Request blocked. It was NOT sent.`);
        };
        mockReq.on = () => {};
        mockReq.abort = () => console.log(' Request aborted.');
  
        return mockReq;
      }
      else if (options.method == 'POST'){
        if (obj.check_permissoin(options.method, 'create-an-issue', options.path)){

        }
        else {
          const mockReq = new EventEmitter();
          mockReq.write = (chunk) => {
            bodyData += chunk.toString();
          };
          mockReq.end = () => {
            if (bodyData) {
              console.log(bodyData);
              const bodyObj = JSON.parse(bodyData);
              console.log(`Body:`,  bodyObj.body);
            }
            console.log(`Request blocked. It was NOT sent.`);
          };
          mockReq.on = () => {};
          mockReq.abort = () => console.log(' Request aborted.');
    
          return mockReq;
        }
    
      }
      // const originalWrite = req.write;
      // mocking the data for initial data 
      

      // extracting the request (real request)
      // req.write = function (chunk, encoding, callback) {
      //   bodyData += chunk.toString(); 
      //   return originalWrite.apply(req, [chunk, encoding, callback]);
      // };
      // const originalEnd = req.end;
      // req.end = function (chunk, encoding, callback) {
      //   if (chunk) {
      //     bodyData += chunk.toString(); 
      //   }
      //   if (bodyData) {
      //     console.log(`➡️ Body:`, bodyData);
      //   }
      //   return originalEnd.apply(req, [chunk, encoding, callback]);
      // };
      // return req;
    }
  });
}



const fetchProxy = new Proxy(fetch, {
  get(target, property) {
    if (Object.prototype.hasOwnProperty.call(target, property)) {
      return Reflect.get(target, property);
    } else {
      console.log(Object.prototype.toString)
      return undefined; 
    }
  },
  apply(target, thisArg, args) {
    console.log('Intercepted fetch call:', args);
    
    return Reflect.apply(target, thisArg, args);
  },
});


http.request = createProxy(http, 'http');
https.request = createProxy(https, 'https');
globalThis.fetch = fetchProxy;


import('./dist/index.js')
  .then(() => console.log('index.js loaded'))
  .catch(err => console.error('Error loading index.js:', err));


// const vm = new VM({
//   sandbox: {
//     require, 
//     console, 
//     allowAsync: true,   
//     fetch:fetchProxy,
//   },
//   timeout: 5000, 
// });

// try {
//   vm.run(bundledCode);
//   console.log('Script executed successfully');
// } catch (err) {
//   console.error('Error executing the script:', err);
// }
