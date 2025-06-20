/**
 * LeetCode 021: 合并两个有序数组 (Merge Sorted Array)
 *
 * 题目描述：
 * 给你两个按非递减顺序排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n，
 * 分别表示 nums1 和 nums2 中元素的数量。
 * 请你合并 nums2 到 nums1 中，使合并后的数组同样按非递减顺序排列。
 *
 * 注意：最终，合并后数组不应由函数返回，而是存储在数组 nums1 中。
 * 为了应对这种情况，nums1 的初始长度为 m + n，其中前 m 个元素表示应合并的元素，
 * 后 n 个元素为 0，应忽略。nums2 的长度为 n。
 *
 * 核心思想：
 * 双指针技术 - 从后往前合并，避免覆盖未处理的元素
 *
 * 算法原理：
 * 1. 双指针从后往前：利用nums1末尾的空间，从大到小放置元素
 * 2. 辅助数组方法：先复制到辅助数组，再双指针合并
 * 3. 插入排序思想：将nums2的元素逐个插入到nums1的正确位置
 */

/**
 * 解法一：双指针从后往前合并（推荐）
 *
 * 核心思想：
 * 从两个数组的末尾开始比较，将较大的元素放入nums1的末尾
 * 利用nums1末尾的空余空间，避免覆盖未处理的元素
 *
 * @param {number[]} nums1 - 第一个有序数组（包含额外空间）
 * @param {number} m - nums1中有效元素的个数
 * @param {number[]} nums2 - 第二个有序数组
 * @param {number} n - nums2中元素的个数
 * @time O(m + n) 只需遍历一次所有元素
 * @space O(1) 原地合并，不需要额外空间
 */
function merge(nums1, m, nums2, n) {
    // 三个指针：nums1有效元素末尾、nums2末尾、nums1总长度末尾
    let i = m - 1;     // nums1有效元素的最后一个索引
    let j = n - 1;     // nums2的最后一个索引
    let k = m + n - 1; // nums1总数组的最后一个索引

    // 从后往前合并
    while (i >= 0 && j >= 0) {
        if (nums1[i] > nums2[j]) {
            // nums1[i]更大，放入nums1[k]位置
            nums1[k] = nums1[i];
            i--;
        } else {
            // nums2[j]更大或相等，放入nums1[k]位置
            nums1[k] = nums2[j];
            j--;
        }
        k--;
    }

    // 如果nums2还有剩余元素，继续复制
    // nums1的剩余元素已经在正确位置，不需要移动
    while (j >= 0) {
        nums1[k] = nums2[j];
        j--;
        k--;
    }
}

/**
 * 解法二：辅助数组方法
 *
 * 核心思想：
 * 先将nums1的有效元素复制到辅助数组
 * 然后用双指针方法合并辅助数组和nums2到nums1
 *
 * @param {number[]} nums1 - 第一个有序数组
 * @param {number} m - nums1中有效元素的个数
 * @param {number[]} nums2 - 第二个有序数组
 * @param {number} n - nums2中元素的个数
 * @time O(m + n)
 * @space O(m) 需要额外的辅助数组
 */
function mergeWithAuxArray(nums1, m, nums2, n) {
    // 复制nums1的有效元素到辅助数组
    const aux = nums1.slice(0, m);

    let i = 0; // aux数组的指针
    let j = 0; // nums2的指针
    let k = 0; // nums1的指针

    // 双指针合并
    while (i < m && j < n) {
        if (aux[i] <= nums2[j]) {
            nums1[k] = aux[i];
            i++;
        } else {
            nums1[k] = nums2[j];
            j++;
        }
        k++;
    }

    // 复制剩余元素
    while (i < m) {
        nums1[k] = aux[i];
        i++;
        k++;
    }

    while (j < n) {
        nums1[k] = nums2[j];
        j++;
        k++;
    }
}

