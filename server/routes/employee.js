const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authenticate");

const { getAllEmployeesController,createEmployeeIdCardController, getMyEmployeeIdCard, createEmployeeOfferLetterController, getMyEmployeeOfferLetter, searchEmployeeByUniqueIdController, deleteEmployeeController } = require("../controller/employeeController");

router.get("/getallemployees", getAllEmployeesController);
router.post("/createemployeeidcard", createEmployeeIdCardController);
router.get("/employeeidcard/me", authenticateUser, getMyEmployeeIdCard);
router.post("/createemployeeofferletter", createEmployeeOfferLetterController);
router.get("/employeeofferletter/me", authenticateUser, getMyEmployeeOfferLetter);
router.get('/searchemployee', searchEmployeeByUniqueIdController);
router.delete('/employees/:uniqueId', deleteEmployeeController);

module.exports = router;
