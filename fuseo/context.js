module.exports = (req, res, next) => {
    req.context = {
        req,                   // original request object
        res,                   // original response object
        session: req.session,  // session object from express-session or similar
        user: req.user,        // user, if using authentication
        post: null,            // initialize as needed
        // add more per-request data as necessary
    };
    next();
};