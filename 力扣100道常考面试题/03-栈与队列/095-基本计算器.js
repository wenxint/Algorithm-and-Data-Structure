/**
 * LeetCode 095: 基本计算器 (Basic Calculator)
 *
 * 题目描述：
 * 给你一个字符串表达式 s ，请你实现一个基本计算器来计算并返回它的值。
 * 注意:不允许使用任何将字符串作为数学表达式计算的内置函数，比如 eval() 。
 *
 * 表达式包含：
 * - 非负整数
 * - 加法运算符 '+'
 * - 减法运算符 '-'
 * - 左括号 '(' 和右括号 ')'
 * - 空格 ' '
 *
 * 示例：
 * 输入：s = "(1+(4+5+2)-3)+(6+8)"
 * 输出：23
 *
 * 核心思想：
 * 栈 + 符号处理 - 使用栈处理括号优先级，维护当前数字和符号状态
 *
 * 算法原理：
 * 1. 栈存储：栈中存储每层括号的计算结果和符号
 * 2. 数字处理：遇到数字时累加构建完整数字
 * 3. 符号处理：遇到 +/- 时更新当前符号状态
 * 4. 括号处理：
 *    - 遇到 '(' 时，将当前结果和符号入栈，重置状态
 *    - 遇到 ')' 时，计算括号内结果，与栈顶元素结合
 * 5. 最终计算：处理完成后返回最终结果
 *
 * 时间复杂度：O(n)
 * 空间复杂度：O(n)
 */

/**
 * 解法一：栈 + 符号处理（推荐）
 *
 * 核心思想：
 * 使用栈来处理括号优先级，维护当前的计算结果和符号状态
 *
 * 算法步骤：
 * 1. 遍历字符串，处理每个字符
 * 2. 遇到数字：累加构建完整数字
 * 3. 遇到 '+' 或 '-'：更新符号状态
 * 4. 遇到 '('：将当前结果和符号入栈，重置状态
 * 5. 遇到 ')'：计算括号内结果，与栈顶元素结合
 *
 * @param {string} s - 待计算的表达式字符串
 * @returns {number} 表达式的计算结果
 * @time O(n) - n 是字符串长度
 * @space O(n) - 栈的空间复杂度
 */
function calculate(s) {
    const stack = [];
    let result = 0;     // 当前层的计算结果
    let number = 0;     // 当前正在构建的数字
    let sign = 1;       // 当前数字的符号，1表示正，-1表示负

    for (let i = 0; i < s.length; i++) {
        const char = s[i];

        if (char >= '0' && char <= '9') {
            // 构建完整的数字（可能是多位数）
            number = number * 10 + parseInt(char);
        } else if (char === '+') {
            // 处理加号：将之前的数字加到结果中，重置数字，设置正号
            result += sign * number;
            number = 0;
            sign = 1;
        } else if (char === '-') {
            // 处理减号：将之前的数字加到结果中，重置数字，设置负号
            result += sign * number;
            number = 0;
            sign = -1;
        } else if (char === '(') {
            // 处理左括号：将当前结果和符号入栈，重置状态
            stack.push(result);
            stack.push(sign);
            result = 0;
            sign = 1;
        } else if (char === ')') {
            // 处理右括号：计算括号内结果，与栈顶元素结合
            result += sign * number;
            number = 0;

            // 从栈中取出上一层的符号和结果
            result *= stack.pop();  // 弹出符号
            result += stack.pop();  // 弹出上一层结果
        }
        // 忽略空格字符
    }

    // 处理最后一个数字
    result += sign * number;
    return result;
}

/**
 * 解法二：递归解析
 *
 * 核心思想：
 * 使用递归处理括号，每遇到括号就递归计算括号内的表达式
 *
 * 算法步骤：
 * 1. 维护一个全局索引指针
 * 2. 遇到左括号时递归计算
 * 3. 遇到右括号时返回当前层结果
 * 4. 处理数字和符号
 *
 * @param {string} s - 待计算的表达式字符串
 * @returns {number} 表达式的计算结果
 * @time O(n) - 每个字符处理一次
 * @space O(n) - 递归栈深度
 */
