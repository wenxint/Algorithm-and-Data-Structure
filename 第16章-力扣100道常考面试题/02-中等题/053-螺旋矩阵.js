/**
 * LeetCode 054: 螺旋矩阵 (Spiral Matrix)
 *
 * 问题描述：
 * 给你一个 m 行 n 列的矩阵 matrix ，请按照顺时针螺旋顺序，返回矩阵中的所有元素。
 *
 * 核心思想：
 * 按照右→下→左→上的顺序遍历矩阵，每个方向走到边界后转向下一个方向：
 * 1. 维护四个边界：上边界(top)、下边界(bottom)、左边界(left)、右边界(right)
 * 2. 每次沿一个方向走完一条边后，收缩对应的边界
 * 3. 重复直到所有元素都被访问
 *
 * 示例：
 * 输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
 * 输出：[1,2,3,6,9,8,7,4,5]
 * 解释：
 * 1 → 2 → 3
 *           ↓
 * 4 → 5   6
 * ↑       ↓
 * 7 ← 8 ← 9
 *
 * 输入：matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]
 * 输出：[1,2,3,4,8,12,11,10,9,5,6,7]
 */

/**
 * 方法一：边界控制法（推荐）
 *
 * 核心思想：
 * 使用四个变量维护当前可访问的边界范围，每走完一个方向就收缩对应边界：
 * - 向右走：收缩上边界
 * - 向下走：收缩右边界
 * - 向左走：收缩下边界
 * - 向上走：收缩左边界
 *
 * @param {number[][]} matrix - 输入矩阵
 * @return {number[]} 螺旋遍历结果
 * @time O(m*n) m是行数，n是列数
 * @space O(1) 不考虑输出数组的空间
 */
function spiralOrder(matrix) {
    console.log("=== 边界控制法 ===");
    console.log("输入矩阵:");
    matrix.forEach((row, i) => console.log(`  行${i}: [${row.join(', ')}]`));

    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        console.log("矩阵为空，返回空数组");
        return [];
    }

    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = [];

    // 初始化四个边界
    let top = 0;       // 上边界
    let bottom = rows - 1;  // 下边界
    let left = 0;      // 左边界
    let right = cols - 1;   // 右边界

    console.log(`\n矩阵尺寸: ${rows}x${cols}`);
    console.log(`初始边界: top=${top}, bottom=${bottom}, left=${left}, right=${right}`);

    while (top <= bottom && left <= right) {
        console.log(`\n当前边界: top=${top}, bottom=${bottom}, left=${left}, right=${right}`);

        // 1. 从左到右遍历上边界
        console.log(`步骤1: 从左到右遍历第${top}行，范围[${left}, ${right}]`);
        for (let col = left; col <= right; col++) {
            result.push(matrix[top][col]);
            console.log(`  访问 (${top}, ${col}) = ${matrix[top][col]}`);
        }
        top++; // 上边界下移
        console.log(`  上边界下移至 ${top}`);

        // 2. 从上到下遍历右边界
        if (top <= bottom) {
            console.log(`步骤2: 从上到下遍历第${right}列，范围[${top}, ${bottom}]`);
            for (let row = top; row <= bottom; row++) {
                result.push(matrix[row][right]);
                console.log(`  访问 (${row}, ${right}) = ${matrix[row][right]}`);
            }
            right--; // 右边界左移
            console.log(`  右边界左移至 ${right}`);
        }

        // 3. 从右到左遍历下边界
        if (top <= bottom && left <= right) {
            console.log(`步骤3: 从右到左遍历第${bottom}行，范围[${right}, ${left}]`);
            for (let col = right; col >= left; col--) {
                result.push(matrix[bottom][col]);
                console.log(`  访问 (${bottom}, ${col}) = ${matrix[bottom][col]}`);
            }
            bottom--; // 下边界上移
            console.log(`  下边界上移至 ${bottom}`);
        }

        // 4. 从下到上遍历左边界
        if (left <= right && top <= bottom) {
            console.log(`步骤4: 从下到上遍历第${left}列，范围[${bottom}, ${top}]`);
            for (let row = bottom; row >= top; row--) {
                result.push(matrix[row][left]);
                console.log(`  访问 (${row}, ${left}) = ${matrix[row][left]}`);
            }
            left++; // 左边界右移
            console.log(`  左边界右移至 ${left}`);
        }

        console.log(`当前结果: [${result.join(', ')}]`);
    }

    console.log(`\n最终结果: [${result.join(', ')}]`);
    return result;
}

