/**
 * 第7章：堆和优先队列 - 基础实现
 *
 * 包含内容：
 * 1. 最大堆（MaxHeap）实现
 * 2. 最小堆（MinHeap）实现
 * 3. 优先队列（PriorityQueue）实现
 * 4. 堆的各种操作：插入、删除、构建、排序
 * 5. 完整的测试用例和性能分析
 * 6. 实际应用场景演示
 *
 * 学习重点：
 * - 理解堆的完全二叉树性质
 * - 掌握堆化操作的核心思想
 * - 熟练使用数组表示堆结构
 * - 了解堆在优先队列中的应用
 */

// ======================= 最大堆实现 =======================

/**
 * 最大堆类
 *
 * 核心思想：
 * 最大堆是一个完全二叉树，其中每个父节点的值都大于或等于其子节点的值
 * 使用数组存储，利用完全二叉树的性质进行索引计算
 *
 * 主要操作：
 * - insert: 插入元素并维护堆性质
 * - extractMax: 删除并返回最大元素
 * - peek: 查看最大元素但不删除
 * - buildHeap: 从数组构建堆
 */
class MaxHeap {
    constructor() {
        this.heap = [];
    }

    /**
     * 获取父节点索引
     * @param {number} index - 子节点索引
     * @returns {number} 父节点索引
     */
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    /**
     * 获取左子节点索引
     * @param {number} index - 父节点索引
     * @returns {number} 左子节点索引
     */
    getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    /**
     * 获取右子节点索引
     * @param {number} index - 父节点索引
     * @returns {number} 右子节点索引
     */
    getRightChildIndex(index) {
        return 2 * index + 2;
    }

    /**
     * 检查是否有父节点
     * @param {number} index - 当前节点索引
     * @returns {boolean} 是否有父节点
     */
    hasParent(index) {
        return this.getParentIndex(index) >= 0;
    }

    /**
     * 检查是否有左子节点
     * @param {number} index - 当前节点索引
     * @returns {boolean} 是否有左子节点
     */
    hasLeftChild(index) {
        return this.getLeftChildIndex(index) < this.heap.length;
    }

    /**
     * 检查是否有右子节点
     * @param {number} index - 当前节点索引
     * @returns {boolean} 是否有右子节点
     */
    hasRightChild(index) {
        return this.getRightChildIndex(index) < this.heap.length;
    }

    /**
     * 获取父节点值
     */
    parent(index) {
        return this.heap[this.getParentIndex(index)];
    }

    /**
     * 获取左子节点值
     */
    leftChild(index) {
        return this.heap[this.getLeftChildIndex(index)];
    }

    /**
     * 获取右子节点值
     */
    rightChild(index) {
        return this.heap[this.getRightChildIndex(index)];
    }

    /**
     * 交换两个元素
     * @param {number} index1 - 第一个元素索引
     * @param {number} index2 - 第二个元素索引
     */
    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    /**
     * 查看堆顶元素（最大值）
     * @returns {number|null} 堆顶元素，如果堆为空则返回null
     */
    peek() {
        return this.heap.length === 0 ? null : this.heap[0];
    }

    /**
     * 获取堆的大小
     * @returns {number} 堆中元素个数
     */
    size() {
        return this.heap.length;
    }

    /**
     * 检查堆是否为空
     * @returns {boolean} 堆是否为空
     */
    isEmpty() {
        return this.heap.length === 0;
    }

    /**
     * 插入元素
     *
     * 核心思想：
     * 1. 将新元素添加到数组末尾（完全二叉树的最后位置）
     * 2. 通过上滤操作恢复堆性质
     *
     * @param {number} item - 要插入的元素
     * @time O(log n) 最多需要上滤到根节点
     * @space O(1) 只使用常数额外空间
     */
    insert(item) {
        this.heap.push(item);
        this.heapifyUp(this.heap.length - 1);
    }

