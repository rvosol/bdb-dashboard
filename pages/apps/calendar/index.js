// fullcalendar core import
import FullCalendar from "@fullcalendar/react";
// fullcalendar plugins imports
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Button } from "primereact/button";
import { Calendar as PRCalendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useEffect, useRef, useState } from "react";
import { EventService } from "../../../demo/service/EventService";
import axiosInstance from "../../../utils/axiosInstance";
import moment from "moment";
import { Toast } from "primereact/toast";
import { sendStatusCode } from "next/dist/server/api-utils";

const CalendarDemo = () => {
  const toast = useRef(null);
  const [events, setEvents] = useState(null);
  const [tags, setTags] = useState([]);
  const [repeats, setRepeats] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [view, setView] = useState("");
  const [changedEvent, setChangedEvent] = useState({
    calData: {
      calenderId: "",
      calenderName: "",
    },
    title: "",
    start: null,
    end: null,
    allDay: null,
    location: "",
    borderColor: "",
    textColor: "",
    description: "",
    occurrence: "",
    color:""
  });

  const onEventClick = (e) => {
    const { start, end } = e.event;
    let plainEvent = e.event.toPlainObject({
      collapseExtendedProps: true,
      collapseColor: true,
    });
    setView("display");
    setShowDialog(true);
    setChangedEvent((prevChangeState) => ({
      ...prevChangeState,
      ...plainEvent,
      start,
      end: end ? end : start,
    }));
  };

  const occurrences = [
    { name: "daily" },
    { name: "weekly" },
    { name: "monthly" },
    { name: "yearly" },
  ];

  const colors = [
    { color: "#616161", name: "Graphite" },
    { color: "#9e69af", name: "Calendar Color" },
    { color: "#7986cb", name: "Lavender" },
    { color: "#0b8043", name: "Basil" },
    { color: "#e67c73", name: "Flamingo" },
    { color: "#3f51b5", name: "Blueberry" },
  ];

  const [calenderIds, setCalenderId] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState([]);

  const fetchCalendarData = async () => {
    try{
        const response = await axiosInstance.get(`/admin/calendar/myCalendar`);
        let calendarData = response?.data?.data?.docs?.map((res) => ({
            calenderId : res._id,
            calenderName : res.title,
        }));
        setSelectedCalendar(calendarData);
        const _calenderId = calendarData.map((c) => ({ calenderId: c.calenderId, calenderName: c.calenderName, }));
        setCalenderId(_calenderId);
    } catch (error) {
        console.error('Error fetching calendar data:', error);
    }
  };
console.log("tt",setSelectedCalendar);
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/admin/events");

      if (response.data && response.data.status === "success") {
        let resData = response.data?.data?.docs?.map((event) => ({
          id: event._id,
          title: event.title,
          start: moment.utc(event.startAt).format("YYYY-MM-DD HH:mm"),
          end: moment.utc(event.endAt).format("YYYY-MM-DD HH:mm"),
          location: event.location,
          description: event.description,
          occurrence: event.occurrence,
          color: event.color,
          calData:{
            calenderId: event?.calendar?._id,
            calenderName: event?.calendar?.title
          }
        }));

        setEvents(resData);
      } else {
        console.error("Error fetching events:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }
  
    try {

      const eventData = {
        id: changedEvent.id,
        calendar: changedEvent.calData.calenderId,
        title: changedEvent.title,
        startAt: changedEvent.start.toISOString(),
        endAt: changedEvent.end.toISOString(),
        location: changedEvent.location,
        description: changedEvent.description,
        color: changedEvent.color,
        occurrence: changedEvent.occurrence,
      };
  
      if (changedEvent.id) {
        const response = await axiosInstance.patch(`/admin/events`, eventData);
  
        if (response.data && response.data.status === "success") {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Event updated', life: 3000 });
            fetchData();
            setShowDialog(false);
        } else {
            console.error('Failed to update event');
        }
      } else {
        const response = await axiosInstance.post("/admin/events", eventData);
  
        if (response.data && response.data.status === "success") {
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Event Created', life: 3000 });
            fetchData();
            setShowDialog(false);
        } else {
            console.error('Failed to create event');
        }
      }
    } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error', detail: error?.response?.data?.message || 'An error occurred while saving the event', life: 3000 });
    }
  };

  const handleDelete = async () => {
        try {
            const eventId = changedEvent.id;

            await axiosInstance.delete(`/admin/events/${eventId}`);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Event Deleted', life: 3000 });
            fetchData();
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed', life: 3000 });
        }
        setShowDialog(false);
    };


  useEffect(() => {
    fetchData();
    fetchCalendarData();

    console.log("colors",colors)
    const _tags = colors.map((c) => ({ name: c.name, color: c.color }));
    setTags(_tags);
    const _repeats = occurrences.map((c) => ({ name: c.name }));
    setRepeats(_repeats);
  }, []);

  const validate = () => {
    let { start, end, title } = changedEvent;
    return start && end && title;
  };

  const onEditClick = () => {
    setView("edit");
  };

  const onDateSelect = (e) => {
    setView("new");
    setShowDialog(true);
    setChangedEvent({
      ...e,
      calData: {
        calenderId: "",
        calenderName: "",
      },
      title: "",
      location: "",
      borderColor: "",
      textColor: "",
      description: "",
      occurrence: "",
      color:""
    });
  };

  const selectedItemTemplate = () => {
    return (
      <div className="flex align-items-center">
        <div
          className="flex-shrink-0 w-1rem h-1rem mr-2 border-circle"
          style={{
            backgroundColor:  changedEvent.color,
          }}
        ></div>
        <div className="capitalize">
           {colors.find(ss=>{ return ss.color==changedEvent.color})?.name}
        </div>
      </div>
    );
  };

  const itemOptionTemplate = (tag) => {
    return (
      <div className="flex align-items-center">
        <div
          className="flex-shrink-0 w-1rem h-1rem mr-2 border-circle"
          style={{ backgroundColor: tag.color }}
        ></div>
        <div className="capitalize">{tag.name}</div>
      </div>
    );
  };

  const footer = (
    <>
      {view === "display" ? (
        <Button
          type="button"
          label="Edit"
          severity="warning"
          icon="pi pi-pencil"
          onClick={onEditClick}
        />
      ) : null}
      {view === "edit" ? (
        <Button
          type="button"
          label="Update"
          severity="secondary"
          icon="pi pi-check"
          disabled={!changedEvent.start || !changedEvent.end}
          onClick={handleSave}
        />
      ) : null}
      {view === "new" ? (
        <Button
          type="button"
          label="Create"
          icon="pi pi-plus"
          disabled={!changedEvent.start || !changedEvent.end}
          onClick={handleSave}
        />
      ) : null}
      {view === "display" ? (
        <Button
            type="button"
            label="Delete"
            severity="danger"
            icon="pi pi-trash"
            onClick={handleDelete}
            />
        ) : null}
    </>
  );
  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
        <Toast ref={toast} />
          <FullCalendar
            events={events}
            eventClick={onEventClick}
            select={onDateSelect}
            initialDate={moment( ).startOf("month").format("YYYY-MM-DD")}
            initialView="dayGridMonth"
            height={720}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            editable
            selectable
            selectMirror
            dayMaxEvents
          />

          <Dialog
            visible={showDialog}
            style={{ width: "36rem" }}
            modal
            headerClassName="text-900 font-semibold text-xl"
            header={
              view === "display"
                ? changedEvent.title
                : view === "new"
                ? "New Event"
                : "Edit Event"
            }
            breakpoints={{ "960px": "75vw", "640px": "90vw" }}
            footer={footer}
            closable
            onHide={() => setShowDialog(false)}
          >
            <>
              {view === "display" ? (
                <React.Fragment>
                  <span className="text-900 font-semibold block mb-2">
                    Description
                  </span>
                  <span className="block mb-3">{changedEvent.description}</span>

                  <div className="grid">
                    <div className="col-6">
                      <div className="text-900 font-semibold mb-2">Start</div>
                      <p className="flex align-items-center m-0">
                        <i className="pi pi-fw pi-clock text-700 mr-2"></i>
                        <span>{moment(changedEvent.start).format("YYYY-MM-DD hh:mm A")}</span>
                      </p>
                    </div>
                    <div className="col-6">
                      <div className="text-900 font-semibold mb-2">End</div>
                      <p className="flex align-items-center m-0">
                        <i className="pi pi-fw pi-clock text-700 mr-2"></i>
                        <span> {moment(changedEvent.end).format("YYYY-MM-DD hh:mm A")}</span>
                      </p>
                    </div>
                    <div className="col-12">
                      <div className="text-900 font-semibold mb-2">
                        Location
                      </div>
                      <p className="flex align-items-center m-0">
                        <i className="pi pi-map-marker text-700 mr-2"></i>
                        <span>{changedEvent.location}</span>
                      </p>
                    </div>
                    <div className="col-12">
                      <div className="text-900 font-semibold mb-2">Repeat</div>
                      <p className="flex align-items-center m-0 ">
                        <i className="pi pi-replay text-700 mr-2"></i>
                        <span className="capitalize">
                          {changedEvent.occurrence}
                        </span>
                      </p>
                    </div>
                    <div className="col-12">
                      <div className="text-900 font-semibold mb-2">Color</div>
                      <p className="flex align-items-center m-0">
                        <i className="pi pi-palette text-700 mr-2"></i>
                        <span
                          className="inline-flex flex-shrink-0 w-1rem h-1rem mr-2 border-circle"
                          style={{
                            backgroundColor: changedEvent.color,
                          }}
                        ></span>
                        <span className="capitalize">
                          { changedEvent.color}
                        </span>
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                <div className="grid p-fluid formgrid">
                  <div className="col-12 field">
                    <label
                      htmlFor="calender"
                      className="text-900 font-semibold"
                    >
                      Select Calender
                    </label>
                    <Dropdown
                      inputId="repeat"
                      value={changedEvent.calData?.calenderId}
                      options={calenderIds}
                      onChange={(e) => {
                        setChangedEvent((prevState) => ({
                          ...prevState,
                          calData:{
                            calenderId:e.target.value
                          },
                        }));
                        console.log("calendar Id", e.target.value);
                      }}
                      
                      optionLabel="calenderName"
                      optionValue="calenderId"
                      placeholder="Select One"
                      className="capitalize"
                    />
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="title" className="text-900 font-semibold">
                      Title
                    </label>
                    <span className="p-input-icon-left">
                      <i className="pi pi-pencil"></i>
                      <InputText
                        id="title"
                        value={changedEvent.title}
                        onChange={(e) =>
                          setChangedEvent((prevState) => ({
                            ...prevState,
                            title: e.target.value,
                          }))
                        }
                        type="text"
                        placeholder="Title"
                      />
                    </span>
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label
                      htmlFor="location"
                      className="text-900 font-semibold"
                    >
                      Location
                    </label>
                    <span className="p-input-icon-left">
                      <i className="pi pi-map-marker"></i>
                      <InputText
                        id="location"
                        value={changedEvent.location}
                        onChange={(e) =>
                          setChangedEvent((prevState) => ({
                            ...prevState,
                            location: e.target.value,
                          }))
                        }
                        type="text"
                        placeholder="Location"
                      />
                    </span>
                  </div>
                  <div className="col-12 field">
                    <label
                      htmlFor="description"
                      className="text-900 font-semibold"
                    >
                      Event Description
                    </label>
                    <InputTextarea
                      id="description"
                      type="text"
                      rows={5}
                      value={changedEvent.description}
                      onChange={(e) =>
                        setChangedEvent((prevState) => ({
                          ...prevState,
                          description: e.target.value,
                        }))
                      }
                      style={{ resize: "none" }}
                    ></InputTextarea>
                  </div>

                  <div className="col-12 md:col-6 field">
                    <label htmlFor="start" className="text-900 font-semibold">
                      Start Date
                    </label>
                    <PRCalendar
                      id="start"
                      maxDate={changedEvent.end}
                      value={changedEvent.start}
                      onChange={(e) =>
                        setChangedEvent((prevState) => ({
                          ...prevState,
                          start: e.value,
                        }))
                      }
                      showTime
                      required
                    />
                  </div>
                  <div className="col-12 md:col-6 field">
                    <label htmlFor="end" className="text-900 font-semibold">
                      End Date
                    </label>
                    <PRCalendar
                      id="end"
                      minDate={changedEvent.start}
                      value={changedEvent.end}
                      onChange={(e) =>
                        setChangedEvent((prevState) => ({
                          ...prevState,
                          end: e.value,
                        }))
                      }
                      showTime
                      required
                    />
                  </div>
                  <div className="col-12 field">
                    <label htmlFor="repeat" className="text-900 font-semibold">
                      Repeat
                    </label>
                    <Dropdown
                      inputId="repeat"
                      value={changedEvent.occurrence}
                      options={repeats}
                      onChange={(e) =>
                        setChangedEvent((prevState) => ({
                          ...prevState,
                          occurrence: e.target.value,
                        }))
                      }
                      optionLabel="name"
                      optionValue="name"
                      placeholder="Select One"
                      className="capitalize"
                    />
                  </div>
                  <div className="col-12 field">
                    <label
                      htmlFor="company-color"
                      className="text-900 font-semibold"
                    >
                      Color
                    </label>
                    <Dropdown
                      inputId="company-color"
                      value={changedEvent.color}
                      options={colors}
                      onChange={(e) =>
                        setChangedEvent((prevState) => ({
                          ...prevState,
                          color: e.value,
                        }))
                      }
                      optionLabel="name"
                      optionValue="color"
                      placeholder="Select One"
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