/**
 * 解法三：插入排序思想
 *
 * 核心思想：
 * 将nums2的每个元素逐个插入到nums1的正确位置
 * 类似插入排序的过程
 *
 * @param {number[]} nums1 - 第一个有序数组
 * @param {number} m - nums1中有效元素的个数
 * @param {number[]} nums2 - 第二个有序数组
 * @param {number} n - nums2中元素的个数
 * @time O(m * n) 每次插入可能需要移动多个元素
 * @space O(1) 原地操作
 */
function mergeByInsertion(nums1, m, nums2, n) {
    // 对nums2中的每个元素进行插入
    for (let i = 0; i < n; i++) {
        const element = nums2[i];

        // 在nums1中找到插入位置
        let insertPos = m + i; // 默认插入到末尾
        for (let j = 0; j < m + i; j++) {
            if (nums1[j] > element) {
                insertPos = j;
                break;
            }
        }

        // 将insertPos之后的元素向右移动
        for (let j = m + i; j > insertPos; j--) {
            nums1[j] = nums1[j - 1];
        }

        // 插入元素
        nums1[insertPos] = element;
    }
}

/**
 * 解法四：排序法（不推荐，但展示思路）
 *
 * 核心思想：
 * 直接将nums2复制到nums1的后半部分，然后整体排序
 * 虽然简单但失去了利用已排序特性的优势
 *
 * @param {number[]} nums1 - 第一个有序数组
 * @param {number} m - nums1中有效元素的个数
 * @param {number[]} nums2 - 第二个有序数组
 * @param {number} n - nums2中元素的个数
 * @time O((m+n)log(m+n)) 排序的时间复杂度
 * @space O(1) 原地排序
 */
function mergeBySorting(nums1, m, nums2, n) {
    // 将nums2复制到nums1的后半部分
    for (let i = 0; i < n; i++) {
        nums1[m + i] = nums2[i];
    }

    // 对整个nums1进行排序
    nums1.sort((a, b) => a - b);
}

/**
 * 解法五：双指针从前往后合并（需要额外处理）
 *
 * 核心思想：
 * 从前往后双指针合并，但需要先备份nums1的元素
 * 演示为什么从前往后比较复杂
 *
 * @param {number[]} nums1 - 第一个有序数组
 * @param {number} m - nums1中有效元素的个数
 * @param {number[]} nums2 - 第二个有序数组
 * @param {number} n - nums2中元素的个数
 * @time O(m + n)
 * @space O(m) 需要备份nums1
 */
function mergeForward(nums1, m, nums2, n) {
    // 备份nums1的有效元素
    const nums1Copy = nums1.slice(0, m);

    let i = 0; // nums1Copy的指针
    let j = 0; // nums2的指针
    let k = 0; // nums1的指针

    // 双指针合并
    while (i < m && j < n) {
        if (nums1Copy[i] <= nums2[j]) {
            nums1[k] = nums1Copy[i];
            i++;
        } else {
            nums1[k] = nums2[j];
            j++;
        }
        k++;
    }

    // 复制剩余元素
    while (i < m) {
        nums1[k] = nums1Copy[i];
        i++;
        k++;
    }

    while (j < n) {
        nums1[k] = nums2[j];
        j++;
        k++;
    }
}

/**
 * 解法六：递归分治法
 *
 * 核心思想：
 * 使用递归的方式进行合并，展示分治思想
 * 实际效率不如迭代方法，但有教学价值
 *
 * @param {number[]} nums1 - 第一个有序数组
 * @param {number} m - nums1中有效元素的个数
 * @param {number[]} nums2 - 第二个有序数组
 * @param {number} n - nums2中元素的个数
 * @time O(m + n)
 * @space O(m + n) 递归栈空间
 */
