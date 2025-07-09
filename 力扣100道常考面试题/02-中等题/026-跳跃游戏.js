/**
 * LeetCode 028: 跳跃游戏 (Jump Game)
 *
 * 题目描述：
 * 给你一个非负整数数组 nums，你最初位于数组的第一个下标。
 * 数组中的每个元素代表你在该位置可以跳跃的最大长度。
 * 判断你是否能够到达最后一个下标。
 *
 * 核心思想：
 * 贪心算法 - 维护能够到达的最远位置
 * 关键洞察：如果能到达位置i，那么就能到达[0, i+nums[i]]范围内的所有位置
 *
 * 算法原理：
 * 1. 遍历数组，维护能到达的最远位置maxReach
 * 2. 对于每个位置i，如果i <= maxReach，更新maxReach = max(maxReach, i + nums[i])
 * 3. 如果某个位置i > maxReach，说明无法到达，返回false
 * 4. 如果maxReach >= nums.length - 1，说明能到达末尾，返回true
 */

/**
 * 方法一：贪心算法（推荐）
 *
 * 核心思想：
 * 维护能够到达的最远位置，如果当前位置可达，就更新最远位置
 *
 * 算法步骤：
 * 1. 初始化最远可达位置为0
 * 2. 遍历数组每个位置
 * 3. 如果当前位置可达，更新最远位置
 * 4. 如果最远位置已达末尾，返回true
 *
 * @param {number[]} nums - 跳跃数组
 * @returns {boolean} 是否能到达末尾
 * @time O(n) - 只需遍历一次数组
 * @space O(1) - 只使用常数额外空间
 */
function canJump(nums) {
    if (!nums || nums.length === 0) return false;
    if (nums.length === 1) return true;

    let maxReach = 0; // 能够到达的最远位置

    for (let i = 0; i < nums.length; i++) {
        // 如果当前位置超过了能到达的最远位置，无法继续
        if (i > maxReach) {
            return false;
        }

        // 更新能到达的最远位置
        maxReach = Math.max(maxReach, i + nums[i]);

        // 如果已经能够到达或超过末尾位置，返回true
        if (maxReach >= nums.length - 1) {
            return true;
        }
    }

    return maxReach >= nums.length - 1;
}

/**
 * 方法二：优化贪心算法
 *
 * 核心思想：
 * 更简洁的贪心实现，不需要提前判断
 *
 * @param {number[]} nums - 跳跃数组
 * @returns {boolean} 是否能到达末尾
 * @time O(n) - 线性时间复杂度
 * @space O(1) - 常数空间复杂度
 */
function canJumpOptimized(nums) {
    let maxReach = 0;

    for (let i = 0; i <= maxReach && i < nums.length; i++) {
        maxReach = Math.max(maxReach, i + nums[i]);
    }

    return maxReach >= nums.length - 1;
}

/**
 * 方法三：动态规划法
 *
 * 核心思想：
 * dp[i]表示是否能够到达位置i
 * 状态转移：dp[i] = 存在j < i使得dp[j] = true且j + nums[j] >= i
 *
 * @param {number[]} nums - 跳跃数组
 * @returns {boolean} 是否能到达末尾
 * @time O(n²) - 需要双重循环
 * @space O(n) - 需要dp数组
 */
function canJumpDP(nums) {
    const n = nums.length;
    if (n <= 1) return true;

    const dp = new Array(n).fill(false);
    dp[0] = true; // 起始位置总是可达的

    for (let i = 1; i < n; i++) {
        // 检查是否存在可以跳到位置i的前序位置
        for (let j = 0; j < i; j++) {
            if (dp[j] && j + nums[j] >= i) {
                dp[i] = true;
                break;
            }
        }
    }

    return dp[n - 1];
}

/**
 * 方法四：回溯法（暴力搜索）
 *
 * 核心思想：
 * 从每个位置尝试所有可能的跳跃距离，递归搜索
 *
 * @param {number[]} nums - 跳跃数组
 * @returns {boolean} 是否能到达末尾
 * @time O(2^n) - 指数时间复杂度
 * @space O(n) - 递归栈深度
 */
function canJumpBacktrack(nums) {
    return backtrack(nums, 0);

    function backtrack(nums, position) {
        // 已经到达或超过末尾位置
        if (position >= nums.length - 1) {
            return true;
        }

        // 尝试所有可能的跳跃距离
        const furthestJump = Math.min(position + nums[position], nums.length - 1);

        for (let nextPosition = position + 1; nextPosition <= furthestJump; nextPosition++) {
            if (backtrack(nums, nextPosition)) {
                return true;
            }
        }

        return false;
    }
}

