const express = require('express');
const adminRoutes = require('./admin');
const appRoutes = require('./app');

const router = express.Router();

router.use('/admin', adminRoutes);

router.use('/', appRoutes);

module.exports = router;