import OpenAI from 'openai';
import Website from '../models/Website.js';
import Trader from '../models/Trader.js';

class GenerateWebsite {
    static async create(request, context) {
        const currentTrader = await Trader.findByPk(context.session.userId);

        if (!currentTrader) {
            return context.res.status(404).json({ error: 'Trader not found' });
        }

        if (!currentTrader.trade || !currentTrader.businessName) {
            return context.res.status(400).json({ error: 'Missing required trader profile fields' });
        }
        
        const newWebsite = await Website.create({
            traderId: currentTrader.id,
            template: currentTrader.trade.replace(/\s+/g, '-').toLowerCase(),
            aboutUs : '',
        });

        let url = `${currentTrader.businessName.replace(/\s+/g, '-').toLowerCase()}`;

        const checkUrlExists = await Website.findOne({
            where : {
                url
            }
        })
        
        if(checkUrlExists) {
              url = `${url}-${(currentTrader.city || 'site').replace(/\s+/g, '-').toLowerCase()}`;
        }

        newWebsite.url = url;
        

        const client = new OpenAI({
            apiKey: global.__env.OPENAI_API_KEY
        });

        const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: `Rewrite this into a professional About Us section:${currentTrader.trade} with ${currentTrader.experience} years of experience. Covering the following areas ${currentTrader.areas}`,
        });

        newWebsite.aboutUs = response.output_text || 'Trusted local trade professionals delivering reliable service.';

        await newWebsite.save();

        return context.res.json({ url: newWebsite.url });

    }
}

export default GenerateWebsite;