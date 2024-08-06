const express = require('express');
const router = express.Router();
const connection = require('../db');

router.post('/apply', async (req, res) => {
    const { empId, Name, role, reason, leave_fdate, leave_tdate } = req.body
    const tablequery = 'CREATE TABLE IF NOT EXISTS leaves ( leaveId int AUTO_INCREMENT PRIMARY KEY, empId varchar(20), Name varchar(30), role varchar(20), reason varchar(100), leave_fdate DATE, leave_tdate DATE, approved boolean default false, remark varchar(50) default NULL)';
    await connection.query(tablequery)
    const query = "INSERT INTO leaves (empId, Name, role, reason, leave_fdate, leave_tdate) VALUES (?, ?, ?, ?, ?, ?)"
    const data2 = await connection.query(query, [empId, Name, role, reason, leave_fdate, leave_tdate])
    if (data2[0].length) {
        res.send("some thing went wrong :(")
    } else {
        res.send("Leave applied...!")
    }
})

router.post('/delete/:id', async (req, res) => {
    const id = req.params.id
    const query = "DELETE FROM leaves WHERE empId = ?"
    await connection.query(query, [id])
    res.send('Leave deleted successfully..!')
})

router.post('/approve', async (req, res)=>{
    const {leaveId} = req.body
    const query = "UPDATE leaves SET approved = 1 WHERE leaveId = ?"
    const approve = await connection.query(query, [leaveId])
    res.send('approved')
})

router.post('/show', async (req, res) => {
    const query = "SELECT * FROM leaves"
    const data = await connection.query(query)
    if (data[0].length) {
        res.send(data[0])
    } else {
        res.send("No data :(")
    }
})

module.exports = router;