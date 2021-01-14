const express = require("express");
const session = require("express-session");
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const mysql = require("mysql");
const path = require('path');
const { error } = require("console");

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'@Ptoleme123',
    database:'store',
})

app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
///////////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/api/login', (req, res) => {
    let Usergid = req.body.Usergid
    let Userpassword = req.body.Userpassword
    const sqlSelect = "SELECT * FROM table_user WHERE GID = ? AND Password_User = ? "
    
    db.query(sqlSelect, [Usergid, Userpassword],(err, result) => {
        if(error){
            res.sen({error:error})
        } 
            
        if (result) {
            res.send(result)
        } else {
            res.send({msg: "wrong GID/Password"})
        }
    })
})
///////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/api/get', (req, res) => {
    const sqlSelect = "SELECT PartCode , Brand , Location_at , Description , Status , Values_number FROM table_store";
    //const sqlSelectV1 = "SELECT ";
    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.put("/api/updateStoreWithdraw", (req, res) => {
    //const id = req.body.id
    const result = req.body.result
    const values = req.body.values
    //const GID = req.body.GID
    //const Date_time = new Date().toDateString()

    db.query("UPDATE table_store SET Values_number = Values_number - ? WHERE PartCode = ?",
    [values,result] , (err, result) => {
        if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
    })

    

    //db.query("UPDATE table_store SET Values_number = ? WHER PartCode = ? ", [])
    //UPDATE table_store SET Values_number = '123' WHERE PartCode = 'SADA' 
    //update table_store SET Values_number = Values_number - 1 where PartCode = ?;
})

app.put("/api/updateToStore", (req, res) => {
    const result = req.body.result
    const values = req.body.values

    db.query("UPDATE table_store SET Values_number = Values_number + ? WHERE PartCode = ?",
    [values,result] , (err, result) => {
        if (err) {
            console.log(err);
          } else {
            res.send(result);
          }
    })

    //db.query("UPDATE table_store SET Values_number = ? WHER PartCode = ? ", [])
    //UPDATE table_store SET Values_number = '123' WHERE PartCode = 'SADA' 
    //update table_store SET Values_number = Values_number - 1 where PartCode = ?;
})

app.post("/api/insert", (req, res) => {

    const PartCode = req.body.PartCode
    const Brand = req.body.Brand
    const Location_at = req.body.Location_at
    const Values = req.body.Values
    const Description = req.body.Description
    const date = new Date().toDateString()
    const Insert ="INSERT IGNORE INTO table_store (PartCode, Brand, Location_at,Values_number, Description, Date) VALUES (?,?,?,?,?,?)";
    

    db.query(Insert, [PartCode, Brand, Location_at,Values, Description, date ] , (err, result) => {
        console.log(err)
    })
})

app.get("/", (req, res) => {
    //const Insert ="INSERT INTO table_store (PartCode, Brand) VALUES ('abc123sdf','Shneider')"
    //db.query(Insert, (err, result) => {
        res.send("Successfully")
})
    
app.get("/select", (req,res) => {
    //SELECT DISTINCT
    //COUNT (*)
    db.query(" SELECT id , PartCode , Brand FROM table_store WHERE id='1' ", (err, result) => {
        console.log(result)
    })
})

////////////////////////////////////////////////////////////////////////////////////// PART OF HISTORY
app.get('/api/history', (req, res) => {
    const sqlSelect = "SELECT PartCode, Values_number, GID, Date_time, status FROM table_history";
    db.query(sqlSelect, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.post("/api/historyWithdraw", (req, res) => {

    const result = req.body.result
    const values = req.body.values
    const GID = req.body.GID
    const Date_time = new Date().toDateString()

     db.query("INSERT INTO table_history (PartCode, Values_number, GID, Date_time, status) VALUES (?,?,?,?,'WITHDRAW')",   //partCode values gid date//
     [result,values,GID,Date_time] , (err, result) => {
         if (err) {
             console.log(err);
           } else {
             res.send(result);
           }
     })
})

app.post("/api/historyToStore", (req, res) => {

    const result = req.body.result
    const values = req.body.values
    const GID = req.body.GID
    const Date_time = new Date().toDateString()

     db.query("INSERT INTO table_history (PartCode, Values_number, GID, Date_time, status) VALUES (?,?,?,?,'To Store')",   //partCode values gid date//
     [result,values,GID,Date_time] , (err, result) => {
         if (err) {
             console.log(err);
           } else {
             res.send(result);
           }
     })
})


app.listen(3001, ()  => {
    console.log("running...")
})  