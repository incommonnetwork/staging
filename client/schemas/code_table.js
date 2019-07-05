import Table from '../components/table';

export default {
    label: 'Codes',
    element: Table,
    props: {
        id: 'codes',
        columns: [
            {
                label: 'id'
            }, {
                label: 'assignedBy'
            }
        ]
    }
};