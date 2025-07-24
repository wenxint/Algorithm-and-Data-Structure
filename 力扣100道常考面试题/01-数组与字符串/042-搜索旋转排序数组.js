/**
 * LeetCode 33. 搜索旋转排序数组
 *
 * 问题描述：
 * 整数数组 nums 按升序排列，数组中的值 互不相同。
 * 在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了旋转，
 * 使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标从 0 开始计数）。
 * 例如，[0,1,2,4,5,6,7] 在下标 3 处经旋转后可能变为 [4,5,6,7,0,1,2]。
 * 给你旋转后的数组 nums 和一个整数 target，如果 nums 中存在这个目标值 target，则返回它的下标，否则返回 -1。
 *
 * 核心思想：
 * 旋转排序数组可以看作两个有序数组的拼接，通过二分查找来定位目标值
 * 关键在于判断目标值在哪一段有序区间内
 *
 * 示例：
 * 输入：nums = [4,5,6,7,0,1,2], target = 0
 * 输出：4
 */

/**
 * 方法一：标准二分查找
 *
 * 核心思想：
 * 旋转数组实际上是两个有序数组的拼接，但整体可以分为两种情况：
 * 1. 左半部分有序：nums[left] <= nums[mid]
 * 2. 右半部分有序：nums[mid] <= nums[right]
 * 通过判断target在哪个有序部分，缩小搜索范围
 *
 * 算法步骤：
 * 1. 初始化左右指针
 * 2. 计算中点，判断哪半边是有序的
 * 3. 判断target在有序部分还是无序部分
 * 4. 调整搜索范围，继续二分查找
 * 5. 直到找到目标或搜索结束
 *
 * @param {number[]} nums - 旋转排序数组
 * @param {number} target - 目标值
 * @returns {number} 目标值的索引，不存在返回-1
 * @time O(log n) 二分查找的时间复杂度
 * @space O(1) 只使用常数额外空间
 */
function search(nums, target) {
    console.log("=== 搜索旋转排序数组（标准二分查找） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log(`目标值: ${target}`);

    let left = 0;
    let right = nums.length - 1;
    let step = 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        console.log(`\n第 ${step} 步:`);
        console.log(`  搜索范围: [${left}, ${right}], 中点: ${mid}`);
        console.log(`  nums[${left}]=${nums[left]}, nums[${mid}]=${nums[mid]}, nums[${right}]=${nums[right]}`);

        // 找到目标值
        if (nums[mid] === target) {
            console.log(`  ✅ 找到目标值 ${target} 在索引 ${mid}`);
            return mid;
        }

        // 判断左半部分是否有序
        if (nums[left] <= nums[mid]) {
            console.log(`  左半部分有序: nums[${left}]=${nums[left]} <= nums[${mid}]=${nums[mid]}`);

            // 判断target是否在左半部分
            if (nums[left] <= target && target < nums[mid]) {
                console.log(`  目标值 ${target} 在左半部分: ${nums[left]} <= ${target} < ${nums[mid]}`);
                right = mid - 1;
                console.log(`  缩小到左半部分: right = ${right}`);
            } else {
                console.log(`  目标值 ${target} 不在左半部分，搜索右半部分`);
                left = mid + 1;
                console.log(`  缩小到右半部分: left = ${left}`);
            }
        }
        // 右半部分有序
        else {
            console.log(`  右半部分有序: nums[${mid}]=${nums[mid]} <= nums[${right}]=${nums[right]}`);

            // 判断target是否在右半部分
            if (nums[mid] < target && target <= nums[right]) {
                console.log(`  目标值 ${target} 在右半部分: ${nums[mid]} < ${target} <= ${nums[right]}`);
                left = mid + 1;
                console.log(`  缩小到右半部分: left = ${left}`);
            } else {
                console.log(`  目标值 ${target} 不在右半部分，搜索左半部分`);
                right = mid - 1;
                console.log(`  缩小到左半部分: right = ${right}`);
            }
        }
        step++;
    }

    console.log(`\n❌ 未找到目标值 ${target}`);
    return -1;
}

