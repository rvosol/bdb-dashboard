import React, { useState, useRef, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { classNames } from 'primereact/utils';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { Avatar } from 'primereact/avatar';
import { Column } from 'primereact/column';
import { Tooltip } from 'primereact/tooltip';
import { CalendarContext } from './context/calendarcontext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import axiosInstance from '../../../../utils/axiosInstance';

function AppCalendarTable(props) {
    const { pagination, setPagination, loading, setSearchQuery, searchQuery } = props
    const [calendarEntry, setCalendarEntry] = useState(null);
    const [selectedEntries, setSelectedEntries] = useState([]);
    const [filters, setFilters] = useState({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [deleteCalendarDialog, setDeleteCalendarDialog] = useState(false);
    const [calendarToDelete, setCalendarToDelete] = useState(null);

    const [cloneCalendarDialog, setCloneCalendarDialog] = useState(false);
    const [calendarToClone, setCalendarToClone] = useState(null);

    const confirmDeleteCalendar = (calendar) => {
        setCalendarToDelete(calendar);
        setDeleteCalendarDialog(true);
    };
    const { toastRef } = useContext(CalendarContext); // Update to use CalendarContext
    const menu = useRef(null);
    const dt = useRef(null);
    const router = useRouter();

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);

        setGlobalFilterValue(value);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            representative: { value: null, matchMode: FilterMatchMode.IN },
            date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
            verified: { value: null, matchMode: FilterMatchMode.EQUALS }
        });
        setGlobalFilterValue('');
    };

    const menuItems = [
        {
            label: 'Archive',
            icon: 'pi pi-fw pi-file',
            command: () => handleArchiveMultiple()
        },
        {
            label: 'Spam',
            icon: 'pi pi-fw pi-ban',
            command: () => handleSpamMultiple()
        },
        {
            label: 'Delete',
            icon: 'pi pi-fw pi-trash',
            command: () => handleDeleteMultiple()
        }
    ];

    const onRowSelect = (id) => {
        router.push('/apps/mail/detail/' + id);
    };

    const handleStar = (event, id) => {
        event.stopPropagation();
        onStar(id);
    };

    const handleArchive = (event, id) => {
        event.stopPropagation();
        onArchive(id);
        toastRef.current.show({
            severity: 'info',
            summary: 'Info',
            detail: 'Mail archived',
            life: 3000
        });
    };

    const handleBookmark = (event, id) => {
        event.stopPropagation();
        onBookmark(id);
    };

    const handleDelete = (id) => {
        onDelete(id);
        toastRef.current.show({
            severity: 'info',
            summary: 'Info',
            detail: 'Mail deleted',
            life: 3000
        });
    };

    const handleDeleteMultiple = () => {
        if (selectedMails && selectedMails.length > 0) {
            onDeleteMultiple(selectedMails);
            toastRef.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Mails deleted',
                life: 3000
            });
        }
    };

    const handleSpamMultiple = () => {
        if (selectedMails && selectedMails.length > 0) {
            onSpamMultiple(selectedMails);
            toastRef.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Moved to spam',
                life: 3000
            });
        }
    };

    const handleArchiveMultiple = () => {
        if (selectedMails && selectedMails.length > 0) {
            onArchiveMultiple(selectedMails);
            toastRef.current.show({
                severity: 'info',
                summary: 'Info',
                detail: 'Moved to archive',
                life: 3000
            });
        }
    };

    useEffect(() => {
        initFilters();
    }, []);

    const handleTrash = (event, mail) => {
        event.stopPropagation();
        if (mail.trash) {
            handleDelete(mail.id);
        }
        onTrash(mail.id);
    };

    const handleReply = (event, mail) => {
        event.stopPropagation();
        setMail(mail);
        setDialogVisible(true);
    };

    const actionSearchTemplate = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            {/* <h5 className="m-0">Manage Calenders</h5> */}
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText id="search" type="search" value={searchQuery} onChange={(e) => {
                    setSearchQuery(e.target.value)
                }} placeholder="Search Calender..." />
            </span>
        </div>
        // <div className="flex -ml-2">
        //     <span className="p-input-icon-left">
        //         <i className="pi pi-search"></i>
        //         <InputText id="search" placeholder="Search Calendar" className="w-full sm:w-auto" value={searchQuery} onChange={(e) => {
        //             console.log(e.target.value)
        //             setSearchQuery(e.target.value)
        //         }} />
        //     </span>
        //     {/* <Button type="button" icon="pi pi-refresh" rounded text className="p-button-plain"></Button> */}
        //     {/* <Button type="button" icon="pi pi-ellipsis-v" rounded text className="p-button-plain ml-3" onClick={(event) => menu.current?.toggle(event)}></Button>
        //     <Menu ref={menu} popup model={menuItems}></Menu> */}
        // </div>
    );

    const actionsBodyTemplate = (mail) => {
        return (
            <>
                {/* {!mail.trash && !mail.spam ? (
                    <div className="flex">
                        <span style={{ width: '4rem' }} onClick={(e) => handleStar(e, mail.id)} onTouchEnd={(e) => handleStar(e, mail.id)} className="cursor-pointer">
                            <i
                                className={classNames('pi pi-fw text-xl', {
                                    'pi-star-fill': mail.starred,
                                    'pi-star': !mail.starred
                                })}
                            ></i>
                        </span>

                        <span onClick={(e) => handleBookmark(e, mail.id)} onTouchEnd={(e) => handleBookmark(e, mail.id)} className="cursor-pointer">
                            <i
                                className={classNames('pi pi-fw text-xl', {
                                    'pi-bookmark-fill': mail.important,
                                    'pi-bookmark': !mail.important
                                })}
                            ></i>
                        </span>
                    </div>
                ) : null} */}
            </>
        );
    };

    const avatarBodyTemplate = (mail) => {
        const folder = mail.image ? 'demo' : 'layout';
        const imageName = mail.image ? mail.image : 'avatar.png';
        return <Avatar image={`/${folder}/images/avatar/${imageName}`} onClick={(e) => onRowSelect(mail.id)}></Avatar>;
    };

    const authorBodyTemplate = (mail) => {
        return (
            <div className="text-900 font-semibold" onClick={(e) => onRowSelect(mail.id)} style={{ minWidth: '12rem' }}>
                {mail.from || mail.to}
            </div>
        );
    };

    const titleBodyTemplate = (mail) => {
        return (
            <span className="font-medium white-space-nowrap overflow-hidden text-overflow-ellipsis block" onClick={(e) => onRowSelect(mail.id)} style={{ maxWidth: '30rem', minWidth: '12rem' }}>
                {mail.title}
            </span>
        );
    };

    const onRowMouseEnter = (event) => {
        event.originalEvent.preventDefault();
        const id = event.index;
        const dateEl = document.getElementById(`${id}-date`);
        const optsEl = document.getElementById(`${id}-options`);
        optsEl.style.display = 'flex';
        dateEl.style.display = 'none';
    };

    const onRowMouseLeave = (event) => {
        event.originalEvent.preventDefault();
        const id = event.index;
        const dateEl = document.getElementById(`${id}-date`);
        const optsEl = document.getElementById(`${id}-options`);

        optsEl.style.display = 'none';
        dateEl.style.display = 'flex';
    };

    

    const dateBodyTemplate = (mail, columnOptions) => {
        return (
            <div className="cursor-pointer" >
                <div className="flex  w-full px-0">
                    <span id={columnOptions.rowIndex.toString() + '-date'} className="text-700 font-semibold white-space-nowrap">
                        {mail.createdAt}
                    </span>
                    <div id={columnOptions.rowIndex.toString() + '-options'} style={{ display: 'none' }}>
                        {/* <Button type="button" tooltip="Archive" tooltipOptions={{ position: 'top' }} icon="pi pi-inbox" className="h-2rem w-2rem mr-2" onClick={(event) => handleArchive(event, mail.id)}></Button>
                        <Button type="button" tooltip="Reply" tooltipOptions={{ position: 'top' }} icon="pi pi-reply" className="p-button-secondary h-2rem w-2rem mr-2" onClick={(event) => handleReply(event, mail)}></Button> */}
                        <Button type="button" tooltip="Trash" tooltipOptions={{ position: 'top' }} icon="pi pi-trash" className="p-button-danger h-2rem w-2rem" onClick={(event) => confirmDeleteCalendar(mail)}></Button>
                    </div>
                </div>
            </div>
        );
    };
    const deleteCalendar = async () => {
        setDeleteCalendarDialog(false);
        setCalendarToDelete(null);
        try {
            await axiosInstance.delete(`/admin/calendar/${calendarToDelete._id}`)
            setDeleteCalendarDialog(false);
            setCalendarToDelete(null);
            setSearchQuery(' ')
            toastRef.current.show({ severity: 'success', summary: 'Successful', detail: `${calendarToDelete.title} Calendar Deleted`, life: 3000 });
        } catch (err) {
            toastRef.current.show({ severity: 'error', summary: 'error', detail: 'Failed', life: 3000 });
        }
    };

    const cloneCalendar = async (calendar) => {
       
        
        try {
            await axiosInstance.patch(`/admin/calendar/importCalendar/${calendar._id}`)
            setSearchQuery(' ')
            toastRef.current.show({ severity: 'success', summary: 'Successful', detail: `${calendar.title} Calendar Cloned`, life: 3000 });
        } catch (err) {
            toastRef.current.show({ severity: 'error', summary: 'error', detail: 'Failed', life: 3000 });
        }
    };

    const handleEditCalendar = (calendar) => {
        router.push(`/apps/calendar/create/${calendar._id}`);
    };

    const deleteCalendarDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setDeleteCalendarDialog(false)} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteCalendar} />
        </>
    );

    const cloneCalendarDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => setCloneCalendarDialog(false)} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={cloneCalendar} />
        </>
    );

    

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-clone" tooltip="Clone" tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 25 }} className="p-button-rounded p-button-secondary mr-2" onClick={()=> cloneCalendar(rowData)} />
                <Button icon="pi pi-pencil" tooltip="Edit" tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 25 }} className="p-button-rounded p-button-warning mr-2" onClick={() => handleEditCalendar(rowData)}  />
                <Button icon="pi pi-trash" tooltip="Delete" tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 25 }} className="p-button-rounded p-button-danger" onClick={()=> confirmDeleteCalendar(rowData)} />
            </>
        );
    };




    return (
        <React.Fragment>
            <DataTable
                ref={dt}
                dataKey="id"
                value={props.calendars}
                filters={filters}
                globalFilterFields={['title', 'description']}
                emptyMessage="No calendar entries found."
                responsiveLayout="scroll"
                lazy
                rows={pagination?.limit}
                totalRecords={pagination?.totalDocs}
                paginator
                // rowHover
                // onRowMouseEnter={onRowMouseEnter}
                // onRowMouseLeave={onRowMouseLeave}
                rowsPerPageOptions={[10, 20, 30]}
                selection={selectedEntries}
                onSelectionChange={(e) => setSelectedEntries(e.value)}
                onPage={e => {
                    setPagination({
                        ...pagination,
                        page: e.page + 1,
                        limit: e.rows
                    })
                }}
                first={(pagination?.page - 1) * pagination?.limit}
                loading={loading}
                header={actionSearchTemplate}
            >
                {/* <Column header={actionHeaderTemplate} body={actionsBodyTemplate} style={{ width: '8rem' }}></Column> */}
                <Column  field="title" header="Title" ></Column>
                <Column field="description" header="Description" ></Column>
                <Column header={'Created Date'} field="createdAt" body={dateBodyTemplate}></Column>
                <Column header="Action" body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
            </DataTable>
            <Dialog
                visible={deleteCalendarDialog}
                style={{ width: '450px' }}
                header="Confirm"
                modal
                footer={deleteCalendarDialogFooter}
                onHide={() => setDeleteCalendarDialog(false)}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {calendarToDelete && <span>Are you sure you want to delete <b>{calendarToDelete.title}</b>?</span>}
                </div>
            </Dialog>
            <Dialog
                visible={cloneCalendarDialog}
                style={{ width: '450px' }}
                header="Confirm"
                modal
                footer={cloneCalendarDialogFooter}
                onHide={() => setCloneCalendarDialog(false)}
            >
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {calendarToClone && <span>Are you sure you want to clone <b>{calendarToClone.title}</b>?</span>}
                </div>
            </Dialog>
        </React.Fragment>
    );
}

export default AppCalendarTable;
