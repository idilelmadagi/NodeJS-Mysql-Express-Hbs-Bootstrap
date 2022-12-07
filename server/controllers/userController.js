
const mysql = require('mysql2');

function padTo2Digits(num){
 return num.toString().padStart(2,'0');
}
function formatDate(date){
  return (
    [
    date.getFullYear(),
    padTo2Digits(date.getMonth() +1), 
    padTo2Digits(date.getDate()),
    ].join('-')+ ' ' + [
    padTo2Digits(date.getHours()), 
    padTo2Digits(date.getMinutes()),
    padTo2Digits(date.getSeconds()),].join(':') 
    );
}

const pool = mysql.createPool({
    connectionLimit: 50,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});


exports.homePageGet = (req,res)=>{

    pool.getConnection((err, connection) => {
      if (err) throw err;
         let query = "SELECT * FROM customer";
   
         connection.query(query, (err, rows)=>{
          if (err) throw err;
          connection.release();
              res.render('customerTable', { rows });

         });
     });
};

exports.customerUpdateGet = (req,res)=>{

    pool.getConnection((err, connection) => {
      if (err) throw err;
      
      connection.query("SELECT * FROM customer WHERE customer_id = ?" , [req.params.customer_id], (err, rows) =>{
        
        if (err) throw err;
              connection.release();
              res.render('customerUpdate', {rows});

          });
    });

};
exports.customerUpdatePost = (req,res)=>{

  var dateModified =  formatDate(new Date()); 
  var firstName = req.body.first_name;
  var lastName =req.body.last_name;
  pool.getConnection((err, connection) => {
        if (err) throw err;
        var sql= "UPDATE customer SET store_id = ?, first_name = ?, last_name = ? , email= ?, address_id= ?, active= ?, last_update =? WHERE customer_id = ?";
        var values =[req.body.store_id,firstName,lastName,req.body.email,req.body.address_id,Number(req.body.active), dateModified, req.params.customer_id];
       
        connection.query(sql, values, (err, result)=>{
          connection.release();
          if (err) throw err;
              res.redirect('/');

        });

    });

};
exports.deleteCustomer= (req,res) => {

  pool.getConnection((err, connection) => {
    if (err) throw err;

        connection.query('DELETE FROM customer WHERE customer_id = ?' , [req.params.customer_id], (err, rows) =>{

          if (err) throw err;

          res.redirect('/');
        });
 
  });
};   

exports.updateAddressId = (req,res)=> {
  var dateModified =  formatDate(new Date()); 
  pool.getConnection((err, connection) => {
        if (err) throw err;
        var sql= "UPDATE customer SET address_id = ?, last_update =? WHERE customer_id = ?";
        var values =[req.body.address_id,dateModified, req.params.customer_id];
       
        connection.query(sql, values, (err, result)=>{
          connection.release();

          if (err) throw err;
              res.redirect('/');

        });

    });
};
exports.addCustomerGet = (req,res)=> {

     res.render("addCustomer");

};
function getRandomInt(max){

  return Math.floor(Math.random()* max);

}
exports.addCustomerPost = (req,res) =>{

    var id = getRandomInt(65535);
    var dateCreated = formatDate(new Date()); 
    var dateModified = formatDate(new Date()); 

    pool.getConnection((err, connection) => {

        if (err) throw err;
        var sql= "INSERT INTO customer " +
        "(customer_id, create_date, last_update, store_id, first_name,last_name,email,address_id,active) "+
        "VALUES (?)";
        var values =[ id,dateCreated,dateModified,req.body.store_id, req.body.first_name, req.body.last_name,req.body.email, req.body.address_id, Number(req.body.active)];
      
        connection.query(sql, [values], (err, result)=>{
          if (err) throw err;

                connection.release();
                res.render('addCustomer', { alert: 'New Customer Added Sucesfully'});

        });

   });
 
};