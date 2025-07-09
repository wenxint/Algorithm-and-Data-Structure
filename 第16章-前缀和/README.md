# 第16章 前缀和 📊

前缀和是一种重要的预处理技术，通过预计算累积和来实现区间查询的O(1)时间复杂度。它是解决区间和查询、子数组问题的核心工具，在数组处理和算法优化中有着广泛应用。

## 基础概念介绍 🔧

### 一维前缀和

1. **预处理**：构建一个前缀和数组 `prefix`，其中 `prefix[i]` 表示原数组 `nums[0] + nums[1] + ... + nums[i-1]`（或根据定义可能包含 `nums[i]`，需明确边界）。
2. **快速查询**：通过 `prefix[r+1] - prefix[l]` 快速计算原数组区间 `[l, r]` 的和。

#### 定义与构建

```javascript
/**
 * 一维前缀和数组构建
 *
 * 核心思想：
 * prefixSum[i] = arr[0] + arr[1] + ... + arr[i-1]
 * prefixSum[0] = 0，便于处理边界情况
 *
 * @param {number[]} arr - 原数组
 * @returns {number[]} 前缀和数组
 */
function buildPrefixSum(nums) {
    const n = nums.length;
    const prefix = new Array(n + 1).fill(0); // prefix[0] = 0
    for (let i = 1; i <= n; i++) {
        prefix[i] = prefix[i - 1] + nums[i - 1]; // nums从0开始，prefix从1开始
    }
    return prefix;
}

// 示例
const arr = [1, 2, 3, 4, 5];
const prefixSum = buildPrefixSum(arr);
console.log(prefixSum); // [0, 1, 3, 6, 10, 15]
```

#### 区间和查询

```javascript
/**
 * 查询区间[left, right]的和（包含两端）
 *
 * 核心公式：
 * sum(left, right) = prefixSum[right + 1] - prefixSum[left]
 *
 * @param {number[]} prefixSum - 前缀和数组
 * @param {number} left - 左端点索引
 * @param {number} right - 右端点索引
 * @returns {number} 区间和
 */
function rangeSum(prefixSum, left, right) {
    return prefixSum[right + 1] - prefixSum[left];
}

// 示例：查询arr[1..3]的和
console.log(rangeSum(prefixSum, 1, 3)); // 2 + 3 + 4 = 9
```

### 二维前缀和

#### 递推公式推导过程 📐

**核心定义**：`prefixSum[i][j]` 表示从矩阵左上角 `(0,0)` 到位置 `(i-1,j-1)` 的矩形区域内所有元素的和。

**推导思路**：要计算 `prefixSum[i][j]`，我们可以利用已经计算好的相邻区域的前缀和。

```
递推公式：
prefixSum[i][j] = prefixSum[i-1][j]
                + prefixSum[i][j-1]
                - prefixSum[i-1][j-1] + matrix[i-1][j-1]
```

#### 图形化推导过程 🎨

假设我们有一个矩阵，要计算到位置 `(i,j)` 的前缀和：

```
原始矩阵 matrix:
┌─────┬─────┬─────┬─────┐
│  1  │  2  │  3  │  4  │
├─────┼─────┼─────┼─────┤
│  5  │  6  │  7  │  8  │
├─────┼─────┼─────┼─────┤
│  9  │ 10  │ 11  │ 12  │
├─────┼─────┼─────┼─────┤
│ 13  │ 14  │ 15  │ 16  │
└─────┴─────┴─────┴─────┘
```

**步骤1：理解问题**
我们要计算 `prefixSum[2][2]`（即从(0,0)到(1,1)的区域和）

```
目标区域（我们要计算的区域）:
┌─────┬─────┐
│  1  │  2  │ ← 这个区域的和
├─────┼─────┤
│  5  │  6  │ ← 就是 1+2+5+6 = 14
└─────┴─────┘
```

**步骤2：分解子问题**
我们可以利用三个已知的子区域：

```
prefixSum[1][2] (上方区域):
┌─────┬─────┐
│  1  │  2  │ = 3
└─────┴─────┘

prefixSum[2][1] (左方区域):
┌─────┐
│  1  │ = 1
├─────┤
│  5  │ = 5
└─────┘
总和 = 6

prefixSum[1][1] (左上重叠区域):
┌─────┐
│  1  │ = 1
└─────┘
```

**步骤3：容斥原理应用**

