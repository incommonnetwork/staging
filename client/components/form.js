import React from 'react';
import PropTypes from 'prop-types';

import { useMachine } from '@xstate/react';
import formMachine from '../state/form';

import 'bootstrap/dist/css/bootstrap.css';
import JsonSchemaForm from 'react-jsonschema-form';
import Button from 'react-bulma-components/src/components/button';
import ErrorElement from '../components/error';

const Form = ({ context, id }) => {
    const [current, send] = useMachine(formMachine.withContext(context));

    const Element = current.matches('form_input') || current.matches('form_submit') ? InnerForm
        : current.matches('error') ? ErrorElement
            : null;

    return (
        <Element current={current} send={send} id={id} />
    );
};

Form.propTypes = {
    context: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
};

const InnerForm = ({ id, current: { value, context: { schema, uiSchema, validate, onSubmit } }, send }) => (
    <div id={id + '_form'}>
        <JsonSchemaForm
            disabled={value === 'form_submit'}
            schema={schema}
            uiSchema={uiSchema}
            validate={validate}
            onSubmit={onSubmit(send)}
        >
            <Button
                className="is-primary"
                fullwidth
                loading={value === 'form_submit'}
                type="submit">
                Submit
            </Button>
        </JsonSchemaForm>
    </div>
);

InnerForm.propTypes = {
    current: PropTypes.object.isRequired,
    send: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
};



export default Form;