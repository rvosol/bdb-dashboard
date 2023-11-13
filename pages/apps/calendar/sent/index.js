import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../../../layout/layout';
import { MailContext } from '../../../../demo/components/apps/mail/context/mailcontext';
import AppMailTable from '../../../../demo/components/apps/mail/AppMailTable';
import AppMailLayout from '../../../../demo/components/apps/mail/AppMailLayout';

const MailSent = () => {
    const [sentMails, setSentMails] = useState([]);
    const { mails } = useContext(MailContext);
    useEffect(() => {
        const _mails = mails.filter((d) => d.sent && !d.trash && !d.archived);
        setSentMails(_mails);
    }, [mails]);

    return (
        <React.Fragment>
            <AppMailTable mails={sentMails} />
        </React.Fragment>
    );
};

MailSent.getLayout = function getLayout(page) {
    return (
        <Layout>
            <AppMailLayout>{page}</AppMailLayout>
        </Layout>
    );
};

export default MailSent;
