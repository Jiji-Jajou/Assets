const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        type: {
            type: String,
            required: true,
            enum: ['laptop', 'desktop', 'phone', 'tablet', 'monitor', 'other'],
        },
        serialNumber: { type: String, required: true, trim: true, unique: true },
        status: {
            type: String,
            enum: ['available', 'assigned', 'retired'],
            default: 'available',
        },
        notes: { type: String, trim: true },
    },
    { timestamps: true }
);

const Asset = mongoose.model('asset', AssetSchema);

module.exports = Asset;
