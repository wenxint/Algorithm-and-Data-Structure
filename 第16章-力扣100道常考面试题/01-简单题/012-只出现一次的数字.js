/**
 * LeetCode 012: 只出现一次的数字 (Single Number)
 *
 * 题目描述：
 * 给你一个非空整数数组 nums，除了某个元素只出现一次以外，其余每个元素均出现两次。
 * 找出那个只出现了一次的元素。
 *
 * 核心思想：
 * 位运算异或 - 相同数字异或为0，任何数与0异或为自身
 *
 * 算法原理：
 * 1. 异或运算的性质：a ⊕ a = 0，a ⊕ 0 = a
 * 2. 异或运算满足交换律和结合律
 * 3. 所有数字异或后，重复的数字都会抵消，只剩下单独的数字
 */

/**
 * 解法一：异或运算法（推荐）
 *
 * 核心思想：
 * 利用异或运算的特性，相同数字异或为0，0与任何数异或为该数本身
 * 所有数字异或后，成对出现的数字会相互抵消，只剩下单独的数字
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 只出现一次的数字
 * @time O(n) 遍历一次数组
 * @space O(1) 只使用常数额外空间
 */
function singleNumber(nums) {
    let result = 0;

    // 将所有数字进行异或运算
    for (const num of nums) {
        result ^= num;
    }

    return result;
}

/**
 * 解法二：异或运算简化版（使用reduce）
 *
 * 核心思想：
 * 与解法一相同，但使用函数式编程的方式实现
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 只出现一次的数字
 * @time O(n) 遍历一次数组
 * @space O(1) 只使用常数额外空间
 */
function singleNumberReduce(nums) {
    return nums.reduce((result, num) => result ^ num, 0);
}

/**
 * 解法三：哈希表法
 *
 * 核心思想：
 * 使用哈希表记录每个数字的出现次数，最后找到出现次数为1的数字
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 只出现一次的数字
 * @time O(n) 遍历数组两次
 * @space O(n) 哈希表存储空间
 */
function singleNumberHashMap(nums) {
    const countMap = new Map();

    // 统计每个数字的出现次数
    for (const num of nums) {
        countMap.set(num, (countMap.get(num) || 0) + 1);
    }

    // 找到出现次数为1的数字
    for (const [num, count] of countMap) {
        if (count === 1) {
            return num;
        }
    }

    return -1; // 题目保证有解，不会执行到这里
}

/**
 * 解法四：集合法
 *
 * 核心思想：
 * 使用Set记录数字，如果数字已存在则删除，最后剩下的就是单独的数字
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 只出现一次的数字
 * @time O(n) 遍历一次数组
 * @space O(n) Set存储空间，最坏情况存储n/2个元素
 */
function singleNumberSet(nums) {
    const numSet = new Set();

    for (const num of nums) {
        if (numSet.has(num)) {
            numSet.delete(num); // 如果已存在，删除（表示配对）
        } else {
            numSet.add(num);    // 如果不存在，添加
        }
    }

    // Set中剩下的唯一元素就是答案
    return numSet.values().next().value;
}

/**
 * 解法五：数学运算法
 *
 * 核心思想：
 * 2 * (所有不重复数字的和) - 所有数字的和 = 单独出现的数字
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 只出现一次的数字
 * @time O(n) 遍历数组和创建Set
 * @space O(n) Set存储不重复数字
 */
function singleNumberMath(nums) {
    const uniqueNumbers = new Set(nums);

    const sumUnique = Array.from(uniqueNumbers).reduce((sum, num) => sum + num, 0);
    const sumTotal = nums.reduce((sum, num) => sum + num, 0);

    return 2 * sumUnique - sumTotal;
}

/**
 * 解法六：位运算统计法（适用于扩展情况）
 *
 * 核心思想：
 * 统计每一位上1的个数，对于当前问题，每位上1的个数应该是奇数
 * 这种方法可以扩展到"其他数字出现k次，只有一个数字出现1次"的情况
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 只出现一次的数字
 * @time O(32n) = O(n) 对每个数字检查32位
 * @space O(1) 只使用常数额外空间
 */
