/**
 * 第11章：排序算法 - 基础实现
 *
 * 本文件包含所有经典排序算法的完整实现，包括：
 * - 简单排序算法：冒泡、选择、插入
 * - 高效排序算法：归并、快速、堆排序
 * - 特殊排序算法：计数、桶、基数排序
 * - 性能测试和比较分析
 *
 * @author AI助手
 * @date 2024
 */

// =====================================================
// 辅助函数
// =====================================================

/**
 * 交换数组中两个元素的位置
 * @param {Array} arr 数组
 * @param {number} i 第一个索引
 * @param {number} j 第二个索引
 */
function swap(arr, i, j) {
    if (i !== j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

/**
 * 生成随机整数数组
 * @param {number} size 数组大小
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number[]} 随机数组
 */
function generateRandomArray(size, min = 0, max = 100) {
    return Array.from({length: size}, () =>
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

/**
 * 检查数组是否已排序
 * @param {Array} arr 数组
 * @param {Function} compareFn 比较函数
 * @returns {boolean} 是否已排序
 */
function isSorted(arr, compareFn = (a, b) => a - b) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (compareFn(arr[i], arr[i + 1]) > 0) {
            return false;
        }
    }
    return true;
}

// =====================================================
// 1. 简单排序算法
// =====================================================

/**
 * 冒泡排序
 *
 * 核心思想：
 * 重复地遍历数组，比较相邻元素并交换它们的位置，
 * 直到没有更多的交换需要进行。每次遍历都会将最大元素"冒泡"到正确位置。
 *
 * 算法步骤：
 * 1. 从数组第一个元素开始，比较相邻两个元素
 * 2. 如果前一个元素大于后一个，则交换它们
 * 3. 继续这个过程直到数组末尾
 * 4. 重复上述步骤，直到整个数组排序完成
 *
 * @param {Array} arr 待排序数组
 * @param {Function} compareFn 比较函数
 * @returns {Array} 排序后的数组
 * @time O(n²) 平均和最坏情况，O(n) 最好情况（已排序）
 * @space O(1) 原地排序
 */
function bubbleSort(arr, compareFn = (a, b) => a - b) {
    const n = arr.length;
    const result = [...arr]; // 创建副本，避免修改原数组

    for (let i = 0; i < n - 1; i++) {
        let swapped = false; // 优化：记录本轮是否有交换

        // 每轮将未排序部分的最大元素冒泡到末尾
        for (let j = 0; j < n - 1 - i; j++) {
            if (compareFn(result[j], result[j + 1]) > 0) {
                swap(result, j, j + 1);
                swapped = true;
            }
        }

        // 如果一轮没有交换，说明数组已排序
        if (!swapped) {
            break;
        }
    }

    return result;
}

/**
 * 选择排序
 *
 * 核心思想：
 * 将数组分为已排序和未排序两部分，
 * 每次从未排序部分选择最小的元素，将其放到已排序部分的末尾。
 *
 * 算法步骤：
 * 1. 在未排序序列中找到最小（大）元素
 * 2. 将其与未排序序列的第一个元素交换位置
 * 3. 重复步骤1-2，直到所有元素均排序完毕
 *
 * @param {Array} arr 待排序数组
 * @param {Function} compareFn 比较函数
 * @returns {Array} 排序后的数组
 * @time O(n²) 所有情况
 * @space O(1) 原地排序
 */
function selectionSort(arr, compareFn = (a, b) => a - b) {
    const n = arr.length;
    const result = [...arr];

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i; // 假设当前位置就是最小值

        // 在未排序部分找到真正的最小值
        for (let j = i + 1; j < n; j++) {
            if (compareFn(result[j], result[minIndex]) < 0) {
                minIndex = j;
            }
        }

        // 将最小值交换到已排序部分的末尾
        if (minIndex !== i) {
            swap(result, i, minIndex);
        }
    }

    return result;
}

/**
 * 插入排序
 *
 * 核心思想：
 * 类似于整理扑克牌，将每张牌插入到手中已排序牌的正确位置。
 * 将数组分为已排序和未排序两部分，逐个将未排序元素插入到已排序部分的适当位置。
 *
 * 算法步骤：
 * 1. 从第二个元素开始，将其作为待插入元素
 * 2. 将待插入元素与已排序部分的元素从后向前比较
 * 3. 找到合适位置后插入
 * 4. 重复步骤1-3直到所有元素处理完毕
 *
 * @param {Array} arr 待排序数组
 * @param {Function} compareFn 比较函数
 * @returns {Array} 排序后的数组
 * @time O(n²) 平均和最坏情况，O(n) 最好情况（已排序）
 * @space O(1) 原地排序
 */
function insertionSort(arr, compareFn = (a, b) => a - b) {
    const result = [...arr];

    for (let i = 1; i < result.length; i++) {
        const current = result[i]; // 当前要插入的元素
        let j = i - 1;

        // 在已排序部分找到插入位置
        while (j >= 0 && compareFn(result[j], current) > 0) {
            result[j + 1] = result[j]; // 元素后移
            j--;
        }

        result[j + 1] = current; // 插入到正确位置
    }

    return result;
}

// =====================================================
// 2. 高效排序算法
// =====================================================

/**
 * 归并排序
 *
 * 核心思想：
 * 分治法的经典应用，将大问题分解为小问题递归解决。
 * 先将数组递归分割为最小单元，然后有序地合并。
 *
 * 算法步骤：
 * 1. 分割：将数组分为两半，直到每部分只有一个元素
 * 2. 征服：递归地对两半进行排序
 * 3. 合并：将两个有序的子数组合并为一个有序数组
 *
 * @param {Array} arr 待排序数组
 * @param {Function} compareFn 比较函数
 * @returns {Array} 排序后的数组
 * @time O(n log n) 所有情况
 * @space O(n) 需要额外空间存储临时数组
 */
function mergeSort(arr, compareFn = (a, b) => a - b) {
    // 基本情况：数组长度为0或1时已经有序
    if (arr.length <= 1) {
        return [...arr];
    }

    // 分割数组
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid), compareFn);
    const right = mergeSort(arr.slice(mid), compareFn);

    // 合并两个有序数组
    return merge(left, right, compareFn);
}