function mergeRecursive(nums1, m, nums2, n) {
    // 辅助递归函数
    function mergeHelper(arr1, start1, end1, arr2, start2, end2, result, pos) {
        // 基础情况
        if (start1 > end1 && start2 > end2) {
            return;
        }

        if (start1 > end1) {
            // arr1已处理完，复制arr2剩余元素
            for (let i = start2; i <= end2; i++) {
                result[pos++] = arr2[i];
            }
            return;
        }

        if (start2 > end2) {
            // arr2已处理完，复制arr1剩余元素
            for (let i = start1; i <= end1; i++) {
                result[pos++] = arr1[i];
            }
            return;
        }

        // 比较当前元素，选择较小的
        if (arr1[start1] <= arr2[start2]) {
            result[pos] = arr1[start1];
            mergeHelper(arr1, start1 + 1, end1, arr2, start2, end2, result, pos + 1);
        } else {
            result[pos] = arr2[start2];
            mergeHelper(arr1, start1, end1, arr2, start2 + 1, end2, result, pos + 1);
        }
    }

    // 备份nums1有效元素
    const backup = nums1.slice(0, m);
    mergeHelper(backup, 0, m - 1, nums2, 0, n - 1, nums1, 0);
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 021: 合并两个有序数组 测试 ===\n');

    const testCases = [
        {
            nums1: [1, 2, 3, 0, 0, 0],
            m: 3,
            nums2: [2, 5, 6],
            n: 3,
            expected: [1, 2, 2, 3, 5, 6],
            description: '标准情况：两个数组都有多个元素'
        },
        {
            nums1: [1],
            m: 1,
            nums2: [],
            n: 0,
            expected: [1],
            description: '边界情况：nums2为空'
        },
        {
            nums1: [0],
            m: 0,
            nums2: [1],
            n: 1,
            expected: [1],
            description: '边界情况：nums1为空（只有占位符）'
        },
        {
            nums1: [2, 0],
            m: 1,
            nums2: [1],
            n: 1,
            expected: [1, 2],
            description: '需要交换的情况'
        },
        {
            nums1: [1, 2, 4, 5, 6, 0],
            m: 5,
            nums2: [3],
            n: 1,
            expected: [1, 2, 3, 4, 5, 6],
            description: '插入中间位置'
        },
        {
            nums1: [4, 5, 6, 0, 0, 0],
            m: 3,
            nums2: [1, 2, 3],
            n: 3,
            expected: [1, 2, 3, 4, 5, 6],
            description: 'nums2所有元素都小于nums1'
        },
        {
            nums1: [1, 2, 3, 0, 0, 0],
            m: 3,
            nums2: [4, 5, 6],
            n: 3,
            expected: [1, 2, 3, 4, 5, 6],
            description: 'nums1所有元素都小于nums2'
        },
        {
            nums1: [1, 1, 1, 0, 0],
            m: 3,
            nums2: [1, 1],
            n: 2,
            expected: [1, 1, 1, 1, 1],
            description: '重复元素情况'
        }
    ];

    const methods = [
        { name: '双指针从后往前', func: merge },
        { name: '辅助数组方法', func: mergeWithAuxArray },
        { name: '插入排序思想', func: mergeByInsertion },
        { name: '排序法', func: mergeBySorting },
        { name: '双指针从前往后', func: mergeForward },
        { name: '递归分治法', func: mergeRecursive }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`nums1: [${test.nums1.join(', ')}], m: ${test.m}`);
        console.log(`nums2: [${test.nums2.join(', ')}], n: ${test.n}`);
        console.log(`期望结果: [${test.expected.join(', ')}]`);

        methods.forEach(method => {
            // 为每个方法创建独立的测试数据
            const nums1Copy = [...test.nums1];
            const nums2Copy = [...test.nums2];

            // 执行测试
            method.func(nums1Copy, test.m, nums2Copy, test.n);

            // 验证结果
            const isCorrect = nums1Copy.length === test.expected.length &&
                             nums1Copy.every((val, i) => val === test.expected[i]);

            console.log(`${method.name}: [${nums1Copy.join(', ')}] ${isCorrect ? '✅' : '❌'}`);
        });

        console.log('---');
    });
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能测试 ===');

    // 生成测试数据
    function generateTestData(size) {
        const m = Math.floor(size / 2);
        const n = size - m;

        const nums1 = new Array(size);
        const nums2 = new Array(n);

        // 生成有序数组
        for (let i = 0; i < m; i++) {
            nums1[i] = i * 2; // 偶数
        }
        for (let i = m; i < size; i++) {
            nums1[i] = 0; // 占位符
        }

        for (let i = 0; i < n; i++) {
            nums2[i] = i * 2 + 1; // 奇数
        }

        return { nums1, m, nums2, n };
    }

    const testSizes = [1000, 5000, 10000, 50000];

    testSizes.forEach(size => {
        console.log(`\n测试规模: ${size} 个元素`);

        const methods = [
            { name: '双指针从后往前', func: merge },
            { name: '辅助数组方法', func: mergeWithAuxArray },
            { name: '排序法', func: mergeBySorting },
            { name: '双指针从前往后', func: mergeForward }
        ];

        methods.forEach(method => {
            const { nums1, m, nums2, n } = generateTestData(size);

            console.time(method.name);
            method.func(nums1, m, nums2, n);
            console.timeEnd(method.name);
        });
    });
}

