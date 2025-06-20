/**
 * 第4章：哈希表 - 算法实现
 *
 * 本文件包含：
 * 1. 快速查找算法：两数之和、三数之和
 * 2. 频次统计算法：字符统计、异位词检测
 * 3. 分组归类算法：字母异位词分组
 * 4. 前缀和算法：和为K的子数组
 * 5. 缓存优化算法：LRU缓存
 *
 * @author Algorithm Tutorial
 * @date 2024
 */

// ==================== 快速查找算法 ====================

/**
 * 两数之和
 *
 * 核心思想：
 * 利用哈希表的O(1)查找特性，一次遍历即可找到答案
 * 对于每个数字x，查找target-x是否存在于已遍历的数字中
 *
 * @param {number[]} nums - 数字数组
 * @param {number} target - 目标和
 * @returns {number[]} 两个数的索引
 * @time O(n) - 遍历数组一次
 * @space O(n) - 哈希表空间
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

/**
 * 三数之和
 *
 * 核心思想：
 * 固定一个数，对剩余数组使用两数之和的思路
 * 使用哈希表优化查找过程，注意去重处理
 *
 * @param {number[]} nums - 数字数组
 * @returns {number[][]} 所有不重复的三元组
 * @time O(n²) - 外层循环O(n)，内层哈希查找O(n)
 * @space O(n) - 哈希表空间
 */
function threeSum(nums) {
    if (nums.length < 3) return [];

    nums.sort((a, b) => a - b); // 排序便于去重
    const result = [];

    for (let i = 0; i < nums.length - 2; i++) {
        // 跳过重复的第一个数
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        const target = -nums[i];
        const seen = new Set();

        for (let j = i + 1; j < nums.length; j++) {
            const complement = target - nums[j];

            if (seen.has(complement)) {
                result.push([nums[i], complement, nums[j]]);

                // 跳过重复的第二个数
                while (j + 1 < nums.length && nums[j] === nums[j + 1]) {
                    j++;
                }
            }

            seen.add(nums[j]);
        }
    }

    return result;
}

/**
 * 四数相加 II
 *
 * 核心思想：
 * 将四个数组分成两组，分别计算前两个数组的和与后两个数组的和
 * 使用哈希表统计前两个数组和的频次，然后查找匹配的后两个数组的和
 *
 * @param {number[]} nums1 - 第一个数组
 * @param {number[]} nums2 - 第二个数组
 * @param {number[]} nums3 - 第三个数组
 * @param {number[]} nums4 - 第四个数组
 * @returns {number} 四元组的数量
 * @time O(n²) - 两次双重循环
 * @space O(n²) - 哈希表最多存储n²个和
 */
function fourSumCount(nums1, nums2, nums3, nums4) {
    const sumCount = new Map();

    // 统计前两个数组所有可能的和
    for (const num1 of nums1) {
        for (const num2 of nums2) {
            const sum = num1 + num2;
            sumCount.set(sum, (sumCount.get(sum) || 0) + 1);
        }
    }

    let count = 0;

    // 查找后两个数组的和是否能与前面的和相加为0
    for (const num3 of nums3) {
        for (const num4 of nums4) {
            const sum = num3 + num4;
            const target = -sum;

            if (sumCount.has(target)) {
                count += sumCount.get(target);
            }
        }
    }

    return count;
}

// ==================== 频次统计算法 ====================

/**
 * 字符的第一个唯一字符
 *
 * 核心思想：
 * 两次遍历：第一次统计频次，第二次找第一个频次为1的字符
 *
 * @param {string} s - 输入字符串
 * @returns {number} 第一个唯一字符的索引，不存在返回-1
 * @time O(n) - 两次遍历字符串
 * @space O(1) - 最多26个小写字母
 */
function firstUniqChar(s) {
    const charCount = new Map();

    // 第一次遍历：统计字符频次
    for (const char of s) {
        charCount.set(char, (charCount.get(char) || 0) + 1);
    }

    // 第二次遍历：找第一个频次为1的字符
    for (let i = 0; i < s.length; i++) {
        if (charCount.get(s[i]) === 1) {
            return i;
        }
    }

    return -1;
}

