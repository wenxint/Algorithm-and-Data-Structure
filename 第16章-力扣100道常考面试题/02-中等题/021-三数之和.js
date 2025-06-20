/**
 * LeetCode 021: 三数之和 (3Sum)
 *
 * 题目描述：
 * 给你一个整数数组 nums，判断是否存在三元组 [nums[i], nums[j], nums[k]]
 * 满足 i != j、i != k 且 j != k，同时还满足 nums[i] + nums[j] + nums[k] == 0。
 * 请你返回所有和为 0 且不重复的三元组。
 *
 * 核心思想：
 * 1. 排序+双指针：固定第一个数，用双指针寻找另外两个数
 * 2. 去重处理：跳过重复元素，避免重复的三元组
 * 3. 剪枝优化：利用排序的特性提前结束循环
 *
 * 解题思路：
 * - 先对数组排序，使数组有序
 * - 固定第一个数 nums[i]，问题转化为在 nums[i+1..n-1] 中找两数之和等于 -nums[i]
 * - 使用双指针 left 和 right 从两端向中间移动
 * - 当 sum < 0 时，说明需要增大，left++
 * - 当 sum > 0 时，说明需要减小，right--
 * - 当 sum = 0 时，找到一个解，同时移动两个指针并跳过重复元素
 */

/**
 * 方法一：排序 + 双指针法（推荐解法）
 *
 * 核心思想：
 * 通过排序使数组有序，然后固定第一个数，用双指针在剩余部分寻找两数之和
 *
 * 算法步骤：
 * 1. 排序数组，使其从小到大有序
 * 2. 遍历数组，固定第一个数 nums[i]
 * 3. 设置双指针 left = i + 1, right = nums.length - 1
 * 4. 计算三数之和，根据结果移动指针
 * 5. 跳过重复元素，确保结果不重复
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[][]} 所有和为0的三元组
 * @time O(n²) - 外层循环O(n)，内层双指针O(n)
 * @space O(1) - 只使用常数额外空间（不考虑结果数组）
 */
function threeSum(nums) {
    const result = [];
    const n = nums.length;

    // 边界条件：数组长度小于3，无法组成三元组
    if (n < 3) return result;

    // 排序数组，使其有序
    nums.sort((a, b) => a - b);

    // 遍历数组，固定第一个数
    for (let i = 0; i < n - 2; i++) {
        // 如果当前数字大于0，后面的数字都大于0，和不可能为0
        if (nums[i] > 0) break;

        // 跳过重复的第一个数字
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        // 双指针寻找另外两个数
        let left = i + 1;
        let right = n - 1;

        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];

            if (sum === 0) {
                // 找到一个解
                result.push([nums[i], nums[left], nums[right]]);

                // 跳过重复的左指针元素
                while (left < right && nums[left] === nums[left + 1]) {
                    left++;
                }
                // 跳过重复的右指针元素
                while (left < right && nums[right] === nums[right - 1]) {
                    right--;
                }

                // 同时移动两个指针
                left++;
                right--;
            } else if (sum < 0) {
                // 和小于0，需要增大，移动左指针
                left++;
            } else {
                // 和大于0，需要减小，移动右指针
                right--;
            }
        }
    }

    return result;
}

/**
 * 方法二：哈希表法
 *
 * 核心思想：
 * 固定前两个数，用哈希表查找第三个数是否存在
 *
 * 算法步骤：
 * 1. 对数组排序（便于去重）
 * 2. 固定前两个数 nums[i] 和 nums[j]
 * 3. 计算目标值 target = -(nums[i] + nums[j])
 * 4. 在后续元素中查找是否存在 target
 * 5. 使用Set避免重复结果
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[][]} 所有和为0的三元组
 * @time O(n²) - 两层循环，每次哈希查找O(1)
 * @space O(n) - 哈希表存储空间
 */
function threeSumHashMap(nums) {
    const result = [];
    const n = nums.length;

    if (n < 3) return result;

    // 排序便于去重
    nums.sort((a, b) => a - b);

    for (let i = 0; i < n - 2; i++) {
        // 跳过重复的第一个数
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        const seen = new Set();

        for (let j = i + 1; j < n; j++) {
            // 跳过重复的第二个数
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;

            const target = -(nums[i] + nums[j]);

            if (seen.has(target)) {
                result.push([nums[i], target, nums[j]]);
            }

            seen.add(nums[j]);
        }
    }

    return result;
}

/**
 * 方法三：暴力法（用于理解和对比）
 *
 * 核心思想：
 * 三重循环枚举所有可能的三元组，检查和是否为0
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[][]} 所有和为0的三元组
 * @time O(n³) - 三重循环
 * @space O(1) - 不考虑结果存储空间
 */
