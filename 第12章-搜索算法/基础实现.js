/**
 * 第12章：搜索算法 - 基础实现
 *
 * 本文件包含：
 * 1. 基础搜索算法的完整实现
 * 2. 高级搜索算法和优化技术
 * 3. 字符串匹配算法
 * 4. 多维搜索和几何搜索
 * 5. 性能分析和测试用例
 *
 * 作者：数据结构与算法教程
 * 日期：2024年
 */

// ============================= 1. 基础搜索算法 =============================

/**
 * 线性搜索（顺序搜索）
 *
 * 核心思想：
 * 从数组的第一个元素开始，逐个比较每个元素，直到找到目标元素或遍历完整个数组
 * 这是最直观和最简单的搜索算法，不需要数据预排序
 *
 * @param {Array} arr - 待搜索的数组
 * @param {*} target - 目标元素
 * @param {Function} [compareFn] - 比较函数
 * @returns {number} 找到的元素索引，未找到返回-1
 * @time O(n) - 线性时间复杂度
 * @space O(1) - 常数空间复杂度
 */
function linearSearch(arr, target, compareFn = (a, b) => a === b) {
    // 输入验证
    if (!Array.isArray(arr)) {
        throw new Error('First argument must be an array');
    }

    // 遍历数组查找目标元素
    for (let i = 0; i < arr.length; i++) {
        if (compareFn(arr[i], target)) {
            return i;
        }
    }

    return -1; // 未找到
}

/**
 * 线性搜索 - 查找所有匹配项
 *
 * @param {Array} arr - 待搜索的数组
 * @param {*} target - 目标元素
 * @param {Function} [compareFn] - 比较函数
 * @returns {Array<number>} 所有匹配元素的索引数组
 * @time O(n)
 * @space O(k) k为匹配项数量
 */
function linearSearchAll(arr, target, compareFn = (a, b) => a === b) {
    const indices = [];

    for (let i = 0; i < arr.length; i++) {
        if (compareFn(arr[i], target)) {
            indices.push(i);
        }
    }

    return indices;
}

/**
 * 二分搜索（折半搜索）
 *
 * 核心思想：
 * 在有序数组中，通过比较中间元素与目标值，每次将搜索范围缩小一半
 * 利用数组的有序性质，时间复杂度为O(log n)
 *
 * @param {Array} arr - 有序数组
 * @param {*} target - 目标元素
 * @param {Function} [compareFn] - 比较函数，返回负数、0、正数
 * @returns {number} 找到的元素索引，未找到返回-1
 * @time O(log n) - 对数时间复杂度
 * @space O(1) - 常数空间复杂度
 */
function binarySearch(arr, target, compareFn = (a, b) => a - b) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        // 使用位运算优化中点计算，避免溢出
        const mid = left + Math.floor((right - left) / 2);
        const comparison = compareFn(arr[mid], target);

        if (comparison === 0) {
            return mid; // 找到目标元素
        } else if (comparison < 0) {
            left = mid + 1; // 目标在右半部分
        } else {
            right = mid - 1; // 目标在左半部分
        }
    }

    return -1; // 未找到
}

/**
 * 二分搜索递归版本
 *
 * @param {Array} arr - 有序数组
 * @param {*} target - 目标元素
 * @param {number} [left=0] - 左边界
 * @param {number} [right] - 右边界
 * @param {Function} [compareFn] - 比较函数
 * @returns {number} 找到的元素索引，未找到返回-1
 * @time O(log n)
 * @space O(log n) - 递归栈空间
 */
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1, compareFn = (a, b) => a - b) {
    if (left > right) {
        return -1;
    }

    const mid = left + Math.floor((right - left) / 2);
    const comparison = compareFn(arr[mid], target);

    if (comparison === 0) {
        return mid;
    } else if (comparison < 0) {
        return binarySearchRecursive(arr, target, mid + 1, right, compareFn);
    } else {
        return binarySearchRecursive(arr, target, left, mid - 1, compareFn);
    }
}

