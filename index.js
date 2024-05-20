let express = require('express');
let cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
// Database setup
let db = new sqlite3.Database('./myDB.db');
let app = express();

app.use(cors());
app.use(express.json());

app.get('/secret', (req, res) => {
    const secret = Math.floor(Math.random * 100);
    res.json({ secret });
})

app.get('/', (req, res) => {
    res.json("Welcome to the server");
});

app.post('/create', (req, res) => {
    const {name , email , password} = req.body;
    const QUERY = "INSERT into users(name,email,password)values(?,?,?)";
    try {
        db.run(QUERY, name , email, password);
    } catch(err) {
        console.log('Error',err)
    }
})

app.get('/userInfo', (req, res) => {
    let sql = 'SELECT * FROM users';
    try {
        new Promise((resolve, reject) => {
            db.all(sql, function (err, row) {
                if (row) {
                    // reject({ err : "Internal Server error"});
                    resolve(row)
                 } else {
                    reject(err);
                }
            })
        }).then((data) => {
            res.status(200).send({responseObj: data});
            // res.send({status: 200, responseObj: data});
        }).catch((err) =>{
            res.status(400).send({status: 400, errMsg: "UNIQUE constraint failed for Email"})
    })
    } catch(err) {
        console.log('Err', err)
    } 
})

app.get("/userInfo/:id", (req, res) => {
    let id = req.params.id;
    console.log('ID',id);
    let sql = "SELECT * FROM users WHERE id=" + id;
    try {
        new Promise((resolve, reject) => {
            db.all(sql, function (err, row) {
                if (row) {
                    resolve(row)
                } else {
                    reject(err);
                }
            })
        }).then((data) => {
            res.status(200).send({responseObj: data});
            // res.send({status: 200, responseObj: data});
        }).catch(err =>
            console.log('Error', err))
        
    } catch(err) {
        console.log('Err', err)
    }
})

app.get("/count", (req, res) => {
    const sql = "SELECT COUNT(*) AS userCount FROM users";
    // console.log('Query', sql)
    try {
        new Promise((resolve, reject) => {
            db.all(sql, function (err, row) {
                console.log('Row', row);
                console.log('Error', err);
                if (row) {
                    console.log('Row', row)
                    // reject({ err : "Internal Server error"});
                    resolve(row)
                 } else {
                    reject(err);
                }
            })
        }).then((data) => {
            res.status(200).send({responseObj: data});
            // res.send({status: 200, responseObj: data});
        }).catch((err) =>{
            res.status(400).send({status: 400, errMsg: "Internal Server error"})
    })
    } catch(err) {
        console.log('Err', err)
    } 
})

app.delete("/deleteUser/:id", (req, res) => {
    let id = req.params.id;
    console.log('ID',id);
    sql = "DELETE from users WHERE id=" +id;
    try {
        new Promise((resolve, reject) => {
            db.all(sql, function (err, row) {
                console.log('Row', row);
                console.log('Error', err);
                if (row) {
                    console.log('Row', row)
                    // reject({ err : "Internal Server error"});
                    resolve(row)
                 } else {
                    reject(err);
                }
            })
        }).then((data) => {
            res.status(200).send({responseObj: "Successfully deleted!"});
            // res.send({status: 200, responseObj: data});
        }).catch((err) =>{
            res.status(400).send({status: 400, errMsg: "Internal Server error"})
    })
    } catch(err) {
        console.log('Err', err)
    } 

})

app.listen('8080' , (req , res)=> console.log("Listening at 8080."))