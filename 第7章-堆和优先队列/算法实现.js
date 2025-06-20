/**
 * 第7章：堆和优先队列 - 算法实现
 *
 * 包含内容：
 * 1. 高级堆算法实现
 * 2. Top-K问题解决方案
 * 3. 堆的优化技术和变种
 * 4. 优先队列的实际应用算法
 * 5. 复杂堆问题的解决方案
 * 6. 完整的测试用例和性能分析
 *
 * 核心算法思想：
 * - 堆在解决Top-K问题中的优势
 * - 多路归并的堆优化
 * - 动态维护数据流统计信息
 * - 堆在图算法中的应用
 */

// ======================= 工具类和辅助函数 =======================

/**
 * 最小堆实现（用于算法中）
 */
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

/**
 * 最大堆实现（用于算法中）
 */
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

// ======================= Top-K 问题算法 =======================

/**
 * 寻找数组中的第K大元素
 *
 * 核心思想：
 * 使用最小堆维护当前最大的K个元素
 * 堆的大小保持为K，堆顶就是第K大元素
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 第几大
 * @returns {number} 第K大元素
 * @time O(n log k) 其中n为数组长度
 * @space O(k) 堆的空间
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
 * 寻找数组中最小的K个数
 *
 * 核心思想：
 * 使用最大堆维护当前最小的K个元素
 * 当堆大小超过K时，移除堆顶（当前最大值）
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 需要的最小元素个数
 * @returns {number[]} 最小的K个数
 * @time O(n log k)
 * @space O(k)
 */
function getLeastNumbers(nums, k) {
    if (k >= nums.length) return nums;
    if (k === 0) return [];

    const maxHeap = new MaxHeap();

    for (const num of nums) {
        maxHeap.insert(num);
        if (maxHeap.size() > k) {
            maxHeap.extractMax();
        }
    }

    return maxHeap.heap.slice();
}

/**
 * 前K个高频元素
 *
 * 核心思想：
 * 1. 统计每个元素的频率
 * 2. 使用最小堆按频率排序，维护前K个高频元素
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 前K个
 * @returns {number[]} 前K个高频元素
 * @time O(n log k)
 * @space O(n)
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
        if (minHeap.size() > k) {
            minHeap.extractMin();
        }
    }

    return minHeap.heap.map(item => item.num);
}

/**
 * 最接近原点的K个点
 *
 * 核心思想：
 * 计算每个点到原点的距离，使用最大堆维护最近的K个点
 *
 * @param {number[][]} points - 点的坐标数组
 * @param {number} k - 需要的点数
 * @returns {number[][]} 最接近原点的K个点
 * @time O(n log k)
 * @space O(k)
 */
function kClosest(points, k) {
    const maxHeap = new MaxHeap((a, b) => a.dist - b.dist);

    for (const point of points) {
        const dist = point[0] * point[0] + point[1] * point[1];
        maxHeap.insert({ point, dist });

        if (maxHeap.size() > k) {
            maxHeap.extractMax();
        }
    }

    return maxHeap.heap.map(item => item.point);
}

// ======================= 数据流处理算法 =======================

/**
 * 数据流中的中位数
 *
 * 核心思想：
 * 使用两个堆来维护数据：
 * - 最大堆：存储较小的一半数据
 * - 最小堆：存储较大的一半数据
 * 保持两个堆的大小平衡，中位数就在堆顶
 */
class MedianFinder {
    constructor() {
        this.maxHeap = new MaxHeap(); // 存储较小的一半
        this.minHeap = new MinHeap(); // 存储较大的一半
    }

    /**
     * 添加数字到数据流
     * @param {number} num
     */
    addNum(num) {
        // 总是先添加到maxHeap
        this.maxHeap.insert(num);

        // 将maxHeap的最大值移到minHeap（保证分割正确）
        this.minHeap.insert(this.maxHeap.extractMax());

        // 保持maxHeap的大小 >= minHeap的大小
        if (this.maxHeap.size() < this.minHeap.size()) {
            this.maxHeap.insert(this.minHeap.extractMin());
        }
    }

