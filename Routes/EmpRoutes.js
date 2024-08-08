const express = require('express');
const router = express.Router();
const connection = require('../db');

router.post('/addEmp',async(req,res)=>{
  try{
    const createEmptable = `
    CREATE TABLE IF NOT EXISTS employee (
    empId VARCHAR(255),
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    role VARCHAR(255),
    leaveCount INT DEFAULT 10
  )
  `
  await connection.query(createEmptable)
  const empdata = req.body
  for(var i=0;i<empdata.length;i++)
  {
    console.log(empdata[i])
    const {empId,Name,email,phone,password,role,leaveCount} = empdata[i]
    const query = `INSERT INTO employee (empId,Name,email,phone,password,role,leaveCount) VALUES(?,?,?,?,?,?,?)`
    connection.query(query,[empId,Name,email,phone,password,role,leaveCount])
    
  }
  res.send("Employee data added successfully")
}
catch(err){
  console.log(err)
  res.status(400).send("Error Adding Data")
}
})

  router.post('/viewEmp', async (req, res) => {
    const query = "SELECT * FROM employee"
    const dataEmp = await connection.query(query)
    res.send(dataEmp[0])
  })
  router.post('/viewEmp/:id', async (req, res) => {
    const id = req.params.id
    const query = "SELECT * FROM employee WHERE empId = ?"
    const data = await connection.query(query, [id])
    res.send(data)
  })

  router.post('/updateEmp/:id', async (req, res) => {
    const id = req.params.id
    const query1 = "SELECT * FROM employee WHERE empId = ?"
    const existId = await connection.query(query1, [id])
    if(existId[0].length){
      const Name = req.body.editName
      const email = req.body.editemail
      const phone = req.body.editphone
      const role = req.body.editrole
      console.log(Name, email, phone, role);
      
      const query = "UPDATE employee SET Name = ?, email = ?, phone = ?, role = ? WHERE empId = ?"
      const updatedData = await connection.query(query, [Name, email, phone, role, id])
      const existId = await connection.query(query1, [id])
      if(updatedData[0].affectedRows) {
        res.status(200).send({message:"User Updated Successfully...!", data:existId[0]} )
      } else {
        res.status(500).send("Error occured..!")
      }
    } else{
      res.status(404).send("Employee does not exist")
    }
  })

  router.post('/deleteEmp/:id', async (req, res)=>{
    const id = req.params.id
    const query1 = "SELECT * FROM employee WHERE empId = ?"
    const existId = await connection.query(query1, [id])
    
    if(existId[0].length){
      const query = "DELETE FROM employee WHERE empId = ?"
      const deletedData = await connection.query(query, [id])
      if(deletedData[0].affectedRows){
        res.status(200).send("User deleted successfully")
      }
      else{
        res.status(500).send("Error occured")
      }
    }
    else{
      res.status(404).send("Employee does not exist")
    }
  })

  router.post('/deleteNull', async (req, res)=>{
    query1 = "SELECT * FROM employee"
    query = `DELETE FROM employee WHERE trim(empId)="";`
    await connection.query(query)
    .then(async ()=>{
      data = await connection.query(query1)
      console.log(data)
      res.send(data)
     })
    .catch((err)=>{res.send(err)})
  })

module.exports = router;
