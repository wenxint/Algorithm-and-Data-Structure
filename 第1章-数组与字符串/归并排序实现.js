/**
 * 归并排序完整实现
 *
 * 文件说明：
 * 本文件包含归并排序的多种实现方式和测试用例
 * 适合初级程序员学习和理解归并排序算法
 *
 * 包含内容：
 * 1. 基础版本的归并排序
 * 2. 优化版本的归并排序
 * 3. 统计比较次数的版本
 * 4. 计算逆序对的版本
 * 5. 完整的测试用例
 */

// ==================== 1. 基础版本 ====================

/**
 * 合并两个有序数组
 *
 * 核心思想：
 * 使用双指针技术，分别指向两个数组的起始位置
 * 比较两个指针指向的元素，将较小的元素放入结果数组
 * 然后移动对应的指针，重复此过程直到处理完所有元素
 *
 * @param {number[]} left - 左边的有序数组
 * @param {number[]} right - 右边的有序数组
 * @returns {number[]} 合并后的有序数组
 * @time O(n + m) - n和m分别是两个数组的长度
 * @space O(n + m) - 需要额外空间存储结果
 */
function merge(left, right) {
    const result = [];  // 存放合并结果的数组
    let i = 0;          // 左数组的指针
    let j = 0;          // 右数组的指针

    // 当两个数组都还有元素时，进行比较
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;  // 左指针向右移动
        } else {
            result.push(right[j]);
            j++;  // 右指针向右移动
        }
    }

    // 如果左数组还有剩余元素，全部添加到结果中
    while (i < left.length) {
        result.push(left[i]);
        i++;
    }

    // 如果右数组还有剩余元素，全部添加到结果中
    while (j < right.length) {
        result.push(right[j]);
        j++;
    }

    return result;
}

/**
 * 归并排序 - 基础版本
 *
 * 核心思想：
 * 分治算法的经典应用：
 * 1. 分割：将数组不断分成两半，直到每个子数组只有一个元素
 * 2. 解决：单个元素的数组天然有序
 * 3. 合并：将两个有序数组合并成一个更大的有序数组
 *
 * @param {number[]} arr - 待排序的数组
 * @returns {number[]} 排序后的新数组
 * @time O(n log n) - 无论最好、平均、最坏情况都是这个复杂度
 * @space O(n) - 需要额外的空间来存储临时数组
 */
function mergeSort(arr) {
    // 递归终止条件：数组长度小于等于1时，认为已经有序
    if (arr.length <= 1) {
        return arr;
    }

    // 计算中间位置，将数组分成两半
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);      // 左半部分
    const right = arr.slice(mid);        // 右半部分

    // 递归地对左右两部分进行排序，然后合并结果
    return merge(mergeSort(left), mergeSort(right));
}

// ==================== 2. 优化版本 ====================

/**
 * 归并排序 - 原地排序优化版本
 *
 * 优化点：
 * 1. 减少数组创建，使用索引范围而不是创建新数组
 * 2. 使用辅助数组来临时存储数据，减少内存分配
 *
 * @param {number[]} arr - 待排序的数组（会被修改）
 * @param {number} left - 左边界索引
 * @param {number} right - 右边界索引
 * @param {number[]} temp - 辅助数组
 */
function mergeSortOptimized(arr, left = 0, right = arr.length - 1, temp = new Array(arr.length)) {
    if (left >= right) return;

    // 找到中间位置
    const mid = Math.floor((left + right) / 2);

    // 递归排序左右两部分
    mergeSortOptimized(arr, left, mid, temp);
    mergeSortOptimized(arr, mid + 1, right, temp);

    // 合并两个有序部分
    mergeInPlace(arr, left, mid, right, temp);
}

/**
 * 原地合并两个有序部分
 *
 * @param {number[]} arr - 原数组
 * @param {number} left - 左部分起始位置
 * @param {number} mid - 左部分结束位置
 * @param {number} right - 右部分结束位置
 * @param {number[]} temp - 辅助数组
 */
