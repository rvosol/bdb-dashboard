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
        let inbox = [],
            starred = [],
            spam = [],
            important = [],
            archived = [],
            trash = [],
            sent = [];

        for (let i = 0; i < data.length; i++) {
            let mail = data[i];

            if (!mail.archived && !mail.trash && !mail.spam && !mail.hasOwnProperty('sent')) {
                inbox.push(mail);
            }
            if (mail.starred) {
                starred.push(mail);
            }
            if (mail.spam) {
                spam.push(mail);
            }
            if (mail.important) {
                important.push(mail);
            }
            if (mail.archived) {
                archived.push(mail);
            }
            if (mail.trash) {
                trash.push(mail);
            }
            if (mail.sent) {
                sent.push(mail);
            }
        }

        const badgeValues = {
            inbox: inbox.length,
            starred: starred.length,
            spam: spam.length,
            important: important.length,
            archived: archived.length,
            trash: trash.length,
            sent: sent.length
        };

        setItems([
            { id: 'all', label: 'All', icon: 'pi pi-list', badge: badgeValues.inbox, to: '/apps/calendar/all' },
            { id: 'public', label: 'Public', icon: 'pi pi-users', badge: badgeValues.spam, to: '/apps/calendar/public' },
            { id: 'private', label: 'Private', icon: 'pi pi-lock', badge: badgeValues.starred, to: '/apps/calendar/private' },
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
