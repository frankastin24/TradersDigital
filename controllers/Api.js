import Trader from '../models/Trader';
const argon2 = require('argon2');
class Api {
    async createUser(request, context) {

        const foundEmail = Trader.findOne({
            where: {
                email: request.email
            }
        })

        if (foundEmail) {
            return context.res.json({ error: true, message: 'Email address allready registered, Please login.' })
        }

        const options = {
            type: argon2.argon2id,   // Argon2id recommended
            timeCost: 2,             // iterations (increase as you benchmark)
            memoryCost: 19 * 1024,   // 19 MiB expressed in KiB (OWASP minimum); tune upward
            parallelism: 1,
            // saltLength: 16,       // lib generates a random salt automatically
        };

        const hash = await argon2.hash(request.password, options);

        Trader.build({
            email: request.email,
            password: hash,
            regComplete : false
        })

    }
}