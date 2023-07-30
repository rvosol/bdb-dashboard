import { useRouter } from 'next/router';
import { ObjectUtils } from 'primereact/utils';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppBreadcrumb = (props) => {
    const router = useRouter();
    const [breadcrumb, setBreadcrumb] = useState({});
    const { breadcrumbs } = useContext(LayoutContext);

    useEffect(() => {
        const filteredBreadcrumbs = breadcrumbs?.find((crumb) => {
            const lastPathSegment = crumb.to.split('/').pop();
            const lastRouterSegment = router.pathname.split('/').pop();

            if (lastRouterSegment?.startsWith('[') && !isNaN(Number(lastPathSegment))) {
                return router.pathname.split('/').slice(0, -1).join('/') === crumb.to?.split('/').slice(0, -1).join('/');
            }
            return crumb.to === router.pathname;
        });

        setBreadcrumb(filteredBreadcrumbs);
    }, [router, breadcrumbs]);
    console.log(router.pathname)

    let firstLabel = true
    if(router.pathname  !== "/apps/calendar" || router.pathname  !== "/dashboard-profile") {
        firstLabel = false
    }
    return (
        <div className={props.className}>
            <nav className="layout-breadcrumb">
                <ol>
                    {ObjectUtils.isNotEmpty(breadcrumb)
                        ? breadcrumb.labels.map((label, index) => {
                            if (index !== 0) {
                                return (
                                    <>
                                        {router.pathname !== "/" && (
                                            <React.Fragment key={index}>
                                                {firstLabel && (
                                                    <li className="layout-breadcrumb-chevron"> / </li>
                                                )}
                                                
                                                <li key={index}>{label}</li>
                                            </React.Fragment>
                                        )}
                                    </>

                                );
                            }
                            return  <> 
                             {firstLabel && (
                                            <React.Fragment>
                                               <li key={index}>{label}</li>
                                            </React.Fragment>
                                        )}
                            
                            </> 
                        })
                        : null}
                </ol>
            </nav>
        </div>
    );
};

export default AppBreadcrumb;
