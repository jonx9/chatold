const router = require('express').Router();
const UserController = require('../../controller/userController');

router.get('/', UserController.getUsers);
router.post('/create', UserController.PostCreate);
router.get('/create', UserController.Create);


module.exports = router;