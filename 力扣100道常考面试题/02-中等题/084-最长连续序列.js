/**
 * LeetCode 128: 最长连续序列 (Longest Consecutive Sequence)
 *
 * 题目描述：
 * 给定一个未排序的整数数组 nums，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。
 * 请你设计并实现时间复杂度为 O(n) 的算法解决此问题。
 *
 * 核心思想：
 * 哈希表优化 - 将数组转为集合，只从序列的起点开始计算长度
 * 关键洞察：只有当 num-1 不在集合中时，num 才可能是一个序列的起点
 *
 * 算法原理：
 * 1. 将所有数字存入哈希集合，实现 O(1) 查找
 * 2. 遍历数组，对每个数字检查是否为序列起点
 * 3. 如果是起点，则向右扩展计算连续序列长度
 * 4. 记录最长序列长度
 *
 * 示例：
 * 输入：nums = [100,4,200,1,3,2]
 * 输出：4 (连续序列 [1,2,3,4])
 */

/**
 * 解法一：哈希集合优化（推荐）
 *
 * 核心思想：
 * 利用哈希集合的 O(1) 查找特性，只从序列起点开始计算
 * 避免重复计算，确保每个数字最多被访问两次
 *
 * @param {number[]} nums - 输入的整数数组
 * @returns {number} 最长连续序列的长度
 * @time O(n) 每个元素最多被访问两次
 * @space O(n) 哈希集合存储所有元素
 */
function longestConsecutive(nums) {
    if (nums.length === 0) return 0;

    // 将数组转换为集合，去重并支持 O(1) 查找
    const numSet = new Set(nums);
    let maxLength = 0;

    // 遍历集合中的每个数字
    for (const num of numSet) {
        // 只有当 num-1 不在集合中时，num 才是序列的起点
        if (!numSet.has(num - 1)) {
            let currentNum = num;
            let currentLength = 1;

            // 从起点向右扩展，计算连续序列长度
            while (numSet.has(currentNum + 1)) {
                currentNum++;
                currentLength++;
            }

            // 更新最大长度
            maxLength = Math.max(maxLength, currentLength);
        }
    }

    return maxLength;
}

/**
 * 解法二：排序 + 遍历（不满足 O(n) 要求）
 *
 * 核心思想：
 * 先排序，然后一次遍历统计连续序列
 * 虽然不满足 O(n) 要求，但思路简单直观
 *
 * @param {number[]} nums - 输入的整数数组
 * @returns {number} 最长连续序列的长度
 * @time O(n log n) 排序时间复杂度
 * @space O(1) 不考虑排序的额外空间
 */
function longestConsecutiveSorting(nums) {
    if (nums.length === 0) return 0;

    // 排序数组
    nums.sort((a, b) => a - b);

    let maxLength = 1;
    let currentLength = 1;

    for (let i = 1; i < nums.length; i++) {
        // 跳过重复元素
        if (nums[i] === nums[i - 1]) {
            continue;
        }
        // 连续序列
        else if (nums[i] === nums[i - 1] + 1) {
            currentLength++;
        }
        // 序列中断，重新开始计数
        else {
            maxLength = Math.max(maxLength, currentLength);
            currentLength = 1;
        }
    }

    return Math.max(maxLength, currentLength);
}

/**
 * 解法三：并查集实现（过度设计，仅做学习）
 *
 * 核心思想：
 * 将连续的数字通过并查集连接起来
 * 通过并查集统计每个连通分量的大小
 *
 * @param {number[]} nums - 输入的整数数组
 * @returns {number} 最长连续序列的长度
 * @time O(n) 近似线性时间（并查集的摊还复杂度）
 * @space O(n) 并查集和哈希表的空间
 */
