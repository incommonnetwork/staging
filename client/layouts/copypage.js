import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Header from '../components/header';
import Hero, { HeroTile, SideKick } from './hero';

const CopyPage = ({ copy }) => (
    <Fragment>
        <Header />
        <Hero
            copy={copy.hero}
            textColor="white"  >
            {
                Object.keys(copy.sidekicks).map((key, idx) => (
                    <HeroTile
                        key={idx}
                        copy={copy.sidekicks[key]}
                        sidekick={key}
                    />
                ))
            }
        </Hero>
        {
            Object.keys(copy.sidekicks).map((key, idx) => (
                <SideKick
                    key={idx}
                    copy={copy.sidekicks[key]}
                    name={key}
                    justify={idx % 2 ? 'right' : 'left'}
                    button={'Sign Up'}
                />
            ))
        }
    </Fragment >
);

CopyPage.propTypes = {
    copy: PropTypes.object.isRequired
};

export default CopyPage;