/**
 * 有效的字母异位词
 *
 * 核心思想：
 * 异位词的字符频次完全相同
 * 统计两个字符串的字符频次，比较是否相等
 *
 * @param {string} s - 第一个字符串
 * @param {string} t - 第二个字符串
 * @returns {boolean} 是否为字母异位词
 * @time O(n) - 遍历字符串
 * @space O(1) - 最多26个字母
 */
function isAnagram(s, t) {
    if (s.length !== t.length) return false;

    const charCount = new Map();

    // 统计第一个字符串的字符频次
    for (const char of s) {
        charCount.set(char, (charCount.get(char) || 0) + 1);
    }

    // 减去第二个字符串的字符频次
    for (const char of t) {
        if (!charCount.has(char)) return false;

        charCount.set(char, charCount.get(char) - 1);

        if (charCount.get(char) === 0) {
            charCount.delete(char);
        }
    }

    return charCount.size === 0;
}

/**
 * 赎金信
 *
 * 核心思想：
 * 检查杂志中的字符是否足够组成赎金信
 * 统计杂志字符频次，然后检查赎金信每个字符是否有足够数量
 *
 * @param {string} ransomNote - 赎金信
 * @param {string} magazine - 杂志
 * @returns {boolean} 能否构成赎金信
 * @time O(m + n) - m为赎金信长度，n为杂志长度
 * @space O(k) - k为杂志中不同字符数量
 */
function canConstruct(ransomNote, magazine) {
    const charCount = new Map();

    // 统计杂志中字符频次
    for (const char of magazine) {
        charCount.set(char, (charCount.get(char) || 0) + 1);
    }

    // 检查赎金信每个字符是否有足够数量
    for (const char of ransomNote) {
        if (!charCount.has(char) || charCount.get(char) === 0) {
            return false;
        }
        charCount.set(char, charCount.get(char) - 1);
    }

    return true;
}

// ==================== 分组归类算法 ====================

/**
 * 字母异位词分组
 *
 * 核心思想：
 * 异位词排序后的字符串相同，可以作为分组的键
 * 也可以用字符频次数组作为键
 *
 * @param {string[]} strs - 字符串数组
 * @returns {string[][]} 分组后的字母异位词
 * @time O(n * k log k) - n个字符串，每个长度k的排序
 * @space O(n * k) - 存储所有字符串
 */
function groupAnagrams(strs) {
    const groups = new Map();

    for (const str of strs) {
        // 方法1：排序作为键
        const key = str.split('').sort().join('');

        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(str);
    }

    return Array.from(groups.values());
}

/**
 * 字母异位词分组（字符计数版本）
 *
 * 核心思想：
 * 使用字符频次数组作为键，避免排序操作
 *
 * @param {string[]} strs - 字符串数组
 * @returns {string[][]} 分组后的字母异位词
 * @time O(n * k) - n个字符串，每个长度k
 * @space O(n * k) - 存储所有字符串
 */
function groupAnagramsCount(strs) {
    const groups = new Map();

    for (const str of strs) {
        // 使用字符计数作为键
        const count = new Array(26).fill(0);
        for (const char of str) {
            count[char.charCodeAt(0) - 'a'.charCodeAt(0)]++;
        }
        const key = count.join(',');

        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(str);
    }

    return Array.from(groups.values());
}

// ==================== 前缀和算法 ====================

/**
 * 和为K的子数组
 *
 * 核心思想：
 * 前缀和 + 哈希表
 * 如果prefixSum[j] - prefixSum[i] = k，说明子数组[i+1, j]的和为k
 * 转换为查找prefixSum[i] = prefixSum[j] - k
 *
 * @param {number[]} nums - 数字数组
 * @param {number} k - 目标和
 * @returns {number} 子数组数量
 * @time O(n) - 遍历数组一次
 * @space O(n) - 哈希表存储前缀和
 */
