import React from 'react';
import PropTypes from 'prop-types';

import Modal from './modal';

const RestaurantLocation = ({ value, title }) => (
    <Modal button="Show Map" title={title} naked={true}>
        <iframe src={value} />
    </Modal>
);

RestaurantLocation.propTypes = {
    value: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};

export default RestaurantLocation;