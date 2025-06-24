/**
 * LeetCode 030: 螺旋矩阵 (Spiral Matrix)
 *
 * 题目描述：
 * 给你一个 m 行 n 列的矩阵 matrix，请按照顺时针螺旋顺序，返回矩阵中的所有元素。
 *
 * 核心思想：
 * 边界控制模拟 - 按照右→下→左→上的顺序遍历，动态调整边界
 * 关键洞察：螺旋遍历就是在不断缩小的矩形边界内按固定方向移动
 *
 * 算法原理：
 * 1. 维护四个边界：top, bottom, left, right
 * 2. 按顺序遍历：右、下、左、上
 * 3. 每完成一个方向的遍历，调整对应边界
 * 4. 当边界交叉时结束遍历（top > bottom 或 left > right）
 */

/**
 * 方法一：边界模拟法（推荐）
 *
 * 核心思想：
 * 维护四个边界变量，按螺旋方向遍历并动态调整边界
 *
 * 算法步骤：
 * 1. 初始化四个边界：top=0, bottom=m-1, left=0, right=n-1
 * 2. 从左到右遍历top行，然后top++
 * 3. 从上到下遍历right列，然后right--
 * 4. 从右到左遍历bottom行，然后bottom--
 * 5. 从下到上遍历left列，然后left++
 * 6. 重复2-5步骤直到边界交叉
 *
 * @param {number[][]} matrix - 二维矩阵
 * @returns {number[]} 螺旋顺序的元素数组
 * @time O(m*n) - 需要访问每个元素一次
 * @space O(1) - 不考虑输出数组的空间复杂度
 */
function spiralOrder(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return [];
    }

    const m = matrix.length;
    const n = matrix[0].length;
    const result = [];

    // 初始化边界
    let top = 0, bottom = m - 1;
    let left = 0, right = n - 1;

    while (top <= bottom && left <= right) {
        // 1. 从左到右遍历上边界
        for (let col = left; col <= right; col++) {
            result.push(matrix[top][col]);
        }
        top++; // 上边界下移

        // 2. 从上到下遍历右边界
        for (let row = top; row <= bottom; row++) {
            result.push(matrix[row][right]);
        }
        right--; // 右边界左移

        // 3. 从右到左遍历下边界（如果还有行）
        if (top <= bottom) {
            for (let col = right; col >= left; col--) {
                result.push(matrix[bottom][col]);
            }
            bottom--; // 下边界上移
        }

        // 4. 从下到上遍历左边界（如果还有列）
        if (left <= right) {
            for (let row = bottom; row >= top; row--) {
                result.push(matrix[row][left]);
            }
            left++; // 左边界右移
        }
    }

    return result;
}

/**
 * 方法二：方向数组法
 *
 * 核心思想：
 * 使用方向数组表示移动方向，遇到边界或已访问元素时转向
 *
 * @param {number[][]} matrix - 二维矩阵
 * @returns {number[]} 螺旋顺序的元素数组
 * @time O(m*n) - 需要访问每个元素一次
 * @space O(m*n) - 需要标记已访问的元素
 */
function spiralOrderWithDirection(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return [];
    }

    const m = matrix.length;
    const n = matrix[0].length;
    const result = [];
    const visited = Array.from({length: m}, () => new Array(n).fill(false));

    // 方向数组：右、下、左、上
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    let directionIndex = 0; // 当前方向索引

    let row = 0, col = 0;

    for (let i = 0; i < m * n; i++) {
        result.push(matrix[row][col]);
        visited[row][col] = true;

        // 计算下一个位置
        const nextRow = row + directions[directionIndex][0];
        const nextCol = col + directions[directionIndex][1];

        // 检查是否需要转向
        if (nextRow < 0 || nextRow >= m || nextCol < 0 || nextCol >= n || visited[nextRow][nextCol]) {
            // 转向：切换到下一个方向
            directionIndex = (directionIndex + 1) % 4;
        }

        // 更新位置
        row += directions[directionIndex][0];
        col += directions[directionIndex][1];
    }

    return result;
}

