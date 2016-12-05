var roles = [
    {
        name: "guest",
        permissions: [
            {
                resource: "dish",
                allowedMethods: ['GET']
            }
        ]
    }//,
    // {
    //     name: "admin",
    //     permissions: [
    //         {
    //             resource: "products",
    //             allowedMethods: ['*']
    //         },
    //         {
    //             resource: "orders",
    //             allowedMethods: ['*']
    //         }
    //     ]
    // }
];

var allowedResources = ["login", "logout", 'favicon.ico'];

module.exports = function (req, res, next) {
    var resource = req.path.split("/").filter(function (p) {
        return p != '';
    })[0];
    if (allowedResources.indexOf(resource) != -1) {
        next();
        return;
    }
    var role = roles.filter(function (r) {
        if (req.session.user) {
            return r.name == 'admin';
        }
        return r.name == 'guest';
    })[0];
    var allowedMethods = role.permissions.filter(function (p) {
        return p.resource == resource;
    })[0].allowedMethods;
    var method = req.method;
    if (allowedMethods.indexOf('*') != -1 || allowedMethods.indexOf(method) != -1) {
        next();
    } else {
        res.sendStatus(403);
    }
};