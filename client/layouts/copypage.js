import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Header from '../components/header';
import Hero, { SideKick } from './hero';

const CopyPage = ({ copy }) => (
    <Fragment>
        <Header />
        <Hero
            copy={copy.hero}
            textColor="white"  >
        </Hero>
        {
            Object.keys(copy.sidekicks).map((key, idx) => (
                <SideKick
                    key={idx}
                    {...copy.sidekicks[key]}
                    name={key}
                    justify={idx % 2 ? 'right' : 'left'}
                    button={'Sign Up'}
                />
            ))
        }
    </Fragment >
);

CopyPage.propTypes = {
    copy: PropTypes.object.isRequired,
    arrow: PropTypes.bool
};

export default CopyPage;