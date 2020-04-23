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
app.use(bodyParser.json());




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
      callBack(null, `csvfile_${file.originalname}`)
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
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*",);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
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
  console.log(file);
  if (!file) {
    const error = new Error('No File')
    error.httpStatusCode = 400
    return next(error)
  }
  // var data;
  // var collection = db.collection('Contacts');
  // readData=fs.createReadStream('csvfile_sms (1).csv').pipe(csv())
  //              .on('data',function(data){
  //                 collection.insert({'data': data});
  //              })
  //              .on('end',function(data){
  //                 console.log('Read finished');
  //              })

  file.filePath = '/contactlists/' + file.filename;  
  res.send(file);

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
