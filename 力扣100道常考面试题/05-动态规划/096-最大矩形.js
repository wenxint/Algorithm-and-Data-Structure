/**
 * LeetCode 096: 最大矩形 (Maximal Rectangle)
 *
 * 题目描述：
 * 给定一个仅包含 0 和 1 、大小为 rows x cols 的二维二进制矩阵，找出只包含 1 的最大矩形，并返回其面积。
 *
 * 示例：
 * 输入：matrix = [["1","0","1","0","0"],
 *                ["1","0","1","1","1"],
 *                ["1","1","1","1","1"],
 *                ["1","0","0","1","0"]]
 * 输出：6
 * 解释：最大矩形如下图所示，面积为 6
 *
 * 核心思想：
 * 动态规划 + 单调栈 - 将二维问题转化为多个一维"柱状图中最大矩形"问题
 *
 * 算法原理：
 * 1. 高度计算：对每一行，计算以该行为底的连续1的高度
 * 2. 一维转化：每一行都转化为"柱状图中最大矩形"问题
 * 3. 单调栈求解：对每个高度数组，使用单调栈找最大矩形面积
 * 4. 全局最优：维护所有行的最大面积作为最终结果
 *
 * 具体步骤：
 * - 对于每一行，如果当前位置是'1'，高度累加；如果是'0'，高度重置为0
 * - 使用单调栈算法求解当前高度数组的最大矩形面积
 * - 比较并更新全局最大面积
 *
 * 时间复杂度：O(rows × cols)
 * 空间复杂度：O(cols)
 */

/**
 * 解法一：动态规划 + 单调栈（推荐）
 *
 * 核心思想：
 * 将二维矩阵问题转化为多个一维柱状图最大矩形问题
 *
 * 算法步骤：
 * 1. 对每一行计算连续1的高度
 * 2. 将每一行作为柱状图的底边
 * 3. 使用单调栈求解柱状图中的最大矩形
 * 4. 维护全局最大值
 *
 * @param {character[][]} matrix - 二维字符矩阵
 * @returns {number} 最大矩形面积
 * @time O(rows × cols) - 每个元素处理一次
 * @space O(cols) - 高度数组和栈空间
 */
function maximalRectangle(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) return 0;

    const rows = matrix.length;
    const cols = matrix[0].length;
    const heights = new Array(cols).fill(0); // 当前行的高度数组
    let maxArea = 0;

    for (let i = 0; i < rows; i++) {
        // 更新高度数组
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === '1') {
                heights[j] += 1; // 累加高度
            } else {
                heights[j] = 0;  // 重置高度
            }
        }

        // 计算当前行的最大矩形面积
        const area = largestRectangleInHistogram(heights);
        maxArea = Math.max(maxArea, area);
    }

    return maxArea;
}

/**
 * 柱状图中最大矩形（单调栈）
 *
 * 核心思想：
 * 使用单调递增栈来找到每个柱子能扩展的左右边界
 *
 * 算法步骤：
 * 1. 维护单调递增栈存储柱子索引
 * 2. 当遇到较小高度时，计算栈顶柱子的矩形面积
 * 3. 矩形宽度 = 右边界 - 左边界 - 1
 * 4. 矩形高度 = 栈顶柱子的高度
 *
 * @param {number[]} heights - 柱子高度数组
 * @returns {number} 最大矩形面积
 * @time O(n) - 每个元素最多入栈出栈一次
 * @space O(n) - 栈空间
 */
function largestRectangleInHistogram(heights) {
    const stack = []; // 单调递增栈，存储索引
    let maxArea = 0;
    const n = heights.length;

    for (let i = 0; i <= n; i++) {
        // 添加哨兵，高度为0，强制处理栈中剩余元素
        const currentHeight = i === n ? 0 : heights[i];

        // 当当前高度小于栈顶高度时，计算矩形面积
        while (stack.length > 0 && currentHeight < heights[stack[stack.length - 1]]) {
            const height = heights[stack.pop()];
            const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
            maxArea = Math.max(maxArea, height * width);
        }

        stack.push(i);
    }

    return maxArea;
}

/**
 * 解法二：动态规划优化
 *
 * 核心思想：
 * 对每个位置预计算左边界、右边界和高度，直接计算矩形面积
 *
 * 算法步骤：
 * 1. 维护三个DP数组：height, left, right
 * 2. height[j]：以当前行为底的第j列的连续1高度
 * 3. left[j]：当前行第j列能扩展的最左边界
 * 4. right[j]：当前行第j列能扩展的最右边界
 * 5. 面积 = height[j] * (right[j] - left[j])
 *
 * @param {character[][]} matrix - 二维字符矩阵
 * @returns {number} 最大矩形面积
 * @time O(rows × cols) - 每个位置计算一次
 * @space O(cols) - 三个DP数组
 */
