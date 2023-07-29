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
import AppMailReply from './AppMailReply';
import { MailContext } from './context/mailcontext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

function AppMailTable(props) {
    const [mail, setMail] = useState(null);
    const [selectedMails, setSelectedMails] = useState([]);
    const [filters, setFilters] = useState({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const { toastRef, onStar, onArchive, onBookmark, onTrash, onDelete, onDeleteMultiple, onSpamMultiple, onArchiveMultiple } = useContext(MailContext);
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

    const actionHeaderTemplate = (
        <div className="flex -ml-2">
            <Button type="button" icon="pi pi-refresh" rounded text className="p-button-plain"></Button>
            <Button type="button" icon="pi pi-ellipsis-v" rounded text className="p-button-plain ml-3" onClick={(event) => menu.current?.toggle(event)}></Button>
            <Menu ref={menu} popup model={menuItems}></Menu>
        </div>
    );

    const actionsBodyTemplate = (mail) => {
        return (
            <>
                {!mail.trash && !mail.spam ? (
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
                ) : null}
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

    const dateHeaderTemplate = (
        <span className="p-input-icon-left">
            <i className="pi pi-search"></i>
            <InputText id="search" placeholder="Search Mail" className="w-full sm:w-auto" value={globalFilterValue} onChange={onGlobalFilterChange} />
        </span>
    );

    const dateBodyTemplate = (mail, columnOptions) => {
        return (
            <div className="cursor-pointer" style={{ minWidth: '10rem' }}>
                <div className="flex justify-content-end w-full px-0">
                    <span id={columnOptions.rowIndex.toString() + '-date'} className="text-700 font-semibold white-space-nowrap">
                        {mail.date}
                    </span>
                    <div id={columnOptions.rowIndex.toString() + '-options'} style={{ display: 'none' }}>
                        <Button type="button" tooltip="Archive" tooltipOptions={{ position: 'top' }} icon="pi pi-inbox" className="h-2rem w-2rem mr-2" onClick={(event) => handleArchive(event, mail.id)}></Button>
                        <Button type="button" tooltip="Reply" tooltipOptions={{ position: 'top' }} icon="pi pi-reply" className="p-button-secondary h-2rem w-2rem mr-2" onClick={(event) => handleReply(event, mail)}></Button>
                        <Button type="button" tooltip="Trash" tooltipOptions={{ position: 'top' }} icon="pi pi-trash" className="p-button-danger h-2rem w-2rem" onClick={(event) => handleTrash(event, mail)}></Button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <React.Fragment>
            <DataTable
                ref={dt}
                value={props.mails}
                filters={filters}
                globalFilterFields={['from', 'to', 'title']}
                emptyMessage="No mails found."
                responsiveLayout="scroll"
                onRowMouseEnter={onRowMouseEnter}
                onRowMouseLeave={onRowMouseLeave}
                rows={10}
                paginator
                rowHover
                rowsPerPageOptions={[10, 20, 30]}
                selection={selectedMails}
                onSelectionChange={(e) => setSelectedMails(e.value)}
                selectionMode="multiple"
            >
                <Column selectionMode="multiple" style={{ width: '4rem' }}></Column>
                <Column header={actionHeaderTemplate} body={actionsBodyTemplate} style={{ width: '8rem' }}></Column>
                <Column style={{ minWidth: '4rem' }} body={avatarBodyTemplate}></Column>
                <Column body={authorBodyTemplate}></Column>
                <Column style={{ minWidth: '12rem' }} body={titleBodyTemplate}></Column>
                <Column header={dateHeaderTemplate} field="date" body={dateBodyTemplate}></Column>
            </DataTable>
            <Dialog header="New Message" visible={dialogVisible} onHide={() => setDialogVisible(false)} closable modal className="mx-3 sm:mx-0 sm:w-full md:w-8 lg:w-6" contentClassName="border-round-bottom border-top-1 surface-border p-0">
                <AppMailReply content={mail} hide={() => setDialogVisible(false)}></AppMailReply>
            </Dialog>
        </React.Fragment>
    );
}

export default AppMailTable;