    /**
     * 找到当前中位数
     * @returns {number}
     */
    findMedian() {
        if (this.maxHeap.size() > this.minHeap.size()) {
            return this.maxHeap.peek();
        }
        return (this.maxHeap.peek() + this.minHeap.peek()) / 2;
    }
}

/**
 * 滑动窗口中位数
 *
 * 核心思想：
 * 在滑动窗口的基础上维护中位数
 * 需要支持删除指定元素的操作
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 窗口大小
 * @returns {number[]} 每个窗口的中位数
 * @time O(n log k)
 * @space O(k)
 */
function medianSlidingWindow(nums, k) {
    const result = [];

    // 使用平衡的两个堆
    const maxHeap = new MaxHeap();
    const minHeap = new MinHeap();

    // 删除元素的辅助方法
    const removeElement = (heap, val) => {
        const index = heap.heap.indexOf(val);
        if (index !== -1) {
            heap.heap[index] = heap.heap[heap.heap.length - 1];
            heap.heap.pop();
            if (index < heap.heap.length) {
                heap.heapifyUp(index);
                heap.heapifyDown(index);
            }
        }
    };

    // 平衡两个堆
    const balance = () => {
        if (maxHeap.size() > minHeap.size() + 1) {
            minHeap.insert(maxHeap.extractMax());
        } else if (minHeap.size() > maxHeap.size() + 1) {
            maxHeap.insert(minHeap.extractMin());
        }
    };

    // 获取中位数
    const getMedian = () => {
        if (k % 2 === 1) {
            return maxHeap.size() > minHeap.size() ? maxHeap.peek() : minHeap.peek();
        }
        return (maxHeap.peek() + minHeap.peek()) / 2;
    };

    // 处理滑动窗口
    for (let i = 0; i < nums.length; i++) {
        // 添加新元素
        if (maxHeap.isEmpty() || nums[i] <= maxHeap.peek()) {
            maxHeap.insert(nums[i]);
        } else {
            minHeap.insert(nums[i]);
        }

        // 移除窗口外的元素
        if (i >= k) {
            const toRemove = nums[i - k];
            if (toRemove <= maxHeap.peek()) {
                removeElement(maxHeap, toRemove);
            } else {
                removeElement(minHeap, toRemove);
            }
        }

        balance();

        // 窗口大小达到k时，记录中位数
        if (i >= k - 1) {
            result.push(getMedian());
        }
    }

    return result;
}

// ======================= 多路归并算法 =======================

/**
 * 合并K个排序链表
 *
 * 核心思想：
 * 使用最小堆维护K个链表的当前最小节点
 * 每次提取最小节点，并将其下一个节点加入堆
 *
 * @param {ListNode[]} lists - K个排序链表
 * @returns {ListNode} 合并后的链表头
 * @time O(n log k) 其中n是所有节点总数
 * @space O(k)
 */
function mergeKLists(lists) {
    if (!lists || lists.length === 0) return null;

    const minHeap = new MinHeap((a, b) => a.val - b.val);

    // 将每个链表的第一个节点加入堆
    for (const head of lists) {
        if (head) {
            minHeap.insert(head);
        }
    }

    const dummy = new ListNode(0);
    let current = dummy;

    while (!minHeap.isEmpty()) {
        const node = minHeap.extractMin();
        current.next = node;
        current = current.next;

        // 如果该节点有下一个节点，加入堆
        if (node.next) {
            minHeap.insert(node.next);
        }
    }

    return dummy.next;
}

/**
 * 合并K个排序数组
 *
 * 核心思想：
 * 类似合并K个链表，使用堆维护每个数组的当前最小元素
 *
 * @param {number[][]} arrays - K个排序数组
 * @returns {number[]} 合并后的排序数组
 * @time O(n log k)
 * @space O(k)
 */
function mergeKSortedArrays(arrays) {
    const result = [];
    const minHeap = new MinHeap((a, b) => a.val - b.val);

    // 初始化堆，加入每个数组的第一个元素
    for (let i = 0; i < arrays.length; i++) {
        if (arrays[i].length > 0) {
            minHeap.insert({
                val: arrays[i][0],
                arrayIndex: i,
                elementIndex: 0
            });
        }
    }

    while (!minHeap.isEmpty()) {
        const { val, arrayIndex, elementIndex } = minHeap.extractMin();
        result.push(val);

        // 如果当前数组还有下一个元素，加入堆
        if (elementIndex + 1 < arrays[arrayIndex].length) {
            minHeap.insert({
                val: arrays[arrayIndex][elementIndex + 1],
                arrayIndex,
                elementIndex: elementIndex + 1
            });
        }
    }

    return result;
}

