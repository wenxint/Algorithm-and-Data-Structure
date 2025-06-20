# 第13章 动态规划 📊

## 章节概述 📚

动态规划是算法设计中最重要的技巧之一，通过将复杂问题分解为重叠的子问题，并存储子问题的解来避免重复计算。本章将深入讲解动态规划的核心思想，包括状态定义、状态转移方程、边界条件等关键概念，以及在实际问题中的应用。

核心内容：
- 一维和二维动态规划的基础应用
- 背包问题、路径问题、字符串匹配等经典问题类型
- 状态压缩、记忆化搜索等优化技巧
- 区间动态规划和树形动态规划等高级应用

## 动态规划基础操作 🔧

### 1. 状态定义与初始化

```javascript
/**
 * 一维动态规划模板
 * 
 * @param {number} n - 问题规模
 * @param {*} initialValue - 初始值
 * @returns {Array} dp数组
 */
function initDP1D(n, initialValue = 0) {
    const dp = new Array(n + 1).fill(initialValue);
    // 设置边界条件
    dp[0] = initialValue;
    return dp;
}

// 示例：斐波那契数列
console.log(initDP1D(10, 0)); // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

```javascript
/**
 * 二维动态规划模板
 * 
 * @param {number} m - 行数
 * @param {number} n - 列数
 * @param {*} initialValue - 初始值
 * @returns {Array<Array>} dp二维数组
 */
function initDP2D(m, n, initialValue = 0) {
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(initialValue));
    return dp;
}

// 示例：路径问题
console.log(initDP2D(3, 3, 0)); 
// [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]]
```

### 2. 状态转移方程

```javascript
/**
 * 基础状态转移示例：爬楼梯问题
 * 
 * @param {number} n - 楼梯层数
 * @returns {number} 爬楼梯的方法数
 */
