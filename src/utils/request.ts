import Cookies from 'js-cookie'
import axios, { AxiosError } from 'axios'
import { MessagePlugin } from 'tdesign-vue-next'
import router from '../router'

const request = axios.create({
  timeout: 10000,
  timeoutErrorMessage: '请求超时，请稍后再试',
})

request.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json'
    const token = Cookies.get('boardToken')
    if (token) {
      config.headers['boardSession'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      if (response.data['code'] === 0) {
        return Promise.reject(response.data.msg)
      }
    } else if (response.status === 401) {
      Cookies.remove('boardToken')
      router.push('/admin/login')
      return Promise.reject('登录身份过期，请重新登录！')
    } else if (response.status === 404) {
      return Promise.reject('接口方法不存在！')
    } else {
      return Promise.reject('发生未知错误！')
    }
    return response
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      Cookies.remove('boardToken')
      router.push('/admin/login')
      return Promise.reject('登录身份过期，请重新登录！')
    } else if (error.response?.status === 404) {
      return Promise.reject('接口方法不存在！')
    } else {
      return Promise.reject('发生未知错误！')
    }
  },
)

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  try {
    const resp = await request.get(url, { params }).then((response) => response.data)
    return resp.data
  } catch (error) {
    MessagePlugin.error(error as string)
    return null as T
  }
}

export async function post<T>(url: string, data?: Record<string, unknown>): Promise<T> {
  try {
    const resp = await request.post(url, data).then((response) => response.data)
    return resp.data
  } catch (error) {
    MessagePlugin.error(error as string)
    return null as T
  }
}
