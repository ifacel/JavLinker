/**
 * 番号识别工具
 * 支持常见格式：
 *   SSIS-001 / ABP-123 / MIDV-001   （字母-数字）
 *   T28-123 / START-001             （字母数字-数字）
 *   TOKYO-HOT-N1234 / CARIB-1234    （多段）
 *   1pondo-1234                     （数字字母-数字）
 *   SSIS001                         （字母+数字，无连字符）
 */
const PATTERNS: RegExp[] = [
    /^[A-Z0-9]+(?:-[A-Z0-9]+)+$/, // 含至少一个连字符，如 SSIS-001 / T28-123 / TOKYO-HOT-N1234 / 1PONDO-1234
    /^[A-Z]{2,}\d{2,}$/,          // 无连字符，字母开头，如 SSIS001 / ABP123
]

/**
 * 判断整段文字是否为番号
 * @param {string} text 选中的文字
 * @returns {string | null} 是番号时返回规范化（大写）后的番号，否则返回 null
 */
export function extractJavCode(text: string): string | null {
    if (!text) return null
    // 去掉首尾空白与常见的包裹符号，并归一化连字符两侧的空格
    let t = text
        .trim()
        .replace(/^[\s(（【"'[]+|[\s)）】"'\]。.，,]+$/g, "")
        .replace(/\s*-\s*/g, "-")
    if (!t || t.length < 4 || t.length > 30) return null
    // 必须同时包含字母和数字，且只允许字母、数字、连字符
    if (!/[A-Za-z]/.test(t) || !/\d/.test(t)) return null
    if (!/^[A-Za-z0-9-]+$/.test(t)) return null
    const upper = t.toUpperCase()
    if (!PATTERNS.some(p => p.test(upper))) return null
    return upper
}
