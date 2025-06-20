/**
 * 第14章 贪心算法 - 练习题解答
 *
 * 本文件包含：
 * 1. 跳跃游戏II
 * 2. 重构字符串
 * 3. 分发饼干
 * 4. 任务调度器
 * 5. 会议室II
 *
 * 作者：数据结构与算法教程
 * 日期：2024年
 */

// ==================== 1. 跳跃游戏II ====================

/**
 * 跳跃游戏II - 最少跳跃次数
 *
 * 核心思想：
 * 使用贪心策略，在当前跳跃范围内寻找能跳跃到最远位置的点
 * 将问题转化为区间覆盖问题：每次跳跃都要选择能覆盖最远距离的点
 *
 * 算法步骤：
 * 1. 维护当前跳跃边界和在当前范围内能到达的最远位置
 * 2. 遍历数组，更新最远可达位置
 * 3. 一旦到达当前边界，必须进行下一次跳跃
 * 4. 更新边界为当前记录的最远位置
 *
 * @param {number[]} nums - 跳跃数组
 * @returns {number} 最少跳跃次数
 * @time O(n)
 * @space O(1)
 */
function jump(nums) {
    if (nums.length <= 1) return 0;

    let jumps = 0;       // 跳跃次数
    let currentEnd = 0;  // 当前跳跃能到达的边界
    let farthest = 0;    // 在当前范围内能到达的最远位置

    // 注意：循环到length-1，因为到达最后位置就结束了
    for (let i = 0; i < nums.length - 1; i++) {
        // 更新在当前范围内能到达的最远位置
        farthest = Math.max(farthest, i + nums[i]);

        // 到达当前跳跃的边界，必须进行下一次跳跃
        if (i === currentEnd) {
            jumps++;
            currentEnd = farthest;

            // 如果已经能到达最后位置，可以提前结束
            if (currentEnd >= nums.length - 1) {
                break;
            }
        }
    }

    return jumps;
}

/**
 * 跳跃游戏II - 返回跳跃路径的版本
 *
 * @param {number[]} nums - 跳跃数组
 * @returns {Object} {jumps, path} 跳跃次数和路径
 */
function jumpWithPath(nums) {
    if (nums.length <= 1) return { jumps: 0, path: [0] };

    let jumps = 0;
    let currentEnd = 0;
    let farthest = 0;
    const path = [0];

    for (let i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);

        if (i === currentEnd) {
            jumps++;
            currentEnd = farthest;
            path.push(farthest); // 记录跳跃到的位置

            if (currentEnd >= nums.length - 1) {
                path[path.length - 1] = nums.length - 1; // 修正为最终位置
                break;
            }
        }
    }

    return { jumps, path };
}

/**
 * 跳跃游戏II - 动态规划解法（用于对比）
 *
 * @param {number[]} nums - 跳跃数组
 * @returns {number} 最少跳跃次数
 * @time O(n²)
 * @space O(n)
 */
function jumpDP(nums) {
    const n = nums.length;
    const dp = Array(n).fill(Infinity);
    dp[0] = 0;

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j <= Math.min(i + nums[i], n - 1); j++) {
            dp[j] = Math.min(dp[j], dp[i] + 1);
        }
    }

    return dp[n - 1];
}

// ==================== 2. 重构字符串 ====================

/**
 * 重构字符串 - 使相邻字符不同
 *
 * 核心思想：
 * 优先安排出现频率最高的字符，使用间隔放置策略
 * 如果最高频率字符数量超过(n+1)/2，则无法重构
 *
 * 算法步骤：
 * 1. 统计字符频率，找出频率最高的字符
 * 2. 检查可行性：maxFreq <= (n+1)/2
 * 3. 先在偶数位置放置频率最高的字符
 * 4. 然后在剩余位置放置其他字符
 *
 * @param {string} s - 输入字符串
 * @returns {string} 重构后的字符串，不可能则返回""
 * @time O(n)
 * @space O(1) 字符集大小固定
 */
function reorganizeString(s) {
    // 统计字符频率
    const freq = {};
    let maxFreq = 0;
    let maxChar = '';

    for (let char of s) {
        freq[char] = (freq[char] || 0) + 1;
        if (freq[char] > maxFreq) {
            maxFreq = freq[char];
            maxChar = char;
        }
    }

    // 检查可行性
    if (maxFreq > Math.ceil(s.length / 2)) {
        return '';
    }

    const result = Array(s.length);
    let index = 0;

    // 先放置频率最高的字符（间隔放置）
    while (freq[maxChar] > 0) {
        result[index] = maxChar;
        index += 2;
        freq[maxChar]--;
    }

    // 放置其他字符
    for (let char in freq) {
        while (freq[char] > 0) {
            if (index >= s.length) {
                index = 1; // 切换到奇数位置
            }
            result[index] = char;
            index += 2;
            freq[char]--;
        }
    }

    return result.join('');
}

