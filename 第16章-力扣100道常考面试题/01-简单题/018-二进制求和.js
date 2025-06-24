/**
 * LeetCode 019: 二进制求和 (Add Binary)
 *
 * 题目描述：
 * 给你两个二进制字符串 a 和 b，以字符串的形式返回它们的和。
 *
 * 核心思想：
 * 模拟二进制加法运算 - 从右到左逐位相加并处理进位
 *
 * 算法原理：
 * 1. 从两个字符串的末尾开始相加
 * 2. 处理进位：0+0=0, 0+1=1, 1+0=1, 1+1=10(进位1)
 * 3. 考虑字符串长度不同的情况
 * 4. 最后处理可能剩余的进位
 */

/**
 * 解法一：双指针逐位相加法（推荐）
 *
 * 核心思想：
 * 使用两个指针分别指向两个字符串的末尾
 * 逐位相加并处理进位，直到两个字符串都处理完
 *
 * @param {string} a - 二进制字符串a
 * @param {string} b - 二进制字符串b
 * @returns {string} 二进制和
 * @time O(max(m,n)) m和n分别是两个字符串的长度
 * @space O(max(m,n)) 结果字符串的长度
 */
function addBinary(a, b) {
    let result = '';
    let carry = 0;  // 进位
    let i = a.length - 1;  // 指针a
    let j = b.length - 1;  // 指针b

    // 当还有位需要处理或还有进位时继续
    while (i >= 0 || j >= 0 || carry > 0) {
        // 获取当前位的数字，如果超出范围则为0
        const digitA = i >= 0 ? parseInt(a[i]) : 0;
        const digitB = j >= 0 ? parseInt(b[j]) : 0;

        // 计算当前位的和
        const sum = digitA + digitB + carry;

        // 当前位的结果（对2取模）
        result = (sum % 2) + result;

        // 更新进位（除以2取整）
        carry = Math.floor(sum / 2);

        // 移动指针
        i--;
        j--;
    }

    return result;
}

/**
 * 解法二：字符串补齐对齐法
 *
 * 核心思想：
 * 将两个字符串补齐到相同长度，然后逐位相加
 * 简化边界条件的处理
 *
 * @param {string} a - 二进制字符串a
 * @param {string} b - 二进制字符串b
 * @returns {string} 二进制和
 * @time O(max(m,n))
 * @space O(max(m,n))
 */
function addBinaryPadded(a, b) {
    // 补齐到相同长度
    const maxLen = Math.max(a.length, b.length);
    a = a.padStart(maxLen, '0');
    b = b.padStart(maxLen, '0');

    let result = '';
    let carry = 0;

    // 从右到左逐位相加
    for (let i = maxLen - 1; i >= 0; i--) {
        const sum = parseInt(a[i]) + parseInt(b[i]) + carry;
        result = (sum % 2) + result;
        carry = Math.floor(sum / 2);
    }

    // 处理最后的进位
    if (carry > 0) {
        result = carry + result;
    }

    return result;
}

/**
 * 解法三：递归解法
 *
 * 核心思想：
 * 递归处理每一位的相加，从最低位开始
 *
 * @param {string} a - 二进制字符串a
 * @param {string} b - 二进制字符串b
 * @returns {string} 二进制和
 * @time O(max(m,n))
 * @space O(max(m,n)) 递归栈深度
 */
function addBinaryRecursive(a, b) {
    /**
     * 递归处理二进制相加
     * @param {number} i - 字符串a的当前位置
     * @param {number} j - 字符串b的当前位置
     * @param {number} carry - 进位
     * @returns {string} 当前位及之后的二进制和
     */
    function helper(i, j, carry) {
        // 递归终止条件
        if (i < 0 && j < 0 && carry === 0) {
            return '';
        }

        // 获取当前位的值
        const digitA = i >= 0 ? parseInt(a[i]) : 0;
        const digitB = j >= 0 ? parseInt(b[j]) : 0;

        // 计算和
        const sum = digitA + digitB + carry;
        const currentDigit = sum % 2;
        const newCarry = Math.floor(sum / 2);

        // 递归处理前面的位
        return helper(i - 1, j - 1, newCarry) + currentDigit;
    }

    return helper(a.length - 1, b.length - 1, 0);
}

