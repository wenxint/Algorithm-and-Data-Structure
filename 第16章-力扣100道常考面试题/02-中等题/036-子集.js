/**
 * LeetCode 78. 子集
 *
 * 问题描述：
 * 给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。
 * 解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。
 *
 * 核心思想：
 * 子集问题是组合问题的变体，每个元素都有选择和不选择两种状态
 * 可以用回溯、迭代、位运算等多种方法解决
 *
 * 示例：
 * 输入：nums = [1,2,3]
 * 输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
 */

/**
 * 方法一：回溯算法
 *
 * 核心思想：
 * 对于每个元素，都有两种选择：加入当前子集或不加入
 * 使用回溯算法遍历所有可能的选择组合
 *
 * 算法步骤：
 * 1. 维护当前子集路径
 * 2. 对每个元素，尝试选择和不选择
 * 3. 每到一个节点都记录当前子集
 * 4. 递归处理剩余元素
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[][]} 所有可能的子集
 * @time O(2^n * n) 2^n个子集，每个子集需要O(n)时间复制
 * @space O(n) 递归栈深度
 */
function subsets(nums) {
    console.log("=== 子集生成（回溯法） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    const result = [];
    const path = [];

    /**
     * 回溯递归函数
     * @param {number} startIndex - 开始考虑的元素索引
     */
    function backtrack(startIndex) {
        console.log(`  回溯: 起始索引=${startIndex}, 当前子集=[${path.join(',')}]`);

        // 每到一个节点就记录当前子集（包括空集）
        result.push([...path]);
        console.log(`    ✅ 记录子集: [${path.join(',')}]`);

        // 尝试添加从startIndex开始的每个元素
        for (let i = startIndex; i < nums.length; i++) {
            console.log(`    考虑添加元素: ${nums[i]} (索引${i})`);

            // 选择当前元素
            path.push(nums[i]);
            console.log(`      选择: [${path.join(',')}]`);

            // 递归处理后续元素
            backtrack(i + 1);

            // 回溯：移除当前元素
            path.pop();
            console.log(`      回溯移除: ${nums[i]}`);
        }
    }

    backtrack(0);

    console.log(`\n总共生成 ${result.length} 个子集`);
    console.log(`所有子集:`);
    result.forEach((subset, i) => {
        console.log(`  ${i + 1}: [${subset.join(',')}]`);
    });

    return result;
}

/**
 * 方法二：迭代法
 *
 * 核心思想：
 * 从空集开始，依次添加每个元素
 * 每添加一个元素，就将其加入到现有的所有子集中，生成新的子集
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[][]} 所有可能的子集
 * @time O(2^n * n) 2^n个子集，每个子集需要O(n)时间复制
 * @space O(1) 除了结果数组外不使用额外空间
 */
function subsetsIterative(nums) {
    console.log("\n=== 子集生成（迭代法） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    // 初始化：只包含空集
    let result = [[]];
    console.log(`初始状态: ${JSON.stringify(result)}`);

    // 依次处理每个元素
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        console.log(`\n处理元素: ${num}`);
        console.log(`当前子集数量: ${result.length}`);

        const newSubsets = [];

        // 对每个现有子集，创建包含当前元素的新子集
        for (let j = 0; j < result.length; j++) {
            const currentSubset = result[j];
            const newSubset = [...currentSubset, num];
            newSubsets.push(newSubset);

            console.log(`  [${currentSubset.join(',')}] + ${num} = [${newSubset.join(',')}]`);
        }

        // 将新子集加入结果
        result = result.concat(newSubsets);
        console.log(`更新后子集数量: ${result.length}`);
        console.log(`当前所有子集: ${JSON.stringify(result)}`);
    }

    console.log(`\n最终结果:`);
    result.forEach((subset, i) => {
        console.log(`  ${i + 1}: [${subset.join(',')}]`);
    });

    return result;
}

/**
 * 方法三：位运算法
 *
 * 核心思想：
 * 用n位二进制数表示子集，每一位表示对应元素是否在子集中
 * 从0到2^n-1遍历所有可能的二进制组合
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[][]} 所有可能的子集
 * @time O(2^n * n) 2^n个子集，每个子集需要O(n)时间生成
 * @space O(1) 除了结果数组外不使用额外空间
 */
function subsetsBitwise(nums) {
    console.log("\n=== 子集生成（位运算法） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    const result = [];
    const n = nums.length;
    const totalSubsets = 1 << n; // 2^n

    console.log(`数组长度: ${n}, 总子集数: ${totalSubsets}`);

    // 遍历从0到2^n-1的所有数字
    for (let mask = 0; mask < totalSubsets; mask++) {
        const subset = [];
        const binaryStr = mask.toString(2).padStart(n, '0');

        console.log(`\n处理掩码: ${mask} (二进制: ${binaryStr})`);

        // 检查每一位，如果为1则包含对应元素
        for (let i = 0; i < n; i++) {
            if (mask & (1 << i)) {
                subset.push(nums[i]);
                console.log(`  位 ${i} 为1，包含元素 ${nums[i]}`);
            } else {
                console.log(`  位 ${i} 为0，不包含元素 ${nums[i]}`);
            }
        }

        result.push(subset);
        console.log(`  生成子集: [${subset.join(',')}]`);
    }

    console.log(`\n所有子集:`);
    result.forEach((subset, i) => {
        console.log(`  ${i + 1}: [${subset.join(',')}]`);
    });

    return result;
}

/**
 * 方法四：递归分治法
 *
 * 核心思想：
 * 将问题分解为子问题：包含第一个元素的子集 + 不包含第一个元素的子集
 * 递归求解子问题，然后合并结果
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[][]} 所有可能的子集
 * @time O(2^n * n) 2^n个子集，每个子集需要O(n)时间复制
 * @space O(n * 2^n) 递归栈空间 + 结果存储空间
 */
function subsetsRecursive(nums) {
    console.log("\n=== 子集生成（递归分治法） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    /**
     * 递归函数
     * @param {number[]} arr - 当前要处理的数组
     * @returns {number[][]} 数组的所有子集
     */
    function helper(arr) {
        console.log(`  递归处理: [${arr.join(',')}]`);

        // 基本情况：空数组只有一个子集（空集）
        if (arr.length === 0) {
            console.log(`    基本情况: 返回 [[]]`);
            return [[]];
        }

        // 取出第一个元素和剩余元素
        const first = arr[0];
        const rest = arr.slice(1);

        console.log(`    第一个元素: ${first}, 剩余: [${rest.join(',')}]`);

        // 递归获取剩余元素的所有子集
        const subsetsWithoutFirst = helper(rest);
        console.log(`    不包含 ${first} 的子集数: ${subsetsWithoutFirst.length}`);

        // 创建包含第一个元素的子集
        const subsetsWithFirst = subsetsWithoutFirst.map(subset => [first, ...subset]);
        console.log(`    包含 ${first} 的子集数: ${subsetsWithFirst.length}`);

        // 合并两种子集
        const allSubsets = [...subsetsWithoutFirst, ...subsetsWithFirst];

        console.log(`    合并后子集数: ${allSubsets.length}`);
        console.log(`    返回子集: ${JSON.stringify(allSubsets)}`);

        return allSubsets;
    }

    const result = helper(nums);

    console.log(`\n最终结果:`);
    result.forEach((subset, i) => {
        console.log(`  ${i + 1}: [${subset.join(',')}]`);
    });

    return result;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 验证子集结果是否正确
 */
function validateSubsets(nums, subsets) {
    console.log("\n=== 结果验证 ===");

    // 检查子集数量是否正确
    const expectedCount = Math.pow(2, nums.length);
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log(`期望子集数: ${expectedCount}`);
    console.log(`实际子集数: ${subsets.length}`);
    console.log(`数量正确: ${subsets.length === expectedCount ? '✅' : '❌'}`);

    // 检查是否包含空集
    const hasEmptySet = subsets.some(subset => subset.length === 0);
    console.log(`包含空集: ${hasEmptySet ? '✅' : '❌'}`);

    // 检查是否包含完整集合
    const hasFullSet = subsets.some(subset =>
        subset.length === nums.length &&
        nums.every(num => subset.includes(num))
    );
    console.log(`包含完整集合: ${hasFullSet ? '✅' : '❌'}`);

    // 检查每个子集是否有效
    let allValid = true;
    for (let i = 0; i < Math.min(subsets.length, 10); i++) {
        const subset = subsets[i];
        const isValid = subset.every(element => nums.includes(element));

        console.log(`子集 ${i + 1} [${subset.join(',')}]: ${isValid ? '✅' : '❌'}`);
        if (!isValid) allValid = false;
    }

    if (subsets.length > 10) {
        console.log("... (显示前10个子集)");
    }

    // 检查是否有重复子集
    const uniqueSubsets = new Set(subsets.map(subset =>
        [...subset].sort((a, b) => a - b).join(',')
    ));
    const noDuplicates = uniqueSubsets.size === subsets.length;
    console.log(`无重复子集: ${noDuplicates ? '✅' : '❌'}`);

    console.log(`整体验证: ${allValid && noDuplicates && hasEmptySet && hasFullSet ? '✅' : '❌'}`);
    return allValid && noDuplicates && hasEmptySet && hasFullSet;
}

/**
 * 比较两个子集结果是否相同（忽略顺序）
 */
function compareSubsets(subsets1, subsets2) {
    if (subsets1.length !== subsets2.length) {
        return false;
    }

    const normalize = (subsets) => {
        return subsets
            .map(subset => [...subset].sort((a, b) => a - b).join(','))
            .sort();
    };

    const norm1 = normalize(subsets1);
    const norm2 = normalize(subsets2);

    return JSON.stringify(norm1) === JSON.stringify(norm2);
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const testCases = [
        [1, 2, 3],
        [1, 2, 3, 4],
        [1, 2, 3, 4, 5]
    ];

    for (const testCase of testCases) {
        console.log(`\n测试数组: [${testCase.join(', ')}] (${testCase.length}个元素)`);
        console.log(`期望子集数: ${Math.pow(2, testCase.length)}`);

        // 测试各种方法的性能
        const methods = [
            { name: '回溯法', func: subsets },
            { name: '迭代法', func: subsetsIterative },
            { name: '位运算法', func: subsetsBitwise },
            { name: '递归分治', func: subsetsRecursive }
        ];

        for (const method of methods) {
            const startTime = performance.now();
            const result = method.func([...testCase]);
            const endTime = performance.now();

            console.log(`${method.name}: ${result.length} 个子集, 耗时 ${(endTime - startTime).toFixed(2)}ms`);
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
    console.log("子集生成算法测试");
    console.log("=".repeat(50));

    const testCases = [
        {
            input: [1, 2, 3],
            expected: [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]
        },
        {
            input: [0],
            expected: [[], [0]]
        },
        {
            input: [],
            expected: [[]]
        },
        {
            input: [1, 2],
            expected: [[], [1], [2], [1,2]]
        }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}`);
        console.log(`${"=".repeat(30)}`);

        // 测试所有方法
        const methods = [
            { name: "回溯法", func: subsets },
            { name: "迭代法", func: subsetsIterative },
            { name: "位运算法", func: subsetsBitwise },
            { name: "递归分治", func: subsetsRecursive }
        ];

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func([...testCase.input]);
                results.push(result);
                validateSubsets(testCase.input, result);
            } catch (error) {
                console.log(`❌ 方法执行失败: ${error.message}`);
                results.push([]);
            }
        }

        // 比较所有方法的结果是否一致
        console.log("\n--- 方法一致性检查 ---");
        const allSame = results.every(result =>
            compareSubsets(result, results[0])
        );
        console.log(`所有方法结果一致: ${allSame ? '✅' : '❌'}`);
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
    console.log("子集生成算法演示");
    console.log("=".repeat(50));

    const demoArray = [1, 2, 3];

    console.log("子集问题的核心思想:");
    console.log("1. 子集是原集合的一部分，可以是空集或原集合本身");
    console.log("2. n个元素的集合有2^n个子集");
    console.log("3. 每个元素都有两种状态：包含在子集中或不包含");
    console.log("4. 可以用回溯、迭代、位运算等方法生成");

    console.log(`\n演示数组: [${demoArray.join(', ')}]`);
    console.log(`期望子集数: ${Math.pow(2, demoArray.length)}个`);

    console.log("\n决策树结构 (回溯法):");
    console.log("                    []");
    console.log("                  /    \\");
    console.log("           不选1 /      \\ 选1");
    console.log("              []        [1]");
    console.log("             / \\       / \\");
    console.log("      不选2 /   \\ 选2 /   \\ 选2");
    console.log("          []    [2]  [1]  [1,2]");
    console.log("         / \\   / \\  / \\   / \\");
    console.log("        [] [3] [2][2,3][1][1,3][1,2][1,2,3]");

    console.log("\n位运算对应关系:");
    console.log("二进制 000 -> [] (都不选)");
    console.log("二进制 001 -> [3] (只选第3个)");
    console.log("二进制 010 -> [2] (只选第2个)");
    console.log("二进制 011 -> [2,3] (选第2,3个)");
    console.log("二进制 100 -> [1] (只选第1个)");
    console.log("二进制 101 -> [1,3] (选第1,3个)");
    console.log("二进制 110 -> [1,2] (选第1,2个)");
    console.log("二进制 111 -> [1,2,3] (都选)");

    console.log("\n详细演示 - 回溯法:");
    const result = subsets(demoArray);

    console.log("\n复杂度分析:");
    console.log("时间复杂度: O(2^n * n) - 2^n个子集，每个需要O(n)时间复制");
    console.log("空间复杂度: O(n) - 递归栈深度");
    console.log("结果存储: O(n * 2^n) - 存储所有子集");
}

// ===========================================
// 面试要点
// ===========================================

/**
 * 面试关键点总结
 */
function interviewKeyPoints() {
    console.log("\n" + "=".repeat(50));
    console.log("面试关键点");
    console.log("=".repeat(50));

    console.log("\n🎯 核心概念:");
    console.log("1. 子集是原集合的任意组合，包括空集和原集合");
    console.log("2. n个元素的集合有2^n个子集");
    console.log("3. 每个元素有选择和不选择两种状态");
    console.log("4. 回溯算法是生成子集的经典方法");

    console.log("\n🔧 实现技巧:");
    console.log("1. 回溯法：每个节点都记录当前子集");
    console.log("2. 迭代法：逐个添加元素，扩展现有子集");
    console.log("3. 位运算法：用二进制位表示元素的选择状态");
    console.log("4. 递归分治：分为包含和不包含第一个元素两类");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 忘记包含空集");
    console.log("2. 生成重复的子集");
    console.log("3. 忘记深拷贝结果子集");
    console.log("4. 位运算法中位的索引计算错误");

    console.log("\n🎨 变体问题:");
    console.log("1. 子集II（包含重复元素）");
    console.log("2. 组合问题（固定大小的子集）");
    console.log("3. 分割等和子集");
    console.log("4. 最大子集问题");

    console.log("\n📊 复杂度分析:");
    console.log("1. 时间复杂度：O(2^n * n)");
    console.log("2. 空间复杂度：O(n) 递归栈 + O(n * 2^n) 结果存储");
    console.log("3. 不同方法的常数因子略有差异");
    console.log("4. 位运算法在常数因子上最优");

    console.log("\n💡 面试技巧:");
    console.log("1. 先用回溯法解决，思路最清晰");
    console.log("2. 画出决策树帮助理解");
    console.log("3. 讨论多种解法的优缺点");
    console.log("4. 分析时间空间复杂度");
    console.log("5. 考虑大数据量下的优化");

    console.log("\n🔍 相关概念:");
    console.log("1. 幂集：所有子集的集合");
    console.log("2. 组合数学：C(n,k)表示n选k的组合数");
    console.log("3. 二进制枚举：位运算的应用");
    console.log("4. 回溯算法：搜索所有可能解的方法");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        subsets,
        subsetsIterative,
        subsetsBitwise,
        subsetsRecursive,
        validateSubsets,
        compareSubsets,
        performanceTest,
        runTests,
        demonstrateAlgorithm,
        interviewKeyPoints
    };
}

// 如果在浏览器环境中，运行演示
if (typeof window !== 'undefined') {
    runTests();
    demonstrateAlgorithm();
    interviewKeyPoints();
}