function maximalRectangleDP(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) return 0;

    const rows = matrix.length;
    const cols = matrix[0].length;

    // DP数组
    const height = new Array(cols).fill(0);  // 当前位置的高度
    const left = new Array(cols).fill(0);    // 左边界
    const right = new Array(cols).fill(cols); // 右边界

    let maxArea = 0;

    for (let i = 0; i < rows; i++) {
        let currentLeft = 0, currentRight = cols;

        // 1. 更新高度数组
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === '1') {
                height[j]++;
            } else {
                height[j] = 0;
            }
        }

        // 2. 更新左边界
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === '1') {
                left[j] = Math.max(left[j], currentLeft);
            } else {
                left[j] = 0;
                currentLeft = j + 1;
            }
        }

        // 3. 更新右边界
        for (let j = cols - 1; j >= 0; j--) {
            if (matrix[i][j] === '1') {
                right[j] = Math.min(right[j], currentRight);
            } else {
                right[j] = cols;
                currentRight = j;
            }
        }

        // 4. 计算当前行的最大面积
        for (let j = 0; j < cols; j++) {
            maxArea = Math.max(maxArea, height[j] * (right[j] - left[j]));
        }
    }

    return maxArea;
}

/**
 * 解法三：暴力法
 *
 * 核心思想：
 * 枚举所有可能的矩形，检查是否全为1
 *
 * 算法步骤：
 * 1. 枚举所有可能的左上角坐标
 * 2. 枚举所有可能的右下角坐标
 * 3. 检查矩形区域是否全为1
 * 4. 记录最大面积
 *
 * @param {character[][]} matrix - 二维字符矩阵
 * @returns {number} 最大矩形面积
 * @time O(rows² × cols² × rows × cols) - 五重循环
 * @space O(1) - 常数空间
 */
function maximalRectangleBruteForce(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) return 0;

    const rows = matrix.length;
    const cols = matrix[0].length;
    let maxArea = 0;

    // 枚举所有可能的矩形
    for (let top = 0; top < rows; top++) {
        for (let left = 0; left < cols; left++) {
            for (let bottom = top; bottom < rows; bottom++) {
                for (let right = left; right < cols; right++) {
                    // 检查矩形区域是否全为1
                    if (isAllOnes(matrix, top, left, bottom, right)) {
                        const area = (bottom - top + 1) * (right - left + 1);
                        maxArea = Math.max(maxArea, area);
                    }
                }
            }
        }
    }

    return maxArea;
}

/**
 * 检查矩形区域是否全为1
 * @param {character[][]} matrix - 矩阵
 * @param {number} top - 上边界
 * @param {number} left - 左边界
 * @param {number} bottom - 下边界
 * @param {number} right - 右边界
 * @returns {boolean} 是否全为1
 */
function isAllOnes(matrix, top, left, bottom, right) {
    for (let i = top; i <= bottom; i++) {
        for (let j = left; j <= right; j++) {
            if (matrix[i][j] === '0') {
                return false;
            }
        }
    }
    return true;
}

/**
 * 解法四：逐行扫描优化
 *
 * 核心思想：
 * 对每一行，计算以该行为底边的最大矩形，使用优化的扫描算法
 *
 * 算法步骤：
 * 1. 对每一行计算连续1的高度
 * 2. 对每个位置，向左右扩展找最大宽度
 * 3. 计算该位置的最大矩形面积
 *
 * @param {character[][]} matrix - 二维字符矩阵
 * @returns {number} 最大矩形面积
 * @time O(rows × cols²) - 对每个位置扫描一行
 * @space O(cols) - 高度数组
 */
function maximalRectangleScan(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) return 0;

    const rows = matrix.length;
    const cols = matrix[0].length;
    const heights = new Array(cols).fill(0);
    let maxArea = 0;

    for (let i = 0; i < rows; i++) {
        // 更新高度数组
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === '1') {
                heights[j]++;
            } else {
                heights[j] = 0;
            }
        }

        // 对每个位置计算最大矩形
        for (let j = 0; j < cols; j++) {
            if (heights[j] === 0) continue;

            // 向左扩展
            let left = j;
            while (left > 0 && heights[left - 1] >= heights[j]) {
                left--;
            }

            // 向右扩展
            let right = j;
            while (right < cols - 1 && heights[right + 1] >= heights[j]) {
                right++;
            }

            // 计算面积
            const area = heights[j] * (right - left + 1);
            maxArea = Math.max(maxArea, area);
        }
    }

    return maxArea;
}

