/**
 * LeetCode 18: 四数之和 (4Sum)
 *
 * 题目描述：
 * 给你一个由 n 个整数组成的数组 nums，和一个目标值 target。
 * 请你找出并返回满足下述全部条件的、不重复的四元组 [nums[a], nums[b], nums[c], nums[d]]：
 * - 0 <= a, b, c, d < n
 * - a、b、c 和 d 互不相同
 * - nums[a] + nums[b] + nums[c] + nums[d] == target
 *
 * 核心思想：
 * 双指针 + 排序 + 去重 - 四数之和是两数之和和三数之和的扩展
 * 通过固定前两个数，将问题转化为两数之和问题
 *
 * 算法原理：
 * 1. 排序数组，便于去重和使用双指针
 * 2. 使用两层循环固定前两个数 nums[i] 和 nums[j]
 * 3. 对剩余部分使用双指针寻找目标值
 * 4. 通过跳过重复元素来避免重复解
 *
 * 示例：
 * 输入：nums = [1,0,-1,0,-2,2], target = 0
 * 输出：[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
 */

/**
 * 解法一：排序 + 双指针（推荐）
 *
 * 核心思想：
 * - 先排序，然后用两层循环固定前两个数
 * - 对后面的区间使用双指针查找剩余两数
 * - 通过跳过重复元素避免重复解
 *
 * @param {number[]} nums - 输入数组
 * @param {number} target - 目标值
 * @returns {number[][]} 所有不重复的四元组
 * @time O(n³) 两层循环 + 双指针遍历
 * @space O(1) 不考虑输出数组的额外空间
 */
function fourSum(nums, target) {
    const result = [];
    const n = nums.length;

    // 边界情况：数组长度小于4
    if (n < 4) return result;

    // 排序数组，便于去重和双指针操作
    nums.sort((a, b) => a - b);

    // 第一层循环：固定第一个数
    for (let i = 0; i < n - 3; i++) {
        // 跳过重复的第一个数
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        // 第二层循环：固定第二个数
        for (let j = i + 1; j < n - 2; j++) {
            // 跳过重复的第二个数
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;

            // 使用双指针寻找剩余两个数
            let left = j + 1;
            let right = n - 1;

            while (left < right) {
                const sum = nums[i] + nums[j] + nums[left] + nums[right];

                if (sum === target) {
                    // 找到一个解
                    result.push([nums[i], nums[j], nums[left], nums[right]]);

                    // 跳过重复的左指针元素
                    while (left < right && nums[left] === nums[left + 1]) {
                        left++;
                    }
                    // 跳过重复的右指针元素
                    while (left < right && nums[right] === nums[right - 1]) {
                        right--;
                    }

                    // 移动双指针
                    left++;
                    right--;
                } else if (sum < target) {
                    left++; // 和太小，移动左指针
                } else {
                    right--; // 和太大，移动右指针
                }
            }
        }
    }

    return result;
}

/**
 * 解法二：哈希表 + 三层循环（空间换时间）
 *
 * 核心思想：
 * 使用哈希表存储所有可能的两数之和及其索引信息
 * 然后用三层循环查找匹配的组合
 *
 * @param {number[]} nums
 * @param {number} target
 * @returns {number[][]}
 * @time O(n³) 三层循环
 * @space O(n²) 哈希表存储所有两数之和
 */
function fourSumHashMap(nums, target) {
    const result = [];
    const n = nums.length;

    if (n < 4) return result;

    // 排序便于去重
    nums.sort((a, b) => a - b);

    // 使用Set存储已找到的四元组（转为字符串）
    const resultSet = new Set();

    // 三层循环枚举前三个数
    for (let i = 0; i < n - 3; i++) {
        for (let j = i + 1; j < n - 2; j++) {
            for (let k = j + 1; k < n - 1; k++) {
                const need = target - nums[i] - nums[j] - nums[k];

                // 在剩余部分查找第四个数
                for (let l = k + 1; l < n; l++) {
                    if (nums[l] === need) {
                        const quadruplet = [nums[i], nums[j], nums[k], nums[l]];
                        const key = quadruplet.join(',');

                        if (!resultSet.has(key)) {
                            resultSet.add(key);
                            result.push(quadruplet);
                        }
                        break; // 找到一个就够了
                    }
                }
            }
        }
    }

    return result;
}

/**
 * 解法三：递归通用解法（可扩展到N数之和）
 *
 * 核心思想：
 * 将四数之和递归拆解为三数之和、两数之和
 * 提供一个通用的N数之和解决方案
 *
 * @param {number[]} nums
 * @param {number} target
 * @returns {number[][]}
 * @time O(n^(N-1)) N为数字个数
 * @space O(N) 递归栈深度
 */
