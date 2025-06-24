/**
 * LeetCode 17. 电话号码的字母组合
 *
 * 问题描述：
 * 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按任意顺序返回。
 * 数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。
 *
 * 核心思想：
 * 这是一个典型的回溯问题，需要穷举所有可能的字母组合
 * 对于每个数字，都有多个字母选择，我们需要遍历所有可能的组合
 *
 * 示例：
 * 输入：digits = "23"
 * 输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]
 */

/**
 * 方法一：回溯算法（DFS）
 *
 * 核心思想：
 * 使用深度优先搜索，对于每个数字位置，尝试该数字对应的所有字母
 * 当达到输入字符串的长度时，将当前组合加入结果
 *
 * 算法步骤：
 * 1. 建立数字到字母的映射关系
 * 2. 从第一个数字开始，递归尝试每个可能的字母
 * 3. 达到目标长度时记录结果
 * 4. 回溯到上一层继续尝试
 *
 * @param {string} digits - 数字字符串
 * @returns {string[]} 所有可能的字母组合
 * @time O(4^n) n为数字个数，最坏情况每个数字对应4个字母
 * @space O(n) 递归栈空间
 */
function letterCombinations(digits) {
    console.log("=== 电话号码字母组合（回溯法） ===");
    console.log(`输入数字: "${digits}"`);

    // 边界情况：空字符串
    if (!digits || digits.length === 0) {
        console.log("输入为空，返回空数组");
        return [];
    }

    // 数字到字母的映射
    const phoneMap = {
        '2': 'abc',
        '3': 'def',
        '4': 'ghi',
        '5': 'jkl',
        '6': 'mno',
        '7': 'pqrs',
        '8': 'tuv',
        '9': 'wxyz'
    };

    console.log("数字映射关系:");
    for (const digit of digits) {
        console.log(`  ${digit} -> ${phoneMap[digit]}`);
    }

    const result = [];

    /**
     * 回溯递归函数
     * @param {number} index - 当前处理的数字位置
     * @param {string} currentCombination - 当前的字母组合
     */
    function backtrack(index, currentCombination) {
        console.log(`  回溯: 位置=${index}, 当前组合="${currentCombination}"`);

        // 基本情况：已经处理完所有数字
        if (index === digits.length) {
            result.push(currentCombination);
            console.log(`    ✅ 完成组合: "${currentCombination}"`);
            return;
        }

        // 获取当前数字对应的字母
        const currentDigit = digits[index];
        const letters = phoneMap[currentDigit];

        console.log(`    处理数字 ${currentDigit}, 对应字母: ${letters}`);

        // 尝试当前数字的每个字母
        for (const letter of letters) {
            console.log(`      尝试字母: ${letter}`);
            // 选择当前字母，递归处理下一个数字
            backtrack(index + 1, currentCombination + letter);
        }

        console.log(`    回溯完成位置 ${index}`);
    }

    // 开始回溯
    backtrack(0, '');

    console.log(`总共找到 ${result.length} 个组合`);
    console.log(`结果: [${result.map(s => `"${s}"`).join(', ')}]`);

    return result;
}

/**
 * 方法二：迭代法（队列）
 *
 * 核心思想：
 * 使用队列，每次取出队列中的组合，为其添加下一个数字的所有可能字母
 * 层层推进，直到所有数字都处理完毕
 *
 * @param {string} digits - 数字字符串
 * @returns {string[]} 所有可能的字母组合
 * @time O(4^n) n为数字个数
 * @space O(4^n) 存储所有结果
 */
function letterCombinationsIterative(digits) {
    console.log("\n=== 电话号码字母组合（迭代法） ===");
    console.log(`输入数字: "${digits}"`);

    if (!digits || digits.length === 0) {
        return [];
    }

    const phoneMap = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    };

    // 初始化队列，先放入空字符串
    let queue = [''];

    // 处理每个数字
    for (let i = 0; i < digits.length; i++) {
        const digit = digits[i];
        const letters = phoneMap[digit];

        console.log(`\n处理第 ${i + 1} 个数字: ${digit}, 对应字母: ${letters}`);
        console.log(`当前队列大小: ${queue.length}`);

        const newQueue = [];

        // 对队列中的每个组合，添加当前数字的所有可能字母
        for (const combination of queue) {
            console.log(`  扩展组合: "${combination}"`);

            for (const letter of letters) {
                const newCombination = combination + letter;
                newQueue.push(newCombination);
                console.log(`    添加: "${newCombination}"`);
            }
        }

        queue = newQueue;
        console.log(`更新后队列大小: ${queue.length}`);
        console.log(`队列前几个元素: [${queue.slice(0, 5).map(s => `"${s}"`).join(', ')}${queue.length > 5 ? '...' : ''}]`);
    }

    console.log(`\n最终结果数量: ${queue.length}`);
    return queue;
}