/**
 * 方法二：方向向量法
 *
 * 核心思想：
 * 使用方向向量定义四个移动方向，当碰到边界或已访问元素时转向：
 * - 右: (0, 1)
 * - 下: (1, 0)
 * - 左: (0, -1)
 * - 上: (-1, 0)
 *
 * @param {number[][]} matrix - 输入矩阵
 * @return {number[]} 螺旋遍历结果
 * @time O(m*n) m是行数，n是列数
 * @space O(m*n) 需要额外的visited数组
 */
function spiralOrderDirection(matrix) {
    console.log("\n=== 方向向量法 ===");

    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return [];
    }

    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = [];
    const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));

    // 四个方向：右、下、左、上
    const directions = [
        [0, 1],   // 右
        [1, 0],   // 下
        [0, -1],  // 左
        [-1, 0]   // 上
    ];
    const dirNames = ['右', '下', '左', '上'];

    let row = 0, col = 0;
    let dirIndex = 0; // 当前方向索引

    console.log("四个方向向量:", directions);
    console.log("方向名称:", dirNames);

    for (let i = 0; i < rows * cols; i++) {
        // 访问当前位置
        result.push(matrix[row][col]);
        visited[row][col] = true;
        console.log(`步骤${i + 1}: 访问(${row}, ${col}) = ${matrix[row][col]}, 方向: ${dirNames[dirIndex]}`);

        // 计算下一个位置
        const [dr, dc] = directions[dirIndex];
        const nextRow = row + dr;
        const nextCol = col + dc;

        // 检查是否需要转向
        if (nextRow < 0 || nextRow >= rows ||
            nextCol < 0 || nextCol >= cols ||
            visited[nextRow][nextCol]) {

            // 需要转向
            dirIndex = (dirIndex + 1) % 4;
            const [newDr, newDc] = directions[dirIndex];
            row += newDr;
            col += newDc;
            console.log(`  转向: 新方向=${dirNames[dirIndex]}, 下一位置(${row}, ${col})`);
        } else {
            // 继续当前方向
            row = nextRow;
            col = nextCol;
            console.log(`  继续: 下一位置(${row}, ${col})`);
        }
    }

    console.log(`方向向量法结果: [${result.join(', ')}]`);
    return result;
}

/**
 * 方法三：递归分层法
 *
 * 核心思想：
 * 将矩阵看作多个同心矩形，从外层到内层递归处理每一层：
 * 每一层都是一个矩形，按照顺时针方向遍历
 *
 * @param {number[][]} matrix - 输入矩阵
 * @return {number[]} 螺旋遍历结果
 * @time O(m*n) m是行数，n是列数
 * @space O(min(m,n)) 递归栈深度
 */
