/**
 * LeetCode 018: 加一 (Plus One)
 *
 * 题目描述：
 * 给定一个由整数组成的非空数组所表示的非负整数，在该数的基础上加一。
 * 最高位数字存放在数组的首位，数组中每个元素只存储单个数字。
 * 你可以假设除了整数 0 之外，这个整数不会以零开头。
 *
 * 核心思想：
 * 模拟加法运算 - 从最低位开始处理进位，关键是处理连续的9
 *
 * 算法原理：
 * 1. 从数组末尾开始，给最后一位加1
 * 2. 如果当前位小于10，直接返回
 * 3. 如果当前位等于10，设为0并向前进位
 * 4. 如果所有位都是9，需要扩展数组长度
 */

/**
 * 解法一：逐位进位处理法（推荐）
 *
 * 核心思想：
 * 从最低位开始，逐位处理进位
 * 如果当前位加1后小于10，直接返回
 * 如果等于10，设为0继续处理前一位
 * 如果遍历完所有位都需要进位，说明原数全是9
 *
 * @param {number[]} digits - 数字数组
 * @returns {number[]} 加一后的数字数组
 * @time O(n) 最坏情况遍历所有位
 * @space O(1) 原地修改，只在全9时需要O(n)空间
 */
function plusOne(digits) {
    // 从最低位开始处理
    for (let i = digits.length - 1; i >= 0; i--) {
        // 当前位加1
        digits[i]++;

        // 如果当前位小于10，无需进位，直接返回
        if (digits[i] < 10) {
            return digits;
        }

        // 当前位等于10，设为0，继续处理前一位
        digits[i] = 0;
    }

    // 如果循环结束还没返回，说明所有位都是9
    // 需要在最前面添加1，其他位都是0
    return [1, ...digits];
}

/**
 * 解法二：一次遍历优化法
 *
 * 核心思想：
 * 找到最后一个非9的位置，直接加1
 * 该位置后的所有9都变成0
 *
 * @param {number[]} digits - 数字数组
 * @returns {number[]} 加一后的数字数组
 * @time O(n)
 * @space O(1)
 */
function plusOneOptimized(digits) {
    const n = digits.length;

    // 找到最后一个非9的位置
    for (let i = n - 1; i >= 0; i--) {
        if (digits[i] < 9) {
            // 找到了非9的位置，加1后将后面的所有位设为0
            digits[i]++;
            for (let j = i + 1; j < n; j++) {
                digits[j] = 0;
            }
            return digits;
        }
    }

    // 所有位都是9的情况
    const result = new Array(n + 1).fill(0);
    result[0] = 1;
    return result;
}

/**
 * 解法三：递归解法
 *
 * 核心思想：
 * 递归处理进位，从最低位开始
 * 如果当前位需要进位，递归处理前一位
 *
 * @param {number[]} digits - 数字数组
 * @returns {number[]} 加一后的数字数组
 * @time O(n)
 * @space O(n) 递归栈空间
 */
function plusOneRecursive(digits) {
    /**
     * 递归处理指定位置的加一操作
     * @param {number} index - 当前处理的位置
     * @returns {boolean} 是否需要向前进位
     */
    function addOneAtIndex(index) {
        // 边界条件：如果索引越界，需要扩展数组
        if (index < 0) {
            digits.unshift(1);
            return false;
        }

        // 当前位加1
        digits[index]++;

        // 如果当前位小于10，不需要进位
        if (digits[index] < 10) {
            return false;
        }

        // 当前位需要进位
        digits[index] = 0;
        return addOneAtIndex(index - 1);
    }

    addOneAtIndex(digits.length - 1);
    return digits;
}

/**
 * 解法四：数学转换法（仅适用于小数字）
 *
 * 核心思想：
 * 将数组转换为数字，加1后再转回数组
 * 注意：仅适用于不超过JavaScript安全整数范围的数字
 *
 * @param {number[]} digits - 数字数组
 * @returns {number[]} 加一后的数字数组
 * @time O(n)
 * @space O(n)
 */
function plusOneMath(digits) {
    // 转换为数字（注意：可能超出安全整数范围）
    const num = parseInt(digits.join('')) + 1;

    // 转回数组
    return num.toString().split('').map(Number);
}

