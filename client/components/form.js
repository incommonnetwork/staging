import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { useMachine } from '@xstate/react';
import formMachine from '../state/form';

import '../vendor/bootstrap.css';
import JsonSchemaForm from 'react-jsonschema-form';
import Button from 'react-bulma-components/src/components/button';
import ErrorElement from '../components/error';
import Loader from 'react-bulma-components/src/components/loader';

const Form = ({ context, id }) => {
    const [current, send] = useMachine(formMachine.withContext(context));

    const Element = current.matches('error') ? ErrorElement
        : current.matches('form_init') ? Loader
            : InnerForm;

    const props = Element === ErrorElement ? { current, id }
        : Element === Loader ? {}
            : { current, send, id };

    return (
        <Element {...props} />
    );
};

Form.propTypes = {
    context: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
};

class InnerForm extends Component {
    shouldComponentUpdate() {
        const update = this.props.current.context.schema.changed;
        this.props.current.context.schema.changed = false;
        return update || false;
    }

    render() {
        const { id, current: { value, context: { schema, uiSchema, validate, onSubmit, onChange = () => { }, form_submit_label } }, send } = this.props;

        return (<div id={id + '_form'}>
            <JsonSchemaForm
                disabled={value === 'form_submit'}
                schema={schema}
                uiSchema={uiSchema}
                validate={validate}
                onChange={onChange(send)}
                onSubmit={onSubmit(send)}
            >
                <Button
                    className="is-primary"
                    fullwidth
                    loading={value === 'form_submit'}
                    type="submit">
                    {form_submit_label || 'Submit'}
                </Button>
            </JsonSchemaForm>
        </div>);
    }
}

InnerForm.propTypes = {
    current: PropTypes.object.isRequired,
    send: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
};



export default Form;