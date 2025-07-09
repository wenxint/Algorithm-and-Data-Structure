/**
 * LeetCode 70. 爬楼梯 (Climbing Stairs)
 *
 * 问题描述：
 * 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
 * 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
 *
 * 核心思想：
 * 这是经典的斐波那契数列问题，也是动态规划的入门题目
 * f(n) = f(n-1) + f(n-2)，到达第n阶的方法数等于到达第n-1阶和第n-2阶的方法数之和
 *
 * 示例：
 * 输入：n = 3
 * 输出：3
 * 解释：有三种方法可以爬到楼顶。
 * 1. 1 阶 + 1 阶 + 1 阶
 * 2. 1 阶 + 2 阶
 * 3. 2 阶 + 1 阶
 */

/**
 * 方法一：动态规划（标准解法）
 *
 * 核心思想：
 * dp[i] 表示爬到第 i 阶楼梯的方法数
 * 状态转移方程：dp[i] = dp[i-1] + dp[i-2]
 * 边界条件：dp[1] = 1, dp[2] = 2
 *
 * @param {number} n - 楼梯阶数
 * @returns {number} 爬楼梯的方法数
 * @time O(n) 需要计算每一阶
 * @space O(n) 存储所有状态
 */
function climbStairs(n) {
    console.log("=== 爬楼梯（动态规划） ===");
    console.log(`楼梯阶数: ${n}`);

    if (n <= 0) {
        console.log("无效输入，返回 0");
        return 0;
    }

    if (n === 1) {
        console.log("只有1阶，只有1种方法");
        return 1;
    }

    if (n === 2) {
        console.log("有2阶，有2种方法：(1+1) 或 (2)");
        return 2;
    }

    // 创建DP数组
    const dp = new Array(n + 1);
    dp[1] = 1; // 爬到第1阶的方法数
    dp[2] = 2; // 爬到第2阶的方法数

    console.log("\n初始化:");
    console.log(`dp[1] = ${dp[1]} (方法: 1)`);
    console.log(`dp[2] = ${dp[2]} (方法: 1+1, 2)`);

    console.log("\n状态转移过程:");

    // 从第3阶开始计算
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
        console.log(`dp[${i}] = dp[${i-1}] + dp[${i-2}] = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`);

        // 展示方法组合（只对小规模展示）
        if (i <= 6) {
            console.log(`  解释: 到达第${i}阶可以从第${i-1}阶走1步，或从第${i-2}阶走2步`);
        }
    }

    console.log(`\n最终DP数组: [${dp.slice(1).join(', ')}]`);
    console.log(`爬到第${n}阶的方法数: ${dp[n]}`);

    return dp[n];
}

/**
 * 方法二：空间优化的动态规划
 *
 * 核心思想：
 * 观察状态转移方程，每次只需要前两个状态
 * 可以用两个变量代替整个数组，将空间复杂度优化为O(1)
 *
 * @param {number} n - 楼梯阶数
 * @returns {number} 爬楼梯的方法数
 * @time O(n) 时间复杂度不变
 * @space O(1) 只使用常数空间
 */
function climbStairsOptimized(n) {
    console.log("\n=== 爬楼梯（空间优化） ===");
    console.log(`楼梯阶数: ${n}`);

    if (n <= 0) return 0;
    if (n === 1) return 1;
    if (n === 2) return 2;

    let prev2 = 1; // dp[i-2]
    let prev1 = 2; // dp[i-1]

    console.log("\n初始状态:");
    console.log(`prev2 = ${prev2} (第1阶方法数)`);
    console.log(`prev1 = ${prev1} (第2阶方法数)`);

    console.log("\n滚动计算过程:");

    for (let i = 3; i <= n; i++) {
        const current = prev1 + prev2;
        console.log(`第${i}阶: current = prev1 + prev2 = ${prev1} + ${prev2} = ${current}`);

        // 更新状态
        prev2 = prev1;
        prev1 = current;

        console.log(`  更新: prev2 = ${prev2}, prev1 = ${prev1}`);
    }

    console.log(`\n爬到第${n}阶的方法数: ${prev1}`);
    return prev1;
}

