/**
 * LeetCode 57. 插入区间
 *
 * 问题描述：
 * 给你一个无重叠的，按照区间起始端点排序的区间列表。
 * 在列表中插入一个新的区间，你需要确保列表中的区间仍然有序且不重叠
 * （如果有必要的话，可以合并区间）。
 *
 * 核心思想：
 * 这是一个典型的区间合并问题，关键在于找到正确的插入位置和合并策略
 * 需要考虑新区间与现有区间的三种关系：
 * 1. 无重叠且在左侧 - 直接添加
 * 2. 有重叠 - 需要合并
 * 3. 无重叠且在右侧 - 直接添加
 *
 * 主要解法有：
 * 1. 线性扫描法 - O(n)
 * 2. 三段式处理法 - O(n)
 * 3. 二分查找优化 - O(log n + k)
 * 4. 暴力合并法 - O(n)
 *
 * 示例：
 * 输入：intervals = [[1,3],[6,9]], newInterval = [2,5]
 * 输出：[[1,5],[6,9]]
 * 解释：新区间[2,5]与[1,3]重叠，合并为[1,5]
 *
 * 输入：intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
 * 输出：[[1,2],[3,10],[12,16]]
 * 解释：新区间[4,8]与[3,5]、[6,7]、[8,10]重叠，合并为[3,10]
 */

/**
 * 方法一：线性扫描法（推荐）
 *
 * 核心思想：
 * 遍历所有区间，将它们分为三类：
 * 1. 在新区间左侧且无重叠的区间
 * 2. 与新区间有重叠的区间
 * 3. 在新区间右侧且无重叠的区间
 *
 * 对于重叠的区间，合并成一个大区间
 *
 * 算法步骤：
 * 1. 添加所有结束时间小于新区间开始时间的区间
 * 2. 合并所有与新区间重叠的区间
 * 3. 添加所有开始时间大于新区间结束时间的区间
 *
 * @param {number[][]} intervals - 原区间列表
 * @param {number[]} newInterval - 要插入的新区间
 * @returns {number[][]} 合并后的区间列表
 * @time O(n) 一次遍历
 * @space O(n) 结果数组
 */
function insert(intervals, newInterval) {
    console.log("=== 插入区间（线性扫描法） ===");

    if (!intervals || intervals.length === 0) {
        console.log("原区间列表为空，直接返回新区间");
        return [newInterval];
    }

    console.log(`原区间列表: ${formatIntervals(intervals)}`);
    console.log(`新区间: [${newInterval.join(', ')}]`);

    const result = [];
    let i = 0;
    const n = intervals.length;

    console.log(`\n开始线性扫描合并:`);

    // 第一阶段：添加所有在新区间左侧的区间
    console.log(`\n阶段1: 添加左侧无重叠区间`);
    while (i < n && intervals[i][1] < newInterval[0]) {
        console.log(`  区间[${intervals[i].join(', ')}]在新区间左侧，直接添加`);
        result.push(intervals[i]);
        i++;
    }
    console.log(`  左侧区间处理完成，当前结果: ${formatIntervals(result)}`);

    // 第二阶段：合并所有与新区间重叠的区间
    console.log(`\n阶段2: 合并重叠区间`);
    let mergedStart = newInterval[0];
    let mergedEnd = newInterval[1];
    console.log(`  初始合并区间: [${mergedStart}, ${mergedEnd}]`);

    while (i < n && intervals[i][0] <= newInterval[1]) {
        console.log(`  检查区间[${intervals[i].join(', ')}]:`);
        console.log(`    区间开始${intervals[i][0]} <= 新区间结束${newInterval[1]}，存在重叠`);

        mergedStart = Math.min(mergedStart, intervals[i][0]);
        mergedEnd = Math.max(mergedEnd, intervals[i][1]);

        console.log(`    更新合并区间为: [${mergedStart}, ${mergedEnd}]`);
        i++;
    }

    const mergedInterval = [mergedStart, mergedEnd];
    result.push(mergedInterval);
    console.log(`  合并完成，添加区间[${mergedInterval.join(', ')}]`);
    console.log(`  当前结果: ${formatIntervals(result)}`);

    // 第三阶段：添加所有在新区间右侧的区间
    console.log(`\n阶段3: 添加右侧无重叠区间`);
    while (i < n) {
        console.log(`  区间[${intervals[i].join(', ')}]在合并区间右侧，直接添加`);
        result.push(intervals[i]);
        i++;
    }

    console.log(`\n最终结果: ${formatIntervals(result)}`);

    // 可视化合并过程
    visualizeInsertProcess(intervals, newInterval, result);

    return result;
}

