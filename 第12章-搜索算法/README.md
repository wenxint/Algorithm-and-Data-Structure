# 第12章：搜索算法

## 概述 📚

搜索算法是计算机科学中最基础也是最重要的算法类别之一，用于在数据集合中查找特定元素或判断元素是否存在。搜索算法的效率直接影响程序的性能，从简单的线性搜索到复杂的哈希搜索，不同的搜索策略适用于不同的数据结构和应用场景。

## 基础搜索操作 🔧

### 线性搜索（顺序搜索）

```javascript
/**
 * 线性搜索
 * 核心思想：逐个检查每个元素，直到找到目标元素或遍历完整个数组
 * 
 * @param {Array} arr - 搜索数组
 * @param {*} target - 目标元素
 * @returns {number} 元素索引，未找到返回-1
 */
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;
        }
    }
    return -1;
}

// 使用示例
const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
console.log(linearSearch(numbers, 5));  // 4
console.log(linearSearch(numbers, 7));  // -1
```

### 二分搜索（折半搜索）

```javascript
/**
 * 二分搜索
 * 核心思想：在有序数组中，通过比较中间元素逐步缩小搜索范围
 * 
 * @param {Array} arr - 有序数组
 * @param {*} target - 目标元素
 * @returns {number} 元素索引，未找到返回-1
 */
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

// 使用示例
const sortedNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(binarySearch(sortedNumbers, 5));  // 4
console.log(binarySearch(sortedNumbers, 10)); // -1
```

### 插值搜索

```javascript
/**
 * 插值搜索
 * 核心思想：根据目标值在数组中的估计位置进行搜索，适用于均匀分布的有序数组
 * 
 * @param {Array} arr - 有序数组
 * @param {number} target - 目标数值
 * @returns {number} 元素索引，未找到返回-1
 */
function interpolationSearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right && target >= arr[left] && target <= arr[right]) {
        if (left === right) {
            return arr[left] === target ? left : -1;
        }
        
        // 插值公式：估算目标位置
        const pos = left + Math.floor(
            ((target - arr[left]) / (arr[right] - arr[left])) * (right - left)
        );
        
        if (arr[pos] === target) {
            return pos;
        } else if (arr[pos] < target) {
            left = pos + 1;
        } else {
            right = pos - 1;
        }
    }
    
    return -1;
}

// 使用示例
const uniformArray = [10, 20, 30, 40, 50, 60, 70, 80, 90];
console.log(interpolationSearch(uniformArray, 50));  // 4
```

### 指数搜索

```javascript
/**
 * 指数搜索
 * 核心思想：先找到包含目标元素的范围，然后在该范围内进行二分搜索
 * 
 * @param {Array} arr - 有序数组
 * @param {*} target - 目标元素
 * @returns {number} 元素索引，未找到返回-1
 */
function exponentialSearch(arr, target) {
    if (arr[0] === target) {
        return 0;
    }
    
    // 找到包含目标的范围
    let bound = 1;
    while (bound < arr.length && arr[bound] < target) {
        bound *= 2;
    }
    
    // 在找到的范围内进行二分搜索
    const left = Math.floor(bound / 2);
    const right = Math.min(bound, arr.length - 1);
    
    return binarySearchRange(arr, target, left, right);
}

function binarySearchRange(arr, target, left, right) {
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

// 使用示例
const largeArray = Array.from({length: 1000}, (_, i) => i * 2);
console.log(exponentialSearch(largeArray, 100));  // 50
```

## 搜索算法与其他算法的关系 💡

### 与排序算法的关系

```javascript
/**
 * 搜索前预处理：排序+二分搜索
 * 核心思想：对于频繁搜索的场景，先排序后使用二分搜索可以提高整体效率
 */
class PreprocessedSearch {
    constructor(data) {
        // 预处理：排序数据
        this.sortedData = [...data].sort((a, b) => a - b);
        this.originalIndices = new Map();
        
        // 建立原始索引映射
        data.forEach((value, index) => {
            if (!this.originalIndices.has(value)) {
                this.originalIndices.set(value, []);
            }
            this.originalIndices.get(value).push(index);
        });
    }
    
    search(target) {
        const sortedIndex = binarySearch(this.sortedData, target);
        if (sortedIndex === -1) {
            return -1;
        }
        
        // 返回原始数组中的索引
        return this.originalIndices.get(target)[0];
    }
    
    searchAll(target) {
        const exists = binarySearch(this.sortedData, target) !== -1;
        return exists ? this.originalIndices.get(target) || [] : [];
    }
}

// 使用示例
const data = [3, 1, 4, 1, 5, 9, 2, 6, 5];
const searcher = new PreprocessedSearch(data);
console.log(searcher.search(5));     // 4（第一个5的原始索引）
console.log(searcher.searchAll(5));  // [4, 8]（所有5的原始索引）
```