/**
 * 合并两个有序数组
 * @param {Array} left 左有序数组
 * @param {Array} right 右有序数组
 * @param {Function} compareFn 比较函数
 * @returns {Array} 合并后的有序数组
 */
function merge(left, right, compareFn) {
    const result = [];
    let i = 0, j = 0;

    // 比较两个数组的元素，选择较小的加入结果数组
    while (i < left.length && j < right.length) {
        if (compareFn(left[i], right[j]) <= 0) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }

    // 添加剩余元素
    result.push(...left.slice(i));
    result.push(...right.slice(j));

    return result;
}

/**
 * 快速排序
 *
 * 核心思想：
 * 选择一个基准元素，将数组分为小于基准和大于基准两部分，
 * 然后递归地对这两部分进行排序。
 *
 * 算法步骤：
 * 1. 选择基准元素（通常选择第一个、最后一个或中间元素）
 * 2. 分区：重新排列数组，使所有小于基准的元素在基准前面，
 *    所有大于基准的元素在基准后面
 * 3. 递归：对基准前后的两个子数组分别进行快速排序
 *
 * @param {Array} arr 待排序数组
 * @param {Function} compareFn 比较函数
 * @param {number} left 左边界
 * @param {number} right 右边界
 * @returns {Array} 排序后的数组
 * @time O(n log n) 平均情况，O(n²) 最坏情况
 * @space O(log n) 递归栈空间
 */
function quickSort(arr, compareFn = (a, b) => a - b, left = 0, right = arr.length - 1) {
    const result = left === 0 && right === arr.length - 1 ? [...arr] : arr;

    if (left < right) {
        // 分区操作，返回基准元素的最终位置
        const pivotIndex = partition(result, compareFn, left, right);

        // 递归排序左右子数组
        quickSort(result, compareFn, left, pivotIndex - 1);
        quickSort(result, compareFn, pivotIndex + 1, right);
    }

    return result;
}

/**
 * 分区函数（Lomuto分区方案）
 * @param {Array} arr 数组
 * @param {Function} compareFn 比较函数
 * @param {number} left 左边界
 * @param {number} right 右边界
 * @returns {number} 基准元素的最终位置
 */
