/**
 * `limitTo` is an utility namespace that encodes and decodes Plurk limitTo
 * field format to and from array which looks like this: `|1||2|`.
 */
export namespace limitTo {
  const numberMatcher: RegExp = /[0-9]+/g;

  export function parse(src: number[]): number[];
  /**
   * Parses the limitTo format to array
   * @param src Source string.
   * @return {number[] | undefined}
   */
  export function parse(src: string): number[] | undefined;
  export function parse(src: number[] | string): number[] | undefined {
    if(Array.isArray(src)) return src;
    if(typeof src === 'string') {
      const matches = src.match(numberMatcher);
      if(matches) return matches.map(
        (id: string): number => parseInt(id, 10));
    }
  }

  /**
   * Converts array of Plurk IDs to limitTo format.
   * @param src Source array of Plurk IDs.
   * @return {string}
   */
  export function stringify(src: number[]): string {
    return src.length ? `|${src.join('||')}|` : '';
  }
}