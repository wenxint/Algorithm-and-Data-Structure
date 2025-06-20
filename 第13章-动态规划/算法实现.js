/**
 * 第13章 动态规划 - 算法实现
 *
 * 本文件包含：
 * 1. 状态压缩动态规划
 * 2. 记忆化搜索
 * 3. 树形动态规划
 * 4. 数位动态规划
 * 5. 概率动态规划
 * 6. 高级优化技巧
 *
 * 作者：数据结构与算法教程
 * 日期：2024年
 */

// ==================== 1. 状态压缩动态规划 ====================

/**
 * 旅行商问题（TSP）- 状态压缩DP
 *
 * 核心思想：
 * 使用位掩码表示访问过的城市集合
 * dp[mask][i] 表示访问过mask集合中的城市，当前在城市i的最小距离
 *
 * @param {number[][]} dist - 城市间距离矩阵
 * @returns {number} 最短路径长度
 * @time O(n²2ⁿ)
 * @space O(n2ⁿ)
 */
function tsp(dist) {
    const n = dist.length;
    const VISITED_ALL = (1 << n) - 1;

    // dp[mask][i] = 访问过mask中的城市，当前在城市i的最小成本
    const dp = Array(1 << n).fill().map(() => Array(n).fill(Infinity));

    // 从城市0开始
    dp[1][0] = 0;

    for (let mask = 0; mask <= VISITED_ALL; mask++) {
        for (let u = 0; u < n; u++) {
            if (!(mask & (1 << u))) continue; // u不在当前集合中

            for (let v = 0; v < n; v++) {
                if (mask & (1 << v)) continue; // v已访问过

                const newMask = mask | (1 << v);
                dp[newMask][v] = Math.min(dp[newMask][v], dp[mask][u] + dist[u][v]);
            }
        }
    }

    // 从各个城市回到起点的最小成本
    let result = Infinity;
    for (let i = 1; i < n; i++) {
        result = Math.min(result, dp[VISITED_ALL][i] + dist[i][0]);
    }

    return result;
}

/**
 * 分配任务问题
 *
 * 核心思想：
 * n个人分配n个任务，每个人有不同的能力值
 * 使用状态压缩表示已分配的任务集合
 *
 * @param {number[][]} cost - cost[i][j]表示第i个人做第j个任务的成本
 * @returns {number} 最小总成本
 * @time O(n²2ⁿ)
 * @space O(n2ⁿ)
 */
function assignmentProblem(cost) {
    const n = cost.length;
    const dp = Array(1 << n).fill().map(() => Array(n).fill(Infinity));

    // 初始状态：任何人都可以做第一个任务
    for (let i = 0; i < n; i++) {
        dp[1 << 0][i] = cost[i][0];
    }

    for (let mask = 1; mask < (1 << n); mask++) {
        const taskCount = this.popCount(mask);
        if (taskCount >= n) continue;

        for (let person = 0; person < n; person++) {
            if (dp[mask][person] === Infinity) continue;

            // 分配下一个任务
            for (let nextTask = 0; nextTask < n; nextTask++) {
                if (mask & (1 << nextTask)) continue; // 任务已分配

                const newMask = mask | (1 << nextTask);
                const newCost = dp[mask][person] + cost[person][nextTask];

                for (let nextPerson = 0; nextPerson < n; nextPerson++) {
                    dp[newMask][nextPerson] = Math.min(dp[newMask][nextPerson], newCost);
                }
            }
        }
    }

    const fullMask = (1 << n) - 1;
    return Math.min(...dp[fullMask]);
}

/**
 * 计算二进制数中1的个数
 */
function popCount(mask) {
    let count = 0;
    while (mask) {
        count += mask & 1;
        mask >>= 1;
    }
    return count;
}

// ==================== 2. 记忆化搜索 ====================

/**
 * 记忆化搜索框架
 */
class MemoizedDP {
    constructor() {
        this.memo = new Map();
    }

    /**
     * 通用记忆化搜索模板
     */
    memoizedSearch(state, computeFunction) {
        const key = this.stateToString(state);

        if (this.memo.has(key)) {
            return this.memo.get(key);
        }

        const result = computeFunction(state);
        this.memo.set(key, result);
        return result;
    }

    /**
     * 将状态转换为字符串键
     */
    stateToString(state) {
        if (Array.isArray(state)) {
            return state.join(',');
        }
        return String(state);
    }

    /**
     * 清除缓存
     */
    clear() {
        this.memo.clear();
    }

    /**
     * 获取缓存统计
     */
    getStats() {
        return {
            size: this.memo.size,
            keys: Array.from(this.memo.keys())
        };
    }
}

