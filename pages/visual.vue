<template>
  <a-layout-content id="visual">
    <a-page-header title="イラスト入手状況">
      <template slot="extra">
        <a-tag class="m0"
          >収集：{{ `${visualRate.current}/${visualRate.total}` }}</a-tag
        >
      </template>
    </a-page-header>
    <div class="content main-table">
      <a-spin tip="Loading..." :spinning="!initialized">
        <div class="spin-content">
          <a-config-provider :render-empty="customizeRenderEmpty">
            <a-table
              :columns="columns"
              :data-source="memberCharacters"
              :row-key="(record) => record.id"
            >
              <template slot="name" slot-scope="text">
                <a>{{ text }}</a>
              </template>
              <template slot="visual" slot-scope="text, record">
                <a-checkbox-group
                  :default-value="record.visual"
                  :options="getVisualOptions(record)"
                  :disabled="record.disabled"
                  @change="onChange(record, $event)"
                />
              </template>
            </a-table>
          </a-config-provider>
        </div>
      </a-spin>
    </div>
  </a-layout-content>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Empty } from 'ant-design-vue'

export default {
  name: 'Visual',
  data() {
    return {
      columns: [
        {
          title: 'No',
          dataIndex: 'id',
          sorter: (a, b) => a.id - b.id,
          width: '3rem'
          // fixed: "left"
        },
        {
          title: '刀名',
          dataIndex: 'name',
          sorter: false
          // fixed: "left"
        },
        {
          title: '種類',
          dataIndex: '種類',
          sorter: false,
          width: '10%',
          filters: this.$store.getters.typeOptions,
          onFilter: (value, record) => record['種類'].indexOf(value) === 0
        },
        {
          title: 'イラスト入手',
          key: 'visual',
          dataIndex: 'visual',
          filters: this.$store.getters.visualOptions,
          scopedSlots: { customRender: 'visual' },
          onFilter: (value, record) => !record.visual.includes(value)
        }
      ],
      customizeRenderEmpty: () => {
        return [
          this.$createElement('a-empty', {
            props: {
              image: Empty.PRESENTED_IMAGE_SIMPLE,
              description: '所属設定を行ってください'
            }
          })
        ]
      }
    }
  },
  computed: {
    ...mapState(['initialized']),
    ...mapGetters(['memberCharacters', 'visualRate'])
  },
  methods: {
    onChange(character, visual) {
      this.$store.commit('updateVisual', { character, visual })
      this.$store.dispatch('save')
    },
    getVisualOptions(record) {
      return this.$store.state.visuals.map((visual) => {
        const option = { label: visual, value: visual }

        if (visual === '軽装' && record['軽装'] === 0) {
          option.disabled = true
        }
        return option
      })
    }
  },
  head() {
    return {
      title: `イラスト入手状況 - ${process.env.SITE_NAME}`
    }
  }
}
</script>
