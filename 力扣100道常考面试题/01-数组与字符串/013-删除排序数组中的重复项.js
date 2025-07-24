/**
 * LeetCode 009: 删除排序数组中的重复项 (Remove Duplicates from Sorted Array)
 *
 * 题目描述：
 * 给你一个 升序排列 的数组 nums ，请你原地删除重复出现的元素，使每个元素只出现一次。
 * 返回删除后数组的新长度。元素的相对顺序应该保持一致。
 *
 * 由于在某些语言中不能改变数组的长度，所以必须将结果放在数组nums的第一部分。
 * 更规范地说，如果在删除重复项之后有 k 个元素，那么nums的前 k 个元素应该保存最终结果。
 * 将最终结果插入nums的前 k 个位置后返回 k 。
 *
 * 核心思想：
 * 双指针技巧（快慢指针）
 * 核心理念：利用数组已排序的特性，使用两个指针来原地去重
 *
 * 算法原理：
 * 1. 使用快慢双指针，慢指针指向去重后数组的尾部
 * 2. 快指针遍历数组，寻找不重复的元素
 * 3. 当快指针指向的元素与慢指针指向的元素不同时，慢指针前进并赋值
 * 4. 最终慢指针的位置+1就是去重后数组的长度
 */

/**
 * 解法一：双指针法（推荐）
 *
 * 核心思想：
 * 使用快慢双指针，慢指针指向去重后数组的尾部，快指针遍历数组
 * 当快指针遇到新元素时，将其复制到慢指针的下一个位置
 *
 * @param {number[]} nums - 升序排列的数组
 * @returns {number} 去重后数组的长度
 * @time O(n) 一次遍历
 * @space O(1) 原地操作，只使用常数额外空间
 */
function removeDuplicates(nums) {
    if (nums.length <= 1) return nums.length;

    let slow = 0; // 慢指针：指向去重后数组的尾部

    // 快指针：遍历数组
    for (let fast = 1; fast < nums.length; fast++) {
        // 如果快指针指向的元素与慢指针指向的元素不同
        if (nums[fast] !== nums[slow]) {
            slow++; // 慢指针前进
            nums[slow] = nums[fast]; // 将新元素复制到慢指针位置
        }
    }

    return slow + 1; // 返回去重后数组的长度
}

/**
 * 解法二：双指针法（优化版）
 *
 * 核心思想：
 * 减少不必要的赋值操作，只有当元素真正不同时才进行赋值
 *
 * @param {number[]} nums - 升序排列的数组
 * @returns {number} 去重后数组的长度
 * @time O(n) 一次遍历
 * @space O(1) 原地操作，只使用常数额外空间
 */
function removeDuplicatesOptimized(nums) {
    if (nums.length <= 1) return nums.length;

    let writeIndex = 1; // 下一个要写入的位置

    for (let readIndex = 1; readIndex < nums.length; readIndex++) {
        // 只有当当前元素与前一个元素不同时才写入
        if (nums[readIndex] !== nums[readIndex - 1]) {
            nums[writeIndex] = nums[readIndex];
            writeIndex++;
        }
    }

    return writeIndex;
}

/**
 * 解法三：递归实现
 *
 * 核心思想：
 * 递归地处理数组，每次递归找到下一个不重复的元素
 *
 * @param {number[]} nums - 升序排列的数组
 * @param {number} index - 当前处理的索引
 * @param {number} writePos - 当前写入位置
 * @returns {number} 去重后数组的长度
 * @time O(n) 一次遍历
 * @space O(n) 递归栈空间
 */
function removeDuplicatesRecursive(nums, index = 1, writePos = 1) {
    if (index >= nums.length) {
        return writePos;
    }

    if (nums[index] !== nums[writePos - 1]) {
        nums[writePos] = nums[index];
        return removeDuplicatesRecursive(nums, index + 1, writePos + 1);
    } else {
        return removeDuplicatesRecursive(nums, index + 1, writePos);
    }
}

/**
 * 解法四：使用Set + 重新赋值（非原地）
 *
 * 核心思想：
 * 利用Set的去重特性，然后重新赋值给原数组
 * 注意：这种方法不是原地操作，仅作为参考
 *
 * @param {number[]} nums - 升序排列的数组
 * @returns {number} 去重后数组的长度
 * @time O(n) 遍历数组
 * @space O(n) Set存储去重元素
 */
