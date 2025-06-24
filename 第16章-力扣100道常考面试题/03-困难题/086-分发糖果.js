/**
 * LeetCode 135. 分发糖果
 *
 * 问题描述：
 * n 个孩子站成一排。给你一个整数数组 ratings 表示每个孩子的评分。
 * 你需要按照以下要求，给这些孩子分发糖果：
 * - 每个孩子至少分配到 1 个糖果。
 * - 相邻的孩子中，评分高的孩子必须获得更多的糖果。
 * 请你给出能够满足上述要求的最少糖果数目。
 *
 * 核心思想：
 * 贪心算法 + 两次遍历
 * 1. 从左到右遍历：保证右边评分高的比左边多
 * 2. 从右到左遍历：保证左边评分高的比右边多
 * 3. 取两次遍历结果的最大值，确保同时满足两个约束
 *
 * 示例：
 * 输入：ratings = [1,0,2]
 * 输出：5
 * 解释：你可以分别给第一个、第二个、第三个孩子分发 2、1、2 颗糖果
 */

/**
 * 方法一：两次遍历（推荐）
 *
 * 核心思想：
 * 将问题分解为两个子问题：
 * 1. 满足"右边评分高就比左边多"的约束
 * 2. 满足"左边评分高就比右边多"的约束
 * 最后取两个结果的最大值
 *
 * 算法步骤：
 * 1. 初始化所有位置为1个糖果
 * 2. 从左到右遍历，如果右边评分更高，则糖果数+1
 * 3. 从右到左遍历，如果左边评分更高，则更新为max(当前值, 右边+1)
 * 4. 返回总和
 *
 * @param {number[]} ratings - 孩子们的评分数组
 * @returns {number} 最少糖果数目
 * @time O(n) 两次遍历
 * @space O(n) 存储每个位置的糖果数
 */
function candy(ratings) {
    console.log("=== 分发糖果（两次遍历） ===");
    console.log(`评分数组: [${ratings.join(', ')}]`);

    const n = ratings.length;
    if (n === 0) return 0;
    if (n === 1) return 1;

    // 初始化：每个孩子至少1个糖果
    const candies = new Array(n).fill(1);
    console.log(`初始糖果: [${candies.join(', ')}]`);

    console.log("\n第一次遍历（从左到右）:");
    // 从左到右遍历，确保右边评分高的比左边多
    for (let i = 1; i < n; i++) {
        if (ratings[i] > ratings[i - 1]) {
            candies[i] = candies[i - 1] + 1;
            console.log(`位置${i}: 评分${ratings[i]} > ${ratings[i-1]}，糖果更新为 ${candies[i]}`);
        } else {
            console.log(`位置${i}: 评分${ratings[i]} <= ${ratings[i-1]}，糖果保持 ${candies[i]}`);
        }
    }

    console.log(`第一次遍历后: [${candies.join(', ')}]`);

    console.log("\n第二次遍历（从右到左）:");
    // 从右到左遍历，确保左边评分高的比右边多
    for (let i = n - 2; i >= 0; i--) {
        if (ratings[i] > ratings[i + 1]) {
            const newCandies = Math.max(candies[i], candies[i + 1] + 1);
            if (newCandies !== candies[i]) {
                console.log(`位置${i}: 评分${ratings[i]} > ${ratings[i+1]}，糖果 ${candies[i]} -> ${newCandies}`);
                candies[i] = newCandies;
            } else {
                console.log(`位置${i}: 评分${ratings[i]} > ${ratings[i+1]}，但糖果已足够 (${candies[i]})`);
            }
        } else {
            console.log(`位置${i}: 评分${ratings[i]} <= ${ratings[i+1]}，糖果保持 ${candies[i]}`);
        }
    }

    console.log(`最终糖果分配: [${candies.join(', ')}]`);

    const total = candies.reduce((sum, count) => sum + count, 0);
    console.log(`总糖果数: ${total}`);

    return total;
}

/**
 * 方法二：一次遍历优化
 *
 * 核心思想：
 * 通过维护上升和下降序列的信息，只用一次遍历完成
 * 复杂度更优，但实现较为复杂
 *
 * @param {number[]} ratings - 孩子们的评分数组
 * @returns {number} 最少糖果数目
 * @time O(n) 一次遍历
 * @space O(1) 只使用常数额外空间
 */
