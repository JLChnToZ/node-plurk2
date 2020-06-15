"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request-promise");
var fs_1 = require("fs");
var path_1 = require("path");
var util_1 = require("util");
var readFileAsync = util_1.promisify(fs_1.readFile);
var writeFileAsync = util_1.promisify(fs_1.writeFile);
var API_ENDPOINT = 'https://www.plurk.com/API/2/list';
var WRITE_PATH = path_1.join(__dirname, '../src/api-parameters.ts');
var isTruthy = Boolean;
function mapValues(val) {
    switch (val.trim()) {
        case 'true':
        case 'false':
        case 'null':
            return val;
        case '[]':
            return 'any[]';
        case 'PID':
            return 'number';
        default:
            if (Number.isFinite(Number.parseFloat(val)))
                return val;
            return "'" + escapeUnsaveCharacters(val) + "'";
    }
}
var unsafeCharacters = /[\0\n\f\n\r\t\v\\'"]/mg;
function escapeUnsaveCharacters(str) {
    return str.replace(unsafeCharacters, escapeUnsaveCharactersMap);
}
function escapeUnsaveCharactersMap(src) {
    switch (src) {
        case '\r': return '\\r';
        case '\n': return '\\n';
        case '\b': return '\\b';
        case '\t': return '\\t';
        case '\v': return '\\v';
        case '\0': return '\\0';
        case '\\': return '\\\\';
        case '\'': return '\\\'';
        case '\"': return '\\\"';
    }
    return src;
}
function processOptions(options, defaultValue) {
    if (options)
        return options.split('|').map(mapValues).filter(isTruthy).join(' | ');
    if (!defaultValue)
        return 'any';
    switch (defaultValue.trim()) {
        case 'true':
        case 'false':
            return 'boolean';
        case 'null':
        case 'n/a':
            return 'any';
        default:
            if (Number.isFinite(Number.parseFloat(defaultValue)))
                return 'number';
            return 'string';
    }
}
function toCapitalize(str) {
    return str.length ? str.charAt(0).toUpperCase() + str.substring(1) : str;
}
var colMatcher = /^(\w+)(?:=([^\|:]+(?:\|[^\|:]+)*))?(?:\:(.+))?$/;
function dropOptionsToNamespaces(namespaces, path, data) {
    var e_1, _a;
    var pathIdx = path.indexOf('/');
    if (pathIdx >= 0) {
        var ns = toCapitalize(path.substring(0, pathIdx));
        var child = namespaces.get(ns);
        if (!child) {
            child = new Map();
            namespaces.set(ns, child);
        }
        return ns + "." + dropOptionsToNamespaces(child, path.substring(pathIdx + 1), data);
    }
    else {
        var results = [];
        try {
            for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                var type = data_1_1.value;
                var m = colMatcher.exec(type);
                if (!m) {
                    console.error('WARN: %m does not matches the regexp.', type);
                    continue;
                }
                var _b = __read(m, 4), param = _b[1], options = _b[2], defaultValue = _b[3];
                results.push("" + param + (defaultValue ? '?' : '') + ": " + processOptions(options, defaultValue) + ";");
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        var ns = toCapitalize(path) + "Options";
        namespaces.set(ns, results);
        return ns;
    }
}
function printNamespaces(out, namespaces, indent) {
    var e_2, _a, e_3, _b;
    if (indent === void 0) { indent = ''; }
    var isFirst = true;
    try {
        for (var namespaces_1 = __values(namespaces), namespaces_1_1 = namespaces_1.next(); !namespaces_1_1.done; namespaces_1_1 = namespaces_1.next()) {
            var _c = __read(namespaces_1_1.value, 2), name = _c[0], data = _c[1];
            if (!isFirst)
                out.push('');
            if (Array.isArray(data)) {
                out.push(indent + "export interface " + name + " {");
                try {
                    for (var data_2 = (e_3 = void 0, __values(data)), data_2_1 = data_2.next(); !data_2_1.done; data_2_1 = data_2.next()) {
                        var d = data_2_1.value;
                        out.push(indent + "  " + d);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (data_2_1 && !data_2_1.done && (_b = data_2.return)) _b.call(data_2);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
            else {
                out.push(indent + "export namespace " + name + " {");
                printNamespaces(out, data, indent + '  ');
            }
            out.push(indent + "}");
            isFirst = false;
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (namespaces_1_1 && !namespaces_1_1.done && (_a = namespaces_1.return)) _a.call(namespaces_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
}
function generateAPIMap() {
    return __awaiter(this, void 0, void 0, function () {
        var apiMap, namespaces, packageJson, _a, _b, results, k, path;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, request(API_ENDPOINT, {
                        json: true,
                    })];
                case 1:
                    apiMap = _c.sent();
                    namespaces = new Map();
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, readFileAsync(path_1.join(__dirname, '../package.json'), 'utf8')];
                case 2:
                    packageJson = _b.apply(_a, [_c.sent()]);
                    results = [
                        "// Generate using " + (packageJson === null || packageJson === void 0 ? void 0 : packageJson.name) + ", data from " + API_ENDPOINT,
                        "// Do not edit manually!",
                        '',
                        'export interface APIParameters {',
                        '  [api: string]: [any, any];',
                    ];
                    for (k in apiMap) {
                        if (!(k in apiMap))
                            continue;
                        path = k.replace('/APP/', '');
                        results.push("  '" + escapeUnsaveCharacters(path) + "': [", "    " + dropOptionsToNamespaces(namespaces, path, apiMap[k]) + ",", '    any,', '  ];');
                    }
                    results.push('}', '');
                    printNamespaces(results, namespaces);
                    return [4 /*yield*/, writeFileAsync(WRITE_PATH, results.join('\n') + "\n")];
                case 3:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
generateAPIMap().catch(function (reason) { return console.error(reason.stack || reason); });
