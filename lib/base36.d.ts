/**
 * `base36` is an utility that converts base36 string to or from number.
 */
export declare namespace base36 {
    /**
     * Base36 string to number.
     * @param val Base36 string.
     * @return {number}
     */
    function decode(val: string): number;
    /**
     * Number to base36 string.
     * @param val Number.
     * @return {string}
     */
    function encode(val: number): string;
}