```
直接相加会重复计算重叠区域：

  prefixSum[1][2]     +     prefixSum[2][1]
┌─────┬─────┐           ┌─────┐
│  1  │  2  │     +     │  1  │ ← 这个1被计算了两次！
├─────┼─────┤           ├─────┤
│     │     │           │  5  │
└─────┴─────┘           └─────┘
     = 3                   = 6
```

**步骤4：减去重叠部分**

```
prefixSum[1][2] + prefixSum[2][1] - prefixSum[1][1] + matrix[1][1]
      3         +         6        -         1        +     6     = 14

解释：
- prefixSum[1][2] = 3 (区域1+2)
- prefixSum[2][1] = 6 (区域1+5)
- prefixSum[1][1] = 1 (重叠的区域1，需要减去)
- matrix[1][1] = 6 (当前位置的值，需要加上)
```

#### 完整图解示例 🖼️

让我们用具体数值演示整个过程：

```
原矩阵:
     j=0  j=1  j=2
i=0   1    2    3
i=1   4    5    6

构建前缀和矩阵 prefixSum（大小为 (m+1)×(n+1)，包含哨兵）:
        j=0  j=1  j=2  j=3
   i=0   0    0    0    0     ← 哨兵行
   i=1   0    1    3    6     ← prefixSum[1][1]=1, prefixSum[1][2]=3, prefixSum[1][3]=6
   i=2   0    5   12   21     ← prefixSum[2][1]=5, prefixSum[2][2]=12, prefixSum[2][3]=21
```

**计算 prefixSum[2][2] = 12 的过程：**

```
步骤分解：
1. prefixSum[1][2] = 3    (上方区域: 1+2)
2. prefixSum[2][1] = 5    (左方区域: 1+4)
3. prefixSum[1][1] = 1    (重叠区域: 1)
4. matrix[1][1] = 5       (当前位置值)

计算：3 + 5 - 1 + 5 = 12

验证：实际区域和 = 1+2+4+5 = 12 ✅
```

#### 递推公式的数学本质 🧮

```
prefixSum[i][j] 表示这个矩形区域的和：
┌─────┬─────┬─────┬─── ... ──┬─────┐
│(0,0)│     │     │         │     │
├─────┼─────┼─────┼─── ... ──┼─────┤
│     │     │     │         │     │
├─────┼─────┼─────┼─── ... ──┼─────┤
│     │     │     │         │     │
├─────┼─────┼─────┼─── ... ──┼─────┤
│     │     │     │         │(i-1,│
│     │     │     │         │j-1) │
└─────┴─────┴─────┴─── ... ──┴─────┘

递推分解：
┌─────────────┐  ┌─────┐     ┌─────┐      ┌─────┐
│prefixSum    │+ │     │  -  │重叠 │  +   │当前 │
│[i-1][j]     │  │prefix│     │区域 │      │元素 │
│             │  │Sum   │     │[i-1]│      │     │
│             │  │[i][j-│     │[j-1]│      │     │
└─────────────┘  │1]   │     └─────┘      └─────┘
                 └─────┘
```

#### 矩阵前缀和构建