function subarraySum(nums, k) {
    const prefixSumCount = new Map();
    prefixSumCount.set(0, 1); // 前缀和为0出现1次

    let prefixSum = 0;
    let count = 0;

    for (const num of nums) {
        prefixSum += num;

        // 查找prefixSum - k是否存在
        const target = prefixSum - k;
        if (prefixSumCount.has(target)) {
            count += prefixSumCount.get(target);
        }

        // 更新当前前缀和的计数
        prefixSumCount.set(prefixSum, (prefixSumCount.get(prefixSum) || 0) + 1);
    }

    return count;
}

/**
 * 连续数组（0和1数量相等的最长子数组）
 *
 * 核心思想：
 * 将0看作-1，问题转换为和为0的最长子数组
 * 使用前缀和 + 哈希表记录每个前缀和第一次出现的位置
 *
 * @param {number[]} nums - 0和1组成的数组
 * @returns {number} 最长连续子数组长度
 * @time O(n) - 遍历数组一次
 * @space O(n) - 哈希表存储前缀和位置
 */
function findMaxLength(nums) {
    const sumIndexMap = new Map();
    sumIndexMap.set(0, -1); // 前缀和为0在位置-1

    let sum = 0;
    let maxLength = 0;

    for (let i = 0; i < nums.length; i++) {
        // 将0转换为-1
        sum += nums[i] === 0 ? -1 : 1;

        if (sumIndexMap.has(sum)) {
            // 找到相同前缀和，计算子数组长度
            const length = i - sumIndexMap.get(sum);
            maxLength = Math.max(maxLength, length);
        } else {
            // 第一次出现该前缀和，记录位置
            sumIndexMap.set(sum, i);
        }
    }

    return maxLength;
}

// ==================== 缓存算法 ====================

/**
 * LRU缓存
 *
 * 核心思想：
 * 使用哈希表 + 双向链表实现O(1)的get和put操作
 * 哈希表用于快速查找，双向链表维护访问顺序
 */
class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();

        // 创建虚拟头尾节点
        this.head = { key: -1, value: -1, prev: null, next: null };
        this.tail = { key: -1, value: -1, prev: null, next: null };
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }

    /**
     * 获取缓存值
     * @param {number} key - 键
     * @returns {number} 值，不存在返回-1
     * @time O(1)
     */
    get(key) {
        if (this.cache.has(key)) {
            const node = this.cache.get(key);
            // 移动到头部（最近使用）
            this._moveToHead(node);
            return node.value;
        }
        return -1;
    }

    /**
     * 设置缓存值
     * @param {number} key - 键
     * @param {number} value - 值
     * @time O(1)
     */
    put(key, value) {
        if (this.cache.has(key)) {
            // 更新已存在的键
            const node = this.cache.get(key);
            node.value = value;
            this._moveToHead(node);
        } else {
            // 添加新键
            const newNode = { key, value, prev: null, next: null };

            if (this.cache.size >= this.capacity) {
                // 删除尾部节点（最久未使用）
                const tail = this._removeTail();
                this.cache.delete(tail.key);
            }

            this.cache.set(key, newNode);
            this._addToHead(newNode);
        }
    }

    /**
     * 添加节点到头部
     * @private
     */
    _addToHead(node) {
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next.prev = node;
        this.head.next = node;
    }

    /**
     * 移除节点
     * @private
     */
    _removeNode(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    /**
     * 移动节点到头部
     * @private
     */
    _moveToHead(node) {
        this._removeNode(node);
        this._addToHead(node);
    }

    /**
     * 移除尾部节点
     * @private
     */
    _removeTail() {
        const lastNode = this.tail.prev;
        this._removeNode(lastNode);
        return lastNode;
    }
}

// ==================== 测试函数 ====================

/**
 * 快速查找算法测试
 */