    /**
     * 删除并返回最大元素
     *
     * 核心思想：
     * 1. 保存堆顶元素（最大值）
     * 2. 将最后一个元素移到堆顶
     * 3. 通过下滤操作恢复堆性质
     *
     * @returns {number|null} 最大元素，如果堆为空则返回null
     * @time O(log n) 最多需要下滤到叶子节点
     * @space O(1) 只使用常数额外空间
     */
    extractMax() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const max = this.heap[0];
        this.heap[0] = this.heap.pop(); // 将最后一个元素移到堆顶
        this.heapifyDown(0); // 下滤恢复堆性质
        return max;
    }

    /**
     * 上滤操作：将元素向上移动直到满足堆性质
     *
     * 核心思想：
     * 比较当前节点与父节点，如果当前节点更大则交换
     * 继续向上比较直到满足堆性质或到达根节点
     *
     * @param {number} index - 开始上滤的位置
     */
    heapifyUp(index) {
        while (this.hasParent(index) && this.parent(index) < this.heap[index]) {
            this.swap(this.getParentIndex(index), index);
            index = this.getParentIndex(index);
        }
    }

    /**
     * 下滤操作：将元素向下移动直到满足堆性质
     *
     * 核心思想：
     * 找到当前节点和其子节点中的最大值
     * 如果子节点更大，则交换并继续下滤
     * 重复直到满足堆性质或到达叶子节点
     *
     * @param {number} index - 开始下滤的位置
     */
    heapifyDown(index) {
        while (this.hasLeftChild(index)) {
            let largerChildIndex = this.getLeftChildIndex(index);

            // 找到较大的子节点
            if (this.hasRightChild(index) &&
                this.rightChild(index) > this.leftChild(index)) {
                largerChildIndex = this.getRightChildIndex(index);
            }

            // 如果当前节点已经大于等于较大的子节点，堆性质满足
            if (this.heap[index] >= this.heap[largerChildIndex]) {
                break;
            }

            // 交换并继续下滤
            this.swap(index, largerChildIndex);
            index = largerChildIndex;
        }
    }

    /**
     * 从数组构建堆（Floyd建堆算法）
     *
     * 核心思想：
     * 从最后一个非叶子节点开始，对每个节点进行下滤操作
     * 由于叶子节点天然满足堆性质，只需处理内部节点
     * 时间复杂度为O(n)，优于逐个插入的O(n log n)
     *
     * @param {number[]} array - 输入数组
     * @time O(n) 比逐个插入更高效
     * @space O(1) 原地构建
     */
    buildHeap(array) {
        this.heap = [...array];
        const lastNonLeafIndex = Math.floor(this.heap.length / 2) - 1;

        // 从最后一个非叶子节点开始，向上处理每个节点
        for (let i = lastNonLeafIndex; i >= 0; i--) {
            this.heapifyDown(i);
        }
    }

    /**
     * 堆排序：对数组进行原地排序
     *
     * 核心思想：
     * 1. 构建最大堆
     * 2. 反复提取最大值放到数组末尾
     * 3. 缩小堆的范围并重新堆化
     *
     * @param {number[]} array - 要排序的数组
     * @returns {number[]} 排序后的数组
     * @time O(n log n) 稳定的时间复杂度
     * @space O(1) 原地排序
     */
    static heapSort(array) {
        const heap = new MaxHeap();
        heap.buildHeap(array);

        const result = [...heap.heap];
        const n = result.length;

        // 依次提取最大值并排序
        for (let i = n - 1; i > 0; i--) {
            // 将当前最大值（堆顶）移到正确位置
            [result[0], result[i]] = [result[i], result[0]];

            // 缩小堆的范围并重新堆化
            heap.heap = result.slice(0, i);
            heap.heapifyDown(0);
        }

        return result;
    }

    /**
     * 获取第K大元素
     *
     * 核心思想：
     * 使用最小堆维护当前最大的K个元素
     * 堆顶始终是第K大元素
     *
     * @param {number[]} nums - 输入数组
     * @param {number} k - 要查找第几大的元素
     * @returns {number} 第K大元素
     */
    static findKthLargest(nums, k) {
        const minHeap = new MinHeap();

        for (const num of nums) {
            minHeap.insert(num);
            if (minHeap.size() > k) {
                minHeap.extractMin();
            }
        }

        return minHeap.peek();
    }

    /**
     * 转换为数组表示
     * @returns {number[]} 堆的数组表示
     */
    toArray() {
        return [...this.heap];
    }

    /**
     * 打印堆的树形结构
     */
    printTree() {
        if (this.heap.length === 0) {
            console.log("空堆");
            return;
        }

        const levels = Math.floor(Math.log2(this.heap.length)) + 1;
        let index = 0;

        for (let level = 0; level < levels; level++) {
            const nodesInLevel = Math.pow(2, level);
            const levelNodes = [];

            for (let i = 0; i < nodesInLevel && index < this.heap.length; i++) {
                levelNodes.push(this.heap[index++]);
            }

            const spacing = ' '.repeat(Math.pow(2, levels - level - 1) - 1);
            const between = ' '.repeat(Math.pow(2, levels - level) - 1);

            console.log(spacing + levelNodes.join(between));
        }
    }
}

