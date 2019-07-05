
import getApp from '../utils/feathers';

export default {
    redirect: '/home',
    title: 'Create City',
    schema: {
        type: 'object',
        required: ['city', 'state', 'country', 'latitude', 'longitude'],
        properties: {
            city: {
                title: 'city',
                type: 'string'
            },
            state: {
                title: 'state',
                type: 'string'
            },
            country: {
                title: 'country',
                type: 'string'
            },
            latitude: {
                title: 'latitude',
                type: 'number',
                minimum: -90,
                maximum: 90
            },
            longitude: {
                title: 'longitude',
                type: 'number',
                minimum: -180,
                maximum: 180
            }
        }
    },
    uiSchema: {
    },
    validate: (formData, errors) => {
        for (const key of ['latitude', 'longitude']) {
            const a = formData[key];
            if (!isFinite(a)) {
                errors[key].addError(`${key} must be finite`);
                continue;
            }
            var e = 1, p = 0;
            while (Math.round(a * e) / e !== a) { e *= 10; p++; }
            if (p > 1) errors[key].addError(`${key} must have less than 1 decimal of precision`);
        }
        return errors;
    },
    onSubmit: (send) => ({ formData }) => send({
        type: 'SUBMIT',
        formData
    }),
    submit_service: async ({ formData }) => {
        const app = await getApp();
        const created = await app.service('cities').create(formData);
        return created;
    },
    submit_service_done: () => {
        throw new Error('submit_service_done() NOT IMPLEMENTED');
    }
};