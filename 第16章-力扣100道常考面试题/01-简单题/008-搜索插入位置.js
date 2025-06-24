/**
 * LeetCode 35. 搜索插入位置
 *
 * 问题描述：
 * 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。
 * 如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
 * 请必须使用时间复杂度为 O(log n) 的算法。
 *
 * 核心思想：
 * 利用二分查找算法：
 * 1. 在有序数组中，使用左右指针不断缩小搜索范围
 * 2. 比较中间元素与目标值的大小关系
 * 3. 如果找到目标值，返回索引；如果没找到，left指针的位置就是插入位置
 *
 * 示例：
 * 输入：nums = [1,3,5,6], target = 5
 * 输出：2
 *
 * 输入：nums = [1,3,5,6], target = 2
 * 输出：1
 *
 * 输入：nums = [1,3,5,6], target = 7
 * 输出：4
 */

/**
 * 方法一：标准二分查找（推荐）
 *
 * 核心思想：
 * 使用二分查找算法在有序数组中寻找目标值或插入位置
 * 关键在于理解：当循环结束时，left指针指向的位置就是插入位置
 *
 * @param {number[]} nums - 有序数组
 * @param {number} target - 目标值
 * @returns {number} 目标值索引或插入位置
 * @time O(log n) 每次缩小一半搜索范围
 * @space O(1) 只使用常数额外空间
 */