function calculateRecursive(s) {
    let index = 0;

    function helper() {
        let result = 0;
        let number = 0;
        let sign = 1;

        while (index < s.length) {
            const char = s[index];
            index++;

            if (char >= '0' && char <= '9') {
                number = number * 10 + parseInt(char);
            } else if (char === '+') {
                result += sign * number;
                number = 0;
                sign = 1;
            } else if (char === '-') {
                result += sign * number;
                number = 0;
                sign = -1;
            } else if (char === '(') {
                // 递归计算括号内的表达式
                number = helper();
            } else if (char === ')') {
                // 结束当前层的计算
                break;
            }
        }

        result += sign * number;
        return result;
    }

    return helper();
}

/**
 * 解法三：双栈实现
 *
 * 核心思想：
 * 使用两个栈分别存储数字和运算符，处理运算符优先级
 *
 * 算法步骤：
 * 1. 数字栈存储操作数
 * 2. 符号栈存储运算符和括号
 * 3. 遇到右括号时计算到对应左括号的所有运算
 *
 * @param {string} s - 待计算的表达式字符串
 * @returns {number} 表达式的计算结果
 * @time O(n) - 线性时间复杂度
 * @space O(n) - 两个栈的空间
 */
function calculateTwoStack(s) {
    const nums = [];    // 数字栈
    const ops = [];     // 运算符栈

    // 执行一次运算
    function calc() {
        if (nums.length < 2 || ops.length === 0) return;

        const b = nums.pop();
        const a = nums.pop();
        const op = ops.pop();

        if (op === '+') {
            nums.push(a + b);
        } else if (op === '-') {
            nums.push(a - b);
        }
    }

    for (let i = 0; i < s.length; i++) {
        const char = s[i];

        if (char === ' ') continue;

        if (char >= '0' && char <= '9') {
            // 构建完整数字
            let num = 0;
            while (i < s.length && s[i] >= '0' && s[i] <= '9') {
                num = num * 10 + parseInt(s[i]);
                i++;
            }
            i--; // 回退一位，因为for循环会自动i++
            nums.push(num);
        } else if (char === '(') {
            ops.push(char);
        } else if (char === ')') {
            // 计算到对应的左括号
            while (ops.length && ops[ops.length - 1] !== '(') {
                calc();
            }
            ops.pop(); // 移除左括号
        } else if (char === '+' || char === '-') {
            // 处理同级或更高级的运算符
            while (ops.length && ops[ops.length - 1] !== '(') {
                calc();
            }
            ops.push(char);
        }
    }

    // 处理剩余的运算
    while (ops.length) {
        calc();
    }

    return nums[0];
}

// 测试用例
console.log("=== LeetCode 095: 基本计算器 测试 ===");

const testCases = [
    "1 + 1",
    " 2-1 + 2 ",
    "(1+(4+5+2)-3)+(6+8)",
    "2-(1+2)",
    " (( 2 + 1 ) * 3) ",
    "1-(     -2)",
    "- (3 + (4 + 5))"
];

console.log("\n解法一：栈 + 符号处理");
testCases.forEach((test, index) => {
    const result = calculate(test);
    console.log(`测试 ${index + 1}: "${test}" = ${result}`);
});

console.log("\n解法二：递归解析");
testCases.forEach((test, index) => {
    const result = calculateRecursive(test);
    console.log(`测试 ${index + 1}: "${test}" = ${result}`);
});

console.log("\n解法三：双栈实现");
testCases.forEach((test, index) => {
    const result = calculateTwoStack(test);
    console.log(`测试 ${index + 1}: "${test}" = ${result}`);
});

/**
 * 算法总结：
 *
 * 1. 栈 + 符号处理（推荐）：
 *    - 时间复杂度：O(n)
 *    - 空间复杂度：O(n)
 *    - 优点：代码简洁，易于理解
 *    - 适用：处理括号优先级的表达式计算
 *
 * 2. 递归解析：
 *    - 时间复杂度：O(n)
 *    - 空间复杂度：O(n)
 *    - 优点：自然处理嵌套结构
 *    - 适用：喜欢递归思维的场景
 *
 * 3. 双栈实现：
 *    - 时间复杂度：O(n)
 *    - 空间复杂度：O(n)
 *    - 优点：通用性强，可扩展到更复杂运算
 *    - 适用：需要支持更多运算符的计算器
 *
 * 核心要点：
 * - 正确处理多位数字的构建
 * - 括号优先级的处理
 * - 符号状态的维护
 * - 边界条件的处理
 */