function partition(arr, compareFn, left, right) {
    const pivot = arr[right]; // 选择最后一个元素作为基准
    let i = left - 1; // 小于基准元素的边界

    for (let j = left; j < right; j++) {
        if (compareFn(arr[j], pivot) <= 0) {
            i++;
            swap(arr, i, j);
        }
    }

    swap(arr, i + 1, right); // 将基准元素放到正确位置
    return i + 1;
}

/**
 * 快速排序（随机化版本）
 * 通过随机选择基准元素来避免最坏情况
 */
function randomizedQuickSort(arr, compareFn = (a, b) => a - b) {
    const result = [...arr];

    function randomizedQuickSortHelper(arr, left, right) {
        if (left < right) {
            // 随机选择基准元素
            const randomIndex = left + Math.floor(Math.random() * (right - left + 1));
            swap(arr, randomIndex, right);

            const pivotIndex = partition(arr, compareFn, left, right);
            randomizedQuickSortHelper(arr, left, pivotIndex - 1);
            randomizedQuickSortHelper(arr, pivotIndex + 1, right);
        }
    }

    randomizedQuickSortHelper(result, 0, result.length - 1);
    return result;
}

/**
 * 堆排序
 *
 * 核心思想：
 * 利用堆这种数据结构来进行排序。
 * 先将无序数组构造成最大堆，然后反复提取堆顶最大元素。
 *
 * 算法步骤：
 * 1. 建堆：将无序数组构造成最大堆
 * 2. 排序：反复执行"提取最大值并调整堆"的操作
 *
 * @param {Array} arr 待排序数组
 * @param {Function} compareFn 比较函数
 * @returns {Array} 排序后的数组
 * @time O(n log n) 所有情况
 * @space O(1) 原地排序
 */
function heapSort(arr, compareFn = (a, b) => a - b) {
    const result = [...arr];
    const n = result.length;

    // 建堆：从最后一个非叶子节点开始向下调整
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(result, n, i, compareFn);
    }

    // 排序：反复提取堆顶最大元素
    for (let i = n - 1; i > 0; i--) {
        swap(result, 0, i);      // 将堆顶最大元素交换到末尾
        heapify(result, i, 0, compareFn); // 重新调整堆
    }

    return result;
}

/**
 * 堆调整函数（向下调整）
 * @param {Array} arr 数组
 * @param {number} n 堆大小
 * @param {number} i 要调整的节点索引
 * @param {Function} compareFn 比较函数
 */
function heapify(arr, n, i, compareFn) {
    let largest = i;           // 假设当前节点最大
    const left = 2 * i + 1;    // 左子节点
    const right = 2 * i + 2;   // 右子节点

    // 找到父节点和子节点中的最大值
    if (left < n && compareFn(arr[left], arr[largest]) > 0) {
        largest = left;
    }

    if (right < n && compareFn(arr[right], arr[largest]) > 0) {
        largest = right;
    }

    // 如果最大值不是当前节点，则交换并继续调整
    if (largest !== i) {
        swap(arr, i, largest);
        heapify(arr, n, largest, compareFn);
    }
}

// =====================================================
// 3. 特殊排序算法（非基于比较）
// =====================================================

/**
 * 计数排序
 *
 * 核心思想：
 * 对于已知范围的整数，通过计算每个元素的出现次数来排序，
 * 而不是通过比较元素的大小。
 *
 * 算法步骤：
 * 1. 统计每个元素的出现次数
 * 2. 计算累积计数，确定每个元素在输出数组中的位置
 * 3. 从后向前遍历原数组，将元素放到正确位置
 *
 * @param {number[]} arr 待排序数组（非负整数）
 * @param {number} maxValue 数组中的最大值
 * @returns {number[]} 排序后的数组
 * @time O(n + k) k为数据范围
 * @space O(k) 需要额外的计数数组
 */
function countingSort(arr, maxValue = null) {
    if (arr.length === 0) return [];

    // 自动计算最大值（如果未提供）
    if (maxValue === null) {
        maxValue = Math.max(...arr);
    }

    // 创建计数数组
    const count = new Array(maxValue + 1).fill(0);

    // 统计每个元素的出现次数
    for (const num of arr) {
        count[num]++;
    }

    // 计算累积计数
    for (let i = 1; i <= maxValue; i++) {
        count[i] += count[i - 1];
    }

    // 构建输出数组
    const result = new Array(arr.length);

    // 从后向前遍历，保证稳定性
    for (let i = arr.length - 1; i >= 0; i--) {
        result[count[arr[i]] - 1] = arr[i];
        count[arr[i]]--;
    }

    return result;
}

