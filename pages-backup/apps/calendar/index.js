// fullcalendar core import
import FullCalendar from '@fullcalendar/react';
// fullcalendar plugins imports
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button } from 'primereact/button';
import { Calendar as PRCalendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useState } from 'react';
import { EventService } from '../../../demo/service/EventService';

const CalendarDemo = () => {
    const [events, setEvents] = useState(null);
    const [tags, setTags] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const [view, setView] = useState('');
    const [changedEvent, setChangedEvent] = useState({
        title: '',
        start: null,
        end: null,
        allDay: null,
        location: '',
        borderColor: '',
        textColor: '',
        description: '',
        tag: {
            name: '',
            color: ''
        }
    });

    const onEventClick = (e) => {
        const { start, end } = e.event;
        let plainEvent = e.event.toPlainObject({ collapseExtendedProps: true, collapseColor: true });
        setView('display');
        setShowDialog(true);
        setChangedEvent((prevChangeState) => ({ ...prevChangeState, ...plainEvent, start, end: end ? end : start }));
    };

    useEffect(() => {
        EventService.getEvents().then((data) => {
            setEvents(data);
            const _tags = [];
            data.forEach((event) => {
                _tags.push(event.tag);
            });
            setTags(_tags);
        });
    }, []);

    const handleSave = () => {
        if (!validate()) {
            return;
        } else {
            const _clickedEvent = { ...changedEvent, backgroundColor: changedEvent.tag.color, borderColor: changedEvent.tag.color, textColor: '#212121' };
            setShowDialog(false);
            if (_clickedEvent.id) {
                const _events = events.map((i) => (i.id.toString() === _clickedEvent.id.toString() ? (i = _clickedEvent) : i));
                setEvents(_events);
            } else {
                setEvents((prevState) => [...prevState, { ..._clickedEvent, id: Math.floor(Math.random() * 10000) }]);
            }
        }
    };

    const validate = () => {
        let { start, end, title } = changedEvent;
        return start && end && title;
    };

    const onEditClick = () => {
        setView('edit');
    };

    const onDateSelect = (e) => {
        setView('new');
        setShowDialog(true);
        setChangedEvent({
            ...e,
            title: '',
            location: '',
            borderColor: '',
            textColor: '',
            description: '',
            tag: {
                name: '',
                color: ''
            }
        });
    };

    const selectedItemTemplate = () => {
        return (
            <div className="flex align-items-center">
                <div className="flex-shrink-0 w-1rem h-1rem mr-2 border-circle" style={{ backgroundColor: changedEvent.tag.color }}></div>
                <div>{changedEvent.tag.name}</div>
            </div>
        );
    };

    const itemOptionTemplate = (tag) => {
        return (
            <div className="flex align-items-center">
                <div className="flex-shrink-0 w-1rem h-1rem mr-2 border-circle" style={{ backgroundColor: tag.color }}></div>
                <div>{tag.name}</div>
            </div>
        );
    };

    const footer = (
        <>
            {view === 'display' ? <Button type="button" label="Edit" icon="pi pi-pencil" onClick={onEditClick} /> : null}
            {view === 'new' || view === 'edit' ? <Button type="button" label="Save" icon="pi pi-check" disabled={!changedEvent.start || !changedEvent.end} onClick={handleSave} /> : null}
        </>
    );

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <FullCalendar
                        events={events}
                        eventClick={onEventClick}
                        select={onDateSelect}
                        initialDate="2022-05-11"
                        initialView="dayGridMonth"
                        height={720}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        editable
                        selectable
                        selectMirror
                        dayMaxEvents
                    />

                    <Dialog
                        visible={showDialog}
                        style={{ width: '36rem' }}
                        modal
                        headerClassName="text-900 font-semibold text-xl"
                        header={view === 'display' ? changedEvent.title : view === 'new' ? 'New Event' : 'Edit Event'}
                        breakpoints={{ '960px': '75vw', '640px': '90vw' }}
                        footer={footer}
                        closable
                        onHide={() => setShowDialog(false)}
                    >
                        <>
                            {view === 'display' ? (
                                <React.Fragment>
                                    <span className="text-900 font-semibold block mb-2">Description</span>
                                    <span className="block mb-3">{changedEvent.description}</span>

                                    <div className="grid">
                                        <div className="col-6">
                                            <div className="text-900 font-semibold mb-2">Start</div>
                                            <p className="flex align-items-center m-0">
                                                <i className="pi pi-fw pi-clock text-700 mr-2"></i>
                                                <span>{changedEvent.start.toISOString().slice(0, 10)}</span>
                                            </p>
                                        </div>
                                        <div className="col-6">
                                            <div className="text-900 font-semibold mb-2">End</div>
                                            <p className="flex align-items-center m-0">
                                                <i className="pi pi-fw pi-clock text-700 mr-2"></i>
                                                <span>{changedEvent.end.toISOString().slice(0, 10)}</span>
                                            </p>
                                        </div>
                                        <div className="col-12">
                                            <div className="text-900 font-semibold mb-2">Location</div>
                                            <p className="flex align-items-center m-0">
                                                <i className="pi pi-fw pi-clock text-700 mr-2"></i>
                                                <span>{changedEvent.location}</span>
                                            </p>
                                        </div>
                                        <div className="col-12">
                                            <div className="text-900 font-semibold mb-2">Color</div>
                                            <p className="flex align-items-center m-0">
                                                <span className="inline-flex flex-shrink-0 w-1rem h-1rem mr-2 border-circle" style={{ backgroundColor: changedEvent.tag.color }}></span>
                                                <span>{changedEvent.tag.name}</span>
                                            </p>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ) : (
                                <div className="grid p-fluid formgrid">
                                    <div className="col-12 md:col-6 field">
                                        <label htmlFor="title" className="text-900 font-semibold">
                                            Title
                                        </label>
                                        <span className="p-input-icon-left">
                                            <i className="pi pi-pencil"></i>
                                            <InputText id="title" value={changedEvent.title} onChange={(e) => setChangedEvent((prevState) => ({ ...prevState, title: e.target.value }))} type="text" placeholder="Title" />
                                        </span>
                                    </div>
                                    <div className="col-12 md:col-6 field">
                                        <label htmlFor="location" className="text-900 font-semibold">
                                            Location
                                        </label>
                                        <span className="p-input-icon-left">
                                            <i className="pi pi-map-marker"></i>
                                            <InputText id="location" value={changedEvent.location} onChange={(e) => setChangedEvent((prevState) => ({ ...prevState, location: e.target.value }))} type="text" placeholder="Location" />
                                        </span>
                                    </div>
                                    <div className="col-12 field">
                                        <label htmlFor="description" className="text-900 font-semibold">
                                            Event Description
                                        </label>
                                        <InputTextarea
                                            id="description"
                                            type="text"
                                            rows={5}
                                            value={changedEvent.description}
                                            onChange={(e) => setChangedEvent((prevState) => ({ ...prevState, description: e.target.value }))}
                                            style={{ resize: 'none' }}
                                        ></InputTextarea>
                                    </div>

                                    <div className="col-12 md:col-6 field">
                                        <label htmlFor="start" className="text-900 font-semibold">
                                            Start Date
                                        </label>
                                        <PRCalendar id="start" maxDate={changedEvent.end} value={changedEvent.start} onChange={(e) => setChangedEvent((prevState) => ({ ...prevState, start: e.value }))} showTime required />
                                    </div>
                                    <div className="col-12 md:col-6 field">
                                        <label htmlFor="end" className="text-900 font-semibold">
                                            End Date
                                        </label>
                                        <PRCalendar id="end" minDate={changedEvent.start} value={changedEvent.end} onChange={(e) => setChangedEvent((prevState) => ({ ...prevState, end: e.value }))} showTime required />
                                    </div>
                                    <div className="col-12 field">
                                        <label htmlFor="company-color" className="text-900 font-semibold">
                                            Color
                                        </label>
                                        <Dropdown
                                            inputId="company-color"
                                            value={changedEvent.tag}
                                            options={tags}
                                            onChange={(e) => setChangedEvent((prevState) => ({ ...prevState, tag: e.value }))}
                                            optionLabel="name"
                                            valueTemplate={selectedItemTemplate}
                                            itemTemplate={itemOptionTemplate}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default CalendarDemo;
