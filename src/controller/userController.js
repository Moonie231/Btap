const BaseController = require("./basecontroller");
const qs = require("qs");
const url = require("url");

class UserController extends BaseController {
    static async sqlAddUser(name, email, birthday, phone) {
        let sql = `insert into user (name, email, birthday, phone)
                            values ('${name}', '${email}', '${birthday}', '${phone}')`;
        let request = await BaseController.querySQL(sql);
        return request
    }

    static async addUser(req,res){
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
                let user = qs.parse(data)

                await  this.sqlAddUser(user.name, user.email, user.birthday, user.phone);
                res.writeHead(301, { Location: '/' });
                res.end()
            })
        }
    }

    static async sqlEditUser(ID, name, email, birthday, phone) {
        let sql = `update user set name = '${name}', email = '${email}', birthday = '${birthday}', phone = '${phone}' where ID = '${ID}'`;
        let request = await BaseController.querySQL(sql);
        return request
    }

    static async editUser (req, res) {
        let ID = qs.parse(url.parse(req.url).query).ID;
        if (req.method === 'GET') {
            let user = await BaseController.getUserID(ID)
            let dataHTML = await BaseController.readFile('./view/edit.html')
                dataHTML = dataHTML.replace('valueID', `value = "${ID}"`)
                dataHTML = dataHTML.replace('{id}', ID)
                dataHTML = dataHTML.replace('valueName', `value = "${user[0].name}"`)
                dataHTML = dataHTML.replace('valueEmail', `value = "${user[0].email}"`)
                dataHTML = dataHTML.replace('valueBirthday', `value = "${user[0].birthday}"`)
                dataHTML = dataHTML.replace('valuePhone', `value = "${user[0].phone}"`)
                // res.writeHead(200, 'Content-Type', 'text/html')
            res.writeHead(200, 'Content-Type', 'text/html')
            res.write(dataHTML);
            res.end()
        } else {
            let data ='';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async () => {
                let user = qs.parse(data)
                // let dataHTML = '';
                await this.sqlEditUser(user.name, user.email, user.birthday, user.phone);
                res.writeHead(301, {Location: '/'});
                // res.write(dataHTML)
                res.end()
            })
        }
    }

    static async deleteUser (req, res) {
        let ID = qs.parse(url.parse(req.url).query).ID;
        let sql = BaseController.getUserID(ID)
    }
}

module.exports = UserController