function removeDuplicatesSet(nums) {
    if (nums.length <= 1) return nums.length;

    const uniqueSet = new Set(nums);
    const uniqueArray = Array.from(uniqueSet);

    // 将去重后的元素复制回原数组
    for (let i = 0; i < uniqueArray.length; i++) {
        nums[i] = uniqueArray[i];
    }

    return uniqueArray.length;
}

/**
 * 解法五：暴力法（双重循环）
 *
 * 核心思想：
 * 对于每个元素，检查它是否在前面已经出现过
 *
 * @param {number[]} nums - 升序排列的数组
 * @returns {number} 去重后数组的长度
 * @time O(n²) 双重循环
 * @space O(1) 只使用常数额外空间
 */
function removeDuplicatesBruteForce(nums) {
    if (nums.length <= 1) return nums.length;

    let writeIndex = 1;

    for (let i = 1; i < nums.length; i++) {
        let isDuplicate = false;

        // 检查当前元素是否在前面出现过
        for (let j = 0; j < writeIndex; j++) {
            if (nums[i] === nums[j]) {
                isDuplicate = true;
                break;
            }
        }

        if (!isDuplicate) {
            nums[writeIndex] = nums[i];
            writeIndex++;
        }
    }

    return writeIndex;
}

/**
 * 扩展：删除排序数组中的重复项 II
 * 允许重复元素最多出现两次
 *
 * 核心思想：
 * 检查当前元素是否与前两个位置的元素相同
 *
 * @param {number[]} nums - 升序排列的数组
 * @returns {number} 去重后数组的长度
 * @time O(n) 一次遍历
 * @space O(1) 原地操作
 */
function removeDuplicatesII(nums) {
    if (nums.length <= 2) return nums.length;

    let writeIndex = 2; // 前两个元素总是保留

    for (let readIndex = 2; readIndex < nums.length; readIndex++) {
        // 当前元素与前两个位置的元素不同，则可以写入
        if (nums[readIndex] !== nums[writeIndex - 2]) {
            nums[writeIndex] = nums[readIndex];
            writeIndex++;
        }
    }

    return writeIndex;
}

/**
 * 通用版本：删除排序数组中的重复项
 * 允许重复元素最多出现k次
 *
 * @param {number[]} nums - 升序排列的数组
 * @param {number} k - 允许的最大重复次数
 * @returns {number} 去重后数组的长度
 * @time O(n) 一次遍历
 * @space O(1) 原地操作
 */
function removeDuplicatesGeneral(nums, k = 1) {
    if (nums.length <= k) return nums.length;

    let writeIndex = k; // 前k个元素总是保留

    for (let readIndex = k; readIndex < nums.length; readIndex++) {
        // 当前元素与前k个位置的元素不同，则可以写入
        if (nums[readIndex] !== nums[writeIndex - k]) {
            nums[writeIndex] = nums[readIndex];
            writeIndex++;
        }
    }

    return writeIndex;
}

/**
 * 返回详细的去重信息
 *
 * @param {number[]} nums - 升序排列的数组
 * @returns {Object} 包含去重详细信息的对象
 */
