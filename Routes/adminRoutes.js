const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const connection = require('../db');
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 6000 });
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

  // router.post('/addemp',async(req,res)=>{
  //   try{
  //     const createEmptable = `
  //   CREATE TABLE IF NOT EXISTS employee (
  //     empId VARCHAR(255),
  //     Name VARCHAR(255),
  //     email VARCHAR(255),
  //     phone VARCHAR(255),
  //     password VARCHAR(255),
  //     role VARCHAR(255)
  //   )
  //   `
  //   await connection.query(createEmptable)
    
   
  //   const empdata = req.body
    
  //   for(var i=0;i<empdata.length;i++)
  //   {
  //     const {empId,name,email,phone,role} = empdata[i]
  //     const userExists = await connection.query('SELECT * FROM employee WHERE empId = ?', [empId]);
  //     if (userExists.length > 0) {
  //       console.log(`${empId} already exists`);
  //       continue;
  //     }
  //     const query = `
  //     INSERT INTO employee (empId,Name,email,phone,password,role) VALUES(?,?,?,?,?,?)
  //   `
  //   connection.query(query,[empId,name,email,phone,empId,role])
  //   .then(resp=>console.log(`${name} added successfully`))
  //   .catch(err=>console.log(`error occured with ${name}`))
  //   }
  //   res.send("Employee data added successfully")
  // }
  // catch(err){
  //   console.log(err)
  //   res.status(400).send("Error Adding Data")
  // }
  // })

router.post('/addempdata',async(req,res)=>{
  try{
    const Emp = ' CREATE TABLE IF NOT EXISTS employee ( empId VARCHAR(255),Name VARCHAR(255),email VARCHAR(255),phone VARCHAR(255),password VARCHAR(255),role VARCHAR(255),workMode VARCHAR(255),leavesTaken INT DEFAULT 0,leaveBalance INT DEFAULT 10,LeavesApproved INT DEFAULT 0,LeavesDeclined INT DEFAULT 0) '
    connection.query(Emp)
    const{empId,Name,email,phone,password,role,workMode} = req.body
    // const userQuery = 'SELECT empId FROM employee WHERE empId = ?'
    // const userExists = await connection.query(userQuery, [empId]);
    // if (userExists.length > 0) {
    //   console.log(`${empId} already exists`);
    //   res.status(400).send('User already exists');
    //   return;
    // }
    const query = 'INSERT INTO employee (empId,Name,email,phone,password,role,workMode) VALUES(?,?,?,?,?,?,?)'
    connection.query(query,[empId,Name,email,phone,password,role,workMode])
    res.status(201).send(`Data added successfully`);
}catch(error){
    console.error('Error adding data:', error);
    res.status(500).send('Error adding data');
}
});


router.post('/leaveapprove/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let leaveBalance;
    await connection.query('START TRANSACTION');
    const [rows] = await connection.query('SELECT leaveBalance FROM employee WHERE empId = ?', [id]);
    leaveBalance = rows[0]?.leaveBalance;
    leaveBalance = parseInt(leaveBalance, 10);
    if (leaveBalance <= 0) {
      const query2 = 'UPDATE employee SET leavesTaken = leavesTaken + 1, leaveBalance = 0, LeavesDeclined = LeavesDeclined + 1 WHERE empId = ?';
      await connection.query(query2, [id]);
      await connection.query('COMMIT');
      res.status(201).send('This employee dont have any leave left even if he/she takes then it comes under loss of pay.');
    }else {
      const query3 = 'UPDATE leaves SET approved = 1 WHERE empId = ?';
      await connection.query(query3, [id]);
      const query4 = 'UPDATE employee SET leaveBalance = leaveBalance - 1 , leavesTaken = leavesTaken + 1 , LeavesApproved = LeavesApproved + 1 WHERE empId = ? AND leaveBalance > 0';
      await connection.query(query4, [id]);
      await connection.query('COMMIT');
      res.status(201).send('Data updated successfully');
      if (wss && wss.clients.size > 0) {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send('Leave Request Approved');
          }
        });
      }
    }
  } catch (error) {
    console.error('Error updating data:', error);
    await connection.query('ROLLBACK');
    res.status(500).send('Error updating data');
  }
});



