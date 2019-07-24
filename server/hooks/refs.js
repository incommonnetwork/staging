

const idTableMap = {
    'city': 'cities',
    'restaurant': 'restaurants',
    'reservation': 'reservations',
    'registration': 'registrations',
    'rsvp': 'rsvps',
    'invite': 'invites',
    'role': 'roles'
};


const addRefs = async ({ app }, data) => {
    for (const key in data) {
        if (data[key] && key.substr(-2) === 'Id') {
            const subkey = key.substr(0, key.length - 2);
            const table = idTableMap[subkey];
            if (!table) continue;
            const service = app.service(table);
            data[subkey] = await service.get(data[key]);
        }
    }
};

module.exports = function createAddRefs() {
    return async function addRefsHook(context) {
        if (context.method === 'find') {
            for (const data of context.result.data) {
                await addRefs(context, data);
            }
        } else {
            await addRefs(context, context.result);
        }
    };
};