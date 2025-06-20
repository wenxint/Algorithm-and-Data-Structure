# 第1章：数组与字符串

## 📚 章节概述

数组和字符串是编程中最基础的数据结构，在前端开发中无处不在：处理用户输入、操作DOM列表、数据转换等。本章将深入讲解处理数组和字符串问题的三大核心算法思想：**双指针技术**、**滑动窗口技术**和**前缀和技术**。

## 🔧 数组常见方法

### 访问和修改
```javascript
const arr = [1, 2, 3, 4, 5];

// 访问元素
console.log(arr[0]);          // 1 - 通过索引访问
console.log(arr.at(-1));      // 5 - 负索引访问（最后一个）
console.log(arr.length);      // 5 - 获取数组长度

// 修改元素
arr[0] = 10;                  // 直接赋值修改
console.log(arr);             // [10, 2, 3, 4, 5]
```

### 添加和删除元素
```javascript
const arr = [1, 2, 3];

// 末尾操作
arr.push(4);                  // [1, 2, 3, 4] - 末尾添加
const last = arr.pop();       // [1, 2, 3], last = 4 - 末尾删除

// 开头操作
arr.unshift(0);               // [0, 1, 2, 3] - 开头添加
const first = arr.shift();    // [1, 2, 3], first = 0 - 开头删除

// 任意位置操作
arr.splice(1, 1, 'a', 'b');   // [1, 'a', 'b', 3] - 删除1个元素，插入'a','b'
```

### 数组遍历
```javascript
const arr = [1, 2, 3, 4, 5];

// for循环遍历
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}

// for...of遍历值
for (const value of arr) {
    console.log(value);
}

// forEach方法
arr.forEach((value, index) => {
    console.log(`索引${index}: ${value}`);
});

// map方法（返回新数组）
const doubled = arr.map(x => x * 2);  // [2, 4, 6, 8, 10]
```

### 数组查找和过滤
```javascript
const arr = [1, 2, 3, 4, 5];

// 查找元素
const index = arr.indexOf(3);         // 2 - 查找元素索引
const exists = arr.includes(4);       // true - 检查元素是否存在
const found = arr.find(x => x > 3);   // 4 - 查找第一个满足条件的元素
const foundIndex = arr.findIndex(x => x > 3); // 3 - 查找索引

// 过滤元素
const filtered = arr.filter(x => x % 2 === 0); // [2, 4] - 过滤偶数
```

### 数组转换和聚合
```javascript
const arr = [1, 2, 3, 4, 5];

// 数组转换
const joined = arr.join('-');         // "1-2-3-4-5" - 连接成字符串
const sliced = arr.slice(1, 4);       // [2, 3, 4] - 切片（不修改原数组）
const reversed = [...arr].reverse();  // [5, 4, 3, 2, 1] - 反转
const sorted = [...arr].sort((a, b) => b - a); // [5, 4, 3, 2, 1] - 排序

// 数组聚合
const sum = arr.reduce((acc, cur) => acc + cur, 0);     // 15 - 求和
const max = arr.reduce((acc, cur) => Math.max(acc, cur)); // 5 - 最大值
```

## 🔧 字符串常见方法

### 访问和基本属性
```javascript
const str = "Hello World";

// 访问字符
console.log(str[0]);          // "H" - 通过索引访问
console.log(str.charAt(1));   // "e" - charAt方法
console.log(str.at(-1));      // "d" - 负索引访问
console.log(str.length);      // 11 - 字符串长度

// 字符编码
console.log(str.charCodeAt(0));    // 72 - 获取字符ASCII码
console.log(String.fromCharCode(72)); // "H" - 从ASCII码生成字符
```

### 字符串查找
```javascript
const str = "Hello World Hello";

// 查找子串
console.log(str.indexOf("Hello"));     // 0 - 第一次出现的位置
console.log(str.lastIndexOf("Hello")); // 12 - 最后一次出现的位置
console.log(str.includes("World"));    // true - 是否包含子串
console.log(str.startsWith("Hello"));  // true - 是否以指定字符串开头
console.log(str.endsWith("Hello"));    // true - 是否以指定字符串结尾
```