/**
 * 二分搜索变种：查找第一个大于等于目标的元素
 *
 * @param {Array} arr - 有序数组
 * @param {*} target - 目标元素
 * @param {Function} [compareFn] - 比较函数
 * @returns {number} 第一个大于等于目标的元素索引，未找到返回数组长度
 * @time O(log n)
 * @space O(1)
 */
function binarySearchLowerBound(arr, target, compareFn = (a, b) => a - b) {
    let left = 0;
    let right = arr.length;

    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);

        if (compareFn(arr[mid], target) < 0) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    return left;
}

/**
 * 二分搜索变种：查找第一个大于目标的元素
 *
 * @param {Array} arr - 有序数组
 * @param {*} target - 目标元素
 * @param {Function} [compareFn] - 比较函数
 * @returns {number} 第一个大于目标的元素索引，未找到返回数组长度
 * @time O(log n)
 * @space O(1)
 */
function binarySearchUpperBound(arr, target, compareFn = (a, b) => a - b) {
    let left = 0;
    let right = arr.length;

    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);

        if (compareFn(arr[mid], target) <= 0) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    return left;
}

/**
 * 插值搜索
 *
 * 核心思想：
 * 基于目标值在数组中的估计位置进行搜索，适用于数值均匀分布的有序数组
 * 通过插值公式估算目标位置，理想情况下时间复杂度为O(log log n)
 *
 * @param {Array} arr - 有序数组（数值类型）
 * @param {number} target - 目标数值
 * @returns {number} 找到的元素索引，未找到返回-1
 * @time O(log log n) 平均情况，O(n) 最坏情况
 * @space O(1)
 */
function interpolationSearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right && target >= arr[left] && target <= arr[right]) {
        // 如果只有一个元素
        if (left === right) {
            return arr[left] === target ? left : -1;
        }

        // 插值公式：根据目标值在范围内的相对位置估算索引
        const pos = left + Math.floor(
            ((target - arr[left]) / (arr[right] - arr[left])) * (right - left)
        );

        if (arr[pos] === target) {
            return pos;
        } else if (arr[pos] < target) {
            left = pos + 1;
        } else {
            right = pos - 1;
        }
    }

    return -1;
}

/**
 * 指数搜索（倍增搜索）
 *
 * 核心思想：
 * 先找到包含目标元素的范围，然后在该范围内进行二分搜索
 * 适用于不知道数组大小或数组很大的情况
 *
 * @param {Array} arr - 有序数组
 * @param {*} target - 目标元素
 * @param {Function} [compareFn] - 比较函数
 * @returns {number} 找到的元素索引，未找到返回-1
 * @time O(log n)
 * @space O(1)
 */
function exponentialSearch(arr, target, compareFn = (a, b) => a - b) {
    if (arr.length === 0) {
        return -1;
    }

    // 如果第一个元素就是目标
    if (compareFn(arr[0], target) === 0) {
        return 0;
    }

    // 找到包含目标的范围
    let bound = 1;
    while (bound < arr.length && compareFn(arr[bound], target) < 0) {
        bound *= 2;
    }

    // 在找到的范围内进行二分搜索
    const left = Math.floor(bound / 2);
    const right = Math.min(bound, arr.length - 1);

    return binarySearchRange(arr, target, left, right, compareFn);
}

/**
 * 指定范围内的二分搜索
 *
 * @param {Array} arr - 有序数组
 * @param {*} target - 目标元素
 * @param {number} left - 左边界
 * @param {number} right - 右边界
 * @param {Function} [compareFn] - 比较函数
 * @returns {number} 找到的元素索引，未找到返回-1
 */
function binarySearchRange(arr, target, left, right, compareFn = (a, b) => a - b) {
    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        const comparison = compareFn(arr[mid], target);

        if (comparison === 0) {
            return mid;
        } else if (comparison < 0) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}

// ============================= 2. 字符串搜索算法 =============================

