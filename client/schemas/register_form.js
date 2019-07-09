/* global window */
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
            }
        }
    },
    uiSchema: {
    },
    validate: (formData, errors) => {
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
    form_init: async (context) => {
        const app = await getApp();
        const query = Object.fromEntries(new URLSearchParams(window.location.search));
        const code = await app.service('codes').get(query.code);

        const cities = await app.service('cities').find();
        const cityMap = new Map();
        const cityEnum = [];

        for (const city of cities.data) {
            const key = `${city.state} - ${city.city}`;
            cityMap.set(key, city);
            cityEnum.push(key);
        }

        const uiSchema = {};
        const schema = context.schema;
        schema.changed = true;
        schema.properties.city.enum = cityEnum;

        if (code.cityId) {
            for (const [key, city] of cityMap) {
                if (city.id === code.cityId) {
                    delete schema.properties.city.enum;
                    schema.properties.city.default = key;
                    uiSchema.city = {
                        'ui:readonly': true
                    };
                    break;
                }
            }
        }


        const maps = { cityMap };
        return { schema, maps, uiSchema };
    },
    submit_service_done: () => {
        throw new Error('submit_service_done() NOT IMPLEMENTED');
    }
};