/**
 * 方法五：从后往前的贪心算法
 *
 * 核心思想：
 * 从末尾开始，找到能够到达当前目标的最左侧位置
 *
 * @param {number[]} nums - 跳跃数组
 * @returns {boolean} 是否能到达末尾
 * @time O(n) - 线性时间复杂度
 * @space O(1) - 常数空间复杂度
 */
function canJumpReverse(nums) {
    let target = nums.length - 1; // 当前目标位置

    // 从后往前遍历
    for (let i = nums.length - 2; i >= 0; i--) {
        // 如果当前位置能够跳到目标位置
        if (i + nums[i] >= target) {
            target = i; // 更新目标位置
        }
    }

    return target === 0; // 检查是否能从起始位置开始
}

// 测试用例
function runTests() {
    console.log("=== 跳跃游戏测试 ===\n");

    const testCases = [
        {
            nums: [2,3,1,1,4],
            expected: true,
            description: "基础测试：能够到达末尾"
        },
        {
            nums: [3,2,1,0,4],
            expected: false,
            description: "基础测试：无法到达末尾"
        },
        {
            nums: [0],
            expected: true,
            description: "边界情况：单个元素"
        },
        {
            nums: [1],
            expected: true,
            description: "边界情况：单个非零元素"
        },
        {
            nums: [2,0,0],
            expected: true,
            description: "能够跳过零元素"
        },
        {
            nums: [1,0,1,0],
            expected: false,
            description: "被零阻挡"
        },
        {
            nums: [1,2,3],
            expected: true,
            description: "递增数组"
        }
    ];

    const methods = [
        { name: "贪心算法", func: canJump },
        { name: "优化贪心", func: canJumpOptimized },
        { name: "动态规划", func: canJumpDP },
        { name: "从后往前", func: canJumpReverse }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`输入: [${testCase.nums.join(', ')}]`);
        console.log(`期望: ${testCase.expected}`);

        methods.forEach(method => {
            const result = method.func([...testCase.nums]);
            const status = result === testCase.expected ? "✓" : "✗";
            console.log(`${method.name}: ${result} ${status}`);
        });
        console.log();
    });
}

// 性能测试
function performanceTest() {
    console.log("=== 性能测试 ===\n");

    const sizes = [100, 1000, 10000];

    sizes.forEach(size => {
        const nums = Array.from({length: size}, (_, i) => Math.max(1, Math.floor(Math.random() * 3)));

        console.log(`数组大小: ${size}`);

        const methods = [
            { name: "贪心算法", func: canJump },
            { name: "优化贪心", func: canJumpOptimized },
            { name: "从后往前", func: canJumpReverse }
        ];

        methods.forEach(method => {
            const start = performance.now();
            method.func([...nums]);
            const end = performance.now();
            console.log(`${method.name}: ${(end - start).toFixed(4)}ms`);
        });
        console.log();
    });
}

// 算法演示
function demonstrateAlgorithm() {
    console.log("=== 贪心算法演示 ===\n");

    const nums = [2, 3, 1, 1, 4];
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log("位置:      0  1  2  3  4");
    console.log();

    let maxReach = 0;
    console.log("执行过程:");

    for (let i = 0; i < nums.length; i++) {
        if (i > maxReach) {
            console.log(`位置 ${i}: 无法到达 (当前最远位置: ${maxReach})`);
            return false;
        }

        const newReach = i + nums[i];
        maxReach = Math.max(maxReach, newReach);

        console.log(`位置 ${i}: 值=${nums[i]}, 可达=${newReach}, 最远位置=${maxReach}`);

        if (maxReach >= nums.length - 1) {
            console.log(`✓ 已能到达末尾位置 ${nums.length - 1}`);
            return true;
        }
    }

    return maxReach >= nums.length - 1;
}

