/**
 * 第14章 贪心算法 - 基础实现
 *
 * 本文件包含：
 * 1. 贪心算法基础框架
 * 2. 活动选择问题
 * 3. 分数背包问题
 * 4. 区间调度问题
 * 5. 哈夫曼编码
 * 6. 最小生成树算法
 *
 * 作者：数据结构与算法教程
 * 日期：2024年
 */

// ==================== 1. 贪心算法基础框架 ====================

/**
 * 贪心算法通用框架
 *
 * 核心思想：
 * 每一步都做出当前看起来最优的选择
 * 希望通过局部最优选择达到全局最优
 *
 * @param {Array} candidates - 候选集合
 * @param {Function} isValid - 判断选择是否有效
 * @param {Function} greedyChoice - 贪心选择函数
 * @param {Function} updateState - 更新状态函数
 * @returns {Array} 贪心选择结果
 */
function greedyTemplate(candidates, isValid, greedyChoice, updateState) {
    const result = [];
    let currentState = { /* 初始状态 */ };

    // 按贪心策略排序候选集合
    const sortedCandidates = [...candidates].sort(greedyChoice);

    for (let candidate of sortedCandidates) {
        // 检查当前选择是否有效
        if (isValid(candidate, currentState)) {
            result.push(candidate);
            currentState = updateState(currentState, candidate);
        }
    }

    return result;
}

/**
 * 贪心选择性质验证工具
 */
class GreedyAnalyzer {
    /**
     * 验证贪心选择性质
     * @param {Function} greedyStrategy - 贪心策略
     * @param {Array} testCases - 测试用例
     * @returns {Object} 验证结果
     */
    static verifyGreedyChoice(greedyStrategy, testCases) {
        const results = [];

        for (let testCase of testCases) {
            const greedyResult = greedyStrategy(testCase.input);
            const optimalResult = testCase.optimal;

            results.push({
                input: testCase.input,
                greedy: greedyResult,
                optimal: optimalResult,
                isOptimal: this.compareResults(greedyResult, optimalResult)
            });
        }

        return {
            passRate: results.filter(r => r.isOptimal).length / results.length,
            details: results
        };
    }

    /**
     * 比较两个结果是否相等
     */
    static compareResults(result1, result2) {
        // 简单的深度比较，实际应用中需要根据具体问题定制
        return JSON.stringify(result1) === JSON.stringify(result2);
    }
}

// ==================== 2. 活动选择问题 ====================

/**
 * 活动选择问题
 *
 * 核心思想：
 * 选择最多数量的互不重叠的活动
 * 贪心策略：按结束时间排序，优先选择结束时间最早的活动
 *
 * @param {Array} activities - 活动数组，每个活动包含{start, end, id}
 * @returns {Array} 选择的活动列表
 * @time O(n log n) 主要是排序的时间复杂度
 * @space O(n)
 */
function activitySelection(activities) {
    // 按结束时间排序（贪心策略）
    const sorted = [...activities].sort((a, b) => a.end - b.end);

    const selected = [];
    let lastEndTime = -Infinity;

    for (let activity of sorted) {
        // 如果当前活动的开始时间不晚于上一个活动的结束时间，选择该活动
        if (activity.start >= lastEndTime) {
            selected.push(activity);
            lastEndTime = activity.end;
        }
    }

    return selected;
}

/**
 * 活动选择问题的扩展版本：带权重的活动选择
 *
 * 核心思想：
 * 在不重叠的前提下，选择总权重最大的活动组合
 * 注意：这个问题贪心算法不一定得到最优解，需要动态规划
 *
 * @param {Array} activities - 带权重的活动数组 {start, end, weight, id}
 * @returns {Array} 选择的活动列表
 */
function weightedActivitySelection(activities) {
    // 按结束时间排序
    const sorted = [...activities].sort((a, b) => a.end - b.end);

    const n = sorted.length;
    const dp = new Array(n);
    const parent = new Array(n).fill(-1);

    // 动态规划求解
    dp[0] = sorted[0].weight;

    for (let i = 1; i < n; i++) {
        // 不选择当前活动
        dp[i] = dp[i - 1];

        // 选择当前活动
        let include = sorted[i].weight;
        let latestNonConflict = findLatestNonConflicting(sorted, i);

        if (latestNonConflict !== -1) {
            include += dp[latestNonConflict];
        }

        // 选择更优的方案
        if (include > dp[i]) {
            dp[i] = include;
            parent[i] = latestNonConflict;
        } else {
            parent[i] = i - 1;
        }
    }

    // 回溯构造解
    return constructSolution(sorted, parent, n - 1);
}

