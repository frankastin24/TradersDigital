import Trader from '../models/Trader.js';
import Customer from '../models/Customer.js';
import Job from '../models/Job.js';
import Service from '../models/Service.js';
import ServicePreference from '../models/ServicePreference.js';
import argon2 from 'argon2';
import GenerateWebsite from './GenerateWebsite.js';
class Api {
    static requireAuth(context) {
        if (!context.session?.userId) {
            context.res.status(401).json({ error: 'Unauthorized' });
            return false;
        }
        return true;
    }

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

        await newTrader.save();

        context.session.userId = newTrader.id;

        return context.res.json({ alreadyRegistered: false })

    }

    static async setPassword(request, context) {
        const currentTrader = await Trader.findByPk(context.session.userId);
       
        if (currentTrader.password) {

            const verify = await argon2.verify(currentTrader.password, request.password);
            if (verify) {
                context.session.passEntered = true;
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
            await currentTrader.save();
            context.session.passEntered = true;

            return context.res.json({ passwordSet: true })

        }

    }

    static async setTrade(request, context) {
        const currentTrader = await Trader.findByPk(context.session.userId);
       
        currentTrader.trade = request.trade;
        await currentTrader.save();
        return context.res.send('success')
    }

    static async setName(request, context) {
        const currentTrader = await Trader.findByPk(context.session.userId);
        currentTrader.businessName = request.businessName;
        await currentTrader.save()
        return context.res.send('success')
    }

    static async setDetails(request, context) {
        const currentTrader = await Trader.findByPk(context.session.userId);
        currentTrader.city = request.city;
        currentTrader.phoneNumber = request.phoneNumber;
        await currentTrader.save()
        return context.res.send('success')
    }

    static async setAbout(request, context) {
        
        const currentTrader = await Trader.findByPk(context.session.userId);
        currentTrader.experience = request.experience;
        currentTrader.areas = request.areas;
        currentTrader.mainServices = request.mainServices;
        currentTrader.regComplete = true;
        await currentTrader.save();

        return GenerateWebsite.create(request, context);
        
    }

    static async deleteUser(request, context) {
        if (!context.session?.userId) {
            return context.res.status(401).send('Unauthorized');
        }

        await Trader.destroy({
            where: {
                id: context.session.userId
            }
        });

        context.session.destroy(() => {});

        return context.res.send('success')

    }

    static async dashboard(request, context) {
        if (!Api.requireAuth(context)) return;

        const trader = await Trader.findByPk(context.session.userId);
        const customers = await Customer.findAll({ order: [['id', 'DESC']] });
        const jobs = await Job.findAll({ order: [['id', 'DESC']] });

        return context.res.json({
            user: {
                id: trader?.id,
                firstName: trader?.businessName ? trader.businessName.split(' ')[0] : 'Trader',
                email: trader?.email || ''
            },
            customers: customers.map((customer) => ({
                id: customer.id,
                name: customer.name,
                email: customer.email,
                phone: customer.phoneNumber || '',
                address: customer.address || '',
                notes: ''
            })),
            jobs: jobs.map((job) => ({
                id: job.id,
                customerName: job.title || `Job #${job.id}`,
                customer: {
                    name: job.title || `Job #${job.id}`,
                    address: '',
                    email: '',
                    phone: ''
                },
                date: job.scheduledDate ? new Date(job.scheduledDate).toISOString().slice(0, 10) : '',
                duration: job.durationDays ? `${job.durationDays} day${job.durationDays === 1 ? '' : 's'}` : '1 day',
                description: job.description || '',
                notes: '',
                status: job.status || 'scheduled'
            }))
        });
    }

    static async listCustomers(request, context) {
        if (!Api.requireAuth(context)) return;

        const customers = await Customer.findAll({ order: [['id', 'DESC']] });
        return context.res.json(customers.map((customer) => ({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phoneNumber || '',
            address: customer.address || '',
            notes: ''
        })));
    }

    static async createCustomer(request, context) {
        if (!Api.requireAuth(context)) return;

        if (!request.name || !request.email) {
            return context.res.status(400).json({ error: 'Name and email are required' });
        }

        const customer = await Customer.create({
            name: request.name,
            email: request.email,
            phoneNumber: request.phone || '',
            address: request.address || ''
        });

        return context.res.status(201).json({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phoneNumber || '',
            address: customer.address || '',
            notes: request.notes || ''
        });
    }

    static async listJobs(request, context) {
        if (!Api.requireAuth(context)) return;

        const jobs = await Job.findAll({ order: [['id', 'DESC']] });
        return context.res.json(jobs.map((job) => ({
            id: job.id,
            customerName: job.title || `Job #${job.id}`,
            customer: {
                name: job.title || `Job #${job.id}`,
                address: '',
                email: '',
                phone: ''
            },
            date: job.scheduledDate ? new Date(job.scheduledDate).toISOString().slice(0, 10) : '',
            duration: job.durationDays ? `${job.durationDays} day${job.durationDays === 1 ? '' : 's'}` : '1 day',
            description: job.description || '',
            notes: '',
            status: job.status || 'scheduled'
        })));
    }

    static async updateJobStatus(request, context) {
        if (!Api.requireAuth(context)) return;

        const job = await Job.findByPk(request.id);
        if (!job) return context.res.status(404).json({ error: 'Job not found' });

        job.status = request.status || job.status;
        await job.save();
        return context.res.json({ success: true });
    }

    static async updateJobDate(request, context) {
        if (!Api.requireAuth(context)) return;

        const job = await Job.findByPk(request.id);
        if (!job) return context.res.status(404).json({ error: 'Job not found' });

        job.scheduledDate = request.date || job.scheduledDate;
        await job.save();
        return context.res.json({ success: true });
    }

    static async updateEmail(request, context) {
        if (!Api.requireAuth(context)) return;

        if (!request.email) {
            return context.res.status(400).json({ error: 'Email is required' });
        }

        const existing = await Trader.findOne({ where: { email: request.email } });
        if (existing && existing.id !== context.session.userId) {
            return context.res.status(409).json({ error: 'Email already in use' });
        }

        const trader = await Trader.findByPk(context.session.userId);
        trader.email = request.email;
        await trader.save();

        return context.res.json({ success: true, email: trader.email });
    }

    static async updatePassword(request, context) {
        if (!Api.requireAuth(context)) return;

        const trader = await Trader.findByPk(context.session.userId);
        if (!trader) return context.res.status(404).json({ error: 'Trader not found' });

        if (trader.password) {
            const validCurrent = await argon2.verify(trader.password, request.currentPassword || '');
            if (!validCurrent) {
                return context.res.status(401).json({ error: 'Current password is incorrect' });
            }
        }

        if (!request.newPassword || request.newPassword.length < 6) {
            return context.res.status(400).json({ error: 'New password must be at least 6 characters' });
        }

        const hash = await argon2.hash(request.newPassword, {
            type: argon2.argon2id,
            timeCost: 2,
            memoryCost: 19 * 1024,
            parallelism: 1,
        });

        trader.password = hash;
        await trader.save();

        return context.res.json({ success: true });
    }

    static async listServices(request, context) {
        if (!Api.requireAuth(context)) return;

        const traderId = context.session.userId;
        const services = await Service.findAll({
            where: { traderId },
            order: [['id', 'DESC']]
        });

        const preference = await ServicePreference.findOne({ where: { traderId } });

        return context.res.json({
            displayPrices: preference ? preference.displayPrices : true,
            services: services.map((service) => ({
                id: service.id,
                name: service.name,
                description: service.description || '',
                minPrice: service.minPrice,
                maxPrice: service.maxPrice,
                featured: !!service.featured
            }))
        });
    }

    static async createService(request, context) {
        if (!Api.requireAuth(context)) return;

        if (!request.name) {
            return context.res.status(400).json({ error: 'Service name is required' });
        }

        const service = await Service.create({
            traderId: context.session.userId,
            name: request.name,
            description: request.description || '',
            minPrice: request.minPrice === '' || request.minPrice == null ? null : Number(request.minPrice),
            maxPrice: request.maxPrice === '' || request.maxPrice == null ? null : Number(request.maxPrice),
            featured: !!request.featured
        });

        return context.res.status(201).json({
            id: service.id,
            name: service.name,
            description: service.description || '',
            minPrice: service.minPrice,
            maxPrice: service.maxPrice,
            featured: !!service.featured
        });
    }

    static async updateService(request, context) {
        if (!Api.requireAuth(context)) return;

        const service = await Service.findOne({
            where: {
                id: request.id,
                traderId: context.session.userId
            }
        });

        if (!service) return context.res.status(404).json({ error: 'Service not found' });

        service.name = request.name || service.name;
        service.description = request.description ?? service.description;
        service.minPrice = request.minPrice === '' || request.minPrice == null ? null : Number(request.minPrice);
        service.maxPrice = request.maxPrice === '' || request.maxPrice == null ? null : Number(request.maxPrice);
        service.featured = !!request.featured;
        await service.save();

        return context.res.json({ success: true });
    }

    static async deleteService(request, context) {
        if (!Api.requireAuth(context)) return;

        const deleted = await Service.destroy({
            where: {
                id: request.id,
                traderId: context.session.userId
            }
        });

        if (!deleted) return context.res.status(404).json({ error: 'Service not found' });
        return context.res.json({ success: true });
    }

    static async updateServicePreference(request, context) {
        if (!Api.requireAuth(context)) return;

        const traderId = context.session.userId;
        const displayPrices = !!request.displayPrices;

        const [preference] = await ServicePreference.findOrCreate({
            where: { traderId },
            defaults: { displayPrices }
        });

        preference.displayPrices = displayPrices;
        await preference.save();

        return context.res.json({ success: true, displayPrices: preference.displayPrices });
    }
}

export default Api;