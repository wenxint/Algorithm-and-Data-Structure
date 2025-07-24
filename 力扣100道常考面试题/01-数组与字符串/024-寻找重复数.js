/**
 * LeetCode 026: 寻找重复数 (Find the Duplicate Number)
 *
 * 题目描述：
 * 给定一个包含 n + 1 个整数的数组 nums ，其中每个整数都在 [1, n] 范围内，包括 1 和 n。
 * 数组中只有一个重复的数字，返回这个重复的数字。
 *
 * 约束条件：
 * - 不能修改数组（只读）
 * - 只能使用 O(1) 的额外空间
 * - 时间复杂度小于 O(n²)
 *
 * 示例：
 * 输入: nums = [1,3,4,2,2]
 * 输出: 2
 *
 * 输入: nums = [3,1,3,4,2]
 * 输出: 3
 *
 * 核心思想：
 * 1. 快慢指针法（Floyd判圈算法）：将数组看作链表，寻找环的入口
 * 2. 二分查找法：利用抽屉原理，在值域上进行二分
 * 3. 位运算法：利用异或的性质
 * 4. 负标记法：利用索引标记访问状态（修改数组）
 *
 * 解题要点：
 * - 理解数组和链表的映射关系：nums[i] 作为下一个节点的索引
 * - 抽屉原理：n+1个数放入n个抽屉，必有重复
 * - 快慢指针找环的经典应用
 * - 二分查找在非排序数组上的应用
 */

/**
 * 方法一：快慢指针法（Floyd判圈算法）- 推荐解法
 *
 * 核心思想：
 * 将数组看作链表，nums[i] 表示从位置 i 指向位置 nums[i]
 * 由于存在重复数字，这个"链表"必然存在环
 * 使用Floyd算法找到环的入口，即为重复数字
 *
 * 算法步骤：
 * 1. 使用快慢指针找到环中的相遇点
 * 2. 将一个指针重置到起点，与另一个指针同步移动
 * 3. 再次相遇的位置就是环的入口（重复数字）
 *
 * 数学原理：
 * 设环入口前距离为a，环长为b，相遇点到入口距离为c
 * 快指针走的距离：a + b + c + kb (k>=0)
 * 慢指针走的距离：a + b + c
 * 快指针速度是慢指针2倍：2(a + b + c) = a + b + c + kb
 * 化简得：a = kb - c，即从起点到入口的距离等于从相遇点走k圈再到入口
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 重复的数字
 * @time O(n) - 最多遍历数组常数倍
 * @space O(1) - 只使用两个指针
 */
function findDuplicate(nums) {
    // 阶段1：使用快慢指针找到环中的相遇点
    let slow = nums[0];
    let fast = nums[0];

    // 快慢指针第一次相遇
    do {
        slow = nums[slow];       // 慢指针每次走一步
        fast = nums[nums[fast]]; // 快指针每次走两步
    } while (slow !== fast);

    // 阶段2：找到环的入口（重复数字）
    // 将一个指针重置到起点
    slow = nums[0];

    // 两个指针以相同速度移动，直到相遇
    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
    }

    return slow; // 相遇点就是环的入口，即重复数字
}

/**
 * 方法二：二分查找法
 *
 * 核心思想：
 * 利用抽屉原理在值域[1,n]上进行二分查找
 * 对于中间值mid，统计数组中<=mid的数的个数
 * 如果个数>mid，说明重复数字在[1,mid]范围内
 * 否则重复数字在[mid+1,n]范围内
 *
 * 算法步骤：
 * 1. 在值域[1,n]上进行二分查找
 * 2. 对于每个mid，统计<=mid的数的个数count
 * 3. 如果count > mid，重复数在左半部分
 * 4. 否则重复数在右半部分
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 重复的数字
 * @time O(n log n) - 二分查找O(log n)次，每次统计O(n)
 * @space O(1) - 只使用常数额外空间
 */
function findDuplicateBinarySearch(nums) {
    let left = 1;
    let right = nums.length - 1;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);

        // 统计数组中小于等于mid的数的个数
        let count = 0;
        for (const num of nums) {
            if (num <= mid) {
                count++;
            }
        }

        // 根据抽屉原理判断重复数字的位置
        if (count > mid) {
            // 重复数字在[left, mid]范围内
            right = mid;
        } else {
            // 重复数字在[mid+1, right]范围内
            left = mid + 1;
        }
    }

    return left;
}

