/**
 * 第11章：排序算法 - 练习题解答
 *
 * 本文件包含排序算法章节的5道练习题的完整解答
 * 包括多种解法、详细分析和完整测试用例
 *
 * @author 算法教程
 * @date 2024
 */

// ===========================================
// 练习题1：合并k个排序数组
// ===========================================

/**
 * 合并k个排序数组 - 方法1：两两合并
 *
 * 核心思想：
 * 类似于归并排序的分治思想，将k个数组的合并问题转化为
 * 两两合并的子问题，通过递归或迭代的方式解决
 *
 * @param {number[][]} arrays - k个已排序的数组
 * @returns {number[]} 合并后的排序数组
 * @time O(N * log k) N是所有元素总数，k是数组个数
 * @space O(N) 递归栈空间和结果数组
 */
function mergeKArraysV1(arrays) {
    if (!arrays || arrays.length === 0) return [];
    if (arrays.length === 1) return arrays[0];

    return mergeKArraysHelper(arrays, 0, arrays.length - 1);
}

function mergeKArraysHelper(arrays, left, right) {
    if (left === right) return arrays[left];

    const mid = Math.floor((left + right) / 2);
    const leftMerged = mergeKArraysHelper(arrays, left, mid);
    const rightMerged = mergeKArraysHelper(arrays, mid + 1, right);

    return mergeTwoSortedArrays(leftMerged, rightMerged);
}

function mergeTwoSortedArrays(arr1, arr2) {
    const result = [];
    let i = 0, j = 0;

    // 比较两个数组的元素，选择较小的放入结果数组
    while (i < arr1.length && j < arr2.length) {
        if (arr1[i] <= arr2[j]) {
            result.push(arr1[i++]);
        } else {
            result.push(arr2[j++]);
        }
    }

    // 处理剩余元素
    while (i < arr1.length) result.push(arr1[i++]);
    while (j < arr2.length) result.push(arr2[j++]);

    return result;
}

/**
 * 合并k个排序数组 - 方法2：优先队列（最小堆）
 *
 * 核心思想：
 * 使用最小堆来维护k个数组的当前最小元素，每次取出堆顶元素
 * （当前所有数组中的最小值），然后将该元素所在数组的下一个元素加入堆
 *
 * @param {number[][]} arrays - k个已排序的数组
 * @returns {number[]} 合并后的排序数组
 * @time O(N * log k) N是所有元素总数
 * @space O(k) 堆的大小
 */
function mergeKArraysV2(arrays) {
    if (!arrays || arrays.length === 0) return [];

    const result = [];
    const heap = new MinHeap();

    // 将每个数组的第一个元素加入堆
    for (let i = 0; i < arrays.length; i++) {
        if (arrays[i].length > 0) {
            heap.insert({
                value: arrays[i][0],
                arrayIndex: i,
                elementIndex: 0
            });
        }
    }

    // 依次取出最小元素，并加入下一个元素
    while (!heap.isEmpty()) {
        const min = heap.extractMin();
        result.push(min.value);

        // 如果当前数组还有下一个元素，加入堆
        const nextIndex = min.elementIndex + 1;
        if (nextIndex < arrays[min.arrayIndex].length) {
            heap.insert({
                value: arrays[min.arrayIndex][nextIndex],
                arrayIndex: min.arrayIndex,
                elementIndex: nextIndex
            });
        }
    }

    return result;
}

/**
 * 最小堆实现
 */
