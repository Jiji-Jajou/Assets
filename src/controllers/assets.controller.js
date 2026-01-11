const mongoose = require('mongoose');
const Asset = require('../models/asset.model');
const Assignment = require('../models/assignment.model');

const isValidId = (id) => mongoose.isValidObjectId(id);

class AssetsController {
    static list = async (req, res) => {
        try {
            const assets = await Asset.find().sort({ createdAt: -1 });
            res.status(200).send({ error: false, assets });
        } catch (error) {
            res.status(400).send({ error: true, message: error.message });
        }
    };

    static create = async (req, res) => {
        try {
            const { name, type, serialNumber, notes, status } = req.body;
            if (!name || !type || !serialNumber) {
                throw new Error('Missing required fields: name, type, serialNumber');
            }

            const exists = await Asset.findOne({ serialNumber });
            if (exists) {
                throw new Error('Serial number already used');
            }

            const asset = await Asset.create({ name, type, serialNumber, notes, status });
            res.status(201).send({ error: false, asset });
        } catch (error) {
            res.status(400).send({ error: true, message: error.message });
        }
    };

    static getById = async (req, res) => {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                throw new Error('Invalid asset id');
            }

            const asset = await Asset.findById(id);
            if (!asset) {
                return res.status(404).send({ error: true, message: 'Asset not found' });
            }

            res.status(200).send({ error: false, asset });
        } catch (error) {
            res.status(400).send({ error: true, message: error.message });
        }
    };

    static update = async (req, res) => {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                throw new Error('Invalid asset id');
            }

            const { name, type, serialNumber, notes, status } = req.body;
            const update = { name, type, serialNumber, notes, status };
            Object.keys(update).forEach((key) => update[key] === undefined && delete update[key]);

            if (serialNumber) {
                const existing = await Asset.findOne({ serialNumber, _id: { $ne: id } });
                if (existing) {
                    throw new Error('Serial number already used');
                }
            }

            const asset = await Asset.findByIdAndUpdate(id, update, { new: true });
            if (!asset) {
                return res.status(404).send({ error: true, message: 'Asset not found' });
            }

            res.status(200).send({ error: false, asset });
        } catch (error) {
            res.status(400).send({ error: true, message: error.message });
        }
    };

    static remove = async (req, res) => {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                throw new Error('Invalid asset id');
            }

            const activeAssignment = await Assignment.findOne({ asset: id, status: 'active' });
            if (activeAssignment) {
                throw new Error('Asset is assigned');
            }

            const asset = await Asset.findByIdAndDelete(id);
            if (!asset) {
                return res.status(404).send({ error: true, message: 'Asset not found' });
            }

            res.status(200).send({ error: false, asset });
        } catch (error) {
            res.status(400).send({ error: true, message: error.message });
        }
    };
}

module.exports = AssetsController;