/**
 * 朴素字符串匹配算法
 *
 * 核心思想：
 * 将模式串与文本串的每个位置进行比较，直到找到匹配或遍历完文本串
 * 简单直观但效率较低
 *
 * @param {string} text - 文本串
 * @param {string} pattern - 模式串
 * @returns {Array<number>} 所有匹配位置的索引数组
 * @time O(n*m) n为文本长度，m为模式长度
 * @space O(1)
 */
function naiveStringSearch(text, pattern) {
    const results = [];

    if (pattern.length === 0) {
        return [0];
    }

    for (let i = 0; i <= text.length - pattern.length; i++) {
        let j = 0;

        // 逐字符比较
        while (j < pattern.length && text[i + j] === pattern[j]) {
            j++;
        }

        if (j === pattern.length) {
            results.push(i);
        }
    }

    return results;
}

/**
 * KMP字符串匹配算法
 *
 * 核心思想：
 * 利用模式串的自身信息构建失效函数，避免不必要的回溯
 * 通过预处理模式串，在匹配失败时跳过一些无效的比较
 *
 * @param {string} text - 文本串
 * @param {string} pattern - 模式串
 * @returns {Array<number>} 所有匹配位置的索引数组
 * @time O(n+m) 线性时间复杂度
 * @space O(m) 存储失效函数
 */
function kmpSearch(text, pattern) {
    if (pattern.length === 0) {
        return [0];
    }

    // 构建失效函数（部分匹配表）
    const lps = buildKMPTable(pattern);
    const results = [];

    let i = 0; // text 指针
    let j = 0; // pattern 指针

    while (i < text.length) {
        if (text[i] === pattern[j]) {
            i++;
            j++;

            if (j === pattern.length) {
                results.push(i - j);
                j = lps[j - 1]; // 继续查找下一个匹配
            }
        } else if (j > 0) {
            j = lps[j - 1]; // 利用失效函数跳过
        } else {
            i++;
        }
    }

    return results;
}

/**
 * 构建KMP算法的失效函数（LPS数组）
 *
 * 核心思想：
 * 计算模式串中每个位置的最长相等前后缀长度
 * lps[i] 表示 pattern[0..i] 的最长相等前后缀长度
 *
 * @param {string} pattern - 模式串
 * @returns {Array<number>} 失效函数数组
 * @time O(m)
 * @space O(m)
 */