class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert(item) {
        this.heap.push(item);
        this.heapifyUp(this.heap.length - 1);
    }

    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return min;
    }

    heapifyUp(index) {
        const parentIndex = Math.floor((index - 1) / 2);
        if (parentIndex >= 0 && this.heap[parentIndex].value > this.heap[index].value) {
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            this.heapifyUp(parentIndex);
        }
    }

    heapifyDown(index) {
        const leftChild = 2 * index + 1;
        const rightChild = 2 * index + 2;
        let smallest = index;

        if (leftChild < this.heap.length && this.heap[leftChild].value < this.heap[smallest].value) {
            smallest = leftChild;
        }

        if (rightChild < this.heap.length && this.heap[rightChild].value < this.heap[smallest].value) {
            smallest = rightChild;
        }

        if (smallest !== index) {
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            this.heapifyDown(smallest);
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

// ===========================================
// 练习题2：数组的相对排序
// ===========================================

/**
 * 数组的相对排序 - 方法1：计数排序
 *
 * 核心思想：
 * 先统计arr1中每个元素的出现次数，然后按arr2的顺序输出
 * 对于不在arr2中的元素，单独收集并排序后追加到结果末尾
 *
 * @param {number[]} arr1 - 待排序数组
 * @param {number[]} arr2 - 相对顺序参考数组
 * @returns {number[]} 按相对顺序排列的数组
 * @time O(n + m + k*log k) n=arr1长度，m=arr2长度，k=不在arr2中的元素个数
 * @space O(n) 计数表和结果数组
 */
function relativeSortV1(arr1, arr2) {
    const result = [];
    const count = new Map();
    const order = new Map();

    // 建立arr2中元素的顺序映射
    for (let i = 0; i < arr2.length; i++) {
        order.set(arr2[i], i);
    }

    // 统计arr1中每个元素的出现次数
    for (const num of arr1) {
        count.set(num, (count.get(num) || 0) + 1);
    }

    // 按arr2的顺序添加元素
    for (const num of arr2) {
        const freq = count.get(num) || 0;
        for (let i = 0; i < freq; i++) {
            result.push(num);
        }
        count.delete(num); // 移除已处理的元素
    }

    // 处理不在arr2中的元素，按升序排列
    const remaining = [];
    for (const [num, freq] of count) {
        for (let i = 0; i < freq; i++) {
            remaining.push(num);
        }
    }
    remaining.sort((a, b) => a - b);

    return result.concat(remaining);
}

/**
 * 数组的相对排序 - 方法2：自定义比较函数
 *
 * 核心思想：
 * 为arr2中的每个元素分配一个优先级，不在arr2中的元素使用原值作为优先级
 * 通过自定义比较函数实现排序
 *
 * @param {number[]} arr1 - 待排序数组
 * @param {number[]} arr2 - 相对顺序参考数组
 * @returns {number[]} 按相对顺序排列的数组
 * @time O(n * log n) 主要是排序的时间复杂度
 * @space O(m) 优先级映射表
 */
function relativeSortV2(arr1, arr2) {
    const priorityMap = new Map();

    // 为arr2中的元素分配优先级（从0开始）
    for (let i = 0; i < arr2.length; i++) {
        priorityMap.set(arr2[i], i);
    }

    return arr1.sort((a, b) => {
        const priorityA = priorityMap.has(a) ? priorityMap.get(a) : 1000 + a;
        const priorityB = priorityMap.has(b) ? priorityMap.get(b) : 1000 + b;
        return priorityA - priorityB;
    });
}

// ===========================================
// 练习题3：最大间距问题
// ===========================================

/**
 * 最大间距问题 - 方法1：桶排序
 *
 * 核心思想：
 * 使用桶排序的思想，将n个元素分配到n-1个桶中，根据鸽笼原理
 * 至少有一个桶为空，最大间距必定出现在相邻非空桶之间
 *
 * @param {number[]} nums - 无序数组
 * @returns {number} 排序后相邻元素的最大间距
 * @time O(n) 线性时间复杂度
 * @space O(n) 桶的空间
 */
function maximumGap(nums) {
    if (nums.length < 2) return 0;

    const n = nums.length;
    const minVal = Math.min(...nums);
    const maxVal = Math.max(...nums);

    // 如果所有元素相同，间距为0
    if (minVal === maxVal) return 0;

    // 计算桶的大小，确保最大间距不会在桶内出现
    const bucketSize = Math.max(1, Math.floor((maxVal - minVal) / (n - 1)));
    const bucketCount = Math.floor((maxVal - minVal) / bucketSize) + 1;

    // 初始化桶，每个桶存储最小值和最大值
    const buckets = Array(bucketCount).fill(null).map(() => ({
        min: Infinity,
        max: -Infinity,
        hasValue: false
    }));

    // 将元素分配到桶中
    for (const num of nums) {
        const bucketIndex = Math.floor((num - minVal) / bucketSize);
        buckets[bucketIndex].min = Math.min(buckets[bucketIndex].min, num);
        buckets[bucketIndex].max = Math.max(buckets[bucketIndex].max, num);
        buckets[bucketIndex].hasValue = true;
    }

    // 计算相邻非空桶之间的最大间距
    let maxGap = 0;
    let prevMax = minVal;

    for (const bucket of buckets) {
        if (bucket.hasValue) {
            // 当前桶的最小值与前一个桶的最大值之间的间距
            maxGap = Math.max(maxGap, bucket.min - prevMax);
            prevMax = bucket.max;
        }
    }

    return maxGap;
}

/**
 * 最大间距问题 - 方法2：基数排序
 *
 * 核心思想：
 * 使用基数排序实现O(n)时间复杂度的排序，然后遍历排序后的数组
 * 计算相邻元素的最大间距
 *
 * @param {number[]} nums - 无序数组
 * @returns {number} 排序后相邻元素的最大间距
 * @time O(d*n) d是最大数的位数
 * @space O(n) 辅助数组空间
 */
function maximumGapRadix(nums) {
    if (nums.length < 2) return 0;

    // 基数排序
    radixSort(nums);

    // 计算最大间距
    let maxGap = 0;
    for (let i = 1; i < nums.length; i++) {
        maxGap = Math.max(maxGap, nums[i] - nums[i - 1]);
    }

    return maxGap;
}

function radixSort(nums) {
    const max = Math.max(...nums);

    // 从个位开始，依次对每一位进行计数排序
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        countingSort(nums, exp);
    }
}

function countingSort(nums, exp) {
    const n = nums.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);

    // 统计每个数字的出现次数
    for (let i = 0; i < n; i++) {
        count[Math.floor(nums[i] / exp) % 10]++;
    }

    // 计算累积计数
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // 从后向前构建输出数组
    for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(nums[i] / exp) % 10;
        output[count[digit] - 1] = nums[i];
        count[digit]--;
    }

    // 复制回原数组
    for (let i = 0; i < n; i++) {
        nums[i] = output[i];
    }
}

