/**
 * 第14章 贪心算法 - 高级算法实现
 *
 * 本文件包含：
 * 1. 高级贪心策略应用
 * 2. 图论贪心算法
 * 3. 数学贪心问题
 * 4. 字符串贪心算法
 * 5. 贪心算法优化技巧
 * 6. 复杂贪心问题解决方案
 *
 * 作者：数据结构与算法教程
 * 日期：2024年
 */

// ==================== 1. 高级贪心策略应用 ====================

/**
 * 跳跃游戏问题集合
 */
class JumpGame {
    /**
     * 跳跃游戏I - 判断是否能到达最后一个位置
     *
     * 核心思想：
     * 维护当前能到达的最远位置，如果某一点无法到达则返回false
     * 贪心策略：每次更新能到达的最远位置
     *
     * @param {number[]} nums - 数组，nums[i]表示在位置i最多能跳nums[i]步
     * @returns {boolean} 是否能到达最后位置
     * @time O(n)
     * @space O(1)
     */
    static canJump(nums) {
        let maxReach = 0; // 当前能到达的最远位置

        for (let i = 0; i < nums.length; i++) {
            // 如果当前位置超过了能到达的最远位置，无法继续
            if (i > maxReach) return false;

            // 更新能到达的最远位置
            maxReach = Math.max(maxReach, i + nums[i]);

            // 如果已经能到达最后位置，提前返回
            if (maxReach >= nums.length - 1) return true;
        }

        return maxReach >= nums.length - 1;
    }

    /**
     * 跳跃游戏II - 求到达最后位置的最少跳跃次数
     *
     * 核心思想：
     * 在当前跳跃范围内寻找下一跳能到达的最远位置
     * 贪心策略：每次在当前范围内选择能跳得最远的位置
     *
     * @param {number[]} nums - 数组
     * @returns {number} 最少跳跃次数
     * @time O(n)
     * @space O(1)
     */
    static jump(nums) {
        if (nums.length <= 1) return 0;

        let jumps = 0;
        let currentEnd = 0; // 当前跳跃能到达的边界
        let farthest = 0;   // 在当前范围内能到达的最远位置

        for (let i = 0; i < nums.length - 1; i++) {
            // 更新在当前范围内能到达的最远位置
            farthest = Math.max(farthest, i + nums[i]);

            // 到达当前跳跃的边界，需要进行下一次跳跃
            if (i === currentEnd) {
                jumps++;
                currentEnd = farthest;
            }
        }

        return jumps;
    }

    /**
     * 跳跃游戏III - 判断是否能到达值为0的位置
     *
     * @param {number[]} arr - 数组
     * @param {number} start - 起始位置
     * @returns {boolean} 是否能到达值为0的位置
     */
    static canReachZero(arr, start) {
        const visited = new Set();

        function dfs(index) {
            // 越界或已访问
            if (index < 0 || index >= arr.length || visited.has(index)) {
                return false;
            }

            // 找到值为0的位置
            if (arr[index] === 0) return true;

            visited.add(index);

            // 尝试向左和向右跳跃
            return dfs(index + arr[index]) || dfs(index - arr[index]);
        }

        return dfs(start);
    }
}

/**
 * 加油站问题
 *
 * 核心思想：
 * 从总的角度看，如果总油量>=总消耗，一定有解
 * 贪心策略：如果在某个位置油量不足，说明从之前任何位置开始都不行，
 * 必须从下一个位置重新开始尝试
 *
 * @param {number[]} gas - 各加油站的油量
 * @param {number[]} cost - 从各加油站到下一站的耗油量
 * @returns {number} 起始加油站索引，无解返回-1
 * @time O(n)
 * @space O(1)
 */
function canCompleteCircuit(gas, cost) {
    let totalTank = 0;    // 总油量差
    let currentTank = 0;  // 当前油量
    let startStation = 0; // 起始站点

    for (let i = 0; i < gas.length; i++) {
        const netGas = gas[i] - cost[i];
        totalTank += netGas;
        currentTank += netGas;

        // 如果当前油量不足，从下一个站点重新开始
        if (currentTank < 0) {
            startStation = i + 1;
            currentTank = 0;
        }
    }

    // 总油量不足，无解
    return totalTank >= 0 ? startStation : -1;
}

