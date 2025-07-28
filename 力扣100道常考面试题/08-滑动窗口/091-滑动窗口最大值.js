/**
 * LeetCode 091: 滑动窗口最大值 (Sliding Window Maximum)
 *
 * 题目描述：
 * 给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。
 * 你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。
 * 返回滑动窗口中的最大值。
 *
 * 示例：
 * 输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
 * 输出：[3,3,5,5,6,7]
 * 解释：
 * 滑动窗口的位置                最大值
 * ---------------               -----
 * [1  3  -1] -3  5  3  6  7       3
 *  1 [3  -1  -3] 5  3  6  7       3
 *  1  3 [-1  -3  5] 3  6  7       5
 *  1  3  -1 [-3  5  3] 6  7       5
 *  1  3  -1  -3 [5  3  6] 7       6
 *  1  3  -1  -3  5 [3  6  7]      7
 *
 * 核心思想：
 * 单调双端队列 - 维护一个递减的双端队列，存储可能成为最大值的元素索引
 *
 * 算法原理：
 * 1. 队列维护：保持队列单调递减，队头始终是当前窗口最大值
 * 2. 入队操作：移除队尾所有小于当前元素的索引，然后将当前索引入队
 * 3. 出队操作：检查队头索引是否在当前窗口范围内，超出则移除
 * 4. 结果收集：队头元素即为当前窗口最大值
 */

/**
 * 解法一：单调双端队列（推荐）
 *
 * 核心思想：
 * 使用双端队列维护一个单调递减序列，队头始终是窗口最大值
 *
 * 算法步骤：
 * 1. 维护双端队列存储数组索引
 * 2. 队列中索引对应的元素值保持单调递减
 * 3. 窗口滑动时，移除过期索引，添加新索引
 * 4. 队头索引对应的值就是当前窗口最大值
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 窗口大小
 * @returns {number[]} 每个窗口的最大值数组
 * @time O(n) - 每个元素最多入队出队一次
 * @space O(k) - 队列最多存储k个元素
 */
function maxSlidingWindow(nums, k) {
    if (!nums || nums.length === 0 || k === 0) return [];

    const result = [];
    const deque = []; // 存储数组索引的双端队列

    for (let i = 0; i < nums.length; i++) {
        // 1. 移除队头过期的索引（超出窗口范围）
        while (deque.length > 0 && deque[0] <= i - k) {
            deque.shift();
        }

        // 2. 移除队尾所有小于当前元素的索引（维护单调性）
        while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
            deque.pop();
        }

        // 3. 将当前索引加入队尾
        deque.push(i);

        // 4. 当窗口形成时，记录最大值
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }

    return result;
}

/**
 * 解法二：暴力解法
 *
 * 核心思想：
 * 对每个窗口暴力查找最大值
 *
 * 算法步骤：
 * 1. 遍历每个可能的窗口起始位置
 * 2. 在每个窗口内找到最大值
 * 3. 将最大值加入结果数组
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 窗口大小
 * @returns {number[]} 每个窗口的最大值数组
 * @time O(n*k) - 对每个窗口遍历k个元素
 * @space O(1) - 只使用常数额外空间
 */
function maxSlidingWindowBruteForce(nums, k) {
    if (!nums || nums.length === 0 || k === 0) return [];

    const result = [];

    // 遍历每个可能的窗口
    for (let i = 0; i <= nums.length - k; i++) {
        let max = nums[i];

        // 在当前窗口内找最大值
        for (let j = i; j < i + k; j++) {
            max = Math.max(max, nums[j]);
        }

        result.push(max);
    }

    return result;
}

/**
 * 解法三：优先队列（大顶堆）
 *
 * 核心思想：
 * 使用大顶堆维护窗口内的元素，堆顶是最大值
 *
 * 算法步骤：
 * 1. 维护一个大顶堆存储[值, 索引]对
 * 2. 窗口滑动时添加新元素到堆
 * 3. 移除堆顶过期元素
 * 4. 堆顶元素的值就是当前窗口最大值
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 窗口大小
 * @returns {number[]} 每个窗口的最大值数组
 * @time O(n*logk) - 每次堆操作logk复杂度
 * @space O(k) - 堆最多存储k个元素
 */
function maxSlidingWindowHeap(nums, k) {
    if (!nums || nums.length === 0 || k === 0) return [];

    // 简化版大顶堆实现
    class MaxHeap {
        constructor() {
            this.heap = [];
        }

        // 获取父节点索引
        parent(i) { return Math.floor((i - 1) / 2); }

        // 获取左子节点索引
        leftChild(i) { return 2 * i + 1; }

        // 获取右子节点索引
        rightChild(i) { return 2 * i + 2; }

        // 向上调整
        heapifyUp(i) {
            while (i > 0) {
                const p = this.parent(i);
                if (this.heap[i][0] > this.heap[p][0]) {
                    [this.heap[i], this.heap[p]] = [this.heap[p], this.heap[i]];
                    i = p;
                } else {
                    break;
                }
            }
        }

        // 向下调整
        heapifyDown(i) {
            while (this.leftChild(i) < this.heap.length) {
                let maxChild = this.leftChild(i);
                const rightChild = this.rightChild(i);

                if (rightChild < this.heap.length &&
                    this.heap[rightChild][0] > this.heap[maxChild][0]) {
                    maxChild = rightChild;
                }

                if (this.heap[i][0] < this.heap[maxChild][0]) {
                    [this.heap[i], this.heap[maxChild]] = [this.heap[maxChild], this.heap[i]];
                    i = maxChild;
                } else {
                    break;
                }
            }
        }

        // 插入元素
        push(item) {
            this.heap.push(item);
            this.heapifyUp(this.heap.length - 1);
        }

        // 获取堆顶元素
        top() {
            return this.heap.length > 0 ? this.heap[0] : null;
        }

        // 移除堆顶元素
        pop() {
            if (this.heap.length === 0) return null;
            if (this.heap.length === 1) return this.heap.pop();

            const root = this.heap[0];
            this.heap[0] = this.heap.pop();
            this.heapifyDown(0);
            return root;
        }

        size() {
            return this.heap.length;
        }
    }

    const result = [];
    const heap = new MaxHeap();

    for (let i = 0; i < nums.length; i++) {
        // 添加当前元素到堆 [值, 索引]
        heap.push([nums[i], i]);

        // 当窗口形成时
        if (i >= k - 1) {
            // 移除堆顶过期元素
            while (heap.size() > 0 && heap.top()[1] <= i - k) {
                heap.pop();
            }

            // 堆顶元素就是当前窗口最大值
            result.push(heap.top()[0]);
        }
    }

    return result;
}

