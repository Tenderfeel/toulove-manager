// エリア

export const state = () => {
  return {
    // マスター取得状況
    initialized: false,

    /**
     * 敵データ
     */
    enemies: {},

    /**
     * マスデータ
     */
    squares: []
  }
}

export const getters = {}

export const actions = {
  /**
   * Get master data from API
   */
  async getData({ commit, dispatch }) {
    const response = await this.$axios.get(
      `${process.env.MASTER_API_URL}?target=enemy`
    )

    commit('setEnemies', response.data)
  },

  async getSquareData(ctx, area) {
    try {
      const response = await this.$axios.get(process.env.MASTER_API_URL, {
        params: {
          target: 'square',
          area
        }
      })
      // console.table(response.data)
      return response.data
    } catch (e) {
      console.error(e)
      return []
    }
  }
}

export const mutations = {
  setEnemies(state, data) {
    state.enemies = data
  }
}
