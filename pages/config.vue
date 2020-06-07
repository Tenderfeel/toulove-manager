<template>
  <a-layout-content>
    <a-page-header title="設定" />
    <div class="content">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1">
          <span slot="tab">
            <a-icon type="folder" />
            データ
          </span>
          <a-card class="m2 m0t">
            <template slot="title">
              <a-icon type="import" />
              インポート
            </template>
            <p>エクスポートしたJSONファイルを利用できます</p>
            <a-upload
              accept="application/json"
              :file-list="fileList"
              :remove="handleRemove"
              :before-upload="beforeUpload"
            >
              <a-button> <a-icon type="upload" /> ファイルを選択</a-button>
            </a-upload>
            <a-button
              type="primary"
              :disabled="fileList.length === 0"
              :loading="$wait.is('import')"
              class="m2t"
              @click="handleUpload"
            >
              {{ $wait.is('import') ? 'お待ちください…' : 'インポート' }}
            </a-button>
          </a-card>
          <a-card class="m2 m0t">
            <template slot="title">
              <a-icon type="export" />
              エクスポート
            </template>
            <p>所属状況、イラスト入手状況を出力します</p>
            <a-button
              type="primary"
              :disabled="!initialized || characters.length === 0"
              :loading="$wait.is('export')"
              @click="handleExport"
            >
              {{ $wait.is('export') ? 'お待ちください…' : 'エクスポート' }}
            </a-button>
          </a-card>
        </a-tab-pane>
        <!-- 操作タブ -->
        <a-tab-pane key="2">
          <span slot="tab">
            <a-icon type="tool" />
            操作
          </span>

          <a-card class="m2 m0t">
            <template slot="title">
              <a-icon type="delete" />
              初期化
            </template>
            <p>
              <a-icon type="exclamation-circle" />
              ストレージを全てクリアし、データを初期状態に戻します
            </p>
            <a-button
              type="danger"
              :disabled="!initialized || characters.length === 0"
              :loading="$wait.is('reset')"
              @click="handleReset"
            >
              {{ $wait.is('reset') ? 'お待ちください…' : '初期化する' }}
            </a-button>
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-layout-content>
</template>

<script>
import { mapState } from 'vuex'
function isArray(obj) {
  return (
    obj &&
    typeof obj === 'object' &&
    Object.prototype.hasOwnProperty.call(obj, 'length')
  )
}

export default {
  data() {
    return {
      fileList: []
    }
  },
  computed: {
    ...mapState(['characters', 'initialized'])
  },
  methods: {
    beforeUpload(file) {
      const jsJSON = file.type === 'application/json'
      if (!jsJSON) {
        this.$message.error('JSON以外のファイル形式は読み込めません')
        return false
      }

      this.fileList = [file]
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    handleUpload() {
      this.$wait.start('import')
      const reader = new FileReader()
      reader.readAsText(this.fileList[0])

      reader.onload = async (e) => {
        try {
          const saveData = JSON.parse(e.target.result)
          if (!saveData.length) {
            this.$message.error('インポートできるデータがありませんでした')
          }
          // 内容確認
          const validate = saveData.every((dat) => {
            const keys = Object.keys(dat)

            if (keys.length !== 3) return false
            if (!keys.includes('id') || typeof dat.id !== 'number') return false
            if (!keys.includes('ownership') || !isArray(dat.ownership))
              return false
            if (!keys.includes('visual') || !isArray(dat.visual)) return false

            return true
          })
          if (!validate) {
            return this.$message.error(
              'データに問題があるため、インポートができませんでした'
            )
          }

          await this.$store.dispatch('importData', saveData)
          await this.$store.dispatch('save')
          this.fileList = []
          this.$message.success('インポートが完了しました')
        } catch (e) {
          console.error(e)
          this.$message.error(
            'データに問題があるため、インポートができませんでした'
          )
        }
        this.$wait.end('import')
      }
    },

    handleExport() {
      this.$wait.start('export')
      const blob = new Blob([JSON.stringify(this.$store.getters.saveData)], {
        type: 'application/json;charset=utf-8;'
      })
      const link = document.createElement('a')
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', 'toulove-manager.json')
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      this.$wait.end('export')
    },

    handleReset() {
      this.$confirm({
        title: '本当に初期化しますか？',
        content: [
          'マスターデータからストアを再構築します。',
          this.$createElement('br'),
          'ブラウザに保存されているデータは消去されます。'
        ],
        okText: 'OK',
        okType: 'danger',
        cancelText: 'キャンセル',
        onOk: async () => {
          this.$wait.start('reset')
          await this.$store.dispatch('reset')
          this.$message.success('初期化が完了しました')
          this.$wait.end('reset')
        }
      })
    }
  },
  head() {
    return {
      title: `設定 - ${process.env.SITE_NAME}`
    }
  }
}
</script>