### 字符串截取和分割
```javascript
const str = "Hello World";

// 截取子串
console.log(str.slice(0, 5));      // "Hello" - 截取[0,5)
console.log(str.slice(-5));        // "World" - 从倒数第5个开始
console.log(str.substring(6, 11)); // "World" - 截取[6,11)
console.log(str.substr(6, 5));     // "World" - 从位置6开始，长度5

// 分割字符串
const words = str.split(" ");       // ["Hello", "World"] - 按空格分割
const chars = str.split("");        // ["H","e","l","l","o"," ","W"...] - 分割成字符
```

### 字符串变换
```javascript
const str = "  Hello World  ";

// 大小写转换
console.log(str.toLowerCase());     // "  hello world  "
console.log(str.toUpperCase());     // "  HELLO WORLD  "

// 去除空白
console.log(str.trim());            // "Hello World" - 去除两端空白
console.log(str.trimStart());       // "Hello World  " - 去除开头空白
console.log(str.trimEnd());         // "  Hello World" - 去除结尾空白

// 替换
console.log(str.replace("Hello", "Hi"));      // "  Hi World  " - 替换第一个
console.log(str.replaceAll("l", "L"));        // "  HeLLo WorLd  " - 替换所有
```

### 字符串拼接和重复
```javascript
const str1 = "Hello";
const str2 = "World";

// 字符串拼接
console.log(str1 + " " + str2);     // "Hello World" - 使用+运算符
console.log(str1.concat(" ", str2)); // "Hello World" - 使用concat方法
console.log(`${str1} ${str2}`);     // "Hello World" - 模板字符串

// 字符串重复
console.log("Hi".repeat(3));        // "HiHiHi" - 重复3次

// 字符串填充
console.log("5".padStart(3, "0"));  // "005" - 左侧填充到长度3
console.log("5".padEnd(3, "0"));    // "500" - 右侧填充到长度3
```

### 正则表达式相关
```javascript
const str = "Hello123World456";

// 正则匹配
console.log(str.match(/\d+/g));     // ["123", "456"] - 匹配所有数字
console.log(str.search(/\d/));      // 5 - 第一个数字的位置
console.log(str.replace(/\d+/g, "X")); // "HelloXWorldX" - 替换数字为X

// 测试匹配
const pattern = /^[A-Za-z]+$/;
console.log(pattern.test("Hello")); // true - 测试是否只包含字母
```

## 💡 数组与字符串的关系

### 相互转换
```javascript
// 字符串转数组
const str = "Hello";
const charArray = str.split("");    // ["H", "e", "l", "l", "o"]
const charArray2 = [...str];        // ["H", "e", "l", "l", "o"] - 扩展运算符
const charArray3 = Array.from(str); // ["H", "e", "l", "l", "o"] - Array.from

// 数组转字符串
const arr = ["H", "e", "l", "l", "o"];
const string = arr.join("");        // "Hello"
const string2 = arr.toString();     // "H,e,l,l,o" - 默认用逗号连接
```

### 共同特性
```javascript
// 都有length属性
console.log("Hello".length);        // 5
console.log([1,2,3].length);        // 3

// 都可以通过索引访问
console.log("Hello"[0]);            // "H"
console.log([1,2,3][0]);            // 1

// 都可以使用for...of遍历
for (const char of "Hello") {
    console.log(char);              // H e l l o
}

for (const item of [1,2,3]) {
    console.log(item);              // 1 2 3
}
```

## 🎯 双指针技术

### 核心思想

**双指针技术是使用两个指针在数据结构中移动来解决问题的方法**。根据指针移动方式的不同，分为三种模式：

1. **对撞指针**：两个指针从数组两端向中间移动
2. **快慢指针**：两个指针以不同速度移动
3. **同向双指针**：两个指针同方向移动，维护某种关系

