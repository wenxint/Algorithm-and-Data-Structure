/**
 * LeetCode 496: 下一个更大元素 I (Next Greater Element I)
 *
 * 题目描述：
 * 给你两个 没有重复元素 的数组 nums1 和 nums2，其中nums1 是 nums2 的子集。
 * 请你找出 nums1 中每个元素在 nums2 中的下一个比其大的值。
 * nums1 中数字 x 的下一个更大元素是指 x 在 nums2 中对应位置的右边的第一个比 x 大的元素。
 * 如果不存在，对应位置输出 -1。
 *
 * 核心思想：
 * 单调栈 - 维护一个单调递减的栈，用于快速找到下一个更大元素
 * 关键洞察：对于每个元素，我们需要找到它右边第一个比它大的元素
 *
 * 算法原理：
 * 1. 使用单调栈处理 nums2，为每个元素找到下一个更大元素
 * 2. 将结果存储在哈希表中
 * 3. 根据 nums1 的元素在哈希表中查找结果
 *
 * 示例：
 * 输入：nums1 = [4,1,2], nums2 = [1,3,4,2]
 * 输出：[-1,3,-1]
 * 解释：nums1 中每个元素在 nums2 中的下一个更大元素
 */

/**
 * 解法一：单调栈 + 哈希表（推荐）
 *
 * 核心思想：
 * - 使用单调递减栈来维护还没找到下一个更大元素的数字
 * - 当遇到一个更大的数时，栈中所有小于它的数都找到了答案
 * - 用哈希表存储每个数字对应的下一个更大元素
 *
 * @param {number[]} nums1 - 查询数组
 * @param {number[]} nums2 - 目标数组
 * @returns {number[]} 每个nums1元素在nums2中的下一个更大元素
 * @time O(n + m) n为nums2长度，m为nums1长度
 * @space O(n) 栈和哈希表的空间
 */
function nextGreaterElement(nums1, nums2) {
    // 单调栈：存储还没找到下一个更大元素的数字
    const stack = [];
    // 哈希表：存储每个数字的下一个更大元素
    const nextGreaterMap = new Map();

    // 遍历 nums2，构建下一个更大元素的映射
    for (const num of nums2) {
        // 当栈不为空且当前数字大于栈顶元素时
        // 说明栈顶元素找到了它的下一个更大元素
        while (stack.length > 0 && num > stack[stack.length - 1]) {
            const smallerNum = stack.pop();
            nextGreaterMap.set(smallerNum, num);
        }

        // 将当前数字压入栈中
        stack.push(num);
    }

    // 栈中剩余的元素都没有下一个更大元素
    while (stack.length > 0) {
        const num = stack.pop();
        nextGreaterMap.set(num, -1);
    }

    // 根据 nums1 的元素在映射中查找结果
    return nums1.map(num => nextGreaterMap.get(num));
}

/**
 * 解法二：暴力法（对比用）
 *
 * 核心思想：
 * 对于 nums1 中的每个元素，在 nums2 中找到它的位置
 * 然后向右遍历寻找第一个更大的元素
 *
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @returns {number[]}
 * @time O(m * n) m为nums1长度，n为nums2长度
 * @space O(1) 不考虑输出数组
 */
function nextGreaterElementBruteForce(nums1, nums2) {
    const result = [];

    for (const target of nums1) {
        // 在 nums2 中找到目标元素的位置
        let index = nums2.indexOf(target);
        let nextGreater = -1;

        // 从目标位置向右查找第一个更大的元素
        for (let i = index + 1; i < nums2.length; i++) {
            if (nums2[i] > target) {
                nextGreater = nums2[i];
                break;
            }
        }

        result.push(nextGreater);
    }

    return result;
}

/**
 * 解法三：预处理优化（空间换时间）
 *
 * 核心思想：
 * 先为 nums2 中的每个元素预计算下一个更大元素
 * 然后直接查表获取 nums1 的结果
 *
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @returns {number[]}
 * @time O(n + m)
 * @space O(n)
 */
