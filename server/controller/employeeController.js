const {
  createEmployeeIdCardService,
  fetchEmployeeIdCard,
  getAllEmployeesWithStatuses,
  createEmployeeOfferLetterService,
  fetchEmployeeOfferLetter,
  getEmployeeByUniqueIdService,
  deleteEmployeeService
} = require("../service/employeeService");
const User = require("../models/User");

const getAllEmployeesController = async (req, res) => {
  try {
    const employees = await getAllEmployeesWithStatuses();
    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const createEmployeeIdCardController = async (req, res) => {
  try {
    const { profilePhoto, name, email, address, uniqueId, subRole, pincode, mobileNumber } = req.body;

    if (!name || !email || !address || !uniqueId || !subRole || !pincode || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, address, uniqueId, subRole, pincode, mobileNumber) are required.",
      });
    }

    const newCard = await createEmployeeIdCardService({
      profilePhoto,
      name,
      email,
      address,
      uniqueId,
      subRole,
      pincode,
      mobileNumber,
    });

    res.status(201).json({
      success: true,
      message: "Employee ID card created successfully.",
      data: newCard,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create employee ID card.",
      error: error.message,
    });
  }
};

// ✅ Controller to get current logged-in employee's ID card
const getMyEmployeeIdCard = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing in token" });
    }

    const user = await User.findById(userId);
    if (!user || !user.email) {
      return res.status(404).json({ message: "User not found or missing email" });
    }

    const card = await fetchEmployeeIdCard(user.email);

    if (!card) {
      return res.status(404).json({
        success: false,
        pending: true,
        message: "ID card not found for this user"
      });
    }

    res.status(200).json({ success: true, data: card });

  } catch (error) {
    console.error("Error fetching employee ID card:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



const createEmployeeOfferLetterController = async (req, res) => {
  try {
    const { _id, name, uniqueId, email, address, subRole, pincode, ctc, joiningDate } = req.body;

    if (!_id || !name || !uniqueId || !email || !address || !subRole || !pincode || !ctc || !joiningDate ) {
      return res.status(400).json({
        success: false,
        message: "All fields (_id, name, email, address, subRole, pincode, ctc, joiningDate) are required.",
      });
    }

    const newOL = await createEmployeeOfferLetterService({
      userId: _id,
      name,
      uniqueId,
      email,
      address,
      subRole,
      pincode,
      ctc,
      joiningDate
    });

    res.status(201).json({
      success: true,
      message: "Employee Offer Letter created successfully.",
      data: newOL,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create employee Offer Letter.",
      error: error.message,
    });
  }
};





const getMyEmployeeOfferLetter = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing in token" });
    }

    const user = await User.findById(userId);
    if (!user || !user.email) {
      return res.status(404).json({ message: "User not found or missing email" });
    }

    const card = await fetchEmployeeOfferLetter(user.email);

    if (!card) {
      return res.status(404).json({
        success: false,
        pending: true,
        message: "Offer Letter not found for this user"
      });
    }

    res.status(200).json({ success: true, data: card });

  } catch (error) {
    console.error("Error fetching Employee Offer Letter:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};





const searchEmployeeByUniqueIdController = async (req, res) => {
    try {
        const { uniqueId } = req.query;

        if (!uniqueId) {
        return res.status(400).json({ error: 'uniqueId is required' });
        }

        const employee = await getEmployeeByUniqueIdService(uniqueId);

        if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




const deleteEmployeeController = async (req, res) => {
    try {
        const { uniqueId } = req.params;

        const deleted = await deleteEmployeeService(uniqueId);

        res.status(200).json({
        message: 'Employee deleted successfully',
        intern: deleted,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
        message: error.message || 'Server error while deleting employee',
        });
    }
};




module.exports = {
  createEmployeeIdCardController,
  getAllEmployeesController,
  getMyEmployeeIdCard,
  createEmployeeOfferLetterController,
  getMyEmployeeOfferLetter,
  searchEmployeeByUniqueIdController,
  deleteEmployeeController
};