/**
 * 数字转换问题（记忆化搜索示例）
 *
 * 核心思想：
 * 将数字n通过特定操作转换为1的最少步数
 * 使用记忆化避免重复计算
 *
 * @param {number} n - 初始数字
 * @returns {number} 最少转换步数
 */
function minStepsToOne(n) {
    const memo = new Map();

    function dfs(num) {
        if (num === 1) return 0;
        if (memo.has(num)) return memo.get(num);

        let result = Infinity;

        // 操作1：减1
        result = Math.min(result, dfs(num - 1) + 1);

        // 操作2：如果能被2整除
        if (num % 2 === 0) {
            result = Math.min(result, dfs(num / 2) + 1);
        }

        // 操作3：如果能被3整除
        if (num % 3 === 0) {
            result = Math.min(result, dfs(num / 3) + 1);
        }

        memo.set(num, result);
        return result;
    }

    return dfs(n);
}

/**
 * 正则表达式匹配（记忆化搜索）
 *
 * 核心思想：
 * 使用递归处理正则表达式的匹配
 * 记忆化避免重复的子问题计算
 *
 * @param {string} s - 输入字符串
 * @param {string} p - 正则表达式模式
 * @returns {boolean} 是否匹配
 */
function isMatch(s, p) {
    const memo = new Map();

    function dp(i, j) {
        const key = `${i},${j}`;
        if (memo.has(key)) return memo.get(key);

        // 基础情况
        if (j === p.length) {
            return i === s.length;
        }

        const firstMatch = i < s.length && (p[j] === s[i] || p[j] === '.');

        let result;
        // 检查下一个字符是否为*
        if (j + 1 < p.length && p[j + 1] === '*') {
            // 两种选择：匹配0次或匹配1次然后继续
            result = dp(i, j + 2) || (firstMatch && dp(i + 1, j));
        } else {
            // 必须匹配当前字符
            result = firstMatch && dp(i + 1, j + 1);
        }

        memo.set(key, result);
        return result;
    }

    return dp(0, 0);
}

// ==================== 3. 树形动态规划 ====================

/**
 * 二叉树节点定义
 */
class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * 打家劫舍III（树形DP）
 *
 * 核心思想：
 * 在二叉树上进行打家劫舍，不能同时选择相邻的节点
 * 对每个节点，考虑选择和不选择两种状态
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number} 最大金额
 * @time O(n)
 * @space O(h) h为树的高度
 */
function rob3(root) {
    /**
     * 返回[不选择当前节点的最大值, 选择当前节点的最大值]
     */
    function dfs(node) {
        if (!node) return [0, 0];

        const [leftNotRob, leftRob] = dfs(node.left);
        const [rightNotRob, rightRob] = dfs(node.right);

        // 不选择当前节点：子节点可选可不选，取最大值
        const notRob = Math.max(leftNotRob, leftRob) + Math.max(rightNotRob, rightRob);

        // 选择当前节点：子节点都不能选
        const rob = node.val + leftNotRob + rightNotRob;

        return [notRob, rob];
    }

    const [notRob, rob] = dfs(root);
    return Math.max(notRob, rob);
}

/**
 * 二叉树中的最大路径和
 *
 * 核心思想：
 * 路径可以从任意节点开始和结束
 * 对每个节点，考虑通过该节点的最大路径和
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number} 最大路径和
 * @time O(n)
 * @space O(h)
 */
function maxPathSum(root) {
    let maxSum = -Infinity;

    function dfs(node) {
        if (!node) return 0;

        // 获取左右子树的最大贡献值（负数时取0）
        const leftGain = Math.max(dfs(node.left), 0);
        const rightGain = Math.max(dfs(node.right), 0);

        // 通过当前节点的最大路径和
        const currentMaxPath = node.val + leftGain + rightGain;
        maxSum = Math.max(maxSum, currentMaxPath);

        // 返回当前节点的最大贡献值
        return node.val + Math.max(leftGain, rightGain);
    }

    dfs(root);
    return maxSum;
}

/**
 * 监控二叉树（树形DP + 状态设计）
 *
 * 核心思想：
 * 在二叉树上放置最少的摄像头监控所有节点
 * 定义三种状态：0-未覆盖，1-有摄像头，2-被覆盖
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number} 最少摄像头数量
 * @time O(n)
 * @space O(h)
 */
function minCameraCover(root) {
    let cameras = 0;

    function dfs(node) {
        if (!node) return 2; // 空节点视为被覆盖

        const left = dfs(node.left);
        const right = dfs(node.right);

        // 如果有子节点未被覆盖，当前节点必须放摄像头
        if (left === 0 || right === 0) {
            cameras++;
            return 1; // 当前节点有摄像头
        }

        // 如果有子节点有摄像头，当前节点被覆盖
        if (left === 1 || right === 1) {
            return 2; // 当前节点被覆盖
        }

        // 所有子节点都被覆盖，当前节点未被覆盖
        return 0; // 当前节点未被覆盖
    }

    // 如果根节点未被覆盖，需要在根节点放摄像头
    if (dfs(root) === 0) {
        cameras++;
    }

    return cameras;
}

