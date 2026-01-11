const express = require('express');
const employeesController = require('../controllers/employees.controller');
const assetsController = require('../controllers/assets.controller');
const assignmentsController = require('../controllers/assignments.controller');

const routerIndex = express.Router();

routerIndex.get('/api/health', (req, res) => {
    res.status(200).send({ ok: true });
});

routerIndex.get('/api/employees', employeesController.list);
routerIndex.post('/api/employees', employeesController.create);
routerIndex.get('/api/employees/:id', employeesController.getById);
routerIndex.put('/api/employees/:id', employeesController.update);
routerIndex.delete('/api/employees/:id', employeesController.remove);

routerIndex.get('/api/assets', assetsController.list);
routerIndex.post('/api/assets', assetsController.create);
routerIndex.get('/api/assets/:id', assetsController.getById);
routerIndex.put('/api/assets/:id', assetsController.update);
routerIndex.delete('/api/assets/:id', assetsController.remove);

routerIndex.get('/api/assignments', assignmentsController.list);
routerIndex.post('/api/assignments', assignmentsController.create);
routerIndex.post('/api/assignments/:id/return', assignmentsController.returnAssignment);

module.exports = routerIndex;
