<template>
  <a-layout>
    <a-layout-header
      :style="{ position: 'fixed', zIndex: 1, width: '100%', height: '40px' }"
    >
      <div class="logo" />
      <a-menu
        theme="dark"
        mode="horizontal"
        :default-selected-keys="[selectedMenuKeys]"
        :style="{ lineHeight: '40px' }"
      >
        <a-menu-item key="1">
          <nuxt-link to="/" exact>Home</nuxt-link>
        </a-menu-item>
        <a-menu-item key="2">
          <nuxt-link to="/ownership" exact
            ><a-icon type="team" />所属</nuxt-link
          >
        </a-menu-item>
        <a-menu-item key="3">
          <nuxt-link to="/visual" exact
            ><a-icon type="picture" />イラスト</nuxt-link
          >
        </a-menu-item>
        <a-menu-item key="4">
          <nuxt-link to="/drop" exact
            ><a-icon type="cloud-download" />ドロップ</nuxt-link
          >
        </a-menu-item>
        <a-menu-item key="5">
          <nuxt-link to="/config" exact
            ><a-icon type="setting" />設定</nuxt-link
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

<script>
export default {
  computed: {
    selectedMenuKeys() {
      return String(
        ['index', 'ownership', 'visual', 'drop', 'config'].findIndex(
          (m) => m === this.$route.name
        ) + 1
      )
    }
  }
}
</script>
