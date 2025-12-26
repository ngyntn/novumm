const express = require('express');
const userRoute = require('./user.route');
const reportRoute = require('./report.route');
const appealRoute = require('./appeal.route');
const dashboardRoute = require('./dashboard.route');

const router = express.Router();

const adminRoutes = [
    {
        path: '/dashboard',
        route: dashboardRoute,
    },
    {
        path: '/users',
        route: userRoute,
    },
    {
        path: '/reports',
        route: reportRoute,
    },
    {
        path: '/appeals',
        route: appealRoute,
    },
];

adminRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;