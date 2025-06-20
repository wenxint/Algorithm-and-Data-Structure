# 第14章 贪心算法 🎯

## 章节概述 📚

贪心算法是一种在每一步选择中都采取当前状态下最优选择的算法策略。虽然不能保证得到全局最优解，但在许多问题中能够得到最优或近似最优的解，且具有实现简单、效率高的特点。本章将深入讲解贪心算法的设计思想、适用条件和经典应用。

核心内容：
- 贪心选择性质和最优子结构性质
- 区间调度、活动安排等经典贪心问题
- 哈夫曼编码、最短路径等高级应用
- 贪心算法的正确性证明方法

## 贪心算法基础操作 🔧

### 1. 贪心策略设计

```javascript
/**
 * 贪心算法通用模板
 * 
 * @param {Array} candidates - 候选解集合
 * @param {Function} isValid - 验证解是否有效
 * @param {Function} greedyChoice - 贪心选择策略
 * @returns {Array} 贪心解
 */
function greedyTemplate(candidates, isValid, greedyChoice) {
    const result = [];
    const remaining = [...candidates];
    
    while (remaining.length > 0) {
        // 根据贪心策略选择当前最优元素
        const selected = greedyChoice(remaining);
        
        // 验证选择是否有效
        if (isValid(result, selected)) {
            result.push(selected);
        }
        
        // 从候选集合中移除已选择的元素
        const index = remaining.indexOf(selected);
        remaining.splice(index, 1);
    }
    
    return result;
}

// 示例：硬币找零问题（特定币值下的贪心解）
function greedyCoinChange(coins, amount) {
    // 贪心策略：总是选择最大面值的硬币
    coins.sort((a, b) => b - a);
    
    return greedyTemplate(
        coins,
        (result, coin) => {
            const usedAmount = result.reduce((sum, c) => sum + c.value * c.count, 0);
            return usedAmount + coin <= amount;
        },
        (remaining) => remaining[0] // 选择最大面值
    );
}
```

### 2. 排序与选择策略

```javascript
/**
 * 活动选择问题（区间调度）
 * 
 * 贪心策略：选择结束时间最早的活动
 * 
 * @param {Array<[number, number]>} activities - 活动数组[开始时间, 结束时间]
 * @returns {Array<[number, number]>} 最多可选择的活动
 */
function activitySelection(activities) {
    if (activities.length === 0) return [];
    
    // 按结束时间排序
    const sorted = activities.slice().sort((a, b) => a[1] - b[1]);
    
    const selected = [sorted[0]];
    let lastEndTime = sorted[0][1];
    
    for (let i = 1; i < sorted.length; i++) {
        // 如果当前活动开始时间不早于上一个活动结束时间
        if (sorted[i][0] >= lastEndTime) {
            selected.push(sorted[i]);
            lastEndTime = sorted[i][1];
        }
    }
    
    return selected;
}

// 调用示例
const activities = [[1, 3], [2, 5], [4, 6], [6, 7], [5, 8], [8, 9]];
console.log(activitySelection(activities)); // [[1, 3], [4, 6], [6, 7], [8, 9]]
```

### 3. 优先队列与贪心

```javascript
/**
 * 任务调度问题
 * 
 * 贪心策略：总是执行处理时间最短的任务（最短作业优先）
 * 
 * @param {number[]} tasks - 任务处理时间数组
 * @returns {Object} 调度结果
 */
function shortestJobFirst(tasks) {
    // 按处理时间排序
    const sortedTasks = tasks.map((time, index) => ({ time, id: index }))
                            .sort((a, b) => a.time - b.time);
    
    let currentTime = 0;
    let totalWaitTime = 0;
    const schedule = [];
    
    for (const task of sortedTasks) {
        schedule.push({
            taskId: task.id,
            startTime: currentTime,
            endTime: currentTime + task.time,
            waitTime: currentTime
        });
        
        totalWaitTime += currentTime;
        currentTime += task.time;
    }
    
    return {
        schedule,
        averageWaitTime: totalWaitTime / tasks.length,
        totalTime: currentTime
    };
}

// 调用示例
console.log(shortestJobFirst([3, 1, 4, 1, 5]));
```

## 贪心算法与其他算法的关系 💡

### 与动态规划的比较

```javascript
/**
 * 0-1背包问题：贪心 vs 动态规划
 */

// 贪心算法（按价值密度排序，可能不是最优解）
function greedyKnapsack(weights, values, capacity) {
    const items = weights.map((w, i) => ({
        weight: w,
        value: values[i],
        ratio: values[i] / w,
        index: i
    })).sort((a, b) => b.ratio - a.ratio);
    
    let totalWeight = 0;
    let totalValue = 0;
    const selected = [];
    
    for (const item of items) {
        if (totalWeight + item.weight <= capacity) {
            selected.push(item.index);
            totalWeight += item.weight;
            totalValue += item.value;
        }
    }
    
    return { selected, totalValue, totalWeight };
}

// 动态规划（保证最优解）
function dpKnapsack(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
        for (let w = 1; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(
                    dp[i - 1][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }
    
    return dp[n][capacity];
}

// 比较测试
const weights = [1, 3, 4, 5];
const values = [1, 4, 5, 7];
const capacity = 7;

console.log("贪心算法结果:", greedyKnapsack(weights, values, capacity));
console.log("动态规划结果:", dpKnapsack(weights, values, capacity));
```

