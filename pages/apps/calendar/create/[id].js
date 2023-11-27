import React, { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import AppMailLayout from '../../../../demo/components/apps/calendar/AppCalendarLayout';
import axiosInstance from '../../../../utils/axiosInstance';
import { Toast } from 'primereact/toast';

const CalendarEdit = () => {
    const [clients, setClients] = useState([]);
    const toastRef = useRef(null);
    const router = useRouter();
    const { id } = router.query;

    const fetchClients = async () => {
        try {
            const response = await axiosInstance.get(`/admin/clients`);
            setClients(response?.data?.data?.docs?.map(dc => ({
                label: dc?.name,
                value: dc?._id
            })));
        } catch (error) {
            console.error('An error occurred while fetching clients', error);
        }
    };

    const fetchCalendarData = async () => {
        try {
            const response = await axiosInstance.get(`/admin/calendar/${id}`);
            const calendarData = response?.data?.data;
            formik.setValues({ ...calendarData });
        } catch (error) {
            console.error('An error occurred while fetching calendar data for editing:', error);
        }
    };

    useEffect(() => {
        fetchClients();
        if (id) {
            fetchCalendarData();
        }
    }, [id]);

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            privacy: 'private',
            client: ''
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            description: Yup.string().required('Description is required'),
            privacy: Yup.string().required('Privacy setting is required'),
            client: Yup.string().required('Client selection is required')
        }),
        onSubmit: (values, { resetForm }) => {
            axiosInstance.patch(`/admin/calendar`, { ...values, id: values._id })
                .then(() => {
                    toastRef.current.show({ severity: 'success', summary: 'Success', detail: 'Calendar updated' });
                    resetForm();
                    router.back();
                })
                .catch(error => {
                    console.error('Error updating calendar:', error);
                    toastRef.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update calendar' });
                });
        }
    });

    const goBack = () => {
        router.back();
    };

    return (
        <AppMailLayout>
            <Toast ref={toastRef} />
            <div className="flex align-items-center px-4 md:px-0 border-top-1 surface-border md:border-none pt-4 md:pt-0">
                <Button type="button" icon="pi pi-chevron-left" className="p-button-outlined p-button-secondary surface-border text-900 w-3rem h-3rem mr-3" onClick={goBack}></Button>
                <span className="block text-900 font-bold text-xl">Edit Calendar</span>
            </div>
            <form onSubmit={formik.handleSubmit} className="surface-section grid mt-4 grid-nogutter formgrid p-4 gap-3 md:surface-border md:border-1 border-round">
                {clients.length > 0 && (
                    <div className="col-12 field">
                        <label htmlFor="client" className="text-900 font-semibold">Client</label>
                        <span className="p-input-icon-left w-full">
                            <i className="pi pi-lock" style={{ left: '1.5rem', zIndex: 9 }}></i>
                            <Dropdown id="client" name="client" value={formik.values.client} options={clients} onChange={formik.handleChange} className="w-full pl-7" />
                        </span>
                        {formik.touched.client && formik.errors.client ? (
                            <small className="p-error">{formik.errors.client}</small>
                        ) : null}
                    </div>
                )}
                <div className="col-12 field">
                    <label htmlFor="title" className="text-900 font-semibold">Title</label>
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-pencil" style={{ left: '1.5rem' }}></i>
                        <InputText id="title" name="title" value={formik.values.title} onChange={formik.handleChange} className="w-full pl-7" />
                    </span>
                    {formik.touched.title && formik.errors.title ? (
                        <small className="p-error">{formik.errors.title}</small>
                    ) : null}
                </div>
                <div className="col-12 field">
                    <label htmlFor="description" className="text-900 font-semibold">Description</label>
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-pencil" style={{ left: '1.5rem' }}></i>
                        <InputText id="description" name="description" value={formik.values.description} onChange={formik.handleChange} className="w-full pl-7" />
                    </span>
                    {formik.touched.description && formik.errors.description ? (
                        <small className="p-error">{formik.errors.description}</small>
                    ) : null}
                </div>
                <div className="col-12 field">
                    <label htmlFor="privacy" className="text-900 font-semibold">Privacy</label>
                    <span className="p-input-icon-left w-full">
                        <i className="pi pi-lock" style={{ left: '1.5rem', zIndex: 9 }}></i>
                        <Dropdown id="privacy" name="privacy" value={formik.values.privacy} options={[{ label: 'Public', value: 'public' }, { label: 'Private', value: 'private' }]} onChange={formik.handleChange} className="w-full pl-7" />
                    </span>
                    {formik.touched.privacy && formik.errors.privacy ? (
                        <small className="p-error">{formik.errors.privacy}</small>
                    ) : null}
                </div>
                <div className="col-12 flex column-gap-3 justify-content-end">
                    <Button type="submit" className="p-button-secondary h-3rem w-full sm:w-auto" label="Update" />
                </div>
            </form>
        </AppMailLayout>
    );
};

export default CalendarEdit;