/**
 * 方法三：递归 + 记忆化搜索
 *
 * 核心思想：
 * 自顶向下的递归思路，使用记忆化避免重复计算
 * f(n) = f(n-1) + f(n-2)
 *
 * @param {number} n - 楼梯阶数
 * @returns {number} 爬楼梯的方法数
 * @time O(n) 记忆化后每个状态只计算一次
 * @space O(n) 递归栈 + 记忆化表
 */
function climbStairsMemo(n) {
    console.log("\n=== 爬楼梯（记忆化搜索） ===");
    console.log(`楼梯阶数: ${n}`);

    const memo = new Map();

    /**
     * 递归函数
     * @param {number} stairs - 剩余楼梯数
     * @returns {number} 方法数
     */
    function dfs(stairs) {
        // 基础情况
        if (stairs === 0) {
            console.log(`  到达终点，返回 1`);
            return 1;
        }
        if (stairs === 1) {
            console.log(`  剩余1阶，返回 1`);
            return 1;
        }

        // 检查记忆化
        if (memo.has(stairs)) {
            console.log(`  记忆化命中: f(${stairs}) = ${memo.get(stairs)}`);
            return memo.get(stairs);
        }

        console.log(`  递归计算: f(${stairs})`);

        // 递归计算
        const result = dfs(stairs - 1) + dfs(stairs - 2);

        // 记忆化存储
        memo.set(stairs, result);
        console.log(`  记忆化存储: f(${stairs}) = ${result}`);

        return result;
    }

    console.log("\n开始递归搜索:");
    const result = dfs(n);

    console.log(`\n记忆化表大小: ${memo.size}`);
    console.log(`记忆化表内容: ${Array.from(memo.entries()).map(([k, v]) => `f(${k})=${v}`).join(', ')}`);
    console.log(`爬到第${n}阶的方法数: ${result}`);

    return result;
}

/**
 * 方法四：矩阵快速幂
 *
 * 核心思想：
 * 利用矩阵乘法的性质，将斐波那契数列转换为矩阵幂的形式
 * [F(n+1)]   [1 1]^n   [F(1)]
 * [F(n)  ] = [1 0]   * [F(0)]
 *
 * @param {number} n - 楼梯阶数
 * @returns {number} 爬楼梯的方法数
 * @time O(log n) 快速幂的时间复杂度
 * @space O(1) 常数空间
 */
function climbStairsMatrix(n) {
    console.log("\n=== 爬楼梯（矩阵快速幂） ===");
    console.log(`楼梯阶数: ${n}`);

    if (n <= 0) return 0;
    if (n === 1) return 1;
    if (n === 2) return 2;

    /**
     * 矩阵乘法
     * @param {number[][]} a - 矩阵A
     * @param {number[][]} b - 矩阵B
     * @returns {number[][]} A*B的结果
     */
    function matrixMultiply(a, b) {
        const result = [[0, 0], [0, 0]];
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                result[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j];
            }
        }
        console.log(`  矩阵乘法: [[${a[0].join(',')}],[${a[1].join(',')}]] * [[${b[0].join(',')}],[${b[1].join(',')}]] = [[${result[0].join(',')}],[${result[1].join(',')}]]`);
        return result;
    }

    /**
     * 矩阵快速幂
     * @param {number[][]} base - 基础矩阵
     * @param {number} exp - 指数
     * @returns {number[][]} base^exp的结果
     */
    function matrixPower(base, exp) {
        console.log(`\n计算矩阵的 ${exp} 次幂:`);
        let result = [[1, 0], [0, 1]]; // 单位矩阵
        let currentBase = base;

        console.log(`初始单位矩阵: [[${result[0].join(',')}],[${result[1].join(',')}]]`);

        while (exp > 0) {
            console.log(`\n当前指数: ${exp}`);
            if (exp & 1) {
                console.log(`  指数为奇数，结果乘以当前底数`);
                result = matrixMultiply(result, currentBase);
            }
            currentBase = matrixMultiply(currentBase, currentBase);
            exp >>= 1;
            console.log(`  指数右移: ${exp}`);
        }

        return result;
    }

    // 基础矩阵 [[1,1],[1,0]]
    const baseMatrix = [[1, 1], [1, 0]];
    console.log(`基础矩阵: [[${baseMatrix[0].join(',')}],[${baseMatrix[1].join(',')}]]`);

    // 计算 baseMatrix^(n-1)
    const resultMatrix = matrixPower(baseMatrix, n - 1);

    console.log(`\n最终结果矩阵: [[${resultMatrix[0].join(',')}],[${resultMatrix[1].join(',')}]]`);

    // F(n) = resultMatrix[0][0] * F(1) + resultMatrix[0][1] * F(0)
    // 其中 F(1) = 1, F(0) = 1 (对应climbStairs的初始值)
    const result = resultMatrix[0][0] * 1 + resultMatrix[0][1] * 1;

    console.log(`计算结果: ${resultMatrix[0][0]} * 1 + ${resultMatrix[0][1]} * 1 = ${result}`);
    console.log(`爬到第${n}阶的方法数: ${result}`);

    return result;
}

