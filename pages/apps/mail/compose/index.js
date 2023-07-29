import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { InputText } from 'primereact/inputtext';
import React, { useContext, useState } from 'react';
import AppMailLayout from '../../../../demo/components/apps/mail/AppMailLayout';
import { MailContext } from '../../../../demo/components/apps/mail/context/mailcontext';
import Layout from '../../../../layout/layout';

const AppMailCompose = () => {
    const { onSend, toastRef } = useContext(MailContext);
    const router = useRouter();
    const [newMail, setNewMail] = useState({
        id: 0,
        from: '',
        to: '',
        email: '',
        image: '',
        title: '',
        message: '',
        date: '',
        important: false,
        starred: false,
        trash: false,
        spam: false,
        archived: false,
        sent: true
    });

    const sendMail = () => {
        if (newMail.message) {
            onSend(newMail);
            toastRef.current.show({ severity: 'success', summary: 'Success', detail: 'Mail sent' });
            router.push('/apps/mail/inbox');
        }
    };

    const goBack = () => {
        router.back();
    };

    return (
        <>
            <div className="flex align-items-center px-4 md:px-0 border-top-1 surface-border md:border-none pt-4 md:pt-0">
                <Button type="button" icon="pi pi-chevron-left" className="p-button-outlined p-button-secondary surface-border text-900 w-3rem h-3rem mr-3" onClick={goBack}></Button>
                <span className="block text-900 font-bold text-xl">Compose Message</span>
            </div>
            <div className="surface-section grid mt-4 grid-nogutter formgrid p-4 gap-3 md:surface-border md:border-1 border-round">
                <div className="col-12 field">
                    <label htmlFor="to" className="text-900 font-semibold">
                        To
                    </label>
                    <span className="p-input-icon-left w-full" style={{ height: '3.5rem' }}>
                        <i className="pi pi-user" style={{ left: '1.5rem' }}></i>
                        <InputText id="to" placeholder="To" value={newMail.to} onChange={(e) => setNewMail((prevState) => ({ ...prevState, to: e.target.value }))} className="w-full pl-7 text-900 font-semibold" style={{ height: '3.5rem' }} />
                    </span>
                </div>
                <div className="col-12 field">
                    <label htmlFor="Subject" className="text-900 font-semibold">
                        Subject
                    </label>
                    <span className="p-input-icon-left w-full" style={{ height: '3.5rem' }}>
                        <i className="pi pi-pencil" style={{ left: '1.5rem' }}></i>
                        <InputText
                            id="subject"
                            value={newMail.title}
                            onChange={(e) => setNewMail((prevState) => ({ ...prevState, title: e.target.value }))}
                            placeholder="Subject"
                            className="w-full pl-7 text-900 font-semibold"
                            style={{ height: '3.5rem' }}
                        />
                    </span>
                </div>
                <div className="col-12 field">
                    <Editor style={{ height: '250px' }} value={newMail.message} onTextChange={(e) => setNewMail((prevState) => ({ ...prevState, message: e.htmlValue ?? '' }))}></Editor>
                </div>
                <div className="col-12 flex column-gap-3 justify-content-end">
                    <Button type="button" className="p-button-primary h-3rem w-full sm:w-auto" icon="pi pi-send" label="Send Message" onClick={sendMail}></Button>
                </div>
            </div>
        </>
    );
};

AppMailCompose.getLayout = function getLayout(page) {
    return (
        <Layout>
            <AppMailLayout>{page}</AppMailLayout>
        </Layout>
    );
};

export default AppMailCompose;