// ======================= 链表节点定义 =======================
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

// ======================= 图算法中的堆应用 =======================

/**
 * Dijkstra最短路径算法
 *
 * 核心思想：
 * 使用最小堆优化选择下一个处理的顶点
 * 每次选择距离源点最近的未处理顶点
 *
 * @param {number[][]} graph - 邻接矩阵表示的图
 * @param {number} start - 起始顶点
 * @returns {number[]} 从起始顶点到各顶点的最短距离
 * @time O((V + E) log V) 使用堆优化
 * @space O(V)
 */
function dijkstra(graph, start) {
    const n = graph.length;
    const dist = new Array(n).fill(Infinity);
    const visited = new Array(n).fill(false);
    const minHeap = new MinHeap((a, b) => a.dist - b.dist);

    dist[start] = 0;
    minHeap.insert({ vertex: start, dist: 0 });

    while (!minHeap.isEmpty()) {
        const { vertex: u } = minHeap.extractMin();

        if (visited[u]) continue;
        visited[u] = true;

        // 更新邻接顶点的距离
        for (let v = 0; v < n; v++) {
            if (!visited[v] && graph[u][v] !== 0) {
                const newDist = dist[u] + graph[u][v];
                if (newDist < dist[v]) {
                    dist[v] = newDist;
                    minHeap.insert({ vertex: v, dist: newDist });
                }
            }
        }
    }

    return dist;
}

/**
 * Prim最小生成树算法
 *
 * 核心思想：
 * 使用最小堆选择权重最小的边
 * 逐步构建最小生成树
 *
 * @param {number[][]} graph - 邻接矩阵
 * @returns {Array} 最小生成树的边和总权重
 * @time O(E log V)
 * @space O(V)
 */
function primMST(graph) {
    const n = graph.length;
    const visited = new Array(n).fill(false);
    const minHeap = new MinHeap((a, b) => a.weight - b.weight);
    const mst = [];
    let totalWeight = 0;

    // 从顶点0开始
    visited[0] = true;

    // 将顶点0的所有边加入堆
    for (let i = 1; i < n; i++) {
        if (graph[0][i] !== 0) {
            minHeap.insert({ from: 0, to: i, weight: graph[0][i] });
        }
    }

    while (!minHeap.isEmpty() && mst.length < n - 1) {
        const { from, to, weight } = minHeap.extractMin();

        // 如果目标顶点已经在MST中，跳过
        if (visited[to]) continue;

        // 添加边到MST
        visited[to] = true;
        mst.push({ from, to, weight });
        totalWeight += weight;

        // 将新顶点的所有边加入堆
        for (let i = 0; i < n; i++) {
            if (!visited[i] && graph[to][i] !== 0) {
                minHeap.insert({ from: to, to: i, weight: graph[to][i] });
            }
        }
    }

    return { edges: mst, totalWeight };
}

// ======================= 堆的高级优化技术 =======================

/**
 * 可删除元素的堆
 *
 * 核心思想：
 * 支持删除堆中任意元素的操作
 * 使用延迟删除和标记清理的策略
 */
class DeletableHeap {
    constructor(compareFn = (a, b) => a - b) {
        this.heap = [];
        this.compare = compareFn;
        this.deleted = new Set(); // 标记删除的元素
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

    /**
     * 删除指定元素（延迟删除）
     */
    delete(val) {
        this.deleted.add(val);
    }

    /**
     * 获取堆顶元素（跳过已删除的元素）
     */
    peek() {
        this.cleanTop();
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    /**
     * 提取堆顶元素
     */
    extract() {
        this.cleanTop();
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const top = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return top;
    }

    /**
     * 清理堆顶的已删除元素
     */
    cleanTop() {
        while (this.heap.length > 0 && this.deleted.has(this.heap[0])) {
            this.deleted.delete(this.heap[0]);
            if (this.heap.length === 1) {
                this.heap.pop();
            } else {
                this.heap[0] = this.heap.pop();
                this.heapifyDown(0);
            }
        }
    }

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
            let targetIndex = this.left(index);
            if (this.right(index) < this.heap.length &&
                this.compare(this.heap[this.right(index)], this.heap[targetIndex]) < 0) {
                targetIndex = this.right(index);
            }
            if (this.compare(this.heap[index], this.heap[targetIndex]) <= 0) break;
            this.swap(index, targetIndex);
            index = targetIndex;
        }
    }