function buildKMPTable(pattern) {
    const lps = new Array(pattern.length).fill(0);
    let len = 0; // 当前最长相等前后缀的长度
    let i = 1;

    while (i < pattern.length) {
        if (pattern[i] === pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len > 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }

    return lps;
}

/**
 * Boyer-Moore字符串匹配算法（简化版）
 *
 * 核心思想：
 * 从右向左比较字符，利用坏字符规则跳过不可能匹配的位置
 * 当发现不匹配字符时，根据该字符在模式串中的位置决定跳跃距离
 *
 * @param {string} text - 文本串
 * @param {string} pattern - 模式串
 * @returns {Array<number>} 所有匹配位置的索引数组
 * @time O(n*m) 最坏情况，O(n/m) 最好情况
 * @space O(σ) σ为字符集大小
 */
function boyerMooreSearch(text, pattern) {
    if (pattern.length === 0) {
        return [0];
    }

    // 构建坏字符表
    const badChar = buildBadCharTable(pattern);
    const results = [];
    let i = 0;

    while (i <= text.length - pattern.length) {
        let j = pattern.length - 1;

        // 从右向左比较
        while (j >= 0 && text[i + j] === pattern[j]) {
            j--;
        }

        if (j < 0) {
            // 找到匹配
            results.push(i);
            i += 1; // 继续查找下一个匹配
        } else {
            // 利用坏字符规则计算跳跃距离
            const badCharShift = badChar.get(text[i + j]) || pattern.length;
            i += Math.max(1, j - badCharShift);
        }
    }

    return results;
}

/**
 * 构建Boyer-Moore算法的坏字符表
 *
 * @param {string} pattern - 模式串
 * @returns {Map<string, number>} 坏字符表
 */
function buildBadCharTable(pattern) {
    const badChar = new Map();

    for (let i = 0; i < pattern.length; i++) {
        badChar.set(pattern[i], i);
    }

    return badChar;
}

/**
 * Rabin-Karp字符串匹配算法
 *
 * 核心思想：
 * 使用滚动哈希技术比较字符串的哈希值
 * 只有哈希值相等时才进行字符逐一比较
 *
 * @param {string} text - 文本串
 * @param {string} pattern - 模式串
 * @param {number} [base=256] - 哈希基数
 * @param {number} [mod=1000000007] - 哈希模数
 * @returns {Array<number>} 所有匹配位置的索引数组
 * @time O(n+m) 平均情况，O(n*m) 最坏情况
 * @space O(1)
 */
function rabinKarpSearch(text, pattern, base = 256, mod = 1000000007) {
    if (pattern.length === 0) {
        return [0];
    }

    if (pattern.length > text.length) {
        return [];
    }

    const results = [];
    const patternHash = computeHash(pattern, base, mod);
    let textHash = computeHash(text.substring(0, pattern.length), base, mod);

    // 计算 base^(pattern.length-1) % mod
    let h = 1;
    for (let i = 0; i < pattern.length - 1; i++) {
        h = (h * base) % mod;
    }

    // 检查第一个窗口
    if (textHash === patternHash && text.substring(0, pattern.length) === pattern) {
        results.push(0);
    }

    // 滚动哈希
    for (let i = pattern.length; i < text.length; i++) {
        // 移除最左边的字符
        textHash = (textHash - (text.charCodeAt(i - pattern.length) * h) % mod + mod) % mod;
        // 添加最右边的字符
        textHash = (textHash * base + text.charCodeAt(i)) % mod;

        // 检查哈希值是否匹配
        if (textHash === patternHash) {
            const start = i - pattern.length + 1;
            if (text.substring(start, i + 1) === pattern) {
                results.push(start);
            }
        }
    }

    return results;
}

/**
 * 计算字符串的哈希值
 *
 * @param {string} str - 字符串
 * @param {number} base - 基数
 * @param {number} mod - 模数
 * @returns {number} 哈希值
 */
function computeHash(str, base, mod) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * base + str.charCodeAt(i)) % mod;
    }
    return hash;
}

// ============================= 3. 高级搜索算法 =============================

/**
 * 查找峰值元素
 *
 * 核心思想：
 * 在无序数组中使用二分搜索查找峰值元素
 * 峰值元素是指大于其邻居的元素
 *
 * @param {Array<number>} nums - 数组
 * @returns {number} 峰值元素的索引
 * @time O(log n)
 * @space O(1)
 */
function findPeakElement(nums) {
    let left = 0;
    let right = nums.length - 1;

    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);

        if (nums[mid] > nums[mid + 1]) {
            // 峰值在左侧（包括mid）
            right = mid;
        } else {
            // 峰值在右侧
            left = mid + 1;
        }
    }

    return left;
}

/**
 * 查找旋转排序数组中的最小值
 *
 * 核心思想：
 * 在旋转后的有序数组中使用二分搜索查找最小值
 * 通过比较中间元素与右边界元素确定最小值的位置
 *
 * @param {Array<number>} nums - 旋转排序数组
 * @returns {number} 最小值
 * @time O(log n)
 * @space O(1)
 */
function findMinInRotatedArray(nums) {
    let left = 0;
    let right = nums.length - 1;

    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);

        if (nums[mid] > nums[right]) {
            // 最小值在右半部分
            left = mid + 1;
        } else {
            // 最小值在左半部分（包括mid）
            right = mid;
        }
    }

    return nums[left];
}

/**
 * 在旋转排序数组中搜索目标值
 *
 * 核心思想：
 * 在旋转后的有序数组中使用二分搜索查找目标值
 * 先判断哪一半是有序的，然后决定在哪一半中搜索
 *
 * @param {Array<number>} nums - 旋转排序数组
 * @param {number} target - 目标值
 * @returns {number} 目标值的索引，未找到返回-1
 * @time O(log n)
 * @space O(1)
 */
