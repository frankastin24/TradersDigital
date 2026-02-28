const path = require('path');

// Initialize global routes if not already
if (!global.__routes) {
    global.__routes = {
        get: [],
        post: [],
        put: [],
        delete: []
    };
}

class Router {
    /**
     * Registers a new route.
     * @param {string} method - HTTP method (get, post, put, delete)
     * @param {string} route - Route pattern, e.g. "/posts/[postId]/comments/[commentId]"
     * @param {string} callable - Controller and method string, e.g. "PostController.getPost"
     */
    static register(method, route, callable) {
        method = method.toLowerCase();
        if (!global.__routes[method]) global.__routes[method] = [];
        // Pre-compile route regex and variable names for performance
        const variableNames = [...route.matchAll(/\[([^\]]+)\]/g)].map(m => m[1]);
        const regex = new RegExp('^' + route.replace(/\[([^\]]+)\]/g, '([^/]+)') + '$');
        global.__routes[method].push({ route, callable, variableNames, regex });
    }

    static get(route, callable)    { this.register('get', route, callable); }
    static post(route, callable)   { this.register('post', route, callable); }
    static put(route, callable)    { this.register('put', route, callable); }
    static delete(route, callable) { this.register('delete', route, callable); }

    /**
     * Executes the matching controller action for the request
     * @param {object} req - Express-like request object
     * @param {object} res - Express-like response object
     */
    static async execute(context) {
        
        let reqPath = context.req.path;
        
        if (reqPath.endsWith('/') && reqPath.length > 1) reqPath = reqPath.slice(0, -1);
        
        if(reqPath.length == 0 ) reqPath = "/";


        let method = context.req.method.toLowerCase();
        // Support _method override in body (for HTML forms etc)
        if (context.req.body && typeof context.req.body._method === 'string') {
            const override = context.req.body._method.toLowerCase();
            if (['delete', 'patch', 'put', 'post', 'get'].includes(override)) method = override;
        }

        const routes = global.__routes[method] || [];

        let matched = null;
        let routeVariables = {};

        // Try matching each route
        for (const routeDef of routes) {
            const match = reqPath.match(routeDef.regex);
            if (match) {
                routeDef.variableNames.forEach((name, i) => {
                    routeVariables[name] = match[i + 1];
                });
                matched = routeDef;
                break;
            }
        }

        // Fallback: direct match with no variables
        if (!matched) {
            matched = routes.find(r => r.route === reqPath);
        }

        if (!matched) {
            return context.res.status(404).json({ error: 'Route not found' });
        }

        // Build request data
        const request = { ...routeVariables, ...context.req.body, ...context.req.query };

        // Parse callable
       
        // Execute controller method (support async)
        try {

            let result;
            
            if (typeof matched.callable === 'function') {
               
                result = await matched.callable(request,context);
            } else if (Controller.prototype && typeof Controller.prototype[methodName] === 'function') {
                const instance = new Controller();
                result = await instance[methodName](request, context);
            } else {
                return res.status(500).json({ error: `Method "${methodName}" not found in "${className}"` });
            }

            // Only send response if not already sent by controller
            // if (!res.headersSent) {
            //     if (Array.isArray(result) || typeof result === 'object') {
            //         return res.json(result);
            //     } else {
            //         return res.send(result);
            //     }
            // }
        } catch (err) {
            console.log(err)
            return context.res.status(500).json({ error: err.message || 'Controller execution failed' });
        }
    }
}

module.exports = Router;