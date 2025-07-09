/**
 * LeetCode 74. 搜索二维矩阵
 *
 * 问题描述：
 * 编写一个高效的算法来判断 m x n 矩阵中，是否存在一个目标值。
 * 该矩阵具有如下特性：
 * - 每行中的整数从左到右按升序排列
 * - 每行的第一个整数大于前一行的最后一个整数
 *
 * 这意味着整个矩阵从左到右、从上到下都是有序的，可以看作一个有序的一维数组。
 *
 * 核心思想：
 * 二分查找 - 将二维矩阵看作一维有序数组进行二分查找
 * 关键在于坐标转换：一维索引 index 对应二维坐标 (index/cols, index%cols)
 *
 * 算法步骤：
 * 1. 将 m×n 矩阵看作长度为 m×n 的一维数组
 * 2. 使用二分查找在虚拟一维数组中搜索目标值
 * 3. 通过索引转换访问实际的二维矩阵元素
 * 4. 坐标转换公式：row = index / cols, col = index % cols
 *
 * 示例：
 * 输入：matrix = [[1,4,7,11],[2,5,8,12],[3,6,9,16],[10,13,14,17]], target = 5
 * 输出：true
 *
 * 矩阵可视化：
 * [ 1,  4,  7, 11]
 * [ 2,  5,  8, 12]
 * [ 3,  6,  9, 16]
 * [10, 13, 14, 17]
 * 看作一维数组：[1,4,7,11,2,5,8,12,3,6,9,16,10,13,14,17]
 */

/**
 * 方法一：二分查找（一维化处理）
 *
 * 核心思想：
 * 利用矩阵的有序性，将二维矩阵逻辑上看作一维有序数组，
 * 通过索引转换实现对二维矩阵的二分查找
 *
 * @param {number[][]} matrix - 输入的二维矩阵
 * @param {number} target - 目标值
 * @return {boolean} 是否找到目标值
 * @time O(log(m×n)) - 二分查找
 * @space O(1) - 只使用常数额外空间
 */
function searchMatrix(matrix, target) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return false;
    }

    const rows = matrix.length;
    const cols = matrix[0].length;

    let left = 0;
    let right = rows * cols - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        // 关键：一维索引转二维坐标
        const row = Math.floor(mid / cols);
        const col = mid % cols;
        const midValue = matrix[row][col];

        if (midValue === target) {
            return true;
        } else if (midValue < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return false;
}

/**
 * 方法二：两次二分查找
 *
 * 核心思想：
 * 1. 先对第一列进行二分查找，找到目标可能所在的行
 * 2. 再对该行进行二分查找，寻找目标值
 *
 * @param {number[][]} matrix - 输入的二维矩阵
 * @param {number} target - 目标值
 * @return {boolean} 是否找到目标值
 * @time O(log m + log n) - 两次二分查找
 * @space O(1) - 只使用常数额外空间
 */
function searchMatrixTwoBinary(matrix, target) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return false;
    }

    const rows = matrix.length;
    const cols = matrix[0].length;

    // 第一次二分：找到目标可能所在的行
    let top = 0;
    let bottom = rows - 1;
    let targetRow = -1;

    while (top <= bottom) {
        const mid = Math.floor((top + bottom) / 2);

        if (matrix[mid][0] <= target && target <= matrix[mid][cols - 1]) {
            targetRow = mid;
            break;
        } else if (matrix[mid][0] > target) {
            bottom = mid - 1;
        } else {
            top = mid + 1;
        }
    }

    if (targetRow === -1) {
        return false;
    }

    // 第二次二分：在目标行中查找
    let left = 0;
    let right = cols - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midValue = matrix[targetRow][mid];

        if (midValue === target) {
            return true;
        } else if (midValue < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return false;
}

/**
 * 方法三：从右上角开始搜索（适用于更一般的情况）
 *
 * 核心思想：
 * 从矩阵的右上角开始，利用矩阵的有序性：
 * - 如果当前值大于目标，左移（减小值）
 * - 如果当前值小于目标，下移（增大值）
 *
 * 注意：这种方法更适用于LeetCode 240（搜索二维矩阵II）
 *
 * @param {number[][]} matrix - 输入的二维矩阵
 * @param {number} target - 目标值
 * @return {boolean} 是否找到目标值
 * @time O(m + n) - 最多遍历m+n个元素
 * @space O(1) - 只使用常数额外空间
 */