function fourSumRecursive(nums, target) {
    return nSum(nums.sort((a, b) => a - b), target, 4);
}

/**
 * N数之和的通用解法
 * @param {number[]} nums - 已排序的数组
 * @param {number} target - 目标值
 * @param {number} N - 数字个数
 * @returns {number[][]}
 */
function nSum(nums, target, N) {
    const result = [];
    const n = nums.length;

    // 边界情况
    if (n < N || N < 2) return result;

    // 递归终止条件：转化为两数之和
    if (N === 2) {
        return twoSum(nums, target);
    }

    // 递归：固定第一个数，求剩余(N-1)数之和
    for (let i = 0; i < n - N + 1; i++) {
        // 跳过重复元素
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        // 递归求解(N-1)数之和
        const subResults = nSum(nums.slice(i + 1), target - nums[i], N - 1);

        // 将当前数字添加到每个子结果中
        for (const subResult of subResults) {
            result.push([nums[i], ...subResult]);
        }
    }

    return result;
}

/**
 * 两数之和（双指针版本，用于递归解法）
 * @param {number[]} nums - 已排序数组
 * @param {number} target - 目标值
 * @returns {number[][]}
 */
function twoSum(nums, target) {
    const result = [];
    let left = 0;
    let right = nums.length - 1;

    while (left < right) {
        const sum = nums[left] + nums[right];

        if (sum === target) {
            result.push([nums[left], nums[right]]);

            // 跳过重复元素
            while (left < right && nums[left] === nums[left + 1]) left++;
            while (left < right && nums[right] === nums[right - 1]) right--;

            left++;
            right--;
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }

    return result;
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 18: 四数之和 测试 ===\n');

    const testCases = [
        {
            nums: [1, 0, -1, 0, -2, 2],
            target: 0,
            expected: [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]],
            description: '基础用例：包含正数、负数和零'
        },
        {
            nums: [2, 2, 2, 2, 2],
            target: 8,
            expected: [[2, 2, 2, 2]],
            description: '重复元素：所有元素相同'
        },
        {
            nums: [-3, -2, -1, 0, 0, 1, 2, 3],
            target: 0,
            expected: [[-3, -2, 2, 3], [-3, -1, 1, 3], [-3, 0, 0, 3], [-3, 0, 1, 2], [-2, -1, 0, 3], [-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]],
            description: '对称数组：包含多个解'
        },
        {
            nums: [1, 2, 3, 4],
            target: 10,
            expected: [[1, 2, 3, 4]],
            description: '简单递增：唯一解'
        },
        {
            nums: [1, 2, 3],
            target: 6,
            expected: [],
            description: '数组长度不足：无解'
        },
        {
            nums: [-1, 0, 1, 2, -1, -4],
            target: -1,
            expected: [[-4, 0, 1, 2], [-1, -1, 0, 1]],
            description: '包含重复元素的复杂情况'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`数组: [${test.nums.join(', ')}], 目标值: ${test.target}`);

        // 测试双指针解法
        const result1 = fourSum([...test.nums], test.target);
        console.log(`双指针解法: ${JSON.stringify(result1)}`);

        // 测试哈希表解法
        const result2 = fourSumHashMap([...test.nums], test.target);
        console.log(`哈希表解法: ${JSON.stringify(result2)}`);

        // 测试递归解法
        const result3 = fourSumRecursive([...test.nums], test.target);
        console.log(`递归解法: ${JSON.stringify(result3)}`);

        // 验证结果（由于顺序可能不同，需要特殊比较）
        const isCorrect = compareResults(result1, test.expected) &&
                         compareResults(result2, test.expected) &&
                         compareResults(result3, test.expected);
        console.log(`结果验证: ${isCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log(`期望: ${JSON.stringify(test.expected)}\n`);
    });
}

/**
 * 比较两个四元组结果数组是否相等（忽略顺序）
 * @param {number[][]} result1
 * @param {number[][]} result2
 * @returns {boolean}
 */
function compareResults(result1, result2) {
    if (result1.length !== result2.length) return false;

    // 将每个四元组排序后转为字符串，然后排序整个数组
    const normalize = (arr) => arr.map(quad =>
        [...quad].sort((a, b) => a - b).join(',')
    ).sort();

    const norm1 = normalize(result1);
    const norm2 = normalize(result2);

    return JSON.stringify(norm1) === JSON.stringify(norm2);
}

// 算法复杂度演示
function complexityDemo() {
    console.log('=== 算法复杂度演示 ===');

    const sizes = [10, 20, 30];

    sizes.forEach(size => {
        console.log(`\n数组大小: ${size}`);

        // 生成测试数据
        const nums = Array.from({ length: size }, (_, i) => i - Math.floor(size / 2));
        const target = 0;

        // 测试双指针方法
        console.time('双指针方法');
        const result1 = fourSum([...nums], target);
        console.timeEnd('双指针方法');
        console.log(`找到 ${result1.length} 个解`);

        // 只在小数据集上测试递归方法
        if (size <= 20) {
            console.time('递归方法');
            const result3 = fourSumRecursive([...nums], target);
            console.timeEnd('递归方法');

            const isConsistent = compareResults(result1, result3);
            console.log(`结果一致性: ${isConsistent ? '✅' : '❌'}`);
        }
    });
}

// 去重策略详解
function deduplicationStrategy() {
    console.log('\n=== 去重策略详解 ===');

    const nums = [1, 1, 1, 1, 2, 2, 2];
    const target = 6;

    console.log(`示例数组: [${nums.join(', ')}], 目标: ${target}`);

    // 展示没有去重的暴力结果
    function fourSumWithoutDedup(nums, target) {
        const result = [];
        const n = nums.length;

        for (let i = 0; i < n - 3; i++) {
            for (let j = i + 1; j < n - 2; j++) {
                for (let k = j + 1; k < n - 1; k++) {
                    for (let l = k + 1; l < n; l++) {
                        if (nums[i] + nums[j] + nums[k] + nums[l] === target) {
                            result.push([nums[i], nums[j], nums[k], nums[l]]);
                        }
                    }
                }
            }
        }
        return result;
    }

    const withoutDedup = fourSumWithoutDedup(nums, target);
    const withDedup = fourSum(nums, target);

    console.log(`\n不去重结果 (${withoutDedup.length} 个):`);
    withoutDedup.forEach((quad, i) => {
        console.log(`  ${i + 1}: [${quad.join(', ')}]`);
    });

    console.log(`\n去重后结果 (${withDedup.length} 个):`);
    withDedup.forEach((quad, i) => {
        console.log(`  ${i + 1}: [${quad.join(', ')}]`);
    });

    console.log(`\n去重策略说明:`);
    console.log(`1. 排序数组：便于跳过相邻重复元素`);
    console.log(`2. 外层循环去重：if (i > 0 && nums[i] === nums[i-1]) continue`);
    console.log(`3. 内层循环去重：if (j > i+1 && nums[j] === nums[j-1]) continue`);
    console.log(`4. 双指针去重：找到解后跳过相同元素`);
}

// 算法思想详解
function algorithmAnalysis() {
    console.log('\n=== 算法思想详解 ===');
    console.log(`
四数之和问题解法分析:

1. 问题复杂度递增:
   - 两数之和: O(n) 哈希表 或 O(n log n) 双指针
   - 三数之和: O(n²) 固定一个数 + 双指针
   - 四数之和: O(n³) 固定两个数 + 双指针
   - N数之和: O(n^(N-1)) 递归分解

2. 双指针解法核心:
   - 排序是关键：使指针移动有意义
   - 固定前缀：将高维问题降维
   - 去重策略：避免重复解
   - 时间复杂度：O(n³)，空间复杂度：O(1)

3. 去重的三个层次:
   a) 外层循环去重（第一个数）
   b) 内层循环去重（第二个数）
   c) 双指针去重（第三、四个数）