/**
 * 方法三：递归法
 *
 * 核心思想：
 * 递归地处理外圈和内圈，每次处理完外圈后递归处理内圈
 *
 * @param {number[][]} matrix - 二维矩阵
 * @returns {number[]} 螺旋顺序的元素数组
 * @time O(m*n) - 需要访问每个元素一次
 * @space O(min(m,n)) - 递归栈深度
 */
function spiralOrderRecursive(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return [];
    }

    const result = [];

    function spiral(top, bottom, left, right) {
        if (top > bottom || left > right) {
            return;
        }

        // 处理当前层的螺旋遍历
        // 上边：从左到右
        for (let col = left; col <= right; col++) {
            result.push(matrix[top][col]);
        }

        // 右边：从上到下
        for (let row = top + 1; row <= bottom; row++) {
            result.push(matrix[row][right]);
        }

        // 下边：从右到左（如果有多行）
        if (top < bottom) {
            for (let col = right - 1; col >= left; col--) {
                result.push(matrix[bottom][col]);
            }
        }

        // 左边：从下到上（如果有多列）
        if (left < right) {
            for (let row = bottom - 1; row > top; row--) {
                result.push(matrix[row][left]);
            }
        }

        // 递归处理内层
        spiral(top + 1, bottom - 1, left + 1, right - 1);
    }

    spiral(0, matrix.length - 1, 0, matrix[0].length - 1);
    return result;
}

/**
 * 方法四：状态机法
 *
 * 核心思想：
 * 使用状态机来控制移动方向和边界检查
 *
 * @param {number[][]} matrix - 二维矩阵
 * @returns {number[]} 螺旋顺序的元素数组
 * @time O(m*n) - 需要访问每个元素一次
 * @space O(m*n) - 需要标记已访问的元素
 */
function spiralOrderStateMachine(matrix) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return [];
    }

    const m = matrix.length;
    const n = matrix[0].length;
    const result = [];
    const visited = Array.from({length: m}, () => new Array(n).fill(false));

    const states = {
        RIGHT: 'right',
        DOWN: 'down',
        LEFT: 'left',
        UP: 'up'
    };

    let currentState = states.RIGHT;
    let row = 0, col = 0;

    for (let i = 0; i < m * n; i++) {
        result.push(matrix[row][col]);
        visited[row][col] = true;

        let nextRow = row, nextCol = col;

        // 根据当前状态确定下一步移动
        switch (currentState) {
            case states.RIGHT:
                nextCol++;
                if (nextCol >= n || visited[nextRow][nextCol]) {
                    currentState = states.DOWN;
                    nextRow++;
                    nextCol = col;
                }
                break;
            case states.DOWN:
                nextRow++;
                if (nextRow >= m || visited[nextRow][nextCol]) {
                    currentState = states.LEFT;
                    nextCol--;
                    nextRow = row;
                }
                break;
            case states.LEFT:
                nextCol--;
                if (nextCol < 0 || visited[nextRow][nextCol]) {
                    currentState = states.UP;
                    nextRow--;
                    nextCol = col;
                }
                break;
            case states.UP:
                nextRow--;
                if (nextRow < 0 || visited[nextRow][nextCol]) {
                    currentState = states.RIGHT;
                    nextCol++;
                    nextRow = row;
                }
                break;
        }

        row = nextRow;
        col = nextCol;
    }

    return result;
}

