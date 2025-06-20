# 第4章：哈希表 📊

哈希表是一种基于键值对（key-value pair）的数据结构，通过哈希函数将键映射到存储位置，实现平均O(1)时间复杂度的查找、插入和删除操作。在前端开发中，哈希表被广泛应用于缓存、状态管理、数据去重等场景。

## 1. 基础概念 🔧

### JavaScript中的哈希表实现

JavaScript提供了两种主要的哈希表实现：`Map` 和 `Object`。

#### Map 的基本操作

```javascript
const map = new Map();

// 插入键值对
map.set('name', 'John');
map.set('age', 25);
map.set(123, 'number key');

// 获取值
console.log(map.get('name')); // 'John'
console.log(map.get('age'));  // 25

// 检查键是否存在
console.log(map.has('name')); // true
console.log(map.has('city')); // false

// 删除键值对
map.delete('age');
console.log(map.has('age')); // false

// 获取大小
console.log(map.size); // 2

// 清空所有元素
map.clear();
console.log(map.size); // 0
```

#### Object 的基本操作

```javascript
const obj = {};

// 插入键值对
obj.name = 'John';
obj['age'] = 25;
obj[123] = 'number key';

// 获取值
console.log(obj.name);     // 'John'
console.log(obj['age']);   // 25

// 检查键是否存在
console.log('name' in obj);           // true
console.log(obj.hasOwnProperty('name')); // true

// 删除键值对
delete obj.age;
console.log('age' in obj); // false

// 获取所有键
console.log(Object.keys(obj)); // ['123', 'name']

// 获取大小
console.log(Object.keys(obj).length); // 2
```

### Map vs Object 比较

| 特性 | Map | Object |
|------|-----|--------|
| 键的类型 | 任意类型 | 字符串或Symbol |
| 大小获取 | `map.size` | `Object.keys(obj).length` |
| 迭代方式 | `for...of` | `for...in` |
| 原型 | 无默认键 | 有默认键（原型链） |
| 性能 | 频繁增删更优 | 作为记录更优 |

## 2. 常用方法详解 🛠️

### 访问方法

```javascript
const map = new Map([
    ['apple', 10],
    ['banana', 5],
    ['orange', 8]
]);

// 安全获取值（带默认值）
function getWithDefault(map, key, defaultValue) {
    return map.has(key) ? map.get(key) : defaultValue;
}

console.log(getWithDefault(map, 'apple', 0));  // 10
console.log(getWithDefault(map, 'grape', 0));  // 0

// 检查多个键是否存在
function hasAllKeys(map, keys) {
    return keys.every(key => map.has(key));
}

console.log(hasAllKeys(map, ['apple', 'banana'])); // true
console.log(hasAllKeys(map, ['apple', 'grape']));  // false
```

### 修改方法

```javascript
const counter = new Map();

// 安全递增计数
function increment(map, key, delta = 1) {
    map.set(key, (map.get(key) || 0) + delta);
}

increment(counter, 'clicks');
increment(counter, 'clicks');
increment(counter, 'views', 5);

console.log(counter); // Map(2) { 'clicks' => 2, 'views' => 5 }

// 批量设置
function setMultiple(map, entries) {
    for (const [key, value] of entries) {
        map.set(key, value);
    }
}

setMultiple(counter, [['downloads', 100], ['shares', 20]]);
```

### 转换方法

```javascript
const map = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3]
]);

// Map转数组
const entries = Array.from(map.entries());
console.log(entries); // [['a', 1], ['b', 2], ['c', 3]]

const keys = Array.from(map.keys());
console.log(keys); // ['a', 'b', 'c']

const values = Array.from(map.values());
console.log(values); // [1, 2, 3]

// Map转Object
const obj = Object.fromEntries(map);
console.log(obj); // { a: 1, b: 2, c: 3 }

// Object转Map
const newMap = new Map(Object.entries(obj));
console.log(newMap); // Map(3) { 'a' => 1, 'b' => 2, 'c' => 3 }
```

## 3. 核心算法思想 🎯

### 快速查找

**核心概念**：利用哈希表O(1)的查找特性，将"查找某个值是否存在"的问题转换为"在常数时间内检查键是否存在"。

**解题思想**：对于需要频繁查找的问题，先将数据存入哈希表，然后进行快速查找。

**经典应用**：两数之和问题

```javascript
/**
 * 两数之和
 * 核心思想：对于每个数字x，查找target-x是否存在
 */
function twoSum(nums, target) {
    const map = new Map(); // 值 -> 索引的映射
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}

// 示例
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
```

### 频次统计

**核心概念**：使用哈希表统计元素出现的频次，是解决计数类问题的基础模式。

**解题思想**：遍历数据，用哈希表记录每个元素的出现次数，然后根据频次进行后续处理。

**经典应用**：字符频次统计

```javascript
/**
 * 字符频次统计
 * 核心思想：用Map记录每个字符的出现次数
 */
function countCharacters(s) {
    const charCount = new Map();
    
    for (const char of s) {
        charCount.set(char, (charCount.get(char) || 0) + 1);
    }
    
    return charCount;
}

// 应用：找到第一个唯一字符
function firstUniqChar(s) {
    const charCount = countCharacters(s);
    
    for (let i = 0; i < s.length; i++) {
        if (charCount.get(s[i]) === 1) {
            return i;
        }
    }
    
    return -1;
}

console.log(firstUniqChar("leetcode")); // 0 (第一个'l')
```

### 分组归类

**核心概念**：根据某种规则将数据分组，哈希表的键表示分组标识，值表示该组的所有元素。