### 与分治算法的结合

```javascript
/**
 * 哈夫曼编码：贪心 + 分治思想
 * 
 * 贪心策略：总是合并频率最小的两个节点
 */
class HuffmanNode {
    constructor(char, freq, left = null, right = null) {
        this.char = char;
        this.freq = freq;
        this.left = left;
        this.right = right;
    }
    
    isLeaf() {
        return !this.left && !this.right;
    }
}

function buildHuffmanTree(frequencies) {
    // 使用最小堆实现优先队列
    const heap = Object.entries(frequencies)
        .map(([char, freq]) => new HuffmanNode(char, freq))
        .sort((a, b) => a.freq - b.freq);
    
    while (heap.length > 1) {
        // 贪心选择：取频率最小的两个节点
        const left = heap.shift();
        const right = heap.shift();
        
        // 分治：合并成新节点
        const merged = new HuffmanNode(null, left.freq + right.freq, left, right);
        
        // 重新插入堆中
        let inserted = false;
        for (let i = 0; i < heap.length; i++) {
            if (merged.freq <= heap[i].freq) {
                heap.splice(i, 0, merged);
                inserted = true;
                break;
            }
        }
        if (!inserted) heap.push(merged);
    }
    
    return heap[0];
}

// 生成编码表
function generateCodes(root) {
    const codes = {};
    
    function traverse(node, code = '') {
        if (node.isLeaf()) {
            codes[node.char] = code || '0'; // 特殊情况：只有一个字符
        } else {
            if (node.left) traverse(node.left, code + '0');
            if (node.right) traverse(node.right, code + '1');
        }
    }
    
    traverse(root);
    return codes;
}

// 调用示例
const frequencies = { 'a': 5, 'b': 9, 'c': 12, 'd': 13, 'e': 16, 'f': 45 };
const huffmanTree = buildHuffmanTree(frequencies);
const codes = generateCodes(huffmanTree);
console.log("哈夫曼编码:", codes);
```

## 核心贪心算法思想 🎯

### 1. 区间问题

**概念定义**: 处理时间区间、空间区间的调度和选择问题。

**解题思想**: 通过合适的排序策略，使得每次贪心选择都能保证局部最优，从而达到全局最优。

**应用场景**: 会议室安排、任务调度、区间覆盖等。

```javascript
/**
 * 会议室安排问题
 * 
 * 核心思想：
 * 贪心策略：按会议结束时间排序，每次选择结束最早且不冲突的会议
 * 这样能为后续会议留出最多的时间空间
 * 
 * @param {Array<[number, number]>} intervals - 会议时间区间
 * @returns {number} 最多能安排的会议数
 * @time O(n log n)
 * @space O(1)
 */
function maxMeetings(intervals) {
    if (intervals.length === 0) return 0;
    
    // 按结束时间排序
    intervals.sort((a, b) => a[1] - b[1]);
    
    let count = 1;
    let lastEndTime = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        // 如果会议不冲突，选择这个会议
        if (intervals[i][0] >= lastEndTime) {
            count++;
            lastEndTime = intervals[i][1];
        }
    }
    
    return count;
}

// 测试用例
const meetings = [[1, 3], [2, 4], [3, 5], [4, 6]];
console.log(maxMeetings(meetings)); // 3
```

```javascript
/**
 * 最少箭头射气球
 * 
 * 核心思想：
 * 贪心策略：按气球结束位置排序，每支箭射击最早结束的气球
 * 能同时射爆尽可能多的气球
 * 
 * @param {Array<[number, number]>} points - 气球的开始和结束坐标
 * @returns {number} 最少需要的箭头数
 * @time O(n log n)
 * @space O(1)
 */
function findMinArrowShots(points) {
    if (points.length === 0) return 0;
    
    // 按结束位置排序
    points.sort((a, b) => a[1] - b[1]);
    
    let arrows = 1;
    let arrowPos = points[0][1];
    
    for (let i = 1; i < points.length; i++) {
        // 如果当前气球开始位置在箭的位置之后，需要新的箭
        if (points[i][0] > arrowPos) {
            arrows++;
            arrowPos = points[i][1];
        }
    }
    
    return arrows;
}

// 测试用例
const balloons = [[10, 16], [2, 8], [1, 6], [7, 12]];
console.log(findMinArrowShots(balloons)); // 2
```

### 2. 字符串构造

**概念定义**: 通过贪心策略构造满足特定条件的字符串。

**解题思想**: 在每个位置上选择当前最优的字符，确保整体字符串满足约束条件。

**应用场景**: 字典序最小、摆动序列、重复字符控制等。

