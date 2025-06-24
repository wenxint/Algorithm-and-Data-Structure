/**
 * LeetCode 017: 电话号码的字母组合 (Letter Combinations of a Phone Number)
 *
 * 问题描述：
 * 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按任意顺序返回。
 * 给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。
 *
 * 数字字母映射：
 * 2: "abc"
 * 3: "def"
 * 4: "ghi"
 * 5: "jkl"
 * 6: "mno"
 * 7: "pqrs"
 * 8: "tuv"
 * 9: "wxyz"
 *
 * 核心思想：
 * 这是一个典型的回溯算法问题，需要生成所有可能的组合：
 * 1. 对于每个数字，选择对应的一个字母
 * 2. 递归处理下一个数字
 * 3. 回溯到上一级，尝试其他字母选择
 * 4. 重复直到处理完所有数字
 *
 * 示例：
 * 输入：digits = "23"
 * 输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]
 * 解释：数字2对应"abc"，数字3对应"def"，所有组合为上述结果
 *
 * 输入：digits = ""
 * 输出：[]
 *
 * 输入：digits = "2"
 * 输出：["a","b","c"]
 */

/**
 * 方法一：回溯算法（推荐）
 *
 * 核心思想：
 * 使用深度优先搜索(DFS)的思想，逐位选择字母：
 * 1. 对当前数字的每个字母选择，递归处理下一位
 * 2. 当处理完所有数字时，将当前组合加入结果
 * 3. 回溯到上一层，尝试其他字母选择
 *
 * @param {string} digits - 输入的数字字符串
 * @return {string[]} 所有可能的字母组合
 * @time O(3^m * 4^n) m是对应3个字母的数字个数，n是对应4个字母的数字个数
 * @space O(3^m * 4^n) 递归栈深度为数字串长度，结果空间为所有组合数
 */
function letterCombinations(digits) {
    console.log("=== 回溯算法 ===");
    console.log("输入数字串:", digits);

    if (!digits || digits.length === 0) {
        console.log("输入为空，返回空数组");
        return [];
    }

    // 数字到字母的映射
    const digitToLetters = {
        '2': 'abc',
        '3': 'def',
        '4': 'ghi',
        '5': 'jkl',
        '6': 'mno',
        '7': 'pqrs',
        '8': 'tuv',
        '9': 'wxyz'
    };

    console.log("数字字母映射:", digitToLetters);

    const result = [];
    const currentCombination = [];

    /**
     * 回溯函数
     * @param {number} index - 当前处理的数字位置
     */
    function backtrack(index) {
        console.log(`  回溯函数: index=${index}, 当前组合=${currentCombination.join('')}`);

        // 基础情况：处理完所有数字
        if (index === digits.length) {
            const combination = currentCombination.join('');
            result.push(combination);
            console.log(`    找到完整组合: ${combination}`);
            return;
        }

        // 获取当前数字对应的字母
        const currentDigit = digits[index];
        const letters = digitToLetters[currentDigit];
        console.log(`    处理数字${currentDigit}，对应字母: ${letters}`);

        // 尝试每个字母
        for (let i = 0; i < letters.length; i++) {
            const letter = letters[i];
            console.log(`      尝试字母: ${letter}`);

            // 选择当前字母
            currentCombination.push(letter);

            // 递归处理下一位数字
            backtrack(index + 1);

            // 回溯：撤销选择
            currentCombination.pop();
            console.log(`      回溯: 撤销字母${letter}`);
        }
    }

    console.log("\n开始回溯搜索:");
    backtrack(0);

    console.log(`\n最终结果: [${result.map(s => `"${s}"`).join(', ')}]`);
    console.log(`总组合数: ${result.length}`);
    return result;
}

