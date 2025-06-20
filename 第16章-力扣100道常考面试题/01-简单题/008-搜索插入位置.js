/**
 * LeetCode 008: 搜索插入位置 (Search Insert Position)
 *
 * 题目描述：
 * 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。
 * 如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
 * 请必须使用时间复杂度为 O(log n) 的算法。
 *
 * 核心思想：
 * 二分查找的变种应用
 * 核心理念：在有序数组中查找插入位置，利用二分查找的有序性质
 *
 * 算法原理：
 * 1. 使用二分查找在有序数组中定位目标值
 * 2. 如果找到目标值，返回索引
 * 3. 如果未找到，left指针最终会指向应该插入的位置
 * 4. 关键在于处理边界条件和循环不变量
 */

/**
 * 解法一：标准二分查找（推荐）
 *
 * 核心思想：
 * 使用二分查找查找目标值或确定插入位置
 * 循环不变量：target应该插入在[left, right]区间内
 *
 * @param {number[]} nums - 有序数组
 * @param {number} target - 目标值
 * @returns {number} 目标值的索引或应插入的位置
 * @time O(log n) 二分查找
 * @space O(1) 只使用常数额外空间
 */
function searchInsert(nums, target) {
    let left = 0;
    let right = nums.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (nums[mid] === target) {
            return mid;  // 找到目标值，返回索引
        } else if (nums[mid] < target) {
            left = mid + 1;  // 目标值在右半部分
        } else {
            right = mid - 1; // 目标值在左半部分
        }
    }

    // 循环结束时，left就是应该插入的位置
    return left;
}

/**
 * 解法二：左边界二分查找
 *
 * 核心思想：
 * 查找第一个大于等于target的位置
 * 这种写法更直观地体现了"插入位置"的含义
 *
 * @param {number[]} nums - 有序数组
 * @param {number} target - 目标值
 * @returns {number} 目标值的索引或应插入的位置
 * @time O(log n) 二分查找
 * @space O(1) 只使用常数额外空间
 */
function searchInsertLeftBound(nums, target) {
    let left = 0;
    let right = nums.length; // 注意这里是nums.length，不是nums.length - 1

    while (left < right) {
        const mid = Math.floor((left + right) / 2);

        if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    return left;
}

/**
 * 解法三：递归实现
 *
 * 核心思想：
 * 使用递归的方式实现二分查找
 *
 * @param {number[]} nums - 有序数组
 * @param {number} target - 目标值
 * @param {number} left - 左边界
 * @param {number} right - 右边界
 * @returns {number} 目标值的索引或应插入的位置
 * @time O(log n) 二分查找
 * @space O(log n) 递归栈空间
 */
function searchInsertRecursive(nums, target, left = 0, right = nums.length - 1) {
    if (left > right) {
        return left; // 递归终止条件：left指向插入位置
    }

    const mid = Math.floor((left + right) / 2);

    if (nums[mid] === target) {
        return mid;
    } else if (nums[mid] < target) {
        return searchInsertRecursive(nums, target, mid + 1, right);
    } else {
        return searchInsertRecursive(nums, target, left, mid - 1);
    }
}

/**
 * 解法四：暴力查找（O(n)）
 *
 * 核心思想：
 * 线性扫描数组，找到第一个大于等于target的位置
 *
 * @param {number[]} nums - 有序数组
 * @param {number} target - 目标值
 * @returns {number} 目标值的索引或应插入的位置
 * @time O(n) 线性扫描
 * @space O(1) 只使用常数额外空间
 */
function searchInsertLinear(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] >= target) {
            return i;
        }
    }
    // 如果所有元素都小于target，插入到末尾
    return nums.length;
}

/**
 * 解法五：使用内置方法（参考实现）
 *
 * 核心思想：
 * 利用JavaScript的内置方法实现
 *
 * @param {number[]} nums - 有序数组
 * @param {number} target - 目标值
 * @returns {number} 目标值的索引或应插入的位置
 * @time O(n) 内置方法的时间复杂度
 * @space O(1) 只使用常数额外空间
 */
function searchInsertBuiltIn(nums, target) {
    // 找到第一个大于等于target的元素索引
    const index = nums.findIndex(num => num >= target);

    // 如果没找到，说明target比所有元素都大，插入到末尾
    return index === -1 ? nums.length : index;
}

