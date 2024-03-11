"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        routes: user_routes_1.userRoutes,
    },
];
moduleRoutes.forEach(route => {
    router.use(route.path, route.routes);
});
exports.default = router;