/**
 * 方法二：迭代法（队列BFS）
 *
 * 核心思想：
 * 使用广度优先搜索(BFS)的思想，逐位扩展组合：
 * 1. 从空字符串开始，逐个处理数字
 * 2. 对于每个数字，将队列中的每个组合与该数字对应的每个字母组合
 * 3. 重复直到处理完所有数字
 *
 * @param {string} digits - 输入的数字字符串
 * @return {string[]} 所有可能的字母组合
 * @time O(3^m * 4^n) m是对应3个字母的数字个数，n是对应4个字母的数字个数
 * @space O(3^m * 4^n) 队列空间
 */
function letterCombinationsIterative(digits) {
    console.log("\n=== 迭代法（BFS） ===");
    console.log("输入数字串:", digits);

    if (!digits || digits.length === 0) {
        return [];
    }

    const digitToLetters = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    };

    let result = [''];  // 从空字符串开始

    console.log("初始队列:", result);

    for (let i = 0; i < digits.length; i++) {
        const digit = digits[i];
        const letters = digitToLetters[digit];
        const nextResult = [];

        console.log(`\n处理第${i}位数字: ${digit}, 对应字母: ${letters}`);
        console.log(`当前队列: [${result.map(s => `"${s}"`).join(', ')}]`);

        // 对当前队列中的每个组合进行扩展
        for (const combination of result) {
            for (const letter of letters) {
                const newCombination = combination + letter;
                nextResult.push(newCombination);
                console.log(`  ${combination || '""'} + ${letter} = ${newCombination}`);
            }
        }

        result = nextResult;
        console.log(`扩展后队列: [${result.map(s => `"${s}"`).join(', ')}]`);
    }

    console.log(`\n迭代法结果: [${result.map(s => `"${s}"`).join(', ')}]`);
    return result;
}

/**
 * 方法三：递归分治法
 *
 * 核心思想：
 * 将问题分解为子问题：
 * letterCombinations(digits) = letterCombinations(digits[0]) × letterCombinations(digits[1:])
 * 即第一个数字的字母组合与剩余数字的字母组合的笛卡尔积
 *
 * @param {string} digits - 输入的数字字符串
 * @return {string[]} 所有可能的字母组合
 * @time O(3^m * 4^n) m是对应3个字母的数字个数，n是对应4个字母的数字个数
 * @space O(3^m * 4^n) 递归栈和结果空间
 */
function letterCombinationsRecursive(digits) {
    console.log("\n=== 递归分治法 ===");
    console.log("处理数字串:", digits);

    if (!digits || digits.length === 0) {
        console.log("数字串为空，返回空数组");
        return [];
    }

    const digitToLetters = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    };

    // 基础情况：只有一个数字
    if (digits.length === 1) {
        const result = digitToLetters[digits].split('');
        console.log(`基础情况: 数字${digits}对应字母 [${result.map(s => `"${s}"`).join(', ')}]`);
        return result;
    }

    // 分治：处理第一个数字和剩余数字
    const firstDigit = digits[0];
    const remainingDigits = digits.slice(1);

    console.log(`分治: 第一个数字=${firstDigit}, 剩余数字=${remainingDigits}`);

    const firstLetters = digitToLetters[firstDigit];
    const remainingCombinations = letterCombinationsRecursive(remainingDigits);

    console.log(`第一个数字${firstDigit}的字母: ${firstLetters}`);
    console.log(`剩余数字${remainingDigits}的组合: [${remainingCombinations.map(s => `"${s}"`).join(', ')}]`);

    // 合并：生成笛卡尔积
    const result = [];
    for (const letter of firstLetters) {
        for (const combination of remainingCombinations) {
            const newCombination = letter + combination;
            result.push(newCombination);
            console.log(`  组合: ${letter} + ${combination} = ${newCombination}`);
        }
    }

    console.log(`递归分治结果: [${result.map(s => `"${s}"`).join(', ')}]`);
    return result;
}

