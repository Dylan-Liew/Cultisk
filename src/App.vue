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
        @item-click="onItemClick"
        @collapse="onCollapse"/>
  </div>
</template>
<style lang="scss">
/*You put CSS that applies to all things rendered in the <router-view>*/
// Google Fonts
@import url('https://fonts.googleapis.com/css2?family=Montserrat+Alternates:ital,wght@0,300;0,400;1,300&display=swap');

// Font Variables
$Montserrat: 'Montserrat Alternates', serif;

// Styles
// TODO: this is her to make default template visible. Remove after development.
body {
  font-family: $Montserrat !important;
}

body{
  background-color: #222222 !important;
}
#view {
  padding-left: 50px;
}

#view.collapsed {
  padding-left: 50px;
}

.sidebar.v-sidebar-menu .vsm-arrow:after {
  content: "\f105";
  font-family: "Font Awesome 5 Free", serif;
  color: #fff;
}

.sidebar.v-sidebar-menu .collapse-btn:after {
  content: "\f337";
  font-family: "Font Awesome 5 Free", serif;
}
.v-sidebar-menu .vsm-header{
  font-size: 1.2em;
  text-align: center;
}
.v-sidebar-menu a {
  text-decoration: none !important;
}

.v-sidebar-menu .vsm-title{
  color: #ffffff;
}

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
              href: '/password-manager/credit-cards',
              title: 'Credit Cards',
              icon: 'fa fa-plus',
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
              href: '/anti-virus/deleted-files',
              title: 'Deleted Files',
              icon: 'fa fa-trash',
            },
          ],
        },
        {
          title: 'Backup',
          icon: 'fa fa-database',
          href: '/backup',
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
        {
          title: 'Change Password',
          icon: 'fa fa-cog',
          href: '/settings/',
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
      if (this.collapsed) {
        document.getElementById('view').style.opacity = '1';
      } else {
        document.getElementById('view').style.opacity = '0.6';
      }
    },
  },
  computed: mapGetters(['navStatus']),
};
</script>