function spiralOrderRecursive(matrix) {
    console.log("\n=== 递归分层法 ===");

    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return [];
    }

    const result = [];

    /**
     * 递归处理一层矩形
     * @param {number} top - 上边界
     * @param {number} bottom - 下边界
     * @param {number} left - 左边界
     * @param {number} right - 右边界
     * @param {number} layer - 当前层数
     */
    function traverseLayer(top, bottom, left, right, layer) {
        if (top > bottom || left > right) {
            console.log(`第${layer}层: 边界无效，递归结束`);
            return;
        }

        console.log(`第${layer}层: 边界范围 top=${top}, bottom=${bottom}, left=${left}, right=${right}`);

        if (top === bottom) {
            // 只有一行
            for (let col = left; col <= right; col++) {
                result.push(matrix[top][col]);
                console.log(`  单行: (${top}, ${col}) = ${matrix[top][col]}`);
            }
        } else if (left === right) {
            // 只有一列
            for (let row = top; row <= bottom; row++) {
                result.push(matrix[row][left]);
                console.log(`  单列: (${row}, ${left}) = ${matrix[row][left]}`);
            }
        } else {
            // 完整的矩形层
            // 上边：从左到右
            for (let col = left; col <= right; col++) {
                result.push(matrix[top][col]);
                console.log(`  上边: (${top}, ${col}) = ${matrix[top][col]}`);
            }

            // 右边：从上到下（排除右上角）
            for (let row = top + 1; row <= bottom; row++) {
                result.push(matrix[row][right]);
                console.log(`  右边: (${row}, ${right}) = ${matrix[row][right]}`);
            }

            // 下边：从右到左（排除右下角）
            for (let col = right - 1; col >= left; col--) {
                result.push(matrix[bottom][col]);
                console.log(`  下边: (${bottom}, ${col}) = ${matrix[bottom][col]}`);
            }

            // 左边：从下到上（排除左下角和左上角）
            for (let row = bottom - 1; row > top; row--) {
                result.push(matrix[row][left]);
                console.log(`  左边: (${row}, ${left}) = ${matrix[row][left]}`);
            }
        }

        // 递归处理内层
        traverseLayer(top + 1, bottom - 1, left + 1, right - 1, layer + 1);
    }

    const rows = matrix.length;
    const cols = matrix[0].length;
    traverseLayer(0, rows - 1, 0, cols - 1, 1);

    console.log(`递归分层法结果: [${result.join(', ')}]`);
    return result;
}

/**
 * 生成螺旋矩阵（扩展功能）
 *
 * 核心思想：
 * 按照螺旋顺序填充数字到矩阵中，与螺旋遍历相反的过程
 *
 * @param {number} n - 矩阵尺寸 (n x n)
 * @return {number[][]} 生成的螺旋矩阵
 */
function generateMatrix(n) {
    console.log(`\n=== 生成 ${n}x${n} 螺旋矩阵 ===`);

    const matrix = Array.from({ length: n }, () => new Array(n).fill(0));
    let top = 0, bottom = n - 1, left = 0, right = n - 1;
    let num = 1;

    while (top <= bottom && left <= right) {
        // 填充上边
        for (let col = left; col <= right; col++) {
            matrix[top][col] = num++;
        }
        top++;

        // 填充右边
        for (let row = top; row <= bottom; row++) {
            matrix[row][right] = num++;
        }
        right--;

        // 填充下边
        if (top <= bottom) {
            for (let col = right; col >= left; col--) {
                matrix[bottom][col] = num++;
            }
            bottom--;
        }

        // 填充左边
        if (left <= right) {
            for (let row = bottom; row >= top; row--) {
                matrix[row][left] = num++;
            }
            left++;
        }
    }

    console.log("生成的螺旋矩阵:");
    matrix.forEach((row, i) => {
        console.log(`  [${row.map(val => val.toString().padStart(2)).join(', ')}]`);
    });

    return matrix;
}

/**
 * 可视化螺旋路径
 */
function visualizeSpiralPath(matrix) {
    console.log("\n=== 螺旋路径可视化 ===");

    const rows = matrix.length;
    const cols = matrix[0].length;
    const path = Array.from({ length: rows }, () => new Array(cols).fill('  '));

    let top = 0, bottom = rows - 1, left = 0, right = cols - 1;
    let step = 1;

    while (top <= bottom && left <= right) {
        // 右
        for (let col = left; col <= right; col++) {
            path[top][col] = step.toString().padStart(2);
            step++;
        }
        top++;

        // 下
        for (let row = top; row <= bottom; row++) {
            path[row][right] = step.toString().padStart(2);
            step++;
        }
        right--;

        // 左
        if (top <= bottom) {
            for (let col = right; col >= left; col--) {
                path[bottom][col] = step.toString().padStart(2);
                step++;
            }
            bottom--;
        }

        // 上
        if (left <= right) {
            for (let row = bottom; row >= top; row--) {
                path[row][left] = step.toString().padStart(2);
                step++;
            }
            left++;
        }
    }

    console.log("访问顺序可视化（数字表示访问步骤）:");
    path.forEach(row => {
        console.log(`  [${row.join(' ')}]`);
    });
}

/**
 * 验证不同方法的结果一致性
 */