/**
 * 重构字符串 - 使用优先队列的版本
 *
 * @param {string} s - 输入字符串
 * @returns {string} 重构后的字符串
 */
function reorganizeStringPQ(s) {
    // 统计频率
    const freq = {};
    for (let char of s) {
        freq[char] = (freq[char] || 0) + 1;
    }

    // 转换为数组并按频率排序（模拟优先队列）
    const pq = Object.entries(freq).sort((a, b) => b[1] - a[1]);

    // 检查可行性
    if (pq[0][1] > Math.ceil(s.length / 2)) {
        return '';
    }

    const result = [];

    while (pq.length > 0) {
        // 取出频率最高的两个字符
        const first = pq.shift();
        const second = pq.length > 0 ? pq.shift() : null;

        // 添加第一个字符
        result.push(first[0]);
        first[1]--;

        // 添加第二个字符（如果存在）
        if (second) {
            result.push(second[0]);
            second[1]--;

            // 如果还有剩余，重新插入队列
            if (second[1] > 0) {
                pq.push(second);
            }
        }

        // 如果第一个字符还有剩余，重新插入队列
        if (first[1] > 0) {
            pq.push(first);
        }

        // 重新排序（实际应用中用堆优化）
        pq.sort((a, b) => b[1] - a[1]);
    }

    return result.join('');
}

/**
 * 检查重构字符串的有效性
 *
 * @param {string} s - 重构后的字符串
 * @returns {boolean} 是否有效
 */
function isValidReorganization(s) {
    for (let i = 1; i < s.length; i++) {
        if (s[i] === s[i - 1]) {
            return false;
        }
    }
    return true;
}

// ==================== 3. 分发饼干 ====================

/**
 * 分发饼干 - 最大化满足的孩子数量
 *
 * 核心思想：
 * 用最小的能满足需求的饼干去满足胃口最小的孩子
 * 这样能够最大化满足的孩子数量
 *
 * 算法步骤：
 * 1. 将孩子胃口值和饼干尺寸都排序
 * 2. 使用双指针，贪心地分配饼干
 * 3. 如果当前饼干能满足当前孩子，两指针都前进
 * 4. 否则，只移动饼干指针寻找更大的饼干
 *
 * @param {number[]} g - 孩子胃口值数组
 * @param {number[]} s - 饼干尺寸数组
 * @returns {number} 最多满足的孩子数量
 * @time O(n log n + m log m)
 * @space O(1)
 */
function findContentChildren(g, s) {
    // 排序：贪心策略的基础
    g.sort((a, b) => a - b); // 孩子胃口值升序
    s.sort((a, b) => a - b); // 饼干尺寸升序

    let child = 0;   // 孩子指针
    let cookie = 0;  // 饼干指针
    let satisfied = 0; // 满足的孩子数量

    // 双指针贪心分配
    while (child < g.length && cookie < s.length) {
        // 如果当前饼干能满足当前孩子
        if (s[cookie] >= g[child]) {
            satisfied++;
            child++;
        }
        cookie++;
    }

    return satisfied;
}

/**
 * 分发饼干 - 返回详细分配方案
 *
 * @param {number[]} g - 孩子胃口值数组
 * @param {number[]} s - 饼干尺寸数组
 * @returns {Object} 分配详情
 */
function findContentChildrenDetailed(g, s) {
    // 保存原始索引
    const children = g.map((appetite, index) => ({ appetite, originalIndex: index }))
                      .sort((a, b) => a.appetite - b.appetite);
    const cookies = s.map((size, index) => ({ size, originalIndex: index }))
                     .sort((a, b) => a.size - b.size);

    let child = 0;
    let cookie = 0;
    const assignments = []; // 分配记录

    while (child < children.length && cookie < cookies.length) {
        if (cookies[cookie].size >= children[child].appetite) {
            assignments.push({
                childIndex: children[child].originalIndex,
                childAppetite: children[child].appetite,
                cookieIndex: cookies[cookie].originalIndex,
                cookieSize: cookies[cookie].size
            });
            child++;
        }
        cookie++;
    }

    return {
        satisfiedCount: assignments.length,
        assignments: assignments,
        unsatisfiedChildren: children.slice(child).map(c => c.originalIndex)
    };
}

