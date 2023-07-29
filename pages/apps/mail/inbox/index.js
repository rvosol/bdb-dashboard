import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../../../layout/layout';
import { MailContext } from '../../../../demo/components/apps/mail/context/mailcontext';
import AppMailTable from '../../../../demo/components/apps/mail/AppMailTable';
import AppMailLayout from '../../../../demo/components/apps/mail/AppMailLayout';

const MailInbox = () => {
    const [inbox, setInbox] = useState([]);
    const { mails } = useContext(MailContext);
    useEffect(() => {
        const _mails = mails.filter((d) => !d.archived && !d.spam && !d.trash && !d.hasOwnProperty('sent'));
        setInbox(_mails);
    }, [mails]);

    return (
        <React.Fragment>
            <AppMailTable mails={inbox} />
        </React.Fragment>
    );
};

MailInbox.getLayout = function getLayout(page) {
    return (
        <Layout>
            <AppMailLayout>{page}</AppMailLayout>
        </Layout>
    );
};

export default MailInbox;