function nextGreaterElementPrecompute(nums1, nums2) {
    // 预计算 nums2 中每个位置的下一个更大元素
    const nextGreater = new Array(nums2.length).fill(-1);

    for (let i = 0; i < nums2.length; i++) {
        for (let j = i + 1; j < nums2.length; j++) {
            if (nums2[j] > nums2[i]) {
                nextGreater[i] = nums2[j];
                break;
            }
        }
    }

    // 构建值到下一个更大元素的映射
    const valueToNext = new Map();
    for (let i = 0; i < nums2.length; i++) {
        valueToNext.set(nums2[i], nextGreater[i]);
    }

    // 查找 nums1 的结果
    return nums1.map(num => valueToNext.get(num));
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 496: 下一个更大元素 I 测试 ===\n');

    const testCases = [
        {
            nums1: [4, 1, 2],
            nums2: [1, 3, 4, 2],
            expected: [-1, 3, -1],
            description: '基础用例：4右边没有更大元素，1的下一个更大元素是3，2右边没有更大元素'
        },
        {
            nums1: [2, 4],
            nums2: [1, 2, 3, 4],
            expected: [3, -1],
            description: '简单递增序列：2的下一个是3，4没有更大元素'
        },
        {
            nums1: [1, 3, 5, 2, 4],
            nums2: [6, 5, 4, 3, 2, 1, 7],
            expected: [7, 7, 7, 7, 7],
            description: '最后一个元素最大：所有元素的下一个更大元素都是7'
        },
        {
            nums1: [3, 1, 5],
            nums2: [1, 3, 5],
            expected: [5, 3, -1],
            description: '递增序列：每个元素的下一个更大元素就是右边一个'
        },
        {
            nums1: [1],
            nums2: [1, 2],
            expected: [2],
            description: '单元素查询'
        },
        {
            nums1: [2],
            nums2: [2, 1],
            expected: [-1],
            description: '没有更大元素的情况'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`nums1: [${test.nums1.join(', ')}]`);
        console.log(`nums2: [${test.nums2.join(', ')}]`);

        // 测试单调栈解法
        const result1 = nextGreaterElement([...test.nums1], [...test.nums2]);
        console.log(`单调栈解法: [${result1.join(', ')}]`);

        // 测试暴力解法
        const result2 = nextGreaterElementBruteForce([...test.nums1], [...test.nums2]);
        console.log(`暴力解法: [${result2.join(', ')}]`);

        // 测试预处理解法
        const result3 = nextGreaterElementPrecompute([...test.nums1], [...test.nums2]);
        console.log(`预处理解法: [${result3.join(', ')}]`);

        // 验证结果
        const isCorrect = JSON.stringify(result1) === JSON.stringify(test.expected) &&
                         JSON.stringify(result2) === JSON.stringify(test.expected) &&
                         JSON.stringify(result3) === JSON.stringify(test.expected);
        console.log(`结果验证: ${isCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log(`期望: [${test.expected.join(', ')}]\n`);
    });
}

// 单调栈原理演示
function demonstrateMonotonicStack() {
    console.log('=== 单调栈原理演示 ===');

    const nums2 = [1, 3, 4, 2];
    const stack = [];
    const nextGreaterMap = new Map();

    console.log('处理数组 [1, 3, 4, 2] 的过程：\n');

    for (let i = 0; i < nums2.length; i++) {
        const num = nums2[i];
        console.log(`步骤 ${i + 1}: 处理元素 ${num}`);
        console.log(`当前栈: [${stack.join(', ')}]`);

        // 处理栈中小于当前元素的数字
        while (stack.length > 0 && num > stack[stack.length - 1]) {
            const smallerNum = stack.pop();
            nextGreaterMap.set(smallerNum, num);
            console.log(`  ${smallerNum} 的下一个更大元素是 ${num}`);
        }

        stack.push(num);
        console.log(`将 ${num} 压入栈，栈变为: [${stack.join(', ')}]`);
        console.log('');
    }

    // 处理栈中剩余元素
    console.log('处理栈中剩余元素（没有下一个更大元素）:');
    while (stack.length > 0) {
        const num = stack.pop();
        nextGreaterMap.set(num, -1);
        console.log(`${num} 没有下一个更大元素`);
    }

    console.log('\n最终映射结果:');
    for (const [key, value] of nextGreaterMap) {
        console.log(`${key} -> ${value}`);
    }
}

// 性能对比测试
function performanceTest() {
    console.log('\n=== 性能对比测试 ===');

    // 生成测试数据
    const size = 10000;
    const nums2 = Array.from({ length: size }, (_, i) => Math.floor(Math.random() * size));
    const nums1 = nums2.slice(0, Math.floor(size / 4)); // nums1是nums2的子集

    console.log(`测试数据规模: nums1=${nums1.length}, nums2=${nums2.length}`);

    // 测试单调栈方法
    console.time('单调栈方法');
    const stackResult = nextGreaterElement([...nums1], [...nums2]);
    console.timeEnd('单调栈方法');

    // 测试暴力方法（数据量大时会很慢）
    if (size <= 1000) {
        console.time('暴力方法');
        const bruteResult = nextGreaterElementBruteForce([...nums1], [...nums2]);
        console.timeEnd('暴力方法');

        // 验证结果一致性
        const isConsistent = JSON.stringify(stackResult) === JSON.stringify(bruteResult);
        console.log(`结果一致性: ${isConsistent ? '✅' : '❌'}`);
    }
}

// 算法思想详解
function algorithmAnalysis() {
    console.log('\n=== 算法思想详解 ===');
    console.log(`
单调栈核心思想:

1. 问题本质:
   - 对于每个元素，找右边第一个比它大的元素
   - 这是典型的"下一个更大元素"问题

2. 暴力解法的问题:
   - 对每个元素都要向右扫描到底
   - 时间复杂度 O(m*n)，存在大量重复计算

3. 单调栈优化:
   - 维护一个单调递减的栈
   - 栈中存储还没找到下一个更大元素的数字
   - 当遇到更大数字时，栈中小于它的数都找到了答案
   - 每个元素最多入栈出栈一次，时间复杂度 O(n)

4. 关键洞察:
   - 如果 a < b < c，且 b 在 a 和 c 之间
   - 那么 a 的下一个更大元素不可能是 b（因为先遇到 c）
   - 所以当遇到 c 时，可以同时为 a 和 b 找到答案

5. 适用场景:
   - 下一个更大/更小元素问题
   - 直方图中最大矩形面积
   - 柱状图接雨水问题

时间复杂度分析:
- 单调栈: O(n + m)
- 暴力法: O(m * n)
- 预处理: O(n²) for 预处理 + O(m) for 查询

空间复杂度:
- 单调栈: O(n) 栈和哈希表
- 暴力法: O(1)
- 预处理: O(n) 存储预计算结果
    `);
}

// 运行所有测试
if (typeof require !== 'undefined' && require.main === module) {
    runTests();
    demonstrateMonotonicStack();
    performanceTest();
    algorithmAnalysis();
}

// Node.js导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        nextGreaterElement,
        nextGreaterElementBruteForce,
        nextGreaterElementPrecompute,
        runTests,
        demonstrateMonotonicStack,
        performanceTest,
        algorithmAnalysis
    };
}