// ======================= 最小堆实现 =======================

/**
 * 最小堆类
 *
 * 核心思想：
 * 最小堆是一个完全二叉树，其中每个父节点的值都小于或等于其子节点的值
 * 实现方式与最大堆类似，只是比较逻辑相反
 */
class MinHeap {
    constructor() {
        this.heap = [];
    }

    getParentIndex(index) { return Math.floor((index - 1) / 2); }
    getLeftChildIndex(index) { return 2 * index + 1; }
    getRightChildIndex(index) { return 2 * index + 2; }
    hasParent(index) { return this.getParentIndex(index) >= 0; }
    hasLeftChild(index) { return this.getLeftChildIndex(index) < this.heap.length; }
    hasRightChild(index) { return this.getRightChildIndex(index) < this.heap.length; }
    parent(index) { return this.heap[this.getParentIndex(index)]; }
    leftChild(index) { return this.heap[this.getLeftChildIndex(index)]; }
    rightChild(index) { return this.heap[this.getRightChildIndex(index)]; }

    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    peek() {
        return this.heap.length === 0 ? null : this.heap[0];
    }

    size() {
        return this.heap.length;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    /**
     * 插入元素到最小堆
     */
    insert(item) {
        this.heap.push(item);
        this.heapifyUp(this.heap.length - 1);
    }

    /**
     * 删除并返回最小元素
     */
    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return min;
    }

    /**
     * 最小堆的上滤操作
     */
    heapifyUp(index) {
        while (this.hasParent(index) && this.parent(index) > this.heap[index]) {
            this.swap(this.getParentIndex(index), index);
            index = this.getParentIndex(index);
        }
    }

    /**
     * 最小堆的下滤操作
     */
    heapifyDown(index) {
        while (this.hasLeftChild(index)) {
            let smallerChildIndex = this.getLeftChildIndex(index);

            if (this.hasRightChild(index) &&
                this.rightChild(index) < this.leftChild(index)) {
                smallerChildIndex = this.getRightChildIndex(index);
            }

            if (this.heap[index] <= this.heap[smallerChildIndex]) {
                break;
            }

            this.swap(index, smallerChildIndex);
            index = smallerChildIndex;
        }
    }

    /**
     * 从数组构建最小堆
     */
    buildHeap(array) {
        this.heap = [...array];
        const lastNonLeafIndex = Math.floor(this.heap.length / 2) - 1;

        for (let i = lastNonLeafIndex; i >= 0; i--) {
            this.heapifyDown(i);
        }
    }

    toArray() {
        return [...this.heap];
    }
}

// ======================= 优先队列实现 =======================

/**
 * 优先队列类
 *
 * 核心思想：
 * 使用堆实现的队列，元素按优先级而非插入顺序出队
 * 支持自定义比较函数，可以实现最大优先队列或最小优先队列
 */
