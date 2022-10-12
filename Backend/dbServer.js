
require("dotenv").config()
const cors = require("cors")
const express = require("express")
const app = express()
const mysql = require("mysql")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const jwt = require("jsonwebtoken")

const db = mysql.createPool({
   connectionLimit: 100,
   host: process.env.DB_HOST,       //This is your localhost IP
   user: process.env.DB_USER,         // "newuser" created in Step 1(e)
   password: process.env.DB_PASSWORD,  // password for the new user
   database: process.env.DB_DATABASE,      // Database name
   port: process.env.DB_PORT             // port name, "3306" by default
})
db.getConnection((err, connection) => {
   if (err) throw (err)
   console.log("DB connected successful: " + connection.threadId)
})

const port = process.env.PORT
app.listen(port, () => console.log(`Server Started on port ${port}`))

const bcrypt = require("bcrypt")
const { response } = require("express")
app.use(express.json())
app.use(cors({
   origin: ['http://localhost:3000'],
   methods: ['GET', 'POST', 'PUT', 'DELETE'],
   credentials: true,
}))

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))


app.use(session({
   key: "userId",
   secret: "subscribe",
   resave: false,
   saveUninitialized: false,
   cookie: {
      // expires: 60 * 60 * 24
      httpOnly: false
   }
}))

app.get("/", (req, res) => {
   let resData = {
      'status': 'running', 'message': 'Server is up and running...'
   }
   res.status(200).send(resData);
})


//Register New User
app.post("/createUser", async (req, res) => {
   const user = req.body.userName;
   const hashedPassword = await bcrypt.hash(req.body.password, 10);
   const email = req.body.email;
   const number = req.body.number;
   const dob = req.body.date;
   const gender = req.body.gender;
   const city = req.body.city;
   const status = "activate";
   var created_date = new Date();

   console.log(user, hashedPassword)
   db.getConnection(async (err, connection) => {
      if (err) throw (err)
      const sqlSearch = "SELECT * FROM tbl_login WHERE userName = ?"
      const search_query = mysql.format(sqlSearch, [user])
      const sqlInsert = "INSERT INTO tbl_login VALUES (0,?,?,?,?,?,?,?,?,?,0,0)"
      const insert_query = mysql.format(sqlInsert, [user, hashedPassword, number, dob, email, gender, city, status, created_date])

      await connection.query(search_query, async (err, result) => {
         if (err) throw (err)
         console.log("------> Search Results")
         console.log(result.length)
         if (result.length != 0) {
            connection.release()
            console.log("------> User already exists")
            res.send({ message: "User Already Exist" })
         }
         else {
            await connection.query(insert_query, (err, result) => {
               connection.release()
               if (err) throw (err)
               console.log("--------> Created new User")
               console.log(result.insertId)
               res.sendStatus(201)
            })
         }
      }) //end of connection.query()
   }) //end of db.getConnection()
}) //end of app.post()


//LOGIN (AUTHENTICATE USER)
app.post("/login", (req, res) => {
   const user = req.body.userName;
   const password = req.body.password
   db.getConnection(async (err, connection) => {
      if (err) throw (err)
      const sqlSearch = "Select * from tbl_login where userName = ?"
      const search_query = mysql.format(sqlSearch, [user])

      await connection.query(search_query, async (err, result) => {
         connection.release()
         if (err) throw (err)
         if (result.length == 0) {
            console.log("--------> User does not exist")
            res.send({ message: "User does not exist" })
         }
         if (result.length != 0) {
            bcrypt.compare(password, result[0].password, (error, response) => {
               if (error) {
                  res.json({ error: error })
               }
               if (response) {
                  if (result[0].status === "activate") {
                     console.log("---------> Login Successful")
                     const id = result[0].userId
                     const token = jwt.sign({ id }, "jwtsecret", {
                        expiresIn: 300,
                     })
                     req.session.user = result;
                     console.log(result);
                     res.json({ auth: true, token: token, result: result })
                  }
                  else {
                     res.status(200).send({ auth: false, message: "Your Account is Deactivated contact admin for more details" })
                  }
               }
               else {
                  console.log("---------> Password Incorrect")
                  res.send({ message: "Password incorrect!" })
               }
            })
         }
      })
   })
})

