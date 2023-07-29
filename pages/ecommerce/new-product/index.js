import { Button } from 'primereact/button';
import { Chip } from 'primereact/chip';
import { Dropdown } from 'primereact/dropdown';
import { Editor } from 'primereact/editor';
import { FileUpload } from 'primereact/fileupload';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import React, { useRef, useState } from 'react';

function NewProduct() {
    const [colorOptions] = useState([
        { name: 'Black', background: 'bg-gray-900' },
        { name: 'Orange', background: 'bg-orange-500' },
        { name: 'Navy', background: 'bg-blue-500' }
    ]);
    const [product, setProduct] = useState({
        name: '',
        price: '',
        code: '',
        sku: '',
        status: 'Draft',
        tags: ['Nike', 'Sneaker'],
        category: 'Sneakers',
        colors: [],
        stock: 'Sneakers',
        inStock: true,
        description: '',
        images: []
    });
    const [selectedCategory, setSelectedCategory] = useState(product.category);
    const [selectedStock, setSelectedStock] = useState(product.category);
    const categoryOptions = ['Sneakers', 'Apparel', 'Socks'];

    const fileUploader = useRef(null);
    const buttonEl = useRef([]);

    const chipTemplate = (tag) => {
        return (
            <React.Fragment>
                <span className="mr-3">{tag}</span>
                <span className="chip-remove-icon flex align-items-center justify-content-center border-1 surface-border bg-gray-100 border-circle cursor-pointer" onClick={() => onChipRemove(tag)}>
                    <i className="pi pi-fw pi-times text-black-alpha-60"></i>
                </span>
            </React.Fragment>
        );
    };

    const onImageMouseOver = (fileName) => {
        buttonEl.current.forEach((el, i) => {
            if (el.id === fileName) buttonEl.current[i].style.display = 'flex';
        });
    };

    const onImageMouseLeave = (fileName) => {
        buttonEl.current.forEach((el, i) => {
            if (el.id === fileName) {
                buttonEl.current[i].style.display = 'none';
            }
        });
    };

    const onChipRemove = (item) => {
        const newTags = product.tags.filter((i) => i !== item);
        setProduct((prevState) => ({ ...prevState, tags: newTags }));
    };

    const onColorSelect = (colorName) => {
        if (product.colors.indexOf(colorName) !== -1) {
            product.colors.splice(product.colors.indexOf(colorName), 1);
            setProduct((prevState) => ({ ...prevState, colors: prevState.colors.filter((color) => color.name !== colorName) }));
        } else {
            setProduct((prevState) => ({ ...prevState, colors: [...prevState.colors, colorName] }));
        }
    };

    const onUpload = (event) => {
        for (let file of event.files) {
            setProduct((prevState) => ({ ...prevState, images: Array.from(prevState.images).push(file) }));
        }
    };

    const onFileUploadClick = () => {
        const inputEl = fileUploader.current.getInput();
        inputEl.click();
    };

    const emptyTemplate = () => {
        return (
            <div className="h-15rem overflow-y-auto py-3 border-round" style={{ cursor: 'copy' }}>
                <div className="flex flex-column w-full h-full justify-content-center align-items-center" onClick={onFileUploadClick}>
                    <i className="pi pi-file text-4xl text-primary"></i>
                    <span className="block font-semibold text-900 text-lg mt-3">Drop or select images</span>
                </div>
            </div>
        );
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="flex h-15rem overflow-y-auto py-3 border-round" style={{ cursor: 'copy' }} onClick={onFileUploadClick}>
                <div className="flex flex-row flex-wrap gap-3 border-round">
                    <div
                        className="h-full relative w-7rem h-7rem border-3 border-transparent border-round hover:bg-primary transition-duration-100 cursor-auto"
                        onMouseEnter={() => onImageMouseOver(file.name)}
                        onMouseLeave={() => onImageMouseLeave(file.name)}
                        style={{ padding: '1px' }}
                    >
                        <img src={file.objectURL} className="w-full h-full border-round shadow-2" alt={file.name} />
                        <Button
                            ref={(element) => buttonEl.current.push(element)}
                            id={file.name}
                            type="button"
                            icon="pi pi-times"
                            className="p-button-rounded hover:flex p-button-primary text-sm absolute justify-content-center align-items-center cursor-pointer w-2rem h-2rem"
                            style={{ top: '-10px', right: '-10px', display: 'none' }}
                            onClick={(event) => {
                                event.stopPropagation();
                                props.onRemove();
                            }}
                        ></Button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="card">
            <span className="block text-900 font-bold text-xl mb-4">Create Product</span>
            <div className="grid grid-nogutter flex-wrap gap-3 p-fluid">
                <div className="col-12 lg:col-8">
                    <div className="grid formgrid">
                        <div className="col-12 field">
                            <InputText type="text" value={product.name} onChange={(e) => setProduct((prevState) => ({ ...prevState, name: e.target.value }))} placeholder="Product Name" label="Product Name" />
                        </div>
                        <div className="col-12 lg:col-4 field">
                            <InputText type="text" placeholder="Price" label="Price" value={product.price} onChange={(e) => setProduct((prevState) => ({ ...prevState, price: e.target.value }))} />
                        </div>
                        <div className="col-12 lg:col-4 field">
                            <InputText type="text" placeholder="Product Code" label="Product Code" value={product.code} onChange={(e) => setProduct((prevState) => ({ ...prevState, code: e.target.value }))} />
                        </div>
                        <div className="col-12 lg:col-4 field">
                            <InputText type="text" placeholder="Product SKU" label="SKU" value={product.sku} onChange={(e) => setProduct((prevState) => ({ ...prevState, sku: e.target.value }))} />
                        </div>
                        <div className="col-12 field">
                            <Editor value={product.description} style={{ height: '250px' }}></Editor>
                        </div>
                        <div className="col-12 field">
                            <FileUpload
                                ref={fileUploader}
                                name="demo[]"
                                url="./upload.php"
                                itemTemplate={itemTemplate}
                                emptyTemplate={emptyTemplate}
                                onUpload={onUpload}
                                customUpload={true}
                                multiple
                                onSelect={onUpload}
                                accept="image/*"
                                auto
                                className={'upload-button-hidden border-1 surface-border surface-card border-round'}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full lg:w-3 xl:w-4 flex flex-column row-gap-3">
                    <div className="border-1 surface-border border-round">
                        <span className="text-900 font-bold block border-bottom-1 surface-border p-3">Publish</span>
                        <div className="p-3">
                            <div className="bg-gray-100 py-2 px-3 flex align-items-center border-round">
                                <span className="text-black-alpha-90 font-bold mr-3">Status:</span>
                                <span className="text-black-alpha-60 font-semibold">{product.status}</span>
                                <Button type="button" icon="pi pi-fw pi-pencil" className="p-button-rounded p-button-text text-black-alpha-60 ml-auto"></Button>
                            </div>
                        </div>
                    </div>

                    <div className="border-1 surface-border border-round">
                        <span className="text-900 font-bold block border-bottom-1 surface-border p-3">Tags</span>
                        <div className="p-3 flex flex-wrap gap-1">
                            {product.tags.map((tag, i) => {
                                return <Chip key={i} className="mr-2 py-2 px-3 text-900 font-bold surface-card border-1 surface-border" style={{ borderRadius: '20px' }} template={chipTemplate(tag)} />;
                            })}
                        </div>
                    </div>

                    <div className="border-1 surface-border border-round">
                        <span className="text-900 font-bold block border-bottom-1 surface-border p-3">Category</span>
                        <div className="p-3">
                            <Dropdown options={categoryOptions} value={selectedCategory} onChange={(e) => setSelectedCategory(e.value)} placeholder="Select a category"></Dropdown>
                        </div>
                    </div>

                    <div className="border-1 surface-border border-round">
                        <span className="text-900 font-bold block border-bottom-1 surface-border p-3">Colors</span>
                        <div className="p-3 flex">
                            {colorOptions.map((color, i) => {
                                return (
                                    <div
                                        key={i}
                                        className={classNames('w-2rem h-2rem mr-2 border-1 surface-border border-circle cursor-pointer flex justify-content-center align-items-center', color.background)}
                                        onClick={() => {
                                            onColorSelect(color.name, i);
                                        }}
                                    >
                                        {product.colors.includes(color.name) ? <i key={i} className="pi pi-check text-sm text-white z-5"></i> : null}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="border-1 surface-border border-round">
                        <span className="text-900 font-bold block border-bottom-1 surface-border p-3">Stock</span>
                        <div className="p-3">
                            <Dropdown options={categoryOptions} value={selectedStock} onChange={(e) => setSelectedStock(e.value)} placeholder="Select stock"></Dropdown>
                        </div>
                    </div>

                    <div className="border-1 surface-border flex justify-content-between align-items-center py-2 px-3 border-round">
                        <span className="text-900 font-bold p-3">In stock</span>
                        <InputSwitch checked={product.inStock} onChange={(e) => setProduct((prevState) => ({ ...prevState, inStock: e.value }))}></InputSwitch>
                    </div>

                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center gap-3 py-2">
                        <Button className="p-button-danger flex-1 p-button-outlined" label="Discard" icon="pi pi-fw pi-trash"></Button>
                        <Button className="p-button-primary flex-1 border-round" label="Save" icon="pi pi-fw pi-check"></Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewProduct;
