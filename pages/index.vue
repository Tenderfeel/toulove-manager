<template>
  <a-layout-content>
    <a-page-header title="本丸管理" :sub-title="`v${version}`" />
    <a-row :gutter="[16, 8]">
      <a-col :span="12">
        <a-card title="所属状況">
          <nuxt-link slot="extra" to="/ownership"
            ><a-icon type="right"
          /></nuxt-link>
          <a-spin tip="Loading..." :spinning="!initialized">
            <div class="flex">
              <a-progress
                :width="60"
                type="circle"
                :percent="
                  Math.round(
                    (collectionRate.current / collectionRate.total) * 100
                  )
                "
              />
              <div class="flex-auto m4l">
                <a-statistic title="収集" :value="collectionRate.current">
                  <template slot="prefix"> </template>
                  <template #suffix>
                    <span> / {{ collectionRate.total }}</span>
                  </template>
                </a-statistic>
              </div>
            </div>
            <div class="flex m3t">
              <a-progress
                :width="60"
                type="circle"
                :percent="
                  Math.round(
                    (collectionRate.char / collectionRate.charTotal) * 100
                  )
                "
              />
              <div class="flex-auto m4l">
                <a-statistic title="所属" :value="collectionRate.char">
                  <template #suffix>
                    <span> / {{ collectionRate.charTotal }}口</span>
                  </template>
                </a-statistic>
              </div>
            </div>
            <a-descriptions title="内訳" size="small" :column="2" class="m4t">
              <a-descriptions-item
                v-for="(type, index) in types"
                :key="index"
                :label="type"
              >
                {{ collectionRate.detail[type].current }} /
                {{ collectionRate.detail[type].total }}
              </a-descriptions-item>
            </a-descriptions>
          </a-spin>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="イラスト入手状況">
          <nuxt-link slot="extra" to="/visual"
            ><a-icon type="right"
          /></nuxt-link>
          <a-spin tip="Loading..." :spinning="!initialized">
            <div class="flex">
              <a-progress
                :width="60"
                type="circle"
                :percent="
                  Math.round((visualRate.current / visualRate.total) * 100)
                "
              />
              <div class="flex-auto m4l">
                <a-statistic title="収集" :value="visualRate.current">
                  <template slot="prefix"> </template>
                  <template #suffix>
                    <span> / {{ visualRate.total }}</span>
                  </template>
                </a-statistic>
              </div>
            </div>
            <a-descriptions title="内訳" size="small" :column="2" class="m4t">
              <a-descriptions-item
                v-for="(visual, index) in visuals"
                :key="index"
                :label="visual"
              >
                {{ visualRate.detail[visual].current }} /
                {{ visualRate.detail[visual].total }}
              </a-descriptions-item>
            </a-descriptions>
          </a-spin>
        </a-card>
      </a-col>
    </a-row>
  </a-layout-content>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  components: {},

  data() {
    return {}
  },

  computed: {
    ...mapState(['initialized', 'visuals', 'types', 'version']),
    ...mapGetters(['collectionRate', 'visualRate'])
  },
  methods: {}
}
</script>
