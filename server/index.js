const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();

const port = 8000;
app.use(bodyParser.json());

let users = []
let conn = null

const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8830
  })
}

app.get('/testdb', (req, res) => {
  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8830

  }).then((conn) => {
    conn
    .query('SELECT * FROM users')
    .then((result) => {
      res.json(result[0])

    })
    .catch((error) => {
      console.log('error', error.message)
      res.status(500).json({error: 'Error fetching users'})
    })
  })
})


// app.get('/testdbnew',async (req, res) => {
//   try {

//     const result = await conn.query('SELECT * FROM users')
//     res.json(result[0])

//   } catch (error) {
//     console.log('error', error.message)
//     res.status(500).json({error: 'Error fetching users'})
//   }

// })

/*
GET /users สำหรับ get users ทั้งหมดที่บันทึกไว้
POST /users สำหรับสร้าง users ใหม่บันทึกเข้าไป
PUT /user/:id สำหรับดึง users รายคน (ตาม id ที่บันทึกเข้าไป)
DELETE /user/:id สำหรับลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
*/ 

// path = GET / users สำหรับ get users ทั้งหมดที่บันทึกไว้
app.get('/users', async (req, res) => {
  const result = await conn.query('SELECT * FROM users')
    res.json(result[0])
})

// path = POST / user สำหรับสร้าง users ใหม่บันทึกเข้าไป
app.post('/users', async (req, res) => {
  let user = req.body;
  const results = await conn.query('INSERT INTO users SET ?', user)
  console.log('results', results)
  res.json({
    message: 'Create user successfully',
    data: results[0]
 })
})


 // path = GET / users /: id สำหรับดึง users รายคนออกมา
app.get('/users/:id', (req, res) => { 
   let id = req.params.id;
   // ค้าหา user หรือ index ที่ต้องการดึงข้อมูล
   let selectIndex = users.findIndex(user => user.id == id)
   res.json(users[selectIndex])

});

 // path = PUT /user/:id สำหรับดึง users รายคน (ตาม id ที่บันทึกเข้าไป)
 app.put('/users/:id', (req, res) => {
  let id = req.params.id;
  let updateUser = req.body;
  // ค้าหา user ที่ต้องการแก้ไข
  let selectIndex = users.findIndex(user => user.id == id)// หาอะไรสักอย่างที่อยู่ใน array

    users[selectIndex].firstname = updateUser.firstname || users[selectIndex].firstname
    users[selectIndex].lastname = updateUser.lastname || users[selectIndex].lastname
    users[selectIndex].age = updateUser.age || users[selectIndex].age
    users[selectIndex].gender = updateUser.gender || users[selectIndex].gender

  res.json({
    message: 'Update user successfully',
    data: {
      user: updateUser,
      indexUpdated: selectIndex
    }
  })
 })

 //path = DELETE /users/:id สำหรับลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
 app.delete('/users/:id', (req, res) => {
  let id = req.params.id;
  // หา index ของ user ที่ต้องการลบ
  let selectIndex = users.findIndex(user => user.id == id)

  // ลบ
  users.splice(selectIndex, 1)
  res.json({
    message: 'Delete user successfully',
    indexDeleted: selectIndex
  })
 })

app.listen(port, async (req, res) => {  
  await initMySQL()
  console.log('Http Server is running on port ' + port);
});