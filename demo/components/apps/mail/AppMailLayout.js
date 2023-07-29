import React from 'react';
import Layout from '../../../../layout/layout';
import AppMailSidebar from './AppMailSidebar';
import { MailProvider } from './context/mailcontext';

const AppMailLayout = ({ children }) => {
    return (
        <MailProvider>
            <div className="card">
                <div className="flex flex-column md:flex-row gap-4">
                    <div className="w-full md:w-3 xl:w-2 xl:p-3">
                        <AppMailSidebar />
                    </div>
                    <div className="md:w-9 xl:w-10 xl:p-3">{children}</div>
                </div>
            </div>
        </MailProvider>
    );
};

AppMailLayout.getLayout = function getLayout(page) {
    return <Layout>{page}</Layout>;
};

export default AppMailLayout;
