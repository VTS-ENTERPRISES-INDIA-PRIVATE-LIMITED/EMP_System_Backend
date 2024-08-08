const connection = require('../db')
const router = require('express').Router()
const WebSocket = require("ws");
const sendOtpMail = require('../EmailService/OtpService')
const wss = new WebSocket.Server({ port: 8000 });

// wss.on("connection", function connection(ws) {
//     console.log("New client connected");
// });

router.post('/login',(req,res)=>{
    const {empId,password} = req.body
    console.log(req.body)
    const loginQuery = `SELECT * FROM employee WHERE empId = ? AND password = ?`
    connection.query(loginQuery,[empId,password])
    .then(user=>{
        console.log(user[0])
        res.send(user[0])

    })
    .catch(err=>res.status(400).send('Invalid Credentials'))
})


router.post('/viewEmp/:email', async (req, res) => {
    const email = req.params.email
    const query = "SELECT * FROM employee WHERE email = ?"
    const data = await connection.query(query, [email])
    res.send(data[0].length>0)
})

router.post("/sendotp",async (req,res)=>{
    const {email} = req.body
    const query = 'SELECT * FROM employee WHERE email = ?'
    const data = await connection.query(query, [email])
    if (data[0].length) {
        const response = await sendOtpMail(email)
        if(response)
            res.send({otp:response})
        else
            res.send("error sending mail")
    } else {
        res.status(404).send("No user found")
    }
})

router.post('/resetpassword',(req,res)=>{
    const {email,password} = req.body
    const query =  'UPDATE employee SET password = ? WHERE email = ?'
    connection.query(query,[password,email])
    .then((resp)=>res.send("Password Reset Successful"))
    .catch((err)=>res.status(400).send("Failed to reset password"))
});

router.post('/leaverequest',async(req,res)=>{
    try{
         
      const query1 = 'CREATE TABLE IF NOT EXISTS leaves (empId VARCHAR(255),fromDate VARCHAR(255),toDate VARCHAR(255),reason VARCHAR(255),isApproved VARCHAR(255))'
      connection.query(query1)
      const {empId,fromDate,toDate,reason} = req.body
      const query = 'INSERT INTO leaves(empId,fromDate,toDate,reason,isApproved) VALUES (?,?,?,?,?)'
      connection.query(query,[empId,fromDate,toDate,reason,false])
      connection.query('COMMIT');
      res.status(201).send(`Data inserted successfully`);
      if (wss && wss.clients.size > 0) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send("New Leave Request");
            }
        });
    }
    }catch(error){
        console.error('Error inserting data:', error);
        await connection.query('ROLLBACK');
        res.status(500).send('Error inserting data');
    }

});


module.exports = router