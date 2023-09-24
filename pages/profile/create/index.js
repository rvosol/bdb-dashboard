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
    EmployeeID: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    middleName: Joi.string().required(),
    nickName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
    mobile: Joi.string().required(),
    department: Joi.string().required(),
    position: Joi.string().required(),
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
        EmployeeID: '123', // Initialize as needed
        firstName: '',
        lastName: '',
        middleName: '',
        nickName: '',
        email: '',
        password: '',
        phone: '',
        mobile: '',
        department: '',
        position: '',
    };

    const handleSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
        try {
          await axiosInstance.post('/admin/subAdmin', { ...values, role: 'admin' });
          setSubmitting(false);
          resetForm(); // Reset the form
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
            <span className="text-900 text-xl font-bold mb-4 block">Create User</span>
            <div className="grid">
                <div className="col-12 lg:col-2">
                    <div className="text-900 font-medium text-xl mb-3">Profile</div>
                    <p className="m-0 p-0 text-600 line-height-3 mr-3">Odio euismod lacinia at quis risus sed vulputate odio.</p>
                </div>


                <div className="col-12 lg:col-10">
                    <Formik initialValues={initialValues} validate={validateValues} onSubmit={handleSubmit}>
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="grid formgrid p-fluid">


                                    <div className="field mb-4 col-12">
                                        <label htmlFor="EmployeeID" className="font-medium text-900">
                                            Employee ID
                                        </label>
                                        <Field as="input" id="EmployeeID" name="EmployeeID" disabled className='p-inputtext p-component' />
                                        <ErrorMessage name="EmployeeID" component="div" />
                                    </div>

                                     {/* First Name */}
                                     <div className="field mb-4 col-12 md:col-6">
                                        <label htmlFor="firstName" className="font-medium text-900">First Name</label>
                                        <Field id="firstName" name="firstName" className="p-inputtext p-component" />
                                        <ErrorMessage name="firstName" component="div" />
                                    </div>
                                    {/* Middle Name */}
                                    <div className="field mb-4 col-12 md:col-6">
                                        <label htmlFor="middleName" className="font-medium text-900">Middle Name</label>
                                        <Field id="middleName" name="middleName" className="p-inputtext p-component" />
                                        <ErrorMessage name="middleName" component="div" />
                                    </div>
                                    {/* Last Name */}
                                    <div className="field mb-4 col-12 md:col-6">
                                        <label htmlFor="lastName" className="font-medium text-900">Last Name</label>
                                        <Field id="lastName" name="lastName" className="p-inputtext p-component" />
                                        <ErrorMessage name="lastName" component="div" />
                                    </div>
                                    {/* Additional fields */}
                                    
                                    {/* Nickname */}
                                    <div className="field mb-4 col-12 md:col-6">
                                        <label htmlFor="nickName" className="font-medium text-900">Nickname</label>
                                        <Field id="nickName" name="nickName" className="p-inputtext p-component" />
                                        <ErrorMessage name="nickName" component="div" />
                                    </div>
                                    {/* Email */}
                                    <div className="field mb-4 col-12">
                                        <label htmlFor="email" className="font-medium text-900">Email</label>
                                        <Field id="email" name="email" type="email" className="p-inputtext p-component" />
                                        <ErrorMessage name="email" component="div" />
                                    </div>
                                    {/* Password */}
                                    <div className="field mb-4 col-12">
                                        <label htmlFor="password" className="font-medium text-900">Password</label>
                                        <Field id="password" name="password" type="password" className="p-inputtext p-component" />
                                        <ErrorMessage name="password" component="div" />
                                    </div>


                                     {/* phone */}
                                     <div className="field mb-4 col-12 md:col-6">
                                        <label htmlFor="phone" className="font-medium text-900">Phone</label>
                                        <Field id="phone" name="phone" className="p-inputtext p-component" />
                                        <ErrorMessage name="phone" component="div" />
                                    </div>
                                    {/* Mobile */}
                                    <div className="field mb-4 col-12 md:col-6">
                                        <label htmlFor="mobile" className="font-medium text-900">Mobile</label>
                                        <Field id="mobile" name="mobile" className="p-inputtext p-component" />
                                        <ErrorMessage name="mobile" component="div" />
                                    </div>

                                      {/* Position */}
                                      <div className="field mb-4 col-12 md:col-6">
                                        <label htmlFor="position" className="font-medium text-900">Position</label>
                                        <Field id="position" name="position" className="p-inputtext p-component" />
                                        <ErrorMessage name="position" component="div" />
                                    </div>
                                    {/* Department */}
                                    <div className="field mb-4 col-12 md:col-6">
                                        <label htmlFor="department" className="font-medium text-900">Department</label>
                                        <Field id="department" name="department" className="p-inputtext p-component" />
                                        <ErrorMessage name="department" component="div" />
                                    </div>

                                    <div className="col-12">
                                        <Button label="Create User" type='submit' className="w-auto mt-3"></Button>
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
