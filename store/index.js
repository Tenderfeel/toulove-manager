import { uniq, without } from 'lodash'

const MASTER_API_URL =
  'https://script.google.com/macros/s/AKfycbyx4n2syQvfdeUwBQ672YD8fVw4kLXnswWhIO7BTDAjPA9GT18/exec'

export const state = () => {
  return {
    // 現在のエリア数
    areaCount: 8,

    // アプリバージョン
    version: process.env.VERSION,

    // マスター取得状況
    initialized: false,

    // 刀剣種類
    types: ['短刀', '脇差', '打刀', '太刀', '大太刀', '槍', '薙刀', '剣'],

    // イラスト種類
    visuals: ['通常', '戦闘', '負傷', '必殺', '内番', '軽装'],

    // 刀剣男士
    characters: [],

    // エリア
    areas: [],

    // ドロップ
    drops: [],

    // 回想
    memoirs: []
  }
}
export const getters = {
  /**
   * 種類フィルタ用
   * @return {Array.<Object>}
   */
  typeOptions: (state) => {
    return state.types.map((type) => ({ text: type, value: type }))
  },

  /**
   * イラスト入手状況チェックボックス用
   * @return {Array.<Object>}
   */
  visualOptions: (state) => {
    return state.visuals.map((visual) => ({ text: visual, value: visual }))
  },

  /**
   * エリア名
   * @return {Object} { '1-1': { area: '函館', epoch: '維新の記憶' } }
   */
  areaLabels: (state) => {
    return state.areas.reduce((acc, cur) => {
      if (cur.map !== 1) {
        return acc
      }
      let area = cur.area
      if (cur.id === '7-4') {
        area = area.replace('（長距離）', '')
      }
      if (cur.id === '6-4') {
        area = area.replace('（第１マップ）', '')
      }
      acc[cur.id] = {
        area,
        epoch: cur.epoch
      }
      return acc
    }, {})
  },

  /**
   * 時代セレクトメニュー用
   * @return {Array.<{text: string, value: number}>}
   */
  epochOptions: (state) => {
    return state.areas
      .filter((area) => /^\d-1$/.test(area.id) && area.map === 1)
      .map((area) => ({
        text: area.epoch,
        value: Number(area.id.replace(/(\d)-\d/, '$1'))
      }))
  },

  /**
   * 収集状況
   * カウントするもの
   * - 通常（口数）
   * - 極
   * - 髭切・膝丸の特1～3
   * @return {{ current: number, total: number, char:number, charTotal:number, detail:Object }}
   */
  collectionRate: (state) => {
    let total = 0
    let charTotal = 0
    let char = 0
    const detail = state.types.reduce((acc, cur) => {
      acc[cur] = {
        current: 0,
        total: 0
      }
      return acc
    }, {})

    const current = state.characters.reduce((acc, cur) => {
      // 極データはスキップ
      if (cur.extreme) return acc

      const type = cur['種類']
      detail[type].total++

      // 所属
      if (cur.ownership.includes('通常')) {
        acc = acc + 1
        detail[type].current++
        char++
      }

      // 極
      const ex = cur['極'] > 0 // １なら実装済み
      acc = acc + (ex && cur.ownership.includes('極'))

      // 特
      const special = String(cur['特']).split(',')
      let sp = special.length - 1

      if (special.length > 1) {
        special.forEach((sp, index) => {
          const label = index > 0 ? `特${index + 1}` : '特'
          acc = acc + cur.ownership.includes(label)
        })
      }

      // ランクアップ後を別種としてカウント
      if (['髭切', '膝丸'].includes(cur.name)) {
        sp = sp + 1
      }

      charTotal++
      total = total + 1 + ex + sp
      return acc
    }, 0)
    return { current, total, char, charTotal, detail }
  },

  /**
   * イラスト入手状況
   * @return {{current:number, total:number, detail: Object}}
   */
  visualRate(state) {
    let total = 0
    const detail = state.visuals.reduce((acc, cur) => {
      acc[cur] = {
        current: 0,
        total: 0
      }
      return acc
    }, {})

    // 軽装は未実装のがあるので除外しておく
    const visualBase = without(state.visuals, '軽装')

    const current = state.characters.reduce((acc, cur) => {
      // 極
      const ex = cur['極'] > 0
      // 総数カウントアップ
      total += visualBase.length + Number(ex) * visualBase.length

      // 詳細
      visualBase.forEach((v) => {
        detail[v].total += 1
        detail[v].total += Number(ex) // 極
      })
      // 軽装
      total += Number(cur['軽装'])
      detail['軽装'].total += Number(cur['軽装'])

      // 髭切と膝丸は特ごとにビジュアルが異なる
      if (['髭切', '膝丸'].includes(cur.name)) {
        // 特, 特2, 特3
        const special = String(cur['特']).split(',')
        // 総数カウントアップ
        special.forEach((sp, index) => {
          visualBase.forEach((v) => {
            detail[v].total += 1
          })
        })
      }

      // 所属数カウントアップ
      acc += cur.visual.length
      if (cur.visual.length) {
        cur.visual.forEach((v) => {
          detail[v].current += 1
        })
      }

      return acc
    }, 0)

    return { current, total, detail }
  },

  /**
   * 回想収集状況
   */
  memoirRate(state) {
    const current = state.memoirs.reduce((acc, cur) => {
      return acc + cur.complete
    }, 0)

    return {
      current,
      total: state.memoirs.length
    }
  },

  /**
   * 入手済み男子
   * 通常のチェックで入手済みとみなす
   * @return {Array}
   */
  memberCharacters: (state) => {
    return state.characters.filter((char) => char.ownership.includes('通常'))
  },

  /**
   * 極を除く
   * @return {Array}
   */
  normalCharacters: (state) => {
    return state.characters.filter((char) => char.extreme === false)
  },

  /**
   * JSONファイル保存用データ
   * @return {{characters: Array, memoir: Array}}
   */
  saveData: (state) => {
    const characters = state.characters.map((char) => {
      return {
        id: char.id,
        visual: char.visual,
        ownership: char.ownership
      }
    })
    const memoirs = state.memoirs.reduce((acc, cur) => {
      acc[cur.id] = cur.complete
      return acc
    }, {})
    return {
      characters,
      memoirs
    }
  },

  /**
   * IDでキャラを探す
   */
  findCharacterById: (state) => (id) => {
    return state.characters.find((char) => char.id === id)
  },

  /**
   * IDでドロップデータを探す
   */
  findDropById: (state) => (id) => {
    return state.drops.find((drop) => drop.id === id)
  },

  /**
   * IDでエリアデータを探す
   */
  findAreaById: (state) => (id) => {
    return state.areas.find((area) => `${area.id}-${area.map}` === id) || {}
  }
}
export const actions = {
  /**
   * Get master data from API
   */
  async getData({ commit, dispatch }) {
    console.log('🍡 Get master data form API...')
    try {
      const response = await this.$axios.get(process.env.MASTER_API_URL)

      const saveData = await dispatch('load')
      commit('setCharacters', { master: response.data.characters, saveData })
      commit('setAreas', { master: response.data.areas })
      commit('setDrops', { master: response.data.drops })
      commit('setMemoirs', { master: response.data.memoir, saveData })
      commit('setInitialized')
      return {
        statusText: 'success',
        message: 'Get Data Completed'
      }
    } catch (e) {
      console.error(e)
      return {
        statusText: 'error',
        message: 'Get Data Failed'
      }
    }
  },

  /**
   * セーブデータのインポート
   * @param {{characters: Array, memoirs:?Object}} saveData
   */
  async importData({ commit }, saveData) {
    try {
      const response = await this.$axios.get(MASTER_API_URL)

      commit('setCharacters', {
        master: response.data.characters,
        saveData
      })
      commit('setMemoirs', {
        master: response.data.memoir,
        saveData
      })
      commit('setInitialized')
      return {
        statusText: 'success',
        message: 'Import Data Completed'
      }
    } catch (e) {
      console.error(e)
      return {
        statusText: 'error',
        message: 'Import Data Failed'
      }
    }
  },

  /**
   * ローカルストレージから読み込む
   */
  load() {
    const characters = JSON.parse(localStorage.getItem('character') || '[]')
    const memoirs = JSON.parse(localStorage.getItem('memoir') || 'null')
    return {
      characters,
      memoirs
    }
  },

  /**
   * LocalStorageに保存する
   */
  save({ getters }) {
    localStorage.setItem(
      'character',
      JSON.stringify(getters.saveData.characters)
    )
    localStorage.setItem('memoir', JSON.stringify(getters.saveData.memoirs))
  },

  /**
   * 初期化する
   */
  async reset({ dispatch }) {
    console.log('🍡 Reset All Data ...')
    localStorage.removeItem('character')
    await dispatch('importData', { characters: [], memoirs: null })
  }
}

