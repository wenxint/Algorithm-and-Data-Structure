/**
 * LeetCode 42: 接雨水
 * 难度：困难
 *
 * 核心思想：柱状图积水问题
 * 给定n个非负整数表示每个宽度为1的柱子的高度图，计算按此排列的柱子，下雨之后能够积存多少雨水
 *
 * 关键观察：每个位置能接的雨水量 = min(左侧最大高度, 右侧最大高度) - 当前高度
 * 前提：左侧最大高度 > 当前高度 且 右侧最大高度 > 当前高度
 *
 * 算法思想：
 * 1. 暴力法：对每个位置都计算左右最大值
 * 2. 动态规划：预计算所有位置的左右最大值
 * 3. 双指针：优化空间，从两端向中间计算
 * 4. 单调栈：利用栈维护递减序列，计算凹槽积水
 *
 * @param {number[]} height - 柱子高度数组
 * @returns {number} 能接的雨水总量
 */

/**
 * 方法一：暴力法
 * 核心思想：对每个位置，找到其左侧和右侧的最大高度，计算该位置能接的雨水
 *
 * @param {number[]} height - 柱子高度数组
 * @returns {number} 雨水总量
 * @time O(n²) 每个位置都要遍历左右两侧
 * @space O(1) 只用常量额外空间
 */
function trapBruteForce(height) {
    if (!height || height.length < 3) return 0;

    let totalWater = 0;
    const n = height.length;

    // 遍历每个位置（跳过首尾，它们无法积水）
    for (let i = 1; i < n - 1; i++) {
        // 找左侧最大高度
        let leftMax = 0;
        for (let j = 0; j < i; j++) {
            leftMax = Math.max(leftMax, height[j]);
        }

        // 找右侧最大高度
        let rightMax = 0;
        for (let j = i + 1; j < n; j++) {
            rightMax = Math.max(rightMax, height[j]);
        }

        // 计算当前位置能接的雨水
        const waterLevel = Math.min(leftMax, rightMax);
        if (waterLevel > height[i]) {
            totalWater += waterLevel - height[i];
        }
    }

    return totalWater;
}

/**
 * 方法二：动态规划（预计算优化）
 * 核心思想：预先计算每个位置的左侧最大值和右侧最大值，避免重复计算
 *
 * @param {number[]} height - 柱子高度数组
 * @returns {number} 雨水总量
 * @time O(n) 三次遍历
 * @space O(n) 需要两个辅助数组
 */
function trapDP(height) {
    if (!height || height.length < 3) return 0;

    const n = height.length;
    const leftMax = new Array(n);
    const rightMax = new Array(n);

    // 预计算左侧最大值
    leftMax[0] = height[0];
    for (let i = 1; i < n; i++) {
        leftMax[i] = Math.max(leftMax[i - 1], height[i]);
    }

    // 预计算右侧最大值
    rightMax[n - 1] = height[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i + 1], height[i]);
    }

    // 计算雨水总量
    let totalWater = 0;
    for (let i = 0; i < n; i++) {
        const waterLevel = Math.min(leftMax[i], rightMax[i]);
        totalWater += Math.max(0, waterLevel - height[i]);
    }

    return totalWater;
}

/**
 * 方法三：双指针（空间优化）
 * 核心思想：从两端向中间移动，利用较小的一侧来决定积水量
 *
 * 关键观察：
 * - 如果左侧最大值 < 右侧最大值，那么左指针位置的积水只取决于左侧最大值
 * - 如果右侧最大值 < 左侧最大值，那么右指针位置的积水只取决于右侧最大值
 *
 * @param {number[]} height - 柱子高度数组
 * @returns {number} 雨水总量
 * @time O(n) 一次遍历
 * @space O(1) 只用常量额外空间
 */
function trapTwoPointers(height) {
    if (!height || height.length < 3) return 0;

    let left = 0, right = height.length - 1;
    let leftMax = 0, rightMax = 0;
    let totalWater = 0;

    while (left < right) {
        if (height[left] < height[right]) {
            // 左侧较低，处理左指针
            if (height[left] >= leftMax) {
                leftMax = height[left];  // 更新左侧最大值
            } else {
                // 当前位置可以积水
                totalWater += leftMax - height[left];
            }
            left++;
        } else {
            // 右侧较低，处理右指针
            if (height[right] >= rightMax) {
                rightMax = height[right];  // 更新右侧最大值
            } else {
                // 当前位置可以积水
                totalWater += rightMax - height[right];
            }
            right--;
        }
    }

    return totalWater;
}

