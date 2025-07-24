/**
 * LeetCode 122. 买卖股票的最佳时机 II
 *
 * 问题描述：
 * 给你一个整数数组 prices ，其中 prices[i] 表示某支股票第 i 天的价格。
 * 在每一天，你可以决定是否购买和/或出售股票。你在任何时候最多只能持有一股股票。
 * 你也可以先购买，然后在同一天出售。
 * 返回你能获得的最大利润。
 *
 * 核心思想：
 * 贪心算法：只要今天价格比昨天高，就在昨天买入今天卖出
 * 相当于捕获所有上涨区间的利润
 *
 * 示例：
 * 输入：prices = [7,1,5,3,6,4]
 * 输出：7
 * 解释：在第 2 天（股票价格 = 1）的时候买入，在第 3 天（股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。
 *      随后，在第 4 天（股票价格 = 3）的时候买入，在第 5 天（股票价格 = 6）的时候卖出, 这笔交易所能获得利润 = 6-3 = 3 。
 */

/**
 * 买卖股票的最佳时机 II - 贪心算法（面试推荐）
 * @param {number[]} prices - 股票价格数组
 * @return {number} 最大利润
 * @time O(n) 时间复杂度
 * @space O(1) 空间复杂度
 */
function maxProfit(prices) {
    // 边界条件处理
    if (!prices || prices.length <= 1) return 0;

    let totalProfit = 0;

    // 遍历价格数组，只要后一天价格比前一天高就交易
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i - 1]) {
            // 在第i-1天买入，第i天卖出
            totalProfit += prices[i] - prices[i - 1];
        }
    }

    return totalProfit;
}

/**
 * 买卖股票的最佳时机 II - 详细分析版本
 * @param {number[]} prices - 股票价格数组
 * @return {number} 最大利润
 */
function maxProfitWithAnalysis(prices) {
    if (!prices || prices.length <= 1) {
        console.log('价格数组无效或长度不足，无法交易');
        return 0;
    }

    console.log(`股票价格: [${prices.join(', ')}]`);

    let totalProfit = 0;
    const transactions = [];

    console.log('\n贪心策略分析:');

    for (let i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i - 1]) {
            const profit = prices[i] - prices[i - 1];
            totalProfit += profit;
            transactions.push({
                buyDay: i - 1,
                sellDay: i,
                buyPrice: prices[i - 1],
                sellPrice: prices[i],
                profit: profit
            });

            console.log(`第${i}天: 第${i-1}天买入(${prices[i-1]}) → 第${i}天卖出(${prices[i]}) = 利润${profit}`);
        } else {
            console.log(`第${i}天: 价格下跌或持平，不交易`);
        }
    }

    console.log(`\n交易记录:`);
    transactions.forEach((transaction, index) => {
        console.log(`交易${index + 1}: 第${transaction.buyDay}天买入@${transaction.buyPrice} → 第${transaction.sellDay}天卖出@${transaction.sellPrice} = 利润${transaction.profit}`);
    });

    console.log(`总利润: ${totalProfit}`);
    console.log(`交易次数: ${transactions.length}`);

    return totalProfit;
}

/**
 * 买卖股票的最佳时机 II - 动态规划解法
 * @param {number[]} prices - 股票价格数组
 * @return {number} 最大利润
 * @time O(n) 时间复杂度
 * @space O(n) 空间复杂度
 */
function maxProfitDP(prices) {
    if (!prices || prices.length <= 1) return 0;

    const n = prices.length;

    // dp[i][0] 表示第i天不持有股票的最大利润
    // dp[i][1] 表示第i天持有股票的最大利润
    const dp = Array(n).fill(null).map(() => Array(2).fill(0));

    // 初始状态
    dp[0][0] = 0;           // 第0天不持有股票，利润为0
    dp[0][1] = -prices[0];  // 第0天持有股票，利润为-prices[0]

    for (let i = 1; i < n; i++) {
        // 第i天不持有股票：要么昨天就不持有，要么今天卖出
        dp[i][0] = Math.max(dp[i - 1][0], dp[i - 1][1] + prices[i]);

        // 第i天持有股票：要么昨天就持有，要么今天买入
        dp[i][1] = Math.max(dp[i - 1][1], dp[i - 1][0] - prices[i]);
    }

    // 最后一天不持有股票的利润就是最大利润
    return dp[n - 1][0];
}

/**
 * 买卖股票的最佳时机 II - 动态规划空间优化版本
 * @param {number[]} prices - 股票价格数组
 * @return {number} 最大利润
 * @time O(n) 时间复杂度
 * @space O(1) 空间复杂度
 */
function maxProfitDPOptimized(prices) {
    if (!prices || prices.length <= 1) return 0;

    // 只需要保存前一天的状态
    let hold = -prices[0];  // 持有股票的最大利润
    let sold = 0;           // 不持有股票的最大利润

    for (let i = 1; i < prices.length; i++) {
        const newSold = Math.max(sold, hold + prices[i]);  // 今天卖出或保持不持有
        const newHold = Math.max(hold, sold - prices[i]);  // 今天买入或保持持有

        sold = newSold;
        hold = newHold;
    }

    return sold;
}

