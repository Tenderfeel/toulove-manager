<template>
  <a-layout-content>
    <a-page-header title="回想">
      <template slot="extra"> </template>
    </a-page-header>
    <a-spin tip="Loading..." :spinning="!initialized">
      <div class="content main-table">
        <a-table
          :columns="columns"
          :data-source="memoirs"
          :row-key="(record) => record.id"
        >
          <template slot="epoch" slot-scope="text, record">
            <div>{{ epochAreaLabel(text, record.area).epoch }}</div>
            <div>{{ epochAreaLabel(text, record.area).area }}</div></template
          >
          <template slot="member" slot-scope="text">
            <div v-for="(member, mi) in text.split(',')" :key="mi">
              {{ member }}
            </div>
          </template>
          <template slot="complete" slot-scope="text, record">
            <a-checkbox @change="onChange($event, record)" />
          </template>
        </a-table>
      </div>
    </a-spin>
  </a-layout-content>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'MemoirIndex',
  data() {
    return {
      selectEpoch: null,
      columns: [
        {
          title: '#',
          dataIndex: 'id',
          sorter: (a, b) => a.id - b.id,
          width: '3rem'
        },
        {
          title: 'タイトル',
          dataIndex: 'title',
          scopedSlots: { customRender: 'title' }
        },
        {
          title: '時代/エリア',
          dataIndex: 'epoch',
          scopedSlots: { customRender: 'epoch' },
          filters: this.$store.getters.epochOptions.map((epo) => {
            epo.value = String(epo.value)
            return epo
          }),
          onFilter: (value, record) => record.epoch === Number(value)
        },
        {
          title: '対象',
          dataIndex: 'member',
          scopedSlots: { customRender: 'member' }
        },
        {
          title: '状況',
          filters: [
            { text: '完了', value: '完了' },
            { text: '未完了', value: '未完了' }
          ],
          scopedSlots: { customRender: 'complete' },
          onFilter: (value, record) => {
            return record.complete === (value === '完了')
          }
        }
      ]
    }
  },
  computed: {
    ...mapState(['initialized', 'memoirs']),
    ...mapGetters(['epochOptions', 'areaLabels'])
  },
  methods: {
    onChange(e, memoir) {
      this.$store.commit('updateMemoir', { memoir, complete: e.target.checked })
      this.$store.dispatch('save')
    },

    /**
     * @return {Object}
     */
    epochAreaLabel(epoch, area) {
      if (epoch === 0) return { epoch: '指定なし', area: '' }
      return this.areaLabels[`${epoch}-${area}`]
    }
  }
}
</script>
