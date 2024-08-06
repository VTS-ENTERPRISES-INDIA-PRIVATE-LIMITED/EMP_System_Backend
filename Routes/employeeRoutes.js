const connection = require('../db')
const router = require('express').Router()

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

router.post('/resetpassword',(req,res)=>{
    const {email,password} = req.body
    const query =  'UPDATE employee SET password = ? WHERE email = ?'
    connection.query(query,[password,email])
    .then((resp)=>res.send("Password Reset Successful"))
    .catch((err)=>res.status(400).send("Failed to reset password"))
})

module.exports = router