class PriorityQueue {
    constructor(compareFn = (a, b) => a.priority - b.priority) {
        this.heap = [];
        this.compare = compareFn;
    }

    /**
     * 获取父节点索引
     */
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    /**
     * 获取左子节点索引
     */
    getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    /**
     * 获取右子节点索引
     */
    getRightChildIndex(index) {
        return 2 * index + 2;
    }

    /**
     * 交换两个元素
     */
    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    /**
     * 查看队头元素
     */
    peek() {
        return this.heap.length === 0 ? null : this.heap[0];
    }

    /**
     * 获取队列大小
     */
    size() {
        return this.heap.length;
    }

    /**
     * 检查队列是否为空
     */
    isEmpty() {
        return this.heap.length === 0;
    }

    /**
     * 入队操作
     *
     * @param {*} element - 要入队的元素
     * @param {number} priority - 元素的优先级
     */
    enqueue(element, priority = 0) {
        const item = { element, priority };
        this.heap.push(item);
        this.heapifyUp(this.heap.length - 1);
    }

    /**
     * 出队操作
     *
     * @returns {*} 优先级最高的元素
     */
    dequeue() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop().element;

        const max = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return max.element;
    }

    /**
     * 上滤操作
     */
    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = this.getParentIndex(index);
            if (this.compare(this.heap[parentIndex], this.heap[index]) <= 0) {
                break;
            }
            this.swap(parentIndex, index);
            index = parentIndex;
        }
    }

    /**
     * 下滤操作
     */
    heapifyDown(index) {
        while (this.getLeftChildIndex(index) < this.heap.length) {
            let targetIndex = this.getLeftChildIndex(index);
            const rightChildIndex = this.getRightChildIndex(index);

            if (rightChildIndex < this.heap.length &&
                this.compare(this.heap[rightChildIndex], this.heap[targetIndex]) < 0) {
                targetIndex = rightChildIndex;
            }

            if (this.compare(this.heap[index], this.heap[targetIndex]) <= 0) {
                break;
            }

            this.swap(index, targetIndex);
            index = targetIndex;
        }
    }

    /**
     * 获取所有元素（按优先级排序）
     */
    getAllElements() {
        const result = [];
        const tempQueue = new PriorityQueue(this.compare);
        tempQueue.heap = [...this.heap];

        while (!tempQueue.isEmpty()) {
            result.push(tempQueue.dequeue());
        }

        return result;
    }
}

// ======================= 实际应用场景示例 =======================

/**
 * 任务调度系统
 *
 * 应用场景：操作系统的任务调度、网络包调度等
 */
class TaskScheduler {
    constructor() {
        // 高优先级任务优先执行
        this.taskQueue = new PriorityQueue((a, b) => b.priority - a.priority);
    }

    /**
     * 添加任务
     */
    addTask(taskName, priority, estimatedTime) {
        this.taskQueue.enqueue({
            name: taskName,
            estimatedTime,
            addTime: Date.now()
        }, priority);
    }

    /**
     * 执行下一个任务
     */
    executeNextTask() {
        const task = this.taskQueue.dequeue();
        if (task) {
            console.log(`执行任务: ${task.name} (优先级: ${task.priority}, 预计时间: ${task.estimatedTime}ms)`);
            return task;
        }
        return null;
    }

    /**
     * 获取待执行任务列表
     */
    getPendingTasks() {
        return this.taskQueue.getAllElements();
    }
}

/**
 * 数据流中位数维护
 *
 * 应用场景：实时数据分析、流媒体处理等
 */
class MedianFinder {
    constructor() {
        this.maxHeap = new MaxHeap(); // 存储较小的一半数据
        this.minHeap = new MinHeap(); // 存储较大的一半数据
    }