// ==================== 4. 数位动态规划 ====================

/**
 * 统计区间[0, n]中包含特定数字的个数
 *
 * 核心思想：
 * 按数位进行动态规划，考虑当前位的选择限制
 * 维护是否到达上界、是否开始计数等状态
 *
 * @param {number} n - 上界
 * @param {number} digit - 目标数字
 * @returns {number} 包含目标数字的数字个数
 */
function countDigitOne(n) {
    const s = n.toString();
    const memo = new Map();

    function dp(pos, count, isLimit, isNum) {
        if (pos === s.length) {
            return isNum ? count : 0;
        }

        const key = `${pos},${count},${isLimit},${isNum}`;
        if (memo.has(key)) return memo.get(key);

        let result = 0;

        // 可以选择不填数字（前导零）
        if (!isNum) {
            result += dp(pos + 1, count, false, false);
        }

        // 填入数字
        const start = isNum ? 0 : 1;
        const end = isLimit ? parseInt(s[pos]) : 9;

        for (let digit = start; digit <= end; digit++) {
            const newCount = count + (digit === 1 ? 1 : 0);
            const newIsLimit = isLimit && (digit === end);
            result += dp(pos + 1, newCount, newIsLimit, true);
        }

        memo.set(key, result);
        return result;
    }

    return dp(0, 0, true, false);
}

/**
 * 数字范围内1的个数
 *
 * 核心思想：
 * 统计从1到n的所有整数中数字1出现的次数
 *
 * @param {number} n - 上界
 * @returns {number} 数字1的总出现次数
 */
function countOnes(n) {
    let count = 0;

    for (let i = 1; i <= n; i *= 10) {
        const higher = Math.floor(n / (i * 10));
        const current = Math.floor((n / i) % 10);
        const lower = n % i;

        if (current === 0) {
            count += higher * i;
        } else if (current === 1) {
            count += higher * i + lower + 1;
        } else {
            count += (higher + 1) * i;
        }
    }

    return count;
}

// ==================== 5. 概率动态规划 ====================

/**
 * 骰子点数问题
 *
 * 核心思想：
 * 计算n个骰子投掷后各点数和的概率
 * dp[i][j] = 使用i个骰子得到点数j的方案数
 *
 * @param {number} n - 骰子个数
 * @returns {Array<number>} 各点数和的概率
 * @time O(n * 6 * 6n)
 * @space O(6n)
 */
function dicesProbability(n) {
    // dp[j] = 当前轮次得到点数j的方案数
    let dp = new Array(6 * n + 1).fill(0);

    // 初始化：一个骰子的情况
    for (let i = 1; i <= 6; i++) {
        dp[i] = 1;
    }

    // 逐个增加骰子
    for (let dice = 2; dice <= n; dice++) {
        const newDp = new Array(6 * n + 1).fill(0);

        for (let j = dice; j <= 6 * dice; j++) {
            // 当前骰子可能的点数
            for (let k = 1; k <= 6; k++) {
                if (j - k >= 0) {
                    newDp[j] += dp[j - k];
                }
            }
        }

        dp = newDp;
    }

    // 计算概率
    const total = Math.pow(6, n);
    const probabilities = [];

    for (let i = n; i <= 6 * n; i++) {
        probabilities.push(dp[i] / total);
    }

    return probabilities;
}

/**
 * 约瑟夫环问题（动态规划解法）
 *
 * 核心思想：
 * f(n,k) = (f(n-1,k) + k) % n
 * 其中f(n,k)表示n个人报数为k时最后剩下的人的位置
 *
 * @param {number} n - 总人数
 * @param {number} k - 报数
 * @returns {number} 最后剩下的人的位置（0-indexed）
 * @time O(n)
 * @space O(1)
 */
function josephus(n, k) {
    let result = 0;

    for (let i = 2; i <= n; i++) {
        result = (result + k) % i;
    }

    return result;
}

// ==================== 6. 高级优化技巧 ====================

/**
 * 单调队列优化DP
 *
 * 应用场景：滑动窗口最值问题
 */
class MonotonicQueue {
    constructor() {
        this.deque = []; // 存储[值, 索引]
    }

    /**
     * 在窗口右端添加元素
     */
    push(val, index) {
        // 移除所有比当前值小的元素（保持单调递减）
        while (this.deque.length > 0 && this.deque[this.deque.length - 1][0] <= val) {
            this.deque.pop();
        }
        this.deque.push([val, index]);
    }

