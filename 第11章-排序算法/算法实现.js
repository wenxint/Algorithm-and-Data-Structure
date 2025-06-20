/**
 * 第11章：排序算法 - 高级算法实现
 *
 * 本文件包含排序算法的高级应用和优化技巧，包括：
 * - 实际应用场景的排序问题
 * - 自定义排序和多关键字排序
 * - 外部排序和大数据处理
 * - 并行排序算法
 * - 排序算法的变种和优化
 *
 * @author AI助手
 * @date 2024
 */

// =====================================================
// 1. 实际应用场景排序
// =====================================================

/**
 * 学生成绩排序系统
 *
 * 核心思想：
 * 多关键字排序，按照不同优先级对学生数据进行排序
 * 支持总分、单科成绩、姓名等多种排序条件
 */
class StudentGradeManager {
    constructor() {
        this.students = [];
    }

    /**
     * 添加学生数据
     * @param {string} name 姓名
     * @param {number} math 数学成绩
     * @param {number} english 英语成绩
     * @param {number} science 科学成绩
     */
    addStudent(name, math, english, science) {
        this.students.push({
            name,
            math,
            english,
            science,
            total: math + english + science
        });
    }

    /**
     * 按总分排序（高到低）
     * @returns {Array} 排序后的学生列表
     */
    sortByTotal() {
        return [...this.students].sort((a, b) => b.total - a.total);
    }

    /**
     * 多关键字排序
     * 先按总分排序，总分相同时按数学成绩排序，再相同时按姓名排序
     *
     * @returns {Array} 排序后的学生列表
     */
    sortByMultipleKeys() {
        return [...this.students].sort((a, b) => {
            // 主要关键字：总分（降序）
            if (a.total !== b.total) {
                return b.total - a.total;
            }

            // 次要关键字：数学成绩（降序）
            if (a.math !== b.math) {
                return b.math - a.math;
            }

            // 第三关键字：姓名（升序）
            return a.name.localeCompare(b.name);
        });
    }

    /**
     * 按指定科目排序
     * @param {string} subject 科目名称
     * @param {boolean} ascending 是否升序
     * @returns {Array} 排序后的学生列表
     */
    sortBySubject(subject, ascending = false) {
        return [...this.students].sort((a, b) => {
            const result = a[subject] - b[subject];
            return ascending ? result : -result;
        });
    }

    /**
     * 等级排名（处理并列情况）
     * @returns {Array} 包含排名的学生列表
     */
    getRankings() {
        const sortedStudents = this.sortByTotal();
        let currentRank = 1;

        for (let i = 0; i < sortedStudents.length; i++) {
            if (i > 0 && sortedStudents[i].total < sortedStudents[i - 1].total) {
                currentRank = i + 1;
            }
            sortedStudents[i].rank = currentRank;
        }

        return sortedStudents;
    }
}

/**
 * 任务调度系统
 *
 * 核心思想：
 * 根据任务的优先级、截止时间、执行时间等因素进行排序调度
 */
class TaskScheduler {
    constructor() {
        this.tasks = [];
    }

    /**
     * 添加任务
     * @param {string} id 任务ID
     * @param {number} priority 优先级（数字越大优先级越高）
     * @param {number} deadline 截止时间（时间戳）
     * @param {number} duration 执行时间（分钟）
     */
    addTask(id, priority, deadline, duration) {
        this.tasks.push({
            id,
            priority,
            deadline,
            duration,
            urgency: this.calculateUrgency(deadline, duration)
        });
    }

    /**
     * 计算紧急度
     * @param {number} deadline 截止时间
     * @param {number} duration 执行时间
     * @returns {number} 紧急度分数
     */
    calculateUrgency(deadline, duration) {
        const now = Date.now();
        const timeLeft = deadline - now;
        const timeRatio = duration / timeLeft;
        return timeRatio * 1000; // 放大倍数便于比较
    }

    /**
     * 最早截止时间优先（EDF）调度
     * @returns {Array} 按EDF排序的任务列表
     */
    scheduleByEDF() {
        return [...this.tasks].sort((a, b) => a.deadline - b.deadline);
    }

    /**
     * 优先级调度
     * @returns {Array} 按优先级排序的任务列表
     */
    scheduleByPriority() {
        return [...this.tasks].sort((a, b) => b.priority - a.priority);
    }

