const express = require('express');
const router = express.Router();
const connection = require('../db');
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8000 });
//const wss2 = new WebSocket.Server({ port: 6000 });

router.post('/apply', async (req, res) => {
    const { empId, Name, role, reason, leave_fdate, leave_tdate } = req.body
    const tablequery = 'CREATE TABLE IF NOT EXISTS leaves ( leaveId int AUTO_INCREMENT PRIMARY KEY, empId varchar(20), Name varchar(30), role varchar(20), reason varchar(100), leave_fdate DATE, leave_tdate DATE, approved boolean default false, remark varchar(50) default NULL)';
    await connection.query(tablequery)
    const query = "INSERT INTO leaves (empId, Name, role, reason, leave_fdate, leave_tdate) VALUES (?, ?, ?, ?, ?, ?)"
    const data2 = await connection.query(query, [empId, Name, role, reason, leave_fdate, leave_tdate])
    if (data2[0].length) {
        res.send("something went wrong :(")
    } else {
        res.send("Leave applied...!")
        if (wss && wss.clients.size > 0) {
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send("New Leave Request");
                }
            });
        }
    }
})

router.post('/delete/:id', async (req, res) => {
    const id = req.params.id
    const q1 = "SELECT * FROM leaves WHERE leaveId = ?"
    const lid = await connection.query(q1, [id])
    if (lid[0].length) {
        const query = "DELETE FROM leaves WHERE leaveId = ?"
        await connection.query(query, [id])
        res.send('Leave deleted successfully..!')
    } else {
        res.status(404).send("No leave found..!")
    }
})

// router.post('/approve', async (req, res)=>{
//     const {empId} = req.body
//     const query = "UPDATE leaves SET approved = 1 WHERE empId = ?"
//     const approve = await connection.query(query, [empId])
//     res.send('approved')
//     if (wss2 && wss2.clients.size > 0) {
//         wss2.clients.forEach((client) => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send("Your Leave Request was Approved");
//             }
//         });
//     }
// })

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