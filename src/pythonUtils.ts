import * as vscode from 'vscode';

/**
 * 查找一行代码中注释的起始位置
 * 如果 # 在字符串内，则忽略
 * @param lineText 一行代码的文本
 * @returns 注释开始的字符索引，如果没有注释返回 -1
 */
export function findCommentStartIndex(lineText: string): number {
    let inString = false;
    let stringChar = ''; // 记录是单引号还是双引号

    for (let i = 0; i < lineText.length; i++) {
        const char = lineText[i];
        const prevChar = i > 0 ? lineText[i - 1] : '';

        // 跳过转义字符
        if (prevChar === '\\') {
            continue;
        }

        // 处理引号 (简单处理单行字符串，暂不处理三引号多行情况)
        if (!inString && (char === '"' || char === "'")) {
            inString = true;
            stringChar = char;
        } else if (inString && char === stringChar) {
            inString = false;
            stringChar = '';
        }

        // 发现注释
        if (!inString && char === '#') {
            return i;
        }
    }

    return -1;
}