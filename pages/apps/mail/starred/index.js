import React, { useState, useEffect, useContext } from 'react';
import Layout from '../../../../layout/layout';
import { MailContext } from '../../../../demo/components/apps/mail/context/mailcontext';
import AppMailTable from '../../../../demo/components/apps/mail/AppMailTable';
import AppMailLayout from '../../../../demo/components/apps/mail/AppMailLayout';

const MailStarred = () => {
    const [starredMails, setStarredMails] = useState([]);
    const { mails } = useContext(MailContext);
    useEffect(() => {
        const _mails = mails.filter((d) => d.starred && !d.archived && !d.trash);
        setStarredMails(_mails);
    }, [mails]);

    return (
        <React.Fragment>
            <AppMailTable mails={starredMails} />
        </React.Fragment>
    );
};

MailStarred.getLayout = function getLayout(page) {
    return (
        <Layout>
            <AppMailLayout>{page}</AppMailLayout>
        </Layout>
    );
};

export default MailStarred;
