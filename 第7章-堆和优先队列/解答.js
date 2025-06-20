/**
 * 第7章：堆和优先队列 - 练习题解答
 *
 * 包含5道精选题目的完整解答：
 * 1. 数组中的第K个最大元素
 * 2. 数据流的中位数
 * 3. 合并K个升序链表
 * 4. 前K个高频元素
 * 5. 会议室 II
 *
 * 每题包含：
 * - 详细的思路分析
 * - 多种解法对比
 * - 完整的代码实现
 * - 时间空间复杂度分析
 * - 测试用例验证
 */

// ======================= 工具类：最小堆和最大堆 =======================

class MinHeap {
    constructor(compareFn = (a, b) => a - b) {
        this.heap = [];
        this.compare = compareFn;
    }

    parent(i) { return Math.floor((i - 1) / 2); }
    left(i) { return 2 * i + 1; }
    right(i) { return 2 * i + 2; }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    insert(val) {
        this.heap.push(val);
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

    peek() { return this.heap.length > 0 ? this.heap[0] : null; }
    size() { return this.heap.length; }
    isEmpty() { return this.heap.length === 0; }

    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = this.parent(index);
            if (this.compare(this.heap[parentIndex], this.heap[index]) <= 0) break;
            this.swap(parentIndex, index);
            index = parentIndex;
        }
    }

    heapifyDown(index) {
        while (this.left(index) < this.heap.length) {
            let minIndex = this.left(index);
            if (this.right(index) < this.heap.length &&
                this.compare(this.heap[this.right(index)], this.heap[minIndex]) < 0) {
                minIndex = this.right(index);
            }
            if (this.compare(this.heap[index], this.heap[minIndex]) <= 0) break;
            this.swap(index, minIndex);
            index = minIndex;
        }
    }
}

class MaxHeap {
    constructor(compareFn = (a, b) => b - a) {
        this.heap = [];
        this.compare = compareFn;
    }

    parent(i) { return Math.floor((i - 1) / 2); }
    left(i) { return 2 * i + 1; }
    right(i) { return 2 * i + 2; }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    insert(val) {
        this.heap.push(val);
        this.heapifyUp(this.heap.length - 1);
    }

    extractMax() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const max = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return max;
    }

    peek() { return this.heap.length > 0 ? this.heap[0] : null; }
    size() { return this.heap.length; }
    isEmpty() { return this.heap.length === 0; }

    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = this.parent(index);
            if (this.compare(this.heap[parentIndex], this.heap[index]) >= 0) break;
            this.swap(parentIndex, index);
            index = parentIndex;
        }
    }

    heapifyDown(index) {
        while (this.left(index) < this.heap.length) {
            let maxIndex = this.left(index);
            if (this.right(index) < this.heap.length &&
                this.compare(this.heap[this.right(index)], this.heap[maxIndex]) > 0) {
                maxIndex = this.right(index);
            }
            if (this.compare(this.heap[index], this.heap[maxIndex]) >= 0) break;
            this.swap(index, maxIndex);
            index = maxIndex;
        }
    }
}

// ======================= 题目1：数组中的第K个最大元素 =======================

/**
 * 解法一：最小堆（推荐）
 *
 * 核心思想：
 * 使用大小为K的最小堆维护当前最大的K个元素
 * 堆顶就是第K大元素
 *
 * 算法步骤：
 * 1. 创建最小堆
 * 2. 遍历数组，将元素加入堆
 * 3. 当堆大小超过K时，移除堆顶（最小元素）
 * 4. 最终堆顶就是第K大元素
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 第几大
 * @returns {number} 第K大元素
 * @time O(n log k) 每个元素最多进行log k次堆操作
 * @space O(k) 堆的大小
 */
function findKthLargest(nums, k) {
    const minHeap = new MinHeap();

    for (const num of nums) {
        minHeap.insert(num);

        // 保持堆的大小为k
        if (minHeap.size() > k) {
            minHeap.extractMin();
        }
    }

    return minHeap.peek();
}

/**
 * 解法二：快速选择（进阶）
 *
 * 核心思想：
 * 基于快速排序的分区思想，找到第K大元素的位置
 *
 * @param {number[]} nums
 * @param {number} k
 * @returns {number}
 * @time O(n) 平均情况，O(n²) 最坏情况
 * @space O(1)
 */