function threeSumBruteForce(nums) {
    const result = [];
    const n = nums.length;

    if (n < 3) return result;

    // 排序便于去重
    nums.sort((a, b) => a - b);

    for (let i = 0; i < n - 2; i++) {
        // 跳过重复的第一个数
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        for (let j = i + 1; j < n - 1; j++) {
            // 跳过重复的第二个数
            if (j > i + 1 && nums[j] === nums[j - 1]) continue;

            for (let k = j + 1; k < n; k++) {
                // 跳过重复的第三个数
                if (k > j + 1 && nums[k] === nums[k - 1]) continue;

                if (nums[i] + nums[j] + nums[k] === 0) {
                    result.push([nums[i], nums[j], nums[k]]);
                }
            }
        }
    }

    return result;
}

/**
 * 方法四：优化的双指针法（带剪枝）
 *
 * 核心思想：
 * 在基本双指针法基础上添加更多剪枝条件，提高效率
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[][]} 所有和为0的三元组
 * @time O(n²) - 但常数因子更小
 * @space O(1) - 只使用常数额外空间
 */
function threeSumOptimized(nums) {
    const result = [];
    const n = nums.length;

    if (n < 3) return result;

    nums.sort((a, b) => a - b);

    for (let i = 0; i < n - 2; i++) {
        // 如果最小的数大于0，后面不可能有和为0的三元组
        if (nums[i] > 0) break;

        // 如果当前数字和最后两个数字的和小于0，当前数字太小
        if (nums[i] + nums[n - 1] + nums[n - 2] < 0) continue;

        // 跳过重复的第一个数字
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        let left = i + 1;
        let right = n - 1;

        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];

            if (sum === 0) {
                result.push([nums[i], nums[left], nums[right]]);

                // 跳过重复元素
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;

                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }

    return result;
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 021: 三数之和 测试 ===\n');

    const testCases = [
        {
            name: '基础测试',
            input: [-1, 0, 1, 2, -1, -4],
            expected: [[-1, -1, 2], [-1, 0, 1]]
        },
        {
            name: '空数组',
            input: [],
            expected: []
        },
        {
            name: '单个元素',
            input: [0],
            expected: []
        },
        {
            name: '两个元素',
            input: [1, 2],
            expected: []
        },
        {
            name: '全零数组',
            input: [0, 0, 0],
            expected: [[0, 0, 0]]
        },
        {
            name: '无解情况',
            input: [1, 2, 3],
            expected: []
        },
        {
            name: '有重复元素',
            input: [-1, 0, 1, 2, -1, -4, -2, -3, 3, 0, 4],
            expected: [[-4, 0, 4], [-4, 1, 3], [-3, -1, 4], [-3, 0, 3], [-3, 1, 2], [-2, -1, 3], [-2, 0, 2], [-1, -1, 2], [-1, 0, 1]]
        }
    ];

    const methods = [
        { name: '排序+双指针法', func: threeSum },
        { name: '哈希表法', func: threeSumHashMap },
        { name: '暴力法', func: threeSumBruteForce },
        { name: '优化双指针法', func: threeSumOptimized }
    ];

    testCases.forEach(testCase => {
        console.log(`测试: ${testCase.name}`);
        console.log(`输入: [${testCase.input.join(', ')}]`);
        console.log(`期望: ${JSON.stringify(testCase.expected)}`);

        methods.forEach(method => {
            const input = [...testCase.input]; // 创建副本避免修改原数组
            const result = method.func(input);
            const isCorrect = JSON.stringify(result.sort()) === JSON.stringify(testCase.expected.sort());
            console.log(`${method.name}: ${JSON.stringify(result)} ${isCorrect ? '✓' : '✗'}`);
        });
        console.log('');
    });
}

// 性能测试
function performanceTest() {
    console.log('=== 性能测试 ===\n');

    // 生成测试数据
    const generateTestArray = (size) => {
        const arr = [];
        for (let i = 0; i < size; i++) {
            arr.push(Math.floor(Math.random() * 200) - 100); // -100 到 100 的随机数
        }
        return arr;
    };

    const testSizes = [100, 500, 1000];
    const methods = [
        { name: '排序+双指针法', func: threeSum },
        { name: '优化双指针法', func: threeSumOptimized },
        { name: '哈希表法', func: threeSumHashMap }
    ];

    testSizes.forEach(size => {
        console.log(`数组大小: ${size}`);
        const testArray = generateTestArray(size);

        methods.forEach(method => {
            const startTime = performance.now();
            const result = method.func([...testArray]);
            const endTime = performance.now();

            console.log(`${method.name}: ${(endTime - startTime).toFixed(2)}ms, 结果数量: ${result.length}`);
        });
        console.log('');
    });
}

