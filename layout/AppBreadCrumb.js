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

    return (
        <div className={props.className}>
            <nav className="layout-breadcrumb">
                <ol>
                    {ObjectUtils.isNotEmpty(breadcrumb)
                        ? breadcrumb.labels.map((label, index) => {
                              if (index !== 0) {
                                  return (
                                      <React.Fragment key={index}>
                                          <li className="layout-breadcrumb-chevron"> / </li>
                                          <li key={index}>{label}</li>
                                      </React.Fragment>
                                  );
                              }
                              return <li key={index}>{label}</li>;
                          })
                        : null}
                </ol>
            </nav>
        </div>
    );
};

export default AppBreadcrumb;
