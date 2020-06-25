export default ({ app, store }, inject) => {
  store.dispatch('getData')
  store.dispatch('area/getData')
}
