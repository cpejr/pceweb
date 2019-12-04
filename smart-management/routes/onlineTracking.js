const express = require('express');
const firebase = require('firebase');
const Device = require('../models/devices');
const Client = require('../models/clients');
const Station = require('../models/station');
const Manager = require('../models/manager');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('manager/onlineTrackingHome', { title: 'Acompanhamento Online', layout: 'layoutdashboardmanager' });
});

router.get('/user/:id', (req, res) => {
  Station.getById(req.params.id).then((stations) => {
    res.render('manager/onlineTrackingUser', { title: 'Acompanhamento Online', layout: 'layoutdashboardmanager', stations });
  });
});

router.get('/signup', function(req, res, next) {
  res.render('manager/', { title: '' });
});

router.get('/list', (req, res) => {
  console.log(req.session);
  const manager = req.session;
  Station.getByManager(manager).then((stations) => {
    res.render('manager/onlineTrackingHome', { title: 'Acompanhamento Online', layout: 'layoutdashboardmanager',stations });
  }).catch((error)=> {
    res.redirect('/error');
    console.log(error);
  });
});

router.get('/edit/:id', (req, res) => {
  Station.getById(req.params.id).then((station) => {
    res.render('admin/clientsRegistrationEdit', { title: 'Edição de Perfil', layout: 'layoutdashboardmanager',station });
  });
});

module.exports = router;