/**
 * 解法四：数组操作法
 *
 * 核心思想：
 * 将字符串转换为数字数组进行操作
 * 便于理解和调试
 *
 * @param {string} a - 二进制字符串a
 * @param {string} b - 二进制字符串b
 * @returns {string} 二进制和
 * @time O(max(m,n))
 * @space O(max(m,n))
 */
function addBinaryArray(a, b) {
    const arrA = a.split('').map(Number).reverse();  // 反转便于从低位开始
    const arrB = b.split('').map(Number).reverse();
    const result = [];

    const maxLen = Math.max(arrA.length, arrB.length);
    let carry = 0;

    for (let i = 0; i < maxLen || carry > 0; i++) {
        const digitA = i < arrA.length ? arrA[i] : 0;
        const digitB = i < arrB.length ? arrB[i] : 0;

        const sum = digitA + digitB + carry;
        result.push(sum % 2);
        carry = Math.floor(sum / 2);
    }

    return result.reverse().join('');
}

/**
 * 解法五：内置BigInt法（适用于JavaScript）
 *
 * 核心思想：
 * 利用JavaScript的BigInt处理大整数
 * 将二进制字符串转换为整数相加再转回二进制
 *
 * @param {string} a - 二进制字符串a
 * @param {string} b - 二进制字符串b
 * @returns {string} 二进制和
 * @time O(n) 字符串转换的时间
 * @space O(n) 结果字符串空间
 */
function addBinaryBigInt(a, b) {
    // 将二进制字符串转换为BigInt
    const numA = BigInt('0b' + a);
    const numB = BigInt('0b' + b);

    // 相加
    const sum = numA + numB;

    // 转回二进制字符串（去掉'0b'前缀）
    return sum.toString(2);
}

/**
 * 解法六：位运算模拟法
 *
 * 核心思想：
 * 模拟计算机的位运算加法
 * 使用异或运算和与运算处理
 *
 * @param {string} a - 二进制字符串a
 * @param {string} b - 二进制字符串b
 * @returns {string} 二进制和
 * @time O(max(m,n))
 * @space O(max(m,n))
 */