```javascript
/**
 * 去除K位数字
 * 
 * 核心思想：
 * 贪心策略：从左到右遍历，如果当前数字比前一个数字小，
 * 则移除前一个数字，这样能让整个数字变得更小
 * 
 * @param {string} num - 原始数字字符串
 * @param {number} k - 需要移除的位数
 * @returns {string} 移除k位后的最小数字
 * @time O(n)
 * @space O(n)
 */
function removeKdigits(num, k) {
    const stack = [];
    let toRemove = k;
    
    for (const digit of num) {
        // 如果当前数字比栈顶小，且还需要移除数字
        while (stack.length > 0 && stack[stack.length - 1] > digit && toRemove > 0) {
            stack.pop();
            toRemove--;
        }
        stack.push(digit);
    }
    
    // 如果还需要移除数字，从右边移除
    while (toRemove > 0) {
        stack.pop();
        toRemove--;
    }
    
    // 处理前导零
    const result = stack.join('').replace(/^0+/, '');
    return result || '0';
}

// 测试用例
console.log(removeKdigits("1432219", 3)); // "1219"
console.log(removeKdigits("10200", 1)); // "200"
```

```javascript
/**
 * 重构字符串（使相邻字符不同）
 * 
 * 核心思想：
 * 贪心策略：优先使用频率最高的字符，并避免相邻放置相同字符
 * 使用最大堆维护字符频率
 * 
 * @param {string} s - 输入字符串
 * @returns {string} 重构后的字符串，无法重构返回""
 * @time O(n log k) k为不同字符数
 * @space O(k)
 */
function reorganizeString(s) {
    // 统计字符频率
    const freq = {};
    for (const char of s) {
        freq[char] = (freq[char] || 0) + 1;
    }
    
    // 检查是否可能重构
    const maxFreq = Math.max(...Object.values(freq));
    if (maxFreq > Math.ceil(s.length / 2)) {
        return "";
    }
    
    // 使用优先队列（用数组模拟）
    const heap = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const result = [];
    
    while (heap.length > 1) {
        // 取频率最高的两个字符
        const [char1, freq1] = heap.shift();
        const [char2, freq2] = heap.shift();
        
        result.push(char1, char2);
        
        // 如果还有剩余，重新加入堆
        if (freq1 > 1) {
            this.insertToHeap(heap, [char1, freq1 - 1]);
        }
        if (freq2 > 1) {
            this.insertToHeap(heap, [char2, freq2 - 1]);
        }
    }
    
    // 处理最后一个字符
    if (heap.length === 1) {
        result.push(heap[0][0]);
    }
    
    return result.join('');
}

// 辅助函数：维护堆的有序性
function insertToHeap(heap, item) {
    let inserted = false;
    for (let i = 0; i < heap.length; i++) {
        if (item[1] >= heap[i][1]) {
            heap.splice(i, 0, item);
            inserted = true;
            break;
        }
    }
    if (!inserted) heap.push(item);
}

// 测试用例
console.log(reorganizeString("aab")); // "aba"
console.log(reorganizeString("aaab")); // ""
```

### 3. 数学贪心

**概念定义**: 利用数学性质设计贪心策略，通常涉及最值、比例、排列等。

**解题思想**: 通过数学分析找到贪心选择的依据，证明局部最优能导致全局最优。

**应用场景**: 分糖果、分配问题、最优比例等。

```javascript
/**
 * 分发糖果问题
 * 
 * 核心思想：
 * 两次扫描贪心策略：
 * 1. 从左到右：保证评分高的孩子比左边孩子糖果多
 * 2. 从右到左：保证评分高的孩子比右边孩子糖果多
 * 
 * @param {number[]} ratings - 孩子们的评分
 * @returns {number} 最少需要的糖果总数
 * @time O(n)
 * @space O(n)
 */
function candy(ratings) {
    const n = ratings.length;
    const candies = new Array(n).fill(1);
    
    // 从左到右扫描
    for (let i = 1; i < n; i++) {
        if (ratings[i] > ratings[i - 1]) {
            candies[i] = candies[i - 1] + 1;
        }
    }
    
    // 从右到左扫描
    for (let i = n - 2; i >= 0; i--) {
        if (ratings[i] > ratings[i + 1]) {
            candies[i] = Math.max(candies[i], candies[i + 1] + 1);
        }
    }
    
    return candies.reduce((sum, candy) => sum + candy, 0);
}

// 测试用例
console.log(candy([1, 0, 2])); // 5 (糖果分配: [2, 1, 2])
console.log(candy([1, 2, 2])); // 4 (糖果分配: [1, 2, 1])
```

## 贪心算法总结 🎯

| 问题类型 | 时间复杂度 | 空间复杂度 | 核心贪心策略 |
|---------|-----------|-----------|-------------|
| 区间调度 | O(n log n) | O(1) | 按结束时间排序 |
| 字符串构造 | O(n) ~ O(n log k) | O(n) | 优先队列 + 局部最优 |
| 路径选择 | O(n log n) | O(1) | 按权重排序 |
| 数学贪心 | O(n) | O(n) | 数学性质 + 扫描 |
| 图论贪心 | O(E log V) | O(V + E) | 最短边优先 |

**贪心算法适用条件**：
1. **贪心选择性质**：局部最优选择能导致全局最优解
2. **最优子结构**：问题的最优解包含子问题的最优解
3. **无后效性**：当前选择不依赖于未来的选择 