function climbStairs(n) {
    if (n <= 2) return n;
    
    const dp = new Array(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    
    // 状态转移：dp[i] = dp[i-1] + dp[i-2]
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    return dp[n];
}

// 调用示例
console.log(climbStairs(5)); // 8
```

### 3. 空间优化技巧

```javascript
/**
 * 滚动数组优化：只使用O(1)空间
 * 
 * @param {number} n - 楼梯层数
 * @returns {number} 爬楼梯的方法数
 */
function climbStairsOptimized(n) {
    if (n <= 2) return n;
    
    let prev2 = 1; // dp[i-2]
    let prev1 = 2; // dp[i-1]
    let current = 0;
    
    for (let i = 3; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return current;
}

// 调用示例
console.log(climbStairsOptimized(5)); // 8
```

## 动态规划与其他算法的关系 💡

### 与分治算法的关系

```javascript
/**
 * 分治思想 vs 动态规划
 * 斐波那契数列的两种实现
 */

// 分治（递归，存在重复计算）
function fibonacciRecursive(n) {
    if (n <= 1) return n;
    return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

// 动态规划（自底向上，避免重复计算）
function fibonacciDP(n) {
    if (n <= 1) return n;
    
    const dp = [0, 1];
    for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}

console.log(fibonacciRecursive(10)); // 55
console.log(fibonacciDP(10)); // 55
```

### 与贪心算法的关系

```javascript
/**
 * 贪心 vs 动态规划的选择
 * 零钱兑换问题
 */

// 贪心算法（不一定得到最优解）
function coinChangeGreedy(coins, amount) {
    coins.sort((a, b) => b - a); // 降序排列
    let count = 0;
    
    for (const coin of coins) {
        while (amount >= coin) {
            amount -= coin;
            count++;
        }
    }
    
    return amount === 0 ? count : -1;
}

// 动态规划（保证最优解）
function coinChangeDP(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}

console.log(coinChangeGreedy([1, 3, 4], 6)); // 可能不是最优
console.log(coinChangeDP([1, 3, 4], 6)); // 2 (3+3)
```

## 核心动态规划思想 🎯

### 1. 线性动态规划

**概念定义**: 状态转移具有线性特征，通常处理序列问题，如数组、字符串等。

**解题思想**: 定义状态表示以某个位置结尾或开始的最优解，通过前面的状态推导当前状态。

**应用场景**: 最大子数组和、最长递增子序列、编辑距离等。

```javascript
/**
 * 最大子数组和（Kadane算法）
 * 
 * 核心思想：
 * dp[i] 表示以第i个元素结尾的最大子数组和
 * 状态转移：dp[i] = max(nums[i], dp[i-1] + nums[i])
 * 
 * @param {number[]} nums - 输入数组
 * @returns {number} 最大子数组和
 * @time O(n)
 * @space O(1) 使用空间优化
 */
function maxSubArray(nums) {
    let maxSoFar = nums[0]; // 全局最大值
    let maxEndingHere = nums[0]; // 以当前位置结尾的最大值
    
    for (let i = 1; i < nums.length; i++) {
        // 状态转移：选择当前元素单独成数组，或加入前面的子数组
        maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
}

// 测试用例
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6 ([4,-1,2,1])
```

```javascript
/**
 * 最长递增子序列（LIS）
 * 
 * 核心思想：
 * dp[i] 表示以第i个元素结尾的最长递增子序列长度
 * 对于每个位置i，检查所有前面的位置j，如果nums[j] < nums[i]，
 * 则可以在以j结尾的LIS基础上扩展
 * 
 * @param {number[]} nums - 输入数组
 * @returns {number} 最长递增子序列长度
 * @time O(n²)
 * @space O(n)
 */
function lengthOfLIS(nums) {
    if (nums.length === 0) return 0;
    
    const dp = new Array(nums.length).fill(1);
    let maxLength = 1;
    
    for (let i = 1; i < nums.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLength = Math.max(maxLength, dp[i]);
    }
    
    return maxLength;
}

// 测试用例
console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 4 ([2,3,7,18])
```

### 2. 背包动态规划

**概念定义**: 经典的资源分配问题，在有限的容量下选择价值最大的物品组合。

**解题思想**: 定义状态表示在特定容量下能获得的最大价值，通过选择或不选择当前物品来转移状态。

**应用场景**: 0-1背包、完全背包、多重背包等资源优化问题。

```javascript
/**
 * 0-1背包问题
 * 
 * 核心思想：
 * dp[i][j] 表示前i个物品在容量为j的背包中能获得的最大价值
 * 对于第i个物品，有两种选择：
 * 1. 不选择：dp[i][j] = dp[i-1][j]
 * 2. 选择（如果容量够）：dp[i][j] = dp[i-1][j-weight[i]] + value[i]
 * 
 * @param {number[]} weights - 物品重量
 * @param {number[]} values - 物品价值
 * @param {number} capacity - 背包容量
 * @returns {number} 最大价值
 * @time O(n*capacity)
 * @space O(n*capacity)
 */
function knapsack01(weights, values, capacity) {
    const n = weights.length;
    const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= capacity; j++) {
            // 不选择第i个物品
            dp[i][j] = dp[i - 1][j];
            
            // 如果容量够，考虑选择第i个物品
            if (j >= weights[i - 1]) {
                dp[i][j] = Math.max(
                    dp[i][j],
                    dp[i - 1][j - weights[i - 1]] + values[i - 1]
                );
            }
        }
    }
    
    return dp[n][capacity];
}

// 测试用例
const weights = [1, 3, 4, 5];
const values = [1, 4, 5, 7];
const capacity = 7;
console.log(knapsack01(weights, values, capacity)); // 9
```

```javascript
/**
 * 空间优化的0-1背包
 * 
 * 核心思想：
 * 由于当前状态只依赖于上一行的状态，可以使用一维数组
 * 从右到左更新避免覆盖还需要用到的状态
 * 
 * @param {number[]} weights - 物品重量
 * @param {number[]} values - 物品价值
 * @param {number} capacity - 背包容量
 * @returns {number} 最大价值
 * @time O(n*capacity)
 * @space O(capacity)
 */
function knapsack01Optimized(weights, values, capacity) {
    const dp = new Array(capacity + 1).fill(0);
    
    for (let i = 0; i < weights.length; i++) {
        // 从右到左更新，避免状态覆盖
        for (let j = capacity; j >= weights[i]; j--) {
            dp[j] = Math.max(dp[j], dp[j - weights[i]] + values[i]);
        }
    }
    
    return dp[capacity];
}

// 测试用例
console.log(knapsack01Optimized(weights, values, capacity)); // 9
```

### 3. 路径动态规划

**概念定义**: 在网格或图中寻找满足特定条件的路径，通常求最优路径数或最优路径值。

**解题思想**: 定义状态表示到达某个位置的最优解，通过相邻位置的状态进行转移。

**应用场景**: 最小路径和、路径数统计、矩阵路径问题等。

```javascript
/**
 * 最小路径和
 * 
 * 核心思想：
 * dp[i][j] 表示从左上角到位置(i,j)的最小路径和
 * 只能向右或向下移动，所以状态转移为：
 * dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
 * 
 * @param {number[][]} grid - 网格
 * @returns {number} 最小路径和
 * @time O(m*n)
 * @space O(m*n)
 */
function minPathSum(grid) {
    const m = grid.length;
    const n = grid[0].length;
    const dp = Array(m).fill(null).map(() => Array(n).fill(0));
    
    // 初始化第一个位置
    dp[0][0] = grid[0][0];
    
    // 初始化第一行
    for (let j = 1; j < n; j++) {
        dp[0][j] = dp[0][j - 1] + grid[0][j];
    }
    
    // 初始化第一列
    for (let i = 1; i < m; i++) {
        dp[i][0] = dp[i - 1][0] + grid[i][0];
    }
    
    // 填充dp数组
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = grid[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    
    return dp[m - 1][n - 1];
}

// 测试用例
const grid = [
    [1, 3, 1],
    [1, 5, 1],
    [4, 2, 1]
];
console.log(minPathSum(grid)); // 7 (1→3→1→1→1)
```

### 4. 区间动态规划

**概念定义**: 在区间上定义状态，通过分割区间来解决问题，通常用于处理回文、括号匹配等问题。

**解题思想**: 定义状态表示某个区间的最优解，通过枚举分割点将大区间分解为小区间。

**应用场景**: 最长回文子序列、矩阵链乘法、石子合并等。

```javascript
/**
 * 最长回文子序列
 * 
 * 核心思想：
 * dp[i][j] 表示字符串s[i...j]的最长回文子序列长度
 * 如果s[i] == s[j]，则dp[i][j] = dp[i+1][j-1] + 2
 * 否则dp[i][j] = max(dp[i+1][j], dp[i][j-1])
 * 
 * @param {string} s - 输入字符串
 * @returns {number} 最长回文子序列长度
 * @time O(n²)
 * @space O(n²)
 */
function longestPalindromeSubseq(s) {
    const n = s.length;
    const dp = Array(n).fill(null).map(() => Array(n).fill(0));
    
    // 单个字符的回文长度为1
    for (let i = 0; i < n; i++) {
        dp[i][i] = 1;
    }
    
    // 按区间长度从小到大填充
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            if (s[i] === s[j]) {
                dp[i][j] = dp[i + 1][j - 1] + 2;
            } else {
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[0][n - 1];
}

// 测试用例
console.log(longestPalindromeSubseq("bbbab")); // 4 ("bbbb")
```

## 动态规划算法总结 🎯

| 问题类型 | 时间复杂度 | 空间复杂度 | 核心设计思想 |
|---------|-----------|-----------|-------------|
| 线性DP | O(n) ~ O(n²) | O(n) | 序列状态转移 |
| 背包DP | O(n*capacity) | O(capacity) | 选择决策优化 |
| 路径DP | O(m*n) | O(m*n) 或 O(n) | 路径状态累积 |
| 区间DP | O(n³) | O(n²) | 区间分割合并 |
| 状态压缩DP | O(n*2ⁿ) | O(2ⁿ) | 集合状态枚举 |
| 树形DP | O(n) | O(n) | 树结构递推 |

**设计思想总结**：
- **线性DP**：适用于序列问题，关注位置间的转移关系
- **背包DP**：适用于选择问题，关注容量和价值的权衡
- **路径DP**：适用于网格问题，关注路径的累积优化
- **区间DP**：适用于分治问题，关注区间的最优分割
- **状态压缩DP**：适用于集合问题，关注状态的高效表示
- **树形DP**：适用于树结构，关注父子节点的状态依赖 