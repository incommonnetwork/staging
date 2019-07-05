import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bulma-components/src/components/button';
import Modal from 'react-bulma-components/src/components/modal';

import modalMachine from '../state/modal';
import { useMachine } from '@xstate/react';

const OpenModal = ({ id, button = 'Open', title = 'Modal', modal = {}, children }) => {
    const [current, send] = useMachine(modalMachine);

    return (
        <div id={`${id}_modal`}>
            <Button onClick={() => send('OPEN')}>
                {button}
            </Button>
            <Modal show={current.matches('modal_opened')} onClose={() => send('CLOSE')} closeOnBlur={true} {...modal}>
                <Modal.Card>
                    <Modal.Card.Head showClose={false}>
                        <Modal.Card.Title>
                            {title}
                        </Modal.Card.Title>
                    </Modal.Card.Head>
                    <Modal.Card.Body>
                        {children}
                    </Modal.Card.Body>
                </Modal.Card>
            </Modal>
        </div>
    );
};

OpenModal.propTypes = {
    id: PropTypes.string.isRequired,
    button: PropTypes.string,
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    modal: PropTypes.object
};

export default OpenModal;