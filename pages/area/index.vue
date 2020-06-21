<template>
  <a-layout-content>
    <a-page-header title="エリア情報">
      <template slot="extra"> </template>
    </a-page-header>
    <a-spin tip="Loading..." :spinning="!initialized">
      <div class="content main-table">
        <a-table
          :columns="columns"
          :data-source="areas"
          :row-key="(record) => `${record.id}-${record.area}`"
          size="middle"
        >
          <nuxt-link
            slot="area"
            slot-scope="text, record"
            :to="{
              name: 'area-id',
              params: { id: `${record.id}-${record.map}` }
            }"
            >{{ text }}</nuxt-link
          >
          <template slot="lv" slot-scope="text">{{ text }}</template>
        </a-table>
      </div>
    </a-spin>
  </a-layout-content>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'AreaIndex',
  data() {
    return {
      selectEpoch: 1,
      columns: [
        {
          title: '#',
          dataIndex: 'id',
          sorter: (a, b) => a.id - b.id,
          width: '3rem'
        },
        {
          title: '時代',
          dataIndex: 'epoch',
          scopedSlots: { customRender: 'epoch' }
        },
        {
          title: 'エリア',
          dataIndex: 'area',
          scopedSlots: { customRender: 'area' }
        },
        {
          title: 'Lv制限',
          dataIndex: 'lv',
          scopedSlots: { customRender: 'lv' }
        }
      ]
    }
  },
  computed: {
    ...mapState(['initialized', 'areas']),
    ...mapGetters(['epochOptions', 'areaLabels'])
  }
}
</script>
