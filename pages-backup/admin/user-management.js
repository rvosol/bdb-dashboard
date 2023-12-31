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
// import Select from 'react-select';
import { Dropdown } from 'primereact/dropdown';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
const Crud = () => {
    let emptyProduct = {
        employeeId: '',
        firstName: '',
        lastName: '',
        email: '',
        middleName: '',
        nickName: '',
        phone: '',
        mobile: '',
        department: '',
        position: '',
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
    const [departments, setDepartments] = useState([])
    const [positions, setPositions] = useState([])

    const toast = useRef(null);
    const dt = useRef(null);
    const formikRef = useRef();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/admin/subAdmin`, {
                params: {
                    page,
                    limit,
                    q: globalFilter || '',
                }
            });

            const responseD = await axiosInstance.get(`/admin/department`);
            const responseP = await axiosInstance.get(`/admin/position`);
            setDepartments(responseD?.data?.data?.docs)
            setPositions(responseP?.data?.data?.docs)
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

        if (product.firstName.trim()) {
            let formData = new FormData();
            formData.append('firstName', product.firstName);
            formData.append('lastName', product.lastName);
            formData.append('middleName', product.middleName);
            formData.append('nickName', product.nickName);
            formData.append('email', product.email);
            formData.append('phone', product.phone);
            formData.append('mobile', product.mobile);
            formData.append('department', product.department);
            formData.append('position', product.position);
            formData.append('employeeId', product.employeeId);
            formData.append('status', 'active');
            formData.append('role', 'admin');
            if (file) {
                formData.append('photo', file);
            }

            try {
                if (product._id) {
                    // Update existing product/User
                    formData.append('id', product._id);
                    const response = await axiosInstance.patch(`/admin/subAdmin`, formData);
                    if (response.data.status === 'success') {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
                    } else {
                        console.error('Failed to update User');
                    }
                    fetchProducts()
                    hideDialog()
                    setProduct(emptyProduct)
                } else {
                    // Create new product/User
                    const response = await axiosInstance.post('/admin/subAdmin', formData);
                    if (response.data.status === 'success') {
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
                    } else {
                        console.error('Failed to create User');
                    }
                    fetchProducts()
                    hideDialog()
                    setProduct(emptyProduct)
                }

                // Code to refresh the list of products/position
                // ...

            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'An error occurred while saving the Users', life: 3000 });
              
            }
        }
    };

    const editProduct = (product) => {
       
        setProduct({ ...product, department: product?.department?._id, position: product?.position?._id });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = async () => {

        try {
            await axiosInstance.delete(`/admin/subAdmin/${product._id}`)
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
                {rowData.firstName}
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
                <span className="p-column-title">Email</span>
                {rowData?.email}
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
                {rowData?.position?.name}
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
            <h5 className="m-0">Manage Users</h5>
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

    const [passwordEmailSending,setPasswordEmailSending] = useState(false)
    const handlePasswordReset = (userData) => {
        setPasswordEmailSending(true)
        

        axiosInstance
          .patch(`admin/subAdmin/passwordReset/send/${userData._id}`, {})
          .then((response) => {})
          .catch((err) => {
            console.error(err?.response?.data?.error);
          }).finally(() => {
              setPasswordEmailSending(false);
          });
    };
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
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
                        // globalFilter={globalFilter}
                        emptyMessage="No position found."
                        header={header}
                        responsiveLayout="scroll"
                        loading={loading}
                        onPage={e => {
                            setPage(e.page + 1);
                            setLimit(e.rows);
                        }}
                        first={(page - 1) * limit}
                    >
                        <Column header="User ID" field='employeeId'></Column>
                        {/* <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column> */}
                        {/* <Column field="code" header="Code" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        <Column field="firstName" header="First Name" body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Image" body={imageBodyTemplate}></Column>
                        <Column field="email" header="Email" body={priceBodyTemplate} ></Column>
                        <Column field="mobile" header="Mobile" body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="position" header="Position" body={ratingBodyTemplate} ></Column>
                        <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>


                    <Formik
                        initialValues={product} // Populate initial values with the current product
                        validationSchema={Yup.object({
                            employeeId: Yup.string()
                                .required('User Id is required'),
                            firstName: Yup.string()
                                .required('First Name is required'),
                            lastName: Yup.string()
                                .required('Last Name is required'),
                            email: Yup.string()
                                .email('Invalid email address')
                                .required('Email is required'),
                            middleName: Yup.string()
                                .required('Middle Name is required'),
                            nickName: Yup.string()
                                .required('Nick Name is required'),
                            phone: Yup.string()
                                .required('Phone  is required'),
                            mobile: Yup.string()
                                .required('Mobile is required'),
                            department: Yup.string()
                                .required('Department is required'),
                            position: Yup.string()
                                .required('Position is required'),
                            // ... (add more validations as per your requirements)
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            setProduct(values);  // Update the product state with the form values
                            saveProduct();  // Call the existing saveProduct function
                            setSubmitting(false);
                        }}
                        enableReinitialize={true}
                        innerRef={formikRef}
                    >
                        {formik => {
                            const ProductDialogFooter = (
                              <>
                                <Button
                                  label= {passwordEmailSending? "Processing" :"Password Reset"} 
                                  icon="pi pi-envelope"
                                  className="p-button-text"
                                  onClick={()=>{handlePasswordReset(formik?.initialValues);}} // Manually trigger the submit event
                                />
                                <Button
                                  label="Close"
                                  icon="pi pi-times"
                                  className="p-button-text"
                                  onClick={hideDialog}
                                />
                                <Button
                                  label="Save"
                                  icon="pi pi-check"
                                  className="p-button-text"
                                  onClick={formik.handleSubmit} // Manually trigger the submit event
                                />
                              </>
                            );
                            return (
                                <Form>


                                    <Dialog
                                        visible={productDialog}
                                        style={{ width: '450px' }}
                                        header="User Details"
                                        modal
                                        className="p-fluid"
                                        footer={ProductDialogFooter}
                                        onHide={hideDialog}
                                    >
                                        {product.image && <img src={`/demo/images/User/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                                        <div className="field">
                                            <label htmlFor="firstName">User Id</label>
                                            <Field
                                                as={InputText}
                                                id="employeeId"
                                                name="employeeId"
                                                className={classNames({ 'p-invalid': formik.errors.employeeId && formik.touched.employeeId })}
                                                onChange={(e) => {
                                                    formik.handleChange(e);  // Handle the change using Formik
                                                    onInputChange(e, 'employeeId');  // Also update the existing product state
                                                }}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.errors.employeeId && formik.touched.employeeId ?
                                                <small className="p-invalid">{formik.errors.employeeId}</small> : null}
                                        </div>


                                        <div className="field">
                                            <label htmlFor="firstName">First Name</label>
                                            <Field
                                                as={InputText}
                                                id="firstName"
                                                name="firstName"
                                                className={classNames({ 'p-invalid': formik.errors.firstName && formik.touched.firstName })}
                                                onChange={(e) => {
                                                    formik.handleChange(e);  // Handle the change using Formik
                                                    onInputChange(e, 'firstName');  // Also update the existing product state
                                                }}
                                                onBlur={formik.handleBlur}
                                            />
                                            {formik.errors.firstName && formik.touched.firstName ?
                                                <small className="p-invalid">{formik.errors.firstName}</small> : null}
                                        </div>

                                        <div className="field">
                                            <label htmlFor="firstName">Last Name</label>
                                            <Field
                                                as={InputText}
                                                id="lastName"
                                                name="lastName"
                                                className={classNames({ 'p-invalid': formik.errors.lastName && formik.touched.lastName })}
                                                onChange={(e) => {
                                                    formik.handleChange(e);  // Handle the change using Formik
                                                    onInputChange(e, 'lastName');  // Also update the existing product state
                                                }}
                                            />

                                            {formik.errors.lastName && formik.touched.lastName ?
                                                <small className="p-invalid">{formik.errors.lastName}</small> : null}
                                        </div>


                                        <div className="field">
                                            <label htmlFor="middleName">Middle Name</label>
                                            <Field
                                                as={InputText}
                                                id="middleName"
                                                name="middleName"
                                                className={classNames({ 'p-invalid': formik.errors.middleName && formik.touched.middleName })}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    onInputChange(e, 'middleName');
                                                }}
                                            />
                                            {formik.errors.middleName && formik.touched.middleName ?
                                                <small className="p-invalid">{formik.errors.middleName}</small> : null}
                                        </div>

                                        <div className="field">
                                            <label htmlFor="nickName">Nick Name</label>
                                            <Field
                                                as={InputText}
                                                id="nickName"
                                                name="nickName"
                                                className={classNames({ 'p-invalid': formik.errors.nickName && formik.touched.nickName })}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    onInputChange(e, 'nickName');
                                                }}
                                            />
                                            {formik.errors.nickName && formik.touched.nickName ?
                                                <small className="p-invalid">{formik.errors.nickName}</small> : null}
                                        </div>

                                        {/* ... (add more fields as per your requirements) */}

                                        <div className="field">
                                            <label htmlFor="email">Email</label>
                                            <Field
                                                as={InputText}
                                                id="email"
                                                name="email"
                                                className={classNames({ 'p-invalid': formik.errors.email && formik.touched.email })}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    onInputChange(e, 'email');
                                                }}
                                            />
                                            {formik.errors.email && formik.touched.email ?
                                                <small className="p-invalid">{formik.errors.email}</small> : null}
                                        </div>

                                        <div className="field">
                                            <label htmlFor="phone">Phone</label>
                                            <Field
                                                as={InputText}
                                                id="phone"
                                                name="phone"
                                                className={classNames({ 'p-invalid': formik.errors.phone && formik.touched.phone })}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    onInputChange(e, 'phone');
                                                }}
                                            />

                                            {formik.errors.phone && formik.touched.phone ?
                                                <small className="p-invalid">{formik.errors.phone}</small> : null}
                                        </div>

                                        <div className="field">
                                            <label htmlFor="mobile">Mobile</label>
                                            <Field
                                                as={InputText}
                                                id="mobile"
                                                name="mobile"
                                                className={classNames({ 'p-invalid': formik.errors.mobile && formik.touched.mobile })}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    onInputChange(e, 'mobile');
                                                }}
                                            />

                                            {formik.errors.mobile && formik.touched.mobile ?
                                                <small className="p-invalid">{formik.errors.mobile}</small> : null}
                                        </div>

                                        <div className="field">
                                            <label htmlFor="department">Department</label>
                                            <Dropdown
                                                id="department"
                                                value={formik.values.department}
                                                options={departments.map(dept => ({ label: dept.name, value: dept._id }))}
                                                className={classNames("w-full ", { 'p-invalid': formik.errors.department && formik.touched.department })}
                                                onChange={(e) => {
                                                    formik.setFieldValue('department', e.value); // set the value in formik
                                                    onInputChange({ target: { value: e.value, name: 'department' } }, 'department');  // Also update the existing product state with new department id
                                                }}
                                                optionLabel="label"
                                                placeholder="Select a Department"
                                            />
                                            {formik.errors.department && formik.touched.department ?
                                                <small className="p-invalid">{formik.errors.department}</small> : null}
                                        </div>





                                        <div className="field">
                                            <label htmlFor="position">Position</label>
                                            <Dropdown
                                                id="position"
                                                value={formik.values.position}
                                                options={positions.map(dept => ({ label: dept.name, value: dept._id }))}
                                                className={classNames("w-full ", { 'p-invalid': formik.errors.position && formik.touched.position })}
                                                onChange={(e) => {
                                                    formik.setFieldValue('position', e.value); // set the value in formik
                                                    onInputChange({ target: { value: e.value, name: 'position' } }, 'position');  // Also update the existing product state with new position id
                                                }}
                                                optionLabel="label"
                                                placeholder="Select a position"
                                            />
                                            {formik.errors.position && formik.touched.position ?
                                                <small className="p-invalid">{formik.errors.position}</small> : null}
                                        </div>

                                        {!file && product._id && product.photo && (
                                            <div className="existing-image">
                                                <img src={product.photo} alt="Existing" width="100" />
                                                {/* <span>Current Photo</span> */}
                                            </div>
                                        )}
                                        <div className="field">
                                            <label htmlFor="photo">Photo</label>
                                            <FileUpload
                                                name="photo"
                                                onSelect={(e) => {
                                                    formik.setFieldValue('photo', e.files[0]);
                                                    setFile(e.files[0]);
                                                    if (product._id) { // Check if it is edit mode
                                                        let _product = { ...product };
                                                        _product.photo = URL.createObjectURL(e.files[0]); // Update the photo URL to display the newly selected image
                                                        setProduct(_product);
                                                    }
                                                }}
                                                accept="image/*"
                                                maxFileSize={1000000}
                                            />
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
