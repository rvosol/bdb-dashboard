import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FileUpload } from 'primereact/fileupload';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { FileService } from '../../../demo/service/FileService';
import { LayoutContext } from '../../../layout/context/layoutcontext';

function Files() {
    const [files, setFiles] = useState([]);
    const [metrics, setMetrics] = useState([]);
    const [folders, setFolders] = useState([]);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [chartPlugins, setChartPlugins] = useState(null);
    const { layoutConfig } = useContext(LayoutContext);
    const fileUploader = useRef(null);
    const buttonEl = useRef([]);
    const toast = useRef(null);
    const menu = useRef(null);
    const dt = useRef(null);

    const menuItems = [
        { label: 'View', icon: 'pi pi-search' },
        { label: 'Refresh', icon: 'pi pi-refresh' }
    ];

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

    const nameBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center">
                <i className={'text-xl text-primary mr-2 ' + rowData.icon}></i>
                <span>{rowData.name}</span>
            </div>
        );
    };

    const dateBodyTemplate = (rowData) => {
        return <span>{rowData.date}</span>;
    };

    const fileSizeBodyTemplate = (rowData) => {
        return <span>{rowData.fileSize}</span>;
    };

    const uploadBodyCenter = () => {
        return (
            <div className="text-center">
                <Button icon="pi pi-times" className="p-button-danger p-button-text p-button-rounded mr-2"></Button>
                <Button icon="pi pi-search" className="p-button-text p-button-rounded"></Button>
            </div>
        );
    };
    const onFileUploadClick = () => {
        const inputEl = fileUploader.current.getInput();
        inputEl.click();
    };

    const itemTemplate = (file, props) => {
        return (
            <div className="w-full py-3" style={{ cursor: 'copy' }} onClick={onFileUploadClick}>
                <div className="flex flex-wrap gap-5">
                    <div
                        className="h-full relative w-7rem h-7rem border-3 border-transparent border-round hover:bg-primary transition-duration-100 cursor-auto"
                        onMouseEnter={() => onImageMouseOver(file.name)}
                        onMouseLeave={() => onImageMouseLeave(file.name)}
                        style={{ padding: '1px' }}
                    >
                        <img src={file.objectURL} alt={file.name} className="w-full h-full border-round shadow-2" />
                        <Button
                            ref={(element) => buttonEl.current.push(element)}
                            id={file.name}
                            type="button"
                            icon="pi pi-times"
                            className="p-button-rounded hover:flex p-button-primary text-sm absolute justify-content-center align-items-center cursor-pointer"
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

    const emptyTemplate = () => {
        return (
            <div className="w-full py-3" style={{ cursor: 'copy' }} onClick={onFileUploadClick}>
                <div className="h-full flex flex-column justify-content-center align-items-center">
                    <i className="pi pi-upload text-900 text-2xl mb-3"></i>
                    <span className="font-bold text-900 text-xl mb-3">Upload Files</span>
                    <span className="font-medium text-600 text-md text-center">Drop or select files</span>
                </div>
            </div>
        );
    };

    useEffect(() => {
        FileService.getFiles().then((files) => setFiles(files));
        FileService.getMetrics().then((metrics) => setMetrics(metrics));
        FileService.getFoldersLarge().then((folders) => setFolders(folders));
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const chartPlugins = [
            {
                beforeDraw: function (chart) {
                    let ctx = chart.ctx;
                    let width = chart.width;
                    let height = chart.height;
                    let fontSize = 1.5;
                    let oldFill = ctx.fillStyle;

                    ctx.restore();
                    ctx.font = fontSize + 'rem sans-serif';
                    ctx.textBaseline = 'middle';

                    let text = 'Free Space';
                    let text2 = 50 + 'GB / ' + 80 + 'GB';
                    let textX = Math.round((width - ctx.measureText(text).width) / 2);
                    let textY = (height + chart.chartArea.top) / 2.25;

                    let text2X = Math.round((width - ctx.measureText(text).width) / 2.1);
                    let text2Y = (height + chart.chartArea.top) / 1.75;

                    ctx.fillStyle = chart.config.data.datasets[0].backgroundColor[0];
                    ctx.fillText(text, textX, textY);
                    ctx.fillText(text2, text2X, text2Y);
                    ctx.fillStyle = oldFill;
                    ctx.save();
                }
            }
        ];
        const fileChart = {
            datasets: [
                {
                    data: [300, 100],
                    backgroundColor: [documentStyle.getPropertyValue('--primary-600'), documentStyle.getPropertyValue('--primary-100')],
                    hoverBackgroundColor: [documentStyle.getPropertyValue('--primary-700'), documentStyle.getPropertyValue('--primary-200')],
                    borderColor: 'transparent',
                    fill: true
                }
            ]
        };

        const fileChartOptions = {
            animation: {
                duration: 0
            },
            responsive: true,
            maintainAspectRatio: false,
            cutout: '90%',
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            }
        };
        setChartData(fileChart);
        setChartOptions(fileChartOptions);
        setChartPlugins(chartPlugins);
    }, [layoutConfig]);

    return (
        <div className="grid">
            {metrics.map((metric, i) => {
                return (
                    <div key={i} className="col-12 md:col-6 lg:col-3">
                        <div className="card h-full">
                            <div className="flex align-items-center justify-content-between mb-3">
                                <span className="text-900 text-xl font-semibold">{metric.title}</span>
                                <div>
                                    <Button icon={metric.icon} className="p-button-text p-button-sm p-button-rounded" onClick={(event) => menu.current.toggle(event)}></Button>
                                    <Menu ref={menu} popup appendTo="self" model={menuItems}></Menu>
                                </div>
                            </div>
                            <div>
                                <div className={classNames('border-round', metric.color)} style={{ height: '6px' }}>
                                    <div className={classNames('h-full border-round', metric.fieldColor)} style={{ width: '34%' }}></div>
                                </div>
                                <div className="flex align-item-center justify-content-between">
                                    <span className="text-900 mt-3 text-md font-medium">{metric.files}</span>
                                    <span className="text-900 mt-3 text-md font-medium">{metric.fileSize}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div className="col-12 md:col-5 xl:col-3">
                <div className="card">
                    <div className="text-900 text-xl font-semibold mb-3">Account Storage</div>
                    <div className="flex flex-row justify-content-center">
                        <Chart type="doughnut" plugins={chartPlugins} id="country-chart" data={chartData} options={chartOptions} style={{ width: '75%' }}></Chart>
                    </div>
                    <div className="mt-5 flex gap-3">
                        <Button icon="pi pi-search" className="p-button-outlined flex-1" label="Details"></Button>
                        <Button icon="pi pi-upload" className="flex-1" label="Upgrade"></Button>
                    </div>
                </div>

                <div className="card">
                    <div className="text-900 text-xl font-semibold mb-3">Categories</div>
                    <ul className="list-none p-0 m-0">
                        <li className="p-3 mb-3 flex align-items-center justify-content-between cursor-pointer border-round bg-indigo-50 text-indigo-900">
                            <div className="flex align-items-center">
                                <i className="pi pi-image text-2xl mr-3"></i>
                                <span className="ext-lg font-medium">Images</span>
                            </div>
                            <span className="text-lg font-bold">85</span>
                        </li>
                        <li className="p-3 mb-3 flex align-items-center justify-content-between cursor-pointer border-round bg-purple-50 text-purple-900">
                            <div className="flex align-items-center">
                                <i className="pi pi-file text-2xl mr-3"></i>
                                <span className="ext-lg font-medium">Documents</span>
                            </div>
                            <span className="text-lg font-bold">231</span>
                        </li>
                        <li className="p-3 flex align-items-center justify-content-between cursor-pointer border-round bg-teal-50 text-teal-900">
                            <div className="flex align-items-center">
                                <i className="pi pi-video text-2xl mr-3"></i>
                                <span className="ext-lg font-medium">Videos</span>
                            </div>
                            <span className="text-lg font-bold">40</span>
                        </li>
                    </ul>
                </div>

                <div className="card p-0">
                    <Toast ref={toast} key="fu"></Toast>
                    <div className="card">
                        <FileUpload
                            ref={fileUploader}
                            name="demo[]"
                            url="./upload.php"
                            accept="image/*"
                            customUpload
                            multiple
                            auto
                            className="upload-button-hidden w-full"
                            itemTemplate={itemTemplate}
                            emptyTemplate={emptyTemplate}
                            maxFileSize={1000000}
                        />
                    </div>
                </div>
            </div>
            <div className="col-12 md:col-7 xl:col-9">
                <div className="card">
                    <div className="text-900 text-xl font-semibold mb-3">Folders</div>
                    <div className="grid">
                        {folders.map((folder, i) => {
                            return (
                                <div key={i} className="col-12 md:col-6 xl:col-4">
                                    <div className="p-3 border-1 surface-border flex align-items-center justify-content-between hover:surface-100 cursor-pointer border-round">
                                        <div className="flex align-items-center">
                                            <i className={classNames('text-2xl mr-3', folder.icon)}></i>
                                            <span className="text-900 text-lg font-medium">{folder.name}</span>
                                        </div>
                                        <span className="text-600 text-lg font-semibold">{folder.size}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="card">
                    <div className="text-900 text-xl font-semibold mb-3">Recent Uploads</div>
                    <DataTable ref={dt} value={files} paginator rows={8} responsiveLayout="scroll">
                        <Column field="name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column field="date" header="Date" body={dateBodyTemplate} headerClassName="white-space-nowrap" headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column field="fileSize" header="File Size" body={fileSizeBodyTemplate} sortable headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column body={uploadBodyCenter} style={{ width: '10rem' }}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
}

export default Files;
