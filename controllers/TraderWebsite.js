import Website from '../models/Website.js';
import Trader from '../models/Trader.js';
import { view } from '../fuseo/view.js';

class TraderWebsite {

    static async getWebsiteTrader(url,context) {

        const website = await Website.findOne({
            where: {
                url
            }
        });

        const trader = await Trader.findByPk(website?.traderId);

        if (!website) {
            return context.res.status(404).send('<h1>404 - Website Not Found</h1>');
        }
        
        return { trader, website };
    }
 
    static async home(request, context) {

        const url = request.url;

        const { trader, website } = await TraderWebsite.getWebsiteTrader(url, context   );

        return view(`templates/${website.template}/home`, { trader, website }, context);

    }

    static async about(request, context) {

        const url = request.url;

        const { trader, website } = await TraderWebsite.getWebsiteTrader(url, context);

        return view(`templates/${website.template}/about`, { trader, website }, context);

    }

    static async services(request, context) {

        const url = request.url;

        const { trader, website } = await TraderWebsite.getWebsiteTrader(url, context);

        return view(`templates/${website.template}/services`, { trader, website }, context);

    }

    static async contact(request, context) {

        const url = request.url;

        const { trader, website } = await TraderWebsite.getWebsiteTrader(url, context);

        return view(`templates/${website.template}/contact`, { trader, website }, context);

    }

}

export default TraderWebsite;