function mergeInPlace(arr, left, mid, right, temp) {
    let i = left;        // 左部分指针
    let j = mid + 1;     // 右部分指针
    let k = left;        // 辅助数组指针

    // 合并两个有序部分到辅助数组
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) {
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
        }
    }

    // 复制剩余元素
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];

    // 将辅助数组的结果复制回原数组
    for (i = left; i <= right; i++) {
        arr[i] = temp[i];
    }
}

// ==================== 3. 统计比较次数版本 ====================

/**
 * 带比较次数统计的归并排序
 *
 * 用途：
 * 帮助理解算法性能，统计实际的比较操作次数
 *
 * @param {number[]} arr - 待排序数组
 * @returns {Object} 包含排序结果和比较次数的对象
 */
function mergeSortWithCount(arr) {
    let compareCount = 0;  // 比较次数计数器

    function mergeSortHelper(arr) {
        if (arr.length <= 1) return arr;

        const mid = Math.floor(arr.length / 2);
        const left = mergeSortHelper(arr.slice(0, mid));
        const right = mergeSortHelper(arr.slice(mid));

        return mergeWithCount(left, right);
    }

    function mergeWithCount(left, right) {
        const result = [];
        let i = 0, j = 0;

        while (i < left.length && j < right.length) {
            compareCount++;  // 每次比较都计数
            if (left[i] <= right[j]) {
                result.push(left[i++]);
            } else {
                result.push(right[j++]);
            }
        }

        while (i < left.length) result.push(left[i++]);
        while (j < right.length) result.push(right[j++]);

        return result;
    }

    const sortedArray = mergeSortHelper(arr);

    return {
        sorted: sortedArray,
        comparisons: compareCount,
        theoretical: Math.ceil(arr.length * Math.log2(arr.length))  // 理论比较次数
    };
}

// ==================== 4. 逆序对计算版本 ====================

/**
 * 在归并排序过程中计算逆序对
 *
 * 逆序对定义：
 * 对于数组中的两个元素 arr[i] 和 arr[j]，
 * 如果 i < j 但 arr[i] > arr[j]，则称为一个逆序对
 *
 * 核心思想：
 * 在合并两个有序数组时，如果左数组的元素大于右数组的元素，
 * 那么左数组中该元素及其后面的所有元素都与右数组的这个元素构成逆序对
 *
 * @param {number[]} arr - 输入数组
 * @returns {Object} 包含排序结果和逆序对数量的对象
 */
function mergeSortWithInversions(arr) {
    let inversionCount = 0;

    function mergeSortHelper(arr) {
        if (arr.length <= 1) return arr;

        const mid = Math.floor(arr.length / 2);
        const left = mergeSortHelper(arr.slice(0, mid));
        const right = mergeSortHelper(arr.slice(mid));

        return mergeAndCount(left, right);
    }

    function mergeAndCount(left, right) {
        const result = [];
        let i = 0, j = 0;

        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result.push(left[i++]);
            } else {
                // 发现逆序对：left[i] > right[j]
                // left[i] 到 left[left.length-1] 都与 right[j] 构成逆序对
                inversionCount += left.length - i;
                result.push(right[j++]);
            }
        }

        while (i < left.length) result.push(left[i++]);
        while (j < right.length) result.push(right[j++]);

        return result;
    }

    const sortedArray = mergeSortHelper([...arr]);  // 使用数组副本

    return {
        sorted: sortedArray,
        inversions: inversionCount,
        original: arr
    };
}

// ==================== 5. 测试用例 ====================

/**
 * 测试所有版本的归并排序
 */
