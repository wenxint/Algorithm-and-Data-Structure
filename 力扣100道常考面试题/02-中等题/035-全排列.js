/**
 * LeetCode 46. 全排列
 *
 * 问题描述：
 * 给定一个不含重复数字的数组 nums ，返回其所有可能的全排列。你可以按任意顺序返回答案。
 *
 * 核心思想：
 * 使用回溯算法，通过交换或选择的方式生成所有可能的排列
 * 全排列就是对n个不同元素进行排序的所有可能方案
 *
 * 示例：
 * 输入：nums = [1,2,3]
 * 输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
 */

/**
 * 方法一：回溯算法（使用访问标记）
 *
 * 核心思想：
 * 使用回溯算法，维护一个访问数组标记已使用的元素
 * 每次选择一个未使用的元素加入当前排列，递归生成剩余排列
 * 回溯时撤销选择，继续尝试其他可能
 *
 * 算法步骤：
 * 1. 维护当前排列路径和访问标记数组
 * 2. 每次从未访问的元素中选择一个
 * 3. 标记为已访问，加入路径，递归
 * 4. 递归返回后撤销标记，移除路径
 * 5. 当路径长度等于原数组长度时，记录一个完整排列
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[][]} 所有可能的排列
 * @time O(n! * n) n!个排列，每个排列需要O(n)时间复制
 * @space O(n) 递归栈深度 + 访问数组空间
 */
