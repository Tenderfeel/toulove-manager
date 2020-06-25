<template>
  <a-layout-content>
    <a-page-header
      v-if="initialized"
      :title="areaName"
      :sub-title="`${epochId}-${areaId} ${epochName}`"
      @back="() => $router.go(-1)"
    >
      <template slot="extra"> </template>
    </a-page-header>
    <a-spin tip="Loading..." :spinning="!initialized">
      <a-skeleton :loading="!initialized" />
      <div v-if="initialized" class="content main-table">
        <a-row justify="center">
          <a-col>
            <figure>
              <img :src="`/images/area/${id}.jpg`" alt="" />
            </figure>
          </a-col>
        </a-row>
        <div class="area-detail m2">
          <!-- エリア情報 -->
          <a-descriptions v-if="area" title="エリア情報" bordered :column="1">
            <a-descriptions-item label="経験値修得上限Lv（平均）">
              {{ area.lv }}
            </a-descriptions-item>
            <a-descriptions-item label="基礎経験値">
              <span>道中戦：{{ area.exp }}</span
              ><span class="m3l">ボス戦：{{ area.boss }}</span>
            </a-descriptions-item>
            <a-descriptions-item label="時間・場所">
              {{ area.battle }}
            </a-descriptions-item>
          </a-descriptions>

          <!-- 回想 -->
          <a-table
            :columns="memoirColumns"
            :data-source="memoirs"
            :row-key="(record) => record.id"
          >
            <template slot="title">
              <div class="ant-descriptions-title m0">回想</div>
            </template>

            <template slot="members" slot-scope="members">
              <div v-for="(member, index) in members" :key="index">
                {{ member }}
              </div>
            </template>
          </a-table>

          <!-- 敵リスト -->
          <a-table
            :columns="columns"
            :data-source="square"
            :row-key="(record) => `${record.area}-${record.square}`"
          >
            <template slot="title">
              <div class="ant-descriptions-title m0">敵情報</div>
            </template>
            <template slot="square" slot-scope="text">{{
              String.fromCharCode(65 + text - 2)
            }}</template>
            <template slot="enemy" slot-scope="text">
              <div v-for="(enemyId, index) in text" :key="index">
                {{ findEnemyById(enemyId).name }}
              </div>
            </template>
            <a-table
              slot="expandedRowRender"
              slot-scope="record"
              :columns="innerColumns"
              :data-source="record.enemyData"
              :pagination="false"
            >
              <template slot="enemyImage" slot-scope="text">
                <img :src="`/images/enemy/${text}.png`" :alt="record.name" />
              </template>
            </a-table>
          </a-table>
        </div>
      </div>
    </a-spin>
  </a-layout-content>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'AreaDetail',
  async asyncData({ params: { id }, store, error, $axios }) {
    if (!id || !/^\d-\d(-\d)*$/.test(id)) {
      return error({ message: '404 Not Found' })
    }

    // eslint-disable-next-line
    let [epochId, areaId, mapId] = id.split('-')
    if (!mapId) {
      mapId = 1
    }

    id = `${epochId}-${areaId}-${mapId}`

    const square = await store.dispatch('area/getSquareData', id)

    square.forEach((item) => {
      item.enemyData = item.enemy.map((enemyId) => {
        return {
          id: enemyId,
          ...store.state.area.enemies[enemyId]
        }
      })
    })
    return {
      epochId,
      areaId,
      mapId,
      id,
      square
    }
  },
  data() {
    return {
      id: null,
      epochId: null,
      areaId: null,
      mapId: null,
      square: [],
      columns: [
        {
          title: '出現場所',
          dataIndex: 'square',
          scopedSlots: { customRender: 'square' }
        },
        {
          title: '部隊名',
          dataIndex: 'name'
        },
        {
          title: '編成',
          dataIndex: 'enemy',
          scopedSlots: { customRender: 'enemy' }
        }
      ],

      innerColumns: [
        {
          title: '画像',
          dataIndex: 'id',
          width: 351,
          scopedSlots: { customRender: 'enemyImage' }
        },
        {
          title: 'HP',
          dataIndex: 'hp'
        },
        {
          title: '刀装',
          dataIndex: 'equip'
        }
      ],

      memoirColumns: [
        {
          title: '#',
          dataIndex: 'id'
        },
        {
          title: 'タイトル',
          dataIndex: 'title'
        },
        {
          title: '必要編成',
          dataIndex: 'members',
          scopedSlots: { customRender: 'members' }
        }
      ]
    }
  },
  computed: {
    ...mapState(['initialized']),
    ...mapState('area', ['enemies']),
    ...mapGetters(['epochOptions', 'areaLabels']),
    areaName() {
      if (!this.epochId || !this.areaId) return 'エラー'
      return this.areaLabels[`${this.epochId}-${this.areaId}`].area
    },
    epochName() {
      if (!this.epochId || !this.areaId) return 'エラー'
      return this.areaLabels[`${this.epochId}-${this.areaId}`].epoch
    },
    area() {
      if (!this.initialized) return null
      return this.$store.getters.findAreaById(this.id)
    },
    memoirs() {
      if (!this.initialized) return []
      if (!this.epochId || !this.areaId) return []
      return this.$store.state.memoirs
        .filter(
          (memoir) =>
            memoir.epoch === Number(this.epochId) &&
            memoir.area === Number(this.areaId)
        )
        .map((memoir) => {
          memoir.members = memoir.member.split(',')
          return memoir
        })
    }
  },
  methods: {
    findEnemyById(id) {
      return this.enemies[id]
    }
  }
}
</script>
