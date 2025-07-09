/**
 * LeetCode 215. 数组中的第K个最大元素
 *
 * 问题描述：
 * 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。
 * 请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。
 * 你必须设计并实现时间复杂度为 O(n) 的算法解决此问题。
 *
 * 核心思想：
 * 第K个最大元素问题是经典的选择问题，可以用多种方法解决：
 * 1. 排序后直接取值 - O(n log n)
 * 2. 最小堆维护K个最大元素 - O(n log k)
 * 3. 快速选择算法 - 平均O(n)，最坏O(n²)
 * 4. 堆排序部分排序 - O(k log n)
 *
 * 示例：
 * 输入：nums = [3,2,1,5,6,4], k = 2
 * 输出：5
 * 解释：排序后数组为 [6,5,4,3,2,1]，第2个最大元素是5
 */

/**
 * 方法一：快速选择算法（推荐）
 *
 * 核心思想：
 * 基于快速排序的分区思想，但只需要对包含第K个最大元素的部分进行递归
 * 通过分区操作，可以确定基准元素的最终位置，从而缩小搜索范围
 *
 * 算法步骤：
 * 1. 选择一个基准元素（通常选择随机位置避免最坏情况）
 * 2. 进行分区操作，将大于基准的元素放左边，小于基准的放右边
 * 3. 根据基准位置与目标位置的关系，决定在哪一侧继续搜索
 * 4. 重复直到找到第K个最大元素
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 第k个最大
 * @returns {number} 第K个最大元素
 * @time O(n) 平均时间复杂度，O(n²) 最坏情况
 * @space O(log n) 递归栈空间，最坏O(n)
 */