function searchMatrixTopRight(matrix, target) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return false;
    }

    const rows = matrix.length;
    const cols = matrix[0].length;

    // 从右上角开始
    let row = 0;
    let col = cols - 1;

    while (row < rows && col >= 0) {
        const current = matrix[row][col];

        if (current === target) {
            return true;
        } else if (current > target) {
            // 当前值太大，向左移动
            col--;
        } else {
            // 当前值太小，向下移动
            row++;
        }
    }

    return false;
}

/**
 * 方法四：暴力搜索（用作对照）
 *
 * 核心思想：
 * 遍历整个矩阵寻找目标值
 *
 * @param {number[][]} matrix - 输入的二维矩阵
 * @param {number} target - 目标值
 * @return {boolean} 是否找到目标值
 * @time O(m×n) - 遍历所有元素
 * @space O(1) - 只使用常数额外空间
 */
function searchMatrixBruteForce(matrix, target) {
    if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
        return false;
    }

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[0].length; j++) {
            if (matrix[i][j] === target) {
                return true;
            }
        }
    }

    return false;
}

// 测试用例
function testSearchMatrix() {
    console.log("=== 搜索二维矩阵算法测试 ===\n");

    const testCases = [
        {
            matrix: [
                [1, 4, 7, 11],
                [2, 5, 8, 12],
                [3, 6, 9, 16],
                [10, 13, 14, 17]
            ],
            target: 5,
            expected: true,
            description: "标准测试用例，目标存在"
        },
        {
            matrix: [
                [1, 4, 7, 11],
                [2, 5, 8, 12],
                [3, 6, 9, 16],
                [10, 13, 14, 17]
            ],
            target: 20,
            expected: false,
            description: "目标不存在，大于所有元素"
        },
        {
            matrix: [[1]],
            target: 1,
            expected: true,
            description: "单元素矩阵，目标存在"
        },
        {
            matrix: [[1]],
            target: 2,
            expected: false,
            description: "单元素矩阵，目标不存在"
        },
        {
            matrix: [
                [1, 3, 5, 7],
                [10, 11, 16, 20],
                [23, 30, 34, 60]
            ],
            target: 3,
            expected: true,
            description: "目标在第一行"
        },
        {
            matrix: [
                [1, 3, 5, 7],
                [10, 11, 16, 20],
                [23, 30, 34, 60]
            ],
            target: 13,
            expected: false,
            description: "目标在范围内但不存在"
        },
        {
            matrix: [],
            target: 1,
            expected: false,
            description: "空矩阵"
        }
    ];

    testCases.forEach(({ matrix, target, expected, description }, index) => {
        console.log(`测试用例 ${index + 1}: ${description}`);
        console.log(`矩阵:`);
        if (matrix.length > 0) {
            matrix.forEach(row => console.log(`  [${row.join(', ')}]`));
        } else {
            console.log(`  []`);
        }
        console.log(`目标值: ${target}`);
        console.log(`期望结果: ${expected}`);

        const result1 = searchMatrix(matrix, target);
        const result2 = searchMatrixTwoBinary(matrix, target);
        const result3 = searchMatrixTopRight(matrix, target);
        const result4 = searchMatrixBruteForce(matrix, target);

        console.log(`一维化二分查找: ${result1} ${result1 === expected ? '✓' : '✗'}`);
        console.log(`两次二分查找: ${result2} ${result2 === expected ? '✓' : '✗'}`);
        console.log(`右上角搜索: ${result3} ${result3 === expected ? '✓' : '✗'}`);
        console.log(`暴力搜索: ${result4} ${result4 === expected ? '✓' : '✗'}`);
        console.log("---");
    });
}