/**
 * 买卖股票的最佳时机 II - 找出所有交易区间
 * @param {number[]} prices - 股票价格数组
 * @return {object} 包含最大利润和交易区间的对象
 */
function maxProfitWithIntervals(prices) {
    if (!prices || prices.length <= 1) {
        return { maxProfit: 0, intervals: [] };
    }

    const intervals = [];
    let i = 0;
    const n = prices.length;

    while (i < n - 1) {
        // 找到局部最小值（买入点）
        while (i < n - 1 && prices[i] >= prices[i + 1]) {
            i++;
        }

        if (i === n - 1) break; // 没有更多的交易机会

        const buyDay = i;

        // 找到局部最大值（卖出点）
        while (i < n - 1 && prices[i] <= prices[i + 1]) {
            i++;
        }

        const sellDay = i;
        const profit = prices[sellDay] - prices[buyDay];

        intervals.push({
            buyDay,
            sellDay,
            buyPrice: prices[buyDay],
            sellPrice: prices[sellDay],
            profit
        });
    }

    const maxProfit = intervals.reduce((sum, interval) => sum + interval.profit, 0);

    return { maxProfit, intervals };
}

/**
 * 测试函数
 */
function testMaxProfitII() {
    const testCases = [
        {
            prices: [7, 1, 5, 3, 6, 4],
            expected: 7,
            description: "经典案例：多次交易获得最大利润"
        },
        {
            prices: [1, 2, 3, 4, 5],
            expected: 4,
            description: "连续上涨：每天都交易"
        },
        {
            prices: [7, 6, 4, 3, 1],
            expected: 0,
            description: "连续下跌：不进行任何交易"
        },
        {
            prices: [1, 2, 1, 2, 1],
            expected: 2,
            description: "波动市场：捕获每次上涨"
        },
        {
            prices: [3, 3, 3, 3, 3],
            expected: 0,
            description: "价格不变：无交易机会"
        },
        {
            prices: [1],
            expected: 0,
            description: "单日价格：无法交易"
        }
    ];

    console.log("💰 买卖股票的最佳时机 II 算法测试");
    console.log("===============================");

    testCases.forEach((testCase, index) => {
        console.log(`\n测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`输入: [${testCase.prices.join(', ')}]`);

        const result1 = maxProfit(testCase.prices);
        const result2 = maxProfitDP(testCase.prices);
        const result3 = maxProfitDPOptimized(testCase.prices);
        const intervalResult = maxProfitWithIntervals(testCase.prices);

        console.log(`贪心算法结果: ${result1}`);
        console.log(`动态规划结果: ${result2}`);
        console.log(`DP优化结果: ${result3}`);
        console.log(`交易区间数量: ${intervalResult.intervals.length}`);
        console.log(`期望结果: ${testCase.expected}`);

        const passed = result1 === testCase.expected &&
                      result2 === testCase.expected &&
                      result3 === testCase.expected;

        console.log(`测试${passed ? '✅ 通过' : '❌ 失败'}`);

        // 详细分析第一个用例
        if (index === 0) {
            console.log('\n--- 详细分析过程 ---');
            maxProfitWithAnalysis(testCase.prices);

            console.log('\n--- 交易区间分析 ---');
            intervalResult.intervals.forEach((interval, idx) => {
                console.log(`区间${idx + 1}: 第${interval.buyDay}天买入@${interval.buyPrice} → 第${interval.sellDay}天卖出@${interval.sellPrice} = 利润${interval.profit}`);
            });
        }
    });
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n📊 性能测试");
    console.log("===========");

    const sizes = [1000, 5000, 10000];

    sizes.forEach(size => {
        // 生成随机价格数据
        const prices = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);

        console.log(`\n数组大小: ${size}`);

        // 测试贪心算法
        let start = performance.now();
        const result1 = maxProfit(prices);
        let end = performance.now();
        console.log(`贪心算法: ${(end - start).toFixed(4)}ms, 结果: ${result1}`);

        // 测试动态规划
        start = performance.now();
        const result2 = maxProfitDP(prices);
        end = performance.now();
        console.log(`动态规划: ${(end - start).toFixed(4)}ms, 结果: ${result2}`);

        // 测试DP优化版本
        start = performance.now();
        const result3 = maxProfitDPOptimized(prices);
        end = performance.now();
        console.log(`DP优化版: ${(end - start).toFixed(4)}ms, 结果: ${result3}`);

        console.log(`结果一致性: ${result1 === result2 && result2 === result3 ? '✅' : '❌'}`);
    });
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        maxProfit,
        maxProfitWithAnalysis,
        maxProfitDP,
        maxProfitDPOptimized,
        maxProfitWithIntervals,
        testMaxProfitII,
        performanceTest
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.maxProfit = maxProfit;
    window.testMaxProfitII = testMaxProfitII;
}

// 运行测试
// testMaxProfitII();
// performanceTest();