/**
 * 方法四：单调栈
 * 核心思想：维护一个递减的单调栈，当遇到更高的柱子时，计算凹槽的积水
 *
 * 算法步骤：
 * 1. 维护一个存储索引的递减栈
 * 2. 当前高度大于栈顶高度时，说明形成了凹槽
 * 3. 弹出栈顶作为凹槽底部，计算该层的积水量
 * 4. 重复直到栈为空或当前高度不大于栈顶
 *
 * @param {number[]} height - 柱子高度数组
 * @returns {number} 雨水总量
 * @time O(n) 每个元素最多入栈出栈一次
 * @space O(n) 栈的最大空间
 */
function trapMonotonicStack(height) {
    if (!height || height.length < 3) return 0;

    const stack = [];  // 存储索引的单调递减栈
    let totalWater = 0;

    for (let i = 0; i < height.length; i++) {
        // 当当前高度大于栈顶高度时，可能形成凹槽
        while (stack.length > 0 && height[i] > height[stack[stack.length - 1]]) {
            const bottomIndex = stack.pop();  // 凹槽底部

            if (stack.length === 0) break;    // 没有左边界，无法积水

            const leftIndex = stack[stack.length - 1];  // 左边界
            const rightIndex = i;                       // 右边界

            // 计算积水区域
            const width = rightIndex - leftIndex - 1;
            const waterHeight = Math.min(height[leftIndex], height[rightIndex]) - height[bottomIndex];

            totalWater += width * waterHeight;
        }

        stack.push(i);  // 当前索引入栈
    }

    return totalWater;
}

/**
 * 扩展：接雨水 II（二维版本）
 * 核心思想：使用优先队列（最小堆）从边界开始向内扩展
 *
 * @param {number[][]} heightMap - 二维高度图
 * @returns {number} 雨水总量
 * @time O(mn * log(mn))
 * @space O(mn)
 */
function trapRainWater2D(heightMap) {
    if (!heightMap || heightMap.length === 0 || heightMap[0].length === 0) return 0;

    const m = heightMap.length;
    const n = heightMap[0].length;

    if (m < 3 || n < 3) return 0;

    // 简化版最小堆实现
    class MinHeap {
        constructor() {
            this.heap = [];
        }

        push(item) {
            this.heap.push(item);
            this.bubbleUp(this.heap.length - 1);
        }

        pop() {
            if (this.heap.length === 0) return null;
            if (this.heap.length === 1) return this.heap.pop();

            const min = this.heap[0];
            this.heap[0] = this.heap.pop();
            this.bubbleDown(0);
            return min;
        }

        bubbleUp(index) {
            while (index > 0) {
                const parentIndex = Math.floor((index - 1) / 2);
                if (this.heap[parentIndex].height <= this.heap[index].height) break;

                [this.heap[parentIndex], this.heap[index]] =
                [this.heap[index], this.heap[parentIndex]];
                index = parentIndex;
            }
        }

        bubbleDown(index) {
            while (true) {
                let minIndex = index;
                const leftChild = 2 * index + 1;
                const rightChild = 2 * index + 2;

                if (leftChild < this.heap.length &&
                    this.heap[leftChild].height < this.heap[minIndex].height) {
                    minIndex = leftChild;
                }

                if (rightChild < this.heap.length &&
                    this.heap[rightChild].height < this.heap[minIndex].height) {
                    minIndex = rightChild;
                }

                if (minIndex === index) break;

                [this.heap[index], this.heap[minIndex]] =
                [this.heap[minIndex], this.heap[index]];
                index = minIndex;
            }
        }

        isEmpty() {
            return this.heap.length === 0;
        }
    }

    const heap = new MinHeap();
    const visited = Array(m).fill(null).map(() => Array(n).fill(false));

    // 将边界节点加入堆
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (i === 0 || i === m - 1 || j === 0 || j === n - 1) {
                heap.push({i, j, height: heightMap[i][j]});
                visited[i][j] = true;
            }
        }
    }

    let totalWater = 0;
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];

    // 从边界向内扩展
    while (!heap.isEmpty()) {
        const {i, j, height} = heap.pop();

        for (const [di, dj] of directions) {
            const ni = i + di;
            const nj = j + dj;

            if (ni >= 0 && ni < m && nj >= 0 && nj < n && !visited[ni][nj]) {
                // 积水量 = max(0, 当前水位 - 地面高度)
                totalWater += Math.max(0, height - heightMap[ni][nj]);

                // 新位置的水位 = max(地面高度, 当前水位)
                heap.push({
                    i: ni,
                    j: nj,
                    height: Math.max(heightMap[ni][nj], height)
                });
                visited[ni][nj] = true;
            }
        }
    }

    return totalWater;
}