// ===========================================
// 练习题4：会议室安排问题
// ===========================================

/**
 * 判断是否可以参加所有会议
 *
 * 核心思想：
 * 按会议开始时间排序，检查是否有时间重叠
 * 如果前一个会议的结束时间大于当前会议的开始时间，则有冲突
 *
 * @param {number[][]} intervals - 会议时间数组
 * @returns {boolean} 是否可以参加所有会议
 * @time O(n * log n) 排序的时间复杂度
 * @space O(1) 原地排序
 */
function canAttendMeetings(intervals) {
    if (!intervals || intervals.length <= 1) return true;

    // 按开始时间排序
    intervals.sort((a, b) => a[0] - b[0]);

    // 检查相邻会议是否有时间冲突
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i - 1][1] > intervals[i][0]) {
            return false; // 有时间重叠
        }
    }

    return true;
}

/**
 * 计算最少需要的会议室数量
 *
 * 核心思想：
 * 使用优先队列（最小堆）来跟踪每个会议室的结束时间
 * 当新会议开始时，检查是否有会议室已经释放
 *
 * @param {number[][]} intervals - 会议时间数组
 * @returns {number} 最少需要的会议室数量
 * @time O(n * log n) 排序和堆操作
 * @space O(n) 堆的空间
 */
function minMeetingRooms(intervals) {
    if (!intervals || intervals.length === 0) return 0;

    // 按开始时间排序
    intervals.sort((a, b) => a[0] - b[0]);

    // 使用最小堆存储会议室的结束时间
    const endTimes = [];

    for (const interval of intervals) {
        const [start, end] = interval;

        // 如果最早结束的会议室已经释放，重复使用
        if (endTimes.length > 0 && endTimes[0] <= start) {
            endTimes.shift(); // 移除已释放的会议室
        }

        // 为当前会议分配会议室
        endTimes.push(end);
        endTimes.sort((a, b) => a - b); // 保持最小堆性质
    }

    return endTimes.length;
}