/**
 * 方法三：哈希表法（违反空间限制）
 *
 * 核心思想：
 * 使用Set记录已经见过的数字
 * 第一个重复出现的数字就是答案
 *
 * 注意：此方法违反了O(1)空间限制，仅用于理解
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 重复的数字
 * @time O(n) - 遍历数组一次
 * @space O(n) - 最坏情况下Set存储n个元素
 */
function findDuplicateHashSet(nums) {
    const seen = new Set();

    for (const num of nums) {
        if (seen.has(num)) {
            return num; // 找到重复数字
        }
        seen.add(num);
    }

    return -1; // 理论上不会到达这里
}

/**
 * 方法四：负标记法（修改数组）
 *
 * 核心思想：
 * 将nums[i]的符号作为标记，表示数字i是否出现过
 * 遍历数组，对于每个数字，检查对应位置的符号
 * 如果已经是负数，说明之前出现过，找到重复数字
 *
 * 注意：此方法修改了原数组，违反了题目要求
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 重复的数字
 * @time O(n) - 遍历数组两次
 * @space O(1) - 只使用常数额外空间
 */
function findDuplicateNegativeMarking(nums) {
    // 第一遍：标记
    for (let i = 0; i < nums.length; i++) {
        const index = Math.abs(nums[i]);

        if (nums[index] < 0) {
            // 已经被标记过，说明是重复数字
            // 恢复数组并返回结果
            for (let j = 0; j < nums.length; j++) {
                nums[j] = Math.abs(nums[j]);
            }
            return index;
        }

        // 标记为已访问
        nums[index] = -nums[index];
    }

    // 恢复数组
    for (let i = 0; i < nums.length; i++) {
        nums[i] = Math.abs(nums[i]);
    }

    return -1; // 理论上不会到达这里
}

/**
 * 方法五：位运算法
 *
 * 核心思想：
 * 利用异或的性质：a ^ a = 0, a ^ 0 = a
 * 将数组中的数字和[1,n]的数字分别异或
 * 重复的数字会被抵消，剩下的就是重复数字
 *
 * 但此方法有问题：它假设除了一个数字重复一次外，其他数字都出现一次
 * 实际题目中，缺失的数字不出现，重复的数字出现两次
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 重复的数字
 * @time O(n) - 遍历数组两次
 * @space O(1) - 只使用常数额外空间
 */
function findDuplicateXOR(nums) {
    const n = nums.length - 1;
    let xor = 0;

    // 异或数组中的所有数字
    for (const num of nums) {
        xor ^= num;
    }

    // 异或[1,n]中的所有数字
    for (let i = 1; i <= n; i++) {
        xor ^= i;
    }

    // 注意：这个方法在此题中不正确
    // 因为缺失的数字没有出现，重复的数字出现了两次
    // 正确的异或方法需要更复杂的处理
    return -1; // 标记为不正确的方法
}

/**
 * 方法六：排序法（修改数组）
 *
 * 核心思想：
 * 对数组排序，然后查找相邻的重复元素
 *
 * 注意：此方法修改了原数组，违反了题目要求
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 重复的数字
 * @time O(n log n) - 排序的时间复杂度
 * @space O(1) - 原地排序
 */
function findDuplicateSort(nums) {
    // 保存原数组副本以便恢复
    const original = [...nums];

    nums.sort((a, b) => a - b);

    for (let i = 1; i < nums.length; i++) {
        if (nums[i] === nums[i - 1]) {
            // 恢复原数组
            for (let j = 0; j < nums.length; j++) {
                nums[j] = original[j];
            }
            return nums[i];
        }
    }

    // 恢复原数组
    for (let i = 0; i < nums.length; i++) {
        nums[i] = original[i];
    }

    return -1; // 理论上不会到达这里
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 026: 寻找重复数 测试 ===\n');

    const testCases = [
        {
            name: '基础测试1',
            input: [1, 3, 4, 2, 2],
            expected: 2,
            explanation: '数字2重复出现'
        },
        {
            name: '基础测试2',
            input: [3, 1, 3, 4, 2],
            expected: 3,
            explanation: '数字3重复出现'
        },
        {
            name: '重复数字在开头',
            input: [1, 1],
            expected: 1,
            explanation: '最小情况，两个1'
        },
        {
            name: '重复数字在末尾',
            input: [2, 5, 9, 6, 9, 3, 8, 9, 7, 1],
            expected: 9,
            explanation: '数字9重复出现多次'
        },
        {
            name: '大数组测试',
            input: [1, 2, 3, 4, 5, 6, 7, 8, 9, 9],
            expected: 9,
            explanation: '较大数组中的重复'
        },
        {
            name: '重复数字是最小值',
            input: [2, 1, 1, 3],
            expected: 1,
            explanation: '重复数字是范围内最小值'
        },
        {
            name: '重复数字是最大值',
            input: [1, 2, 3, 3],
            expected: 3,
            explanation: '重复数字是范围内最大值'
        },
        {
            name: '复杂环结构',
            input: [4, 3, 1, 4, 2],
            expected: 4,
            explanation: '形成复杂环结构'
        }
    ];

    const methods = [
        { name: '快慢指针法', func: findDuplicate },
        { name: '二分查找法', func: findDuplicateBinarySearch },
        { name: '哈希表法', func: findDuplicateHashSet },
        { name: '负标记法', func: findDuplicateNegativeMarking },
        { name: '排序法', func: findDuplicateSort }
        // 跳过异或法，因为在此题中不正确
    ];

    testCases.forEach(testCase => {
        console.log(`测试: ${testCase.name}`);
        console.log(`输入: [${testCase.input.join(',')}]`);
        console.log(`期望: ${testCase.expected}`);
        console.log(`说明: ${testCase.explanation}`);

        methods.forEach(method => {
            const nums = [...testCase.input]; // 创建副本避免修改原数组
            const result = method.func(nums);
            const isCorrect = result === testCase.expected;
            console.log(`${method.name}: ${result} ${isCorrect ? '✓' : '✗'}`);
        });
        console.log('');
    });
}

