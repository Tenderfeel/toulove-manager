<template>
  <a-layout-content>
    <a-page-header title="ドロップ情報">
      <template slot="extra">
        <a-select
          v-if="initialized"
          :default-value="epochOptions[0].value"
          style="min-width: 120px"
          @change="handleFieldChange"
        >
          <a-select-option
            v-for="option in epochOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ `【${option.value}】${option.text}` }}
          </a-select-option>
        </a-select>
      </template>
    </a-page-header>
    <a-spin tip="Loading..." :spinning="!initialized">
      <div class="content main-table">
        <a-table
          :columns="columns"
          :data-source="epochsData"
          :row-key="(record) => record.id"
          size="middle"
        >
          <nuxt-link
            slot="name"
            slot-scope="text, record"
            :to="{ name: 'drop-id', params: { id: record.id } }"
            >{{ text }}</nuxt-link
          >
        </a-table>
      </div>
    </a-spin>
  </a-layout-content>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'DropIndex',
  data() {
    return {
      selectEpoch: 1
    }
  },
  computed: {
    ...mapState(['initialized']),
    ...mapGetters(['epochOptions', 'areaLabels']),

    columns() {
      const columns = [
        {
          title: '#',
          dataIndex: 'id',
          sorter: (a, b) => a.id - b.id,
          width: '3rem'
        },
        {
          title: '刀名',
          dataIndex: 'name',
          sorter: false,
          scopedSlots: { customRender: 'name' }
        }
      ]

      if (!Object.keys(this.areaLabels).length) return columns

      new Array(4).fill(null).forEach((n, i) => {
        const id = `${this.selectEpoch}-${i + 1}`
        if (this.areaLabels[id]) {
          columns.push({
            title: id,
            children: [
              {
                title: this.areaLabels[id].area,
                dataIndex: id
              }
            ]
          })
        }
      })

      return columns
    },

    epochsData() {
      const result = []
      this.$store.state.drops.forEach((drop) => {
        // {
        //   id: 3,
        //   name: '三日月宗近',
        //   '1-1': '',
        //   '1-2': ''
        // }
        const epoch = Object.keys(drop).reduce((acc, cur) => {
          if (!/\d-\d/.test(cur)) {
            return acc
          }
          const regexp = new RegExp(`${this.selectEpoch}-\\d`)

          if (!regexp.test(cur)) return acc
          acc[cur] = drop[cur]
          return acc
        }, {})

        if (Object.values(epoch).some((value) => value.length)) {
          result.push({
            id: drop.id,
            name: drop.name,
            ...epoch
          })
        }
      })
      return result
    }
  },
  methods: {
    handleFieldChange(value) {
      this.selectEpoch = value
    }
  }
}
</script>

<style lang="css" scoped></style>
