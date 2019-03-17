import { base36 } from "./base36";

/**
 * `urlmatch` is an utility that extracts an user or a plurk's id from URL.
 */
export namespace urlmatch {
  const plurkUrlMatcher: RegExp = /plurk\.com\/(m\/)?p\/([0-9a-z]+)(\/#)?$/;
  const plurkUserMatcher: RegExp = /plurk\.com\/(m\/u\/)?([0-9a-zA-Z_]+)(\/#)?$/;

  /**
   * Extracts plurk id from URL provided.
   * @param url Url to parse.
   * @param decode Should automatic converts base36 id to number?
   * @return {string | undefined}
   */
  export function plurk(url: string, decode: false): string | undefined;
  /**
   * Extracts plurk id from URL provided.
   * @param url Url to parse.
   * @param decode Should automatic converts base36 id to number?
   * @return {number | undefined}
   */
  export function plurk(url: string, decode: true): number | undefined;
  export function plurk(url: string, decode: boolean): string | number | undefined {
    const result: string[] | null = plurkUrlMatcher.exec(url);
    if(result) {
      const id: string = result[2];
      if(id) return decode ? base36.decode(id) : id;
    }
  }

  /**
   * Extracts user id from URL provided.
   * @param url Url to parse.
   * @param decode Should automatic converts base36 id to number?
   * @return {string | undefined}
   */
  export function user(url: string, decode: false): string | undefined;
  /**
   * Extracts user id from URL provided.
   * @param url Url to parse.
   * @param decode Should automatic converts base36 id to number?
   * @return {number | undefined}
   */
  export function user(url: string, decode: true): number | undefined;
  export function user(url: string, decode: boolean): string | number | undefined {
    const result: string[] | null = plurkUserMatcher.exec(url);
    if(result) {
      const id: string = result[2];
      if(id) return decode ? base36.decode(id) : id;
    }
  }
}