function findKthLargest(nums, k) {
    console.log("=== 数组中的第K个最大元素（快速选择算法） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log(`查找第 ${k} 个最大元素`);

    // 创建数组副本，避免修改原数组
    const arr = [...nums];
    const targetIndex = k - 1; // 转换为0基索引

    /**
     * 快速选择递归函数
     * @param {number} left - 左边界
     * @param {number} right - 右边界
     * @param {number} depth - 递归深度（用于日志输出）
     * @returns {number} 第K个最大元素
     */
    function quickSelect(left, right, depth = 1) {
        const indent = "  ".repeat(depth);
        console.log(`${indent}第 ${depth} 层递归: 在区间 [${left}, ${right}] 中查找第 ${k} 大元素`);
        console.log(`${indent}当前子数组: [${arr.slice(left, right + 1).join(', ')}]`);

        if (left === right) {
            console.log(`${indent}✅ 找到结果: arr[${left}] = ${arr[left]}`);
            return arr[left];
        }

        // 随机选择基准，避免最坏情况
        const randomIndex = left + Math.floor(Math.random() * (right - left + 1));
        console.log(`${indent}随机选择基准位置: ${randomIndex}, 基准值: ${arr[randomIndex]}`);

        // 将基准元素移到末尾
        [arr[randomIndex], arr[right]] = [arr[right], arr[randomIndex]];

        // 进行分区操作
        const pivotIndex = partition(left, right, depth);
        console.log(`${indent}分区完成，基准元素最终位置: ${pivotIndex}`);
        console.log(`${indent}分区后数组: [${arr.slice(left, right + 1).join(', ')}]`);

        if (pivotIndex === targetIndex) {
            console.log(`${indent}✅ 找到第 ${k} 个最大元素: ${arr[pivotIndex]}`);
            return arr[pivotIndex];
        } else if (pivotIndex < targetIndex) {
            console.log(`${indent}目标在右半部分，继续搜索 [${pivotIndex + 1}, ${right}]`);
            return quickSelect(pivotIndex + 1, right, depth + 1);
        } else {
            console.log(`${indent}目标在左半部分，继续搜索 [${left}, ${pivotIndex - 1}]`);
            return quickSelect(left, pivotIndex - 1, depth + 1);
        }
    }

    /**
     * 分区操作：将大于基准的元素放左边，小于基准的放右边
     * @param {number} left - 左边界
     * @param {number} right - 右边界
     * @param {number} depth - 递归深度
     * @returns {number} 基准元素的最终位置
     */
    function partition(left, right, depth) {
        const indent = "  ".repeat(depth);
        const pivot = arr[right]; // 基准元素
        let i = left; // 小于基准元素的边界

        console.log(`${indent}  分区操作: 基准值 = ${pivot}`);

        for (let j = left; j < right; j++) {
            // 注意：这里我们要找最大元素，所以大于基准的放左边
            if (arr[j] > pivot) {
                console.log(`${indent}    ${arr[j]} > ${pivot}, 交换 arr[${i}] 和 arr[${j}]`);
                [arr[i], arr[j]] = [arr[j], arr[i]];
                i++;
            }
        }

        // 将基准元素放到正确位置
        [arr[i], arr[right]] = [arr[right], arr[i]];
        console.log(`${indent}  基准元素 ${pivot} 放到位置 ${i}`);

        return i;
    }

    const result = quickSelect(0, arr.length - 1);
    console.log(`\n最终结果: 第 ${k} 个最大元素是 ${result}`);
    return result;
}

/**
 * 方法二：最小堆方法
 *
 * 核心思想：
 * 维护一个大小为K的最小堆，堆顶元素就是第K个最大元素
 * 遍历数组，如果当前元素大于堆顶，则替换堆顶并重新调整堆
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 第k个最大
 * @returns {number} 第K个最大元素
 * @time O(n log k) 每个元素最多进行一次堆操作
 * @space O(k) 堆的空间
 */
function findKthLargestMinHeap(nums, k) {
    console.log("\n=== 数组中的第K个最大元素（最小堆方法） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log(`查找第 ${k} 个最大元素`);

    // 最小堆实现
    class MinHeap {
        constructor() {
            this.heap = [];
        }

        // 获取父节点索引
        parent(i) { return Math.floor((i - 1) / 2); }

        // 获取左子节点索引
        leftChild(i) { return 2 * i + 1; }

        // 获取右子节点索引
        rightChild(i) { return 2 * i + 2; }

        // 交换两个元素
        swap(i, j) {
            [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
        }

        // 向上调整（插入后）
        heapifyUp(index) {
            while (index > 0 && this.heap[this.parent(index)] > this.heap[index]) {
                this.swap(index, this.parent(index));
                index = this.parent(index);
            }
        }

        // 向下调整（删除后）
        heapifyDown(index) {
            let minIndex = index;
            const left = this.leftChild(index);
            const right = this.rightChild(index);

            if (left < this.heap.length && this.heap[left] < this.heap[minIndex]) {
                minIndex = left;
            }

            if (right < this.heap.length && this.heap[right] < this.heap[minIndex]) {
                minIndex = right;
            }

            if (minIndex !== index) {
                this.swap(index, minIndex);
                this.heapifyDown(minIndex);
            }
        }

        // 插入元素
        insert(val) {
            this.heap.push(val);
            this.heapifyUp(this.heap.length - 1);
        }

        // 删除并返回最小元素
        extractMin() {
            if (this.heap.length === 0) return null;
            if (this.heap.length === 1) return this.heap.pop();

            const min = this.heap[0];
            this.heap[0] = this.heap.pop();
            this.heapifyDown(0);
            return min;
        }

        // 获取最小元素（不删除）
        peek() {
            return this.heap.length > 0 ? this.heap[0] : null;
        }

        // 获取堆大小
        size() {
            return this.heap.length;
        }

        // 获取堆数组（用于输出）
        toArray() {
            return [...this.heap];
        }
    }

    const minHeap = new MinHeap();

    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        console.log(`\n处理元素 ${num} (索引 ${i}):`);

        if (minHeap.size() < k) {
            // 堆还没满，直接插入
            minHeap.insert(num);
            console.log(`  堆未满，插入 ${num}`);
            console.log(`  当前堆: [${minHeap.toArray().join(', ')}]`);
        } else if (num > minHeap.peek()) {
            // 当前元素大于堆顶，替换堆顶
            const oldMin = minHeap.extractMin();
            minHeap.insert(num);
            console.log(`  ${num} > ${oldMin}，替换堆顶`);
            console.log(`  当前堆: [${minHeap.toArray().join(', ')}]`);
        } else {
            console.log(`  ${num} <= ${minHeap.peek()}，不需要替换`);
            console.log(`  当前堆: [${minHeap.toArray().join(', ')}]`);
        }
    }

    const result = minHeap.peek();
    console.log(`\n最终结果: 第 ${k} 个最大元素是 ${result}`);
    console.log(`最终堆: [${minHeap.toArray().join(', ')}]`);
    return result;
}

/**
 * 方法三：排序方法
 *
 * 核心思想：
 * 最直观的方法，先对数组进行降序排序，然后直接取第k个元素
 * 虽然时间复杂度较高，但实现简单，适合小数据量
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 第k个最大
 * @returns {number} 第K个最大元素
 * @time O(n log n) 排序的时间复杂度
 * @space O(log n) 排序的空间复杂度（取决于排序算法）
 */
function findKthLargestSort(nums, k) {
    console.log("\n=== 数组中的第K个最大元素（排序方法） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log(`查找第 ${k} 个最大元素`);

    // 创建数组副本并排序
    const sortedNums = [...nums].sort((a, b) => b - a); // 降序排序
    console.log(`排序后数组: [${sortedNums.join(', ')}]`);

    const result = sortedNums[k - 1];
    console.log(`第 ${k} 个最大元素: sortedNums[${k - 1}] = ${result}`);

    return result;
}

/**
 * 方法四：计数排序（适用于数值范围有限的情况）
 *
 * 核心思想：
 * 当数组中元素的值范围有限时，可以使用计数排序的思想
 * 统计每个值的出现次数，然后从大到小累计，找到第K个位置
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 第k个最大
 * @returns {number} 第K个最大元素
 * @time O(n + range) range为数值范围
 * @space O(range) 计数数组的空间
 */
function findKthLargestCountingSort(nums, k) {
    console.log("\n=== 数组中的第K个最大元素（计数排序方法） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log(`查找第 ${k} 个最大元素`);

    // 找到数组的最大值和最小值
    const minVal = Math.min(...nums);
    const maxVal = Math.max(...nums);
    const range = maxVal - minVal + 1;

    console.log(`数值范围: [${minVal}, ${maxVal}], 范围大小: ${range}`);

    // 创建计数数组
    const count = new Array(range).fill(0);

    // 统计每个值的出现次数
    console.log("\n统计每个值的出现次数:");
    for (const num of nums) {
        count[num - minVal]++;
        console.log(`  值 ${num} 出现次数: ${count[num - minVal]}`);
    }

    // 从大到小遍历，累计计数，找到第K个元素
    console.log("\n从大到小累计计数:");
    let totalCount = 0;
    for (let val = maxVal; val >= minVal; val--) {
        const currentCount = count[val - minVal];
        if (currentCount > 0) {
            console.log(`  值 ${val} 出现 ${currentCount} 次`);
            totalCount += currentCount;
            console.log(`  累计个数: ${totalCount}`);

            if (totalCount >= k) {
                console.log(`  ✅ 找到第 ${k} 个最大元素: ${val}`);
                return val;
            }
        }
    }

    // 理论上不会到达这里
    return -1;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 验证结果的正确性
 * @param {number[]} nums - 原始数组
 * @param {number} k - 第k个最大
 * @param {number} result - 算法结果
 * @returns {boolean} 是否正确
 */
function validateResult(nums, k, result) {
    console.log("\n=== 结果验证 ===");
    console.log(`原始数组: [${nums.join(', ')}]`);
    console.log(`查找第 ${k} 个最大元素`);
    console.log(`算法结果: ${result}`);

    // 方法1：通过排序验证
    const sorted = [...nums].sort((a, b) => b - a);
    const expected = sorted[k - 1];
    const isCorrect = result === expected;

    console.log(`排序验证: [${sorted.join(', ')}]`);
    console.log(`期望结果: ${expected}`);
    console.log(`结果正确: ${isCorrect ? '✅' : '❌'}`);

    // 方法2：统计比result大的元素个数
    const largerCount = nums.filter(num => num > result).length;
    const equalCount = nums.filter(num => num === result).length;

    console.log(`比 ${result} 大的元素个数: ${largerCount}`);
    console.log(`等于 ${result} 的元素个数: ${equalCount}`);

    // 第k个最大元素的条件：
    // 1. 比它大的元素个数 < k
    // 2. 比它大的元素个数 + 等于它的元素个数 >= k
    const condition1 = largerCount < k;
    const condition2 = largerCount + equalCount >= k;
    const isValidPosition = condition1 && condition2;

    console.log(`位置验证: 比它大的 < ${k} (${condition1}) 且 总数 >= ${k} (${condition2})`);
    console.log(`位置正确: ${isValidPosition ? '✅' : '❌'}`);

    return isCorrect && isValidPosition;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    // 生成测试用例
    const generateTestCase = (size, min = 1, max = 1000) => {
        return Array.from({length: size}, () =>
            min + Math.floor(Math.random() * (max - min + 1))
        );
    };

    const testCases = [
        { array: generateTestCase(100), k: 10 },
        { array: generateTestCase(1000), k: 100 },
        { array: generateTestCase(10000), k: 1000 }
    ];

    const methods = [
        { name: '快速选择', func: findKthLargest },
        { name: '最小堆', func: findKthLargestMinHeap },
        { name: '排序方法', func: findKthLargestSort },
        { name: '计数排序', func: findKthLargestCountingSort }
    ];

    for (const testCase of testCases) {
        console.log(`\n测试数组大小: ${testCase.array.length}, k = ${testCase.k}`);

        let expectedResult = null;

        for (const method of methods) {
            const startTime = performance.now();
            const result = method.func([...testCase.array], testCase.k);
            const endTime = performance.now();

            if (expectedResult === null) {
                expectedResult = result;
            }

            const isCorrect = result === expectedResult;
            console.log(`${method.name}: 结果=${result} ${isCorrect ? '✅' : '❌'}, 耗时=${(endTime - startTime).toFixed(3)}ms`);
        }
    }
}

// ===========================================
// 测试用例
// ===========================================

/**
 * 测试函数
 */
function runTests() {
    console.log("=".repeat(50));
    console.log("数组中第K个最大元素算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { nums: [3,2,1,5,6,4], k: 2, expected: 5 },
        { nums: [3,2,3,1,2,4,5,5,6], k: 4, expected: 4 },
        { nums: [1], k: 1, expected: 1 },
        { nums: [1,2], k: 1, expected: 2 },
        { nums: [1,2], k: 2, expected: 1 },
        { nums: [7,10,4,3,20,15], k: 3, expected: 10 },
        { nums: [2,1,3,5,6,4], k: 2, expected: 5 }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}`);
        console.log(`${"=".repeat(30)}`);

        const { nums, k, expected } = testCase;

        // 测试所有方法
        const methods = [
            { name: "快速选择", func: findKthLargest },
            { name: "最小堆", func: findKthLargestMinHeap },
            { name: "排序方法", func: findKthLargestSort },
            { name: "计数排序", func: findKthLargestCountingSort }
        ];

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func([...nums], k);
                results.push(result);

                const isCorrect = result === expected;
                console.log(`结果: ${result}, 期望: ${expected}, 正确: ${isCorrect ? '✅' : '❌'}`);

                // 验证结果
                validateResult(nums, k, result);
            } catch (error) {
                console.log(`❌ 方法执行失败: ${error.message}`);
                results.push(null);
            }
        }

        // 检查所有方法结果是否一致
        console.log("\n--- 方法一致性检查 ---");
        const validResults = results.filter(r => r !== null);
        const allSame = validResults.every(result => result === validResults[0]);
        console.log(`所有方法结果一致: ${allSame ? '✅' : '❌'}`);
    });

    // 性能测试
    performanceTest();
}

// ===========================================
// 算法演示
// ===========================================

/**
 * 算法演示函数
 */
function demonstrateAlgorithm() {
    console.log("\n" + "=".repeat(50));
    console.log("数组中第K个最大元素算法演示");
    console.log("=".repeat(50));

    console.log("第K个最大元素问题的四种主要解法:");
    console.log("1. 快速选择算法 - 平均O(n)，基于快排分区思想");
    console.log("2. 最小堆方法 - O(n log k)，维护K个最大元素");
    console.log("3. 排序方法 - O(n log n)，直接排序后取值");
    console.log("4. 计数排序 - O(n + range)，适用于数值范围有限");

    const demoArray = [3, 2, 1, 5, 6, 4];
    const k = 2;

    console.log(`\n演示数组: [${demoArray.join(', ')}]`);
    console.log(`查找第 ${k} 个最大元素`);

    console.log("\n方法选择建议:");
    console.log("- 数据量大且k较小: 使用最小堆方法");
    console.log("- 数据量大且需要多次查询: 先排序，再查询");
    console.log("- 一次性查询且追求最优平均性能: 快速选择算法");
    console.log("- 数值范围有限: 计数排序方法");

    console.log("\n详细演示 - 快速选择算法:");
    const result = findKthLargest(demoArray, k);

    console.log("\n时间复杂度对比:");
    console.log("快速选择: 平均O(n)，最坏O(n²)");
    console.log("最小堆: O(n log k)");
    console.log("排序方法: O(n log n)");
    console.log("计数排序: O(n + range)");
}

// ===========================================
// 面试要点
// ===========================================

/**
 * 面试关键点总结
 */
function interviewKeyPoints() {
    console.log("\n" + "=".repeat(50));
    console.log("面试关键点");
    console.log("=".repeat(50));

    console.log("\n🎯 核心概念:");
    console.log("1. 第K个最大元素是经典的选择问题");
    console.log("2. 不需要完全排序，只需要部分排序或选择");
    console.log("3. 快速选择是快速排序的变体应用");
    console.log("4. 堆数据结构在TopK问题中的重要应用");

    console.log("\n🔧 实现技巧:");
    console.log("1. 快速选择：随机化基准避免最坏情况");
    console.log("2. 最小堆：维护K个最大元素，堆顶是第K大");
    console.log("3. 注意数组索引转换：第K大对应索引K-1");
    console.log("4. 分区操作：大于基准的放左边（降序思维）");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 索引转换错误（1-based vs 0-based）");
    console.log("2. 分区操作的边界处理");
    console.log("3. 堆的类型选择（最大堆vs最小堆）");
    console.log("4. 递归栈溢出（最坏情况下的快速选择）");
    console.log("5. 重复元素的处理");

    console.log("\n🎨 变体问题:");
    console.log("1. 第K个最小元素");
    console.log("2. 前K个最大/最小元素");
    console.log("3. 第K个不同的元素");
    console.log("4. 数据流中的第K大元素");
    console.log("5. 两个排序数组的第K小元素");

    console.log("\n📊 复杂度分析:");
    console.log("时间复杂度:");
    console.log("- 快速选择: 平均O(n)，最坏O(n²)");
    console.log("- 最小堆: O(n log k)");
    console.log("- 排序: O(n log n)");
    console.log("- 计数排序: O(n + range)");

    console.log("\n空间复杂度:");
    console.log("- 快速选择: O(log n) 递归栈");
    console.log("- 最小堆: O(k)");
    console.log("- 排序: O(log n) 或 O(n)");
    console.log("- 计数排序: O(range)");

    console.log("\n💡 面试技巧:");
    console.log("1. 先问清楚是否允许修改原数组");
    console.log("2. 询问数据的特点（范围、重复情况）");
    console.log("3. 分析不同方法的适用场景");
    console.log("4. 考虑是否需要多次查询");
    console.log("5. 提及随机化优化避免最坏情况");

    console.log("\n🔍 相关概念:");
    console.log("1. 快速排序和分治思想");
    console.log("2. 堆数据结构和优先队列");
    console.log("3. 选择算法和中位数查找");
    console.log("4. 随机化算法的重要性");

    console.log("\n🌟 实际应用:");
    console.log("1. 推荐系统中的TopK推荐");
    console.log("2. 搜索引擎的相关性排序");
    console.log("3. 数据分析中的分位数计算");
    console.log("4. 游戏排行榜系统");
    console.log("5. 监控系统的异常检测");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        findKthLargest,
        findKthLargestMinHeap,
        findKthLargestSort,
        findKthLargestCountingSort,
        validateResult,
        performanceTest,
        runTests,
        demonstrateAlgorithm,
        interviewKeyPoints
    };
}

// 如果在浏览器环境中，运行演示
if (typeof window !== 'undefined') {
    runTests();
    demonstrateAlgorithm();
    interviewKeyPoints();
}