/**
 * 找到最晚的不冲突活动
 */
function findLatestNonConflicting(activities, index) {
    for (let i = index - 1; i >= 0; i--) {
        if (activities[i].end <= activities[index].start) {
            return i;
        }
    }
    return -1;
}

/**
 * 构造活动选择的解
 */
function constructSolution(activities, parent, index) {
    if (index === -1) return [];

    if (parent[index] === index - 1) {
        // 没有选择当前活动
        return constructSolution(activities, parent, index - 1);
    } else {
        // 选择了当前活动
        const result = constructSolution(activities, parent, parent[index]);
        result.push(activities[index]);
        return result;
    }
}

// ==================== 3. 分数背包问题 ====================

/**
 * 分数背包问题
 *
 * 核心思想：
 * 物品可以分割，按单位重量价值排序，优先选择性价比高的物品
 * 贪心策略：按价值密度（value/weight）降序排列
 *
 * @param {Array} items - 物品数组 {weight, value, id}
 * @param {number} capacity - 背包容量
 * @returns {Object} {maxValue, selectedItems}
 * @time O(n log n)
 * @space O(n)
 */
function fractionalKnapsack(items, capacity) {
    // 计算价值密度并排序
    const itemsWithDensity = items.map(item => ({
        ...item,
        density: item.value / item.weight
    }));

    // 按价值密度降序排序（贪心策略）
    itemsWithDensity.sort((a, b) => b.density - a.density);

    let totalValue = 0;
    let remainingCapacity = capacity;
    const selectedItems = [];

    for (let item of itemsWithDensity) {
        if (remainingCapacity === 0) break;

        if (item.weight <= remainingCapacity) {
            // 完全装入
            totalValue += item.value;
            remainingCapacity -= item.weight;
            selectedItems.push({
                ...item,
                fraction: 1,
                actualWeight: item.weight,
                actualValue: item.value
            });
        } else {
            // 部分装入
            const fraction = remainingCapacity / item.weight;
            const actualValue = item.value * fraction;
            totalValue += actualValue;

            selectedItems.push({
                ...item,
                fraction: fraction,
                actualWeight: remainingCapacity,
                actualValue: actualValue
            });

            remainingCapacity = 0;
        }
    }

    return {
        maxValue: totalValue,
        selectedItems: selectedItems
    };
}

/**
 * 分数背包问题的变种：多维约束
 *
 * @param {Array} items - 物品数组 {weight, volume, value, id}
 * @param {number} weightCapacity - 重量容量
 * @param {number} volumeCapacity - 体积容量
 * @returns {Object} 选择结果
 */
function multidimensionalFractionalKnapsack(items, weightCapacity, volumeCapacity) {
    // 多维约束下的价值密度计算（简化版本）
    const itemsWithDensity = items.map(item => ({
        ...item,
        density: item.value / Math.max(item.weight, item.volume)
    }));

    itemsWithDensity.sort((a, b) => b.density - a.density);

    let totalValue = 0;
    let remainingWeight = weightCapacity;
    let remainingVolume = volumeCapacity;
    const selectedItems = [];

    for (let item of itemsWithDensity) {
        if (remainingWeight === 0 || remainingVolume === 0) break;

        // 计算在两个约束下的最大可装入比例
        const weightFraction = item.weight <= remainingWeight ? 1 : remainingWeight / item.weight;
        const volumeFraction = item.volume <= remainingVolume ? 1 : remainingVolume / item.volume;
        const maxFraction = Math.min(weightFraction, volumeFraction);

        if (maxFraction > 0) {
            const actualWeight = item.weight * maxFraction;
            const actualVolume = item.volume * maxFraction;
            const actualValue = item.value * maxFraction;

            totalValue += actualValue;
            remainingWeight -= actualWeight;
            remainingVolume -= actualVolume;

            selectedItems.push({
                ...item,
                fraction: maxFraction,
                actualWeight,
                actualVolume,
                actualValue
            });
        }
    }

    return {
        maxValue: totalValue,
        selectedItems: selectedItems,
        remainingWeight,
        remainingVolume
    };
}