function searchInRotatedArray(nums, target) {
    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);

        if (nums[mid] === target) {
            return mid;
        }

        // 判断左半部分是否有序
        if (nums[left] <= nums[mid]) {
            // 左半部分有序
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            // 右半部分有序
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }

    return -1;
}

/**
 * 搜索范围（查找目标值的起始和结束位置）
 *
 * 核心思想：
 * 使用二分搜索分别找到目标值的第一个和最后一个位置
 * 结合lower_bound和upper_bound的思想
 *
 * @param {Array<number>} nums - 有序数组
 * @param {number} target - 目标值
 * @returns {Array<number>} [起始位置, 结束位置]，未找到返回[-1, -1]
 * @time O(log n)
 * @space O(1)
 */
function searchRange(nums, target) {
    const left = binarySearchLowerBound(nums, target);

    if (left === nums.length || nums[left] !== target) {
        return [-1, -1];
    }

    const right = binarySearchUpperBound(nums, target) - 1;

    return [left, right];
}

// ============================= 4. 多维搜索算法 =============================

/**
 * 搜索二维矩阵
 *
 * 核心思想：
 * 在行和列都有序的矩阵中搜索目标值
 * 从右上角或左下角开始搜索，利用矩阵的有序性质
 *
 * @param {Array<Array<number>>} matrix - 二维矩阵
 * @param {number} target - 目标值
 * @returns {boolean} 是否找到目标值
 * @time O(m+n) m为行数，n为列数
 * @space O(1)
 */
function searchMatrix(matrix, target) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return false;
    }

    let row = 0;
    let col = matrix[0].length - 1;

    // 从右上角开始搜索
    while (row < matrix.length && col >= 0) {
        if (matrix[row][col] === target) {
            return true;
        } else if (matrix[row][col] > target) {
            col--; // 向左移动
        } else {
            row++; // 向下移动
        }
    }

    return false;
}

/**
 * 搜索严格递增的二维矩阵
 *
 * 核心思想：
 * 将二维矩阵视为一维有序数组，使用二分搜索
 * 通过坐标转换在二维矩阵中进行一维搜索
 *
 * @param {Array<Array<number>>} matrix - 严格递增的二维矩阵
 * @param {number} target - 目标值
 * @returns {boolean} 是否找到目标值
 * @time O(log(m*n))
 * @space O(1)
 */
function searchMatrixBinary(matrix, target) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return false;
    }

    const m = matrix.length;
    const n = matrix[0].length;
    let left = 0;
    let right = m * n - 1;

    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        const row = Math.floor(mid / n);
        const col = mid % n;
        const midValue = matrix[row][col];

        if (midValue === target) {
            return true;
        } else if (midValue < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return false;
}

// ============================= 5. 搜索算法工具类 =============================

/**
 * 搜索算法工具类
 *
 * 核心思想：
 * 封装各种搜索算法，提供统一的接口和性能比较功能
 * 支持自定义比较函数和多种搜索策略
 */
class SearchAlgorithms {
    constructor() {
        this.algorithms = {
            linear: linearSearch,
            binary: binarySearch,
            interpolation: interpolationSearch,
            exponential: exponentialSearch
        };
        this.stats = new Map();
    }

