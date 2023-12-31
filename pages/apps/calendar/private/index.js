import React, { useContext } from 'react';
import Layout from '../../../../layout/layout';
import { CalendarContext } from '../../../../demo/components/apps/calendar/context/calendarcontext';
import AppCalendarTable from '../../../../demo/components/apps/calendar/AppCalendarTable';
import AppCalendarLayout from '../../../../demo/components/apps/calendar/AppCalendarLayout';

const CalendarInbox = () => {
    const { calendars, pagination, setPagination, setSort, setSearchQuery, loading } = useContext(CalendarContext);
    
    const privateCalendars = calendars.filter(calendar => calendar.privacy === 'private');

    return (
            <React.Fragment>
                <AppCalendarTable
                    calendars={privateCalendars}
                    pagination={pagination}
                    setPagination={setPagination}
                    setSort={setSort}
                    setSearchQuery={setSearchQuery}
                    loading={loading}
                />
            </React.Fragment>
    );
};

CalendarInbox.getLayout = function getLayout(page) {
    return (
        <Layout>
            <AppCalendarLayout>{page}</AppCalendarLayout>

        </Layout>
    );
};

export default CalendarInbox;
