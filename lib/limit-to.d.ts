/**
 * `limitTo` is an utility namespace that encodes and decodes Plurk limitTo
 * field format to and from array which looks like this: `|1||2|`.
 */
export declare namespace limitTo {
    function parse(src: number[]): number[];
    /**
     * Parses the limitTo format to array
     * @param src Source string.
     * @return {number[] | undefined}
     */
    function parse(src: string): number[] | undefined;
    /**
     * Converts array of Plurk IDs to limitTo format.
     * @param src Source array of Plurk IDs.
     * @return {string}
     */
    function stringify(src: number[]): string;
}