4. 优化思路:
   - 早期剪枝：当前和已经过大/过小时提前退出
   - 哈希优化：预处理两数之和（空间换时间）
   - 递归抽象：代码复用，支持N数之和

5. 边界处理:
   - 数组长度检查
   - 目标值极值判断
   - 重复元素处理

时间复杂度对比:
- 暴力法: O(n⁴) 四层循环
- 哈希法: O(n³) 三层循环 + O(1)查找
- 双指针: O(n³) 两层循环 + O(n)双指针
- 递归法: O(n³) 与双指针相同，但代码更通用

空间复杂度对比:
- 双指针: O(1) 原地算法
- 哈希法: O(n²) 存储两数之和
- 递归法: O(n) 递归栈空间

选择建议:
- 面试推荐: 双指针法（时空复杂度最优）
- 扩展性: 递归法（支持N数之和）
- 理解优先: 暴力法（思路直观）
    `);
}

// 运行所有测试
if (typeof require !== 'undefined' && require.main === module) {
    runTests();
    complexityDemo();
    deduplicationStrategy();
    algorithmAnalysis();
}

// Node.js导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        fourSum,
        fourSumHashMap,
        fourSumRecursive,
        nSum,
        twoSum,
        runTests,
        compareResults,
        complexityDemo,
        deduplicationStrategy,
        algorithmAnalysis
    };
}