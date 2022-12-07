const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
require("dotenv").config();
const port = process.env.PORT || 3080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended: false}));

app.use(express.static('public'));
app.use(
  "/images",
  express.static(path.join(__dirname, "views/images"))
);
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);
app.use(
  "/js",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/bootstrap-icons/font"))
);
app.use(
  "/css",
  express.static(path.join(__dirname, "node_modules/datatables.net-dt/css"))
);

app.use(flash());
app.use(session({
  secret: 'sdfsdfsdfsferwet',
  resave: false, // We wont resave the session variable if nothing is changed
  saveUninitialized: false
}));
app.use(passport.initialize()) ;
app.use(passport.session());
app.use(methodOverride("_method"));


function padTo2Digits(num){
  return num.toString().padStart(2,'0');
 }
 function formatDate(date){
   return (
     [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() +1), 
      date.getFullYear(),
     ].join('.')+ ' ' + [
      padTo2Digits(date.getHours()), 
      padTo2Digits(date.getMinutes()),
     ].join(':') 
     );
 }

const hbsh = exphbs.create({
  extname: ".hbs",
  helpers: {
    eq:  function(arg1,arg2,options) {
      return (arg1==arg2) ? options.fn(this) : options.inverse(this); 
    },
    formatDateTime: function(arg1){

        return formatDate(arg1);
    }
  }
});

app.engine("hbs", hbsh.engine);
app.set("view engine", "hbs");

const routes = require('./server/routes/user');
app.use('/', routes);
app.listen(port, () => console.log("listening port ${port}"));
