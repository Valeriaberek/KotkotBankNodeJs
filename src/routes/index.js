const adminController = require ('../controllers/adminController');
const clientController = require ('../controllers/clientController');
const pagesController = require ('../controllers/pagesController');
const hash = require ('../controllers/hashingpwd');

exports.appRoute = router =>{

    //---GET ROUTES
    router.get("/", pagesController.displayHome);
    router.get("/connexForm", isAuthenticated, pagesController.displayConnexForm);
    router.get("/connexFormAdmin", isAuthenticated, pagesController.displayConnexFormAdmin);
    router.get("/registerForm", pagesController.displayRegisterForm);
    router.get("/hash", hash.hash); //route for hashing pwd /!\ need to be deleted /!\
    router.get("/virementForm", pagesController.displayVirementForm);
    router.get("/logout", clientController.logOutClient);
    router.get("/dashboard", pagesController.displayDashBoard);
    router.get("/dashboardAdmin", pagesController.displayDashBoardAdmin);
    router.get("/infosClient", pagesController.displayInfosClient);

    //---POST ROUTES
    router.post("/formModifyUser", pagesController.displayFormModifyUser);
    router.post("/connexClient", clientController.displayDashBoard);
    router.post("/connexAdmin", adminController.displayDashBoardAdmin);
    router.post("/addOperation", clientController.addOperation);
    router.post("/addClient", clientController.addClient);
    router.post("/modifyInfosByClient", clientController.modifyClient);

    //---GET ADMIN ROUTE
    router.get("/menuClients", pagesController.displayMenuClient);
    router.get("/menuComptes", pagesController.displayMenuComptes);
    router.get("/menuOperations", pagesController.displayMenuOperations);

    //---POST ADMIN ROUTE
    router.post("/modifyClient", adminController.modifyClient);
    router.post("/deleteClient", adminController.deleteClient);
   
}

function isAuthenticated (req, res, next) {
    if (req.session.isAdmin === undefined){ 

        next()}
    else if(req.session.isAdmin === true){
        res.redirect('/dashboardAdmin')
    } else {
        res.redirect('/dashboard')
    }
}