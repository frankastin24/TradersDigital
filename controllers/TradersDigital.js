const { view } = require('../fuseo/view.js');
const Stripe = require('stripe')
console.log(global.__env.STRIPE_SECRET_KEY)
const stripe = new Stripe(global.__env.STRIPE_SECRET_KEY);
class TradersDigital {

    static home(request, context) {
        return view('main_site/home', {}, context);
    }
    static signup(request, context) {
        return view('main_site/sign_up', {}, context);
    }
    static payment(request, context) {
        return view('main_site/payment', {}, context);
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
    

        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',          // ✅ required for embedded checkout
            mode: 'subscription',         // ✅ creates a subscription

            line_items: [
                { price: prices[request.plan][request.interval], quantity: 1 },
            ],

            // ✅ 7 day free trial
            subscription_data: {
                trial_period_days: 7,
                metadata: { userId:  '1' },
            },

            // Optional: prefill email (creates/uses a Customer)
            customer_email: 'frankastin2023@gmail.com',

            // ✅ embedded checkout uses return_url (not success_url)
            // Stripe will replace {CHECKOUT_SESSION_ID}
            return_url: `http://localhost/return/?session_id={CHECKOUT_SESSION_ID}`,
        });

        // ✅ This is what initEmbeddedCheckout needs
        context.res.send(JSON.stringify({ clientSecret: session.client_secret }));


    }

    static return(request,context) {
        const currentTrader = TradersDigital.findOne({
            where : {
                id : context.session.userId
            }
        });

        const session = await stripe.checkout.sessions.retrieve(request.session_id, {
      expand: ['subscription', 'customer'],
    });

     const subscription = session.subscription && typeof session.subscription === 'object'
      ? session.subscription
      : null;

      if(session.status === 'complete' && subscription && (subscription.status === 'trialing' || subscription.status === 'active') {

      } else {
        
        return view('main_site/payment', {error : 'Error with payment'},context );

      }
    }
}

module.exports = TradersDigital;