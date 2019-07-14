/* global location */
import React from 'react';
import PropTypes from 'prop-types';

import Modal from './modal';
import Form from './form';
import removeForm from '../schemas/remove_form';

const Remove = ({ service, id }) => (
    <Modal id={id} button={'Remove'} title={`Remove ${service} ${id}`}>
        <Form id={`remove_${service}_${id}`} context={{
            ...removeForm,
            id,
            service,
            submit_service_done() {
                location.reload();
            }
        }} />
    </Modal>
);

Remove.propTypes = {
    service: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
};

export default Remove;