// 算法演示
function algorithmDemo() {
    console.log('\n=== 算法演示 ===');

    const nums1 = [1, 2, 3, 0, 0, 0];
    const nums2 = [2, 5, 6];
    const m = 3, n = 3;

    console.log('演示双指针从后往前合并过程:');
    console.log(`初始状态:`);
    console.log(`nums1: [${nums1.join(', ')}]`);
    console.log(`nums2: [${nums2.join(', ')}]`);
    console.log(`m=${m}, n=${n}`);
    console.log('');

    // 模拟合并过程
    const demo = [...nums1];
    let i = m - 1;
    let j = n - 1;
    let k = m + n - 1;
    let step = 1;

    while (i >= 0 && j >= 0) {
        console.log(`步骤${step}:`);
        console.log(`  比较 nums1[${i}]=${demo[i]} 和 nums2[${j}]=${nums2[j]}`);

        if (demo[i] > nums2[j]) {
            demo[k] = demo[i];
            console.log(`  nums1[${i}] > nums2[${j}], 将${demo[i]}放入位置${k}`);
            i--;
        } else {
            demo[k] = nums2[j];
            console.log(`  nums1[${i}] <= nums2[${j}], 将${nums2[j]}放入位置${k}`);
            j--;
        }
        k--;

        console.log(`  当前nums1: [${demo.join(', ')}]`);
        console.log(`  指针位置: i=${i}, j=${j}, k=${k}`);
        console.log('');
        step++;
    }

    // 处理剩余元素
    while (j >= 0) {
        console.log(`步骤${step}: 复制nums2剩余元素`);
        demo[k] = nums2[j];
        console.log(`  将nums2[${j}]=${nums2[j]}放入位置${k}`);
        j--;
        k--;
        console.log(`  当前nums1: [${demo.join(', ')}]`);
        step++;
    }

    console.log(`最终结果: [${demo.join(', ')}]`);
}