**解题思想**：为每个元素计算一个分组键（如排序后的字符串、余数等），相同键的元素归为一组。

**经典应用**：字母异位词分组

```javascript
/**
 * 字母异位词分组
 * 核心思想：异位词排序后的字符串相同，可作为分组键
 */
function groupAnagrams(strs) {
    const groups = new Map();
    
    for (const str of strs) {
        // 排序后的字符串作为分组键
        const key = str.split('').sort().join('');
        
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        
        groups.get(key).push(str);
    }
    
    return Array.from(groups.values());
}

console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
// [["eat","tea","ate"], ["tan","nat"], ["bat"]]
```

### 前缀和优化

**核心概念**：结合前缀和与哈希表，将子数组问题转换为两个前缀和的差值问题。

**数学原理**：如果 prefixSum[j] - prefixSum[i] = k，那么子数组 [i+1, j] 的和为 k。

**经典应用**：和为K的子数组

```javascript
/**
 * 和为K的子数组
 * 核心思想：前缀和 + 哈希表
 * 查找 prefixSum[i] = prefixSum[j] - k
 */
function subarraySum(nums, k) {
    const prefixSumCount = new Map();
    prefixSumCount.set(0, 1); // 重要：前缀和为0出现1次
    
    let prefixSum = 0;
    let count = 0;
    
    for (const num of nums) {
        prefixSum += num;
        
        // 查找是否存在前缀和等于 prefixSum - k
        const target = prefixSum - k;
        if (prefixSumCount.has(target)) {
            count += prefixSumCount.get(target);
        }
        
        // 更新当前前缀和的计数
        prefixSumCount.set(prefixSum, (prefixSumCount.get(prefixSum) || 0) + 1);
    }
    
    return count;
}

console.log(subarraySum([1, 1, 1], 2)); // 2 (子数组[1,1]出现2次)
```

### 缓存优化

**核心概念**：使用哈希表实现各种缓存策略，如LRU（最近最少使用）、LFU（最不经常使用）等。

**设计思想**：结合哈希表的快速查找和其他数据结构的有序性，实现高效的缓存管理。

**经典应用**：LRU缓存

```javascript
/**
 * LRU缓存实现
 * 核心思想：哈希表 + 双向链表
 * 哈希表提供O(1)查找，双向链表维护访问顺序
 */
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }
    
    get(key) {
        if (this.cache.has(key)) {
            // 重新插入到末尾（标记为最近使用）
            const value = this.cache.get(key);
            this.cache.delete(key);
            this.cache.set(key, value);
            return value;
        }
        return -1;
    }
    
    put(key, value) {
        if (this.cache.has(key)) {
            // 更新已存在的键
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            // 删除最久未使用的键（第一个键）
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        
        this.cache.set(key, value);
    }
}
```

## 4. 哈希冲突处理 ⚖️

### 链地址法（Chaining）

当多个键映射到同一个位置时，使用链表存储所有冲突的键值对。

```javascript
/**
 * 链地址法哈希表实现
 * 核心思想：每个桶存储一个链表，处理哈希冲突
 */
class HashMapChaining {
    constructor(initialCapacity = 16) {
        this.capacity = initialCapacity;
        this.size = 0;
        this.buckets = new Array(this.capacity).fill(null).map(() => []);
    }
    
    _hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash * 31 + key.charCodeAt(i)) % this.capacity;
        }
        return hash;
    }
    
    set(key, value) {
        const index = this._hash(key);
        const bucket = this.buckets[index];
        
        // 查找是否已存在
        for (let i = 0; i < bucket.length; i++) {
            if (bucket[i][0] === key) {
                bucket[i][1] = value; // 更新值
                return;
            }
        }
        
        // 添加新键值对
        bucket.push([key, value]);
        this.size++;
        
        // 检查是否需要扩容
        if (this.size > this.capacity * 0.75) {
            this._resize();
        }
    }
    
    get(key) {
        const index = this._hash(key);
        const bucket = this.buckets[index];
        
        for (const [k, v] of bucket) {
            if (k === key) return v;
        }
        
        return undefined;
    }
    
    _resize() {
        const oldBuckets = this.buckets;
        this.capacity *= 2;
        this.size = 0;
        this.buckets = new Array(this.capacity).fill(null).map(() => []);
        
        // 重新哈希所有元素
        for (const bucket of oldBuckets) {
            for (const [key, value] of bucket) {
                this.set(key, value);
            }
        }
    }
}
```

## 5. 算法思想总结 🎯

### 时间复杂度对比

| 操作 | 数组 | 链表 | 哈希表(平均) | 哈希表(最坏) |
|------|------|------|-------------|-------------|
| 查找 | O(n) | O(n) | O(1) | O(n) |
| 插入 | O(n) | O(1) | O(1) | O(n) |
| 删除 | O(n) | O(1) | O(1) | O(n) |

### 核心设计思想

1. **空间换时间**：使用额外的存储空间来实现快速查找
2. **哈希映射**：通过哈希函数将键转换为数组索引
3. **冲突处理**：使用链地址法或开放地址法处理哈希冲突
4. **动态扩容**：根据负载因子动态调整哈希表大小

### 适用场景总结

- **快速查找**：需要O(1)时间查找元素是否存在
- **频次统计**：统计元素出现次数，找出现频率高/低的元素
- **分组归类**：根据某种规则对数据进行分组
- **前缀和**：结合前缀和解决子数组相关问题
- **缓存实现**：实现各种缓存策略，提高访问效率

哈希表是解决查找、统计、分组类问题的重要工具，掌握其核心思想对于算法面试和实际开发都非常重要。 