### 解题思想

双指针的本质是**通过两个指针的协调移动，将二重循环优化为单重循环**，从而将时间复杂度从O(n²)降低到O(n)。

**什么时候使用双指针？**
- 需要在有序数组中查找配对元素
- 需要判断字符串或数组的对称性
- 需要在数组中移除或移动特定元素
- 需要处理回文相关问题

### 经典应用：对撞指针判断回文

**核心思想**：回文字符串从左读和从右读是相同的。我们可以用两个指针分别从字符串的头部和尾部开始，向中间移动并比较字符。

```javascript
/**
 * 判断字符串是否为回文
 * 核心思想：对撞指针从两端向中间移动，逐一比较对应字符
 */
function isPalindrome(s) {
    // 预处理：只保留字母和数字，转为小写
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');

    let left = 0;                     // 左指针从头开始
    let right = cleaned.length - 1;   // 右指针从尾开始

    while (left < right) {
        if (cleaned[left] !== cleaned[right]) {
            return false;  // 发现不匹配字符
        }
        left++;   // 左指针右移
        right--;  // 右指针左移
    }

    return true;  // 所有字符都匹配
}

// 调用示例
console.log(isPalindrome("A man a plan a canal Panama"));  // true
console.log(isPalindrome("race a car"));                   // false
```

### 经典应用：快慢指针移除元素

**核心思想**：使用快慢指针原地移除数组中的指定元素。慢指针指向下一个有效位置，快指针遍历数组寻找有效元素。

```javascript
/**
 * 原地移除数组中所有等于val的元素
 * 核心思想：快指针遍历，慢指针指向有效元素的存放位置
 */
function removeElement(nums, val) {
    let slow = 0;  // 慢指针：下一个有效元素的位置

    for (let fast = 0; fast < nums.length; fast++) {
        if (nums[fast] !== val) {
            nums[slow] = nums[fast];  // 复制有效元素
            slow++;                   // 慢指针前进
        }
    }

    return slow;  // 返回新数组长度
}

// 调用示例
const arr = [3, 2, 2, 3];
const newLength = removeElement(arr, 3);
console.log(arr.slice(0, newLength));  // [2, 2]
```

## 🎯 滑动窗口技术

### 核心思想

**滑动窗口是双指针技术的特殊应用，用于解决连续子数组或子字符串问题**。它维护一个动态大小的"窗口"，通过移动窗口的左右边界来寻找满足条件的子序列。

### 解题思想

滑动窗口的核心操作包括：
1. **扩展窗口**：右指针右移，将新元素纳入窗口
2. **收缩窗口**：左指针右移，将元素移出窗口
3. **维护窗口**：在移动过程中维护窗口的某种性质（如和、字符频次等）

**什么时候使用滑动窗口？**
- 寻找满足某种条件的连续子数组或子字符串
- 字符串匹配和模式搜索问题
- 需要在数组中寻找最长/最短的连续序列

### 经典应用：无重复字符的最长子串

**核心思想**：维护一个不包含重复字符的窗口，当遇到重复字符时，收缩左边界直到窗口内无重复字符。

```javascript
/**
 * 找到字符串中无重复字符的最长子串长度
 * 核心思想：滑动窗口 + 哈希表记录字符位置
 */
function lengthOfLongestSubstring(s) {
    const charIndex = new Map();  // 记录字符最后出现的位置
    let left = 0;                 // 窗口左边界
    let maxLength = 0;            // 最大长度

    for (let right = 0; right < s.length; right++) {
        const char = s[right];

        // 如果字符已存在且在当前窗口内
        if (charIndex.has(char) && charIndex.get(char) >= left) {
            left = charIndex.get(char) + 1;  // 移动左边界
        }

        charIndex.set(char, right);          // 更新字符位置
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}

// 调用示例
console.log(lengthOfLongestSubstring("abcabcbb"));  // 3 ("abc")
console.log(lengthOfLongestSubstring("bbbbb"));     // 1 ("b")
console.log(lengthOfLongestSubstring("pwwkew"));    // 3 ("wke")
```