/**
 * 分发饼干 - 优化版本（先满足胃口大的孩子）
 *
 * @param {number[]} g - 孩子胃口值数组
 * @param {number[]} s - 饼干尺寸数组
 * @returns {number} 最多满足的孩子数量
 */
function findContentChildrenReverse(g, s) {
    // 降序排序：先满足胃口大的孩子
    g.sort((a, b) => b - a);
    s.sort((a, b) => b - a);

    let child = 0;
    let cookie = 0;
    let satisfied = 0;

    while (child < g.length && cookie < s.length) {
        if (s[cookie] >= g[child]) {
            satisfied++;
            child++;
            cookie++;
        } else {
            child++;
        }
    }

    return satisfied;
}

// ==================== 4. 任务调度器 ====================

/**
 * 任务调度器 - 最少执行时间
 *
 * 核心思想：
 * 以出现频率最高的任务为基准构建时间框架
 * 其他任务填充到空闲时间片中
 *
 * 算法步骤：
 * 1. 统计任务频率，找出最高频率maxFreq
 * 2. 计算有多少任务具有最高频率maxCount
 * 3. 构建时间框架：(maxFreq-1)个间隔，每个间隔n个时间片
 * 4. 计算空闲时间片数量和需要的总时间
 *
 * @param {string[]} tasks - 任务数组
 * @param {number} n - 冷却时间
 * @returns {number} 最少执行时间
 * @time O(m) m是任务总数
 * @space O(1) 字符集大小固定
 */
function leastInterval(tasks, n) {
    // 统计任务频率
    const freq = {};
    for (let task of tasks) {
        freq[task] = (freq[task] || 0) + 1;
    }

    // 找到最高频率
    const maxFreq = Math.max(...Object.values(freq));

    // 计算有多少个任务具有最高频率
    let maxCount = 0;
    for (let f of Object.values(freq)) {
        if (f === maxFreq) maxCount++;
    }

    // 计算最少时间
    // 基本框架：将最高频率的任务作为支柱
    const partCount = maxFreq - 1;          // 间隔数量
    const partLength = n - (maxCount - 1);  // 每个间隔的长度
    const emptySlots = partCount * partLength; // 总空闲时间片
    const availableTasks = tasks.length - maxFreq * maxCount; // 可填充的任务数
    const idles = Math.max(0, emptySlots - availableTasks); // 实际空闲时间

    return tasks.length + idles;
}

/**
 * 任务调度器 - 返回具体执行序列
 *
 * @param {string[]} tasks - 任务数组
 * @param {number} n - 冷却时间
 * @returns {string[]} 执行序列
 */
function leastIntervalWithSequence(tasks, n) {
    // 统计频率
    const freq = {};
    for (let task of tasks) {
        freq[task] = (freq[task] || 0) + 1;
    }

    // 转换为数组并排序
    const taskList = Object.entries(freq).sort((a, b) => b[1] - a[1]);

    const result = [];
    const lastUsed = {}; // 记录每个任务上次使用的时间

    while (taskList.some(([task, count]) => count > 0)) {
        let executed = false;

        // 尝试执行一个可用的任务
        for (let i = 0; i < taskList.length; i++) {
            const [task, count] = taskList[i];

            if (count > 0) {
                const lastTime = lastUsed[task] || -Infinity;

                // 检查冷却时间
                if (result.length - lastTime > n) {
                    result.push(task);
                    lastUsed[task] = result.length - 1;
                    taskList[i][1]--;
                    executed = true;
                    break;
                }
            }
        }

        // 如果没有可执行的任务，添加空闲时间
        if (!executed) {
            result.push('idle');
        }

        // 重新排序（按剩余频率）
        taskList.sort((a, b) => b[1] - a[1]);
    }

    return result;
}

/**
 * 任务调度器 - 使用优先队列的模拟版本
 *
 * @param {string[]} tasks - 任务数组
 * @param {number} n - 冷却时间
 * @returns {number} 最少执行时间
 */
function leastIntervalSimulation(tasks, n) {
    const freq = {};
    for (let task of tasks) {
        freq[task] = (freq[task] || 0) + 1;
    }

    // 优先队列（按频率排序）
    const pq = Object.values(freq).sort((a, b) => b - a);
    let time = 0;

    while (pq.length > 0) {
        const temp = [];
        let cycle = n + 1; // 一个完整的冷却周期

        // 在一个周期内尽可能执行任务
        while (cycle > 0 && pq.length > 0) {
            const freq = pq.shift();
            temp.push(freq - 1);
            cycle--;
            time++;
        }

        // 将还有剩余的任务重新加入队列
        for (let f of temp) {
            if (f > 0) pq.push(f);
        }

        // 重新排序
        pq.sort((a, b) => b - a);

        // 如果还有任务但当前周期没用完，需要等待
        if (pq.length > 0 && cycle > 0) {
            time += cycle;
        }
    }

    return time;
}