// 边界情况分析
function edgeCaseAnalysis() {
    console.log('\n=== 边界情况分析 ===');

    const edgeCases = [
        {
            case: 'nums2为空 (n = 0)',
            analysis: 'nums1已经是最终结果',
            handling: '不需要任何操作，直接返回'
        },
        {
            case: 'nums1为空 (m = 0)',
            analysis: '只需要将nums2复制到nums1',
            handling: '直接复制nums2到nums1'
        },
        {
            case: '两个数组长度为1',
            analysis: '最简单的比较情况',
            handling: '比较两个元素，按顺序放置'
        },
        {
            case: 'nums1所有元素都大于nums2',
            analysis: 'nums2的元素应该都在前面',
            handling: '从后往前的方法天然处理这种情况'
        },
        {
            case: 'nums1所有元素都小于nums2',
            analysis: 'nums1元素保持原位，nums2追加在后',
            handling: '先处理大的nums2元素，nums1元素自然留在原位'
        },
        {
            case: '大量重复元素',
            analysis: '需要保持稳定性',
            handling: '使用<=比较确保稳定性'
        },
        {
            case: '极端大小差异 (m >> n 或 n >> m)',
            analysis: '一个数组远大于另一个',
            handling: '算法复杂度仍然是O(m+n)，表现稳定'
        }
    ];

    console.log('边界情况处理策略:');
    edgeCases.forEach((testCase, index) => {
        console.log(`${index + 1}. ${testCase.case}`);
        console.log(`   分析: ${testCase.analysis}`);
        console.log(`   处理: ${testCase.handling}`);
        console.log('');
    });
}

// 算法设计原理
function algorithmDesignPrinciples() {
    console.log('\n=== 算法设计原理 ===');

    console.log('1. 为什么从后往前合并？');
    console.log('   - nums1的后半部分是空的，可以安全使用');
    console.log('   - 从大到小放置，不会覆盖未处理的元素');
    console.log('   - 避免了额外的空间开销');
    console.log('   - 一次遍历就能完成合并');
    console.log('');

    console.log('2. 双指针技术的核心');
    console.log('   - 利用数组已排序的特性');
    console.log('   - 每次比较都能确定一个元素的最终位置');
    console.log('   - 线性时间复杂度O(m+n)');
    console.log('   - 不需要额外的比较和排序');
    console.log('');

    console.log('3. 空间复杂度优化');
    console.log('   - 原地算法，空间复杂度O(1)');
    console.log('   - 利用nums1预留的空间');
    console.log('   - 避免创建新的数组');
    console.log('   - 内存使用效率最高');
    console.log('');

    console.log('4. 算法的稳定性');
    console.log('   - 相等元素的相对顺序保持不变');
    console.log('   - 使用<=比较而不是<确保稳定性');
    console.log('   - 对于重复元素友好');
    console.log('   - 符合归并排序的稳定性要求');
}

// 复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');

    console.log('1. 双指针从后往前合并（推荐）:');
    console.log('   时间复杂度: O(m + n)');
    console.log('   空间复杂度: O(1)');
    console.log('   优点: 最优的时间和空间复杂度，原地操作');
    console.log('   缺点: 理解稍复杂，需要注意指针边界');
    console.log('');

    console.log('2. 辅助数组方法:');
    console.log('   时间复杂度: O(m + n)');
    console.log('   空间复杂度: O(m)');
    console.log('   优点: 思路直观，容易理解');
    console.log('   缺点: 需要额外空间');
    console.log('');

    console.log('3. 插入排序思想:');
    console.log('   时间复杂度: O(m * n)');
    console.log('   空间复杂度: O(1)');
    console.log('   优点: 原地操作，思路简单');
    console.log('   缺点: 时间复杂度较高，有大量元素移动');
    console.log('');

    console.log('4. 排序法:');
    console.log('   时间复杂度: O((m+n)log(m+n))');
    console.log('   空间复杂度: O(1)');
    console.log('   优点: 实现简单');
    console.log('   缺点: 没有利用已排序特性，效率低');
    console.log('');

    console.log('5. 递归分治法:');
    console.log('   时间复杂度: O(m + n)');
    console.log('   空间复杂度: O(m + n)');
    console.log('   优点: 展示分治思想');
    console.log('   缺点: 递归开销，栈空间消耗');
}