/**
 * キャラクター情報をストレージデータで上書きする
 * @param {{characters: Array, memoirs: ?Object}}
 */
function updateCharacterBySaveData(saveData, dat) {
  if (saveData.characters.length) {
    const log = saveData.characters.find((s) => s.id === dat.id)
    if (log) {
      // 念の為重複を削除する
      dat.visual = uniq(log.visual)
      dat.ownership = uniq(log.ownership)
    }
  }
  return dat
}

export const mutations = {
  setInitialized(state) {
    state.initialized = true
  },

  /**
   * v-model 使うと厳格モードで怒られるため
   * @see https://vuex.vuejs.org/ja/guide/forms.html
   */
  updateVisual(state, { character, visual }) {
    character.visual = visual
  },

  updateOwnership(state, { character, ownership }) {
    character.ownership = ownership
  },

  updateMemoir(state, { memoir, complete }) {
    memoir.complete = complete
  },

  setAreas(state, { master }) {
    state.areas = master
  },

  setDrops(state, { master }) {
    state.drops = master
  },

  setMemoirs(state, { master, saveData }) {
    state.memoirs = master.map((m) => {
      if (saveData.memoirs) {
        m.complete = saveData.memoirs[m.id]
      } else {
        m.complete = false
      }
      return m
    })
  },

  // 刀剣男士
  setCharacters(state, { master, saveData }) {
    state.characters = []

    master.forEach((dat) => {
      dat.visual = []
      dat.ownership = []
      dat.extreme = false

      dat = updateCharacterBySaveData(saveData, dat)

      // イラスト初期値
      if (!dat.visual.length && dat.ownership.includes('通常')) {
        dat.visual.push('通常')
      }

      state.characters.push(dat)

      // 極を所属
      if (dat.ownership.includes('極')) {
        let ex = { ...dat }
        ex.id = ex.id + 1
        ex.name = `${ex.name} 【極】`
        ex.visual = ['通常']
        ex.extreme = true
        dat.disabled = true // 通常をdisabled
        ex = updateCharacterBySaveData(saveData, ex)
        state.characters.push(ex)
      }

      // 髭切と膝丸は特ごとにビジュアルが異なる
      if (['髭切', '膝丸'].includes(dat.name)) {
        // 特, 特2, 特3
        const special = String(dat['特']).split(',')

        if (special.length > 1) {
          special.forEach((sp, index) => {
            const label = index > 0 ? `特${index + 1}` : '特'
            if (dat.ownership.includes(label)) {
              let ex = { ...dat }
              ex.id = ex.id + 1
              ex.name = `${ex.name} 【${label}】`
              ex.visual = ['通常']
              ex.extreme = true
              ex = updateCharacterBySaveData(saveData, ex)
              state.characters.push(ex)
            }
          })
          dat.disabled = true
        }
      }
    })
  }
}
