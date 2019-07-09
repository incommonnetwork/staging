
import getApp from '../utils/feathers';

export default {
    redirect: '/home',
    title: 'Create Code',
    schema: {
        type: 'object',
        required: ['text', 'dates'],
        properties: {
            text: {
                title: 'text',
                type: 'string'
            },
            description: {
                title: 'Description',
                type: 'string'
            },
            city: {
                title: 'City',
                type: 'string'
            },
            dates: {
                title: 'Dates',
                type: 'array',
                items: {
                    type: 'string',
                    format: 'date'
                }
            }
        }
    },
    uiSchema: {
        dates: {
            'ui:options': {
                orderable: false
            }
        }
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
    validate: (formData, errors) => {
        return errors;
    },
    onSubmit: (send) => ({ formData }) => send({
        type: 'SUBMIT',
        formData
    }),
    submit_service: async ({ formData }, context) => {
        const cityKey = formData.city;
        delete formData.city;
        formData.cityId = context.maps.cityMap.get(cityKey).id;
        const app = await getApp();
        const created = await app.service('codes').create(formData);
        return created;
    },
    submit_service_done: () => {
        throw new Error('submit_service_done() NOT IMPLEMENTED');
    }
};