// 性能测试
function performanceTest() {
    console.log('=== 性能测试 ===\n');

    const testCases = [
        { size: 1000, desc: '中等数组' },
        { size: 10000, desc: '大数组' },
        { size: 100000, desc: '超大数组' }
    ];

    const methods = [
        { name: '快慢指针法', func: findDuplicate },
        { name: '二分查找法', func: findDuplicateBinarySearch },
        { name: '哈希表法', func: findDuplicateHashSet }
        // 跳过修改数组的方法
    ];

    testCases.forEach(testCase => {
        console.log(`测试: ${testCase.desc} (n=${testCase.size})`);

        // 生成测试数组：[1,2,...,n-1,n-1] (n-1重复)
        const testArray = Array.from({length: testCase.size}, (_, i) => i + 1);
        testArray[testCase.size - 1] = testCase.size - 1; // 让最后一个数重复

        // 打乱数组
        for (let i = testArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [testArray[i], testArray[j]] = [testArray[j], testArray[i]];
        }

        methods.forEach(method => {
            const nums = [...testArray];
            const startTime = performance.now();
            const result = method.func(nums);
            const endTime = performance.now();

            console.log(`${method.name}: ${(endTime - startTime).toFixed(2)}ms (结果: ${result})`);
        });
        console.log('');
    });
}

// 算法演示
function demonstrateAlgorithm() {
    console.log('=== 快慢指针算法演示 ===\n');

    const nums = [1, 3, 4, 2, 2];
    console.log(`演示数组: [${nums.join(',')}]`);
    console.log('将数组看作链表：');
    console.log('索引:  0  1  2  3  4');
    console.log(`数值: [${nums.join(', ')}]`);
    console.log('链表: 0->1->3->2->4->2 (形成环)');

    console.log('\n阶段1：快慢指针找相遇点');

    let slow = nums[0];
    let fast = nums[0];
    let step = 0;

    console.log(`初始: slow=${slow}, fast=${fast}`);

    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
        step++;
        console.log(`步骤${step}: slow=${slow}, fast=${fast}`);
    } while (slow !== fast);

    console.log(`\n相遇点: ${slow}`);

    console.log('\n阶段2：找环的入口');
    slow = nums[0];
    step = 0;

    console.log(`重置slow到起点: slow=${slow}, fast=${fast}`);

    while (slow !== fast) {
        slow = nums[slow];
        fast = nums[fast];
        step++;
        console.log(`步骤${step}: slow=${slow}, fast=${fast}`);
    }

    console.log(`\n环的入口（重复数字）: ${slow}`);

    // 可视化环结构
    console.log('\n环结构可视化：');
    console.log('0 -> 1 -> 3 -> 2 -> 4');
    console.log('          ↑         |');
    console.log('          +---------+');
    console.log('重复数字2指向位置2，形成环');
}

