const express = require("express");
const { body, validationResult } = require("express-validator");
const Employee = require("../models/Employee");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * CREATE Employee
 */
router.post(
  "/",
  authMiddleware,
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("role").notEmpty(),
    body("department").notEmpty(),
    body("salary").isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const employee = new Employee(req.body);
      await employee.save();
      res.status(201).json(employee);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * READ All Employees
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * UPDATE Employee
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE Employee
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
