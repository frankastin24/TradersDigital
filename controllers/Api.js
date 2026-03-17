const context = require('../fuseo/context');
const Trader = require('../models/Trader');
const argon2 = require('argon2');
class Api {
    static async createUser(request, context) {

        const foundTrader = await Trader.findOne({
            where: {
                email: request.email
            }
        })

        if (foundTrader) {
            context.session.userId = foundTrader.id;
            context.session.passEntered = false;
            return context.res.json({ alreadyRegistered: true })
        }

        const newTrader = Trader.build({
            email: request.email,
            regComplete: false,
            package: request.package,
            billing: request.billing
        })

        newTrader.save();

        context.session.userId = newTrader.id;

        return context.res.json({ alreadyRegistered: false })

    }

    static async setPassword(request, context) {
        const currentTrader = await Trader.findByPk(context.session.userId);
       
        if (currentTrader.password) {

            const verify = await argon2.verify(currentTrader.password, request.password);
            if (verify) {

                context.res.json({ passwordIncorrect: false, regComplete: currentTrader.regComplete, trader: currentTrader });

            } else {

                context.res.json({ passwordIncorrect: true })

            }
        } else {

            const options = {
                type: argon2.argon2id,   // Argon2id recommended
                timeCost: 2,             // iterations (increase as you benchmark)
                memoryCost: 19 * 1024,   // 19 MiB expressed in KiB (OWASP minimum); tune upward
                parallelism: 1,
                // saltLength: 16,       // lib generates a random salt automatically
            };
            const hash = await argon2.hash(request.password, options);

            currentTrader.password = hash;
            currentTrader.save();
            context.session.passEntered = true;

            context.res.json({ passwordSet: true })

        }

    }

    static async setTrade() {
        const currentTrader = Trader.findByPk(context.session.userId);
        currentTrader.trade = request.trade;
        currentTrader.save()
        return context.res.send('success')
    }

    static async setName() {
        const currentTrader = Trader.findByPk(context.session.userId);
        currentTrader.businessName = request.businessName;
        currentTrader.save()
        return context.res.send('success')
    }

    static async setDetails() {
        const currentTrader = Trader.findByPk(context.session.userId);
        currentTrader.city = request.city;
        currentTrader.phoneNumber = request.phoneNumber;
        currentTrader.save()
        return context.res.send('success')
    }

    static async setAbout() {
        const currentTrader = Trader.findByPk(context.session.userId);
        currentTrader.about = request.about;
        currentTrader.save()
        return context.res.send('success')
    }

    static async deleteUser(request, context) {

        await Trader.destroy({
            where: {
                id: request.id
            }
        });

        return context.res.send('success')

    }
}

module.exports = Api;