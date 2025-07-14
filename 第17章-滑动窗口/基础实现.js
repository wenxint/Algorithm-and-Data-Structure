/**
 * 第17章 滑动窗口 - 基础实现
 *
 * 本文件包含滑动窗口技术的基础数据结构和算法实现：
 * 1. 固定大小滑动窗口
 * 2. 可变大小滑动窗口
 * 3. 单调双端队列
 * 4. 滑动窗口统计器
 *
 * 滑动窗口是一种高效的算法技术，能将O(n²)的暴力算法优化到O(n)
 */

/**
 * 固定大小滑动窗口类
 *
 * 核心思想：
 * 维护一个固定大小的窗口，通过滑动操作来遍历数组
 * 每次移动时移除左边元素，添加右边元素
 */
class FixedSlidingWindow {
    /**
     * 构造函数
     * @param {number} size - 窗口大小
     */
    constructor(size) {
        this.size = size;
        this.window = [];
        this.sum = 0;
        this.position = 0;
    }

    /**
     * 添加元素到窗口
     * @param {number} val - 要添加的值
     * @return {object} 当前窗口状态
     */
    add(val) {
        this.window.push(val);
        this.sum += val;

        // 如果窗口大小超过限制，移除最左边的元素
        if (this.window.length > this.size) {
            const removed = this.window.shift();
            this.sum -= removed;
        }

        this.position++;

        return {
            window: [...this.window],
            sum: this.sum,
            average: this.window.length === this.size ? this.sum / this.size : null,
            position: this.position,
            isFull: this.window.length === this.size
        };
    }

    /**
     * 重置窗口
     */
    reset() {
        this.window = [];
        this.sum = 0;
        this.position = 0;
    }

    /**
     * 获取当前窗口状态
     * @return {object} 窗口状态信息
     */
    getState() {
        return {
            window: [...this.window],
            sum: this.sum,
            average: this.window.length === this.size ? this.sum / this.size : null,
            size: this.window.length,
            maxSize: this.size,
            position: this.position
        };
    }

    /**
     * 处理整个数组
     * @param {number[]} nums - 输入数组
     * @return {object[]} 每个位置的窗口状态
     */
    processArray(nums) {
        const results = [];
        this.reset();

        for (let i = 0; i < nums.length; i++) {
            const state = this.add(nums[i]);
            if (state.isFull) {
                results.push({
                    startIndex: i - this.size + 1,
                    endIndex: i,
                    window: state.window,
                    sum: state.sum,
                    average: state.average
                });
            }
        }

        return results;
    }
}

/**
 * 可变大小滑动窗口类
 *
 * 核心思想：
 * 使用双指针技术，根据条件动态调整窗口大小
 * 通过左右指针的移动来扩展或收缩窗口
 */
class VariableSlidingWindow {
    /**
     * 构造函数
     * @param {function} isValid - 判断窗口是否有效的函数
     */
    constructor(isValid) {
        this.isValid = isValid || (() => true);
        this.left = 0;
        this.right = 0;
        this.window = [];
        this.sum = 0;
        this.maxLength = 0;
        this.minLength = Infinity;
    }

    /**
     * 扩展窗口（添加右边元素）
     * @param {number} val - 要添加的值
     */
    expand(val) {
        this.window.push(val);
        this.sum += val;
        this.right++;
    }

    /**
     * 收缩窗口（移除左边元素）
     * @return {number} 被移除的元素
     */
    contract() {
        if (this.window.length === 0) return null;

        const removed = this.window.shift();
        this.sum -= removed;
        this.left++;
        return removed;
    }

    /**
     * 获取当前窗口大小
     * @return {number} 窗口大小
     */
    size() {
        return this.right - this.left;
    }

    /**
     * 检查当前窗口是否有效
     * @return {boolean} 是否有效
     */
    isCurrentValid() {
        return this.isValid(this.window, this.sum, this.left, this.right);
    }

    /**
     * 更新统计信息
     */
    updateStats() {
        const currentSize = this.size();
        this.maxLength = Math.max(this.maxLength, currentSize);
        if (currentSize > 0) {
            this.minLength = Math.min(this.minLength, currentSize);
        }
    }

    /**
     * 重置窗口
     */
    reset() {
        this.left = 0;
        this.right = 0;
        this.window = [];
        this.sum = 0;
        this.maxLength = 0;
        this.minLength = Infinity;
    }