app.get("/login", (req, res) => {
   console.log(req.session.user);
   if (req.session.user) {
      res.send({ loggedIn: true, profile: req.session.user });
   }
   else {
      res.send({ loggedIn: false })
   }
})


//Show Questions   
app.get('/questions', function (request, result) {
   db.query("SELECT * FROM tbl_question;", function (err, results) {
      if (err) throw err;
      result.send({ loggedIn: true, qus_result: results });
      console.log(results)
   })
})


//Test submited details
app.post("/attemptdetails", (req, res) => {
   const userId = req.body.userId;
   const total_qus = req.body.total_qus;
   const score = req.body.score;
   const attempt = req.body.attempt;
   var submitted_date = new Date();

   if (req.session.user) {
      db.query("INSERT INTO tbl_attemptdetails VALUES (?,?,?,?,?)", [userId, total_qus, score, attempt, submitted_date], (error, result_data) => {
         if (error) {
            res.json({ error: error })
         }
         if (result_data) {
            res.json({ status: "test submitted successfully" })
         }
      })
   }
   else {
      res.json({ status: "you don't use this" })
   }
})

// Update test attempt count
app.get("/updateAttempts", (req, res) => {
   if (req.session.user) {
      let user_Id = req.session.user[0].userId
      db.query("SELECT * FROM tbl_attemptdetails WHERE userId = ?", [user_Id], (error, result) => {
         if (error) {
            res.json({ error: error })
         }
         if (result.length != 0) {
            console.log(result)
            res.json({ testData: true, result: result, status: "success" })
         }
         else {
            res.json({ testData: false, status: "success" })
         }
      })
   }
   else {
      res.json({ status: "error", message: "You Don't allow this page" })
   }
})


//Show Score Details
app.get("/getScore", (req, res) => {
   if (req.session.user) {
      let user_Id = req.session.user[0].userId
      db.query("SELECT * FROM tbl_attemptdetails WHERE userId = ?", [user_Id], (error, result) => {
         if (error) {
            res.json({ error: error })
         }
         if (result.length != 0) {
            console.log(result)
            res.json({ testData: true, result: result, status: "success" })
         }
         else {
            res.json({ testData: false, status: "success" })
         }
      })
   }
   else {
      res.json({ status: "error", message: "You Don't allow this page" })
   }
})


// Admin side.....................................

// app.get("/admin/login", (req, res)=>{

//       if(req.session.user){
//          res.send({loggedIn:true, profile: req.session.user});
//       }
//       else{
//          res.send({loggedIn: false})
//          }
//       }) 

app.post("/admin/login", (req, res) => {
   const name = req.body.userName;
   const password = req.body.password;
   console.log(name, users)
   db.query("Select * from tbl_login where userName=?", [name], (error, result) => {
      if (error) {
         res.json({ error: error })
      }
      if (result.length != 0) {
         bcrypt.compare(password, result[0].password, (error, response) => {
            if (error) {
               res.json({ error: error })
            }
            if (response) {
               const id = result[0].id
               const token = jwt.sign({ id }, "jwtsecret", {
                  expiresIn: 300,
               })
               req.session.user = result;
               res.json({ auth: true, token: token, result: result })
            }
            else {
               res.send({ auth: false, message: 'Incorrect Password' });
            }
         })
      }
      else {
         res.send({ auth: false, message: 'User Not Exit' });
      }
   })
})


//Get all user details
app.get("/admin/getAllUser", (req, res) => {
   if (req.session.user) {
      let admin_user = req.session.user[0].user;
      // let user =0; WHERE user=? ",[user]

      if (admin_user == 1) {
         db.query("SELECT * FROM tbl_login ", (error, result) => {
            if (error) {
               res.json({ error: error })
            }
            if (result.length != 0) {
               res.json({ userData: true, profile: result, status: "success" })
            }
            else {
               res.json({ userData: false, status: "success" })
            }
         })
      }
      else {
         res.json({ userData: false, status: "failure", message: "You Don't allow access to this page" })
      }
   }
   else {
      res.json({ status: "error", message: "You Don't allow this page" })
   }
})