/**
 * 桶排序
 *
 * 核心思想：
 * 将数组分到有限数量的桶里，每个桶再个别排序
 * （有可能再使用别的排序算法或是以递归方式继续使用桶排序）
 *
 * @param {number[]} arr 待排序数组
 * @param {number} bucketSize 桶的大小
 * @returns {number[]} 排序后的数组
 * @time O(n + k) 平均情况，O(n²) 最坏情况
 * @space O(n + k) k为桶的数量
 */
function bucketSort(arr, bucketSize = 5) {
    if (arr.length === 0) return [];

    // 找到最大值和最小值
    const minValue = Math.min(...arr);
    const maxValue = Math.max(...arr);

    // 计算桶的数量
    const bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
    const buckets = Array.from({length: bucketCount}, () => []);

    // 将元素分配到各个桶中
    for (const num of arr) {
        const bucketIndex = Math.floor((num - minValue) / bucketSize);
        buckets[bucketIndex].push(num);
    }

    // 对每个桶进行排序，然后合并
    const result = [];
    for (const bucket of buckets) {
        // 对桶内元素使用插入排序
        const sortedBucket = insertionSort(bucket);
        result.push(...sortedBucket);
    }

    return result;
}

/**
 * 基数排序（LSD - 最低有效数字）
 *
 * 核心思想：
 * 按照数字的每一位进行排序，从最低位开始到最高位。
 * 每一位的排序使用稳定的计数排序。
 *
 * @param {number[]} arr 待排序数组（非负整数）
 * @returns {number[]} 排序后的数组
 * @time O(d × (n + k)) d为最大数的位数，k为基数（通常为10）
 * @space O(n + k)
 */
function radixSort(arr) {
    if (arr.length === 0) return [];

    // 找到最大值以确定最大位数
    const maxValue = Math.max(...arr);
    const maxDigits = maxValue.toString().length;

    let result = [...arr];

    // 从最低位开始排序
    for (let digit = 0; digit < maxDigits; digit++) {
        result = countingSortByDigit(result, digit);
    }

    return result;
}

/**
 * 按指定位数进行计数排序（基数排序的辅助函数）
 * @param {number[]} arr 数组
 * @param {number} digit 位数（0为个位，1为十位，...）
 * @returns {number[]} 按指定位排序后的数组
 */
function countingSortByDigit(arr, digit) {
    const count = new Array(10).fill(0); // 0-9的计数
    const result = new Array(arr.length);

    // 统计每个数字在指定位上的出现次数
    for (const num of arr) {
        const digitValue = Math.floor(num / Math.pow(10, digit)) % 10;
        count[digitValue]++;
    }

    // 计算累积计数
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // 从后向前构建结果数组（保证稳定性）
    for (let i = arr.length - 1; i >= 0; i--) {
        const digitValue = Math.floor(arr[i] / Math.pow(10, digit)) % 10;
        result[count[digitValue] - 1] = arr[i];
        count[digitValue]--;
    }

    return result;
}

// =====================================================
// 4. 混合排序算法
// =====================================================

/**
 * Tim排序（Python默认排序算法的简化版本）
 *
 * 核心思想：
 * 结合归并排序和插入排序的优点，
 * 对小数组使用插入排序，对大数组使用改进的归并排序
 *
 * @param {Array} arr 待排序数组
 * @param {Function} compareFn 比较函数
 * @returns {Array} 排序后的数组
 */
function timSort(arr, compareFn = (a, b) => a - b) {
    const MIN_MERGE = 32;
    const n = arr.length;
    const result = [...arr];

    // 对小数组直接使用插入排序
    if (n < MIN_MERGE) {
        return insertionSort(result, compareFn);
    }

    // 对较大数组，先用插入排序处理小段，再用归并排序合并
    for (let i = 0; i < n; i += MIN_MERGE) {
        const end = Math.min(i + MIN_MERGE - 1, n - 1);
        const segment = result.slice(i, end + 1);
        const sortedSegment = insertionSort(segment, compareFn);
        result.splice(i, sortedSegment.length, ...sortedSegment);
    }

    // 归并各个已排序的段
    let size = MIN_MERGE;
    while (size < n) {
        for (let start = 0; start < n; start += size * 2) {
            const mid = start + size - 1;
            const end = Math.min(start + size * 2 - 1, n - 1);

            if (mid < end) {
                const left = result.slice(start, mid + 1);
                const right = result.slice(mid + 1, end + 1);
                const merged = merge(left, right, compareFn);
                result.splice(start, merged.length, ...merged);
            }
        }
        size *= 2;
    }

    return result;
}