/**
 * 解法五：BigInt处理法（处理大数）
 *
 * 核心思想：
 * 使用BigInt处理任意大小的数字
 * 避免整数溢出问题
 *
 * @param {number[]} digits - 数字数组
 * @returns {number[]} 加一后的数字数组
 * @time O(n)
 * @space O(n)
 */
function plusOneBigInt(digits) {
    // 转换为BigInt
    const bigNum = BigInt(digits.join('')) + 1n;

    // 转回数组
    return bigNum.toString().split('').map(Number);
}

/**
 * 解法六：字符串操作法
 *
 * 核心思想：
 * 直接在字符串上模拟加法运算
 * 避免数组到数字的转换
 *
 * @param {number[]} digits - 数字数组
 * @returns {number[]} 加一后的数字数组
 * @time O(n)
 * @space O(n)
 */
function plusOneString(digits) {
    let str = digits.join('');
    let carry = 1;
    let result = '';

    // 从右到左处理每一位
    for (let i = str.length - 1; i >= 0; i--) {
        const sum = parseInt(str[i]) + carry;
        result = (sum % 10) + result;
        carry = Math.floor(sum / 10);
    }

    // 如果还有进位，添加到最前面
    if (carry > 0) {
        result = carry + result;
    }

    return result.split('').map(Number);
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 018: 加一 测试 ===\n');

    const testCases = [
        {
            input: [1, 2, 3],
            expected: [1, 2, 4],
            description: '基础用例：无进位'
        },
        {
            input: [4, 3, 2, 1],
            expected: [4, 3, 2, 2],
            description: '多位数无进位'
        },
        {
            input: [9],
            expected: [1, 0],
            description: '单个9的进位'
        },
        {
            input: [9, 9, 9],
            expected: [1, 0, 0, 0],
            description: '全9的进位'
        },
        {
            input: [1, 9, 9],
            expected: [2, 0, 0],
            description: '末尾连续9的进位'
        },
        {
            input: [8, 9, 9, 9],
            expected: [9, 0, 0, 0],
            description: '大部分为9的进位'
        },
        {
            input: [0],
            expected: [1],
            description: '单个0'
        },
        {
            input: [1, 0, 0, 0],
            expected: [1, 0, 0, 1],
            description: '末尾为0'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`输入: [${test.input.join(', ')}]`);

        // 测试所有解法（需要复制数组，因为有些方法会修改原数组）
        const result1 = plusOne([...test.input]);
        const result2 = plusOneOptimized([...test.input]);
        const result3 = plusOneRecursive([...test.input]);
        const result4 = test.input.length <= 15 ? plusOneMath([...test.input]) : null; // 避免大数溢出
        const result5 = plusOneBigInt([...test.input]);
        const result6 = plusOneString([...test.input]);

        console.log(`逐位进位法结果: [${result1.join(', ')}]`);
        console.log(`一次遍历法结果: [${result2.join(', ')}]`);
        console.log(`递归解法结果: [${result3.join(', ')}]`);
        if (result4) console.log(`数学转换法结果: [${result4.join(', ')}]`);
        console.log(`BigInt处理法结果: [${result5.join(', ')}]`);
        console.log(`字符串操作法结果: [${result6.join(', ')}]`);

        // 验证结果
        const results = [result1, result2, result3, result5, result6];
        if (result4) results.push(result4);

        const allCorrect = results.every(result =>
            result.length === test.expected.length &&
            result.every((digit, i) => digit === test.expected[i])
        );

        console.log(`期望结果: [${test.expected.join(', ')}]`);
        console.log(`结果验证: ${allCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log('---');
    });
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能测试 ===');

    // 创建大数组测试
    const sizes = [1000, 5000, 10000];

    sizes.forEach(size => {
        console.log(`\n测试数组大小: ${size}`);

        // 创建全是9的数组（最坏情况）
        const allNines = new Array(size).fill(9);

        // 创建一般情况的数组
        const normalCase = new Array(size).fill(0).map((_, i) => i % 10);
        normalCase[normalCase.length - 1] = 8; // 最后一位不是9

        console.log('\n全9数组测试（最坏情况）:');
        console.time('逐位进位法');
        plusOne([...allNines]);
        console.timeEnd('逐位进位法');

        console.time('一次遍历法');
        plusOneOptimized([...allNines]);
        console.timeEnd('一次遍历法');

        console.time('BigInt处理法');
        plusOneBigInt([...allNines]);
        console.timeEnd('BigInt处理法');

        console.time('字符串操作法');
        plusOneString([...allNines]);
        console.timeEnd('字符串操作法');

        console.log('\n一般情况测试:');
        console.time('逐位进位法');
        plusOne([...normalCase]);
        console.timeEnd('逐位进位法');

        console.time('一次遍历法');
        plusOneOptimized([...normalCase]);
        console.timeEnd('一次遍历法');

        console.time('BigInt处理法');
        plusOneBigInt([...normalCase]);
        console.timeEnd('BigInt处理法');
    });
}

// 算法演示
function algorithmDemo() {
    console.log('\n=== 算法演示 ===');

    const example = [1, 9, 9];
    console.log(`示例数组: [${example.join(', ')}]`);
    console.log('表示数字: 199');
    console.log('加一后应该是: 200');
    console.log('');

    console.log('逐位进位处理过程:');
    let digits = [...example];
    let step = 1;

    console.log(`步骤${step++}: 初始数组 [${digits.join(', ')}]`);

    // 模拟算法执行过程
    for (let i = digits.length - 1; i >= 0; i--) {
        console.log(`步骤${step++}: 处理位置 ${i}，当前值 ${digits[i]}`);
        digits[i]++;
        console.log(`步骤${step++}: 位置 ${i} 加1后为 ${digits[i]}`);

        if (digits[i] < 10) {
            console.log(`步骤${step++}: 位置 ${i} 小于10，无需进位，算法结束`);
            console.log(`最终结果: [${digits.join(', ')}]`);
            return;
        } else {
            console.log(`步骤${step++}: 位置 ${i} 等于10，设为0并准备进位`);
            digits[i] = 0;
            console.log(`步骤${step++}: 位置 ${i} 设为0，当前数组 [${digits.join(', ')}]`);
        }
    }

    console.log(`步骤${step++}: 所有位都需要进位，在前面添加1`);
    digits = [1, ...digits];
    console.log(`最终结果: [${digits.join(', ')}]`);
}

// 边界情况分析
function edgeCaseAnalysis() {
    console.log('\n=== 边界情况分析 ===');

    const edgeCases = [
        {
            case: "单个数字 [5]",
            analysis: "直接加1，结果 [6]",
            handling: "最简单情况，无需特殊处理"
        },
        {
            case: "单个9 [9]",
            analysis: "加1后变成10，需要进位",
            handling: "结果变成 [1, 0]，数组长度增加"
        },
        {
            case: "全是9的数组 [9,9,9]",
            analysis: "所有位都需要进位",
            handling: "结果 [1,0,0,0]，最高位进位，其他位变0"
        },
        {
            case: "末尾连续9 [1,9,9]",
            analysis: "末尾9进位影响前面的9",
            handling: "连锁进位，结果 [2,0,0]"
        },
        {
            case: "包含0的数组 [1,0,0]",
            analysis: "最后一位是0，加1变1",
            handling: "最简单情况，结果 [1,0,1]"
        },
        {
            case: "大数组",
            analysis: "数组长度很大的情况",
            handling: "时间复杂度仍为O(n)，需考虑内存使用"
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

// 复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');

    console.log('1. 逐位进位法（推荐）:');
    console.log('   时间复杂度: O(n) - 最坏情况遍历所有位');
    console.log('   空间复杂度: O(1) - 原地修改，全9时O(n)');
    console.log('   优点: 效率高，逻辑清晰');
    console.log('   缺点: 会修改原数组');
    console.log('');

    console.log('2. 一次遍历优化法:');
    console.log('   时间复杂度: O(n) - 找到非9位置后还需设置后续位');
    console.log('   空间复杂度: O(1) - 原地修改');
    console.log('   优点: 在某些情况下更快');
    console.log('   缺点: 代码稍复杂');
    console.log('');

    console.log('3. 递归解法:');
    console.log('   时间复杂度: O(n) - 每位最多递归一次');
    console.log('   空间复杂度: O(n) - 递归栈深度');
    console.log('   优点: 递归思路清晰');
    console.log('   缺点: 额外栈空间开销');
    console.log('');

    console.log('4. BigInt处理法:');
    console.log('   时间复杂度: O(n) - 字符串转换操作');
    console.log('   空间复杂度: O(n) - 创建新的字符串和数组');
    console.log('   优点: 可处理任意大数，代码简洁');
    console.log('   缺点: 字符串转换开销大');
    console.log('');

    console.log('5. 字符串操作法:');
    console.log('   时间复杂度: O(n) - 逐位处理');
    console.log('   空间复杂度: O(n) - 创建结果字符串');
    console.log('   优点: 不修改原数组');
    console.log('   缺点: 字符串操作开销');
}

// 扩展应用
function extendedApplications() {
    console.log('\n=== 扩展应用 ===');

    console.log('1. 数字运算扩展:');
    console.log('   - 任意数字相加（大整数加法）');
    console.log('   - 数字减一操作');
    console.log('   - 乘以2（左移一位）');
    console.log('   - 除以2（右移一位）');
    console.log('');

    console.log('2. 实际应用场景:');
    console.log('   - 计数器递增（页面访问量等）');
    console.log('   - 版本号递增（软件版本管理）');
    console.log('   - ID生成器（唯一标识符）');
    console.log('   - 序列号处理（订单号等）');
    console.log('');

    console.log('3. 算法扩展:');
    console.log('   - 大整数库实现');
    console.log('   - 任意精度计算');
    console.log('   - 进制转换');
    console.log('   - 数字字符串验证');
}

// 实际应用示例
function practicalExample() {
    console.log('\n=== 实际应用示例 ===');

    // 示例1：版本号递增器
    function incrementVersion(version) {
        const parts = version.split('.').map(Number);
        const result = plusOne(parts);
        return result.join('.');
    }

    // 示例2：计数器类
    class BigCounter {
        constructor(initial = [0]) {
            this.digits = initial;
        }

        increment() {
            this.digits = plusOne([...this.digits]);
            return this;
        }

        getValue() {
            return this.digits.join('');
        }

        reset() {
            this.digits = [0];
            return this;
        }
    }

    // 示例3：序列号生成器
    function createSequenceGenerator(prefix = '', startFrom = [1]) {
        let current = [...startFrom];

        return {
            next() {
                const result = prefix + current.join('');
                current = plusOne([...current]);
                return result;
            },

            peek() {
                return prefix + current.join('');
            },

            reset(newStart = [1]) {
                current = [...newStart];
            }
        };
    }

    console.log('版本号递增示例:');
    console.log(`版本 1.2.3 递增后: ${incrementVersion('1.2.3')}`);
    console.log(`版本 1.9.9 递增后: ${incrementVersion('1.9.9')}`);
    console.log('');

    console.log('大数计数器示例:');
    const counter = new BigCounter([9, 9, 8]);
    console.log(`初始值: ${counter.getValue()}`);
    console.log(`递增后: ${counter.increment().getValue()}`);
    console.log(`再次递增: ${counter.increment().getValue()}`);
    console.log(`再次递增: ${counter.increment().getValue()}`);
    console.log('');

    console.log('序列号生成器示例:');
    const generator = createSequenceGenerator('ORDER-', [9, 9, 9]);
    console.log(`下一个序列号: ${generator.next()}`);
    console.log(`下一个序列号: ${generator.next()}`);
    console.log(`下一个序列号: ${generator.next()}`);
    console.log(`当前待生成: ${generator.peek()}`);
}

// 大数处理展示
function bigNumberDemo() {
    console.log('\n=== 大数处理展示 ===');

    // 创建一个很大的数字（100位全是9）
    const bigNumber = new Array(100).fill(9);
    console.log(`处理100位全9的数字（前10位）: [${bigNumber.slice(0, 10).join(', ')}, ...]`);

    console.time('BigInt处理100位数字');
    const result = plusOneBigInt([...bigNumber]);
    console.timeEnd('BigInt处理100位数字');

    console.log(`结果长度: ${result.length} 位`);
    console.log(`结果前10位: [${result.slice(0, 10).join(', ')}, ...]`);
    console.log(`结果后10位: [..., ${result.slice(-10).join(', ')}]`);

    // 验证结果正确性
    const isCorrect = result[0] === 1 && result.slice(1).every(digit => digit === 0);
    console.log(`结果验证: ${isCorrect ? '✅ 正确' : '❌ 错误'}`);
}

// 运行测试
if (require.main === module) {
    runTests();
    performanceTest();
    algorithmDemo();
    edgeCaseAnalysis();
    complexityAnalysis();
    extendedApplications();
    practicalExample();
    bigNumberDemo();
}