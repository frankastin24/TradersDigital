import OpenAI from "openai";

class GenerateWebsite {
    static async index(request, context) {
        

        return view('main_site/website_loader', {}, context);
    }

    static async create(request, context) {
        
       

        const Trader = require('../models/Trader.js');

        const currentTrader = await Trader.findByPk(context.session.userId);
        
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
           url = `${url}-${currentTrader.city.replace(/\s+/g, '-').toLowerCase()}}`;
        }

        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });

        const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: `Rewrite this into a professional About Us section:${currentTrader.trade} with ${currentTrader.experience} years of experience. Covering the following areas ${currentTrader.areas}`,
        });

    }
}

module.exports = GenerateWebsite;