function removeDuplicatesDetailed(nums) {
    if (nums.length <= 1) {
        return {
            originalLength: nums.length,
            newLength: nums.length,
            removedCount: 0,
            duplicates: [],
            result: [...nums]
        };
    }

    const original = [...nums];
    const duplicates = [];
    let slow = 0;

    for (let fast = 1; fast < nums.length; fast++) {
        if (nums[fast] === nums[slow]) {
            duplicates.push(nums[fast]);
        } else {
            slow++;
            nums[slow] = nums[fast];
        }
    }

    const newLength = slow + 1;

    return {
        originalLength: original.length,
        newLength: newLength,
        removedCount: original.length - newLength,
        duplicates: duplicates,
        result: nums.slice(0, newLength),
        originalArray: original
    };
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 009: 删除排序数组中的重复项 测试 ===\n');

    const testCases = [
        {
            nums: [1, 1, 2],
            expected: 2,
            expectedArray: [1, 2],
            description: '简单情况：[1,1,2] → [1,2]，长度为2'
        },
        {
            nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4],
            expected: 5,
            expectedArray: [0, 1, 2, 3, 4],
            description: '多重复：[0,0,1,1,1,2,2,3,3,4] → [0,1,2,3,4]，长度为5'
        },
        {
            nums: [1, 2, 3, 4, 5],
            expected: 5,
            expectedArray: [1, 2, 3, 4, 5],
            description: '无重复：[1,2,3,4,5] → [1,2,3,4,5]，长度为5'
        },
        {
            nums: [1, 1, 1, 1, 1],
            expected: 1,
            expectedArray: [1],
            description: '全重复：[1,1,1,1,1] → [1]，长度为1'
        },
        {
            nums: [1],
            expected: 1,
            expectedArray: [1],
            description: '单元素：[1] → [1]，长度为1'
        },
        {
            nums: [],
            expected: 0,
            expectedArray: [],
            description: '空数组：[] → []，长度为0'
        },
        {
            nums: [1, 2, 2, 3, 3, 3, 4, 4, 4, 4],
            expected: 4,
            expectedArray: [1, 2, 3, 4],
            description: '递增重复：每个数字重复次数递增'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`输入: [${test.nums.join(', ')}]`);

        // 测试各种解法
        const nums1 = [...test.nums];
        const nums2 = [...test.nums];
        const nums3 = [...test.nums];
        const nums4 = [...test.nums];
        const nums5 = [...test.nums];

        const result1 = removeDuplicates(nums1);
        const result2 = removeDuplicatesOptimized(nums2);
        const result3 = test.nums.length > 0 ? removeDuplicatesRecursive(nums3) : 0;
        const result4 = removeDuplicatesSet(nums4);
        const detailed = removeDuplicatesDetailed([...test.nums]);

        console.log(`双指针法: 长度=${result1}, 数组=[${nums1.slice(0, result1).join(', ')}]`);
        console.log(`优化双指针: 长度=${result2}, 数组=[${nums2.slice(0, result2).join(', ')}]`);
        console.log(`递归实现: 长度=${result3}, 数组=[${nums3.slice(0, result3).join(', ')}]`);
        console.log(`Set去重: 长度=${result4}, 数组=[${nums4.slice(0, result4).join(', ')}]`);
        console.log(`详细信息: 原长度=${detailed.originalLength}, 新长度=${detailed.newLength}, 删除=${detailed.removedCount}个, 重复元素=[${detailed.duplicates.join(', ')}]`);

        // 验证结果
        const isCorrect = result1 === test.expected;
        console.log(`结果验证: ${isCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log('---');
    });
}

// 可视化演示
function visualDemo() {
    console.log('\n=== 双指针去重可视化演示 ===');

    const nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4];
    console.log(`原数组: [${nums.join(', ')}]`);
    console.log('\n双指针执行过程:');

    let slow = 0;
    console.log(`初始状态: slow=${slow}, nums=[${nums.join(', ')}]`);
    console.log(`           ↑ (slow指针)`);

    for (let fast = 1; fast < nums.length; fast++) {
        console.log(`\n步骤 ${fast}: fast=${fast}, nums[fast]=${nums[fast]}`);

        if (nums[fast] !== nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
            console.log(`  发现新元素! slow前进到${slow}, 复制nums[${fast}]=${nums[fast]}`);
        } else {
            console.log(`  重复元素, 跳过`);
        }

        // 可视化当前状态
        let visualization = '';
        for (let i = 0; i < nums.length; i++) {
            if (i === slow) {
                visualization += `[${nums[i]}]`;
            } else if (i <= slow) {
                visualization += ` ${nums[i]} `;
            } else {
                visualization += ` . `;
            }
        }
        console.log(`  状态: ${visualization}`);
        console.log(`        ${'    '.repeat(slow)}↑ (slow=${slow})`);
    }

    console.log(`\n最终结果: 长度=${slow + 1}, 数组=[${nums.slice(0, slow + 1).join(', ')}]`);
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能对比测试 ===');

    const sizes = [1000, 10000, 100000];

    sizes.forEach(size => {
        console.log(`\n测试数据规模: ${size} 个元素`);

        // 生成测试数据：每个数字重复3-5次
        const nums = [];
        for (let i = 0; i < size / 3; i++) {
            const repeatCount = 3 + Math.floor(Math.random() * 3); // 3-5次重复
            for (let j = 0; j < repeatCount; j++) {
                nums.push(i);
            }
        }
        nums.sort((a, b) => a - b); // 确保排序

        console.log(`生成了${nums.length}个元素，预期去重后约${size / 3}个`);

        // 测试双指针法
        console.time('双指针法');
        const result1 = removeDuplicates([...nums]);
        console.timeEnd('双指针法');

        // 测试优化双指针
        console.time('优化双指针');
        const result2 = removeDuplicatesOptimized([...nums]);
        console.timeEnd('优化双指针');

        // 测试Set方法
        console.time('Set去重');
        const result3 = removeDuplicatesSet([...nums]);
        console.timeEnd('Set去重');

        // 暴力法只在小数据集上测试
        if (size <= 1000) {
            console.time('暴力法');
            const result4 = removeDuplicatesBruteForce([...nums]);
            console.timeEnd('暴力法');
        } else {
            console.log('暴力法: 数据量过大，跳过测试');
        }

        console.log(`去重后长度: ${result1}`);
    });
}

// 复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');

    console.log('1. 双指针法（推荐）:');
    console.log('   时间复杂度: O(n) - 一次遍历数组');
    console.log('   空间复杂度: O(1) - 原地操作，只使用常数额外空间');
    console.log('   优点: 时空复杂度最优，满足原地操作要求');
    console.log('   缺点: 无');

    console.log('\n2. 优化双指针:');
    console.log('   时间复杂度: O(n) - 一次遍历数组');
    console.log('   空间复杂度: O(1) - 原地操作');
    console.log('   优点: 减少了赋值操作，略微优化性能');
    console.log('   缺点: 理解稍复杂');

    console.log('\n3. 递归实现:');
    console.log('   时间复杂度: O(n) - 一次遍历');
    console.log('   空间复杂度: O(n) - 递归栈空间');
    console.log('   优点: 代码简洁，易于理解');
    console.log('   缺点: 空间开销大，可能栈溢出');

    console.log('\n4. Set去重:');
    console.log('   时间复杂度: O(n) - 遍历数组');
    console.log('   空间复杂度: O(n) - Set存储去重元素');
    console.log('   优点: 代码简单，适合理解去重概念');
    console.log('   缺点: 空间开销大，不是原地操作');

    console.log('\n5. 暴力法:');
    console.log('   时间复杂度: O(n²) - 对每个元素都要检查前面所有元素');
    console.log('   空间复杂度: O(1) - 原地操作');
    console.log('   优点: 思路直观');
    console.log('   缺点: 时间复杂度过高，不适合大数据集');

    console.log('\n推荐解法: 双指针法');
    console.log('理由: 时空复杂度最优，满足原地操作要求，代码简洁');
}

// 双指针技巧总结
function twoPointerTechniques() {
    console.log('\n=== 双指针技巧总结 ===');

    console.log('双指针的应用场景:');
    console.log('1. 有序数组去重（本题）');
    console.log('2. 两数之和（有序数组）');
    console.log('3. 三数之和');
    console.log('4. 删除元素');
    console.log('5. 移动零');
    console.log('6. 反转字符串');
    console.log('7. 回文字符串判断');

    console.log('\n快慢指针的特点:');
    console.log('- 慢指针：维护结果数组的边界');
    console.log('- 快指针：遍历原数组寻找符合条件的元素');
    console.log('- 核心思想：用慢指针构建新数组，快指针探索原数组');

    console.log('\n对撞指针的特点:');
    console.log('- 左指针：从数组左端开始');
    console.log('- 右指针：从数组右端开始');
    console.log('- 核心思想：两指针向中间移动，直到相遇');

    // 演示其他双指针应用
    console.log('\n相关题目示例:');

    // 移动零
    function moveZeroes(nums) {
        let slow = 0;
        for (let fast = 0; fast < nums.length; fast++) {
            if (nums[fast] !== 0) {
                [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
                slow++;
            }
        }
        return nums;
    }

    const moveZeroExample = [0, 1, 0, 3, 12];
    console.log(`移动零: [${moveZeroExample.join(', ')}] → [${moveZeroes([...moveZeroExample]).join(', ')}]`);

    // 两数之和（有序数组）
    function twoSumSorted(numbers, target) {
        let left = 0, right = numbers.length - 1;
        while (left < right) {
            const sum = numbers[left] + numbers[right];
            if (sum === target) return [left + 1, right + 1];
            else if (sum < target) left++;
            else right--;
        }
        return [];
    }

    const twoSumExample = [2, 7, 11, 15];
    const target = 9;
    console.log(`两数之和: [${twoSumExample.join(', ')}], target=${target} → [${twoSumSorted(twoSumExample, target).join(', ')}]`);
}

// 问题变形和扩展
function problemVariants() {
    console.log('\n=== 问题变形和扩展 ===');

    console.log('1. 删除排序数组中的重复项 II:');
    const nums1 = [1, 1, 1, 2, 2, 3];
    const result1 = removeDuplicatesII([...nums1]);
    console.log(`   输入: [${nums1.join(', ')}]`);
    console.log(`   允许重复2次: 长度=${result1}`);

    console.log('\n2. 通用版本（允许重复k次）:');
    const nums2 = [1, 1, 1, 1, 2, 2, 2, 3, 3];
    const k = 3;
    const result2 = removeDuplicatesGeneral([...nums2], k);
    console.log(`   输入: [${nums2.join(', ')}]`);
    console.log(`   允许重复${k}次: 长度=${result2}`);

    console.log('\n3. 删除指定值:');
    function removeElement(nums, val) {
        let slow = 0;
        for (let fast = 0; fast < nums.length; fast++) {
            if (nums[fast] !== val) {
                nums[slow] = nums[fast];
                slow++;
            }
        }
        return slow;
    }

    const nums3 = [3, 2, 2, 3];
    const val = 3;
    const result3 = removeElement([...nums3], val);
    console.log(`   输入: [${nums3.join(', ')}], 删除值: ${val}`);
    console.log(`   删除后长度: ${result3}`);

    console.log('\n4. 删除排序链表中的重复元素:');
    console.log('   可以用类似思想处理链表去重');

    console.log('\n5. 字符串去重:');
    function removeDuplicateChars(s) {
        if (!s) return '';
        let result = s[0];
        for (let i = 1; i < s.length; i++) {
            if (s[i] !== s[i - 1]) {
                result += s[i];
            }
        }
        return result;
    }

    const str = 'aabbccddee';
    console.log(`   字符串去重: "${str}" → "${removeDuplicateChars(str)}"`);
}

// 实际应用场景
function practicalApplications() {
    console.log('\n=== 实际应用场景 ===');

    console.log('1. 数据清洗:');
    console.log('   - 数据库查询结果去重');
    console.log('   - 日志文件重复记录清理');

    console.log('\n2. 内存优化:');
    console.log('   - 减少存储空间占用');
    console.log('   - 提高缓存效率');

    console.log('\n3. 数据预处理:');
    console.log('   - 机器学习数据清洗');
    console.log('   - 统计分析前的数据整理');

    console.log('\n4. 前端开发:');
    console.log('   - 搜索建议去重');
    console.log('   - 表格数据去重显示');

    // 模拟实际应用
    console.log('\n模拟应用：用户访问日志去重');
    const accessLogs = [
        { userId: 1, timestamp: 1000 },
        { userId: 1, timestamp: 1000 }, // 重复
        { userId: 1, timestamp: 1005 },
        { userId: 2, timestamp: 1010 },
        { userId: 2, timestamp: 1010 }, // 重复
        { userId: 3, timestamp: 1015 }
    ];

    console.log('原始日志:');
    accessLogs.forEach(log => console.log(`  用户${log.userId} - 时间${log.timestamp}`));

    // 去重（假设已按用户和时间排序）
    const uniqueLogs = [];
    for (let i = 0; i < accessLogs.length; i++) {
        if (i === 0 ||
            accessLogs[i].userId !== accessLogs[i-1].userId ||
            accessLogs[i].timestamp !== accessLogs[i-1].timestamp) {
            uniqueLogs.push(accessLogs[i]);
        }
    }

    console.log('\n去重后日志:');
    uniqueLogs.forEach(log => console.log(`  用户${log.userId} - 时间${log.timestamp}`));
    console.log(`去重前: ${accessLogs.length}条，去重后: ${uniqueLogs.length}条`);
}

// 运行所有测试
if (require.main === module) {
    runTests();
    visualDemo();
    performanceTest();
    complexityAnalysis();
    twoPointerTechniques();
    problemVariants();
    practicalApplications();
}

// 导出函数供其他模块使用
module.exports = {
    removeDuplicates,
    removeDuplicatesOptimized,
    removeDuplicatesRecursive,
    removeDuplicatesSet,
    removeDuplicatesBruteForce,
    removeDuplicatesII,
    removeDuplicatesGeneral,
    removeDuplicatesDetailed
};