// ==================== 4. 区间调度问题 ====================

/**
 * 区间调度问题集合
 */
class IntervalScheduling {
    /**
     * 最少箭射气球问题
     *
     * 核心思想：
     * 找到最少的射击点，使得所有气球都被射爆
     * 贪心策略：按区间右端点排序，选择最右端的射击点
     *
     * @param {Array} intervals - 气球区间数组 [[start, end], ...]
     * @returns {number} 最少箭数
     */
    static findMinArrows(intervals) {
        if (intervals.length === 0) return 0;

        // 按右端点排序
        intervals.sort((a, b) => a[1] - b[1]);

        let arrows = 1;
        let lastArrowPos = intervals[0][1];

        for (let i = 1; i < intervals.length; i++) {
            // 如果当前气球的左端点大于上一支箭的位置，需要新的箭
            if (intervals[i][0] > lastArrowPos) {
                arrows++;
                lastArrowPos = intervals[i][1];
            }
        }

        return arrows;
    }

    /**
     * 无重叠区间问题
     *
     * 核心思想：
     * 移除最少的区间，使得剩余区间不重叠
     * 贪心策略：按右端点排序，保留尽可能多的不重叠区间
     *
     * @param {Array} intervals - 区间数组
     * @returns {number} 需要移除的区间数
     */
    static eraseOverlapIntervals(intervals) {
        if (intervals.length <= 1) return 0;

        // 按右端点排序
        intervals.sort((a, b) => a[1] - b[1]);

        let keep = 1; // 保留的区间数
        let lastEnd = intervals[0][1];

        for (let i = 1; i < intervals.length; i++) {
            // 如果当前区间与上一个保留的区间不重叠
            if (intervals[i][0] >= lastEnd) {
                keep++;
                lastEnd = intervals[i][1];
            }
        }

        return intervals.length - keep;
    }

    /**
     * 合并区间问题
     *
     * 核心思想：
     * 合并所有重叠的区间
     * 贪心策略：按左端点排序，依次合并重叠区间
     *
     * @param {Array} intervals - 区间数组
     * @returns {Array} 合并后的区间数组
     */
    static mergeIntervals(intervals) {
        if (intervals.length <= 1) return intervals;

        // 按左端点排序
        intervals.sort((a, b) => a[0] - b[0]);

        const merged = [intervals[0]];

        for (let i = 1; i < intervals.length; i++) {
            const current = intervals[i];
            const last = merged[merged.length - 1];

            // 如果当前区间与最后一个合并区间重叠
            if (current[0] <= last[1]) {
                // 合并区间，扩展右端点
                last[1] = Math.max(last[1], current[1]);
            } else {
                // 不重叠，添加新区间
                merged.push(current);
            }
        }

        return merged;
    }

    /**
     * 插入区间问题
     *
     * @param {Array} intervals - 已排序的不重叠区间数组
     * @param {Array} newInterval - 要插入的新区间
     * @returns {Array} 插入后的区间数组
     */
    static insertInterval(intervals, newInterval) {
        const result = [];
        let i = 0;

        // 添加所有在新区间左侧的区间
        while (i < intervals.length && intervals[i][1] < newInterval[0]) {
            result.push(intervals[i]);
            i++;
        }

        // 合并所有与新区间重叠的区间
        while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        result.push(newInterval);

        // 添加所有在新区间右侧的区间
        while (i < intervals.length) {
            result.push(intervals[i]);
            i++;
        }

        return result;
    }
}

// ==================== 5. 哈夫曼编码 ====================

/**
 * 哈夫曼树节点
 */
class HuffmanNode {
    constructor(char, freq, left = null, right = null) {
        this.char = char;
        this.freq = freq;
        this.left = left;
        this.right = right;
    }

    /**
     * 是否为叶子节点
     */
    isLeaf() {
        return this.left === null && this.right === null;
    }
}

/**
 * 最小堆实现（用于哈夫曼编码）
 */
class MinHeap {
    constructor() {
        this.heap = [];
    }

