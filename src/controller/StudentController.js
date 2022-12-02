const BaseController = require("./basecontroller");
const qs = require("qs");
const url = require("url");

class StudentController extends BaseController {
    static async sqlAddStudent(name, classroom , theoreticalPoint,successPoint, evaluate, description) {
        let sql = `insert into Student (name, classroom, theoreticalPoint,successPoint, evaluate, description)
                            values ('${name}', '${classroom}', '${theoreticalPoint}', '${successPoint}', '${evaluate}', '${description}')`;
        let request = await BaseController.querySQL(sql);
        return request
    }

    static async addStudent(req,res){
        if (req.method === 'GET') {
            let dataHTML = await BaseController.readFile('./view/add.html');
            res.write(dataHTML);
            res.end()
        } else {
            let data ='';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async () => {
                let student = qs.parse(data)
                console.log(student)
                await  this.sqlAddStudent(student.name, student.classroom, student.theoreticalPoint, student.successPoint, student.evaluate, student.description);
                res.writeHead(301, { Location: '/' });
                res.end()
            })
        }
    }

    static async sqlEditStudent(ID,name, classroom , theoreticalPoint,successPoint, evaluate, description) {
        let sql = `update Student set name = '${name}', classroom = '${classroom}',theoreticalPoint = '${theoreticalPoint}',successPoint = '${successPoint}', evaluate ='${evaluate}',description = '${description}' where ID = '${ID}'`;
        let request = await BaseController.querySQL(sql);
        return request
    }

    static async editStudent (req, res) {
        let ID = qs.parse(url.parse(req.url).query).ID;
        if (req.method === 'GET') {
            let student = await BaseController.getStudentID(ID)
            let dataHTML = await BaseController.readFile('./view/edit.html')
                dataHTML = dataHTML.replace('valueID', `value = "${ID}"`)
                dataHTML = dataHTML.replace('{id}', ID)
                dataHTML = dataHTML.replace('valueName', `value = "${student[0].name}"`)
                dataHTML = dataHTML.replace('valueClassroom', `value = "${student[0].classroom}"`)
                dataHTML = dataHTML.replace('valueTheoreticalPoint', `value = "${student[0].theoreticalPoint}"`)
                dataHTML = dataHTML.replace('valueSuccessPoint', `value = "${student[0].successPoint}"`)
                dataHTML = dataHTML.replace('valueEvaluate', `value = "${student[0].evaluate}"`)
                dataHTML = dataHTML.replace('valueDescription', `value = "${student[0].description}"`)
                // res.writeHead(200, 'Content-Type', 'text/html')
            res.writeHead(200, 'Content-Type', 'text/html')
            res.write(dataHTML);
            res.end()
        } else {
            let data ='';
            req.on('data', chunk => {
                data += chunk;
                console.log(data)
            })
            req.on('end', async () => {
                let student = qs.parse(data)
                // let dataHTML = '';
                await this.sqlEditStudent(student.name, student.classroom, student.theoreticalpoint, student.successpoint, student.evaluate, student.description);
                res.writeHead(301, {Location: '/'});
                // res.write(dataHTML)
                res.end()
            })
        }
    }
    static async sqlDeleteStudent(ID) {
        let sql = `delete from students where id = ${ID}`
        let result=await BaseController.querySQL(sql);
        return result
    }

    static async deleteStudent (req, res) {
        let parseUrl = url.parse(req.url, true);
        let path = parseUrl.query;
        let index = qs.parse(path);
        let id=+index.id;
        let sql = `delete from student where ID = ${id}`;
        let result=await this.querySQL(sql);
        res.writeHead(301, {Location:'/'});
        res.end();
    }
}

module.exports = StudentController