// 边界情况分析
function edgeCaseAnalysis() {
    console.log("=== 边界情况分析 ===\n");

    const edgeCases = [
        {
            case: "空数组",
            nums: [],
            analysis: "应该返回false，因为没有起始位置"
        },
        {
            case: "单个元素",
            nums: [0],
            analysis: "已经在末尾位置，应该返回true"
        },
        {
            case: "全零数组",
            nums: [0, 0, 0],
            analysis: "除了单个元素外，无法移动，应该返回false"
        },
        {
            case: "起始为0",
            nums: [0, 1, 2],
            analysis: "无法从起始位置移动，应该返回false"
        },
        {
            case: "超大跳跃",
            nums: [100, 0, 0],
            analysis: "可以一次跳到任何位置，应该返回true"
        }
    ];

    edgeCases.forEach(({case: caseName, nums, analysis}) => {
        console.log(`${caseName}: [${nums.join(', ')}]`);
        if (nums.length > 0) {
            const result = canJump(nums);
            console.log(`结果: ${result}`);
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
            name: "贪心算法",
            time: "O(n)",
            space: "O(1)",
            description: "一次遍历，常数空间，最优解法"
        },
        {
            name: "动态规划",
            time: "O(n²)",
            space: "O(n)",
            description: "双重循环，需要额外数组"
        },
        {
            name: "回溯法",
            time: "O(2^n)",
            space: "O(n)",
            description: "指数时间，递归栈空间"
        },
        {
            name: "从后往前",
            time: "O(n)",
            space: "O(1)",
            description: "反向思维，线性时间"
        }
    ];

    console.log("算法复杂度对比：");
    console.log("算法名称".padEnd(12) + "时间复杂度".padEnd(12) + "空间复杂度".padEnd(12) + "特点");
    console.log("-".repeat(50));

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

    console.log("1. 跳跃游戏II - 最少跳跃次数");
    console.log("   问题：返回到达末尾位置的最少跳跃次数");
    console.log("   解法：贪心算法，维护当前跳跃范围和下一跳跃范围");
    console.log();

    console.log("2. 路径规划");
    console.log("   应用：机器人移动、游戏角色移动");
    console.log("   扩展：二维平面的可达性判断");
    console.log();

    console.log("3. 资源分配");
    console.log("   应用：任务调度、资源分配优化");
    console.log("   思想：贪心策略在约束条件下的最优化");
    console.log();

    console.log("4. 网络连通性");
    console.log("   应用：判断图的连通性、网络可达性");
    console.log("   扩展：动态图的连通性维护");
}

// 实际应用示例
function practicalExamples() {
    console.log("=== 实际应用示例 ===\n");

    // 示例1：游戏关卡设计
    console.log("1. 游戏关卡设计验证");
    function validateGameLevel(platforms) {
        // platforms[i] 表示第i个平台的跳跃能力
        const canComplete = canJump(platforms);
        console.log(`关卡平台: [${platforms.join(', ')}]`);
        console.log(`是否可通关: ${canComplete ? '是' : '否'}`);
        return canComplete;
    }

    validateGameLevel([3, 2, 1, 0, 4]); // 无法通关
    validateGameLevel([2, 3, 1, 1, 4]); // 可以通关
    console.log();

    // 示例2：网络节点连通性
    console.log("2. 网络节点连通性检查");
    function checkNetworkConnectivity(connections) {
        // connections[i] 表示节点i的连接范围
        const isConnected = canJump(connections);
        console.log(`连接范围: [${connections.join(', ')}]`);
        console.log(`网络连通: ${isConnected ? '是' : '否'}`);
        return isConnected;
    }

    checkNetworkConnectivity([2, 1, 1, 1, 0]); // 连通
    checkNetworkConnectivity([1, 0, 1, 1, 1]); // 不连通
}

// 面试要点
function interviewKeyPoints() {
    console.log("=== 面试要点 ===\n");

    console.log("🎯 核心考点：");
    console.log("1. 贪心算法的理解和应用");
    console.log("2. 边界条件的处理");
    console.log("3. 时间空间复杂度优化");
    console.log("4. 问题转化思维");
    console.log();

    console.log("💡 解题技巧：");
    console.log("1. 维护全局最优状态（最远可达位置）");
    console.log("2. 局部最优选择（更新最远位置）");
    console.log("3. 提前终止优化（到达末尾即返回）");
    console.log("4. 边界情况特殊处理");
    console.log();

    console.log("🚫 常见误区：");
    console.log("1. 认为需要记录具体路径");
    console.log("2. 使用动态规划导致时间复杂度过高");
    console.log("3. 忽略数组长度为1的边界情况");
    console.log("4. 混淆跳跃距离和位置索引");
    console.log();

    console.log("🔍 相关问题：");
    console.log("1. 跳跃游戏II（最少跳跃次数）");
    console.log("2. 到达数组末尾的方案数");
    console.log("3. 青蛙跳台阶问题");
    console.log("4. 最短路径问题");
}

// 导出所有方法
module.exports = {
    canJump,
    canJumpOptimized,
    canJumpDP,
    canJumpBacktrack,
    canJumpReverse,
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