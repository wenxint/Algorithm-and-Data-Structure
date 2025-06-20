/**
 * LeetCode 007: 买卖股票的最佳时机 (Best Time to Buy and Sell Stock)
 *
 * 题目描述：
 * 给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。
 * 你只能选择某一天买入这只股票，并选择在未来的某一天卖出该股票。
 * 设计一个算法来计算你所能获取的最大利润。
 * 返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。
 *
 * 核心思想：
 * 贪心算法 + 一次遍历
 * 核心理念：记录历史最低点，计算当前价格与历史最低点的差值（最大利润）
 *
 * 算法原理：
 * 1. 维护两个变量：最低买入价格和最大利润
 * 2. 遍历数组，对于每个价格：
 *    - 更新最低买入价格
 *    - 计算当前卖出能获得的利润
 *    - 更新最大利润
 * 3. 返回最大利润
 */

/**
 * 解法一：贪心算法（推荐）
 *
 * 核心思想：
 * 在最低点买入，在最高点卖出
 * 遍历过程中维护最低买入价和最大利润
 *
 * @param {number[]} prices - 股票价格数组
 * @returns {number} 最大利润
 * @time O(n) 一次遍历
 * @space O(1) 只使用常数额外空间
 */
function maxProfit(prices) {
    if (!prices || prices.length <= 1) return 0;

    let minPrice = prices[0];  // 记录到目前为止的最低价格
    let maxProfit = 0;        // 记录最大利润

    for (let i = 1; i < prices.length; i++) {
        // 如果当前价格更低，更新最低价格
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        } else {
            // 如果当前价格不是最低，计算在当前价格卖出的利润
            const currentProfit = prices[i] - minPrice;
            maxProfit = Math.max(maxProfit, currentProfit);
        }
    }

    return maxProfit;
}

/**
 * 解法二：动态规划
 *
 * 核心思想：
 * 状态定义：dp[i]表示前i天能获得的最大利润
 * 状态转移：dp[i] = max(dp[i-1], prices[i] - minPrice)
 *
 * @param {number[]} prices - 股票价格数组
 * @returns {number} 最大利润
 * @time O(n) 一次遍历
 * @space O(n) 使用dp数组
 */
function maxProfitDP(prices) {
    if (!prices || prices.length <= 1) return 0;

    const n = prices.length;
    const dp = new Array(n);  // dp[i]表示前i天的最大利润
    let minPrice = prices[0];

    dp[0] = 0;  // 第一天无法卖出，利润为0

    for (let i = 1; i < n; i++) {
        // 更新最低价格
        minPrice = Math.min(minPrice, prices[i]);

        // 状态转移：前i天的最大利润 = max(前i-1天的最大利润, 今天卖出的利润)
        dp[i] = Math.max(dp[i - 1], prices[i] - minPrice);
    }

    return dp[n - 1];
}

/**
 * 解法三：暴力法（O(n²)）
 *
 * 核心思想：
 * 枚举所有可能的买入和卖出日期组合
 *
 * @param {number[]} prices - 股票价格数组
 * @returns {number} 最大利润
 * @time O(n²) 双层循环
 * @space O(1) 只使用常数额外空间
 */
function maxProfitBruteForce(prices) {
    if (!prices || prices.length <= 1) return 0;

    let maxProfit = 0;

    // 枚举所有买入日期
    for (let i = 0; i < prices.length - 1; i++) {
        // 枚举所有在买入日期之后的卖出日期
        for (let j = i + 1; j < prices.length; j++) {
            const profit = prices[j] - prices[i];
            maxProfit = Math.max(maxProfit, profit);
        }
    }

    return maxProfit;
}

/**
 * 解法四：转换为最大子数组和问题
 *
 * 核心思想：
 * 将问题转换为求相邻元素差值的最大子数组和
 *
 * @param {number[]} prices - 股票价格数组
 * @returns {number} 最大利润
 * @time O(n) 一次遍历
 * @space O(n) 存储差值数组
 */
function maxProfitSubarray(prices) {
    if (!prices || prices.length <= 1) return 0;

    // 计算相邻日期的价格差值
    const diffs = [];
    for (let i = 1; i < prices.length; i++) {
        diffs.push(prices[i] - prices[i - 1]);
    }

    // 使用Kadane算法求最大子数组和
    let maxEndingHere = 0;
    let maxSoFar = 0;

    for (const diff of diffs) {
        maxEndingHere = Math.max(0, maxEndingHere + diff);
        maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }

    return maxSoFar;
}