/**
 * 分发糖果问题
 *
 * 核心思想：
 * 两次遍历，先保证右边比左边高的得到更多糖果，
 * 再保证左边比右边高的得到更多糖果
 * 贪心策略：每次只满足一个方向的约束，最后取最大值
 *
 * @param {number[]} ratings - 孩子的评分数组
 * @returns {number} 最少糖果总数
 * @time O(n)
 * @space O(n)
 */
function candy(ratings) {
    const n = ratings.length;
    const candies = Array(n).fill(1);

    // 从左到右遍历，保证右边比左边高的得到更多糖果
    for (let i = 1; i < n; i++) {
        if (ratings[i] > ratings[i - 1]) {
            candies[i] = candies[i - 1] + 1;
        }
    }

    // 从右到左遍历，保证左边比右边高的得到更多糖果
    for (let i = n - 2; i >= 0; i--) {
        if (ratings[i] > ratings[i + 1]) {
            candies[i] = Math.max(candies[i], candies[i + 1] + 1);
        }
    }

    return candies.reduce((sum, candy) => sum + candy, 0);
}

// ==================== 2. 图论贪心算法 ====================

/**
 * 最短路径贪心算法
 */
class ShortestPathGreedy {
    /**
     * Dijkstra算法 - 单源最短路径
     *
     * 核心思想：
     * 每次选择当前距离最短的未访问顶点，更新其邻居的距离
     * 贪心策略：每次选择距离源点最近的未确定顶点
     *
     * @param {Array} graph - 邻接矩阵
     * @param {number} source - 源点
     * @returns {Object} 最短距离和路径信息
     * @time O(V²) 使用数组，O((V+E)logV) 使用优先队列
     * @space O(V)
     */
    static dijkstra(graph, source) {
        const n = graph.length;
        const distances = Array(n).fill(Infinity);
        const visited = Array(n).fill(false);
        const previous = Array(n).fill(-1);

        distances[source] = 0;

        for (let i = 0; i < n; i++) {
            // 找到未访问顶点中距离最小的
            let u = -1;
            for (let v = 0; v < n; v++) {
                if (!visited[v] && (u === -1 || distances[v] < distances[u])) {
                    u = v;
                }
            }

            visited[u] = true;

            // 更新邻居的距离
            for (let v = 0; v < n; v++) {
                if (!visited[v] && graph[u][v] !== 0) {
                    const newDist = distances[u] + graph[u][v];
                    if (newDist < distances[v]) {
                        distances[v] = newDist;
                        previous[v] = u;
                    }
                }
            }
        }

        return { distances, previous };
    }

    /**
     * 构造从源点到目标点的最短路径
     */
    static getPath(previous, source, target) {
        const path = [];
        let current = target;

        while (current !== -1) {
            path.unshift(current);
            current = previous[current];
        }

        return path[0] === source ? path : [];
    }
}

/**
 * 拓扑排序（贪心选择入度为0的顶点）
 *
 * 核心思想：
 * 每次选择一个入度为0的顶点，将其从图中删除，更新其邻居的入度
 * 贪心策略：优先选择入度为0的顶点
 *
 * @param {Array} graph - 邻接表表示的有向图
 * @returns {Array} 拓扑排序结果，如果有环返回空数组
 * @time O(V + E)
 * @space O(V)
 */
function topologicalSort(graph) {
    const n = graph.length;
    const inDegree = Array(n).fill(0);

    // 计算所有顶点的入度
    for (let u = 0; u < n; u++) {
        for (let v of graph[u]) {
            inDegree[v]++;
        }
    }

    // 将所有入度为0的顶点加入队列
    const queue = [];
    for (let i = 0; i < n; i++) {
        if (inDegree[i] === 0) {
            queue.push(i);
        }
    }

    const result = [];

    while (queue.length > 0) {
        const u = queue.shift();
        result.push(u);

        // 删除顶点u及其所有出边
        for (let v of graph[u]) {
            inDegree[v]--;
            if (inDegree[v] === 0) {
                queue.push(v);
            }
        }
    }

    // 如果结果包含所有顶点，则无环；否则有环
    return result.length === n ? result : [];
}

/**
 * 课程调度问题
 *
 * @param {number} numCourses - 课程总数
 * @param {Array} prerequisites - 先修课程关系 [[a,b], ...] 表示学习a之前必须先学b
 * @returns {Array} 课程学习顺序，无法完成返回空数组
 */
