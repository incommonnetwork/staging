/* global window */
import React from 'react';

import Router from '../utils/router';
import Main from '../layouts/main';

import formContext from '../schemas/rsvp_form';

import TileView, { TileViewForm } from '../layouts/tiles';

import fromEntries from 'fromentries';

import 'url-search-params-polyfill';


const makeRSVPContext = (reservations) => reservations.data.map((reservation) => ({
    ...formContext,
    reservation,
    submit_service_done: () => {
        Router.push('/thank_you_rsvp');
    }
}));

const RsvpSelect = () => (
    <Main>
        <TileView
            id={'rsvp_select'}
            service={'reservations'}
            getQuery={() => {
                const raw = fromEntries(new URLSearchParams(window.location.search));
                const query = {
                    codeId: raw.c
                    // full: false
                };
                return query;
            }}
            Component={TileViewForm}
            makeValues={makeRSVPContext}
        />
    </Main>
);

export default RsvpSelect;