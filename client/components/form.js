import React from 'react';
import PropTypes from 'prop-types';

import 'bootstrap/dist/css/bootstrap.css';
import JsonSchemaForm from 'react-jsonschema-form';
import Button from 'react-bulma-components/src/components/button';

const Form = ({ id, current: { value, meta: { SignUp: { schema, uiSchema, validate, onSubmit } } }, send }) => (
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

Form.propTypes = {
    current: PropTypes.object.isRequired,
    send: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
};

export default Form;