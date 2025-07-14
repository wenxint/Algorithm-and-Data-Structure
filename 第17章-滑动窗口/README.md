# 第17章 滑动窗口 📚

滑动窗口是一种重要的算法思想，通过维护一个可变大小的窗口在数组或字符串上滑动，高效解决子数组、子字符串相关问题。这种技术能将许多O(n²)的暴力算法优化到O(n)。

## 基础方法介绍 🔧

### 固定大小滑动窗口

固定窗口大小，在数组上从左到右滑动，适用于求固定长度子数组的最值、平均值等问题。

```javascript
/**
 * 固定大小滑动窗口模板
 * @param {number[]} nums - 输入数组
 * @param {number} k - 窗口大小
 * @return {number[]} 结果数组
 */
function fixedSizeWindow(nums, k) {
    if (!nums || nums.length < k) return [];

    const result = [];
    let windowSum = 0;

    // 初始化第一个窗口
    for (let i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    result.push(windowSum);

    // 滑动窗口
    for (let i = k; i < nums.length; i++) {
        windowSum = windowSum - nums[i - k] + nums[i]; // 移除左边，添加右边
        result.push(windowSum);
    }

    return result;
}

// 示例：计算长度为3的子数组平均值
const nums = [1, 12, -5, -6, 50, 3];
const k = 3;
const sums = fixedSizeWindow(nums, k);
console.log(sums); // [8, 1, 39, 47] -> 平均值: [2.67, 0.33, 13, 15.67]
```

### 可变大小滑动窗口

窗口大小根据条件动态调整，使用双指针技术，适用于寻找满足特定条件的最长或最短子数组。

```javascript
/**
 * 可变大小滑动窗口模板（寻找最长子数组）
 * @param {number[]} nums - 输入数组
 * @param {number} target - 目标值
 * @return {number} 最长子数组长度
 */
function variableSizeWindowMax(nums, target) {
    let left = 0;
    let windowSum = 0;
    let maxLength = 0;

    for (let right = 0; right < nums.length; right++) {
        windowSum += nums[right]; // 扩展窗口

        // 当窗口不满足条件时，收缩窗口
        while (windowSum > target && left <= right) {
            windowSum -= nums[left];
            left++;
        }

        // 更新最大长度
        if (windowSum <= target) {
            maxLength = Math.max(maxLength, right - left + 1);
        }
    }

    return maxLength;
}

// 示例：寻找和小于等于target的最长子数组
console.log(variableSizeWindowMax([1, 2, 3, 4, 5], 9)); // 4 ([1,2,3,3] 长度为4)
```

### 滑动窗口最值

使用双端队列维护窗口内的最大值或最小值，实现O(n)时间复杂度。

```javascript
/**
 * 滑动窗口最大值
 * @param {number[]} nums - 输入数组
 * @param {number} k - 窗口大小
 * @return {number[]} 每个窗口的最大值
 */
function maxSlidingWindow(nums, k) {
    const result = [];
    const deque = []; // 存储数组下标，保持递减顺序

    for (let i = 0; i < nums.length; i++) {
        // 移除窗口外的元素
        while (deque.length > 0 && deque[0] <= i - k) {
            deque.shift();
        }

        // 保持递减顺序，移除比当前元素小的元素
        while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
            deque.pop();
        }

        deque.push(i);

        // 当窗口大小达到k时，记录最大值
        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }

    return result;
}

// 示例：计算滑动窗口最大值
console.log(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // [3, 3, 5, 5, 6, 7]
```

## 数据结构间的关系 💡

### 与双指针的关系

滑动窗口本质上是双指针技术的特殊应用，两个指针代表窗口的左右边界。

```javascript
// 双指针基础模板
function twoPointers(nums, condition) {
    let left = 0;

    for (let right = 0; right < nums.length; right++) {
        // 扩展右指针

        while (left <= right && !satisfyCondition(left, right)) {
            // 收缩左指针
            left++;
        }

        // 处理当前窗口
    }
}
```

### 与队列的关系

在处理滑动窗口最值问题时，经常使用双端队列来维护窗口内元素的有序性。