    /**
     * 添加数字到数据流
     *
     * 核心思想：
     * 维护两个堆的平衡，使得：
     * 1. maxHeap的大小等于minHeap的大小，或者比minHeap大1
     * 2. maxHeap的所有元素都小于等于minHeap的所有元素
     */
    addNum(num) {
        // 先加入maxHeap
        this.maxHeap.insert(num);

        // 将maxHeap的最大值移到minHeap，保证堆的有序性
        this.minHeap.insert(this.maxHeap.extractMax());

        // 保持maxHeap的大小不小于minHeap
        if (this.maxHeap.size() < this.minHeap.size()) {
            this.maxHeap.insert(this.minHeap.extractMin());
        }
    }

    /**
     * 获取当前中位数
     */
    findMedian() {
        if (this.maxHeap.size() > this.minHeap.size()) {
            return this.maxHeap.peek();
        }
        return (this.maxHeap.peek() + this.minHeap.peek()) / 2;
    }

    /**
     * 获取数据流的统计信息
     */
    getStats() {
        return {
            totalCount: this.maxHeap.size() + this.minHeap.size(),
            median: this.findMedian(),
            min: this.minHeap.isEmpty() ? this.maxHeap.peek() : Math.min(this.maxHeap.peek(), this.minHeap.peek()),
            max: this.maxHeap.isEmpty() ? this.minHeap.peek() : Math.max(this.maxHeap.peek(), this.minHeap.peek())
        };
    }
}

// ======================= 测试用例 =======================

/**
 * 运行所有测试
 */
function runTests() {
    console.log("========== 第7章：堆和优先队列基础实现测试 ==========\n");

    // 测试最大堆
    testMaxHeap();

    // 测试最小堆
    testMinHeap();

    // 测试优先队列
    testPriorityQueue();

    // 测试堆排序
    testHeapSort();

    // 测试第K大元素
    testKthLargest();

    // 测试任务调度系统
    testTaskScheduler();

    // 测试中位数查找
    testMedianFinder();

    // 性能测试
    performanceTest();
}

/**
 * 测试最大堆
 */
function testMaxHeap() {
    console.log("=== 最大堆测试 ===");

    const maxHeap = new MaxHeap();
    const testData = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7];

    console.log("1. 逐个插入元素:");
    testData.forEach(num => {
        maxHeap.insert(num);
        console.log(`插入 ${num}，当前堆顶: ${maxHeap.peek()}`);
    });

    console.log("\n2. 堆的数组表示:", maxHeap.toArray());
    console.log("堆的树形结构:");
    maxHeap.printTree();

    console.log("\n3. 依次提取最大值:");
    while (!maxHeap.isEmpty()) {
        console.log(`提取: ${maxHeap.extractMax()}`);
    }

    console.log("\n4. Floyd建堆测试:");
    const heap2 = new MaxHeap();
    heap2.buildHeap(testData);
    console.log("建堆后的数组:", heap2.toArray());
    console.log("堆顶元素:", heap2.peek());

    console.log();
}

/**
 * 测试最小堆
 */
function testMinHeap() {
    console.log("=== 最小堆测试 ===");

    const minHeap = new MinHeap();
    const testData = [4, 1, 3, 2, 16, 9, 10, 14, 8, 7];

    console.log("构建最小堆:");
    minHeap.buildHeap(testData);
    console.log("建堆后的数组:", minHeap.toArray());
    console.log("堆顶元素（最小值）:", minHeap.peek());

    console.log("\n依次提取最小值:");
    const sorted = [];
    while (!minHeap.isEmpty()) {
        sorted.push(minHeap.extractMin());
    }
    console.log("排序结果:", sorted);

    console.log();
}

/**
 * 测试优先队列
 */