/**
 * 通用的左边界二分查找模板
 *
 * 核心思想：
 * 查找第一个满足条件的元素位置
 * 条件：元素值 >= target
 *
 * @param {number[]} arr - 有序数组
 * @param {Function} condition - 判断条件函数
 * @returns {number} 第一个满足条件的位置
 */
function binarySearchLeftBound(arr, condition) {
    let left = 0;
    let right = arr.length;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);

        if (condition(arr[mid])) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }

    return left;
}

/**
 * 使用通用模板解决问题
 *
 * @param {number[]} nums - 有序数组
 * @param {number} target - 目标值
 * @returns {number} 目标值的索引或应插入的位置
 */
function searchInsertTemplate(nums, target) {
    return binarySearchLeftBound(nums, num => num >= target);
}

/**
 * 扩展：查找插入区间
 *
 * 核心思想：
 * 返回target应该插入的区间范围
 *
 * @param {number[]} nums - 有序数组
 * @param {number} target - 目标值
 * @returns {Object} 包含插入位置信息的对象
 */
function searchInsertRange(nums, target) {
    const insertPos = searchInsert(nums, target);

    // 查找目标值的范围（如果存在）
    let leftBound = insertPos;
    let rightBound = insertPos;

    // 向左扩展，找到所有等于target的元素
    while (leftBound > 0 && nums[leftBound - 1] === target) {
        leftBound--;
    }

    // 向右扩展，找到所有等于target的元素
    while (rightBound < nums.length && nums[rightBound] === target) {
        rightBound++;
    }

    const exists = nums[insertPos] === target;

    return {
        insertPosition: insertPos,
        exists: exists,
        leftBound: exists ? leftBound : insertPos,
        rightBound: exists ? rightBound - 1 : insertPos,
        range: exists ? rightBound - leftBound : 0
    };
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 008: 搜索插入位置 测试 ===\n');

    const testCases = [
        {
            nums: [1, 3, 5, 6],
            target: 5,
            expected: 2,
            description: '目标值存在：在数组中找到5，返回索引2'
        },
        {
            nums: [1, 3, 5, 6],
            target: 2,
            expected: 1,
            description: '目标值不存在：2应该插入索引1的位置'
        },
        {
            nums: [1, 3, 5, 6],
            target: 7,
            expected: 4,
            description: '目标值大于所有元素：7应该插入末尾位置4'
        },
        {
            nums: [1, 3, 5, 6],
            target: 0,
            expected: 0,
            description: '目标值小于所有元素：0应该插入开头位置0'
        },
        {
            nums: [1],
            target: 0,
            expected: 0,
            description: '单元素数组：0应该插入位置0'
        },
        {
            nums: [1],
            target: 1,
            expected: 0,
            description: '单元素数组：找到目标值1，返回索引0'
        },
        {
            nums: [1],
            target: 2,
            expected: 1,
            description: '单元素数组：2应该插入位置1'
        },
        {
            nums: [1, 3, 3, 3, 5],
            target: 3,
            expected: 1,
            description: '重复元素：找到第一个3的位置'
        },
        {
            nums: [],
            target: 1,
            expected: 0,
            description: '空数组：任何值都应该插入位置0'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`输入: nums = [${test.nums.join(', ')}], target = ${test.target}`);

        // 测试各种解法
        const result1 = searchInsert([...test.nums], test.target);
        const result2 = searchInsertLeftBound([...test.nums], test.target);
        const result3 = searchInsertRecursive([...test.nums], test.target);
        const result4 = searchInsertLinear([...test.nums], test.target);
        const result5 = searchInsertTemplate([...test.nums], test.target);
        const rangeResult = searchInsertRange([...test.nums], test.target);

        console.log(`标准二分查找: ${result1}`);
        console.log(`左边界二分查找: ${result2}`);
        console.log(`递归实现: ${result3}`);
        console.log(`线性查找: ${result4}`);
        console.log(`模板实现: ${result5}`);
        console.log(`范围查询: 位置=${rangeResult.insertPosition}, 存在=${rangeResult.exists}, 范围=[${rangeResult.leftBound}, ${rangeResult.rightBound}]`);

        // 验证结果
        const isCorrect = result1 === test.expected;
        console.log(`结果验证: ${isCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log('---');
    });
}

// 可视化演示
function visualDemo() {
    console.log('\n=== 二分查找可视化演示 ===');

    const nums = [1, 3, 5, 6, 8, 10, 12];
    const target = 7;

    console.log(`数组: [${nums.join(', ')}]`);
    console.log(`目标值: ${target}`);
    console.log('\n二分查找过程:');

    let left = 0;
    let right = nums.length - 1;
    let step = 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        console.log(`步骤 ${step}: left=${left}, right=${right}, mid=${mid}`);
        console.log(`  nums[${mid}] = ${nums[mid]}`);

        if (nums[mid] === target) {
            console.log(`  找到目标值！返回索引 ${mid}`);
            break;
        } else if (nums[mid] < target) {
            console.log(`  ${nums[mid]} < ${target}，搜索右半部分`);
            left = mid + 1;
        } else {
            console.log(`  ${nums[mid]} > ${target}，搜索左半部分`);
            right = mid - 1;
        }

        step++;
    }

    if (left > right) {
        console.log(`未找到目标值，插入位置为 ${left}`);
    }

    // 可视化搜索过程
    console.log('\n搜索范围可视化:');
    left = 0;
    right = nums.length - 1;
    step = 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        let visualization = '';
        for (let i = 0; i < nums.length; i++) {
            if (i === mid) {
                visualization += '[M]';
            } else if (i >= left && i <= right) {
                visualization += `[${nums[i]}]`;
            } else {
                visualization += ` ${nums[i]} `;
            }
            if (i < nums.length - 1) visualization += ' ';
        }

        console.log(`步骤 ${step}: ${visualization}`);
        console.log(`  搜索范围: [${left}, ${right}], 中点: ${mid}`);

        if (nums[mid] === target) {
            break;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }

        step++;
    }
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能对比测试 ===');

    const sizes = [1000, 10000, 100000, 1000000];

    sizes.forEach(size => {
        console.log(`\n测试数据规模: ${size} 个元素`);

        // 生成有序数组
        const nums = Array.from({ length: size }, (_, i) => i * 2);
        const target = size; // 选择一个中间位置的目标值

        // 测试二分查找
        console.time('二分查找');
        const result1 = searchInsert([...nums], target);
        console.timeEnd('二分查找');

        // 测试线性查找（只在小数据集上测试）
        if (size <= 10000) {
            console.time('线性查找');
            const result2 = searchInsertLinear([...nums], target);
            console.timeEnd('线性查找');
        } else {
            console.log('线性查找: 数据量过大，跳过测试');
        }

        console.log(`插入位置: ${result1}`);
    });
}

// 复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');

    console.log('1. 标准二分查找（推荐）:');
    console.log('   时间复杂度: O(log n) - 每次排除一半元素');
    console.log('   空间复杂度: O(1) - 只使用常数额外空间');
    console.log('   优点: 最优时间复杂度，适合大数据集');
    console.log('   缺点: 需要数组有序');

    console.log('\n2. 左边界二分查找:');
    console.log('   时间复杂度: O(log n) - 二分查找');
    console.log('   空间复杂度: O(1) - 只使用常数额外空间');
    console.log('   优点: 模板清晰，易于扩展');
    console.log('   缺点: 理解稍难');

    console.log('\n3. 递归实现:');
    console.log('   时间复杂度: O(log n) - 二分查找');
    console.log('   空间复杂度: O(log n) - 递归栈空间');
    console.log('   优点: 代码简洁，思路清晰');
    console.log('   缺点: 空间开销大，可能栈溢出');

    console.log('\n4. 线性查找:');
    console.log('   时间复杂度: O(n) - 需要遍历数组');
    console.log('   空间复杂度: O(1) - 只使用常数额外空间');
    console.log('   优点: 实现简单，适合小数据集');
    console.log('   缺点: 时间复杂度高，大数据集效率低');

    console.log('\n推荐解法: 标准二分查找');
    console.log('理由: 满足题目要求的O(log n)时间复杂度，实现简单清晰');
}

// 边界条件分析
function boundaryAnalysis() {
    console.log('\n=== 边界条件分析 ===');

    console.log('二分查找的关键边界条件:');
    console.log('1. 循环条件: left <= right vs left < right');
    console.log('2. 中点计算: 避免整数溢出');
    console.log('3. 边界更新: mid±1 的选择');
    console.log('4. 返回值: 循环结束后的left值');

    console.log('\n常见错误分析:');
    console.log('1. 死循环: 边界更新错误导致');
    console.log('2. 越界: 没有正确处理边界情况');
    console.log('3. off-by-one: 索引偏移错误');

    // 演示边界情况
    const boundaryTests = [
        { nums: [], target: 1, desc: '空数组' },
        { nums: [1], target: 0, desc: '单元素，目标值更小' },
        { nums: [1], target: 1, desc: '单元素，目标值相等' },
        { nums: [1], target: 2, desc: '单元素，目标值更大' },
        { nums: [1, 3], target: 0, desc: '双元素，插入开头' },
        { nums: [1, 3], target: 2, desc: '双元素，插入中间' },
        { nums: [1, 3], target: 4, desc: '双元素，插入末尾' }
    ];

    console.log('\n边界测试结果:');
    boundaryTests.forEach(test => {
        const result = searchInsert(test.nums, test.target);
        console.log(`${test.desc}: [${test.nums.join(', ')}], target=${test.target} → 位置=${result}`);
    });
}

// 二分查找变种
function binarySearchVariants() {
    console.log('\n=== 二分查找变种问题 ===');

    console.log('1. 查找第一个出现的位置（左边界）');
    console.log('2. 查找最后一个出现的位置（右边界）');
    console.log('3. 查找峰值元素');
    console.log('4. 搜索旋转排序数组');
    console.log('5. 寻找两个正序数组的中位数');

    // 演示左右边界查找
    const arr = [1, 2, 2, 2, 3, 4, 5];
    const target = 2;

    console.log(`\n示例数组: [${arr.join(', ')}], 查找目标: ${target}`);

    // 查找左边界
    const leftBound = binarySearchLeftBound(arr, num => num >= target);
    console.log(`左边界（第一个>=target的位置）: ${leftBound}`);

    // 查找右边界
    const rightBound = binarySearchLeftBound(arr, num => num > target);
    console.log(`右边界（第一个>target的位置）: ${rightBound}`);
    console.log(`目标值出现的范围: [${leftBound}, ${rightBound - 1}]`);
    console.log(`目标值出现次数: ${rightBound - leftBound}`);
}

// 实际应用场景
function practicalApplications() {
    console.log('\n=== 实际应用场景 ===');

    console.log('1. 数据库索引查找:');
    console.log('   - B+树索引的查找过程');
    console.log('   - 快速定位数据记录');

    console.log('\n2. 版本控制系统:');
    console.log('   - Git bisect查找引入bug的提交');
    console.log('   - 快速定位问题版本');

    console.log('\n3. 系统负载均衡:');
    console.log('   - 根据负载快速分配服务器');
    console.log('   - 插入新任务到合适位置');

    console.log('\n4. 时间序列数据:');
    console.log('   - 日志文件的时间戳查找');
    console.log('   - 监控数据的区间查询');

    // 模拟时间戳查找
    console.log('\n模拟应用：时间戳日志查找');
    const timestamps = [1000, 1005, 1010, 1015, 1020, 1025, 1030];
    const queryTime = 1012;

    console.log(`日志时间戳: [${timestamps.join(', ')}]`);
    console.log(`查询时间: ${queryTime}`);

    const insertPos = searchInsert(timestamps, queryTime);
    console.log(`插入位置: ${insertPos}`);

    if (insertPos < timestamps.length) {
        console.log(`最接近的后续日志时间: ${timestamps[insertPos]}`);
    }
    if (insertPos > 0) {
        console.log(`最接近的之前日志时间: ${timestamps[insertPos - 1]}`);
    }
}

// 运行所有测试
if (require.main === module) {
    runTests();
    visualDemo();
    performanceTest();
    complexityAnalysis();
    boundaryAnalysis();
    binarySearchVariants();
    practicalApplications();
}

// 导出函数供其他模块使用
module.exports = {
    searchInsert,
    searchInsertLeftBound,
    searchInsertRecursive,
    searchInsertLinear,
    searchInsertTemplate,
    searchInsertRange,
    binarySearchLeftBound
};