/**
 * 第18章 单调栈 - 练习题解答
 * 
 * 本文件包含5道单调栈练习题的详细解答：
 * 1. 下一个更大元素 I
 * 2. 每日温度
 * 3. 柱状图中最大的矩形
 * 4. 接雨水
 * 5. 最大矩形
 * 
 * 每道题都提供多种解法、详细分析和测试用例
 */

// ====================练习题1：下一个更大元素 I====================

/**
 * 练习题1 - 单调栈解法（推荐）
 * 
 * 核心思想：
 * 1. 使用单调递减栈处理nums2，记录每个元素的下一个更大元素
 * 2. 将结果存储在哈希表中以便快速查询
 * 3. 遍历nums1，从哈希表中获取对应结果
 * 
 * @param {number[]} nums1 - 子集数组
 * @param {number[]} nums2 - 父集数组
 * @return {number[]} - 每个元素的下一个更大元素
 * @time O(n + m) 时间复杂度，n和m分别为nums1和nums2的长度
 * @space O(m) 空间复杂度，存储哈希表和栈
 */
function nextGreaterElement(nums1, nums2) {
    const stack = [];          // 单调递减栈
    const nextGreaterMap = new Map();  // 存储每个元素的下一个更大元素
    const result = [];         // 结果数组

    // 处理nums2，构建下一个更大元素的映射
    for (const num of nums2) {
        // 当栈不为空且当前元素大于栈顶元素时
        while (stack.length > 0 && num > stack[stack.length - 1]) {
            const top = stack.pop();
            nextGreaterMap.set(top, num);
        }
        stack.push(num);
    }

    // 处理栈中剩余元素，它们没有下一个更大元素
    while (stack.length > 0) {
        nextGreaterMap.set(stack.pop(), -1);
    }

    // 构建nums1的结果
    for (const num of nums1) {
        result.push(nextGreaterMap.get(num));
    }

    return result;
}

/**
 * 练习题1 - 暴力解法（对比用）
 * 
 * @param {number[]} nums1 - 子集数组
 * @param {number[]} nums2 - 父集数组
 * @return {number[]} - 每个元素的下一个更大元素
 * @time O(n*m) 时间复杂度
 * @space O(n) 空间复杂度
 */
function nextGreaterElementBruteForce(nums1, nums2) {
    const result = [];
    const nums2Index = new Map();

    // 构建nums2的索引映射
    for (let i = 0; i < nums2.length; i++) {
        nums2Index.set(nums2[i], i);
    }

    // 对每个nums1元素查找下一个更大元素
    for (const num of nums1) {
        let found = -1;
        const startIndex = nums2Index.get(num) + 1;

        for (let i = startIndex; i < nums2.length; i++) {
            if (nums2[i] > num) {
                found = nums2[i];
                break;
            }
        }

        result.push(found);
    }

    return result;
}

// ====================练习题2：每日温度====================

/**
 * 练习题2 - 单调栈解法（推荐）
 * 
 * 核心思想：
 * 1. 使用单调递减栈存储温度的索引
 * 2. 当遇到更高温度时，计算索引差值即为等待天数
 * 
 * @param {number[]} temperatures - 温度数组
 * @return {number[]} - 等待天数数组
 * @time O(n) 时间复杂度
 * @space O(n) 空间复杂度
 */
function dailyTemperatures(temperatures) {
    const n = temperatures.length;
    const result = new Array(n).fill(0);
    const stack = [];  // 存储索引，保持栈中温度递减

    for (let i = 0; i < n; i++) {
        // 当前温度大于栈顶温度时，计算等待天数
        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            const prevIndex = stack.pop();
            result[prevIndex] = i - prevIndex;
        }
        stack.push(i);
    }

    return result;
}

/**
 * 练习题2 - 从后往前遍历解法
 * 
 * @param {number[]} temperatures - 温度数组
 * @return {number[]} - 等待天数数组
 * @time O(n²) 时间复杂度
 * @space O(1) 空间复杂度
 */