function testMergeSort() {
    console.log("=== 归并排序测试开始 ===\n");

    // 测试数据
    const testCases = [
        [],                           // 空数组
        [1],                         // 单元素
        [2, 1],                      // 两个元素
        [3, 1, 4, 1, 5, 9, 2, 6],   // 随机数组
        [1, 2, 3, 4, 5],            // 已排序数组
        [5, 4, 3, 2, 1],            // 逆序数组
        [1, 1, 1, 1],               // 重复元素
        [8, 4, 2, 1, 3, 5, 7, 6]    // 示例数组
    ];

    testCases.forEach((testCase, index) => {
        console.log(`--- 测试用例 ${index + 1}: [${testCase}] ---`);

        // 1. 基础版本测试
        const result1 = mergeSort([...testCase]);
        console.log(`基础版本结果: [${result1}]`);

        // 2. 优化版本测试
        const testArray2 = [...testCase];
        mergeSortOptimized(testArray2);
        console.log(`优化版本结果: [${testArray2}]`);

        // 3. 统计比较次数
        if (testCase.length > 0) {
            const countResult = mergeSortWithCount([...testCase]);
            console.log(`比较次数: ${countResult.comparisons} (理论值: ${countResult.theoretical})`);
        }

        // 4. 逆序对计算
        if (testCase.length > 1) {
            const inversionResult = mergeSortWithInversions(testCase);
            console.log(`逆序对数量: ${inversionResult.inversions}`);
        }

        console.log();
    });

    // 性能测试
    console.log("=== 性能测试 ===");
    const largeArray = generateRandomArray(1000);

    console.time("基础版本耗时");
    mergeSort([...largeArray]);
    console.timeEnd("基础版本耗时");

    console.time("优化版本耗时");
    const optimizedArray = [...largeArray];
    mergeSortOptimized(optimizedArray);
    console.timeEnd("优化版本耗时");

    console.log("\n=== 归并排序测试结束 ===");
}

/**
 * 生成随机数组用于测试
 *
 * @param {number} size - 数组大小
 * @param {number} max - 最大值
 * @returns {number[]} 随机数组
 */
function generateRandomArray(size, max = 1000) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * max));
}

/**
 * 验证数组是否已排序
 *
 * @param {number[]} arr - 待验证数组
 * @returns {boolean} 是否已排序
 */
function isSorted(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
            return false;
        }
    }
    return true;
}

// ==================== 6. 练习题解答 ====================

/**
 * 练习题1：判断数组是否可能是归并排序某一步的结果
 *
 * 思路：
 * 归并排序每一步都会产生若干个有序的连续子数组
 * 检查给定数组是否可以分解为这样的结构
 *
 * @param {number[]} arr - 待检查数组
 * @returns {boolean} 是否可能是归并排序的中间结果
 */
function canBeMergeSortStep(arr) {
    if (arr.length <= 1) return true;

    // 找到所有递增序列的分界点
    const segments = [];
    let start = 0;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) {
            segments.push([start, i - 1]);
            start = i;
        }
    }
    segments.push([start, arr.length - 1]);

    // 检查是否符合归并排序的特征
    // 1. 每个segment内部必须有序（已经通过上面的逻辑保证）
    // 2. segment的长度应该是2的幂次（简化检查）
    const validLengths = new Set();
    let power = 1;
    while (power <= arr.length) {
        validLengths.add(power);
        power *= 2;
    }

    return segments.every(([start, end]) => {
        const length = end - start + 1;
        return validLengths.has(length);
    });
}

/**
 * 练习题2：归并排序的迭代版本
 *
 * 思路：
 * 从小到大合并，先合并长度为1的子数组，再合并长度为2的，以此类推
 *
 * @param {number[]} arr - 待排序数组
 * @returns {number[]} 排序后的数组
 */
function mergeSortIterative(arr) {
    if (arr.length <= 1) return arr;

    const result = [...arr];
    const temp = new Array(arr.length);

    // 子数组大小从1开始，每次翻倍
    for (let size = 1; size < result.length; size *= 2) {
        // 合并所有大小为size的相邻子数组对
        for (let left = 0; left < result.length - size; left += size * 2) {
            const mid = left + size - 1;
            const right = Math.min(left + size * 2 - 1, result.length - 1);

            mergeInPlace(result, left, mid, right, temp);
        }
    }

    return result;
}

// 运行测试
if (typeof module !== 'undefined' && module.exports) {
    // Node.js 环境
    module.exports = {
        mergeSort,
        mergeSortOptimized,
        mergeSortWithCount,
        mergeSortWithInversions,
        mergeSortIterative,
        canBeMergeSortStep,
        testMergeSort
    };
} else {
    // 浏览器环境，运行测试
    testMergeSort();
}