function longestConsecutiveUnionFind(nums) {
    if (nums.length === 0) return 0;

    // 并查集实现
    class UnionFind {
        constructor() {
            this.parent = new Map();
            this.size = new Map();
        }

        makeSet(x) {
            if (!this.parent.has(x)) {
                this.parent.set(x, x);
                this.size.set(x, 1);
            }
        }

        find(x) {
            if (this.parent.get(x) !== x) {
                this.parent.set(x, this.find(this.parent.get(x)));
            }
            return this.parent.get(x);
        }

        union(x, y) {
            const rootX = this.find(x);
            const rootY = this.find(y);

            if (rootX !== rootY) {
                // 按大小合并，保持树的平衡
                if (this.size.get(rootX) < this.size.get(rootY)) {
                    [rootX, rootY] = [rootY, rootX];
                }
                this.parent.set(rootY, rootX);
                this.size.set(rootX, this.size.get(rootX) + this.size.get(rootY));
            }
        }

        getSize(x) {
            return this.size.get(this.find(x));
        }
    }

    const uf = new UnionFind();
    const numSet = new Set(nums);

    // 初始化并查集
    for (const num of numSet) {
        uf.makeSet(num);
        // 连接相邻的数字
        if (numSet.has(num + 1)) {
            uf.union(num, num + 1);
        }
    }

    // 找到最大的连通分量
    let maxLength = 0;
    for (const num of numSet) {
        maxLength = Math.max(maxLength, uf.getSize(num));
    }

    return maxLength;
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 128: 最长连续序列 测试 ===\n');

    const testCases = [
        {
            nums: [100, 4, 200, 1, 3, 2],
            expected: 4,
            description: '基础用例：连续序列 [1,2,3,4]'
        },
        {
            nums: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1],
            expected: 9,
            description: '长序列：[0,1,2,3,4,5,6,7,8]'
        },
        {
            nums: [],
            expected: 0,
            description: '空数组边界情况'
        },
        {
            nums: [1],
            expected: 1,
            description: '单元素数组'
        },
        {
            nums: [1, 2, 0, 1],
            expected: 3,
            description: '包含重复元素：[0,1,2]'
        },
        {
            nums: [9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6],
            expected: 7,
            description: '包含负数：[-1,0,1,3,4,5,6,7,8,9] 中最长为 [-1,0,1] 或 [3,4,5,6,7,8,9]'
        },
        {
            nums: [1, 3, 5, 7, 9],
            expected: 1,
            description: '无连续序列，都是独立的数字'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`输入: [${test.nums.join(', ')}]`);

        // 测试主要解法
        const result1 = longestConsecutive([...test.nums]);
        console.log(`哈希集合解法: ${result1}`);

        // 测试排序解法
        const result2 = longestConsecutiveSorting([...test.nums]);
        console.log(`排序解法: ${result2}`);

        // 测试并查集解法
        const result3 = longestConsecutiveUnionFind([...test.nums]);
        console.log(`并查集解法: ${result3}`);

        // 验证结果
        const isCorrect = result1 === test.expected &&
                         result2 === test.expected &&
                         result3 === test.expected;
        console.log(`结果验证: ${isCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log(`期望: ${test.expected}, 实际: ${result1}\n`);
    });
}

// 性能对比测试
function performanceTest() {
    console.log('=== 性能对比测试 ===');

    // 生成大规模测试数据
    const size = 100000;
    const nums = [];

    // 创建多个不连续的序列
    for (let i = 0; i < 10; i++) {
        const start = i * 10000;
        for (let j = 0; j < 1000; j++) {
            nums.push(start + j);
        }
    }

    // 随机打乱数组
    for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    console.log(`测试数据规模: ${size} 个元素`);

    // 测试哈希集合方法
    console.time('哈希集合方法');
    const hashResult = longestConsecutive([...nums]);
    console.timeEnd('哈希集合方法');

    // 测试排序方法
    console.time('排序方法');
    const sortResult = longestConsecutiveSorting([...nums]);
    console.timeEnd('排序方法');

    // 测试并查集方法
    console.time('并查集方法');
    const unionFindResult = longestConsecutiveUnionFind([...nums]);
    console.timeEnd('并查集方法');

    console.log(`结果一致性检查: ${hashResult === sortResult && sortResult === unionFindResult ? '✅' : '❌'}`);
    console.log(`最长连续序列长度: ${hashResult}`);
}

// 复杂度分析和算法思想详解
function algorithmAnalysis() {
    console.log('\n=== 算法思想详解 ===');
    console.log(`
核心思想解析：

1. 暴力解法的问题：
   - 对每个数字都检查能向两个方向扩展多远
   - 时间复杂度 O(n³)，大量重复计算

2. 排序解法：
   - 先排序，然后线性遍历统计连续长度
   - 时间复杂度 O(n log n)，受限于排序

3. 哈希集合优化（最优解）：
   - 关键洞察：只从序列起点开始计算
   - 起点判断：num-1 不在集合中的 num 才是起点
   - 每个数字最多被访问两次：一次判断起点，一次扩展
   - 时间复杂度 O(n)，空间复杂度 O(n)

4. 并查集解法：
   - 将连续数字连接成连通分量
   - 适合动态添加/删除场景
   - 对于静态问题，哈希集合更简单高效

选择建议：
- 面试推荐：哈希集合解法（满足 O(n) 要求）
- 空间受限：排序解法（O(1) 额外空间）
- 动态场景：并查集解法
    `);
}

// 运行所有测试
if (typeof require !== 'undefined' && require.main === module) {
    runTests();
    performanceTest();
    algorithmAnalysis();
}

// Node.js导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        longestConsecutive,
        longestConsecutiveSorting,
        longestConsecutiveUnionFind,
        runTests,
        performanceTest,
        algorithmAnalysis
    };
}