/**
 * 返回最优会议安排顺序
 *
 * 核心思想：
 * 使用贪心算法，按会议结束时间排序，优先选择结束时间早的会议
 * 这样能安排最多的会议数量
 *
 * @param {number[][]} intervals - 会议时间数组
 * @returns {number[][]} 最优会议安排顺序
 * @time O(n * log n) 排序的时间复杂度
 * @space O(n) 结果数组
 */
function scheduleMeetings(intervals) {
    if (!intervals || intervals.length === 0) return [];

    // 按结束时间排序
    intervals.sort((a, b) => a[1] - b[1]);

    const result = [];
    let lastEndTime = 0;

    for (const interval of intervals) {
        const [start, end] = interval;

        // 如果当前会议的开始时间不早于上一个会议的结束时间
        if (start >= lastEndTime) {
            result.push(interval);
            lastEndTime = end;
        }
    }

    return result;
}

// ===========================================
// 练习题5：自定义排序器设计
// ===========================================

/**
 * 自定义排序器类
 *
 * 核心思想：
 * 使用策略模式封装不同的排序算法，根据数据特征自动选择最优算法
 * 支持多关键字排序和性能统计功能
 */
class CustomSorter {
    constructor() {
        this.performanceStats = {
            totalOperations: 0,
            totalTime: 0,
            algorithmUsage: new Map(),
            lastSort: null
        };
    }

    /**
     * 自动选择最适合的排序算法
     *
     * @param {any[]} arr - 待排序数组
     * @param {Function} compareFn - 比较函数
     * @returns {any[]} 排序后的数组
     */
    autoSort(arr, compareFn = (a, b) => a - b) {
        const startTime = performance.now();
        const analysis = this.analyzeData(arr);
        let algorithm, result;

        // 根据数据特征选择算法
        if (analysis.size <= 10) {
            algorithm = 'insertion';
            result = this.insertionSort([...arr], compareFn);
        } else if (analysis.isNearlySorted) {
            algorithm = 'timsort';
            result = this.timSort([...arr], compareFn);
        } else if (analysis.hasLargeRange && analysis.isUniformDistribution) {
            algorithm = 'bucket';
            result = this.bucketSort([...arr]);
        } else if (analysis.size > 1000) {
            algorithm = 'quicksort';
            result = this.quickSort([...arr], compareFn);
        } else {
            algorithm = 'mergesort';
            result = this.mergeSort([...arr], compareFn);
        }

        this.updateStats(algorithm, performance.now() - startTime);
        return result;
    }

    /**
     * 多关键字排序
     *
     * @param {Object[]} arr - 对象数组
     * @param {Object[]} keys - 排序键配置
     * @returns {Object[]} 排序后的数组
     */
    multiKeySort(arr, keys) {
        const startTime = performance.now();

        const result = [...arr].sort((a, b) => {
            for (const { key, order = 'asc' } of keys) {
                let comparison = 0;

                if (typeof a[key] === 'string') {
                    comparison = a[key].localeCompare(b[key]);
                } else {
                    comparison = a[key] - b[key];
                }

                if (comparison !== 0) {
                    return order === 'desc' ? -comparison : comparison;
                }
            }
            return 0;
        });

        this.updateStats('multikey', performance.now() - startTime);
        return result;
    }

