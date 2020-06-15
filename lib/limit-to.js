"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limitTo = void 0;
/**
 * `limitTo` is an utility namespace that encodes and decodes Plurk limitTo
 * field format to and from array which looks like this: `|1||2|`.
 */
var limitTo;
(function (limitTo) {
    var numberMatcher = /[0-9]+/g;
    function parse(src) {
        if (Array.isArray(src))
            return src;
        if (typeof src === 'string') {
            var matches = src.match(numberMatcher);
            if (matches)
                return matches.map(function (id) { return parseInt(id, 10); });
        }
    }
    limitTo.parse = parse;
    /**
     * Converts array of Plurk IDs to limitTo format.
     * @param src Source array of Plurk IDs.
     * @return {string}
     */
    function stringify(src) {
        return src.length ? "|" + src.join('||') + "|" : '';
    }
    limitTo.stringify = stringify;
})(limitTo = exports.limitTo || (exports.limitTo = {}));