/**
 * 解法四：分块处理
 *
 * 核心思想：
 * 将数组分成大小为k的块，预处理每块的前缀最大值和后缀最大值
 *
 * 算法步骤：
 * 1. 计算每个位置的前缀最大值（从块开始到当前位置）
 * 2. 计算每个位置的后缀最大值（从当前位置到块结束）
 * 3. 对于每个窗口，最大值是右边界的前缀最大值和左边界的后缀最大值的较大者
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 窗口大小
 * @returns {number[]} 每个窗口的最大值数组
 * @time O(n) - 线性时间预处理和查询
 * @space O(n) - 需要额外数组存储前缀和后缀最大值
 */
function maxSlidingWindowBlockwise(nums, k) {
    if (!nums || nums.length === 0 || k === 0) return [];

    const n = nums.length;
    const left = new Array(n);   // 前缀最大值
    const right = new Array(n);  // 后缀最大值

    // 计算前缀最大值（每k个元素为一块）
    for (let i = 0; i < n; i++) {
        if (i % k === 0) {
            left[i] = nums[i];
        } else {
            left[i] = Math.max(left[i - 1], nums[i]);
        }
    }

    // 计算后缀最大值（每k个元素为一块）
    for (let i = n - 1; i >= 0; i--) {
        if (i === n - 1 || (i + 1) % k === 0) {
            right[i] = nums[i];
        } else {
            right[i] = Math.max(right[i + 1], nums[i]);
        }
    }

    const result = [];

    // 对于每个窗口，最大值是右边界的left值和左边界的right值的较大者
    for (let i = 0; i <= n - k; i++) {
        result.push(Math.max(right[i], left[i + k - 1]));
    }

    return result;
}

// 测试用例
console.log("=== LeetCode 091: 滑动窗口最大值 测试 ===");

const testCases = [
    { nums: [1,3,-1,-3,5,3,6,7], k: 3 },
    { nums: [1], k: 1 },
    { nums: [1,-1], k: 1 },
    { nums: [9,11], k: 2 },
    { nums: [4,-2], k: 2 },
    { nums: [1,3,1,2,0,5], k: 3 }
];

console.log("\n解法一：单调双端队列");
testCases.forEach((test, index) => {
    const result = maxSlidingWindow(test.nums, test.k);
    console.log(`测试 ${index + 1}: nums=[${test.nums}], k=${test.k} => [${result}]`);
});

console.log("\n解法二：暴力解法");
testCases.forEach((test, index) => {
    const result = maxSlidingWindowBruteForce(test.nums, test.k);
    console.log(`测试 ${index + 1}: nums=[${test.nums}], k=${test.k} => [${result}]`);
});

console.log("\n解法三：优先队列（大顶堆）");
testCases.forEach((test, index) => {
    const result = maxSlidingWindowHeap(test.nums, test.k);
    console.log(`测试 ${index + 1}: nums=[${test.nums}], k=${test.k} => [${result}]`);
});

console.log("\n解法四：分块处理");
testCases.forEach((test, index) => {
    const result = maxSlidingWindowBlockwise(test.nums, test.k);
    console.log(`测试 ${index + 1}: nums=[${test.nums}], k=${test.k} => [${result}]`);
});

/**
 * 算法总结：
 *
 * 1. 单调双端队列（推荐）：
 *    - 时间复杂度：O(n)
 *    - 空间复杂度：O(k)
 *    - 优点：最优解法，每个元素最多入队出队一次
 *    - 核心：维护单调递减队列，队头是最大值
 *
 * 2. 暴力解法：
 *    - 时间复杂度：O(n*k)
 *    - 空间复杂度：O(1)
 *    - 优点：思路简单，容易理解
 *    - 缺点：时间复杂度较高，适合小数据量
 *
 * 3. 优先队列（大顶堆）：
 *    - 时间复杂度：O(n*logk)
 *    - 空间复杂度：O(k)
 *    - 优点：通用性强，适用于各种滑动窗口问题
 *    - 缺点：有额外的对数时间复杂度
 *
 * 4. 分块处理：
 *    - 时间复杂度：O(n)
 *    - 空间复杂度：O(n)
 *    - 优点：预处理后查询O(1)
 *    - 适用：多次查询同一数组的滑动窗口
 *
 * 核心要点：
 * - 单调队列是最优解法
 * - 理解窗口滑动的本质
 * - 合理利用数据结构特性
 * - 考虑预处理优化多次查询场景
 */