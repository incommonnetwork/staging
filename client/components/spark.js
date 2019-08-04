import React from 'react';
import PropTypes from 'prop-types';

import Modal from './modal';

const Video = ({ url, button }) => (
    <p style={{ textAlign: 'center' }}>
        <Modal button={button || 'Watch Video'} naked={true}>
            <iframe className="spark-video" src={url} frameBorder="0" allowFullScreen></iframe>
        </Modal>
    </p>
);

Video.propTypes = {
    url: PropTypes.string.isRequired,
    button: PropTypes.string
};

export default Video;