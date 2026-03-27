import { view } from '../fuseo/view.js';
import Stripe from 'stripe';
import Trader from '../models/Trader.js';

const stripe = new Stripe(global.__env.STRIPE_SECRET_KEY);

class TradersDigital {

    static home(request, context) {
        return view('main_site/home', {}, context);
    }

    static signup(request, context) {
        return view('main_site/sign_up', {pageTitle:'Sign Up - Tradeely'}, context);
    }

    static payment(request, context) {
        return view('main_site/payment', {pageTitle:'Payment - Tradeely'}, context);
    }

    static buildSite(request, context) {
        return view('main_site/website_loader', {pageTitle:'Creating Your Website - Tradeely'}, context);
    }

    static dashboard(request, context) {
        return view('trader/dashboard', {pageTitle:'Dashboard - Tradeely'}, context);
    }

    static async super(request,context) {
        if (!global.__env.ADMIN_KEY || request.key !== global.__env.ADMIN_KEY) {
            return context.res.status(403).send('Forbidden');
        }

        const traders = await Trader.findAll();
        
        return view('/super_admin/index', {traders},context);
    }

    static async clientSecret(request, context) {

        // Optional: send these from the browser if you have them

        const prices = {
            professional : {
                monthly : 'price_1T6RtZPuXCZnYldcuCHgGuNg',
                annually : 'price_1T6RrvPuXCZnYldcunZy6T55',
            },
            basic : {
                monthly : 'price_1T6RwEPuXCZnYldc2qOwOzsJ',
                annually: 'price_1T6RvOPuXCZnYldcoPanEdyg'
            }
        }
    

        const plan = request.plan;
        const interval = request.interval;

        if (!prices[plan] || !prices[plan][interval]) {
            return context.res.status(400).json({ error: 'Invalid plan or interval' });
        }

        if (!context.session?.userId) {
            return context.res.status(401).json({ error: 'Unauthorized' });
        }

        const currentTrader = context.session?.userId
            ? await Trader.findByPk(context.session.userId)
            : null;

        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',          // ✅ required for embedded checkout
            mode: 'subscription',         // ✅ creates a subscription

            line_items: [
                { price: prices[plan][interval], quantity: 1 },
            ],

            // ✅ 7 day free trial
            subscription_data: {
                trial_period_days: 7,
                metadata: { userId: String(context.session?.userId || '') },
            },

            // Optional: prefill email (creates/uses a Customer)
            customer_email: currentTrader?.email,

            // ✅ embedded checkout uses return_url (not success_url)
            // Stripe will replace {CHECKOUT_SESSION_ID}
            return_url: `${global.__env.APP_URL || 'http://localhost'}/return/?session_id={CHECKOUT_SESSION_ID}`,
        });

        // ✅ This is what initEmbeddedCheckout needs
        return context.res.json({ clientSecret: session.client_secret });


    }

    static async return(request,context) {
        // const currentTrader = TradersDigital.findOne({
        //     where : {
        //         id : context.session.userId
        //     }
        // });

                if (!request.session_id) {
                        return view('main_site/payment', {error : 'Missing Stripe session ID'}, context );
                }

                const session = await stripe.checkout.sessions.retrieve(request.session_id, {
      expand: ['subscription', 'customer'],
    });

     const subscription = session.subscription && typeof session.subscription === 'object'
      ? session.subscription
      : null;

      if(session.status === 'complete' && subscription && (subscription.status === 'trialing' || subscription.status === 'active')) {
        
        //currentTrader.trailEnds = session.trail_end_date;
        
        return view('trader/dashboard',{},context);

      } else {
        
        return view('main_site/payment', {error : 'Error with payment'}, context );

      }
    }
}

export default TradersDigital;