### 与哈希表的关系

```javascript
/**
 * 哈希搜索优化
 * 核心思想：使用哈希表实现O(1)平均时间复杂度的搜索
 */
class HashSearch {
    constructor(data) {
        this.hashMap = new Map();
        this.multiValueMap = new Map();
        
        // 建立哈希索引
        data.forEach((value, index) => {
            if (!this.hashMap.has(value)) {
                this.hashMap.set(value, index);  // 存储第一次出现的索引
            }
            
            if (!this.multiValueMap.has(value)) {
                this.multiValueMap.set(value, []);
            }
            this.multiValueMap.get(value).push(index);
        });
    }
    
    search(target) {
        return this.hashMap.get(target) ?? -1;
    }
    
    searchAll(target) {
        return this.multiValueMap.get(target) || [];
    }
    
    exists(target) {
        return this.hashMap.has(target);
    }
}

// 使用示例
const hashData = [3, 1, 4, 1, 5, 9, 2, 6, 5];
const hashSearcher = new HashSearch(hashData);
console.log(hashSearcher.search(5));     // 4
console.log(hashSearcher.searchAll(1));  // [1, 3]
console.log(hashSearcher.exists(10));    // false
```

### 与树结构的关系

```javascript
/**
 * 二叉搜索树搜索
 * 核心思想：利用二叉搜索树的有序性质进行高效搜索
 */
class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

class BSTSearch {
    constructor() {
        this.root = null;
    }
    
    insert(val) {
        this.root = this.insertHelper(this.root, val);
    }
    
    insertHelper(node, val) {
        if (!node) {
            return new TreeNode(val);
        }
        
        if (val < node.val) {
            node.left = this.insertHelper(node.left, val);
        } else {
            node.right = this.insertHelper(node.right, val);
        }
        
        return node;
    }
    
    search(target) {
        return this.searchHelper(this.root, target);
    }
    
    searchHelper(node, target) {
        if (!node || node.val === target) {
            return node !== null;
        }
        
        if (target < node.val) {
            return this.searchHelper(node.left, target);
        } else {
            return this.searchHelper(node.right, target);
        }
    }
    
    rangeSearch(min, max) {
        const result = [];
        this.rangeSearchHelper(this.root, min, max, result);
        return result;
    }
    
    rangeSearchHelper(node, min, max, result) {
        if (!node) return;
        
        if (node.val >= min && node.val <= max) {
            result.push(node.val);
        }
        
        if (node.val > min) {
            this.rangeSearchHelper(node.left, min, max, result);
        }
        
        if (node.val < max) {
            this.rangeSearchHelper(node.right, min, max, result);
        }
    }
}

// 使用示例
const bstSearch = new BSTSearch();
[5, 3, 7, 1, 9, 4, 6].forEach(val => bstSearch.insert(val));
console.log(bstSearch.search(4));         // true
console.log(bstSearch.search(8));         // false
console.log(bstSearch.rangeSearch(3, 7)); // [3, 4, 5, 6, 7]
```

## 核心搜索算法思想 🎯

### 1. 分治搜索思想

分治搜索通过将问题分解为较小的子问题来解决，二分搜索是最典型的分治搜索算法。

**核心概念**：
- 将搜索空间逐步缩小一半
- 利用数据的有序性质
- 时间复杂度为O(log n)

**解题思想**：
1. 选择中间位置的元素
2. 根据比较结果确定搜索方向
3. 递归或迭代地在子空间中继续搜索

**经典应用：查找峰值**

```javascript
/**
 * 查找峰值元素
 * 核心思想：使用二分搜索在无序数组中找到峰值
 */
function findPeakElement(nums) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] > nums[mid + 1]) {
            // 峰值在左侧（包括mid）
            right = mid;
        } else {
            // 峰值在右侧
            left = mid + 1;
        }
    }
    
    return left;
}

// 示例
console.log(findPeakElement([1, 2, 3, 1]));     // 2
console.log(findPeakElement([1, 2, 1, 3, 5, 6, 4])); // 1 或 5
```

### 2. 双指针搜索思想

双指针搜索使用两个指针从不同方向或位置进行搜索，高效解决各种搜索问题。

**核心概念**：
- 同向双指针：滑动窗口
- 相向双指针：两端逼近
- 快慢双指针：检测循环

**解题思想**：
1. 根据问题特性选择指针移动策略
2. 利用指针位置关系缩小搜索空间
3. 通过指针配合实现复杂条件判断

**经典应用：两数之和（有序数组）**

```javascript
/**
 * 两数之和 - 有序数组版本
 * 核心思想：使用相向双指针在有序数组中查找和为目标值的两个数
 */
function twoSumSorted(numbers, target) {
    let left = 0;
    let right = numbers.length - 1;
    
    while (left < right) {
        const sum = numbers[left] + numbers[right];
        
        if (sum === target) {
            return [left, right];
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return [-1, -1];
}

// 示例
console.log(twoSumSorted([2, 7, 11, 15], 9));  // [0, 1]
console.log(twoSumSorted([2, 3, 4], 6));       // [0, 2]
```

