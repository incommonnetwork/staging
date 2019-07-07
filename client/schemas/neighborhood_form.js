
import getApp from '../utils/feathers';

export default {
    redirect: '/home',
    title: 'Create Neighborhood',
    schema: {
        type: 'object',
        required: ['city', 'neighborhood', 'latitude', 'longitude'],
        properties: {
            city: {
                title: 'City',
                type: 'string'
            },
            neighborhood: {
                title: 'Neighborhood',
                type: 'string'
            },
            area: {
                title: 'Area',
                type: 'string'
            },
            latitude: {
                title: 'Latitude',
                type: 'number',
                minimum: -90,
                maximum: 90
            },
            longitude: {
                title: 'Longitude',
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
            if (p > 2) errors[key].addError(`${key} must have less than 2 decimal of precision`);
        }
        return errors;
    },
    onChange: (send) => ({ formData }) => send({
        type: 'CHANGE',
        formData
    }),
    onSubmit: (send) => ({ formData }) => send({
        type: 'SUBMIT',
        formData
    }),
    submit_service: async ({ formData }, context) => {
        const cityKey = formData.city;
        delete formData.city;
        formData.cityId = context.maps.cityMap.get(cityKey).id;
        const app = await getApp();
        const created = await app.service('neighborhoods').create(formData);
        return created;
    },
    form_should_update: (context, event) => context.schema.properties.city.default != event.formData.city,
    form_update: async (context, event) => {
        const schema = context.schema;
        schema.changed = true;
        schema.properties.city.default = event.formData.city;
        const city = context.maps.cityMap.get(event.formData.city);

        schema.properties.latitude.default = Number.parseFloat(city.latitude);
        schema.properties.longitude.default = Number.parseFloat(city.longitude);
        return { schema };
    },
    form_init: async (context) => {
        const app = await getApp();
        const cities = await app.service('cities').find();
        const cityMap = new Map();
        const cityEnum = [];

        for (const city of cities.data) {
            const key = `${city.state} - ${city.city}`;
            cityMap.set(key, city);
            cityEnum.push(key);
        }

        const schema = context.schema;
        schema.changed = true;
        schema.properties.city.enum = cityEnum;
        const maps = { cityMap };

        return { schema, maps };
    },
    submit_service_done: () => {
        throw new Error('submit_service_done() NOT IMPLEMENTED');
    }
};