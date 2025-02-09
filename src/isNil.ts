
/**
 * Check if a value is null or undefined
 * @param value
 * @returns
 * true if the value is null or undefined
 * false otherwise
 * */
export const isNil: (value: unknown) => value is null | undefined = 
  (value: unknown): value is null | undefined => value === null || value === undefined;
