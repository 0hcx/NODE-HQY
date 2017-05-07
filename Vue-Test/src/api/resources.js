import config from '../config'

var API_ROOT = config.API_ROOT

export default {
  login: `${API_ROOT}login`,
  register: `${API_ROOT}register`,
  getCaptcha: `${API_ROOT}getCaptcha`,
  searchJobs: `${API_ROOT}searchJobs`,
  addStarJob: `${API_ROOT}addStarJob`,
  cancleStar: `${API_ROOT}cancleStar`,
  getStarJob: `${API_ROOT}getStarJob`
}
