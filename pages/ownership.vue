<template>
  <a-layout-content>
    <a-page-header title="所属状況">
      <template slot="extra">
        <a-tag
          >収集：{{
            `${collectionRate.current}/${collectionRate.total}`
          }}</a-tag
        >
        <a-tag class="m0"
          >{{ `${collectionRate.char}/${collectionRate.charTotal}` }}口</a-tag
        >
      </template>
    </a-page-header>
    <a-spin tip="Loading..." :spinning="!initialized">
      <div class="content main-table">
        <a-table
          :columns="columns"
          :data-source="normalCharacters"
          :row-key="(record) => record.id"
        >
          <nuxt-link
            slot="name"
            slot-scope="text, record"
            :to="{ name: 'drop-id', params: { id: record.id } }"
            >{{ text }}</nuxt-link
          >
          <template slot="extreme" slot-scope="text">{{
            text > 0 ? text : '-'
          }}</template>
          <template slot="special" slot-scope="text">{{
            String(text).split(',')[0]
          }}</template>
          <template slot="ownership" slot-scope="text, record">
            <a-checkbox-group
              :default-value="record.ownership"
              :options="getOwnershipOptions(record)"
              @change="onChange(record, $event)"
            />
          </template>
        </a-table>
      </div>
    </a-spin>
  </a-layout-content>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Ownership',
  data() {
    return {
      columns: [
        {
          title: 'No',
          dataIndex: 'id',
          sorter: (a, b) => a.id - b.id,
          width: '3rem'
        },
        {
          title: '刀名',
          dataIndex: 'name',
          sorter: false,
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '種類',
          dataIndex: '種類',
          sorter: false,
          width: 80,
          filters: this.$store.getters.typeOptions,
          onFilter: (value, record) => record['種類'].indexOf(value) === 0
        },
        {
          title: '特',
          dataIndex: '特',
          width: 80,
          scopedSlots: { customRender: 'special' }
        },
        {
          title: '極',
          dataIndex: '極',
          width: 80,
          scopedSlots: { customRender: 'extreme' }
        },
        {
          title: '所属',
          dataIndex: 'ownership',
          filters: [
            { text: '所属中', value: '所属中' },
            { text: '未所属', value: '未所属' }
          ],
          scopedSlots: { customRender: 'ownership' },
          onFilter: (value, record) => {
            if (value === '所属中') {
              return record.ownership.includes('通常')
            }
            return record.ownership.includes('通常') === false
          }
        }
      ]
    }
  },
  computed: {
    ...mapState(['initialized']),
    ...mapGetters(['collectionRate', 'normalCharacters'])
  },
  methods: {
    onChange(character, ownership) {
      this.$store.commit('updateOwnership', { character, ownership })
      this.$store.dispatch('save')
    },
    getOwnershipOptions(record) {
      const options = [{ label: '通常', value: '通常' }]

      if (record.name === '髭切') console.log(record)

      String(record['特'])
        .split(',')
        .forEach((sp, index) => {
          const label = index > 0 ? `特${index + 1}` : '特'
          options.push({ label, value: label })
        })

      options.push({ label: '極', value: '極', disabled: record['極'] === 0 })

      return options
    }
  },
  head() {
    return {
      title: `所属状況 - ${process.env.SITE_NAME}`
    }
  }
}
</script>