/**
 * 方法四：动态规划法
 *
 * 核心思想：
 * 逐步构建解决方案，每次处理一个数字：
 * dp[i] = dp[i-1] 中的每个组合与第i个数字对应字母的所有组合
 *
 * @param {string} digits - 输入的数字字符串
 * @return {string[]} 所有可能的字母组合
 * @time O(3^m * 4^n) m是对应3个字母的数字个数，n是对应4个字母的数字个数
 * @space O(3^m * 4^n) DP数组空间
 */
function letterCombinationsDP(digits) {
    console.log("\n=== 动态规划法 ===");
    console.log("输入数字串:", digits);

    if (!digits || digits.length === 0) {
        return [];
    }

    const digitToLetters = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    };

    // dp[i] 表示前i个数字的所有字母组合
    const dp = [['']];  // dp[0] = [''] 表示0个数字时有一个空组合

    console.log("DP数组初始化: dp[0] = ['']");

    for (let i = 0; i < digits.length; i++) {
        const digit = digits[i];
        const letters = digitToLetters[digit];
        const prevCombinations = dp[i];
        const currentCombinations = [];

        console.log(`\n处理第${i}个数字: ${digit}, 字母: ${letters}`);
        console.log(`dp[${i}]: [${prevCombinations.map(s => `"${s}"`).join(', ')}]`);

        for (const prevCombination of prevCombinations) {
            for (const letter of letters) {
                const newCombination = prevCombination + letter;
                currentCombinations.push(newCombination);
                console.log(`  ${prevCombination || '""'} + ${letter} = ${newCombination}`);
            }
        }

        dp[i + 1] = currentCombinations;
        console.log(`dp[${i + 1}]: [${currentCombinations.map(s => `"${s}"`).join(', ')}]`);
    }

    const result = dp[digits.length];
    console.log(`\n动态规划结果: [${result.map(s => `"${s}"`).join(', ')}]`);
    return result;
}

/**
 * 可视化回溯过程
 */
function visualizeBacktracking(digits) {
    console.log("\n=== 回溯过程可视化 ===");

    if (!digits || digits.length === 0) {
        return;
    }

    const digitToLetters = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    };

    console.log(`输入: "${digits}"`);
    console.log("回溯树结构:");

    function printTree(index, path, indent = '') {
        if (index === digits.length) {
            console.log(`${indent}${path} ✓`);
            return;
        }

        const digit = digits[index];
        const letters = digitToLetters[digit];

        if (path === '') {
            console.log(`${indent}根节点`);
        }

        for (let i = 0; i < letters.length; i++) {
            const letter = letters[i];
            const newPath = path + letter;
            const isLast = i === letters.length - 1;
            const prefix = isLast ? '└── ' : '├── ';
            const nextIndent = indent + (isLast ? '    ' : '│   ');

            console.log(`${indent}${prefix}${letter} (${newPath})`);
            printTree(index + 1, newPath, nextIndent);
        }
    }

    printTree(0, '');
}

/**
 * 计算理论组合数
 */
function calculateCombinationCount(digits) {
    console.log("\n=== 理论组合数计算 ===");

    const digitToLetters = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    };

    let totalCount = 1;
    const details = [];

    for (const digit of digits) {
        const letterCount = digitToLetters[digit].length;
        totalCount *= letterCount;
        details.push(`数字${digit}: ${letterCount}个字母`);
    }

    console.log("各数字对应的字母数:");
    details.forEach(detail => console.log(`  ${detail}`));

    console.log(`\n理论总组合数: ${details.map(d => d.split(': ')[1].split('个')[0]).join(' × ')} = ${totalCount}`);

    return totalCount;
}

/**
 * 验证不同方法的结果一致性
 */
