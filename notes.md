## starting commands
- go to folder 
```javascript
cd server 
```
- make npm repo
```javascript
npm init
```
- install and save dependencies : 
  - bcryptjs 
  - cloudinary 
  - cookie-parser 
  - cors 
  - dotenv 
  - express 
  - jsonwebtoken 
  - mongoose 
  - multer 
  - nodemailer : used for sending emails. Surprisingly, it has zero dependencies. This means you don't need to install any additional packages to use it in your project.
  - morgan : It simplifies the process of logging HTTP requests in a Node. js application by automatically generating logs for incoming requests. Morgan provides various logging formats and options, allowing developers to customize the logging output according to their requirements.
```javascript
npm i bcryptjs cloudinary cookie-parser cors dotenv express jsonwebtoken mongoose multer nodemailer --save
```
The `--save `option told npm to update the package. json with the module and version that was just installed. This is great, as other developers working on your projects can easily see what external dependencies are needed

- to enable module 
```javascript
"type" : "module"
```
    - By this now we don't need to use earlier require method of javascript to import and export

- to use nodemon (server restart on file change )
```javascript
"main" : "server.js"
"dev" : "nodemon server.js"   // inside Scripts 
```
### mongoose
```javascript
mongoose.set('strictQuery',false);
```
- if mongoose don't have something or not given appropriate syntax then it will not throw the error 


