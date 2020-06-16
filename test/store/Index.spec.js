import { getters } from '@/store/index.js'

describe('store/index/getters', () => {
  // ステートをモックする
  const state = {
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
        id: '7-4',
        map: 1,
        epoch: '延享の記憶',
        area: '江戸城内（長距離）',
        exp: 400,
        boss: 2000,
        lv: 99,
        battle: '夜・屋内',
        item: '',
        memoir: '42,43'
      }
    ]
  }

  it('areaLabels areasからラベルデータを生成する', () => {
    // ゲッターから結果を受け取る
    const result = getters.areaLabels(state)
    expect(result).toEqual({
      '1-1': { area: '函館', epoch: '維新の記憶' },
      '7-4': { area: '江戸城内', epoch: '延享の記憶' }
    })
  })

  it('epochOptions 時代セレクトメニュー用配列を生成する', () => {
    const result = getters.epochOptions(state)
    expect(result).toEqual([
      {
        label: '維新の記憶',
        value: 1
      }
    ])
  })
})
