import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bulma-components/src/components/button';
import Modal from 'react-bulma-components/src/components/modal';
import Card from 'react-bulma-components/src/components/card';

import modalMachine from '../state/modal';
import { useMachine } from '@xstate/react';

const OpenModal = ({ id, button = 'Open', title = 'Modal', modal = {}, children, naked }) => {
    const [current, send] = useMachine(modalMachine);

    return (
        <div id={`${id}_modal`}>
            <Button onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                send('OPEN');
            }}>
                {button}
            </Button>
            <Modal show={current.matches('modal_opened')} onClose={() => send('CLOSE')} closeOnBlur={true} {...modal}>
                {naked ?
                    <Card>
                        {children}
                    </Card> :
                    <div id={`${id}_modal_open`}>
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
                    </div>
                }

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
    modal: PropTypes.object,
    naked: PropTypes.bool
};

export default OpenModal;