function dailyTemperaturesBackward(temperatures) {
    const n = temperatures.length;
    const result = new Array(n).fill(0);

    // 从后往前遍历
    for (let i = n - 2; i >= 0; i--) {
        let days = 1;
        // 找到第一个比当前温度高的位置
        while (i + days < n && temperatures[i + days] <= temperatures[i]) {
            if (result[i + days] === 0) {
                days = 0;
                break;
            }
            days += result[i + days];
        }
        result[i] = days;
    }

    return result;
}

// ====================练习题3：柱状图中最大的矩形====================

/**
 * 练习题3 - 单调栈解法（推荐）
 * 
 * 核心思想：
 * 1. 使用单调递增栈存储柱子索引
 * 2. 当遇到更低高度的柱子时，计算以栈顶柱子为高度的最大矩形
 * 3. 在数组首尾添加0作为哨兵，简化边界处理
 * 
 * @param {number[]} heights - 柱子高度数组
 * @return {number} - 最大矩形面积
 * @time O(n) 时间复杂度
 * @space O(n) 空间复杂度
 */
function largestRectangleArea(heights) {
    // 在首尾添加哨兵，简化边界处理
    const newHeights = [0, ...heights, 0];
    const stack = [];  // 单调递增栈，存储索引
    let maxArea = 0;

    for (let i = 0; i < newHeights.length; i++) {
        // 当前高度小于栈顶高度时，计算面积
        while (stack.length > 0 && newHeights[i] < newHeights[stack[stack.length - 1]]) {
            const height = newHeights[stack.pop()];
            const width = i - stack[stack.length - 1] - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }

    return maxArea;
}

/**
 * 练习题3 - 分治解法
 * 
 * @param {number[]} heights - 柱子高度数组
 * @return {number} - 最大矩形面积
 * @time O(nlogn) 时间复杂度
 * @space O(logn) 空间复杂度
 */
function largestRectangleAreaDivideConquer(heights) {
    /**
     * 递归计算最大矩形面积
     * @param {number[]} heights - 高度数组
     * @param {number} left - 左边界
     * @param {number} right - 右边界
     * @return {number} - 最大面积
     */
    function calculateArea(heights, left, right) {
        if (left > right) return 0;

        // 找到最低柱子的索引
        let minIndex = left;
        for (let i = left; i <= right; i++) {
            if (heights[i] < heights[minIndex]) {
                minIndex = i;
            }
        }

        // 计算当前最低柱子形成的矩形面积
        const currentArea = heights[minIndex] * (right - left + 1);
        // 递归计算左侧最大面积
        const leftArea = calculateArea(heights, left, minIndex - 1);
        // 递归计算右侧最大面积
        const rightArea = calculateArea(heights, minIndex + 1, right);

        return Math.max(currentArea, leftArea, rightArea);
    }

    return calculateArea(heights, 0, heights.length - 1);
}

// ====================练习题4：接雨水====================

/**
 * 练习题4 - 单调栈解法（推荐）
 * 
 * 核心思想：
 * 1. 使用单调递减栈存储柱子索引
 * 2. 当遇到更高柱子时，计算凹槽的雨水量
 * 3. 凹槽由栈顶元素、新栈顶元素和当前元素形成
 * 
 * @param {number[]} height - 柱子高度数组
 * @return {number} - 雨水量
 * @time O(n) 时间复杂度
 * @space O(n) 空间复杂度
 */
function trap(height) {
    let water = 0;
    const stack = [];  // 单调递减栈，存储索引

    for (let i = 0; i < height.length; i++) {
        // 当前高度大于栈顶高度时，计算雨水量
        while (stack.length > 0 && height[i] > height[stack[stack.length - 1]]) {
            const top = stack.pop();

            // 栈为空时，无法形成凹槽
            if (stack.length === 0) break;

            const left = stack[stack.length - 1];  // 左边界索引
            const width = i - left - 1;           // 凹槽宽度
            const minHeight = Math.min(height[left], height[i]) - height[top];  // 凹槽高度
            water += width * minHeight;
        }
        stack.push(i);
    }

    return water;
}

/**
 * 练习题4 - 双指针解法
 * 
 * @param {number[]} height - 柱子高度数组
 * @return {number} - 雨水量
 * @time O(n) 时间复杂度
 * @space O(1) 空间复杂度
 */
function trapTwoPointers(height) {
    let left = 0, right = height.length - 1;
    let leftMax = 0, rightMax = 0;
    let water = 0;

    while (left < right) {
        if (height[left] < height[right]) {
            // 左侧处理
            if (height[left] >= leftMax) {
                leftMax = height[left];
            } else {
                water += leftMax - height[left];
            }
            left++;
        } else {
            // 右侧处理
            if (height[right] >= rightMax) {
                rightMax = height[right];
            } else {
                water += rightMax - height[right];
            }
            right--;
        }
    }

    return water;
}

// ====================练习题5：最大矩形====================

/**
 * 练习题5 - 单调栈解法（推荐）
 * 
 * 核心思想：
 * 1. 将矩阵转化为柱状图问题
 * 2. 对每一行计算高度数组
 * 3. 调用柱状图最大矩形算法求解
 * 
 * @param {character[][]} matrix - 二进制矩阵
 * @return {number} - 最大矩形面积
 * @time O(rows×cols) 时间复杂度
 * @space O(cols) 空间复杂度
 */
function maximalRectangle(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) return 0;

    const rows = matrix.length;
    const cols = matrix[0].length;
    const heights = new Array(cols).fill(0);
    let maxArea = 0;

    // 遍历每一行，计算高度数组
    for (let i = 0; i < rows; i++) {
        // 更新高度数组
        for (let j = 0; j < cols; j++) {
            heights[j] = matrix[i][j] === '1' ? heights[j] + 1 : 0;
        }

        // 计算当前行对应的柱状图最大矩形面积
        maxArea = Math.max(maxArea, largestRectangleArea(heights));
    }

    return maxArea;
}