/**
 * 方法三：递归法（分治思想）
 *
 * 核心思想：
 * 将问题分解为子问题：
 * - 第一个数字的所有字母 × 剩余数字的所有组合
 * 使用递归求解子问题，再合并结果
 *
 * @param {string} digits - 数字字符串
 * @returns {string[]} 所有可能的字母组合
 * @time O(4^n) n为数字个数
 * @space O(4^n) 递归栈 + 结果存储
 */
function letterCombinationsRecursive(digits) {
    console.log("\n=== 电话号码字母组合（递归法） ===");
    console.log(`输入数字: "${digits}"`);

    if (!digits || digits.length === 0) {
        return [];
    }

    const phoneMap = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    };

    /**
     * 递归函数
     * @param {string} remainingDigits - 剩余的数字
     * @returns {string[]} 剩余数字的所有组合
     */
    function helper(remainingDigits) {
        console.log(`  递归处理: "${remainingDigits}"`);

        // 基本情况：没有剩余数字
        if (remainingDigits.length === 0) {
            console.log(`    基本情况: 返回 [""]`);
            return [''];
        }

        // 获取第一个数字和剩余数字
        const firstDigit = remainingDigits[0];
        const restDigits = remainingDigits.slice(1);

        console.log(`    第一个数字: ${firstDigit}, 剩余: "${restDigits}"`);

        // 获取第一个数字对应的字母
        const letters = phoneMap[firstDigit];
        console.log(`    对应字母: ${letters}`);

        // 递归获取剩余数字的组合
        const restCombinations = helper(restDigits);
        console.log(`    剩余数字组合数: ${restCombinations.length}`);

        // 合并结果
        const result = [];
        for (const letter of letters) {
            for (const restCombination of restCombinations) {
                const combination = letter + restCombination;
                result.push(combination);
                console.log(`      合并: ${letter} + "${restCombination}" = "${combination}"`);
            }
        }

        console.log(`    返回 ${result.length} 个组合`);
        return result;
    }

    const result = helper(digits);
    console.log(`\n最终结果: [${result.map(s => `"${s}"`).join(', ')}]`);
    return result;
}

/**
 * 方法四：优化的回溯（使用数组代替字符串拼接）
 *
 * 核心思想：
 * 使用字符数组代替字符串拼接，减少字符串操作的开销
 *
 * @param {string} digits - 数字字符串
 * @returns {string[]} 所有可能的字母组合
 * @time O(4^n) n为数字个数
 * @space O(n) 递归栈空间
 */