### 经典应用：最小长度子数组

**核心思想**：寻找和大于等于目标值的最短连续子数组。右指针扩展窗口增加元素，当满足条件时左指针收缩窗口寻找最小长度。

```javascript
/**
 * 找到和大于等于target的最小长度连续子数组
 * 核心思想：滑动窗口动态调整大小
 */
function minSubArrayLen(target, nums) {
    let left = 0;              // 窗口左边界
    let sum = 0;               // 当前窗口和
    let minLength = Infinity;  // 最小长度

    for (let right = 0; right < nums.length; right++) {
        sum += nums[right];  // 扩展窗口

        // 当窗口和满足条件时，尝试收缩窗口
        while (sum >= target) {
            minLength = Math.min(minLength, right - left + 1);
            sum -= nums[left];
            left++;
        }
    }

    return minLength === Infinity ? 0 : minLength;
}

// 调用示例
console.log(minSubArrayLen(7, [2,3,1,2,4,3]));  // 2 (子数组[4,3])
console.log(minSubArrayLen(4, [1,4,4]));        // 1 (子数组[4])
console.log(minSubArrayLen(11, [1,1,1,1,1]));   // 0 (无解)
```

## 🎯 前缀和技术

### 核心思想与概念讲解

**前缀和（Prefix Sum）是一种预处理技术，用于快速计算数组任意区间的元素和**。

**什么是前缀和？**
对于数组`arr = [a₀, a₁, a₂, ..., aₙ₋₁]`，前缀和数组`prefixSum`定义为：
- `prefixSum[0] = 0`（空前缀）
- `prefixSum[i] = a₀ + a₁ + ... + a_{i-1}`（前i个元素的和）

**为什么需要前缀和？**
在没有前缀和的情况下，计算区间`[left, right]`的元素和需要遍历该区间的所有元素，时间复杂度为O(n)。而使用前缀和后，任意区间的和可以通过两次数组访问计算得出：

```
区间[left, right]的和 = prefixSum[right + 1] - prefixSum[left]
```

这将区间求和的时间复杂度从O(n)优化到O(1)。

### 解题思想

前缀和技术的核心是**空间换时间**的思想：
1. **预处理阶段**：花费O(n)时间和O(n)空间构建前缀和数组
2. **查询阶段**：花费O(1)时间回答任意区间和查询

**什么时候使用前缀和？**
- 需要频繁查询数组区间和
- 子数组和相关问题（如和为K的子数组个数）
- 二维矩阵的区域和计算

### 基础应用：一维前缀和

```javascript
/**
 * 一维前缀和实现
 * 核心思想：预计算累积和，使区间查询变为O(1)操作
 */
class PrefixSum {
    constructor(nums) {
        // 构建前缀和数组，额外添加一个0便于计算
        this.prefixSum = [0];

        for (let i = 0; i < nums.length; i++) {
            this.prefixSum[i + 1] = this.prefixSum[i] + nums[i];
        }
    }

    /**
     * 查询区间[left, right]的元素和
     */
    rangeSum(left, right) {
        return this.prefixSum[right + 1] - this.prefixSum[left];
    }
}

// 调用示例
const nums = [1, 3, 5, 7, 9];
const prefixSum = new PrefixSum(nums);

console.log(prefixSum.rangeSum(1, 3));  // 15 (3+5+7)
console.log(prefixSum.rangeSum(0, 4));  // 25 (1+3+5+7+9)
console.log(prefixSum.rangeSum(2, 2));  // 5  (只有元素5)
```

### 进阶应用：子数组和为K的个数

**核心思想**：结合前缀和与哈希表。对于每个位置i，如果存在位置j使得`prefixSum[i] - prefixSum[j] = k`，那么子数组`[j+1, i]`的和就等于k。

