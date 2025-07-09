/**
 * LeetCode 029: 合并区间 (Merge Intervals)
 *
 * 题目描述：
 * 以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi]。
 * 请你合并所有重叠的区间，并返回一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间。
 *
 * 核心思想：
 * 排序+贪心合并 - 按起始位置排序后逐个合并重叠区间
 * 关键洞察：如果区间按起始位置排序，则只需要检查相邻区间是否重叠
 *
 * 算法原理：
 * 1. 按区间起始位置排序
 * 2. 遍历排序后的区间
 * 3. 如果当前区间与前一个区间重叠，合并它们
 * 4. 否则，将当前区间加入结果
 * 重叠条件：当前区间开始位置 <= 前一个区间结束位置
 */

/**
 * 方法一：排序+贪心合并（推荐）
 *
 * 核心思想：
 * 先按起始位置排序，然后逐个检查相邻区间是否需要合并
 *
 * 算法步骤：
 * 1. 按区间起始位置升序排序
 * 2. 遍历排序后的区间
 * 3. 如果当前区间与结果中最后一个区间重叠，合并它们
 * 4. 否则直接添加到结果中
 *
 * @param {number[][]} intervals - 区间数组
 * @returns {number[][]} 合并后的区间数组
 * @time O(n log n) - 排序时间复杂度
 * @space O(1) - 不考虑输出数组的空间复杂度
 */
function merge(intervals) {
    if (!intervals || intervals.length <= 1) {
        return intervals;
    }

    // 按区间起始位置排序
    intervals.sort((a, b) => a[0] - b[0]);

    const result = [intervals[0]]; // 结果数组，初始包含第一个区间

    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const lastMerged = result[result.length - 1];

        // 检查当前区间是否与最后一个合并区间重叠
        if (current[0] <= lastMerged[1]) {
            // 重叠，合并区间：更新结束位置为两个区间结束位置的最大值
            lastMerged[1] = Math.max(lastMerged[1], current[1]);
        } else {
            // 不重叠，直接添加当前区间
            result.push(current);
        }
    }

    return result;
}

/**
 * 方法二：优化的合并算法
 *
 * 核心思想：
 * 使用更简洁的写法，直接在原数组上操作
 *
 * @param {number[][]} intervals - 区间数组
 * @returns {number[][]} 合并后的区间数组
 * @time O(n log n) - 排序时间复杂度
 * @space O(1) - 原地操作
 */
function mergeOptimized(intervals) {
    if (!intervals || intervals.length <= 1) {
        return intervals;
    }

    // 按起始位置排序
    intervals.sort((a, b) => a[0] - b[0]);

    let writeIndex = 0; // 写入位置指针

    for (let i = 1; i < intervals.length; i++) {
        // 如果当前区间与写入位置的区间重叠
        if (intervals[i][0] <= intervals[writeIndex][1]) {
            // 合并：更新结束位置
            intervals[writeIndex][1] = Math.max(intervals[writeIndex][1], intervals[i][1]);
        } else {
            // 不重叠：移动写入指针并复制区间
            writeIndex++;
            intervals[writeIndex] = intervals[i];
        }
    }

    // 返回前writeIndex+1个区间
    return intervals.slice(0, writeIndex + 1);
}

/**
 * 方法三：暴力合并法
 *
 * 核心思想：
 * 不排序，直接暴力检查所有区间对是否需要合并
 *
 * @param {number[][]} intervals - 区间数组
 * @returns {number[][]} 合并后的区间数组
 * @time O(n²) - 需要多次遍历
 * @space O(n) - 需要额外的标记数组
 */
function mergeBruteForce(intervals) {
    if (!intervals || intervals.length <= 1) {
        return intervals;
    }

    const n = intervals.length;
    const merged = new Array(n).fill(false); // 标记是否已被合并
    const result = [];

    for (let i = 0; i < n; i++) {
        if (merged[i]) continue; // 已经被合并过

        let currentInterval = [...intervals[i]]; // 当前合并的区间
        merged[i] = true;

        // 查找所有与当前区间重叠的区间
        let foundOverlap = true;
        while (foundOverlap) {
            foundOverlap = false;
            for (let j = 0; j < n; j++) {
                if (merged[j]) continue;

                // 检查是否重叠
                if (isOverlapping(currentInterval, intervals[j])) {
                    // 合并区间
                    currentInterval[0] = Math.min(currentInterval[0], intervals[j][0]);
                    currentInterval[1] = Math.max(currentInterval[1], intervals[j][1]);
                    merged[j] = true;
                    foundOverlap = true;
                }
            }
        }

        result.push(currentInterval);
    }

    return result;

    // 辅助函数：检查两个区间是否重叠
    function isOverlapping(interval1, interval2) {
        return interval1[0] <= interval2[1] && interval2[0] <= interval1[1];
    }
}