    /**
     * 执行搜索算法并记录性能
     *
     * @param {string} algorithm - 算法名称
     * @param {Array} data - 数据数组
     * @param {*} target - 目标值
     * @param {Function} [compareFn] - 比较函数
     * @returns {Object} 搜索结果和性能信息
     */
    search(algorithm, data, target, compareFn) {
        if (!this.algorithms[algorithm]) {
            throw new Error(`Unknown algorithm: ${algorithm}`);
        }

        const startTime = performance.now();
        let result;

        try {
            if (algorithm === 'interpolation') {
                result = this.algorithms[algorithm](data, target);
            } else {
                result = this.algorithms[algorithm](data, target, compareFn);
            }
        } catch (error) {
            result = { error: error.message };
        }

        const endTime = performance.now();
        const executionTime = endTime - startTime;

        // 记录统计信息
        if (!this.stats.has(algorithm)) {
            this.stats.set(algorithm, {
                totalTime: 0,
                totalSearches: 0,
                successfulSearches: 0
            });
        }

        const stat = this.stats.get(algorithm);
        stat.totalTime += executionTime;
        stat.totalSearches++;
        if (result !== -1 && !result.error) {
            stat.successfulSearches++;
        }

        return {
            algorithm,
            result,
            executionTime,
            dataSize: data.length
        };
    }

    /**
     * 比较不同算法的性能
     *
     * @param {Array} data - 数据数组
     * @param {*} target - 目标值
     * @param {Array<string>} [algorithms] - 要比较的算法列表
     * @returns {Array<Object>} 性能比较结果
     */
    compareAlgorithms(data, target, algorithms = ['linear', 'binary']) {
        const results = [];

        for (const algorithm of algorithms) {
            try {
                const result = this.search(algorithm, data, target);
                results.push(result);
            } catch (error) {
                results.push({
                    algorithm,
                    result: { error: error.message },
                    executionTime: 0,
                    dataSize: data.length
                });
            }
        }

        return results.sort((a, b) => a.executionTime - b.executionTime);
    }

    /**
     * 获取算法统计信息
     *
     * @returns {Object} 统计信息
     */
    getStatistics() {
        const stats = {};

        for (const [algorithm, stat] of this.stats) {
            stats[algorithm] = {
                ...stat,
                averageTime: stat.totalTime / stat.totalSearches,
                successRate: stat.successfulSearches / stat.totalSearches
            };
        }

        return stats;
    }

    /**
     * 重置统计信息
     */
    resetStatistics() {
        this.stats.clear();
    }
}

// ============================= 6. 测试和使用示例 =============================

/**
 * 生成测试数据
 */
function generateTestData() {
    return {
        small: [1, 3, 5, 7, 9, 11, 13, 15],
        medium: Array.from({length: 1000}, (_, i) => i * 2),
        large: Array.from({length: 100000}, (_, i) => i * 3),
        unsorted: [15, 3, 9, 1, 7, 11, 5, 13],
        withDuplicates: [1, 2, 2, 3, 3, 3, 4, 5, 5, 6]
    };
}

/**
 * 测试基础搜索算法
 */
function testBasicSearchAlgorithms() {
    console.log("=== 基础搜索算法测试 ===");

    const testData = generateTestData();

    // 测试线性搜索
    console.log("\n线性搜索测试:");
    console.log("查找15:", linearSearch(testData.unsorted, 15));
    console.log("查找所有2:", linearSearchAll(testData.withDuplicates, 2));

    // 测试二分搜索
    console.log("\n二分搜索测试:");
    console.log("查找9:", binarySearch(testData.small, 9));
    console.log("查找10:", binarySearch(testData.small, 10));

    // 测试二分搜索变种
    console.log("\n二分搜索变种测试:");
    console.log("Lower bound of 3:", binarySearchLowerBound(testData.withDuplicates, 3));
    console.log("Upper bound of 3:", binarySearchUpperBound(testData.withDuplicates, 3));

    // 测试插值搜索
    console.log("\n插值搜索测试:");
    console.log("查找100:", interpolationSearch(testData.medium, 100));

    // 测试指数搜索
    console.log("\n指数搜索测试:");
    console.log("查找7:", exponentialSearch(testData.small, 7));
}

/**
 * 测试字符串搜索算法
 */
