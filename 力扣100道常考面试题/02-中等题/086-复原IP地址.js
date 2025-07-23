/**
 * @description 复原IP地址
 * @param {string} s
 * @return {string[]}
 */
function restoreIpAddresses(s) {
    const result = [];
    const path = [];
    
    // 回溯函数
    const backtrack = (startIndex) => {
        // 终止条件：已经分割出4段IP
        if (path.length === 4) {
            // 如果已经遍历完整个字符串，则加入结果
            if (startIndex === s.length) {
                result.push(path.join('.'));
            }
            return;
        }
        
        // 单层逻辑：尝试截取1-3位数字作为IP段
        for (let i = startIndex; i < s.length; i++) {
            // 截取的字符串
            const str = s.substring(startIndex, i + 1);
            
            // 验证IP段的有效性
            if (isValidIpSegment(str)) {
                path.push(str);
                backtrack(i + 1);
                path.pop(); // 回溯
            } else {
                // 如果当前段无效，后续更长的段也无效，直接break
                break;
            }
        }
    };
    
    // IP段有效性验证函数
    const isValidIpSegment = (str) => {
        // 长度大于1且以0开头的段无效
        if (str.length > 1 && str[0] === '0') {
            return false;
        }
        
        // 转换为数字，判断是否在0-255之间
        const num = parseInt(str);
        return num >= 0 && num <= 255;
    };
    
    backtrack(0);
    return result;
}

// 测试用例
console.log(restoreIpAddresses("25525511135")); // ["255.255.11.135","255.255.111.35"]
console.log(restoreIpAddresses("0000")); // ["0.0.0.0"]
console.log(restoreIpAddresses("101023")); // ["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]