    /**
     * 寻找最长有效窗口
     * @param {number[]} nums - 输入数组
     * @return {object} 结果信息
     */
    findLongestWindow(nums) {
        this.reset();
        let bestWindow = { window: [], sum: 0, left: 0, right: 0, length: 0 };

        this.right = 0;
        while (this.right < nums.length) {
            // 扩展窗口
            this.expand(nums[this.right]);

            // 收缩窗口直到有效
            while (!this.isCurrentValid() && this.left < this.right) {
                this.contract();
            }

            // 更新最优结果
            if (this.isCurrentValid() && this.size() > bestWindow.length) {
                bestWindow = {
                    window: [...this.window],
                    sum: this.sum,
                    left: this.left,
                    right: this.right - 1,
                    length: this.size()
                };
            }

            this.updateStats();
        }

        return {
            bestWindow,
            maxLength: this.maxLength,
            minLength: this.minLength === Infinity ? 0 : this.minLength
        };
    }

    /**
     * 寻找最短有效窗口
     * @param {number[]} nums - 输入数组
     * @return {object} 结果信息
     */
    findShortestWindow(nums) {
        this.reset();
        let bestWindow = { window: [], sum: 0, left: 0, right: 0, length: Infinity };

        this.right = 0;
        while (this.right < nums.length) {
            // 扩展窗口
            this.expand(nums[this.right]);

            // 当窗口有效时，尝试收缩到最小
            while (this.isCurrentValid() && this.left < this.right) {
                if (this.size() < bestWindow.length) {
                    bestWindow = {
                        window: [...this.window],
                        sum: this.sum,
                        left: this.left,
                        right: this.right - 1,
                        length: this.size()
                    };
                }
                this.contract();
            }

            this.updateStats();
        }

        return {
            bestWindow: bestWindow.length === Infinity ? null : bestWindow,
            maxLength: this.maxLength,
            minLength: this.minLength === Infinity ? 0 : this.minLength
        };
    }
}

/**
 * 单调双端队列类
 *
 * 核心思想：
 * 维护队列中元素的单调性（递增或递减）
 * 用于高效求解滑动窗口最值问题
 */
class MonotonicDeque {
    /**
     * 构造函数
     * @param {boolean} isIncreasing - 是否为递增队列（false为递减）
     */
    constructor(isIncreasing = false) {
        this.deque = []; // 存储元素索引
        this.values = []; // 存储对应的值
        this.isIncreasing = isIncreasing;
    }

    /**
     * 添加元素
     * @param {number} value - 元素值
     * @param {number} index - 元素索引
     */
    push(value, index) {
        // 保持单调性，移除违反单调性的元素
        if (this.isIncreasing) {
            // 递增队列：移除队尾比当前元素大的元素
            while (this.deque.length > 0 &&
                   this.values[this.deque.length - 1] >= value) {
                this.deque.pop();
                this.values.pop();
            }
        } else {
            // 递减队列：移除队尾比当前元素小的元素
            while (this.deque.length > 0 &&
                   this.values[this.deque.length - 1] <= value) {
                this.deque.pop();
                this.values.pop();
            }
        }

        this.deque.push(index);
        this.values.push(value);
    }

    /**
     * 移除超出窗口范围的元素
     * @param {number} windowLeft - 窗口左边界
     */
    removeOutOfWindow(windowLeft) {
        while (this.deque.length > 0 && this.deque[0] < windowLeft) {
            this.deque.shift();
            this.values.shift();
        }
    }

    /**
     * 获取当前最值（队首元素）
     * @return {number|null} 最值或null（如果队列为空）
     */
    getExtreme() {
        return this.values.length > 0 ? this.values[0] : null;
    }

    /**
     * 获取当前最值的索引
     * @return {number|null} 最值索引或null
     */
    getExtremeIndex() {
        return this.deque.length > 0 ? this.deque[0] : null;
    }

    /**
     * 检查队列是否为空
     * @return {boolean} 是否为空
     */
    isEmpty() {
        return this.deque.length === 0;
    }

    /**
     * 获取队列大小
     * @return {number} 队列大小
     */
    size() {
        return this.deque.length;
    }

    /**
     * 清空队列
     */
    clear() {
        this.deque = [];
        this.values = [];
    }

    /**
     * 获取队列状态（用于调试）
     * @return {object} 队列状态
     */
    getState() {
        return {
            indices: [...this.deque],
            values: [...this.values],
            extreme: this.getExtreme(),
            extremeIndex: this.getExtremeIndex(),
            isEmpty: this.isEmpty(),
            size: this.size(),
            type: this.isIncreasing ? 'increasing' : 'decreasing'
        };
    }
}