// 算法演示
function demonstrateAlgorithm() {
    console.log('=== 算法演示 ===\n');

    const nums = [-1, 0, 1, 2, -1, -4];
    console.log(`原数组: [${nums.join(', ')}]`);

    // 排序
    nums.sort((a, b) => a - b);
    console.log(`排序后: [${nums.join(', ')}]`);

    console.log('\n双指针查找过程：');

    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        console.log(`\n固定第一个数: nums[${i}] = ${nums[i]}`);

        let left = i + 1;
        let right = nums.length - 1;

        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            console.log(`  尝试: [${nums[i]}, ${nums[left]}, ${nums[right]}] = ${sum}`);

            if (sum === 0) {
                console.log(`  ✓ 找到解: [${nums[i]}, ${nums[left]}, ${nums[right]}]`);
                left++;
                right--;
            } else if (sum < 0) {
                console.log(`  和太小，左指针右移`);
                left++;
            } else {
                console.log(`  和太大，右指针左移`);
                right--;
            }
        }
    }
}

// 边界情况分析
function edgeCaseAnalysis() {
    console.log('=== 边界情况分析 ===\n');

    const edgeCases = [
        {
            name: '空数组',
            input: [],
            analysis: '数组为空，无法组成三元组'
        },
        {
            name: '数组长度 < 3',
            input: [1, 2],
            analysis: '数组长度小于3，无法组成三元组'
        },
        {
            name: '全相同元素（非零）',
            input: [1, 1, 1],
            analysis: '所有元素相同且非零，和不可能为0'
        },
        {
            name: '全相同元素（零）',
            input: [0, 0, 0, 0],
            analysis: '所有元素都是0，任意三个的和都是0'
        },
        {
            name: '最小可能数组',
            input: [0, 0, 0],
            analysis: '恰好3个元素且和为0的情况'
        },
        {
            name: '大数值',
            input: [1000000, -1000000, 0],
            analysis: '测试大数值情况下的正确性'
        }
    ];

    edgeCases.forEach(testCase => {
        console.log(`情况: ${testCase.name}`);
        console.log(`输入: [${testCase.input.join(', ')}]`);
        console.log(`分析: ${testCase.analysis}`);

        const result = threeSum([...testCase.input]);
        console.log(`结果: ${JSON.stringify(result)}`);
        console.log('');
    });
}

// 算法设计思想分析
function algorithmDesignAnalysis() {
    console.log('=== 算法设计思想分析 ===\n');

    console.log('1. 问题转化思想：');
    console.log('   三数之和 → 固定一个数 + 两数之和');
    console.log('   降低问题的维度，使复杂问题变得可解');

    console.log('\n2. 双指针技巧：');
    console.log('   利用数组有序的特性');
    console.log('   通过移动指针改变和的大小');
    console.log('   避免了嵌套循环，降低时间复杂度');

    console.log('\n3. 去重策略：');
    console.log('   排序 + 跳过重复元素');
    console.log('   确保结果不包含重复的三元组');

    console.log('\n4. 剪枝优化：');
    console.log('   利用排序的单调性提前终止');
    console.log('   减少不必要的计算');

    console.log('\n5. 空间优化：');
    console.log('   原地操作，只使用常数额外空间');
    console.log('   避免使用额外的数据结构存储中间结果');
}

// 复杂度分析
function complexityAnalysis() {
    console.log('=== 复杂度分析 ===\n');

    const methods = [
        {
            name: '排序+双指针法',
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(1)',
            description: '排序O(nlogn) + 双指针O(n²) = O(n²)'
        },
        {
            name: '哈希表法',
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(n)',
            description: '两层循环，每次哈希查找O(1)'
        },
        {
            name: '暴力法',
            timeComplexity: 'O(n³)',
            spaceComplexity: 'O(1)',
            description: '三重循环枚举所有可能组合'
        }
    ];

    console.log('各方法复杂度对比：');
    console.log('方法\t\t\t时间复杂度\t空间复杂度\t说明');
    console.log('-'.repeat(80));

    methods.forEach(method => {
        console.log(`${method.name.padEnd(15)}\t${method.timeComplexity}\t\t${method.spaceComplexity}\t\t${method.description}`);
    });

    console.log('\n推荐使用双指针法的原因：');
    console.log('1. 时间复杂度最优（不考虑哈希表常数因子）');
    console.log('2. 空间复杂度最优');
    console.log('3. 实现简洁，逻辑清晰');
    console.log('4. 容易扩展到N数之和问题');
}