function findOrder(numCourses, prerequisites) {
    // 构建邻接表
    const graph = Array(numCourses).fill().map(() => []);
    const inDegree = Array(numCourses).fill(0);

    for (let [course, prereq] of prerequisites) {
        graph[prereq].push(course);
        inDegree[course]++;
    }

    return topologicalSort(graph);
}

// ==================== 3. 数学贪心问题 ====================

/**
 * 数学贪心算法集合
 */
class MathematicalGreedy {
    /**
     * 重构字符串（使相同字符不相邻）
     *
     * 核心思想：
     * 优先放置出现频率最高的字符，每次间隔一个位置放置
     * 贪心策略：总是选择当前剩余最多且可以放置的字符
     *
     * @param {string} s - 输入字符串
     * @returns {string} 重构后的字符串，不可能则返回空字符串
     * @time O(n)
     * @space O(1) 字符集大小固定
     */
    static reorganizeString(s) {
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

        // 如果最高频率字符的数量超过(n+1)/2，无法重构
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
     * 摆动序列问题
     *
     * 核心思想：
     * 贪心地选择局部极值点，这样能得到最长的摆动子序列
     * 贪心策略：只有在趋势改变时才计数
     *
     * @param {number[]} nums - 数组
     * @returns {number} 最长摆动子序列长度
     * @time O(n)
     * @space O(1)
     */
    static wiggleMaxLength(nums) {
        if (nums.length < 2) return nums.length;

        let up = 1;   // 以上升结尾的最长摆动序列长度
        let down = 1; // 以下降结尾的最长摆动序列长度

        for (let i = 1; i < nums.length; i++) {
            if (nums[i] > nums[i - 1]) {
                up = down + 1;
            } else if (nums[i] < nums[i - 1]) {
                down = up + 1;
            }
            // 相等时不更新
        }

        return Math.max(up, down);
    }

    /**
     * 去除K位数字得到最小数
     *
     * 核心思想：
     * 从左到右遍历，如果当前数字比前一个小，就删除前一个数字
     * 贪心策略：优先删除高位的较大数字
     *
     * @param {string} num - 数字字符串
     * @param {number} k - 要删除的位数
     * @returns {string} 删除k位后的最小数字
     * @time O(n)
     * @space O(n)
     */
    static removeKdigits(num, k) {
        const stack = [];
        let toRemove = k;

        for (let digit of num) {
            // 如果当前数字比栈顶小，且还有删除次数，就删除栈顶
            while (toRemove > 0 && stack.length > 0 && stack[stack.length - 1] > digit) {
                stack.pop();
                toRemove--;
            }
            stack.push(digit);
        }

        // 如果还有删除次数，从末尾删除
        while (toRemove > 0) {
            stack.pop();
            toRemove--;
        }

        // 去除前导零
        const result = stack.join('').replace(/^0+/, '');
        return result || '0';
    }

    /**
     * 单调递增的数字
     *
     * 核心思想：
     * 从右向左遍历，如果发现递减，将较大位减1，后面所有位设为9
     * 贪心策略：尽可能保持高位不变，只在必要时减小
     *
     * @param {number} n - 输入数字
     * @returns {number} 最大的单调递增数字
     * @time O(log n)
     * @space O(log n)
     */
    static monotoneIncreasingDigits(n) {
        const digits = n.toString().split('');
        let mark = digits.length; // 从哪一位开始设为9

        // 从右向左遍历
        for (let i = digits.length - 1; i > 0; i--) {
            if (digits[i - 1] > digits[i]) {
                mark = i;
                digits[i - 1] = (parseInt(digits[i - 1]) - 1).toString();
            }
        }

        // 将mark位置及之后的所有位设为9
        for (let i = mark; i < digits.length; i++) {
            digits[i] = '9';
        }

        return parseInt(digits.join(''));
    }
}

// ==================== 4. 字符串贪心算法 ====================

/**
 * 字符串贪心算法集合
 */
class StringGreedy {
    /**
     * 验证IP地址分割
     *
     * 核心思想：
     * 贪心地尝试每种可能的分割方式，优先尝试较短的有效段
     * 贪心策略：在保证有效的前提下，优先选择较短的段
     *
     * @param {string} s - 输入字符串
     * @returns {Array} 所有有效的IP地址
     * @time O(1) 最多只有3^4种分割方式
     * @space O(1)
     */
    static restoreIpAddresses(s) {
        const result = [];

        function isValid(segment) {
            // 空字符串或长度超过3
            if (segment.length === 0 || segment.length > 3) return false;
            // 有前导零且不是单个0
            if (segment[0] === '0' && segment.length > 1) return false;
            // 数值超过255
            return parseInt(segment) <= 255;
        }

        function backtrack(start, path) {
            // 如果已经分成4段且用完了所有字符
            if (path.length === 4 && start === s.length) {
                result.push(path.join('.'));
                return;
            }

            // 如果段数超过4或剩余字符不够
            if (path.length === 4 || start === s.length) return;

            // 贪心尝试1-3位的段
            for (let len = 1; len <= 3 && start + len <= s.length; len++) {
                const segment = s.substring(start, start + len);
                if (isValid(segment)) {
                    path.push(segment);
                    backtrack(start + len, path);
                    path.pop();
                }
            }
        }

        backtrack(0, []);
        return result;
    }