```javascript
// 单调队列在滑动窗口中的应用
class MonotonicDeque {
    constructor() {
        this.deque = [];
    }

    // 在队尾添加元素，保持单调性
    pushBack(val) {
        while (this.deque.length > 0 && this.deque[this.deque.length - 1] < val) {
            this.deque.pop();
        }
        this.deque.push(val);
    }

    // 移除队首元素
    popFront() {
        return this.deque.shift();
    }

    // 获取队首元素（最大值）
    front() {
        return this.deque[0];
    }
}
```

## 核心算法思想 🎯

### 1. 固定窗口滑动思想

**概念定义**: 保持窗口大小不变，通过添加右边元素和移除左边元素来更新窗口状态。

**解题思想**: 避免重复计算，利用前一个窗口的结果来计算当前窗口的结果，实现O(n)时间复杂度。

**应用场景**: 计算固定长度子数组的和、平均值、最值等。

```javascript
/**
 * 长度为K的子数组的最大和
 */
function maxSubarraySum(nums, k) {
    if (nums.length < k) return null;

    let maxSum = 0;
    let windowSum = 0;

    // 计算第一个窗口的和
    for (let i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    maxSum = windowSum;

    // 滑动窗口计算其他窗口的和
    for (let i = k; i < nums.length; i++) {
        windowSum = windowSum - nums[i - k] + nums[i];
        maxSum = Math.max(maxSum, windowSum);
    }

    return maxSum;
}

// 示例
console.log(maxSubarraySum([2, 1, 5, 1, 3, 2], 3)); // 9 (5+1+3)
```

### 2. 动态窗口伸缩思想

**概念定义**: 根据问题条件动态调整窗口大小，通过双指针控制窗口的扩展和收缩。

**解题思想**: 用右指针扩展窗口直到满足条件，用左指针收缩窗口保持最优状态。

**应用场景**: 寻找满足条件的最长/最短子数组、无重复字符的最长子串等。

```javascript
/**
 * 无重复字符的最长子串
 */
function lengthOfLongestSubstring(s) {
    const charSet = new Set();
    let left = 0;
    let maxLength = 0;

    for (let right = 0; right < s.length; right++) {
        // 如果遇到重复字符，收缩窗口
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }

        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}

// 示例
console.log(lengthOfLongestSubstring("abcabcbb")); // 3 ("abc")
```

### 3. 单调队列优化思想

**概念定义**: 使用双端队列维护窗口内元素的单调性，快速获取窗口最值。

**解题思想**: 保持队列中元素按照单调递减（或递增）顺序排列，队首始终是当前窗口的最值。

**应用场景**: 滑动窗口最大值、滑动窗口最小值问题。

```javascript
/**
 * 滑动窗口最小值
 */
function minSlidingWindow(nums, k) {
    const result = [];
    const deque = []; // 存储下标，保持递增顺序

    for (let i = 0; i < nums.length; i++) {
        // 移除窗口外的元素
        while (deque.length > 0 && deque[0] <= i - k) {
            deque.shift();
        }

        // 保持递增顺序
        while (deque.length > 0 && nums[deque[deque.length - 1]] >= nums[i]) {
            deque.pop();
        }

        deque.push(i);

        if (i >= k - 1) {
            result.push(nums[deque[0]]);
        }
    }

    return result;
}

// 示例
console.log(minSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)); // [-1, -3, -3, -3, 3, 3]
```

## 算法思想总结 🎯

| 算法类型 | 时间复杂度 | 空间复杂度 | 适用场景 | 核心思想 |
|----------|------------|------------|----------|----------|
| 固定窗口 | O(n) | O(1) | 固定长度子数组问题 | 滑动更新，避免重复计算 |
| 动态窗口 | O(n) | O(k) | 可变长度子数组问题 | 双指针控制窗口伸缩 |
| 单调队列 | O(n) | O(k) | 窗口最值问题 | 维护单调性，快速查询 |
| 多重窗口 | O(n) | O(k) | 复杂条件判断 | 同时维护多个窗口状态 |

**设计思想对比**：
- **固定窗口**：简单直接，适合基础问题
- **动态窗口**：灵活性强，适合复杂条件
- **单调队列**：高效求最值，适合特殊需求
- **多重窗口**：功能强大，适合综合问题

**适用总结**：当需要在数组或字符串中寻找连续子序列，且子序列长度固定或需要满足特定条件时，使用滑动窗口技术能够显著提升算法效率。