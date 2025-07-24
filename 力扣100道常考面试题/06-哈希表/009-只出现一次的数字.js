/**
 * LeetCode 136. 只出现一次的数字
 *
 * 问题描述：
 * 给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。
 * 找出那个只出现了一次的元素。
 *
 * 核心思想：
 * 利用异或运算的性质：
 * 1. 任何数和0异或都等于原数：a ⊕ 0 = a
 * 2. 任何数和自己异或都等于0：a ⊕ a = 0
 * 3. 异或运算满足交换律和结合律
 *
 * 所以对所有数字进行异或，相同的数字会互相抵消，最终剩下的就是只出现一次的数字
 *
 * 示例：
 * 输入：nums = [2,2,1]
 * 输出：1
 *
 * 输入：nums = [4,1,2,1,2]
 * 输出：4
 */

/**
 * 方法一：异或运算（推荐）
 *
 * 核心思想：
 * 利用异或运算的特性，相同数字异或为0，任何数与0异或为自身
 * 对数组中所有数字进行异或运算，最终结果就是只出现一次的数字
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 只出现一次的数字
 * @time O(n) 遍历一次数组
 * @space O(1) 只使用常数额外空间
 */
function singleNumber(nums) {
    console.log("=== 只出现一次的数字（异或运算） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    let result = 0;
    console.log(`初始结果: ${result}`);

    for (let i = 0; i < nums.length; i++) {
        const prevResult = result;
        result ^= nums[i];
        console.log(`第${i + 1}步: ${prevResult} ⊕ ${nums[i]} = ${result}`);
    }

    console.log(`\n最终结果: ${result}`);
    return result;
}

/**
 * 方法二：哈希表统计
 *
 * 核心思想：
 * 使用哈希表统计每个数字的出现次数
 * 然后找到出现次数为1的数字
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 只出现一次的数字
 * @time O(n) 需要两次遍历
 * @space O(n) 哈希表空间
 */
function singleNumberHashMap(nums) {
    console.log("\n=== 只出现一次的数字（哈希表） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    const countMap = new Map();

    // 统计每个数字的出现次数
    console.log("\n统计出现次数:");
    for (const num of nums) {
        const count = countMap.get(num) || 0;
        countMap.set(num, count + 1);
        console.log(`  数字 ${num}: 出现 ${count + 1} 次`);
    }

    // 找到出现次数为1的数字
    console.log("\n查找出现1次的数字:");
    for (const [num, count] of countMap) {
        console.log(`  数字 ${num}: 出现 ${count} 次`);
        if (count === 1) {
            console.log(`  ✅ 找到结果: ${num}`);
            return num;
        }
    }

    return -1; // 不应该到达这里
}

/**
 * 方法三：排序后查找
 *
 * 核心思想：
 * 先对数组排序，然后相邻比较找到不成对的数字
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 只出现一次的数字
 * @time O(n log n) 排序时间复杂度
 * @space O(1) 原地排序
 */
function singleNumberSort(nums) {
    console.log("\n=== 只出现一次的数字（排序） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    // 创建副本并排序
    const sorted = [...nums].sort((a, b) => a - b);
    console.log(`排序后: [${sorted.join(', ')}]`);

    console.log("\n检查相邻元素:");

    // 检查第一个元素
    if (sorted.length === 1 || sorted[0] !== sorted[1]) {
        console.log(`首元素 ${sorted[0]} 是单独的`);
        return sorted[0];
    }

    // 检查中间元素（步长为2）
    for (let i = 1; i < sorted.length - 1; i += 2) {
        console.log(`检查位置 ${i}: ${sorted[i]}`);

        if (sorted[i] !== sorted[i - 1] && sorted[i] !== sorted[i + 1]) {
            console.log(`  ✅ 找到单独元素: ${sorted[i]}`);
            return sorted[i];
        }

        if (sorted[i] !== sorted[i + 1]) {
            console.log(`  ✅ 找到单独元素: ${sorted[i + 1]}`);
            return sorted[i + 1];
        }
    }

    // 检查最后一个元素
    const lastIndex = sorted.length - 1;
    if (sorted[lastIndex] !== sorted[lastIndex - 1]) {
        console.log(`尾元素 ${sorted[lastIndex]} 是单独的`);
        return sorted[lastIndex];
    }

    return -1; // 不应该到达这里
}

/**
 * 方法四：Set集合
 *
 * 核心思想：
 * 遍历数组，如果数字在Set中存在就删除，不存在就添加
 * 最后Set中剩下的就是只出现一次的数字
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 只出现一次的数字
 * @time O(n) 遍历一次数组
 * @space O(n) Set存储空间
 */
function singleNumberSet(nums) {
    console.log("\n=== 只出现一次的数字（Set集合） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    const numSet = new Set();

    console.log("\n处理过程:");
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];

        if (numSet.has(num)) {
            console.log(`  第${i + 1}步: 删除 ${num} (已存在)`);
            numSet.delete(num);
        } else {
            console.log(`  第${i + 1}步: 添加 ${num} (首次出现)`);
            numSet.add(num);
        }

        console.log(`    当前Set: {${[...numSet].join(', ')}}`);
    }

    const result = [...numSet][0];
    console.log(`\n最终结果: ${result}`);
    return result;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 验证结果的正确性
 * @param {number[]} nums - 原始数组
 * @param {number} result - 算法结果
 * @returns {boolean} 是否正确
 */
function validateResult(nums, result) {
    console.log("\n=== 结果验证 ===");
    console.log(`输入数组: [${nums.join(', ')}]`);
    console.log(`算法结果: ${result}`);

    // 统计每个数字的出现次数
    const countMap = new Map();
    for (const num of nums) {
        countMap.set(num, (countMap.get(num) || 0) + 1);
    }

    // 检查结果是否只出现一次
    const resultCount = countMap.get(result) || 0;
    console.log(`结果 ${result} 出现次数: ${resultCount}`);

    if (resultCount !== 1) {
        console.log(`❌ 验证失败：结果出现次数不为1`);
        return false;
    }

    // 检查是否只有一个数字出现1次
    let singleCount = 0;
    for (const [num, count] of countMap) {
        if (count === 1) {
            singleCount++;
        } else if (count !== 2) {
            console.log(`❌ 验证失败：数字 ${num} 出现 ${count} 次（应该是1或2次）`);
            return false;
        }
    }

    if (singleCount !== 1) {
        console.log(`❌ 验证失败：有 ${singleCount} 个数字只出现1次（应该只有1个）`);
        return false;
    }

    console.log(`✅ 验证通过`);
    return true;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    // 生成测试用例
    const generateTestCase = (size) => {
        const result = [Math.floor(Math.random() * 1000)]; // 只出现一次的数字

        for (let i = 0; i < (size - 1) / 2; i++) {
            const num = Math.floor(Math.random() * 1000);
            result.push(num, num); // 添加两次
        }

        // 打乱数组
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }

        return result;
    };

    const testCases = [
        [2, 2, 1],
        [4, 1, 2, 1, 2],
        [1],
        generateTestCase(101),
        generateTestCase(1001),
        generateTestCase(10001)
    ];

    const methods = [
        { name: '异或运算', func: singleNumber },
        { name: 'Set集合', func: singleNumberSet },
        { name: '哈希表', func: singleNumberHashMap },
        { name: '排序查找', func: singleNumberSort }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const testArray = testCases[i];
        console.log(`\n测试用例 ${i + 1}: 数组长度 ${testArray.length}`);
        console.log(`数组: [${testArray.slice(0, 10).join(', ')}${testArray.length > 10 ? '...' : ''}]`);

        const results = [];

        for (const method of methods) {
            const startTime = performance.now();
            const result = method.func([...testArray]);
            const endTime = performance.now();

            results.push(result);
            console.log(`${method.name}: ${result}, 耗时: ${(endTime - startTime).toFixed(3)}ms`);
        }

        // 检查结果一致性
        const allSame = results.every(result => result === results[0]);
        console.log(`所有方法结果一致: ${allSame ? '✅' : '❌'}`);
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
    console.log("只出现一次的数字算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { input: [2, 2, 1], expected: 1 },
        { input: [4, 1, 2, 1, 2], expected: 4 },
        { input: [1], expected: 1 },
        { input: [0, 1, 0], expected: 1 },
        { input: [1, 2, 3, 2, 1], expected: 3 },
        { input: [-1, 0, -1], expected: 0 }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}`);
        console.log(`${"=".repeat(30)}`);

        const { input, expected } = testCase;
        console.log(`输入: [${input.join(', ')}]`);
        console.log(`期望结果: ${expected}`);

        // 测试所有方法
        const methods = [
            { name: "异或运算", func: singleNumber },
            { name: "Set集合", func: singleNumberSet },
            { name: "哈希表", func: singleNumberHashMap },
            { name: "排序查找", func: singleNumberSort }
        ];

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func([...input]);
                results.push(result);

                const isCorrect = result === expected;
                console.log(`结果: ${result}, 期望: ${expected}, 正确: ${isCorrect ? '✅' : '❌'}`);

                // 验证结果
                validateResult(input, result);
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
    console.log("只出现一次的数字算法演示");
    console.log("=".repeat(50));

    console.log("问题核心思想:");
    console.log("1. 利用异或运算的特性：a ⊕ a = 0, a ⊕ 0 = a");
    console.log("2. 异或运算满足交换律和结合律");
    console.log("3. 相同数字异或会相互抵消，最终剩下单独的数字");

    const demoArray = [4, 1, 2, 1, 2];
    console.log(`\n演示数组: [${demoArray.join(', ')}]`);

    console.log("\n异或运算详细过程:");
    let xorResult = 0;
    demoArray.forEach((num, index) => {
        const prev = xorResult;
        xorResult ^= num;
        console.log(`第${index + 1}步: ${prev} ⊕ ${num} = ${xorResult} (二进制: ${prev.toString(2)} ⊕ ${num.toString(2)} = ${xorResult.toString(2)})`);
    });

    console.log("\n算法特点对比:");
    console.log("1. 异或运算: 时间O(n)，空间O(1)，最优解");
    console.log("2. Set集合: 时间O(n)，空间O(n)，直观易懂");
    console.log("3. 哈希表: 时间O(n)，空间O(n)，通用方法");
    console.log("4. 排序查找: 时间O(n log n)，空间O(1)，简单实现");

    console.log("\n详细演示 - 异或运算:");
    const result = singleNumber(demoArray);

    console.log("\n位运算解释:");
    console.log("异或(XOR)运算规则: 0⊕0=0, 0⊕1=1, 1⊕0=1, 1⊕1=0");
    console.log("关键性质: 相同数字异或为0，任何数与0异或为自身");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        singleNumber,
        singleNumberHashMap,
        singleNumberSort,
        singleNumberSet,
        validateResult,
        performanceTest,
        runTests,
        demonstrateAlgorithm
    };
}

// 如果在浏览器环境中，运行演示
if (typeof window !== 'undefined') {
    runTests();
    demonstrateAlgorithm();
}