import axios from "axios";
import { ElMessage } from 'element-plus';

/* TypeScript 类型定义 */
interface AxiosConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  responseType?: string;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  validateStatus?: (status: number) => boolean;
}
interface RequestConfig extends AxiosConfig {
  url: string;
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
  data?: any;
  params?: any;
  skipErrorHandler?: boolean;
  skipLoading?: boolean;
  cancelToken?: any//CancelToken;
}
interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
  timestamp: number;
}
interface ErrorResponse {
  code: number;
  message: string;
  data?: any;
  config?: RequestConfig;
  response?: any;
}

/* 生成请求ID */
function generateRequestId() {
  return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/* 处理业务错误 */
function handleBusinessError(code: string, message: string) {
  const errorMap: any = {
    1001: '参数错误',
    1002: '用户不存在',
    1003: '密码错误',
    1004: '权限不足',
    1005: '资源不存在',
    1006: '操作失败',
    1007: '系统繁忙'
  };
  const errorMessage = errorMap[code] || message || '未知错误';
  ElMessage.error(errorMessage)
}

/* 并发控制器实现 */
class ConcurrencyController {
  constructor(maxConcurrent = 5) {
    this.maxConcurrent = maxConcurrent;
    this.currentCount = 0;
    this.queue = [];
    this.loadingCount = 0;
  }
  
  // 执行请求
  async execute(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ requestFn, resolve, reject });
      this.processQueue(); });
    }
    // 处理队列
    async processQueue() {
      if (this.currentCount >= this.maxConcurrent || this.queue.length === 0) {
        return;
      }
      this.currentCount++;
      // 增加loading计数
      this.loadingCount++;
      if (this.loadingCount === 1) {
        showLoading();
      }
      const { requestFn, resolve, reject } = this.queue.shift();
      try {
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      } finally { this.currentCount--;
        // 减少loading计数
        this.loadingCount--;
        if (this.loadingCount === 0) {
          hideLoading();
        }
        // 继续处理队列
        this.processQueue();
      }
    }
    // 更新并发阈值
    updateMaxConcurrent(newMax) {
      this.maxConcurrent = newMax;
      this.processQueue();
    }
  }

/* 创建axios实例 */
const axiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});
// 请求拦截器
axiosInstance.interceptors.request.use(config => {
  // 添加token
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // 添加请求ID
  config.headers['X-Request-ID'] = generateRequestId();
  // 记录请求开始时间
  config.metadata = { startTime: new Date() };
  return config;
}, error => {
  return Promise.reject(error);
});
// 响应拦截器
axiosInstance.interceptors.response.use(
  response => {
    // 计算请求耗时
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;
    // 处理业务错误码
    if (response.data && typeof response.data === 'object' && 'code' in response.data) {
      const { code, message } = response.data;
      // 根据错误码处理不同的业务错误
      if (code !== undefined && code !== 200 && code !== 0) {
        handleBusinessError(code, message);
        return Promise.reject(response.data);
      }
    }
    return response;
  },
  error => {
    const { response } = error;
    if (response) {
      // 处理HTTP错误状态码
      switch (response.status) {
        case 401:
          // 未授权，跳转到登录页
          redirectToLogin();
          break;
        case 403:
          // 权限不足
          showErrorMessage('权限不足');
          break;
        case 404:
          // 资源不存在
          showErrorMessage('请求的资源不存在');
          break;
        case 500:
          // 服务器错误
          showErrorMessage('服务器内部错误');
          break;
        default:
          // 其他错误
          showErrorMessage(`请求失败: ${response.status}`);
      }
    } else if (error.message === 'canceled') {
      // 请求被取消
      console.log('请求被取消');
    } else {
      // 网络错误
      showErrorMessage('网络错误，请检查网络连接');
    }
    return Promise.reject(error);
  });


/* 请求方法封装 */
// 基础请求方法
async function request(config:any) {
  // 使用并发控制器执行请求
  return concurrencyController.execute(() => {
    return axiosInstance(config);
  });
}
// GET请求
async function get(url:string, params = {}, config = {}) {
  return request({
    url,
    method: 'get',
    params,
    ...config
  });
}
// POST请求
async function post(url:string, data = {}, config = {}) {
  return request({
    url,
    method: 'post',
    data,
    ...config
  });
}
// 文件上传
async function upload(url:string, formData:any, config:any = {}) {
  return request({
    url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...config.headers
    },
    ...config
  });
}
// 下载文件
async function download(url:string, params = {}, filename = '', config = {}) {
  return request({
    url,
    method: 'get',
    params,
    responseType: 'blob',
    ...config
  }).then(response => {
    // 创建下载链接
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download_file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
    return response;
  });}

/* 取消请求 */
function createCancelToken() {
  return axios.CancelToken.source();
}

/* 取消所有请求 */
// function cancelAllRequests(message = '请求已取消') {
//   // 清空队列中的请求
//   concurrencyController.queue.forEach(({ reject }) => {
//     reject(new Error(message));
//   });
//   concurrencyController.queue = [];
// }

/* 使用案例 */
// GET请求
// const result = await get('/api/users', { page: 1, size: 10 });
// // POST请求
// const newUser = await post('/api/users', {
//   name: '张三',
//   age: 25,
//   email: 'zhangsan@example.com'
// });
// // 设置请求头
// const result = await get('/api/data', {}, {
//   headers: {
//     'X-Custom-Header': 'custom-value'
//   }
// });
// // 获取完整响应
// const result = await get('/api/data', {}, {
//   getFullResponse: true
// });
// const { data, status, headers } = result;
// 更新并发阈值
// concurrencyController.updateMaxConcurrent(3);
// 批量请求
const requests = [
  () => get('/api/users'),
  () => get('/api/products'),
  () => get('/api/orders')
];
// const results = await Promise.all( requests.map(req => concurrencyController.execute(req)));
// 创建可取消的请求
const cancelToken = createCancelToken();
// const request = get('/api/data', {}, {
//   cancelToken: cancelToken.token
// });
// 取消请求
cancelToken.cancel('用户取消请求');
// 取消所有请求
// cancelAllRequests('页面跳转，取消所有请求');