function validateResults(digits) {
    console.log("\n=== 结果验证 ===");

    const result1 = letterCombinations(digits);
    const result2 = letterCombinationsIterative(digits);
    const result3 = letterCombinationsRecursive(digits);
    const result4 = letterCombinationsDP(digits);

    const expectedCount = calculateCombinationCount(digits);

    console.log(`回溯法结果数: ${result1.length}`);
    console.log(`迭代法结果数: ${result2.length}`);
    console.log(`递归分治结果数: ${result3.length}`);
    console.log(`动态规划结果数: ${result4.length}`);
    console.log(`期望结果数: ${expectedCount}`);

    const isConsistent = (
        JSON.stringify(result1.sort()) === JSON.stringify(result2.sort()) &&
        JSON.stringify(result2.sort()) === JSON.stringify(result3.sort()) &&
        JSON.stringify(result3.sort()) === JSON.stringify(result4.sort()) &&
        result1.length === expectedCount
    );

    console.log(`结果一致性: ${isConsistent ? '✅' : '❌'}`);

    return result1;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const testCases = [
        "2",
        "23",
        "234",
        "2345"
    ];

    testCases.forEach((digits, index) => {
        console.log(`\n--- 测试用例 ${index + 1}: "${digits}" ---`);

        const methods = [
            { name: '回溯法', func: letterCombinations },
            { name: '迭代法', func: letterCombinationsIterative },
            { name: '递归分治法', func: letterCombinationsRecursive },
            { name: '动态规划法', func: letterCombinationsDP }
        ];

        methods.forEach(method => {
            const start = performance.now();
            const result = method.func(digits);
            const end = performance.now();

            console.log(`${method.name}: ${result.length}个组合, ${(end - start).toFixed(3)}ms`);
        });
    });
}

/**
 * 算法核心概念演示
 */
function demonstrateAlgorithm() {
    console.log("\n=== 算法核心概念演示 ===");

    console.log("\n1. 回溯算法的本质：");
    console.log("系统地搜索所有可能的解决方案");
    console.log("在搜索过程中，当发现不满足求解条件时，就回溯返回，尝试别的路径");

    console.log("\n2. 回溯三要素：");
    console.log("① 选择路径：每次选择一个字母");
    console.log("② 递归：处理下一个数字");
    console.log("③ 撤销选择：回溯时移除当前字母");

    console.log("\n3. 时间复杂度分析：");
    console.log("每个数字有3-4个字母选择，总共有n个数字");
    console.log("最坏情况：O(4^n)，平均情况：O(3^m × 4^n)");

    console.log("\n4. 空间复杂度分析：");
    console.log("递归栈深度：O(n)");
    console.log("结果存储空间：O(3^m × 4^n)");

    console.log("\n5. 算法应用场景：");
    console.log("组合生成、排列生成、N皇后、数独求解等");

    console.log("\n6. 优化技巧：");
    console.log("剪枝：提前终止不满足条件的分支");
    console.log("备忘录：缓存已计算的子问题结果");
}

// 测试运行
function runTests() {
    console.log("🚀 开始测试电话号码字母组合算法");

    // 基础测试用例
    const testCases = [
        "23",      // 经典示例
        "2",       // 单个数字
        "",        // 空输入
        "234",     // 三个数字
        "7",       // 4个字母的数字
        "79"       // 包含4个字母的组合
    ];

    testCases.forEach((digits, index) => {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`测试用例 ${index + 1}: "${digits}"`);
        console.log(`${'='.repeat(60)}`);

        if (digits) {
            validateResults(digits);
            if (digits.length <= 2) {  // 只对简单案例可视化
                visualizeBacktracking(digits);
            }
        } else {
            console.log("空输入测试:");
            console.log(letterCombinations(digits));
        }
    });

    // 运行性能测试
    performanceTest();

    // 演示算法核心概念
    demonstrateAlgorithm();

    console.log("\n🎉 测试完成！");
}

// 如果直接运行此文件，执行测试
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        letterCombinations,
        letterCombinationsIterative,
        letterCombinationsRecursive,
        letterCombinationsDP,
        visualizeBacktracking,
        runTests
    };
} else if (typeof window === 'undefined') {
    // Node.js环境下直接运行测试
    runTests();
}