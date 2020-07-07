createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require ('cors');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
var passport = require("passport");
const session = require('express-session');
var multer  = require('multer')
var path = require('path');
// new code
const jwt = require('jsonwebtoken');
const User = require('./routes/user_info/userinfo.modal')
// new code end
var ContactModal = require('./routes/sys_contact_list/contact.Model');
const fs = require('fs');
var csv = require('fast-csv');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

// twillio for send sms
const accountSid = 'AC4ada742e2afc43b9a62deb05e161ef53';
const authToken = '51b64e280dfc14073918c98e7f30d418';
const client = require('twilio')(accountSid, authToken);




// for MongoDB connection 4
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));



const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null,  path.join(__dirname, 'uploads'))
  },
  filename: (req, file, callBack) => {
      callBack(null, `FunOfHeuristic_${file.originalname}`)
  }
})
const upload = multer({ storage: storage })



const csvstorage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null,  path.join(__dirname,'uploadscontactlists'))
  },
  filename: (req, file, callBack) => {
      callBack(null, `${file.originalname}`)
  }
})
const contactlist = multer({ storage: csvstorage })
// fs.createReadStream('file.csv')
// .pipe(contactlist())
// .on('data', (row) => {
//   console.log(row);
// })
// .on('end', () => {
//   console.log('CSV file successfully processed');
// });








// default payload
// app.get('/',(res,req)=>{
// ContactModal.find((err,data)=>{
//   if(err){
//     console.log(err);
//   }
//   else{
//     if(data!='')
//     {
//       res.render('demo',{data:data});
//     }
//     else{
//       res.render('demo',{data:''});
//     }
//   }
// });
// });
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(__dirname+".public/"));
app.use("/public", express.static(path.resolve(__dirname, 'public')));
app.set('view engine', 'pug');
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(cookieParser('secret'));

app.use('/uploads', express.static(process.cwd() + '/uploads'))

app.use('/uploadscontactlists', express.static(process.cwd() + '/uploadscontactlists'))

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use(session({
  secret:'secret',
  maxAge:36000,
  resave:true,
  saveUninitialized:true,

}));
app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*",);
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

app.use(async (req, res, next) => {
  if (req.headers["x-access-token"]) {
   let accessToken = req.headers["x-access-token"];
   console.log("user id app 1",accessToken);
try{
  const {iat ,exp} = await jwt.verify(accessToken, 'naveedaslambaloach');
  console.log("user id app",data);

  // Check if token has expired
  if (exp < Date.now().valueOf() / 1000) {
    console.log("error",exp);

   return res.status(401).json({
    error: "JWT token has expired, please login to obtain a new one"
   });
  }
  console.log("res");

 //  res.locals.loggedInUser = iat;
  next();
}
catch(e){
  return res.status(401).json({
    error: "JWT token has expired, please login to obtain a new one"
   });
// console.log("exception",e);

}

  } else {
   next();
  }
});



app.use('/user', require('./routes/user_info'));
app.use('/Client', require('./routes/Sys_Clients'));
app.use('/Contact', require('./routes/sys_contact_list'));
app.post('/file', upload.single('file'),  (req, res, next) => {
  let file = req.file;
  console.log(file);
  if (!file) {
    const error = new Error('No File')
    error.httpStatusCode = 400
    return next(error)
  }
  file.filePath = '/uploads/' + file.filename;
  res.send(file);
})
app.post('/contactfile',cors(), contactlist.single('file'),  (req, res, next) => {
  let file = req.file;
  // console.log(file);
  if (!file) {
    const error = new Error('No File')
    error.httpStatusCode = 400
    return next(error)
  }
  console.log('file updated');
  return res.json(file)
 // var data;
  // var collection = db.collection('Contacts');
  // var readData=fs.createReadStream('uploadscontactlists/csvfile_sms (1).csv').pipe(csv())
  //              .on('data',function(data){
  //                console.log('data after reading the file',data);

  //                 // collection.insert({'data': data});
  //              })
  //              .on('end',function(data){
  //                 console.log('Read finished');
  //              })

  // file.filePath = '/contactlists/' + file.filename;
  // res.send(file);

//   file()
//   .fromFile(csvFilePath)
//   .then((jsonObj)=>{
//       console.log(jsonObj);
//       for (x =0; x<jsonObj; x++){
// var temp = parseFloat(jsonObj[x].test1);
// jsonObj[x].test1 = temp;
// var temp = parseFloat(jsonObj[x].test2);
// jsonObj[x].test2 = temp;
// var temp = parseFloat(jsonObj[x].test3);
// jsonObj[x].test4 = temp;
// var temp = parseFloat(jsonObj[x].test4);
// jsonObj[x].test4 = temp;
// var temp = parseFloat(jsonObj[x].final);
// jsonObj[x].final = temp;
//       }
//       ContactModal.insertMany(jsonObj,(err,data)=>{
//         if(err){
//           res.send(err);
//         }
//         else{
//           res.send(message,'you have done');
//         }
//       })
//   })
});
app.get('/send-text',(req, res) => {
  const {receipent,textmessage} = req.query;
  client.messages
  .create({
     body: 'textmessage',
     from: '+13187459804',
     to: 'receipent'
   })
  .then(message => console.log(message.body));
})
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//connecting to MongoDB
mongoose.connect('mongodb://admin:admin123@ds235658.mlab.com:35658/dashboard',{ useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false});
console.log('MonogDb is connected')
mongoose.connection.on('error', function (err) {
console.error('MongoDB connection error: ' + err);
process.exit(-1);
 });


//  mongoose.connect('mongodb://localhost:27017/dashboard',{ useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
//  console.log('local db is connected');
// // // // error handler


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



// app.listen(port,()=>console.log('Server Started At Port',port));
module.exports = app;