//Get By user Id
app.post("/admin/getByUserId", (req, res) => {
   if (req.session.user) {
      let admin_user = req.session.user[0].user;
      const userId = req.body.userId;

      if (admin_user == 1) {
         db.query("SELECT * FROM tbl_login WHERE userId =? ", [userId], (error, result) => {
            if (error) {
               res.json({ error: error })
            }
            if (result.length != 0) {
               res.json({ testData: true, profile: result, status: "success" })
            }
            else {
               res.json({ testData: false, message: 'This user not attent any test', status: "success" })
            }
         })
      }
      else {
         res.json({ testData: false, status: "failure", message: "You Don't allow access to this page" })
      }
   }
   else {
      res.json({ status: "error", message: "You Don't allow this page" })
   }
})


//Get all user Results
app.post("/admin/getUserResult", (req, res) => {
   if (req.session.user) {
      let admin_user = req.session.user[0].user;
      const userId = req.body.userId;

      if (admin_user == 1) {
         db.query("SELECT * FROM tbl_attemptdetails WHERE userId =? ", [userId], (error, result) => {
            if (error) {
               res.json({ error: error })
            }
            if (result.length != 0) {
               res.json({ testData: true, profile: result, status: "success" })
            }
            else {
               res.json({ testData: false, message: 'This user not attent any test', status: "success" })
            }
         })
      }
      else {
         res.json({ testData: false, status: "failure", message: "You Don't allow access to this page" })
      }
   }
   else {
      res.json({ status: "error", message: "You Don't allow this page" })
   }
})



//Delete one user details
app.post("/admin/deleteUserDetails", (req, res) => {
   if (req.session.user) {
      let admin_user = req.session.user[0].user;
      const userId = req.body.userId;

      console.log(userId)
      if (admin_user == 1) {
         db.query("DELETE FROM tbl_attemptdetails WHERE userId =? ", [userId], (error, result) => {
            if (error) {
               res.json({ error: error })
            }
            if (result.affectedRows != 0) {
               res.json({ deleteData: true, profile: result, status: "success" })
               console.log('Deleted Row(s):', result.affectedRows);
            }
            else {
               res.json({ deleteData: false, status: "failure" })
            }
         })
      }
      else {
         res.json({ deleteData: false, status: "failure", message: "You Don't allow access to this page" })
      }
   }
   else {
      res.json({ status: "error", message: "You Don't allow this page" })
   }
})

//Active Status of student user 
app.put("/admin/activeStatus", (req, res) => {
   if (req.session.user) {
      let admin_user = req.session.user[0].user;
      const userId = req.body.userId;
      const status_value = "activate";
      // var deactivate_date = new Date();

      console.log(userId)
      if (admin_user == 1) {
         db.query("UPDATE tbl_login SET status=? where userId =? ", [status_value, userId], (error, updateDetails) => {
            if (error) {
               res.json({ error: error })
            }
            if (updateDetails) {
               console.log(updateDetails)
               res.json({ statusData: true, message: 'Status updated successfully', status: "success" })
            }
            else {
               res.json({ statusData: false, message: 'Status not updated', status: "failure" })
            }
         })
      }
      else {
         res.json({ status: "failure", message: "You Don't allow access to this page" })
      }
   }
   else {
      res.json({ status: "error", message: "You Don't allow this page" })
   }
})

//Deactive Status of student user 
app.put("/admin/deactiveStatus", (req, res) => {
   if (req.session.user) {
      let admin_user = req.session.user[0].user;
      const userId = req.body.userId;
      const status_value = "deactivate";
      // var deactivate_date = new Date();

      console.log(userId)
      if (admin_user == 1) {
         db.query("UPDATE tbl_login SET status=? where userId =? ", [status_value, userId], (error, updateDetails) => {
            if (error) {
               res.json({ error: error })
            }
            if (updateDetails) {
               console.log(updateDetails)
               res.json({ statusData: true, message: 'Status updated successfully', status: "success" })
            }
            else {
               res.json({ statusData: false, message: 'Status not updated', status: "failure" })
            }
         })
      }
      else {
         res.json({ status: "failure", message: "You Don't allow access to this page" })
      }
   }
   else {
      res.json({ status: "error", message: "You Don't allow this page" })
   }
})


