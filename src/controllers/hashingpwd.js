const bcrypt = require('bcrypt');
exports.hash  = () =>{
    bcrypt.hash('Natacha', 10).then(function(hash) {
        console.log(hash)
    });
}