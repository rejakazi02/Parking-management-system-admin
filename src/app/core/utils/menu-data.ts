import {AdminMenu} from '../../interfaces/core/admin-menu.interface';

export const SUPER_ADMIN_MENU: AdminMenu[] = [
  {
    id: 0,
    name: 'Dashboard',
    hasSubMenu: false,
    routerLink: 'dashboard',
    icon: 'space_dashboard',
    subMenus: [],
  },
  {
    id: 1,
    name: 'Customization',
    hasSubMenu: true,
    routerLink: null,
    icon: 'auto_fix_off',
    subMenus: [

      {
        id: 1,
        name: 'Parking',
        hasSubMenu: true,
        routerLink: 'customization/all-parking',
        icon: 'arrow_right',
      },

    ],
  },



  // {
  //   id: 3,
  //   name: 'Gallery',
  //   hasSubMenu: true,
  //   routerLink: null,
  //   icon: 'collections',
  //   subMenus: [
  //     {
  //       id: 1,
  //       name: 'Images',
  //       hasSubMenu: true,
  //       routerLink: 'gallery/all-images',
  //       icon: 'arrow_right',
  //     },
  //     {
  //       id: 2,
  //       name: 'Folders',
  //       hasSubMenu: true,
  //       routerLink: 'gallery/all-folders',
  //       icon: 'arrow_right',
  //     }
  //   ],
  // },



  {
    id: 4,
    name: 'Profile',
    hasSubMenu: false,
    routerLink: 'profile',
    icon: 'person',

    subMenus: [

    ],
  },



]
