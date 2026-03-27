import { defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', {
    state: () => ({ 
        appState : 'home',
        user: {
            firstName: 'Trader'
        },
        customers: [
            {
                id: 1,
                name: 'John Carter',
                email: 'john@example.com',
                phone: '07700 900123',
                address: '12 High Street, London',
                notes: 'Prefers morning appointments.'
            }
        ],
        selectedCustomer: null,
        newJobs: [
            {
                id: 201,
                customerName: 'John Carter',
                customer: {
                    id: 1,
                    name: 'John Carter',
                    email: 'john@example.com',
                    phone: '07700 900123',
                    address: '12 High Street, London',
                    notes: 'Prefers morning appointments.'
                },
                date: '2026-03-30',
                duration: '1 day',
                description: 'Install outdoor socket and safety check.',
                notes: 'Bring weatherproof fittings.',
                status: 'scheduled'
            }
        ],
        upcomingJobs: [],
        selectedJob: null,
        services: [
            {
                name: 'Consumer Unit Upgrade',
                description: 'Replacement and testing of consumer unit.',
                minPrice: 350,
                maxPrice: 650,
                featured: true
            }
        ],
        displayPrices: true,
    }),
    actions: {
        async initialize() {
            try {
                const response = await fetch('/api/dashboard');
                if (!response.ok) return;
                const data = await response.json();

                this.user = data.user || this.user;
                this.customers = data.customers || [];

                const allJobs = data.jobs || [];
                this.newJobs = allJobs.filter((job) => !job.date || job.status === 'pending');
                this.upcomingJobs = allJobs.filter((job) => job.date && job.status !== 'pending');

                await this.loadServices();
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            }
        },
        async loadServices() {
            try {
                const response = await fetch('/api/services');
                if (!response.ok) return;
                const data = await response.json();
                this.displayPrices = typeof data.displayPrices === 'boolean' ? data.displayPrices : true;
                this.services = Array.isArray(data.services) ? data.services : [];
            } catch (error) {
                console.error('Failed to load services:', error);
            }
        },
        setAppState(state) {
            this.appState = state;
        },
        async addCustomer(customer) {
            try {
                const response = await fetch('/api/customers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(customer)
                });

                if (!response.ok) {
                    const err = await response.json().catch(() => ({}));
                    throw new Error(err.error || 'Failed to create customer');
                }

                const created = await response.json();
                this.customers.unshift(created);
                return created;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        selectCustomer(customer) {
            this.selectedCustomer = customer;
            this.appState = 'customerDetails';
        },
        selectJob(job) {
            this.selectedJob = job;
            this.appState = 'jobDetails';
        },
        updateSelectedJobDate(date) {
            if (!this.selectedJob) return;
            this.selectedJob.date = date;
            fetch(`/api/jobs/${this.selectedJob.id}/date`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date })
            }).catch((error) => console.error('Failed to update job date:', error));
        },
        updateSelectedJobStatus(status) {
            if (!this.selectedJob) return;
            this.selectedJob.status = status;
            fetch(`/api/jobs/${this.selectedJob.id}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            }).catch((error) => console.error('Failed to update job status:', error));
        },
        async removeService(index) {
            const service = this.services[index];
            if (!service) return;

            if (service.id) {
                const response = await fetch(`/api/services/${service.id}/delete`, {
                    method: 'POST'
                });

                const data = await response.json().catch(() => ({}));
                if (!response.ok) throw new Error(data.error || 'Failed to delete service');
            }

            this.services.splice(index, 1);
        },
        addService() {
            this.services.push({
                id: null,
                name: '',
                description: '',
                minPrice: null,
                maxPrice: null,
                featured: false
            });
        },
        async saveService(service) {
            if (!service?.name) {
                throw new Error('Service name is required');
            }

            const payload = {
                name: service.name,
                description: service.description || '',
                minPrice: service.minPrice,
                maxPrice: service.maxPrice,
                featured: !!service.featured
            };

            if (service.id) {
                const response = await fetch(`/api/services/${service.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json().catch(() => ({}));
                if (!response.ok) throw new Error(data.error || 'Failed to update service');
                return;
            }

            const response = await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || 'Failed to create service');
            service.id = data.id;
        },
        async saveServices() {
            for (const service of this.services) {
                await this.saveService(service);
            }
        },
        async updateDisplayPrices(value) {
            const response = await fetch('/api/services/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ displayPrices: value })
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || 'Failed to save display prices setting');
            this.displayPrices = !!data.displayPrices;
        },
        async changeEmail(email) {
            const response = await fetch('/api/settings/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to update email');
            this.user.email = data.email;
        },
        async changePassword(currentPassword, newPassword) {
            const response = await fetch('/api/settings/password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to update password');
        }
    }
  })