    size() {
        return this.heap.length - this.deleted.size;
    }

    isEmpty() {
        return this.size() === 0;
    }
}

/**
 * 支持更新优先级的堆
 */
class UpdatableHeap {
    constructor(compareFn = (a, b) => a.priority - b.priority) {
        this.heap = [];
        this.compare = compareFn;
        this.indexMap = new Map(); // 元素到索引的映射
    }

    parent(i) { return Math.floor((i - 1) / 2); }
    left(i) { return 2 * i + 1; }
    right(i) { return 2 * i + 2; }

    swap(i, j) {
        // 更新索引映射
        this.indexMap.set(this.heap[i].id, j);
        this.indexMap.set(this.heap[j].id, i);
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    insert(item) {
        const index = this.heap.length;
        this.heap.push(item);
        this.indexMap.set(item.id, index);
        this.heapifyUp(index);
    }

    /**
     * 更新元素的优先级
     */
    updatePriority(id, newPriority) {
        const index = this.indexMap.get(id);
        if (index === undefined) return false;

        const oldPriority = this.heap[index].priority;
        this.heap[index].priority = newPriority;

        if (newPriority < oldPriority) {
            this.heapifyUp(index);
        } else {
            this.heapifyDown(index);
        }
        return true;
    }

    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) {
            const item = this.heap.pop();
            this.indexMap.delete(item.id);
            return item;
        }

        const min = this.heap[0];
        const last = this.heap.pop();
        this.heap[0] = last;
        this.indexMap.set(last.id, 0);
        this.indexMap.delete(min.id);
        this.heapifyDown(0);
        return min;
    }

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

    peek() { return this.heap.length > 0 ? this.heap[0] : null; }
    size() { return this.heap.length; }
    isEmpty() { return this.heap.length === 0; }
}

// ======================= 复杂应用算法 =======================

/**
 * 会议室调度问题
 *
 * 核心思想：
 * 使用最小堆跟踪每个会议室的结束时间
 * 按会议开始时间排序，贪心分配会议室
 *
 * @param {number[][]} intervals - 会议时间区间
 * @returns {number} 所需的最少会议室数量
 * @time O(n log n)
 * @space O(n)
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

        // 分配会议室
        minHeap.insert(end);
    }

    return minHeap.size();
}

/**
 * 任务调度器
 *
 * 核心思想：
 * 使用最大堆维护任务频率，优先执行频率高的任务
 * 考虑冷却时间的约束
 *
 * @param {character[]} tasks - 任务数组
 * @param {number} n - 冷却时间
 * @returns {number} 完成所有任务的最少时间
 * @time O(m log m) m为不同任务数
 * @space O(m)
 */
function leastInterval(tasks, n) {
    // 统计任务频率
    const freqMap = new Map();
    for (const task of tasks) {
        freqMap.set(task, (freqMap.get(task) || 0) + 1);
    }

    // 最大堆按频率排序
    const maxHeap = new MaxHeap((a, b) => a - b);
    for (const freq of freqMap.values()) {
        maxHeap.insert(freq);
    }

    let time = 0;

    while (!maxHeap.isEmpty()) {
        const temp = [];

        // 执行一个冷却周期
        for (let i = 0; i <= n; i++) {
            if (!maxHeap.isEmpty()) {
                const freq = maxHeap.extractMax();
                if (freq > 1) {
                    temp.push(freq - 1);
                }
            }
            time++;

            // 如果所有任务都完成了
            if (maxHeap.isEmpty() && temp.length === 0) {
                break;
            }
        }

        // 将剩余任务重新加入堆
        for (const freq of temp) {
            maxHeap.insert(freq);
        }
    }

    return time;
}

