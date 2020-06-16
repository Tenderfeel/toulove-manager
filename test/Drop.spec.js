import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import DropIndex from '@/pages/drop/index.vue'
import { getters } from '@/store/index.js'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('/pages/drop/index.vue', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        drops: [
          {
            id: 3,
            name: '三日月宗近',
            '1-1': '',
            '1-2': '',
            '1-3': '',
            '1-4': '',
            '2-1': '',
            '2-2': '',
            '2-3': '',
            '2-4': '',
            '3-1': '',
            '3-2': '',
            '3-3': '',
            '3-4': '',
            '4-1': '',
            '4-2': '',
            '4-3': '',
            '4-4': 'ボス',
            '5-1': '',
            '5-2': '',
            '5-3': '',
            '5-4': 'ボス',
            '6-1': '',
            '6-2': '',
            '6-3': '',
            '6-4': '',
            '7-1': '',
            '7-2': '',
            '7-3': '',
            '7-4': '',
            '8-1': '',
            '8-2': ''
          },
          {
            id: 85,
            name: '加州清光',
            '1-1': '',
            '1-2': '',
            '1-3': '',
            '1-4': 'ボス',
            '2-1': '',
            '2-2': '',
            '2-3': '',
            '2-4': '',
            '3-1': '',
            '3-2': 'ボス',
            '3-3': 'ボス',
            '3-4': 'ボス',
            '4-1': 'ボス',
            '4-2': 'ボス',
            '4-3': 'ボス',
            '4-4': 'ボス',
            '5-1': 'ボス',
            '5-2': 'ボス',
            '5-3': 'ボス',
            '5-4': 'ボス',
            '6-1': '通常,ボス',
            '6-2': '通常,ボス',
            '6-3': '通常,ボス',
            '6-4': '通常,ボス',
            '7-1': '通常,ボス',
            '7-2': '通常,ボス',
            '7-3': '通常,ボス',
            '7-4': '通常,ボス',
            '8-1': '通常,ボス',
            '8-2': '通常,ボス'
          }
        ],
        areas: [
          {
            id: '1-1',
            map: 1,
            epoch: '維新の記憶',
            area: '函館',
            exp: 30,
            boss: 90,
            lv: 11,
            battle: '昼・野戦',
            item: '',
            memoir: '1'
          },
          {
            id: '1-2',
            map: 1,
            epoch: '維新の記憶',
            area: '会津',
            exp: 50,
            boss: 150,
            lv: 12,
            battle: '昼・野戦',
            item: 'C:木炭×10',
            memoir: '28'
          }
        ]
      },
      getters
    })
  })

  test('computed.epochsData selectEpochで選ばれた時代に限定する', () => {
    const wrapper = shallowMount(DropIndex, { store, localVue })
    // wrapper.setData({ selectField: 1 })

    expect(wrapper.vm.epochsData.length).toBe(1)
    expect(wrapper.vm.epochsData[0]).toEqual({
      id: 85,
      name: '加州清光',
      '1-1': '',
      '1-2': '',
      '1-3': '',
      '1-4': 'ボス'
    })
  })
})