//Update Profile Details
app.put("/updateProfile", (req, res) => {
   const userId = req.body.userId;
   const name = req.body.userName;
   const number = req.body.phoneNumber;
   const dob = req.body.date;
   const email = req.body.email;
   const gender = req.body.gender;
   const city = req.body.city;
   var updated_date = new Date();

   if (req.session.user) {
      db.query("UPDATE tbl_login SET userName=?,phoneNumber=?,dob=?, email=?, gender=?, city=?, updated_date=? where userId =? ", [name, number, dob, email, gender, city, updated_date, userId], (error, updateDetails) => {
         if (error) {
            res.json({ error: error })
         }
         if (updateDetails) {
            db.query("SELECT * FROM tbl_login WHERE userName=? AND userId =? ", [name, userId], (error, selectedResult) => {
               if (error) {
                  res.json({ error: error })
               }
               if (selectedResult) {
                  req.session.user = selectedResult;
                  res.json({ message: 'Profile updated successfully', status: "success" })
               }
            })
         }
      })
   }
   else {
      res.json({ status: "failure", message: "you don't use this" })
   }
})

//Admin Update Profile Details
app.put("/admin/updateProfile", (req, res) => {
   const userId = req.body.userId;
   const name = req.body.userName;
   const number = req.body.phoneNumber;
   const email = req.body.email;
   const gender = req.body.gender;
   const city = req.body.city;
   const adminRights = req.body.user;
   var updated_date = new Date();

   if (req.session.user) {
      db.query("UPDATE tbl_login SET userName=?,phoneNumber=?, email=?, gender=?, city=?, updated_date=?, user=? where userId =? ", [name, number, email, gender, city, updated_date, adminRights, userId], (error, updateDetails) => {
         if (error) {
            res.json({ error: error })
         }
         if (updateDetails) {
            db.query("SELECT * FROM tbl_login WHERE userName=? AND userId =? ", [name, userId], (error, selectedResult) => {
               if (error) {
                  res.json({ error: error })
               }
               if (selectedResult) {
                  // req.session.user = selectedResult;
                  res.json({ message: 'Profile updated successfully', status: "success" })
               }
            })
         }
      })
   }
   else {
      res.json({ status: "failure", message: "you don't use this" })
   }
})


//Add New Question
app.post("/addQuestions", (req, res) => {
   const question = req.body.questions;
   const option = req.body.options;
   const answer = req.body.answer;
   const type = req.body.qus_type;
   var qusAdded_date = new Date();

   db.getConnection((err, connection) => {
      if (err) throw (err)
      const sqlInsert = "INSERT INTO tbl_question VALUES (0,?,?,?,?,?,0)"
      const insert_query = mysql.format(sqlInsert, [question, option, answer, type, qusAdded_date])

      connection.query(insert_query, (err, result) => {
         if (err) throw (err)
         if (result) {
            connection.release()
            console.log("--------> Question inserted")
            res.sendStatus(201)
         }
         else {
            res.json({ message: "you don't use this" })
         }
      })
   })
})

//Get all questions
app.get("/admin/getAllQuestions", (req, res) => {
   if (req.session.user) {
      let admin_user = req.session.user[0].user;

      if (admin_user == 1) {
         db.query("SELECT * FROM tbl_question ", (error, result) => {
            if (error) {
               res.json({ error: error })
            }
            if (result.length != 0) {
               res.json({ questionsData: true, questions: result, status: "success" })
            }
            else {
               res.json({ questionsData: false, status: "success" })
            }
         })
      }
      else {
         res.json({ questionsData: false, status: "failure", message: "You Don't allow access to this page" })
      }
   }
   else {
      res.json({ status: "error", message: "You Don't allow this page" })
   }
})