/**
 * 方法二：三段式处理法
 *
 * 核心思想：
 * 明确分离三个处理阶段，代码结构更清晰
 * 先收集左侧区间，再处理重叠区间，最后添加右侧区间
 *
 * @param {number[][]} intervals - 原区间列表
 * @param {number[]} newInterval - 要插入的新区间
 * @returns {number[][]} 合并后的区间列表
 * @time O(n)
 * @space O(n)
 */
function insertThreePhase(intervals, newInterval) {
    console.log("\n=== 插入区间（三段式处理法） ===");

    if (!intervals || intervals.length === 0) {
        return [newInterval];
    }

    console.log(`原区间列表: ${formatIntervals(intervals)}`);
    console.log(`新区间: [${newInterval.join(', ')}]`);

    const result = [];

    // 阶段1：收集左侧区间
    const leftIntervals = [];
    for (const interval of intervals) {
        if (interval[1] < newInterval[0]) {
            leftIntervals.push(interval);
        } else {
            break;
        }
    }
    console.log(`\n左侧区间: ${formatIntervals(leftIntervals)}`);

    // 阶段2：收集重叠区间
    const overlappingIntervals = [];
    for (const interval of intervals) {
        if (interval[0] <= newInterval[1] && interval[1] >= newInterval[0]) {
            overlappingIntervals.push(interval);
        }
    }
    console.log(`重叠区间: ${formatIntervals(overlappingIntervals)}`);

    // 阶段3：收集右侧区间
    const rightIntervals = [];
    for (const interval of intervals) {
        if (interval[0] > newInterval[1]) {
            rightIntervals.push(interval);
        }
    }
    console.log(`右侧区间: ${formatIntervals(rightIntervals)}`);

    // 合并重叠区间
    let mergedStart = newInterval[0];
    let mergedEnd = newInterval[1];

    for (const interval of overlappingIntervals) {
        mergedStart = Math.min(mergedStart, interval[0]);
        mergedEnd = Math.max(mergedEnd, interval[1]);
    }

    const mergedInterval = [mergedStart, mergedEnd];
    console.log(`合并后区间: [${mergedInterval.join(', ')}]`);

    // 组装最终结果
    result.push(...leftIntervals);
    result.push(mergedInterval);
    result.push(...rightIntervals);

    console.log(`最终结果: ${formatIntervals(result)}`);
    return result;
}

/**
 * 方法三：二分查找优化
 *
 * 核心思想：
 * 使用二分查找快速定位插入位置，减少扫描时间
 * 特别适用于大规模区间列表的情况
 *
 * @param {number[][]} intervals - 原区间列表
 * @param {number[]} newInterval - 要插入的新区间
 * @returns {number[][]} 合并后的区间列表
 * @time O(log n + k) k为重叠区间数量
 * @space O(n)
 */