function candyOnePass(ratings) {
    console.log("\n=== 分发糖果（一次遍历优化） ===");
    console.log(`评分数组: [${ratings.join(', ')}]`);

    const n = ratings.length;
    if (n === 0) return 0;
    if (n === 1) return 1;

    let total = 1; // 第一个孩子至少1个糖果
    let up = 0;    // 上升序列长度
    let down = 0;  // 下降序列长度
    let peak = 0;  // 峰值位置的糖果数

    console.log("遍历过程:");
    console.log(`位置0: 糖果=1, total=${total}`);

    for (let i = 1; i < n; i++) {
        console.log(`\n检查位置${i}: ratings[${i}]=${ratings[i]} vs ratings[${i-1}]=${ratings[i-1]}`);

        if (ratings[i] > ratings[i - 1]) {
            // 上升趋势
            up++;
            down = 0;
            peak = up;
            total += 1 + up;
            console.log(`  上升: up=${up}, 糖果=${1 + up}, total=${total}`);
        } else if (ratings[i] === ratings[i - 1]) {
            // 相等
            up = 0;
            down = 0;
            peak = 0;
            total += 1;
            console.log(`  相等: 重置计数, 糖果=1, total=${total}`);
        } else {
            // 下降趋势
            up = 0;
            down++;

            // 下降序列中的糖果数
            total += down;

            // 如果下降序列长度超过峰值，需要额外给峰值位置1个糖果
            if (down > peak) {
                total++;
                console.log(`  下降: down=${down} > peak=${peak}, 需要补充峰值, total=${total}`);
            } else {
                console.log(`  下降: down=${down}, total=${total}`);
            }
        }
    }

    console.log(`\n总糖果数: ${total}`);
    return total;
}

/**
 * 方法三：递归分治法（教学用）
 *
 * 核心思想：
 * 找到局部最小值作为分界点，递归处理左右两部分
 * 然后合并结果，调整边界处的糖果分配
 *
 * @param {number[]} ratings - 孩子们的评分数组
 * @returns {number} 最少糖果数目
 * @time O(n log n) 平均情况，最坏O(n²)
 * @space O(n) 递归栈空间和结果数组
 */
function candyDivideConquer(ratings) {
    console.log("\n=== 分发糖果（分治法） ===");
    console.log(`评分数组: [${ratings.join(', ')}]`);

    if (ratings.length === 0) return 0;

    const candies = new Array(ratings.length);

    /**
     * 递归处理区间[left, right]
     */
    function solve(left, right, depth = 0) {
        const indent = "  ".repeat(depth);
        console.log(`${indent}处理区间[${left}, ${right}]`);

        if (left === right) {
            candies[left] = 1;
            console.log(`${indent}单个元素，糖果=1`);
            return 1;
        }

        // 找到局部最小值
        let minIdx = left;
        for (let i = left + 1; i <= right; i++) {
            if (ratings[i] < ratings[minIdx]) {
                minIdx = i;
            }
        }

        console.log(`${indent}局部最小值位置: ${minIdx}, 评分: ${ratings[minIdx]}`);
        candies[minIdx] = 1;

        let total = 1;

        // 处理左半部分
        if (minIdx > left) {
            console.log(`${indent}递归处理左半部分[${left}, ${minIdx-1}]`);
            total += solve(left, minIdx - 1, depth + 1);
        }

        // 处理右半部分
        if (minIdx < right) {
            console.log(`${indent}递归处理右半部分[${minIdx+1}, ${right}]`);
            total += solve(minIdx + 1, right, depth + 1);
        }

        // 调整边界
        if (minIdx > left && ratings[minIdx - 1] > ratings[minIdx]) {
            candies[minIdx - 1] = Math.max(candies[minIdx - 1], candies[minIdx] + 1);
        }
        if (minIdx < right && ratings[minIdx + 1] > ratings[minIdx]) {
            candies[minIdx + 1] = Math.max(candies[minIdx + 1], candies[minIdx] + 1);
        }

        return total;
    }

    const result = solve(0, ratings.length - 1);
    console.log(`分治法糖果分配: [${candies.join(', ')}]`);
    console.log(`总糖果数: ${result}`);

    return result;
}

