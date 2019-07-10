import Table from '../components/table';

export default {
    label: 'Registrations',
    element: Table,
    props: {
        id: 'registrations',
        columns: [
            {
                label: 'id'
            }, {
                label: 'code'
            }, {
                label: 'user'
            }, {
                label: 'invitationId'
            }, {
                label: 'neighborhood'
            }
        ]
    }
};