// router.post('/logtimes',async(req,res)=>{
//   try{
//     const logs = ' CREATE TABLE IF NOT EXISTS logs ( empId VARCHAR(255),date DATE,login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,logout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,isLoggedIn VARCHAR(255),Des VARCHAR(255))'
//     connection.query(logs)
//     const{empId,date} = req.body
//     if(login == "09:00:00"){
//       isLoggedIn = true
//     }else if(login > "09:00:00"){
//       isLoggedIn = true
//       Des = "Late Entry"
//     }else{
//       isLoggedIn = false
//       Des = "Absent"
//     }
//     if(logout == "18:00:00"){
//       isLoggedIn = false
//     }else if(logout < "18:00:00"){
//       isLoggedIn = true
//       Des = "Early Exit"
//     }else{
//       isLoggedIn = false
//       Des = "Absent"
//     }
//     const query = 'INSERT INTO logs (empId,date,login,logout,isLoggedIn,Desc) VALUES (?,?,?,?,?,?)'
//     connection.query(query,[empId,date,login,logout,isLoggedIn,Desc])
//     connection.query('COMMIT');
//     res.status(201).send(`Data inserted successfully`);

//   }catch(error){
//     console.error('Error inserting data:', error);
//     await connection.query('ROLLBACK');
//     res.status(500).send('Error inserting data');
//   }

// });


router.post('/logtimes', async (req, res) => {
  try {
    const logs = 'CREATE TABLE IF NOT EXISTS logs (empId VARCHAR(255), date DATE, login TIMESTAMP DEFAULT CURRENT_TIMESTAMP, logout TIMESTAMP DEFAULT CURRENT_TIMESTAMP, isLoggedIn VARCHAR(255), loginDes VARCHAR(255), logoutDes VARCHAR(255))';
    connection.query(logs);

    const { empId } = req.body;

    const currentDate = new Date();

    const formattedLoginTime = currentDate.toISOString().slice(0, 19).replace('T', ' ');
    const formattedLogoutTime = currentDate.toISOString().slice(0, 19).replace('T', ' ');

    let isLoggedIn, loginDes = '', logoutDes = '';

    if (currentDate.getHours() === 9 && currentDate.getMinutes() === 0 && currentDate.getSeconds() === 0) {
      isLoggedIn = true;
    } else if (currentDate.getHours() > 9 || (currentDate.getHours() === 9 && (currentDate.getMinutes() > 0 || currentDate.getSeconds() > 0))) {
      isLoggedIn = true;
      loginDes = 'Late Entry';
    } else {
      isLoggedIn = false;
      loginDes = 'Absent';
    }

    if (currentDate.getHours() === 18 && currentDate.getMinutes() === 0 && currentDate.getSeconds() === 0) {
      isLoggedIn = false;
    } else if (currentDate.getHours() < 18 || (currentDate.getHours() === 18 && (currentDate.getMinutes() < 0 || currentDate.getSeconds() < 0))) {
      isLoggedIn = true;
      logoutDes = 'Early Exit';
    } else {
      isLoggedIn = false;
      logoutDes = 'Absent';
    }

    const formattedDate = currentDate.toISOString().split('T')[0];

    const query = 'INSERT INTO logs (empId, date, login, logout, isLoggedIn, loginDes, logoutDes) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [empId, formattedDate, formattedLoginTime, formattedLogoutTime, isLoggedIn.toString(), loginDes, logoutDes]);
    connection.query('COMMIT');
    res.status(201).send('Successss');

  } catch (error) {
    console.error('Failed', error);
    connection.query('ROLLBACK');
    res.status(500).send('Failed');
  }
});

router.post('/logintime', async (req, res) => {
  try {
    const logs = 'CREATE TABLE IF NOT EXISTS logins (empId VARCHAR(255), date DATE, login TIME, isLoggedIn VARCHAR(255), loginDes VARCHAR(255))';
    connection.query(logs);

    const { empId } = req.body;

    const currentDate = new Date();
    const formattedLoginTime = currentDate.toTimeString().slice(0, 8);

    let isLoggedIn, loginDes = '';

    if (currentDate.getHours() === 9 && currentDate.getMinutes() === 0 && currentDate.getSeconds() === 0) {
      isLoggedIn = true;
    } else if (currentDate.getHours() > 9 || (currentDate.getHours() === 9 && (currentDate.getMinutes() > 0 || currentDate.getSeconds() > 0))) {
      isLoggedIn = true;
      loginDes = 'Late Entry';
    } else {
      isLoggedIn = false;
      loginDes = 'Absent';
    }

    const formattedDate = currentDate.toISOString().split('T')[0];

    const query = 'INSERT INTO logins (empId, date, login, isLoggedIn, loginDes) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [empId, formattedDate, formattedLoginTime, isLoggedIn.toString(), loginDes]);
    connection.query('COMMIT');
    res.status(201).send('Logged in successfully');

  } catch (error) {
    console.error('Something went wrong', error);
    connection.query('ROLLBACK');
    res.status(500).send('Something went wrong');
  }
});

