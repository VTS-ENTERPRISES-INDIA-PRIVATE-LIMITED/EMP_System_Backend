const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const connection = require('../db');
//const sendPayrollMail = require('../EmailService/PayrollMail')

router.post('/payroll', upload.single('file'), async (req, res) => {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const employees = xlsx.utils.sheet_to_json(worksheet);
    try {
        connection.query('BEGIN');
        for (var i = 0; i < employees.length; i++) {
          const employee = employees[i];
        //   const { name,email,salary} = employee;
        
          const query1 = 'INSERT INTO payroll (SNo,name,email,salary) VALUES (?,?,?,?)';
          const results = await connection.query(query1,[employee.SNo,employee.name,employee.email,employee.salary]);
  
          //await sendPayrollMail( name, email, salary, date );
  
          console.log(results);
        }
        connection.query('COMMIT');
        res.status(201).send(`Data inserted successfully`);
  
    } catch (error) {
        console.error('Error inserting data:', error);
        await connection.query('ROLLBACK');
        res.status(500).send('Error inserting data');
    }
  
});

router.post('/payslips',upload.single('file'),async(req,res)=>{
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const employees = xlsx.utils.sheet_to_json(worksheet);
    try{
        connection.query('BEGIN');
        for(var i=0;i<employees.length;i++){
            const employee = employees[i];
            const query = 'INSERT INTO payslips(Emp_Id,Month,Year,PayslipLink) VALUES (?,?,?,?)';
            const results = await connection.query(query,[employee.Emp_Id,employee.Month,employee.Year,employee.PayslipLink]);
            console.log(results);
        }
        connection.query('COMMIT');
        res.status(201).send(`Data inserted successfully`);
    }catch(error){
        console.error('Error inserting data:', error);
        await connection.query('ROLLBACK');
        res.status(500).send('Error inserting data');
  }
});

router.post('/empsalary', async (req, res) => {
    const { Emp_Id, Month, Year, PayslipLink } = req.body;
    const query = 'INSERT INTO payslips(Emp_Id,Month,Year,PayslipLink) VALUES (?,?,?,?)';
    const results = await connection.query(query, [Emp_Id, Month, Year, PayslipLink]);
    res.send(results);
});

router.get('/emp/:id', async (req, res) => {
    const id = req.params.id;
    const query = 'SELECT Month,Year,PayslipLink FROM payslips WHERE Emp_Id = ?';
    const results = await connection.query(query, [id]);
    res.send(results[0]);
});

router.get('/emp/:id/:month/:year', async (req, res) => {
    const id = req.params.id;
    const month = req.params.month;
    const year = req.params.year;
    const query = 'SELECT PayslipLink FROM payslips WHERE Emp_Id = ? AND Month = ? AND Year = ?';
    const results = await connection.query(query, [id, month, year]);
    res.send(results[0]);
});
router.post("/savepayslips", async (req, res) => {
    const { empId, payslipUrl } = req.body;
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
  
    try {
    //   const connection = await pool.getConnection();
  
      await connection.query(`
        CREATE TABLE IF NOT EXISTS payslips (
          empId VARCHAR(255),
          month VARCHAR(255),
          year INT,
          url TEXT
        )
      `);
  
      await connection.query(`
        INSERT INTO payslips (empId, month, year, url)
        VALUES (?, ?, ?, ?)
      `, [empId, month, year, payslipUrl]); 
      res.status(200).send('Payslip saved successfully');
    } catch (error) {
      console.error('Error saving payslip:', error);
      res.status(500).send('Error saving payslip');
    }
  });

  router.get('/getpayslips/:empid',async(req,res)=>{
    const query = 'SELECT * FROM payslips WHERE empId = ?'
    const payslips = await connection.query(query,[req.params.empid])
    console.log(payslips[0])
    res.send(payslips[0])
  })


  //for emp data

  router.post('/addempdata',async(req,res)=>{
    try{
      const createEmptable = `
    CREATE TABLE IF NOT EXISTS employee (
      empId VARCHAR(255),
      Name VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(255),
      password VARCHAR(255),
      role VARCHAR(255)
    )
    `
    await connection.query(createEmptable)
    
   
    const empdata = req.body
    
    for(var i=0;i<empdata.length;i++)
    {
      const {empId,name,email,phone,role} = empdata[i]
      const query = `
      INSERT INTO employee (empId,Name,email,phone,password,role) VALUES(?,?,?,?,?,?)
    `
    connection.query(query,[empId,name,email,phone,empId,role])
    .then(resp=>console.log(`${name} added successfully`))
    .catch(err=>console.log(`error occured with ${name}`))
    }
    res.send("Employee data added successfully")
  }
  catch(err){
    console.log(err)
    res.status(400).send("Error Adding Data")
  }
  })

  router.post('/addemployee',async(req,res)=>{
    const {empId,name,email,phone,role} = req.body
    const query = `
      INSERT INTO employee (empId,Name,email,phone,password,role) VALUES(?,?,?,?,?,?)
    `
    connection.query(query,[empId,name,email,phone,empId,role])
    .then(response=>res.send("Data added Successfully"))
    .catch(err=>res.send(err))
  })
module.exports = router;