/**
 * 方法二：找旋转点 + 标准二分查找
 *
 * 核心思想：
 * 先找到旋转点（最小值位置），确定两个有序子数组的边界
 * 然后根据target的范围，在相应的子数组中进行标准二分查找
 *
 * @param {number[]} nums - 旋转排序数组
 * @param {number} target - 目标值
 * @returns {number} 目标值的索引，不存在返回-1
 * @time O(log n) 找旋转点O(log n) + 二分查找O(log n)
 * @space O(1) 只使用常数额外空间
 */
function searchWithPivot(nums, target) {
    console.log("\n=== 搜索旋转排序数组（找旋转点法） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log(`目标值: ${target}`);

    const n = nums.length;
    if (n === 0) return -1;
    if (n === 1) return nums[0] === target ? 0 : -1;

    /**
     * 找到旋转点（最小元素的索引）
     * @returns {number} 旋转点索引
     */
    function findPivot() {
        let left = 0;
        let right = n - 1;

        console.log("\n查找旋转点:");

        // 如果数组没有旋转
        if (nums[left] < nums[right]) {
            console.log(`  数组未旋转: nums[0]=${nums[0]} < nums[${n-1}]=${nums[n-1]}`);
            return 0;
        }

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            console.log(`  搜索范围: [${left}, ${right}], 中点: ${mid}`);

            // 如果mid > mid+1，那么mid+1就是最小值
            if (mid < n - 1 && nums[mid] > nums[mid + 1]) {
                console.log(`  找到旋转点: nums[${mid}]=${nums[mid]} > nums[${mid+1}]=${nums[mid+1]}`);
                return mid + 1;
            }

            // 如果mid-1 > mid，那么mid就是最小值
            if (mid > 0 && nums[mid - 1] > nums[mid]) {
                console.log(`  找到旋转点: nums[${mid-1}]=${nums[mid-1]} > nums[${mid}]=${nums[mid]}`);
                return mid;
            }

            // 左半部分有序，最小值在右半部分
            if (nums[left] <= nums[mid]) {
                console.log(`  左半部分有序，搜索右半部分`);
                left = mid + 1;
            }
            // 右半部分有序，最小值在左半部分
            else {
                console.log(`  右半部分有序，搜索左半部分`);
                right = mid - 1;
            }
        }

        return 0;
    }

    /**
     * 在有序数组中进行二分查找
     * @param {number} left - 左边界
     * @param {number} right - 右边界
     * @returns {number} 目标值的索引，不存在返回-1
     */
    function binarySearch(left, right) {
        console.log(`\n在区间 [${left}, ${right}] 中二分查找 ${target}:`);

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            console.log(`  搜索范围: [${left}, ${right}], 中点: ${mid}, 值: ${nums[mid]}`);

            if (nums[mid] === target) {
                console.log(`  ✅ 找到目标值`);
                return mid;
            } else if (nums[mid] < target) {
                console.log(`  ${nums[mid]} < ${target}，搜索右半部分`);
                left = mid + 1;
            } else {
                console.log(`  ${nums[mid]} > ${target}，搜索左半部分`);
                right = mid - 1;
            }
        }

        console.log(`  ❌ 未找到目标值`);
        return -1;
    }

    // 步骤1：找到旋转点
    const pivot = findPivot();
    console.log(`\n旋转点索引: ${pivot}`);
    console.log(`左有序区间: [0, ${pivot-1}], 右有序区间: [${pivot}, ${n-1}]`);

    // 步骤2：确定target在哪个区间
    if (pivot === 0) {
        // 数组未旋转，直接二分查找
        console.log("数组未旋转，直接查找整个数组");
        return binarySearch(0, n - 1);
    } else if (target >= nums[0] && target <= nums[pivot - 1]) {
        // target在左区间
        console.log(`目标值在左区间: ${nums[0]} <= ${target} <= ${nums[pivot-1]}`);
        return binarySearch(0, pivot - 1);
    } else if (target >= nums[pivot] && target <= nums[n - 1]) {
        // target在右区间
        console.log(`目标值在右区间: ${nums[pivot]} <= ${target} <= ${nums[n-1]}`);
        return binarySearch(pivot, n - 1);
    } else {
        // target不在数组范围内
        console.log(`目标值不在数组范围内`);
        return -1;
    }
}

