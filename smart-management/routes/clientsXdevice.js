const express = require('express');
const firebase = require('firebase');
const devices = require('../models/devices');
const clients = require('../models/clients');
const station = require('../models/station');
const router = express.Router();


/* GET clientsXdevice page. */
router.get('/', (req, res) => {
  res.render('clientsXdevice', { title: 'Clientes X  Aparelhos', layout: 'layoutdashboard' });
});

module.exports = router;