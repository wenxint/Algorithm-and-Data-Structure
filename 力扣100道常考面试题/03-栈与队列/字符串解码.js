/**
 * LeetCode第394题: 字符串解码
 * 题目要求：
 * 给定一个经过编码的字符串，返回它解码后的字符串。
 * 编码规则为: k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。
 * 你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。
 * 此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k ，例如不会出现像 3a 或 2[4] 的输入。
 * 
 * 示例 1：
 * 输入：s = "3[a]2[bc]"
 * 输出："aaabcbc"
 * 
 * 示例 2：
 * 输入：s = "3[a2[c]]"
 * 输出："accaccacc"
 * 
 * 示例 3：
 * 输入：s = "2[abc]3[cd]ef"
 * 输出："abcabccdcdcdef"
 * 
 * @param {string} s - 包含数字和括号的编码字符串
 * @return {string} - 解码后的字符串
 */
var decodeString = function(s) {
    const numStack = [];      // 存储倍数的栈
    const strStack = [];      // 存储字符串的栈
    let currentStr = '';      // 当前拼接的字符串
    let currentNum = 0;       // 当前倍数

    for (const char of s) {
        if (!isNaN(char)) {
            // 处理多位数情况
            currentNum = currentNum * 10 + parseInt(char);
        } else if (char === '[') {
            // 遇到左括号，将当前状态入栈
            strStack.push(currentStr);
            numStack.push(currentNum);
            currentStr = '';  // 重置当前字符串
            currentNum = 0;   // 重置当前倍数
        } else if (char === ']') {
            // 遇到右括号，出栈并拼接
            const repeatTimes = numStack.pop();
            const prevStr = strStack.pop();
            currentStr = prevStr + currentStr.repeat(repeatTimes);
        } else {
            // 普通字符直接拼接
            currentStr += char;
        }
    }

    return currentStr;
};

/**
 * 使用递归方法解码字符串
 * @param {string} s - 包含数字和括号的编码字符串
 * @return {string} - 解码后的字符串
 */
var decodeStringRecursive = function(s) {
    let index = 0; // 用于跟踪当前处理的字符位置

    const helper = () => {
        let result = '';
        let num = 0;

        while (index < s.length) {
            const char = s[index];

            if (!isNaN(char)) {
                // 处理多位数
                num = num * 10 + parseInt(char);
                index++;
            } else if (char === '[') {
                // 遇到左括号，递归处理内部字符串
                index++;
                const subStr = helper();
                // 将递归返回的子字符串重复num次
                result += subStr.repeat(num);
                num = 0; // 重置计数
            } else if (char === ']') {
                // 遇到右括号，返回当前结果
                index++;
                return result;
            } else {
                // 普通字符直接添加到结果
                result += char;
                index++;
            }
        }

        return result;
    };

    return helper();
};

// 测试用例 - 栈解法
console.log(decodeString("3[a]2[bc]"));      // 预期输出: "aaabcbc"
console.log(decodeString("3[a2[c]]"));       // 预期输出: "accaccacc"
console.log(decodeString("2[abc]3[cd]ef"));  // 预期输出: "abcabccdcdcdef"
console.log(decodeString("abc3[cd]xyz"));    // 预期输出: "abccdcdcdxyz"

// 测试用例 - 递归解法
console.log(decodeStringRecursive("3[a]2[bc]"));      // 预期输出: "aaabcbc"
console.log(decodeStringRecursive("3[a2[c]]"));       // 预期输出: "accaccacc"
console.log(decodeStringRecursive("2[abc]3[cd]ef"));  // 预期输出: "abcabccdcdcdef"
console.log(decodeStringRecursive("abc3[cd]xyz"));    // 预期输出: "abccdcdcdxyz"
console.log(decodeString("3[a]2[bc]"));      // 预期输出: "aaabcbc"
console.log(decodeString("3[a2[c]]"));       // 预期输出: "accaccacc"
console.log(decodeString("2[abc]3[cd]ef"));  // 预期输出: "abcabccdcdcdef"
console.log(decodeString("abc3[cd]xyz"));    // 预期输出: "abccdcdcdxyz"