const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, unique: true },
        department: { type: String, trim: true },
        title: { type: String, trim: true },
    },
    { timestamps: true }
);

const Employee = mongoose.model('employee', EmployeeSchema);

module.exports = Employee;
