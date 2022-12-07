const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/', userController.homePageGet);
router.post('/addressID/:customer_id', userController.updateAddressId);
router.get('/addCustomer', userController.addCustomerGet);
router.post('/addCustomer', userController.addCustomerPost);
router.get('/:customer_id', userController.customerUpdateGet);
router.post('/:customer_id', userController.customerUpdatePost);
router.get('/delete/:customer_id', userController.deleteCustomer);


module.exports = router;