    /**
     * 分割回文串
     *
     * 核心思想：
     * 贪心地尝试从当前位置开始的所有可能回文串
     * 贪心策略：优先尝试较长的回文串以减少分割数量
     *
     * @param {string} s - 输入字符串
     * @returns {Array} 所有可能的回文分割
     * @time O(n * 2^n)
     * @space O(n)
     */
    static partition(s) {
        const result = [];

        function isPalindrome(str, left, right) {
            while (left < right) {
                if (str[left] !== str[right]) return false;
                left++;
                right--;
            }
            return true;
        }

        function backtrack(start, path) {
            if (start === s.length) {
                result.push([...path]);
                return;
            }

            // 贪心尝试从当前位置到末尾的所有可能子串
            for (let end = start; end < s.length; end++) {
                if (isPalindrome(s, start, end)) {
                    path.push(s.substring(start, end + 1));
                    backtrack(end + 1, path);
                    path.pop();
                }
            }
        }

        backtrack(0, []);
        return result;
    }

    /**
     * 无重复字符的最长子串
     *
     * 核心思想：
     * 使用滑动窗口，贪心地扩展右边界，收缩左边界
     * 贪心策略：总是尝试扩展窗口，直到出现重复字符
     *
     * @param {string} s - 输入字符串
     * @returns {number} 最长子串长度
     * @time O(n)
     * @space O(min(m, n)) m是字符集大小
     */
    static lengthOfLongestSubstring(s) {
        const charIndex = new Map();
        let left = 0;
        let maxLength = 0;

        for (let right = 0; right < s.length; right++) {
            const char = s[right];

            // 如果字符已存在且在当前窗口内
            if (charIndex.has(char) && charIndex.get(char) >= left) {
                left = charIndex.get(char) + 1;
            }

            charIndex.set(char, right);
            maxLength = Math.max(maxLength, right - left + 1);
        }

        return maxLength;
    }

    /**
     * 字符串压缩
     *
     * 核心思想：
     * 贪心地统计连续相同字符的数量
     * 贪心策略：只有在压缩后更短时才返回压缩结果
     *
     * @param {string} s - 输入字符串
     * @returns {string} 压缩后的字符串
     * @time O(n)
     * @space O(n)
     */
    static compressString(s) {
        if (s.length <= 2) return s;

        const compressed = [];
        let count = 1;

        for (let i = 1; i < s.length; i++) {
            if (s[i] === s[i - 1]) {
                count++;
            } else {
                compressed.push(s[i - 1] + count);
                count = 1;
            }
        }
        // 处理最后一组字符
        compressed.push(s[s.length - 1] + count);

        const result = compressed.join('');
        return result.length < s.length ? result : s;
    }
}

// ==================== 5. 贪心算法优化技巧 ====================

/**
 * 贪心算法优化技巧集合
 */
class GreedyOptimization {
    /**
     * 使用优先队列优化的贪心算法模板
     */
    static greedyWithPriorityQueue(elements, compareFn) {
        // 简化的优先队列实现
        const pq = [...elements].sort(compareFn);
        const result = [];

        while (pq.length > 0) {
            const current = pq.shift();
            // 处理当前元素的贪心逻辑
            result.push(current);

            // 根据需要重新排序（在实际实现中应该使用真正的优先队列）
            // pq.sort(compareFn);
        }

        return result;
    }