function singleNumberBitCount(nums) {
    let result = 0;

    // 检查32位整数的每一位
    for (let i = 0; i < 32; i++) {
        let bitCount = 0;

        // 统计第i位上1的个数
        for (const num of nums) {
            if ((num >> i) & 1) {
                bitCount++;
            }
        }

        // 如果第i位上1的个数为奇数，说明单独数字在这一位上是1
        if (bitCount % 2 === 1) {
            result |= (1 << i);
        }
    }

    return result;
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 012: 只出现一次的数字 测试 ===\n');

    const testCases = [
        {
            input: [2, 2, 1],
            expected: 1,
            description: '基础用例：1是单独的数字'
        },
        {
            input: [4, 1, 2, 1, 2],
            expected: 4,
            description: '标准用例：4是单独的数字'
        },
        {
            input: [1],
            expected: 1,
            description: '边界用例：只有一个元素'
        },
        {
            input: [0, 1, 0],
            expected: 1,
            description: '包含0的情况'
        },
        {
            input: [-1, -1, -2],
            expected: -2,
            description: '负数测试'
        },
        {
            input: [1000, 999, 1000, 999, 888],
            expected: 888,
            description: '大数测试'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`输入: [${test.input.join(', ')}]`);

        // 测试所有解法
        const result1 = singleNumber([...test.input]);
        const result2 = singleNumberReduce([...test.input]);
        const result3 = singleNumberHashMap([...test.input]);
        const result4 = singleNumberSet([...test.input]);
        const result5 = singleNumberMath([...test.input]);
        const result6 = singleNumberBitCount([...test.input]);

        console.log(`异或运算法结果: ${result1}`);
        console.log(`异或简化版结果: ${result2}`);
        console.log(`哈希表法结果: ${result3}`);
        console.log(`集合法结果: ${result4}`);
        console.log(`数学运算法结果: ${result5}`);
        console.log(`位计数法结果: ${result6}`);

        // 验证结果
        const results = [result1, result2, result3, result4, result5, result6];
        const allCorrect = results.every(result => result === test.expected);
        console.log(`结果验证: ${allCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log('---');
    });
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能测试 ===');

    // 创建大规模测试数据
    const size = 100000;
    const nums = [];

    // 生成成对的数字
    for (let i = 1; i <= size / 2; i++) {
        nums.push(i, i);
    }

    // 添加一个单独的数字
    const singleNum = 999999;
    nums.push(singleNum);

    // 打乱数组
    for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    console.log(`测试数据规模: ${nums.length} 个元素`);
    console.log(`期望结果: ${singleNum}`);

    // 测试各种方法的性能
    console.time('异或运算法');
    const result1 = singleNumber([...nums]);
    console.timeEnd('异或运算法');

    console.time('哈希表法');
    const result2 = singleNumberHashMap([...nums]);
    console.timeEnd('哈希表法');

    console.time('集合法');
    const result3 = singleNumberSet([...nums]);
    console.timeEnd('集合法');

    console.time('数学运算法');
    const result4 = singleNumberMath([...nums]);
    console.timeEnd('数学运算法');

    console.log(`所有方法结果一致: ${result1 === result2 && result2 === result3 && result3 === result4 ? '✅' : '❌'}`);
}

// 位运算详解演示
function bitOperationDemo() {
    console.log('\n=== 位运算异或详解演示 ===');

    const nums = [4, 1, 2, 1, 2];
    console.log(`示例数组: [${nums.join(', ')}]`);
    console.log('');

    console.log('异或运算过程：');
    let result = 0;

    for (let i = 0; i < nums.length; i++) {
        const prevResult = result;
        result ^= nums[i];

        console.log(`步骤 ${i + 1}: ${prevResult} ⊕ ${nums[i]} = ${result}`);
        console.log(`        二进制: ${prevResult.toString(2).padStart(8, '0')} ⊕ ${nums[i].toString(2).padStart(8, '0')} = ${result.toString(2).padStart(8, '0')}`);
    }

    console.log(`\n最终结果: ${result}`);
    console.log('\n异或运算性质：');
    console.log('1. a ⊕ a = 0  (相同数字异或为0)');
    console.log('2. a ⊕ 0 = a  (任何数与0异或为自身)');
    console.log('3. 异或运算满足交换律和结合律');
    console.log('4. 所以: 1⊕1⊕2⊕2⊕4 = (1⊕1)⊕(2⊕2)⊕4 = 0⊕0⊕4 = 4');
}

// 复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');

    console.log('1. 异或运算法（推荐）:');
    console.log('   时间复杂度: O(n) - 遍历数组一次');
    console.log('   空间复杂度: O(1) - 只使用常数额外空间');
    console.log('   优点: 时间和空间效率都最优');
    console.log('');

    console.log('2. 哈希表法:');
    console.log('   时间复杂度: O(n) - 遍历数组两次');
    console.log('   空间复杂度: O(n) - 哈希表存储');
    console.log('   优点: 思路直观，容易理解');
    console.log('');

    console.log('3. 集合法:');
    console.log('   时间复杂度: O(n) - 遍历数组一次');
    console.log('   空间复杂度: O(n/2) - Set最多存储一半元素');
    console.log('   优点: 利用Set的特性，逻辑清晰');
    console.log('');

    console.log('4. 数学运算法:');
    console.log('   时间复杂度: O(n) - 创建Set和计算和');
    console.log('   空间复杂度: O(n) - Set存储不重复元素');
    console.log('   优点: 数学思路巧妙');
    console.log('   缺点: 可能存在整数溢出问题');
    console.log('');

    console.log('5. 位计数法:');
    console.log('   时间复杂度: O(32n) = O(n) - 每个数检查32位');
    console.log('   空间复杂度: O(1) - 只使用常数空间');
    console.log('   优点: 可扩展到更复杂的情况');
    console.log('   缺点: 常数因子较大');
}

// 扩展应用
function extendedApplications() {
    console.log('\n=== 扩展应用 ===');

    console.log('1. 数组中有两个数字只出现一次，其他数字都出现两次');
    console.log('   解法: 先异或所有数字得到两个目标数字的异或结果');
    console.log('   然后根据异或结果中的某一位将数组分成两组');
    console.log('   分别对两组进行异或运算');
    console.log('');

    console.log('2. 数组中有一个数字出现一次，其他数字都出现三次');
    console.log('   解法: 使用状态机或位计数法');
    console.log('   统计每一位上1的个数，模3后的结果构成答案');
    console.log('');

    console.log('3. 前端应用场景:');
    console.log('   - 数据去重和查找唯一值');
    console.log('   - 状态管理中的标志位处理');
    console.log('   - 加密算法中的异或运算');
    console.log('   - 数据校验和完整性检查');
}

// 运行测试
if (require.main === module) {
    runTests();
    performanceTest();
    bitOperationDemo();
    complexityAnalysis();
    extendedApplications();
}