/**
 * 练习题5 - 动态规划解法
 * 
 * @param {character[][]} matrix - 二进制矩阵
 * @return {number} - 最大矩形面积
 * @time O(rows×cols²) 时间复杂度
 * @space O(rows×cols) 空间复杂度
 */
function maximalRectangleDP(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) return 0;

    const rows = matrix.length;
    const cols = matrix[0].length;
    const left = new Array(cols).fill(0);    // 左边界
    const right = new Array(cols).fill(cols); // 右边界
    const height = new Array(cols).fill(0);   // 高度
    let maxArea = 0;

    for (let i = 0; i < rows; i++) {
        let currentLeft = 0, currentRight = cols;

        // 更新高度
        for (let j = 0; j < cols; j++) {
            height[j] = matrix[i][j] === '1' ? height[j] + 1 : 0;
        }

        // 更新左边界
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === '1') {
                left[j] = Math.max(left[j], currentLeft);
            } else {
                left[j] = 0;
                currentLeft = j + 1;
            }
        }

        // 更新右边界
        for (let j = cols - 1; j >= 0; j--) {
            if (matrix[i][j] === '1') {
                right[j] = Math.min(right[j], currentRight);
            } else {
                right[j] = cols;
                currentRight = j;
            }
        }

        // 计算面积
        for (let j = 0; j < cols; j++) {
            maxArea = Math.max(maxArea, (right[j] - left[j]) * height[j]);
        }
    }

    return maxArea;
}

