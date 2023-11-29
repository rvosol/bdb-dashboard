import React from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import { AuthProvider } from '../layout/context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CalendarProvider } from '../demo/components/apps/calendar/context/calendarcontext';

export default function MyApp({ Component, pageProps }) {
    if (Component.getLayout) {
        return (
            <AuthProvider>
                <CalendarProvider>
                    <LayoutProvider>
                        {Component.getLayout(<Component {...pageProps} />)}
                    </LayoutProvider>
                    <ToastContainer />
                </CalendarProvider>
            </AuthProvider>
        )
    } else {
        return (

            <AuthProvider>
                <CalendarProvider>
                    <LayoutProvider>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </LayoutProvider>
                    <ToastContainer />
                </CalendarProvider>
            </AuthProvider>

        );
    }
}
