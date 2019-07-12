import React from 'react';
import PropTypes from 'prop-types';

import Modal from './modal';

const RestaurantLocation = ({ value }) => {
    const { address, neighborhood, city, map } = JSON.parse(value);
    return (
        <div>
            {`${address}, ${neighborhood}, ${city}`}
            <div style={{ padding: 10 }} />
            <Modal button="Show Map" naked={true}>
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