```javascript
/**
 * 二维前缀和矩阵构建
 *
 * 核心思想：
 * prefixSum[i][j] = 从(0,0)到(i-1,j-1)的矩形区域和
 *
 * 递推公式详解：
 * prefixSum[i][j] = prefixSum[i-1][j]    // 上方矩形区域
 *                 + prefixSum[i][j-1]    // 左方矩形区域
 *                 - prefixSum[i-1][j-1]  // 减去重叠的左上角区域（被算了两次）
 *                 + matrix[i-1][j-1]     // 加上当前位置的元素值
 *
 * 为什么这样设计：
 * 1. prefixSum[i-1][j] 包含了上方所有区域
 * 2. prefixSum[i][j-1] 包含了左方所有区域
 * 3. 两者相加时，左上角区域被重复计算，需要减去
 * 4. 最后加上当前位置的值完成计算
 *
 * @param {number[][]} matrix - 原矩阵
 * @returns {number[][]} 二维前缀和矩阵
 */
function build2DPrefixSum(matrix) {
    if (!matrix || matrix.length === 0) return [];

    const m = matrix.length;
    const n = matrix[0].length;
    // 创建 (m+1)×(n+1) 的前缀和矩阵，第0行和第0列作为哨兵
    const prefixSum = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));

    console.log("开始构建二维前缀和...");
    console.log("原矩阵:");
    matrix.forEach((row, i) => {
        console.log(`第${i}行: [${row.join(', ')}]`);
    });

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            // 应用递推公式
            const upperArea = prefixSum[i-1][j];      // 上方区域
            const leftArea = prefixSum[i][j-1];       // 左方区域
            const overlapArea = prefixSum[i-1][j-1];  // 重叠区域
            const currentValue = matrix[i-1][j-1];    // 当前元素

            prefixSum[i][j] = upperArea + leftArea - overlapArea + currentValue;

            console.log(`计算 prefixSum[${i}][${j}]:`);
            console.log(`  = ${upperArea}(上) + ${leftArea}(左) - ${overlapArea}(重叠) + ${currentValue}(当前)`);
            console.log(`  = ${prefixSum[i][j]}`);
        }
    }

    console.log("\n最终前缀和矩阵:");
    prefixSum.forEach((row, i) => {
        console.log(`第${i}行: [${row.join(', ')}]`);
    });

    return prefixSum;
}

// 详细示例演示
const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

console.log("=== 二维前缀和构建演示 ===");
const prefixSum2D = build2DPrefixSum(matrix);

// 验证几个位置的计算
console.log("\n=== 验证计算结果 ===");
console.log("prefixSum[1][1] = 1 (仅包含matrix[0][0])");
console.log("prefixSum[1][2] = 3 (包含matrix[0][0] + matrix[0][1])");
console.log("prefixSum[2][2] = 12 (包含左上角2×2矩形: 1+2+4+5)");
console.log("prefixSum[3][3] = 45 (整个矩阵的和: 1+2+...+9)");
```

#### 矩形区域和查询

```javascript
/**
 * 查询矩形区域的和
 *
 * 容斥原理：
 * sum = prefixSum[row2+1][col2+1] - prefixSum[row1][col2+1]
 *     - prefixSum[row2+1][col1] + prefixSum[row1][col1]
 *
 * @param {number[][]} prefixSum - 二维前缀和矩阵
 * @param {number} row1 - 左上角行索引
 * @param {number} col1 - 左上角列索引
 * @param {number} row2 - 右下角行索引
 * @param {number} col2 - 右下角列索引
 * @returns {number} 矩形区域和
 */
function rangeSum2D(prefixSum, row1, col1, row2, col2) {
    return prefixSum[row2 + 1][col2 + 1] - prefixSum[row1][col2 + 1]
         - prefixSum[row2 + 1][col1] + prefixSum[row1][col1];
}

// 示例：查询从(0,0)到(1,1)的矩形区域和
console.log(rangeSum2D(prefixSum2D, 0, 0, 1, 1)); // 1+2+4+5 = 12
```

## 核心算法思想 🎯

### 子数组和问题

#### 和为K的子数组

```javascript
/**
 * 统计和为k的子数组个数
 *
 * 核心思想：
 * 利用前缀和 + 哈希表优化
 * 如果存在prefixSum[j] - prefixSum[i] = k
 * 那么子数组arr[i...j-1]的和为k
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 目标和
 * @returns {number} 满足条件的子数组个数
 */
function subarraySum(nums, k) {
    const prefixSumCount = new Map();
    prefixSumCount.set(0, 1); // 前缀和为0的情况

    let prefixSum = 0;
    let count = 0;

    for (const num of nums) {
        prefixSum += num;

        // 查找prefixSum - k是否存在
        if (prefixSumCount.has(prefixSum - k)) {
            count += prefixSumCount.get(prefixSum - k);
        }

        // 更新当前前缀和的计数
        prefixSumCount.set(prefixSum, (prefixSumCount.get(prefixSum) || 0) + 1);
    }

    return count;
}

// 示例
console.log(subarraySum([1, 1, 1], 2)); // 2，子数组[1,1]出现2次
console.log(subarraySum([1, 2, 3], 3)); // 2，子数组[3]和[1,2]
```

#### 连续子数组的最大和（Kadane算法的前缀和理解）

