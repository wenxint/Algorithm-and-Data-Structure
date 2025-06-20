/**
 * 第4章：哈希表 - 练习题解答
 *
 * 本文件包含5道精选练习题的完整解答：
 * 1. 两数之和（简单）
 * 2. 有效的字母异位词（简单）
 * 3. 字母异位词分组（中等）
 * 4. 和为K的子数组（中等）
 * 5. LRU缓存（困难）
 *
 * @author Algorithm Tutorial
 * @date 2024
 */

// ==================== 题目1：两数之和（简单） ====================

/**
 * 两数之和
 *
 * 核心思想：
 * 利用哈希表的O(1)查找特性，避免嵌套循环
 * 对于每个元素x，查找target-x是否存在于已遍历的元素中
 *
 * @param {number[]} nums - 数字数组
 * @param {number} target - 目标和
 * @returns {number[]} 两个数的索引
 * @time O(n) - 遍历数组一次
 * @space O(n) - 哈希表存储已遍历元素
 */
function twoSum(nums, target) {
    const map = new Map(); // 值 -> 索引的映射

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        // 检查补数是否存在
        if (map.has(complement)) {
            return [map.get(complement), i];
        }

        // 将当前元素存入哈希表
        map.set(nums[i], i);
    }

    return []; // 理论上不会执行到这里
}

// ==================== 题目2：有效的字母异位词（简单） ====================

/**
 * 有效的字母异位词
 *
 * 核心思想：
 * 异位词的字符频次完全相同
 * 先统计第一个字符串的字符频次，再减去第二个字符串的字符频次
 *
 * @param {string} s - 第一个字符串
 * @param {string} t - 第二个字符串
 * @returns {boolean} 是否为字母异位词
 * @time O(n) - 遍历两个字符串
 * @space O(1) - 最多26个小写字母
 */
function isAnagram(s, t) {
    // 长度不同直接返回false
    if (s.length !== t.length) return false;

    const charCount = new Map();

    // 统计第一个字符串的字符频次
    for (const char of s) {
        charCount.set(char, (charCount.get(char) || 0) + 1);
    }

    // 减去第二个字符串的字符频次
    for (const char of t) {
        if (!charCount.has(char)) {
            return false; // 字符不存在
        }

        charCount.set(char, charCount.get(char) - 1);

        // 频次为0时删除，保持Map干净
        if (charCount.get(char) === 0) {
            charCount.delete(char);
        }
    }

    // 如果是异位词，所有字符频次都会被抵消
    return charCount.size === 0;
}

/**
 * 有效的字母异位词（排序版本）
 *
 * 核心思想：
 * 异位词排序后的字符串相同
 *
 * @param {string} s - 第一个字符串
 * @param {string} t - 第二个字符串
 * @returns {boolean} 是否为字母异位词
 * @time O(n log n) - 排序操作
 * @space O(n) - 排序需要额外空间
 */
function isAnagramSort(s, t) {
    if (s.length !== t.length) return false;

    const sortedS = s.split('').sort().join('');
    const sortedT = t.split('').sort().join('');

    return sortedS === sortedT;
}

// ==================== 题目3：字母异位词分组（中等） ====================

/**
 * 字母异位词分组
 *
 * 核心思想：
 * 使用哈希表进行分组，排序后的字符串作为分组键
 * 相同键的字符串归为一组
 *
 * @param {string[]} strs - 字符串数组
 * @returns {string[][]} 分组后的字母异位词
 * @time O(n * k log k) - n个字符串，每个长度k需要排序
 * @space O(n * k) - 存储所有字符串
 */
function groupAnagrams(strs) {
    const groups = new Map();

    for (const str of strs) {
        // 排序作为分组键
        const key = str.split('').sort().join('');

        // 如果键不存在，创建新数组
        if (!groups.has(key)) {
            groups.set(key, []);
        }

        // 将字符串添加到对应组
        groups.get(key).push(str);
    }

    // 返回所有分组
    return Array.from(groups.values());
}

/**
 * 字母异位词分组（字符计数版本）
 *
 * 核心思想：
 * 使用字符频次数组作为键，避免排序操作
 * 时间复杂度更优：O(n * k)
 *
 * @param {string[]} strs - 字符串数组
 * @returns {string[][]} 分组后的字母异位词
 * @time O(n * k) - n个字符串，每个长度k
 * @space O(n * k) - 存储所有字符串
 */
function groupAnagramsCount(strs) {
    const groups = new Map();

    for (const str of strs) {
        // 统计字符频次作为键
        const count = new Array(26).fill(0);
        for (const char of str) {
            count[char.charCodeAt(0) - 'a'.charCodeAt(0)]++;
        }

        // 将计数数组转换为字符串作为键
        const key = count.join(',');

        if (!groups.has(key)) {
            groups.set(key, []);
        }

        groups.get(key).push(str);
    }

    return Array.from(groups.values());
}

// ==================== 题目4：和为K的子数组（中等） ====================