/**
 * 返回最佳买卖时机的具体日期
 *
 * @param {number[]} prices - 股票价格数组
 * @returns {Object} 包含最大利润、买入日期、卖出日期的对象
 */
function maxProfitWithDates(prices) {
    if (!prices || prices.length <= 1) {
        return { profit: 0, buyDay: -1, sellDay: -1 };
    }

    let minPrice = prices[0];
    let maxProfit = 0;
    let buyDay = 0;
    let sellDay = 0;
    let currentBuyDay = 0;

    for (let i = 1; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
            currentBuyDay = i;
        } else {
            const currentProfit = prices[i] - minPrice;
            if (currentProfit > maxProfit) {
                maxProfit = currentProfit;
                buyDay = currentBuyDay;
                sellDay = i;
            }
        }
    }

    return {
        profit: maxProfit,
        buyDay: buyDay,
        sellDay: sellDay,
        buyPrice: prices[buyDay],
        sellPrice: prices[sellDay]
    };
}

/**
 * 多次交易版本：可以多次买卖股票
 *
 * 核心思想：
 * 贪心策略，只要后一天价格比前一天高就进行交易
 *
 * @param {number[]} prices - 股票价格数组
 * @returns {number} 最大利润
 * @time O(n) 一次遍历
 * @space O(1) 只使用常数额外空间
 */
