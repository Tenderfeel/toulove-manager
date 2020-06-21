<template>
  <a-layout>
    <a-layout-sider
      v-model="collapsed"
      :style="{ overflow: 'auto', minHeight: '100vh', position: 'fixed' }"
      collapsible
    >
      <a-menu theme="dark" mode="inline" :selected-keys="[selectedMenuKeys]">
        <a-menu-item key="1">
          <nuxt-link to="/" exact
            ><a-icon type="home" /><span>Home</span></nuxt-link
          >
        </a-menu-item>
        <a-menu-item key="2">
          <nuxt-link to="/ownership" exact
            ><a-icon type="team" /><span>所属</span></nuxt-link
          >
        </a-menu-item>
        <a-menu-item key="3">
          <nuxt-link to="/visual" exact
            ><a-icon type="picture" /><span>イラスト</span></nuxt-link
          >
        </a-menu-item>
        <a-menu-item key="4">
          <nuxt-link to="/memoir" exact
            ><a-icon type="message" /><span>回想</span></nuxt-link
          >
        </a-menu-item>
        <a-menu-item key="5">
          <nuxt-link to="/drop" exact
            ><a-icon type="cloud-download" /><span>ドロップ</span></nuxt-link
          >
        </a-menu-item>
        <a-menu-item key="6">
          <nuxt-link to="/area" exact
            ><a-icon type="compass" /><span>エリア</span></nuxt-link
          >
        </a-menu-item>
        <a-menu-item key="7">
          <nuxt-link to="/config" exact
            ><a-icon type="setting" /><span>設定</span></nuxt-link
          >
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout
      style="transition: all 0.2s;"
      :style="{ marginLeft: collapsed ? '80px' : '200px' }"
    >
      <nuxt />
      <a-layout-footer :style="{ textAlign: 'center' }">
        &copy;
        <a href="https://twitter.com/Tenderfeel" target="_blank">Tenderfeel</a>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  data() {
    return {
      collapsed: false
    }
  },
  computed: {
    selectedMenuKeys() {
      return String(
        [
          'index',
          'ownership',
          'visual',
          'memoir',
          'drop',
          'area',
          'config'
        ].findIndex((m) => this.$route.name.includes(m)) + 1
      )
    }
  }
}
</script>