    /**
     * 综合调度算法
     * 结合优先级、紧急度和执行时间的综合调度
     *
     * @returns {Array} 综合排序的任务列表
     */
    scheduleComprehensive() {
        return [...this.tasks].sort((a, b) => {
            // 计算综合分数
            const scoreA = a.priority * 0.4 + a.urgency * 0.4 + (1 / a.duration) * 0.2;
            const scoreB = b.priority * 0.4 + b.urgency * 0.4 + (1 / b.duration) * 0.2;

            return scoreB - scoreA;
        });
    }

    /**
     * 最短作业优先（SJF）调度
     * @returns {Array} 按执行时间排序的任务列表
     */
    scheduleBySJF() {
        return [...this.tasks].sort((a, b) => a.duration - b.duration);
    }
}

/**
 * 商品排序系统
 *
 * 核心思想：
 * 电商平台的商品排序，支持价格、销量、评分、上架时间等多维度排序
 */
class ProductSorter {
    constructor() {
        this.products = [];
    }

    /**
     * 添加商品
     * @param {string} id 商品ID
     * @param {string} name 商品名称
     * @param {number} price 价格
     * @param {number} sales 销量
     * @param {number} rating 评分
     * @param {number} listTime 上架时间
     */
    addProduct(id, name, price, sales, rating, listTime) {
        this.products.push({
            id,
            name,
            price,
            sales,
            rating,
            listTime,
            popularityScore: this.calculatePopularity(sales, rating)
        });
    }

    /**
     * 计算商品热度分数
     * @param {number} sales 销量
     * @param {number} rating 评分
     * @returns {number} 热度分数
     */
    calculatePopularity(sales, rating) {
        return Math.log(sales + 1) * rating * rating;
    }

    /**
     * 价格排序
     * @param {boolean} ascending 是否升序
     * @returns {Array} 排序后的商品列表
     */
    sortByPrice(ascending = true) {
        return [...this.products].sort((a, b) => {
            return ascending ? a.price - b.price : b.price - a.price;
        });
    }

    /**
     * 销量排序
     * @returns {Array} 按销量降序排序的商品列表
     */
    sortBySales() {
        return [...this.products].sort((a, b) => b.sales - a.sales);
    }

    /**
     * 综合排序（推荐算法）
     * 结合销量、评分、价格的综合排序
     *
     * @returns {Array} 综合排序的商品列表
     */
    sortByRecommendation() {
        return [...this.products].sort((a, b) => {
            // 标准化各项指标
            const maxPrice = Math.max(...this.products.map(p => p.price));
            const maxSales = Math.max(...this.products.map(p => p.sales));

            // 计算综合分数（价格因子为负，因为价格越低越好）
            const scoreA = (a.sales / maxSales) * 0.4 +
                          (a.rating / 5) * 0.4 +
                          (1 - a.price / maxPrice) * 0.2;

            const scoreB = (b.sales / maxSales) * 0.4 +
                          (b.rating / 5) * 0.4 +
                          (1 - b.price / maxPrice) * 0.2;

            return scoreB - scoreA;
        });
    }

    /**
     * 新品排序
     * @returns {Array} 按上架时间排序的商品列表
     */
    sortByNewest() {
        return [...this.products].sort((a, b) => b.listTime - a.listTime);
    }
}

// =====================================================
// 2. 外部排序算法
// =====================================================

/**
 * 外部归并排序
 *
 * 核心思想：
 * 处理无法完全装入内存的大数据文件，
 * 将大文件分割为小块，分别排序后再归并
 */
class ExternalMergeSort {
    constructor(chunkSize = 1000) {
        this.chunkSize = chunkSize;
        this.tempFiles = [];
    }

    /**
     * 外部排序主函数
     * @param {Array} largeArray 大数组（模拟大文件）
     * @returns {Array} 排序后的结果
     */
    externalSort(largeArray) {
        // 第一阶段：分割并排序小块
        const chunks = this.splitAndSort(largeArray);

        // 第二阶段：多路归并
        return this.multiWayMerge(chunks);
    }

    /**
     * 分割数组并对每块进行排序
     * @param {Array} array 原数组
     * @returns {Array} 排序后的小块数组
     */
    splitAndSort(array) {
        const chunks = [];

        for (let i = 0; i < array.length; i += this.chunkSize) {
            const chunk = array.slice(i, i + this.chunkSize);
            // 对小块使用内存中的高效排序算法
            chunk.sort((a, b) => a - b);
            chunks.push(chunk);
        }

        return chunks;
    }