function letterCombinationsOptimized(digits) {
    console.log("\n=== 电话号码字母组合（优化回溯） ===");

    if (!digits || digits.length === 0) {
        return [];
    }

    const phoneMap = [
        '', '', 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz'
    ];

    const result = [];
    const path = new Array(digits.length);

    function backtrack(index) {
        if (index === digits.length) {
            result.push(path.join(''));
            return;
        }

        const digit = parseInt(digits[index]);
        const letters = phoneMap[digit];

        for (const letter of letters) {
            path[index] = letter;
            backtrack(index + 1);
        }
    }

    backtrack(0);
    return result;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 验证结果是否正确
 */
function validateResult(digits, result) {
    console.log("\n=== 结果验证 ===");

    if (!digits) {
        console.log(`空输入，期望空结果: ${result.length === 0 ? '✅' : '❌'}`);
        return result.length === 0;
    }

    const phoneMap = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    };

    // 计算期望的组合数量
    let expectedCount = 1;
    for (const digit of digits) {
        expectedCount *= phoneMap[digit].length;
    }

    console.log(`输入: "${digits}"`);
    console.log(`期望组合数: ${expectedCount}`);
    console.log(`实际组合数: ${result.length}`);
    console.log(`数量正确: ${result.length === expectedCount ? '✅' : '❌'}`);

    // 检查每个组合的有效性
    let allValid = true;
    for (let i = 0; i < Math.min(result.length, 10); i++) {
        const combination = result[i];
        let valid = true;

        // 检查长度
        if (combination.length !== digits.length) {
            valid = false;
        } else {
            // 检查每个位置的字母是否对应正确的数字
            for (let j = 0; j < digits.length; j++) {
                const digit = digits[j];
                const letter = combination[j];
                if (!phoneMap[digit].includes(letter)) {
                    valid = false;
                    break;
                }
            }
        }

        console.log(`组合 "${combination}": ${valid ? '✅' : '❌'}`);
        if (!valid) allValid = false;
    }

    if (result.length > 10) {
        console.log("... (显示前10个组合)");
    }

    console.log(`整体验证: ${allValid ? '✅' : '❌'}`);
    return allValid && result.length === expectedCount;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const testCases = ['23', '234', '2345'];

    for (const testCase of testCases) {
        console.log(`\n测试输入: "${testCase}"`);

        // 测试各种方法的性能
        const methods = [
            { name: '回溯法', func: letterCombinations },
            { name: '迭代法', func: letterCombinationsIterative },
            { name: '递归法', func: letterCombinationsRecursive },
            { name: '优化回溯', func: letterCombinationsOptimized }
        ];

        for (const method of methods) {
            const startTime = performance.now();
            const result = method.func(testCase);
            const endTime = performance.now();

            console.log(`${method.name}: ${result.length} 个结果, 耗时 ${(endTime - startTime).toFixed(2)}ms`);
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
    console.log("电话号码字母组合算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { input: "23", expected: ["ad","ae","af","bd","be","bf","cd","ce","cf"] },
        { input: "", expected: [] },
        { input: "2", expected: ["a","b","c"] },
        { input: "234", expected: null }, // 太多结果，不列举
        { input: "7", expected: ["p","q","r","s"] },
        { input: "79", expected: ["pw","px","py","pz","qw","qx","qy","qz","rw","rx","ry","rz","sw","sx","sy","sz"] }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}`);
        console.log(`${"=".repeat(30)}`);

        // 测试所有方法
        const methods = [
            { name: "回溯法", func: letterCombinations },
            { name: "迭代法", func: letterCombinationsIterative },
            { name: "递归法", func: letterCombinationsRecursive },
            { name: "优化回溯", func: letterCombinationsOptimized }
        ];

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func(testCase.input);
                results.push(result);
                validateResult(testCase.input, result);

                // 显示部分结果
                if (result.length > 0 && result.length <= 20) {
                    console.log(`完整结果: [${result.map(s => `"${s}"`).join(', ')}]`);
                } else if (result.length > 20) {
                    console.log(`部分结果: [${result.slice(0, 10).map(s => `"${s}"`).join(', ')}...] (共${result.length}个)`);
                }

            } catch (error) {
                console.log(`❌ 方法执行失败: ${error.message}`);
                results.push([]);
            }
        }

        // 比较所有方法的结果是否一致
        console.log("\n--- 方法一致性检查 ---");
        const allSame = results.every(result =>
            JSON.stringify(result.sort()) === JSON.stringify(results[0].sort())
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
    console.log("电话号码字母组合算法演示");
    console.log("=".repeat(50));

    console.log("问题背景:");
    console.log("在老式手机上，每个数字键对应多个字母");
    console.log("2: ABC, 3: DEF, 4: GHI, 5: JKL");
    console.log("6: MNO, 7: PQRS, 8: TUV, 9: WXYZ");

    console.log("\n核心思想:");
    console.log("1. 这是一个组合问题，需要穷举所有可能");
    console.log("2. 每个数字位置都有多个选择");
    console.log("3. 可以用回溯、迭代、递归等方法解决");

    console.log("\n搜索树示例（输入 '23'）:");
    console.log("                 ''");
    console.log("            /    |    \\");
    console.log("          'a'   'b'   'c'   (数字2)");
    console.log("        / | \\  / | \\  / | \\");
    console.log("      ad ae af bd be bf cd ce cf  (数字3)");

    console.log("\n详细演示:");
    const demoInput = "23";
    const result = letterCombinations(demoInput);

    console.log("\n复杂度分析:");
    console.log("时间复杂度: O(4^n) - 最坏情况每个数字对应4个字母");
    console.log("空间复杂度: O(n) - 递归栈深度");
    console.log("实际复杂度取决于具体的数字组合");
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
    console.log("1. 这是典型的回溯问题，需要穷举所有可能的组合");
    console.log("2. 每个数字位置都有多个字母选择，形成搜索树");
    console.log("3. 可以用多种方法解决：回溯、迭代、递归");
    console.log("4. 边界条件：空字符串输入");

    console.log("\n🔧 实现技巧:");
    console.log("1. 建立数字到字母的映射关系");
    console.log("2. 回溯法：选择->递归->撤销选择");
    console.log("3. 迭代法：层层扩展，用队列保存中间结果");
    console.log("4. 优化：使用字符数组代替字符串拼接");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 忘记处理空字符串的边界情况");
    console.log("2. 映射关系写错（特别是7和9对应的字母数量）");
    console.log("3. 回溯时忘记恢复状态");
    console.log("4. 迭代法中队列更新逻辑错误");

    console.log("\n🎨 变体问题:");
    console.log("1. 计算字母组合的总数（不需要具体组合）");
    console.log("2. 找到字典序第k小的组合");
    console.log("3. 有重复数字的情况");
    console.log("4. 限制组合长度的变体");

    console.log("\n📊 复杂度分析:");
    console.log("1. 时间复杂度：O(4^n)，n为数字个数");
    console.log("2. 空间复杂度：O(n) 递归栈 + O(4^n) 结果存储");
    console.log("3. 实际复杂度取决于数字对应的字母数量");
    console.log("4. 2,3,4,5,6,8,9 对应3个字母，7 对应4个字母");

    console.log("\n💡 面试技巧:");
    console.log("1. 先用最直观的回溯法解决");
    console.log("2. 画出搜索树帮助理解");
    console.log("3. 讨论时间空间复杂度");
    console.log("4. 提及其他解法（迭代、递归）");
    console.log("5. 考虑优化方案（减少字符串操作）");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        letterCombinations,
        letterCombinationsIterative,
        letterCombinationsRecursive,
        letterCombinationsOptimized,
        validateResult,
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