// ==================== 5. 会议室II ====================

/**
 * 会议室II - 最少会议室数量
 *
 * 核心思想：
 * 使用事件排序算法，将会议开始和结束看作事件
 * 开始事件需要会议室+1，结束事件释放会议室-1
 *
 * 算法步骤：
 * 1. 将所有开始时间和结束时间转换为事件
 * 2. 按时间排序，相同时间先处理结束事件
 * 3. 扫描所有事件，维护当前使用的会议室数量
 * 4. 记录过程中的最大会议室数量
 *
 * @param {number[][]} intervals - 会议时间区间数组
 * @returns {number} 最少会议室数量
 * @time O(n log n)
 * @space O(n)
 */
function minMeetingRooms(intervals) {
    if (intervals.length === 0) return 0;

    const events = [];

    // 创建事件：开始事件+1，结束事件-1
    for (let [start, end] of intervals) {
        events.push([start, 1]);   // 会议开始
        events.push([end, -1]);    // 会议结束
    }

    // 按时间排序，相同时间先处理结束事件
    events.sort((a, b) => {
        if (a[0] === b[0]) return a[1] - b[1];
        return a[0] - b[0];
    });

    let currentRooms = 0;
    let maxRooms = 0;

    // 扫描所有事件
    for (let [time, change] of events) {
        currentRooms += change;
        maxRooms = Math.max(maxRooms, currentRooms);
    }

    return maxRooms;
}

/**
 * 会议室II - 使用堆的版本
 *
 * @param {number[][]} intervals - 会议时间区间数组
 * @returns {number} 最少会议室数量
 */
function minMeetingRoomsHeap(intervals) {
    if (intervals.length === 0) return 0;

    // 按开始时间排序
    intervals.sort((a, b) => a[0] - b[0]);

    // 最小堆，存储会议室的结束时间
    const endTimes = [];

    for (let [start, end] of intervals) {
        // 如果有会议室已经空闲（最早结束时间 <= 当前开始时间）
        if (endTimes.length > 0 && endTimes[0] <= start) {
            // 移除最早结束的会议室
            endTimes.shift();
        }

        // 分配会议室（添加结束时间）
        endTimes.push(end);

        // 保持最小堆性质
        endTimes.sort((a, b) => a - b);
    }

    return endTimes.length;
}

/**
 * 会议室II - 返回详细的房间分配方案
 *
 * @param {number[][]} intervals - 会议时间区间数组
 * @returns {Object} 房间分配详情
 */
function minMeetingRoomsDetailed(intervals) {
    if (intervals.length === 0) return { roomCount: 0, assignments: [] };

    // 给每个会议添加索引
    const meetings = intervals.map((interval, index) => ({
        start: interval[0],
        end: interval[1],
        id: index
    }));

    // 按开始时间排序
    meetings.sort((a, b) => a.start - b.start);

    const rooms = []; // 每个房间的结束时间和分配的会议
    const assignments = []; // 会议分配记录

    for (let meeting of meetings) {
        // 找到最早空闲的房间
        let assignedRoom = -1;
        let earliestEndTime = Infinity;

        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].endTime <= meeting.start && rooms[i].endTime < earliestEndTime) {
                earliestEndTime = rooms[i].endTime;
                assignedRoom = i;
            }
        }

        if (assignedRoom === -1) {
            // 需要新房间
            assignedRoom = rooms.length;
            rooms.push({ endTime: 0, meetings: [] });
        }

        // 分配会议到房间
        rooms[assignedRoom].endTime = meeting.end;
        rooms[assignedRoom].meetings.push(meeting.id);

        assignments.push({
            meetingId: meeting.id,
            roomId: assignedRoom,
            start: meeting.start,
            end: meeting.end
        });
    }

    return {
        roomCount: rooms.length,
        assignments: assignments,
        roomDetails: rooms
    };
}

// ==================== 综合测试函数 ====================

/**
 * 运行所有练习题测试
 */