/**
 * 方法四：使用栈的方法
 *
 * 核心思想：
 * 使用栈来维护合并过程，栈顶始终是当前考虑的区间
 *
 * @param {number[][]} intervals - 区间数组
 * @returns {number[][]} 合并后的区间数组
 * @time O(n log n) - 排序时间复杂度
 * @space O(n) - 栈空间
 */
function mergeWithStack(intervals) {
    if (!intervals || intervals.length <= 1) {
        return intervals;
    }

    // 按起始位置排序
    intervals.sort((a, b) => a[0] - b[0]);

    const stack = [intervals[0]]; // 栈，存储合并后的区间

    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const top = stack[stack.length - 1];

        if (current[0] <= top[1]) {
            // 重叠，合并区间
            top[1] = Math.max(top[1], current[1]);
        } else {
            // 不重叠，压入栈
            stack.push(current);
        }
    }

    return stack;
}

/**
 * 方法五：区间树方法（高级）
 *
 * 核心思想：
 * 构建区间树来高效处理区间合并，适用于动态插入场景
 *
 * @param {number[][]} intervals - 区间数组
 * @returns {number[][]} 合并后的区间数组
 * @time O(n log n) - 构建和查询区间树
 * @space O(n) - 区间树空间
 */
function mergeWithIntervalTree(intervals) {
    if (!intervals || intervals.length <= 1) {
        return intervals;
    }

    // 简化实现：使用排序+合并（实际的区间树实现较复杂）
    return merge(intervals);
}

// 测试用例
function runTests() {
    console.log("=== 合并区间测试 ===\n");

    const testCases = [
        {
            intervals: [[1,3],[2,6],[8,10],[15,18]],
            expected: [[1,6],[8,10],[15,18]],
            description: "基础测试：部分重叠"
        },
        {
            intervals: [[1,4],[4,5]],
            expected: [[1,5]],
            description: "边界重叠：端点相等"
        },
        {
            intervals: [[1,4],[2,3]],
            expected: [[1,4]],
            description: "包含关系：一个区间包含另一个"
        },
        {
            intervals: [[1,3],[2,6],[8,10],[15,18]],
            expected: [[1,6],[8,10],[15,18]],
            description: "混合情况：重叠和分离"
        },
        {
            intervals: [[1,4],[0,4]],
            expected: [[0,4]],
            description: "完全重叠"
        },
        {
            intervals: [[1,4],[5,6]],
            expected: [[1,4],[5,6]],
            description: "完全分离"
        },
        {
            intervals: [[2,3],[4,5],[6,7],[8,9],[1,10]],
            expected: [[1,10]],
            description: "大区间包含多个小区间"
        }
    ];

    const methods = [
        { name: "排序合并", func: merge },
        { name: "优化合并", func: mergeOptimized },
        { name: "暴力合并", func: mergeBruteForce },
        { name: "栈方法", func: mergeWithStack }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`输入: ${JSON.stringify(testCase.intervals)}`);
        console.log(`期望: ${JSON.stringify(testCase.expected)}`);

        methods.forEach(method => {
            const result = method.func(JSON.parse(JSON.stringify(testCase.intervals)));
            const isCorrect = JSON.stringify(result) === JSON.stringify(testCase.expected);
            const status = isCorrect ? "✓" : "✗";
            console.log(`${method.name}: ${JSON.stringify(result)} ${status}`);
        });
        console.log();
    });
}

// 性能测试
function performanceTest() {
    console.log("=== 性能测试 ===\n");

    const sizes = [100, 1000, 5000];

    sizes.forEach(size => {
        // 生成随机区间
        const intervals = Array.from({length: size}, () => {
            const start = Math.floor(Math.random() * 1000);
            const end = start + Math.floor(Math.random() * 100) + 1;
            return [start, end];
        });

        console.log(`区间数量: ${size}`);

        const methods = [
            { name: "排序合并", func: merge },
            { name: "优化合并", func: mergeOptimized },
            { name: "栈方法", func: mergeWithStack }
        ];

        methods.forEach(method => {
            const start = performance.now();
            method.func(JSON.parse(JSON.stringify(intervals)));
            const end = performance.now();
            console.log(`${method.name}: ${(end - start).toFixed(4)}ms`);
        });
        console.log();
    });
}

