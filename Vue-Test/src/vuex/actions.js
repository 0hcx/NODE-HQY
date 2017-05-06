import api from '../api/index'
import store from '../vuex/store'

export const searchJobs = (type, data) => {
  let apiItem, action
  let result = {
    data: [],
    pageCount: 1
  }
  if (type === 'ALL') {
    apiItem = api.searchJobs
    action = 'updateSearchJobs'
  } else if (type === 'STAR') {
    apiItem = api.getStarJob
    action = 'updateStarJobs'
  }
  apiItem(data)
  .then(res => {
    if (res.data.pageCount > 0) {
      result = {
        data: res.data.results,
        pageCount: res.data.pageCount
      }
      store.dispatch(action, result)
    } else {
      store.dispatch(action, result)
    }
  })
  .catch(err => {
    console.log(err)
  })
}