// 扩展应用
function extendedApplications() {
    console.log('\n=== 扩展应用 ===');

    console.log('1. 归并排序核心操作:');
    console.log('   - 合并两个有序数组是归并排序的核心步骤');
    console.log('   - 分治算法的经典应用');
    console.log('   - 外部排序中的多路归并');
    console.log('   - 稳定排序算法的基础');
    console.log('');

    console.log('2. 数据库操作:');
    console.log('   - SQL中的ORDER BY合并');
    console.log('   - 索引合并操作');
    console.log('   - 分布式数据合并');
    console.log('   - 数据仓库ETL过程');
    console.log('');

    console.log('3. 系统设计应用:');
    console.log('   - 日志文件合并');
    console.log('   - 时间序列数据合并');
    console.log('   - 搜索结果合并');
    console.log('   - 分布式系统数据聚合');
    console.log('');

    console.log('4. 前端应用场景:');
    console.log('   - 虚拟列表数据合并');
    console.log('   - 搜索结果分页合并');
    console.log('   - 实时数据流合并');
    console.log('   - 数据可视化中的数据处理');
}

// 实际应用示例
function practicalExample() {
    console.log('\n=== 实际应用示例 ===');

    // 示例1：合并多个有序数组
    function mergeMultipleSortedArrays(arrays) {
        if (arrays.length === 0) return [];
        if (arrays.length === 1) return arrays[0];

        let result = arrays[0];

        for (let i = 1; i < arrays.length; i++) {
            const merged = new Array(result.length + arrays[i].length);

            // 将result复制到merged
            for (let j = 0; j < result.length; j++) {
                merged[j] = result[j];
            }

            // 使用我们的merge函数
            merge(merged, result.length, arrays[i], arrays[i].length);
            result = merged;
        }

        return result;
    }

    // 示例2：时间序列数据合并
    class TimeSeriesMerger {
        /**
         * 合并两个按时间排序的数据序列
         * @param {Array} series1 - 第一个时间序列 [{time, value}]
         * @param {Array} series2 - 第二个时间序列 [{time, value}]
         * @returns {Array} 合并后的时间序列
         */
        mergeSeries(series1, series2) {
            const result = [];
            let i = 0, j = 0;

            while (i < series1.length && j < series2.length) {
                if (series1[i].time <= series2[j].time) {
                    result.push(series1[i]);
                    i++;
                } else {
                    result.push(series2[j]);
                    j++;
                }
            }

            // 添加剩余元素
            while (i < series1.length) {
                result.push(series1[i++]);
            }
            while (j < series2.length) {
                result.push(series2[j++]);
            }

            return result;
        }
    }

    // 示例3：搜索结果合并器
    class SearchResultMerger {
        /**
         * 合并来自不同数据源的搜索结果
         * @param {Array} results1 - 第一个数据源的结果（按相关性排序）
         * @param {Array} results2 - 第二个数据源的结果（按相关性排序）
         * @returns {Array} 合并后的搜索结果
         */
        mergeSearchResults(results1, results2) {
            const merged = [];
            let i = 0, j = 0;

            while (i < results1.length && j < results2.length) {
                // 按相关性分数降序合并
                if (results1[i].score >= results2[j].score) {
                    merged.push(results1[i]);
                    i++;
                } else {
                    merged.push(results2[j]);
                    j++;
                }
            }

            // 添加剩余结果
            merged.push(...results1.slice(i));
            merged.push(...results2.slice(j));

            return merged;
        }
    }

    // 示例4：数组原地合并工具
    class ArrayMergeUtil {
        /**
         * 原地合并两个有序数组
         * @param {Array} arr1 - 目标数组（有足够空间）
         * @param {number} m - arr1有效元素个数
         * @param {Array} arr2 - 源数组
         * @param {number} n - arr2元素个数
         */
        mergeInPlace(arr1, m, arr2, n) {
            merge(arr1, m, arr2, n);
        }

        /**
         * 检查数组是否已排序
         * @param {Array} arr - 待检查数组
         * @returns {boolean} 是否已排序
         */
        isSorted(arr) {
            for (let i = 1; i < arr.length; i++) {
                if (arr[i] < arr[i - 1]) {
                    return false;
                }
            }
            return true;
        }

        /**
         * 性能基准测试
         * @param {Function} mergeFunc - 合并函数
         * @param {Array} testData - 测试数据
         * @returns {Object} 性能统计
         */
        benchmark(mergeFunc, testData) {
            const start = performance.now();
            testData.forEach(({ nums1, m, nums2, n }) => {
                const copy1 = [...nums1];
                const copy2 = [...nums2];
                mergeFunc(copy1, m, copy2, n);
            });
            const end = performance.now();

            return {
                totalTime: end - start,
                averageTime: (end - start) / testData.length,
                testsCount: testData.length
            };
        }
    }

    console.log('多数组合并示例:');
    const arrays = [[1, 4, 7], [2, 5, 8], [3, 6, 9]];
    console.log(`输入: [${arrays.map(arr => `[${arr.join(', ')}]`).join(', ')}]`);
    console.log(`输出: [${mergeMultipleSortedArrays(arrays).join(', ')}]`);
    console.log('');

    console.log('时间序列合并示例:');
    const merger = new TimeSeriesMerger();
    const series1 = [
        { time: 1, value: 10 },
        { time: 3, value: 30 },
        { time: 5, value: 50 }
    ];
    const series2 = [
        { time: 2, value: 20 },
        { time: 4, value: 40 },
        { time: 6, value: 60 }
    ];
    const mergedSeries = merger.mergeSeries(series1, series2);
    console.log('合并后的时间序列:');
    mergedSeries.forEach(item => {
        console.log(`  时间: ${item.time}, 值: ${item.value}`);
    });
    console.log('');

    console.log('搜索结果合并示例:');
    const searchMerger = new SearchResultMerger();
    const results1 = [
        { id: 1, title: '结果A', score: 0.9 },
        { id: 2, title: '结果B', score: 0.7 }
    ];
    const results2 = [
        { id: 3, title: '结果C', score: 0.8 },
        { id: 4, title: '结果D', score: 0.6 }
    ];
    const mergedResults = searchMerger.mergeSearchResults(results1, results2);
    console.log('合并后的搜索结果:');
    mergedResults.forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.title} (分数: ${result.score})`);
    });
}

// 面试要点总结
function interviewKeyPoints() {
    console.log('\n=== 面试要点总结 ===');

    console.log('1. 关键洞察:');
    console.log('   - 从后往前合并避免元素覆盖');
    console.log('   - 利用nums1的额外空间');
    console.log('   - 双指针技术的经典应用');
    console.log('   - 时间复杂度已经最优O(m+n)');
    console.log('');

    console.log('2. 常见错误:');
    console.log('   - 从前往后合并导致元素覆盖');
    console.log('   - 忘记处理其中一个数组的剩余元素');
    console.log('   - 边界条件处理不当（m=0或n=0）');
    console.log('   - 指针越界问题');
    console.log('');

    console.log('3. 优化思路:');
    console.log('   - 首选从后往前的双指针方法');
    console.log('   - 注意稳定性要求时使用<=比较');
    console.log('   - 边界情况的特殊处理');
    console.log('   - 考虑输入数组的特殊性质');
    console.log('');

    console.log('4. 扩展问题:');
    console.log('   - 如何合并k个有序数组？');
    console.log('   - 如何处理重复元素？');
    console.log('   - 如何在链表上实现？');
    console.log('   - 如何处理不同数据类型？');
}

// 运行测试
if (require.main === module) {
    runTests();
    performanceTest();
    algorithmDemo();
    edgeCaseAnalysis();
    algorithmDesignPrinciples();
    complexityAnalysis();
    extendedApplications();
    practicalExample();
    interviewKeyPoints();
}

module.exports = {
    merge,
    mergeWithAuxArray,
    mergeByInsertion,
    mergeBySorting,
    mergeForward,
    mergeRecursive
};