function searchInsert(nums, target) {
    console.log("=== 搜索插入位置（标准二分查找） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log(`目标值: ${target}`);

    let left = 0;
    let right = nums.length - 1;
    let step = 0;

    console.log("开始二分查找:");
    console.log(`初始状态: left=${left}, right=${right}`);

    while (left <= right) {
        step++;
        const mid = Math.floor((left + right) / 2);
        const midVal = nums[mid];

        console.log(`第${step}步: left=${left}, right=${right}, mid=${mid}, nums[${mid}]=${midVal}`);

        if (midVal === target) {
            console.log(`✅ 找到目标值 ${target} 在索引 ${mid}`);
            return mid;
        } else if (midVal < target) {
            console.log(`  ${midVal} < ${target}, 在右半部分搜索`);
            left = mid + 1;
        } else {
            console.log(`  ${midVal} > ${target}, 在左半部分搜索`);
            right = mid - 1;
        }
    }

    console.log(`未找到目标值，插入位置为: ${left}`);
    return left;
}

/**
 * 方法二：二分查找变体（下界查找）
 *
 * 核心思想：
 * 寻找第一个大于等于target的位置（lower_bound）
 * 这个位置就是目标值的位置或插入位置
 *
 * @param {number[]} nums - 有序数组
 * @param {number} target - 目标值
 * @returns {number} 目标值索引或插入位置
 * @time O(log n) 二分查找时间复杂度
 * @space O(1) 常数空间复杂度
 */
function searchInsertLowerBound(nums, target) {
    console.log("\n=== 搜索插入位置（下界查找） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log(`目标值: ${target}`);

    let left = 0;
    let right = nums.length; // 注意：这里是nums.length，不是nums.length-1
    let step = 0;

    console.log("开始下界查找:");
    console.log(`初始状态: left=${left}, right=${right}`);

    while (left < right) {
        step++;
        const mid = Math.floor((left + right) / 2);
        const midVal = nums[mid];

        console.log(`第${step}步: left=${left}, right=${right}, mid=${mid}, nums[${mid}]=${midVal}`);

        if (midVal < target) {
            console.log(`  ${midVal} < ${target}, 搜索右半部分`);
            left = mid + 1;
        } else {
            console.log(`  ${midVal} >= ${target}, 搜索左半部分（包含mid）`);
            right = mid;
        }
    }

    console.log(`下界查找结果: ${left}`);
    return left;
}

/**
 * 方法三：线性搜索（对比用）
 *
 * 核心思想：
 * 从左到右遍历数组，找到第一个大于等于target的位置
 * 如果所有元素都小于target，则插入到末尾
 *
 * @param {number[]} nums - 有序数组
 * @param {number} target - 目标值
 * @returns {number} 目标值索引或插入位置
 * @time O(n) 需要遍历数组
 * @space O(1) 常数空间复杂度
 */
function searchInsertLinear(nums, target) {
    console.log("\n=== 搜索插入位置（线性搜索） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log(`目标值: ${target}`);

    console.log("开始线性搜索:");

    for (let i = 0; i < nums.length; i++) {
        console.log(`第${i + 1}步: 检查 nums[${i}] = ${nums[i]}`);

        if (nums[i] >= target) {
            console.log(`✅ 找到插入位置: ${i}`);
            return i;
        }
    }

    console.log(`所有元素都小于目标值，插入到末尾: ${nums.length}`);
    return nums.length;
}

/**
 * 方法四：递归二分查找
 *
 * 核心思想：
 * 使用递归实现二分查找算法
 * 每次递归缩小搜索范围
 *
 * @param {number[]} nums - 有序数组
 * @param {number} target - 目标值
 * @returns {number} 目标值索引或插入位置
 * @time O(log n) 递归深度为log n
 * @space O(log n) 递归调用栈空间
 */
function searchInsertRecursive(nums, target) {
    console.log("\n=== 搜索插入位置（递归二分） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log(`目标值: ${target}`);

    /**
     * 递归辅助函数
     * @param {number} left - 左边界
     * @param {number} right - 右边界
     * @param {number} depth - 递归深度
     */
    function binarySearchRecursive(left, right, depth = 1) {
        console.log(`递归第${depth}层: left=${left}, right=${right}`);

        if (left > right) {
            console.log(`递归结束，插入位置: ${left}`);
            return left;
        }

        const mid = Math.floor((left + right) / 2);
        const midVal = nums[mid];

        console.log(`  mid=${mid}, nums[${mid}]=${midVal}`);

        if (midVal === target) {
            console.log(`✅ 找到目标值，位置: ${mid}`);
            return mid;
        } else if (midVal < target) {
            console.log(`  ${midVal} < ${target}, 递归搜索右半部分`);
            return binarySearchRecursive(mid + 1, right, depth + 1);
        } else {
            console.log(`  ${midVal} > ${target}, 递归搜索左半部分`);
            return binarySearchRecursive(left, mid - 1, depth + 1);
        }
    }

    return binarySearchRecursive(0, nums.length - 1);
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 验证结果的正确性
 * @param {number[]} nums - 原始数组
 * @param {number} target - 目标值
 * @param {number} result - 算法结果
 * @returns {boolean} 是否正确
 */
function validateResult(nums, target, result) {
    console.log("\n=== 结果验证 ===");
    console.log(`数组: [${nums.join(', ')}], 目标: ${target}, 结果: ${result}`);

    // 检查索引范围
    if (result < 0 || result > nums.length) {
        console.log(`❌ 索引超出范围: ${result}`);
        return false;
    }

    // 如果结果在数组范围内，检查是否找到目标值
    if (result < nums.length && nums[result] === target) {
        console.log(`✅ 找到目标值 ${target} 在位置 ${result}`);
        return true;
    }

    // 检查插入位置是否正确
    // 1. 插入位置之前的元素都应该小于target
    for (let i = 0; i < result; i++) {
        if (nums[i] >= target) {
            console.log(`❌ 位置 ${i} 的元素 ${nums[i]} >= ${target}，插入位置不对`);
            return false;
        }
    }

    // 2. 插入位置之后的元素都应该大于等于target
    for (let i = result; i < nums.length; i++) {
        if (nums[i] < target) {
            console.log(`❌ 位置 ${i} 的元素 ${nums[i]} < ${target}，插入位置不对`);
            return false;
        }
    }

    console.log(`✅ 插入位置 ${result} 正确`);
    return true;
}

/**
 * 可视化二分查找过程
 * @param {number[]} nums - 数组
 * @param {number} target - 目标值
 */
function visualizeBinarySearch(nums, target) {
    console.log("\n=== 二分查找可视化 ===");
    console.log(`数组: [${nums.join(', ')}]`);
    console.log(`目标: ${target}`);

    let left = 0;
    let right = nums.length - 1;
    let step = 0;

    while (left <= right) {
        step++;
        const mid = Math.floor((left + right) / 2);

        // 创建可视化字符串
        const visualization = nums.map((num, index) => {
            if (index === left && index === right && index === mid) {
                return `[${num}]`; // 三者重合
            } else if (index === left && index === mid) {
                return `L,M:${num}`;
            } else if (index === right && index === mid) {
                return `R,M:${num}`;
            } else if (index === left && index === right) {
                return `L,R:${num}`;
            } else if (index === left) {
                return `L:${num}`;
            } else if (index === right) {
                return `R:${num}`;
            } else if (index === mid) {
                return `M:${num}`;
            } else if (index > left && index < right) {
                return `${num}`;
            } else {
                return `(${num})`;
            }
        });

        console.log(`第${step}步: ${visualization.join(' ')}`);
        console.log(`       比较: nums[${mid}]=${nums[mid]} vs target=${target}`);

        if (nums[mid] === target) {
            console.log(`       ✅ 找到目标！`);
            break;
        } else if (nums[mid] < target) {
            console.log(`       → 搜索右半部分`);
            left = mid + 1;
        } else {
            console.log(`       ← 搜索左半部分`);
            right = mid - 1;
        }
    }

    if (left > right) {
        console.log(`       最终插入位置: ${left}`);
    }
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    // 生成测试用例
    const generateTestCase = (size) => {
        const nums = Array.from({ length: size }, (_, i) => i * 2 + 1); // 生成奇数序列
        const target = Math.floor(Math.random() * (size * 2 + 2)); // 随机目标值
        return { nums, target };
    };

    const testCases = [
        { nums: [1, 3, 5, 6], target: 5 },
        { nums: [1, 3, 5, 6], target: 2 },
        { nums: [1, 3, 5, 6], target: 7 },
        generateTestCase(100),
        generateTestCase(1000),
        generateTestCase(10000)
    ];

    const methods = [
        { name: '标准二分', func: searchInsert },
        { name: '下界查找', func: searchInsertLowerBound },
        { name: '递归二分', func: searchInsertRecursive },
        { name: '线性搜索', func: searchInsertLinear }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const { nums, target } = testCases[i];
        console.log(`\n测试用例 ${i + 1}: 数组长度 ${nums.length}, 目标 ${target}`);

        const results = [];

        for (const method of methods) {
            const startTime = performance.now();
            const result = method.func([...nums], target);
            const endTime = performance.now();

            results.push(result);
            console.log(`${method.name}: 位置 ${result}, 耗时: ${(endTime - startTime).toFixed(3)}ms`);
        }

        // 检查结果一致性
        const allSame = results.every(result => result === results[0]);
        console.log(`所有方法结果一致: ${allSame ? '✅' : '❌'}`);

        // 验证第一个结果
        if (results[0] !== undefined) {
            validateResult(nums, target, results[0]);
        }
    }
}

// ===========================================
// 测试用例
// ===========================================

/**
 * 测试函数
 */
function runTests() {
    console.log("=".repeat(50));
    console.log("搜索插入位置算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { nums: [1, 3, 5, 6], target: 5, expected: 2, description: "找到目标值" },
        { nums: [1, 3, 5, 6], target: 2, expected: 1, description: "插入中间位置" },
        { nums: [1, 3, 5, 6], target: 7, expected: 4, description: "插入末尾" },
        { nums: [1, 3, 5, 6], target: 0, expected: 0, description: "插入开头" },
        { nums: [1], target: 1, expected: 0, description: "单元素数组找到" },
        { nums: [1], target: 0, expected: 0, description: "单元素数组插入前" },
        { nums: [1], target: 2, expected: 1, description: "单元素数组插入后" },
        { nums: [], target: 5, expected: 0, description: "空数组" }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`${"=".repeat(30)}`);

        const { nums, target, expected } = testCase;
        console.log(`数组: [${nums.join(', ')}], 目标: ${target}, 期望: ${expected}`);

        // 测试所有方法
        const methods = [
            { name: "标准二分", func: searchInsert },
            { name: "下界查找", func: searchInsertLowerBound },
            { name: "递归二分", func: searchInsertRecursive },
            { name: "线性搜索", func: searchInsertLinear }
        ];

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func([...nums], target);
                results.push(result);

                const isCorrect = result === expected;
                console.log(`结果: ${result}, 期望: ${expected}, 正确: ${isCorrect ? '✅' : '❌'}`);

                // 验证结果
                validateResult(nums, target, result);
            } catch (error) {
                console.log(`❌ 方法执行失败: ${error.message}`);
                results.push(null);
            }
        }

        // 检查所有方法结果是否一致
        console.log("\n--- 方法一致性检查 ---");
        const validResults = results.filter(r => r !== null);
        const allSame = validResults.every(result => result === validResults[0]);
        console.log(`所有方法结果一致: ${allSame ? '✅' : '❌'}`);

        // 可视化过程
        if (nums.length <= 10) {
            visualizeBinarySearch(nums, target);
        }
    });

    // 性能测试
    performanceTest();
}

// ===========================================
// 算法演示
// ===========================================

/**
 * 算法演示函数
 */
function demonstrateAlgorithm() {
    console.log("\n" + "=".repeat(50));
    console.log("搜索插入位置算法演示");
    console.log("=".repeat(50));

    console.log("二分查找核心思想:");
    console.log("1. 维护搜索区间 [left, right]");
    console.log("2. 计算中点 mid，比较 nums[mid] 与 target");
    console.log("3. 根据比较结果缩小搜索范围");
    console.log("4. 当 left > right 时，left 就是插入位置");

    const demoArray = [1, 3, 5, 6];
    const demoTarget = 2;

    console.log(`\n演示数组: [${demoArray.join(', ')}]`);
    console.log(`目标值: ${demoTarget}`);

    console.log("\n详细过程:");
    visualizeBinarySearch(demoArray, demoTarget);

    console.log("\n关键理解:");
    console.log("• 如果找到目标值，直接返回索引");
    console.log("• 如果没找到，left指针最终指向插入位置");
    console.log("• 插入位置保证数组仍然有序");

    console.log("\n算法复杂度对比:");
    console.log("1. 二分查找: 时间O(log n)，空间O(1)，最优解");
    console.log("2. 线性搜索: 时间O(n)，空间O(1)，简单但效率低");
    console.log("3. 递归二分: 时间O(log n)，空间O(log n)，代码简洁");

    console.log("\n二分查找的应用场景:");
    console.log("• 有序数组中查找元素");
    console.log("• 寻找插入位置");
    console.log("• 查找第一个/最后一个满足条件的元素");
    console.log("• 峰值查找、旋转数组搜索等变体问题");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        searchInsert,
        searchInsertLowerBound,
        searchInsertLinear,
        searchInsertRecursive,
        validateResult,
        visualizeBinarySearch,
        performanceTest,
        runTests,
        demonstrateAlgorithm
    };
}

// 如果在浏览器环境中，运行演示
if (typeof window !== 'undefined') {
    runTests();
    demonstrateAlgorithm();
}