function insertBinarySearch(intervals, newInterval) {
    console.log("\n=== 插入区间（二分查找优化） ===");

    if (!intervals || intervals.length === 0) {
        return [newInterval];
    }

    console.log(`原区间列表: ${formatIntervals(intervals)}`);
    console.log(`新区间: [${newInterval.join(', ')}]`);

    const n = intervals.length;

    // 二分查找第一个可能重叠的区间
    function findFirstOverlap(target) {
        let left = 0, right = n - 1;
        let result = n;  // 默认没有重叠

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (intervals[mid][1] >= target) {
                result = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        return result;
    }

    // 二分查找最后一个可能重叠的区间
    function findLastOverlap(target) {
        let left = 0, right = n - 1;
        let result = -1;  // 默认没有重叠

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (intervals[mid][0] <= target) {
                result = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return result;
    }

    const firstOverlap = findFirstOverlap(newInterval[0]);
    const lastOverlap = findLastOverlap(newInterval[1]);

    console.log(`\n二分查找结果:`);
    console.log(`第一个可能重叠的区间索引: ${firstOverlap}`);
    console.log(`最后一个可能重叠的区间索引: ${lastOverlap}`);

    const result = [];

    // 添加左侧区间
    for (let i = 0; i < firstOverlap; i++) {
        result.push(intervals[i]);
    }

    // 合并重叠区间
    if (firstOverlap <= lastOverlap) {
        let mergedStart = Math.min(newInterval[0], intervals[firstOverlap][0]);
        let mergedEnd = Math.max(newInterval[1], intervals[lastOverlap][1]);

        // 检查实际重叠范围
        for (let i = firstOverlap; i <= lastOverlap; i++) {
            if (intervals[i][0] <= newInterval[1] && intervals[i][1] >= newInterval[0]) {
                mergedStart = Math.min(mergedStart, intervals[i][0]);
                mergedEnd = Math.max(mergedEnd, intervals[i][1]);
            }
        }

        result.push([mergedStart, mergedEnd]);
        console.log(`合并区间: [${mergedStart}, ${mergedEnd}]`);
    } else {
        result.push(newInterval);
        console.log(`无重叠，直接插入新区间`);
    }

    // 添加右侧区间
    for (let i = lastOverlap + 1; i < n; i++) {
        result.push(intervals[i]);
    }

    console.log(`最终结果: ${formatIntervals(result)}`);
    return result;
}

/**
 * 方法四：暴力合并法（教学用）
 *
 * 核心思想：
 * 先插入新区间，然后对整个列表进行排序和合并
 * 虽然不是最优解，但思路简单易懂
 *
 * @param {number[][]} intervals - 原区间列表
 * @param {number[]} newInterval - 要插入的新区间
 * @returns {number[][]} 合并后的区间列表
 * @time O(n log n) 排序复杂度
 * @space O(n)
 */
function insertBruteForce(intervals, newInterval) {
    console.log("\n=== 插入区间（暴力合并法） ===");

    console.log(`原区间列表: ${formatIntervals(intervals)}`);
    console.log(`新区间: [${newInterval.join(', ')}]`);

    // 直接添加新区间
    const allIntervals = [...intervals, newInterval];
    console.log(`添加新区间后: ${formatIntervals(allIntervals)}`);

    // 按起始位置排序
    allIntervals.sort((a, b) => a[0] - b[0]);
    console.log(`排序后: ${formatIntervals(allIntervals)}`);

    // 合并重叠区间
    const result = [];
    for (const interval of allIntervals) {
        if (result.length === 0 || result[result.length - 1][1] < interval[0]) {
            // 无重叠，直接添加
            result.push(interval);
            console.log(`无重叠，添加区间[${interval.join(', ')}]`);
        } else {
            // 有重叠，合并区间
            const last = result[result.length - 1];
            console.log(`合并区间[${last.join(', ')}]和[${interval.join(', ')}]`);
            last[1] = Math.max(last[1], interval[1]);
            console.log(`合并结果: [${last.join(', ')}]`);
        }
    }

    console.log(`最终结果: ${formatIntervals(result)}`);
    return result;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 格式化区间数组为字符串
 * @param {number[][]} intervals - 区间数组
 * @returns {string} 格式化字符串
 */
function formatIntervals(intervals) {
    return '[' + intervals.map(interval => `[${interval.join(',')}]`).join(', ') + ']';
}

/**
 * 检查两个区间是否重叠
 * @param {number[]} interval1 - 区间1
 * @param {number[]} interval2 - 区间2
 * @returns {boolean} 是否重叠
 */
function isOverlapping(interval1, interval2) {
    return interval1[0] <= interval2[1] && interval1[1] >= interval2[0];
}

/**
 * 可视化插入过程
 * @param {number[][]} intervals - 原区间
 * @param {number[]} newInterval - 新区间
 * @param {number[][]} result - 结果区间
 */
function visualizeInsertProcess(intervals, newInterval, result) {
    console.log(`\n=== 插入过程可视化 ===`);

    console.log(`原始状态:`);
    console.log(`区间列表: ${formatIntervals(intervals)}`);
    console.log(`新区间:   [${newInterval.join(', ')}]`);

    console.log(`\n时间轴分析:`);

    // 收集所有时间点
    const timePoints = new Set();
    intervals.forEach(interval => {
        timePoints.add(interval[0]);
        timePoints.add(interval[1]);
    });
    timePoints.add(newInterval[0]);
    timePoints.add(newInterval[1]);

    const sortedTimes = Array.from(timePoints).sort((a, b) => a - b);

    if (sortedTimes.length <= 20) {
        console.log(`时间点: ${sortedTimes.join(' ')}`);

        // 显示原区间覆盖
        console.log(`原区间覆盖:`);
        intervals.forEach((interval, idx) => {
            let line = `区间${idx}: `;
            for (const time of sortedTimes) {
                if (time >= interval[0] && time <= interval[1]) {
                    line += '█';
                } else {
                    line += '─';
                }
            }
            console.log(line + ` [${interval.join(',')}]`);
        });

        // 显示新区间
        let newLine = `新区间: `;
        for (const time of sortedTimes) {
            if (time >= newInterval[0] && time <= newInterval[1]) {
                newLine += '▓';
            } else {
                newLine += '─';
            }
        }
        console.log(newLine + ` [${newInterval.join(',')}]`);

        console.log(`\n合并后结果:`);
        result.forEach((interval, idx) => {
            let line = `结果${idx}: `;
            for (const time of sortedTimes) {
                if (time >= interval[0] && time <= interval[1]) {
                    line += '█';
                } else {
                    line += '─';
                }
            }
            console.log(line + ` [${interval.join(',')}]`);
        });
    }

    console.log(`\n数量统计:`);
    console.log(`原区间数: ${intervals.length}`);
    console.log(`结果区间数: ${result.length}`);
    console.log(`减少区间数: ${intervals.length + 1 - result.length}`);
}

/**
 * 验证所有方法的结果一致性
 * @param {number[][]} intervals - 测试区间
 * @param {number[]} newInterval - 新区间
 * @returns {boolean} 是否一致
 */
function validateMethods(intervals, newInterval) {
    console.log("\n=== 方法结果验证 ===");

    const methods = [
        { name: "线性扫描法", func: insert },
        { name: "三段式处理法", func: insertThreePhase },
        { name: "二分查找优化", func: insertBinarySearch },
        { name: "暴力合并法", func: insertBruteForce }
    ];

    const results = [];

    for (const method of methods) {
        try {
            const result = method.func([...intervals.map(i => [...i])], [...newInterval]);
            results.push(result);
            console.log(`${method.name}: ${formatIntervals(result)}`);
        } catch (error) {
            console.log(`${method.name}: 执行失败 - ${error.message}`);
            results.push(null);
        }
    }

    // 检查结果一致性
    const validResults = results.filter(r => r !== null);
    let isConsistent = true;

    if (validResults.length > 1) {
        for (let i = 1; i < validResults.length; i++) {
            if (JSON.stringify(validResults[i]) !== JSON.stringify(validResults[0])) {
                isConsistent = false;
                break;
            }
        }
    }

    console.log(`结果一致性: ${isConsistent ? '✅ 所有方法结果一致' : '❌ 方法结果不一致'}`);

    return isConsistent;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const testCases = [
        {
            intervals: [[1,3],[6,9]],
            newInterval: [2,5],
            desc: "小规模基础测试"
        },
        {
            intervals: [[1,2],[3,5],[6,7],[8,10],[12,16]],
            newInterval: [4,8],
            desc: "中等规模重叠测试"
        },
        {
            intervals: Array.from({length: 100}, (_, i) => [i*2, i*2+1]),
            newInterval: [50, 150],
            desc: "大规模区间测试"
        },
        {
            intervals: [[1,5]],
            newInterval: [0,0],
            desc: "边界插入测试"
        },
        {
            intervals: [],
            newInterval: [1,5],
            desc: "空区间列表测试"
        }
    ];

    // 只测试高效算法
    const methods = [
        { name: "线性扫描法", func: insert },
        { name: "二分查找优化", func: insertBinarySearch }
    ];

    for (const testCase of testCases) {
        const { intervals, newInterval, desc } = testCase;

        console.log(`\n测试用例: ${desc}`);
        console.log(`区间数量: ${intervals.length}`);

        for (const method of methods) {
            const startTime = performance.now();
            const result = method.func(
                intervals.map(i => [...i]),
                [...newInterval]
            );
            const endTime = performance.now();

            console.log(`${method.name}: ${result.length}个区间 耗时${(endTime - startTime).toFixed(3)}ms`);
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
    console.log("插入区间算法测试");
    console.log("=".repeat(50));

    const testCases = [
        {
            intervals: [[1,3],[6,9]],
            newInterval: [2,5],
            expected: [[1,5],[6,9]],
            description: "基础重叠合并"
        },
        {
            intervals: [[1,2],[3,5],[6,7],[8,10],[12,16]],
            newInterval: [4,8],
            expected: [[1,2],[3,10],[12,16]],
            description: "多区间重叠合并"
        },
        {
            intervals: [],
            newInterval: [5,7],
            expected: [[5,7]],
            description: "空区间列表"
        },
        {
            intervals: [[1,5]],
            newInterval: [2,3],
            expected: [[1,5]],
            description: "新区间被完全包含"
        },
        {
            intervals: [[1,5]],
            newInterval: [0,6],
            expected: [[0,6]],
            description: "新区间完全包含原区间"
        },
        {
            intervals: [[1,5]],
            newInterval: [6,8],
            expected: [[1,5],[6,8]],
            description: "无重叠，右侧插入"
        },
        {
            intervals: [[3,5]],
            newInterval: [1,2],
            expected: [[1,2],[3,5]],
            description: "无重叠，左侧插入"
        },
        {
            intervals: [[1,2],[3,5],[6,7],[8,10]],
            newInterval: [4,9],
            expected: [[1,2],[3,10]],
            description: "跨越多个区间的合并"
        },
        {
            intervals: [[1,4],[5,8]],
            newInterval: [3,6],
            expected: [[1,8]],
            description: "连接两个区间"
        },
        {
            intervals: [[2,3],[4,5],[6,7]],
            newInterval: [1,8],
            expected: [[1,8]],
            description: "新区间覆盖所有原区间"
        }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`${"=".repeat(30)}`);

        const { intervals, newInterval, expected } = testCase;
        console.log(`输入区间: ${formatIntervals(intervals)}`);
        console.log(`新区间: [${newInterval.join(', ')}]`);
        console.log(`期望结果: ${formatIntervals(expected)}`);

        // 验证所有方法
        const isValid = validateMethods(intervals, newInterval);
        console.log(`验证结果: ${isValid ? '✅' : '❌'}`);

        // 单独测试线性扫描法
        const result = insert(intervals.map(i => [...i]), [...newInterval]);
        const isCorrect = JSON.stringify(result) === JSON.stringify(expected);
        console.log(`实际结果: ${formatIntervals(result)}`);
        console.log(`测试通过: ${isCorrect ? '✅' : '❌'}`);
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
    console.log("插入区间算法演示");
    console.log("=".repeat(50));

    console.log("插入区间问题的核心特点:");
    console.log("1. 区间关系判断：重叠、相邻、分离");
    console.log("2. 三阶段处理：左侧、重叠、右侧");
    console.log("3. 合并策略：取最小开始时间和最大结束时间");
    console.log("4. 有序性维护：保持结果区间按开始时间排序");

    const demoIntervals = [[1,3],[6,9]];
    const demoNewInterval = [2,5];
    console.log(`\n演示区间: ${formatIntervals(demoIntervals)}`);
    console.log(`新区间: [${demoNewInterval.join(', ')}]`);

    console.log("\n算法方法对比:");
    console.log("1. 线性扫描：最直观，O(n)时间复杂度");
    console.log("2. 三段式处理：逻辑清晰，便于理解");
    console.log("3. 二分查找：大规模优化，O(log n + k)");
    console.log("4. 暴力合并：简单直接，O(n log n)");

    console.log("\n详细演示 - 线性扫描法:");
    const result = insert(demoIntervals, demoNewInterval);

    console.log("\n算法应用场景:");
    console.log("- 日程安排系统的时间槽合并");
    console.log("- 会议室预订的冲突解决");
    console.log("- 资源占用时间段的整合");
    console.log("- 网络流量监控的时间窗口合并");
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
    console.log("1. 区间重叠判断：interval1[0] <= interval2[1] && interval1[1] >= interval2[0]");
    console.log("2. 区间合并策略：[min(start1, start2), max(end1, end2)]");
    console.log("3. 三阶段处理：左侧无重叠、重叠合并、右侧无重叠");
    console.log("4. 有序性维护：输入有序，输出也要有序");

    console.log("\n🔧 实现技巧:");
    console.log("1. 线性扫描：一次遍历，分阶段处理");
    console.log("2. 边界条件：空列表、单区间、完全包含等");
    console.log("3. 区间关系：before, overlap, after 三种情况");
    console.log("4. 优化策略：二分查找定位，减少扫描范围");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 重叠判断条件写错（边界值处理）");
    console.log("2. 忘记处理新区间被完全包含的情况");
    console.log("3. 结果顺序错乱（没有维护有序性）");
    console.log("4. 边界情况遗漏（空列表、单区间等）");
    console.log("5. 区间复制问题（修改了原数组）");

    console.log("\n🎨 变体问题:");
    console.log("1. 合并区间（LeetCode 56）");
    console.log("2. 无重叠区间（LeetCode 435）");
    console.log("3. 用最少数量的箭引爆气球（LeetCode 452）");
    console.log("4. 会议室安排（LeetCode 253）");
    console.log("5. 员工空闲时间（LeetCode 759）");

    console.log("\n📊 复杂度分析:");
    console.log("时间复杂度:");
    console.log("- 线性扫描: O(n) 一次遍历");
    console.log("- 二分查找: O(log n + k) k为重叠区间数");
    console.log("- 暴力合并: O(n log n) 排序成本");

    console.log("\n空间复杂度:");
    console.log("- 所有方法: O(n) 存储结果区间");
    console.log("- 优化版本: O(1) 如果可以修改原数组");

    console.log("\n💡 面试技巧:");
    console.log("1. 先明确区间重叠的判断条件");
    console.log("2. 画图演示三阶段处理过程");
    console.log("3. 讨论各种边界情况和特殊输入");
    console.log("4. 提及时间复杂度优化方案");
    console.log("5. 可以扩展到其他区间问题");

    console.log("\n🔍 相关概念:");
    console.log("1. 区间调度问题的贪心策略");
    console.log("2. 扫描线算法在区间问题中的应用");
    console.log("3. 二分查找在有序数据中的定位");
    console.log("4. 时间复杂度在不同数据规模下的权衡");

    console.log("\n🌟 实际应用:");
    console.log("1. 日程管理系统的时间槽整合");
    console.log("2. 网络资源的时间分配优化");
    console.log("3. 生产线任务的时间安排");
    console.log("4. 数据库查询的时间窗口合并");
    console.log("5. 系统监控的事件时间段聚合");

    console.log("\n📋 区间问题解题模板:");
    console.log("```javascript");
    console.log("function insertInterval(intervals, newInterval) {");
    console.log("    const result = [];");
    console.log("    let i = 0;");
    console.log("    ");
    console.log("    // 阶段1：添加左侧无重叠区间");
    console.log("    while (i < intervals.length && intervals[i][1] < newInterval[0]) {");
    console.log("        result.push(intervals[i++]);");
    console.log("    }");
    console.log("    ");
    console.log("    // 阶段2：合并重叠区间");
    console.log("    while (i < intervals.length && intervals[i][0] <= newInterval[1]) {");
    console.log("        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);");
    console.log("        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);");
    console.log("        i++;");
    console.log("    }");
    console.log("    result.push(newInterval);");
    console.log("    ");
    console.log("    // 阶段3：添加右侧无重叠区间");
    console.log("    while (i < intervals.length) {");
    console.log("        result.push(intervals[i++]);");
    console.log("    }");
    console.log("    ");
    console.log("    return result;");
    console.log("}");
    console.log("```");

    console.log("\n🚀 区间重叠判断要点:");
    console.log("1. 两个区间[a,b]和[c,d]重叠当且仅当：a <= d && b >= c");
    console.log("2. 合并重叠区间：[min(a,c), max(b,d)]");
    console.log("3. 区间关系：before(b < c), overlap(a <= d && b >= c), after(a > d)");
    console.log("4. 边界处理：相邻区间[1,2]和[3,4]不重叠，[1,3]和[3,4]重叠");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        insert,
        insertThreePhase,
        insertBinarySearch,
        insertBruteForce,
        formatIntervals,
        isOverlapping,
        visualizeInsertProcess,
        validateMethods,
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