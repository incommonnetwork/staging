import React from 'react';
import PropTypes from 'prop-types';

import Modal from './modal';

const RestaurantLocation = ({ value }) => {
    const { id, address, city, map } = JSON.parse(value);
    return (
        <div>
            {`${address}, ${city}`}
            <div style={{ padding: 10 }} />
            <Modal id={id} button="Show Map" naked={true}>
                <iframe src={map} />
            </Modal>
        </div>
    );
};

RestaurantLocation.propTypes = {
    value: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};

export default RestaurantLocation;