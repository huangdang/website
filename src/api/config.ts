import { ElMessage, ElLoading } from 'element-plus';
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
  cancelToken?: any;
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
  ElMessage.error(errorMessage);
}

const showLoading = ElLoading.service({
  lock: true,
  text: 'Loading...',
  spinner: 'el-icon-loading',
  background: 'rgba(0, 0, 0, 0.7)'
});

/* 并发控制器实现 */
class ConcurrencyController {
  maxConcurrent: number;
  currentCount: number;
  queue: any[];
  loadingCount: number;
  constructor(maxConcurrent = 5) {
    this.maxConcurrent = maxConcurrent;
    this.currentCount = 0;
    this.queue = [];
    this.loadingCount = 0;
  }
  
  // 执行请求
  async execute(requestFn: () => Promise<any>): Promise<any> {
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
        showLoading.close();
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
          showLoading.close();
        }
        // 继续处理队列
        this.processQueue();
      }
    }
    // 更新并发阈值
    updateMaxConcurrent(newMax: number) {
      this.maxConcurrent = newMax;
      this.processQueue();
    }
  }