function findKthLargestQuickSelect(nums, k) {
    const targetIndex = nums.length - k; // 第K大 = 第(n-k+1)小

    function quickSelect(left, right) {
        const pivotIndex = partition(left, right);

        if (pivotIndex === targetIndex) {
            return nums[pivotIndex];
        } else if (pivotIndex < targetIndex) {
            return quickSelect(pivotIndex + 1, right);
        } else {
            return quickSelect(left, pivotIndex - 1);
        }
    }

    function partition(left, right) {
        const pivot = nums[right];
        let i = left;

        for (let j = left; j < right; j++) {
            if (nums[j] <= pivot) {
                [nums[i], nums[j]] = [nums[j], nums[i]];
                i++;
            }
        }

        [nums[i], nums[right]] = [nums[right], nums[i]];
        return i;
    }

    return quickSelect(0, nums.length - 1);
}

/**
 * 解法三：直接排序（简单但效率较低）
 *
 * @param {number[]} nums
 * @param {number} k
 * @returns {number}
 * @time O(n log n)
 * @space O(1)
 */
function findKthLargestSort(nums, k) {
    nums.sort((a, b) => b - a);
    return nums[k - 1];
}

// ======================= 题目2：数据流的中位数 =======================

/**
 * 数据流中位数类
 *
 * 核心思想：
 * 使用两个堆维护数据流：
 * - maxHeap：存储较小的一半数据（最大堆）
 * - minHeap：存储较大的一半数据（最小堆）
 *
 * 平衡策略：
 * 1. 保持 maxHeap.size() >= minHeap.size()
 * 2. 保证 maxHeap 的所有元素 <= minHeap 的所有元素
 */
class MedianFinder {
    constructor() {
        this.maxHeap = new MaxHeap(); // 存储较小的一半
        this.minHeap = new MinHeap(); // 存储较大的一半
    }

    /**
     * 添加数字到数据流
     *
     * 算法步骤：
     * 1. 先将数字加入maxHeap
     * 2. 将maxHeap的最大值移动到minHeap（保证分割正确）
     * 3. 如果minHeap比maxHeap大，将minHeap的最小值移回maxHeap
     *
     * @param {number} num
     * @time O(log n)
     * @space O(1)
     */
    addNum(num) {
        // 先加入maxHeap
        this.maxHeap.insert(num);

        // 将maxHeap的最大值移到minHeap，确保分割正确
        this.minHeap.insert(this.maxHeap.extractMax());

        // 保持maxHeap的大小不小于minHeap
        if (this.maxHeap.size() < this.minHeap.size()) {
            this.maxHeap.insert(this.minHeap.extractMin());
        }
    }

    /**
     * 找到当前中位数
     *
     * @returns {number}
     * @time O(1)
     * @space O(1)
     */
    findMedian() {
        // 如果maxHeap更大，中位数是maxHeap的堆顶
        if (this.maxHeap.size() > this.minHeap.size()) {
            return this.maxHeap.peek();
        }

        // 两个堆大小相等，中位数是两个堆顶的平均值
        return (this.maxHeap.peek() + this.minHeap.peek()) / 2;
    }

    /**
     * 获取当前数据流的统计信息
     */
    getStats() {
        return {
            count: this.maxHeap.size() + this.minHeap.size(),
            median: this.findMedian(),
            maxHeapSize: this.maxHeap.size(),
            minHeapSize: this.minHeap.size()
        };
    }
}

// ======================= 题目3：合并K个升序链表 =======================

/**
 * 链表节点定义
 */
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

/**
 * 合并K个升序链表
 *
 * 核心思想：
 * 使用最小堆进行多路归并
 * 堆中始终维护每个链表当前的最小节点
 *
 * 算法步骤：
 * 1. 将所有链表的头节点加入最小堆
 * 2. 从堆中取出最小节点，加入结果链表
 * 3. 将该节点的下一个节点加入堆
 * 4. 重复直到堆为空
 *
 * @param {ListNode[]} lists - K个排序链表数组
 * @returns {ListNode} 合并后的链表头
 * @time O(n log k) n是所有节点总数，k是链表数量
 * @space O(k) 堆的大小
 */
function mergeKLists(lists) {
    if (!lists || lists.length === 0) return null;

    // 创建最小堆，按节点值排序
    const minHeap = new MinHeap((a, b) => a.val - b.val);

    // 将每个链表的头节点加入堆
    for (const head of lists) {
        if (head !== null) {
            minHeap.insert(head);
        }
    }

    // 创建虚拟头节点
    const dummy = new ListNode(0);
    let current = dummy;

    // 逐个处理堆中的节点
    while (!minHeap.isEmpty()) {
        const node = minHeap.extractMin();
        current.next = node;
        current = current.next;

        // 如果该节点有下一个节点，加入堆
        if (node.next !== null) {
            minHeap.insert(node.next);
        }
    }

    return dummy.next;
}

