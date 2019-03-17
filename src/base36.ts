/**
 * `base36` is an utility that converts base36 string to or from number.
 */
export namespace base36 {
  /**
   * Base36 string to number.
   * @param val Base36 string.
   * @return {number}
   */
  export function decode(val: string): number {
    return parseInt(val, 36);
  }

  /**
   * Number to base36 string.
   * @param val Number.
   * @return {string}
   */
  export function encode(val: number): string {
    return isNaN(val) ? '' : val.toString(36);
  }
}