function validateResults(matrix) {
    console.log("\n=== 结果验证 ===");

    const result1 = spiralOrder(matrix.map(row => [...row])); // 深拷贝避免修改
    const result2 = spiralOrderDirection(matrix.map(row => [...row]));
    const result3 = spiralOrderRecursive(matrix.map(row => [...row]));

    const isConsistent = (
        JSON.stringify(result1) === JSON.stringify(result2) &&
        JSON.stringify(result2) === JSON.stringify(result3)
    );

    console.log(`边界控制法: [${result1.join(', ')}]`);
    console.log(`方向向量法: [${result2.join(', ')}]`);
    console.log(`递归分层法: [${result3.join(', ')}]`);
    console.log(`结果一致性: ${isConsistent ? '✅' : '❌'}`);

    return result1;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const testCases = [
        [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
        [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]],
        [[1]],
        [[1, 2], [3, 4]]
    ];

    testCases.forEach((matrix, index) => {
        console.log(`\n--- 测试用例 ${index + 1} ---`);
        console.log(`矩阵尺寸: ${matrix.length}x${matrix[0].length}`);

        const start = performance.now();
        const result = validateResults(matrix);
        const end = performance.now();

        console.log(`耗时: ${(end - start).toFixed(3)}ms`);
        visualizeSpiralPath(matrix);
    });
}

/**
 * 算法核心概念演示
 */
function demonstrateAlgorithm() {
    console.log("\n=== 算法核心概念演示 ===");

    console.log("\n1. 螺旋遍历的本质：");
    console.log("按照固定的方向顺序（右→下→左→上）遍历矩阵");
    console.log("每个方向走到边界后，收缩对应边界并转向下一个方向");

    console.log("\n2. 边界控制策略：");
    console.log("① 维护四个边界变量：top, bottom, left, right");
    console.log("② 每完成一个方向的遍历，收缩对应边界");
    console.log("③ 继续条件：top ≤ bottom 且 left ≤ right");

    console.log("\n3. 方向转换规律：");
    console.log("右 → 下 → 左 → 上 → 右（循环）");
    console.log("可以用取模运算实现：(direction + 1) % 4");

    console.log("\n4. 边界条件处理：");
    console.log("单行矩阵：只需从左到右遍历");
    console.log("单列矩阵：只需从上到下遍历");
    console.log("空矩阵：直接返回空数组");

    console.log("\n5. 算法应用场景：");
    console.log("图像处理、数据展示、矩阵变换、游戏开发等");

    console.log("\n6. 复杂度分析：");
    console.log("时间复杂度：O(m×n)，需要访问每个元素一次");
    console.log("空间复杂度：O(1)，不考虑输出数组的额外空间");
}

// 测试运行
function runTests() {
    console.log("🚀 开始测试螺旋矩阵算法");

    // 基础测试用例
    const testCases = [
        [[1, 2, 3], [4, 5, 6], [7, 8, 9]],                    // 3x3 正方形
        [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]],      // 3x4 长方形
        [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],                   // 1x10 单行
        [[1], [2], [3], [4]],                                 // 4x1 单列
        [[1]],                                                // 1x1 单元素
        [[1, 2], [3, 4], [5, 6]]                            // 3x2 长方形
    ];

    testCases.forEach((matrix, index) => {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`测试用例 ${index + 1}: ${matrix.length}x${matrix[0].length} 矩阵`);
        console.log(`${'='.repeat(60)}`);

        validateResults(matrix);
    });

    // 生成螺旋矩阵演示
    console.log(`\n${'='.repeat(60)}`);
    console.log("螺旋矩阵生成演示");
    console.log(`${'='.repeat(60)}`);

    const generatedMatrix = generateMatrix(4);
    console.log("\n对生成的矩阵进行螺旋遍历:");
    spiralOrder(generatedMatrix);

    // 运行性能测试
    performanceTest();

    // 演示算法核心概念
    demonstrateAlgorithm();

    console.log("\n🎉 测试完成！");
}

// 如果直接运行此文件，执行测试
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        spiralOrder,
        spiralOrderDirection,
        spiralOrderRecursive,
        generateMatrix,
        visualizeSpiralPath,
        runTests
    };
} else if (typeof window === 'undefined') {
    // Node.js环境下直接运行测试
    runTests();
}