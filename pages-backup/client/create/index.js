import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useState } from 'react';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from 'axios';
import Joi from 'joi';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'react-toastify';

const schema = Joi.object({
    name: Joi.string().required(),
});

function validateValues(values) {
    const { error } = schema.validate(values, { abortEarly: false });
    if (!error) return {};

    const errors = error.details.reduce((acc, detail) => {
        acc[detail.path[0]] = detail.message;
        return acc;
    }, {});
    return errors;
}

function ProfileCreate() {
    const initialValues = {
        name: '', // Initialize as needed
    };

    const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
        try {
          await axiosInstance.post('/admin/clients', { ...values,  });
          setSubmitting(false);
          resetForm(); // Reset the form
          toast.success('Client Created');
        } catch (error) {
          setSubmitting(false);
          toast.error(error?.response?.data?.message || 'API call failed'); // Replace with your error handling logic
        }
      };


    const itemTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <img
                    src={`/demo/images/flag/flag_placeholder.png`}
                    onError={(e) => (e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png')}
                    className={'mr-2 flag flag-' + option.code.toLowerCase()}
                    style={{ width: '18px' }}
                    alt={option.name}
                />
                <div>{option.name}</div>
            </div>
        );
    };

    return (
        <div className="card">
            <span className="text-900 text-xl font-bold mb-4 block">Create Client</span>
            <div className="grid">
               


                <div className="col-12 lg:col-6">
                    <Formik initialValues={initialValues} validate={validateValues} onSubmit={handleSubmit}>
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="grid formgrid p-fluid">


                                    <div className="field mb-4 col-12">
                                        <label htmlFor="name" className="font-medium text-900">
                                            Name
                                        </label>
                                        <Field as="input" id="name" name="name"  className='p-inputtext p-component' />
                                        <ErrorMessage name="name" component="div" />
                                    </div>

                                    

                                    <div className="col-12">
                                        <Button label="Create Client" type='submit' className="w-auto mt-3"></Button>
                                    </div>
                                </div>
                            </Form>)}
                    </Formik>

                </div>
            </div>
        </div>
    );
}

export default ProfileCreate;