    /**
     * 插入元素
     */
    push(node) {
        this.heap.push(node);
        this.heapifyUp(this.heap.length - 1);
    }

    /**
     * 取出最小元素
     */
    pop() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return min;
    }

    /**
     * 向上调整
     */
    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[index].freq >= this.heap[parentIndex].freq) break;

            [this.heap[index], this.heap[parentIndex]] =
                [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }

    /**
     * 向下调整
     */
    heapifyDown(index) {
        while (true) {
            let minIndex = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (leftChild < this.heap.length &&
                this.heap[leftChild].freq < this.heap[minIndex].freq) {
                minIndex = leftChild;
            }

            if (rightChild < this.heap.length &&
                this.heap[rightChild].freq < this.heap[minIndex].freq) {
                minIndex = rightChild;
            }

            if (minIndex === index) break;

            [this.heap[index], this.heap[minIndex]] =
                [this.heap[minIndex], this.heap[index]];
            index = minIndex;
        }
    }

    /**
     * 获取堆大小
     */
    size() {
        return this.heap.length;
    }
}

/**
 * 哈夫曼编码实现
 *
 * 核心思想：
 * 频率高的字符使用较短的编码，频率低的字符使用较长的编码
 * 贪心策略：每次合并频率最小的两个节点
 */
class HuffmanCoding {
    /**
     * 构建哈夫曼树
     *
     * @param {Object} frequencies - 字符频率映射 {char: freq}
     * @returns {HuffmanNode} 哈夫曼树根节点
     */
    static buildHuffmanTree(frequencies) {
        const heap = new MinHeap();

        // 将所有字符作为叶子节点加入最小堆
        for (let [char, freq] of Object.entries(frequencies)) {
            heap.push(new HuffmanNode(char, freq));
        }

        // 构建哈夫曼树
        while (heap.size() > 1) {
            // 取出频率最小的两个节点
            const left = heap.pop();
            const right = heap.pop();

            // 合并为新节点
            const merged = new HuffmanNode(
                null,
                left.freq + right.freq,
                left,
                right
            );

            heap.push(merged);
        }

        return heap.pop();
    }

    /**
     * 生成编码表
     *
     * @param {HuffmanNode} root - 哈夫曼树根节点
     * @returns {Object} 字符到编码的映射
     */
    static generateCodes(root) {
        if (!root) return {};

        const codes = {};

        function dfs(node, code) {
            if (node.isLeaf()) {
                codes[node.char] = code || '0'; // 单个字符特殊处理
                return;
            }

            if (node.left) dfs(node.left, code + '0');
            if (node.right) dfs(node.right, code + '1');
        }

        dfs(root, '');
        return codes;
    }

    /**
     * 编码文本
     *
     * @param {string} text - 原始文本
     * @param {Object} codes - 编码表
     * @returns {string} 编码后的二进制字符串
     */
    static encode(text, codes) {
        return text.split('').map(char => codes[char] || '').join('');
    }

    /**
     * 解码文本
     *
     * @param {string} encodedText - 编码后的二进制字符串
     * @param {HuffmanNode} root - 哈夫曼树根节点
     * @returns {string} 解码后的文本
     */
    static decode(encodedText, root) {
        if (!root) return '';

        const result = [];
        let current = root;

        for (let bit of encodedText) {
            // 根据二进制位在树中移动
            current = bit === '0' ? current.left : current.right;

            // 到达叶子节点，记录字符并重置到根节点
            if (current.isLeaf()) {
                result.push(current.char);
                current = root;
            }
        }

        return result.join('');
    }

    /**
     * 完整的哈夫曼编码流程
     *
     * @param {string} text - 原始文本
     * @returns {Object} 编码结果和相关信息
     */
    static compress(text) {
        // 1. 计算字符频率
        const frequencies = {};
        for (let char of text) {
            frequencies[char] = (frequencies[char] || 0) + 1;
        }

        // 2. 构建哈夫曼树
        const root = this.buildHuffmanTree(frequencies);

        // 3. 生成编码表
        const codes = this.generateCodes(root);

        // 4. 编码文本
        const encodedText = this.encode(text, codes);

        // 5. 计算压缩统计
        const originalBits = text.length * 8; // 假设每字符8位
        const compressedBits = encodedText.length;
        const compressionRatio = compressedBits / originalBits;

        return {
            originalText: text,
            encodedText: encodedText,
            huffmanTree: root,
            codes: codes,
            frequencies: frequencies,
            originalBits: originalBits,
            compressedBits: compressedBits,
            compressionRatio: compressionRatio,
            spaceSaved: 1 - compressionRatio
        };
    }
}

