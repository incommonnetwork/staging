import React, { Component } from 'react';
import getApp from '../utils/feathers';


class TestPage extends Component {
    async componentDidMount() {
        const app = await getApp();

        await app.service('users').create({
            email: `${Math.random()}@test.cors`,
            password: 'test.cors'
        }).catch(e => e).then(e => {
            /* eslint-disable */
            console.log(e)
            /* eslint-enable */
        });

    }

    render() {
        return <div>check console</div>;
    }
}

export default TestPage;