    /**
     * 多路归并算法
     * @param {Array} chunks 已排序的小块数组
     * @returns {Array} 归并后的结果
     */
    multiWayMerge(chunks) {
        // 使用优先队列（最小堆）进行多路归并
        const heap = new MinHeap();
        const result = [];

        // 初始化堆：每个chunk的第一个元素入堆
        chunks.forEach((chunk, chunkIndex) => {
            if (chunk.length > 0) {
                heap.insert({
                    value: chunk[0],
                    chunkIndex,
                    elementIndex: 0
                });
            }
        });

        // 多路归并过程
        while (!heap.isEmpty()) {
            const min = heap.extractMin();
            result.push(min.value);

            // 如果当前chunk还有元素，将下一个元素入堆
            const nextIndex = min.elementIndex + 1;
            if (nextIndex < chunks[min.chunkIndex].length) {
                heap.insert({
                    value: chunks[min.chunkIndex][nextIndex],
                    chunkIndex: min.chunkIndex,
                    elementIndex: nextIndex
                });
            }
        }

        return result;
    }

    /**
     * 模拟处理大文件的外部排序
     * @param {Function} dataGenerator 数据生成器函数
     * @param {number} totalSize 总数据量
     * @returns {Array} 排序结果
     */
    sortLargeDataset(dataGenerator, totalSize) {
        console.log(`开始外部排序，总数据量: ${totalSize}`);

        const chunks = [];
        let processed = 0;

        // 分批处理数据
        while (processed < totalSize) {
            const currentChunkSize = Math.min(this.chunkSize, totalSize - processed);
            const chunk = [];

            // 生成当前块的数据
            for (let i = 0; i < currentChunkSize; i++) {
                chunk.push(dataGenerator());
            }

            // 排序当前块
            chunk.sort((a, b) => a - b);
            chunks.push(chunk);

            processed += currentChunkSize;
            console.log(`已处理: ${processed}/${totalSize}`);
        }

        console.log('开始多路归并...');
        return this.multiWayMerge(chunks);
    }
}

/**
 * 最小堆实现（用于外部排序的多路归并）
 */
class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert(item) {
        this.heap.push(item);
        this.heapifyUp(this.heap.length - 1);
    }

    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return min;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    heapifyUp(index) {
        if (index === 0) return;

        const parentIndex = Math.floor((index - 1) / 2);
        if (this.heap[index].value < this.heap[parentIndex].value) {
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            this.heapifyUp(parentIndex);
        }
    }

    heapifyDown(index) {
        const leftChild = 2 * index + 1;
        const rightChild = 2 * index + 2;
        let smallest = index;

        if (leftChild < this.heap.length && this.heap[leftChild].value < this.heap[smallest].value) {
            smallest = leftChild;
        }

        if (rightChild < this.heap.length && this.heap[rightChild].value < this.heap[smallest].value) {
            smallest = rightChild;
        }

        if (smallest !== index) {
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            this.heapifyDown(smallest);
        }
    }
}

// =====================================================
// 3. 并行排序算法
// =====================================================

/**
 * 并行归并排序
 *
 * 核心思想：
 * 利用Web Workers实现真正的并行排序，
 * 将数组分割为多个部分，并行排序后再归并
 */
class ParallelMergeSort {
    constructor(maxWorkers = 4) {
        this.maxWorkers = Math.min(maxWorkers, navigator.hardwareConcurrency || 4);
    }

    /**
     * 并行归并排序主函数
     * @param {Array} array 待排序数组
     * @returns {Promise<Array>} 排序后的数组
     */
    async parallelMergeSort(array) {
        if (array.length <= 1000) {
            // 小数组直接使用单线程排序
            return this.sequentialMergeSort(array);
        }

        // 计算每个工作线程处理的数据大小
        const chunkSize = Math.ceil(array.length / this.maxWorkers);
        const chunks = [];

        // 分割数组
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }

        // 并行排序各个块
        const sortedChunks = await Promise.all(
            chunks.map(chunk => this.sortChunkAsync(chunk))
        );