/**
 * 扩展应用：最大正方形
 *
 * 核心思想：
 * 在最大矩形的基础上，限制长宽相等
 *
 * @param {character[][]} matrix - 二维字符矩阵
 * @returns {number} 最大正方形面积
 * @time O(rows × cols) - 动态规划
 * @space O(cols) - 压缩空间
 */
function maximalSquare(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) return 0;

    const rows = matrix.length;
    const cols = matrix[0].length;
    let prev = new Array(cols + 1).fill(0); // 上一行的DP结果
    let maxSide = 0;

    for (let i = 1; i <= rows; i++) {
        const current = new Array(cols + 1).fill(0);

        for (let j = 1; j <= cols; j++) {
            if (matrix[i - 1][j - 1] === '1') {
                current[j] = Math.min(current[j - 1], prev[j], prev[j - 1]) + 1;
                maxSide = Math.max(maxSide, current[j]);
            }
        }

        prev = current;
    }

    return maxSide * maxSide;
}

// 测试用例
console.log("=== LeetCode 096: 最大矩形 测试 ===");

const testCases = [
    [
        ["1","0","1","0","0"],
        ["1","0","1","1","1"],
        ["1","1","1","1","1"],
        ["1","0","0","1","0"]
    ],
    [
        ["0"]
    ],
    [
        ["1"]
    ],
    [
        ["0","0"]
    ],
    [
        ["1","1","1"],
        ["1","1","1"],
        ["1","1","1"]
    ],
    [
        ["1","0","1","1","0"],
        ["1","1","1","1","1"],
        ["1","1","1","1","1"],
        ["1","1","0","0","1"]
    ]
];

console.log("\n解法一：动态规划 + 单调栈");
testCases.forEach((matrix, index) => {
    const result = maximalRectangle(matrix);
    console.log(`测试 ${index + 1}: 矩阵 ${matrix.length}x${matrix[0].length} => 面积: ${result}`);
    console.log(`  矩阵内容: ${JSON.stringify(matrix)}`);
});

console.log("\n解法二：动态规划优化");
testCases.forEach((matrix, index) => {
    const result = maximalRectangleDP(matrix);
    console.log(`测试 ${index + 1}: 矩阵 ${matrix.length}x${matrix[0].length} => 面积: ${result}`);
});

console.log("\n解法三：暴力法");
testCases.slice(0, 4).forEach((matrix, index) => { // 只测试前4个，避免超时
    const result = maximalRectangleBruteForce(matrix);
    console.log(`测试 ${index + 1}: 矩阵 ${matrix.length}x${matrix[0].length} => 面积: ${result}`);
});

console.log("\n解法四：逐行扫描优化");
testCases.forEach((matrix, index) => {
    const result = maximalRectangleScan(matrix);
    console.log(`测试 ${index + 1}: 矩阵 ${matrix.length}x${matrix[0].length} => 面积: ${result}`);
});

console.log("\n扩展：最大正方形");
testCases.forEach((matrix, index) => {
    const result = maximalSquare(matrix);
    console.log(`测试 ${index + 1}: 矩阵 ${matrix.length}x${matrix[0].length} => 正方形面积: ${result}`);
});

/**
 * 算法总结：
 *
 * 1. 动态规划 + 单调栈（推荐）：
 *    - 时间复杂度：O(rows × cols)
 *    - 空间复杂度：O(cols)
 *    - 优点：最优解法，将二维问题转化为一维
 *    - 核心：柱状图最大矩形 + 高度数组
 *
 * 2. 动态规划优化：
 *    - 时间复杂度：O(rows × cols)
 *    - 空间复杂度：O(cols)
 *    - 优点：不需要栈，直接计算边界
 *    - 核心：维护左右边界和高度信息
 *
 * 3. 暴力法：
 *    - 时间复杂度：O(rows² × cols² × rows × cols)
 *    - 空间复杂度：O(1)
 *    - 优点：思路简单，容易理解
 *    - 缺点：时间复杂度过高，不实用
 *
 * 4. 逐行扫描优化：
 *    - 时间复杂度：O(rows × cols²)
 *    - 空间复杂度：O(cols)
 *    - 优点：思路清晰，易于实现
 *    - 缺点：时间复杂度略高于最优解
 *
 * 核心要点：
 * - 将二维问题转化为一维问题是关键
 * - 单调栈是解决柱状图最大矩形的最优方法
 * - 理解高度数组的构建和维护
 * - 边界计算需要特别注意细节
 */