// 扩展应用
function extendedApplications() {
    console.log('=== 扩展应用 ===\n');

    console.log('1. N数之和问题：');
    console.log('   - 四数之和：在三数之和基础上再固定一个数');
    console.log('   - K数之和：递归或迭代的方法');

    console.log('\n2. 最接近的三数之和：');
    console.log('   - 不要求和等于target，而是最接近target');
    console.log('   - 修改判断条件即可');

    console.log('\n3. 三数之和的数量：');
    console.log('   - 只需要统计满足条件的三元组数量');
    console.log('   - 不需要存储具体的三元组');

    // 示例：最接近的三数之和
    function threeSumClosest(nums, target) {
        nums.sort((a, b) => a - b);
        let closest = Infinity;
        let result = 0;

        for (let i = 0; i < nums.length - 2; i++) {
            let left = i + 1;
            let right = nums.length - 1;

            while (left < right) {
                const sum = nums[i] + nums[left] + nums[right];
                const diff = Math.abs(sum - target);

                if (diff < closest) {
                    closest = diff;
                    result = sum;
                }

                if (sum < target) {
                    left++;
                } else if (sum > target) {
                    right--;
                } else {
                    return sum; // 精确匹配
                }
            }
        }

        return result;
    }

    console.log('\n最接近三数之和示例：');
    const nums = [-1, 2, 1, -4];
    const target = 1;
    const closest = threeSumClosest(nums, target);
    console.log(`数组: [${nums.join(', ')}], 目标: ${target}`);
    console.log(`最接近的三数之和: ${closest}`);
}

// 实际应用示例
function practicalExample() {
    console.log('=== 实际应用示例 ===\n');

    console.log('场景：财务系统中的交易匹配');
    console.log('问题：在一系列交易金额中，找到三笔交易使得总和为0（即收支平衡）');

    // 模拟交易数据（正数表示收入，负数表示支出）
    const transactions = [
        -100, // 支出100
        -200, // 支出200
        150,  // 收入150
        50,   // 收入50
        300,  // 收入300
        -150, // 支出150
        -50,  // 支出50
        100   // 收入100
    ];

    console.log(`交易记录: [${transactions.join(', ')}]`);
    console.log('(正数=收入, 负数=支出)');

    const balancedSets = threeSum(transactions);

    console.log('\n找到的平衡交易组合：');
    balancedSets.forEach((set, index) => {
        console.log(`组合${index + 1}: [${set.join(', ')}] = ${set.reduce((a, b) => a + b, 0)}`);

        const types = set.map(amount => amount > 0 ? '收入' : '支出');
        console.log(`  交易类型: ${types.join(', ')}`);
    });

    if (balancedSets.length === 0) {
        console.log('未找到收支平衡的三笔交易组合');
    }
}

// 面试要点总结
function interviewKeyPoints() {
    console.log('=== 面试要点总结 ===\n');

    console.log('🎯 核心考点：');
    console.log('1. 双指针技巧的应用');
    console.log('2. 数组去重的处理');
    console.log('3. 问题转化的思想（三数→一数+二数）');
    console.log('4. 时间复杂度的优化');

    console.log('\n💡 解题步骤：');
    console.log('1. 分析题目：三个不同位置的数，和为0');
    console.log('2. 思考暴力：三重循环O(n³)');
    console.log('3. 优化思路：排序+双指针降低到O(n²)');
    console.log('4. 处理边界：去重、剪枝');

    console.log('\n🔍 易错点：');
    console.log('1. 忘记排序');
    console.log('2. 重复结果的处理');
    console.log('3. 边界条件的判断');
    console.log('4. 指针移动的逻辑');

    console.log('\n📈 扩展问题：');
    console.log('1. 四数之和、K数之和');
    console.log('2. 最接近的三数之和');
    console.log('3. 三数之和的变种问题');

    console.log('\n⚡ 优化技巧：');
    console.log('1. 提前剪枝（nums[i] > 0 时break）');
    console.log('2. 跳过重复元素');
    console.log('3. 利用排序的单调性');
}

// 导出所有方法
module.exports = {
    threeSum,
    threeSumHashMap,
    threeSumBruteForce,
    threeSumOptimized,
    runTests,
    performanceTest,
    demonstrateAlgorithm,
    edgeCaseAnalysis,
    algorithmDesignAnalysis,
    complexityAnalysis,
    extendedApplications,
    practicalExample,
    interviewKeyPoints
};

// 如果直接运行此文件，则执行测试
if (require.main === module) {
    runTests();
    performanceTest();
    demonstrateAlgorithm();
    edgeCaseAnalysis();
    algorithmDesignAnalysis();
    complexityAnalysis();
    extendedApplications();
    practicalExample();
    interviewKeyPoints();
}