function maxProfitMultiple(prices) {
    if (!prices || prices.length <= 1) return 0;

    let totalProfit = 0;

    for (let i = 1; i < prices.length; i++) {
        // 如果今天价格比昨天高，就进行交易
        if (prices[i] > prices[i - 1]) {
            totalProfit += prices[i] - prices[i - 1];
        }
    }

    return totalProfit;
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 007: 买卖股票的最佳时机 测试 ===\n');

    const testCases = [
        {
            prices: [7, 1, 5, 3, 6, 4],
            expected: 5,
            description: '经典用例：第2天买入(1)，第5天卖出(6)，利润 = 6-1 = 5'
        },
        {
            prices: [7, 6, 4, 3, 1],
            expected: 0,
            description: '价格递减：无法获利，返回0'
        },
        {
            prices: [1, 2, 3, 4, 5],
            expected: 4,
            description: '价格递增：第1天买入(1)，第5天卖出(5)，利润 = 5-1 = 4'
        },
        {
            prices: [2, 4, 1],
            expected: 2,
            description: '第1天买入(2)，第2天卖出(4)，利润 = 4-2 = 2'
        },
        {
            prices: [3, 2, 6, 5, 0, 3],
            expected: 4,
            description: '第2天买入(2)，第3天卖出(6)，利润 = 6-2 = 4'
        },
        {
            prices: [1],
            expected: 0,
            description: '边界用例：只有一天，无法交易'
        },
        {
            prices: [],
            expected: 0,
            description: '边界用例：空数组'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`输入: [${test.prices.join(', ')}]`);

        // 测试各种解法
        const result1 = maxProfit([...test.prices]);
        const result2 = maxProfitDP([...test.prices]);
        const result3 = maxProfitBruteForce([...test.prices]);
        const result4 = maxProfitSubarray([...test.prices]);
        const detailed = maxProfitWithDates([...test.prices]);

        console.log(`贪心算法结果: ${result1}`);
        console.log(`动态规划结果: ${result2}`);
        console.log(`暴力法结果: ${result3}`);
        console.log(`子数组和法结果: ${result4}`);
        console.log(`详细结果: 利润=${detailed.profit}, 买入第${detailed.buyDay + 1}天(${detailed.buyPrice}), 卖出第${detailed.sellDay + 1}天(${detailed.sellPrice})`);

        // 验证结果
        const isCorrect = result1 === test.expected;
        console.log(`结果验证: ${isCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log('---');
    });
}

// 可视化演示
function visualDemo() {
    console.log('\n=== 买卖股票可视化演示 ===');

    const prices = [7, 1, 5, 3, 6, 4];
    console.log(`股票价格: [${prices.join(', ')}]`);

    console.log('\n贪心算法执行过程:');
    let minPrice = prices[0];
    let maxProfit = 0;

    console.log(`第1天: 价格=${prices[0]}, 最低价=${minPrice}, 最大利润=${maxProfit}`);

    for (let i = 1; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
            console.log(`第${i + 1}天: 价格=${prices[i]}, 更新最低价=${minPrice}, 最大利润=${maxProfit}`);
        } else {
            const currentProfit = prices[i] - minPrice;
            maxProfit = Math.max(maxProfit, currentProfit);
            console.log(`第${i + 1}天: 价格=${prices[i]}, 当前利润=${currentProfit}, 最大利润=${maxProfit}`);
        }
    }

    console.log(`\n最终结果: 最大利润 = ${maxProfit}`);

    // 显示最佳交易策略
    const strategy = maxProfitWithDates(prices);
    console.log(`最佳策略: 第${strategy.buyDay + 1}天买入(${strategy.buyPrice}) → 第${strategy.sellDay + 1}天卖出(${strategy.sellPrice})`);

    // 价格变化图（ASCII艺术）
    console.log('\n价格变化图:');
    const maxPrice = Math.max(...prices);
    const minPriceValue = Math.min(...prices);
    const range = maxPrice - minPriceValue;

    for (let level = maxPrice; level >= minPriceValue; level--) {
        let line = `${level.toString().padStart(2)} |`;
        for (let i = 0; i < prices.length; i++) {
            if (prices[i] >= level) {
                line += ' * ';
            } else {
                line += '   ';
            }
        }
        console.log(line);
    }

    console.log('   +' + '---'.repeat(prices.length));
    console.log('    ' + prices.map((_, i) => (i + 1).toString().padStart(3)).join(''));
    console.log('    天数');
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能对比测试 ===');

    const sizes = [1000, 10000, 100000];

    sizes.forEach(size => {
        console.log(`\n测试数据规模: ${size} 天`);

        // 生成随机股票价格
        const prices = Array.from({ length: size }, () => Math.floor(Math.random() * 1000) + 1);

        // 测试贪心算法
        console.time('贪心算法');
        const result1 = maxProfit([...prices]);
        console.timeEnd('贪心算法');

        // 测试动态规划
        console.time('动态规划');
        const result2 = maxProfitDP([...prices]);
        console.timeEnd('动态规划');

        // 测试子数组和法
        console.time('子数组和法');
        const result3 = maxProfitSubarray([...prices]);
        console.timeEnd('子数组和法');

        // 暴力法只在小数据规模下测试
        if (size <= 1000) {
            console.time('暴力法');
            const result4 = maxProfitBruteForce([...prices]);
            console.timeEnd('暴力法');
        } else {
            console.log('暴力法: 数据量过大，跳过测试');
        }

        console.log(`最大利润: ${result1}`);
    });
}

// 复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');

    console.log('1. 贪心算法（推荐）:');
    console.log('   时间复杂度: O(n) - 一次遍历');
    console.log('   空间复杂度: O(1) - 只使用常数额外空间');
    console.log('   优点: 最优的时空复杂度，思路清晰');
    console.log('   缺点: 无');

    console.log('\n2. 动态规划:');
    console.log('   时间复杂度: O(n) - 一次遍历');
    console.log('   空间复杂度: O(n) - 使用dp数组');
    console.log('   优点: DP思想清晰，便于理解状态转移');
    console.log('   缺点: 空间开销大');

    console.log('\n3. 暴力法:');
    console.log('   时间复杂度: O(n²) - 双层循环');
    console.log('   空间复杂度: O(1) - 只使用常数额外空间');
    console.log('   优点: 思路直观，容易理解');
    console.log('   缺点: 时间复杂度过高，大数据超时');

    console.log('\n4. 子数组和法:');
    console.log('   时间复杂度: O(n) - 一次遍历');
    console.log('   空间复杂度: O(n) - 存储差值数组');
    console.log('   优点: 巧妙转换问题，体现算法思维');
    console.log('   缺点: 空间开销，理解稍难');

    console.log('\n推荐解法: 贪心算法');
    console.log('理由: 时空复杂度最优，思路简单直观');
}

// 问题变形和扩展
function problemVariants() {
    console.log('\n=== 问题变形和扩展 ===');

    console.log('1. 买卖股票的最佳时机 II (可以多次交易):');
    const prices1 = [7, 1, 5, 3, 6, 4];
    const multipleProfit = maxProfitMultiple(prices1);
    console.log(`   输入: [${prices1.join(', ')}]`);
    console.log(`   多次交易最大利润: ${multipleProfit}`);

    console.log('\n2. 买卖股票的最佳时机 III (最多2次交易):');
    console.log('   需要动态规划，状态更复杂');

    console.log('\n3. 买卖股票的最佳时机 IV (最多k次交易):');
    console.log('   需要二维动态规划');

    console.log('\n4. 买卖股票的最佳时机含冷冻期:');
    console.log('   需要考虑冷冻期状态');

    console.log('\n5. 买卖股票的最佳时机含手续费:');
    console.log('   需要考虑交易成本');

    // 演示多次交易的过程
    console.log('\n多次交易策略演示:');
    console.log(`价格数组: [${prices1.join(', ')}]`);
    console.log('交易策略:');

    let totalProfit = 0;
    for (let i = 1; i < prices1.length; i++) {
        if (prices1[i] > prices1[i - 1]) {
            const profit = prices1[i] - prices1[i - 1];
            totalProfit += profit;
            console.log(`  第${i}天买入(${prices1[i - 1]}) → 第${i + 1}天卖出(${prices1[i]})，利润: ${profit}`);
        }
    }
    console.log(`总利润: ${totalProfit}`);
}

// 实际应用场景
function practicalApplications() {
    console.log('\n=== 实际应用场景 ===');

    console.log('1. 股票投资:');
    console.log('   - 寻找最佳买卖时机');
    console.log('   - 风险控制和利润最大化');

    console.log('\n2. 商品交易:');
    console.log('   - 季节性商品的买卖时机');
    console.log('   - 期货交易策略');

    console.log('\n3. 资源配置:');
    console.log('   - 云服务器资源的购买和释放');
    console.log('   - 批量采购的最佳时机');

    console.log('\n4. 数据分析:');
    console.log('   - 时间序列数据的峰值检测');
    console.log('   - 趋势分析和预测');

    // 实际股票数据模拟
    console.log('\n模拟股票交易示例:');
    const stockPrices = [100, 95, 102, 98, 110, 105, 115, 108, 120];
    const analysis = maxProfitWithDates(stockPrices);

    console.log(`股票价格: [${stockPrices.join(', ')}]`);
    console.log(`最佳买入: 第${analysis.buyDay + 1}天，价格 ${analysis.buyPrice}`);
    console.log(`最佳卖出: 第${analysis.sellDay + 1}天，价格 ${analysis.sellPrice}`);
    console.log(`最大利润: ${analysis.profit} (收益率: ${(analysis.profit / analysis.buyPrice * 100).toFixed(2)}%)`);
}

// 贪心算法思想详解
function greedyExplanation() {
    console.log('\n=== 贪心算法思想详解 ===');

    console.log('贪心策略核心:');
    console.log('1. 在可能的最低点买入');
    console.log('2. 在可能的最高点卖出');
    console.log('3. 局部最优选择导致全局最优解');

    console.log('\n贪心选择性质证明:');
    console.log('- 假设最优解在第i天买入，第j天卖出');
    console.log('- 如果在第i天之前存在更低价格，那么在更低价格买入会获得更大利润');
    console.log('- 因此最优解必定在历史最低点买入');

    console.log('\n算法正确性:');
    console.log('- 贪心算法总是在历史最低点买入');
    console.log('- 对于每个可能的卖出点，都计算了与历史最低点的差值');
    console.log('- 因此找到的是全局最优解');

    // 反例说明
    console.log('\n为什么不能贪心地在每个局部最低点买入？');
    const example = [4, 7, 2, 1, 8];
    console.log(`例子: [${example.join(', ')}]`);
    console.log('如果在第1天(4)买入第2天(7)卖出，利润=3');
    console.log('但最优策略是第4天(1)买入第5天(8)卖出，利润=7');
    console.log('说明局部贪心不一定得到全局最优');
}

// 运行所有测试
if (require.main === module) {
    runTests();
    visualDemo();
    performanceTest();
    complexityAnalysis();
    problemVariants();
    practicalApplications();
    greedyExplanation();
}

// 导出函数供其他模块使用
module.exports = {
    maxProfit,
    maxProfitDP,
    maxProfitBruteForce,
    maxProfitSubarray,
    maxProfitWithDates,
    maxProfitMultiple
};