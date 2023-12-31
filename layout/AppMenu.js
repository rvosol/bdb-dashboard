import AppSubMenu from './AppSubMenu';

const AppMenu = () => {
    const model = [
        {
            label: 'Dashboard',
            icon: 'pi pi-home',
            items: [
                // {
                //     label: 'Cases',
                //     icon: 'pi pi-fw pi-home',
                //     to: '/',
                //     notShowLabel: true
                // },
                // {
                //     label: 'Banking',
                //     icon: 'pi pi-fw pi-image',
                //     to: '/dashboard-banking'
                // },
                {
                    label: 'Profile',
                    icon: 'pi pi-fw pi-image',
                    to: '/'
                }
            ]
        },
        {
            label: 'Apps',
            icon: 'pi pi-th-large',
            items: [
                // {
                //     label: 'Blog',
                //     icon: 'pi pi-fw pi-comment',
                //     items: [
                //         {
                //             label: 'List',
                //             icon: 'pi pi-fw pi-image',
                //             to: '/apps/blog/list'
                //         },
                //         {
                //             label: 'Detail',
                //             icon: 'pi pi-fw pi-list',
                //             to: '/apps/blog/detail'
                //         },
                //         {
                //             label: 'Edit',
                //             icon: 'pi pi-fw pi-pencil',
                //             to: '/apps/blog/edit'
                //         }
                //     ]
                // },
                {
                    label: 'Calendar',
                    icon: 'pi pi-fw pi-calendar',
                    to: '/apps/calendar',
                    items: [
                        {
                            label: 'App',
                            icon: 'pi pi-fw pi-calendar',
                            to: '/apps/calendar',
                        },
                        {
                            label: 'List',
                            icon: 'pi pi-fw pi-calendar',
                            to: '/apps/calendar',
                            type:"calendar_filter",
                        },
                        {
                            label: 'Settings',
                            icon: 'pi pi-fw pi-cog',
                            to: '/apps/calendar/all' 
                        },

                    ]
                },
                // {
                //     label: 'Chat',
                //     icon: 'pi pi-fw pi-comments',
                //     to: '/apps/chat'
                // },
                // {
                //     label: 'Files',
                //     icon: 'pi pi-fw pi-folder',
                //     to: '/apps/files'
                // },
                // {
                //     label: 'Mail',
                //     icon: 'pi pi-fw pi-envelope',
                //     items: [
                //         {
                //             label: 'Inbox',
                //             icon: 'pi pi-fw pi-inbox',
                //             to: '/apps/mail/inbox'
                //         },
                //         {
                //             label: 'Compose',
                //             icon: 'pi pi-fw pi-pencil',
                //             to: '/apps/mail/compose'
                //         },
                //         {
                //             label: 'Detail',
                //             icon: 'pi pi-fw pi-comment',
                //             to: '/apps/mail/detail/1000'
                //         }
                //     ]
                // },
                // {
                //     label: 'Task List',
                //     icon: 'pi pi-fw pi-check-square',
                //     to: '/apps/tasklist'
                // }
            ]
        },
        // {
        //     label: 'UI Kit',
        //     icon: 'pi pi-fw pi-star-fill',
        //     items: [
        //         {
        //             label: 'Form Layout',
        //             icon: 'pi pi-fw pi-id-card',
        //             to: '/uikit/formlayout'
        //         },
        //         {
        //             label: 'Input',
        //             icon: 'pi pi-fw pi-check-square',
        //             to: '/uikit/input'
        //         },
        //         {
        //             label: 'Float Label',
        //             icon: 'pi pi-fw pi-bookmark',
        //             to: '/uikit/floatlabel'
        //         },
        //         {
        //             label: 'Invalid State',
        //             icon: 'pi pi-fw pi-exclamation-circle',
        //             to: '/uikit/invalidstate'
        //         },
        //         {
        //             label: 'Button',
        //             icon: 'pi pi-fw pi-box',
        //             to: '/uikit/button'
        //         },
        //         {
        //             label: 'Table',
        //             icon: 'pi pi-fw pi-table',
        //             to: '/uikit/table'
        //         },
        //         {
        //             label: 'List',
        //             icon: 'pi pi-fw pi-list',
        //             to: '/uikit/list'
        //         },
        //         {
        //             label: 'Tree',
        //             icon: 'pi pi-fw pi-share-alt',
        //             to: '/uikit/tree'
        //         },
        //         {
        //             label: 'Panel',
        //             icon: 'pi pi-fw pi-tablet',
        //             to: '/uikit/panel'
        //         },
        //         {
        //             label: 'Overlay',
        //             icon: 'pi pi-fw pi-clone',
        //             to: '/uikit/overlay'
        //         },
        //         {
        //             label: 'Media',
        //             icon: 'pi pi-fw pi-image',
        //             to: '/uikit/media'
        //         },
        //         {
        //             label: 'Menu',
        //             icon: 'pi pi-fw pi-bars',
        //             to: '/uikit/menu'
        //         },
        //         {
        //             label: 'Message',
        //             icon: 'pi pi-fw pi-comment',
        //             to: '/uikit/message'
        //         },
        //         {
        //             label: 'File',
        //             icon: 'pi pi-fw pi-file',
        //             to: '/uikit/file'
        //         },
        //         {
        //             label: 'Chart',
        //             icon: 'pi pi-fw pi-chart-bar',
        //             to: '/uikit/charts'
        //         },
        //         {
        //             label: 'Misc',
        //             icon: 'pi pi-fw pi-circle-off',
        //             to: '/uikit/misc'
        //         }
        //     ]
        // },
        // {
        //     label: 'Prime Blocks',
        //     icon: 'pi pi-fw pi-prime',
        //     items: [
        //         {
        //             label: 'Free Blocks',
        //             icon: 'pi pi-fw pi-eye',
        //             to: '/blocks'
        //         },
        //         {
        //             label: 'All Blocks',
        //             icon: 'pi pi-fw pi-globe',
        //             url: 'https://blocks.primefaces.org',
        //             target: '_blank'
        //         }
        //     ]
        // },
        // {
        //     label: 'Utilities',
        //     icon: 'pi pi-fw pi-compass',
        //     items: [
        //         {
        //             label: 'PrimeIcons',
        //             icon: 'pi pi-fw pi-prime',
        //             to: '/utilities/icons'
        //         },
        //         {
        //             label: 'Colors',
        //             icon: 'pi pi-fw pi-palette',
        //             to: '/utilities/colors'
        //         },
        //         {
        //             label: 'PrimeFlex',
        //             icon: 'pi pi-fw pi-desktop',
        //             url: 'https://www.primefaces.org/primeflex/',
        //             target: '_blank'
        //         },
        //         {
        //             label: 'Figma',
        //             icon: 'pi pi-fw pi-pencil',
        //             url: 'https://www.figma.com/file/zQOW0XBXdCTqODzEOqwBtt/Preview-%7C-Apollo-2022?node-id=335%3A21768&t=urYI89V3PLNAZEJG-1/',
        //             target: '_blank'
        //         }
        //     ]
        // },
        // {
        //     label: 'Pages',
        //     icon: 'pi pi-fw pi-briefcase',
        //     items: [
        //         {
        //             label: 'Landing',
        //             icon: 'pi pi-fw pi-globe',
        //             to: '/landing'
        //         },
        //         {
        //             label: 'Auth',
        //             icon: 'pi pi-fw pi-user',
        //             items: [
        //                 {
        //                     label: 'Login',
        //                     icon: 'pi pi-fw pi-sign-in',
        //                     to: '/auth/login'
        //                 },
        //                 {
        //                     label: 'Error',
        //                     icon: 'pi pi-fw pi-times-circle',
        //                     to: '/auth/error'
        //                 },
        //                 {
        //                     label: 'Access Denied',
        //                     icon: 'pi pi-fw pi-lock',
        //                     to: '/auth/access'
        //                 },
        //                 {
        //                     label: 'Register',
        //                     icon: 'pi pi-fw pi-user-plus',
        //                     to: '/auth/register'
        //                 },
        //                 {
        //                     label: 'Forgot Password',
        //                     icon: 'pi pi-fw pi-question',
        //                     to: '/auth/forgotpassword'
        //                 },
        //                 {
        //                     label: 'New Password',
        //                     icon: 'pi pi-fw pi-cog',
        //                     to: '/auth/reset-password'
        // },

        //                 {
        //                     label: 'Verification',
        //                     icon: 'pi pi-fw pi-envelope',
        //                     to: '/auth/verification'
        //                 },
        //                 {
        //                     label: 'Lock Screen',
        //                     icon: 'pi pi-fw pi-eye-slash',
        //                     to: '/auth/lockscreen'
        //                 }
        //             ]
        //         },
        //         {
        //             label: 'Crud',
        //             icon: 'pi pi-fw pi-pencil',
        //             to: '/pages/crud'
        //         },
        //         {
        //             label: 'Timeline',
        //             icon: 'pi pi-fw pi-calendar',
        //             to: '/pages/timeline'
        //         },
        //         {
        //             label: 'Invoice',
        //             icon: 'pi pi-fw pi-dollar',
        //             to: '/pages/invoice'
        //         },
        //         {
        //             label: 'About Us',
        //             icon: 'pi pi-fw pi-user',
        //             to: '/pages/aboutus'
        //         },
        //         {
        //             label: 'Help',
        //             icon: 'pi pi-fw pi-question-circle',
        //             to: '/pages/help'
        //         },
        //         {
        //             label: 'Not Found',
        //             icon: 'pi pi-fw pi-exclamation-circle',
        //             to: '/pages/notfound'
        //         },
        //         {
        //             label: 'Empty',
        //             icon: 'pi pi-fw pi-circle-off',
        //             to: '/pages/empty'
        //         },
        //         {
        //             label: 'FAQ',
        //             icon: 'pi pi-fw pi-question',
        //             to: '/pages/faq'
        //         },
        //         {
        //             label: 'Contact Us',
        //             icon: 'pi pi-fw pi-phone',
        //             to: '/pages/contact'
        //         }
        //     ]
        // },
        // {
        //     label: 'E-Commerce',
        //     icon: 'pi pi-fw pi-wallet',
        //     items: [
        //         {
        //             label: 'Product Overview',
        //             icon: 'pi pi-fw pi-image',
        //             to: '/ecommerce/product-overview'
        //         },
        //         {
        //             label: 'Product List',
        //             icon: 'pi pi-fw pi-list',
        //             to: '/ecommerce/product-list'
        //         },
        //         {
        //             label: 'New Product',
        //             icon: 'pi pi-fw pi-plus',
        //             to: '/ecommerce/new-product'
        //         },
        //         {
        //             label: 'Shopping Cart',
        //             icon: 'pi pi-fw pi-shopping-cart',
        //             to: '/ecommerce/shopping-cart'
        //         },
        //         {
        //             label: 'Checkout Form',
        //             icon: 'pi pi-fw pi-check-square',
        //             to: '/ecommerce/checkout-form'
        //         },
        //         {
        //             label: 'Order History',
        //             icon: 'pi pi-fw pi-history',
        //             to: '/ecommerce/order-history'
        //         },
        //         {
        //             label: 'Order Summary',
        //             icon: 'pi pi-fw pi-file',
        //             to: '/ecommerce/order-summary'
        //         }
        //     ]
        // },
        {
            label: 'Admin',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'User Management',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'User',
                            icon: 'pi pi-fw pi-list',
                            to: '/admin/user-management'
                        },
                        {
                            label: 'Position',
                            icon: 'pi pi-fw pi-list',
                            to: '/admin/position-management'
                        },
                        {
                            label: 'Department',
                            icon: 'pi pi-fw pi-list',
                            to: '/admin/department-management'
                        },
                    ]
                },


                {
                    label: 'Contact Management',
                    icon: 'pi pi-fw pi-id-card',
                    to: '/admin/contact-management'
                },
                {
                    label: 'Client Management',
                    icon: 'pi pi-fw pi-user-plus',
                    to: '/admin/client-management'
                },

            ]
        },
        // {
        //     label: 'Client Management',
        //     icon: 'pi pi-fw pi-user',
        //     items: [
        //         {
        //             label: 'List',
        //             icon: 'pi pi-fw pi-list',
        //             to: '/client/list'
        //         },
        //         {
        //             label: 'Create',
        //             icon: 'pi pi-fw pi-plus',
        //             to: '/client/create'
        //         }
        //     ]
        // },
        // {
        //     label: 'Hierarchy',
        //     icon: 'pi pi-fw pi-align-left',
        //     items: [
        //         {
        //             label: 'Submenu 1',
        //             icon: 'pi pi-fw pi-align-left',
        //             items: [
        //                 {
        //                     label: 'Submenu 1.1',
        //                     icon: 'pi pi-fw pi-align-left',
        //                     items: [
        //                         {
        //                             label: 'Submenu 1.1.1',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         },
        //                         {
        //                             label: 'Submenu 1.1.2',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         },
        //                         {
        //                             label: 'Submenu 1.1.3',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     label: 'Submenu 1.2',
        //                     icon: 'pi pi-fw pi-align-left',
        //                     items: [
        //                         {
        //                             label: 'Submenu 1.2.1',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         }
        //                     ]
        //                 }
        //             ]
        //         },
        //         {
        //             label: 'Submenu 2',
        //             icon: 'pi pi-fw pi-align-left',
        //             items: [
        //                 {
        //                     label: 'Submenu 2.1',
        //                     icon: 'pi pi-fw pi-align-left',
        //                     items: [
        //                         {
        //                             label: 'Submenu 2.1.1',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         },
        //                         {
        //                             label: 'Submenu 2.1.2',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     label: 'Submenu 2.2',
        //                     icon: 'pi pi-fw pi-align-left',
        //                     items: [
        //                         {
        //                             label: 'Submenu 2.2.1',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         }
        //                     ]
        //                 }
        //             ]
        //         }
        //     ]
        // },
        // {
        //     label: 'Start',
        //     icon: 'pi pi-fw pi-download',
        //     items: [
        //         {
        //             label: 'Buy Now',
        //             icon: 'pi pi-fw pi-shopping-cart',
        //             url: 'https://www.primefaces.org/store'
        //         },
        //         {
        //             label: 'Documentation',
        //             icon: 'pi pi-fw pi-info-circle',
        //             to: '/documentation'
        //         }
        //     ]
        // }
    ];

    return <AppSubMenu model={model} />;
};

export default AppMenu;
