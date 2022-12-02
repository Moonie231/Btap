const http = require('http')
const url = require('url')
const HomeController = require('./src/controller/homecontroller')
const StudentController  = require('./src/controller/StudentController')
const qs = require("qs");


const server =http.createServer((req,res)=>{
    let urlPath = req.url
    let ID = qs.parse(url.parse(req.url).query).ID;

    switch (urlPath){
        case "/":
            HomeController.showList(req,res)
            break;
        case "/add":
            StudentController.addStudent(req, res)
            break;
        case `/edit?ID=${ID}`:
            StudentController.editStudent(req,res)
            break;
        case `/delete?ID=${ID}`:
            StudentController.deleteStudent(req, res)
            break;
    }
})

server.listen(8000,'localhost',function (){
    console.log('Server is running at port 8000')
})