function testFastLookup() {
    console.log("=== 快速查找算法测试 ===");

    // 测试两数之和
    const nums1 = [2, 7, 11, 15];
    const target1 = 9;
    console.log(`两数之和: nums=${JSON.stringify(nums1)}, target=${target1}`);
    console.log(`结果: ${JSON.stringify(twoSum(nums1, target1))}`);

    // 测试三数之和
    const nums2 = [-1, 0, 1, 2, -1, -4];
    console.log(`\n三数之和: nums=${JSON.stringify(nums2)}`);
    console.log(`结果: ${JSON.stringify(threeSum(nums2))}`);

    // 测试四数相加
    const a = [1, 2], b = [-2, -1], c = [-1, 2], d = [0, 2];
    console.log(`\n四数相加 II:`);
    console.log(`a=${JSON.stringify(a)}, b=${JSON.stringify(b)}, c=${JSON.stringify(c)}, d=${JSON.stringify(d)}`);
    console.log(`结果: ${fourSumCount(a, b, c, d)}`);
}

/**
 * 频次统计算法测试
 */
function testFrequencyCount() {
    console.log("\n=== 频次统计算法测试 ===");

    // 测试第一个唯一字符
    const s1 = "leetcode";
    console.log(`第一个唯一字符: "${s1}" -> 索引 ${firstUniqChar(s1)}`);

    // 测试字母异位词
    const s2 = "anagram", t2 = "nagaram";
    console.log(`字母异位词: "${s2}" 和 "${t2}" -> ${isAnagram(s2, t2)}`);

    // 测试赎金信
    const ransomNote = "a", magazine = "b";
    console.log(`赎金信: "${ransomNote}" 能否由 "${magazine}" 构成 -> ${canConstruct(ransomNote, magazine)}`);
}

/**
 * 分组归类算法测试
 */
function testGrouping() {
    console.log("\n=== 分组归类算法测试 ===");

    const strs = ["eat", "tea", "tan", "ate", "nat", "bat"];
    console.log(`字母异位词分组: ${JSON.stringify(strs)}`);
    console.log(`结果: ${JSON.stringify(groupAnagrams(strs))}`);
}

/**
 * 前缀和算法测试
 */
function testPrefixSum() {
    console.log("\n=== 前缀和算法测试 ===");

    // 测试和为K的子数组
    const nums1 = [1, 1, 1], k = 2;
    console.log(`和为K的子数组: nums=${JSON.stringify(nums1)}, k=${k}`);
    console.log(`结果: ${subarraySum(nums1, k)}`);

    // 测试连续数组
    const nums2 = [0, 1, 0, 0, 1, 1, 0];
    console.log(`连续数组: ${JSON.stringify(nums2)}`);
    console.log(`最长长度: ${findMaxLength(nums2)}`);
}

/**
 * LRU缓存测试
 */
function testLRUCache() {
    console.log("\n=== LRU缓存测试 ===");

    const lru = new LRUCache(2);

    console.log("执行操作序列：");
    lru.put(1, 1);
    console.log("put(1, 1)");
    lru.put(2, 2);
    console.log("put(2, 2)");
    console.log(`get(1): ${lru.get(1)}`); // 返回 1
    lru.put(3, 3);    // 该操作会使得键 2 作废
    console.log("put(3, 3) - 键2被淘汰");
    console.log(`get(2): ${lru.get(2)}`); // 返回 -1 (未找到)
    lru.put(4, 4);    // 该操作会使得键 1 作废
    console.log("put(4, 4) - 键1被淘汰");
    console.log(`get(1): ${lru.get(1)}`); // 返回 -1 (未找到)
    console.log(`get(3): ${lru.get(3)}`); // 返回 3
    console.log(`get(4): ${lru.get(4)}`); // 返回 4
}

// 运行所有测试
if (typeof require !== 'undefined' && require.main === module) {
    testFastLookup();
    testFrequencyCount();
    testGrouping();
    testPrefixSum();
    testLRUCache();

    console.log("\n=== 所有算法测试完成！ ===");
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        twoSum,
        threeSum,
        fourSumCount,
        firstUniqChar,
        isAnagram,
        canConstruct,
        groupAnagrams,
        groupAnagramsCount,
        subarraySum,
        findMaxLength,
        LRUCache
    };
}