function permute(nums) {
    console.log("=== 全排列（回溯法 - 访问标记） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    const result = [];
    const path = [];
    const used = new Array(nums.length).fill(false);

    /**
     * 回溯递归函数
     */
    function backtrack() {
        console.log(`  回溯: 当前路径=[${path.join(',')}], 已用标记=[${used.map(u => u ? '1' : '0').join('')}]`);

        // 基本情况：路径长度等于数组长度，找到一个完整排列
        if (path.length === nums.length) {
            const permutation = [...path]; // 深拷贝当前路径
            result.push(permutation);
            console.log(`    ✅ 找到排列: [${permutation.join(',')}]`);
            return;
        }

        // 尝试每个未使用的元素
        for (let i = 0; i < nums.length; i++) {
            if (used[i]) {
                console.log(`    跳过已使用元素: ${nums[i]} (位置${i})`);
                continue;
            }

            // 选择当前元素
            path.push(nums[i]);
            used[i] = true;
            console.log(`    选择元素: ${nums[i]} (位置${i})`);

            // 递归生成剩余排列
            backtrack();

            // 回溯：撤销选择
            path.pop();
            used[i] = false;
            console.log(`    回溯移除: ${nums[i]} (位置${i})`);
        }
    }

    backtrack();

    console.log(`总共找到 ${result.length} 个排列`);
    console.log(`所有排列:`);
    result.forEach((perm, i) => {
        console.log(`  ${i + 1}: [${perm.join(',')}]`);
    });

    return result;
}

/**
 * 方法二：回溯算法（交换元素）
 *
 * 核心思想：
 * 通过交换元素位置来生成排列，不需要额外的访问数组
 * 当前位置与后面所有位置进行交换，递归处理后面的位置
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[][]} 所有可能的排列
 * @time O(n! * n) n!个排列，每个排列需要O(n)时间复制
 * @space O(n) 递归栈深度
 */
function permuteBySwap(nums) {
    console.log("\n=== 全排列（回溯法 - 交换元素） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    const result = [];
    const arr = [...nums]; // 复制数组避免修改原数组

    /**
     * 回溯递归函数
     * @param {number} startIndex - 当前要确定的位置
     */
    function backtrackSwap(startIndex) {
        console.log(`  回溯: 确定位置${startIndex}, 当前数组=[${arr.join(',')}]`);

        // 基本情况：所有位置都已确定
        if (startIndex === arr.length) {
            const permutation = [...arr]; // 深拷贝当前数组
            result.push(permutation);
            console.log(`    ✅ 找到排列: [${permutation.join(',')}]`);
            return;
        }

        // 尝试将startIndex位置与后面每个位置交换
        for (let i = startIndex; i < arr.length; i++) {
            console.log(`    尝试交换位置 ${startIndex} 和 ${i}: ${arr[startIndex]} <-> ${arr[i]}`);

            // 交换元素
            [arr[startIndex], arr[i]] = [arr[i], arr[startIndex]];
            console.log(`    交换后数组: [${arr.join(',')}]`);

            // 递归处理下一个位置
            backtrackSwap(startIndex + 1);

            // 回溯：恢复交换
            [arr[startIndex], arr[i]] = [arr[i], arr[startIndex]];
            console.log(`    恢复交换: [${arr.join(',')}]`);
        }
    }

    backtrackSwap(0);

    console.log(`总共找到 ${result.length} 个排列`);
    return result;
}

/**
 * 方法三：迭代法（逐个插入）
 *
 * 核心思想：
 * 从空排列开始，每次取一个新元素，将其插入到现有排列的所有可能位置
 * 逐步构建出所有排列
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[][]} 所有可能的排列
 * @time O(n! * n) n!个排列，每个排列需要O(n)时间复制
 * @space O(n! * n) 存储所有排列的空间
 */
function permuteIterative(nums) {
    console.log("\n=== 全排列（迭代法 - 逐个插入） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    // 初始化：从包含空排列的列表开始
    let permutations = [[]];

    // 依次处理每个元素
    for (let k = 0; k < nums.length; k++) {
        const num = nums[k];
        console.log(`\n处理第 ${k + 1} 个元素: ${num}`);
        console.log(`当前排列数量: ${permutations.length}`);

        const newPermutations = [];

        // 对每个现有排列，将新元素插入到所有可能位置
        for (let i = 0; i < permutations.length; i++) {
            const currentPerm = permutations[i];
            console.log(`  处理排列: [${currentPerm.join(',')}]`);

            // 在每个可能位置插入新元素
            for (let j = 0; j <= currentPerm.length; j++) {
                const newPerm = [...currentPerm];
                newPerm.splice(j, 0, num);
                newPermutations.push(newPerm);
                console.log(`    插入位置 ${j}: [${newPerm.join(',')}]`);
            }
        }

        permutations = newPermutations;
        console.log(`更新后排列数量: ${permutations.length}`);
    }

    console.log(`\n最终结果:`);
    permutations.forEach((perm, i) => {
        console.log(`  ${i + 1}: [${perm.join(',')}]`);
    });

    return permutations;
}

/**
 * 方法四：字典序算法（Heap算法的简化版）
 *
 * 核心思想：
 * 基于字典序生成下一个排列的算法
 * 从最小字典序开始，依次生成下一个字典序排列
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[][]} 所有可能的排列
 * @time O(n! * n) n!个排列，每次生成下一个排列需要O(n)时间
 * @space O(1) 除了结果数组外只使用常数空间
 */
function permuteLexicographic(nums) {
    console.log("\n=== 全排列（字典序算法） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    const result = [];
    const arr = [...nums].sort((a, b) => a - b); // 从最小字典序开始

    /**
     * 生成下一个字典序排列
     * @returns {boolean} 是否成功生成下一个排列
     */
    function nextPermutation() {
        // 1. 从右向左找到第一个arr[i] < arr[i+1]的位置i
        let i = arr.length - 2;
        while (i >= 0 && arr[i] >= arr[i + 1]) {
            i--;
        }

        // 如果找不到这样的i，说明当前排列是最大字典序，没有下一个排列
        if (i < 0) {
            return false;
        }

        // 2. 从右向左找到第一个arr[j] > arr[i]的位置j
        let j = arr.length - 1;
        while (arr[j] <= arr[i]) {
            j--;
        }

        // 3. 交换arr[i]和arr[j]
        [arr[i], arr[j]] = [arr[j], arr[i]];

        // 4. 反转arr[i+1:]部分
        let left = i + 1, right = arr.length - 1;
        while (left < right) {
            [arr[left], arr[right]] = [arr[right], arr[left]];
            left++;
            right--;
        }

        return true;
    }

    // 添加第一个排列（最小字典序）
    result.push([...arr]);
    console.log(`初始排列: [${arr.join(',')}]`);

    // 生成所有后续排列
    let count = 1;
    while (nextPermutation()) {
        result.push([...arr]);
        console.log(`排列 ${count + 1}: [${arr.join(',')}]`);
        count++;
    }

    console.log(`总共生成 ${result.length} 个排列`);
    return result;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 验证排列结果是否正确
 */
function validatePermutations(nums, permutations) {
    console.log("\n=== 结果验证 ===");

    // 检查排列数量是否正确
    const expectedCount = factorial(nums.length);
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log(`期望排列数: ${expectedCount}`);
    console.log(`实际排列数: ${permutations.length}`);
    console.log(`数量正确: ${permutations.length === expectedCount ? '✅' : '❌'}`);

    // 检查每个排列是否有效
    const sortedNums = [...nums].sort((a, b) => a - b);
    let allValid = true;

    for (let i = 0; i < Math.min(permutations.length, 10); i++) {
        const perm = permutations[i];
        const sortedPerm = [...perm].sort((a, b) => a - b);
        const isValid = JSON.stringify(sortedPerm) === JSON.stringify(sortedNums);

        console.log(`排列 ${i + 1} [${perm.join(',')}]: ${isValid ? '✅' : '❌'}`);
        if (!isValid) allValid = false;
    }

    if (permutations.length > 10) {
        console.log("... (显示前10个排列)");
    }

    // 检查是否有重复排列
    const uniquePerms = new Set(permutations.map(perm => perm.join(',')));
    const noDuplicates = uniquePerms.size === permutations.length;
    console.log(`无重复排列: ${noDuplicates ? '✅' : '❌'}`);

    console.log(`整体验证: ${allValid && noDuplicates ? '✅' : '❌'}`);
    return allValid && noDuplicates;
}

/**
 * 计算阶乘
 */
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

/**
 * 比较两个排列结果是否相同（忽略顺序）
 */
function comparePermutations(perms1, perms2) {
    if (perms1.length !== perms2.length) {
        return false;
    }

    const normalize = (perms) => {
        return perms.map(perm => perm.join(',')).sort();
    };

    const norm1 = normalize(perms1);
    const norm2 = normalize(perms2);

    return JSON.stringify(norm1) === JSON.stringify(norm2);
}

// ===========================================
// 测试用例
// ===========================================

/**
 * 测试函数
 */
function runTests() {
    console.log("=".repeat(50));
    console.log("全排列算法测试");
    console.log("=".repeat(50));

    const testCases = [
        {
            input: [1, 2, 3],
            expected: [
                [1,2,3], [1,3,2], [2,1,3],
                [2,3,1], [3,1,2], [3,2,1]
            ]
        },
        {
            input: [0, 1],
            expected: [[0,1], [1,0]]
        },
        {
            input: [1],
            expected: [[1]]
        },
        {
            input: [1, 2, 3, 4],
            expected: null // 太多结果，不列举
        }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}`);
        console.log(`${"=".repeat(30)}`);

        // 测试所有方法
        const methods = [
            { name: "回溯法(访问标记)", func: permute },
            { name: "回溯法(交换元素)", func: permuteBySwap },
            { name: "迭代法(逐个插入)", func: permuteIterative },
            { name: "字典序算法", func: permuteLexicographic }
        ];

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func([...testCase.input]);
                results.push(result);
                validatePermutations(testCase.input, result);
            } catch (error) {
                console.log(`❌ 方法执行失败: ${error.message}`);
                results.push([]);
            }
        }

        // 比较所有方法的结果是否一致
        console.log("\n--- 方法一致性检查 ---");
        const allSame = results.every(result =>
            comparePermutations(result, results[0])
        );
        console.log(`所有方法结果一致: ${allSame ? '✅' : '❌'}`);
    });
}

// ===========================================
// 算法演示
// ===========================================

/**
 * 算法演示函数
 */
function demonstrateAlgorithm() {
    console.log("\n" + "=".repeat(50));
    console.log("全排列算法演示");
    console.log("=".repeat(50));

    const demoArray = [1, 2, 3];

    console.log("全排列的核心思想:");
    console.log("1. 排列是对元素的一种排序，顺序不同则为不同排列");
    console.log("2. n个不同元素的全排列共有n!种");
    console.log("3. 可以用回溯、迭代、字典序等多种方法生成");

    console.log(`\n演示数组: [${demoArray.join(', ')}]`);
    console.log(`期望排列数: ${factorial(demoArray.length)}个`);

    console.log("\n搜索树结构 (回溯法):");
    console.log("                    []");
    console.log("            /       |       \\");
    console.log("         [1]       [2]      [3]");
    console.log("        /  \\      /  \\     /  \\");
    console.log("    [1,2] [1,3] [2,1] [2,3] [3,1] [3,2]");
    console.log("      |     |     |     |     |     |");
    console.log("   [1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]");

    console.log("\n详细演示 - 回溯法:");
    const result = permute(demoArray);

    console.log("\n复杂度分析:");
    console.log("时间复杂度: O(n! * n) - n!个排列，每个需要O(n)时间复制");
    console.log("空间复杂度: O(n) - 递归栈深度");
    console.log("结果存储: O(n! * n) - 存储所有排列");
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
    console.log("1. 全排列是对n个不同元素的所有可能排序");
    console.log("2. n个元素的全排列共有n!种");
    console.log("3. 回溯算法是解决排列问题的经典方法");
    console.log("4. 需要考虑如何避免重复和遗漏");

    console.log("\n🔧 实现技巧:");
    console.log("1. 访问标记法：使用boolean数组标记已使用元素");
    console.log("2. 交换元素法：通过交换避免额外空间");
    console.log("3. 迭代插入法：逐个元素插入现有排列");
    console.log("4. 字典序法：按字典序生成下一个排列");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 忘记深拷贝结果，导致所有排列相同");
    console.log("2. 回溯时忘记恢复状态");
    console.log("3. 边界条件：空数组、单元素数组");
    console.log("4. 交换法中忘记恢复交换");

    console.log("\n🎨 变体问题:");
    console.log("1. 全排列II（包含重复数字）");
    console.log("2. 下一个排列");
    console.log("3. 第k个排列");
    console.log("4. 字符串的排列");

    console.log("\n📊 复杂度分析:");
    console.log("1. 时间复杂度：O(n! * n)");
    console.log("2. 空间复杂度：O(n) 递归栈 + O(n! * n) 结果存储");
    console.log("3. 不同方法的空间使用略有差异");
    console.log("4. 实际应用中需要考虑内存限制");

    console.log("\n💡 面试技巧:");
    console.log("1. 先画出搜索树帮助理解");
    console.log("2. 从最简单的回溯法开始");
    console.log("3. 讨论不同方法的优缺点");
    console.log("4. 考虑优化方案（如交换法节省空间）");
    console.log("5. 分析时间空间复杂度");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        permute,
        permuteBySwap,
        permuteIterative,
        permuteLexicographic,
        validatePermutations,
        factorial,
        comparePermutations,
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