import emojiRegex from 'emoji-regex';

export interface CleanOptions {
    removeEmoji: boolean;
    fixSpacing: boolean;
    normalizeSpaces: boolean;
    trimTrailingSpaces: boolean;
}

const defaultOptions: CleanOptions = {
    removeEmoji: true,
    fixSpacing: true,
    normalizeSpaces: true,
    trimTrailingSpaces: true,
}

/**
 * 清洗单行注释文本
 * @param text 原始注释文本 (包含注释符号，如 "# 你好")
 * @param options 配置选项
 * @returns 清洗后的文本
 */
export function cleanCommentLine(text: string, options: CleanOptions = defaultOptions): string {
    let result = text;

    // 1. 去除 Emoji
    if (options.removeEmoji) {
        const regex = emojiRegex();
        result = result.replace(regex, '');
    }

    // 2. 去除不可见字符 (零宽字符、控制字符等)
    // \u200B-\u200F: 零宽字符范围
    // \uFEFF: BOM 字符
    result = result.replace(/[\u200B-\u200F\uFEFF]/g, '');

    // 3. 修复注释符号后的空格 (# 或 //)
    if (options.fixSpacing) {
        // 处理 # 注释 (排除 #!)
        result = result.replace(/^(\s*#)(?!!)(\S)/, '$1 $2');
        // 处理 // 注释
        result = result.replace(/^(\s*\/\/)(\S)/, '$1 $2');
    }

    // 4. 规范化空格 (多个空格/Tab → 单个空格)
    if (options.normalizeSpaces) {
        // 将 Tab 转换为空格
        result = result.replace(/\t/g, ' ');
        // 将多个连续空格压缩为单个空格 (但保留注释符号后的第一个空格)
        result = result.replace(/(^#+\s+)\s+/, '$1');
        result = result.replace(/(^\/\/+\s+)\s+/, '$1');
        // 通用：注释内容内部的多个空格也压缩
        result = result.replace(/ {2,}/g, ' ');
    }

    // 5. 转换全角空格为半角空格
    result = result.replace(/\u3000/g, ' ');

    // 6. 去除末尾空格
    if (options.trimTrailingSpaces) {
        result = result.trimEnd();
    }

    return result;
}