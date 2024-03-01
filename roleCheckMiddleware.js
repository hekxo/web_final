function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    req.flash('error_msg', 'You do not have permission to view this resource');
    res.redirect('/users/login');
}

function isRegularUser(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'regular') {
        return next();
    }
    req.flash('error_msg', 'You do not have permission to view this resource');
    res.redirect('/users/login');
}

module.exports = {
    isAdmin,
    isRegularUser
};
