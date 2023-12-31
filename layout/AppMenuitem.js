import Link from 'next/link';
import { useRouter } from 'next/router';
import { Ripple } from 'primereact/ripple';
import { classNames } from 'primereact/utils';
import { Checkbox } from "primereact/checkbox";
import { useContext, useEffect, useRef } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { MenuContext } from './context/menucontext';
import { useSubmenuOverlayPosition } from './hooks/useSubmenuOverlayPosition';
import { CalendarContext } from '../demo/components/apps/calendar/context/calendarcontext';

const AppMenuitem = (props) => {
    const { activeMenu, setActiveMenu } = useContext(MenuContext);
    const { isSlim, isSlimPlus, isHorizontal, isDesktop, setLayoutState, layoutState, layoutConfig } = useContext(LayoutContext);
    const { calendars, toggleCalendarSelection, selectedCalendars } = useContext(CalendarContext);
    const router = useRouter();
    const submenuRef = useRef(null);
    const menuitemRef = useRef(null);
    const item = props.item;
    const key = props.parentKey ? props.parentKey + '-' + props.index : String(props.index);
    const isActiveRoute = item.to && router.pathname === item.to;
    const active = activeMenu === key || !!(activeMenu && activeMenu.startsWith(key + '-'));

    useSubmenuOverlayPosition({
        target: menuitemRef.current,
        overlay: submenuRef.current,
        container: menuitemRef.current && menuitemRef.current.closest('.layout-menu-container'),
        when: props.root && active && (isSlim() || isSlimPlus() || isHorizontal()) && isDesktop()
    });

    useEffect(() => {
        if (layoutState.resetMenu) {
            setActiveMenu('');
            setLayoutState((prevLayoutState) => ({ ...prevLayoutState, resetMenu: false }));
        }
    }, [layoutState]);

    useEffect(() => {
        if (!(isSlim() || isSlimPlus() || isHorizontal()) && isActiveRoute) {
            setActiveMenu(key);
        }

        const onRouteChange = (url) => {
            if (!(isSlim() || isSlimPlus() || isHorizontal()) && item.to && item.to === url) {
                setActiveMenu(key);
            }
        };

        router.events.on('routeChangeComplete', onRouteChange);
        return () => {
            router.events.off('routeChangeComplete', onRouteChange);
        };
    }, [router, layoutConfig]);

    const itemClick = (event) => {
        //avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return;
        }

        // navigate with hover
        // if (props.root && (isSlim() || isHorizontal() || isSlimPlus())) {
        //     const isSubmenu = event.currentTarget.closest('.layout-root-menuitem.active-menuitem > ul') !== null;
        //     if (isSubmenu) setLayoutState((prevLayoutState) => ({ ...prevLayoutState, menuHoverActive: true }));
        //     else setLayoutState((prevLayoutState) => ({ ...prevLayoutState, menuHoverActive: !prevLayoutState.menuHoverActive }));
        // }

        //execute command
        if (item.command) {
            item.command({ originalEvent: event, item: item });
        }

        // toggle active state
        if (item.items) {
            setActiveMenu(active ? props.parentKey : key);

            if (props.root && !active && (isSlim() || isHorizontal() || isSlimPlus())) {
                setLayoutState((prevLayoutState) => ({ ...prevLayoutState, overlaySubmenuActive: true }));
            }
        } else {
            if (!isDesktop()) {
                setLayoutState((prevLayoutState) => ({ ...prevLayoutState, staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive }));
            }

            if (isSlim() || isSlimPlus() || isHorizontal()) {
                setLayoutState((prevLayoutState) => ({ ...prevLayoutState, menuHoverActive: false }));
            }

            setActiveMenu(key);
        }
    };

    const onMouseEnter = () => {
        // activate item on hover
        // if (props.root && (isSlim() || isHorizontal() || isSlimPlus()) && isDesktop()) {
        //     if (!active && layoutState.menuHoverActive) {
        //         setActiveMenu(key);
        //     }
        // }
    };

    const badge = item.badge ? <span className={classNames('layout-menu-badge p-tag p-tag-rounded ml-2 uppercase', { [`${badge}`]: true, 'p-tag-success': badge === 'new', 'p-tag-info': badge === 'updated' })}>{badge}</span> : null;
    const subMenu =
        item.items && item.visible !== false ? (
            <ul ref={submenuRef}>
                {item.items.map((child, i) => {
                    return <AppMenuitem item={child} index={i} className={child.badgeClass} parentKey={key} key={child.label} />;
                })}
            </ul>
        ) : null;

    return (
        <>
            {item?.type === "calendar_filter" ? 
               <>
               <div className="text-900 font-medium text-xl mb-2" style={{ marginLeft: "32px" }}>
                 Private Calendars
               </div>
               {calendars.filter((calendar) => calendar?.privacy && calendar?.privacy.toLowerCase() === 'private').length === 0 ? (
                 <div className="text-lg text-red-400" style={{ marginLeft: "35px" }}>
                   Calendar not found.
                 </div>
               )
                : (<>
                {calendars
                 .filter((calendar) => calendar?.privacy && calendar?.privacy.toLowerCase() === 'private')
                 .map((calendar) => (
                   <div key={calendar._id} className="flex align-items-center mb-2" style={{ marginLeft: "32px" }}>
                     <Checkbox
                       inputId={`calendar_${calendar._id}`}
                       onChange={() => toggleCalendarSelection(calendar._id)}
                       checked={selectedCalendars.includes(calendar._id)}
                     />
                     <label htmlFor={`calendar_${calendar._id}`} className="ml-2">
                       {calendar?.title}
                     </label>
                   </div>
                 ))}
                </>)
            }
               
               
           
               <div className="text-900 font-medium text-xl mb-2" style={{ marginLeft: "32px" }}>
                 Public Calendars
               </div>
               {calendars.filter((calendar) => calendar?.privacy && calendar?.privacy.toLowerCase() === 'public').length === 0 ? (
                 <div className="text-lg text-red-400" style={{ marginLeft: "35px" }}>
                   Calendar not found.
                 </div>
               ) : (
                <>
                {calendars
                 .filter((calendar) => calendar?.privacy && calendar?.privacy.toLowerCase() === 'public')
                 .map((calendar) => (
                   <div key={calendar._id} className="flex align-items-center mb-2" style={{ marginLeft: "32px" }}>
                     <Checkbox
                       inputId={`calendar_${calendar._id}`}
                       onChange={() => toggleCalendarSelection(calendar._id)}
                       checked={selectedCalendars.includes(calendar._id)}
                     />
                     <label htmlFor={`calendar_${calendar._id}`} className="ml-2">
                       {calendar?.title}
                     </label>
                   </div>
                 ))}
                </>
               )}
               
               
             </> :
            <li ref={menuitemRef} className={classNames({ 'layout-root-menuitem': props.root, 'active-menuitem': active })}>
                {props.root && item.visible !== false && <div className="layout-menuitem-root-text">{item.label}</div>}
                {(!item.to || item.items) && item.visible !== false ? (
                    <>
                        <a
                            href={item.url}
                            onClick={(e) => itemClick(e)}
                            className={classNames(item.class, 'p-ripple tooltip-target')}
                            target={item.target}
                            data-pr-tooltip={item.label}
                            data-pr-disabled={!(isSlim() && props.root && !layoutState.menuHoverActive)}
                            tabIndex={0}
                            onMouseEnter={onMouseEnter}
                        >
                            <i className={classNames('layout-menuitem-icon', item.icon)}></i>
                            <span className="layout-menuitem-text">{item.label}</span>
                            {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                            <Ripple />
                        </a>
                    </>
                ) : null}

                {item.to && !item.items && item.visible !== false ? (
                    <>
                        <Link href={item.to} replace={item.replaceUrl} onClick={(e) => itemClick(e)} className={classNames(item.class, 'p-ripple ', { 'active-route': isActiveRoute })} tabIndex={0} onMouseEnter={onMouseEnter}>
                            <i className={classNames('layout-menuitem-icon', item.icon)}></i>
                            <span className="layout-menuitem-text">{item.label}</span>
                            {badge}
                            {item.items && <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>}
                            <Ripple />
                        </Link>
                    </>
                ) : null}
                {subMenu}
            </li>
            }
        </>
    );
};

export default AppMenuitem;