//Delete one Question
app.post("/admin/deleteQuestion", (req, res) => {
   if (req.session.user) {
      let admin_user = req.session.user[0].user;
      const qus_Id = req.body.qus_Id;

      console.log(qus_Id)
      if (admin_user == 1) {
         db.query("DELETE FROM tbl_question WHERE qus_Id =? ", [qus_Id], (error, result) => {
            if (error) {
               res.json({ error: error })
            }
            if (result.affectedRows != 0) {
               res.json({ deleteData: true, questions: result, status: "success" })
               console.log('Deleted Row(s):', result.affectedRows);
            }
            else {
               res.json({ deleteData: false, status: "failure" })
            }
         })
      }
      else {
         res.json({ deleteData: false, status: "failure", message: "You Don't allow access to this page" })
      }
   }
   else {
      res.json({ status: "error", message: "You Don't allow this page" })
   }
})

//Get By Question Id
app.post("/admin/getByQuestionId", (req, res) => {
   if (req.session.user) {
      let admin_user = req.session.user[0].user;
      const qus_Id = req.body.qus_Id;

      if (admin_user == 1) {
         db.query("SELECT * FROM tbl_question WHERE qus_Id =? ", [qus_Id], (error, result) => {
            if (error) {
               res.json({ error: error })
            }
            if (result.length != 0) {
               res.json({ testData: true, questions: result, status: "success" })
            }
            else {
               res.json({ testData: false, message: 'This user not attent any test', status: "success" })
            }
         })
      }
      else {
         res.json({ testData: false, status: "failure", message: "You Don't allow access to this page" })
      }
   }
   else {
      res.json({ status: "error", message: "You Don't allow this page" })
   }
})

//Admin Edit Question Details
app.put("/admin/editQuestion", (req, res) => {
   const qus_Id = req.body.qus_Id;
   const questions = req.body.questions;
   const options = req.body.options;
   const answer = req.body.answer;
   const type = req.body.qus_type;
   var edited_date = new Date();

   if (req.session.user) {
      db.query("UPDATE tbl_question SET questions=?,options=?, answer=?, qus_type=?, edited_date=? where qus_Id =? ", [questions, options, answer, type, edited_date, qus_Id], (error, updateDetails) => {
         if (error) {
            res.json({ error: error })
         }
         if (updateDetails) {
            db.query("SELECT * FROM tbl_question WHERE qus_Id =? ", [qus_Id], (error, selectedResult) => {
               if (error) {
                  res.json({ error: error })
               }
               if (selectedResult) {
                  // req.session.user = selectedResult;
                  res.json({ message: 'Question edited successfully', status: "success" })
               }
            })
         }
      })
   }
   else {
      res.json({ status: "failure", message: "you don't use this" })
   }
})


// const passwordReset = require("./routes/passwordReset");
// const users = require("./routes/users");
// app.use("/api/users", users);
// app.use("/api/password-reset", passwordReset);

//  const connection = require("./db");
// connection();


// Change User Password
app.put("/changePassword", (req, res) => {
   if (req.session.user) {
      const userId = req.session.user[0].userId
      const oldPassword = req.body.oldPassword;
      const newPassword = req.body.newPassword;

      db.query("SELECT * FROM tbl_login WHERE userId =? ", [userId], (error, selectedResult) => {
         if (error) {
            res.json({ error: error })
         }
         if (selectedResult.length != 0) {
            bcrypt.compare(oldPassword, selectedResult[0].password, (error, response) => {
               if (error) {
                  res.json({ error: error })
               }
               if (response) {
                  bcrypt.hash(newPassword, 10, (error, newPass) => {
                     if (error) {
                        res.json({ error: error })
                     }
                     if (newPass) {
                        if (newPassword != oldPassword) {
                           db.query("UPDATE tbl_login SET password=? where userId =? ", [newPass, userId], (error, passwordUpdate) => {
                              if (passwordUpdate.affectedRows != 0) {
                                 res.json({ updatePassword: true, message: "Your new password is updated" });
                              }
                              else {
                                 res.json({ updatePassword: false, message: "Your new password is not updated" });
                              }
                           })
                        }
                        else {
                           res.json({ updatePassword: false, message: "Your old & new password is same, change new password" });
                        }
                     }
                  })
               }
               else {
                  res.json({ updatePassword: false, message: "Your old password is incorrect" });
               }
            })
         }
         else {
            res.json({ updatePassword: false, message: "Does't find any user" });
         }
      })
   }
   else {
      res.json({ auth: false, message: "You Don't allow access to this page" });
   }
})