/**
 * 方法五：通项公式（黄金分割数）
 *
 * 核心思想：
 * 斐波那契数列的通项公式：F(n) = [φ^n - ψ^n] / √5
 * 其中 φ = (1 + √5) / 2，ψ = (1 - √5) / 2
 *
 * @param {number} n - 楼梯阶数
 * @returns {number} 爬楼梯的方法数
 * @time O(1) 常数时间
 * @space O(1) 常数空间
 */
function climbStairsFormula(n) {
    console.log("\n=== 爬楼梯（通项公式） ===");
    console.log(`楼梯阶数: ${n}`);

    if (n <= 0) return 0;
    if (n === 1) return 1;

    const sqrt5 = Math.sqrt(5);
    const phi = (1 + sqrt5) / 2;  // 黄金分割数
    const psi = (1 - sqrt5) / 2;  // 共轭黄金分割数

    console.log(`\n计算过程:`);
    console.log(`√5 = ${sqrt5}`);
    console.log(`φ (黄金分割数) = (1 + √5) / 2 = ${phi}`);
    console.log(`ψ (共轭数) = (1 - √5) / 2 = ${psi}`);

    // 注意：爬楼梯问题的索引从1开始，需要调整公式
    const phiPower = Math.pow(phi, n + 1);
    const psiPower = Math.pow(psi, n + 1);

    console.log(`φ^${n+1} = ${phiPower}`);
    console.log(`ψ^${n+1} = ${psiPower}`);

    const result = Math.round((phiPower - psiPower) / sqrt5);

    console.log(`\n通项公式: F(${n}) = (φ^${n+1} - ψ^${n+1}) / √5`);
    console.log(`= (${phiPower} - ${psiPower}) / ${sqrt5}`);
    console.log(`= ${(phiPower - psiPower) / sqrt5}`);
    console.log(`≈ ${result} (四舍五入)`);

    console.log(`爬到第${n}阶的方法数: ${result}`);

    return result;
}

/**
 * 方法六：获取具体的爬楼梯方案
 *
 * 核心思想：
 * 通过回溯算法生成所有可能的爬楼梯方案
 * 每次可以选择走1步或2步
 *
 * @param {number} n - 楼梯阶数
 * @returns {Array} 所有可能的方案
 */
