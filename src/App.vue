<template>
  <div id="app">
    <div id="view" :class="[{'collapsed' : collapsed}]">
      <router-view/>
    </div>
    <sidebar-menu
      v-if="navStatus"
      class="sidebar"
      :menu="menu"
      :collapsed="collapsed"
      :show-one-child="showOneChild"
      theme="test"
      @item-click="onItemClick"
      @collapse="onCollapse"/>
  </div>
</template>
<style lang="scss">
/*You put CSS that applies to all things rendered in the <router-view>*/
/* TODO: Remove the p: color white before presentation */
p, h1 {
  color: white;
}
@import "~vue-material/dist/theme/engine"; // Import the theme engine

@include md-register-theme("test", (
  primary: md-get-palette-color(green, A200), // The primary color of your application
  accent: md-get-palette-color(pink, 500) // The accent or secondary color
));

@import "~vue-material/dist/theme/all"; // Apply the theme
body{
  background-color: #222222 !important;
}
#view {
  padding-left: 50px;
}

#view.collapsed {
  padding-left: 50px;
}

//.sidebar.v-sidebar-menu .vsm-arrow:after {
//  content: "\f105";
//  font-family: "Font Awesome 5 Free", serif;
//  color: #fff;
//}
.sidebar.v-sidebar-menu .collapse-btn:after {
  content: "\f337";
  font-family: "Font Awesome 5 Free", serif;
}
.v-sidebar-menu .vsm-header{
  font-size: 1.2em;
  text-align: center;
}
a {
  text-decoration: none !important;
}
//.v-sidebar-menu .vsm-title{
//  color: #ffffff;
//}
</style>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Cultisk',
  data() {
    return {
      // Use object to define Vue Router to: prop
      // e.g. { name: 'user', params: { test: 'hi' } }
      // Template /user/:test
      // Generated URL /users/hi/
      // name = name of route, defined in router, params = parameter of route
      menu: [
        {
          header: true,
          title: 'Cultisk',
        },
        {
          href: '/',
          title: 'Home',
          icon: 'fa fa-home',
        },
        {
          title: 'Password Manager',
          icon: 'fa fa-key',
          child: [
            {
              href: '/password-manager/',
              title: 'View Password',
              icon: 'fa fa-unlock-alt',
            },
            {
              href: '/password-manager/add-password',
              title: 'Add Password',
              icon: 'fa fa-file-alt',
            },
            {
              href: '/password-manager/credit-cards',
              title: 'Credit Cards',
              icon: 'fa fa-plus',
            },
            {
              href: '/password-manager/change-master-pass',
              title: 'Change Master Password',
              icon: 'fa fa-edit',
            },
            {
              href: '/password-manager/password-generator',
              title: 'Password Generator',
              icon: 'fa fa-random',
            },
          ],
        },

        {
          href: '/software-updater',
          title: 'Software Updater',
          icon: 'fa fa-clipboard-check',
        },
        {
          title: 'Anti Virus',
          icon: 'fa fa-shield-virus',
          child: [
            {
              href: '/anti-virus',
              title: 'Anti Virus Scan',
              icon: 'fa fa-virus',
            },
            {
              href: '/anti-virus/scheduled-scan',
              title: 'Scheduled Scan',
              icon: 'fa fa-clock',
            },
          ],
        },
        {
          title: 'Backup',
          icon: 'fa fa-database',
          child: [
            {
              href: '/backup',
              title: 'View Backup',
              icon: 'fa fa-server',
            },
            {
              href: '/backup/upload-files',
              title: 'Upload Files',
              icon: 'fa fa-upload',
            },
            {
              href: '/backup/scheduled-backup-settings',
              title: 'Scheduled Backup Settings',
              icon: 'fa fa-calendar-week',
            },
          ],
        },
        {
          title: 'Email Filtering',
          icon: 'fa fa-filter',
          child: [
            {
              href: '/email-filter/',
              title: 'View Filtered Email',
              icon: 'fa fa-list',
            },
            {
              href: '/email-filter/whitelist',
              title: 'Whitelist Management',
              icon: 'fa fa-list-alt',
            },
          ],
        },
      ],
      collapsed: true,
      showOneChild: true,
    };
  },
  methods: {
    onItemClick() {
      /*  pass; */
    },
    onCollapse(c) {
      this.collapsed = c;
    },
  },
  computed: mapGetters(['navStatus']),
};
</script>