/**
 * 内省排序（Introsort）的简化版本
 *
 * 核心思想：
 * 开始时使用快速排序，当递归深度过深时切换到堆排序，
 * 对小数组使用插入排序
 *
 * @param {Array} arr 待排序数组
 * @param {Function} compareFn 比较函数
 * @returns {Array} 排序后的数组
 */
function introSort(arr, compareFn = (a, b) => a - b) {
    const result = [...arr];
    const maxDepth = Math.floor(Math.log2(arr.length)) * 2;

    function introSortHelper(arr, left, right, depth) {
        const size = right - left + 1;

        // 小数组使用插入排序
        if (size <= 16) {
            const segment = arr.slice(left, right + 1);
            const sorted = insertionSort(segment, compareFn);
            arr.splice(left, sorted.length, ...sorted);
            return;
        }

        // 递归深度过深时使用堆排序
        if (depth === 0) {
            const segment = arr.slice(left, right + 1);
            const sorted = heapSort(segment, compareFn);
            arr.splice(left, sorted.length, ...sorted);
            return;
        }

        // 否则使用快速排序
        const pivotIndex = partition(arr, compareFn, left, right);
        introSortHelper(arr, left, pivotIndex - 1, depth - 1);
        introSortHelper(arr, pivotIndex + 1, right, depth - 1);
    }

    introSortHelper(result, 0, result.length - 1, maxDepth);
    return result;
}

// =====================================================
// 5. 测试和性能分析
// =====================================================

/**
 * 排序算法测试类
 */
class SortingAlgorithmTester {
    constructor() {
        this.algorithms = {
            '冒泡排序': bubbleSort,
            '选择排序': selectionSort,
            '插入排序': insertionSort,
            '归并排序': mergeSort,
            '快速排序': quickSort,
            '随机快排': randomizedQuickSort,
            '堆排序': heapSort,
            '计数排序': (arr) => countingSort(arr.filter(n => n >= 0 && Number.isInteger(n))),
            '桶排序': bucketSort,
            '基数排序': (arr) => radixSort(arr.filter(n => n >= 0 && Number.isInteger(n))),
            'Tim排序': timSort,
            '内省排序': introSort
        };
    }

    /**
     * 测试单个算法的正确性
     * @param {string} algorithmName 算法名称
     * @param {Array} testData 测试数据
     * @returns {Object} 测试结果
     */
    testAlgorithm(algorithmName, testData) {
        const algorithm = this.algorithms[algorithmName];
        if (!algorithm) {
            throw new Error(`未找到算法: ${algorithmName}`);
        }

        const start = performance.now();
        const result = algorithm(testData);
        const end = performance.now();

        const isCorrect = isSorted(result);
        const executionTime = end - start;

        return {
            algorithm: algorithmName,
            isCorrect,
            executionTime: Math.round(executionTime * 1000) / 1000, // 保留3位小数
            inputSize: testData.length,
            result: result.length <= 20 ? result : `[${result.slice(0, 5).join(', ')}, ..., ${result.slice(-5).join(', ')}]`
        };
    }

    /**
     * 批量测试所有算法
     * @param {Array} testData 测试数据
     * @returns {Array} 所有算法的测试结果
     */
    testAllAlgorithms(testData) {
        const results = [];

        for (const algorithmName of Object.keys(this.algorithms)) {
            try {
                const result = this.testAlgorithm(algorithmName, testData);
                results.push(result);
            } catch (error) {
                results.push({
                    algorithm: algorithmName,
                    isCorrect: false,
                    executionTime: -1,
                    inputSize: testData.length,
                    error: error.message
                });
            }
        }

        return results.sort((a, b) => a.executionTime - b.executionTime);
    }