function getClimbingMethods(n) {
    console.log("\n=== 获取所有爬楼梯方案 ===");
    console.log(`楼梯阶数: ${n}`);

    const result = [];
    const path = [];

    /**
     * 回溯函数
     * @param {number} remaining - 剩余台阶数
     */
    function backtrack(remaining) {
        if (remaining === 0) {
            // 找到一种方案
            const method = [...path];
            result.push(method);
            console.log(`  找到方案 ${result.length}: [${method.join(' + ')}] = ${method.reduce((a, b) => a + b, 0)}`);
            return;
        }

        // 尝试走1步
        if (remaining >= 1) {
            path.push(1);
            console.log(`    尝试走1步，剩余${remaining - 1}步，当前路径: [${path.join(' + ')}]`);
            backtrack(remaining - 1);
            path.pop();
        }

        // 尝试走2步
        if (remaining >= 2) {
            path.push(2);
            console.log(`    尝试走2步，剩余${remaining - 2}步，当前路径: [${path.join(' + ')}]`);
            backtrack(remaining - 2);
            path.pop();
        }
    }

    console.log("\n开始回溯搜索:");
    backtrack(n);

    console.log(`\n总共找到 ${result.length} 种方案:`);
    result.forEach((method, index) => {
        console.log(`方案 ${index + 1}: ${method.join(' + ')} = ${n}`);
    });

    return result;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 验证爬楼梯方案
 */
function validateClimbingMethods(n, methods) {
    console.log("\n=== 验证爬楼梯方案 ===");
    console.log(`楼梯阶数: ${n}`);
    console.log(`方案数量: ${methods.length}`);

    let validCount = 0;

    for (let i = 0; i < methods.length; i++) {
        const method = methods[i];
        const sum = method.reduce((a, b) => a + b, 0);
        const isValid = sum === n && method.every(step => step === 1 || step === 2);

        if (isValid) {
            validCount++;
        } else {
            console.log(`❌ 无效方案 ${i + 1}: [${method.join(', ')}], 和=${sum}`);
        }
    }

    console.log(`有效方案数: ${validCount}/${methods.length}`);
    return validCount === methods.length;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const testCases = [5, 10, 20, 30, 40, 45];

    for (const n of testCases) {
        console.log(`\n测试 n = ${n}:`);

        const methods = [
            { name: '动态规划', func: climbStairs },
            { name: '空间优化', func: climbStairsOptimized },
            { name: '记忆化搜索', func: climbStairsMemo },
            { name: '矩阵快速幂', func: climbStairsMatrix },
            { name: '通项公式', func: climbStairsFormula }
        ];

        for (const method of methods) {
            const startTime = performance.now();
            const result = method.func(n);
            const endTime = performance.now();

            console.log(`${method.name}: 结果=${result}, 耗时=${(endTime - startTime).toFixed(2)}ms`);
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
    console.log("爬楼梯算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { n: 1, expected: 1 },
        { n: 2, expected: 2 },
        { n: 3, expected: 3 },
        { n: 4, expected: 5 },
        { n: 5, expected: 8 },
        { n: 6, expected: 13 },
        { n: 10, expected: 89 }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}: n = ${testCase.n}`);
        console.log(`${"=".repeat(30)}`);

        const { n, expected } = testCase;

        // 测试所有方法
        const methods = [
            { name: "动态规划", func: climbStairs },
            { name: "空间优化", func: climbStairsOptimized },
            { name: "记忆化搜索", func: climbStairsMemo },
            { name: "矩阵快速幂", func: climbStairsMatrix },
            { name: "通项公式", func: climbStairsFormula }
        ];

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func(n);
                results.push(result);

                const isCorrect = result === expected;
                console.log(`结果: ${result}, 期望: ${expected}, 正确: ${isCorrect ? '✅' : '❌'}`);
            } catch (error) {
                console.log(`❌ 方法执行失败: ${error.message}`);
                results.push(-1);
            }
        }

        // 获取具体方案（只对小规模测试）
        if (n <= 6) {
            console.log("\n--- 获取具体方案 ---");
            try {
                const methods = getClimbingMethods(n);
                validateClimbingMethods(n, methods);
            } catch (error) {
                console.log(`❌ 获取方案失败: ${error.message}`);
            }
        }

        // 检查所有方法结果是否一致
        console.log("\n--- 方法一致性检查 ---");
        const allSame = results.every(result => result === results[0]);
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
    console.log("爬楼梯算法演示");
    console.log("=".repeat(50));

    console.log("爬楼梯问题的核心思想:");
    console.log("1. 动态规划：状态转移 f(n) = f(n-1) + f(n-2)");
    console.log("2. 斐波那契数列：经典递推关系");
    console.log("3. 空间优化：只需要前两个状态");
    console.log("4. 多种解法：从递归到矩阵快速幂");

    const demoN = 5;

    console.log(`\n演示：爬${demoN}阶楼梯`);

    console.log("\n=== 问题分析 ===");
    console.log("到达第n阶，最后一步只能是：");
    console.log("1. 从第(n-1)阶走1步");
    console.log("2. 从第(n-2)阶走2步");
    console.log("因此：f(n) = f(n-1) + f(n-2)");

    console.log("\n=== 动态规划演示 ===");
    climbStairs(demoN);

    console.log("\n=== 空间优化演示 ===");
    climbStairsOptimized(demoN);

    console.log("\n=== 获取所有方案 ===");
    getClimbingMethods(demoN);

    console.log("\n=== 复杂度对比 ===");
    console.log("方法          时间复杂度    空间复杂度    特点");
    console.log("动态规划      O(n)         O(n)         容易理解");
    console.log("空间优化      O(n)         O(1)         节省空间");
    console.log("记忆化搜索    O(n)         O(n)         自顶向下");
    console.log("矩阵快速幂    O(log n)     O(1)         高效计算");
    console.log("通项公式      O(1)         O(1)         理论最优");

    console.log("\n=== 斐波那契数列性质 ===");
    console.log("F(1)=1, F(2)=2, F(3)=3, F(4)=5, F(5)=8, F(6)=13...");
    console.log("黄金分割数 φ = (1+√5)/2 ≈ 1.618");
    console.log("通项公式: F(n) = (φ^n - ψ^n) / √5");
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
    console.log("1. 动态规划入门：最优子结构");
    console.log("2. 斐波那契数列：递推关系 f(n) = f(n-1) + f(n-2)");
    console.log("3. 状态转移：到达第n阶的方法数");
    console.log("4. 边界条件：f(1) = 1, f(2) = 2");

    console.log("\n🔧 实现技巧:");
    console.log("1. 状态定义：dp[i] 表示到达第i阶的方法数");
    console.log("2. 空间优化：使用滚动变量代替数组");
    console.log("3. 记忆化：避免递归中的重复计算");
    console.log("4. 矩阵快速幂：对数时间复杂度");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 边界条件处理：n=1和n=2的特殊情况");
    console.log("2. 索引混乱：注意数组索引和楼梯阶数的对应");
    console.log("3. 整数溢出：大数情况下的溢出问题");
    console.log("4. 通项公式精度：浮点数计算的精度问题");

    console.log("\n🎨 变体问题:");
    console.log("1. 每次可以爬1、2、3阶");
    console.log("2. 不能连续爬2阶");
    console.log("3. 有些台阶不能踩");
    console.log("4. 最小花费爬楼梯");
    console.log("5. 环形楼梯");

    console.log("\n📊 复杂度分析:");
    console.log("1. 递归（无记忆化）：O(2^n) 时间，O(n) 空间");
    console.log("2. 动态规划：O(n) 时间，O(n) 空间");
    console.log("3. 空间优化：O(n) 时间，O(1) 空间");
    console.log("4. 矩阵快速幂：O(log n) 时间，O(1) 空间");
    console.log("5. 通项公式：O(1) 时间，O(1) 空间");

    console.log("\n💡 面试技巧:");
    console.log("1. 从递归开始分析，找出重复子问题");
    console.log("2. 画出递归树理解重叠子问题");
    console.log("3. 转换为动态规划，明确状态和转移");
    console.log("4. 考虑空间优化的可能性");
    console.log("5. 讨论高级解法（矩阵快速幂、通项公式）");

    console.log("\n🔍 实际应用:");
    console.log("1. 路径计数问题");
    console.log("2. 组合数学计算");
    console.log("3. 概率计算模型");
    console.log("4. 资源分配问题");
    console.log("5. 游戏关卡设计");
    console.log("6. 投资策略分析");

    console.log("\n🎮 记忆技巧:");
    console.log("1. 楼梯类比：每步只能走1或2阶");
    console.log("2. 斐波那契：兔子繁殖问题的经典模型");
    console.log("3. 黄金分割：自然界中的神奇比例");
    console.log("4. 滚动数组：只关心最近的两个状态");

    console.log("\n📝 扩展思考:");
    console.log("1. 为什么是斐波那契数列？");
    console.log("2. 如何从递归想到动态规划？");
    console.log("3. 空间优化的一般思路是什么？");
    console.log("4. 什么时候考虑矩阵快速幂？");
    console.log("5. 通项公式的推导过程？");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        climbStairs,
        climbStairsOptimized,
        climbStairsMemo,
        climbStairsMatrix,
        climbStairsFormula,
        getClimbingMethods,
        validateClimbingMethods,
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