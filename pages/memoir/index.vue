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
          <template slot="epoch" slot-scope="text, record"
            >{{ text }}<br />{{ record.area }}</template
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
          sorter: false,
          scopedSlots: { customRender: 'title' }
        },
        {
          title: '時代/エリア',
          dataIndex: 'epoch',
          sorter: false,
          scopedSlots: { customRender: 'epoch' }
          // filters: this.$store.getters.typeOptions,
          // onFilter: (value, record) => record['種類'].indexOf(value) === 0
        },
        {
          title: '対象',
          dataIndex: 'member',
          scopedSlots: { customRender: 'member' }
        },
        {
          title: '状況',
          filters: [
            { text: '完了', value: 1 },
            { text: '未完了', value: 0 }
          ],
          scopedSlots: { customRender: 'complete' },
          onFilter: (value, record) => {
            return record.complete === Boolean(value)
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
    }
  }
}
</script>
