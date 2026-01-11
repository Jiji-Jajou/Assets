const mongoose = require('mongoose');
const Assignment = require('../models/assignment.model');
const Asset = require('../models/asset.model');
const Employee = require('../models/employee.model');

const isValidId = (id) => mongoose.isValidObjectId(id);

class AssignmentsController {
    static list = async (req, res) => {
        try {
            const assignments = await Assignment.find()
                .populate('asset')
                .populate('employee')
                .sort({ createdAt: -1 });
            res.status(200).send({ error: false, assignments });
        } catch (error) {
            res.status(400).send({ error: true, message: error.message });
        }
    };

    static create = async (req, res) => {
        try {
            const { assetId, employeeId } = req.body;
            if (!assetId || !employeeId) {
                throw new Error('Missing required fields: assetId, employeeId');
            }
            if (!isValidId(assetId) || !isValidId(employeeId)) {
                throw new Error('Invalid asset or employee id');
            }

            const asset = await Asset.findById(assetId);
            if (!asset) {
                throw new Error('Asset not found');
            }
            if (asset.status !== 'available') {
                throw new Error('Asset not available');
            }

            const employee = await Employee.findById(employeeId);
            if (!employee) {
                throw new Error('Employee not found');
            }

            const assignment = await Assignment.create({
                asset: assetId,
                employee: employeeId,
                status: 'active',
            });

            asset.status = 'assigned';
            await asset.save();

            const populated = await Assignment.findById(assignment._id)
                .populate('asset')
                .populate('employee');

            res.status(201).send({ error: false, assignment: populated });
        } catch (error) {
            res.status(400).send({ error: true, message: error.message });
        }
    };

    static returnAssignment = async (req, res) => {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                throw new Error('Invalid assignment id');
            }

            const assignment = await Assignment.findById(id);
            if (!assignment) {
                return res.status(404).send({ error: true, message: 'Assignment not found' });
            }
            if (assignment.status === 'returned') {
                throw new Error('Assignment already returned');
            }

            assignment.status = 'returned';
            assignment.returnedAt = new Date();
            await assignment.save();

            await Asset.findByIdAndUpdate(assignment.asset, { status: 'available' });

            const populated = await Assignment.findById(assignment._id)
                .populate('asset')
                .populate('employee');

            res.status(200).send({ error: false, assignment: populated });
        } catch (error) {
            res.status(400).send({ error: true, message: error.message });
        }
    };
}

module.exports = AssignmentsController;
