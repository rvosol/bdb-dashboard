import React, { useState, useEffect, useContext } from 'react';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import { useRouter } from 'next/router';
import { CalendarContext } from './context/calendarcontext';

function AppCalendarSidebar() {
    const [items, setItems] = useState([]);
    const router = useRouter();
    const { calendars } = useContext(CalendarContext);

    const navigate = (item) => {
        if (item.to) {
            router.push(item.to);
        }
    };

    const getBadgeValues = (data) => {
        const allCalendars = data.length;
        const publicCalendars = data.filter((calendar) => calendar?.privacy === 'public').length;
        const privateCalendars = data.filter((calendar) => calendar?.privacy === 'private').length;
        
        setItems([
            { id: 'all', label: 'All', icon: 'pi pi-list', badge: allCalendars, to: '/apps/calendar/all' },
            { id: 'public', label: 'Public', icon: 'pi pi-users', badge: publicCalendars, to: '/apps/calendar/public' },
            { id: 'private', label: 'Private', icon: 'pi pi-lock', badge: privateCalendars, to: '/apps/calendar/private' },
            // { label: 'Important', icon: 'pi pi-bookmark', badge: badgeValues.important, to: '/apps/calendar/important' },
            // { label: 'Sent', icon: 'pi pi-send', badge: badgeValues.sent, to: '/apps/calendar/sent' },
            // { label: 'Archived', icon: 'pi pi-book', badge: badgeValues.archived, to: '/apps/calendar/archived' },
            // { label: 'Trash', icon: 'pi pi-trash', badge: badgeValues.trash, to: '/apps/calendar/trash' }
        ]);
    };

    useEffect(() => {
        getBadgeValues(calendars);
    }, [calendars]);

    return (
        <React.Fragment>
            <div>
                <Button label="Create New" className="mb-5 w-full p-button-outlined" onClick={(e) => router.push('/apps/calendar/create')}></Button>
                <div className="overflow-auto">
                    <ul className="flex flex-row md:flex-column gap-1 md:gap-2 list-none m-0 p-0 overflow-auto">
                        {items.map((item, i) => {
                            return (
                                <li
                                    key={item.id}
                                    className={classNames('p-ripple cursor-pointer select-none p-3 transition-duration-150 border-round flex align-items-center justify-content-center md:justify-content-start md:flex-1 flex-auto', {
                                        'bg-primary': router.pathname === item.to,
                                        'hover:surface-hover': router.pathname !== item.to
                                    })}
                                    onClick={() => navigate(item)}
                                >
                                    <i className={classNames('md:mr-3 text-600 transition-duration-150 text-lg', item.icon || '', { 'text-primary-50': router.pathname === item.to })}></i>
                                    <span className={classNames('text-900 font-medium hidden md:inline', { 'text-primary-50': router.pathname === item.to })}>{item.label}</span>
                                    {item.badge ? (
                                        <span className="ml-auto text-sm font-semibold bg-primary-50 text-primary-900 px-2 py-1 hidden md:inline" style={{ borderRadius: '2rem' }}>
                                            {item.badge}
                                        </span>
                                    ) : null}
                                    <Ripple />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </React.Fragment>
    );
}

export default AppCalendarSidebar;