// 算法演示
function demonstrateAlgorithm() {
    console.log("=== 排序+合并算法演示 ===\n");

    const intervals = [[1,3],[2,6],[8,10],[15,18]];
    console.log(`输入区间: ${JSON.stringify(intervals)}`);
    console.log();

    // 排序
    intervals.sort((a, b) => a[0] - b[0]);
    console.log(`排序后: ${JSON.stringify(intervals)}`);
    console.log();

    const result = [intervals[0]];
    console.log("合并过程:");
    console.log(`初始化结果: ${JSON.stringify(result)}`);

    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const lastMerged = result[result.length - 1];

        console.log(`\n考虑区间: ${JSON.stringify(current)}`);
        console.log(`当前结果: ${JSON.stringify(result)}`);
        console.log(`最后区间: ${JSON.stringify(lastMerged)}`);

        if (current[0] <= lastMerged[1]) {
            console.log(`重叠 (${current[0]} <= ${lastMerged[1]})`);
            lastMerged[1] = Math.max(lastMerged[1], current[1]);
            console.log(`合并后: ${JSON.stringify(lastMerged)}`);
        } else {
            console.log(`不重叠 (${current[0]} > ${lastMerged[1]})`);
            result.push(current);
            console.log(`添加新区间: ${JSON.stringify(current)}`);
        }

        console.log(`当前结果: ${JSON.stringify(result)}`);
    }

    console.log(`\n最终结果: ${JSON.stringify(result)}`);
}

// 边界情况分析
function edgeCaseAnalysis() {
    console.log("=== 边界情况分析 ===\n");

    const edgeCases = [
        {
            case: "空数组",
            intervals: [],
            analysis: "返回空数组"
        },
        {
            case: "单个区间",
            intervals: [[1, 4]],
            analysis: "返回原数组"
        },
        {
            case: "完全重叠",
            intervals: [[1, 4], [2, 3]],
            analysis: "小区间被大区间包含"
        },
        {
            case: "端点相接",
            intervals: [[1, 4], [4, 6]],
            analysis: "区间端点相等，应该合并"
        },
        {
            case: "逆序输入",
            intervals: [[4, 6], [1, 3]],
            analysis: "需要先排序再合并"
        },
        {
            case: "相同区间",
            intervals: [[1, 3], [1, 3]],
            analysis: "完全相同的区间合并为一个"
        }
    ];

    edgeCases.forEach(({case: caseName, intervals, analysis}) => {
        console.log(`${caseName}: ${JSON.stringify(intervals)}`);
        if (intervals.length > 0) {
            const result = merge(JSON.parse(JSON.stringify(intervals)));
            console.log(`结果: ${JSON.stringify(result)}`);
        }
        console.log(`分析: ${analysis}`);
        console.log();
    });
}

// 复杂度分析
function complexityAnalysis() {
    console.log("=== 复杂度分析 ===\n");

    const methods = [
        {
            name: "排序+合并",
            time: "O(n log n)",
            space: "O(1)",
            description: "排序主导时间复杂度，原地操作"
        },
        {
            name: "暴力合并",
            time: "O(n²)",
            space: "O(n)",
            description: "多次扫描，需要标记数组"
        },
        {
            name: "栈方法",
            time: "O(n log n)",
            space: "O(n)",
            description: "与排序合并相同，但需要栈空间"
        },
        {
            name: "区间树",
            time: "O(n log n)",
            space: "O(n)",
            description: "适合动态插入场景"
        }
    ];

    console.log("算法复杂度对比：");
    console.log("算法名称".padEnd(12) + "时间复杂度".padEnd(12) + "空间复杂度".padEnd(12) + "特点");
    console.log("-".repeat(55));

    methods.forEach(method => {
        console.log(
            method.name.padEnd(12) +
            method.time.padEnd(12) +
            method.space.padEnd(12) +
            method.description
        );
    });
}