router.post('/logouttime', async (req, res) => {
  try {
    const logs = 'CREATE TABLE IF NOT EXISTS logouts (empId VARCHAR(255), date DATE, logout TIME, isLoggedIn VARCHAR(255), logoutDes VARCHAR(255))';
    connection.query(logs);

    const { empId } = req.body;

    const currentDate = new Date();
    const formattedLogoutTime = currentDate.toTimeString().slice(0, 8);

    let isLoggedIn, logoutDes = '';
    if (currentDate.getHours() === 18 && currentDate.getMinutes() >= 0 && currentDate.getSeconds() >= 0) {
      isLoggedIn = false;
      logoutDes = 'Done for Today'
    } else if (currentDate.getHours() < 18|| (currentDate.getHours() === 18 && (currentDate.getMinutes() < 0 || currentDate.getSeconds() < 0))) {
      isLoggedIn = true;
      logoutDes = 'Early Exit';
    } else {
      isLoggedIn = false;
      logoutDes = 'Absent';
    }

    const formattedDate = currentDate.toISOString().split('T')[0];

    const query = 'INSERT INTO logouts (empId, date, logout, isLoggedIn, logoutDes) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [empId, formattedDate, formattedLogoutTime, isLoggedIn.toString(), logoutDes]);
    connection.query('COMMIT');
    res.status(201).send('Logged out successfully');

  } catch (error) {
    console.error('Something went wrong', error);
    connection.query('ROLLBACK');
    res.status(500).send('Something went wrong');
  }
});

// router.get('/emplogs/:id', async (req, res) => {
//   const id = req.params.id;
//   const logins = 'SELECT * FROM logins WHERE empId = ?';
//   const logouts = 'SELECT * FROM logouts WHERE empId = ?';
//   const results = await connection.query(logins, [id], logouts, [id]);
//   res.send(results);
// });

router.get('/emplogs/:id', async (req, res) => {
  const id = req.params.id;
  const logins = 'SELECT * FROM logins WHERE empId = ?';
  const logouts = 'SELECT * FROM logouts WHERE empId = ?';
  const [loginResults] = await connection.query(logins, [id]);
  const [logoutResults] = await connection.query(logouts, [id]);

  const empLogs = {
    empId: id,
    logins: loginResults,
    logouts: logoutResults
  };

  res.send(empLogs);
});

// emp- routes

router.post('/viewEmp', async (req, res) => {
  const query = "SELECT * FROM employee"
  const dataEmp = await connection.query(query)
  res.send(dataEmp[0])
})
router.post('/exist/:email', async (req, res) => {
  const email = req.params.email
  const query = "SELECT * FROM employee WHERE email = ?"
  const data = await connection.query(query, [email])
  res.send(data[0].length > 0)
})

router.post('/viewEmp/:id', async (req, res) => {
  const empId = req.params.id
  const query = "SELECT * FROM employee WHERE empId = ?"
  const data = await connection.query(query, [empId])
  res.send(data)
})

router.post('/updateEmp/:id', async (req, res) => {
  const id = req.params.id
  const query1 = "SELECT * FROM employee WHERE empId = ?"
  const existId = await connection.query(query1, [id])
  console.log(id)
  if(existId[0].length){
    const Name = req.body.editName
    const email = req.body.editemail
    const phone = req.body.editphone
    const role = req.body.editrole
    
    const query = "UPDATE employee SET Name = ?, email = ?, phone = ?, role = ? WHERE empId = ?"
    const updatedData = await connection.query(query, [Name, email, phone, role, id])
    const existId = await connection.query(query1, [id])
    if(updatedData[0].affectedRows) {
      console.log(existId)
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