/**
 * 解法二：分治法
 *
 * 核心思想：
 * 将K个链表两两合并，类似归并排序的思想
 *
 * @param {ListNode[]} lists
 * @returns {ListNode}
 * @time O(n log k)
 * @space O(log k) 递归栈空间
 */
function mergeKListsDivideConquer(lists) {
    if (!lists || lists.length === 0) return null;
    if (lists.length === 1) return lists[0];

    function mergeTwoLists(l1, l2) {
        const dummy = new ListNode(0);
        let current = dummy;

        while (l1 !== null && l2 !== null) {
            if (l1.val <= l2.val) {
                current.next = l1;
                l1 = l1.next;
            } else {
                current.next = l2;
                l2 = l2.next;
            }
            current = current.next;
        }

        current.next = l1 || l2;
        return dummy.next;
    }

    function mergeHelper(lists, start, end) {
        if (start === end) return lists[start];
        if (start + 1 === end) return mergeTwoLists(lists[start], lists[end]);

        const mid = Math.floor((start + end) / 2);
        const left = mergeHelper(lists, start, mid);
        const right = mergeHelper(lists, mid + 1, end);
        return mergeTwoLists(left, right);
    }

    return mergeHelper(lists, 0, lists.length - 1);
}

// ======================= 题目4：前K个高频元素 =======================

/**
 * 前K个高频元素
 *
 * 核心思想：
 * 1. 使用哈希表统计每个元素的频率
 * 2. 使用最小堆（按频率排序）维护前K个高频元素
 * 3. 堆的大小保持为K，最终堆中就是答案
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 前K个
 * @returns {number[]} 前K个高频元素
 * @time O(n log k) n为数组长度
 * @space O(n) 哈希表空间
 */
function topKFrequent(nums, k) {
    // 统计频率
    const freqMap = new Map();
    for (const num of nums) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }

    // 使用最小堆，按频率排序
    const minHeap = new MinHeap((a, b) => a.freq - b.freq);

    for (const [num, freq] of freqMap) {
        minHeap.insert({ num, freq });

        // 保持堆的大小为k
        if (minHeap.size() > k) {
            minHeap.extractMin();
        }
    }

    // 提取结果
    const result = [];
    while (!minHeap.isEmpty()) {
        result.push(minHeap.extractMin().num);
    }

    return result.reverse(); // 按频率从高到低排序
}

/**
 * 解法二：桶排序
 *
 * 核心思想：
 * 使用桶排序的思想，将相同频率的元素放在同一个桶中
 *
 * @param {number[]} nums
 * @param {number} k
 * @returns {number[]}
 * @time O(n)
 * @space O(n)
 */
function topKFrequentBucket(nums, k) {
    // 统计频率
    const freqMap = new Map();
    for (const num of nums) {
        freqMap.set(num, (freqMap.get(num) || 0) + 1);
    }

    // 创建桶，索引表示频率
    const buckets = new Array(nums.length + 1).fill(null).map(() => []);

    // 将元素按频率放入对应的桶
    for (const [num, freq] of freqMap) {
        buckets[freq].push(num);
    }

    // 从高频率的桶开始收集结果
    const result = [];
    for (let i = buckets.length - 1; i >= 0 && result.length < k; i--) {
        for (const num of buckets[i]) {
            if (result.length < k) {
                result.push(num);
            }
        }
    }

    return result;
}

// ======================= 题目5：会议室 II =======================

/**
 * 会议室 II
 *
 * 核心思想：
 * 使用最小堆跟踪每个会议室的结束时间
 * 按会议开始时间排序，贪心分配会议室
 *
 * 算法步骤：
 * 1. 按会议开始时间排序
 * 2. 用最小堆存储每个会议室的结束时间
 * 3. 对于每个新会议：
 *    - 如果有会议室已结束（堆顶时间 <= 开始时间），复用该会议室
 *    - 否则分配新会议室
 * 4. 堆的大小就是所需的会议室数量
 *
 * @param {number[][]} intervals - 会议时间区间
 * @returns {number} 所需的最少会议室数量
 * @time O(n log n) 排序时间复杂度
 * @space O(n) 堆的最大大小
 */