// Feedback details
app.post("/feedback", (req, res) => {
   const userId = req.body.userId;
   const name = req.body.userName;
   const email = req.body.email;
   const feedback = req.body.feedback;
   const suggestion = req.body.suggestion;
   var submitted_date = new Date();

   if (req.session.user) {
      db.query("SELECT * FROM tbl_feedback where userId = ?", [userId], (error, result) => {
         if (error) {
            res.json({ error: error })
         }
         if (result.length == 0) {
            db.query("INSERT INTO tbl_feedback VALUES (?,?,?,?,?,?)", [userId, name, email, feedback, suggestion, submitted_date], (error, result_data) => {
               if (error) {
                  res.json({ error: error })
               }
               if (result_data) {
                  res.json({ feedbackData: true, result: result_data, message: "Feedback submitted successfully" })
               }
            })
         }
         else {
            res.json({ feedbackData: false, message: "Already feedback submitted" })
         }
      })
   }
   else {
      res.json({ status: "you don't use this" })
   }
})

//Get all Feedback details
app.post("/admin/getFeedback", (req, res) => {
   if (req.session.user) {
      let admin_user = req.session.user[0].user;
      const userId = req.body.userId;

      if (admin_user == 1) {
         db.query("SELECT * FROM tbl_feedback WHERE userId =? ", [userId], (error, result) => {
            if (error) {
               res.json({ error: error })
            }
            if (result.length != 0) {
               res.json({ testData: true, feedback: result, status: "success" })
            }
            else {
               res.json({ testData: false, message: 'This user not submit any feedback', status: "success" })
            }
         })
      }
      else {
         res.json({ testData: false, status: "failure", message: "You Don't allow access to this page" })
      }
   }
   else {
      res.json({ status: "error", message: "You Don't allow this page" })
   }
})


//Upload Images
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// Upload Endpoint
app.post('/upload', (req, res) => {
   if (req.files === null) {
      return res.status(400).json({ msg: 'No file uploaded' });
   }
   const file = req.files.image;
   console.log(req.files.image.mv)

   file.mv(`${__dirname}/public/uploads/${file.name}`, err => {
      if (err) {
         console.error(err);
         return res.status(500).send(err);
      }
      if (req.session.user) {
         let user_Id = req.session.user[0].userId
      const images = req.files.image.name;
      const filename = req.files.image.name;
      const submitted_date = new Date();
      console.log(images)
      db.query("INSERT INTO tbl_image VALUES(?,?,?,?)", [user_Id,images, filename, submitted_date], (err, result) => {
         if (err) throw err
         console.log("file uploaded")
         res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
         // res.send('file uploaded')
      })
   }
   });
});


// Get ImagePath
app.get('/public/uploads/:pathname', (req, res) => {

   if (req.params.pathname) {
      // let filepath ='localhost:3005/public/uploads/'+req.params.pathname
      let filepath = `${__dirname}/public/uploads/${req.params.pathname}`
      res.sendFile(filepath);
   }
   else {
      res.json({ message: "404 not found", name: req.params.pathname })
   }
})


//Get Image
app.get('/getImage', (req, res) => {
   if (req.session.user) {
      let user_Id = req.session.user[0].userId
      db.query("SELECT imageName FROM tbl_image WHERE userId = ?", [user_Id], (error, result) => {
         console.log(result)
         if (error) {
            res.json({ error: error })
         }
         if (result) {
            res.json({ imageData: true, uploadImage: result, message: 'Get image successfully' })
         }
      })
   }
})

