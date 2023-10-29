import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../../../layout/layout';
import { MailContext } from '../../../../demo/components/apps/mail/context/mailcontext';
import AppMailTable from '../../../../demo/components/apps/mail/AppMailTable';
import AppMailLayout from '../../../../demo/components/apps/mail/AppMailLayout';

const MailImportant = () => {
    const [importantMails, setImportantMails] = useState([]);
    const { mails } = useContext(MailContext);
    useEffect(() => {
        const _mails = mails.filter((d) => d.important && !d.spam && !d.trash && !d.archived);
        setImportantMails(_mails);
    }, [mails]);

    return (
        <React.Fragment>
            <AppMailTable mails={importantMails} />
        </React.Fragment>
    );
};

MailImportant.getLayout = function getLayout(page) {
    return (
        <Layout>
            <AppMailLayout>{page}</AppMailLayout>
        </Layout>
    );
};

export default MailImportant;