    /**
     * 状态压缩的贪心算法
     *
     * 核心思想：
     * 使用位运算来压缩状态，减少空间复杂度
     * 适用于状态空间较小的贪心问题
     *
     * @param {Array} items - 待处理的元素
     * @param {number} maxStates - 最大状态数（通常是2^n）
     * @returns {Object} 优化结果
     */
    static stateCompressedGreedy(items, maxStates) {
        const dp = Array(maxStates).fill(0);

        for (let item of items) {
            for (let state = maxStates - 1; state >= 0; state--) {
                // 检查是否可以从当前状态转移
                const newState = this.getNewState(state, item);
                if (newState !== -1 && newState < maxStates) {
                    dp[newState] = Math.max(dp[newState], dp[state] + item.value);
                }
            }
        }

        return {
            maxValue: Math.max(...dp),
            optimalStates: dp
        };
    }

    /**
     * 获取新状态（示例实现）
     */
    static getNewState(currentState, item) {
        // 这里应该根据具体问题实现状态转移逻辑
        return currentState | (1 << item.id);
    }

    /**
     * 双指针优化的贪心算法
     *
     * 核心思想：
     * 使用双指针技术减少搜索空间
     * 适用于数组或字符串的贪心问题
     *
     * @param {Array} arr - 输入数组
     * @param {number} target - 目标值
     * @returns {Array} 结果数组
     */
    static twoPointerGreedy(arr, target) {
        arr.sort((a, b) => a - b); // 排序是贪心策略的一部分

        let left = 0;
        let right = arr.length - 1;
        const result = [];

        while (left < right) {
            const sum = arr[left] + arr[right];

            if (sum === target) {
                result.push([arr[left], arr[right]]);
                left++;
                right--;
            } else if (sum < target) {
                left++; // 贪心选择：需要更大的值
            } else {
                right--; // 贪心选择：需要更小的值
            }
        }

        return result;
    }
}

// ==================== 6. 复杂贪心问题解决方案 ====================

/**
 * 会议室问题集合
 */
class MeetingRooms {
    /**
     * 会议室I - 判断一个人是否能参加所有会议
     *
     * @param {Array} intervals - 会议时间区间
     * @returns {boolean} 是否能参加所有会议
     */
    static canAttendMeetings(intervals) {
        intervals.sort((a, b) => a[0] - b[0]);

        for (let i = 1; i < intervals.length; i++) {
            if (intervals[i][0] < intervals[i - 1][1]) {
                return false;
            }
        }

        return true;
    }

    /**
     * 会议室II - 最少需要多少个会议室
     *
     * 核心思想：
     * 使用事件排序，开始事件+1，结束事件-1
     * 贪心策略：按时间排序处理所有事件
     *
     * @param {Array} intervals - 会议时间区间
     * @returns {number} 最少会议室数量
     * @time O(n log n)
     * @space O(n)
     */
    static minMeetingRooms(intervals) {
        const events = [];

        // 创建开始和结束事件
        for (let [start, end] of intervals) {
            events.push([start, 1]);   // 会议开始，需要一个房间
            events.push([end, -1]);    // 会议结束，释放一个房间
        }

        // 按时间排序，如果时间相同，先处理结束事件
        events.sort((a, b) => {
            if (a[0] === b[0]) return a[1] - b[1];
            return a[0] - b[0];
        });

        let rooms = 0;
        let maxRooms = 0;

        for (let [time, change] of events) {
            rooms += change;
            maxRooms = Math.max(maxRooms, rooms);
        }

        return maxRooms;
    }

