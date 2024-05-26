const fs = require('fs');
const { createHashedPassword, verifyPassword } = require('./userPass')

module.exports = {

  createId : async (id, pass) =>  {
    let next = 0;
    if (fs.existsSync('./data/user/0.json')) {
      let dir = fs.readdirSync('./data/user').sort((a, b) => {
        let ia = a.split(".")[0] / 1;
        let ib = b.split(".")[0] / 1;
        return ib - ia;
      });
      next = (dir[0].split(".")[0] / 1 + 1);
    }
    
   
    let userId = fs.readdirSync('./data/user').map(p=>JSON.parse(fs.readFileSync('./data/user/'+p))).find(p=>p.id==id);
    let user = {};
    console.log(userId)
    if (userId) {
      return false;
    } else {
      let userPass = await createHashedPassword(pass);
      user.id = id;
      user.pass = userPass.hashedPassword;
      user.salt = userPass.salt;
    }
    fs.writeFileSync('./data/user/' + next + '.json', JSON.stringify(user), 'utf-8');
    return next;
  },
  checkPass : (id, pass) => {
    let user = fs.readdirSync('./data/user').map(p=>JSON.parse(fs.readFileSync('./data/user/'+p))).find(p=>p.id==id);
    if (user) {
      return verifyPassword(pass, user.salt, user.pass)
    } else {
      return verifyPassword('1','2','3');
    }
  }
}