### 3. 模式匹配搜索思想

模式匹配搜索用于在文本中查找特定模式或子串，包括朴素匹配、KMP算法等。

**核心概念**：
- 字符串模式匹配
- 预处理优化匹配过程
- 避免不必要的回溯

**解题思想**：
1. 分析模式串的特征
2. 构建辅助数据结构（如失效函数）
3. 利用预处理信息跳过无效比较

**经典应用：KMP字符串匹配**

```javascript
/**
 * KMP字符串匹配算法
 * 核心思想：利用模式串的自身信息避免不必要的回溯
 */
function buildKMPTable(pattern) {
    const table = new Array(pattern.length).fill(0);
    let i = 1;
    let j = 0;
    
    while (i < pattern.length) {
        if (pattern[i] === pattern[j]) {
            j++;
            table[i] = j;
            i++;
        } else if (j > 0) {
            j = table[j - 1];
        } else {
            table[i] = 0;
            i++;
        }
    }
    
    return table;
}

function kmpSearch(text, pattern) {
    if (pattern.length === 0) return 0;
    
    const table = buildKMPTable(pattern);
    const results = [];
    let i = 0; // text index
    let j = 0; // pattern index
    
    while (i < text.length) {
        if (text[i] === pattern[j]) {
            i++;
            j++;
            
            if (j === pattern.length) {
                results.push(i - j);
                j = table[j - 1];
            }
        } else if (j > 0) {
            j = table[j - 1];
        } else {
            i++;
        }
    }
    
    return results;
}

// 示例
console.log(kmpSearch("ababcababa", "ababa"));  // [5]
console.log(kmpSearch("abababab", "abab"));     // [0, 2, 4]
```

### 4. 哈希搜索思想

哈希搜索通过哈希函数将键映射到存储位置，实现平均O(1)时间复杂度的搜索。

**核心概念**：
- 哈希函数设计
- 冲突处理策略
- 负载因子控制

**解题思想**：
1. 设计合适的哈希函数
2. 选择冲突解决方法
3. 动态调整哈希表大小

**经典应用：字符串哈希查找**

```javascript
/**
 * 滚动哈希字符串搜索
 * 核心思想：使用滚动哈希技术在文本中快速查找模式串
 */
class RollingHash {
    constructor(base = 256, mod = 1000000007) {
        this.base = base;
        this.mod = mod;
    }
    
    hash(str) {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = (h * this.base + str.charCodeAt(i)) % this.mod;
        }
        return h;
    }
    
    search(text, pattern) {
        if (pattern.length > text.length) {
            return [];
        }
        
        const patternHash = this.hash(pattern);
        const results = [];
        let textHash = this.hash(text.substring(0, pattern.length));
        
        // 计算base^(pattern.length-1) % mod
        let h = 1;
        for (let i = 0; i < pattern.length - 1; i++) {
            h = (h * this.base) % this.mod;
        }
        
        // 检查第一个窗口
        if (textHash === patternHash && 
            text.substring(0, pattern.length) === pattern) {
            results.push(0);
        }
        
        // 滚动哈希
        for (let i = pattern.length; i < text.length; i++) {
            // 移除最左边的字符，添加最右边的字符
            textHash = (textHash - (text.charCodeAt(i - pattern.length) * h) % this.mod + this.mod) % this.mod;
            textHash = (textHash * this.base + text.charCodeAt(i)) % this.mod;
            
            if (textHash === patternHash && 
                text.substring(i - pattern.length + 1, i + 1) === pattern) {
                results.push(i - pattern.length + 1);
            }
        }
        
        return results;
    }
}

// 示例
const rh = new RollingHash();
console.log(rh.search("abababab", "abab"));  // [0, 2, 4]
```

## 算法思想总结 🎯

| 搜索思想 | 时间复杂度 | 空间复杂度 | 核心设计理念 |
|---------|-----------|-----------|-------------|
| 分治搜索思想 | O(log n) | O(1) | 利用有序性质分割搜索空间 |
| 双指针搜索思想 | O(n) | O(1) | 通过指针配合缩小搜索范围 |
| 模式匹配搜索思想 | O(n+m) | O(m) | 预处理模式串避免无效回溯 |
| 哈希搜索思想 | O(1)平均 | O(n) | 通过哈希映射实现快速定位 |

**适用总结**：
- 分治搜索思想：适用于有序数据的精确查找和范围查询
- 双指针搜索思想：适用于数组中的组合查找和窗口问题
- 模式匹配搜索思想：适用于字符串匹配和文本处理
- 哈希搜索思想：适用于快速存在性判断和频次统计 