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
        console.log('[router] incoming', context.req.method, reqPath);
        
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

        console.log('[router] matched route:', matched ? matched.route : null);
        console.log('[router] routeVariables:', routeVariables);

        // Fallback: direct match with no variables
        if (!matched) {
            matched = routes.find(r => r.route === reqPath);
        }

        if (!matched) {
            return context.res.status(404).json({ error: 'Route not found' });
        }

        // Build request data
        const request = { ...routeVariables, ...context.req.body, ...context.req.query };
       context.request = request;
        // Execute controller method (support async)
        try {
            let result;

            // If a function was registered directly (e.g. TradersDigital.payment)
            if (typeof matched.callable === 'function') {
                result = await matched.callable(request, context);

            // If a string like "Controller.method" was registered, resolve it
            } else if (typeof matched.callable === 'string') {
                const parts = matched.callable.split('.');
                if (parts.length !== 2) {
                    return context.res.status(500).json({ error: 'Invalid callable format' });
                }
                const [className, methodName] = parts;
                // Try requiring from the controllers folder
                const controllerPath = path.join(process.cwd(), 'controllers', `${className}.js`);
                let Controller;
                try {
                    Controller = require(controllerPath);
                } catch (e) {
                    return context.res.status(500).json({ error: `Controller file not found: ${controllerPath}` });
                }

                // Support static method
                if (typeof Controller[methodName] === 'function') {
                    result = await Controller[methodName](request, context);

                // Support instance method
                } else if (Controller.prototype && typeof Controller.prototype[methodName] === 'function') {
                    const instance = new Controller();
                    result = await instance[methodName](request, context);
                } else {
                    return context.res.status(500).json({ error: `Method "${methodName}" not found in "${className}"` });
                }

            } else {
                return context.res.status(500).json({ error: 'Unsupported callable type' });
            }

            // If controller returned something and response not yet sent, send it
            if (!context.res.headersSent && typeof result !== 'undefined') {
                if (Array.isArray(result) || (result && typeof result === 'object')) {
                    return context.res.json(result);
                } else {
                    return context.res.send(result);
                }
            }

            // If controller handled the response itself, just return
            return;
        } catch (err) {
            console.log(err);
            return context.res.status(500).json({ error: err.message || 'Controller execution failed' });
        }
    }
}

module.exports = Router;