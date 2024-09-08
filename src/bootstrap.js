// import the riutes module
route = require("./routes")
// exports the module
module.exports = (app, router) =>{
    route.appRoute(router);
}