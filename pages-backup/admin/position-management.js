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
        name: '',
        positionId: '',
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
    const formikRef = useRef();

    console.log(totalRecords)

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/admin/position`, {
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
        formikRef.current.resetForm(); 
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
            let formData = {};
            formData.name = product.name
            formData.positionId = product.positionId
            formData.status = 'active'


            try {
                if (product._id) {
                    // Update existing product/position
                    formData.id = product._id
                    const response = await axiosInstance.patch(`/admin/position`, formData);
                    if (response.data.status === 'success') {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Position Updated', life: 3000 });
                    } else {
                        console.error('Failed to update position');
                    }
                    fetchProducts()
                    hideDialog()
                    setProduct(emptyProduct)
                } else {
                    // Create new product/position
                    const response = await axiosInstance.post('/admin/position', formData);
                    if (response.data.status === 'success') {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Position Created', life: 3000 });
                    } else {
                        console.error('Failed to create position');
                    }
                    fetchProducts()
                    hideDialog()
                    setProduct(emptyProduct)
                }

                // Code to refresh the list of products/positions
                // ...

            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'An error occurred while saving the contact', life: 3000 });
                console.log('An error occurred while saving the position', error?.response?.data?.message);
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
            await axiosInstance.delete(`/admin/position/${product._id}`)
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
                <span className="p-column-title">User Id Id</span>
                {rowData.positionId}
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
                <span className="p-column-title">Name</span>
                {rowData?.name}
            </>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Mobile</span>
                {rowData.mobile}
            </>
        );
    };

    const ratingBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Position</span>
                {rowData?.position}
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
            <h5 className="m-0">Manage Positions</h5>
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
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} positions"
                        // globalFilter={globalFilter}
                        emptyMessage="No positions found."
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
                        {/* <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column> */}
                        {/* <Column field="code" header="Code" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        <Column field="positionId" header="Position ID"  body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>

                        <Column field="name" header="Name" body={priceBodyTemplate} ></Column>

                        <Column field="inventoryStatus" header="Status" body={statusBodyTemplate}  headerStyle={{ minWidth: '10rem' }}></Column>

                        <Column body={actionBodyTemplate} header="Action" headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>


                    <Formik
                        initialValues={product} // Populate initial values with the current product
                        validationSchema={Yup.object({
                            positionId: Yup.string()
                                .required('position Id is required'),
                            name: Yup.string()
                                .required('Name is required')
                            // ... (add more validations as per your requirements)
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            setProduct(values);  // Update the product state with the form values
                            saveProduct();  // Call the existing saveProduct function
                            setSubmitting(false);
                            console.log(values)
                        }}
                        enableReinitialize={true}
                        innerRef={formikRef}
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
                                        header="Position Details"
                                        modal
                                        className="p-fluid"
                                        footer={ProductDialogFooter}
                                        onHide={hideDialog}
                                    >

                                        {console.log(formik.errors.firstName)}
                                        {console.log(formik.touched.firstName)}
                                        {product.image && <img src={`/demo/images/position/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                                        <div className="field">
                                            <label htmlFor="positionId">Position ID</label>
                                            <Field
                                                as={InputText}
                                                id="positionId"
                                                name="positionId"
                                                className={classNames({ 'p-invalid': formik.errors.positionId && formik.touched.positionId })}
                                                onChange={(e) => {
                                                    formik.handleChange(e);  // Handle the change using Formik
                                                    onInputChange(e, 'positionId');  // Also update the existing product state
                                                }}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.errors.positionId && formik.touched.positionId ?
                                                <small className="p-invalid">{formik.errors.positionId}</small> : null}
                                        </div>


                                        <div className="field">
                                            <label htmlFor="name">Name</label>
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
                                            {formik.errors.name && formik.touched.name  ?
                                                <small className="p-invalid">{formik.errors.name}</small> : null}
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
                                    Are you sure you want to delete <b>{product.name}</b>?
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
