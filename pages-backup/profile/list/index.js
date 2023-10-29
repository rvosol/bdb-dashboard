



import { useRouter } from 'next/router';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import React, { useEffect, useRef, useState } from 'react';
import { CustomerService } from '../../../demo/service/CustomerService';
import axiosInstance from '../../../utils/axiosInstance';

function List() {
    const [customers, setCustomers] = useState([]);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(true);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const router = useRouter();
    const dt = useRef(null);

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [globalFilter, setGlobalFilter] = useState('');


    useEffect(() => {
        // Fetch data from API with pagination and search filter
        async function fetchData() {
            setLoading(true);

            try {
                const response = await axiosInstance.get('/admin/subAdmin', {
                    params: {
                        page: page + 1, // API uses 1-indexed pages
                        limit: 10, // Number of records per page
                        q: globalFilter // Search query
                    }
                });

                setUsers(response?.data?.data?.docs);
                setTotalRecords(parseInt(response?.data?.data?.totalDocs, 10));
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }

            setLoading(false);
        }

        fetchData();
    }, [page, globalFilter]);

    const getCustomers = (data) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
            return d;
        });
    };

    const formatDate = (value) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    const clearFilter = () => {
        initFilters();
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN }
        });
        setGlobalFilterValue('');
    };

    useEffect(() => {
        CustomerService.getCustomersLarge().then((data) => {
            setCustomers(getCustomers(data));
            setLoading(false);
        });
        initFilters();
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                <span className="p-input-icon-left w-full sm:w-20rem flex-order-1 sm:flex-order-0">
                    <i className="pi pi-search"></i>
                    <InputText
                        type="search"
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Global Search"
                    />
                </span>
                <Button type="button" icon="pi pi-user-plus" label="Add New" className="p-button-outlined w-full sm:w-auto flex-order-0 sm:flex-order-1" onClick={() => router.push('/profile/create')} />
            </div>
        );
    };
    const nameBodyTemplate = (customer) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {customer.name}
            </>
        );
    };

    const countryBodyTemplate = (customer) => {
        return (
            <>
                <img alt={customer.country.name} src={`/demo/images/flag/flag_placeholder.png`} className={'w-2rem mr-2 flag flag-' + customer.country.code} />
                <span className="image-text">{customer.country.name}</span>
            </>
        );
    };

    const createdByBodyTemplate = (customer) => {
        return (
            <div className="inline-flex align-items-center">
                <img alt={customer.representative.name} src={`/demo/images/avatar/${customer.representative.image}`} className="w-2rem mr-2" />
                <span>{customer.representative.name}</span>
            </div>
        );
    };

    const dateBodyTemplate = (customer) => {
        return formatDate(customer.date);
    };

    const activityBodyTemplate = (customer) => {
        return <ProgressBar value={customer.activity} showValue={false} style={{ height: '.5rem' }} />;
    };

    const header = renderHeader();
    const renderColumnData = (rowData, field) => {
        return rowData[field] ? rowData[field] : "N/A";
    };
    return (
        <div className="card">
            <DataTable
                ref={dt}
                value={users}
                lazy
                paginator
                rows={10}
                page={page}
                totalRecords={totalRecords}
                onPage={e => setPage(e.page)}
                loading={loading}
                header={header}
                globalFilter={globalFilter}
                emptyMessage="No users found"
            >
                <Column field="_id" header="ID" body={(rowData) => renderColumnData(rowData, "_id")} />
                <Column field="firstName" header="Name" body={(rowData) => renderColumnData(rowData, "firstName")} />
                <Column field="email" header="Email" body={(rowData) => renderColumnData(rowData, "email")} />
                <Column field="mobile" header="Mobile" body={(rowData) => renderColumnData(rowData, "mobile")} />
                {/* <Column field="position" header="Position" body={(rowData) => renderColumnData(rowData, "position")} /> */}
                {/* <Column field="department" header="Department" body={(rowData) => renderColumnData(rowData, "department")} /> */}
                <Column field="status" header="Status" body={(rowData) => renderColumnData(rowData, "status")} />
            </DataTable>
        </div>
    );
}

export default List;
