"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * `base36` is an utility that converts base36 string to or from number.
 */
var base36;
(function (base36) {
    /**
     * Base36 string to number.
     * @param val Base36 string.
     * @return {number}
     */
    function decode(val) {
        return parseInt(val, 36);
    }
    base36.decode = decode;
    /**
     * Number to base36 string.
     * @param val Number.
     * @return {string}
     */
    function encode(val) {
        return isNaN(val) ? '' : val.toString(36);
    }
    base36.encode = encode;
})(base36 = exports.base36 || (exports.base36 = {}));