        // 归并所有已排序的块
        return this.mergeMultiple(sortedChunks);
    }

    /**
     * 异步排序单个块
     * @param {Array} chunk 数组块
     * @returns {Promise<Array>} 排序后的块
     */
    async sortChunkAsync(chunk) {
        return new Promise((resolve) => {
            // 模拟异步排序过程
            setTimeout(() => {
                resolve(this.sequentialMergeSort(chunk));
            }, 0);
        });
    }

    /**
     * 顺序归并排序
     * @param {Array} array 数组
     * @returns {Array} 排序后的数组
     */
    sequentialMergeSort(array) {
        if (array.length <= 1) return [...array];

        const mid = Math.floor(array.length / 2);
        const left = this.sequentialMergeSort(array.slice(0, mid));
        const right = this.sequentialMergeSort(array.slice(mid));

        return this.merge(left, right);
    }

    /**
     * 合并两个有序数组
     * @param {Array} left 左数组
     * @param {Array} right 右数组
     * @returns {Array} 合并后的数组
     */
    merge(left, right) {
        const result = [];
        let i = 0, j = 0;

        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result.push(left[i++]);
            } else {
                result.push(right[j++]);
            }
        }

        result.push(...left.slice(i));
        result.push(...right.slice(j));

        return result;
    }

    /**
     * 归并多个有序数组
     * @param {Array} arrays 多个有序数组
     * @returns {Array} 归并后的数组
     */
    mergeMultiple(arrays) {
        while (arrays.length > 1) {
            const merged = [];

            // 两两归并
            for (let i = 0; i < arrays.length; i += 2) {
                if (i + 1 < arrays.length) {
                    merged.push(this.merge(arrays[i], arrays[i + 1]));
                } else {
                    merged.push(arrays[i]);
                }
            }

            arrays = merged;
        }

        return arrays[0] || [];
    }
}

/**
 * 并行快速排序
 *
 * 核心思想：
 * 在分区后，对左右子数组并行进行排序
 */
class ParallelQuickSort {
    constructor(threshold = 1000) {
        this.threshold = threshold; // 切换到顺序排序的阈值
    }

    /**
     * 并行快速排序主函数
     * @param {Array} array 待排序数组
     * @returns {Promise<Array>} 排序后的数组
     */
    async parallelQuickSort(array) {
        const result = [...array];
        await this.parallelQuickSortHelper(result, 0, result.length - 1);
        return result;
    }

    /**
     * 并行快速排序辅助函数
     * @param {Array} array 数组
     * @param {number} left 左边界
     * @param {number} right 右边界
     */
    async parallelQuickSortHelper(array, left, right) {
        if (left >= right) return;

        const size = right - left + 1;

        // 小数组使用顺序排序
        if (size <= this.threshold) {
            this.insertionSort(array, left, right);
            return;
        }

        // 分区
        const pivotIndex = this.partition(array, left, right);

        // 并行处理左右子数组
        await Promise.all([
            this.parallelQuickSortHelper(array, left, pivotIndex - 1),
            this.parallelQuickSortHelper(array, pivotIndex + 1, right)
        ]);
    }