/**
 * 和为K的子数组
 *
 * 核心思想：
 * 前缀和 + 哈希表的经典组合
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
    prefixSumCount.set(0, 1); // 前缀和为0出现1次（重要的初始化）

    let prefixSum = 0;
    let count = 0;

    for (const num of nums) {
        prefixSum += num;

        // 查找是否存在前缀和等于prefixSum - k
        const target = prefixSum - k;
        if (prefixSumCount.has(target)) {
            count += prefixSumCount.get(target);
        }

        // 更新当前前缀和的计数
        prefixSumCount.set(prefixSum, (prefixSumCount.get(prefixSum) || 0) + 1);
    }

    return count;
}

// ==================== 题目5：LRU缓存（困难） ====================

/**
 * LRU缓存实现
 *
 * 核心思想：
 * 哈希表 + 双向链表的组合数据结构
 * - 哈希表：实现O(1)的查找
 * - 双向链表：维护访问顺序，支持O(1)的插入删除
 * - 头部存放最近访问的元素，尾部存放最久未访问的元素
 */
class LRUCache {
    /**
     * 构造函数
     * @param {number} capacity - 缓存容量
     */
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map(); // 键 -> 节点的映射

        // 创建虚拟头尾节点，简化边界处理
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
            // 移动到头部（标记为最近使用）
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
                // 容量已满，删除尾部节点（最久未使用）
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
     * @param {Object} node - 要添加的节点
     */
    _addToHead(node) {
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next.prev = node;
        this.head.next = node;
    }

    /**
     * 移除指定节点
     * @private
     * @param {Object} node - 要移除的节点
     */
    _removeNode(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    /**
     * 移动节点到头部
     * @private
     * @param {Object} node - 要移动的节点
     */
    _moveToHead(node) {
        this._removeNode(node);
        this._addToHead(node);
    }

    /**
     * 移除尾部节点
     * @private
     * @returns {Object} 被移除的节点
     */
    _removeTail() {
        const lastNode = this.tail.prev;
        this._removeNode(lastNode);
        return lastNode;
    }
}

// ==================== 测试函数 ====================

/**
 * 测试所有解答
 */
function runAllTests() {
    console.log("=== 第4章：哈希表 - 练习题解答测试 ===\n");

    // 测试1：两数之和
    console.log("题目1：两数之和");
    const nums1 = [2, 7, 11, 15], target1 = 9;
    console.log(`输入: nums = ${JSON.stringify(nums1)}, target = ${target1}`);
    console.log(`输出: ${JSON.stringify(twoSum(nums1, target1))}\n`);

    const nums2 = [3, 2, 4], target2 = 6;
    console.log(`输入: nums = ${JSON.stringify(nums2)}, target = ${target2}`);
    console.log(`输出: ${JSON.stringify(twoSum(nums2, target2))}\n`);

    // 测试2：有效的字母异位词
    console.log("题目2：有效的字母异位词");
    const s1 = "anagram", t1 = "nagaram";
    console.log(`输入: s = "${s1}", t = "${t1}"`);
    console.log(`输出: ${isAnagram(s1, t1)}`);
    console.log(`排序版本: ${isAnagramSort(s1, t1)}\n`);

    const s2 = "rat", t2 = "car";
    console.log(`输入: s = "${s2}", t = "${t2}"`);
    console.log(`输出: ${isAnagram(s2, t2)}\n`);

    // 测试3：字母异位词分组
    console.log("题目3：字母异位词分组");
    const strs = ["eat", "tea", "tan", "ate", "nat", "bat"];
    console.log(`输入: ${JSON.stringify(strs)}`);
    console.log(`排序版本: ${JSON.stringify(groupAnagrams(strs))}`);
    console.log(`计数版本: ${JSON.stringify(groupAnagramsCount(strs))}\n`);

    // 测试4：和为K的子数组
    console.log("题目4：和为K的子数组");
    const nums3 = [1, 1, 1], k1 = 2;
    console.log(`输入: nums = ${JSON.stringify(nums3)}, k = ${k1}`);
    console.log(`输出: ${subarraySum(nums3, k1)}\n`);

    const nums4 = [1, 2, 3], k2 = 3;
    console.log(`输入: nums = ${JSON.stringify(nums4)}, k = ${k2}`);
    console.log(`输出: ${subarraySum(nums4, k2)}\n`);

    // 测试5：LRU缓存
    console.log("题目5：LRU缓存");
    const lru = new LRUCache(2);

    console.log("执行操作序列：");
    lru.put(1, 1);
    console.log("put(1, 1) - 缓存: {1=1}");

    lru.put(2, 2);
    console.log("put(2, 2) - 缓存: {1=1, 2=2}");

    console.log(`get(1): ${lru.get(1)} - 缓存: {2=2, 1=1}`);

    lru.put(3, 3);
    console.log("put(3, 3) - 缓存: {1=1, 3=3} (键2被淘汰)");

    console.log(`get(2): ${lru.get(2)} - 未找到`);

    lru.put(4, 4);
    console.log("put(4, 4) - 缓存: {3=3, 4=4} (键1被淘汰)");

    console.log(`get(1): ${lru.get(1)} - 未找到`);
    console.log(`get(3): ${lru.get(3)} - 缓存: {4=4, 3=3}`);
    console.log(`get(4): ${lru.get(4)} - 缓存: {3=3, 4=4}`);

    console.log("\n=== 所有测试完成！ ===");
}

// 运行测试
if (typeof require !== 'undefined' && require.main === module) {
    runAllTests();
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        twoSum,
        isAnagram,
        isAnagramSort,
        groupAnagrams,
        groupAnagramsCount,
        subarraySum,
        LRUCache
    };
}