    /**
     * 分析数据特征
     */
    analyzeData(arr) {
        const size = arr.length;
        if (size === 0) return { size, isNearlySorted: false, hasLargeRange: false };

        const isNumeric = arr.every(x => typeof x === 'number');
        let isNearlySorted = false;
        let hasLargeRange = false;
        let isUniformDistribution = false;

        if (isNumeric) {
            // 检查是否接近有序
            let inversionCount = 0;
            for (let i = 0; i < size - 1; i++) {
                if (arr[i] > arr[i + 1]) inversionCount++;
            }
            isNearlySorted = inversionCount < size * 0.1;

            // 检查数值范围
            const min = Math.min(...arr);
            const max = Math.max(...arr);
            hasLargeRange = (max - min) > size * 10;

            // 检查分布均匀性
            const buckets = new Array(Math.min(10, size)).fill(0);
            const bucketSize = (max - min) / buckets.length;
            for (const num of arr) {
                const index = Math.min(Math.floor((num - min) / bucketSize), buckets.length - 1);
                buckets[index]++;
            }
            const avgCount = size / buckets.length;
            const variance = buckets.reduce((sum, count) => sum + Math.pow(count - avgCount, 2), 0) / buckets.length;
            isUniformDistribution = variance < avgCount * avgCount * 0.5;
        }

        return { size, isNearlySorted, hasLargeRange, isUniformDistribution };
    }