```javascript
/**
 * 连续子数组的最大和
 *
 * 前缀和视角的理解：
 * 在所有可能的prefixSum[j] - prefixSum[i]中找最大值
 * 等价于找最大的prefixSum[j] - 最小的prefixSum[i]
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 最大子数组和
 */
function maxSubArray(nums) {
    let maxSum = nums[0];
    let minPrefixSum = 0; // 最小前缀和
    let prefixSum = 0;

    for (const num of nums) {
        prefixSum += num;
        // 当前前缀和减去之前的最小前缀和
        maxSum = Math.max(maxSum, prefixSum - minPrefixSum);
        // 更新最小前缀和
        minPrefixSum = Math.min(minPrefixSum, prefixSum);
    }

    return maxSum;
}

// 示例
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
```

### 差分数组

#### 区间修改的优化

```javascript
/**
 * 差分数组实现区间修改
 *
 * 核心思想：
 * 差分数组diff[i] = arr[i] - arr[i-1]
 * 区间[left, right]加上val：diff[left] += val, diff[right+1] -= val
 * 最后前缀和重构原数组
 *
 * @param {number[]} arr - 原数组
 * @param {number[][]} updates - 更新操作[[left, right, val], ...]
 * @returns {number[]} 更新后的数组
 */
function applyRangeUpdates(arr, updates) {
    const n = arr.length;
    const diff = new Array(n + 1).fill(0);

    // 构建初始差分数组
    for (let i = 0; i < n; i++) {
        diff[i] = arr[i] - (i > 0 ? arr[i-1] : 0);
    }

    // 应用区间更新
    for (const [left, right, val] of updates) {
        diff[left] += val;
        if (right + 1 < n) {
            diff[right + 1] -= val;
        }
    }

    // 重构数组
    const result = new Array(n);
    result[0] = diff[0];
    for (let i = 1; i < n; i++) {
        result[i] = result[i-1] + diff[i];
    }

    return result;
}

// 示例
const originalArr = [1, 2, 3, 4, 5];
const updates = [[1, 3, 2], [2, 4, 3]]; // [1,3]区间+2，[2,4]区间+3
console.log(applyRangeUpdates(originalArr, updates)); // [1, 4, 8, 9, 8]
```

### 前缀异或

#### 子数组异或问题

```javascript
/**
 * 异或前缀和应用
 *
 * 核心性质：
 * A ⊕ A = 0, A ⊕ 0 = A
 * prefixXor[j] ⊕ prefixXor[i] = arr[i+1] ⊕ ... ⊕ arr[j]
 *
 * @param {number[]} arr - 输入数组
 * @param {number} target - 目标异或值
 * @returns {number} 异或值为target的子数组个数
 */
function subarrayXOR(arr, target) {
    const prefixXorCount = new Map();
    prefixXorCount.set(0, 1);

    let prefixXor = 0;
    let count = 0;

    for (const num of arr) {
        prefixXor ^= num;

        // 查找prefixXor ^ target是否存在
        const needed = prefixXor ^ target;
        if (prefixXorCount.has(needed)) {
            count += prefixXorCount.get(needed);
        }

        prefixXorCount.set(prefixXor, (prefixXorCount.get(prefixXor) || 0) + 1);
    }

    return count;
}

// 示例
console.log(subarrayXOR([4, 2, 2, 6, 4], 6)); // 4个子数组
```

## 算法思想总结 🎯

### 复杂度对比


| 操作类型     | 暴力解法 | 前缀和优化 | 空间复杂度 |
| ------------ | -------- | ---------- | ---------- |
| 区间和查询   | O(n)     | O(1)       | O(n)       |
| 多次区间查询 | O(m×n)  | O(n+m)     | O(n)       |
| 二维区域查询 | O(m×n)  | O(1)       | O(m×n)    |
| 区间修改     | O(n)     | O(1)       | O(n)       |

### 设计思想

**空间换时间**：通过预处理和额外存储空间，将查询时间复杂度从O(n)降到O(1)

**容斥原理**：二维前缀和利用容斥原理计算矩形区域和，避免重复计算

**数学变换**：将复杂的区间问题转化为简单的前缀和相减问题

**差分思想**：差分数组是前缀和的逆运算，用于优化区间修改操作

### 适用场景总结

- **频繁区间查询**：多次查询数组区间和时使用前缀和
- **子数组问题**：结合哈希表解决和为K的子数组等问题
- **矩阵区域查询**：二维前缀和处理矩形区域和查询
- **区间批量修改**：差分数组优化多次区间修改操作
- **异或运算**：前缀异或解决子数组异或问题
