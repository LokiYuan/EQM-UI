import axios from 'axios'
import store from 'store'
import { history } from 'index'
import { notification } from 'antd'
// import * as tunnel from 'tunnel';

// const agent = tunnel.httpsOverHttp({
//   proxy: {
//     host: 'http://localhost',
//     port: 5000,
//   },
// });

const apiClient = axios.create({
  // withCredentials: false, // default
  // proxy: {
  //   host: 'localhost',
  //   port: 5000,
  // },
  // baseURL: 'http://localhost:5000',
  // xsrfCookieName: 'XSRF-TOKEN',
  // xsrfHeaderName: 'X-XSRF-TOKEN',
  // timeout: 1000,
  // headers: [{ 'Access-Control-Allow-Origin': '*' },
  //  { 'Content-Type': 'application/x-www-form-urlencoded' }],
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  // httpsAgent: agent
})

apiClient.interceptors.request.use(request => {
  const accessToken = store.get('accessToken')
  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`
  }
  return request
})

apiClient.interceptors.response.use(undefined, error => {
  // Errors handling
  const { response } = error
  const { data, status } = response
  if (status === 401) {
    store.remove('accessToken')
    history.push('/auth/login')
    notification.warning({
      message: 'Auto Logged Out',
      description: `Bye!Bye! You have been auto logged out because of staying too long`,
    })
  }
  if (data) {
    notification.warning({
      message: JSON.stringify(data),
    })
  }
})

export default apiClient
