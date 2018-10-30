"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function buildParams(a) {
    var s = [];
    var add = function (k, v) {
        v = typeof v === 'function' ? v() : v;
        v = v === null ? '' : v === undefined ? '' : v;
        s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
    };
    var bp = function (prefix, obj) {
        var i, len, key;
        if (prefix) {
            if (Array.isArray(obj)) {
                for (i = 0, len = obj.length; i < len; i++) {
                    bp(prefix + '[' + (typeof obj[i] === 'object' && obj[i] ? i : '') + ']', obj[i]);
                }
            }
            else if (String(obj) === '[object Object]') {
                for (key in obj) {
                    bp(prefix + '[' + key + ']', obj[key]);
                }
            }
            else {
                add(prefix, obj);
            }
        }
        else if (Array.isArray(obj)) {
            for (i = 0, len = obj.length; i < len; i++) {
                add(obj[i].name, obj[i].value);
            }
        }
        else {
            for (key in obj) {
                bp(key, obj[key]);
            }
        }
        return s;
    };
    return bp('', a).join('&');
}
exports.buildParams = buildParams;
//# sourceMappingURL=build-params.js.map