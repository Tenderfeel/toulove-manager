<template>
  <a-layout>
    <a-layout-header
      :style="{ position: 'fixed', zIndex: 1, width: '100%', height: '40px' }"
    >
      <div class="logo" />
      <a-menu
        theme="dark"
        mode="horizontal"
        :default-selected-keys="['1']"
        :style="{ lineHeight: '40px' }"
      >
        <a-menu-item key="1">
          <router-link to="/" exact>Home</router-link>
        </a-menu-item>
        <a-menu-item key="2">
          <router-link to="/ownership" exact
            ><a-icon type="team" />所属</router-link
          >
        </a-menu-item>
        <a-menu-item key="3">
          <router-link to="/visual" exact
            ><a-icon type="picture" />イラスト</router-link
          >
        </a-menu-item>
        <a-menu-item key="4">
          <router-link to="/config" exact
            ><a-icon type="setting" />設定</router-link
          >
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <nuxt />
    <a-layout-footer :style="{ textAlign: 'center' }">
      &copy;
      <a href="https://twitter.com/Tenderfeel" target="_blank">Tenderfeel</a>
    </a-layout-footer>
  </a-layout>
</template>
