/**
 * `urlmatch` is an utility that extracts an user or a plurk's id from URL.
 */
export declare namespace urlmatch {
    /**
     * Extracts plurk id from URL provided.
     * @param url Url to parse.
     * @param decode Should automatic converts base36 id to number?
     * @return {string | undefined}
     */
    function plurk(url: string, decode: false): string | undefined;
    /**
     * Extracts plurk id from URL provided.
     * @param url Url to parse.
     * @param decode Should automatic converts base36 id to number?
     * @return {number | undefined}
     */
    function plurk(url: string, decode: true): number | undefined;
    /**
     * Extracts user id from URL provided.
     * @param url Url to parse.
     * @param decode Should automatic converts base36 id to number?
     * @return {string | undefined}
     */
    function user(url: string, decode: false): string | undefined;
    /**
     * Extracts user id from URL provided.
     * @param url Url to parse.
     * @param decode Should automatic converts base36 id to number?
     * @return {number | undefined}
     */
    function user(url: string, decode: true): number | undefined;
}