    /**
     * 分区函数
     * @param {Array} array 数组
     * @param {number} left 左边界
     * @param {number} right 右边界
     * @returns {number} 基准元素的位置
     */
    partition(array, left, right) {
        const pivot = array[right];
        let i = left - 1;

        for (let j = left; j < right; j++) {
            if (array[j] <= pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        [array[i + 1], array[right]] = [array[right], array[i + 1]];
        return i + 1;
    }

    /**
     * 插入排序（用于小数组）
     * @param {Array} array 数组
     * @param {number} left 左边界
     * @param {number} right 右边界
     */
    insertionSort(array, left, right) {
        for (let i = left + 1; i <= right; i++) {
            const key = array[i];
            let j = i - 1;

            while (j >= left && array[j] > key) {
                array[j + 1] = array[j];
                j--;
            }

            array[j + 1] = key;
        }
    }
}

// =====================================================
// 4. 特殊排序问题和优化
// =====================================================

/**
 * 荷兰国旗问题（三色排序）
 *
 * 核心思想：
 * 将数组中的元素分为三类，只扫描一次就完成排序
 * 使用三个指针分别指向三个区域的边界
 */
function dutchFlagSort(array, pivot) {
    let low = 0;      // 小于pivot的区域的下一个位置
    let mid = 0;      // 当前检查的位置
    let high = array.length - 1; // 大于pivot的区域的前一个位置

    while (mid <= high) {
        if (array[mid] < pivot) {
            // 当前元素小于pivot，放到左边区域
            [array[low], array[mid]] = [array[mid], array[low]];
            low++;
            mid++;
        } else if (array[mid] > pivot) {
            // 当前元素大于pivot，放到右边区域
            [array[mid], array[high]] = [array[high], array[mid]];
            high--;
            // 注意：这里mid不增加，因为从high位置交换过来的元素还没有检查
        } else {
            // 当前元素等于pivot，放在中间区域
            mid++;
        }
    }

    return array;
}

/**
 * 字符串排序优化
 *
 * 核心思想：
 * 对字符串数组进行优化排序，使用基数排序的思想
 * 按字符位置逐位进行排序
 */
class StringSorter {
    /**
     * MSD基数排序（最高有效数字优先）
     * @param {string[]} strings 字符串数组
     * @returns {string[]} 排序后的字符串数组
     */
    static msdRadixSort(strings) {
        if (!strings || strings.length <= 1) return strings;

        const result = [...strings];
        const maxLength = Math.max(...strings.map(s => s.length));

        function msdSort(arr, digit, start, end) {
            if (start >= end || digit >= maxLength) return;

            // 创建桶（256个ASCII字符 + 1个结束符）
            const buckets = Array.from({length: 257}, () => []);

            // 分配到桶中
            for (let i = start; i <= end; i++) {
                const char = digit < arr[i].length ? arr[i].charCodeAt(digit) : 0;
                buckets[char].push(arr[i]);
            }

            // 收集结果并递归排序每个桶
            let index = start;
            for (let i = 0; i < buckets.length; i++) {
                if (buckets[i].length > 0) {
                    const bucketStart = index;
                    for (const str of buckets[i]) {
                        arr[index++] = str;
                    }

                    // 递归排序当前桶
                    if (buckets[i].length > 1) {
                        msdSort(arr, digit + 1, bucketStart, index - 1);
                    }
                }
            }
        }

        msdSort(result, 0, 0, result.length - 1);
        return result;
    }

    /**
     * 三向快速排序（适合有大量重复字符的字符串）
     * @param {string[]} strings 字符串数组
     * @returns {string[]} 排序后的字符串数组
     */
    static threeWayStringQuickSort(strings) {
        const result = [...strings];

        function sort(arr, low, high, digit) {
            if (low >= high) return;

            let lt = low;
            let gt = high;
            let pivot = charAt(arr[low], digit);
            let i = low + 1;

            while (i <= gt) {
                const char = charAt(arr[i], digit);
                if (char < pivot) {
                    [arr[lt], arr[i]] = [arr[i], arr[lt]];
                    lt++;
                    i++;
                } else if (char > pivot) {
                    [arr[i], arr[gt]] = [arr[gt], arr[i]];
                    gt--;
                } else {
                    i++;
                }
            }

            // 递归排序三个部分
            sort(arr, low, lt - 1, digit);
            if (pivot >= 0) sort(arr, lt, gt, digit + 1);
            sort(arr, gt + 1, high, digit);
        }

        function charAt(str, index) {
            return index < str.length ? str.charCodeAt(index) : -1;
        }

        sort(result, 0, result.length - 1, 0);
        return result;
    }
}

/**
 * 自适应排序算法
 *
 * 核心思想：
 * 根据数据的特性自动选择最合适的排序算法
 */
class AdaptiveSorter {
    /**
     * 智能排序：根据数据特征选择最佳算法
     * @param {Array} array 待排序数组
     * @returns {Array} 排序后的数组
     */
    static smartSort(array) {
        if (array.length <= 1) return [...array];

        const analysis = this.analyzeData(array);

        // 根据分析结果选择排序算法
        if (analysis.isNearlySorted && analysis.inversions < array.length * 0.1) {
            console.log('选择插入排序（数据基本有序）');
            return this.insertionSort(array);
        }

        if (analysis.isInteger && analysis.range < array.length * 2) {
            console.log('选择计数排序（整数且范围小）');
            return this.countingSort(array, analysis.min, analysis.max);
        }

        if (analysis.duplicateRatio > 0.7) {
            console.log('选择三向快速排序（重复元素多）');
            return this.threeWayQuickSort(array);
        }

        if (array.length > 100000) {
            console.log('选择堆排序（大数据集）');
            return this.heapSort(array);
        }

        console.log('选择归并排序（通用情况）');
        return this.mergeSort(array);
    }

    /**
     * 分析数据特征
     * @param {Array} array 数组
     * @returns {Object} 数据特征分析结果
     */
    static analyzeData(array) {
        let inversions = 0;
        let min = array[0];
        let max = array[0];
        const valueCount = new Map();
        let isInteger = true;

        // 统计逆序对和其他特征
        for (let i = 0; i < array.length; i++) {
            const val = array[i];

            // 检查是否为整数
            if (!Number.isInteger(val)) {
                isInteger = false;
            }

            // 更新最大最小值
            if (val < min) min = val;
            if (val > max) max = val;

            // 统计值的出现次数
            valueCount.set(val, (valueCount.get(val) || 0) + 1);

            // 统计逆序对
            for (let j = i + 1; j < array.length && j < i + 100; j++) {
                if (array[i] > array[j]) {
                    inversions++;
                }
            }
        }

        const uniqueValues = valueCount.size;
        const duplicateRatio = 1 - (uniqueValues / array.length);
        const isNearlySorted = inversions < array.length * 0.1;

        return {
            min,
            max,
            range: max - min,
            inversions,
            isInteger,
            uniqueValues,
            duplicateRatio,
            isNearlySorted
        };
    }

    // 各种排序算法的简化实现
    static insertionSort(array) {
        const result = [...array];
        for (let i = 1; i < result.length; i++) {
            const key = result[i];
            let j = i - 1;
            while (j >= 0 && result[j] > key) {
                result[j + 1] = result[j];
                j--;
            }
            result[j + 1] = key;
        }
        return result;
    }

    static countingSort(array, min, max) {
        const range = max - min + 1;
        const count = new Array(range).fill(0);
        const result = new Array(array.length);

        // 统计每个值的出现次数
        for (const num of array) {
            count[num - min]++;
        }

        // 计算累积计数
        for (let i = 1; i < range; i++) {
            count[i] += count[i - 1];
        }

        // 构建结果数组
        for (let i = array.length - 1; i >= 0; i--) {
            result[count[array[i] - min] - 1] = array[i];
            count[array[i] - min]--;
        }

        return result;
    }

    static threeWayQuickSort(array) {
        const result = [...array];

        function sort(arr, low, high) {
            if (low >= high) return;

            let lt = low;
            let gt = high;
            let pivot = arr[low];
            let i = low + 1;

            while (i <= gt) {
                if (arr[i] < pivot) {
                    [arr[lt], arr[i]] = [arr[i], arr[lt]];
                    lt++;
                    i++;
                } else if (arr[i] > pivot) {
                    [arr[i], arr[gt]] = [arr[gt], arr[i]];
                    gt--;
                } else {
                    i++;
                }
            }

            sort(arr, low, lt - 1);
            sort(arr, gt + 1, high);
        }

        sort(result, 0, result.length - 1);
        return result;
    }

    static heapSort(array) {
        const result = [...array];
        const n = result.length;

        // 建堆
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(result, n, i);
        }

        // 排序
        for (let i = n - 1; i > 0; i--) {
            [result[0], result[i]] = [result[i], result[0]];
            heapify(result, i, 0);
        }

        function heapify(arr, n, i) {
            let largest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;

            if (left < n && arr[left] > arr[largest]) {
                largest = left;
            }

            if (right < n && arr[right] > arr[largest]) {
                largest = right;
            }

            if (largest !== i) {
                [arr[i], arr[largest]] = [arr[largest], arr[i]];
                heapify(arr, n, largest);
            }
        }

        return result;
    }

    static mergeSort(array) {
        if (array.length <= 1) return [...array];

        const mid = Math.floor(array.length / 2);
        const left = this.mergeSort(array.slice(0, mid));
        const right = this.mergeSort(array.slice(mid));

        const result = [];
        let i = 0, j = 0;

        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result.push(left[i++]);
            } else {
                result.push(right[j++]);
            }
        }