    /**
     * 获取窗口内最大值
     */
    max() {
        return this.deque.length > 0 ? this.deque[0][0] : -Infinity;
    }

    /**
     * 移除窗口左端超出范围的元素
     */
    popLeft(leftBound) {
        while (this.deque.length > 0 && this.deque[0][1] < leftBound) {
            this.deque.shift();
        }
    }
}

/**
 * 滑动窗口最大值（单调队列优化）
 *
 * @param {number[]} nums - 数组
 * @param {number} k - 窗口大小
 * @returns {number[]} 每个窗口的最大值
 * @time O(n)
 * @space O(k)
 */
function maxSlidingWindow(nums, k) {
    const mq = new MonotonicQueue();
    const result = [];

    for (let i = 0; i < nums.length; i++) {
        mq.push(nums[i], i);
        mq.popLeft(i - k + 1);

        if (i >= k - 1) {
            result.push(mq.max());
        }
    }

    return result;
}

/**
 * 矩阵快速幂优化线性递推
 *
 * 核心思想：
 * 对于线性递推关系，可以用矩阵快速幂优化到O(log n)
 *
 * @param {number[][]} matrix - 转移矩阵
 * @param {number} n - 幂次
 * @returns {number[][]} 矩阵的n次幂
 */
function matrixPower(matrix, n) {
    const size = matrix.length;
    let result = Array(size).fill().map((_, i) =>
        Array(size).fill().map((_, j) => i === j ? 1 : 0)
    ); // 单位矩阵

    let base = matrix.map(row => [...row]); // 深拷贝

    while (n > 0) {
        if (n & 1) {
            result = multiplyMatrix(result, base);
        }
        base = multiplyMatrix(base, base);
        n >>= 1;
    }

    return result;
}

/**
 * 矩阵乘法
 */
function multiplyMatrix(a, b) {
    const rows = a.length;
    const cols = b[0].length;
    const common = b.length;

    const result = Array(rows).fill().map(() => Array(cols).fill(0));

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            for (let k = 0; k < common; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    return result;
}

/**
 * 斐波那契数列（矩阵快速幂优化）
 *
 * @param {number} n - 第n项
 * @returns {number} 斐波那契数
 * @time O(log n)
 * @space O(1)
 */
function fibonacciMatrix(n) {
    if (n <= 1) return n;

    const transferMatrix = [[1, 1], [1, 0]];
    const result = matrixPower(transferMatrix, n - 1);

    return result[0][0]; // F(n) = result[0][0] * F(1) + result[0][1] * F(0)
}

// ==================== 导出和测试 ====================

/**
 * 运行高级DP算法测试
 */
function runAdvancedDPTests() {
    console.log("=== 高级动态规划算法测试 ===\n");

    // 测试状态压缩DP
    console.log("1. 状态压缩DP测试:");
    const distMatrix = [
        [0, 10, 15, 20],
        [10, 0, 35, 25],
        [15, 35, 0, 30],
        [20, 25, 30, 0]
    ];
    console.log(`TSP最短路径: ${tsp(distMatrix)}`);

    // 测试记忆化搜索
    console.log("\n2. 记忆化搜索测试:");
    console.log(`数字转换(10): ${minStepsToOne(10)}`);
    console.log(`正则匹配: ${isMatch("aa", "a*")}`);

    // 测试数位DP
    console.log("\n3. 数位DP测试:");
    console.log(`统计1的个数(13): ${countOnes(13)}`);

    // 测试概率DP
    console.log("\n4. 概率DP测试:");
    const probs = dicesProbability(2);
    console.log(`两个骰子点数概率:`, probs.slice(0, 5).map(p => p.toFixed(4)));
    console.log(`约瑟夫环(5,2): ${josephus(5, 2)}`);

    // 测试优化技巧
    console.log("\n5. 优化技巧测试:");
    console.log(`滑动窗口最大值: ${maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3)}`);
    console.log(`斐波那契矩阵快速幂(10): ${fibonacciMatrix(10)}`);
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // 状态压缩DP
        tsp,
        assignmentProblem,
        popCount,

        // 记忆化搜索
        MemoizedDP,
        minStepsToOne,
        isMatch,

        // 树形DP
        TreeNode,
        rob3,
        maxPathSum,
        minCameraCover,

        // 数位DP
        countDigitOne,
        countOnes,

        // 概率DP
        dicesProbability,
        josephus,

        // 优化技巧
        MonotonicQueue,
        maxSlidingWindow,
        matrixPower,
        multiplyMatrix,
        fibonacciMatrix,

        // 测试函数
        runAdvancedDPTests
    };
}