function testPriorityQueue() {
    console.log("=== 优先队列测试 ===");

    // 最大优先队列
    const maxPQ = new PriorityQueue((a, b) => b.priority - a.priority);

    console.log("1. 任务优先级测试:");
    maxPQ.enqueue("低优先级任务", 1);
    maxPQ.enqueue("高优先级任务", 5);
    maxPQ.enqueue("中优先级任务", 3);
    maxPQ.enqueue("紧急任务", 10);

    console.log("按优先级出队:");
    while (!maxPQ.isEmpty()) {
        const task = maxPQ.dequeue();
        console.log(`执行: ${task}`);
    }

    // 最小优先队列
    console.log("\n2. 数值优先级测试（最小优先队列）:");
    const minPQ = new PriorityQueue((a, b) => a.priority - b.priority);

    [5, 2, 8, 1, 9, 3].forEach(num => {
        minPQ.enqueue(`任务${num}`, num);
    });

    console.log("按最小优先级出队:");
    while (!minPQ.isEmpty()) {
        const task = minPQ.dequeue();
        console.log(`执行: ${task}`);
    }

    console.log();
}

/**
 * 测试堆排序
 */
function testHeapSort() {
    console.log("=== 堆排序测试 ===");

    const testArrays = [
        [4, 1, 3, 2, 16, 9, 10, 14, 8, 7],
        [5, 2, 8, 1, 9],
        [1],
        [],
        [3, 3, 3, 3]
    ];

    testArrays.forEach((arr, index) => {
        const original = [...arr];
        const sorted = MaxHeap.heapSort(arr);
        console.log(`测试${index + 1}: [${original.join(', ')}] => [${sorted.join(', ')}]`);
    });

    console.log();
}

/**
 * 测试第K大元素
 */
function testKthLargest() {
    console.log("=== 第K大元素测试 ===");

    const nums = [3, 2, 1, 5, 6, 4];
    console.log("数组:", nums);

    for (let k = 1; k <= nums.length; k++) {
        const kthLargest = MaxHeap.findKthLargest(nums, k);
        console.log(`第${k}大元素: ${kthLargest}`);
    }

    console.log();
}

/**
 * 测试任务调度系统
 */
function testTaskScheduler() {
    console.log("=== 任务调度系统测试 ===");

    const scheduler = new TaskScheduler();

    // 添加不同优先级的任务
    scheduler.addTask("系统备份", 2, 5000);
    scheduler.addTask("用户登录验证", 8, 100);
    scheduler.addTask("数据分析", 3, 3000);
    scheduler.addTask("紧急安全扫描", 10, 2000);
    scheduler.addTask("日志清理", 1, 1000);

    console.log("任务执行顺序:");
    while (scheduler.taskQueue.size() > 0) {
        scheduler.executeNextTask();
    }

    console.log();
}

/**
 * 测试中位数查找
 */
function testMedianFinder() {
    console.log("=== 数据流中位数测试 ===");

    const medianFinder = new MedianFinder();
    const dataStream = [1, 2, 3, 4, 5];

    console.log("数据流处理过程:");
    dataStream.forEach(num => {
        medianFinder.addNum(num);
        console.log(`添加 ${num}，当前中位数: ${medianFinder.findMedian()}`);
    });

    console.log("\n最终统计信息:", medianFinder.getStats());

    console.log();
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("=== 性能测试 ===");

    const testSizes = [1000, 5000, 10000];

    testSizes.forEach(size => {
        console.log(`\n测试规模: ${size} 个元素`);

        // 生成随机数据
        const data = Array.from({ length: size }, () => Math.floor(Math.random() * size));

        // 测试建堆性能
        const start1 = performance.now();
        const heap = new MaxHeap();
        heap.buildHeap(data);
        const buildTime = performance.now() - start1;

        // 测试插入性能
        const start2 = performance.now();
        const heap2 = new MaxHeap();
        data.forEach(num => heap2.insert(num));
        const insertTime = performance.now() - start2;

        // 测试堆排序性能
        const start3 = performance.now();
        MaxHeap.heapSort([...data]);
        const sortTime = performance.now() - start3;

        console.log(`Floyd建堆: ${buildTime.toFixed(2)}ms`);
        console.log(`逐个插入: ${insertTime.toFixed(2)}ms`);
        console.log(`堆排序: ${sortTime.toFixed(2)}ms`);
        console.log(`建堆效率提升: ${(insertTime / buildTime).toFixed(2)}x`);
    });

    console.log();
}

// 执行测试
runTests();