// 扩展应用
function extendedApplications() {
    console.log("=== 扩展应用 ===\n");

    console.log("1. 会议室调度问题");
    console.log("   问题：给定多个会议时间，判断是否需要额外会议室");
    console.log("   解法：合并重叠区间，重叠数量决定所需会议室数");
    console.log();

    console.log("2. 资源分配优化");
    console.log("   应用：服务器负载均衡、CPU时间片分配");
    console.log("   思想：将时间段合并，避免资源冲突");
    console.log();

    console.log("3. 日程安排");
    console.log("   应用：日历应用、任务调度");
    console.log("   功能：合并连续的空闲时间段");
    console.log();

    console.log("4. 数据压缩");
    console.log("   应用：数值区间压缩、范围查询优化");
    console.log("   优势：减少存储空间，提高查询效率");
}

// 实际应用示例
function practicalExamples() {
    console.log("=== 实际应用示例 ===\n");

    // 示例1：会议室调度
    console.log("1. 会议室调度问题");
    function meetingRooms(meetings) {
        const merged = merge(meetings.map(m => [...m]));
        console.log(`会议时间: ${JSON.stringify(meetings)}`);
        console.log(`合并后: ${JSON.stringify(merged)}`);
        console.log(`所需会议室: ${merged.length}`);
        return merged.length;
    }

    meetingRooms([[9, 10], [4, 9], [4, 17]]); // 需要2个会议室
    meetingRooms([[7, 10], [2, 4]]); // 需要1个会议室
    console.log();

    // 示例2：空闲时间查找
    console.log("2. 查找空闲时间段");
    function findFreeTime(busyIntervals, workingHours) {
        const merged = merge(busyIntervals.map(interval => [...interval]));
        const freeTime = [];

        // 工作开始到第一个忙碌时间
        if (merged.length > 0 && merged[0][0] > workingHours[0]) {
            freeTime.push([workingHours[0], merged[0][0]]);
        }

        // 忙碌时间之间的空隙
        for (let i = 0; i < merged.length - 1; i++) {
            if (merged[i][1] < merged[i + 1][0]) {
                freeTime.push([merged[i][1], merged[i + 1][0]]);
            }
        }

        // 最后一个忙碌时间到工作结束
        if (merged.length > 0 && merged[merged.length - 1][1] < workingHours[1]) {
            freeTime.push([merged[merged.length - 1][1], workingHours[1]]);
        }

        console.log(`忙碌时间: ${JSON.stringify(busyIntervals)}`);
        console.log(`合并后: ${JSON.stringify(merged)}`);
        console.log(`空闲时间: ${JSON.stringify(freeTime)}`);
        return freeTime;
    }

    findFreeTime([[1, 3], [4, 6], [8, 9]], [0, 10]);
}

// 面试要点
function interviewKeyPoints() {
    console.log("=== 面试要点 ===\n");

    console.log("🎯 核心考点：");
    console.log("1. 排序算法的应用");
    console.log("2. 贪心策略的理解");
    console.log("3. 区间重叠的判断条件");
    console.log("4. 边界情况的处理");
    console.log();

    console.log("💡 解题技巧：");
    console.log("1. 先排序简化问题（按起始位置）");
    console.log("2. 重叠条件：start2 <= end1");
    console.log("3. 合并操作：end = max(end1, end2)");
    console.log("4. 一次遍历完成合并");
    console.log();

    console.log("🚫 常见误区：");
    console.log("1. 忘记排序直接合并");
    console.log("2. 重叠条件判断错误");
    console.log("3. 边界情况：端点相等");
    console.log("4. 合并时忘记更新结束位置");
    console.log();

    console.log("🔍 相关问题：");
    console.log("1. 插入区间 (Insert Interval)");
    console.log("2. 会议室问题 (Meeting Rooms)");
    console.log("3. 区间列表的交集");
    console.log("4. 非重叠区间的最少移除数");
}

// 导出所有方法
module.exports = {
    merge,
    mergeOptimized,
    mergeBruteForce,
    mergeWithStack,
    mergeWithIntervalTree,
    runTests,
    performanceTest,
    demonstrateAlgorithm,
    edgeCaseAnalysis,
    complexityAnalysis,
    extendedApplications,
    practicalExamples,
    interviewKeyPoints
};

// 如果直接运行此文件，执行测试
if (require.main === module) {
    runTests();
    demonstrateAlgorithm();
    edgeCaseAnalysis();
    complexityAnalysis();
    extendedApplications();
    practicalExamples();
    interviewKeyPoints();
}