// ==================== 6. 最小生成树算法 ====================

/**
 * 并查集数据结构（用于Kruskal算法）
 */
class UnionFind {
    constructor(n) {
        this.parent = Array(n).fill().map((_, i) => i);
        this.rank = Array(n).fill(0);
    }

    /**
     * 查找根节点（路径压缩）
     */
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }

    /**
     * 合并两个集合（按秩合并）
     */
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX === rootY) return false;

        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }

        return true;
    }
}

/**
 * 最小生成树算法集合
 */
class MinimumSpanningTree {
    /**
     * Kruskal算法
     *
     * 核心思想：
     * 按边权重排序，逐个加入不形成环的最小边
     * 贪心策略：每次选择权重最小且不形成环的边
     *
     * @param {number} n - 顶点数
     * @param {Array} edges - 边数组 [[u, v, weight], ...]
     * @returns {Object} MST信息
     * @time O(E log E)
     * @space O(V)
     */
    static kruskal(n, edges) {
        // 按权重排序所有边
        const sortedEdges = [...edges].sort((a, b) => a[2] - b[2]);

        const unionFind = new UnionFind(n);
        const mstEdges = [];
        let totalWeight = 0;

        for (let [u, v, weight] of sortedEdges) {
            // 如果加入这条边不会形成环
            if (unionFind.union(u, v)) {
                mstEdges.push([u, v, weight]);
                totalWeight += weight;

                // MST有n-1条边
                if (mstEdges.length === n - 1) {
                    break;
                }
            }
        }

        return {
            edges: mstEdges,
            totalWeight: totalWeight,
            isConnected: mstEdges.length === n - 1
        };
    }

    /**
     * Prim算法
     *
     * 核心思想：
     * 从一个顶点开始，逐步扩展MST，每次加入连接MST和非MST顶点的最小边
     * 贪心策略：每次选择连接已访问和未访问顶点的最小权重边
     *
     * @param {Array} graph - 邻接矩阵表示的图
     * @returns {Object} MST信息
     * @time O(V²) 使用邻接矩阵，O(E log V) 使用优先队列
     * @space O(V)
     */
    static prim(graph) {
        const n = graph.length;
        const visited = Array(n).fill(false);
        const minEdge = Array(n).fill(Infinity);
        const parent = Array(n).fill(-1);

        // 从顶点0开始
        minEdge[0] = 0;

        const mstEdges = [];
        let totalWeight = 0;

        for (let i = 0; i < n; i++) {
            // 找到未访问顶点中到MST距离最小的顶点
            let u = -1;
            for (let v = 0; v < n; v++) {
                if (!visited[v] && (u === -1 || minEdge[v] < minEdge[u])) {
                    u = v;
                }
            }

            // 将顶点u加入MST
            visited[u] = true;

            if (parent[u] !== -1) {
                mstEdges.push([parent[u], u, minEdge[u]]);
                totalWeight += minEdge[u];
            }

            // 更新相邻顶点的最小边权重
            for (let v = 0; v < n; v++) {
                if (!visited[v] && graph[u][v] < minEdge[v]) {
                    minEdge[v] = graph[u][v];
                    parent[v] = u;
                }
            }
        }

        return {
            edges: mstEdges,
            totalWeight: totalWeight,
            isConnected: mstEdges.length === n - 1
        };
    }

