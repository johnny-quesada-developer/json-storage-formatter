/**
 * Check if a value is a RegExp
 * @param value The value to check
 * @returns true if the value is a RegExp, false otherwise
 * */
const isRegex = (value: unknown): value is RegExp => value instanceof RegExp;

export default isRegex;