// 测试用例
function runTests() {
    console.log("=== 螺旋矩阵测试 ===\n");

    const testCases = [
        {
            matrix: [[1,2,3],[4,5,6],[7,8,9]],
            expected: [1,2,3,6,9,8,7,4,5],
            description: "3x3矩阵"
        },
        {
            matrix: [[1,2,3,4],[5,6,7,8],[9,10,11,12]],
            expected: [1,2,3,4,8,12,11,10,9,5,6,7],
            description: "3x4矩阵"
        },
        {
            matrix: [[1,2,3],[4,5,6]],
            expected: [1,2,3,6,5,4],
            description: "2x3矩阵"
        },
        {
            matrix: [[1],[2],[3]],
            expected: [1,2,3],
            description: "单列矩阵"
        },
        {
            matrix: [[1,2,3,4,5]],
            expected: [1,2,3,4,5],
            description: "单行矩阵"
        },
        {
            matrix: [[1]],
            expected: [1],
            description: "单元素矩阵"
        },
        {
            matrix: [[1,2],[3,4]],
            expected: [1,2,4,3],
            description: "2x2矩阵"
        }
    ];

    const methods = [
        { name: "边界模拟", func: spiralOrder },
        { name: "方向数组", func: spiralOrderWithDirection },
        { name: "递归法", func: spiralOrderRecursive }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`输入矩阵:`);
        testCase.matrix.forEach(row => console.log(`  [${row.join(', ')}]`));
        console.log(`期望: [${testCase.expected.join(', ')}]`);

        methods.forEach(method => {
            const result = method.func(testCase.matrix.map(row => [...row]));
            const isCorrect = JSON.stringify(result) === JSON.stringify(testCase.expected);
            const status = isCorrect ? "✓" : "✗";
            console.log(`${method.name}: [${result.join(', ')}] ${status}`);
        });
        console.log();
    });
}

// 性能测试
function performanceTest() {
    console.log("=== 性能测试 ===\n");

    const sizes = [
        {m: 10, n: 10},
        {m: 50, n: 50},
        {m: 100, n: 100}
    ];

    sizes.forEach(({m, n}) => {
        // 生成随机矩阵
        const matrix = Array.from({length: m}, (_, i) =>
            Array.from({length: n}, (_, j) => i * n + j + 1)
        );

        console.log(`矩阵大小: ${m}x${n}`);

        const methods = [
            { name: "边界模拟", func: spiralOrder },
            { name: "方向数组", func: spiralOrderWithDirection },
            { name: "递归法", func: spiralOrderRecursive }
        ];

        methods.forEach(method => {
            const start = performance.now();
            method.func(matrix.map(row => [...row]));
            const end = performance.now();
            console.log(`${method.name}: ${(end - start).toFixed(4)}ms`);
        });
        console.log();
    });
}

// 算法演示
function demonstrateAlgorithm() {
    console.log("=== 边界模拟算法演示 ===\n");

    const matrix = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12]
    ];

    console.log("输入矩阵:");
    matrix.forEach((row, i) => {
        console.log(`  [${row.join(', ').padEnd(12)}] <- 行${i}`);
    });
    console.log("   ^  ^   ^   ^");
    console.log("   0  1   2   3 (列索引)");
    console.log();

    const result = [];
    let top = 0, bottom = 2, left = 0, right = 3;
    let step = 1;

    console.log("执行过程:");
    console.log(`初始边界: top=${top}, bottom=${bottom}, left=${left}, right=${right}`);
    console.log();

    while (top <= bottom && left <= right) {
        console.log(`步骤 ${step}: 从左到右遍历上边界 (行${top})`);
        for (let col = left; col <= right; col++) {
            result.push(matrix[top][col]);
            console.log(`  添加 matrix[${top}][${col}] = ${matrix[top][col]}`);
        }
        top++;
        console.log(`  上边界下移: top = ${top}`);
        console.log(`  当前结果: [${result.join(', ')}]`);
        console.log();
        step++;

        if (top > bottom) break;

        console.log(`步骤 ${step}: 从上到下遍历右边界 (列${right})`);
        for (let row = top; row <= bottom; row++) {
            result.push(matrix[row][right]);
            console.log(`  添加 matrix[${row}][${right}] = ${matrix[row][right]}`);
        }
        right--;
        console.log(`  右边界左移: right = ${right}`);
        console.log(`  当前结果: [${result.join(', ')}]`);
        console.log();
        step++;

        if (left > right) break;

        if (top <= bottom) {
            console.log(`步骤 ${step}: 从右到左遍历下边界 (行${bottom})`);
            for (let col = right; col >= left; col--) {
                result.push(matrix[bottom][col]);
                console.log(`  添加 matrix[${bottom}][${col}] = ${matrix[bottom][col]}`);
            }
            bottom--;
            console.log(`  下边界上移: bottom = ${bottom}`);
            console.log(`  当前结果: [${result.join(', ')}]`);
            console.log();
            step++;
        }

        if (left <= right) {
            console.log(`步骤 ${step}: 从下到上遍历左边界 (列${left})`);
            for (let row = bottom; row >= top; row--) {
                result.push(matrix[row][left]);
                console.log(`  添加 matrix[${row}][${left}] = ${matrix[row][left]}`);
            }
            left++;
            console.log(`  左边界右移: left = ${left}`);
            console.log(`  当前结果: [${result.join(', ')}]`);
            console.log();
            step++;
        }
    }

    console.log(`最终结果: [${result.join(', ')}]`);
}

