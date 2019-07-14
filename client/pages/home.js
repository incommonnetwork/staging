
import React from 'react';
import Protected from '../layouts/protected';


const Home = () => {
    return (
        <Protected redirect="/sign_in">
            The Best interface is no interface... InCommon operated entirely by your email.
        </Protected>
    );
};

export default Home;