    /**
     * 性能基准测试
     * @param {Array} sizes 不同的数据规模
     * @returns {Object} 性能测试结果
     */
    performanceBenchmark(sizes = [100, 1000, 5000, 10000]) {
        const benchmarkResults = {};

        for (const size of sizes) {
            console.log(`\n=== 测试数据规模: ${size} ===`);

            // 生成测试数据
            const randomData = generateRandomArray(size, 0, size);
            const nearSortedData = [...randomData].sort((a, b) => a - b);
            // 打乱一小部分数据制造"接近排序"的情况
            for (let i = 0; i < size * 0.1; i++) {
                const idx1 = Math.floor(Math.random() * size);
                const idx2 = Math.floor(Math.random() * size);
                [nearSortedData[idx1], nearSortedData[idx2]] = [nearSortedData[idx2], nearSortedData[idx1]];
            }

            const reversedData = [...randomData].sort((a, b) => b - a);

            const testCases = {
                '随机数据': randomData,
                '接近排序': nearSortedData,
                '逆序数据': reversedData
            };

            benchmarkResults[size] = {};

            for (const [caseName, data] of Object.entries(testCases)) {
                console.log(`\n--- ${caseName} ---`);
                const results = this.testAllAlgorithms(data);
                benchmarkResults[size][caseName] = results;

                // 只显示前5名最快的算法
                results.slice(0, 5).forEach(result => {
                    const status = result.isCorrect ? '✓' : '✗';
                    console.log(`${status} ${result.algorithm}: ${result.executionTime}ms`);
                });
            }
        }

        return benchmarkResults;
    }
}

/**
 * 稳定性测试
 */
function testStability() {
    console.log('\n=== 排序算法稳定性测试 ===');

    // 创建测试数据：具有相同值但不同原始索引的对象
    const testData = [
        {value: 3, original: 0},
        {value: 1, original: 1},
        {value: 3, original: 2},
        {value: 2, original: 3},
        {value: 1, original: 4},
        {value: 2, original: 5}
    ];

    const compareFn = (a, b) => a.value - b.value;

    const algorithms = {
        '冒泡排序': bubbleSort,
        '选择排序': selectionSort,
        '插入排序': insertionSort,
        '归并排序': mergeSort,
        '快速排序': quickSort,
        '堆排序': heapSort
    };

    for (const [name, algorithm] of Object.entries(algorithms)) {
        const result = algorithm(testData, compareFn);
        const isStable = checkStability(result);
        console.log(`${name}: ${isStable ? '稳定' : '不稳定'}`);
    }

    function checkStability(sortedData) {
        for (let i = 0; i < sortedData.length - 1; i++) {
            if (sortedData[i].value === sortedData[i + 1].value) {
                if (sortedData[i].original > sortedData[i + 1].original) {
                    return false;
                }
            }
        }
        return true;
    }
}

/**
 * 运行所有测试
 */
function runAllTests() {
    console.log('=== 第11章：排序算法测试 ===');

    // 基本正确性测试
    console.log('\n1. 基本正确性测试');
    const tester = new SortingAlgorithmTester();
    const basicTestData = [64, 34, 25, 12, 22, 11, 90, 88, 76, 50, 42];
    const basicResults = tester.testAllAlgorithms(basicTestData);

    console.log('\n算法名称\t\t正确性\t执行时间');
    console.log('----------------------------------------');
    basicResults.forEach(result => {
        const status = result.isCorrect ? '✓' : '✗';
        const name = result.algorithm.padEnd(12);
        console.log(`${name}\t${status}\t${result.executionTime}ms`);
    });

    // 稳定性测试
    testStability();

    // 性能基准测试
    console.log('\n2. 性能基准测试');
    const benchmarkResults = tester.performanceBenchmark([1000, 5000]);

    return {
        basicResults,
        benchmarkResults
    };
}

// 导出所有函数供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // 简单排序
        bubbleSort,
        selectionSort,
        insertionSort,

        // 高效排序
        mergeSort,
        quickSort,
        randomizedQuickSort,
        heapSort,

        // 特殊排序
        countingSort,
        bucketSort,
        radixSort,

        // 混合排序
        timSort,
        introSort,

        // 工具函数
        swap,
        generateRandomArray,
        isSorted,

        // 测试类
        SortingAlgorithmTester,
        runAllTests
    };
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
    runAllTests();
}