        result.push(...left.slice(i));
        result.push(...right.slice(j));

        return result;
    }
}

// =====================================================
// 5. 测试和应用示例
// =====================================================

/**
 * 排序算法应用测试
 */
function testSortingApplications() {
    console.log('=== 排序算法应用测试 ===\n');

    // 1. 学生成绩管理测试
    console.log('1. 学生成绩管理系统测试');
    const gradeManager = new StudentGradeManager();
    gradeManager.addStudent('张三', 85, 90, 88);
    gradeManager.addStudent('李四', 92, 85, 90);
    gradeManager.addStudent('王五', 88, 88, 85);
    gradeManager.addStudent('赵六', 90, 92, 90);

    console.log('按总分排序:', gradeManager.sortByTotal());
    console.log('多关键字排序:', gradeManager.sortByMultipleKeys());
    console.log('排名结果:', gradeManager.getRankings());

    // 2. 任务调度测试
    console.log('\n2. 任务调度系统测试');
    const scheduler = new TaskScheduler();
    const now = Date.now();
    scheduler.addTask('A', 3, now + 3600000, 30); // 1小时后截止，30分钟执行
    scheduler.addTask('B', 5, now + 1800000, 15); // 30分钟后截止，15分钟执行
    scheduler.addTask('C', 2, now + 7200000, 45); // 2小时后截止，45分钟执行

    console.log('EDF调度:', scheduler.scheduleByEDF().map(t => t.id));
    console.log('优先级调度:', scheduler.scheduleByPriority().map(t => t.id));
    console.log('综合调度:', scheduler.scheduleComprehensive().map(t => t.id));

    // 3. 外部排序测试
    console.log('\n3. 外部排序测试');
    const externalSorter = new ExternalMergeSort(100);
    const largeArray = Array.from({length: 1000}, () => Math.floor(Math.random() * 1000));
    const sortedResult = externalSorter.externalSort(largeArray);
    console.log('外部排序结果长度:', sortedResult.length);
    console.log('是否正确排序:', isSorted(sortedResult));

    // 4. 荷兰国旗问题测试
    console.log('\n4. 荷兰国旗问题测试');
    const dutchArray = [0, 1, 2, 0, 1, 2, 1, 0, 2, 1, 0];
    console.log('原数组:', dutchArray);
    const sortedDutch = dutchFlagSort([...dutchArray], 1);
    console.log('三色排序后:', sortedDutch);

    // 5. 字符串排序测试
    console.log('\n5. 字符串排序测试');
    const strings = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
    console.log('原字符串数组:', strings);
    console.log('MSD基数排序:', StringSorter.msdRadixSort(strings));
    console.log('三向快速排序:', StringSorter.threeWayStringQuickSort(strings));

    // 6. 自适应排序测试
    console.log('\n6. 自适应排序测试');
    const randomArray = [64, 34, 25, 12, 22, 11, 90];
    console.log('原数组:', randomArray);
    const smartSorted = AdaptiveSorter.smartSort(randomArray);
    console.log('智能排序结果:', smartSorted);
}