function runAllTests() {
    console.log("=== 第14章 贪心算法练习题测试 ===\n");

    // 测试1：跳跃游戏II
    console.log("1. 跳跃游戏II测试:");
    const jumpArray1 = [2, 3, 1, 1, 4];
    const jumpArray2 = [2, 3, 0, 1, 4];
    console.log(`数组 [${jumpArray1.join(', ')}]: 最少跳跃次数 = ${jump(jumpArray1)}`);
    console.log(`数组 [${jumpArray2.join(', ')}]: 最少跳跃次数 = ${jump(jumpArray2)}`);
    console.log(`路径版本:`, jumpWithPath(jumpArray1));

    // 测试2：重构字符串
    console.log("\n2. 重构字符串测试:");
    const testStrings = ["aab", "aaab", "vvvlo"];
    for (let str of testStrings) {
        const result = reorganizeString(str);
        console.log(`"${str}" -> "${result}" (有效: ${isValidReorganization(result)})`);
    }

    // 测试3：分发饼干
    console.log("\n3. 分发饼干测试:");
    const children1 = [1, 2, 3];
    const cookies1 = [1, 1];
    const children2 = [1, 2];
    const cookies2 = [1, 2, 3];
    console.log(`孩子胃口 [${children1.join(', ')}], 饼干 [${cookies1.join(', ')}]: 满足 ${findContentChildren(children1, cookies1)} 个孩子`);
    console.log(`孩子胃口 [${children2.join(', ')}], 饼干 [${cookies2.join(', ')}]: 满足 ${findContentChildren(children2, cookies2)} 个孩子`);
    console.log("详细分配:", findContentChildrenDetailed(children2, cookies2));

    // 测试4：任务调度器
    console.log("\n4. 任务调度器测试:");
    const tasks1 = ["A", "A", "A", "B", "B", "B"];
    const tasks2 = ["A", "A", "A", "A", "A", "A", "B", "C", "D", "E", "F", "G"];
    console.log(`任务 [${tasks1.join(', ')}], n=2: 最少时间 = ${leastInterval(tasks1, 2)}`);
    console.log(`任务 [${tasks2.join(', ')}], n=2: 最少时间 = ${leastInterval(tasks2, 2)}`);
    console.log("执行序列:", leastIntervalWithSequence(["A", "A", "A", "B", "B", "B"], 2).slice(0, 10));

    // 测试5：会议室II
    console.log("\n5. 会议室II测试:");
    const meetings1 = [[0, 30], [5, 10], [15, 20]];
    const meetings2 = [[7, 10], [2, 4]];
    console.log(`会议 ${JSON.stringify(meetings1)}: 需要 ${minMeetingRooms(meetings1)} 个会议室`);
    console.log(`会议 ${JSON.stringify(meetings2)}: 需要 ${minMeetingRooms(meetings2)} 个会议室`);
    console.log("详细分配:", minMeetingRoomsDetailed(meetings1));

    console.log("\n=== 所有测试完成 ===");
}

// 性能测试函数
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    // 大规模跳跃游戏测试
    const largeJumpArray = Array(10000).fill().map(() => Math.floor(Math.random() * 10) + 1);
    const start1 = Date.now();
    jump(largeJumpArray);
    console.log(`跳跃游戏II (10000个元素): ${Date.now() - start1}ms`);

    // 大规模字符串重构测试
    const largeString = 'abcdefghij'.repeat(1000);
    const start2 = Date.now();
    reorganizeString(largeString);
    console.log(`重构字符串 (10000字符): ${Date.now() - start2}ms`);

    // 大规模会议室测试
    const largeMeetings = Array(1000).fill().map(() => {
        const start = Math.floor(Math.random() * 1000);
        return [start, start + Math.floor(Math.random() * 100) + 1];
    });
    const start3 = Date.now();
    minMeetingRooms(largeMeetings);
    console.log(`会议室II (1000个会议): ${Date.now() - start3}ms`);
}

// 导出所有函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // 问题1：跳跃游戏II
        jump,
        jumpWithPath,
        jumpDP,

        // 问题2：重构字符串
        reorganizeString,
        reorganizeStringPQ,
        isValidReorganization,

        // 问题3：分发饼干
        findContentChildren,
        findContentChildrenDetailed,
        findContentChildrenReverse,

        // 问题4：任务调度器
        leastInterval,
        leastIntervalWithSequence,
        leastIntervalSimulation,

        // 问题5：会议室II
        minMeetingRooms,
        minMeetingRoomsHeap,
        minMeetingRoomsDetailed,

        // 测试函数
        runAllTests,
        performanceTest
    };
}

// 自动运行测试（如果直接执行此文件）
if (typeof require !== 'undefined' && require.main === module) {
    runAllTests();
    performanceTest();
}