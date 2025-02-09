
/** Check if a value is a Date
 * @param value
 * @returns
 * true if the value is a Date
 * false otherwise
 */
export const isDate = (value: unknown): value is Date => value instanceof Date;
