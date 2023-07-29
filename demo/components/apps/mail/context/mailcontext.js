import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';

export const MailContext = React.createContext();

export const MailProvider = (props) => {
    const [mails, setMails] = useState([]);
    const toastRef = useRef(null);

    const getMails = () => {
        return fetch('/demo/data/mail.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data);
    };

    useEffect(() => {
        getMails().then((data) => setMails(data));
    }, []);

    const updateMails = (data) => {
        setMails(data);
    };

    const onStar = (id) => {
        let _mails = mails.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m));
        setMails(_mails);
    };

    const onArchive = (id) => {
        let _mails = mails.map((m) => (m.id === id ? { ...m, archived: !m.archived } : m));
        setMails(_mails);
    };

    const onBookmark = (id) => {
        let _mails = mails.map((m) => (m.id === id ? { ...m, important: !m.important } : m));
        setMails(_mails);
    };

    const onDelete = (id) => {
        let _mails = mails.filter((m) => m.id !== id);
        setMails(_mails);
    };

    const onDeleteMultiple = (mailArray) => {
        const idArray = mailArray.map((m) => Number(m.id));
        const updatedMails = mails.map((mail) => {
            if (idArray.indexOf(mail.id) === -1) {
                return mail;
            } else {
                return { ...mail, trash: true };
            }
        });
        setMails(updatedMails);
    };

    const onArchiveMultiple = (mailArray) => {
        const idArray = mailArray.map((m) => m.id);

        const updatedMails = mails.map((mail) => {
            if (idArray.indexOf(mail.id) !== -1) {
                return { ...mail, archived: true };
            } else {
                return mail;
            }
        });
        setMails(updatedMails);
    };

    const onSpamMultiple = (mailArray) => {
        const idArray = mailArray.map((m) => m.id);

        const updatedMails = mails.map((mail) => {
            if (idArray.indexOf(mail.id) !== -1) {
                return {
                    ...mail,
                    spam: true,
                    important: false,
                    starred: false,
                    archived: false
                };
            } else {
                return mail;
            }
        });
        setMails(updatedMails);
    };

    const onTrash = (id) => {
        let _mails = mails.map((m) => (m.id === id ? { ...m, trash: true } : m));
        setMails(_mails);
    };

    const onSend = (mail) => {
        let _mails = mails;
        if (!mail.id) {
            mail.id = parseInt(generateId());
        }
        if (!mail.title) {
            mail.title = 'Untitled';
        }

        mail.date = generateDate();
        _mails.push(mail);
        setMails(_mails);
    };

    const generateId = () => {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    };

    const generateDate = () => {
        return new Date().toDateString().split(' ').slice(1, 4).join(' ');
    };

    const value = {
        mails,
        toastRef,
        updateMails,
        onStar,
        onArchive,
        onBookmark,
        onDelete,
        onDeleteMultiple,
        onArchiveMultiple,
        onSpamMultiple,
        onTrash,
        onSend
    };

    return (
        <React.Fragment>
            <Toast ref={toastRef} />
            <MailContext.Provider value={value}>{props.children}</MailContext.Provider>
        </React.Fragment>
    );
};