```javascript
/**
 * 计算数组中和为k的连续子数组个数
 * 核心思想：前缀和 + 哈希表
 */
function subarraySum(nums, k) {
    const prefixSumCount = new Map();  // 记录前缀和出现次数
    prefixSumCount.set(0, 1);          // 空前缀和为0，出现1次

    let prefixSum = 0;  // 当前前缀和
    let count = 0;      // 满足条件的子数组个数

    for (const num of nums) {
        prefixSum += num;  // 更新前缀和

        // 查找是否存在前缀和为(prefixSum - k)的位置
        if (prefixSumCount.has(prefixSum - k)) {
            count += prefixSumCount.get(prefixSum - k);
        }

        // 更新当前前缀和的出现次数
        prefixSumCount.set(prefixSum, (prefixSumCount.get(prefixSum) || 0) + 1);
    }

    return count;
}

// 调用示例
console.log(subarraySum([1, 1, 1], 2));     // 2 ([1,1], [1,1])
console.log(subarraySum([1, 2, 3], 3));     // 2 ([3], [1,2])
console.log(subarraySum([1, -1, 0], 0));    // 3 ([1,-1], [0], [1,-1,0])
```

### 二维前缀和

**核心思想**：扩展一维前缀和到二维矩阵，计算从左上角(0,0)到任意位置的矩形区域和。

```javascript
/**
 * 二维前缀和实现
 * 核心思想：使用容斥原理计算矩形区域和
 */
class Matrix2DSum {
    constructor(matrix) {
        if (!matrix || !matrix.length) return;

        const m = matrix.length;
        const n = matrix[0].length;

        // 创建(m+1)×(n+1)的前缀和数组
        this.prefixSum = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));

        // 构建二维前缀和
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                this.prefixSum[i][j] = matrix[i-1][j-1]        // 当前元素
                    + this.prefixSum[i-1][j]      // 上方区域和
                    + this.prefixSum[i][j-1]      // 左方区域和
                    - this.prefixSum[i-1][j-1];   // 减去重复的左上角
            }
        }
    }

    /**
     * 计算矩形区域(row1,col1)到(row2,col2)的元素和
     * 使用容斥原理：总和 = 右下 - 左边 - 上边 + 左上角
     */
    sumRegion(row1, col1, row2, col2) {
        return this.prefixSum[row2 + 1][col2 + 1]
            - this.prefixSum[row1][col2 + 1]      // 减去上边区域
            - this.prefixSum[row2 + 1][col1]      // 减去左边区域
            + this.prefixSum[row1][col1];         // 加回重复减去的部分
    }
}

// 调用示例
const matrix = [
    [3, 0, 1, 4, 2],
    [5, 6, 3, 2, 1],
    [1, 2, 0, 1, 5],
    [4, 1, 0, 1, 7]
];

const matrix2D = new Matrix2DSum(matrix);
console.log(matrix2D.sumRegion(2, 1, 3, 3));  // 8 (2+0+1+1+0+1 = 5)
console.log(matrix2D.sumRegion(1, 1, 2, 2));  // 11 (6+3+2+0 = 11)
```

## 🎯 算法思想总结

### 时间复杂度对比

| 问题类型 | 暴力解法 | 优化解法 | 优化思想 |
|---------|---------|---------|----------|
| 两数之和 | O(n²) | O(n) - 双指针 | 有序数组对撞指针 |
| 子串问题 | O(n³) | O(n) - 滑动窗口 | 动态维护窗口状态 |
| 区间求和 | O(n) | O(1) - 前缀和 | 预处理空间换时间 |

### 核心设计思想

1. **双指针技术**：通过指针协调移动，将嵌套循环优化为单层循环
2. **滑动窗口技术**：动态维护数据子集，避免重复计算
3. **前缀和技术**：预处理数据结构，将查询时间复杂度降为常数

这三种技术是解决数组和字符串问题的核心工具，掌握它们的思想和应用场景，就能解决大部分相关算法问题。