/**
 * 方法四：栈模拟法
 *
 * 核心思想：
 * 使用栈来处理下降序列，在遇到上升或相等时结算栈中的元素
 *
 * @param {number[]} ratings - 孩子们的评分数组
 * @returns {number} 最少糖果数目
 * @time O(n) 每个元素最多入栈出栈一次
 * @space O(n) 栈空间
 */
function candyStack(ratings) {
    console.log("\n=== 分发糖果（栈模拟法） ===");
    console.log(`评分数组: [${ratings.join(', ')}]`);

    const n = ratings.length;
    if (n === 0) return 0;

    const stack = []; // 存储下降序列的索引
    const candies = new Array(n).fill(1);
    let total = 0;

    console.log("遍历过程:");

    for (let i = 0; i < n; i++) {
        console.log(`\n处理位置${i}, 评分=${ratings[i]}`);

        if (stack.length === 0 || ratings[i] >= ratings[stack[stack.length - 1]]) {
            // 非下降，结算栈中的下降序列
            if (stack.length > 0) {
                console.log(`  结算下降序列: [${stack.join(', ')}]`);

                // 从栈底到栈顶分配糖果
                for (let j = stack.length - 1; j >= 0; j--) {
                    const idx = stack[j];
                    candies[idx] = stack.length - j;
                    console.log(`    位置${idx}: 糖果=${candies[idx]}`);
                }

                // 调整栈底前一个元素
                const bottom = stack[0];
                if (bottom > 0 && ratings[bottom - 1] > ratings[bottom]) {
                    candies[bottom - 1] = Math.max(candies[bottom - 1], candies[bottom] + 1);
                    console.log(`    调整位置${bottom - 1}: 糖果=${candies[bottom - 1]}`);
                }

                stack.length = 0; // 清空栈
            }

            // 处理当前位置
            if (i > 0 && ratings[i] > ratings[i - 1]) {
                candies[i] = candies[i - 1] + 1;
                console.log(`  上升: 糖果=${candies[i]}`);
            } else {
                candies[i] = 1;
                console.log(`  重置: 糖果=1`);
            }
        } else {
            // 下降，加入栈
            stack.push(i);
            console.log(`  下降: 加入栈，栈内容: [${stack.join(', ')}]`);
        }
    }

    // 处理最后的下降序列
    if (stack.length > 0) {
        console.log(`\n最终结算下降序列: [${stack.join(', ')}]`);

        for (let j = stack.length - 1; j >= 0; j--) {
            const idx = stack[j];
            candies[idx] = stack.length - j;
            console.log(`  位置${idx}: 糖果=${candies[idx]}`);
        }

        const bottom = stack[0];
        if (bottom > 0 && ratings[bottom - 1] > ratings[bottom]) {
            candies[bottom - 1] = Math.max(candies[bottom - 1], candies[bottom] + 1);
            console.log(`  调整位置${bottom - 1}: 糖果=${candies[bottom - 1]}`);
        }
    }

    total = candies.reduce((sum, count) => sum + count, 0);
    console.log(`\n栈法糖果分配: [${candies.join(', ')}]`);
    console.log(`总糖果数: ${total}`);

    return total;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 验证糖果分配的正确性
 * @param {number[]} ratings - 评分数组
 * @param {number[]} candies - 糖果分配数组
 * @returns {boolean} 是否符合所有约束
 */
function validateCandyDistribution(ratings, candies) {
    console.log("\n=== 验证糖果分配 ===");

    if (ratings.length !== candies.length) {
        console.log("❌ 数组长度不匹配");
        return false;
    }

    // 检查每个孩子至少1个糖果
    for (let i = 0; i < candies.length; i++) {
        if (candies[i] < 1) {
            console.log(`❌ 位置${i}的糖果数${candies[i]} < 1`);
            return false;
        }
    }

    // 检查相邻约束
    for (let i = 0; i < ratings.length - 1; i++) {
        if (ratings[i] > ratings[i + 1] && candies[i] <= candies[i + 1]) {
            console.log(`❌ 位置${i}: 评分${ratings[i]} > ${ratings[i+1]}，但糖果${candies[i]} <= ${candies[i+1]}`);
            return false;
        }
        if (ratings[i] < ratings[i + 1] && candies[i] >= candies[i + 1]) {
            console.log(`❌ 位置${i}: 评分${ratings[i]} < ${ratings[i+1]}，但糖果${candies[i]} >= ${candies[i+1]}`);
            return false;
        }
    }

    console.log("✅ 糖果分配符合所有约束");
    return true;
}

/**
 * 可视化糖果分配
 * @param {number[]} ratings - 评分数组
 * @param {number[]} candies - 糖果分配数组
 */
function visualizeCandyDistribution(ratings, candies) {
    console.log("\n=== 糖果分配可视化 ===");

    const maxCandies = Math.max(...candies);
    const maxRating = Math.max(...ratings);

    console.log("糖果分配图（从上到下表示糖果数量）:");

    // 从最高糖果数开始，向下绘制
    for (let level = maxCandies; level >= 1; level--) {
        let line = `${level.toString().padStart(2)} |`;
        for (let i = 0; i < candies.length; i++) {
            if (candies[i] >= level) {
                line += " ●";
            } else {
                line += "  ";
            }
        }
        console.log(line);
    }

    // 横轴 - 位置
    let xAxis = "   +";
    let posLabels = "    ";
    for (let i = 0; i < candies.length; i++) {
        xAxis += "--";
        posLabels += `${i.toString().padStart(2)}`;
    }
    console.log(xAxis);
    console.log(posLabels);

    // 显示评分
    let ratingLine = "评分:";
    for (let i = 0; i < ratings.length; i++) {
        ratingLine += `${ratings[i].toString().padStart(2)}`;
    }
    console.log(ratingLine);

    // 显示糖果数
    let candyLine = "糖果:";
    for (let i = 0; i < candies.length; i++) {
        candyLine += `${candies[i].toString().padStart(2)}`;
    }
    console.log(candyLine);
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    // 生成测试用例
    const generateTestCase = (size, pattern = 'random') => {
        const ratings = [];

        switch (pattern) {
            case 'ascending':
                for (let i = 0; i < size; i++) {
                    ratings.push(i + 1);
                }
                break;
            case 'descending':
                for (let i = 0; i < size; i++) {
                    ratings.push(size - i);
                }
                break;
            case 'mountain':
                const mid = Math.floor(size / 2);
                for (let i = 0; i < size; i++) {
                    if (i <= mid) {
                        ratings.push(i + 1);
                    } else {
                        ratings.push(size - i);
                    }
                }
                break;
            default: // random
                for (let i = 0; i < size; i++) {
                    ratings.push(Math.floor(Math.random() * 10) + 1);
                }
        }

        return ratings;
    };

    const testCases = [
        { ratings: [1, 0, 2], pattern: '基本测试' },
        { ratings: [1, 2, 2], pattern: '相等情况' },
        { ratings: generateTestCase(10, 'ascending'), pattern: '严格递增' },
        { ratings: generateTestCase(10, 'descending'), pattern: '严格递减' },
        { ratings: generateTestCase(20, 'mountain'), pattern: '山峰形状' },
        { ratings: generateTestCase(100, 'random'), pattern: '随机数据' },
        { ratings: generateTestCase(1000, 'random'), pattern: '大数据量' }
    ];

    const methods = [
        { name: '两次遍历', func: candy },
        { name: '一次遍历', func: candyOnePass }
        // 其他方法在大数据时可能太慢，跳过
    ];

    for (let i = 0; i < testCases.length; i++) {
        const { ratings, pattern } = testCases[i];
        console.log(`\n测试用例 ${i + 1}: ${pattern} (长度: ${ratings.length})`);

        if (ratings.length <= 20) {
            console.log(`评分: [${ratings.join(', ')}]`);
        }

        const results = [];

        for (const method of methods) {
            try {
                const startTime = performance.now();
                const result = method.func([...ratings]); // 复制数组避免修改原数组
                const endTime = performance.now();

                results.push(result);
                console.log(`${method.name}: 糖果总数 ${result}, 耗时: ${(endTime - startTime).toFixed(3)}ms`);
            } catch (error) {
                console.log(`${method.name}: 执行失败 - ${error.message}`);
                results.push(null);
            }
        }

        // 检查结果一致性
        const validResults = results.filter(r => r !== null);
        const allSame = validResults.every(result => result === validResults[0]);
        console.log(`结果一致性: ${allSame ? '✅' : '❌'}`);

        if (!allSame) {
            console.log(`不同结果: [${results.join(', ')}]`);
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
    console.log("分发糖果算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { ratings: [1, 0, 2], expected: 5, description: "基本情况：先降后升" },
        { ratings: [1, 2, 2], expected: 4, description: "包含相等评分" },
        { ratings: [1, 3, 2, 2, 1], expected: 7, description: "复杂山峰" },
        { ratings: [1, 2, 87, 87, 87, 2, 1], expected: 13, description: "平顶山峰" },
        { ratings: [1], expected: 1, description: "单个孩子" },
        { ratings: [1, 2, 3, 4, 5], expected: 15, description: "严格递增" },
        { ratings: [5, 4, 3, 2, 1], expected: 15, description: "严格递减" },
        { ratings: [2, 1, 3, 2, 4, 3, 5], expected: 12, description: "锯齿形" }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`${"=".repeat(30)}`);

        const { ratings, expected } = testCase;
        console.log(`评分数组: [${ratings.join(', ')}]`);
        console.log(`期望糖果总数: ${expected}`);

        // 测试主要方法
        const methods = [
            { name: "两次遍历", func: candy },
            { name: "一次遍历", func: candyOnePass }
        ];

        // 小数组才测试复杂方法
        if (ratings.length <= 10) {
            methods.push(
                { name: "分治法", func: candyDivideConquer },
                { name: "栈模拟法", func: candyStack }
            );
        }

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func([...ratings]);
                results.push(result);

                const isCorrect = result === expected;
                console.log(`结果: ${result}, 期望: ${expected}, 正确: ${isCorrect ? '✅' : '❌'}`);
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

        // 可视化小数组的结果
        if (ratings.length <= 10) {
            const candies = new Array(ratings.length).fill(1);
            // 快速计算糖果分配用于可视化
            for (let i = 1; i < ratings.length; i++) {
                if (ratings[i] > ratings[i - 1]) {
                    candies[i] = candies[i - 1] + 1;
                }
            }
            for (let i = ratings.length - 2; i >= 0; i--) {
                if (ratings[i] > ratings[i + 1]) {
                    candies[i] = Math.max(candies[i], candies[i + 1] + 1);
                }
            }

            visualizeCandyDistribution(ratings, candies);
            validateCandyDistribution(ratings, candies);
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
    console.log("分发糖果算法演示");
    console.log("=".repeat(50));

    console.log("问题核心思想:");
    console.log("1. 每个孩子至少1个糖果");
    console.log("2. 相邻孩子中评分高的要比评分低的糖果多");
    console.log("3. 目标是使总糖果数最少");

    const demoArray = [1, 0, 2];
    console.log(`\n演示数组: [${demoArray.join(', ')}]`);

    console.log("\n贪心算法关键洞察:");
    console.log("• 问题可以分解为两个子问题：");
    console.log("  1. 保证从左到右的约束：右边高就比左边多");
    console.log("  2. 保证从右到左的约束：左边高就比右边多");
    console.log("• 两次遍历分别解决这两个约束");
    console.log("• 取两个结果的最大值确保同时满足");

    console.log("\n详细演示 - 两次遍历法:");
    const result = candy(demoArray);

    console.log("\n算法复杂度分析:");
    console.log("1. 两次遍历: 时间O(n)，空间O(n)，最易理解");
    console.log("2. 一次遍历: 时间O(n)，空间O(1)，最优解");
    console.log("3. 分治法: 时间O(n log n)，空间O(n)，递归思想");
    console.log("4. 栈模拟: 时间O(n)，空间O(n)，处理下降序列");

    console.log("\n关键技巧:");
    console.log("• 贪心思想：局部最优导致全局最优");
    console.log("• 约束分离：分别处理左右约束再合并");
    console.log("• 序列处理：识别上升、下降、平坦区域");

    console.log("\n实际应用场景:");
    console.log("• 资源分配问题");
    console.log("• 激励机制设计");
    console.log("• 公平性约束优化");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        candy,
        candyOnePass,
        candyDivideConquer,
        candyStack,
        validateCandyDistribution,
        visualizeCandyDistribution,
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