    /**
     * 使用优先队列优化的Prim算法
     *
     * @param {Array} adjacencyList - 邻接表表示的图
     * @returns {Object} MST信息
     */
    static primWithPriorityQueue(adjacencyList) {
        const n = adjacencyList.length;
        const visited = Array(n).fill(false);
        const mstEdges = [];
        let totalWeight = 0;

        // 简化的优先队列实现（实际应用中建议使用专门的数据结构）
        const pq = [[0, 0, -1]]; // [weight, vertex, parent]

        while (pq.length > 0) {
            // 找到权重最小的边
            let minIndex = 0;
            for (let i = 1; i < pq.length; i++) {
                if (pq[i][0] < pq[minIndex][0]) {
                    minIndex = i;
                }
            }

            const [weight, u, parent] = pq.splice(minIndex, 1)[0];

            if (visited[u]) continue;

            visited[u] = true;

            if (parent !== -1) {
                mstEdges.push([parent, u, weight]);
                totalWeight += weight;
            }

            // 添加相邻边到优先队列
            for (let [v, edgeWeight] of adjacencyList[u]) {
                if (!visited[v]) {
                    pq.push([edgeWeight, v, u]);
                }
            }
        }

        return {
            edges: mstEdges,
            totalWeight: totalWeight,
            isConnected: mstEdges.length === n - 1
        };
    }
}

// ==================== 导出和测试 ====================

/**
 * 运行基础贪心算法测试
 */
function runBasicGreedyTests() {
    console.log("=== 基础贪心算法测试 ===\n");

    // 测试活动选择
    console.log("1. 活动选择问题测试:");
    const activities = [
        { start: 1, end: 4, id: 'A' },
        { start: 3, end: 5, id: 'B' },
        { start: 0, end: 6, id: 'C' },
        { start: 5, end: 7, id: 'D' },
        { start: 8, end: 9, id: 'E' },
        { start: 5, end: 9, id: 'F' }
    ];
    const selectedActivities = activitySelection(activities);
    console.log(`选择的活动: ${selectedActivities.map(a => a.id).join(', ')}`);

    // 测试分数背包
    console.log("\n2. 分数背包问题测试:");
    const items = [
        { weight: 10, value: 60, id: 'item1' },
        { weight: 20, value: 100, id: 'item2' },
        { weight: 30, value: 120, id: 'item3' }
    ];
    const result = fractionalKnapsack(items, 50);
    console.log(`最大价值: ${result.maxValue}`);
    console.log(`选择的物品:`, result.selectedItems.map(item =>
        `${item.id}(${(item.fraction * 100).toFixed(1)}%)`).join(', '));

    // 测试区间调度
    console.log("\n3. 区间调度问题测试:");
    const intervals = [[10, 16], [2, 8], [1, 6], [7, 12]];
    console.log(`最少箭数: ${IntervalScheduling.findMinArrows(intervals)}`);
    console.log(`需要移除的区间数: ${IntervalScheduling.eraseOverlapIntervals(intervals)}`);

    // 测试哈夫曼编码
    console.log("\n4. 哈夫曼编码测试:");
    const text = "hello world";
    const huffmanResult = HuffmanCoding.compress(text);
    console.log(`原文: "${huffmanResult.originalText}"`);
    console.log(`编码表:`, huffmanResult.codes);
    console.log(`压缩比: ${(huffmanResult.compressionRatio * 100).toFixed(1)}%`);
    console.log(`节省空间: ${(huffmanResult.spaceSaved * 100).toFixed(1)}%`);

    // 测试最小生成树
    console.log("\n5. 最小生成树测试:");
    const edges = [
        [0, 1, 4], [0, 7, 8], [1, 2, 8], [1, 7, 11],
        [2, 3, 7], [2, 8, 2], [2, 5, 4], [3, 4, 9],
        [3, 5, 14], [4, 5, 10], [5, 6, 2], [6, 7, 1],
        [6, 8, 6], [7, 8, 7]
    ];
    const kruskalResult = MinimumSpanningTree.kruskal(9, edges);
    console.log(`Kruskal MST权重: ${kruskalResult.totalWeight}`);
    console.log(`MST边数: ${kruskalResult.edges.length}`);
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // 基础框架
        greedyTemplate,
        GreedyAnalyzer,

        // 活动选择
        activitySelection,
        weightedActivitySelection,
        findLatestNonConflicting,
        constructSolution,

        // 分数背包
        fractionalKnapsack,
        multidimensionalFractionalKnapsack,

        // 区间调度
        IntervalScheduling,

        // 哈夫曼编码
        HuffmanNode,
        MinHeap,
        HuffmanCoding,

        // 最小生成树
        UnionFind,
        MinimumSpanningTree,

        // 测试函数
        runBasicGreedyTests
    };
}