import React, { useState, useEffect, useRef, createContext } from 'react';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import axiosInstance from '../../../../../utils/axiosInstance';

export const CalendarContext = createContext();

export const CalendarProvider = ({ children }) => {
    const [calendars, setCalendars] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalDocs: 0 });
    const [sort, setSort] = useState({ sortBy: 'createdAt', sortOrder: 1 });
    const [searchQuery, setSearchQuery] = useState('');
    const toastRef = useRef(null);

    const fetchCalendars = async () => {
        try {
            setLoading(true)
            const queryStr = `page=${pagination.page}&limit=${pagination.limit}&query=${searchQuery}&sortBy=${sort.sortBy}&sortOrder=${sort.sortOrder}`;
            const response = await axiosInstance.get(`/admin/calendar/myCalendar?${queryStr}`);
            if (response.data.status === 'success') {
                setCalendars(response.data.data.docs);
                setPagination(prev => ({ ...prev, totalDocs: response.data.data.totalDocs }));
            } else {
                console.error('Failed to fetch calendars:', response.data.message);
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.error('Error fetching calendars:', error);
        }
    };

    useEffect(() => {
        fetchCalendars();
    }, [pagination.page, pagination.limit, sort, searchQuery]);

    // Rest of your methods (adjust as needed for calendars)

    const value = {
        calendars,
        pagination,
        setPagination,
        setSort,
        setSearchQuery,
        toastRef,
        loading,
        setLoading,
        searchQuery
        // Include all methods relevant to calendars
    };

    return (
        <CalendarContext.Provider value={value}>
            <Toast ref={toastRef} />
            {children}
        </CalendarContext.Provider>
    );
};