/**
 * 滑动窗口统计器类
 *
 * 核心思想：
 * 综合使用多种滑动窗口技术，提供丰富的统计功能
 * 可以同时计算和、最值、平均值等多种统计信息
 */
class SlidingWindowStats {
    /**
     * 构造函数
     * @param {number} windowSize - 窗口大小
     */
    constructor(windowSize) {
        this.windowSize = windowSize;
        this.window = [];
        this.sum = 0;
        this.minDeque = new MonotonicDeque(true);  // 递增队列求最小值
        this.maxDeque = new MonotonicDeque(false); // 递减队列求最大值
        this.position = 0;
    }

    /**
     * 添加新元素
     * @param {number} value - 新元素值
     * @return {object} 当前窗口统计信息
     */
    add(value) {
        // 添加到窗口
        this.window.push(value);
        this.sum += value;

        // 更新单调队列
        this.minDeque.push(value, this.position);
        this.maxDeque.push(value, this.position);

        // 如果窗口超过大小，移除最左边的元素
        if (this.window.length > this.windowSize) {
            const removed = this.window.shift();
            this.sum -= removed;
        }

        // 移除超出窗口范围的元素
        const windowLeft = Math.max(0, this.position - this.windowSize + 1);
        this.minDeque.removeOutOfWindow(windowLeft);
        this.maxDeque.removeOutOfWindow(windowLeft);

        this.position++;

        return this.getStats();
    }

    /**
     * 获取当前统计信息
     * @return {object} 统计信息
     */
    getStats() {
        const size = this.window.length;

        return {
            window: [...this.window],
            size: size,
            sum: this.sum,
            average: size > 0 ? this.sum / size : 0,
            min: this.minDeque.getExtreme(),
            max: this.maxDeque.getExtreme(),
            range: this.maxDeque.getExtreme() !== null && this.minDeque.getExtreme() !== null
                   ? this.maxDeque.getExtreme() - this.minDeque.getExtreme() : 0,
            median: this.calculateMedian(),
            position: this.position,
            isComplete: size === this.windowSize
        };
    }

    /**
     * 计算中位数
     * @return {number} 中位数
     */
    calculateMedian() {
        if (this.window.length === 0) return 0;

        const sorted = [...this.window].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);

        if (sorted.length % 2 === 0) {
            return (sorted[mid - 1] + sorted[mid]) / 2;
        } else {
            return sorted[mid];
        }
    }

    /**
     * 重置统计器
     */
    reset() {
        this.window = [];
        this.sum = 0;
        this.minDeque.clear();
        this.maxDeque.clear();
        this.position = 0;
    }

    /**
     * 处理整个数组并返回所有窗口的统计信息
     * @param {number[]} nums - 输入数组
     * @return {object[]} 每个完整窗口的统计信息
     */
    processArray(nums) {
        const results = [];
        this.reset();

        for (let i = 0; i < nums.length; i++) {
            const stats = this.add(nums[i]);
            if (stats.isComplete) {
                results.push({
                    startIndex: i - this.windowSize + 1,
                    endIndex: i,
                    ...stats
                });
            }
        }

        return results;
    }

    /**
     * 获取全局统计信息
     * @param {number[]} nums - 输入数组
     * @return {object} 全局统计信息
     */
    getGlobalStats(nums) {
        const windowStats = this.processArray(nums);

        if (windowStats.length === 0) {
            return {
                totalWindows: 0,
                globalMin: null,
                globalMax: null,
                avgSum: 0,
                avgAverage: 0,
                avgRange: 0
            };
        }

        const sums = windowStats.map(w => w.sum);
        const averages = windowStats.map(w => w.average);
        const ranges = windowStats.map(w => w.range);
        const mins = windowStats.map(w => w.min);
        const maxs = windowStats.map(w => w.max);

        return {
            totalWindows: windowStats.length,
            globalMin: Math.min(...mins),
            globalMax: Math.max(...maxs),
            avgSum: sums.reduce((a, b) => a + b, 0) / sums.length,
            avgAverage: averages.reduce((a, b) => a + b, 0) / averages.length,
            avgRange: ranges.reduce((a, b) => a + b, 0) / ranges.length,
            windowStats: windowStats
        };
    }
}

// 导出所有类和函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FixedSlidingWindow,
        VariableSlidingWindow,
        MonotonicDeque,
        SlidingWindowStats
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.FixedSlidingWindow = FixedSlidingWindow;
    window.VariableSlidingWindow = VariableSlidingWindow;
    window.MonotonicDeque = MonotonicDeque;
    window.SlidingWindowStats = SlidingWindowStats;
}