    /**
     * 插入排序实现
     */
    insertionSort(arr, compareFn) {
        for (let i = 1; i < arr.length; i++) {
            const key = arr[i];
            let j = i - 1;

            while (j >= 0 && compareFn(arr[j], key) > 0) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
        return arr;
    }

    /**
     * 快速排序实现
     */
    quickSort(arr, compareFn, left = 0, right = arr.length - 1) {
        if (left < right) {
            const pivotIndex = this.partition(arr, compareFn, left, right);
            this.quickSort(arr, compareFn, left, pivotIndex - 1);
            this.quickSort(arr, compareFn, pivotIndex + 1, right);
        }
        return arr;
    }

    partition(arr, compareFn, left, right) {
        const pivot = arr[right];
        let i = left - 1;

        for (let j = left; j < right; j++) {
            if (compareFn(arr[j], pivot) <= 0) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }

        [arr[i + 1], arr[right]] = [arr[right], arr[i + 1]];
        return i + 1;
    }

    /**
     * 归并排序实现
     */
    mergeSort(arr, compareFn) {
        if (arr.length <= 1) return arr;

        const mid = Math.floor(arr.length / 2);
        const left = this.mergeSort(arr.slice(0, mid), compareFn);
        const right = this.mergeSort(arr.slice(mid), compareFn);

        return this.merge(left, right, compareFn);
    }

    merge(left, right, compareFn) {
        const result = [];
        let i = 0, j = 0;

        while (i < left.length && j < right.length) {
            if (compareFn(left[i], right[j]) <= 0) {
                result.push(left[i++]);
            } else {
                result.push(right[j++]);
            }
        }

        return result.concat(left.slice(i)).concat(right.slice(j));
    }

    /**
     * Tim排序实现（简化版）
     */
    timSort(arr, compareFn) {
        const minMerge = 32;

        // 对小的子数组使用插入排序
        for (let i = 0; i < arr.length; i += minMerge) {
            const end = Math.min(i + minMerge - 1, arr.length - 1);
            this.insertionSortRange(arr, compareFn, i, end);
        }

        // 合并已排序的子数组
        let size = minMerge;
        while (size < arr.length) {
            for (let start = 0; start < arr.length; start += size * 2) {
                const mid = start + size - 1;
                const end = Math.min(start + size * 2 - 1, arr.length - 1);

                if (mid < end) {
                    this.mergeRange(arr, compareFn, start, mid, end);
                }
            }
            size *= 2;
        }

        return arr;
    }

    insertionSortRange(arr, compareFn, left, right) {
        for (let i = left + 1; i <= right; i++) {
            const key = arr[i];
            let j = i - 1;

            while (j >= left && compareFn(arr[j], key) > 0) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    mergeRange(arr, compareFn, left, mid, right) {
        const leftArr = arr.slice(left, mid + 1);
        const rightArr = arr.slice(mid + 1, right + 1);

        let i = 0, j = 0, k = left;

        while (i < leftArr.length && j < rightArr.length) {
            if (compareFn(leftArr[i], rightArr[j]) <= 0) {
                arr[k++] = leftArr[i++];
            } else {
                arr[k++] = rightArr[j++];
            }
        }

        while (i < leftArr.length) arr[k++] = leftArr[i++];
        while (j < rightArr.length) arr[k++] = rightArr[j++];
    }

    /**
     * 桶排序实现（仅适用于数值数组）
     */
    bucketSort(arr) {
        if (arr.length <= 1) return arr;

        const min = Math.min(...arr);
        const max = Math.max(...arr);
        const bucketCount = Math.floor(Math.sqrt(arr.length));
        const bucketSize = (max - min) / bucketCount;
        const buckets = Array(bucketCount).fill(null).map(() => []);

        // 分配元素到桶中
        for (const num of arr) {
            const bucketIndex = Math.min(Math.floor((num - min) / bucketSize), bucketCount - 1);
            buckets[bucketIndex].push(num);
        }

        // 对每个桶排序并合并结果
        const result = [];
        for (const bucket of buckets) {
            if (bucket.length > 0) {
                bucket.sort((a, b) => a - b);
                result.push(...bucket);
            }
        }

        return result;
    }

    /**
     * 更新性能统计
     */
    updateStats(algorithm, time) {
        this.performanceStats.totalOperations++;
        this.performanceStats.totalTime += time;
        this.performanceStats.algorithmUsage.set(
            algorithm,
            (this.performanceStats.algorithmUsage.get(algorithm) || 0) + 1
        );
        this.performanceStats.lastSort = {
            algorithm,
            time,
            timestamp: Date.now()
        };
    }

    /**
     * 获取性能统计
     */
    getPerformanceStats() {
        return {
            ...this.performanceStats,
            averageTime: this.performanceStats.totalTime / this.performanceStats.totalOperations || 0,
            algorithmUsage: Object.fromEntries(this.performanceStats.algorithmUsage)
        };
    }

    /**
     * 重置性能统计
     */
    resetStats() {
        this.performanceStats = {
            totalOperations: 0,
            totalTime: 0,
            algorithmUsage: new Map(),
            lastSort: null
        };
    }
}

// ===========================================
// 测试函数
// ===========================================

function testMergeKArrays() {
    console.log("=== 测试：合并k个排序数组 ===");

    const testCases = [
        [[1,4,5],[1,3,4],[2,6]],
        [[1,2,3],[4,5,6],[7,8,9]],
        [[]],
        [[1],[2],[3]],
        [[1,5,9],[2,6,10],[3,7,11],[4,8,12]]
    ];

    testCases.forEach((arrays, index) => {
        const result1 = mergeKArraysV1(arrays);
        const result2 = mergeKArraysV2(arrays);
        console.log(`测试用例 ${index + 1}:`);
        console.log(`输入: ${JSON.stringify(arrays)}`);
        console.log(`两两合并结果: ${JSON.stringify(result1)}`);
        console.log(`优先队列结果: ${JSON.stringify(result2)}`);
        console.log(`结果一致: ${JSON.stringify(result1) === JSON.stringify(result2)}`);
        console.log();
    });
}

function testRelativeSort() {
    console.log("=== 测试：数组的相对排序 ===");

    const testCases = [
        {
            arr1: [2,3,1,3,2,4,6,7,9,2,19],
            arr2: [2,1,4,3,9,6]
        },
        {
            arr1: [28,6,22,8,44,17],
            arr2: [22,28,8,6]
        }
    ];

    testCases.forEach((testCase, index) => {
        const result1 = relativeSortV1([...testCase.arr1], testCase.arr2);
        const result2 = relativeSortV2([...testCase.arr1], testCase.arr2);
        console.log(`测试用例 ${index + 1}:`);
        console.log(`arr1: ${JSON.stringify(testCase.arr1)}`);
        console.log(`arr2: ${JSON.stringify(testCase.arr2)}`);
        console.log(`计数排序结果: ${JSON.stringify(result1)}`);
        console.log(`自定义比较结果: ${JSON.stringify(result2)}`);
        console.log();
    });
}

function testMaximumGap() {
    console.log("=== 测试：最大间距问题 ===");

    const testCases = [
        [3,6,9,1],
        [10],
        [1,1,1,1],
        [1,10000000],
        [15252,16764,27963,7817,26155,20757,3478,22602,20723,16790]
    ];

    testCases.forEach((nums, index) => {
        const result1 = maximumGap([...nums]);
        const result2 = maximumGapRadix([...nums]);
        console.log(`测试用例 ${index + 1}:`);
        console.log(`输入: ${JSON.stringify(nums)}`);
        console.log(`桶排序结果: ${result1}`);
        console.log(`基数排序结果: ${result2}`);
        console.log(`结果一致: ${result1 === result2}`);
        console.log();
    });
}

function testMeetingRoom() {
    console.log("=== 测试：会议室安排问题 ===");

    const testCases = [
        [[0,30],[5,10],[15,20]],
        [[7,10],[2,4]],
        [[9,10],[4,9],[4,17]],
        [[1,5],[8,9],[8,9]]
    ];

    testCases.forEach((intervals, index) => {
        const canAttend = canAttendMeetings([...intervals]);
        const minRooms = minMeetingRooms([...intervals]);
        const schedule = scheduleMeetings([...intervals]);

        console.log(`测试用例 ${index + 1}:`);
        console.log(`会议时间: ${JSON.stringify(intervals)}`);
        console.log(`可以参加所有会议: ${canAttend}`);
        console.log(`最少需要会议室: ${minRooms}`);
        console.log(`最优安排: ${JSON.stringify(schedule)}`);
        console.log();
    });
}

function testCustomSorter() {
    console.log("=== 测试：自定义排序器 ===");

    const sorter = new CustomSorter();

    // 测试自动排序
    const nums = [64, 34, 25, 12, 22, 11, 90, 88, 76, 50, 42];
    const sortedNums = sorter.autoSort(nums);
    console.log("自动排序测试:");
    console.log(`原数组: ${JSON.stringify(nums)}`);
    console.log(`排序结果: ${JSON.stringify(sortedNums)}`);

    // 测试多关键字排序
    const students = [
        {name: "Alice", grade: 85, age: 20},
        {name: "Bob", grade: 85, age: 19},
        {name: "Charlie", grade: 90, age: 20},
        {name: "David", grade: 90, age: 19}
    ];

    const sortedStudents = sorter.multiKeySort(students, [
        {key: 'grade', order: 'desc'},
        {key: 'age', order: 'asc'},
        {key: 'name', order: 'asc'}
    ]);

    console.log("\n多关键字排序测试:");
    console.log("原数据:", students);
    console.log("排序结果:", sortedStudents);

    // 性能统计
    console.log("\n性能统计:");
    console.log(sorter.getPerformanceStats());
}

function runAllTests() {
    console.log("开始运行排序算法练习题测试...\n");

    testMergeKArrays();
    testRelativeSort();
    testMaximumGap();
    testMeetingRoom();
    testCustomSorter();

    console.log("所有测试完成！");
}

// 运行测试
runAllTests();