function minMeetingRooms(intervals) {
    if (intervals.length === 0) return 0;

    // 按开始时间排序
    intervals.sort((a, b) => a[0] - b[0]);

    // 最小堆存储会议室的结束时间
    const minHeap = new MinHeap();

    for (const [start, end] of intervals) {
        // 如果有会议室已经结束，可以复用
        if (!minHeap.isEmpty() && minHeap.peek() <= start) {
            minHeap.extractMin();
        }

        // 分配会议室（新的或复用的）
        minHeap.insert(end);
    }

    // 堆的大小就是所需的会议室数量
    return minHeap.size();
}

/**
 * 解法二：扫描线算法
 *
 * 核心思想：
 * 将开始和结束时间分别处理，统计同时进行的会议数量
 *
 * @param {number[][]} intervals
 * @returns {number}
 * @time O(n log n)
 * @space O(n)
 */
function minMeetingRoomsSweepLine(intervals) {
    if (intervals.length === 0) return 0;

    const events = [];

    // 创建事件：1表示开始，-1表示结束
    for (const [start, end] of intervals) {
        events.push([start, 1]);   // 会议开始
        events.push([end, -1]);    // 会议结束
    }

    // 按时间排序，结束事件在开始事件之前（相同时间）
    events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);

    let maxRooms = 0;
    let currentRooms = 0;

    for (const [time, type] of events) {
        currentRooms += type;
        maxRooms = Math.max(maxRooms, currentRooms);
    }

    return maxRooms;
}

// ======================= 测试用例 =======================

/**
 * 运行所有测试
 */
function runAllTests() {
    console.log("========== 第7章：堆和优先队列练习题解答测试 ==========\n");

    testKthLargest();
    testMedianFinder();
    testMergeKLists();
    testTopKFrequent();
    testMinMeetingRooms();
    performanceComparison();
}

/**
 * 测试第K大元素
 */
function testKthLargest() {
    console.log("=== 题目1：数组中的第K个最大元素 ===");

    const testCases = [
        { nums: [3, 2, 1, 5, 6, 4], k: 2, expected: 5 },
        { nums: [3, 2, 3, 1, 2, 4, 5, 5, 6], k: 4, expected: 4 },
        { nums: [1], k: 1, expected: 1 },
        { nums: [1, 2], k: 1, expected: 2 }
    ];

    testCases.forEach((test, index) => {
        const result1 = findKthLargest([...test.nums], test.k);
        const result2 = findKthLargestQuickSelect([...test.nums], test.k);
        const result3 = findKthLargestSort([...test.nums], test.k);

        console.log(`测试${index + 1}:`);
        console.log(`  输入: nums=${JSON.stringify(test.nums)}, k=${test.k}`);
        console.log(`  期望: ${test.expected}`);
        console.log(`  堆方法: ${result1}`);
        console.log(`  快选方法: ${result2}`);
        console.log(`  排序方法: ${result3}`);
        console.log(`  结果: ${result1 === test.expected ? "✅" : "❌"}\n`);
    });
}

/**
 * 测试数据流中位数
 */
function testMedianFinder() {
    console.log("=== 题目2：数据流的中位数 ===");

    const medianFinder = new MedianFinder();
    const operations = [
        { op: "addNum", val: 1, expected: null },
        { op: "addNum", val: 2, expected: null },
        { op: "findMedian", val: null, expected: 1.5 },
        { op: "addNum", val: 3, expected: null },
        { op: "findMedian", val: null, expected: 2 }
    ];

    console.log("数据流操作序列:");
    operations.forEach((operation, index) => {
        let result;
        if (operation.op === "addNum") {
            medianFinder.addNum(operation.val);
            result = null;
            console.log(`操作${index + 1}: addNum(${operation.val})`);
        } else {
            result = medianFinder.findMedian();
            console.log(`操作${index + 1}: findMedian() = ${result}`);
            console.log(`  期望: ${operation.expected}, 实际: ${result}, 结果: ${result === operation.expected ? "✅" : "❌"}`);
        }
        console.log(`  当前状态: ${JSON.stringify(medianFinder.getStats())}`);
    });

    console.log();
}

/**
 * 测试合并K个链表
 */