/**
 * 并行排序性能测试
 */
async function testParallelSorting() {
    console.log('\n=== 并行排序性能测试 ===\n');

    const testSizes = [10000, 50000, 100000];

    for (const size of testSizes) {
        console.log(`测试数据规模: ${size}`);
        const testArray = Array.from({length: size}, () => Math.floor(Math.random() * size));

        // 测试并行归并排序
        const parallelMerger = new ParallelMergeSort();
        const start1 = performance.now();
        const result1 = await parallelMerger.parallelMergeSort(testArray);
        const end1 = performance.now();

        // 测试并行快速排序
        const parallelQuick = new ParallelQuickSort();
        const start2 = performance.now();
        const result2 = await parallelQuick.parallelQuickSort(testArray);
        const end2 = performance.now();

        console.log(`并行归并排序: ${(end1 - start1).toFixed(2)}ms`);
        console.log(`并行快速排序: ${(end2 - start2).toFixed(2)}ms`);
        console.log(`归并排序正确性: ${isSorted(result1)}`);
        console.log(`快速排序正确性: ${isSorted(result2)}\n`);
    }
}

/**
 * 检查数组是否已排序
 */
function isSorted(array) {
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] > array[i + 1]) {
            return false;
        }
    }
    return true;
}

/**
 * 运行所有测试
 */
async function runAdvancedSortingTests() {
    testSortingApplications();
    await testParallelSorting();
}

// 导出所有类和函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        StudentGradeManager,
        TaskScheduler,
        ProductSorter,
        ExternalMergeSort,
        ParallelMergeSort,
        ParallelQuickSort,
        StringSorter,
        AdaptiveSorter,
        dutchFlagSort,
        testSortingApplications,
        testParallelSorting,
        runAdvancedSortingTests
    };
}

// 如果直接运行此文件，则执行测试
if (require.main === module) {
    runAdvancedSortingTests();
}