// 边界情况分析
function edgeCaseAnalysis() {
    console.log("=== 边界情况分析 ===\n");

    const edgeCases = [
        {
            case: "空矩阵",
            matrix: [],
            analysis: "返回空数组"
        },
        {
            case: "空行矩阵",
            matrix: [[]],
            analysis: "每行为空，返回空数组"
        },
        {
            case: "单元素",
            matrix: [[42]],
            analysis: "只有一个元素，直接返回"
        },
        {
            case: "单行",
            matrix: [[1, 2, 3, 4, 5]],
            analysis: "只需从左到右遍历"
        },
        {
            case: "单列",
            matrix: [[1], [2], [3], [4]],
            analysis: "只需从上到下遍历"
        },
        {
            case: "方形矩阵",
            matrix: [[1, 2], [3, 4]],
            analysis: "标准的螺旋遍历"
        }
    ];

    edgeCases.forEach(({case: caseName, matrix, analysis}) => {
        console.log(`${caseName}:`);
        if (matrix.length > 0 && matrix[0].length > 0) {
            matrix.forEach(row => console.log(`  [${row.join(', ')}]`));
            const result = spiralOrder(JSON.parse(JSON.stringify(matrix)));
            console.log(`结果: [${result.join(', ')}]`);
        } else {
            console.log("  空矩阵");
            const result = spiralOrder(matrix);
            console.log(`结果: [${result.join(', ')}]`);
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
            name: "边界模拟",
            time: "O(m×n)",
            space: "O(1)",
            description: "最优解法，只需常数额外空间"
        },
        {
            name: "方向数组",
            time: "O(m×n)",
            space: "O(m×n)",
            description: "需要标记已访问元素"
        },
        {
            name: "递归法",
            time: "O(m×n)",
            space: "O(min(m,n))",
            description: "递归栈深度为较小维度"
        },
        {
            name: "状态机",
            time: "O(m×n)",
            space: "O(m×n)",
            description: "需要访问标记数组"
        }
    ];

    console.log("算法复杂度对比：");
    console.log("算法名称".padEnd(12) + "时间复杂度".padEnd(12) + "空间复杂度".padEnd(15) + "特点");
    console.log("-".repeat(60));

    methods.forEach(method => {
        console.log(
            method.name.padEnd(12) +
            method.time.padEnd(12) +
            method.space.padEnd(15) +
            method.description
        );
    });
}

// 扩展应用
function extendedApplications() {
    console.log("=== 扩展应用 ===\n");

    console.log("1. 螺旋矩阵II - 生成螺旋矩阵");
    console.log("   问题：给定n，生成nxn的螺旋矩阵");
    console.log("   解法：使用相同的边界控制技术");
    console.log();

    console.log("2. 图像处理");
    console.log("   应用：螺旋扫描、图像压缩、特效处理");
    console.log("   场景：从中心向外扩展的动画效果");
    console.log();

    console.log("3. 数据遍历模式");
    console.log("   应用：游戏地图遍历、迷宫求解");
    console.log("   扩展：不同的遍历模式（Z字形、蛇形等）");
    console.log();

    console.log("4. 内存访问优化");
    console.log("   应用：缓存友好的数据访问模式");
    console.log("   优势：提高数据局部性，减少缓存未命中");
}

// 实际应用示例
function practicalExamples() {
    console.log("=== 实际应用示例 ===\n");

    // 示例1：生成螺旋矩阵
    console.log("1. 生成螺旋矩阵");
    function generateSpiralMatrix(n) {
        const matrix = Array.from({length: n}, () => new Array(n));
        let top = 0, bottom = n - 1, left = 0, right = n - 1;
        let num = 1;

        while (top <= bottom && left <= right) {
            for (let col = left; col <= right; col++) {
                matrix[top][col] = num++;
            }
            top++;

            for (let row = top; row <= bottom; row++) {
                matrix[row][right] = num++;
            }
            right--;

            if (top <= bottom) {
                for (let col = right; col >= left; col--) {
                    matrix[bottom][col] = num++;
                }
                bottom--;
            }

            if (left <= right) {
                for (let row = bottom; row >= top; row--) {
                    matrix[row][left] = num++;
                }
                left++;
            }
        }

        console.log(`生成${n}x${n}螺旋矩阵:`);
        matrix.forEach(row => console.log(`  [${row.join('\t')}]`));
        return matrix;
    }

    generateSpiralMatrix(4);
    console.log();

    // 示例2：矩阵旋转遍历
    console.log("2. 矩阵按层遍历");
    function traverseByLayers(matrix) {
        const layers = [];
        const m = matrix.length, n = matrix[0].length;
        let top = 0, bottom = m - 1, left = 0, right = n - 1;

        while (top <= bottom && left <= right) {
            const layer = [];

            // 当前层的螺旋遍历
            for (let col = left; col <= right; col++) {
                layer.push(matrix[top][col]);
            }
            for (let row = top + 1; row <= bottom; row++) {
                layer.push(matrix[row][right]);
            }
            if (top < bottom) {
                for (let col = right - 1; col >= left; col--) {
                    layer.push(matrix[bottom][col]);
                }
            }
            if (left < right) {
                for (let row = bottom - 1; row > top; row--) {
                    layer.push(matrix[row][left]);
                }
            }

            layers.push(layer);
            top++; bottom--; left++; right--;
        }

        console.log("原矩阵:");
        matrix.forEach(row => console.log(`  [${row.join(', ')}]`));
        console.log("按层遍历:");
        layers.forEach((layer, i) => {
            console.log(`  第${i + 1}层: [${layer.join(', ')}]`);
        });

        return layers;
    }

    traverseByLayers([[1,2,3,4],[5,6,7,8],[9,10,11,12]]);
}

// 面试要点
function interviewKeyPoints() {
    console.log("=== 面试要点 ===\n");

    console.log("🎯 核心考点：");
    console.log("1. 二维数组的边界控制");
    console.log("2. 循环条件的正确设置");
    console.log("3. 边界变量的适时更新");
    console.log("4. 特殊情况的处理（单行、单列）");
    console.log();

    console.log("💡 解题技巧：");
    console.log("1. 维护四个边界变量");
    console.log("2. 按固定顺序：右→下→左→上");
    console.log("3. 每完成一个方向，立即更新边界");
    console.log("4. 检查边界交叉条件防止重复访问");
    console.log();

    console.log("🚫 常见误区：");
    console.log("1. 边界更新时机错误");
    console.log("2. 循环条件判断不准确");
    console.log("3. 忘记处理单行或单列的特殊情况");
    console.log("4. 重复访问边界元素");
    console.log();

    console.log("🔍 相关问题：");
    console.log("1. 螺旋矩阵II（生成螺旋矩阵）");
    console.log("2. 矩阵置零");
    console.log("3. 旋转图像");
    console.log("4. 对角线遍历");
}

// 导出所有方法
module.exports = {
    spiralOrder,
    spiralOrderWithDirection,
    spiralOrderRecursive,
    spiralOrderStateMachine,
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