function testMergeKLists() {
    console.log("=== 题目3：合并K个升序链表 ===");

    // 辅助函数：创建链表
    function createList(arr) {
        if (arr.length === 0) return null;
        const head = new ListNode(arr[0]);
        let current = head;
        for (let i = 1; i < arr.length; i++) {
            current.next = new ListNode(arr[i]);
            current = current.next;
        }
        return head;
    }

    // 辅助函数：链表转数组
    function listToArray(head) {
        const result = [];
        while (head) {
            result.push(head.val);
            head = head.next;
        }
        return result;
    }

    const testCases = [
        {
            lists: [[1, 4, 5], [1, 3, 4], [2, 6]],
            expected: [1, 1, 2, 3, 4, 4, 5, 6]
        },
        {
            lists: [],
            expected: []
        },
        {
            lists: [[]],
            expected: []
        }
    ];

    testCases.forEach((test, index) => {
        const lists = test.lists.map(createList);
        const result1 = mergeKLists([...lists]);
        const result2 = mergeKListsDivideConquer([...lists]);

        const array1 = listToArray(result1);
        const array2 = listToArray(result2);

        console.log(`测试${index + 1}:`);
        console.log(`  输入: ${JSON.stringify(test.lists)}`);
        console.log(`  期望: ${JSON.stringify(test.expected)}`);
        console.log(`  堆方法: ${JSON.stringify(array1)}`);
        console.log(`  分治方法: ${JSON.stringify(array2)}`);
        console.log(`  结果: ${JSON.stringify(array1) === JSON.stringify(test.expected) ? "✅" : "❌"}\n`);
    });
}

/**
 * 测试前K个高频元素
 */
function testTopKFrequent() {
    console.log("=== 题目4：前K个高频元素 ===");

    const testCases = [
        { nums: [1, 1, 1, 2, 2, 3], k: 2, expected: [1, 2] },
        { nums: [1], k: 1, expected: [1] },
        { nums: [1, 2], k: 2, expected: [1, 2] }
    ];

    testCases.forEach((test, index) => {
        const result1 = topKFrequent([...test.nums], test.k);
        const result2 = topKFrequentBucket([...test.nums], test.k);

        // 由于结果可能有多种正确答案，检查是否包含期望元素
        const isValid1 = test.expected.every(num => result1.includes(num));
        const isValid2 = test.expected.every(num => result2.includes(num));

        console.log(`测试${index + 1}:`);
        console.log(`  输入: nums=${JSON.stringify(test.nums)}, k=${test.k}`);
        console.log(`  期望包含: ${JSON.stringify(test.expected)}`);
        console.log(`  堆方法: ${JSON.stringify(result1)}`);
        console.log(`  桶方法: ${JSON.stringify(result2)}`);
        console.log(`  结果: ${isValid1 && isValid2 ? "✅" : "❌"}\n`);
    });
}

/**
 * 测试会议室调度
 */
function testMinMeetingRooms() {
    console.log("=== 题目5：会议室 II ===");

    const testCases = [
        { intervals: [[0, 30], [5, 10], [15, 20]], expected: 2 },
        { intervals: [[7, 10], [2, 4]], expected: 1 },
        { intervals: [[9, 10], [4, 9], [4, 17]], expected: 2 },
        { intervals: [], expected: 0 }
    ];

    testCases.forEach((test, index) => {
        const result1 = minMeetingRooms([...test.intervals]);
        const result2 = minMeetingRoomsSweepLine([...test.intervals]);

        console.log(`测试${index + 1}:`);
        console.log(`  输入: ${JSON.stringify(test.intervals)}`);
        console.log(`  期望: ${test.expected}`);
        console.log(`  堆方法: ${result1}`);
        console.log(`  扫描线方法: ${result2}`);
        console.log(`  结果: ${result1 === test.expected && result2 === test.expected ? "✅" : "❌"}\n`);
    });
}

/**
 * 性能对比测试
 */
function performanceComparison() {
    console.log("=== 性能对比测试 ===");

    const sizes = [1000, 5000, 10000];

    sizes.forEach(size => {
        console.log(`\n测试规模: ${size} 个元素`);

        // 生成随机数据
        const nums = Array.from({ length: size }, () => Math.floor(Math.random() * size));
        const k = Math.floor(size / 10);

        // 测试第K大元素的不同方法
        const start1 = performance.now();
        findKthLargest([...nums], k);
        const heapTime = performance.now() - start1;

        const start2 = performance.now();
        findKthLargestQuickSelect([...nums], k);
        const quickSelectTime = performance.now() - start2;

        const start3 = performance.now();
        findKthLargestSort([...nums], k);
        const sortTime = performance.now() - start3;

        console.log(`第${k}大元素算法性能对比:`);
        console.log(`  堆方法: ${heapTime.toFixed(2)}ms`);
        console.log(`  快速选择: ${quickSelectTime.toFixed(2)}ms`);
        console.log(`  直接排序: ${sortTime.toFixed(2)}ms`);
        console.log(`  堆 vs 排序效率: ${(sortTime / heapTime).toFixed(2)}x`);
    });

    console.log();
}

// 执行所有测试
runAllTests();