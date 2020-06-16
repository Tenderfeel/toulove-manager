<template>
  <a-layout-content>
    <a-page-header
      :title="pageTitle"
      :sub-title="subTitle"
      @back="() => $router.go(-1)"
    >
      <template slot="extra"> </template>
    </a-page-header>
    <a-spin tip="Loading..." :spinning="!initialized">
      <div v-if="character" class="content main-table">
        <a-table
          :columns="columns"
          :data-source="character.data"
          :row-key="(record) => record.id"
        >
          <template slot="normal" slot-scope="text">{{
            text ? '○' : ''
          }}</template>
          <template slot="boss" slot-scope="text">{{
            text ? '○' : ''
          }}</template>
        </a-table>
      </div>
      <div v-else class="content">
        <a-result status="404" sub-title="データが見つかりませんでした">
          <template #extra>
            <a-button type="primary" @click="$router.push('/drop')">
              一覧に戻る
            </a-button>
          </template>
        </a-result>
      </div>
    </a-spin>
  </a-layout-content>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'DropDetail',

  asyncData({ params: { id }, store, error }) {
    return { id }
  },

  data() {
    return {
      id: null,
      columns: [
        {
          title: '#',
          dataIndex: 'id',
          sorter: (a, b) => a.id - b.id,
          width: '3rem'
        },
        {
          title: '時代',
          dataIndex: 'epoch'
        },
        {
          title: 'エリア',
          dataIndex: 'area'
        },
        {
          title: '通常',
          dataIndex: 'normal',
          filters: [{ text: 'ドロップあり', value: 1 }],
          scopedSlots: { customRender: 'normal' },
          onFilter: (value, record) => {
            return record.normal === Boolean(value)
          }
        },
        {
          title: 'ボス',
          dataIndex: 'boss',
          filters: [{ text: 'ドロップあり', value: 1 }],
          scopedSlots: { customRender: 'boss' },
          onFilter: (value, record) => {
            return record.boss === Boolean(value)
          }
        }
      ]
    }
  },
  computed: {
    ...mapState(['initialized']),
    ...mapGetters(['epochOptions', 'areaLabels', 'findDropById']),

    pageTitle() {
      let title = 'ドロップ情報'
      if (this.character) {
        title = this.character.name
      }
      return title
    },

    subTitle() {
      return this.character ? 'ドロップ情報' : ''
    },

    character() {
      const character = this.findDropById(Number(this.id))
      const data = []
      if (!character) return null

      Object.keys(this.areaLabels).forEach((areaLabel) => {
        if (character[areaLabel].length) {
          data.push({
            id: areaLabel,
            ...this.areaLabels[areaLabel],
            boss: character[areaLabel].includes('ボス'),
            normal: character[areaLabel].includes('通常')
          })
        }
      })

      return { id: character.id, name: character.name, data }
    }
  }
}
</script>