// 性能测试
function performanceTest() {
    console.log("=== 性能测试 ===\n");

    const sizes = [
        [100, 100],
        [500, 500],
        [1000, 1000]
    ];

    sizes.forEach(([rows, cols]) => {
        // 生成有序矩阵
        const matrix = [];
        let value = 1;
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                row.push(value);
                value += Math.floor(Math.random() * 3) + 1; // 递增1-3
            }
            matrix.push(row);
        }

        const target = matrix[Math.floor(rows / 2)][Math.floor(cols / 2)];

        console.log(`矩阵大小: ${rows} × ${cols}`);
        console.log(`目标值: ${target}`);

        // 测试一维化二分查找
        const start1 = performance.now();
        const result1 = searchMatrix(matrix, target);
        const end1 = performance.now();
        console.log(`一维化二分: ${(end1 - start1).toFixed(4)}ms, 结果: ${result1}`);

        // 测试两次二分查找
        const start2 = performance.now();
        const result2 = searchMatrixTwoBinary(matrix, target);
        const end2 = performance.now();
        console.log(`两次二分: ${(end2 - start2).toFixed(4)}ms, 结果: ${result2}`);

        // 测试右上角搜索
        const start3 = performance.now();
        const result3 = searchMatrixTopRight(matrix, target);
        const end3 = performance.now();
        console.log(`右上角搜索: ${(end3 - start3).toFixed(4)}ms, 结果: ${result3}`);

        // 暴力搜索（仅对较小矩阵）
        if (rows <= 500) {
            const start4 = performance.now();
            const result4 = searchMatrixBruteForce(matrix, target);
            const end4 = performance.now();
            console.log(`暴力搜索: ${(end4 - start4).toFixed(4)}ms, 结果: ${result4}`);
        }

        console.log("---");
    });
}

// 算法可视化演示
function visualizeSearch() {
    console.log("=== 一维化二分查找过程可视化 ===\n");

    const matrix = [
        [1, 4, 7, 11],
        [2, 5, 8, 12],
        [3, 6, 9, 16],
        [10, 13, 14, 17]
    ];
    const target = 8;

    console.log("目标矩阵:");
    matrix.forEach(row => console.log(`  [${row.join(', ')}]`));
    console.log(`寻找目标值: ${target}\n`);

    const rows = matrix.length;
    const cols = matrix[0].length;

    // 显示一维化后的数组
    const flattened = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            flattened.push(matrix[i][j]);
        }
    }
    console.log(`一维化数组: [${flattened.join(', ')}]`);
    console.log("索引位置: ", flattened.map((_, i) => i.toString().padStart(2)).join(' '));
    console.log("");

    let left = 0;
    let right = rows * cols - 1;
    let step = 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const row = Math.floor(mid / cols);
        const col = mid % cols;
        const midValue = matrix[row][col];

        console.log(`步骤 ${step}:`);
        console.log(`  搜索范围: [${left}, ${right}]`);
        console.log(`  中点索引: ${mid}`);
        console.log(`  二维坐标: (${row}, ${col})`);
        console.log(`  中点值: ${midValue}`);

        if (midValue === target) {
            console.log(`  找到目标值 ${target}!`);
            break;
        } else if (midValue < target) {
            console.log(`  ${midValue} < ${target}, 搜索右半部分`);
            left = mid + 1;
        } else {
            console.log(`  ${midValue} > ${target}, 搜索左半部分`);
            right = mid - 1;
        }

        console.log("");
        step++;
    }
}

// 坐标转换演示
function demonstrateCoordinateConversion() {
    console.log("=== 坐标转换演示 ===\n");

    const rows = 3;
    const cols = 4;

    console.log(`矩阵尺寸: ${rows} × ${cols}`);
    console.log("一维索引 -> 二维坐标的转换：\n");

    for (let index = 0; index < rows * cols; index++) {
        const row = Math.floor(index / cols);
        const col = index % cols;
        console.log(`索引 ${index.toString().padStart(2)} -> (${row}, ${col})`);
    }

    console.log("\n二维坐标 -> 一维索引的转换：\n");

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const index = i * cols + j;
            console.log(`(${i}, ${j}) -> 索引 ${index.toString().padStart(2)}`);
        }
    }
}

// 运行测试
if (require.main === module) {
    testSearchMatrix();
    performanceTest();
    visualizeSearch();
    demonstrateCoordinateConversion();
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        searchMatrix,
        searchMatrixTwoBinary,
        searchMatrixTopRight,
        searchMatrixBruteForce
    };
}