/**
 * 扩展：柱状图中最大的矩形
 * 核心思想：与接雨水类似，使用单调栈找到每个柱子能形成的最大矩形
 *
 * @param {number[]} heights - 柱子高度数组
 * @returns {number} 最大矩形面积
 * @time O(n)
 * @space O(n)
 */
function largestRectangleArea(heights) {
    const stack = [];
    let maxArea = 0;

    // 在末尾添加一个高度为0的柱子，确保所有柱子都被处理
    heights.push(0);

    for (let i = 0; i < heights.length; i++) {
        while (stack.length > 0 && heights[i] < heights[stack[stack.length - 1]]) {
            const height = heights[stack.pop()];
            const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }

    heights.pop();  // 恢复原数组
    return maxArea;
}

/**
 * 扩展：容器积水（两个指针版本）
 * 核心思想：双指针找到能容纳最多水的两条线
 *
 * @param {number[]} height - 柱子高度数组
 * @returns {number} 最大容水量
 * @time O(n)
 * @space O(1)
 */
function maxArea(height) {
    let left = 0, right = height.length - 1;
    let maxWater = 0;

    while (left < right) {
        const width = right - left;
        const currentWater = width * Math.min(height[left], height[right]);
        maxWater = Math.max(maxWater, currentWater);

        // 移动较短的一边
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }

    return maxWater;
}

/**
 * 工具函数：可视化显示接雨水结果
 * @param {number[]} height - 柱子高度数组
 * @param {number} totalWater - 总积水量
 */
function visualizeTrap(height, totalWater) {
    if (!height || height.length === 0) {
        console.log("空数组");
        return;
    }

    const maxHeight = Math.max(...height);
    console.log(`柱子高度: [${height.join(', ')}]`);
    console.log(`总积水量: ${totalWater}`);
    console.log("可视化图:");

    // 计算每个位置的积水
    const leftMax = new Array(height.length);
    const rightMax = new Array(height.length);

    leftMax[0] = height[0];
    for (let i = 1; i < height.length; i++) {
        leftMax[i] = Math.max(leftMax[i - 1], height[i]);
    }

    rightMax[height.length - 1] = height[height.length - 1];
    for (let i = height.length - 2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i + 1], height[i]);
    }

    const water = new Array(height.length);
    for (let i = 0; i < height.length; i++) {
        const waterLevel = Math.min(leftMax[i], rightMax[i]);
        water[i] = Math.max(0, waterLevel - height[i]);
    }

    // 从上到下绘制
    for (let level = maxHeight; level >= 1; level--) {
        let line = "";
        for (let i = 0; i < height.length; i++) {
            const totalHeight = height[i] + water[i];
            if (height[i] >= level) {
                line += "█";  // 柱子
            } else if (totalHeight >= level) {
                line += "~";  // 水
            } else {
                line += " ";  // 空气
            }
        }
        console.log(line);
    }

    console.log("█".repeat(height.length));  // 地面
}

// ================================
// 测试函数
// ================================

/**
 * 测试接雨水的各种解法
 */