function testStringSearchAlgorithms() {
    console.log("\n=== 字符串搜索算法测试 ===");

    const text = "ababcababa";
    const pattern = "ababa";

    console.log(`文本: "${text}"`);
    console.log(`模式: "${pattern}"`);

    console.log("朴素搜索:", naiveStringSearch(text, pattern));
    console.log("KMP搜索:", kmpSearch(text, pattern));
    console.log("Boyer-Moore搜索:", boyerMooreSearch(text, pattern));
    console.log("Rabin-Karp搜索:", rabinKarpSearch(text, pattern));

    // 测试KMP表构建
    console.log("\nKMP失效函数表:", buildKMPTable(pattern));
}

/**
 * 测试高级搜索算法
 */
function testAdvancedSearchAlgorithms() {
    console.log("\n=== 高级搜索算法测试 ===");

    // 测试峰值查找
    const peakArray = [1, 2, 3, 1];
    console.log("峰值查找:", findPeakElement(peakArray));

    // 测试旋转数组
    const rotatedArray = [4, 5, 6, 7, 0, 1, 2];
    console.log("旋转数组最小值:", findMinInRotatedArray(rotatedArray));
    console.log("旋转数组中查找0:", searchInRotatedArray(rotatedArray, 0));

    // 测试搜索范围
    const rangeArray = [5, 7, 7, 8, 8, 10];
    console.log("查找8的范围:", searchRange(rangeArray, 8));
}

/**
 * 测试多维搜索
 */
function testMultiDimensionalSearch() {
    console.log("\n=== 多维搜索测试 ===");

    const matrix = [
        [1,  4,  7,  11],
        [2,  5,  8,  12],
        [3,  6,  9,  16],
        [10, 13, 14, 17]
    ];

    console.log("搜索5:", searchMatrix(matrix, 5));
    console.log("搜索20:", searchMatrix(matrix, 20));

    const strictMatrix = [
        [1,  3,  5,  7],
        [10, 11, 16, 20],
        [23, 30, 34, 60]
    ];

    console.log("严格递增矩阵搜索11:", searchMatrixBinary(strictMatrix, 11));
    console.log("严格递增矩阵搜索13:", searchMatrixBinary(strictMatrix, 13));
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const searcher = new SearchAlgorithms();
    const testData = generateTestData();

    // 测试不同算法的性能
    const target = 50000;
    const results = searcher.compareAlgorithms(testData.large, target, ['linear', 'binary']);

    console.log("性能比较结果:");
    results.forEach(result => {
        console.log(`${result.algorithm}: ${result.executionTime.toFixed(4)}ms, 结果: ${result.result}`);
    });

    // 多次搜索后的统计
    for (let i = 0; i < 100; i++) {
        const randomTarget = Math.floor(Math.random() * 100000) * 3;
        searcher.search('binary', testData.large, randomTarget);
        searcher.search('linear', testData.medium, randomTarget);
    }

    console.log("\n算法统计信息:");
    console.log(searcher.getStatistics());
}

/**
 * 运行所有测试
 */
function runAllTests() {
    console.log("搜索算法基础实现测试开始...\n");

    testBasicSearchAlgorithms();
    testStringSearchAlgorithms();
    testAdvancedSearchAlgorithms();
    testMultiDimensionalSearch();
    performanceTest();

    console.log("\n所有测试完成！");
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // 基础搜索算法
        linearSearch,
        linearSearchAll,
        binarySearch,
        binarySearchRecursive,
        binarySearchLowerBound,
        binarySearchUpperBound,
        interpolationSearch,
        exponentialSearch,

        // 字符串搜索算法
        naiveStringSearch,
        kmpSearch,
        buildKMPTable,
        boyerMooreSearch,
        rabinKarpSearch,

        // 高级搜索算法
        findPeakElement,
        findMinInRotatedArray,
        searchInRotatedArray,
        searchRange,

        // 多维搜索算法
        searchMatrix,
        searchMatrixBinary,

        // 工具类
        SearchAlgorithms,
        generateTestData,
        runAllTests
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.SearchAlgorithms = SearchAlgorithms;
    window.runSearchTests = runAllTests;
}

// 自动运行测试（如果直接执行此文件）
if (typeof require !== 'undefined' && require.main === module) {
    runAllTests();
}