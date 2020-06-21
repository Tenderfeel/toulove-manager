<template>
  <a-layout-content>
    <a-page-header
      :title="areaName"
      :sub-title="epochName"
      @back="() => $router.go(-1)"
    >
      <template slot="extra"> </template>
    </a-page-header>
    <a-spin tip="Loading..." :spinning="!initialized">
      <div class="content main-table">
        {{ id }}
        {{ epochId }}
        {{ areaId }}
        {{ mapId }}
      </div>
    </a-spin>
  </a-layout-content>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'AreaDetail',
  asyncData({ params: { id }, store, error }) {
    if (!id || !/^\d-\d-\d$/.test(id)) {
      return error({ message: '404 Not Found' })
    }
    const [epochId, areaId, mapId] = id.split('-')
    return { epochId, areaId, mapId, id }
  },
  data() {
    return {
      id: null,
      epochId: null,
      areaId: null,
      mapId: null
    }
  },
  computed: {
    ...mapState(['initialized']),
    ...mapGetters(['epochOptions', 'areaLabels']),
    areaName() {
      if (!this.epochId || !this.areaId) return 'エラー'
      return this.areaLabels[`${this.epochId}-${this.areaId}`].area
    },
    epochName() {
      if (!this.epochId || !this.areaId) return 'エラー'
      return this.areaLabels[`${this.epochId}-${this.areaId}`].epoch
    }
  }
}
</script>
