/**
 * LeetCode 001: 两数之和 (Two Sum)
 *
 * 题目描述：
 * 给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，
 * 并返回它们的数组下标。
 *
 * 核心思想：
 * 哈希表思想 - 用空间换时间的经典案例
 *
 * 算法原理：
 * 1. 遍历数组时，对于每个元素，计算出与目标值的差值
 * 2. 检查这个差值是否已经在哈希表中存在
 * 3. 如果存在，说明找到了两个数的组合
 * 4. 如果不存在，将当前数及其索引存入哈希表
 *
 * 这样只需要一次遍历就能找到答案，时间复杂度从O(n²)降到O(n)
 */

/**
 * 解法一：暴力法（不推荐）
 *
 * 核心思想：双重循环暴力搜索所有可能的组合
 *
 * @param {number[]} nums - 输入数组
 * @param {number} target - 目标值
 * @returns {number[]} 两个数的索引
 * @time O(n²) 双重循环
 * @space O(1) 只用了常数级别的额外空间
 */
function twoSumBruteForce(nums, target) {
    // 外层循环：选择第一个数
    for (let i = 0; i < nums.length - 1; i++) {
        // 内层循环：在第一个数之后寻找第二个数
        for (let j = i + 1; j < nums.length; j++) {
            // 检查两数之和是否等于目标值
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return []; // 没找到符合条件的组合
}

/**
 * 解法二：哈希表法（推荐）
 *
 * 核心思想：
 * 利用哈希表的O(1)查找特性，将"寻找两个数"转换为"寻找一个数"
 * 对于当前数字x，我们只需要查找是否存在(target - x)即可
 *
 * @param {number[]} nums - 输入数组
 * @param {number} target - 目标值
 * @returns {number[]} 两个数的索引
 * @time O(n) 只需要一次遍历
 * @space O(n) 最坏情况下哈希表存储所有元素
 */
function twoSum(nums, target) {
    // 创建哈希表存储：值 -> 索引 的映射
    const map = new Map();

    // 遍历数组，对每个元素进行处理
    for (let i = 0; i < nums.length; i++) {
        // 计算当前数字需要配对的数字
        const complement = target - nums[i];

        // 检查配对数字是否已经在哈希表中
        if (map.has(complement)) {
            // 找到了！返回配对数字的索引和当前索引
            return [map.get(complement), i];
        }

        // 将当前数字及其索引存入哈希表
        map.set(nums[i], i);
    }

    return []; // 题目保证有解，这行代码不会执行
}

/**
 * 解法三：排序 + 双指针（会改变原数组结构）
 *
 * 核心思想：
 * 先排序，然后使用双指针从两端向中间靠拢
 * 注意：这种方法需要额外处理索引问题，因为排序会改变原有的索引
 *
 * @param {number[]} nums - 输入数组
 * @param {number} target - 目标值
 * @returns {number[]} 两个数的索引
 * @time O(n log n) 排序的时间复杂度
 * @space O(n) 需要额外空间存储原始索引
 */
function twoSumTwoPointers(nums, target) {
    // 创建数组，同时保存值和原始索引
    const indexedNums = nums.map((num, index) => ({ value: num, index }));

    // 按值排序
    indexedNums.sort((a, b) => a.value - b.value);

    let left = 0;
    let right = indexedNums.length - 1;

    while (left < right) {
        const sum = indexedNums[left].value + indexedNums[right].value;

        if (sum === target) {
            // 返回原始索引，确保小的索引在前
            const idx1 = indexedNums[left].index;
            const idx2 = indexedNums[right].index;
            return [Math.min(idx1, idx2), Math.max(idx1, idx2)];
        } else if (sum < target) {
            left++; // 和太小，移动左指针
        } else {
            right--; // 和太大，移动右指针
        }
    }

    return [];
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 001: 两数之和 测试 ===\n');

    const testCases = [
        {
            nums: [2, 7, 11, 15],
            target: 9,
            expected: [0, 1],
            description: '基础用例：第一个和第二个元素相加等于目标值'
        },
        {
            nums: [3, 2, 4],
            target: 6,
            expected: [1, 2],
            description: '中间元素组合：第二个和第三个元素'
        },
        {
            nums: [3, 3],
            target: 6,
            expected: [0, 1],
            description: '重复元素：两个相同的数字'
        },
        {
            nums: [-1, -2, -3, -4, -5],
            target: -8,
            expected: [2, 4],
            description: '负数测试：-3 + (-5) = -8'
        },
        {
            nums: [0, 4, 3, 0],
            target: 0,
            expected: [0, 3],
            description: '包含零的情况：0 + 0 = 0'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`输入: nums = [${test.nums.join(', ')}], target = ${test.target}`);

        // 测试哈希表解法
        const result1 = twoSum([...test.nums], test.target);
        console.log(`哈希表解法结果: [${result1.join(', ')}]`);

        // 测试暴力解法
        const result2 = twoSumBruteForce([...test.nums], test.target);
        console.log(`暴力解法结果: [${result2.join(', ')}]`);

        // 测试双指针解法
        const result3 = twoSumTwoPointers([...test.nums], test.target);
        console.log(`双指针解法结果: [${result3.join(', ')}]`);

        // 验证结果
        const isCorrect = JSON.stringify(result1.sort()) === JSON.stringify(test.expected.sort());
        console.log(`结果验证: ${isCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log('---');
    });
}

// 性能对比测试
function performanceTest() {
    console.log('\n=== 性能对比测试 ===');

    // 生成大规模测试数据
    const size = 10000;
    const nums = Array.from({ length: size }, (_, i) => Math.floor(Math.random() * 1000));
    const target = nums[100] + nums[500]; // 确保有解

    console.log(`测试数据规模: ${size} 个元素`);

    // 测试哈希表方法
    console.time('哈希表方法');
    const hashResult = twoSum([...nums], target);
    console.timeEnd('哈希表方法');

    // 测试暴力方法（数据量大时会很慢，可以注释掉）
    if (size <= 1000) {
        console.time('暴力方法');
        const bruteResult = twoSumBruteForce([...nums], target);
        console.timeEnd('暴力方法');
    } else {
        console.log('暴力方法: 数据量过大，跳过测试');
    }

    // 测试双指针方法
    console.time('双指针方法');
    const twoPointerResult = twoSumTwoPointers([...nums], target);
    console.timeEnd('双指针方法');

    console.log(`哈希表结果: [${hashResult.join(', ')}]`);
    console.log(`双指针结果: [${twoPointerResult.join(', ')}]`);
}

// 算法复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');
    console.log('1. 暴力法:');
    console.log('   时间复杂度: O(n²) - 双重循环');
    console.log('   空间复杂度: O(1) - 只使用常数空间');
    console.log('   优点: 实现简单，不需要额外空间');
    console.log('   缺点: 时间复杂度高，大数据量时性能差');

    console.log('\n2. 哈希表法:');
    console.log('   时间复杂度: O(n) - 一次遍历');
    console.log('   空间复杂度: O(n) - 哈希表存储');
    console.log('   优点: 时间复杂度最优，实现相对简单');
    console.log('   缺点: 需要额外的空间存储');

    console.log('\n3. 双指针法:');
    console.log('   时间复杂度: O(n log n) - 排序决定');
    console.log('   空间复杂度: O(n) - 存储索引信息');
    console.log('   优点: 思路清晰');
    console.log('   缺点: 需要排序，时间复杂度不是最优');

    console.log('\n推荐解法: 哈希表法');
    console.log('理由: 时间复杂度最优，在面试中最常用');
}

// 运行所有测试
if (require.main === module) {
    runTests();
    performanceTest();
    complexityAnalysis();
}

// 导出函数供其他模块使用
module.exports = {
    twoSum,
    twoSumBruteForce,
    twoSumTwoPointers
};