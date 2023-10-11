import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../demo/service/ProductService';
import axiosInstance from '../../utils/axiosInstance';

import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';

const Crud = () => {
    let emptyProduct = {
        id: null,
        name: '',
        image: null,
        description: '',
        category: null,
        price: 0,
        quantity: 0,
        rating: 0,
        inventoryStatus: 'INSTOCK'
    };

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(false); // Add loading state to handle loading state
    const [page, setPage] = useState(1); // Add page state to handle current page
    const [limit, setLimit] = useState(10);
    const [file, setFile] = useState(null);
    const [totalRecords, setTotalRecords] = useState(0);

    const toast = useRef(null);
    const dt = useRef(null);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/admin/clients`, {
                params: {
                    page,
                    limit,
                    q: globalFilter || '',
                }
            });

            const data = response.data;
            if (data.status === 'success') {
                setProducts(data.data.docs);
                setTotalRecords(parseInt(data?.data?.totalDocs, 10));
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('An error occurred while fetching products', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {


        fetchProducts();
    }, [globalFilter, page, limit]);



    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = async () => {
        setSubmitted(true);

        if (product.name.trim()) {
            let formData = {}
            formData.clientId = product.clientId
            formData.name = product.name
            formData.barangay = product.barangay
            formData.province = product.province
            formData.city = product.city
            formData.zipCode = product.zipCode
            formData.address = product.address
            formData.contact = product.contact
            formData.status = 'active'

            try {
                if (product._id) {
                    const response = await axiosInstance.patch(`/admin/clients`, formData);
                    if (response.data.status === 'success') {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Client Updated', life: 3000 });
                    } else {
                        console.error('Failed to update Client');
                    }
                    fetchProducts()
                    hideDialog()
                    setProduct(emptyProduct)
                } else {
                    // Create new product/Client
                    const response = await axiosInstance.post('/admin/clients', formData);
                    if (response.data.status === 'success') {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Client Created', life: 3000 });
                    } else {
                        console.error('Failed to create Client');
                    }
                    fetchProducts()
                    hideDialog()
                    setProduct(emptyProduct)
                }

                // Code to refresh the list of products/Client
                // ...

            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'An error occurred while saving the Client', life: 3000 });
                console.log('An error occurred while saving the Client', error?.response?.data?.message);
            }
        }
    };

    const editProduct = (product) => {
        console.log(product)
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = async () => {

        try {
            await axiosInstance.delete(`/admin/clients/${product._id}`)
            let _products = products.filter((val) => val._id !== product._id);
            setProducts(_products);
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'error', detail: 'Failed', life: 3000 });
        }

    };

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...product };
        _product[`${name}`] = val;

        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    {/* <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} /> */}
                </div>
            </React.Fragment>
        );
    };
    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={rowData.photo} alt={rowData.photo} className="shadow-2" width="100" />
            </>
        );
    };

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">barangay</span>
                {rowData?.barangay}
            </>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">province</span>
                {rowData.province}
            </>
        );
    };

    const ratingBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">city</span>
                {rowData?.city}
            </>
        );
    };

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`product-badge status-${rowData?.status?.toLowerCase()}`}>{rowData.status}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Clients</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

    const ProductDialogFooter = (
        <>
            <Button label="Close" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" type="submit" />
        </>
    );

    console.log(product, file, 'product')

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} ></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={limit}
                        lazy
                        totalRecords={totalRecords}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} clients"
                        // globalFilter={globalFilter}
                        emptyMessage="No client found."
                        header={header}
                        responsiveLayout="scroll"
                        loading={loading}
                        onPage={e => {
                            console.log(e, 'pagepagepagepagepagepage')
                            setPage(e.page + 1);
                            setLimit(e.rows);
                        }}
                        first={(page - 1) * limit}
                    >

                        <Column field="clientId" header="clientId" headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        {/* <Column header="Image" body={imageBodyTemplate}></Column> */}
                        <Column field="barangay" header="Country Code" body={priceBodyTemplate} sortable></Column>
                        <Column field="province" header="Province" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="city" header="City" body={ratingBodyTemplate} sortable></Column>
                        <Column field="zipCode" header="ZipCode" sortable></Column>
                        <Column field="address" header="Address" body={ratingBodyTemplate} sortable></Column>
                        <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>


                    <Formik
                        initialValues={product} // Populate initial values with the current product
                        validationSchema={Yup.object({
                            clientId: Yup.string()
                                .required('Client Id is required'),
                            name: Yup.string()
                                .required('Name is required'),
                            barangay: Yup.string()
                                .required('Country Code is required'),
                            province: Yup.string()
                                .required('Province is required'),
                            city: Yup.string()
                                .required('City is required'),
                            zipCode: Yup.string()
                                .required('zipCode is required'),
                            address: Yup.string()
                                .required('Address is required'),
                            contact: Yup.string()
                                .required('Contact is required')
                            // ... (add more validations as per your requirements)
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            setProduct(values);  // Update the product state with the form values
                            saveProduct();  // Call the existing saveProduct function
                            setSubmitting(false);
                            console.log(values)
                        }}
                        enableReinitialize={true}
                    >
                        {formik => {
                            const ProductDialogFooter = (
                                <>
                                    <Button label="Close" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
                                    <Button
                                        label="Save"
                                        icon="pi pi-check"
                                        className="p-button-text"
                                        onClick={formik.handleSubmit}  // Manually trigger the submit event
                                    />
                                </>
                            );
                            return (
                                <Form>



                                    <Dialog
                                        visible={productDialog}
                                        style={{ width: '450px' }}
                                        header="Client Details"
                                        modal
                                        className="p-fluid"
                                        footer={ProductDialogFooter}
                                        onHide={hideDialog}
                                    >

                                        <div className="field">
                                            <label htmlFor="firstName">Client Id</label>
                                            <Field
                                                as={InputText}
                                                id="clientId"
                                                name="clientId"
                                                className={classNames({ 'p-invalid': formik.errors.clientId && formik.touched.clientId })}
                                                onChange={(e) => {
                                                    formik.handleChange(e);  // Handle the change using Formik
                                                    onInputChange(e, 'clientId');  // Also update the existing product state
                                                }}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.errors.clientId ?
                                                <small className="p-invalid">{formik.errors.clientId}</small> : null}
                                        </div>


                                        <div className="field">
                                            <label htmlFor="name"> Name</label>
                                            <Field
                                                as={InputText}
                                                id="name"
                                                name="name"
                                                className={classNames({ 'p-invalid': formik.errors.name && formik.touched.name })}
                                                onChange={(e) => {
                                                    formik.handleChange(e);  // Handle the change using Formik
                                                    onInputChange(e, 'name');  // Also update the existing product state
                                                }}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.errors.name ?
                                                <small className="p-invalid">{formik.errors.name}</small> : null}
                                        </div>

                                        <div className="field">
                                            <label htmlFor="barangay">Barangay</label>
                                            <Field
                                                as={InputText}
                                                id="barangay"
                                                name="barangay"
                                                className={classNames({ 'p-invalid': formik.errors.barangay && formik.touched.barangay })}
                                                onChange={(e) => {
                                                    formik.handleChange(e);  // Handle the change using Formik
                                                    onInputChange(e, 'barangay');  // Also update the existing product state
                                                }}
                                            />

                                            {formik.errors.barangay ?
                                                <small className="p-invalid">{formik.errors.barangay}</small> : null}
                                        </div>


                                        <div className="field">
                                            <label htmlFor="province">Province</label>
                                            <Field
                                                as={InputText}
                                                id="province"
                                                name="province"
                                                className={classNames({ 'p-invalid': formik.errors.province && formik.touched.province })}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    onInputChange(e, 'province');
                                                }}
                                            />
                                            {formik.errors.province ?
                                                <small className="p-invalid">{formik.errors.province}</small> : null}
                                        </div>

                                        <div className="field">
                                            <label htmlFor="city">City</label>
                                            <Field
                                                as={InputText}
                                                id="city"
                                                name="city"
                                                className={classNames({ 'p-invalid': formik.errors.city && formik.touched.city })}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    onInputChange(e, 'city');
                                                }}
                                            />
                                            {formik.errors.city ?
                                                <small className="p-invalid">{formik.errors.city}</small> : null}
                                        </div>


                                        <div className="field">
                                            <label htmlFor="zipCode">zipCode</label>
                                            <Field
                                                as={InputText}
                                                id="zipCode"
                                                name="zipCode"
                                                className={classNames({ 'p-invalid': formik.errors.zipCode && formik.touched.zipCode })}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    onInputChange(e, 'zipCode');
                                                }}
                                            />
                                            {formik.errors.zipCode ?
                                                <small className="p-invalid">{formik.errors.zipCode}</small> : null}
                                        </div>

                                        <div className="field">
                                            <label htmlFor="address">Address</label>
                                            <Field
                                                as={InputText}
                                                id="address"
                                                name="address"
                                                className={classNames({ 'p-invalid': formik.errors.address && formik.touched.address })}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    onInputChange(e, 'address');
                                                }}
                                            />

                                            {formik.errors.address ?
                                                <small className="p-invalid">{formik.errors.address}</small> : null}
                                        </div>

                                        <div className="field">
                                            <label htmlFor="contact">Contact</label>
                                            <Field
                                                as={InputText}
                                                id="contact"
                                                name="contact"
                                                className={classNames({ 'p-invalid': formik.errors.contact && formik.touched.contact })}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    onInputChange(e, 'contact');
                                                }}
                                            />

                                            {formik.errors.contact ?
                                                <small className="p-invalid">{formik.errors.contact}</small> : null}
                                        </div>



                                    </Dialog>
                                </Form>
                            )
                        }}
                    </Formik>
                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.firstName}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>

            <style jsx>{`
    .p-fileupload-row {
        display: none;
        align-items: center;
    }
`}</style>
        </div>


    );
};

export default Crud;