// 测试用例
function runTests() {
    console.log('===== 练习题1：下一个更大元素 I =====');
    const testCases1 = [
        { nums1: [4,1,2], nums2: [1,3,4,2], expected: [-1,3,-1] },
        { nums1: [2,4], nums2: [1,2,3,4], expected: [3,-1] }
    ];
    testCases1.forEach(({ nums1, nums2, expected }, index) => {
        const result1 = nextGreaterElement(nums1, nums2);
        const result2 = nextGreaterElementBruteForce(nums1, nums2);
        console.log(`测试用例${index+1}:`);
        console.log(`  单调栈解法: ${result1.join(', ')} ${JSON.stringify(result1) === JSON.stringify(expected) ? '✓' : '✗'}`);
        console.log(`  暴力解法: ${result2.join(', ')} ${JSON.stringify(result2) === JSON.stringify(expected) ? '✓' : '✗'}`);
    });

    console.log('\n===== 练习题2：每日温度 =====');
    const testCases2 = [
        { temps: [73,74,75,71,69,72,76,73], expected: [1,1,4,2,1,1,0,0] },
        { temps: [30,40,50,60], expected: [1,1,1,0] },
        { temps: [30,60,90], expected: [1,1,0] }
    ];
    testCases2.forEach(({ temps, expected }, index) => {
        const result1 = dailyTemperatures(temps);
        const result2 = dailyTemperaturesBackward(temps);
        console.log(`测试用例${index+1}:`);
        console.log(`  单调栈解法: ${result1.join(', ')} ${JSON.stringify(result1) === JSON.stringify(expected) ? '✓' : '✗'}`);
        console.log(`  从后往前解法: ${result2.join(', ')} ${JSON.stringify(result2) === JSON.stringify(expected) ? '✓' : '✗'}`);
    });

    console.log('\n===== 练习题3：柱状图中最大的矩形 =====');
    const testCases3 = [
        { heights: [2,1,5,6,2,3], expected: 10 },
        { heights: [2,4], expected: 4 },
        { heights: [1], expected: 1 },
        { heights: [0,0], expected: 0 }
    ];
    testCases3.forEach(({ heights, expected }, index) => {
        const result1 = largestRectangleArea(heights);
        const result2 = largestRectangleAreaDivideConquer(heights);
        console.log(`测试用例${index+1}:`);
        console.log(`  单调栈解法: ${result1} ${result1 === expected ? '✓' : '✗'}`);
        console.log(`  分治解法: ${result2} ${result2 === expected ? '✓' : '✗'}`);
    });

    console.log('\n===== 练习题4：接雨水 =====');
    const testCases4 = [
        { height: [0,1,0,2,1,0,1,3,2,1,2,1], expected: 6 },
        { height: [4,2,0,3,2,5], expected: 9 },
        { height: [2,0,3], expected: 2 }
    ];
    testCases4.forEach(({ height, expected }, index) => {
        const result1 = trap(height);
        const result2 = trapTwoPointers(height);
        console.log(`测试用例${index+1}:`);
        console.log(`  单调栈解法: ${result1} ${result1 === expected ? '✓' : '✗'}`);
        console.log(`  双指针解法: ${result2} ${result2 === expected ? '✓' : '✗'}`);
    });

    console.log('\n===== 练习题5：最大矩形 =====');
    const testCases5 = [
        {
            matrix: [
                ["1","0","1","0","0"],
                ["1","0","1","1","1"],
                ["1","1","1","1","1"],
                ["1","0","0","1","0"]
            ],
            expected: 6
        },
        {
            matrix: [[]],
            expected: 0
        },
        {
            matrix: [["0"]],
            expected: 0
        },
        {
            matrix: [["1"]],
            expected: 1
        }
    ];
    testCases5.forEach(({ matrix, expected }, index) => {
        const result1 = maximalRectangle(matrix);
        const result2 = maximalRectangleDP(matrix);
        console.log(`测试用例${index+1}:`);
        console.log(`  单调栈解法: ${result1} ${result1 === expected ? '✓' : '✗'}`);
        console.log(`  动态规划解法: ${result2} ${result2 === expected ? '✓' : '✗'}`);
    });
}

// 导出模块
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        nextGreaterElement,
        nextGreaterElementBruteForce,
        dailyTemperatures,
        dailyTemperaturesBackward,
        largestRectangleArea,
        largestRectangleAreaDivideConquer,
        trap,
        trapTwoPointers,
        maximalRectangle,
        maximalRectangleDP
    };
}

// 运行测试
if (typeof window !== 'undefined') {
    console.log('===== 第18章 单调栈 - 练习题解答 =====');
    runTests();
}