function testTrapRainWater() {
    console.log("=== 接雨水 测试 ===\n");

    const testCases = [
        {
            height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
            expected: 6,
            desc: "标准测试用例"
        },
        {
            height: [4, 2, 0, 3, 2, 5],
            expected: 9,
            desc: "深度凹槽"
        },
        {
            height: [3, 0, 2, 0, 4],
            expected: 7,
            desc: "多个凹槽"
        },
        {
            height: [1, 2, 3, 4, 5],
            expected: 0,
            desc: "递增序列"
        },
        {
            height: [5, 4, 3, 2, 1],
            expected: 0,
            desc: "递减序列"
        },
        {
            height: [2, 0, 2],
            expected: 2,
            desc: "简单凹槽"
        },
        {
            height: [3, 2, 1, 2, 3],
            expected: 4,
            desc: "V型结构"
        }
    ];

    const methods = [
        {name: "暴力法", func: trapBruteForce},
        {name: "动态规划", func: trapDP},
        {name: "双指针", func: trapTwoPointers},
        {name: "单调栈", func: trapMonotonicStack}
    ];

    methods.forEach((method, methodIndex) => {
        console.log(`${methodIndex + 1}. ${method.name}测试:`);

        testCases.forEach((testCase, index) => {
            const result = method.func([...testCase.height]);
            const isCorrect = result === testCase.expected;
            const status = isCorrect ? "✅" : "❌";
            console.log(`  测试 ${index + 1}: ${status} [${testCase.height.join(',')}] => ${result} (期望: ${testCase.expected}) - ${testCase.desc}`);
        });

        console.log("");
    });

    console.log("3. 可视化展示:");
    const visualExample = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
    const result = trapTwoPointers(visualExample);
    visualizeTrap(visualExample, result);

    console.log("\n4. 扩展功能测试:");

    // 测试二维接雨水
    console.log("二维接雨水:");
    const heightMap = [
        [1, 4, 3, 1, 3, 2],
        [3, 2, 1, 3, 2, 4],
        [2, 3, 3, 2, 3, 1]
    ];
    const result2D = trapRainWater2D(heightMap);
    console.log(`  二维地图积水量: ${result2D}`);

    // 测试最大矩形面积
    console.log("\n柱状图最大矩形:");
    const rectHeights = [2, 1, 5, 6, 2, 3];
    const maxRect = largestRectangleArea([...rectHeights]);
    console.log(`  高度 [${rectHeights.join(',')}] => 最大矩形面积: ${maxRect}`);

    // 测试容器积水
    console.log("\n容器最大积水:");
    const containerHeights = [1, 8, 6, 2, 5, 4, 8, 3, 7];
    const maxContainer = maxArea(containerHeights);
    console.log(`  高度 [${containerHeights.join(',')}] => 最大容水量: ${maxContainer}`);

    console.log("\n=== 测试完成 ===");
}

// 性能测试
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    // 生成大型测试数据
    const generateTestData = (size) => {
        const data = [];
        for (let i = 0; i < size; i++) {
            data.push(Math.floor(Math.random() * 100));
        }
        return data;
    };

    const largeData = generateTestData(10000);
    console.log("测试数据大小: 10000");

    const methods = [
        {name: "动态规划", func: trapDP},
        {name: "双指针", func: trapTwoPointers},
        {name: "单调栈", func: trapMonotonicStack}
    ];

    methods.forEach(method => {
        console.time(method.name);
        method.func([...largeData]);
        console.timeEnd(method.name);
    });

    // 暴力法太慢，用小数据测试
    const smallData = generateTestData(1000);
    console.log("\n暴力法测试数据大小: 1000");
    console.time("暴力法");
    trapBruteForce([...smallData]);
    console.timeEnd("暴力法");
}

// 算法复杂度分析
function complexityAnalysis() {
    console.log("\n=== 算法复杂度分析 ===");
    console.log("1. 暴力法:");
    console.log("   时间复杂度: O(n²) - 每个位置都要找左右最大值");
    console.log("   空间复杂度: O(1) - 只用常量额外空间");
    console.log("");
    console.log("2. 动态规划:");
    console.log("   时间复杂度: O(n) - 三次线性遍历");
    console.log("   空间复杂度: O(n) - 需要两个辅助数组");
    console.log("");
    console.log("3. 双指针:");
    console.log("   时间复杂度: O(n) - 一次遍历");
    console.log("   空间复杂度: O(1) - 只用常量额外空间");
    console.log("");
    console.log("4. 单调栈:");
    console.log("   时间复杂度: O(n) - 每个元素最多入栈出栈一次");
    console.log("   空间复杂度: O(n) - 栈的空间");
    console.log("");
    console.log("5. 关键设计思想:");
    console.log("   - 暴力法：直接模拟，找每个位置的左右最大值");
    console.log("   - 动态规划：预计算优化，避免重复计算");
    console.log("   - 双指针：空间优化，利用两端信息推导中间结果");
    console.log("   - 单调栈：按层计算，利用栈结构处理凹槽模式");
    console.log("");
    console.log("6. 算法选择建议:");
    console.log("   - 面试推荐：双指针法（时空复杂度最优）");
    console.log("   - 理解推荐：动态规划（思路清晰）");
    console.log("   - 扩展推荐：单调栈（可解决相关问题）");
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        trapBruteForce,
        trapDP,
        trapTwoPointers,
        trapMonotonicStack,
        trapRainWater2D,
        largestRectangleArea,
        maxArea,
        visualizeTrap,
        testTrapRainWater,
        performanceTest,
        complexityAnalysis
    };
} else {
    // 浏览器环境下运行测试
    testTrapRainWater();
    // performanceTest(); // 可选的性能测试
    // complexityAnalysis(); // 可选的复杂度分析
}