// 二分查找演示
function demonstrateBinarySearch() {
    console.log('=== 二分查找算法演示 ===\n');

    const nums = [1, 3, 4, 2, 2];
    console.log(`演示数组: [${nums.join(',')}]`);
    console.log(`数组长度: ${nums.length}, 值域范围: [1, ${nums.length - 1}]`);

    let left = 1;
    let right = nums.length - 1;
    let iteration = 0;

    while (left < right) {
        iteration++;
        const mid = Math.floor((left + right) / 2);

        // 统计<=mid的数的个数
        let count = 0;
        for (const num of nums) {
            if (num <= mid) {
                count++;
            }
        }

        console.log(`\n迭代${iteration}:`);
        console.log(`  搜索范围: [${left}, ${right}]`);
        console.log(`  中间值: ${mid}`);
        console.log(`  ≤${mid}的数的个数: ${count}`);
        console.log(`  分析: 在${count}个位置放≤${mid}的数，如果count > ${mid}说明有重复`);

        if (count > mid) {
            console.log(`  结论: ${count} > ${mid}，重复数在[${left}, ${mid}]`);
            right = mid;
        } else {
            console.log(`  结论: ${count} ≤ ${mid}，重复数在[${mid + 1}, ${right}]`);
            left = mid + 1;
        }
    }

    console.log(`\n找到重复数字: ${left}`);
}

// 复杂度分析
function complexityAnalysis() {
    console.log('=== 复杂度分析 ===\n');

    const methods = [
        {
            name: '快慢指针法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            meetRequirements: true,
            description: '最优解法，满足所有约束'
        },
        {
            name: '二分查找法',
            timeComplexity: 'O(n log n)',
            spaceComplexity: 'O(1)',
            meetRequirements: true,
            description: '满足约束，但时间复杂度较高'
        },
        {
            name: '哈希表法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(n)',
            meetRequirements: false,
            description: '违反空间约束'
        },
        {
            name: '负标记法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            meetRequirements: false,
            description: '修改原数组，违反只读约束'
        },
        {
            name: '排序法',
            timeComplexity: 'O(n log n)',
            spaceComplexity: 'O(1)',
            meetRequirements: false,
            description: '修改原数组，时间复杂度高'
        }
    ];

    console.log('各方法复杂度对比：');
    console.log('方法\t\t\t时间复杂度\t空间复杂度\t满足约束\t说明');
    console.log('-'.repeat(80));

    methods.forEach(method => {
        const meets = method.meetRequirements ? '✓' : '✗';
        console.log(`${method.name.padEnd(15)}\t${method.timeComplexity.padEnd(12)}\t${method.spaceComplexity}\t\t${meets}\t\t${method.description}`);
    });

    console.log('\n推荐解法：快慢指针法');
    console.log('- 时间复杂度：O(n)');
    console.log('- 空间复杂度：O(1)');
    console.log('- 不修改数组');
    console.log('- 满足所有题目约束');
}

// 面试要点总结
function interviewKeyPoints() {
    console.log('=== 面试要点总结 ===\n');

    console.log('🎯 核心考点：');
    console.log('1. Floyd判圈算法的应用');
    console.log('2. 数组到链表的抽象映射');
    console.log('3. 二分查找在值域上的应用');
    console.log('4. 抽屉原理的理解');

    console.log('\n💡 解题思路：');
    console.log('1. 快慢指针法：数组→链表映射，环检测');
    console.log('2. 二分查找法：利用抽屉原理在值域二分');
    console.log('3. 理解约束条件的重要性');

    console.log('\n🔍 常见陷阱：');
    console.log('1. 误用修改数组的方法');
    console.log('2. 忽略空间复杂度约束');
    console.log('3. 不理解快慢指针的数学原理');
    console.log('4. 二分查找的边界条件处理');

    console.log('\n📈 优化技巧：');
    console.log('1. 快慢指针：理解环检测的数学证明');
    console.log('2. 二分查找：统计计数的优化');
    console.log('3. 边界条件：处理最小数组[1,1]');

    console.log('\n🎪 相关问题：');
    console.log('1. 环形链表检测');
    console.log('2. 缺失数字问题');
    console.log('3. 数组中重复数字的各种变形');
}

// 导出所有方法
module.exports = {
    findDuplicate,
    findDuplicateBinarySearch,
    findDuplicateHashSet,
    findDuplicateNegativeMarking,
    findDuplicateSort,
    runTests,
    performanceTest,
    demonstrateAlgorithm,
    demonstrateBinarySearch,
    complexityAnalysis,
    interviewKeyPoints
};

// 如果直接运行此文件，则执行测试
if (require.main === module) {
    runTests();
    performanceTest();
    demonstrateAlgorithm();
    demonstrateBinarySearch();
    complexityAnalysis();
    interviewKeyPoints();
}