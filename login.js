const express = require("express");
const mysql = require("mysql2");

const cors = require("cors");
const app = express()

app.use(express.json());
app.use(cors());
app.use(function(req, res,next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
next();  
});
app.use(
    cors({
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST","PATCH,PUT"],
      credentials: true,
    })
  );


const connection = mysql.createConnection({
    user:"root",
    password:"root",
    database:"user_registration"
});


//registerUser
app.post("/register", (req, res) => {
    const name = req.body.userName;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const password_details = req.body.password;
  
    console.log('register called');
    connection.query(
        "INSERT INTO registeruser (name,email,password_details,mobile) VALUES (?,?,?,?)",
        [name,email,password_details,mobile],
        (err, result) => {
            if (err) {
                res.send({ err: err });
              }else{
                res.send({ status:200,message:'User added success' });
              }
        }
    );
  });



  //getAllDetails
app.get("/getalluserdetails", (req, res) => {
   
    console.log('get all users called');
    connection.query(
        "SELECT * FROM registeruser",
        (err, result) => {
            if (err) {
                res.send({ err: err });
              }else{
                res.send({ status:200,message:'all users',data:result });
              }
        }
    );
  });


  //updateUserByAdmin
  app.put("/update/user", (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;

  
    console.log('Update Called',name,email,mobile,id);
    connection.query(
        "UPDATE registeruser SET name=?,email=?,mobile=? WHERE user_id =?",
        [name,email,mobile,id],
        (err, result) => {
            if (err) {
                console.log(err)
                res.send({ err: err });
              }else{
                res.send({ status:200,message:'User added success' });
              }
        }
    );
  });


//adminLogin
app.post("/adminlogin", (req, res) => {
    const name = req.body.userName;
    const password_details = req.body.password;
    const userType = req.body.userType;
  
    console.log('register called');
    connection.query(
        "SELECT * FROM admindetails WHERE  admin_id=1",
        (err, result) => {
            if (err) {
                res.send({ err: err });
              }else{
                if(result[0].UserName === name && result[0].password_details ===password_details && userType === 'ADMIN'){
                    res.send({ status:200,message:'User added success' });
                    console.log('success')
                }else if(result[0].UserName !== name || result[0].password_details !==password_details){
                    res.send({ errorCode:105,message:'Invalid login creditials' });
                    console.log('false')
                }
              }
        }
    );
  });



  //userLogin
app.post("/userlogin", (req, res) => {
  const email = req.body.email;
  const password_details = req.body.password;
  const userType = req.body.userType;

  console.log('login user called',email,password_details);
  connection.query(
      "SELECT * FROM registeruser WHERE  email=? and password_details=?",
      [email,password_details],
      (err, result) => {
          if (result.length >0) {
            console.log(result)
            if(result[0].email === email && result[0].password_details ===password_details && userType === 'USER'){
                res.send({ status:200,message:'User added success' });
                
            }else if(result[0].email !== email || result[0].password_details !==password_details){
                res.send({ errorCode:105,message:'Invalid login creditials' });
                console.log('false')
            }
          
            }else{
              console.log(result)
              res.send({message:'There is no registered user.',code:'0' });
            }
      }
  );
});



//connect to db
connection.connect(function(error){
    if(error) throw error
    else console.log("connection successful");
});

app.listen(3001,()=>{
    console.log('Running Server');
})