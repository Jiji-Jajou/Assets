const mongoose = require('mongoose');
const Employee = require('../models/employee.model');
const Assignment = require('../models/assignment.model');

const isValidId = (id) => mongoose.isValidObjectId(id);

class EmployeesController {
    static list = async (req, res) => {
        try {
            const employees = await Employee.find().sort({ name: 1 });
            res.status(200).send({ error: false, employees });
        } catch (error) {
            res.status(400).send({ error: true, message: error.message });
        }
    };

    static create = async (req, res) => {
        try {
            const { name, email, department, title } = req.body;
            if (!name || !email) {
                throw new Error('Missing required fields: name, email');
            }

            const exists = await Employee.findOne({ email });
            if (exists) {
                throw new Error('Email already used');
            }

            const employee = await Employee.create({ name, email, department, title });
            res.status(201).send({ error: false, employee });
        } catch (error) {
            res.status(400).send({ error: true, message: error.message });
        }
    };

    static getById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                throw new Error('Invalid employee id');
            }

            const employee = await Employee.findById(id);
            if (!employee) {
                return res.status(404).send({ error: true, message: 'Employee not found' });
            }

            res.status(200).send({ error: false, employee });
        } catch (error) {
            res.status(400).send({ error: true, message: error.message });
        }
    };

    static update = async (req, res) => {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                throw new Error('Invalid employee id');
            }

            const { name, email, department, title } = req.body;
            const update = { name, email, department, title };
            Object.keys(update).forEach((key) => update[key] === undefined && delete update[key]);

            if (email) {
                const existing = await Employee.findOne({ email, _id: { $ne: id } });
                if (existing) {
                    throw new Error('Email already used');
                }
            }

            const employee = await Employee.findByIdAndUpdate(id, update, { new: true });
            if (!employee) {
                return res.status(404).send({ error: true, message: 'Employee not found' });
            }

            res.status(200).send({ error: false, employee });
        } catch (error) {
            res.status(400).send({ error: true, message: error.message });
        }
    };

    static remove = async (req, res) => {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                throw new Error('Invalid employee id');
            }

            const activeAssignment = await Assignment.findOne({ employee: id, status: 'active' });
            if (activeAssignment) {
                throw new Error('Employee has active assignment');
            }

            const employee = await Employee.findByIdAndDelete(id);
            if (!employee) {
                return res.status(404).send({ error: true, message: 'Employee not found' });
            }

            res.status(200).send({ error: false, employee });
        } catch (error) {
            res.status(400).send({ error: true, message: error.message });
        }
    };
}

module.exports = EmployeesController;