function addBinaryBitwise(a, b) {
    let result = '';
    let carry = 0;
    let i = a.length - 1;
    let j = b.length - 1;

    while (i >= 0 || j >= 0 || carry) {
        const bitA = i >= 0 ? parseInt(a[i]) : 0;
        const bitB = j >= 0 ? parseInt(b[j]) : 0;

        // 模拟位运算
        const sum = bitA ^ bitB ^ carry;  // 异或得到当前位
        carry = (bitA & bitB) | (carry & (bitA ^ bitB));  // 计算进位

        result = sum + result;
        i--;
        j--;
    }

    return result;
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 019: 二进制求和 测试 ===\n');

    const testCases = [
        {
            a: "11",
            b: "1",
            expected: "100",
            description: '基础用例：3 + 1 = 4'
        },
        {
            a: "1010",
            b: "1011",
            expected: "10101",
            description: '相同长度：10 + 11 = 21'
        },
        {
            a: "0",
            b: "0",
            expected: "0",
            description: '零相加'
        },
        {
            a: "1",
            b: "1",
            expected: "10",
            description: '最简进位：1 + 1 = 2'
        },
        {
            a: "1111",
            b: "1111",
            expected: "11110",
            description: '全1相加：15 + 15 = 30'
        },
        {
            a: "100",
            b: "110010",
            expected: "110110",
            description: '不同长度：4 + 50 = 54'
        },
        {
            a: "1111111",
            b: "1",
            expected: "10000000",
            description: '连续进位：127 + 1 = 128'
        },
        {
            a: "1010101010",
            b: "0101010101",
            expected: "1111111111",
            description: '复杂情况：682 + 341 = 1023'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`输入: "${test.a}" + "${test.b}"`);

        // 测试所有解法
        const result1 = addBinary(test.a, test.b);
        const result2 = addBinaryPadded(test.a, test.b);
        const result3 = addBinaryRecursive(test.a, test.b);
        const result4 = addBinaryArray(test.a, test.b);
        const result5 = addBinaryBigInt(test.a, test.b);
        const result6 = addBinaryBitwise(test.a, test.b);

        console.log(`双指针法结果: "${result1}"`);
        console.log(`字符串补齐法结果: "${result2}"`);
        console.log(`递归解法结果: "${result3}"`);
        console.log(`数组操作法结果: "${result4}"`);
        console.log(`BigInt法结果: "${result5}"`);
        console.log(`位运算法结果: "${result6}"`);

        // 验证结果
        const results = [result1, result2, result3, result4, result5, result6];
        const allCorrect = results.every(result => result === test.expected);
        console.log(`期望结果: "${test.expected}"`);
        console.log(`结果验证: ${allCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log('---');
    });
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能测试 ===');

    // 创建长二进制字符串测试
    const sizes = [1000, 5000, 10000];

    sizes.forEach(size => {
        console.log(`\n测试字符串长度: ${size}`);

        // 创建随机二进制字符串
        const a = Array.from({length: size}, () => Math.random() > 0.5 ? '1' : '0').join('');
        const b = Array.from({length: size}, () => Math.random() > 0.5 ? '1' : '0').join('');

        console.log('\n性能比较:');
        console.time('双指针法');
        addBinary(a, b);
        console.timeEnd('双指针法');

        console.time('字符串补齐法');
        addBinaryPadded(a, b);
        console.timeEnd('字符串补齐法');

        console.time('数组操作法');
        addBinaryArray(a, b);
        console.timeEnd('数组操作法');

        console.time('BigInt法');
        addBinaryBigInt(a, b);
        console.timeEnd('BigInt法');

        console.time('位运算法');
        addBinaryBitwise(a, b);
        console.timeEnd('位运算法');
    });
}

// 算法演示
function algorithmDemo() {
    console.log('\n=== 算法演示 ===');

    const a = "1011";  // 11
    const b = "110";   // 6
    console.log(`示例: "${a}" + "${b}"`);
    console.log(`十进制: ${parseInt(a, 2)} + ${parseInt(b, 2)} = ${parseInt(a, 2) + parseInt(b, 2)}`);
    console.log(`期望结果: "${(parseInt(a, 2) + parseInt(b, 2)).toString(2)}"`);
    console.log('');

    console.log('逐位相加过程演示:');
    let result = '';
    let carry = 0;
    let i = a.length - 1;
    let j = b.length - 1;
    let step = 1;

    console.log('位置:   3 2 1 0');
    console.log(`a:      ${a.split('').join(' ')}`);
    console.log(`b:        ${b.split('').join(' ')}`);
    console.log('-------------------');

    while (i >= 0 || j >= 0 || carry > 0) {
        const digitA = i >= 0 ? parseInt(a[i]) : 0;
        const digitB = j >= 0 ? parseInt(b[j]) : 0;
        const sum = digitA + digitB + carry;
        const currentBit = sum % 2;
        const newCarry = Math.floor(sum / 2);

        console.log(`步骤${step}: 位置${Math.max(i, j)} -> ${digitA} + ${digitB} + ${carry}(进位) = ${sum} -> 结果位${currentBit}, 新进位${newCarry}`);

        result = currentBit + result;
        carry = newCarry;
        i--;
        j--;
        step++;
    }

    console.log(`最终结果: "${result}"`);
    console.log(`验证: ${parseInt(result, 2)} = ${parseInt(a, 2)} + ${parseInt(b, 2)}`);
}

// 边界情况分析
function edgeCaseAnalysis() {
    console.log('\n=== 边界情况分析 ===');

    const edgeCases = [
        {
            case: '空字符串处理',
            analysis: 'JavaScript中不存在空字符串的二进制',
            handling: '题目保证输入非空，无需特殊处理'
        },
        {
            case: '单个字符 "0" + "0"',
            analysis: '最简单的相加，无进位',
            handling: '直接返回 "0"'
        },
        {
            case: '单个字符 "1" + "1"',
            analysis: '最简单的进位情况',
            handling: '结果为 "10"'
        },
        {
            case: '长度差异很大',
            analysis: '一个很长，一个很短',
            handling: '短的字符串前面补0处理'
        },
        {
            case: '连续进位',
            analysis: '"111" + "1" 需要连续进位',
            handling: '逐位处理，进位会传播到最高位'
        },
        {
            case: '大数处理',
            analysis: '超过JavaScript安全整数范围',
            handling: 'BigInt法可以处理任意大小'
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

    console.log('1. 双指针法（推荐）:');
    console.log('   时间复杂度: O(max(m,n)) - 需要处理所有位');
    console.log('   空间复杂度: O(max(m,n)) - 结果字符串长度');
    console.log('   优点: 逻辑清晰，处理边界条件简单');
    console.log('   适用: 通用解法，面试推荐');
    console.log('');

    console.log('2. 字符串补齐法:');
    console.log('   时间复杂度: O(max(m,n)) - 补齐操作 + 遍历');
    console.log('   空间复杂度: O(max(m,n)) - 补齐后的字符串');
    console.log('   优点: 代码简洁，边界处理统一');
    console.log('   缺点: 额外的字符串操作开销');
    console.log('');

    console.log('3. 递归解法:');
    console.log('   时间复杂度: O(max(m,n)) - 每位递归一次');
    console.log('   空间复杂度: O(max(m,n)) - 递归栈深度');
    console.log('   优点: 思路清晰，适合理解');
    console.log('   缺点: 递归开销，可能栈溢出');
    console.log('');

    console.log('4. BigInt法:');
    console.log('   时间复杂度: O(n) - 字符串转换和运算');
    console.log('   空间复杂度: O(n) - 临时BigInt对象');
    console.log('   优点: 代码最简洁，可处理超大数');
    console.log('   缺点: 不展示算法思维，转换开销');
    console.log('');

    console.log('5. 位运算法:');
    console.log('   时间复杂度: O(max(m,n))');
    console.log('   空间复杂度: O(max(m,n))');
    console.log('   优点: 模拟硬件运算，教学价值高');
    console.log('   缺点: 理解难度较大');
}

// 扩展应用
function extendedApplications() {
    console.log('\n=== 扩展应用 ===');

    console.log('1. 数值运算扩展:');
    console.log('   - 二进制减法');
    console.log('   - 二进制乘法');
    console.log('   - 二进制除法');
    console.log('   - 任意进制加法');
    console.log('');

    console.log('2. 计算机科学应用:');
    console.log('   - CPU算术逻辑单元(ALU)设计');
    console.log('   - 大整数运算库');
    console.log('   - 加密算法中的模运算');
    console.log('   - 数字信号处理');
    console.log('');

    console.log('3. 前端应用场景:');
    console.log('   - 权限位运算（用户权限管理）');
    console.log('   - 状态标志位操作');
    console.log('   - 数据压缩算法');
    console.log('   - 游戏中的状态计算');
    console.log('');

    console.log('4. 算法扩展:');
    console.log('   - 多数相加（超过两个数）');
    console.log('   - 带符号数的加法');
    console.log('   - 浮点数的二进制表示');
    console.log('   - 补码运算');
}

// 实际应用示例
function practicalExample() {
    console.log('\n=== 实际应用示例 ===');

    // 示例1：权限系统
    function PermissionSystem() {
        const PERMISSIONS = {
            READ: '001',
            WRITE: '010',
            EXECUTE: '100'
        };

        return {
            // 添加权限
            addPermission(current, newPerm) {
                // 使用二进制或运算添加权限
                const currentInt = parseInt(current, 2);
                const newPermInt = parseInt(PERMISSIONS[newPerm], 2);
                const result = currentInt | newPermInt;
                return result.toString(2).padStart(3, '0');
            },

            // 检查权限
            hasPermission(current, checkPerm) {
                const currentInt = parseInt(current, 2);
                const checkPermInt = parseInt(PERMISSIONS[checkPerm], 2);
                return (currentInt & checkPermInt) !== 0;
            },

            // 权限描述
            describe(permission) {
                const perms = [];
                if (this.hasPermission(permission, 'READ')) perms.push('读取');
                if (this.hasPermission(permission, 'WRITE')) perms.push('写入');
                if (this.hasPermission(permission, 'EXECUTE')) perms.push('执行');
                return perms.join(', ') || '无权限';
            }
        };
    }

    // 示例2：大整数计算器
    class BinaryCalculator {
        add(a, b) {
            return addBinary(a, b);
        }

        subtract(a, b) {
            // 简化的二进制减法（假设a >= b）
            let result = '';
            let borrow = 0;
            let i = a.length - 1;
            let j = b.length - 1;

            while (i >= 0) {
                const digitA = parseInt(a[i]);
                const digitB = j >= 0 ? parseInt(b[j]) : 0;

                let diff = digitA - digitB - borrow;
                if (diff < 0) {
                    diff += 2;
                    borrow = 1;
                } else {
                    borrow = 0;
                }

                result = diff + result;
                i--;
                j--;
            }

            return result.replace(/^0+/, '') || '0';
        }

        multiply(a, b) {
            if (a === '0' || b === '0') return '0';

            let result = '0';
            for (let i = b.length - 1; i >= 0; i--) {
                if (b[i] === '1') {
                    const shifted = a + '0'.repeat(b.length - 1 - i);
                    result = this.add(result, shifted);
                }
            }
            return result;
        }
    }

    console.log('权限系统示例:');
    const permSys = PermissionSystem();
    let userPerm = '000';
    console.log(`初始权限: ${userPerm} (${permSys.describe(userPerm)})`);

    userPerm = permSys.addPermission(userPerm, 'READ');
    console.log(`添加读权限: ${userPerm} (${permSys.describe(userPerm)})`);

    userPerm = permSys.addPermission(userPerm, 'WRITE');
    console.log(`添加写权限: ${userPerm} (${permSys.describe(userPerm)})`);

    console.log(`是否有执行权限: ${permSys.hasPermission(userPerm, 'EXECUTE')}`);
    console.log('');

    console.log('二进制计算器示例:');
    const calc = new BinaryCalculator();
    const binA = '1011';  // 11
    const binB = '110';   // 6

    console.log(`${binA} + ${binB} = ${calc.add(binA, binB)} (${parseInt(binA, 2)} + ${parseInt(binB, 2)} = ${parseInt(calc.add(binA, binB), 2)})`);
    console.log(`${binA} - ${binB} = ${calc.subtract(binA, binB)} (${parseInt(binA, 2)} - ${parseInt(binB, 2)} = ${parseInt(calc.subtract(binA, binB), 2)})`);
    console.log(`${binA} × ${binB} = ${calc.multiply(binA, binB)} (${parseInt(binA, 2)} × ${parseInt(binB, 2)} = ${parseInt(calc.multiply(binA, binB), 2)})`);
}

// 二进制运算原理
function binaryArithmeticPrinciples() {
    console.log('\n=== 二进制运算原理 ===');

    console.log('二进制加法规则:');
    console.log('0 + 0 = 0');
    console.log('0 + 1 = 1');
    console.log('1 + 0 = 1');
    console.log('1 + 1 = 10 (结果位0，进位1)');
    console.log('');

    console.log('进位处理:');
    console.log('当前位 = (digitA + digitB + carry) % 2');
    console.log('新进位 = Math.floor((digitA + digitB + carry) / 2)');
    console.log('');

    console.log('位运算等价:');
    console.log('当前位 = digitA ^ digitB ^ carry  (异或运算)');
    console.log('新进位 = (digitA & digitB) | (carry & (digitA ^ digitB))');
    console.log('');

    console.log('示例验证: 1 + 1 + 1(进位) = 11');
    console.log('数值计算: (1 + 1 + 1) = 3 -> 3%2=1, 3/2=1 -> 结果11');
    console.log('位运算: 1^1^1=1, (1&1)|(1&(1^1))=1|0=1 -> 结果11');
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
    binaryArithmeticPrinciples();
}