"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlmatch = void 0;
var base36_1 = require("./base36");
/**
 * `urlmatch` is an utility that extracts an user or a plurk's id from URL.
 */
var urlmatch;
(function (urlmatch) {
    var plurkUrlMatcher = /plurk\.com\/(m\/)?p\/([0-9a-z]+)(\/#)?$/;
    var plurkUserMatcher = /plurk\.com\/(m\/u\/)?([0-9a-zA-Z_]+)(\/#)?$/;
    function plurk(url, decode) {
        var result = plurkUrlMatcher.exec(url);
        if (result) {
            var id = result[2];
            if (id)
                return decode ? base36_1.base36.decode(id) : id;
        }
    }
    urlmatch.plurk = plurk;
    function user(url, decode) {
        var result = plurkUserMatcher.exec(url);
        if (result) {
            var id = result[2];
            if (id)
                return decode ? base36_1.base36.decode(id) : id;
        }
    }
    urlmatch.user = user;
})(urlmatch = exports.urlmatch || (exports.urlmatch = {}));
