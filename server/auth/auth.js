var roles = [
    {
        name: "guest",
        permissions: [
            {
                resource: "dish",
                allowedMethods: ['GET']
            },
            {
                resource: "details",
                allowedMethods: ['GET']
            },
            {
                resource: "dish-w-details",
                allowedMethods: []
            },
            {
                resource: "dish-all",
                allowedMethods: []
            },
            {
                resource: "categories",
                allowedMethods: ['GET']
            },
            {
                resource: "reservations",
                allowedMethods: ['*']
            },
            {
                resource: "comments",
                allowedMethods: ['GET', 'POST']
            },
            {
                resource: "init",
                allowedMethods: ['GET', 'POST']
            },
            {
                resource: "initUser",
                allowedMethods: ['GET', 'POST']
            },
            {
                resource: "reset",
                allowedMethods: ['GET', 'POST']
            }
        ]
    },
    {
        name: "admin",
        permissions: [
            {
                resource: "dish-all",
                allowedMethods: ['*']
            },
            {
                resource: "dish-w-details",
                allowedMethods: ['*']
            },
            {
                resource: "dish",
                allowedMethods: ['*']
            },
            {
                resource: "details",
                allowedMethods: ['*']
            },
            {
                resource: "categories",
                allowedMethods: ['*']
            },
            {
                resource: "reservations",
                allowedMethods: ['*']
            },
            {
                resource: "comments",
                allowedMethods: ['*']
            },
            {
                resource: "init",
                allowedMethods: ['*']
            },
            {
                resource: "initUser",
                allowedMethods: ['*']
            },
            {
                resource: "reset",
                allowedMethods: ['*']
            },
            {
                resource: "init",
                allowedMethods: ['GET', 'POST']
            },
            {
                resource: "initUser",
                allowedMethods: ['GET', 'POST']
            },
            {
                resource: "reset",
                allowedMethods: ['GET', 'POST']
            }
        ]
    }
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