/**
 * 数据流中的第K大元素
 *
 * 核心思想：
 * 维护一个大小为K的最小堆
 * 堆顶始终是第K大元素
 */
class KthLargest {
    constructor(k, nums) {
        this.k = k;
        this.minHeap = new MinHeap();

        // 初始化堆
        for (const num of nums) {
            this.add(num);
        }
    }

    add(val) {
        this.minHeap.insert(val);
        if (this.minHeap.size() > this.k) {
            this.minHeap.extractMin();
        }
        return this.minHeap.peek();
    }
}

// ======================= 测试用例 =======================

/**
 * 运行所有测试
 */
function runAllTests() {
    console.log("========== 第7章：堆和优先队列算法实现测试 ==========\n");

    testTopKAlgorithms();
    testDataStreamAlgorithms();
    testMultiWayMerge();
    testGraphAlgorithms();
    testAdvancedHeapFeatures();
    testComplexApplications();
    performanceComparison();
}

/**
 * 测试Top-K算法
 */
function testTopKAlgorithms() {
    console.log("=== Top-K算法测试 ===");

    const nums = [3, 2, 1, 5, 6, 4];
    console.log("数组:", nums);

    // 测试第K大元素
    for (let k = 1; k <= 3; k++) {
        console.log(`第${k}大元素: ${findKthLargest(nums, k)}`);
    }

    // 测试最小K个数
    console.log("最小的3个数:", getLeastNumbers(nums, 3));

    // 测试前K个高频元素
    const freqNums = [1, 1, 1, 2, 2, 3];
    console.log("数组:", freqNums);
    console.log("前2个高频元素:", topKFrequent(freqNums, 2));

    // 测试最接近原点的K个点
    const points = [[1, 1], [2, 2], [3, 3], [0, 1]];
    console.log("点集:", points);
    console.log("最接近原点的2个点:", kClosest(points, 2));

    console.log();
}

/**
 * 测试数据流算法
 */
function testDataStreamAlgorithms() {
    console.log("=== 数据流算法测试 ===");

    // 测试中位数查找
    const medianFinder = new MedianFinder();
    const stream = [1, 2, 3, 4, 5];

    console.log("数据流中位数测试:");
    stream.forEach(num => {
        medianFinder.addNum(num);
        console.log(`添加 ${num}，中位数: ${medianFinder.findMedian()}`);
    });

    // 测试滑动窗口中位数
    const windowNums = [1, 3, -1, -3, 5, 3, 6, 7];
    const k = 3;
    console.log(`\n滑动窗口中位数 (k=${k}):`);
    console.log("数组:", windowNums);
    console.log("中位数:", medianSlidingWindow(windowNums, k));

    // 测试第K大元素类
    const kthLargest = new KthLargest(3, [4, 5, 8, 2]);
    console.log("\n数据流第K大元素测试:");
    [3, 5, 10, 9, 4].forEach(val => {
        console.log(`添加 ${val}，第3大元素: ${kthLargest.add(val)}`);
    });

    console.log();
}

/**
 * 测试多路归并算法
 */
function testMultiWayMerge() {
    console.log("=== 多路归并算法测试 ===");

    // 测试合并K个排序数组
    const arrays = [
        [1, 4, 5],
        [1, 3, 4],
        [2, 6]
    ];
    console.log("K个排序数组:", arrays);
    console.log("合并结果:", mergeKSortedArrays(arrays));

    // 测试合并K个排序链表
    const createList = (arr) => {
        if (arr.length === 0) return null;
        const head = new ListNode(arr[0]);
        let current = head;
        for (let i = 1; i < arr.length; i++) {
            current.next = new ListNode(arr[i]);
            current = current.next;
        }
        return head;
    };

    const listToArray = (head) => {
        const result = [];
        while (head) {
            result.push(head.val);
            head = head.next;
        }
        return result;
    };

    const lists = arrays.map(createList);
    const merged = mergeKLists(lists);
    console.log("合并K个链表结果:", listToArray(merged));

    console.log();
}

/**
 * 测试图算法
 */