    /**
     * 会议室III - 安排会议到指定数量的会议室
     *
     * @param {Array} meetings - 会议数组 [start, duration]
     * @param {number} numRooms - 会议室数量
     * @returns {number} 举办最多会议的会议室编号
     */
    static mostBookedRoom(meetings, numRooms) {
        // 按开始时间排序
        meetings.sort((a, b) => a[0] - b[0]);

        const roomEndTimes = Array(numRooms).fill(0);
        const meetingCount = Array(numRooms).fill(0);

        for (let [start, duration] of meetings) {
            // 找到最早可用的会议室
            let earliestRoom = 0;
            let earliestTime = roomEndTimes[0];

            for (let i = 1; i < numRooms; i++) {
                if (roomEndTimes[i] < earliestTime ||
                    (roomEndTimes[i] === earliestTime && i < earliestRoom)) {
                    earliestRoom = i;
                    earliestTime = roomEndTimes[i];
                }
            }

            // 安排会议
            const meetingStart = Math.max(start, roomEndTimes[earliestRoom]);
            roomEndTimes[earliestRoom] = meetingStart + duration;
            meetingCount[earliestRoom]++;
        }

        // 找到举办最多会议的会议室
        let maxMeetings = Math.max(...meetingCount);
        return meetingCount.indexOf(maxMeetings);
    }
}

/**
 * 任务调度器
 *
 * 核心思想：
 * 优先处理频率最高的任务，保证相同任务间有足够的冷却时间
 * 贪心策略：总是选择当前可执行且频率最高的任务
 *
 * @param {string[]} tasks - 任务数组
 * @param {number} n - 冷却时间
 * @returns {number} 完成所有任务的最少时间
 * @time O(m log k) m是任务总数，k是不同任务类型数
 * @space O(k)
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
    // 基本思想：将最高频率的任务作为框架，其他任务填充空隙
    const partCount = maxFreq - 1;
    const partLength = n - (maxCount - 1);
    const emptySlots = partCount * partLength;
    const availableTasks = tasks.length - maxFreq * maxCount;
    const idles = Math.max(0, emptySlots - availableTasks);

    return tasks.length + idles;
}

// ==================== 导出和测试 ====================

/**
 * 运行高级贪心算法测试
 */
function runAdvancedGreedyTests() {
    console.log("=== 高级贪心算法测试 ===\n");

    // 测试跳跃游戏
    console.log("1. 跳跃游戏测试:");
    const jumpArray = [2, 3, 1, 1, 4];
    console.log(`数组: [${jumpArray.join(', ')}]`);
    console.log(`能到达末尾: ${JumpGame.canJump(jumpArray)}`);
    console.log(`最少跳跃次数: ${JumpGame.jump(jumpArray)}`);

    // 测试加油站问题
    console.log("\n2. 加油站问题测试:");
    const gas = [1, 2, 3, 4, 5];
    const cost = [3, 4, 5, 1, 2];
    console.log(`起始加油站: ${canCompleteCircuit(gas, cost)}`);

    // 测试分发糖果
    console.log("\n3. 分发糖果测试:");
    const ratings = [1, 0, 2];
    console.log(`评分: [${ratings.join(', ')}]`);
    console.log(`最少糖果数: ${candy(ratings)}`);

    // 测试会议室问题
    console.log("\n4. 会议室问题测试:");
    const meetings = [[0, 30], [5, 10], [15, 20]];
    console.log(`会议时间: ${JSON.stringify(meetings)}`);
    console.log(`能参加所有会议: ${MeetingRooms.canAttendMeetings(meetings)}`);
    console.log(`最少会议室数: ${MeetingRooms.minMeetingRooms(meetings)}`);

    // 测试任务调度器
    console.log("\n5. 任务调度器测试:");
    const tasks = ['A', 'A', 'A', 'B', 'B', 'B'];
    const cooldown = 2;
    console.log(`任务: [${tasks.join(', ')}], 冷却时间: ${cooldown}`);
    console.log(`最少时间: ${leastInterval(tasks, cooldown)}`);

    // 测试字符串重构
    console.log("\n6. 字符串重构测试:");
    const str = "aab";
    console.log(`原字符串: "${str}"`);
    console.log(`重构结果: "${MathematicalGreedy.reorganizeString(str)}"`);
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // 高级贪心策略
        JumpGame,
        canCompleteCircuit,
        candy,

        // 图论贪心
        ShortestPathGreedy,
        topologicalSort,
        findOrder,

        // 数学贪心
        MathematicalGreedy,

        // 字符串贪心
        StringGreedy,

        // 优化技巧
        GreedyOptimization,

        // 复杂问题
        MeetingRooms,
        leastInterval,

        // 测试函数
        runAdvancedGreedyTests
    };
}