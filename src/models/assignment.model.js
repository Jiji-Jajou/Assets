const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema(
    {
        asset: { type: mongoose.Schema.Types.ObjectId, ref: 'asset', required: true },
        employee: { type: mongoose.Schema.Types.ObjectId, ref: 'employee', required: true },
        assignedAt: { type: Date, default: Date.now },
        returnedAt: { type: Date },
        status: { type: String, enum: ['active', 'returned'], default: 'active' },
    },
    { timestamps: true }
);

const Assignment = mongoose.model('assignment', AssignmentSchema);

module.exports = Assignment;