/**
 * 方法三：一次遍历法（O(n)时间复杂度）
 *
 * 核心思想：
 * 最简单的方法，直接遍历数组查找目标值
 * 虽然时间复杂度较高，但代码简单，适合作为对比
 *
 * @param {number[]} nums - 旋转排序数组
 * @param {number} target - 目标值
 * @returns {number} 目标值的索引，不存在返回-1
 * @time O(n) 线性查找
 * @space O(1) 只使用常数额外空间
 */
function searchLinear(nums, target) {
    console.log("\n=== 搜索旋转排序数组（线性查找） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log(`目标值: ${target}`);

    for (let i = 0; i < nums.length; i++) {
        console.log(`检查索引 ${i}: nums[${i}] = ${nums[i]}`);
        if (nums[i] === target) {
            console.log(`✅ 找到目标值 ${target} 在索引 ${i}`);
            return i;
        }
    }

    console.log(`❌ 未找到目标值 ${target}`);
    return -1;
}

/**
 * 方法四：递归二分查找
 *
 * 核心思想：
 * 使用递归的方式实现二分查找，逻辑与迭代版本相同
 * 但递归形式更容易理解分治的思想
 *
 * @param {number[]} nums - 旋转排序数组
 * @param {number} target - 目标值
 * @returns {number} 目标值的索引，不存在返回-1
 * @time O(log n) 递归二分查找
 * @space O(log n) 递归栈空间
 */
function searchRecursive(nums, target) {
    console.log("\n=== 搜索旋转排序数组（递归二分查找） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log(`目标值: ${target}`);

    /**
     * 递归查找函数
     * @param {number} left - 左边界
     * @param {number} right - 右边界
     * @param {number} depth - 递归深度
     * @returns {number} 目标值的索引，不存在返回-1
     */
    function searchHelper(left, right, depth = 1) {
        const indent = "  ".repeat(depth);
        console.log(`${indent}递归第 ${depth} 层: 搜索范围 [${left}, ${right}]`);

        if (left > right) {
            console.log(`${indent}搜索范围无效，返回 -1`);
            return -1;
        }

        const mid = Math.floor((left + right) / 2);
        console.log(`${indent}中点: ${mid}, 值: ${nums[mid]}`);

        if (nums[mid] === target) {
            console.log(`${indent}✅ 找到目标值 ${target} 在索引 ${mid}`);
            return mid;
        }

        // 左半部分有序
        if (nums[left] <= nums[mid]) {
            console.log(`${indent}左半部分有序`);
            if (nums[left] <= target && target < nums[mid]) {
                console.log(`${indent}目标值在左半部分，递归搜索`);
                return searchHelper(left, mid - 1, depth + 1);
            } else {
                console.log(`${indent}目标值在右半部分，递归搜索`);
                return searchHelper(mid + 1, right, depth + 1);
            }
        }
        // 右半部分有序
        else {
            console.log(`${indent}右半部分有序`);
            if (nums[mid] < target && target <= nums[right]) {
                console.log(`${indent}目标值在右半部分，递归搜索`);
                return searchHelper(mid + 1, right, depth + 1);
            } else {
                console.log(`${indent}目标值在左半部分，递归搜索`);
                return searchHelper(left, mid - 1, depth + 1);
            }
        }
    }

    return searchHelper(0, nums.length - 1);
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 生成旋转排序数组
 * @param {number[]} arr - 原始有序数组
 * @param {number} k - 旋转位置
 * @returns {number[]} 旋转后的数组
 */
function rotateArray(arr, k) {
    const n = arr.length;
    k = k % n; // 处理k大于数组长度的情况
    return arr.slice(k).concat(arr.slice(0, k));
}

/**
 * 找到数组中的旋转点
 * @param {number[]} nums - 旋转排序数组
 * @returns {number} 旋转点索引
 */
function findRotationPoint(nums) {
    console.log("\n=== 查找旋转点 ===");
    const n = nums.length;

    for (let i = 0; i < n - 1; i++) {
        if (nums[i] > nums[i + 1]) {
            console.log(`旋转点在索引 ${i + 1}: ${nums[i]} > ${nums[i + 1]}`);
            return i + 1;
        }
    }

    console.log("数组未旋转，旋转点在索引 0");
    return 0;
}

/**
 * 验证搜索结果
 * @param {number[]} nums - 数组
 * @param {number} target - 目标值
 * @param {number} result - 搜索结果
 * @returns {boolean} 是否正确
 */
function validateSearchResult(nums, target, result) {
    console.log("\n=== 结果验证 ===");
    console.log(`数组: [${nums.join(', ')}]`);
    console.log(`目标值: ${target}`);
    console.log(`搜索结果: ${result}`);

    if (result === -1) {
        // 检查target是否确实不在数组中
        const actualExists = nums.includes(target);
        const isCorrect = !actualExists;
        console.log(`目标值不存在: ${isCorrect ? '✅' : '❌'}`);
        return isCorrect;
    } else {
        // 检查索引是否有效且对应的值是否正确
        const isValidIndex = result >= 0 && result < nums.length;
        const isCorrectValue = isValidIndex && nums[result] === target;
        console.log(`索引有效: ${isValidIndex ? '✅' : '❌'}`);
        console.log(`值正确: ${isCorrectValue ? '✅' : '❌'} (nums[${result}] = ${nums[result]})`);
        return isValidIndex && isCorrectValue;
    }
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    // 生成测试用例
    const generateTestCase = (size, rotateK) => {
        const arr = Array.from({length: size}, (_, i) => i * 2);
        return rotateArray(arr, rotateK);
    };

    const testCases = [
        { array: generateTestCase(100, 30), target: 50 },
        { array: generateTestCase(1000, 300), target: 500 },
        { array: generateTestCase(10000, 3000), target: 5000 }
    ];

    const methods = [
        { name: '标准二分查找', func: search },
        { name: '找旋转点法', func: searchWithPivot },
        { name: '线性查找', func: searchLinear },
        { name: '递归二分查找', func: searchRecursive }
    ];

    for (const testCase of testCases) {
        console.log(`\n测试数组大小: ${testCase.array.length}, 目标值: ${testCase.target}`);

        for (const method of methods) {
            const startTime = performance.now();
            const result = method.func([...testCase.array], testCase.target);
            const endTime = performance.now();

            console.log(`${method.name}: 结果=${result}, 耗时=${(endTime - startTime).toFixed(3)}ms`);
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
    console.log("搜索旋转排序数组算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { nums: [4,5,6,7,0,1,2], target: 0, expected: 4 },
        { nums: [4,5,6,7,0,1,2], target: 3, expected: -1 },
        { nums: [1], target: 0, expected: -1 },
        { nums: [1], target: 1, expected: 0 },
        { nums: [1,3,5], target: 3, expected: 1 },
        { nums: [3,1], target: 1, expected: 1 },
        { nums: [5,1,3], target: 3, expected: 2 },
        { nums: [1,2,3,4,5,6], target: 4, expected: 3 }, // 未旋转数组
        { nums: [6,1,2,3,4,5], target: 4, expected: 4 }  // 旋转数组
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}`);
        console.log(`${"=".repeat(30)}`);

        const { nums, target, expected } = testCase;

        // 先显示数组的旋转信息
        findRotationPoint(nums);

        // 测试所有方法
        const methods = [
            { name: "标准二分查找", func: search },
            { name: "找旋转点法", func: searchWithPivot },
            { name: "线性查找", func: searchLinear },
            { name: "递归二分查找", func: searchRecursive }
        ];

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func([...nums], target);
                results.push(result);

                const isCorrect = result === expected;
                console.log(`结果: ${result}, 期望: ${expected}, 正确: ${isCorrect ? '✅' : '❌'}`);

                // 验证结果
                validateSearchResult(nums, target, result);
            } catch (error) {
                console.log(`❌ 方法执行失败: ${error.message}`);
                results.push(null);
            }
        }

        // 检查所有方法结果是否一致
        console.log("\n--- 方法一致性检查 ---");
        const allSame = results.every(result => result === results[0]);
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
    console.log("搜索旋转排序数组算法演示");
    console.log("=".repeat(50));

    console.log("旋转排序数组的核心思想:");
    console.log("1. 旋转数组可以看作两个有序数组的拼接");
    console.log("2. 任意时刻，数组的一半是有序的");
    console.log("3. 通过比较确定目标值在有序还是无序部分");
    console.log("4. 使用二分查找缩小搜索范围");

    const originalArray = [0, 1, 2, 4, 5, 6, 7];
    const rotatedArray = [4, 5, 6, 7, 0, 1, 2];
    const target = 0;

    console.log(`\n演示数组:`);
    console.log(`原始数组: [${originalArray.join(', ')}]`);
    console.log(`旋转数组: [${rotatedArray.join(', ')}] (在索引3处旋转)`);
    console.log(`搜索目标: ${target}`);

    console.log("\n数组特点分析:");
    console.log("旋转数组 [4,5,6,7,0,1,2] 可以看作:");
    console.log("- 左半部分: [4,5,6,7] (有序)");
    console.log("- 右半部分: [0,1,2] (有序)");
    console.log("- 特征: nums[0] > nums[n-1] (4 > 2)");

    console.log("\n搜索过程分析:");
    console.log("对于每个中点mid，判断:");
    console.log("1. 如果 nums[left] <= nums[mid]，左半部分有序");
    console.log("2. 否则，右半部分有序");
    console.log("3. 判断target在有序部分还是无序部分");
    console.log("4. 调整搜索范围");

    console.log("\n详细演示 - 标准二分查找:");
    const result = search(rotatedArray, target);

    console.log("\n时间复杂度分析:");
    console.log("标准二分查找: O(log n)");
    console.log("找旋转点法: O(log n) + O(log n) = O(log n)");
    console.log("线性查找: O(n)");
    console.log("递归二分查找: O(log n)，空间复杂度O(log n)");
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
    console.log("1. 旋转排序数组仍保持局部有序性");
    console.log("2. 任意时刻一半区间是有序的");
    console.log("3. 通过比较端点判断有序区间");
    console.log("4. 二分查找的核心：缩小搜索范围");

    console.log("\n🔧 实现技巧:");
    console.log("1. 关键判断：nums[left] <= nums[mid]");
    console.log("2. 边界条件：left <= right");
    console.log("3. 目标范围判断：nums[left] <= target < nums[mid]");
    console.log("4. 可以先找旋转点再分段查找");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 边界条件判断错误（<=还是<）");
    console.log("2. 有序区间判断失误");
    console.log("3. 目标值范围判断错误");
    console.log("4. 忘记处理数组长度为1的情况");
    console.log("5. 重复元素情况（LeetCode 81）");

    console.log("\n🎨 变体问题:");
    console.log("1. 搜索旋转排序数组II（有重复元素）");
    console.log("2. 寻找旋转排序数组中的最小值");
    console.log("3. 寻找旋转排序数组中的最小值II");
    console.log("4. 旋转数组的最大值");

    console.log("\n📊 复杂度分析:");
    console.log("1. 时间复杂度：O(log n) - 标准二分查找");
    console.log("2. 空间复杂度：O(1) - 迭代实现");
    console.log("3. 递归实现空间复杂度：O(log n)");
    console.log("4. 最坏情况仍是O(log n)");

    console.log("\n💡 面试技巧:");
    console.log("1. 先画图理解旋转数组的特点");
    console.log("2. 明确二分查找的判断逻辑");
    console.log("3. 仔细处理边界条件");
    console.log("4. 考虑特殊情况（空数组、单元素）");
    console.log("5. 可以提及多种解法对比");

    console.log("\n🔍 相关概念:");
    console.log("1. 二分查找的变体应用");
    console.log("2. 有序数组的性质利用");
    console.log("3. 搜索空间的动态调整");
    console.log("4. 分治思想的体现");

    console.log("\n🌟 实际应用:");
    console.log("1. 数据库索引的循环结构");
    console.log("2. 缓存淘汰算法中的循环队列");
    console.log("3. 时间序列数据的查找");
    console.log("4. 游戏开发中的循环世界坐标");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        search,
        searchWithPivot,
        searchLinear,
        searchRecursive,
        rotateArray,
        findRotationPoint,
        validateSearchResult,
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