function testGraphAlgorithms() {
    console.log("=== 图算法测试 ===");

    // 测试Dijkstra算法
    const graph = [
        [0, 4, 0, 0, 0, 0, 0, 8, 0],
        [4, 0, 8, 0, 0, 0, 0, 11, 0],
        [0, 8, 0, 7, 0, 4, 0, 0, 2],
        [0, 0, 7, 0, 9, 14, 0, 0, 0],
        [0, 0, 0, 9, 0, 10, 0, 0, 0],
        [0, 0, 4, 14, 10, 0, 2, 0, 0],
        [0, 0, 0, 0, 0, 2, 0, 1, 6],
        [8, 11, 0, 0, 0, 0, 1, 0, 7],
        [0, 0, 2, 0, 0, 0, 6, 7, 0]
    ];

    console.log("Dijkstra最短路径 (从顶点0开始):");
    const distances = dijkstra(graph, 0);
    distances.forEach((dist, i) => {
        console.log(`到顶点${i}的距离: ${dist === Infinity ? '∞' : dist}`);
    });

    // 测试Prim最小生成树
    console.log("\nPrim最小生成树:");
    const mst = primMST(graph);
    console.log("MST边:", mst.edges);
    console.log("总权重:", mst.totalWeight);

    console.log();
}

/**
 * 测试高级堆特性
 */
function testAdvancedHeapFeatures() {
    console.log("=== 高级堆特性测试 ===");

    // 测试可删除堆
    const deletableHeap = new DeletableHeap();
    [1, 3, 6, 5, 2, 4].forEach(val => deletableHeap.insert(val));

    console.log("可删除堆测试:");
    console.log("插入 [1,3,6,5,2,4]");
    console.log("堆顶:", deletableHeap.peek());

    deletableHeap.delete(1);
    console.log("删除 1，新堆顶:", deletableHeap.peek());

    deletableHeap.delete(2);
    console.log("删除 2，新堆顶:", deletableHeap.peek());

    // 测试可更新优先级的堆
    console.log("\n可更新优先级堆测试:");
    const updatableHeap = new UpdatableHeap();
    updatableHeap.insert({ id: 'A', priority: 3 });
    updatableHeap.insert({ id: 'B', priority: 1 });
    updatableHeap.insert({ id: 'C', priority: 2 });

    console.log("插入元素 A(3), B(1), C(2)");
    console.log("堆顶:", updatableHeap.peek());

    updatableHeap.updatePriority('A', 0);
    console.log("更新A的优先级为0，新堆顶:", updatableHeap.peek());

    console.log();
}

/**
 * 测试复杂应用
 */
function testComplexApplications() {
    console.log("=== 复杂应用测试 ===");

    // 测试会议室调度
    const meetings = [[0, 30], [5, 10], [15, 20]];
    console.log("会议时间:", meetings);
    console.log("需要的会议室数:", minMeetingRooms(meetings));

    // 测试任务调度器
    const tasks = ['A', 'A', 'A', 'B', 'B', 'B'];
    const n = 2;
    console.log(`\n任务调度 (冷却时间${n}):`);
    console.log("任务:", tasks);
    console.log("最少时间:", leastInterval(tasks, n));

    console.log();
}

/**
 * 性能对比测试
 */
function performanceComparison() {
    console.log("=== 性能对比测试 ===");

    const sizes = [1000, 5000, 10000];

    sizes.forEach(size => {
        console.log(`\n测试规模: ${size}`);

        // 生成随机数据
        const data = Array.from({ length: size }, () => Math.floor(Math.random() * size));

        // 比较不同方法找第K大元素
        const k = Math.floor(size / 2);

        const start1 = performance.now();
        findKthLargest([...data], k);
        const heapTime = performance.now() - start1;

        const start2 = performance.now();
        [...data].sort((a, b) => b - a)[k - 1];
        const sortTime = performance.now() - start2;

        console.log(`堆方法 (第${k}大): ${heapTime.toFixed(2)}ms`);
        console.log(`排序方法 (第${k}大): ${sortTime.toFixed(2)}ms`);
        console.log(`堆方法效率: ${(sortTime / heapTime).toFixed(2)}x`);
    });

    console.log();
}

// 执行所有测试
runAllTests();