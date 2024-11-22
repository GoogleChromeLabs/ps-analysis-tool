self.AMP_CONFIG = {
  v: '012410292120000',
  type: 'production',
  'allow-doc-opt-in': ['amp-next-page'],
  'allow-url-opt-in': [],
  canary: 0,
  a4aProfilingRate: 0.01,
  doubleclickSraExp: 0.01,
  doubleclickSraReportExcludedBlock: 0.1,
  flexAdSlots: 0.05,
  'flexible-bitrate': 0.1,
  'ios-fixed-no-transfer': 0,
  'story-ad-placements': 0.01,
  'story-disable-animations-first-page': 1,
  'story-load-inactive-outside-viewport': 1,
  'amp-sticky-ad-to-amp-ad-v4': 0,
  'story-video-cache-apply-audio': 0,
  'amp-story-subscriptions': 1,
  'interaction-to-next-paint': 1,
}; /*AMP_CONFIG*/
!(function () {
  function t(t, n) {
    for (var i = 0; i < n.length; i++) {
      var r = n[i];
      (r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        'value' in r && (r.writable = !0),
        Object.defineProperty(t, r.key, r);
    }
  }
  function n(n, i, r) {
    return i && t(n.prototype, i), r && t(n, r), n;
  }
  var i,
    r = (function () {
      function t() {
        this.Rt = new e();
      }
      return (
        (t.prototype.abort = function () {
          if (!this.Rt.Tt && ((this.Rt.Tt = !0), this.Rt.Mt)) {
            var t = {
              type: 'abort',
              bubbles: !1,
              cancelable: !1,
              target: this.Rt,
              currentTarget: this.Rt,
            };
            this.Rt.Mt(t);
          }
        }),
        n(t, [
          {
            key: 'signal',
            get: function () {
              return this.Rt;
            },
          },
        ]),
        t
      );
    })(),
    e = (function () {
      function t() {
        (this.Tt = !1), (this.Mt = null);
      }
      return (
        n(t, [
          {
            key: 'aborted',
            get: function () {
              return this.Tt;
            },
          },
          {
            key: 'onabort',
            get: function () {
              return this.Mt;
            },
            set: function (t) {
              this.Mt = t;
            },
          },
        ]),
        t
      );
    })();
  function u(t, n) {
    for (
      var i = n || 0, r = this.length, e = i >= 0 ? i : Math.max(r + i, 0);
      e < r;
      e++
    ) {
      var u = this[e];
      if (u === t || (t != t && u != u)) return !0;
    }
    return !1;
  }
  function o(t, n) {
    (null == n || n > t.length) && (n = t.length);
    for (var i = 0, r = new Array(n); i < n; i++) r[i] = t[i];
    return r;
  }
  function s(t, n) {
    var i =
      ('undefined' != typeof Symbol && t[Symbol.iterator]) || t['@@iterator'];
    if (i) return (i = i.call(t)).next.bind(i);
    if (
      Array.isArray(t) ||
      (i = (function (t, n) {
        if (t) {
          if ('string' == typeof t) return o(t, n);
          var i = Object.prototype.toString.call(t).slice(8, -1);
          return (
            'Object' === i && t.constructor && (i = t.constructor.name),
            'Map' === i || 'Set' === i
              ? Array.from(t)
              : 'Arguments' === i ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)
              ? o(t, n)
              : void 0
          );
        }
      })(t)) ||
      (n && t && 'number' == typeof t.length)
    ) {
      i && (t = i);
      var r = 0;
      return function () {
        return r >= t.length ? { done: !0 } : { done: !1, value: t[r++] };
      };
    }
    throw new TypeError(
      'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
    );
  }
  function h() {
    return i || (i = Promise.resolve(void 0));
  }
  var a = function () {
    var t = this;
    this.promise = new Promise(function (n, i) {
      (t.resolve = n), (t.reject = i);
    });
  };
  function f(t) {
    return new Promise(function (n) {
      n(t());
    });
  }
  function c(t) {
    var n = Object.getOwnPropertyDescriptor(t, 'message');
    if (null != n && n.writable) return t;
    var i = t.message,
      r = t.stack,
      e = new Error(i);
    for (var u in t) e[u] = t[u];
    return (e.stack = r), e;
  }
  function l(t) {
    for (var n, i = null, r = '', e = s(arguments, !0); !(n = e()).done; ) {
      var u = n.value;
      u instanceof Error && !i ? (i = c(u)) : (r && (r += ' '), (r += u));
    }
    return i ? r && (i.message = r + ': ' + i.message) : (i = new Error(r)), i;
  }
  function v(t) {
    var n, i;
    null === (n = (i = self).__AMP_REPORT_ERROR) ||
      void 0 === n ||
      n.call(i, t);
  }
  function d(t) {
    var n = l.apply(null, arguments);
    setTimeout(function () {
      throw (v(n), n);
    });
  }
  function m(t) {
    var n = l.apply(null, arguments);
    return (n.expected = !0), n;
  }
  function p(t) {
    return (p =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function (t) {
            return typeof t;
          }
        : function (t) {
            return t &&
              'function' == typeof Symbol &&
              t.constructor === Symbol &&
              t !== Symbol.prototype
              ? 'symbol'
              : typeof t;
          })(t);
  }
  var g = Object.prototype,
    b = g.hasOwnProperty,
    y = g.toString;
  function w(t) {
    return '[object Object]' === y.call(t);
  }
  function A(t) {
    var n = Object.create(null);
    return t && Object.assign(n, t), n;
  }
  function x(t, n) {
    return b.call(t, n);
  }
  var E = /^[a-z][a-z0-9._]*-[a-z0-9._-]*$/,
    P = [
      'annotation-xml',
      'color-profile',
      'font-face',
      'font-face-src',
      'font-face-uri',
      'font-face-format',
      'font-face-name',
      'missing-glyph',
    ],
    T = { childList: !0, subtree: !0 };
  function O(t, n) {
    if (!E.test(n) || P.includes(n))
      throw new t('invalid custom element name "'.concat(n, '"'));
  }
  var I = (function () {
      function t(t, n) {
        (this.t = t), (this.Pt = n), (this.Ut = A());
      }
      var n = t.prototype;
      return (
        (n.define = function (t, n, i) {
          this.Pt.define(t, n, i);
          var r = this.Ut,
            e = r[t];
          e && (e.resolve(), delete r[t]);
        }),
        (n.get = function (t) {
          var n = this.Pt.getByName(t);
          if (n) return n.ctor;
        }),
        (n.whenDefined = function (t) {
          var n = this.t;
          if ((n.Promise, O(n.SyntaxError, t), this.Pt.getByName(t)))
            return h();
          var i = this.Ut,
            r = i[t];
          return r || ((r = new a()), (i[t] = r)), r.promise;
        }),
        (n.upgrade = function (t) {
          this.Pt.upgrade(t);
        }),
        t
      );
    })(),
    R = (function () {
      function t(t) {
        (this.t = t),
          (this.Lt = A()),
          (this.Nt = ''),
          (this._t = null),
          (this.Ht = null),
          (this.Dt = [t.document]);
      }
      var n = t.prototype;
      return (
        (n.current = function () {
          var t = this._t;
          return (this._t = null), t;
        }),
        (n.getByName = function (t) {
          var n = this.Lt[t];
          if (n) return n;
        }),
        (n.getByConstructor = function (t) {
          var n = this.Lt;
          for (var i in n) {
            var r = n[i];
            if (r.ctor === t) return r;
          }
        }),
        (n.define = function (t, n, i) {
          var r = this.t,
            e = r.Error,
            u = r.SyntaxError;
          if (i)
            throw new e('Extending native custom elements is not supported');
          if ((O(u, t), this.getByName(t) || this.getByConstructor(n)))
            throw new e('duplicate definition "'.concat(t, '"'));
          (this.Lt[t] = { name: t, ctor: n }), this.Bt(t);
          for (var o, h = s(this.Dt, !0); !(o = h()).done; ) {
            var a = o.value;
            this.upgrade(a, t);
          }
        }),
        (n.upgrade = function (t, n) {
          for (
            var i, r = !!n, e = n || this.Nt, u = s(this.Ft(t, e), !0);
            !(i = u()).done;

          ) {
            var o = i.value;
            r ? this.Jt(o) : this.upgradeSelf(o);
          }
        }),
        (n.upgradeSelf = function (t) {
          var n = this.getByName(t.localName);
          n && this.Gt(t, n);
        }),
        (n.Ft = function (t, n) {
          return n && t.querySelectorAll ? t.querySelectorAll(n) : [];
        }),
        (n.Gt = function (t, n) {
          var i = n.ctor;
          if (!(t instanceof i)) {
            this._t = t;
            try {
              if (new i() !== t)
                throw new this.t.Error(
                  'Constructor illegally returned a different instance.'
                );
            } catch (t) {
              d(t);
            }
          }
        }),
        (n.Jt = function (t) {
          var n = this.getByName(t.localName);
          if (n && (this.Gt(t, n), t.connectedCallback))
            try {
              t.connectedCallback();
            } catch (t) {
              d(t);
            }
        }),
        (n.Wt = function (t) {
          if (t.disconnectedCallback)
            try {
              t.disconnectedCallback();
            } catch (t) {
              d(t);
            }
        }),
        (n.Bt = function (t) {
          var n = this;
          if (this.Nt) this.Nt += ','.concat(t);
          else {
            this.Nt = t;
            var i = new this.t.MutationObserver(function (t) {
              t && n.Zt(t);
            });
            this.Ht = i;
            for (var r, e = s(this.Dt, !0); !(r = e()).done; ) {
              var u = r.value;
              i.observe(u, T);
            }
            !(function (t, n) {
              var i,
                r = t.Document,
                e = t.Element,
                u = t.Node,
                o = t.document,
                s = r.prototype,
                h = e.prototype,
                a = u.prototype,
                f = s.createElement,
                c = s.importNode,
                l = a.appendChild,
                v = a.cloneNode,
                d = a.insertBefore,
                m = a.removeChild,
                p = a.replaceChild;
              (s.createElement = function (t) {
                var i = n.getByName(t);
                return i ? new i.ctor() : f.apply(this, arguments);
              }),
                (s.importNode = function () {
                  var t = c.apply(this, arguments);
                  return t && this === o && (n.upgradeSelf(t), n.upgrade(t)), t;
                }),
                (a.appendChild = function () {
                  var t = l.apply(this, arguments);
                  return n.sync(), t;
                }),
                (a.insertBefore = function () {
                  var t = d.apply(this, arguments);
                  return n.sync(), t;
                }),
                (a.removeChild = function () {
                  var t = m.apply(this, arguments);
                  return n.sync(), t;
                }),
                (a.replaceChild = function () {
                  var t = p.apply(this, arguments);
                  return n.sync(), t;
                }),
                (a.cloneNode = function () {
                  var t = v.apply(this, arguments);
                  return (
                    t.ownerDocument === o && (n.upgradeSelf(t), n.upgrade(t)), t
                  );
                });
              var g = h,
                b = Object.getOwnPropertyDescriptor(g, 'innerHTML');
              if (
                (b ||
                  ((g = Object.getPrototypeOf(t.HTMLElement.prototype)),
                  (b = Object.getOwnPropertyDescriptor(g, 'innerHTML'))),
                null !== (i = b) && void 0 !== i && i.configurable)
              ) {
                var y = b.set;
                (b.set = function (t) {
                  y.call(this, t), n.upgrade(this);
                }),
                  Object.defineProperty(g, 'innerHTML', b);
              }
            })(this.t, this);
          }
        }),
        (n.observe = function (t) {
          this.Dt.push(t), this.Ht && this.Ht.observe(t, T);
        }),
        (n.sync = function () {
          this.Ht && this.Zt(this.Ht.takeRecords());
        }),
        (n.Zt = function (t) {
          for (var n, i = s(t, !0); !(n = i()).done; ) {
            var r = n.value;
            if (r) {
              for (
                var e, u = r.addedNodes, o = r.removedNodes, h = s(u, !0);
                !(e = h()).done;

              ) {
                var a = e.value,
                  f = this.Ft(a, this.Nt);
                this.Jt(a);
                for (var c, l = s(f, !0); !(c = l()).done; ) {
                  var v = c.value;
                  this.Jt(v);
                }
              }
              for (var d, m = s(o, !0); !(d = m()).done; ) {
                var p = d.value,
                  g = this.Ft(p, this.Nt);
                this.Wt(p);
                for (var b, y = s(g, !0); !(b = y()).done; ) {
                  var w = b.value;
                  this.Wt(w);
                }
              }
            }
          }
        }),
        t
      );
    })();
  function S(t, n) {
    (n.prototype = Object.create(t.prototype, {
      constructor: { configurable: !0, writable: !0, value: n },
    })),
      _(n, t);
  }
  function _(t, n) {
    Object.setPrototypeOf
      ? Object.setPrototypeOf(t, n)
      : { __proto__: { test: !0 } }.test
      ? (t.__proto__ = n)
      : (function (t, n) {
          for (var i = n; null !== i && !Object.isPrototypeOf.call(i, t); ) {
            for (
              var r, e = s(Object.getOwnPropertyNames(i), !0);
              !(r = e()).done;

            ) {
              var u = r.value;
              if (!Object.hasOwnProperty.call(t, u)) {
                var o = Object.getOwnPropertyDescriptor(i, u);
                Object.defineProperty(t, u, o);
              }
            }
            i = Object.getPrototypeOf(i);
          }
        })(t, n);
  }
  function M(t) {
    return t == this || this.documentElement.contains(t);
  }
  function k(t, n, i) {
    return (
      n in t
        ? Object.defineProperty(t, n, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[n] = i),
      t
    );
  }
  function C(t, n) {
    var i = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(t);
      n &&
        (r = r.filter(function (n) {
          return Object.getOwnPropertyDescriptor(t, n).enumerable;
        })),
        i.push.apply(i, r);
    }
    return i;
  }
  function N(t) {
    for (var n = 1; n < arguments.length; n++) {
      var i = null != arguments[n] ? arguments[n] : {};
      n % 2
        ? C(Object(i), !0).forEach(function (n) {
            k(t, n, i[n]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(i))
        : C(Object(i)).forEach(function (n) {
            Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(i, n));
          });
    }
    return t;
  }
  function j(t, n) {
    return (j =
      Object.setPrototypeOf ||
      function (t, n) {
        return (t.__proto__ = n), t;
      })(t, n);
  }
  function D(t, n) {
    if ('function' != typeof n && null !== n)
      throw new TypeError('Super expression must either be null or a function');
    (t.prototype = Object.create(n && n.prototype, {
      constructor: { value: t, writable: !0, configurable: !0 },
    })),
      n && j(t, n);
  }
  function L(t) {
    return (L = Object.setPrototypeOf
      ? Object.getPrototypeOf
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t);
        })(t);
  }
  function U(t, n) {
    if (n && ('object' === p(n) || 'function' == typeof n)) return n;
    if (void 0 !== n)
      throw new TypeError(
        'Derived constructors may only return object or undefined'
      );
    return (function (t) {
      if (void 0 === t)
        throw new ReferenceError(
          "this hasn't been initialised - super() hasn't been called"
        );
      return t;
    })(t);
  }
  function z(t) {
    var n = (function () {
      if ('undefined' == typeof Reflect || !Reflect.construct) return !1;
      if (Reflect.construct.sham) return !1;
      if ('function' == typeof Proxy) return !0;
      try {
        return (
          Boolean.prototype.valueOf.call(
            Reflect.construct(Boolean, [], function () {})
          ),
          !0
        );
      } catch (t) {
        return !1;
      }
    })();
    return function () {
      var i,
        r = L(t);
      if (n) {
        var e = L(this).constructor;
        i = Reflect.construct(r, arguments, e);
      } else i = r.apply(this, arguments);
      return U(this, i);
    };
  }
  function H(t) {
    return t ? Array.prototype.slice.call(t) : [];
  }
  var G = Array.isArray;
  function V(t) {
    return G(t) ? t : [t];
  }
  function F(t, n) {
    for (var i = [], r = 0, e = 0; e < t.length; e++) {
      var u = t[e];
      n(u, e, t) ? i.push(u) : (r < e && (t[r] = u), r++);
    }
    return r < t.length && (t.length = r), i;
  }
  function B(t, n) {
    var i = t.indexOf(n);
    return -1 != i && (t.splice(i, 1), !0);
  }
  function q(t) {
    return 'string' == typeof t;
  }
  function W(t) {
    return 1 == (null == t ? void 0 : t.nodeType);
  }
  function $(t) {
    return 'number' == typeof t && isFinite(t);
  }
  var Y = '​​​',
    K = '​​​​';
  function X(t) {
    return W(t) ? t.tagName.toLowerCase() + (t.id ? '#'.concat(t.id) : '') : t;
  }
  function J(t) {
    return t.indexOf(Y) >= 0;
  }
  function Q(t, n) {
    var i,
      r,
      e =
        arguments.length > 2 && void 0 !== arguments[2]
          ? arguments[2]
          : 'Assertion failed';
    if (n) return n;
    t && -1 == e.indexOf(t) && (e += t);
    for (var u = 3, o = e.split('%s'), s = o.shift(), h = [s]; o.length; ) {
      var a = arguments[u++],
        f = o.shift();
      (s += X(a) + f), h.push(a, f.trim());
    }
    var c = new Error(s);
    throw (
      ((c.messageArray = F(h, function (t) {
        return '' !== t;
      })),
      null === (i = (r = self).__AMP_REPORT_ERROR) ||
        void 0 === i ||
        i.call(r, c),
      c)
    );
  }
  function Z(t, n, i, r, e) {
    return G(e) ? t(i, e.concat([n])) : t(i, ''.concat(e || r, ': %s'), n), n;
  }
  function tt(t, n, i, r, e, u, o, s, h, a, f) {
    return t;
  }
  function nt(t, n) {
    return t;
  }
  function it(t, n) {
    return t;
  }
  function rt(t, n) {
    return t;
  }
  function et(t, n, i, r, e, u, o, s, h, a, f) {
    return Q(Y, t, n, i, r, e, u, o, s, h, a, f);
  }
  function ut(t) {
    return JSON.parse(t);
  }
  function ot(t, n) {
    try {
      return ut(t);
    } catch (t) {
      return null == n || n(t), null;
    }
  }
  function st(t, n) {
    var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 5;
    if (!isFinite(i) || i < 0) throw new Error('Invalid depth: ' + i);
    if (t === n) return !0;
    for (var r = [{ a: t, b: n, depth: i }]; r.length > 0; ) {
      var e = r.shift(),
        u = e.a,
        o = e.b,
        s = e.depth;
      if (s > 0) {
        if (p(u) !== p(o)) return !1;
        if (G(u) && G(o)) {
          if (u.length !== o.length) return !1;
          for (var h = 0; h < u.length; h++)
            r.push({ a: u[h], b: o[h], depth: s - 1 });
          continue;
        }
        if (u && o && 'object' === p(u) && 'object' === p(o)) {
          var a = Object.keys(u),
            f = Object.keys(o);
          if (a.length !== f.length) return !1;
          for (var c = 0, l = a; c < l.length; c++) {
            var v = l[c];
            r.push({ a: u[v], b: o[v], depth: s - 1 });
          }
          continue;
        }
      }
      if (u !== o) return !1;
    }
    return !0;
  }
  function ht(t) {
    return 'undefined' != typeof TextEncoder
      ? new TextEncoder().encode(t)
      : at(unescape(encodeURIComponent(t)));
  }
  function at(t) {
    for (var n = new Uint8Array(t.length), i = 0; i < t.length; i++) {
      var r = t.charCodeAt(i);
      tt(r <= 255), (n[i] = r);
    }
    return n;
  }
  function ft(t, n) {
    var i = t.crypto;
    if (!(i = i || t.msCrypto) || !i.getRandomValues) return null;
    var r = new Uint8Array(n);
    return i.getRandomValues(r), r;
  }
  function ct(t) {
    var n = !1,
      i = null,
      r = t;
    return function () {
      if (!n) {
        for (var t = arguments.length, e = new Array(t), u = 0; u < t; u++)
          e[u] = arguments[u];
        (i = r.apply(self, e)), (n = !0), (r = null);
      }
      return i;
    };
  }
  function lt(t, n, i) {
    var r = 0,
      e = null;
    function u(u) {
      (e = null), (r = t.setTimeout(o, i)), n.apply(null, u);
    }
    function o() {
      (r = 0), e && u(e);
    }
    return function () {
      for (var t = arguments.length, n = new Array(t), i = 0; i < t; i++)
        n[i] = arguments[i];
      r ? (e = n) : u(n);
    };
  }
  function vt(t, n, i) {
    var r = 0,
      e = 0,
      u = null;
    function o() {
      r = 0;
      var s,
        h = i - (t.Date.now() - e);
      h > 0
        ? (r = t.setTimeout(o, h))
        : ((s = u), (u = null), n.apply(null, s));
    }
    return function () {
      e = t.Date.now();
      for (var n = arguments.length, s = new Array(n), h = 0; h < n; h++)
        s[h] = arguments[h];
      (u = s), r || (r = t.setTimeout(o, i));
    };
  }
  var dt = ['javascript:', 'data:', 'vbscript:'],
    mt = /(?:^[#?]?|&)([^=&]+)(?:=([^&]*))?/g;
  function pt(t) {
    var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : '';
    try {
      return decodeURIComponent(t);
    } catch (t) {
      return n;
    }
  }
  function gt(t) {
    var n,
      i = A();
    if (!t) return i;
    for (; (n = mt.exec(t)); ) {
      var r = pt(n[1], n[1]),
        e = n[2] ? pt(n[2].replace(/\+/g, ' '), n[2]) : '';
      i[r] = e;
    }
    return i;
  }
  function bt(t) {
    var n = (t || self).location;
    return gt(n.originalHash || n.hash);
  }
  var yt = function (t) {
      return self.AMP_CONFIG ? self.AMP_CONFIG[t] : null;
    },
    wt =
      ('string' == typeof yt('cdnProxyRegex')
        ? new RegExp(yt('cdnProxyRegex'))
        : yt('cdnProxyRegex')) ||
      /^https:\/\/([a-zA-Z0-9_-]+\.)?cdn\.ampproject\.org$/;
  function At(t) {
    if (!self.document || !self.document.head) return null;
    if (self.location && wt.test(self.location.origin)) return null;
    var n = self.document.head.querySelector('meta[name="'.concat(t, '"]'));
    return (n && n.getAttribute('content')) || null;
  }
  var xt = yt('thirdPartyUrl') || 'https://3p.ampproject.net',
    Et = yt('thirdPartyFrameHost') || 'ampproject.net',
    Pt =
      ('string' == typeof yt('thirdPartyFrameRegex')
        ? new RegExp(yt('thirdPartyFrameRegex'))
        : yt('thirdPartyFrameRegex')) || /^d-\d+\.ampproject\.net$/,
    Tt = yt('cdnUrl') || At('runtime-host') || 'https://cdn.ampproject.org',
    Ot = /^https?:\/\/localhost(:\d+)?$/,
    It =
      yt('errorReportingUrl') ||
      'https://us-central1-amp-error-reporting.cloudfunctions.net/r',
    Rt =
      yt('betaErrorReportingUrl') ||
      'https://us-central1-amp-error-reporting.cloudfunctions.net/r-beta',
    St = yt('localDev') || !1,
    _t = [
      /(^|\.)google\.(com?|[a-z]{2}|com?\.[a-z]{2}|cat)$/,
      /(^|\.)gmail\.(com|dev)$/,
    ],
    Mt = yt('geoApiUrl') || At('amp-geo-api'),
    kt = '';
  function Ct(t) {
    var n = t || self;
    return n.__AMP_MODE
      ? n.__AMP_MODE
      : (n.__AMP_MODE = (function (t) {
          return {
            localDev: !1,
            development: jt(t, bt(t)),
            esm: !1,
            test: !1,
            rtvVersion: Nt(t),
            ssrReady: !1,
          };
        })(n));
  }
  function Nt(t) {
    var n;
    return (
      kt ||
        (kt =
          (null === (n = t.AMP_CONFIG) || void 0 === n ? void 0 : n.v) ||
          '01'.concat('2410292120000')),
      kt
    );
  }
  function jt(t, n) {
    var i = n || bt(t);
    return (
      ['1', 'actions', 'amp', 'amp4ads', 'amp4email'].includes(i.development) ||
      !!t.AMP_DEV_MODE
    );
  }
  var Dt = function () {},
    Lt = void 0;
  function Ut(t) {
    Lt = t;
  }
  var zt = function () {
      return '01'.concat('2410292120000');
    },
    Ht = function (t, n) {
      return n.reduce(function (t, n) {
        return ''.concat(t, '&s[]=').concat(Vt(n));
      }, 'https://log.amp.dev/?v='
        .concat(zt(), '&id=')
        .concat(encodeURIComponent(t)));
    },
    Gt = function () {
      return ''.concat(Tt, '/rtv/').concat(zt(), '/log-messages.simple.json');
    },
    Vt = function (t) {
      return encodeURIComponent(String(X(t)));
    },
    Ft = function (t) {
      return parseInt(bt(t).log, 10);
    },
    Bt = (function () {
      function t(t, n) {
        var i = this,
          r =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : '';
        (this.win = t),
          (this.tt = n),
          (this.nt = this.rt()),
          (this.it = r),
          (this.et = null),
          (this.ft = ct(function () {
            t.fetch(Gt())
              .then(function (t) {
                return t.json();
              }, Dt)
              .then(function (t) {
                t && (i.et = t);
              });
          })),
          (this.ot = this.assert.bind(this));
      }
      var n = t.prototype;
      return (
        (n.rt = function () {
          var t,
            n = this.win;
          return null !== (t = n.console) && void 0 !== t && t.log && 0 != Ft(n)
            ? this.ut()
            : 0;
        }),
        (n.ut = function (t) {
          return this.tt(Ft(t), Ct().development);
        }),
        (n.st = function (t, n, i) {
          var r, e, u;
          if (n > (null !== (r = Lt) && void 0 !== r ? r : this.nt)) return !1;
          var o = this.win.console,
            s =
              null !==
                (e = ((u = {}),
                k(u, 1, o.error),
                k(u, 3, o.info),
                k(u, 2, o.warn),
                u)[n]) && void 0 !== e
                ? e
                : o.log,
            h = this.ct(i),
            a = '['.concat(t, ']');
          return (
            q(h[0]) ? (h[0] = a + ' ' + h[0]) : h.unshift(a), s.apply(o, h), !0
          );
        }),
        (n.fine = function (t) {
          for (
            var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1;
            r < n;
            r++
          )
            i[r - 1] = arguments[r];
          this.st(t, 4, i);
        }),
        (n.info = function (t) {
          for (
            var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1;
            r < n;
            r++
          )
            i[r - 1] = arguments[r];
          this.st(t, 3, i);
        }),
        (n.warn = function (t) {
          for (
            var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1;
            r < n;
            r++
          )
            i[r - 1] = arguments[r];
          this.st(t, 2, i);
        }),
        (n.error = function (t) {
          for (
            var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1;
            r < n;
            r++
          )
            i[r - 1] = arguments[r];
          if (!this.st(t, 1, i)) {
            var e,
              u,
              o = this.createError.apply(this, i);
            (o.name = t || o.name),
              null === (e = (u = self).__AMP_REPORT_ERROR) ||
                void 0 === e ||
                e.call(u, o);
          }
        }),
        (n.expectedError = function (t) {
          for (
            var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1;
            r < n;
            r++
          )
            i[r - 1] = arguments[r];
          var e, u;
          this.st(t, 1, i) ||
            null === (e = (u = self).__AMP_REPORT_ERROR) ||
            void 0 === e ||
            e.call(u, this.createExpectedError.apply(this, i));
        }),
        (n.createError = function (t) {
          return this.ht(l.apply(null, arguments));
        }),
        (n.createExpectedError = function (t) {
          return this.ht(m.apply(null, arguments));
        }),
        (n.ht = function (t) {
          return (
            (t = c(t)),
            this.it
              ? t.message
                ? -1 == t.message.indexOf(this.it) && (t.message += this.it)
                : (t.message = this.it)
              : J(t.message) && (t.message = t.message.replace(Y, '')),
            t
          );
        }),
        (n.ct = function (t) {
          return G(t[0]) ? this.lt(t[0]) : t;
        }),
        (n.lt = function (t) {
          var n,
            i = t.shift();
          return (
            Ct(this.win).development && this.ft(),
            null !== (n = this.et) && void 0 !== n && n[i]
              ? [this.et[i]].concat(t)
              : ['More info at '.concat(Ht(i, t))]
          );
        }),
        (n.assert = function (t, n, i) {
          return G(n)
            ? this.assert.apply(this, [t].concat(this.lt(n)))
            : Q.apply(
                null,
                [this.it].concat(Array.prototype.slice.call(arguments))
              );
        }),
        (n.assertElement = function (t, n) {
          return (function (t, n, i) {
            return Z(t, n, W(n), 'Element expected', i);
          })(this.ot, t, n);
        }),
        (n.assertString = function (t, n) {
          return (function (t, n, i) {
            return Z(t, n, q(n), 'String expected', i);
          })(this.ot, t, n);
        }),
        (n.assertNumber = function (t, n) {
          return (function (t, n, i) {
            return Z(t, n, 'number' == typeof n, 'Number expected', i);
          })(this.ot, t, n);
        }),
        (n.assertArray = function (t, n) {
          return (function (t, n, i) {
            return Z(t, n, G(n), 'Array expected', i);
          })(this.ot, t, n);
        }),
        (n.assertBoolean = function (t, n) {
          return (function (t, n, i) {
            return Z(t, n, !!n === n, 'Boolean expected', i);
          })(this.ot, t, n);
        }),
        t
      );
    })();
  self.__AMP_LOG = self.__AMP_LOG || {
    user: null,
    dev: null,
    userForEmbed: null,
  };
  var qt = self.__AMP_LOG,
    Wt = null;
  function $t(t, n) {
    if (!Wt) throw new Error('failed to call initLogConstructor');
    return new Wt(self, t, n);
  }
  function Yt(t) {
    return (
      qt.user || (qt.user = Kt(Y)),
      (function (t, n) {
        return n && n.ownerDocument.defaultView != t;
      })(qt.user.win, t)
        ? qt.userForEmbed || (qt.userForEmbed = Kt(K))
        : qt.user
    );
  }
  function Kt(t) {
    return $t(function (t, n) {
      return n || t >= 1 ? 4 : 2;
    }, t);
  }
  function Xt() {
    return (
      qt.dev ||
      (qt.dev = $t(function (t) {
        return t >= 3 ? 4 : t >= 2 ? 3 : 0;
      }))
    );
  }
  function Jt(t, n, i, r, e, u, o, s, h, a, f) {
    return t;
  }
  function Qt(t, n, i, r, e, u, o, s, h, a, f) {
    return Yt().assert(t, n, i, r, e, u, o, s, h, a, f);
  }
  var Zt = ['GET', 'POST'];
  function tn(t, n) {
    var i = new XMLHttpRequest();
    if (!('withCredentials' in i))
      throw Xt().createExpectedError('CORS is not supported');
    return i.open(t, n, !0), i;
  }
  var nn = (function () {
    function t(t) {
      (this.$t = t),
        (this.status = this.$t.status),
        (this.statusText = this.$t.statusText),
        (this.ok = this.status >= 200 && this.status < 300),
        (this.headers = new en(t)),
        (this.bodyUsed = !1),
        (this.body = null),
        (this.url = t.responseURL);
    }
    var n = t.prototype;
    return (
      (n.clone = function () {
        return tt(!this.bodyUsed), new t(this.$t);
      }),
      (n.Xt = function () {
        return (
          tt(!this.bodyUsed),
          (this.bodyUsed = !0),
          Promise.resolve(this.$t.responseText)
        );
      }),
      (n.text = function () {
        return this.Xt();
      }),
      (n.json = function () {
        return this.Xt().then(ut);
      }),
      (n.arrayBuffer = function () {
        return this.Xt().then(ht);
      }),
      t
    );
  })();
  function rn(t) {
    return void 0 === t
      ? 'GET'
      : ((t = t.toUpperCase()), tt(Zt.includes(t)), t);
  }
  var en = (function () {
      function t(t) {
        this.$t = t;
      }
      var n = t.prototype;
      return (
        (n.get = function (t) {
          return this.$t.getResponseHeader(t);
        }),
        (n.has = function (t) {
          return null != this.$t.getResponseHeader(t);
        }),
        t
      );
    })(),
    un = (function (t) {
      D(i, t);
      var n = z(i);
      function i(t) {
        var i =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          r = A(),
          e = N(
            {
              status: 200,
              statusText: 'OK',
              responseText: t ? String(t) : '',
              getResponseHeader: function (t) {
                var n = String(t).toLowerCase();
                return x(r, n) ? r[n] : null;
              },
            },
            i
          );
        if (
          ((e.status = void 0 === i.status ? 200 : parseInt(i.status, 10)),
          G(i.headers))
        )
          i.headers.forEach(function (t) {
            var n = t[0],
              i = t[1];
            r[String(n).toLowerCase()] = String(i);
          });
        else if (w(i.headers))
          for (var u in i.headers)
            r[String(u).toLowerCase()] = String(i.headers[u]);
        return (
          i.statusText && (e.statusText = String(i.statusText)), n.call(this, e)
        );
      }
      return i;
    })(nn);
  function on(t) {
    return (t.ownerDocument || t).defaultView;
  }
  var sn,
    hn =
      /(\0)|^(-)$|([\x01-\x1f\x7f]|^-?[0-9])|([\x80-\uffff0-9a-zA-Z_-]+)|[^]/g;
  function an(t, n, i, r, e) {
    return (
      e ||
      (n
        ? '�'
        : r
        ? t.slice(0, -1) + '\\' + t.slice(-1).charCodeAt(0).toString(16) + ' '
        : '\\' + t)
    );
  }
  function fn(t) {
    return void 0 !== sn
      ? sn
      : (sn = (function (t) {
          try {
            var n = t.ownerDocument,
              i = n.createElement('div'),
              r = n.createElement('div');
            return i.appendChild(r), i.querySelector(':scope div') === r;
          } catch (t) {
            return !1;
          }
        })(t));
  }
  function cn(t, n) {
    return t.replace(/^|,/g, '$&'.concat(n, ' '));
  }
  function ln(t) {
    return String(t).replace(hn, an);
  }
  function vn(t) {
    tt(/^[\w-]+$/.test(t));
  }
  function dn(t, n) {
    var i = t.classList,
      r = 'i-amphtml-scoped';
    i.add(r);
    var e = cn(n, '.'.concat(r)),
      u = t.querySelectorAll(e);
    return i.remove(r), u;
  }
  function mn(t, n) {
    if (fn(t)) return t.querySelector(cn(n, ':scope'));
    var i = dn(t, n)[0];
    return void 0 === i ? null : i;
  }
  function pn(t, n) {
    var i =
      t.matches ||
      t.webkitMatchesSelector ||
      t.mozMatchesSelector ||
      t.msMatchesSelector ||
      t.oMatchesSelector;
    return !!i && i.call(t, n);
  }
  function gn(t, n) {
    return t.closest
      ? t.closest(n)
      : (function (t, n, i) {
          var r;
          for (r = t; r && void 0 !== r; r = r.parentElement)
            if (n(r)) return r;
          return null;
        })(t, function (t) {
          return pn(t, n);
        });
  }
  function bn(t, n) {
    for (var i = t.lastElementChild; i; i = i.previousElementSibling)
      if (n(i)) return i;
    return null;
  }
  function yn(t, n) {
    return vn(n), mn(t, '> ['.concat(n, ']'));
  }
  function wn(t) {
    return (
      q((n = t)) ? (i = n) : W(n) && (i = n.tagName),
      !(!i || !i.toLowerCase().startsWith('i-')) ||
        (t.nodeType === Node.ELEMENT_NODE &&
          (nt(t),
          t.hasAttribute('placeholder') ||
            t.hasAttribute('fallback') ||
            t.hasAttribute('overflow')))
    );
    var n, i;
  }
  var An,
    xn = { bubbles: !0, cancelable: !0 };
  function En(t, n, i) {
    if (n(t)) i();
    else {
      var r = on(t);
      if (r.MutationObserver) {
        var e = new r.MutationObserver(function () {
          n(t) && (e.disconnect(), i());
        });
        e.observe(t, { childList: !0 });
      } else
        var u = r.setInterval(function () {
          n(t) && (r.clearInterval(u), i());
        }, 5);
    }
  }
  function Pn(t) {
    return new Promise(function (n) {
      return (function (t, n) {
        En(
          t.documentElement,
          function () {
            return !!t.body;
          },
          n
        );
      })(t, n);
    });
  }
  function Tn(t) {
    var n;
    null === (n = t.parentElement) || void 0 === n || n.removeChild(t);
  }
  function On(t, n) {
    t.insertBefore(n, t.firstChild);
  }
  function In(t, n, i) {
    return (function (t, n) {
      for (var i in n) t.setAttribute(i, n[i]);
      return t;
    })(t.createElement(n), i);
  }
  function Rn(t) {
    var n = t.isConnected;
    if (void 0 !== n) return n;
    for (var i = t; (i = Sn(i)).host; ) i = i.host;
    return i.nodeType === Node.DOCUMENT_NODE;
  }
  function Sn(t) {
    if (Node.prototype.getRootNode) return t.getRootNode();
    var n, i;
    for (
      n = t;
      n.parentNode &&
      (!(i = n) ||
        ('I-AMPHTML-SHADOW-ROOT' != i.tagName &&
          (11 != i.nodeType ||
            '[object ShadowRoot]' !== Object.prototype.toString.call(i))));
      n = n.parentNode
    );
    return n;
  }
  function _n(t, n) {
    var i = t;
    do {
      if (i.nextSibling) return !0;
    } while ((i = i.parentNode) && i != n);
    return !1;
  }
  function Mn(t) {
    try {
      t.focus();
    } catch (t) {}
  }
  function kn(t) {
    return t.parent && t.parent != t;
  }
  function Cn(t, n, i, r) {
    var e = i || {};
    tt(t.ownerDocument);
    var u = r || xn,
      o = u.bubbles,
      s = u.cancelable,
      h = new MessageEvent(n, { data: e, bubbles: o, cancelable: s });
    t.dispatchEvent(h);
  }
  function Nn(t, n) {
    return n !== t && t.contains(n);
  }
  function jn(t) {
    return t.hasAttribute('i-amphtml-ssr');
  }
  function Dn(t, n) {
    var i = t.head.querySelector('script[nonce]');
    if (i) {
      var r = i.nonce || i.getAttribute('nonce');
      n.setAttribute('nonce', null != r ? r : '');
    }
  }
  function Ln(t, n, i, r) {
    return {
      left: t,
      top: n,
      width: i,
      height: r,
      bottom: n + r,
      right: t + i,
      x: t,
      y: n,
    };
  }
  function Un(t) {
    return Ln(Number(t.left), Number(t.top), Number(t.width), Number(t.height));
  }
  function zn(t, n, i) {
    return (0 == n && 0 == i) || (0 == t.width && 0 == t.height)
      ? t
      : Ln(t.left + n, t.top + i, t.width, t.height);
  }
  function Hn() {
    return Rn(this) ? An.call(this) : Ln(0, 0, 0, 0);
  }
  function Gn(t) {
    return (
      !t.IntersectionObserver ||
      !t.IntersectionObserverEntry ||
      !!t.IntersectionObserver._stub ||
      !(function (t) {
        try {
          return (
            new t.IntersectionObserver(function () {}, { root: t.document }), !0
          );
        } catch (t) {
          return !1;
        }
      })(t) ||
      (function (t) {
        return /apple/i.test(t.navigator.vendor);
      })(t)
    );
  }
  var Vn = (function () {
    function t(n, i) {
      (this.Kt = n),
        (this.Vt = N({ root: null, rootMargin: '0px 0px 0px 0px' }, i)),
        (this.Qt = []),
        (this.Yt = null),
        t._upgraders.push(this.on.bind(this));
    }
    var i = t.prototype;
    return (
      (i.disconnect = function () {
        this.Yt ? this.Yt.disconnect() : (this.Qt.length = 0);
      }),
      (i.takeRecords = function () {
        return this.Yt ? this.Yt.takeRecords() : [];
      }),
      (i.observe = function (t) {
        this.Yt
          ? this.Yt.observe(t)
          : -1 == this.Qt.indexOf(t) && this.Qt.push(t);
      }),
      (i.unobserve = function (t) {
        if (this.Yt) this.Yt.unobserve(t);
        else {
          var n = this.Qt.indexOf(t);
          -1 != n && this.Qt.splice(n, 1);
        }
      }),
      (i.on = function (t) {
        var n = new t(this.Kt, this.Vt);
        this.Yt = n;
        for (var i, r = s(this.Qt, !0); !(i = r()).done; ) {
          var e = i.value;
          n.observe(e);
        }
        this.Qt.length = 0;
      }),
      n(t, [
        {
          key: 'root',
          get: function () {
            return this.Yt ? this.Yt.root : this.Vt.root || null;
          },
        },
        {
          key: 'rootMargin',
          get: function () {
            return this.Yt ? this.Yt.rootMargin : this.Vt.rootMargin;
          },
        },
        {
          key: 'thresholds',
          get: function () {
            return this.Yt
              ? this.Yt.thresholds
              : [].concat(this.Vt.threshold || 0);
          },
        },
      ]),
      t
    );
  })();
  function Fn(t) {
    return (t = Number(t)) ? (t > 0 ? 1 : -1) : t;
  }
  Vn._upgraders = [];
  var Bn = Object.prototype.hasOwnProperty;
  function qn(t, n) {
    if (null == t)
      throw new TypeError('Cannot convert undefined or null to object');
    for (var i = Object(t), r = 1; r < arguments.length; r++) {
      var e = arguments[r];
      if (null != e) for (var u in e) Bn.call(e, u) && (i[u] = e[u]);
    }
    return i;
  }
  function Wn(t) {
    return Object.keys(t).map(function (n) {
      return t[n];
    });
  }
  function $n(t) {
    return !t.ResizeObserver || !!t.ResizeObserver._stub;
  }
  var Yn,
    Kn = (function () {
      function t(n) {
        (this.Kt = n),
          (this.Qt = []),
          (this.Yt = null),
          t._upgraders.push(this.on.bind(this));
      }
      var n = t.prototype;
      return (
        (n.disconnect = function () {
          this.Yt ? this.Yt.disconnect() : (this.Qt.length = 0);
        }),
        (n.observe = function (t) {
          this.Yt
            ? this.Yt.observe(t)
            : -1 == this.Qt.indexOf(t) && this.Qt.push(t);
        }),
        (n.unobserve = function (t) {
          if (this.Yt) this.Yt.unobserve(t);
          else {
            var n = this.Qt.indexOf(t);
            -1 != n && this.Qt.splice(n, 1);
          }
        }),
        (n.on = function (t) {
          var n = new t(this.Kt);
          this.Yt = n;
          for (var i, r = s(this.Qt, !0); !(i = r()).done; ) {
            var e = i.value;
            n.observe(e);
          }
          this.Qt.length = 0;
        }),
        t
      );
    })();
  function Xn(t, n) {
    var i = n > 0 ? 0 | n : 0;
    return this.substr(i, t.length) === t;
  }
  (Kn._upgraders = []),
    (Yn = self).fetch ||
      (Object.defineProperty(Yn, 'fetch', {
        value: function (t) {
          var n =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          return new Promise(function (i, r) {
            var e = rn(n.method || 'GET'),
              u = tn(e, t);
            'include' == n.credentials && (u.withCredentials = !0),
              ('document' !== n.responseType && 'text' !== n.responseType) ||
                (u.responseType = n.responseType),
              n.headers &&
                Object.keys(n.headers).forEach(function (t) {
                  u.setRequestHeader(t, n.headers[t]);
                }),
              (u.onreadystatechange = function () {
                if (!(u.readyState < 2))
                  return u.status < 100 || u.status > 599
                    ? ((u.onreadystatechange = null),
                      void r(
                        Yt().createExpectedError(
                          'Unknown HTTP status '.concat(u.status)
                        )
                      ))
                    : void (4 == u.readyState && i(new nn(u)));
              }),
              (u.onerror = function () {
                r(Yt().createExpectedError('Network failure'));
              }),
              (u.onabort = function () {
                r(Yt().createExpectedError('Request aborted'));
              }),
              'POST' == e ? u.send(n.body) : u.send();
          });
        },
        writable: !0,
        enumerable: !0,
        configurable: !0,
      }),
      Object.defineProperty(Yn, 'Response', {
        value: un,
        writable: !0,
        enumerable: !1,
        configurable: !0,
      })),
    (function (t) {
      t.Math.sign ||
        t.Object.defineProperty(t.Math, 'sign', {
          enumerable: !1,
          configurable: !0,
          writable: !0,
          value: Fn,
        });
    })(self),
    (function (t) {
      t.Object.assign ||
        t.Object.defineProperty(t.Object, 'assign', {
          enumerable: !1,
          configurable: !0,
          writable: !0,
          value: qn,
        });
    })(self),
    (function (t) {
      t.Object.values ||
        t.Object.defineProperty(t.Object, 'values', {
          configurable: !0,
          writable: !0,
          value: Wn,
        });
    })(self),
    (function (t) {
      t.Array.prototype.includes ||
        t.Object.defineProperty(t.Array.prototype, 'includes', {
          enumerable: !1,
          configurable: !0,
          writable: !0,
          value: u,
        });
    })(self),
    (function (t) {
      var n = t.Map,
        i = new n();
      if (i.set(0, 0) !== i) {
        var r = i.set;
        t.Object.defineProperty(n.prototype, 'set', {
          enumerable: !1,
          configurable: !0,
          writable: !0,
          value: function () {
            return r.apply(this, arguments), this;
          },
        });
      }
    })(self),
    (function (t) {
      var n = t.WeakMap,
        i = new n();
      if (i.set({}, 0) !== i) {
        var r = i.set;
        t.Object.defineProperty(n.prototype, 'set', {
          enumerable: !1,
          configurable: !0,
          writable: !0,
          value: function () {
            return r.apply(this, arguments), this;
          },
        });
      }
    })(self),
    (function (t) {
      var n = t.Set,
        i = new n([1]);
      if (
        (i.size < 1 &&
          (t.Set = function (t) {
            var i = new n();
            if (t) for (var r = H(t), e = 0; e < r.length; e++) i.add(r[e]);
            return i;
          }),
        i.add(0) !== i)
      ) {
        var r = i.add;
        t.Object.defineProperty(n.prototype, 'add', {
          enumerable: !1,
          configurable: !0,
          writable: !0,
          value: function () {
            return r.apply(this, arguments), this;
          },
        });
      }
    })(self),
    (function (t) {
      t.String.prototype.startsWith ||
        t.Object.defineProperty(t.String.prototype, 'startsWith', {
          enumerable: !1,
          configurable: !0,
          writable: !0,
          value: Xn,
        });
    })(self),
    self.document &&
      ((function (t) {
        var n = t.HTMLDocument || t.Document;
        n &&
          !n.prototype.contains &&
          t.Object.defineProperty(n.prototype, 'contains', {
            enumerable: !1,
            configurable: !0,
            writable: !0,
            value: M,
          });
      })(self),
      (function (t) {
        (function (t) {
          if (!t.document) return !1;
          try {
            return (
              0 !== t.document.createElement('div').getBoundingClientRect().top
            );
          } catch (t) {
            return !0;
          }
        })(t) &&
          ((An = Element.prototype.getBoundingClientRect),
          t.Object.defineProperty(
            t.Element.prototype,
            'getBoundingClientRect',
            { value: Hn }
          ));
      })(self),
      (function (t, n) {
        var i = t.document,
          r = (function (t) {
            var n = t.customElements;
            return !!(n && n.define && n.get && n.whenDefined);
          })(t);
        if (
          !(
            !i ||
            (r &&
              (function (t) {
                return -1 === t.HTMLElement.toString().indexOf('[native code]');
              })(t))
          )
        ) {
          var e = !0,
            u = !1;
          if (n && r)
            try {
              var o = t.Reflect,
                s = Object.create(n.prototype);
              Function.call.call(n, s), (u = !(null == o || !o.construct));
            } catch (t) {
              e = !1;
            }
          u
            ? (function (t) {
                var n = t.HTMLElement,
                  i = t.Reflect;
                function r() {
                  var t = this.constructor;
                  return i.construct(n, [], t);
                }
                S(n, r),
                  (t.HTMLElementOrig = t.HTMLElement),
                  (t.HTMLElement = r);
              })(t)
            : e &&
              (function (t) {
                var n = t.Element,
                  i = t.HTMLElement,
                  r = t.document,
                  e = r.createElement,
                  u = new R(t),
                  o = new I(t, u);
                Object.defineProperty(t, 'customElements', {
                  enumerable: !0,
                  configurable: !0,
                  value: o,
                });
                var s = n.prototype,
                  h = s.attachShadow,
                  a = s.createShadowRoot;
                function f() {
                  var t = this.constructor,
                    n = u.current();
                  if (!n) {
                    var i = u.getByConstructor(t);
                    n = e.call(r, i.name);
                  }
                  return _(n, t.prototype), n;
                }
                h &&
                  ((s.attachShadow = function (t) {
                    var n = h.apply(this, arguments);
                    return u.observe(n), n;
                  }),
                  (s.attachShadow.toString = function () {
                    return h.toString();
                  })),
                  a &&
                    ((s.createShadowRoot = function () {
                      var t = a.apply(this, arguments);
                      return u.observe(t), t;
                    }),
                    (s.createShadowRoot.toString = function () {
                      return a.toString();
                    })),
                  S(i, f),
                  (t.HTMLElementOrig = t.HTMLElement),
                  (t.HTMLElement = f),
                  f.call ||
                    ((f.apply = t.Function.apply),
                    (f.bind = t.Function.bind),
                    (f.call = t.Function.call));
              })(t);
        }
      })(
        self,
        (function () {
          return function () {};
        })()
      ),
      (function (t) {
        Gn(t) &&
          (function (t) {
            if (!t.IntersectionObserver)
              return (
                (t.IntersectionObserver = Vn),
                void (t.IntersectionObserver._stub = Vn)
              );
            var n = t.IntersectionObserver;
            (t.IntersectionObserver = (function (t, n) {
              return function (i, r) {
                var e;
                return 9 ===
                  (null == r || null === (e = r.root) || void 0 === e
                    ? void 0
                    : e.nodeType)
                  ? new n(i, r)
                  : new t(i, r);
              };
            })(t.IntersectionObserver, Vn)),
              (t.IntersectionObserver._stub = Vn),
              (t.IntersectionObserver._native = n);
          })(t),
          (function (t) {
            t.IntersectionObserverEntry &&
              !('isIntersecting' in t.IntersectionObserverEntry.prototype) &&
              Object.defineProperty(
                t.IntersectionObserverEntry.prototype,
                'isIntersecting',
                {
                  enumerable: !0,
                  configurable: !0,
                  get: function () {
                    return this.intersectionRatio > 0;
                  },
                }
              );
          })(t);
      })(self),
      (function (t) {
        $n(t) &&
          (function (t) {
            t.ResizeObserver ||
              ((t.ResizeObserver = Kn), (t.ResizeObserver._stub = Kn));
          })(t);
      })(self),
      (function (t) {
        t.AbortController ||
          (Object.defineProperty(t, 'AbortController', {
            configurable: !0,
            enumerable: !1,
            writable: !0,
            value: r,
          }),
          Object.defineProperty(t, 'AbortSignal', {
            configurable: !0,
            enumerable: !1,
            writable: !0,
            value: e,
          }));
      })(self));
  var Jn = 'cls',
    Qn = 'clstu',
    Zn = 'cls-1',
    ti = 'pc',
    ni = 'inp',
    ii = ['amp-mustache'],
    ri = 'latest',
    ei = /^https:\/\/([a-zA-Z0-9_-]+\.)?cdn\.ampproject\.org(\/.*)?$/;
  function ui(t) {
    if (!t) return null;
    var n = t.match(
        /^(.*)\/(.*)-([0-9.]+|latest)(\.max)?\.(?:js|mjs)(?:\?ssr-css=[0|1])?$/i
      ),
      i = n ? n[2] : void 0,
      r = n ? n[3] : void 0;
    return i && r ? { extensionId: i, extensionVersion: r } : null;
  }
  function oi(t, n, i) {
    var r = t.document.createElement('script');
    (r.async = !0),
      hi(n)
        ? (i = '')
        : r.setAttribute(
            ii.indexOf(n) >= 0 ? 'custom-template' : 'custom-element',
            n
          ),
      r.setAttribute('data-script', n),
      r.setAttribute('i-amphtml-inserted', ''),
      Dn(t.document, r),
      r.setAttribute('crossorigin', 'anonymous');
    var e = (function (t, n, i, r) {
        var e = Tt,
          u = Ct().rtvVersion,
          o = i ? '-' + i : '';
        return ''
          .concat(e, '/rtv/')
          .concat(u, '/v0/')
          .concat(n)
          .concat(o)
          .concat('.js');
      })(t.location, n, i),
      u = {
        createScriptURL: function (t) {
          return ei.test(t) || 'fonts.googleapis.com' === new URL(t).host
            ? t
            : '';
        },
      };
    return (
      self.trustedTypes &&
        self.trustedTypes.createPolicy &&
        (u = self.trustedTypes.createPolicy(
          'extension-script#createExtensionScript',
          u
        )),
      (r.src = u.createScriptURL(e)),
      r
    );
  }
  function si(t, n, i, r) {
    for (
      var e =
          !(arguments.length > 4 && void 0 !== arguments[4]) || arguments[4],
        u =
          ':not([i-amphtml-loaded-new-version])' +
          (e ? '' : ':not([i-amphtml-inserted])'),
        o = t.document.head.querySelectorAll(
          'script[src*="/'.concat(n, '-"]').concat(u)
        ),
        s = [],
        h = 0;
      h < o.length;
      h++
    ) {
      var a = o[h],
        f = ui(a.src);
      if (f) {
        var c = f.extensionId,
          l = f.extensionVersion;
        c == n && (hi(n) || l == i || (l == ri && r)) && s.push(a);
      }
    }
    return s;
  }
  function hi(t) {
    return t.startsWith('_');
  }
  function ai(t, n, i, r) {
    xi((t = gi(t)), t, n, i), r && Ai(t, n);
  }
  function fi(t, n, i, r) {
    var e = yi(t),
      u = wi(e);
    xi(u, e, n, i), r && Ai(u, n);
  }
  function ci(t, n) {
    return Ai((t = gi(t)), n);
  }
  function li(t, n) {
    return Ri((t = gi(t)), n) ? Ai(t, n) : null;
  }
  function vi(t, n) {
    return Ai(wi(yi(t)), n);
  }
  function di(t, n) {
    var i = wi(yi(t));
    return Ri(i, n) ? Ai(i, n) : null;
  }
  function mi(t, n) {
    return Ei(wi(t), n);
  }
  function pi(t, n) {
    return Pi(wi(t), n);
  }
  function gi(t) {
    return t.__AMP_TOP || (t.__AMP_TOP = t);
  }
  function bi(t, n) {
    var i = (t.ownerDocument || t).defaultView,
      r = n || gi(i);
    if (i && i != r && gi(i) == r)
      try {
        return i.frameElement;
      } catch (t) {}
    return null;
  }
  function yi(t) {
    return t.nodeType
      ? (function (t) {
          return ci(t, 'ampdoc');
        })(on(t)).getAmpDoc(t)
      : t;
  }
  function wi(t) {
    var n = yi(t);
    return n.isSingleDoc() ? n.win : n;
  }
  function Ai(t, n) {
    Jt(Ri(t, n));
    var i = Ti(t)[n];
    return (
      i.obj ||
        (Jt(i.ctor),
        Jt(i.context),
        (i.obj = new i.ctor(i.context)),
        Jt(i.obj),
        (i.context = null),
        i.resolve && i.resolve(i.obj)),
      i.obj
    );
  }
  function xi(t, n, i, r, e, u) {
    var o = Ti(t),
      s = o[i];
    s ||
      (s = o[i] =
        {
          obj: null,
          promise: null,
          resolve: null,
          reject: null,
          context: null,
          ctor: null,
          sharedInstance: u || !1,
        }),
      (!e && s.ctor) ||
        ((s.ctor = r),
        (s.context = n),
        (s.sharedInstance = u || !1),
        s.resolve && Ai(t, i));
  }
  function Ei(t, n) {
    var i = Pi(t, n);
    if (i) return i;
    var r = Ti(t);
    return (r[n] = Si()), r[n].promise;
  }
  function Pi(t, n) {
    var i = Ti(t)[n];
    return i
      ? i.promise
        ? i.promise
        : (Ai(t, n), (i.promise = Promise.resolve(i.obj)))
      : null;
  }
  function Ti(t) {
    var n = t.__AMP_SERVICES;
    return n || (n = t.__AMP_SERVICES = {}), n;
  }
  function Oi(t) {
    return 'function' == typeof t.dispose;
  }
  function Ii(t, n) {
    if (Oi(n))
      try {
        (function (t) {
          return Jt(Oi(t)), t;
        })(n).dispose();
      } catch (n) {
        Xt().error('SERVICE', 'failed to dispose service', t, n);
      }
  }
  function Ri(t, n) {
    var i = t.__AMP_SERVICES && t.__AMP_SERVICES[n];
    return !(!i || !i.ctor);
  }
  function Si() {
    var t = new a(),
      n = t.promise,
      i = t.reject,
      r = t.resolve;
    return (
      n.catch(function () {}),
      {
        obj: null,
        promise: n,
        resolve: r,
        reject: i,
        context: null,
        ctor: null,
      }
    );
  }
  function _i(t, n, i, r) {
    return Mi(t, n, i, r).then(function (t) {
      return (function (t, n, i) {
        return Qt(
          t,
          'Service %s was requested to be provided through %s, but %s is not loaded in the current page. To fix this problem load the JavaScript file for %s in this page.',
          n,
          i,
          i,
          i
        );
      })(t, n, i);
    });
  }
  function Mi(t, n, i, r) {
    var e = pi(t, n);
    if (e) return e;
    var u = yi(t);
    return u
      .whenExtensionsKnown()
      .then(function () {
        var t = u.getExtensionVersion(i);
        return t ? ci(u.win, 'extensions').waitForExtension(i, t) : null;
      })
      .then(function (i) {
        return i ? (r ? pi(t, n) : mi(t, n)) : null;
      });
  }
  var ki,
    Ci = function (t) {
      return Mi(t, 'access', 'amp-access');
    },
    Ni = function (t) {
      return Mi(t, 'subscriptions', 'amp-subscriptions');
    },
    ji = function (t) {
      return di(t, 'action');
    },
    Di = function (t) {
      return _i(t, 'activity', 'amp-analytics');
    },
    Li = function (t) {
      return yi(t);
    },
    Ui = function (t) {
      return ci(t, 'ampdoc');
    },
    zi = function (t) {
      return Mi(t, 'amp-analytics-instrumentation', 'amp-analytics');
    },
    Hi = function (t) {
      return (function (t, n, i) {
        var r = di(t, n);
        return r ? Promise.resolve(r) : Mi(t, n, 'amp-bind');
      })(t, 'bind');
    },
    Gi = function (t) {
      return mi(t, 'cid');
    },
    Vi = function (t) {
      return vi(t, 'documentInfo').get();
    },
    Fi = function (t) {
      return ci(t, 'extensions');
    },
    Bi = function (t) {
      return vi(t, 'history');
    },
    qi = function (t) {
      return di(t, 'loadingIndicator');
    },
    Wi = function (t) {
      return vi(t, 'mutator');
    },
    $i = function (t) {
      return ci(t, 'performance');
    },
    Yi = function (t) {
      return ci(t, 'platform');
    },
    Ki = function (t) {
      return ci(t, 'preconnect');
    },
    Xi = function (t) {
      return vi(t, 'resources');
    },
    Ji = function (t) {
      return (function (t, n) {
        return Ai(t, 'timer');
      })(t);
    },
    Qi = function (t) {
      return di(t, 'url-replace');
    },
    Zi = function (t) {
      return Mi(t, 'geo', 'amp-geo', !0);
    },
    tr = function (t) {
      return di(t, 'url');
    },
    nr = function (t) {
      return vi(t, 'viewer');
    },
    ir = function (t) {
      return ci(t, 'vsync');
    },
    rr = function (t) {
      return vi(t, 'viewport');
    },
    er = 'prerender',
    ur = 'preview',
    or = 'visible',
    sr = 'hidden',
    hr = 'paused',
    ar = 'inactive',
    fr = (function () {
      function t() {
        this.vt = null;
      }
      var n = t.prototype;
      return (
        (n.add = function (t) {
          var n = this;
          return (
            this.vt || (this.vt = []),
            this.vt.push(t),
            function () {
              n.remove(t);
            }
          );
        }),
        (n.remove = function (t) {
          this.vt && B(this.vt, t);
        }),
        (n.removeAll = function () {
          this.vt && (this.vt.length = 0);
        }),
        (n.fire = function (t) {
          if (this.vt)
            for (var n, i = s(this.vt.slice(), !0); !(n = i()).done; )
              (0, n.value)(t);
        }),
        (n.getHandlerCount = function () {
          var t, n;
          return null !==
            (t = null === (n = this.vt) || void 0 === n ? void 0 : n.length) &&
            void 0 !== t
            ? t
            : 0;
        }),
        t
      );
    })(),
    cr = (function () {
      function t() {
        (this.ae = A()), (this.we = null);
      }
      var n = t.prototype;
      return (
        (n.get = function (t) {
          var n = this.ae[t];
          return null == n ? null : n;
        }),
        (n.whenSignal = function (t) {
          var n,
            i = null === (n = this.we) || void 0 === n ? void 0 : n[t];
          if (!i) {
            var r = this.ae[t];
            (i =
              null != r
                ? {
                    promise:
                      'number' == typeof r
                        ? Promise.resolve(r)
                        : Promise.reject(r),
                  }
                : new a()),
              this.we || (this.we = A()),
              (this.we[t] = i);
          }
          return i.promise;
        }),
        (n.signal = function (t, n) {
          var i;
          if (null == this.ae[t]) {
            var r = null != n ? n : Date.now();
            this.ae[t] = r;
            var e = null === (i = this.we) || void 0 === i ? void 0 : i[t];
            null != e &&
              e.resolve &&
              (e.resolve(r), (e.resolve = void 0), (e.reject = void 0));
          }
        }),
        (n.rejectSignal = function (t, n) {
          var i;
          if (null == this.ae[t]) {
            this.ae[t] = n;
            var r = null === (i = this.we) || void 0 === i ? void 0 : i[t];
            null != r &&
              r.reject &&
              (r.reject(n),
              r.promise.catch(function () {}),
              (r.resolve = void 0),
              (r.reject = void 0));
          }
        }),
        (n.reset = function (t) {
          var n;
          this.ae[t] && delete this.ae[t];
          var i = null === (n = this.we) || void 0 === n ? void 0 : n[t];
          i && !i.resolve && delete this.we[t];
        }),
        t
      );
    })(),
    lr = 'building',
    vr = 'mounting',
    dr = 'loading',
    mr = 'complete',
    pr = 'error';
  function gr(t) {
    return t.readyState != dr && 'uninitialized' != t.readyState;
  }
  function br(t) {
    return t.readyState == mr;
  }
  function yr(t, n) {
    wr(t, gr, n);
  }
  function wr(t, n, i) {
    var r = n(t);
    r
      ? i(t)
      : t.addEventListener('readystatechange', function e() {
          n(t) &&
            (r || ((r = !0), i(t)),
            t.removeEventListener('readystatechange', e));
        });
  }
  function Ar(t) {
    return new Promise(function (n) {
      yr(t, n);
    });
  }
  function xr(t) {
    return new Promise(function (n) {
      wr(t, br, n);
    });
  }
  var Er = ['Webkit', 'webkit', 'Moz', 'moz', 'ms', 'O', 'o'],
    Pr = {
      getPropertyPriority: function () {
        return '';
      },
      getPropertyValue: function () {
        return '';
      },
    };
  function Tr(t) {
    var n = t.replace(/[A-Z]/g, function (t) {
      return '-' + t.toLowerCase();
    });
    return Er.some(function (t) {
      return n.startsWith(t + '-');
    })
      ? '-'.concat(n)
      : n;
  }
  function Or(t, n, i) {
    if (n.startsWith('--')) return n;
    ki || (ki = A());
    var r = ki[n];
    if (!r || i) {
      if (((r = n), void 0 === t[n])) {
        var e = (function (t) {
            return t.charAt(0).toUpperCase() + t.slice(1);
          })(n),
          u = (function (t, n) {
            for (var i = 0; i < Er.length; i++) {
              var r = Er[i] + n;
              if (void 0 !== t[r]) return r;
            }
            return '';
          })(t, e);
        void 0 !== t[u] && (r = u);
      }
      i || (ki[n] = r);
    }
    return r;
  }
  function Ir(t, n) {
    var i = t.style;
    for (var r in n) i.setProperty(Tr(Or(i, r)), String(n[r]), 'important');
  }
  function Rr(t, n, i, r, e) {
    var u = Or(t.style, n, e);
    if (u) {
      var o = r ? i + r : i;
      t.style.setProperty(Tr(u), o);
    }
  }
  function Sr(t, n) {
    for (var i in n) Rr(t, i, n[i]);
  }
  function _r(t, n) {
    void 0 === n && (n = t.hasAttribute('hidden')),
      n ? t.removeAttribute('hidden') : t.setAttribute('hidden', '');
  }
  function Mr(t) {
    return ''.concat(t, 'px');
  }
  function kr(t, n) {
    return 'number' == typeof t ? n(t) : t;
  }
  function Cr(t, n) {
    return t.getComputedStyle(n) || Pr;
  }
  function Nr(t, n) {
    for (var i = 0; i < n.length; i++) Rr(t, n[i], null);
  }
  function jr(t) {
    var n = t[Or(t, 'visibilityState', !0)];
    if (n) return n;
    var i = Or(t, 'hidden', !0);
    return i in t && t[i] ? sr : or;
  }
  function Dr(t, n) {
    if (t.addEventListener) {
      var i = Ur(t);
      i && t.addEventListener(i, n);
    }
  }
  function Lr(t, n) {
    if (t.removeEventListener) {
      var i = Ur(t);
      i && t.removeEventListener(i, n);
    }
  }
  function Ur(t) {
    var n = Or(t, 'hidden', !0),
      i = n.indexOf('Hidden');
    return -1 != i
      ? n.substring(0, i) + 'Visibilitychange'
      : 'visibilitychange';
  }
  var zr = (function () {
      function t() {}
      return (
        (t.getTop = function (t) {
          return t.top;
        }),
        (t.getLocation = function (t) {
          return t.location;
        }),
        (t.getDocumentReferrer = function (t) {
          return t.document.referrer;
        }),
        (t.getHostname = function (t) {
          return t.location.hostname;
        }),
        (t.getUserAgent = function (t) {
          return t.navigator.userAgent;
        }),
        (t.getUserLanguage = function (t) {
          return t.navigator.userLanguage || t.navigator.language;
        }),
        (t.getDevicePixelRatio = function () {
          return self.devicePixelRatio || 1;
        }),
        (t.getSendBeacon = function (t) {
          if (t.navigator.sendBeacon)
            return t.navigator.sendBeacon.bind(t.navigator);
        }),
        (t.getXMLHttpRequest = function (t) {
          return t.XMLHttpRequest;
        }),
        (t.getImage = function (t) {
          return t.Image;
        }),
        t
      );
    })(),
    Hr = '__AMP__',
    Gr = '-ampdoc-ext-known',
    Vr = '-ampdoc-first-visible',
    Fr = '-ampdoc-next-visible',
    Br = '-ampdoc-first-previewed',
    qr = (function () {
      function t(t, n, i) {
        (this.win = t),
          (this.Ae = null),
          n &&
            ((this.Ae = new $r(t, { params: Xr(t, i) })),
            (t.document.__AMPDOC = this.Ae));
      }
      var n = t.prototype;
      return (
        (n.isSingleDoc = function () {
          return !!this.Ae;
        }),
        (n.getSingleDoc = function () {
          return Jt(this.Ae);
        }),
        (n.xe = function (t) {
          return t.everAttached && 'function' == typeof t.getAmpDoc
            ? t.getAmpDoc()
            : null;
        }),
        (n.getAmpDocIfAvailable = function (t) {
          for (var n = t; n; ) {
            var i = this.xe(t);
            if (i) return i;
            var r = Sn(n);
            if (!r) break;
            var e = r.__AMPDOC;
            if (e) return e;
            n = r.host ? r.host : bi(r, this.win);
          }
          return null;
        }),
        (n.getAmpDoc = function (t) {
          var n = this.getAmpDocIfAvailable(t);
          if (!n) throw Xt().createError('No ampdoc found for', t);
          return n;
        }),
        (n.installShadowDoc = function (t, n, i) {
          Jt(!n.__AMPDOC);
          var r = new Yr(this.win, t, n, i);
          return (n.__AMPDOC = r), r;
        }),
        (n.installFieDoc = function (t, n, i) {
          var r = n.document;
          Jt(!r.__AMPDOC);
          var e = Jt(n.frameElement),
            u = new Kr(n, t, this.getAmpDoc(e), i);
          return (r.__AMPDOC = u), u;
        }),
        t
      );
    })(),
    Wr = (function () {
      function t(t, n, i) {
        var r = this;
        (this.win = t),
          (this.Ee = A()),
          (this.Pe = n),
          (this.Te = (i && i.signals) || new cr()),
          (this.Oe = (i && i.params) || A()),
          (this.Ie = null),
          (this.Re = {});
        var e,
          u = this.Oe.visibilityState;
        Jt(
          !u ||
            'prerender' === (e = u) ||
            'preview' === e ||
            'visible' === e ||
            'hidden' === e ||
            'paused' === e ||
            'inactive' === e
        ),
          (this.Se = (i && i.visibilityState) || u || null),
          (this.J = null),
          (this._e = new fr()),
          (this.Me = null),
          (this.ke = []);
        var o = this.Yi.bind(this);
        this.Pe && this.ke.push(this.Pe.onVisibilityChanged(o)),
          Dr(this.win.document, o),
          this.ke.push(function () {
            return Lr(r.win.document, o);
          }),
          this.Yi();
      }
      var n = t.prototype;
      return (
        (n.dispose = function () {
          (function (t) {
            var n = Ti(t),
              i = function (t) {
                if (!Object.prototype.hasOwnProperty.call(n, t))
                  return 'continue';
                var i = n[t];
                if (i.sharedInstance) return 'continue';
                i.obj
                  ? Ii(t, i.obj)
                  : i.promise &&
                    i.promise.then(function (n) {
                      return Ii(t, n);
                    });
              };
            for (var r in n) i(r);
          })(this),
            this.ke.forEach(function (t) {
              return t();
            });
        }),
        (n.isSingleDoc = function () {
          return Jt(null);
        }),
        (n.getParent = function () {
          return this.Pe;
        }),
        (n.signals = function () {
          return this.Te;
        }),
        (n.getParam = function (t) {
          var n = this.Oe[t];
          return null == n ? null : n;
        }),
        (n.getMeta = function () {
          var t = this;
          return (
            this.Ie ||
              ((this.Ie = A()),
              this.win.document.head
                .querySelectorAll('meta[name]')
                .forEach(function (n) {
                  var i = n.getAttribute('name'),
                    r = n.getAttribute('content');
                  i && null !== r && void 0 === t.Ie[i] && (t.Ie[i] = r);
                })),
            A(this.Ie)
          );
        }),
        (n.getMetaByName = function (t) {
          if (!t) return null;
          var n = this.getMeta()[t];
          return void 0 !== n ? n : null;
        }),
        (n.setMetaByName = function (t, n) {
          Jt(null);
        }),
        (n.declaresExtension = function (t, n) {
          var i = this.Re[t];
          return !(!i || (n && i !== n));
        }),
        (n.declareExtension = function (t, n) {
          Jt(!this.Re[t] || this.Re[t] === n), (this.Re[t] = n);
        }),
        (n.getExtensionVersion = function (t) {
          return this.Re[t] || null;
        }),
        (n.setExtensionsKnown = function () {
          this.Te.signal(Gr);
        }),
        (n.whenExtensionsKnown = function () {
          return this.Te.whenSignal(Gr);
        }),
        (n.getRootNode = function () {
          return Jt(null);
        }),
        (n.getHeadNode = function () {}),
        (n.isBodyAvailable = function () {
          return Jt(!1);
        }),
        (n.getBody = function () {
          return Jt(null);
        }),
        (n.waitForBodyOpen = function () {
          return Jt(null);
        }),
        (n.isReady = function () {
          return Jt(null);
        }),
        (n.whenReady = function () {
          return Jt(null);
        }),
        (n.getUrl = function () {
          return Jt(null);
        }),
        (n.getElementById = function (t) {
          return this.getRootNode().getElementById(t);
        }),
        (n.contains = function (t) {
          return this.getRootNode().contains(t);
        }),
        (n.overrideVisibilityState = function (t) {
          this.Se != t && ((this.Se = t), this.Yi());
        }),
        (n.Yi = function () {
          for (
            var t, n = jr(this.win.document), i = or, r = this.Pe;
            r;
            r = r.getParent()
          )
            if (r.getVisibilityState() != or) {
              i = r.getVisibilityState();
              break;
            }
          var e = this.Se || or;
          if (
            ((t =
              e == or && i == or && n == or
                ? or
                : n == sr && e == hr
                ? n
                : e == hr || e == ar
                ? e
                : i == hr || i == ar
                ? i
                : e == ur || n == ur || i == ur
                ? ur
                : e == er || n == er || i == er
                ? er
                : sr),
            this.J != t)
          ) {
            if (t == or) {
              var u,
                o = this.win.performance,
                s = Math.floor(
                  null !== (u = o.timeOrigin) && void 0 !== u
                    ? u
                    : o.timing.navigationStart
                );
              null != this.J && (s += Math.floor(o.now())),
                (this.Me = s),
                this.Te.signal(Vr, s),
                this.Te.signal(Fr, s);
            } else this.Te.reset(Fr);
            t == ur && this.Te.signal(Br), (this.J = t), this._e.fire();
          }
        }),
        (n.whenFirstPreviewedOrVisible = function () {
          return Promise.race([
            this.whenFirstPreviewed(),
            this.whenFirstVisible(),
          ]);
        }),
        (n.whenFirstPreviewed = function () {
          return this.Te.whenSignal(Br).then(function () {});
        }),
        (n.whenFirstVisible = function () {
          return this.Te.whenSignal(Vr).then(function () {});
        }),
        (n.whenNextVisible = function () {
          return this.Te.whenSignal(Fr).then(function () {});
        }),
        (n.getFirstVisibleTime = function () {
          return this.Te.get(Vr);
        }),
        (n.getLastVisibleTime = function () {
          return this.Me;
        }),
        (n.getVisibilityState = function () {
          return Jt(this.J);
        }),
        (n.isPreview = function () {
          return this.J == ur;
        }),
        (n.isVisible = function () {
          return this.J == or;
        }),
        (n.hasBeenVisible = function () {
          return null != this.getLastVisibleTime();
        }),
        (n.onVisibilityChanged = function (t) {
          return this._e.add(t);
        }),
        (n.registerSingleton = function (t) {
          return !this.Ee[t] && ((this.Ee[t] = !0), !0);
        }),
        t
      );
    })(),
    $r = (function (t) {
      D(i, t);
      var n = z(i);
      function i(t, i) {
        var r;
        return (
          ((r = n.call(this, t, null, i)).Ce = r.win.document.body
            ? Promise.resolve(r.win.document.body)
            : Pn(r.win.document).then(function () {
                return r.getBody();
              })),
          (r.Ne = Ar(r.win.document)),
          r
        );
      }
      var r = i.prototype;
      return (
        (r.isSingleDoc = function () {
          return !0;
        }),
        (r.getRootNode = function () {
          return this.win.document;
        }),
        (r.getUrl = function () {
          return zr.getLocation(this.win).href;
        }),
        (r.getHeadNode = function () {
          return this.win.document.head;
        }),
        (r.isBodyAvailable = function () {
          return !!this.win.document.body;
        }),
        (r.getBody = function () {
          return this.win.document.body;
        }),
        (r.waitForBodyOpen = function () {
          return this.Ce;
        }),
        (r.isReady = function () {
          return gr(this.win.document);
        }),
        (r.whenReady = function () {
          return this.Ne;
        }),
        i
      );
    })(Wr),
    Yr = (function (t) {
      D(i, t);
      var n = z(i);
      function i(t, i, r, e) {
        var u;
        ((u = n.call(this, t, null, e)).je = i), (u.De = r), (u.Le = null);
        var o = new a();
        (u.Ce = o.promise), (u.Ue = o.resolve), (u.ze = !1);
        var s = new a();
        return (u.Ne = s.promise), (u.He = s.resolve), u;
      }
      var r = i.prototype;
      return (
        (r.isSingleDoc = function () {
          return !1;
        }),
        (r.getRootNode = function () {
          return this.De;
        }),
        (r.getUrl = function () {
          return this.je;
        }),
        (r.getHeadNode = function () {
          return this.De;
        }),
        (r.isBodyAvailable = function () {
          return !!this.Le;
        }),
        (r.getBody = function () {
          return this.Le;
        }),
        (r.setBody = function (t) {
          Jt(!this.Le), (this.Le = t), this.Ue(t), (this.Ue = void 0);
        }),
        (r.waitForBodyOpen = function () {
          return this.Ce;
        }),
        (r.isReady = function () {
          return this.ze;
        }),
        (r.setReady = function () {
          Jt(!this.ze), (this.ze = !0), this.He(), (this.He = void 0);
        }),
        (r.whenReady = function () {
          return this.Ne;
        }),
        (r.getMeta = function () {
          return A(this.Ie);
        }),
        (r.setMetaByName = function (t, n) {
          Jt(t), this.Ie || (this.Ie = A()), (this.Ie[t] = n);
        }),
        i
      );
    })(Wr),
    Kr = (function (t) {
      D(i, t);
      var n = z(i);
      function i(t, i, r, e) {
        var u;
        ((u = n.call(this, t, r, e)).je = i),
          (u.Ce = u.win.document.body
            ? Promise.resolve(u.win.document.body)
            : Pn(u.win.document).then(function () {
                return u.getBody();
              })),
          (u.ze = !1);
        var o = new a();
        return (u.Ne = o.promise), (u.He = o.resolve), u;
      }
      var r = i.prototype;
      return (
        (r.isSingleDoc = function () {
          return !1;
        }),
        (r.getRootNode = function () {
          return this.win.document;
        }),
        (r.getUrl = function () {
          return this.je;
        }),
        (r.getHeadNode = function () {
          return this.win.document.head;
        }),
        (r.isBodyAvailable = function () {
          return !!this.win.document.body;
        }),
        (r.getBody = function () {
          return this.win.document.body;
        }),
        (r.waitForBodyOpen = function () {
          return this.Ce;
        }),
        (r.isReady = function () {
          return this.ze;
        }),
        (r.whenReady = function () {
          return this.Ne;
        }),
        (r.setReady = function () {
          Jt(!this.ze), (this.ze = !0), this.He(), (this.He = void 0);
        }),
        i
      );
    })(Wr);
  function Xr(t, n) {
    var i = A();
    return (
      n
        ? Object.assign(i, n)
        : (t.name &&
            0 == t.name.indexOf(Hr) &&
            Object.assign(i, gt(t.name.substring(Hr.length))),
          t.location &&
            t.location.hash &&
            Object.assign(i, gt(t.location.hash))),
      i
    );
  }
  function Jr(t) {
    if (!t.hasAttribute('src') && 'srcset' in t == 0) {
      var n = t.getAttribute('srcset') || '',
        i = /\S+/.exec(n);
      if (null == i) return;
      var r = i[0];
      t.setAttribute('src', r);
    }
  }
  var Qr = 'nodisplay',
    Zr = 'fixed',
    te = 'fixed-height',
    ne = 'responsive',
    ie = 'container',
    re = 'fill',
    ee = 'flex-item',
    ue = 'fluid',
    oe = 'intrinsic',
    se =
      /^amp\-(video|.+player)|AMP-BRIGHTCOVE|AMP-DAILYMOTION|AMP-YOUTUBE|AMP-VIMEO|AMP-IMA-VIDEO/i;
  function he(t) {
    if (
      'nodisplay' === (n = t) ||
      'fixed' === n ||
      'fixed-height' === n ||
      'responsive' === n ||
      'container' === n ||
      'fill' === n ||
      'flex-item' === n ||
      'fluid' === n ||
      'intrinsic' === n
    )
      return t;
    var n;
  }
  function ae(t) {
    return 'i-amphtml-layout-' + t;
  }
  function fe(t) {
    return (
      t == Zr || t == te || t == ne || t == re || t == ee || t == ue || t == oe
    );
  }
  function ce(t) {
    return 'number' == typeof t
      ? t + 'px'
      : t &&
        /^\d+(\.\d+)?(px|em|rem|vh|vw|vmin|vmax|cm|mm|q|in|pc|pt)?$/.test(t)
      ? /^\d+(\.\d+)?$/.test(t)
        ? t + 'px'
        : t
      : void 0;
  }
  function le(t) {
    !(function (t) {
      et(
        /^\d+(\.\d+)?(px|em|rem|vh|vw|vmin|vmax|cm|mm|q|in|pc|pt)$/.test(
          null != t ? t : ''
        ),
        'Invalid length value: %s',
        t
      );
    })(t);
    var n = /[a-z]+/i.exec(null != t ? t : '');
    return et(n, 'Failed to read units from %s', t), n[0];
  }
  function ve(t) {
    var n = parseFloat(t);
    return $(n) ? n : void 0;
  }
  function de(t, n) {
    t.classList.add('i-amphtml-fill-content'),
      n && t.classList.add('i-amphtml-replaced-content');
  }
  function me(t, n, i, r) {
    for (var e, u = s(V(t), !0); !(e = u()).done; ) {
      var o = e.value,
        h = n.getAttribute(o);
      null !== h ? i.setAttribute(o, h) : r && i.removeAttribute(o);
    }
  }
  var pe,
    ge = 'amp:attached',
    be = 'amp:load-start',
    ye = 'amp:load-end',
    we = 'ready-upgrade',
    Ae = 'upgraded',
    xe = 'built',
    Ee = 'mounted',
    Pe = 'load-start',
    Te = 'render-start',
    Oe = 'load-end',
    Ie = 'unload',
    Re = (function () {
      function t(t, n) {
        (this.t = t), (this.Kt = n), (this.Ge = {}), (this.Ve = null);
      }
      var n = t.prototype;
      return (
        (n.start = function () {
          (this.Ve = this.Ge), (this.Ge = {});
        }),
        (n.resolveMatchQuery = function (t) {
          return '1' === this.Fe(t, Se, '1');
        }),
        (n.resolveListQuery = function (t) {
          return this.Fe(t, _e, '');
        }),
        (n.complete = function () {
          for (var t in this.Ve) t in this.Ge || Me(this.Ve[t], this.Kt, !1);
          this.Ve = null;
        }),
        (n.dispose = function () {
          for (var t in this.Ge) Me(this.Ge[t], this.Kt, !1);
          this.Ge = {};
        }),
        (n.Fe = function (t, n, i) {
          if (!t.trim()) return i;
          var r = this.Ge[t];
          return (
            r || (tt(this.Ve), (r = this.Ve[t])),
            r || Me((r = n(this.t, t)), this.Kt, !0),
            (this.Ge[t] = r),
            (function (t) {
              for (var n = 0; n < t.length; n++) {
                var i = t[n],
                  r = i.query,
                  e = i.value;
                if (!r || r.matches) return e;
              }
              return '';
            })(r)
          );
        }),
        t
      );
    })();
  function Se(t, n) {
    return [
      { query: t.matchMedia(n), value: '1' },
      { query: null, value: '' },
    ];
  }
  function _e(t, n) {
    return n
      .split(',')
      .map(function (n) {
        if (0 != (n = n.replace(/\s+/g, ' ').trim()).length) {
          var i, r, e;
          if (')' == n.charAt(n.length - 1)) {
            var u = 1;
            for (e = n.length - 2; e >= 0; e--) {
              var o = n.charAt(e);
              if (('(' == o ? u-- : ')' == o && u++, 0 == u)) break;
            }
            var s = e - 1;
            if (e > 0)
              for (e--; e >= 0; e--) {
                var h = n.charAt(e);
                if (
                  !(
                    '%' == h ||
                    '-' == h ||
                    '_' == h ||
                    (h >= 'a' && h <= 'z') ||
                    (h >= 'A' && h <= 'Z') ||
                    (h >= '0' && h <= '9')
                  )
                )
                  break;
              }
            if (e >= s) return null;
          } else
            for (e = n.length - 2; e >= 0; e--) {
              var a = n.charAt(e);
              if (
                !(
                  '%' == a ||
                  '.' == a ||
                  (a >= 'a' && a <= 'z') ||
                  (a >= 'A' && a <= 'Z') ||
                  (a >= '0' && a <= '9')
                )
              )
                break;
            }
          return (
            e >= 0
              ? ((i = n.substring(0, e + 1).trim()),
                (r = n.substring(e + 1).trim()))
              : ((r = n), (i = void 0)),
            r ? { query: i ? t.matchMedia(i) : null, value: r } : null
          );
        }
      })
      .filter(Boolean);
  }
  function Me(t, n, i) {
    for (var r = 0; r < t.length; r++) {
      var e = t[r].query;
      e &&
        (void 0 !== e.onchange
          ? (e.onchange = i ? n : null)
          : i
          ? e.addListener(n)
          : e.removeListener(n));
    }
  }
  function ke(t) {
    var n = t.ownerDocument || t;
    return (pe && pe.ownerDocument === n) || (pe = n.createElement('div')), Ce;
  }
  function Ce(t) {
    return (function (t, n) {
      if (
        (tt(1 === n.length),
        tt(Array.isArray(n) || x(n, 'raw')),
        self.trustedTypes && self.trustedTypes.createPolicy)
      ) {
        var i = self.trustedTypes.createPolicy('static-template#createNode', {
          createHTML: function (t) {
            return n[0];
          },
        });
        t.innerHTML = i.createHTML('ignored');
      } else t.innerHTML = n[0];
      var r = t.firstElementChild;
      return tt(r), tt(!r.nextElementSibling), t.removeChild(r), r;
    })(pe, t);
  }
  var Ne = [
      '<i-amphtml-sizer class=i-amphtml-sizer slot=i-amphtml-svc><img alt="" role=presentation aria-hidden=true class=i-amphtml-intrinsic-sizer></i-amphtml-sizer>',
    ],
    je = {
      'AMP-PIXEL': { width: '0px', height: '0px' },
      'AMP-ANALYTICS': { width: '1px', height: '1px' },
      'AMP-AUDIO': null,
      'AMP-SOCIAL-SHARE': { width: '60px', height: '44px' },
    };
  function De(t) {
    var n = t.getAttribute('layout'),
      i = t.getAttribute('width'),
      r = t.getAttribute('height'),
      e = t.getAttribute('sizes'),
      u = t.getAttribute('heights'),
      o = n ? he(n) : null;
    et(void 0 !== o, 'Invalid "layout" value: %s, %s', n, t);
    var s = i && 'auto' != i ? ce(i) : i;
    et(void 0 !== s, 'Invalid "width" value: %s, %s', i, t);
    var h,
      a,
      f,
      c,
      l = r && 'fluid' != r ? ce(r) : r;
    if (
      (et(void 0 !== l, 'Invalid "height" value: %s, %s', r, t),
      (o && o != Zr && o != te) ||
        (s && l) ||
        ((c = (c = t.tagName).toUpperCase()), void 0 === je[c]))
    )
      (h = s), (a = l);
    else {
      var v = (function (t) {
        var n = t.tagName.toUpperCase();
        if ((tt(void 0 !== je[n]), !je[n])) {
          var i = t.ownerDocument,
            r = n.replace(/^AMP\-/, ''),
            e = i.createElement(r);
          (e.controls = !0),
            Sr(e, { position: 'absolute', visibility: 'hidden' }),
            i.body.appendChild(e),
            (je[n] = {
              width: (e.offsetWidth || 1) + 'px',
              height: (e.offsetHeight || 1) + 'px',
            }),
            i.body.removeChild(e);
        }
        return je[n];
      })(t);
      (h = s || o == te ? s : v.width), (a = l || v.height);
    }
    return (
      ((f =
        o ||
        (h || a
          ? 'fluid' == a
            ? ue
            : !a || (h && 'auto' != h)
            ? a && h && (e || u)
              ? ne
              : Zr
            : te
          : ie)) != Zr &&
        f != te &&
        f != ne &&
        f != oe) ||
        et(a, 'The "height" attribute is missing: %s', t),
      f == te &&
        et(
          !h || 'auto' == h,
          'The "width" attribute must be missing or "auto": %s',
          t
        ),
      (f != Zr && f != ne && f != oe) ||
        et(
          h && 'auto' != h,
          'The "width" attribute must be present and not "auto": %s',
          t
        ),
      f == ne || f == oe
        ? et(
            le(h) == le(a),
            'Length units should be the same for "width" and "height": %s, %s, %s',
            i,
            r,
            t
          )
        : et(null === u, '"heights" attribute must be missing: %s', t),
      { layout: f, width: h, height: a }
    );
  }
  var Le,
    Ue = 'EXPERIMENTS',
    ze = 'amp-experiment-toggles',
    He = '__AMP__EXPERIMENT_TOGGLES';
  function Ge(t, n) {
    return !!Fe(t)[n];
  }
  function Ve(t, n, i, r) {
    var e = Ge(t, n),
      u = null != i ? i : !e;
    if (u != e && ((Fe(t)[n] = u), !r)) {
      var o = Be(t);
      (o[n] = u),
        (function (t, n) {
          var i = [];
          for (var r in n) i.push((!1 === n[r] ? '-' : '') + r);
          try {
            var e;
            null === (e = t.localStorage) ||
              void 0 === e ||
              e.setItem(ze, i.join(','));
          } catch (t) {
            Yt().error(Ue, 'Failed to save experiments to localStorage.');
          }
        })(t, o),
        Yt().warn(
          Ue,
          '"%s" experiment %s for the domain "%s". See: https://amp.dev/documentation/guides-and-tutorials/learn/experimental',
          n,
          u ? 'enabled' : 'disabled',
          t.location.hostname
        );
    }
    return u;
  }
  function Fe(t) {
    var n, i, r, e, u;
    if (t[He]) return t[He];
    t[He] = A();
    var o = t[He];
    tt(o);
    var h = N(
      N({}, null !== (n = t.AMP_CONFIG) && void 0 !== n ? n : {}),
      null !== (i = t.AMP_EXP) && void 0 !== i
        ? i
        : ut(
            (null === (r = t.__AMP_EXP) || void 0 === r
              ? void 0
              : r.textContent) || '{}'
          )
    );
    for (var a in h) {
      var f = h[a];
      'number' == typeof f && f >= 0 && f <= 1 && (o[a] = Math.random() < f);
    }
    var c =
      null === (e = t.AMP_CONFIG) || void 0 === e
        ? void 0
        : e['allow-doc-opt-in'];
    if (G(c) && c.length) {
      var l = t.document.head.querySelector(
        'meta[name="amp-experiments-opt-in"]'
      );
      if (l)
        for (
          var v,
            d,
            m = s(
              (null === (v = l.getAttribute('content')) || void 0 === v
                ? void 0
                : v.split(',')) || [],
              !0
            );
          !(d = m()).done;

        ) {
          var p = d.value;
          c.includes(p) && (o[p] = !0);
        }
    }
    Object.assign(o, Be(t));
    var g =
      null === (u = t.AMP_CONFIG) || void 0 === u
        ? void 0
        : u['allow-url-opt-in'];
    if (G(g) && g.length)
      for (
        var b, y = gt(t.location.originalHash || t.location.hash), w = s(g, !0);
        !(b = w()).done;

      ) {
        var x = b.value,
          E = y['e-'.concat(x)];
        '1' == E && (o[x] = !0), '0' == E && (o[x] = !1);
      }
    return o;
  }
  function Be(t) {
    var n,
      i = '';
    try {
      var r;
      'localStorage' in t &&
        (i =
          null !== (r = t.localStorage.getItem(ze)) && void 0 !== r ? r : '');
    } catch (t) {
      Xt().warn(Ue, 'Failed to retrieve experiments from localStorage.');
    }
    for (
      var e,
        u =
          (null === (n = i) || void 0 === n ? void 0 : n.split(/\s*,\s*/g)) ||
          [],
        o = A(),
        h = s(u, !0);
      !(e = h()).done;

    ) {
      var a = e.value;
      a && ('-' == a[0] ? (o[a.substr(1)] = !1) : (o[a] = !0));
    }
    return o;
  }
  function qe(t, n, i, r) {
    var e = t,
      u = i,
      o = function (t) {
        try {
          return u(t);
        } catch (t) {
          var n, i;
          throw (
            (null === (n = (i = self).__AMP_REPORT_ERROR) ||
              void 0 === n ||
              n.call(i, t),
            t)
          );
        }
      },
      s = (function () {
        if (void 0 !== Le) return Le;
        Le = !1;
        try {
          var t = {
            get capture() {
              return (Le = !0), !1;
            },
          };
          self.addEventListener('test-options', null, t),
            self.removeEventListener('test-options', null, t);
        } catch (t) {}
        return Le;
      })(),
      h = !(null == r || !r.capture);
    return (
      e.addEventListener(n, o, s ? r : h),
      function () {
        null == e || e.removeEventListener(n, o, s ? r : h),
          (u = null),
          (e = null),
          (o = null);
      }
    );
  }
  var We = 'Failed to load:';
  function $e(t, n, i, r) {
    var e = { detail: i };
    if ((Object.assign(e, r), 'function' == typeof t.CustomEvent))
      return new t.CustomEvent(n, e);
    var u = t.document.createEvent('CustomEvent');
    return u.initCustomEvent(n, !!e.bubbles, !!e.cancelable, i), u;
  }
  function Ye(t, n, i, r) {
    return qe(t, n, i, r);
  }
  function Ke(t) {
    return t.data;
  }
  function Xe(t, n, i, r) {
    var e = i,
      u = qe(
        t,
        n,
        function (t) {
          try {
            e(t);
          } finally {
            (e = null), u();
          }
        },
        r
      );
    return u;
  }
  function Je(t) {
    var n, i;
    if (
      (function (t) {
        return !!(
          t.complete ||
          'complete' == t.readyState ||
          (Qe(t) && t.readyState > 0) ||
          (t.document && 'complete' == t.document.readyState)
        );
      })(t)
    )
      return Promise.resolve(t);
    var r = Qe(t);
    return r && t.__AMP_MEDIA_LOAD_FAILURE_SRC === t.currentSrc
      ? Promise.reject(t)
      : new Promise(function (e, u) {
          if (
            ((n = r
              ? Xe(t, 'loadedmetadata', e, { capture: !0 })
              : Xe(t, 'load', e)),
            t.tagName)
          ) {
            var o = t;
            if (
              r &&
              !t.hasAttribute('src') &&
              !(o = bn(t, function (t) {
                return 'SOURCE' === t.tagName;
              }))
            )
              return u(new Error('Media has no source.'));
            i = Xe(o, 'error', u);
          }
        }).then(
          function () {
            return i && i(), t;
          },
          function () {
            n && n(),
              (function (t) {
                Qe(t) && (t.__AMP_MEDIA_LOAD_FAILURE_SRC = t.currentSrc || !0);
                var n = t;
                throw (n && n.src && (n = n.src), Yt().createError(We, n));
              })(t);
          }
        );
  }
  function Qe(t) {
    return 'AUDIO' === t.tagName || 'VIDEO' === t.tagName;
  }
  var Ze = {
    'amp-dynamic-css-classes': '[custom-element=amp-dynamic-css-classes]',
    variant: 'amp-experiment',
  };
  function tu(t) {
    var n = t.document;
    return (
      Jt(n.body),
      Object.keys(Ze).filter(function (t) {
        return n.querySelector(Ze[t]);
      })
    );
  }
  function nu(t, n, i, r, e) {
    var u = t.getHeadNode(),
      o = (function (t, n, i, r) {
        var e = t.__AMP_CSS_SM;
        e || (e = t.__AMP_CSS_SM = A());
        var u = !i && r && 'amp-custom' != r && 'amp-keyframes' != r,
          o = i ? 'amp-runtime' : u ? 'amp-extension='.concat(r) : null;
        if (o) {
          var s = iu(t, e, o);
          if (s)
            return (
              'STYLE' == s.tagName &&
                s.textContent !== n &&
                (s.textContent = n),
              s
            );
        }
        var h = (t.ownerDocument || t).createElement('style');
        h.textContent = n;
        var a = null;
        return (
          i
            ? h.setAttribute('amp-runtime', '')
            : u
            ? (h.setAttribute('amp-extension', r || ''),
              (a = iu(t, e, 'amp-runtime')))
            : (r && h.setAttribute(r, ''), (a = t.lastChild)),
          (function (t, n) {
            var i =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : null;
            if (i) {
              var r = i.nextSibling;
              t.insertBefore(n, r);
            } else On(t, n);
          })(t, h, a),
          o && (e[o] = h),
          h
        );
      })(
        u,
        (function (t, n) {
          var i = t.__AMP_CSS_TR;
          return i ? i(n) : n;
        })(u, n),
        r || !1,
        e || null
      );
    if (i) {
      var s = t.getRootNode();
      if (ou(s, o)) return i(o), o;
      var h = setInterval(function () {
        ou(s, o) && (clearInterval(h), i(o));
      }, 4);
    }
    return o;
  }
  function iu(t, n, i) {
    if (n[i]) return n[i];
    var r = t.querySelector('style['.concat(i, '], link[').concat(i, ']'));
    return r ? ((n[i] = r), r) : null;
  }
  var ru = !1;
  function eu(t) {
    Jt(t.defaultView), ru || ((ru = !0), uu(t));
  }
  function uu(t) {
    Sr(t.body, { opacity: 1, visibility: 'visible', animation: 'none' });
  }
  function ou(t, n) {
    for (var i = t.styleSheets, r = 0; r < i.length; r++)
      if (i[r].ownerNode == n) return !0;
    return !1;
  }
  var su,
    hu,
    au = (function () {
      function t(t) {
        (this.zt = t), (this.It = 0), (this.Ct = 0), (this.Ot = A());
      }
      var n = t.prototype;
      return (
        (n.has = function (t) {
          return !!this.Ot[t];
        }),
        (n.get = function (t) {
          var n = this.Ot[t];
          if (n) return (n.access = ++this.Ct), n.payload;
        }),
        (n.put = function (t, n) {
          this.has(t) || this.It++,
            (this.Ot[t] = { payload: n, access: this.Ct }),
            this.qt();
        }),
        (n.qt = function () {
          if (!(this.It <= this.zt)) {
            var t,
              n = this.Ot,
              i = this.Ct + 1;
            for (var r in n) {
              var e = n[r].access;
              e < i && ((i = e), (t = r));
            }
            void 0 !== t && (delete n[t], this.It--);
          }
        }),
        t
      );
    })(),
    fu = new Set(['c', 'v', 'a', 'ad']),
    cu = '__amp_source_origin',
    lu = function (t) {
      return 'string' == typeof t ? vu(t) : t;
    };
  function vu(t, n) {
    return (
      su ||
        ((su = self.document.createElement('a')),
        (hu = self.__AMP_URL_CACHE || (self.__AMP_URL_CACHE = new au(100)))),
      du(su, t, n ? null : hu)
    );
  }
  function du(t, n, i) {
    if (i && i.has(n)) return i.get(n);
    (t.href = n), t.protocol || (t.href = t.href);
    var r,
      e = {
        href: t.href,
        protocol: t.protocol,
        host: t.host,
        hostname: t.hostname,
        port: '0' == t.port ? '' : t.port,
        pathname: t.pathname,
        search: t.search,
        hash: t.hash,
        origin: null,
      };
    '/' !== e.pathname[0] && (e.pathname = '/' + e.pathname),
      (('http:' == e.protocol && 80 == e.port) ||
        ('https:' == e.protocol && 443 == e.port)) &&
        ((e.port = ''), (e.host = e.hostname)),
      (r =
        t.origin && 'null' != t.origin
          ? t.origin
          : 'data:' != e.protocol && e.host
          ? e.protocol + '//' + e.host
          : e.href),
      (e.origin = r);
    var u = e;
    return i && i.put(n, u), u;
  }
  function mu(t, n, i) {
    if (!n) return t;
    var r = t.split('#', 2),
      e = r[0].split('?', 2);
    return (
      e[0] +
      (e[1]
        ? i
          ? '?'.concat(n, '&').concat(e[1])
          : '?'.concat(e[1], '&').concat(n)
        : '?'.concat(n)) +
      (r[1] ? '#'.concat(r[1]) : '')
    );
  }
  function pu(t, n) {
    return ''.concat(encodeURIComponent(t), '=').concat(encodeURIComponent(n));
  }
  function gu(t, n) {
    return mu(t, bu(n));
  }
  function bu(t) {
    var n = [];
    for (var i in t) {
      var r = t[i];
      if (null != r) {
        r = V(r);
        for (var e = 0; e < r.length; e++) n.push(pu(i, r[e]));
      }
    }
    return n.join('&');
  }
  function yu(t) {
    return (
      'https:' == (t = lu(t)).protocol ||
      'localhost' == t.hostname ||
      '127.0.0.1' == t.hostname ||
      ((i = '.localhost'),
      (r = (n = t.hostname).length - i.length) >= 0 && n.indexOf(i, r) == r)
    );
    var n, i, r;
  }
  function wu(t, n) {
    var i =
      arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 'source';
    return (
      Qt(null != t, '%s %s must be available', n, i),
      Qt(
        yu(t) || /^\/\//.test(t),
        '%s %s must start with "https://" or "//" or be relative and served from either https or from localhost. Invalid value: %s',
        n,
        i,
        t
      ),
      t
    );
  }
  function Au(t) {
    var n = t.indexOf('#');
    return -1 == n ? t : t.substring(0, n);
  }
  function xu(t) {
    return wt.test(lu(t).origin);
  }
  function Eu(t) {
    return !(t && dt.includes(lu(t).protocol));
  }
  function Pu(t) {
    var n = vu(t),
      i = n.hash;
    return n.origin + n.pathname + Tu(n.search) + i;
  }
  function Tu(t) {
    return (function (t, n) {
      if (!t || '?' == t) return '';
      var i = new RegExp(
          '[?&]'.concat('(amp_(js[^&=]*|gsa|r|kit)|usqp)', '\\b[^&]*'),
          'g'
        ),
        r = t.replace(i, '').replace(/^[?&]/, '');
      return r ? '?' + r : '';
    })(t);
  }
  function Ou(t) {
    if (!xu((t = lu(t)))) return t.href;
    var n = t.pathname.split('/'),
      i = n[1];
    Qt(fu.has(i), 'Unknown path prefix in url %s', t.href);
    var r = n[2],
      e =
        's' == r
          ? 'https://' + decodeURIComponent(n[3])
          : 'http://' + decodeURIComponent(r);
    return (
      Qt(e.indexOf('.') > 0, 'Expected a . in origin %s', e),
      n.splice(1, 's' == r ? 3 : 2),
      e + n.join('/') + Tu(t.search) + (t.hash || '')
    );
  }
  function Iu(t) {
    return vu(Ou(t)).origin;
  }
  function Ru(t, n) {
    return (
      (n = lu(n)),
      'function' == typeof URL
        ? new URL(t, n.href).toString()
        : (function (t, n) {
            n = lu(n);
            var i = vu((t = t.replace(/\\/g, '/')));
            return t.toLowerCase().startsWith(i.protocol)
              ? i.href
              : t.startsWith('//')
              ? n.protocol + t
              : t.startsWith('/')
              ? n.origin + t
              : n.origin + n.pathname.replace(/\/[^/]*$/, '/') + t;
          })(t, n)
    );
  }
  function Su(t, n) {
    return (
      _u(n),
      (function (t, n, i, r) {
        return mu(t, pu('__amp_source_origin', i), void 0);
      })(n, 0, Iu(t.location.href))
    );
  }
  function _u(t) {
    var n = gt(vu(t).search);
    Qt(!(cu in n), 'Source origin is not allowed in %s', t);
  }
  var Mu = 'CANCELLED',
    ku = 'BLOCK_BY_CONSENT',
    Cu = self.__AMP_ERRORS || [];
  self.__AMP_ERRORS = Cu;
  var Nu = function (t) {
    return ((n = 0),
    (i = function () {
      var t = Math.pow(1.5, n++);
      return (
        1e3 *
        (t +
          (function (t, n) {
            var i = t * (n = n || 0.3) * Math.random();
            return Math.random() > 0.5 && (i *= -1), i;
          })(t))
      );
    }),
    (Nu = function (t) {
      return setTimeout(t, i());
    }))(t);
    var n, i;
  };
  function ju(t, n) {
    try {
      if (t)
        if (void 0 !== t.message) t = c(t);
        else {
          var i = t;
          (t = new Error(
            (function (t) {
              try {
                return JSON.stringify(t);
              } catch (n) {
                return String(t);
              }
            })(i)
          )).origError = i;
        }
      else t = new Error('Unknown error');
      if (t.reported) return t;
      if (((t.reported = !0), t.messageArray)) {
        var r = (function (t, n) {
          for (var i = 0; i < t.length; i++)
            if (null == (r = t[i]) ? void 0 : r.tagName) return i;
          var r;
          return -1;
        })(t.messageArray);
        r > -1 && (t.associatedElement = t.messageArray[r]);
      }
      var e = n || t.associatedElement;
      if (
        (e &&
          e.classList &&
          (e.classList.add('i-amphtml-error'),
          Ct().development &&
            (e.classList.add('i-amphtml-element-error'),
            e.setAttribute('error-message', t.message))),
        self.console && (J(t.message) || !t.expected))
      ) {
        var u = console.error || console.log;
        t.messageArray
          ? u.apply(console, t.messageArray)
          : e
          ? u.call(console, t.message, e)
          : u.call(console, t.message);
      }
      e &&
        e.dispatchCustomEventForTesting &&
        e.dispatchCustomEventForTesting('amp:error', t.message),
        Uu.call(self, void 0, void 0, void 0, void 0, t);
    } catch (t) {
      setTimeout(function () {
        throw t;
      });
    }
    return t;
  }
  function Du() {
    return new Error(Mu);
  }
  function Lu(t) {
    return (
      !!t &&
      ('string' == typeof t
        ? t.startsWith(ku)
        : 'string' == typeof t.message && t.message.startsWith(ku))
    );
  }
  function Uu(t, n, i, r, e) {
    var u = this;
    if (
      (!this || !this.document || (e && e.expected) || eu(this.document),
      !Ct().development)
    ) {
      var o = !1;
      try {
        o = (function (t) {
          if (!t.document) return !1;
          for (
            var n = t.document.querySelectorAll('script[src]'), i = 0;
            i < n.length;
            i++
          )
            if (!xu(n[i].src.toLowerCase())) return !0;
          return !1;
        })(self);
      } catch (t) {}
      if (!(o && Math.random() < 0.99)) {
        var s = (function (t, n, i, r, e, u) {
          t = (function (t, n) {
            return (
              n && (t = n.message ? n.message : String(n)),
              t || (t = 'Unknown error'),
              t
            );
          })(t, e);
          var o = !(!e || !e.expected);
          if (!/_reported_/.test(t) && t != Mu) {
            var s = !(self && self.window),
              h = Math.random();
            if (
              !(
                ((function (t) {
                  return -1 != t.indexOf(We);
                })(t) ||
                  'Script error.' == t ||
                  s) &&
                ((o = !0), h < 0.9999)
              )
            ) {
              var a = J(t);
              if (!(a && h < 0.99)) {
                var f = Object.create(null);
                (f.v = Ct().rtvVersion),
                  (f.noAmp = u ? '1' : '0'),
                  (f.m = t.replace(Y, '')),
                  (f.a = a ? '1' : '0'),
                  (f.ex = o ? '1' : '0'),
                  (f.dw = s ? '1' : '0');
                var c,
                  l,
                  v = '1p';
                if (
                  (self.context && self.context.location
                    ? ((v = '3p'), (f['3p'] = '1'))
                    : Ct().runtime && (v = Ct().runtime),
                  (f.rt = v),
                  (f.cdn = Tt),
                  'inabox' === v && (f.adid = Ct().a4aId),
                  (f.ca =
                    null !== (l = self.AMP_CONFIG) && void 0 !== l && l.canary
                      ? '1'
                      : '0'),
                  (f.bt =
                    (null === (c = self.AMP_CONFIG) || void 0 === c
                      ? void 0
                      : c.type) || 'unknown'),
                  self.location.ancestorOrigins &&
                    self.location.ancestorOrigins[0] &&
                    (f.or = self.location.ancestorOrigins[0]),
                  self.viewerState && (f.vs = self.viewerState),
                  self.parent && self.parent != self && (f.iem = '1'),
                  self.AMP && self.AMP.viewer)
                ) {
                  var d = self.AMP.viewer.getResolvedViewerUrl(),
                    m = self.AMP.viewer.maybeGetMessagingOrigin();
                  d && (f.rvu = d), m && (f.mso = m);
                }
                var p,
                  g,
                  b,
                  y = [],
                  w = self[He] || null;
                for (var A in w) {
                  var x = w[A];
                  y.push(''.concat(A, '=').concat(x ? '1' : '0'));
                }
                return (
                  (f.exps = y.join(',')),
                  e
                    ? ((f.el =
                        (null === (p = e.associatedElement) || void 0 === p
                          ? void 0
                          : p.tagName) || 'u'),
                      e.args && (f.args = JSON.stringify(e.args)),
                      a || e.ignoreStack || !e.stack || (f.s = e.stack),
                      e.message && (e.message += ' _reported_'))
                    : ((f.f = n || ''), (f.l = i || ''), (f.c = r || '')),
                  (f.r = self.document ? self.document.referrer : ''),
                  (f.ae = Cu.join(',')),
                  (f.fr = self.location.originalHash || self.location.hash),
                  'production' === f.bt && (f.pt = '1'),
                  (b = t),
                  (g = Cu).length >= 25 && g.splice(0, g.length - 25 + 1),
                  g.push(b),
                  f
                );
              }
            }
          }
        })(t, n, i, r, e, o);
        s &&
          Nu(function () {
            try {
              return (function (t, n) {
                return n.pt && Math.random() < 0.9
                  ? h()
                  : (function (t, n) {
                      var i = Ui(t);
                      if (!i.isSingleDoc()) return Promise.resolve(!1);
                      var r = i.getSingleDoc();
                      if (
                        !r
                          .getRootNode()
                          .documentElement.hasAttribute(
                            'report-errors-to-viewer'
                          )
                      )
                        return Promise.resolve(!1);
                      var e = nr(r);
                      return e.hasCapability('errorReporter')
                        ? e.isTrustedViewer().then(function (t) {
                            return (
                              !!t &&
                              (e.sendMessage('error', {
                                m: (i = n).m,
                                a: i.a,
                                s: i.s,
                                el: i.el,
                                ex: i.ex,
                                v: i.v,
                                pt: i.pt,
                              }),
                              !0)
                            );
                            var i;
                          })
                        : Promise.resolve(!1);
                    })(t, n).then(function (t) {
                      if (!t) {
                        var i = new XMLHttpRequest();
                        i.open('POST', Math.random() < 0.1 ? Rt : It, !0),
                          i.send(JSON.stringify(n));
                      }
                    });
              })(u, s).catch(function () {});
            } catch (t) {}
          });
      }
    }
  }
  var zu = 'Resource',
    Hu = (function () {
      function t(t, n, i) {
        (n.__AMP__RESOURCE = this),
          (this.Be = t),
          (this.element = n),
          (this.debugid = n.tagName.toLowerCase() + '#' + t),
          (this.hostWin = n.ownerDocument.defaultView),
          (this.qe = i),
          (this.We = n.hasAttribute('placeholder')),
          (this.$e = !1),
          (this.Ye = void 0),
          (this.Ke = n.isBuilt() ? 1 : 0),
          0 == this.Ke && n.isBuilding() && this.build(),
          (this.Xe = -1),
          (this.Je = 0),
          (this.Qe = null),
          (this.Ze = null),
          (this.tu = !1),
          (this.nu = Ln(-1e4, -1e4, 0, 0)),
          (this.iu = null),
          (this.ru = !1),
          (this.eu = null),
          (this.uu = null),
          (this.ou = void 0);
        var r = new a();
        (this.su = r.promise), (this.hu = r.resolve), (this.au = !1);
      }
      (t.forElement = function (n) {
        return Jt(t.forElementOptional(n));
      }),
        (t.forElementOptional = function (t) {
          return t.__AMP__RESOURCE;
        }),
        (t.setOwner = function (n, i) {
          Jt(i.contains(n)),
            t.forElementOptional(n) && t.forElementOptional(n).updateOwner(i),
            (n.__AMP__OWNER = i);
          for (
            var r = n.getElementsByClassName('i-amphtml-element'), e = 0;
            e < r.length;
            e++
          ) {
            var u = r[e];
            t.forElementOptional(u) &&
              t.forElementOptional(u).updateOwner(void 0);
          }
        });
      var n = t.prototype;
      return (
        (n.getId = function () {
          return this.Be;
        }),
        (n.updateOwner = function (t) {
          this.Ye = t;
        }),
        (n.getOwner = function () {
          if (void 0 === this.Ye) {
            for (var t = this.element; t; t = t.parentElement)
              if (t.__AMP__OWNER) {
                this.Ye = t.__AMP__OWNER;
                break;
              }
            void 0 === this.Ye && (this.Ye = null);
          }
          return this.Ye;
        }),
        (n.hasOwner = function () {
          return !!this.getOwner();
        }),
        (n.getLayoutPriority = function () {
          return -1 != this.Xe ? this.Xe : this.element.getLayoutPriority();
        }),
        (n.updateLayoutPriority = function (t) {
          this.Xe = t;
        }),
        (n.getState = function () {
          return this.Ke;
        }),
        (n.isBuilt = function () {
          return this.element.isBuilt();
        }),
        (n.isBuilding = function () {
          return this.$e;
        }),
        (n.whenBuilt = function () {
          return this.element.signals().whenSignal('res-built');
        }),
        (n.build = function () {
          var t = this;
          return this.$e || !this.element.isUpgraded()
            ? null
            : ((this.$e = !0),
              this.element.buildInternal().then(
                function () {
                  (t.$e = !1),
                    (t.Ke = 1),
                    t.element.signals().signal('res-built');
                },
                function (n) {
                  throw (
                    (t.maybeReportErrorOnBuildFailure(n),
                    (t.$e = !1),
                    t.element.signals().rejectSignal('res-built', n),
                    n)
                  );
                }
              ));
        }),
        (n.maybeReportErrorOnBuildFailure = function (t) {
          Lu(t) || Xt().error(zu, 'failed to build:', this.debugid, t);
        }),
        (n.changeSize = function (t, n, i) {
          this.element.applySize(t, n, i), this.requestMeasure();
        }),
        (n.overflowCallback = function (t, n, i, r) {
          t && (this.ou = { height: n, width: i, margins: r }),
            this.element.overflowCallback(t, n, i, r);
        }),
        (n.resetPendingChangeSize = function () {
          this.ou = void 0;
        }),
        (n.getPendingChangeSize = function () {
          return this.ou;
        }),
        (n.getUpgradeDelayMs = function () {
          return this.element.getUpgradeDelayMs();
        }),
        (n.measure = function () {
          if (
            !(
              this.We &&
              this.element.parentElement &&
              this.element.parentElement.tagName.startsWith('AMP-')
            ) ||
            '__AMP__RESOURCE' in this.element.parentElement
          )
            if (
              this.element.ownerDocument &&
              this.element.ownerDocument.defaultView
            ) {
              this.ru = !1;
              var t = this.nu;
              this.fu();
              var n,
                i,
                r = this.nu,
                e =
                  ((i = r),
                  !((n = t).width == i.width && n.height === i.height));
              (1 == this.Ke || t.top != r.top || e) &&
                this.element.isUpgraded() &&
                (1 == this.Ke
                  ? (this.Ke = 2)
                  : (4 != this.Ke && 5 != this.Ke) ||
                    !this.element.isRelayoutNeeded() ||
                    (this.Ke = 2)),
                this.hasBeenMeasured() || (this.iu = r),
                this.element.updateLayoutBox(r, e);
            } else this.Ke = 1;
        }),
        (n.ensureMeasured = function () {
          var t = this;
          return this.hasBeenMeasured()
            ? h()
            : ir(this.hostWin).measure(function () {
                return t.measure();
              });
        }),
        (n.fu = function () {
          var t = rr(this.element);
          this.nu = t.getLayoutRect(this.element);
          var n = !1;
          if (t.supportsPositionFixed() && this.isDisplayed())
            for (
              var i = this.qe.getAmpdoc().win,
                r = i.document.body,
                e = this.element;
              e && e != r;
              e = e.offsetParent
            ) {
              if (e.isAlwaysFixed && e.isAlwaysFixed()) {
                n = !0;
                break;
              }
              if (t.isDeclaredFixed(e) && 'fixed' == Cr(i, e).position) {
                n = !0;
                break;
              }
            }
          (this.tu = n),
            n && (this.nu = zn(this.nu, -t.getScrollLeft(), -t.getScrollTop()));
        }),
        (n.completeCollapse = function () {
          _r(this.element, !1),
            (this.nu = Ln(this.nu.left, this.nu.top, 0, 0)),
            (this.tu = !1),
            this.element.updateLayoutBox(this.getLayoutBox());
          var t = this.getOwner();
          t && t.collapsedCallback(this.element);
        }),
        (n.completeExpand = function () {
          _r(this.element, !0), this.requestMeasure();
        }),
        (n.isMeasureRequested = function () {
          return this.ru;
        }),
        (n.hasBeenMeasured = function () {
          return !!this.iu;
        }),
        (n.requestMeasure = function () {
          this.ru = !0;
        }),
        (n.getLayoutSize = function () {
          return (n = (t = this.nu).height), { width: t.width, height: n };
          var t, n;
        }),
        (n.getLayoutBox = function () {
          if (!this.tu) return this.nu;
          var t = rr(this.element);
          return zn(this.nu, t.getScrollLeft(), t.getScrollTop());
        }),
        (n.getInitialLayoutBox = function () {
          return this.iu || this.nu;
        }),
        (n.isDisplayed = function () {
          if (
            !this.element.ownerDocument ||
            !this.element.ownerDocument.defaultView
          )
            return !1;
          var t = this.element.getLayout() == ue,
            n = this.getLayoutBox(),
            i = n.height > 0 && n.width > 0;
          return t || i;
        }),
        (n.isFixed = function () {
          return this.tu;
        }),
        (n.overlaps = function (t) {
          return (
            (i = t),
            (n = this.getLayoutBox()).top <= i.bottom &&
              i.top <= n.bottom &&
              n.left <= i.right &&
              i.left <= n.right
          );
          var n, i;
        }),
        (n.prerenderAllowed = function () {
          return this.element.prerenderAllowed();
        }),
        (n.previewAllowed = function () {
          return this.element.previewAllowed();
        }),
        (n.isBuildRenderBlocking = function () {
          return this.element.isBuildRenderBlocking();
        }),
        (n.whenWithinViewport = function (t) {
          if ((Jt(!1 !== t), !this.isLayoutPending() || !0 === t)) return h();
          var n = t,
            i = String(n);
          return this.eu && this.eu[i]
            ? this.eu[i].promise
            : this.isWithinViewportRatio(n)
            ? h()
            : ((this.eu = this.eu || {}),
              (this.eu[i] = new a()),
              this.eu[i].promise);
        }),
        (n.cu = function () {
          if (this.eu) {
            var t = this.getDistanceViewportRatio();
            for (var n in this.eu)
              this.isWithinViewportRatio(parseFloat(n), t) &&
                (this.eu[n].resolve(), delete this.eu[n]);
          }
        }),
        (n.getDistanceViewportRatio = function () {
          var t = rr(this.element).getRect(),
            n = this.getLayoutBox(),
            i = this.qe.getScrollDirection(),
            r = 1,
            e = 0;
          if (t.right < n.left || t.left > n.right) return { distance: !1 };
          if (t.bottom < n.top) (e = n.top - t.bottom), -1 == i && (r = 2);
          else {
            if (!(t.top > n.bottom)) return { distance: !0 };
            (e = t.top - n.bottom), 1 == i && (r = 2);
          }
          return { distance: e, scrollPenalty: r, viewportHeight: t.height };
        }),
        (n.isWithinViewportRatio = function (t, n) {
          if ('boolean' == typeof t) return t;
          var i = n || this.getDistanceViewportRatio(),
            r = i.distance,
            e = i.scrollPenalty,
            u = i.viewportHeight;
          return 'boolean' == typeof r ? r : r < (u * t) / e;
        }),
        (n.renderOutsideViewport = function () {
          return (
            this.cu(),
            this.hasOwner() ||
              this.isWithinViewportRatio(this.element.renderOutsideViewport())
          );
        }),
        (n.idleRenderOutsideViewport = function () {
          return this.isWithinViewportRatio(
            this.element.idleRenderOutsideViewport()
          );
        }),
        (n.layoutScheduled = function (t) {
          (this.Ke = 3), (this.element.layoutScheduleTime = t);
        }),
        (n.layoutCanceled = function () {
          this.Ke = this.hasBeenMeasured() ? 2 : 1;
        }),
        (n.startLayout = function () {
          var t = this;
          if (this.uu) return this.uu;
          if (4 == this.Ke) return h();
          if (5 == this.Ke) return Promise.reject(this.Ze);
          if ((Jt(0 != this.Ke), Jt(this.isDisplayed()), 3 != this.Ke)) {
            var n = Xt().createExpectedError(
              'startLayout called but not LAYOUT_SCHEDULED',
              'currently: ',
              this.Ke
            );
            return ju(n, this.element), Promise.reject(n);
          }
          if (this.Je > 0 && !this.element.isRelayoutNeeded())
            return (
              Xt().fine(
                zu,
                "layout canceled since it wasn't requested:",
                this.debugid,
                this.Ke
              ),
              (this.Ke = 4),
              h()
            );
          Xt().fine(zu, 'start layout:', this.debugid, 'count:', this.Je),
            this.Je++,
            (this.Ke = 3),
            (this.Qe = new AbortController());
          var i = this.Qe.signal,
            r = new Promise(function (n, r) {
              ir(t.hostWin).mutate(function () {
                var e;
                try {
                  e = t.element.layoutCallback(i);
                } catch (t) {
                  r(t);
                }
                Promise.resolve(e).then(n, r);
              }),
                (i.onabort = function () {
                  return r(Du());
                });
            }).then(
              function () {
                return t.lu(!0, i);
              },
              function (n) {
                return t.lu(!1, i, n);
              }
            );
          return (this.uu = r);
        }),
        (n.lu = function (t, n, i) {
          if (((this.Qe = null), n.aborted)) {
            var r = Xt().createError('layoutComplete race');
            throw (
              ((r.associatedElement = this.element),
              Xt().expectedError(zu, r),
              Du())
            );
          }
          if (
            (this.hu && (this.hu(), (this.hu = null)),
            (this.uu = null),
            (this.Ke = t ? 4 : 5),
            (this.Ze = i),
            !t)
          )
            return (
              Xt().fine(zu, 'loading failed:', this.debugid, i),
              Promise.reject(i)
            );
          Xt().fine(zu, 'layout complete:', this.debugid);
        }),
        (n.isLayoutPending = function () {
          return 4 != this.Ke && 5 != this.Ke;
        }),
        (n.loadedOnce = function () {
          return this.element.R1() ? this.element.whenLoaded() : this.su;
        }),
        (n.isInViewport = function () {
          return this.au && this.cu(), this.au;
        }),
        (n.setInViewport = function (t) {
          this.au = t;
        }),
        (n.unlayout = function () {
          0 != this.Ke &&
            1 != this.Ke &&
            2 != this.Ke &&
            (this.Qe && (this.Qe.abort(), (this.Qe = null)),
            this.setInViewport(!1),
            this.element.unlayoutCallback() &&
              (this.element.togglePlaceholder(!0),
              (this.Ke = 1),
              (this.Je = 0),
              (this.uu = null)));
        }),
        (n.getTaskId = function (t) {
          return this.debugid + '#' + t;
        }),
        (n.pause = function () {
          this.element.pause();
        }),
        (n.pauseOnRemove = function () {
          this.element.pause();
        }),
        (n.resume = function () {
          this.element.resume();
        }),
        (n.unload = function () {
          this.element.unmount();
        }),
        (n.disconnect = function () {
          delete this.element.__AMP__RESOURCE, this.element.disconnect(!0);
        }),
        t
      );
    })(),
    Gu = 'ready-scan',
    Vu = 'scheduler',
    Fu = '250% 31.25%',
    Bu = (function () {
      function t(t) {
        var n = this;
        this.vu = t;
        var i = t.win;
        (this.du = new i.IntersectionObserver(
          function (t) {
            return n.mu(t);
          },
          { root: kn(i) ? i.document : null, rootMargin: Fu }
        )),
          (this.pu = new Map()),
          (this.gu = new Map()),
          (this.bu = []),
          (this.yu = !1),
          t.whenReady().then(function () {
            return n.wu();
          }),
          (this.Au = t.onVisibilityChanged(function () {
            return n.xu();
          }));
      }
      var n = t.prototype;
      return (
        (n.dispose = function () {
          this.du.disconnect(),
            this.gu.clear(),
            this.Au && (this.Au(), (this.Au = null));
        }),
        (n.scheduleAsap = function (t) {
          this.gu.set(t, { asap: !0, isIntersecting: !1 }), this.Eu(t);
        }),
        (n.schedule = function (t) {
          this.gu.has(t) ||
            (t.deferredMount()
              ? (this.gu.set(t, { asap: !1, isIntersecting: !1 }),
                this.du.observe(t),
                this.pu.size > 0 &&
                  this.pu.forEach(function (n, i) {
                    Nn(i, t) && n.observe(t);
                  }))
              : this.gu.set(t, { asap: !1, isIntersecting: !0 }),
            this.Eu(t));
        }),
        (n.unschedule = function (t) {
          this.gu.has(t) &&
            (this.gu.delete(t),
            this.du.unobserve(t),
            this.pu.size > 0 &&
              this.pu.forEach(function (n) {
                n.unobserve(t);
              }),
            this.bu && (B(this.bu, t), this.wu()));
        }),
        (n.setContainer = function (t, n) {
          var i = this;
          if (!this.pu.has(t)) {
            var r = new this.vu.win.IntersectionObserver(
              function (t) {
                return i.mu(t);
              },
              { root: n || t, rootMargin: Fu }
            );
            this.pu.set(t, r),
              this.gu.forEach(function (n, i) {
                !n.asap && Nn(t, i) && r.observe(i);
              });
          }
        }),
        (n.removeContainer = function (t) {
          var n = this.pu.get(t);
          n && (n.disconnect(), this.pu.delete(t));
        }),
        (n.Pu = function () {
          var t = this;
          this.vu.isReady() &&
            !this.yu &&
            ((this.yu = !0),
            this.vu.win.setTimeout(function () {
              t.vu.signals().signal(Gu);
            }, 50));
        }),
        (n.xu = function () {
          var t = this,
            n = this.vu.getVisibilityState();
          (n != or && n != sr && n != er && n != ur) ||
            this.gu.forEach(function (n, i) {
              return t.Tu(i);
            });
        }),
        (n.Eu = function (t) {
          var n = this.bu;
          n ? (n.includes(t) || n.push(t), this.wu()) : this.Tu(t);
        }),
        (n.wu = function () {
          var t = this.vu.isReady(),
            n = this.bu;
          if (n)
            for (var i = 0; i < n.length; i++) {
              var r = n[i];
              (t || _n(r, this.vu.getRootNode())) &&
                (n.splice(i--, 1), this.Tu(r));
            }
          t && ((this.bu = null), this.Pu());
        }),
        (n.mu = function (t) {
          for (var n = 0; n < t.length; n++) {
            var i = t[n],
              r = i.isIntersecting,
              e = i.target,
              u = this.gu.get(e);
            if (u) {
              var o = r || u.isIntersecting;
              o !== u.isIntersecting &&
                this.gu.set(e, { asap: u.asap, isIntersecting: o }),
                o && this.Tu(e);
            }
          }
        }),
        (n.Tu = function (t) {
          var n = this.bu,
            i = !(n && n.includes(t)),
            r = this.gu.get(t) || { asap: !1, isIntersecting: !1 },
            e = r.asap,
            u = r.isIntersecting,
            o = this.vu.getVisibilityState();
          if (
            i &&
            (e || u) &&
            (o == or ||
              o == sr ||
              (o == er && t.prerenderAllowed()) ||
              (o == ur && t.previewAllowed()))
          ) {
            this.unschedule(t);
            var s = this.vu.win;
            (e || t.getBuildPriority() <= 0
              ? s.setTimeout
              : s.requestIdleCallback || s.setTimeout)(function () {
              return t.mountInternal();
            });
          }
        }),
        t
      );
    })();
  function qu(t) {
    return fi(t, Vu, Bu), vi(t, Vu);
  }
  var Wu = (function () {
      function t() {
        this.Ou = [];
      }
      var i = t.prototype;
      return (
        (i.peek = function () {
          var t = this.length;
          return t ? this.Ou[t - 1].item : null;
        }),
        (i.enqueue = function (t, n) {
          if (isNaN(n)) throw new Error('Priority must not be NaN.');
          var i = this.Iu(n);
          this.Ou.splice(i, 0, { item: t, priority: n });
        }),
        (i.Iu = function (t) {
          for (
            var n = -1, i = 0, r = this.length;
            i <= r && (n = Math.floor((i + r) / 2)) !== this.length;

          )
            if (this.Ou[n].priority < t) i = n + 1;
            else {
              if (!(n > 0 && this.Ou[n - 1].priority >= t)) break;
              r = n - 1;
            }
          return n;
        }),
        (i.forEach = function (t) {
          for (var n = this.length; n--; ) t(this.Ou[n].item);
        }),
        (i.dequeue = function () {
          var t = this.Ou.pop();
          return t ? t.item : null;
        }),
        n(t, [
          {
            key: 'length',
            get: function () {
              return this.Ou.length;
            },
          },
        ]),
        t
      );
    })(),
    $u = 'CHUNK',
    Yu = /nochunking=1/.test(self.location.hash),
    Ku = !1,
    Xu = h();
  function Ju(t, n, i) {
    if (Yu) Xu.then(n);
    else {
      var r,
        e = (fi((r = t.documentElement || t), 'chunk', no), vi(r, 'chunk'));
      e.runForStartup(n),
        i &&
          e.runForStartup(function () {
            e.Ru = !0;
          });
    }
  }
  var Qu = 'not_run',
    Zu = (function () {
      function t(t) {
        (this.state = Qu), (this.Su = t);
      }
      var n = t.prototype;
      return (
        (n._u = function (t) {
          if ('run' != this.state) {
            this.state = 'run';
            try {
              this.Su(t);
            } catch (t) {
              throw (this.Mu(t), t);
            }
          }
        }),
        (n.ku = function () {
          return this.Su.displayName || this.Su.name;
        }),
        (n.Mu = function (t) {}),
        (n.Cu = function () {
          return !1;
        }),
        (n.Nu = function () {
          return !1;
        }),
        t
      );
    })(),
    to = (function (t) {
      D(i, t);
      var n = z(i);
      function i(t, i, r) {
        var e;
        return ((e = n.call(this, t)).ju = r), e;
      }
      var r = i.prototype;
      return (
        (r.Mu = function (t) {
          eu(self.document);
        }),
        (r.Cu = function () {
          return this.Du();
        }),
        (r.Nu = function () {
          return this.ju.Lu;
        }),
        (r.Du = function () {
          return this.ju.ampdoc.isVisible();
        }),
        i
      );
    })(Zu),
    no = (function () {
      function t(t) {
        var n,
          i = this;
        (this.ampdoc = t),
          (this.t = t.win),
          (this.Uu = new Wu()),
          (this.zu = this.Hu.bind(this)),
          (this.Gu = 0),
          (this.Vu = !(
            !this.t.navigator.scheduling ||
            !this.t.navigator.scheduling.isInputPending
          )),
          (this.Fu = !1),
          (this.Ru = this.t.document.documentElement.hasAttribute(
            'i-amphtml-no-boilerplate'
          )),
          this.t.addEventListener('message', function (t) {
            'amp-macro-task' == Ke(t) && i.Hu(null);
          }),
          (this.Lu = !1),
          ((n = t), mi(n, 'viewer')).then(function () {
            i.Lu = !0;
          }),
          t.onVisibilityChanged(function () {
            t.isVisible() && i.Bu();
          });
      }
      var n = t.prototype;
      return (
        (n.run = function (t, n) {
          var i = new Zu(t);
          this.qu(i, n);
        }),
        (n.runForStartup = function (t) {
          var n = new to(t, this.t, this);
          this.qu(n, Number.POSITIVE_INFINITY);
        }),
        (n.qu = function (t, n) {
          this.Uu.enqueue(t, n), this.Bu();
        }),
        (n.Wu = function (t) {
          for (var n = this.Uu.peek(); n && n.state !== Qu; )
            this.Uu.dequeue(), (n = this.Uu.peek());
          return n && t && this.Uu.dequeue(), n;
        }),
        (n.Hu = function (t) {
          var n,
            i = this,
            r = this.Wu(!0);
          if (!r) return (this.Fu = !1), (this.Gu = 0), !1;
          try {
            (n = Date.now()), r._u(t);
          } finally {
            Xu.then()
              .then()
              .then()
              .then()
              .then()
              .then()
              .then()
              .then()
              .then(function () {
                (i.Fu = !1),
                  (i.Gu += Date.now() - n),
                  Xt().fine($u, r.ku(), 'Chunk duration', Date.now() - n, i.Gu),
                  i.Bu();
              });
          }
          return !0;
        }),
        (n.$u = function (t) {
          var n = this;
          if (
            !Ku &&
            this.Ru &&
            (this.Vu
              ? this.t.navigator.scheduling.isInputPending()
              : this.Gu > 5)
          )
            return (this.Gu = 0), void this.Yu();
          Xu.then(function () {
            n.zu(t);
          });
        }),
        (n.Bu = function () {
          if (!this.Fu) {
            var t = this.Wu();
            if (t)
              return t.Cu()
                ? ((this.Fu = !0), void this.$u(null))
                : void (t.Nu() && this.t.requestIdleCallback
                    ? (function (t, n, i, r) {
                        var e = Date.now();
                        t.requestIdleCallback(
                          function n(u) {
                            if (u.timeRemaining() < 15) {
                              var o = i - (Date.now() - e);
                              o <= 0 || u.didTimeout
                                ? (Xt().fine($u, 'Timed out', i, u.didTimeout),
                                  r(u))
                                : (Xt().fine(
                                    $u,
                                    'Rescheduling with',
                                    o,
                                    u.timeRemaining()
                                  ),
                                  t.requestIdleCallback(n, { timeout: o }));
                            } else
                              Xt().fine($u, 'Running idle callback with ', 15),
                                r(u);
                          },
                          { timeout: i }
                        );
                      })(this.t, 0, 2e3, this.zu)
                    : this.Yu());
          }
        }),
        (n.Yu = function () {
          this.t.postMessage('amp-macro-task', '*');
        }),
        t
      );
    })(),
    io = 'activate',
    ro = (function () {
      function t(t) {
        (this.element = t),
          (this.win = on(t)),
          (this.actionMap_ = null),
          (this.defaultActionAlias_ = null);
      }
      (t.R1 = function () {
        return !1;
      }),
        (t.deferredMount = function (t) {
          return !0;
        }),
        (t.prerenderAllowed = function (t) {
          return !1;
        }),
        (t.previewAllowed = function (t) {
          return this.prerenderAllowed(t);
        }),
        (t.usesLoading = function (t) {
          return !1;
        }),
        (t.createLoaderLogoCallback = function (t) {
          return {};
        }),
        (t.getBuildPriority = function (t) {
          return 0;
        }),
        (t.getPreconnects = function (t) {
          return null;
        }),
        (t.requiresShadowDom = function () {
          return !1;
        });
      var n = t.prototype;
      return (
        (n.signals = function () {
          return this.element.signals();
        }),
        (n.getDefaultActionAlias = function () {
          return this.defaultActionAlias_;
        }),
        (n.getLayoutPriority = function () {
          return 0;
        }),
        (n.updateLayoutPriority = function (t) {
          this.element.getResources().updateLayoutPriority(this.element, t);
        }),
        (n.getLayout = function () {
          return this.element.getLayout();
        }),
        (n.getLayoutBox = function () {
          return this.element.getLayoutBox();
        }),
        (n.getLayoutSize = function () {
          return this.element.getLayoutSize();
        }),
        (n.getAmpDoc = function () {
          return this.element.getAmpDoc();
        }),
        (n.getVsync = function () {
          return ir(this.win);
        }),
        (n.getConsentPolicy = function () {
          var t = null;
          return (
            this.element.hasAttribute('data-block-on-consent') &&
              (t =
                this.element.getAttribute('data-block-on-consent') ||
                'default'),
            t
          );
        }),
        (n.isLayoutSupported = function (t) {
          return t == Qr;
        }),
        (n.isAlwaysFixed = function () {
          return !1;
        }),
        (n.upgradeCallback = function () {
          return null;
        }),
        (n.buildCallback = function () {}),
        (n.preconnectCallback = function (t) {}),
        (n.attachedCallback = function () {}),
        (n.detachedCallback = function () {}),
        (n.setAsContainer = function (t) {
          this.element.setAsContainerInternal(t);
        }),
        (n.removeAsContainer = function () {
          this.element.removeAsContainerInternal();
        }),
        (n.isBuildRenderBlocking = function () {
          return !1;
        }),
        (n.createPlaceholderCallback = function () {
          return null;
        }),
        (n.renderOutsideViewport = function () {
          return 'inabox' == Ct(this.win).runtime || 3;
        }),
        (n.idleRenderOutsideViewport = function () {
          return !1;
        }),
        (n.ensureLoaded = function () {}),
        (n.setReadyState = function (t, n) {
          this.element.setReadyStateInternal(t, n);
        }),
        (n.mountCallback = function (t) {}),
        (n.unmountCallback = function () {}),
        (n.isRelayoutNeeded = function () {
          return !1;
        }),
        (n.layoutCallback = function () {
          return h();
        }),
        (n.firstLayoutCompleted = function () {
          this.togglePlaceholder(!1);
        }),
        (n.pauseCallback = function () {}),
        (n.resumeCallback = function () {}),
        (n.unlayoutCallback = function () {
          return !1;
        }),
        (n.unlayoutOnPause = function () {
          return !1;
        }),
        (n.reconstructWhenReparented = function () {
          return !0;
        }),
        (n.loadPromise = function (t) {
          return Je(t);
        }),
        (n.registerAction = function (t, n) {
          var i =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 2;
          eo(this), (this.actionMap_[t] = { handler: n, minTrust: i });
        }),
        (n.registerDefaultAction = function (t) {
          var n =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : io,
            i =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : 2;
          Jt(!this.defaultActionAlias_),
            this.registerAction(n, t, i),
            (this.defaultActionAlias_ = n);
        }),
        (n.executeAction = function (t, n) {
          var i = t.method;
          i === io && (i = this.defaultActionAlias_ || i), eo(this);
          var r = this.actionMap_[i],
            e = this.element.tagName;
          Qt(r, 'Method not found: '.concat(i, ' in ').concat(e));
          var u = r.handler,
            o = r.minTrust;
          if (t.satisfiesTrust(o)) return u(t);
        }),
        (n.forwardEvents = function (t, n) {
          var i = this,
            r = (G(t) ? t : [t]).map(function (t) {
              return Ye(n, t, function (n) {
                Cn(i.element, t, Ke(n) || {});
              });
            });
          return function () {
            return r.forEach(function (t) {
              return t();
            });
          };
        }),
        (n.getPlaceholder = function () {
          return this.element.getPlaceholder();
        }),
        (n.togglePlaceholder = function (t) {
          this.element.togglePlaceholder(t);
        }),
        (n.getFallback = function () {
          return this.element.getFallback();
        }),
        (n.toggleFallback = function (t) {
          this.element.toggleFallback(t);
        }),
        (n.toggleLoading = function (t) {
          var n =
            arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
          this.element.toggleLoading(t, n);
        }),
        (n.getOverflowElement = function () {
          return this.element.getOverflowElement();
        }),
        (n.renderStarted = function () {
          this.element.renderStarted();
        }),
        (n.getViewport = function () {
          return rr(this.getAmpDoc());
        }),
        (n.getIntersectionElementLayoutBox = function () {
          return this.getLayoutBox();
        }),
        (n.collapse = function () {
          Wi(this.getAmpDoc()).collapseElement(this.element);
        }),
        (n.attemptCollapse = function () {
          return Wi(this.getAmpDoc()).attemptCollapse(this.element);
        }),
        (n.forceChangeHeight = function (t) {
          Wi(this.getAmpDoc()).forceChangeSize(this.element, t, void 0);
        }),
        (n.attemptChangeHeight = function (t) {
          return Wi(this.getAmpDoc()).requestChangeSize(
            this.element,
            t,
            void 0
          );
        }),
        (n.attemptChangeSize = function (t, n, i) {
          return Wi(this.getAmpDoc()).requestChangeSize(
            this.element,
            t,
            n,
            void 0,
            i
          );
        }),
        (n.measureElement = function (t) {
          return Wi(this.getAmpDoc()).measureElement(t);
        }),
        (n.mutateElement = function (t, n) {
          return this.measureMutateElement(null, t, n);
        }),
        (n.measureMutateElement = function (t, n, i) {
          return Wi(this.getAmpDoc()).measureMutateElement(
            i || this.element,
            t,
            n
          );
        }),
        (n.mutateElementSkipRemeasure = function (t) {
          return Wi(this.getAmpDoc()).mutateElement(this.element, t, !0);
        }),
        (n.collapsedCallback = function (t) {}),
        (n.expand = function () {
          Wi(this.getAmpDoc()).expandElement(this.element);
        }),
        (n.mutatedAttributesCallback = function (t) {}),
        (n.onLayoutMeasure = function () {}),
        (n.user = function () {
          return Yt(this.element);
        }),
        (n.getApi = function () {
          return this;
        }),
        t
      );
    })();
  function eo(t) {
    t.actionMap_ || (t.actionMap_ = t.win.Object.create(null));
  }
  var uo = (function (t) {
      D(i, t);
      var n = z(i);
      function i() {
        return n.apply(this, arguments);
      }
      return i;
    })(ro),
    oo = 'amp-',
    so = 'send-positions',
    ho = 'position';
  function ao(t) {
    try {
      return !!t.location.href && (t.test || !0);
    } catch (t) {
      return !1;
    }
  }
  var fo,
    co = Date.now(),
    lo = { bubbles: !1 },
    vo = function () {
      return !0;
    },
    mo = [],
    po = new Set();
  function go(t) {
    return 'placeholder' in t;
  }
  function bo(t) {
    Jt(!t.Ku);
  }
  var yo = new WeakMap();
  function wo(t) {
    return (
      t.__AMP_EXTENDED_ELEMENTS || (t.__AMP_EXTENDED_ELEMENTS = {}),
      t.__AMP_EXTENDED_ELEMENTS
    );
  }
  function Ao(t, n, i) {
    var r = wo(t);
    if (r[n]) {
      if (r[n] != i) {
        Qt(
          r[n] == uo,
          '%s is already registered. The script tag for %s is likely included twice in the page.',
          n,
          n
        ),
          (r[n] = i);
        for (var e = 0; e < mo.length; e++) {
          var u = mo[e];
          u.tagName.toLowerCase() == n &&
            u.ownerDocument.defaultView == t &&
            (xo(u, i), mo.splice(e--, 1));
        }
      }
    } else Oo(t, n, i);
  }
  function xo(t, n) {
    try {
      t.upgrade(n);
    } catch (n) {
      ju(n, t);
    }
  }
  function Eo(t) {
    (function (t) {
      if (!t) return [];
      for (
        var n = t.querySelectorAll(
            'script[custom-element],script[custom-template]'
          ),
          i = [],
          r = 0;
        r < n.length;
        r++
      ) {
        var e = n[r],
          u =
            e.getAttribute('custom-element') ||
            e.getAttribute('custom-template'),
          o = ui(e.src);
        u &&
          o &&
          i.push({
            script: e,
            extensionId: u,
            extensionVersion: o.extensionVersion,
          });
      }
      return i;
    })(t.getHeadNode()).forEach(function (n) {
      var i = n.extensionId,
        r = n.extensionVersion,
        e = n.script;
      t.declareExtension(i, r),
        e.addEventListener('error', function () {
          return (function (t) {
            po.add(t || '*');
            for (var n, i = s(mo, !0); !(n = i()).done; ) {
              var r = n.value;
              (null != t && r.tagName.toLowerCase() !== t) ||
                r.markUnresolved();
            }
          })(i);
        }),
        Po(t.win, i);
    }),
      t.isBodyAvailable() && t.setExtensionsKnown();
  }
  function Po(t, n) {
    wo(t)[n] || Oo(t, n, uo);
  }
  function To(t, n, i) {
    Oo(n, i, wo(t)[i] || uo);
  }
  function Oo(t, i, r) {
    wo(t)[i] = r;
    var e = (function (t, i) {
      var r = (function (t, i) {
          if (t.__AMP_BASE_CE_CLASS) return t.__AMP_BASE_CE_CLASS;
          var r = (function (r) {
            D(u, r);
            var e = z(u);
            function u() {
              var t;
              return (t = e.call(this)).createdCallback(), t;
            }
            var o = u.prototype;
            return (
              (o.createdCallback = function () {
                (this.Xu = !1),
                  (this.Ju = !1),
                  (this.Qu = null),
                  (this.Zu = !1),
                  (this.no = null),
                  (this.io = null),
                  (this.ro = 'upgrading'),
                  (this.everAttached = !1),
                  (this.vu = null),
                  (this.qe = null),
                  (this.eo = Qr),
                  (this.Je = 0),
                  (this.uo = !1),
                  (this.warnOnMissingOverflow = !0),
                  (this.sizerElement = void 0),
                  (this.oo = void 0),
                  (this.layoutScheduleTime = void 0);
                var n = this,
                  i =
                    t.__AMP_EXTENDED_ELEMENTS &&
                    t.__AMP_EXTENDED_ELEMENTS[this.localName];
                (this.so = i === uo ? null : i || null),
                  this.so || mo.push(this),
                  (this.ho = null),
                  (this.ao = 1),
                  (this.fo = 0),
                  (this.co = void 0),
                  (this.Ku = void 0),
                  (this.Te = new cr()),
                  this.so && this.Te.signal(we);
                var r = li(t, 'performance');
                (this.lo = r && r.isPerformanceTrackingOn()),
                  (this.vo = null),
                  n.__AMP_UPG_RES &&
                    (n.__AMP_UPG_RES(n),
                    delete n.__AMP_UPG_RES,
                    delete n.__AMP_UPG_PRM);
              }),
              (o.signals = function () {
                return this.Te;
              }),
              (o.getAmpDoc = function () {
                return Jt(this.vu), this.vu;
              }),
              (o.getResources = function () {
                return Jt(this.qe), this.qe;
              }),
              (o.isUpgraded = function () {
                return 2 == this.ao;
              }),
              (o.whenUpgraded = function () {
                return this.Te.whenSignal(Ae);
              }),
              (o.upgrade = function (t) {
                this.Ku ||
                  (1 == this.ao &&
                    ((this.so = t),
                    this.Te.signal(we),
                    this.everAttached && this.do()));
              }),
              (o.markUnresolved = function () {
                this.so ||
                  this.classList.add('amp-unresolved', 'i-amphtml-unresolved');
              }),
              (o.getUpgradeDelayMs = function () {
                return this.fo;
              }),
              (o.mo = function (n, i) {
                (this.ho = n),
                  (this.fo = t.Date.now() - i),
                  (this.ao = 2),
                  this.setReadyStateInternal(lr),
                  this.classList.remove(
                    'amp-unresolved',
                    'i-amphtml-unresolved'
                  ),
                  this.po(),
                  this.dispatchCustomEventForTesting(ge),
                  this.R1() || this.getResources().upgraded(this),
                  this.Te.signal(Ae);
              }),
              (o.po = function () {
                this.eo != Qr &&
                  this.ho &&
                  !this.ho.isLayoutSupported(this.eo) &&
                  (Qt(
                    this.getAttribute('layout'),
                    'The element did not specify a layout attribute. Check https://amp.dev/documentation/guides-and-tutorials/develop/style_and_layout/control_layout and the respective element documentation for details.'
                  ),
                  Qt(!1, 'Layout not supported: '.concat(this.eo)));
              }),
              (o.getBuildPriority = function () {
                return this.so ? this.so.getBuildPriority(this) : 3;
              }),
              (o.getLayoutPriority = function () {
                return this.ho ? this.ho.getLayoutPriority() : 3;
              }),
              (o.getDefaultActionAlias = function () {
                return Jt(this.isUpgraded()), this.ho.getDefaultActionAlias();
              }),
              (o.isBuilding = function () {
                return !!this.Qu;
              }),
              (o.isBuilt = function () {
                return this.Xu;
              }),
              (o.whenBuilt = function () {
                return this.Te.whenSignal(xe);
              }),
              (o.buildInternal = function () {
                var t = this;
                if ((bo(this), Jt(this.so), this.Qu)) return this.Qu;
                this.setReadyStateInternal(lr);
                var n = this.bo();
                this.yo();
                var i = n
                  .then(function () {
                    var n,
                      i = t.wo(),
                      r = i ? null : t.Ao();
                    if (i || r)
                      return ((n = t),
                      Mi(n, 'consentPolicyManager', 'amp-consent'))
                        .then(function (t) {
                          return (
                            !t ||
                            (i
                              ? t.whenPolicyUnblock(i)
                              : t.whenPurposesUnblock(r))
                          );
                        })
                        .then(function (t) {
                          if (!t) throw new Error(ku);
                        });
                  })
                  .then(function () {
                    return Jt(t.ho).buildCallback();
                  });
                return (this.Qu = i.then(
                  function () {
                    if (
                      ((t.Xu = !0),
                      t.classList.add('i-amphtml-built'),
                      t.classList.remove('i-amphtml-notbuilt', 'amp-notbuilt'),
                      t.Te.signal(xe),
                      t.R1()
                        ? t.setReadyStateInternal(t.ro != lr ? t.ro : vr)
                        : (t.setReadyStateInternal(dr), t.preconnect(!1)),
                      t.Ju && t.an(),
                      t.co && Ji(on(t)).delay(t.xo.bind(t), 1),
                      !t.getPlaceholder())
                    ) {
                      var n = t.createPlaceholder();
                      n && t.appendChild(n);
                    }
                  },
                  function (n) {
                    throw (
                      (t.Te.rejectSignal(xe, n),
                      t.R1() && t.setReadyStateInternal(pr, n),
                      Lu(n) || ju(n, t),
                      n)
                    );
                  }
                ));
              }),
              (o.build = function () {
                var t = this;
                return this.Qu
                  ? this.Qu
                  : this.Te.whenSignal(we).then(function () {
                      return (
                        t.R1() && qu(t.getAmpDoc()).scheduleAsap(t),
                        t.whenBuilt()
                      );
                    });
              }),
              (o.mountInternal = function () {
                var t = this;
                if (this.no) return this.no;
                this.io = this.io || new AbortController();
                var n = this.io.signal;
                return (this.no = this.buildInternal()
                  .then(function () {
                    if ((Jt(t.R1()), !n.aborted)) {
                      t.setReadyStateInternal(
                        t.ro != vr ? t.ro : t.so.usesLoading(t) ? dr : vr
                      ),
                        (t.Zu = !0);
                      var i = t.ho.mountCallback(n);
                      return !!i && i.then(vo);
                    }
                  })
                  .then(function (i) {
                    if (((t.io = null), n.aborted)) throw Du();
                    t.Te.signal(Ee),
                      (t.so.usesLoading(t) && !i) ||
                        t.setReadyStateInternal(mr);
                  })
                  .catch(function (n) {
                    var i;
                    throw (
                      ((t.io = null),
                      (i = n) &&
                      ('string' == typeof i
                        ? i.startsWith(Mu)
                        : 'string' == typeof i.message &&
                          i.message.startsWith(Mu))
                        ? (t.no = null)
                        : (t.Te.rejectSignal(Ee, n),
                          t.setReadyStateInternal(pr, n)),
                      n)
                    );
                  }));
              }),
              (o.mount = function () {
                var t = this;
                if (this.no) return this.no;
                this.io = this.io || new AbortController();
                var n = this.io.signal;
                return this.Te.whenSignal(we).then(function () {
                  if (!t.R1()) return t.whenBuilt();
                  if (n.aborted) throw Du();
                  return qu(t.getAmpDoc()).scheduleAsap(t), t.whenMounted();
                });
              }),
              (o.unmount = function () {
                this.Ju && this.pause(),
                  this.R1()
                    ? (this.io && (this.io.abort(), (this.io = null)),
                      qu(this.getAmpDoc()).unschedule(this),
                      this.Zu && this.ho.unmountCallback(),
                      (this.Zu = !1),
                      (this.no = null),
                      this.Eo(),
                      this.Ju && this.do(!0))
                    : this.Po();
              }),
              (o.whenMounted = function () {
                return this.Te.whenSignal(Ee);
              }),
              (o.whenLoaded = function () {
                return this.Te.whenSignal(Oe);
              }),
              (o.ensureLoaded = function (t) {
                var n = this;
                return this.mount().then(function () {
                  if (n.R1())
                    return (
                      n.so.usesLoading(n) && n.ho.ensureLoaded(), n.whenLoaded()
                    );
                  var i = n.To();
                  return i.whenBuilt().then(function () {
                    if (
                      4 != i.getState() &&
                      ((3 != i.getState() || i.isMeasureRequested()) &&
                        i.measure(),
                      i.isDisplayed())
                    )
                      return (
                        n.getResources().scheduleLayoutOrPreload(i, !0, t, !0),
                        n.whenLoaded()
                      );
                  });
                });
              }),
              (o.setAsContainerInternal = function (t) {
                qu(this.getAmpDoc()).setContainer(this, t);
              }),
              (o.removeAsContainerInternal = function () {
                qu(this.getAmpDoc()).removeContainer(this);
              }),
              (o.setReadyStateInternal = function (t, n) {
                if (t !== this.ro && ((this.ro = t), this.R1()))
                  switch (t) {
                    case dr:
                      return (
                        this.Te.signal(Pe),
                        this.Te.reset(Ie),
                        this.Te.reset(Oe),
                        this.classList.add('i-amphtml-layout'),
                        this.toggleLoading(!0),
                        void this.dispatchCustomEventForTesting(be)
                      );
                    case mr:
                      return (
                        this.Te.signal(Pe),
                        this.Te.signal(Oe),
                        this.Te.reset(Ie),
                        this.classList.add('i-amphtml-layout'),
                        this.toggleLoading(!1),
                        Cn(this, 'load', null, lo),
                        void this.dispatchCustomEventForTesting(ye)
                      );
                    case pr:
                      return (
                        this.Te.rejectSignal(Oe, n),
                        this.toggleLoading(!1),
                        void Cn(this, 'error', n, lo)
                      );
                  }
              }),
              (o.preconnect = function (t) {
                var n = this;
                Jt(this.isUpgraded()),
                  t
                    ? this.ho.preconnectCallback(t)
                    : Ju(this.getAmpDoc(), function () {
                        n.ownerDocument &&
                          n.ownerDocument.defaultView &&
                          n.ho.preconnectCallback(t);
                      });
              }),
              (o.R1 = function () {
                return !!this.so && this.so.R1();
              }),
              (o.deferredMount = function () {
                return !!this.so && this.so.deferredMount(this);
              }),
              (o.isAlwaysFixed = function () {
                return !!this.ho && this.ho.isAlwaysFixed();
              }),
              (o.updateLayoutBox = function (t) {
                var n =
                  arguments.length > 1 &&
                  void 0 !== arguments[1] &&
                  arguments[1];
                this.isBuilt() && this.onMeasure(n);
              }),
              (o.onMeasure = function () {
                Jt(this.isBuilt());
                try {
                  this.ho.onLayoutMeasure();
                } catch (t) {
                  ju(t, this);
                }
              }),
              (o.yo = function () {
                var t;
                return (
                  void 0 !== this.sizerElement ||
                    (this.eo !== ne && this.eo !== oe) ||
                    ((this.sizerElement =
                      this.querySelector('i-amphtml-sizer')),
                    null === (t = this.sizerElement) ||
                      void 0 === t ||
                      t.setAttribute('slot', 'i-amphtml-svc')),
                  this.sizerElement || null
                );
              }),
              (o.Oo = function (t) {
                if (this.eo !== ne)
                  if (this.eo !== oe);
                  else {
                    var n = t.querySelector('.i-amphtml-intrinsic-sizer');
                    if (!n) return;
                    n.setAttribute('src', '');
                  }
                else Rr(t, 'paddingTop', '0');
              }),
              (o.Io = function () {
                var t = this,
                  n =
                    this.hasAttribute('media') ||
                    (this.hasAttribute('sizes') &&
                      !this.hasAttribute('disable-inline-width')) ||
                    this.hasAttribute('heights'),
                  i = !!this.vo,
                  r = this.ownerDocument.defaultView;
                n != i &&
                  r &&
                  (n
                    ? ((this.vo = new Re(r, function () {
                        return t.Ro();
                      })),
                      this.Ro())
                    : this.So());
              }),
              (o.So = function () {
                this.vo && (this.vo.dispose(), (this.vo = null));
              }),
              (o.Ro = function () {
                var t = this.vo;
                if (t) {
                  t.start();
                  var n = this.getAttribute('media') || null,
                    i = !n || t.resolveMatchQuery(n);
                  this.classList.toggle('i-amphtml-hidden-by-media-query', !i);
                  var r = this.hasAttribute('disable-inline-width')
                    ? null
                    : this.getAttribute('sizes');
                  r && Rr(this, 'width', t.resolveListQuery(r));
                  var e = this.eo === ne ? this.getAttribute('heights') : null;
                  if (e) {
                    var u = this.yo();
                    u && Rr(u, 'paddingTop', t.resolveListQuery(e));
                  }
                  t.complete(), this.To().requestMeasure();
                }
              }),
              (o.applySize = function (t, n, i) {
                var r = this.yo();
                r &&
                  ((this.sizerElement = null),
                  this.Oo(r),
                  this._o(function () {
                    r && Tn(r);
                  })),
                  void 0 !== t && Rr(this, 'height', t, 'px'),
                  void 0 !== n && Rr(this, 'width', n, 'px'),
                  i &&
                    (null != i.top && Rr(this, 'marginTop', i.top, 'px'),
                    null != i.right && Rr(this, 'marginRight', i.right, 'px'),
                    null != i.bottom &&
                      Rr(this, 'marginBottom', i.bottom, 'px'),
                    null != i.left && Rr(this, 'marginLeft', i.left, 'px')),
                  this.Mo() && this.ko(),
                  Cn(this, 'amp:size-changed');
              }),
              (o.connectedCallback = function () {
                if (
                  ((function () {
                    if (void 0 === fo) {
                      var t = self.document.createElement('template');
                      fo = 'content' in t;
                    }
                    return fo;
                  })() ||
                    void 0 !== this.Ku ||
                    (this.Ku = !!gn(this, 'template')),
                  !this.Ku && !this.Ju && Rn(this))
                ) {
                  if (
                    ((this.Ju = !0),
                    this.everAttached ||
                      this.classList.add(
                        'i-amphtml-element',
                        'i-amphtml-notbuilt',
                        'amp-notbuilt'
                      ),
                    !this.vu)
                  ) {
                    var t = on(this),
                      n = Ui(t).getAmpDoc(this);
                    (this.vu = n), i(n, this, this.so);
                  }
                  if (
                    (this.qe || (this.qe = Xi(this.vu)),
                    this.getResources().add(this),
                    this.everAttached)
                  ) {
                    var r = this.reconstructWhenReparented();
                    r && this.Eo(),
                      this.isUpgraded() &&
                        (r && !this.R1() && this.getResources().upgraded(this),
                        this.an(),
                        this.dispatchCustomEventForTesting(ge)),
                      this.so && this.R1() && this.do();
                  } else {
                    this.everAttached = !0;
                    try {
                      (this.eo = (function (t) {
                        var n = t.getAttribute('i-amphtml-layout');
                        if (n) {
                          var i,
                            r = he(n);
                          return (
                            tt(r),
                            (r != ne && r != oe) || !t.firstElementChild
                              ? r == Qr && _r(t, !1)
                              : ((t.sizerElement =
                                  t.querySelector('i-amphtml-sizer') || void 0),
                                null === (i = t.sizerElement) ||
                                  void 0 === i ||
                                  i.setAttribute('slot', 'i-amphtml-svc')),
                            r
                          );
                        }
                        var e = De(t),
                          u = e.height,
                          o = e.layout,
                          s = e.width;
                        if (
                          (t.classList.add(ae(o)),
                          fe(o) &&
                            t.classList.add('i-amphtml-layout-size-defined'),
                          o == Qr)
                        )
                          _r(t, !1);
                        else if (o == Zr)
                          Sr(t, { width: it(s), height: it(u) });
                        else if (o == te) Rr(t, 'height', it(u));
                        else if (o == ne) {
                          var h =
                            t.ownerDocument.createElement('i-amphtml-sizer');
                          h.setAttribute('slot', 'i-amphtml-svc');
                          var a = ve(u),
                            f = ve(s);
                          rt(a),
                            rt(f),
                            Sr(h, { paddingTop: (a / f) * 100 + '%' }),
                            t.insertBefore(h, t.firstChild),
                            (t.sizerElement = h);
                        } else if (o == oe) {
                          var c = ke(t)(Ne),
                            l = c.firstElementChild;
                          nt(l),
                            l.setAttribute(
                              'src',
                              'data:image/svg+xml;charset=utf-8,<svg height="'
                                .concat(u, '" width="')
                                .concat(
                                  s,
                                  '" xmlns="http://www.w3.org/2000/svg" version="1.1"/>'
                                )
                            ),
                            t.insertBefore(c, t.firstChild),
                            (t.sizerElement = c);
                        } else
                          o == re ||
                            o == ie ||
                            (o == ee
                              ? (s && Rr(t, 'width', s),
                                u && Rr(t, 'height', u))
                              : o == ue &&
                                (t.classList.add(
                                  'i-amphtml-layout-awaiting-size'
                                ),
                                s && Rr(t, 'width', s),
                                Rr(t, 'height', 0)));
                        return t.setAttribute('i-amphtml-layout', o), o;
                      })(this)),
                        this.Io();
                    } catch (t) {
                      ju(t, this);
                    }
                    this.so
                      ? this.do()
                      : (po.has('*') || po.has(this.tagName.toLowerCase())) &&
                        this.markUnresolved(),
                      this.isUpgraded() ||
                        this.dispatchCustomEventForTesting('amp:stubbed');
                  }
                  this.toggleLoading(!0);
                }
              }),
              (o.Mo = function () {
                return this.classList.contains(
                  'i-amphtml-layout-awaiting-size'
                );
              }),
              (o.ko = function () {
                this.classList.remove('i-amphtml-layout-awaiting-size');
              }),
              (o.do = function (t) {
                if (this.R1()) {
                  if (!this.no)
                    if (
                      (qu(this.getAmpDoc()).schedule(this),
                      this.classList.remove(
                        'amp-unresolved',
                        'i-amphtml-unresolved'
                      ),
                      this.Qu)
                    )
                      this.setReadyStateInternal(
                        this.so && this.so.usesLoading(this) ? dr : vr
                      );
                    else if ((this.setReadyStateInternal(lr), !t)) {
                      var n = this.so.getPreconnects(this);
                      if (n && n.length > 0) {
                        var i = this.getAmpDoc();
                        Ju(i, function () {
                          var t = i.win;
                          if (t) {
                            var r = Ki(t);
                            n.forEach(function (t) {
                              return r.url(i, t, !1);
                            });
                          }
                        });
                      }
                    }
                } else this.Co();
              }),
              (o.Co = function () {
                var n = this;
                if (!this.Ku && 1 == this.ao) {
                  var i = new (Jt(this.so))(this);
                  this.ao = 4;
                  var r = t.Date.now(),
                    e = i.upgradeCallback();
                  if (e) {
                    if ('function' == typeof e.then)
                      return e
                        .then(function (t) {
                          n.mo(t || i, r);
                        })
                        .catch(function (t) {
                          (n.ao = 3), d(t);
                        });
                    this.mo(e, r);
                  } else this.mo(i, r);
                }
              }),
              (o.disconnectedCallback = function () {
                this.disconnect(!1);
              }),
              (o.an = function () {
                this.Xu && this.ho.attachedCallback();
              }),
              (o.disconnect = function (t) {
                !this.Ku &&
                  this.Ju &&
                  ((!t && Rn(this)) ||
                    (t && this.classList.remove('i-amphtml-element'),
                    (this.Ju = !1),
                    this.getResources().remove(this),
                    this.ho && this.ho.detachedCallback(),
                    this.R1() && this.unmount(),
                    this.toggleLoading(!1),
                    this.So()));
              }),
              (o.dispatchCustomEventForTesting = function (t, n) {}),
              (o.prerenderAllowed = function () {
                return (
                  !this.hasAttribute('noprerender') &&
                  !!this.so &&
                  this.so.prerenderAllowed(this)
                );
              }),
              (o.previewAllowed = function () {
                return !!this.so && this.so.previewAllowed(this);
              }),
              (o.isBuildRenderBlocking = function () {
                return !!this.ho && this.ho.isBuildRenderBlocking();
              }),
              (o.createPlaceholder = function () {
                return this.ho ? this.ho.createPlaceholderCallback() : null;
              }),
              (o.createLoaderLogo = function () {
                return this.so ? this.so.createLoaderLogoCallback(this) : {};
              }),
              (o.renderOutsideViewport = function () {
                return !!this.ho && this.ho.renderOutsideViewport();
              }),
              (o.idleRenderOutsideViewport = function () {
                return !!this.ho && this.ho.idleRenderOutsideViewport();
              }),
              (o.getLayoutBox = function () {
                return this.To().getLayoutBox();
              }),
              (o.getLayoutSize = function () {
                return this.To().getLayoutSize();
              }),
              (o.getOwner = function () {
                return this.To().getOwner();
              }),
              (o.getIntersectionChangeEntry = function () {
                var t = this.ho
                    ? this.ho.getIntersectionElementLayoutBox()
                    : this.getLayoutBox(),
                  n = this.getOwner(),
                  i = rr(this.getAmpDoc()).getRect();
                return (function (t, n, i) {
                  var r,
                    e,
                    u,
                    o,
                    s =
                      (function (t) {
                        for (
                          var n = -1 / 0,
                            i = 1 / 0,
                            r = -1 / 0,
                            e = 1 / 0,
                            u = 0;
                          u < arguments.length;
                          u++
                        ) {
                          var o = arguments[u];
                          if (
                            o &&
                            ((n = Math.max(n, o.left)),
                            (i = Math.min(i, o.left + o.width)),
                            (r = Math.max(r, o.top)),
                            (e = Math.min(e, o.top + o.height)),
                            i < n || e < r)
                          )
                            return null;
                        }
                        return i == 1 / 0 ? null : Ln(n, r, i - n, e - r);
                      })(t, n, i) || Ln(0, 0, 0, 0);
                  return (function (t, n, i, r) {
                    var e = t,
                      u = n;
                    return (
                      n &&
                        ((i = zn(i, -n.left, -n.top)),
                        (e = zn(e, -n.left, -n.top)),
                        (u = zn(u, -n.left, -n.top))),
                      {
                        time:
                          'undefined' != typeof performance && performance.now
                            ? performance.now()
                            : Date.now() - co,
                        rootBounds: u,
                        boundingClientRect: e,
                        intersectionRect: i,
                        intersectionRatio: r,
                      }
                    );
                  })(
                    t,
                    i,
                    s,
                    ((e = t),
                    (u = (r = s).width * r.height),
                    0 == (o = e.width * e.height) ? 0 : u / o)
                  );
                })(t, n && n.getLayoutBox(), i);
              }),
              (o.To = function () {
                return this.getResources().getResourceForElement(this);
              }),
              (o.getResourceId = function () {
                return this.To().getId();
              }),
              (o.isRelayoutNeeded = function () {
                return !!this.ho && this.ho.isRelayoutNeeded();
              }),
              (o.getImpl = function () {
                var t = this;
                return (
                  arguments.length > 0 &&
                  void 0 !== arguments[0] &&
                  !arguments[0]
                    ? this.bo()
                    : this.build()
                ).then(function () {
                  return t.ho;
                });
              }),
              (o.bo = function () {
                var t = this;
                return this.Te.whenSignal(we).then(function () {
                  return t.Co(), t.whenUpgraded();
                });
              }),
              (o.getApi = function () {
                return this.getImpl().then(function (t) {
                  return t.getApi();
                });
              }),
              (o.getLayout = function () {
                return this.eo;
              }),
              (o.layoutCallback = function (t) {
                var n = this;
                if ((bo(this), Jt(this.isBuilt()), t.aborted))
                  return Promise.reject(Du());
                this.dispatchCustomEventForTesting(be);
                var i = 0 == this.Je;
                this.Te.reset(Ie),
                  i && this.Te.signal(Pe),
                  this.toggleLoading(!0);
                var r = f(function () {
                  return n.ho.layoutCallback();
                });
                return (
                  this.preconnect(!0),
                  this.classList.add('i-amphtml-layout'),
                  r.then(
                    function () {
                      if (t.aborted) throw Du();
                      i && n.Te.signal(Oe),
                        n.setReadyStateInternal(mr),
                        n.Je++,
                        n.toggleLoading(!1),
                        n.uo ||
                          (n.ho.firstLayoutCompleted(),
                          (n.uo = !0),
                          n.dispatchCustomEventForTesting(ye));
                    },
                    function (r) {
                      if (t.aborted) throw Du();
                      throw (
                        (i && n.Te.rejectSignal(Oe, r),
                        n.setReadyStateInternal(pr, r),
                        n.Je++,
                        n.toggleLoading(!1),
                        r)
                      );
                    }
                  )
                );
              }),
              (o.pause = function () {
                this.isBuilt() &&
                  (this.ho.pauseCallback(),
                  !this.R1() && this.ho.unlayoutOnPause() && this.Po());
              }),
              (o.resume = function () {
                this.isBuilt() && this.ho.resumeCallback();
              }),
              (o.unlayoutCallback = function () {
                if ((bo(this), !this.isBuilt())) return !1;
                this.Te.signal(Ie);
                var t = this.ho.unlayoutCallback();
                return (
                  t && this.Eo(),
                  this.dispatchCustomEventForTesting('amp:unload'),
                  t
                );
              }),
              (o.Po = function () {
                this.To().unlayout(),
                  this.Ju && this.qe && this.qe.schedulePass();
              }),
              (o.Eo = function () {
                (this.Je = 0),
                  (this.uo = !1),
                  this.Te.reset(Ee),
                  this.Te.reset(Te),
                  this.Te.reset(Pe),
                  this.Te.reset(Oe),
                  this.Te.reset('ini-load');
              }),
              (o.reconstructWhenReparented = function () {
                return !!this.ho && this.ho.reconstructWhenReparented();
              }),
              (o.collapse = function () {
                this.ho && this.ho.collapse();
              }),
              (o.collapsedCallback = function (t) {
                this.ho && this.ho.collapsedCallback(t);
              }),
              (o.expand = function () {
                this.ho && this.ho.expand();
              }),
              (o.mutatedAttributesCallback = function (t) {
                this.ho
                  ? this.ho.mutatedAttributesCallback(t)
                  : this.R1() && qu(this).scheduleAsap(this);
              }),
              (o.enqueAction = function (t) {
                bo(this),
                  this.isBuilt()
                    ? this.No(t, !1)
                    : (void 0 === this.co && (this.co = []),
                      Jt(this.co).push(t),
                      this.build());
              }),
              (o.xo = function () {
                var t = this;
                if (this.co) {
                  var n = Jt(this.co);
                  (this.co = null),
                    n.forEach(function (n) {
                      t.No(n, !0);
                    });
                }
              }),
              (o.No = function (t, n) {
                try {
                  this.ho.executeAction(t, n);
                } catch (n) {
                  d('Action execution failed:', n, t.node.tagName, t.method);
                }
              }),
              (o.wo = function () {
                var t,
                  n,
                  i = this.getAttribute('data-block-on-consent');
                if (null === i) {
                  if (
                    !(n = (t = this)
                      .getAmpDoc()
                      .getMetaByName('amp-consent-blocking')) ||
                    !(n = n.toUpperCase().replace(/\s+/g, ''))
                      .split(',')
                      .includes(t.tagName)
                  )
                    return null;
                  (i = 'default'),
                    this.setAttribute('data-block-on-consent', i);
                }
                return '' == i || 'default' == i
                  ? Jt(this.ho).getConsentPolicy()
                  : i;
              }),
              (o.Ao = function () {
                var t,
                  n =
                    this.getAttribute('data-block-on-consent-purposes') || null;
                return null == n ||
                  null === (t = n.replace(/\s+/g, '')) ||
                  void 0 === t
                  ? void 0
                  : t.split(',');
              }),
              (o.getPlaceholder = function () {
                return bn(this, function (t) {
                  return t.hasAttribute('placeholder') && !go(t);
                });
              }),
              (o.togglePlaceholder = function (t) {
                if ((bo(this), t)) {
                  var n = this.getPlaceholder();
                  n && n.classList.remove('amp-hidden');
                } else
                  for (
                    var i =
                        ((e = void 0),
                        vn('placeholder'),
                        (e = this),
                        (u = '> ['.concat('placeholder', ']')),
                        fn(e) ? e.querySelectorAll(cn(u, ':scope')) : dn(e, u)),
                      r = 0;
                    r < i.length;
                    r++
                  )
                    go(i[r]) || i[r].classList.add('amp-hidden');
                var e, u;
              }),
              (o.getFallback = function () {
                return yn(this, 'fallback');
              }),
              (o.toggleFallback = function (t) {
                bo(this);
                var n,
                  i = this.To().getState();
                if (
                  (this.R1() || !t || (0 != i && 1 != i && 2 != i)) &&
                  (this.classList.toggle('amp-notsupported', t), 1 == t)
                ) {
                  var r = this.getFallback();
                  r &&
                    ((n = this.getAmpDoc()), vi(n, 'owners')).scheduleLayout(
                      this,
                      r
                    );
                }
              }),
              (o.renderStarted = function () {
                this.Te.signal(Te),
                  this.togglePlaceholder(!1),
                  this.toggleLoading(!1);
              }),
              (o.jo = function (t) {
                var n,
                  i,
                  r = this.Je > 0 || this.Te.get(Te);
                return !(
                  this.eo == Qr ||
                  this.hasAttribute('noloading') ||
                  (r && !t) ||
                  ((i = this.tagName.toUpperCase()),
                  'AMP-AD' !== (n = i) &&
                    'AMP-ANIM' !== n &&
                    'AMP-EMBED' !== n &&
                    'AMP-FACEBOOK' !== n &&
                    'AMP-FACEBOOK-COMMENTS' !== n &&
                    'AMP-FACEBOOK-PAGE' !== n &&
                    'AMP-GOOGLE-DOCUMENT-EMBED' !== n &&
                    'AMP-IFRAME' !== n &&
                    'AMP-IMG' !== n &&
                    'AMP-INSTAGRAM' !== n &&
                    'AMP-LIST' !== n &&
                    'AMP-PINTEREST' !== n &&
                    'AMP-PLAYBUZZ' !== n &&
                    'AMP-RENDER' !== n &&
                    'AMP-TIKTOK' !== n &&
                    'AMP-TWITTER' !== n &&
                    !(function (t) {
                      return 'AMP-VIDEO' != t && se.test(t);
                    })(i)) ||
                  wn(this)
                );
              }),
              (o.toggleLoading = function (t) {
                var n =
                  arguments.length > 1 &&
                  void 0 !== arguments[1] &&
                  arguments[1];
                if (this.ownerDocument && this.ownerDocument.defaultView) {
                  var i = qi(this.getAmpDoc());
                  i &&
                    ((t = t && this.jo(n)) ? i.track(this) : i.untrack(this));
                }
              }),
              (o.getOverflowElement = function () {
                return (
                  void 0 === this.oo &&
                    ((this.oo = yn(this, 'overflow')),
                    this.oo &&
                      (this.oo.hasAttribute('tabindex') ||
                        this.oo.setAttribute('tabindex', '0'),
                      this.oo.hasAttribute('role') ||
                        this.oo.setAttribute('role', 'button'))),
                  this.oo
                );
              }),
              (o.overflowCallback = function (t, n, i) {
                var r = this;
                this.getOverflowElement(),
                  this.oo
                    ? (this.oo.classList.toggle('amp-visible', t),
                      (this.oo.onclick = t
                        ? function () {
                            var t = Wi(r.getAmpDoc());
                            t.forceChangeSize(r, n, i),
                              t.mutateElement(r, function () {
                                r.overflowCallback(!1, n, i);
                              });
                          }
                        : null))
                    : t &&
                      this.warnOnMissingOverflow &&
                      Yt().warn(
                        'CustomElement',
                        'Cannot resize element and overflow is not available',
                        this
                      );
              }),
              (o._o = function (t, n) {
                var i =
                  arguments.length > 2 &&
                  void 0 !== arguments[2] &&
                  arguments[2];
                this.vu
                  ? Wi(this.getAmpDoc()).mutateElement(n || this, t, i)
                  : t();
              }),
              n(u, [
                {
                  key: 'readyState',
                  get: function () {
                    return this.ro;
                  },
                },
              ]),
              u
            );
          })(t.HTMLElement);
          return (t.__AMP_BASE_CE_CLASS = r), t.__AMP_BASE_CE_CLASS;
        })(t, i),
        e = (function (t) {
          D(i, t);
          var n = z(i);
          function i() {
            return n.apply(this, arguments);
          }
          return (
            (i.prototype.adoptedCallback = function () {
              Object.getPrototypeOf(this) !== u &&
                Object.setPrototypeOf(this, u);
            }),
            i
          );
        })(r),
        u = e.prototype;
      return e;
    })(t, Io);
    t.customElements.define(i, e);
  }
  function Io(t, n, i) {
    yo.has(t) || (yo.set(t, !0), Eo(t));
    var r = n.localName;
    i ||
      t.declaresExtension(r) ||
      Fi(t.win).installExtensionForDoc(t, r, '0.1');
  }
  var Ro = 'amp-img',
    So = [
      'alt',
      'aria-describedby',
      'aria-label',
      'aria-labelledby',
      'crossorigin',
      'referrerpolicy',
      'title',
      'importance',
      'sizes',
      'srcset',
      'src',
    ],
    _o = (function (t) {
      D(i, t);
      var n = z(i);
      function i(t) {
        var i;
        return (
          ((i = n.call(this, t)).Do = !0),
          (i.Lo = null),
          (i.Uo = null),
          (i.zo = null),
          (i.Ho = 0),
          i
        );
      }
      (i.R1 = function () {
        return !1;
      }),
        (i.prerenderAllowed = function () {
          return !0;
        }),
        (i.usesLoading = function () {
          return !0;
        }),
        (i.getPreconnects = function (t) {
          var n = t.getAttribute('src');
          if (n) return [n];
          var i = t.getAttribute('srcset');
          if (i) {
            var r = /\S+/.exec(i);
            if (r) return [r[0]];
          }
          return null;
        });
      var r = i.prototype;
      return (
        (r.mutatedAttributesCallback = function (t) {
          if (this.Lo) {
            var n = So.filter(function (n) {
              return void 0 !== t[n];
            });
            t.src &&
              !t.srcset &&
              this.element.hasAttribute('srcset') &&
              (this.element.removeAttribute('srcset'),
              n.push('srcset'),
              this.user().warn(
                Ro,
                'Removed [srcset] since [src] was mutated. Recommend adding a [srcset] binding to support responsive images.',
                this.element
              )),
              me(n, this.element, this.Lo, !0),
              this.propagateDataset(this.Lo),
              Jr(this.Lo),
              i.R1() && !this.Lo.complete && this.setReadyState(dr);
          }
        }),
        (r.preconnectCallback = function (t) {
          var n = this.element.getAttribute('src');
          if (n) Ki(this.win).url(this.getAmpDoc(), n, t);
          else {
            var i = this.element.getAttribute('srcset');
            if (!i) return;
            var r = /\S+/.exec(i);
            r && Ki(this.win).url(this.getAmpDoc(), r[0], t);
          }
        }),
        (r.isLayoutSupported = function (t) {
          return fe(t);
        }),
        (r.Go = function () {
          if (this.Lo) return this.Lo;
          this.Do = !this.element.hasAttribute('fallback');
          var t,
            n,
            i = jn(this.element);
          return (
            i && (this.Lo = mn(this.element, '> img:not([placeholder])')),
            (this.Lo = this.Lo || new Image()),
            this.Lo.setAttribute('decoding', 'async'),
            this.element.id &&
              this.Lo.setAttribute('amp-img-id', this.element.id),
            'img' == this.element.getAttribute('role') &&
              (this.element.removeAttribute('role'),
              this.user().error(
                Ro,
                'Setting role=img on amp-img elements breaks screen readers please just set alt or ARIA attributes, they will be correctly propagated for the underlying <img> element.'
              )),
            this.Vo(!0),
            me(So, this.element, this.Lo),
            this.propagateDataset(this.Lo),
            Jr(this.Lo),
            de(this.Lo, !0),
            (t = this.element),
            (n = this.Lo),
            t.hasAttribute('object-fit') &&
              Rr(n, 'object-fit', t.getAttribute('object-fit')),
            t.hasAttribute('object-position') &&
              Rr(n, 'object-position', t.getAttribute('object-position')),
            i || this.element.appendChild(this.Lo),
            this.Lo
          );
        }),
        (r.Vo = function (t) {
          var n = this;
          if (
            this.Lo &&
            !this.element.hasAttribute('i-amphtml-ssr') &&
            !this.element.hasAttribute('sizes') &&
            !this.Lo.hasAttribute('sizes')
          ) {
            var i = this.element.getAttribute('srcset');
            if (i && !/[0-9]+x(?:,|$)/.test(i)) {
              var r = this.element.getLayoutSize().width;
              if (this.Fo(r)) {
                var e = this.getViewport().getWidth(),
                  u = '(max-width: '.concat(e, 'px) ').concat(r, 'px, '),
                  o = r + 'px';
                if (this.getLayout() !== Zr) {
                  var s = Math.round((100 * r) / e);
                  o = Math.max(s, 100) + 'vw';
                }
                var h = u + o;
                t
                  ? this.Lo.setAttribute('sizes', h)
                  : this.mutateElement(function () {
                      n.Lo.setAttribute('sizes', h);
                    }),
                  (this.Ho = r);
              }
            }
          }
        }),
        (r.Fo = function (t) {
          return !this.Lo.hasAttribute('sizes') || t > this.Ho;
        }),
        (r.reconstructWhenReparented = function () {
          return !1;
        }),
        (r.mountCallback = function () {
          var t = this,
            n = !!this.Lo,
            i = this.Go();
          n ||
            (Ye(i, 'load', function () {
              t.setReadyState(mr), t.firstLayoutCompleted(), t.Bo();
            }),
            Ye(i, 'error', function (n) {
              t.setReadyState(pr, n), t.qo();
            })),
            i.complete
              ? (this.setReadyState(mr), this.firstLayoutCompleted(), this.Bo())
              : this.setReadyState(dr);
        }),
        (r.unmountCallback = function () {
          var t = this.Lo;
          t &&
            !t.complete &&
            ((t.src =
              'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs='),
            Tn(t),
            (this.Lo = null));
        }),
        (r.ensureLoaded = function () {
          this.Lo.loading = 'eager';
        }),
        (r.layoutCallback = function () {
          var t = this;
          this.Go();
          var n = this.Lo;
          return (
            (this.Uo = Ye(n, 'load', function () {
              return t.Bo();
            })),
            (this.zo = Ye(n, 'error', function () {
              return t.qo();
            })),
            this.element.getLayoutSize().width <= 0 ? h() : this.loadPromise(n)
          );
        }),
        (r.unlayoutCallback = function () {
          if (!i.R1()) {
            this.zo && (this.zo(), (this.zo = null)),
              this.Uo && (this.Uo(), (this.Uo = null));
            var t = this.Lo;
            return (
              t &&
                !t.complete &&
                ((t.src =
                  'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs='),
                Tn(t),
                (this.Lo = null)),
              !0
            );
          }
        }),
        (r.firstLayoutCompleted = function () {
          var t = this.getPlaceholder();
          t && t.classList.contains('i-amphtml-blurry-placeholder')
            ? Ir(t, { opacity: 0 })
            : this.togglePlaceholder(!1);
        }),
        (r.Bo = function () {
          !this.Do &&
            this.Lo.classList.contains('i-amphtml-ghost') &&
            (this.Lo.classList.remove('i-amphtml-ghost'),
            this.toggleFallback(!1));
        }),
        (r.qo = function () {
          this.Do &&
            (this.Lo.classList.add('i-amphtml-ghost'),
            this.toggleFallback(!0),
            this.togglePlaceholder(!1),
            (this.Do = !1));
        }),
        (r.propagateDataset = function (t) {
          for (var n in t.dataset)
            n in this.element.dataset || delete t.dataset[n];
          for (var i in this.element.dataset)
            (i.startsWith('ampBind') && 'ampBind' !== i) ||
              (t.dataset[i] !== this.element.dataset[i] &&
                (t.dataset[i] = this.element.dataset[i]));
        }),
        i
      );
    })(ro),
    Mo = (function (t) {
      D(i, t);
      var n = z(i);
      function i() {
        return n.apply(this, arguments);
      }
      i.prerenderAllowed = function () {
        return !0;
      };
      var r = i.prototype;
      return (
        (r.isLayoutSupported = function (t) {
          return t == ie || fe(t);
        }),
        (r.buildCallback = function () {
          !(function (t) {
            if (!jn(t)) {
              var n = (function (t) {
                var n;
                return (
                  he(
                    null !== (n = t.getAttribute('layout')) && void 0 !== n
                      ? n
                      : ''
                  ) || De(t).layout
                );
              })(t);
              if (n != ie) {
                var i = t.ownerDocument.createElement('div');
                de(i),
                  (function (t) {
                    return (function (t, n) {
                      for (var i = [], r = t.firstChild; r; r = r.nextSibling)
                        !wn(r) && i.push(r);
                      return i;
                    })(t);
                  })(t).forEach(function (t) {
                    i.appendChild(t);
                  }),
                  t.appendChild(i);
              }
            }
          })(this.element);
        }),
        i
      );
    })(ro);
  function ko(t) {
    var n;
    return null === (n = t.featurePolicy) || void 0 === n
      ? void 0
      : n.allowedFeatures().includes('attribution-reporting');
  }
  function Co(t, n) {
    var i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
      r = arguments.length > 3 ? arguments[3] : void 0,
      e = arguments.length > 4 ? arguments[4] : void 0,
      u = zr.getImage(t),
      o = new u();
    i && (o.referrerPolicy = 'no-referrer');
    var s = 0;
    if (null != r)
      if (ko(t.document)) {
        var h = No(t, (s = 6), e);
        (r = h(r)), (o.attributionSrc = r);
      } else s = 5;
    var a = No(t, s, e);
    return (n = a(n)), (o.src = n), o;
  }
  function No(t, n, i) {
    var r = {
        ATTRIBUTION_REPORTING_STATUS: function () {
          return n;
        },
      },
      e = Qi(i || t.document),
      u = { ATTRIBUTION_REPORTING_STATUS: !0 };
    return function (t) {
      return e.expandUrlSync(t, r, u);
    };
  }
  var jo = 'amp-pixel',
    Do = (function (t) {
      D(i, t);
      var n = z(i);
      function i(t) {
        var i;
        return ((i = n.call(this, t)).Wo = null), i;
      }
      var r = i.prototype;
      return (
        (r.isLayoutSupported = function (t) {
          return !0;
        }),
        (r.buildCallback = function () {
          this.element.setAttribute('aria-hidden', 'true'),
            (this.$o = this.element.getAttribute('referrerpolicy')),
            this.$o &&
              Qt(
                'no-referrer' == this.$o,
                ''
                  .concat(jo, ': invalid "referrerpolicy" value "')
                  .concat(this.$o, '".') + ' Only "no-referrer" is supported'
              ),
            this.element.hasAttribute('i-amphtml-ssr') &&
            this.element.querySelector('img')
              ? Xt().info(jo, 'inabox img already present')
              : this.getAmpDoc().whenFirstVisible().then(this.Yo.bind(this));
        }),
        (r.Yo = function () {
          var t = this;
          if (this.Wo) return Xt().error(jo, 'duplicate pixel'), this.Wo;
          this.Wo = Ji(this.win)
            .promise(1)
            .then(function () {
              var n = t.element.getAttribute('src');
              if (n)
                return Qi(t.element)
                  .expandUrlAsync(t.Ko(n))
                  .then(function (n) {
                    if (t.win) {
                      var i = (function (t, n, i, r, e) {
                        return (
                          i &&
                            'no-referrer' !== i &&
                            Yt().error(
                              'pixel',
                              'Unsupported referrerPolicy: %s',
                              i
                            ),
                          'no-referrer' === i
                            ? (function (t, n, i, r) {
                                if ('referrerPolicy' in Image.prototype)
                                  return Co(t, n, !0, i, r);
                                var e = In(t.document, 'iframe', {
                                  src: 'about:blank',
                                  style: 'display:none',
                                });
                                return (
                                  (e.onload = function () {
                                    Co(e.contentWindow, n, void 0, void 0, r);
                                  }),
                                  t.document.body.appendChild(e),
                                  e
                                );
                              })(t, n, r, e)
                            : Co(t, n, !1, r, e)
                        );
                      })(
                        t.win,
                        n,
                        t.$o,
                        t.element.getAttribute('attributionsrc'),
                        t.element
                      );
                      return Xt().info(jo, 'pixel triggered: ', n), i;
                    }
                  });
            });
        }),
        (r.Ko = function (t) {
          return (
            Qt(
              /^(https\:\/\/|\/\/)/i.test(t),
              'The <amp-pixel> src attribute must start with "https://" or "//". Invalid value: ' +
                t
            ),
            t
          );
        }),
        i
      );
    })(ro),
    Lo = (function () {
      function t(t, n, i) {
        var r = this;
        (this.Xo = Ji(t)),
          (this.Jo = n),
          (this.Qo = i || 0),
          (this.Zo = -1),
          (this.rs = 0),
          (this.es = !1),
          (this.us = function () {
            r.os();
          });
      }
      var n = t.prototype;
      return (
        (n.isPending = function () {
          return -1 != this.Zo;
        }),
        (n.schedule = function (t) {
          var n = t || this.Qo;
          this.es && n < 10 && (n = 10);
          var i = Date.now() + n;
          return (
            (!this.isPending() || i - this.rs < -10) &&
            (this.cancel(),
            (this.rs = i),
            (this.Zo = this.Xo.delay(this.us, n)),
            !0)
          );
        }),
        (n.os = function () {
          (this.Zo = -1),
            (this.rs = 0),
            (this.es = !0),
            this.Jo(),
            (this.es = !1);
        }),
        (n.cancel = function () {
          this.isPending() && (this.Xo.cancel(this.Zo), (this.Zo = -1));
        }),
        t
      );
    })(),
    Uo = 'inabox-resources',
    zo = (function () {
      function t(t) {
        var n = this;
        (this.vu = t),
          (this.win = t.win),
          (this.qe = []),
          (this.ss = 0),
          (this.os = new Lo(this.win, this.hs.bind(this), 70)),
          (this.fs = new fr()),
          (this.cs = new a()),
          (this.ls = null),
          (function (t) {
            return ci(t, 'input');
          })(this.win).setupInputModeClasses(t),
          'inabox' != Ct(this.win).runtime &&
            t.onVisibilityChanged(function () {
              switch (t.getVisibilityState()) {
                case hr:
                  n.qe.forEach(function (t) {
                    return t.pause();
                  });
                  break;
                case or:
                  n.qe.forEach(function (t) {
                    return t.resume();
                  }),
                    n.schedulePass();
              }
            }),
          (this.vs = []),
          (this.ds = !1),
          this.vu.whenReady().then(function () {
            (n.ds = !0), n.ps(), n.schedulePass(1);
          });
      }
      var n = t.prototype;
      return (
        (n.dispose = function () {
          this.qe.forEach(function (t) {
            return t.unload();
          }),
            (this.qe.length = 0),
            this.ls && (this.ls.disconnect(), (this.ls = null));
        }),
        (n.get = function () {
          return this.qe.slice(0);
        }),
        (n.getAmpdoc = function () {
          return this.vu;
        }),
        (n.getResourceForElement = function (t) {
          return Hu.forElement(t);
        }),
        (n.getResourceForElementOptional = function (t) {
          return Hu.forElementOptional(t);
        }),
        (n.getScrollDirection = function () {
          return 1;
        }),
        (n.add = function (t) {
          var n = new Hu(++this.ss, t, this);
          this.qe.push(n), Xt().fine(Uo, 'resource added:', n.debugid);
        }),
        (n.upgraded = function (t) {
          var n = Hu.forElement(t);
          this.vs.push(n), this.ps();
        }),
        (n.remove = function (t) {
          var n = Hu.forElementOptional(t);
          if (n) {
            this.ls && this.ls.unobserve(t);
            var i = this.qe.indexOf(n);
            -1 !== i && this.qe.splice(i, 1),
              Xt().fine(Uo, 'element removed:', n.debugid);
          }
        }),
        (n.scheduleLayoutOrPreload = function (t) {
          this.os.schedule();
        }),
        (n.schedulePass = function (t) {
          return this.os.schedule(t);
        }),
        (n.updateOrEnqueueMutateTask = function (t, n) {}),
        (n.schedulePassVsync = function () {}),
        (n.onNextPass = function (t) {
          this.fs.add(t);
        }),
        (n.ampInitComplete = function () {}),
        (n.updateLayoutPriority = function (t, n) {}),
        (n.setRelayoutTop = function (t) {}),
        (n.maybeHeightChanged = function () {}),
        (n.whenFirstPass = function () {
          return this.cs.promise;
        }),
        (n.hs = function () {
          var t = Date.now();
          Xt().fine(Uo, 'doPass'),
            this.qe.forEach(function (t) {
              t.isLayoutPending() && !t.element.R1() && t.measure();
            }),
            this.qe.forEach(function (n) {
              !n.element.R1() &&
                2 === n.getState() &&
                n.isDisplayed() &&
                (n.layoutScheduled(t), n.startLayout());
            }),
            this.vu.signals().signal(Gu),
            this.fs.fire(),
            this.cs.resolve();
        }),
        (n.ps = function () {
          for (var t = this, n = this.vs.length - 1; n >= 0; n--) {
            var i = this.vs[n];
            (this.ds || _n(i.element, this.vu.getRootNode())) &&
              (this.vs.splice(n, 1),
              (i.build() || h()).then(function () {
                return t.schedulePass();
              }),
              Xt().fine(Uo, 'resource upgraded:', i.debugid));
          }
        }),
        t
      );
    })();
  function Ho(t) {
    return (function (t, n) {
      var i = n.documentElement;
      return ['⚡4email', 'amp4email'].some(function (t) {
        return i.hasAttribute(t);
      });
    })(0, t);
  }
  var Go = 'Action',
    Vo = '__AMP_ACTION_MAP__' + Math.random(),
    Fo = '__AMP_ACTION_QUEUE__',
    Bo = '__AMP_ACTION_HANDLER__',
    qo = { form: ['submit', 'clear'] },
    Wo = [
      { tagOrTarget: 'AMP', method: 'setState' },
      { tagOrTarget: '*', method: 'focus' },
      { tagOrTarget: '*', method: 'hide' },
      { tagOrTarget: '*', method: 'show' },
      { tagOrTarget: '*', method: 'toggleClass' },
      { tagOrTarget: '*', method: 'toggleChecked' },
      { tagOrTarget: '*', method: 'toggleVisibility' },
    ],
    $o = {
      button: !0,
      checkbox: !0,
      link: !0,
      listbox: !0,
      menuitem: !0,
      menuitemcheckbox: !0,
      menuitemradio: !0,
      option: !0,
      radio: !0,
      scrollbar: !0,
      slider: !0,
      spinbutton: !0,
      switch: !0,
      tab: !0,
      treeitem: !0,
    },
    Yo = (function () {
      function t(t, n, i, r, e, u, o) {
        var s =
            arguments.length > 7 && void 0 !== arguments[7]
              ? arguments[7]
              : '?',
          h =
            arguments.length > 8 && void 0 !== arguments[8]
              ? arguments[8]
              : null,
          a =
            arguments.length > 9 && void 0 !== arguments[9]
              ? arguments[9]
              : Math.random();
        (this.node = t),
          (this.method = n),
          (this.args = i),
          (this.source = r),
          (this.caller = e),
          (this.event = u),
          (this.trust = o),
          (this.actionEventType = s),
          (this.tagOrTarget = h || t.tagName),
          (this.sequenceId = a);
      }
      return (
        (t.prototype.satisfiesTrust = function (t) {
          if (!$(this.trust))
            return (
              Xt().error(
                Go,
                "Invalid trust for '"
                  .concat(this.method, "': ")
                  .concat(this.trust)
              ),
              !1
            );
          if (this.trust < t) {
            var n = (function (t) {
              switch (t) {
                case 1:
                  return 'low';
                case 3:
                  return 'high';
                default:
                  return tt(2 === t), 'default';
              }
            })(this.trust);
            return (
              Yt().error(
                Go,
                '"'
                  .concat(this.actionEventType, '" event with "')
                  .concat(n, '" trust is not allowed to ') +
                  'invoke "'
                    .concat(this.tagOrTarget.toLowerCase(), '.')
                    .concat(this.method, '".')
              ),
              !1
            );
          }
          return !0;
        }),
        t
      );
    })(),
    Ko = (function () {
      function t(t, n) {
        (this.ampdoc = t),
          (this.gs = n || t.getRootNode()),
          (this.bs = this.ampdoc.isSingleDoc() && Ho(this.gs)),
          (this.ys = this.bs ? Wo : null),
          (this.ws = A()),
          (this.As = A()),
          this.addEvent('tap'),
          this.addEvent('submit'),
          this.addEvent('change'),
          this.addEvent('input-debounced'),
          this.addEvent('input-throttled'),
          this.addEvent('valid'),
          this.addEvent('invalid');
      }
      var n = t.prototype;
      return (
        (n.addEvent = function (t) {
          var n = this;
          if ('tap' == t)
            this.gs.addEventListener('click', function (i) {
              if (!i.defaultPrevented) {
                var r = i.target;
                n.trigger(r, t, i, 3);
              }
            }),
              this.gs.addEventListener('keydown', function (i) {
                var r = i.key,
                  e = i.target;
                if ('Enter' == r || ' ' == r) {
                  var u = e.getAttribute('role'),
                    o = u && x($o, u.toLowerCase());
                  !i.defaultPrevented &&
                    o &&
                    n.trigger(e, t, i, 3) &&
                    i.preventDefault();
                }
              });
          else if ('submit' == t)
            this.gs.addEventListener(t, function (i) {
              var r = i.target;
              n.trigger(r, t, i, 3);
            });
          else if ('change' == t)
            this.gs.addEventListener(t, function (i) {
              var r = i.target;
              n.xs(i), n.trigger(r, t, i, 3);
            });
          else if ('input-debounced' == t) {
            var i = vt(
              this.ampdoc.win,
              function (i) {
                var r = i.target;
                n.trigger(r, t, i, 3);
              },
              300
            );
            this.gs.addEventListener('input', function (t) {
              var r = new Jo(t);
              n.xs(r), i(r);
            });
          } else if ('input-throttled' == t) {
            var r = lt(
              this.ampdoc.win,
              function (i) {
                var r = i.target;
                n.trigger(r, t, i, 3);
              },
              100
            );
            this.gs.addEventListener('input', function (t) {
              var i = new Jo(t);
              n.xs(i), r(i);
            });
          } else
            ('valid' != t && 'invalid' != t) ||
              this.gs.addEventListener(t, function (i) {
                var r = i.target;
                n.trigger(r, t, i, 3);
              });
        }),
        (n.addGlobalTarget = function (t, n) {
          this.ws[t] = n;
        }),
        (n.addGlobalMethodHandler = function (t, n) {
          var i =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 2;
          this.As[t] = { handler: n, minTrust: i };
        }),
        (n.trigger = function (t, n, i, r, e) {
          return this.Es(t, n, i, r, e);
        }),
        (n.execute = function (t, n, i, r, e, u, o) {
          var s = new Yo(t, n, i, r, e, u, o);
          this.Ps(s);
        }),
        (n.installActionHandler = function (t, n) {
          if (
            (Jt(
              Xo(t.getAttribute('id') || '') || t.tagName.toLowerCase() in qo
            ),
            t[Bo])
          )
            Xt().error(Go, 'Action handler already installed for '.concat(t));
          else {
            t[Bo] = n;
            var i = t[Fo];
            G(i) &&
              Ji(on(t)).delay(function () {
                i.forEach(function (t) {
                  try {
                    n(t);
                  } catch (n) {
                    Xt().error(Go, 'Action execution failed:', t, n);
                  }
                }),
                  (t[Fo].length = 0);
              }, 1);
          }
        }),
        (n.hasAction = function (t, n, i) {
          return !!this.Ts(t, n, i);
        }),
        (n.hasResolvableAction = function (t, n, i) {
          var r = this,
            e = this.Ts(t, n, i);
          return (
            !!e &&
            e.actionInfos.some(function (t) {
              var n = t.target;
              return !!r.Os(n);
            })
          );
        }),
        (n.hasResolvableActionForTarget = function (t, n, i, r) {
          var e = this,
            u = this.Ts(t, n, r);
          return (
            !!u &&
            u.actionInfos.some(function (t) {
              var n = t.target;
              return e.Os(n) == i;
            })
          );
        }),
        (n.Os = function (t) {
          return this.ws[t] ? this.gs : this.gs.getElementById(t);
        }),
        (n.setAllowlist = function (t) {
          Jt(
            t.every(function (t) {
              return t.tagOrTarget && t.method;
            })
          ),
            (this.ys = t);
        }),
        (n.addToAllowlist = function (t, n, i) {
          var r = this;
          (i && i.includes('email') !== this.bs) ||
            (this.ys || (this.ys = []),
            G(n) || (n = [n]),
            n.forEach(function (n) {
              r.ys.some(function (i) {
                return i.tagOrTarget == t && i.method == n;
              }) || r.ys.push({ tagOrTarget: t, method: n });
            }));
        }),
        (n.Es = function (t, n, i, r, e) {
          var u = this,
            o = this.Ts(t, n);
          if (!o) return !1;
          var h = Math.random(),
            a = null;
          return (
            o.actionInfos.forEach(function (f) {
              var c = f.args,
                l = f.method,
                v = f.str,
                d = f.target,
                m = (function (t, n, i) {
                  if (!t) return t;
                  var r = i || {};
                  if (n) {
                    var e = (function (t) {
                      return t.detail;
                    })(n);
                    e && (r.event = e);
                  }
                  var u = A();
                  return (
                    Object.keys(t).forEach(function (n) {
                      var i = t[n];
                      if ('object' == p(i) && i.expression) {
                        var e = i.expression,
                          o = (function (t, n) {
                            if ('.' == n) return t;
                            for (
                              var i, r = t, e = s(n.split('.'), !0);
                              !(i = e()).done;

                            ) {
                              var u = i.value;
                              if (
                                !(
                                  u &&
                                  r &&
                                  void 0 !== r[u] &&
                                  'object' == p(r) &&
                                  x(r, u)
                                )
                              ) {
                                r = void 0;
                                break;
                              }
                              r = r[u];
                            }
                            return r;
                          })(r, e);
                        i = void 0 === o ? null : o;
                      }
                      r[i] ? (u[n] = r[i]) : (u[n] = i);
                    }),
                    u
                  );
                })(c, i, e),
                g = function () {
                  var e = u.Os(d);
                  if (e) {
                    var s = new Yo(
                      e,
                      l,
                      m,
                      t,
                      o.node,
                      i,
                      r,
                      n,
                      e.tagName || d,
                      h
                    );
                    return u.Ps(s);
                  }
                  u.Is(
                    'Target "'
                      .concat(d, '" not found for action [')
                      .concat(v, '].')
                  );
                };
              a = a ? a.then(g) : g();
            }),
            o.actionInfos.length >= 1
          );
        }),
        (n.Is = function (t, n) {
          if (n) {
            var i = Yt().createError('['.concat(Go, '] ').concat(t));
            throw (ju(i, n), i);
          }
          Yt().error(Go, t);
        }),
        (n.Ps = function (t) {
          var n = t.method,
            i = t.tagOrTarget;
          if (
            this.ys &&
            !(function (t, n) {
              var i = t.method,
                r = t.node,
                e = t.tagOrTarget;
              i === io &&
                'function' == typeof r.getDefaultActionAlias &&
                (i = r.getDefaultActionAlias());
              var u = i.toLowerCase(),
                o = e.toLowerCase();
              return n.some(function (t) {
                return (
                  (t.tagOrTarget.toLowerCase() === o ||
                    '*' === t.tagOrTarget) &&
                  t.method.toLowerCase() === u
                );
              });
            })(t, this.ys)
          )
            return (
              this.Is(
                '"'
                  .concat(i, '.')
                  .concat(n, '" is not allowlisted ')
                  .concat(JSON.stringify(this.ys), '.')
              ),
              null
            );
          var r = this.ws[i];
          if (r) return r(t);
          var e = t.node,
            u = this.As[n];
          if (u && t.satisfiesTrust(u.minTrust)) return u.handler(t);
          var o = e.tagName.toLowerCase();
          if (Xo(o))
            return (
              e.enqueAction
                ? e.enqueAction(t)
                : this.Is('Unrecognized AMP element "'.concat(o, '".'), e),
              null
            );
          var s = qo[o];
          if (Xo(e.getAttribute('id') || '') || (s && s.indexOf(n) > -1)) {
            var h = e[Bo];
            return h ? h(t) : ((e[Fo] = e[Fo] || []), e[Fo].push(t)), null;
          }
          return (
            this.Is(
              'Target ('
                .concat(i, ') doesn\'t support "')
                .concat(n, '" action.'),
              t.caller
            ),
            null
          );
        }),
        (n.Ts = function (t, n, i) {
          for (var r, e = t; e; ) {
            if (i && e == i) return null;
            var u = this.Rs(e, n);
            if (u && !(r = e).disabled && !pn(r, ':disabled'))
              return { node: e, actionInfos: Jt(u) };
            e = e.parentElement;
          }
          return null;
        }),
        (n.Rs = function (t, n) {
          var i = this.Ss(t, n);
          return (i && i[n]) || null;
        }),
        (n.Ss = function (t, n) {
          var i = t[Vo];
          if (void 0 === i)
            if (((i = null), t.hasAttribute('on')))
              (i = Zo(t.getAttribute('on'), t)), (t[Vo] = i);
            else if (t.hasAttribute('execute')) {
              var r = t.getAttribute('execute');
              (i = Zo(''.concat(n, ':').concat(r), t)), (t[Vo] = i);
            }
          return i;
        }),
        (n.setActions = function (t, n) {
          t.setAttribute('on', n), delete t[Vo];
        }),
        (n.xs = function (t) {
          var n = A(),
            i = t.target;
          if (
            (void 0 !== i.value && (n.value = i.value),
            'INPUT' == i.tagName && (n.valueAsNumber = Number(i.value)),
            void 0 !== i.checked && (n.checked = i.checked),
            (void 0 === i.min && void 0 === i.max) ||
              ((n.min = i.min), (n.max = i.max)),
            i.files &&
              (n.files = H(i.files).map(function (t) {
                return { name: t.name, size: t.size, type: t.type };
              })),
            Object.keys(n).length > 0)
          )
            try {
              t.detail = n;
            } catch (t) {}
        }),
        t
      );
    })();
  function Xo(t) {
    return 'amp-' === t.substring(0, 4);
  }
  var Jo = function (t) {
    (this.detail = null),
      (function (t, n) {
        var i = n || A();
        for (var r in t) {
          var e = t[r];
          i[r] = 'function' == typeof e ? Qo : t[r];
        }
      })(t, this);
  };
  function Qo() {
    Jt(null);
  }
  function Zo(t, n) {
    var i,
      r,
      e = ns.bind(null, t, n),
      u = is.bind(null, t, n),
      o = null,
      s = new us(t);
    do {
      if (
        (i = s.next()).type == rs.EOF ||
        (i.type == rs.SEPARATOR && ';' == i.value)
      );
      else if (i.type == rs.LITERAL || i.type == rs.ID) {
        var h = i.value;
        u(s.next(), [rs.SEPARATOR], ':');
        var a = [];
        do {
          var f = u(s.next(), [rs.LITERAL, rs.ID]).value,
            c = io,
            l = null;
          (r = s.peek()).type == rs.SEPARATOR &&
            '.' == r.value &&
            (s.next(),
            (c = u(s.next(), [rs.LITERAL, rs.ID]).value || c),
            (r = s.peek()).type == rs.SEPARATOR &&
              '(' == r.value &&
              (s.next(), (l = ts(s, u, e)))),
            a.push({ event: h, target: f, method: c, args: l, str: t }),
            (r = s.peek());
        } while (r.type == rs.SEPARATOR && ',' == r.value && s.next());
        o || (o = A()), (o[h] = a);
      } else e(!1, '; unexpected token ['.concat(i.value || '', ']'));
    } while (i.type != rs.EOF);
    return o;
  }
  function ts(t, n, i) {
    var r,
      e,
      u = t.peek(),
      o = null;
    if (u.type == rs.OBJECT) {
      o = A();
      var s = t.next().value;
      (o.__AMP_OBJECT_STRING__ = s), n(t.next(), [rs.SEPARATOR], ')');
    } else
      do {
        var h = (r = t.next()),
          a = h.type,
          f = h.value;
        if (a != rs.SEPARATOR || (',' != f && ')' != f))
          if (a == rs.LITERAL || a == rs.ID) {
            n(t.next(), [rs.SEPARATOR], '=');
            var c = [(r = n(t.next(!0), [rs.LITERAL, rs.ID]))];
            if (r.type == rs.ID)
              for (
                u = t.peek();
                u.type == rs.SEPARATOR && '.' == u.value;
                u = t.peek()
              )
                t.next(), (r = n(t.next(!1), [rs.ID])), c.push(r);
            var l =
              0 == (e = c).length
                ? null
                : 1 == e.length
                ? e[0].value
                : {
                    expression: e
                      .map(function (t) {
                        return t.value;
                      })
                      .join('.'),
                  };
            o || (o = A()),
              (o[f] = l),
              i(
                (u = t.peek()).type == rs.SEPARATOR &&
                  (',' == u.value || ')' == u.value),
                'Expected either [,] or [)]'
              );
          } else i(!1, '; unexpected token ['.concat(r.value || '', ']'));
      } while (r.type != rs.SEPARATOR || ')' != r.value);
    return o;
  }
  function ns(t, n, i, r) {
    return Qt(i, 'Invalid action definition in %s: [%s] %s', n, t, r || '');
  }
  function is(t, n, i, r, e) {
    return (
      void 0 !== e
        ? ns(
            t,
            n,
            r.includes(i.type) && i.value == e,
            '; expected ['.concat(e, ']')
          )
        : ns(t, n, r.includes(i.type)),
      i
    );
  }
  var rs = { INVALID: 0, EOF: 1, SEPARATOR: 2, LITERAL: 3, ID: 4, OBJECT: 5 },
    es = ' \t\n\r\f\v \u2028\u2029',
    us = (function () {
      function t(t) {
        (this._s = t), (this.Ms = -1);
      }
      var n = t.prototype;
      return (
        (n.next = function (t) {
          var n = this.dr(t || !1);
          return (this.Ms = n.index), n;
        }),
        (n.peek = function (t) {
          return this.dr(t || !1);
        }),
        (n.dr = function (t) {
          var n = this.Ms + 1;
          if (n >= this._s.length) return { type: rs.EOF, index: this.Ms };
          var i = this._s.charAt(n);
          if (-1 != es.indexOf(i)) {
            for (
              n++;
              n < this._s.length && -1 != es.indexOf(this._s.charAt(n));
              n++
            );
            if (n >= this._s.length) return { type: rs.EOF, index: n };
            i = this._s.charAt(n);
          }
          if (
            t &&
            (os(i) ||
              ('.' == i && n + 1 < this._s.length && os(this._s[n + 1])))
          ) {
            for (var r = '.' == i, e = n + 1; e < this._s.length; e++) {
              var u = this._s.charAt(e);
              if ('.' != u) {
                if (!os(u)) break;
              } else r = !0;
            }
            var o = this._s.substring(n, e),
              s = r ? parseFloat(o) : parseInt(o, 10);
            return (n = e - 1), { type: rs.LITERAL, value: s, index: n };
          }
          if (-1 != ';:.()=,|!'.indexOf(i))
            return { type: rs.SEPARATOR, value: i, index: n };
          if (-1 != '"\''.indexOf(i)) {
            for (var h = -1, a = n + 1; a < this._s.length; a++)
              if (this._s.charAt(a) == i) {
                h = a;
                break;
              }
            if (-1 == h) return { type: rs.INVALID, index: n };
            var f = this._s.substring(n + 1, h);
            return (n = h), { type: rs.LITERAL, value: f, index: n };
          }
          if ('{' == i) {
            for (var c = 1, l = -1, v = n + 1; v < this._s.length; v++) {
              var d = this._s[v];
              if (('{' == d ? c++ : '}' == d && c--, c <= 0)) {
                l = v;
                break;
              }
            }
            if (-1 == l) return { type: rs.INVALID, index: n };
            var m = this._s.substring(n, l + 1);
            return (n = l), { type: rs.OBJECT, value: m, index: n };
          }
          for (
            var p = n + 1;
            p < this._s.length &&
            -1 ==
              ' \t\n\r\f\v \u2028\u2029;:.()=,|!"\'{}'.indexOf(
                this._s.charAt(p)
              );
            p++
          );
          var g = this._s.substring(n, p);
          if (((n = p - 1), t && ('true' == g || 'false' == g))) {
            var b = 'true' == g;
            return { type: rs.LITERAL, value: b, index: n };
          }
          return os(g.charAt(0))
            ? { type: rs.LITERAL, value: g, index: n }
            : { type: rs.ID, value: g, index: n };
        }),
        t
      );
    })();
  function os(t) {
    return t >= '0' && t <= '9';
  }
  function ss(t) {
    return !!t && 'function' == typeof t.getFormData;
  }
  var hs = ['GET', 'POST'],
    as = [G, w];
  function fs(t, n) {
    var i = N({}, n);
    if (ss(n.body)) {
      var r = n.body;
      (i.headers['Content-Type'] = 'multipart/form-data;charset=utf-8'),
        (i.body = (function (t) {
          for (var n = [], i = t.next(); !i.done; i = t.next()) n.push(i.value);
          return n;
        })(r.entries()));
    }
    return { input: t, init: i };
  }
  function cs(t, n, i, r) {
    if (!n) return h();
    var e = r.prerenderSafe ? h() : n.whenFirstVisible(),
      u = nr(n),
      o = xu(i),
      s = u.hasCapability('xhrInterceptor'),
      a = r.bypassInterceptorForDev && !1;
    return o || !s || a
      ? e
      : n.getRootNode().documentElement.hasAttribute('allow-xhr-interception')
      ? e
          .then(function () {
            return u.isTrustedViewer();
          })
          .then(function (n) {
            if (n || Ge(t, 'untrusted-xhr-interception')) {
              var e = { originalRequest: fs(i, r) };
              return u.sendMessageAwaitResponse('xhr', e).then(function (t) {
                return (function (t, n) {
                  if ((et(w(t), 'Object expected: %s', t), 'document' != n))
                    return new Response(t.body, t.init);
                  var i = A(),
                    r = {
                      status: 200,
                      statusText: 'OK',
                      getResponseHeader: function (t) {
                        return i[String(t).toLowerCase()] || null;
                      },
                    };
                  if (t.init) {
                    var e = t.init;
                    G(e.headers) &&
                      e.headers.forEach(function (t) {
                        var n = t[0],
                          r = t[1];
                        i[String(n).toLowerCase()] = String(r);
                      }),
                      e.status && (r.status = parseInt(e.status, 10)),
                      e.statusText && (r.statusText = String(e.statusText));
                  }
                  return new Response(t.body ? String(t.body) : '', r);
                })(t, r.responseType);
              });
            }
          })
      : e;
  }
  function ls(t, n, i) {
    return tt('string' == typeof n), !1 !== i.ampCors && (n = Su(t, n)), n;
  }
  function vs(t, n) {
    var i,
      r = t || {},
      e = r.credentials;
    return (
      tt(void 0 === e || 'include' == e || 'omit' == e),
      (r.method =
        void 0 === (i = r.method)
          ? 'GET'
          : ((i = i.toUpperCase()), tt(hs.includes(i)), i)),
      (r.headers = r.headers || {}),
      n && (r.headers.Accept = n),
      tt(null !== r.body),
      r
    );
  }
  function ds(t, n, i) {
    i = i || {};
    var r = (function (t) {
      return t.origin || vu(t.location.href).origin;
    })(t);
    return (
      r == vu(n).origin &&
        ((i.headers = i.headers || {}),
        (i.headers['AMP-Same-Origin'] = 'true')),
      i
    );
  }
  function ms(t) {
    return new Promise(function (n) {
      if (t.ok) return n(t);
      var i = t.status,
        r = Yt().createError('HTTP error '.concat(i));
      throw (
        ((r.retriable = (function (t) {
          return 415 == t || (t >= 500 && t < 600);
        })(i)),
        (r.response = t),
        r)
      );
    });
  }
  var ps = (function () {
      function t(t) {
        this.win = t;
        var n = Ui(t);
        this.ks = n.isSingleDoc() ? n.getSingleDoc() : null;
      }
      var n = t.prototype;
      return (
        (n.Cs = function (t, n) {
          var i = arguments,
            r = this;
          return cs(this.win, this.ks, t, n).then(function (t) {
            if (t) return t;
            if (ss(n.body)) {
              var e = n.body;
              n.body = e.getFormData();
            }
            return r.win.fetch.apply(null, i);
          });
        }),
        (n.Ns = function (t) {
          var n =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
          return (
            (t = ls(this.win, t, n)),
            (n = ds(this.win, t, n)),
            this.Cs(t, n).then(
              function (t) {
                return t;
              },
              function (n) {
                var i = vu(t).origin;
                throw Yt().createExpectedError(
                  'XHR',
                  'Failed fetching ('.concat(i, '/...):'),
                  n && n.message
                );
              }
            )
          );
        }),
        (n.fetchJson = function (t, n) {
          return this.fetch(
            t,
            (function (t) {
              var n = vs(t, 'application/json');
              if ('POST' == n.method && !ss(n.body)) {
                tt(
                  as.some(function (t) {
                    return t(n.body);
                  })
                ),
                  (n.headers['Content-Type'] =
                    n.headers['Content-Type'] || 'text/plain;charset=utf-8');
                var i = n.headers['Content-Type'];
                n.body =
                  'application/x-www-form-urlencoded' === i
                    ? bu(n.body)
                    : JSON.stringify(n.body);
              }
              return n;
            })(n)
          );
        }),
        (n.fetchText = function (t, n) {
          return this.fetch(t, vs(n, 'text/plain'));
        }),
        (n.xssiJson = function (t, n) {
          return n
            ? t.text().then(function (t) {
                return t.startsWith(n)
                  ? ut(t.slice(n.length))
                  : (Yt().warn(
                      'XHR',
                      'Failed to strip missing prefix "'.concat(
                        n,
                        '" in fetch response.'
                      )
                    ),
                    ut(t));
              })
            : t.json();
        }),
        (n.fetch = function (t, n) {
          var i = vs(n);
          return this.Ns(t, i).then(function (t) {
            return ms(t);
          });
        }),
        (n.sendSignal = function (t, n) {
          return this.Ns(t, n).then(function (t) {
            return ms(t);
          });
        }),
        (n.getCorsUrl = function (t, n) {
          return Su(t, n);
        }),
        t
      );
    })(),
    gs = (function (t) {
      D(i, t);
      var n = z(i);
      function i(t) {
        var i;
        return ((i = n.call(this, t)).js = A()), i;
      }
      var r = i.prototype;
      return (
        (r.fetch = function (n, i) {
          var r = this,
            e = (i && i.headers && i.headers.Accept) || '',
            u = !i || !i.method || 'GET' === i.method,
            o = this.Ds(n, e),
            s = !!this.js[o];
          if (u && s)
            return this.js[o].then(function (t) {
              return t.clone();
            });
          var h = t.prototype.fetch.call(this, n, i);
          return (
            u &&
              (this.js[o] = h.then(
                function (t) {
                  return delete r.js[o], t.clone();
                },
                function (t) {
                  throw (delete r.js[o], t);
                }
              )),
            h
          );
        }),
        (r.Ds = function (t, n) {
          return Au(Ru(t, Iu(this.win.location))) + n;
        }),
        i
      );
    })(ps),
    bs = { '+': '-', '/': '_', '=': '.' };
  function ys(t) {
    var n = (function (t) {
      for (var n = new Array(t.length), i = 0; i < t.length; i++)
        n[i] = String.fromCharCode(t[i]);
      return n.join('');
    })(t);
    return btoa(n).replace(/[+/=]/g, function (t) {
      return bs[t];
    });
  }
  var ws = 'Crypto',
    As = (function () {
      function t(t) {
        this.t = t;
        var n = null,
          i = !1;
        t.crypto &&
          (t.crypto.subtle
            ? (n = t.crypto.subtle)
            : t.crypto.webkitSubtle && ((n = t.crypto.webkitSubtle), (i = !0))),
          (this.pkcsAlgo = {
            name: 'RSASSA-PKCS1-v1_5',
            hash: { name: 'SHA-256' },
          }),
          (this.subtle = n),
          (this.Ls = i),
          (this.Us = null);
      }
      var n = t.prototype;
      return (
        (n.sha384 = function (t) {
          var n = this;
          if (('string' == typeof t && (t = at(t)), !this.subtle || this.Us))
            return (this.Us || this.zs()).then(function (n) {
              return n(t);
            });
          try {
            return this.subtle.digest({ name: 'SHA-384' }, t).then(
              function (t) {
                return new Uint8Array(t);
              },
              function (i) {
                return (
                  i.message &&
                    i.message.indexOf('secure origin') < 0 &&
                    Yt().error(
                      ws,
                      'SubtleCrypto failed, fallback to closure lib.',
                      i
                    ),
                  n.zs().then(function () {
                    return n.sha384(t);
                  })
                );
              }
            );
          } catch (i) {
            return (
              Xt().error(
                ws,
                'SubtleCrypto failed, fallback to closure lib.',
                i
              ),
              this.zs().then(function () {
                return n.sha384(t);
              })
            );
          }
        }),
        (n.sha384Base64 = function (t) {
          return this.sha384(t).then(function (t) {
            return ys(t);
          });
        }),
        (n.uniform = function (t) {
          return this.sha384(t).then(function (t) {
            for (var n = 0, i = 2; i >= 0; i--) n = (n + t[i]) / 256;
            return n;
          });
        }),
        (n.zs = function () {
          var t = this;
          return this.Us
            ? this.Us
            : (this.Us = Fi(this.t)
                .preloadExtension('amp-crypto-polyfill')
                .then(function () {
                  return ci(t.t, 'crypto-polyfill');
                }));
        }),
        (n.isPkcsAvailable = function () {
          return Boolean(this.subtle) && !1 !== this.t.isSecureContext;
        }),
        (n.importPkcsKey = function (t) {
          Jt(this.isPkcsAvailable());
          var n = this.Ls ? ht(JSON.stringify(t)) : t;
          return this.subtle.importKey('jwk', n, this.pkcsAlgo, !0, ['verify']);
        }),
        (n.verifyPkcs = function (t, n, i) {
          return (
            Jt(this.isPkcsAvailable()),
            this.subtle.verify(this.pkcsAlgo, t, n, i)
          );
        }),
        t
      );
    })(),
    xs = ['prefetch', 'preload', 'preconnect', 'dns-prefetch'],
    Es = (function () {
      function t(t) {
        (this.vu = t), (this.Hs = null), (this.Gs = null);
      }
      return (
        (t.prototype.get = function () {
          if (this.Hs) return this.Hs;
          var t = this.vu,
            n = Ou(t.getUrl()),
            i = t.getRootNode(),
            r = i && i.AMP && i.AMP.canonicalUrl;
          if (!r) {
            var e = i.querySelector('link[rel=canonical]');
            r = e ? vu(e.href).href : n;
          }
          var u,
            o = (function (t) {
              return String(Math.floor(1e4 * t.Math.random()));
            })(t.win),
            s = (function (t) {
              var n = A();
              if (t.head)
                for (
                  var i = t.head.querySelectorAll('link[rel]'),
                    r = function (t) {
                      var r = i[t],
                        e = r.href,
                        u = r.getAttribute('rel');
                      if (!u || !e) return 'continue';
                      u.split(/\s+/).forEach(function (t) {
                        if (-1 == xs.indexOf(t)) {
                          var i = n[t];
                          i
                            ? (G(i) || (i = n[t] = [i]), i.push(e))
                            : (n[t] = e);
                        }
                      });
                    },
                    e = 0;
                  e < i.length;
                  e++
                )
                  r(e);
              return n;
            })(t.win.document),
            h = (u = t.win.document.head.querySelector('meta[name="viewport"]'))
              ? u.getAttribute('content')
              : null,
            a = (function (t) {
              if (
                !t.isSingleDoc() ||
                'a' !=
                  ((n = t.win.location.href),
                  xu((n = lu(n))) ? n.pathname.split('/', 2)[1] : null)
              )
                return null;
              var n,
                i = gt(vu(t.win.location.href).search).amp_r;
              return void 0 === i ? null : gt(i);
            })(t);
          return (this.Hs = {
            get sourceUrl() {
              return Ou(t.getUrl());
            },
            canonicalUrl: r,
            pageViewId: o,
            get pageViewId64() {
              return (
                this.Gs ||
                  (this.Gs = (function (t) {
                    var n,
                      i = (function (t) {
                        return (
                          ft(t, 16) ||
                          String(
                            t.location.href +
                              Date.now() +
                              t.Math.random() +
                              t.screen.width +
                              t.screen.height
                          )
                        );
                      })(t);
                    if ('string' == typeof i)
                      return ((n = t), ci(n, 'crypto')).sha384Base64(i);
                    var r = i;
                    return f(function () {
                      return ys(r).replace(/\.+$/, '');
                    });
                  })(t.win)),
                this.Gs
              );
            },
            linkRels: s,
            viewport: h,
            replaceParams: a,
          });
        }),
        t
      );
    })(),
    Ps = { attributes: !0, attributeFilter: ['hidden'], subtree: !0 },
    Ts = (function () {
      function t(t) {
        this.gs = t.getRootNode();
        var n = this.gs.ownerDocument || this.gs;
        (this.t = Jt(n.defaultView)), (this.Ht = null), (this.Vs = null);
      }
      var n = t.prototype;
      return (
        (n.add = function (t) {
          var n = this;
          this.Fs();
          var i = this.Vs.add(t);
          return function () {
            i(), 0 === n.Vs.getHandlerCount() && n.dispose();
          };
        }),
        (n.Fs = function () {
          var t = this;
          if (!this.Ht) {
            this.Vs = new fr();
            var n = new this.t.MutationObserver(function (n) {
              n && t.Vs.fire(n);
            });
            (this.Ht = n), n.observe(this.gs, Ps);
          }
        }),
        (n.dispose = function () {
          this.Ht &&
            (this.Ht.disconnect(),
            this.Vs.removeAll(),
            (this.Ht = null),
            (this.Vs = null));
        }),
        t
      );
    })();
  function Os(t) {
    try {
      return t.state;
    } catch (t) {
      return null;
    }
  }
  var Is = 'History',
    Rs = 'AMP.History',
    Ss = (function () {
      function t(t, n) {
        (this.vu = t),
          (this.Xo = Ji(t.win)),
          (this.Bs = n),
          (this.qs = 0),
          (this.Ws = []),
          (this.Ou = []),
          this.Bs.setOnStateUpdated(this.$s.bind(this));
      }
      var n = t.prototype;
      return (
        (n.cleanup = function () {
          this.Bs.cleanup();
        }),
        (n.push = function (t, n) {
          var i = this;
          return this.Ys(function () {
            return i.Bs.push(n).then(function (n) {
              return i.$s(n), t && (i.Ws[n.stackIndex] = t), n.stackIndex;
            });
          }, 'push');
        }),
        (n.pop = function (t) {
          var n = this;
          return this.Ys(function () {
            return n.Bs.pop(t).then(function (t) {
              n.$s(t);
            });
          }, 'pop');
        }),
        (n.replace = function (t) {
          var n = this;
          return this.Ys(function () {
            return n.Bs.replace(t);
          }, 'replace');
        }),
        (n.get = function () {
          var t = this;
          return this.Ys(function () {
            return t.Bs.get();
          }, 'get');
        }),
        (n.goBack = function (t) {
          var n = this;
          return this.Ys(function () {
            return n.qs <= 0 && !t
              ? h()
              : n.Bs.pop(n.qs).then(function (t) {
                  n.$s(t);
                });
          }, 'goBack');
        }),
        (n.replaceStateForTarget = function (t) {
          var n = this;
          Jt('#' == t[0]);
          var i = this.vu.win.location.hash;
          return this.push(function () {
            n.vu.win.location.replace(i || '#');
          }).then(function () {
            n.Bs.replaceStateForTarget(t);
          });
        }),
        (n.getFragment = function () {
          return this.Bs.getFragment();
        }),
        (n.updateFragment = function (t) {
          return '#' == t[0] && (t = t.substr(1)), this.Bs.updateFragment(t);
        }),
        (n.$s = function (t) {
          (this.qs = t.stackIndex), this.Ks(t);
        }),
        (n.Ks = function (t) {
          var n = this;
          if (!(this.qs >= this.Ws.length - 1)) {
            for (var i = [], r = this.Ws.length - 1; r > this.qs; r--)
              this.Ws[r] && (i.push(this.Ws[r]), (this.Ws[r] = void 0));
            if ((this.Ws.splice(this.qs + 1), i.length > 0))
              for (
                var e = function (r) {
                    n.Xo.delay(function () {
                      return i[r](t);
                    }, 1);
                  },
                  u = 0;
                u < i.length;
                u++
              )
                e(u);
          }
        }),
        (n.Ys = function (t, n) {
          var i = new a(),
            r = i.promise,
            e = i.reject,
            u = i.resolve,
            o = new Error('history trace for ' + n + ': ');
          return (
            this.Ou.push({ callback: t, resolve: u, reject: e, trace: o }),
            1 == this.Ou.length && this.Xs(),
            r
          );
        }),
        (n.Xs = function () {
          var t = this;
          if (0 != this.Ou.length) {
            var n,
              i = this.Ou[0];
            try {
              n = i.callback();
            } catch (t) {
              n = Promise.reject(t);
            }
            n.then(
              function (t) {
                i.resolve(t);
              },
              function (t) {
                Xt().error(Is, 'failed to execute a task:', t),
                  i.trace && ((i.trace.message += t), Xt().error(Is, i.trace)),
                  i.reject(t);
              }
            ).then(function () {
              t.Ou.splice(0, 1), t.Xs();
            });
          }
        }),
        t
      );
    })(),
    _s = (function () {
      function t(t) {
        var n = this;
        (this.win = t), (this.Xo = Ji(t));
        var i = this.win.history;
        this.Js = i.length - 1;
        var r,
          e,
          u = Os(i);
        u && void 0 !== u[Rs] && (this.Js = Math.min(u[Rs], this.Js)),
          (this.qs = this.Js),
          this.Qs,
          (this.$s = null),
          (this.Zs = 'state' in i),
          (this.th = this.nh(this.qs)),
          i.pushState && i.replaceState
            ? ((this.ih = i.originalPushState || i.pushState.bind(i)),
              (this.rh = i.originalReplaceState || i.replaceState.bind(i)),
              (r = function (t, i, r) {
                n.th = t;
                try {
                  n.ih(t, i, r || null);
                } catch (t) {
                  Xt().error(Is, 'pushState failed: ' + t.message);
                }
              }),
              (e = function (t, i, r) {
                n.th = t;
                try {
                  void 0 !== r ? n.rh(t, i, r) : n.rh(t, i);
                } catch (t) {
                  Xt().error(Is, 'replaceState failed: ' + t.message);
                }
              }),
              i.originalPushState || (i.originalPushState = this.ih),
              i.originalReplaceState || (i.originalReplaceState = this.rh))
            : ((r = function (t, i, r) {
                n.th = t;
              }),
              (e = function (t, i, r) {
                n.th = t;
              })),
          (this.eh = r),
          (this.uh = e);
        try {
          this.uh(this.nh(this.qs, !0));
        } catch (t) {
          Xt().error(Is, 'Initial replaceState failed: ' + t.message);
        }
        (i.pushState = this.oh.bind(this)),
          (i.replaceState = this.sh.bind(this)),
          (this.hh = function (t) {
            var i = t.state;
            Xt().fine(
              Is,
              'popstate event: ' +
                n.win.history.length +
                ', ' +
                JSON.stringify(i)
            ),
              n.ah();
          }),
          this.win.addEventListener('popstate', this.hh);
      }
      var n = t.prototype;
      return (
        (n.cleanup = function () {
          this.ih && (this.win.history.pushState = this.ih),
            this.rh && (this.win.history.replaceState = this.rh),
            this.win.removeEventListener('popstate', this.hh);
        }),
        (n.nh = function (t, n) {
          var i = A(n ? this.fh() : void 0);
          return (i[Rs] = t), i;
        }),
        (n.setOnStateUpdated = function (t) {
          this.$s = t;
        }),
        (n.push = function (t) {
          var n = this;
          return this.lh(function () {
            var i = n.dh(n.fh(), t || {});
            return (
              n.oh(i, void 0, i.fragment ? '#' + i.fragment : void 0),
              f(function () {
                return n.dh(i, { stackIndex: n.qs });
              })
            );
          });
        }),
        (n.pop = function (t) {
          var n = this;
          return (
            (t = Math.max(t, this.Js)),
            this.lh(function () {
              return n.mh(n.qs - t + 1);
            }).then(function (t) {
              return n.dh(n.fh(), { stackIndex: t });
            })
          );
        }),
        (n.replace = function () {
          var t = this,
            n =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {};
          return this.lh(function () {
            var i = t.dh(t.fh(), n || {}),
              r = (i.url || '').replace(/#.*/, ''),
              e = i.fragment ? '#' + i.fragment : '';
            return (
              t.sh(i, i.title, r || e ? r + e : void 0),
              f(function () {
                return t.dh(i, { stackIndex: t.qs });
              })
            );
          });
        }),
        (n.get = function () {
          var t = this;
          return f(function () {
            return t.dh(t.fh(), { stackIndex: t.qs });
          });
        }),
        (n.backTo = function (t) {
          var n = this;
          return (
            (t = Math.max(t, this.Js)),
            this.lh(function () {
              return n.mh(n.qs - t);
            })
          );
        }),
        (n.ah = function () {
          var t = this.fh();
          Xt().fine(
            Is,
            'history event: ' +
              this.win.history.length +
              ', ' +
              JSON.stringify(t)
          );
          var n = t ? t[Rs] : void 0,
            i = this.qs,
            r = this.Qs;
          (this.Qs = void 0),
            i > this.win.history.length - 2 &&
              ((i = this.win.history.length - 2),
              this.ph(this.dh(t, { stackIndex: i }))),
            null == n
              ? (i += 1)
              : (i =
                  n < this.win.history.length
                    ? n
                    : this.win.history.length - 1),
            t || (t = {}),
            (t[Rs] = i),
            this.uh(t, void 0, void 0),
            i != this.qs && this.ph(this.dh(t, { stackIndex: i })),
            i < this.Js && (this.Js = i),
            r && r.resolve();
        }),
        (n.fh = function () {
          return this.Zs ? Os(this.win.history) : this.th;
        }),
        (n.gh = function () {
          Jt(!this.Qs);
        }),
        (n.lh = function (t) {
          return this.Qs ? this.Qs.promise.then(t, t) : t();
        }),
        (n.bh = function () {
          this.gh();
          var t = new a(),
            n = t.reject,
            i = t.resolve,
            r = this.Xo.timeoutPromise(500, t.promise);
          return (this.Qs = { promise: r, resolve: i, reject: n }), r;
        }),
        (n.mh = function (t) {
          var n = this;
          if ((this.gh(), t <= 0)) return Promise.resolve(this.qs);
          this.th = this.nh(this.qs - t);
          var i = this.bh();
          return (
            this.win.history.go(-t),
            i.then(function () {
              return Promise.resolve(n.qs);
            })
          );
        }),
        (n.oh = function (t, n, i) {
          this.gh(), t || (t = {});
          var r = this.qs + 1;
          (t[Rs] = r),
            this.eh(t, n, i),
            r != this.win.history.length - 1 &&
              ((r = this.win.history.length - 1), (t[Rs] = r), this.uh(t));
          var e = this.dh(t, { stackIndex: r });
          this.ph(e);
        }),
        (n.replaceStateForTarget = function (t) {
          var n = this;
          Jt('#' == t[0]),
            this.lh(function () {
              n.win.removeEventListener('popstate', n.hh);
              try {
                n.win.location.replace(t);
              } finally {
                n.win.addEventListener('popstate', n.hh);
              }
              return n.sh(), h();
            });
        }),
        (n.sh = function (t, n, i) {
          this.gh(), t || (t = {});
          var r = Math.min(this.qs, this.win.history.length - 1);
          (t[Rs] = r), this.uh(t, n, i);
          var e = this.dh(t, { stackIndex: r });
          this.ph(e);
        }),
        (n.ph = function (t) {
          this.gh(),
            (t.stackIndex = Math.min(
              t.stackIndex,
              this.win.history.length - 1
            )),
            this.qs != t.stackIndex &&
              (Xt().fine(
                Is,
                'stack index changed: ' + this.qs + ' -> ' + t.stackIndex
              ),
              (this.qs = t.stackIndex),
              this.$s && this.$s(t));
        }),
        (n.getFragment = function () {
          var t = this.win.location.hash;
          return (t = t.substr(1)), Promise.resolve(t);
        }),
        (n.updateFragment = function (t) {
          return this.replace({ fragment: t });
        }),
        (n.dh = function (t, n) {
          var i = N(N({}, (t && t.data) || {}), n.data || {});
          return N(N(N({}, t || {}), n), {}, { data: i });
        }),
        t
      );
    })(),
    Ms = (function () {
      function t(t, n) {
        var i = this;
        (this.win = t),
          (this.yh = n),
          (this.qs = 0),
          (this.$s = null),
          (this.wh = this.yh.onMessage('historyPopped', function (t) {
            return i.Ah(t);
          }));
      }
      var n = t.prototype;
      return (
        (n.replaceStateForTarget = function (t) {
          Jt('#' == t[0]), this.win.location.replace(t);
        }),
        (n.cleanup = function () {
          this.wh();
        }),
        (n.setOnStateUpdated = function (t) {
          this.$s = t;
        }),
        (n.xh = function (t, n, i) {
          return this.Eh(t)
            ? t
            : (Xt().warn(Is, 'Ignored unexpected "%s" data:', i, t), n);
        }),
        (n.Eh = function (t) {
          return !!t && void 0 !== t.stackIndex;
        }),
        (n.push = function (t) {
          var n = this,
            i = N({ stackIndex: this.qs + 1 }, t || {}),
            r = 'pushHistory';
          return this.yh.sendMessageAwaitResponse(r, i).then(function (t) {
            var e = i,
              u = n.xh(t, e, r);
            return n.ph(u), u;
          });
        }),
        (n.pop = function (t) {
          var n = this;
          if (t > this.qs) return this.get();
          var i = { stackIndex: this.qs },
            r = 'popHistory';
          return this.yh.sendMessageAwaitResponse(r, i).then(function (t) {
            var i = { stackIndex: n.qs - 1 },
              e = n.xh(t, i, r);
            return n.ph(e), e;
          });
        }),
        (n.replace = function (t) {
          var n = this;
          if (t && t.url) {
            if (!this.yh.hasCapability('fullReplaceHistory')) {
              var i = { stackIndex: this.qs };
              return Promise.resolve(i);
            }
            var r = t.url.replace(/#.*/, '');
            t.url = r;
          }
          var e = N({ stackIndex: this.qs }, t || {}),
            u = 'replaceHistory';
          return this.yh.sendMessageAwaitResponse(u, e, !0).then(function (t) {
            var i = e,
              r = n.xh(t, i, u);
            return n.ph(r), r;
          });
        }),
        (n.get = function () {
          return Promise.resolve({
            data: void 0,
            fragment: '',
            stackIndex: this.qs,
            title: '',
          });
        }),
        (n.Ah = function (t) {
          void 0 !== t.newStackIndex && (t.stackIndex = t.newStackIndex),
            this.Eh(t)
              ? this.ph(t)
              : Xt().warn(Is, 'Ignored unexpected "historyPopped" data:', t);
        }),
        (n.ph = function (t) {
          var n = t.stackIndex;
          this.qs != n &&
            (Xt().fine(Is, 'stackIndex: '.concat(this.qs, ' -> ').concat(n)),
            (this.qs = n),
            this.$s && this.$s(t));
        }),
        (n.getFragment = function () {
          return this.yh.hasCapability('fragment')
            ? this.yh
                .sendMessageAwaitResponse('getFragment', void 0, !0)
                .then(function (t) {
                  if (!t) return '';
                  var n = t;
                  return '#' == n[0] && (n = n.substr(1)), n;
                })
            : Promise.resolve('');
        }),
        (n.updateFragment = function (t) {
          return this.yh.hasCapability('fragment')
            ? this.yh.sendMessageAwaitResponse(
                'replaceHistory',
                { fragment: t },
                !0
              )
            : h();
        }),
        t
      );
    })();
  function ks(t) {
    var n,
      i = nr(t);
    return (
      i.isOvertakeHistory() || t.win.__AMP_TEST_IFRAME
        ? (n = new Ms(t.win, i))
        : (ai(t.win, 'global-history-binding', _s),
          (n = ci(t.win, 'global-history-binding'))),
      new Ss(t, n)
    );
  }
  var Cs = null,
    Ns = ['gclid', 'gclsrc'];
  function js() {
    return Qt(Cs, 'E#19457 trackImpressionPromise');
  }
  function Ds(t, n, i, r) {
    var e, u, o;
    try {
      e = t.open(n, i, r);
    } catch (t) {
      Xt().error('DOM', 'Failed to open url on target: ', i, t);
    }
    return (
      !e &&
        '_top' != i &&
        ('number' != typeof o && (o = 0),
        o + 'noopener'.length > (u = r || '').length ||
          -1 === u.indexOf('noopener', o)) &&
        (e = t.open(n, '_top')),
      e
    );
  }
  var Ls = 'navigation',
    Us = 'click',
    zs = 'contextmenu',
    Hs = ['_top', '_blank'],
    Gs = 'data-a4a-orig-href',
    Vs = (function () {
      function t(t) {
        var n = this;
        (this.ampdoc = t),
          (this.Ph = t.getRootNode()),
          (this.Th = rr(this.ampdoc)),
          (this.yh = nr(this.ampdoc)),
          (this.Oh = Bi(this.ampdoc)),
          (this.Ih = Yi(this.ampdoc.win)),
          (this.Rh = this.Ih.isIos() && this.Ih.isSafari()),
          (this.Sh = kn(this.ampdoc.win) && this.yh.isOvertakeHistory()),
          (this._h =
            this.Ph != this.ampdoc.getRootNode() || !!this.ampdoc.getParent()),
          (this.Mh = 'inabox' == Ct(this.ampdoc.win).runtime),
          (this.kh =
            this.Ph.nodeType == Node.DOCUMENT_NODE
              ? this.Ph.documentElement
              : this.Ph),
          (this.Ch = this.Nh.bind(this)),
          this.Ph.addEventListener(Us, this.Ch),
          this.Ph.addEventListener(zs, this.Ch),
          (this.jh = !1),
          (function (t) {
            return t.whenReady().then(function () {
              return !!t
                .getBody()
                .querySelector('amp-analytics[type=googleanalytics]');
            });
          })(this.ampdoc).then(function (t) {
            n.jh = t;
          }),
          (this.Dh = !1),
          (this.Lh = !1),
          Promise.all([
            this.yh.isTrustedViewer(),
            this.yh.getViewerOrigin(),
          ]).then(function (t) {
            var i;
            (n.Dh = t[0]), (n.Lh = ((i = t[1]), Ot.test(lu(i).origin)));
          }),
          (this.Uh = null),
          (this.zh = new Wu()),
          (this.Hh = new Wu());
      }
      t.installAnchorClickInterceptor = function (t, n) {
        n.document.documentElement.addEventListener(
          'click',
          Fs.bind(null, t),
          !0
        );
      };
      var n = t.prototype;
      return (
        (n.cleanup = function () {
          this.Ch &&
            (this.Ph.removeEventListener(Us, this.Ch),
            this.Ph.removeEventListener(zs, this.Ch));
        }),
        (n.openWindow = function (t, n, i, r) {
          var e = '';
          (!this.Ih.isIos() && this.Ih.isChrome()) || r || (e += 'noopener');
          var u = Ds(t, n, i, e);
          u && !r && (u.opener = null);
        }),
        (n.navigateTo = function (t, n, i) {
          var r =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : {},
            e = r.opener,
            u = void 0 !== e && e,
            o = r.target,
            s = void 0 === o ? '_top' : o;
          n = this.Gh(n);
          var h = tr(this.kh);
          if (h.isProtocolValid(n)) {
            Qt(Hs.includes(s), "Target '".concat(s, "' not supported."));
            var a = h.getSourceUrl(t.location);
            (n = h.resolveRelativeUrl(n, a)),
              '_blank' != s
                ? (i &&
                    (this.Uh || (this.Uh = this.Vh()),
                    this.Uh.includes(i) && this.navigateToAmpUrl(n, i))) ||
                  (t.top.location.href = n)
                : this.openWindow(t, n, s, u);
          } else Yt().error(Ls, 'Cannot navigate to invalid protocol: ' + n);
        }),
        (n.navigateToAmpUrl = function (t, n) {
          return (
            !!this.yh.hasCapability('a2a') &&
            (this.yh.sendMessage('a2aNavigate', { url: t, requestedBy: n }), !0)
          );
        }),
        (n.Vh = function () {
          var t = this.Ph.querySelector('meta[name="amp-to-amp-navigation"]');
          return t && t.hasAttribute('content')
            ? t
                .getAttribute('content')
                .split(',')
                .map(function (t) {
                  return t.trim();
                })
            : [];
        }),
        (n.Nh = function (t) {
          if (!t.defaultPrevented) {
            var n = gn(t.__AMP_CUSTOM_LINKER_TARGET__ || t.target, 'A');
            n &&
              n.href &&
              (t.type == Us ? this.Fh(n, t) : t.type == zs && this.Bh(n, t));
          }
        }),
        (n.Fh = function (t, n) {
          this.qh(t);
          var i = this.Wh(t.href);
          if (!this.$h(n, t, i) && !this.Yh(n, t, i)) {
            var r = this.Kh();
            Bs(i) != Bs(r) && (this.Xh(t, n), (i = this.Wh(t.href))),
              this.Jh(n, t, i, r);
          }
        }),
        (n.Bh = function (t, n) {
          this.qh(t), this.Xh(t, n);
        }),
        (n.Xh = function (t, n) {
          this.zh.forEach(function (i) {
            i(t, n);
          });
        }),
        (n.Gh = function (t) {
          return (
            this.Hh.forEach(function (n) {
              t = n(t);
            }),
            t
          );
        }),
        (n.qh = function (t) {
          var n = null;
          this.jh &&
            !this._h &&
            (n = (function (t, n) {
              for (
                var i = gt(vu(zr.getLocation(t).href).search), r = [], e = 0;
                e < Ns.length;
                e++
              ) {
                var u = Ns[e];
                void 0 !== i[u] && r.push(u);
              }
              var o = n.getAttribute('data-amp-addparams'),
                s = n.href;
              o && (s = gu(s, gt(o)));
              for (var h = gt(vu(s).search), a = r.length - 1; a >= 0; a--)
                void 0 !== h[r[a]] && r.splice(a, 1);
              return (function (t) {
                for (var n = '', i = 0; i < t.length; i++) {
                  var r = t[i];
                  n +=
                    0 == i
                      ? ''.concat(r, '=QUERY_PARAM(').concat(r, ')')
                      : '&'.concat(r, '=QUERY_PARAM(').concat(r, ')');
                }
                return n;
              })(r);
            })(this.ampdoc.win, t)),
            Qi(t).maybeExpandLink(t, n);
        }),
        (n.Yh = function (t, n, i) {
          if (!this.Sh) return !1;
          var r = on(n),
            e = n.href,
            u = i.protocol;
          if ('ftp:' == u) return Ds(r, e, '_blank'), t.preventDefault(), !0;
          var o = /^(https?|mailto):$/.test(u);
          return !(!this.Rh || o || (Ds(r, e, '_top'), t.preventDefault(), 0));
        }),
        (n.$h = function (t, n, i) {
          return !(
            !n.hasAttribute('rel') ||
            !n
              .getAttribute('rel')
              .split(' ')
              .map(function (t) {
                return t.trim();
              })
              .includes('amphtml') ||
            !this.navigateToAmpUrl(i.href, '<a rel=amphtml>') ||
            (t.preventDefault(), 0)
          );
        }),
        (n.Jh = function (t, n, i, r) {
          var e = Bs(i),
            u = Bs(r);
          if (i.hash && e == u) this.Qh(t, i, r);
          else {
            var o = (n.getAttribute('target') || '').toLowerCase();
            (this._h || this.Mh) &&
              '_top' != o &&
              '_blank' != o &&
              ((o = '_blank'), n.setAttribute('target', o));
            var s = this.ampdoc.win,
              h = Yi(s),
              a = nr(n);
            r.search &&
              h.isSafari() &&
              h.getMajorVersion() >= 13 &&
              a.isProxyOrigin() &&
              a.isEmbedded() &&
              this.Zh(s, r, o),
              this.viewerInterceptsNavigation(e, 'intercept_click') &&
                t.preventDefault();
          }
        }),
        (n.Zh = function (t, n, i) {
          Xt().info(
            Ls,
            'Removing iframe query string before navigation:',
            n.search
          );
          var r = n.href,
            e = ''.concat(n.origin).concat(n.pathname).concat(n.hash);
          t.history.replaceState(null, '', e);
          var u = function () {
            var n = t.location.href;
            n == e
              ? (Xt().info(Ls, 'Restored iframe URL with query string:', r),
                t.history.replaceState(null, '', r))
              : Xt().error(Ls, 'Unexpected iframe URL change:', n, e);
          };
          '_blank' === i
            ? t.setTimeout(u, 0)
            : t.addEventListener('pageshow', function n(i) {
                i.persisted && (u(), t.removeEventListener('pageshow', n));
              });
        }),
        (n.Qh = function (t, n, i) {
          var r = this;
          if ((t.preventDefault(), !this._h)) {
            var e = n.hash.slice(1),
              u = null;
            if (e) {
              var o = ln(e);
              u =
                this.Ph.getElementById(e) ||
                this.Ph.querySelector('a[name="'.concat(o, '"]'));
            }
            n.hash != i.hash
              ? this.Oh.replaceStateForTarget(n.hash).then(function () {
                  r.ta(u, e);
                })
              : this.ta(u, e);
          }
        }),
        (n.registerAnchorMutator = function (t, n) {
          this.zh.enqueue(t, n);
        }),
        (n.registerNavigateToMutator = function (t, n) {
          this.Hh.enqueue(t, n);
        }),
        (n.ta = function (t, n) {
          var i = this;
          t
            ? (this.Th.scrollIntoView(t),
              Ji(this.ampdoc.win).delay(function () {
                return i.Th.scrollIntoView(t);
              }, 1))
            : Xt().warn(
                Ls,
                'failed to find element with id='
                  .concat(n, ' or a[name=')
                  .concat(n, ']')
              );
        }),
        (n.Wh = function (t) {
          return tr(this.kh).parse(t);
        }),
        (n.Kh = function () {
          return this.Wh('');
        }),
        (n.viewerInterceptsNavigation = function (t, n) {
          var i = this.yh.hasCapability('interceptNavigation'),
            r =
              this.ampdoc.isSingleDoc() &&
              this.ampdoc
                .getRootNode()
                .documentElement.hasAttribute('allow-navigation-interception');
          return !(
            !i ||
            !r ||
            (!this.Dh && !this.Lh) ||
            (this.yh.sendMessage('navigateTo', { url: t, requestedBy: n }), 0)
          );
        }),
        t
      );
    })();
  function Fs(t, n) {
    var i = gn(n.target, 'A');
    if (i && i.href) {
      var r = i.getAttribute(Gs) || i.getAttribute('href');
      if (r) {
        var e = {
            CLICK_X: function () {
              return n.pageX;
            },
            CLICK_Y: function () {
              return n.pageY;
            },
          },
          u = Qi(i).expandUrlSync(r, e, { CLICK_X: !0, CLICK_Y: !0 });
        u != r &&
          (i.getAttribute(Gs) || i.setAttribute(Gs, r),
          i.setAttribute('href', u));
      }
    }
  }
  function Bs(t) {
    return ''.concat(t.origin).concat(t.pathname).concat(t.search);
  }
  function qs(t) {
    return G(t) ? t : [t];
  }
  var Ws = (function () {
      function t(t) {
        this.qe = Xi(t);
      }
      var n = t.prototype;
      return (
        (n.setOwner = function (t, n) {
          Hu.setOwner(t, n);
        }),
        (n.schedulePreload = function (t, n) {
          this.na(this.qe.getResourceForElement(t), !1, qs(n));
        }),
        (n.scheduleLayout = function (t, n) {
          this.na(this.qe.getResourceForElement(t), !0, qs(n));
        }),
        (n.schedulePause = function (t, n) {
          var i = this.qe.getResourceForElement(t);
          (n = qs(n)),
            this.ia(i, n, function (t) {
              t.pause();
            });
        }),
        (n.scheduleResume = function (t, n) {
          var i = this.qe.getResourceForElement(t);
          (n = qs(n)),
            this.ia(i, n, function (t) {
              t.resume();
            });
        }),
        (n.scheduleUnlayout = function (t, n) {
          var i = this.qe.getResourceForElement(t);
          (n = qs(n)),
            this.ia(i, n, function (t) {
              t.unlayout();
            });
        }),
        (n.requireLayout = function (t, n) {
          var i = [];
          return (
            this.ra(t, function (t) {
              i.push(t.element.ensureLoaded());
            }),
            Promise.all(i)
          );
        }),
        (n.ia = function (t, n, i) {
          for (var r, e = s(n, !0); !(r = e()).done; ) {
            var u = r.value;
            Jt(t.element.contains(u)), this.ra(u, i);
          }
        }),
        (n.ra = function (t, n) {
          if (t.classList.contains('i-amphtml-element')) {
            n(this.qe.getResourceForElement(t));
            var i = t.getPlaceholder();
            i && this.ra(i, n);
          } else
            for (
              var r = t.getElementsByClassName('i-amphtml-element'),
                e = [],
                u = 0;
              u < r.length;
              u++
            ) {
              for (var o = r[u], s = !1, h = 0; h < e.length; h++)
                if (e[h].contains(o)) {
                  s = !0;
                  break;
                }
              s || (e.push(o), n(this.qe.getResourceForElement(o)));
            }
        }),
        (n.na = function (t, n, i) {
          this.ia(t, i, function (n) {
            n.element.ensureLoaded(t.getLayoutPriority());
          });
        }),
        t
      );
    })(),
    $s = (function () {
      function t(t) {
        (this.ea = t.navigator), (this.t = t);
      }
      var n = t.prototype;
      return (
        (n.isAndroid = function () {
          return /Android/i.test(this.ea.userAgent);
        }),
        (n.isIos = function () {
          return /iPhone|iPad|iPod/i.test(this.ea.userAgent);
        }),
        (n.isSafari = function () {
          return (
            /Safari/i.test(this.ea.userAgent) &&
            !this.isChrome() &&
            !this.isEdge() &&
            !this.isFirefox() &&
            !this.isOpera()
          );
        }),
        (n.isChrome = function () {
          return (
            /Chrome|CriOS/i.test(this.ea.userAgent) &&
            !this.isEdge() &&
            !this.isOpera()
          );
        }),
        (n.isFirefox = function () {
          return /Firefox|FxiOS/i.test(this.ea.userAgent) && !this.isEdge();
        }),
        (n.isOpera = function () {
          return /OPR\/|Opera|OPiOS/i.test(this.ea.userAgent);
        }),
        (n.isEdge = function () {
          return /Edge/i.test(this.ea.userAgent);
        }),
        (n.isWebKit = function () {
          return /WebKit/i.test(this.ea.userAgent) && !this.isEdge();
        }),
        (n.isWindows = function () {
          return /Windows/i.test(this.ea.userAgent);
        }),
        (n.isStandalone = function () {
          return (
            (this.isIos() && this.ea.standalone) ||
            (this.isChrome() &&
              this.t.matchMedia('(display-mode: standalone)').matches)
          );
        }),
        (n.isBot = function () {
          return /bot/i.test(this.ea.userAgent);
        }),
        (n.getMajorVersion = function () {
          return this.isSafari()
            ? this.isIos()
              ? this.getIosMajorVersion() || 0
              : this.ua(/\sVersion\/(\d+)/, 1)
            : this.isChrome()
            ? this.ua(/(Chrome|CriOS)\/(\d+)/, 2)
            : this.isFirefox()
            ? this.ua(/(Firefox|FxiOS)\/(\d+)/, 2)
            : this.isOpera()
            ? this.ua(/(OPR|Opera|OPiOS)\/(\d+)/, 2)
            : this.isEdge()
            ? this.ua(/Edge\/(\d+)/, 1)
            : 0;
        }),
        (n.ua = function (t, n) {
          if (!this.ea.userAgent) return 0;
          var i = this.ea.userAgent.match(t);
          return !i || n >= i.length ? 0 : parseInt(i[n], 10);
        }),
        (n.getIosVersionString = function () {
          var t, n, i;
          return (
            (this.isIos() &&
              (null === (t = this.ea.userAgent) ||
              void 0 === t ||
              null === (n = t.match(/OS ([0-9]+[_.][0-9]+([_.][0-9]+)?)\b/)) ||
              void 0 === n ||
              null === (i = n[1]) ||
              void 0 === i
                ? void 0
                : i.replace(/_/g, '.'))) ||
            ''
          );
        }),
        (n.getIosMajorVersion = function () {
          var t = this.getIosVersionString();
          return '' == t ? null : Number(t.split('.')[0]);
        }),
        t
      );
    })();
  function Ys(t) {
    ai(t, 'platform', $s);
  }
  function Ks(t) {
    return t.queryCommandSupported('copy');
  }
  function Xs(t) {
    return t.hasAttribute('hidden');
  }
  var Js = 'STANDARD-ACTIONS',
    Qs = /^i-amphtml-/,
    Zs = (function () {
      function t(t) {
        this.ampdoc = t;
        var n = t.getHeadNode();
        (this.oa = Wi(t)), (this.Th = rr(t)), this.sa(ji(n)), this.ha();
      }
      var n = t.prototype;
      return (
        (n.sa = function (t) {
          t.addGlobalTarget('AMP', this.aa.bind(this)),
            t.addGlobalMethodHandler('hide', this.fa.bind(this)),
            t.addGlobalMethodHandler('show', this.ca.bind(this)),
            t.addGlobalMethodHandler('toggleVisibility', this.la.bind(this)),
            t.addGlobalMethodHandler('scrollTo', this.va.bind(this)),
            t.addGlobalMethodHandler('focus', this.da.bind(this)),
            t.addGlobalMethodHandler('toggleClass', this.ma.bind(this)),
            t.addGlobalMethodHandler('copy', this.pa.bind(this)),
            t.addGlobalMethodHandler('toggleChecked', this.ga.bind(this));
        }),
        (n.ha = function () {
          this.ba() &&
            this.ampdoc.waitForBodyOpen().then(function (t) {
              var n =
                t.getAttribute('data-prefers-dark-mode-class') ||
                'amp-dark-mode';
              t.classList.add(n);
            });
        }),
        (n.ba = function () {
          var t, n;
          try {
            var i = this.ampdoc.win.localStorage.getItem('amp-dark-mode');
            if (i) return 'yes' === i;
          } catch (t) {}
          return null === (t = (n = this.ampdoc.win).matchMedia) || void 0 === t
            ? void 0
            : t.call(n, '(prefers-color-scheme: dark)').matches;
        }),
        (n.aa = function (t) {
          if (!t.satisfiesTrust(2)) return null;
          var n = t.args,
            i = t.method,
            r = t.node,
            e = on(r);
          switch (i) {
            case 'pushState':
            case 'setState':
              var u = r.nodeType === Node.DOCUMENT_NODE ? r.documentElement : r;
              return Hi(u).then(function (n) {
                return Qt(n, 'AMP-BIND is not installed.'), n.invoke(t);
              });
            case 'navigateTo':
              return this.ya(t);
            case 'closeOrNavigateTo':
              return this.wa(t);
            case 'scrollTo':
              return (
                Qt(n.id, 'AMP.scrollTo must provide element ID'),
                (t.node = yi(r).getElementById(n.id)),
                this.va(t)
              );
            case 'goBack':
              return Bi(this.ampdoc).goBack(!(!n || !0 !== n.navigate)), null;
            case 'print':
              return e.print(), null;
            case 'copy':
              return this.pa(t);
            case 'optoutOfCid':
              return Gi(this.ampdoc)
                .then(function (t) {
                  return t.optOut();
                })
                .catch(function (t) {
                  Xt().error(Js, 'Failed to opt out of CID', t);
                });
            case 'toggleTheme':
              return this.Aa(), null;
          }
          throw Yt().createError('Unknown AMP action ', i);
        }),
        (n.pa = function (t) {
          var n,
            i = t.args,
            r = on(t.node),
            e = 'copy-error';
          if ('AMP' === t.tagOrTarget) n = i.text.trim();
          else {
            var u,
              o = nt(t.node);
            n = (
              null !== (u = o.value) && void 0 !== u ? u : o.textContent
            ).trim();
          }
          var s,
            h,
            a,
            f = function (t, n, i) {
              var e = { data: { type: n } },
                u = $e(r, ''.concat(t), e);
              ji(i.caller).trigger(i.caller, t, u, 3);
            };
          (null !== (h = (s = r.document).defaultView) &&
            void 0 !== h &&
            null !== (a = h.navigator) &&
            void 0 !== a &&
            a.clipboard) ||
          Ks(s)
            ? (function (t, n, i, r) {
                var e;
                null !== (e = t.navigator) && void 0 !== e && e.clipboard
                  ? t.navigator.clipboard.writeText(n).then(i, r)
                  : Ks(t.document) &&
                    (function (t, n) {
                      var i,
                        r = !1,
                        e = t.document,
                        u = e.createElement('textarea');
                      Sr(u, {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '50px',
                        height: '50px',
                        padding: 0,
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                      }),
                        (u.value = n),
                        (u.readOnly = !0),
                        (u.contentEditable = 'true'),
                        e.body.appendChild(u),
                        null === (i = t.getSelection()) ||
                          void 0 === i ||
                          i.removeAllRanges(),
                        u.focus(),
                        u.setSelectionRange(0, n.length);
                      try {
                        r = e.execCommand('copy');
                      } catch (t) {}
                      return Tn(u), r;
                    })(t, n)
                  ? i()
                  : r();
              })(
                r,
                n,
                function () {
                  f('copy-success', 'success', t);
                },
                function () {
                  f(e, 'error', t);
                }
              )
            : f(e, 'unsupported', t);
        }),
        (n.ya = function (t) {
          var n = this,
            i = t.args,
            r = t.caller,
            e = t.method,
            u = on(t.node),
            o = h();
          return (
            r.tagName.startsWith('AMP-') &&
              (o = r.getImpl().then(function (t) {
                'function' == typeof t.throwIfCannotNavigate &&
                  t.throwIfCannotNavigate();
              })),
            o.then(
              function () {
                var t;
                ((t = n.ampdoc), vi(t, 'navigation')).navigateTo(
                  u,
                  i.url,
                  'AMP.'.concat(e),
                  { target: i.target, opener: i.opener }
                );
              },
              function (t) {
                Yt().error(Js, t);
              }
            )
          );
        }),
        (n.Aa = function () {
          var t = this;
          this.ampdoc.waitForBodyOpen().then(function (n) {
            try {
              var i =
                n.getAttribute('data-prefers-dark-mode-class') ||
                'amp-dark-mode';
              t.ba()
                ? (n.classList.remove(i),
                  t.ampdoc.win.localStorage.setItem('amp-dark-mode', 'no'))
                : (n.classList.add(i),
                  t.ampdoc.win.localStorage.setItem('amp-dark-mode', 'yes'));
            } catch (t) {}
          });
        }),
        (n.wa = function (t) {
          var n = on(t.node),
            i = n.parent != n,
            r = !1;
          return (
            n.opener &&
              this.ampdoc.isSingleDoc() &&
              !i &&
              (n.close(), (r = n.closed)),
            r ? h() : this.ya(t)
          );
        }),
        (n.va = function (t) {
          var n = t.node,
            i = t.args,
            r = i && i.position,
            e = i && i.duration;
          return (
            r && !['top', 'bottom', 'center'].includes(r) && (r = void 0),
            $(e) || (e = void 0),
            this.Th.animateScrollIntoView(n, r, e)
          );
        }),
        (n.da = function (t) {
          return Mn(t.node), null;
        }),
        (n.fa = function (t) {
          var n = t.node;
          if (n.classList.contains('i-amphtml-element')) {
            var i = n;
            this.oa.mutateElement(
              i,
              function () {
                return i.collapse();
              },
              !0
            );
          } else
            this.oa.mutateElement(n, function () {
              return _r(n, !1);
            });
          return null;
        }),
        (n.ca = function (t) {
          var n = this,
            i = t.node,
            r = on(i);
          if (i.classList.contains(ae(Qr)))
            return (
              Yt().warn(
                Js,
                'Elements with layout=nodisplay cannot be dynamically shown.',
                i
              ),
              null
            );
          this.oa.measureElement(function () {
            'none' != Cr(r, i).display ||
              Xs(i) ||
              Yt().warn(
                Js,
                'Elements can only be dynamically shown when they have the "hidden" attribute set or when they were dynamically hidden.',
                i
              );
          });
          var e,
            u = (e = i).hasAttribute('autofocus')
              ? e
              : e.querySelector('[autofocus]');
          return (
            u && Yi(r).isIos()
              ? (this.xa(i, u), this.oa.mutateElement(i, function () {}))
              : this.oa.mutateElement(i, function () {
                  n.xa(i, u);
                }),
            null
          );
        }),
        (n.xa = function (t, n) {
          t.classList.contains('i-amphtml-element') ? t.expand() : _r(t, !0),
            n && Mn(n);
        }),
        (n.la = function (t) {
          return Xs(t.node) ? this.ca(t) : this.fa(t);
        }),
        (n.ma = function (t) {
          var n = t.node,
            i = t.args,
            r = Yt().assertString(
              i.class,
              "Argument 'class' must be a string."
            );
          return (
            Qs.test(r) ||
              this.oa.mutateElement(n, function () {
                if (void 0 !== i.force) {
                  var t = Yt().assertBoolean(
                    i.force,
                    "Optional argument 'force' must be a boolean."
                  );
                  n.classList.toggle(r, t);
                } else n.classList.toggle(r);
              }),
            null
          );
        }),
        (n.ga = function (t) {
          var n = t.node,
            i = t.args;
          return (
            this.oa.mutateElement(n, function () {
              if (void 0 !== (null == i ? void 0 : i.force)) {
                var t = Yt().assertBoolean(
                  i.force,
                  "Optional argument 'force' must be a boolean."
                );
                n.checked = t;
              } else !0 === n.checked ? (n.checked = !1) : (n.checked = !0);
            }),
            null
          );
        }),
        t
      );
    })(),
    th = '__AMP_IMPL_',
    nh = function () {},
    ih = (function () {
      function t(t) {
        (this.vu = t), (this.Ea = {}), (this.Pa = {});
      }
      var n = t.prototype;
      return (
        (n.whenReady = function (t) {
          return this.Ta(t).then(nh);
        }),
        (n.setHtmlForTemplate = function (t, n) {
          var i = this;
          return this.Ta(t).then(function (t) {
            return i.Oa(t, n);
          });
        }),
        (n.renderTemplate = function (t, n) {
          var i = this;
          return this.Ta(t).then(function (t) {
            return i.Di(t, n);
          });
        }),
        (n.renderTemplateAsString = function (t, n) {
          return this.Ta(t).then(function (t) {
            return t.renderAsString(n);
          });
        }),
        (n.getTemplateRenderer = function (t) {
          return this.Ta(t).then(function (t) {
            return {
              renderAsString: function (n) {
                return t.renderAsString(n);
              },
            };
          });
        }),
        (n.renderTemplateArray = function (t, n) {
          var i = this;
          return 0 == n.length
            ? Promise.resolve([])
            : this.Ta(t).then(function (t) {
                return n.map(function (n) {
                  return i.Di(t, n);
                });
              });
        }),
        (n.findAndRenderTemplate = function (t, n, i) {
          return this.renderTemplate(this.findTemplate(t, i), n);
        }),
        (n.findAndSetHtmlForTemplate = function (t, n, i) {
          return this.setHtmlForTemplate(this.findTemplate(t, i), n);
        }),
        (n.findAndRenderTemplateArray = function (t, n, i) {
          return this.renderTemplateArray(this.findTemplate(t, i), n);
        }),
        (n.hasTemplate = function (t, n) {
          return !!this.maybeFindTemplate(t, n);
        }),
        (n.findTemplate = function (t, n) {
          var i = this.maybeFindTemplate(t, n);
          Qt(i, 'Template not found for %s', t);
          var r = i.tagName;
          return (
            Qt(
              'TEMPLATE' == r ||
                ('SCRIPT' == r && 'text/plain' === i.getAttribute('type')),
              'Template must be defined in a <template> or <script type="text/plain"> tag'
            ),
            i
          );
        }),
        (n.maybeFindTemplate = function (t, n) {
          var i = t.getAttribute('template');
          return i
            ? Sn(t).getElementById(i)
            : n
            ? mn(t, n)
            : t.querySelector('template[type], script[type="text/plain"]');
        }),
        (n.Ta = function (t) {
          var n = this,
            i = t[th];
          if (i) return Promise.resolve(i);
          var r = '',
            e = t.tagName;
          'TEMPLATE' == e
            ? (r = t.getAttribute('type'))
            : 'SCRIPT' == e && (r = t.getAttribute('template')),
            Qt(r, 'Type must be specified: %s', t);
          var u = t.__AMP_WAIT_;
          return (
            u ||
            ((u = this.Ia(t, r).then(function (i) {
              var r = i,
                e = (t[th] = new r(t, n.vu.win));
              return delete t.__AMP_WAIT_, e;
            })),
            (t.__AMP_WAIT_ = u),
            u)
          );
        }),
        (n.Ia = function (t, n) {
          if (this.Ea[n]) return this.Ea[n];
          var i = new a(),
            r = i.promise,
            e = i.resolve;
          return (this.Ea[n] = r), (this.Pa[n] = e), r;
        }),
        (n.Ra = function (t, n) {
          if (this.Ea[t]) {
            var i = this.Pa[t];
            Qt(i, 'Duplicate template type: %s', t), delete this.Pa[t], i(n);
          } else this.Ea[t] = Promise.resolve(n);
        }),
        (n.Di = function (t, n) {
          return t.render(n);
        }),
        (n.Oa = function (t, n) {
          return t.setHtml(n);
        }),
        t
      );
    })(),
    rh = (function () {
      function t(t) {
        (this.win = t),
          (this.Sa = this.win.Promise.resolve()),
          (this._a = 0),
          (this.Ma = {}),
          (this.ka = Date.now());
      }
      var n = t.prototype;
      return (
        (n.timeSinceStart = function () {
          return Date.now() - this.ka;
        }),
        (n.delay = function (t, n) {
          var i = this;
          if (!n) {
            var r = 'p' + this._a++;
            return (
              this.Sa.then(function () {
                i.Ma[r] ? delete i.Ma[r] : t();
              }).catch(ju),
              r
            );
          }
          return this.win.setTimeout(function () {
            try {
              t();
            } catch (t) {
              throw (ju(t), t);
            }
          }, n);
        }),
        (n.cancel = function (t) {
          'string' != typeof t ? this.win.clearTimeout(t) : (this.Ma[t] = !0);
        }),
        (n.promise = function (t) {
          var n = this;
          return new this.win.Promise(function (i) {
            if (-1 == n.delay(i, t))
              throw new Error('Failed to schedule timer.');
          });
        }),
        (n.timeoutPromise = function (t, n, i) {
          var r,
            e = this,
            u = new this.win.Promise(function (n, u) {
              if (
                -1 ==
                (r = e.delay(function () {
                  u(Yt().createError(i || 'timeout'));
                }, t))
              )
                throw new Error('Failed to schedule timer.');
            });
          if (!n) return u;
          var o = function () {
            e.cancel(r);
          };
          return n.then(o, o), this.win.Promise.race([u, n]);
        }),
        (n.poll = function (t, n) {
          var i = this;
          return new this.win.Promise(function (r) {
            var e = i.win.setInterval(function () {
              n() && (i.win.clearInterval(e), r());
            }, t);
          });
        }),
        t
      );
    })();
  function eh(t) {
    ai(t, 'timer', rh);
  }
  var uh = (function () {
      function t(t) {
        var n = t.getRootNode(),
          i = n.ownerDocument || n;
        (this.Ca = i.createElement('a')), (this.Ot = new au(100));
      }
      var n = t.prototype;
      return (
        (n.parse = function (t, n) {
          return du(this.Ca, t, n ? null : this.Ot);
        }),
        (n.Na = function (t) {
          return 'string' != typeof t ? t : this.parse(t);
        }),
        (n.isProtocolValid = function (t) {
          return Eu(t);
        }),
        (n.getSourceOrigin = function (t) {
          return Iu(this.Na(t));
        }),
        (n.getSourceUrl = function (t) {
          return Ou(this.Na(t));
        }),
        (n.resolveRelativeUrl = function (t, n) {
          return Ru(t, this.Na(n));
        }),
        (n.assertHttpsUrl = function (t, n) {
          var i =
            arguments.length > 2 && void 0 !== arguments[2]
              ? arguments[2]
              : 'source';
          return wu(t, n, i);
        }),
        (n.assertAbsoluteHttpOrHttpsUrl = function (t) {
          return (function (t) {
            return (
              Qt(
                /^https?\:/i.test(t),
                'URL must start with "http://" or "https://". Invalid value: %s',
                t
              ),
              vu(t).href
            );
          })(t);
        }),
        (n.isProxyOrigin = function (t) {
          return xu(this.Na(t));
        }),
        (n.isSecure = function (t) {
          return yu(this.Na(t));
        }),
        (n.getWinOrigin = function (t) {
          return t.origin || this.Na(t.location.href).origin;
        }),
        (n.getCdnUrlOnOrigin = function (t) {
          if (xu(t)) return t;
          var n = this.Na(t),
            i = n.hash,
            r = n.host,
            e = n.pathname,
            u = n.search,
            o = encodeURIComponent(r);
          return ''.concat(Tt, '/c/').concat(o).concat(e).concat(u).concat(i);
        }),
        t
      );
    })(),
    oh = 'Expander',
    sh = (function () {
      function t(t, n, i, r, e, u) {
        (this.ja = t),
          (this.Da = n),
          (this.La = i),
          (this.Ua = r),
          (this.ys = e),
          (this.za = !u);
      }
      var n = t.prototype;
      return (
        (n.expand = function (t) {
          if (!t.length) return this.Ua ? t : Promise.resolve(t);
          var n = this.ja.getExpr(this.Da, this.ys),
            i = this.Ha(t, n);
          return i.length ? this.Ga(t, i) : this.Ua ? t : Promise.resolve(t);
        }),
        (n.getMacroNames = function (t) {
          var n = this.ja.getExpr(this.Da, this.ys);
          return t.match(n) || [];
        }),
        (n.Ha = function (t, n) {
          var i = [];
          return (
            t.replace(n, function (t, n, r) {
              var e = t.length,
                u = { start: r, stop: e + r - 1, name: n, length: e };
              i.push(u);
            }),
            i
          );
        }),
        (n.Ga = function (t, n) {
          var i = this,
            r = [],
            e = 0,
            u = 0,
            o = n[u],
            s = 0,
            h = !1;
          return (function a(f) {
            for (
              var c, l = '', v = [], m = [];
              e < t.length && u <= n.length;

            ) {
              var p,
                g = l.trim();
              if (o && e === o.start)
                g &&
                  v.push(
                    s
                      ? (c = l).trimStart
                        ? c.trimStart()
                        : (c + '_').trim().slice(0, -1)
                      : l
                  ),
                  (p =
                    i.Da && x(i.Da, o.name)
                      ? { name: o.name, prioritized: i.Da[o.name], encode: f }
                      : N(
                          N({}, i.ja.get(o.name)),
                          {},
                          { name: o.name, encode: f }
                        )),
                  (e = o.stop + 1),
                  (o = n[++u]),
                  '(' === t[e]
                    ? (e++, s++, r.push(p), v.push(a(!1)))
                    : v.push(i.Va(p)),
                  (l = '');
              else if ('`' === t[e])
                h
                  ? ((h = !1), l.length && v.push(l))
                  : ((h = !0), g && v.push(g)),
                  (l = ''),
                  e++;
              else if (s && ',' === t[e] && !h)
                g && v.push(g),
                  m.push(v),
                  (v = []),
                  ',' === t[e + 1] && (m.push(['']), e++),
                  (l = ''),
                  e++;
              else {
                if (s && ')' === t[e] && !h) {
                  e++, s--;
                  var b = r.pop();
                  return g && v.push(g), m.push(v), i.Va(b, m);
                }
                (l += t[e]), e++;
              }
              e === t.length && l.length && v.push(l);
            }
            return i.Ua
              ? v.join('')
              : Promise.all(v)
                  .then(function (t) {
                    return t.join('');
                  })
                  .catch(function (t) {
                    return d(t), '';
                  });
          })(this.za);
        }),
        (n.Va = function (t, n) {
          var i,
            r = t.encode,
            e = t.name;
          if (
            (null != t.prioritized
              ? (i = t.prioritized)
              : this.Ua && null != t.sync
              ? (i = t.sync)
              : this.Ua
              ? (Yt().error(oh, 'ignoring async replacement key: ', t.name),
                (i = ''))
              : (i = t.async || t.sync),
            this.Ua)
          ) {
            var u = this.Fa(i, e, n);
            return r ? encodeURIComponent(u) : u;
          }
          return this.Ba(i, e, n).then(function (t) {
            return r ? encodeURIComponent(t) : t;
          });
        }),
        (n.Ba = function (t, n, i) {
          var r,
            e = this;
          try {
            if ('function' == typeof t) {
              var u = t;
              r = i
                ? this.qa(i).then(function (t) {
                    return u.apply(null, t);
                  })
                : f(u);
            } else r = Promise.resolve(t);
            return r
              .then(function (t) {
                return e.Wa(n, t, i), null == t ? '' : t;
              })
              .catch(function (t) {
                return d(t), e.Wa(n, '', i), Promise.resolve('');
              });
          } catch (t) {
            return d(t), this.Wa(n, '', i), Promise.resolve('');
          }
        }),
        (n.qa = function (t) {
          return Promise.all(
            t.map(function (t) {
              return Promise.all(t).then(function (t) {
                return t.join('');
              });
            })
          );
        }),
        (n.Fa = function (t, n, i) {
          try {
            var r,
              e = t;
            return (
              'function' == typeof t && (e = t.apply(null, this.$a(i))),
              e && 'function' == typeof e.then
                ? (Yt().error(oh, 'ignoring async macro resolution'), (r = ''))
                : 'string' == typeof e ||
                  'number' == typeof e ||
                  'boolean' == typeof e
                ? (this.Wa(n, e, i), (r = e.toString()))
                : (this.Wa(n, '', i), (r = '')),
              r
            );
          } catch (t) {
            return d(t), this.Wa(n, '', i), '';
          }
        }),
        (n.$a = function (t) {
          return t
            ? t.map(function (t) {
                return t.join('');
              })
            : t;
        }),
        (n.Wa = function (t, n, i) {
          if (this.La) {
            var r = '';
            if (i) {
              var e = i
                .filter(function (t) {
                  return '' !== t;
                })
                .join(',');
              r = '('.concat(e, ')');
            }
            this.La[''.concat(t).concat(r)] = n || '';
          }
        }),
        t
      );
    })(),
    hh = {
      navigationStart: 1,
      redirectStart: 1,
      redirectEnd: 1,
      fetchStart: 1,
      domainLookupStart: 1,
      domainLookupEnd: 1,
      connectStart: 1,
      secureConnectionStart: 1,
      connectEnd: 1,
      requestStart: 1,
      responseStart: 1,
      responseEnd: 1,
      domLoading: 2,
      domInteractive: 2,
      domContentLoaded: 2,
      domComplete: 2,
      loadEventStart: 3,
      loadEventEnd: 4,
    };
  function ah(t, n, i) {
    var r,
      e = hh[n] || 3,
      u = i ? hh[i] || 3 : e,
      o = Math.max(e, u);
    if (1 === o) r = h();
    else if (2 === o) r = xr(t.document);
    else if (3 === o) r = Je(t);
    else if (4 === o) {
      var s = Ji(t);
      r = Je(t).then(function () {
        return s.promise(1);
      });
    }
    return (
      Jt(r),
      r.then(function () {
        return fh(t, n, i);
      })
    );
  }
  function fh(t, n, i) {
    var r = t.performance && t.performance.timing;
    if (r && 0 != r.navigationStart) {
      var e = void 0 === i ? r[n] : r[i] - r[n];
      return !$(e) || e < 0 ? void 0 : e;
    }
  }
  function ch(t, n) {
    var i = t.performance && t.performance.navigation;
    if (i && void 0 !== i[n]) return i[n];
  }
  var lh = 'UrlReplacements';
  function vh(t) {
    return function () {
      return new Date()[t]();
    };
  }
  function dh(t, n) {
    return function () {
      return t[n];
    };
  }
  function mh(t, n) {
    return n
      ? (Qt(
          'ISOCountry' === n,
          'The value passed to AMP_GEO() is not valid name:' + n
        ),
        (t && t[n]) || 'unknown')
      : (null == t ? void 0 : t.matchedISOCountryGroups.join(',')) || 'unknown';
  }
  var ph = (function (t) {
      D(i, t);
      var n = z(i);
      function i(t) {
        var i;
        return ((i = n.call(this, t)).Ya = null), (i.Ka = {}), i;
      }
      var r = i.prototype;
      return (
        (r.Xa = function (t, n, i) {
          var r = this;
          return this.setBoth(
            t,
            function () {
              return fh(r.ampdoc.win, n, i);
            },
            function () {
              return ah(r.ampdoc.win, n, i);
            }
          );
        }),
        (r.initialize = function () {
          var t = this,
            n = this.ampdoc.win,
            i = this.ampdoc.getHeadNode(),
            r = rr(this.ampdoc);
          Zi(this.ampdoc).then(function (n) {
            t.Ya = n;
          }),
            this.set('RANDOM', function () {
              return Math.random();
            });
          var e = Object.create(null);
          this.set('COUNTER', function (t) {
            return (e[t] = 1 + (0 | e[t]));
          }),
            this.set('CANONICAL_URL', function () {
              return t.Ja().canonicalUrl;
            }),
            this.set('CANONICAL_HOST', function () {
              return vu(t.Ja().canonicalUrl).host;
            }),
            this.set('CANONICAL_HOSTNAME', function () {
              return vu(t.Ja().canonicalUrl).hostname;
            }),
            this.set('CANONICAL_PATH', function () {
              return vu(t.Ja().canonicalUrl).pathname;
            }),
            this.setAsync('DOCUMENT_REFERRER', function () {
              return nr(t.ampdoc).getReferrerUrl();
            }),
            this.setAsync('EXTERNAL_REFERRER', function () {
              return nr(t.ampdoc)
                .getReferrerUrl()
                .then(function (t) {
                  return t
                    ? vu(Ou(t)).hostname === zr.getHostname(n)
                      ? null
                      : t
                    : null;
                });
            }),
            this.set('TITLE', function () {
              var t = n.document;
              return t.originalTitle || t.title;
            }),
            this.set('AMPDOC_URL', function () {
              return Au(t.Qa(n.location.href));
            }),
            this.set('AMPDOC_HOST', function () {
              var t = vu(n.location.href);
              return t && t.host;
            }),
            this.set('AMPDOC_HOSTNAME', function () {
              var t = vu(n.location.href);
              return t && t.hostname;
            });
          var u = function () {
            var n = t.Ja();
            return Au(t.Qa(n.sourceUrl));
          };
          this.setBoth(
            'SOURCE_URL',
            function () {
              return u();
            },
            function () {
              return js().then(function () {
                return u();
              });
            }
          ),
            this.set('SOURCE_HOST', function () {
              return vu(t.Ja().sourceUrl).host;
            }),
            this.set('SOURCE_HOSTNAME', function () {
              return vu(t.Ja().sourceUrl).hostname;
            }),
            this.set('SOURCE_PATH', function () {
              return vu(t.Ja().sourceUrl).pathname;
            }),
            this.set('PAGE_VIEW_ID', function () {
              return t.Ja().pageViewId;
            }),
            this.setAsync('PAGE_VIEW_ID_64', function () {
              return t.Ja().pageViewId64;
            }),
            this.setBoth(
              'QUERY_PARAM',
              function (n) {
                var i =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : '';
                return t.Za(n, i);
              },
              function (n) {
                var i =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : '';
                return js().then(function () {
                  return t.Za(n, i);
                });
              }
            ),
            this.set('FRAGMENT_PARAM', function (n) {
              var i =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : '';
              return t.tf(n, i);
            });
          var o = null;
          this.setBoth(
            'CLIENT_ID',
            function (t) {
              return o ? o[t] : null;
            },
            function (n, r, e, u) {
              Qt(
                n,
                'The first argument to CLIENT_ID, the fallback Cookie name, is required'
              );
              var s = h();
              return (
                r &&
                  (s = (function (t) {
                    return _i(
                      t,
                      'userNotificationManager',
                      'amp-user-notification'
                    );
                  })(i).then(function (t) {
                    return t.get(r);
                  })),
                Gi(t.ampdoc)
                  .then(function (t) {
                    return (
                      (u = 'true' == u),
                      t.get(
                        {
                          scope: n,
                          createCookieIfNotPresent: !0,
                          cookieName: e || void 0,
                          disableBackup: u,
                        },
                        s
                      )
                    );
                  })
                  .then(function (t) {
                    return (
                      o || (o = Object.create(null)),
                      t &&
                        '_ga' == (e || n) &&
                        ('string' == typeof t
                          ? (t = t.replace(/^(GA1|1)\.[\d-]+\./, ''))
                          : Xt().error(
                              lh,
                              'non-string cid, what is it?',
                              Object.keys(t)
                            )),
                      (o[n] = t),
                      t
                    );
                  })
              );
            }
          ),
            this.setAsync('VARIANT', function (n) {
              return t.nf(function (t) {
                var i = t[n];
                return (
                  Qt(
                    void 0 !== i,
                    'The value passed to VARIANT() is not a valid experiment in <amp-experiment>:' +
                      n
                  ),
                  null === i ? 'none' : i
                );
              }, 'VARIANT');
            }),
            this.setAsync('VARIANTS', function () {
              return t.nf(function (t) {
                var n = [];
                for (var i in t) {
                  var r = t[i];
                  n.push(i + '.' + (r || 'none'));
                }
                return n.join('!');
              }, 'VARIANTS');
            }),
            this.setBoth(
              'AMP_GEO',
              function (n) {
                return mh(t.Ya, n);
              },
              function (n) {
                return t.if(function (t) {
                  return mh(t, n);
                }, 'AMP_GEO');
              }
            ),
            this.set('TIMESTAMP', vh('getTime')),
            this.set('TIMESTAMP_ISO', vh('toISOString')),
            this.set('TIMEZONE', vh('getTimezoneOffset')),
            this.set('SCROLL_HEIGHT', function () {
              return r.getScrollHeight();
            }),
            this.set('SCROLL_WIDTH', function () {
              return r.getScrollWidth();
            }),
            this.set('VIEWPORT_HEIGHT', function () {
              return r.getHeight();
            }),
            this.set('VIEWPORT_WIDTH', function () {
              return r.getWidth();
            });
          var s = n.screen;
          this.set('SCREEN_WIDTH', dh(s, 'width')),
            this.set('SCREEN_HEIGHT', dh(s, 'height')),
            this.set('AVAILABLE_SCREEN_HEIGHT', dh(s, 'availHeight')),
            this.set('AVAILABLE_SCREEN_WIDTH', dh(s, 'availWidth')),
            this.set('SCREEN_COLOR_DEPTH', dh(s, 'colorDepth')),
            this.set('DOCUMENT_CHARSET', function () {
              var t = n.document;
              return t.characterSet || t.charset;
            }),
            this.set('BROWSER_LANGUAGE', function () {
              var t = n.navigator;
              return (
                t.language ||
                t.userLanguage ||
                t.browserLanguage ||
                ''
              ).toLowerCase();
            }),
            this.set('USER_AGENT', function () {
              return n.navigator.userAgent;
            }),
            this.setBoth(
              'UACH',
              function (n) {
                var i;
                return null !== (i = t.Ka[n]) && void 0 !== i ? i : '';
              },
              function (i) {
                return t.rf(i, n);
              }
            ),
            this.Xa('PAGE_LOAD_TIME', 'navigationStart', 'loadEventStart'),
            this.Xa(
              'DOMAIN_LOOKUP_TIME',
              'domainLookupStart',
              'domainLookupEnd'
            ),
            this.Xa('TCP_CONNECT_TIME', 'connectStart', 'connectEnd'),
            this.Xa('SERVER_RESPONSE_TIME', 'requestStart', 'responseStart'),
            this.Xa('PAGE_DOWNLOAD_TIME', 'responseStart', 'responseEnd'),
            this.Xa('REDIRECT_TIME', 'navigationStart', 'fetchStart'),
            this.Xa(
              'DOM_INTERACTIVE_TIME',
              'navigationStart',
              'domInteractive'
            ),
            this.Xa(
              'CONTENT_LOAD_TIME',
              'navigationStart',
              'domContentLoadedEventStart'
            ),
            this.setAsync('ACCESS_READER_ID', function () {
              return t.ef(function (t) {
                return t.getAccessReaderId();
              }, 'ACCESS_READER_ID');
            }),
            this.setAsync('AUTHDATA', function (n) {
              return (
                Qt(n, 'The first argument to AUTHDATA, the field, is required'),
                t.ef(function (t) {
                  return t.getAuthdataField(n);
                }, 'AUTHDATA')
              );
            }),
            this.setAsync('VIEWER', function () {
              return nr(t.ampdoc)
                .getViewerOrigin()
                .then(function (t) {
                  return null == t ? '' : t;
                });
            }),
            this.setAsync('TOTAL_ENGAGED_TIME', function () {
              return Di(i).then(function (t) {
                return t.getTotalEngagedTime();
              });
            }),
            this.setAsync('INCREMENTAL_ENGAGED_TIME', function (t, n) {
              return Di(i).then(function (i) {
                return i.getIncrementalEngagedTime(t, 'false' !== n);
              });
            }),
            this.set('NAV_TIMING', function (t, i) {
              return (
                Qt(
                  t,
                  'The first argument to NAV_TIMING, the start attribute name, is required'
                ),
                fh(n, t, i)
              );
            }),
            this.setAsync('NAV_TIMING', function (t, i) {
              return (
                Qt(
                  t,
                  'The first argument to NAV_TIMING, the start attribute name, is required'
                ),
                ah(n, t, i)
              );
            }),
            this.set('NAV_TYPE', function () {
              return ch(n, 'type');
            }),
            this.set('NAV_REDIRECT_COUNT', function () {
              return ch(n, 'redirectCount');
            }),
            this.set('AMP_VERSION', function () {
              return '2410292120000';
            }),
            this.set('BACKGROUND_STATE', function () {
              return t.ampdoc.isVisible() ? '0' : '1';
            }),
            this.setAsync('VIDEO_STATE', function (n, i) {
              return ((r = t.ampdoc),
              vi(r, 'video-manager')).getVideoStateProperty(n, i);
              var r;
            }),
            this.setAsync('AMP_STATE', function (n) {
              var i = t.ampdoc.getRootNode(),
                r = i.documentElement || i;
              return Hi(r).then(function (t) {
                return (t && t.getStateValue(n)) || '';
              });
            });
        }),
        (r.Qa = function (t) {
          var n = this.Ja().replaceParams;
          return n
            ? (function (t, n) {
                for (
                  var i = gt(vu(t).search), r = {}, e = Object.keys(n), u = 0;
                  u < e.length;
                  u++
                )
                  x(i, e[u]) || (r[e[u]] = n[e[u]]);
                return gu(t, r);
              })(Pu(t), n)
            : t;
        }),
        (r.Ja = function () {
          return Vi(this.ampdoc);
        }),
        (r.ef = function (t, n) {
          var i = this.ampdoc.getHeadNode();
          return Promise.all([Ci(i), Ni(i)]).then(function (i) {
            var r = i[0],
              e = i[1],
              u = r || e;
            return u
              ? r && e
                ? t(e) || t(r)
                : t(u)
              : (Yt().error(
                  lh,
                  'Access or subsciptions service is not installed to access: ',
                  n
                ),
                null);
          });
        }),
        (r.Za = function (t, n) {
          Qt(
            t,
            'The first argument to QUERY_PARAM, the query string param is required'
          );
          var i = gt(vu(Pu(this.ampdoc.win.location.href)).search),
            r = this.Ja().replaceParams;
          return void 0 !== i[t] ? i[t] : r && void 0 !== r[t] ? r[t] : n;
        }),
        (r.tf = function (t, n) {
          Qt(
            t,
            'The first argument to FRAGMENT_PARAM, the fragment string param is required'
          ),
            Qt('string' == typeof t, 'param should be a string');
          var i = bt(this.ampdoc.win);
          return void 0 === i[t] ? n : i[t];
        }),
        (r.nf = function (t, n) {
          return ((i = this.ampdoc.getHeadNode()),
          Mi(i, 'variant', 'amp-experiment', !0))
            .then(function (t) {
              return (
                Qt(
                  t,
                  'To use variable %s, amp-experiment should be configured',
                  n
                ),
                t.getVariants()
              );
            })
            .then(function (n) {
              return t(n);
            });
          var i;
        }),
        (r.if = function (t, n) {
          var i = this;
          return null !== this.Ya
            ? t(this.Ya)
            : Zi(this.ampdoc.getHeadNode()).then(function (r) {
                return (
                  Qt(r, 'To use variable %s, amp-geo should be configured', n),
                  (i.Ya = r),
                  t(r)
                );
              });
        }),
        (r.rf = function (t, n) {
          var i,
            r,
            e,
            u = this;
          return t in this.Ka
            ? Promise.resolve(this.Ka[t])
            : (null === (i = n.navigator) ||
              void 0 === i ||
              null === (r = i.userAgentData) ||
              void 0 === r ||
              null === (e = r.getHighEntropyValues([t])) ||
              void 0 === e
                ? void 0
                : e.then(function (n) {
                    var i = 'object' !== p(n[t]) ? n[t] : JSON.stringify(n[t]);
                    return (u.Ka[t] = i), i;
                  })) || Promise.resolve('');
        }),
        i
      );
    })(
      (function () {
        function t(t) {
          (this.ampdoc = t),
            (this.uf = Object.create(null)),
            (this.sf = !1),
            this.hf();
        }
        var n = t.prototype;
        return (
          (n.Go = function () {
            this.initialize(), (this.sf = !0);
          }),
          (n.initialize = function () {}),
          (n.get = function (t) {
            return this.sf || this.Go(), this.uf[t];
          }),
          (n.set = function (t, n) {
            return (
              Jt(-1 == t.indexOf('RETURN')),
              (this.uf[t] = this.uf[t] || { sync: void 0, async: void 0 }),
              (this.uf[t].sync = n),
              this
            );
          }),
          (n.setAsync = function (t, n) {
            return (
              Jt(-1 == t.indexOf('RETURN')),
              (this.uf[t] = this.uf[t] || { sync: void 0, async: void 0 }),
              (this.uf[t].async = n),
              this
            );
          }),
          (n.setBoth = function (t, n, i) {
            return this.set(t, n).setAsync(t, i);
          }),
          (n.getExpr = function (t, n) {
            this.sf || this.Go();
            var i = N(N({}, this.uf), t);
            return this.af(Object.keys(i), n);
          }),
          (n.af = function (t, n) {
            var i = this;
            if (
              (this.hf() &&
                (t = t.filter(function (t) {
                  return i.hf().includes(t);
                })),
              n &&
                (t = t.filter(function (t) {
                  return n[t];
                })),
              0 === t.length)
            )
              return /_^/g;
            t.sort(function (t, n) {
              return n.length - t.length;
            });
            var r = t
              .map(function (t) {
                return '$' === t[0] ? '\\' + t : t;
              })
              .join('|');
            return new RegExp('\\$?(' + r + ')', 'g');
          }),
          (n.hf = function () {
            return this.ff
              ? this.ff
              : this.ampdoc.isSingleDoc() && Ho(this.ampdoc.getRootNode())
              ? ((this.ff = ['']), this.ff)
              : void 0;
          }),
          t
        );
      })()
    ),
    gh = (function () {
      function t(t, n) {
        (this.ampdoc = t), (this.ja = n);
      }
      var n = t.prototype;
      return (
        (n.expandStringSync = function (t, n, i) {
          return new sh(this.ja, n, void 0, !0, i, !0).expand(t);
        }),
        (n.expandStringAsync = function (t, n, i) {
          return new sh(this.ja, n, void 0, void 0, i, !0).expand(t);
        }),
        (n.expandUrlSync = function (t, n, i) {
          return this.cf(t, new sh(this.ja, n, void 0, !0, i).expand(t));
        }),
        (n.expandUrlAsync = function (t, n, i, r) {
          var e = this;
          return new sh(this.ja, n, void 0, void 0, i, r)
            .expand(t)
            .then(function (n) {
              return e.cf(t, n);
            });
        }),
        (n.expandInputValueAsync = function (t) {
          return this.lf(t, !1);
        }),
        (n.expandInputValueSync = function (t) {
          return this.lf(t, !0);
        }),
        (n.lf = function (t, n) {
          Jt(
            'INPUT' == t.tagName &&
              'hidden' == (t.getAttribute('type') || '').toLowerCase()
          );
          var i = this.vf(t);
          if (!i) return n ? t.value : Promise.resolve(t.value);
          void 0 === t['amp-original-value'] &&
            (t['amp-original-value'] = t.value);
          var r = new sh(this.ja, void 0, void 0, n, i).expand(
            t['amp-original-value'] || t.value
          );
          return n
            ? (t.value = r)
            : r.then(function (n) {
                return (t.value = n), n;
              });
        }),
        (n.vf = function (t, n) {
          var i = t.getAttribute('data-amp-replace');
          if (i) {
            var r = {};
            return (
              i
                .trim()
                .split(/\s+/)
                .forEach(function (t) {
                  !n || x(n, t)
                    ? (r[t] = !0)
                    : Yt().warn('URL', 'Ignoring unsupported replacement', t);
                }),
              r
            );
          }
        }),
        (n.mn = function (t) {
          var n = Vi(this.ampdoc);
          if (
            t.origin == vu(n.canonicalUrl).origin ||
            t.origin == vu(n.sourceUrl).origin
          )
            return !0;
          var i = this.ampdoc.getMetaByName('amp-link-variable-allowed-origin');
          if (i)
            for (var r = i.trim().split(/\s+/), e = 0; e < r.length; e++)
              if (t.origin == vu(r[e]).origin) return !0;
          return !1;
        }),
        (n.maybeExpandLink = function (t, n) {
          Jt('A' == t.tagName);
          var i = t,
            r = i.getAttribute('data-amp-addparams') || '',
            e = this.vf(i, {
              CLIENT_ID: !0,
              QUERY_PARAM: !0,
              PAGE_VIEW_ID: !0,
              PAGE_VIEW_ID_64: !0,
              NAV_TIMING: !0,
            });
          if (e || r || n) {
            var u = i['amp-original-href'] || i.getAttribute('href'),
              o = vu(u);
            null == i['amp-original-href'] && (i['amp-original-href'] = u);
            var s = this.mn(o);
            return (
              r && (u = gu(u, gt((r = s ? this.df(r, e) : r)))),
              s
                ? (n &&
                    ((e && e.QUERY_PARAM) ||
                      (n = this.expandUrlSync(n, void 0, { QUERY_PARAM: !0 })),
                    (u = gu(u, gt(n)))),
                  (u = this.df(u, e)),
                  (i.href = u))
                : (e &&
                    Yt().warn(
                      'URL',
                      "Ignoring link replacement %s because the link does not go to the document's source, canonical, or allowlisted origin.",
                      u
                    ),
                  (i.href = u))
            );
          }
        }),
        (n.df = function (t, n) {
          return n ? this.expandUrlSync(t, void 0, n) : t;
        }),
        (n.collectVars = function (t, n) {
          var i = Object.create(null);
          return new sh(this.ja, n, i).expand(t).then(function () {
            return i;
          });
        }),
        (n.collectDisallowedVarsSync = function (t) {
          var n = t.getAttribute('src'),
            i = new sh(this.ja).getMacroNames(n),
            r = this.vf(t);
          return r
            ? i.filter(function (t) {
                return !r[t];
              })
            : i;
        }),
        (n.cf = function (t, n) {
          return vu(n, !0).protocol != vu(t, !0).protocol
            ? (Yt().error(lh, 'Illegal replacement of the protocol: ', t), t)
            : (Qt(Eu(n), 'The replacement url has invalid protocol: %s', n), n);
        }),
        (n.getVariableSource = function () {
          return this.ja;
        }),
        t
      );
    })(),
    bh = (function () {
      function t(t) {
        (this.win = t),
          (this.mf = Ui(this.win)),
          (this.pf = this.gf()),
          (this.Uu = []),
          (this.bf = []),
          (this.yf = []),
          (this.wf = []),
          (this.Zo = !1),
          (this.Af = null),
          (this.xf = null),
          (this.Ef = this.Pf.bind(this)),
          (this.Tf = new Lo(this.win, this.Ef, 16)),
          (this.Of = new Lo(this.win, this.Ef, 40)),
          (this.If = this.Rf.bind(this)),
          this.mf.isSingleDoc()
            ? this.mf.getSingleDoc().onVisibilityChanged(this.If)
            : Dr(this.win.document, this.If);
      }
      var n = t.prototype;
      return (
        (n.dispose = function () {
          Lr(this.win.document, this.If);
        }),
        (n.Rf = function () {
          this.Zo && this.Sf();
        }),
        (n.run = function (t, n) {
          this.Uu.push(t), this.yf.push(n || void 0), this.Bu();
        }),
        (n.runPromise = function (t, n) {
          if ((this.run(t, n), this.Af)) return this.Af;
          var i = new a();
          return (this.xf = i.resolve), (this.Af = i.promise);
        }),
        (n.createTask = function (t) {
          var n = this;
          return function (i) {
            n.run(t, i);
          };
        }),
        (n.mutate = function (t) {
          this.run({ measure: void 0, mutate: t });
        }),
        (n.mutatePromise = function (t) {
          return this.runPromise({ measure: void 0, mutate: t });
        }),
        (n.measure = function (t) {
          this.run({ measure: t, mutate: void 0 });
        }),
        (n.measurePromise = function (t) {
          var n = this;
          return new Promise(function (i) {
            n.measure(function () {
              i(t());
            });
          });
        }),
        (n.canAnimate = function (t) {
          return this._f(Jt(t));
        }),
        (n._f = function (t) {
          if (jr(this.win.document) != or) return !1;
          if (this.mf.isSingleDoc()) return this.mf.getSingleDoc().isVisible();
          if (t) {
            var n = this.mf.getAmpDocIfAvailable(t);
            return !n || n.isVisible();
          }
          return !0;
        }),
        (n.runAnim = function (t, n, i) {
          return this._f(t)
            ? (this.run(n, i), !0)
            : (Xt().warn(
                'VSYNC',
                'Did not schedule a vsync request, because document was invisible'
              ),
              !1);
        }),
        (n.createAnimTask = function (t, n) {
          var i = this;
          return function (r) {
            return i.runAnim(t, n, r);
          };
        }),
        (n.runAnimMutateSeries = function (t, n, i) {
          var r = this;
          return this._f(t)
            ? new Promise(function (e, u) {
                var o = Date.now(),
                  s = 0,
                  h = r.createAnimTask(t, {
                    mutate: function (t) {
                      var r = Date.now() - o;
                      n(r, r - s, t)
                        ? i && r > i
                          ? u(new Error('timeout'))
                          : ((s = r), h(t))
                        : e();
                    },
                  });
                h({});
              })
            : Promise.reject(Du());
        }),
        (n.Bu = function () {
          this.Zo || ((this.Zo = !0), this.Sf());
        }),
        (n.Sf = function () {
          this._f()
            ? (this.pf(this.Ef), this.Of.schedule())
            : this.Tf.schedule();
        }),
        (n.Pf = function () {
          this.Of.cancel(), (this.Zo = !1);
          var t = this.xf,
            n = this.yf,
            i = this.Uu;
          (this.xf = null),
            (this.Af = null),
            (this.Uu = this.bf),
            (this.yf = this.wf);
          for (var r = 0; r < i.length; r++)
            i[r].measure && (yh(i[r].measure, n[r]) || (i[r].mutate = void 0));
          for (var e = 0; e < i.length; e++)
            i[e].mutate && yh(i[e].mutate, n[e]);
          (this.bf = i),
            (this.wf = n),
            (this.bf.length = 0),
            (this.wf.length = 0),
            t && t();
        }),
        (n.gf = function () {
          var t = this,
            n =
              this.win.requestAnimationFrame ||
              this.win.webkitRequestAnimationFrame;
          if (n) return n.bind(this.win);
          var i = 0;
          return function (n) {
            var r = Date.now(),
              e = Math.max(0, 16 - (r - i));
            (i = r + e), t.win.setTimeout(n, e);
          };
        }),
        t
      );
    })();
  function yh(t, n) {
    Jt(t);
    try {
      void 0 !== t(n) &&
        Xt().error(
          'VSYNC',
          'callback returned a value but vsync cannot propogate it: %s',
          t.toString()
        );
    } catch (t) {
      return d(t), !1;
    }
    return !0;
  }
  function wh(t) {
    if (!t.defaultPrevented) {
      var n = t.target;
      if (n && 'FORM' == n.tagName) {
        (n.classList.contains('i-amphtml-form')
          ? !n.hasAttribute('amp-novalidate')
          : !n.hasAttribute('novalidate')) &&
          n.checkValidity &&
          !n.checkValidity() &&
          t.preventDefault();
        for (var i = n.elements, r = 0; r < i.length; r++)
          Qt(
            !i[r].name || i[r].name != cu,
            'Illegal input name, %s found: %s',
            cu,
            i[r]
          );
        var e = n.getAttribute('action'),
          u = n.getAttribute('action-xhr'),
          o = (n.getAttribute('method') || 'GET').toUpperCase();
        u &&
          (wu(u, n, 'action-xhr'),
          Qt(!xu(u), 'form action-xhr should not be on AMP CDN: %s', n),
          _u(u)),
          e &&
            (wu(e, n, 'action'),
            Qt(!xu(e), 'form action should not be on AMP CDN: %s', n),
            _u(e)),
          'GET' == o
            ? Qt(
                u || e,
                'form action-xhr or action attribute is required for method=GET: %s',
                n
              )
            : 'POST' == o &&
              (e &&
                Yt().error(
                  'form',
                  'action attribute is invalid for method=POST: %s',
                  n
                ),
              u ||
                (t.preventDefault(),
                Qt(
                  !1,
                  'Only XHR based (via action-xhr attribute) submissions are support for POST requests. %s',
                  n
                )));
        var s = n.getAttribute('target');
        s
          ? Qt(
              '_blank' == s || '_top' == s,
              'form target=%s is invalid can only be _blank or _top: %s',
              s,
              n
            )
          : n.setAttribute('target', '_top'),
          u &&
            (t.preventDefault(),
            t.stopImmediatePropagation(),
            ji(n).execute(n, 'submit', null, n, n, t, 3));
      }
    }
  }
  var Ah = 'Input',
    xh = (function () {
      function t(t) {
        (this.win = t),
          (this.Mf = this.kf.bind(this)),
          (this.Cf = this.Nf.bind(this)),
          (this.jf = null),
          (this.Df = null),
          (this.Lf = null),
          (this.Uf =
            'ontouchstart' in t ||
            (void 0 !== t.navigator.maxTouchPoints &&
              t.navigator.maxTouchPoints > 0) ||
            void 0 !== t.DocumentTouch),
          Xt().fine(Ah, 'touch detected:', this.Uf),
          (this.zf = !1),
          this.win.document.addEventListener('keydown', this.Mf),
          this.win.document.addEventListener('mousedown', this.Cf),
          (this.Hf = !0),
          (this.Gf = 0),
          (this.Vf = new fr()),
          (this.Ff = new fr()),
          (this.Bf = new fr()),
          this.Uf &&
            ((this.Hf = !this.Uf),
            (this.jf = this.qf.bind(this)),
            Xe(t.document, 'mousemove', this.jf));
      }
      var n = t.prototype;
      return (
        (n.setupInputModeClasses = function (t) {
          var n = this;
          this.onTouchDetected(function (i) {
            n.Wf(t, 'amp-mode-touch', i);
          }, !0),
            this.onMouseDetected(function (i) {
              n.Wf(t, 'amp-mode-mouse', i);
            }, !0),
            this.onKeyboardStateChanged(function (i) {
              n.Wf(t, 'amp-mode-keyboard-active', i);
            }, !0);
        }),
        (n.isTouchDetected = function () {
          return this.Uf;
        }),
        (n.onTouchDetected = function (t, n) {
          return n && t(this.isTouchDetected()), this.Vf.add(t);
        }),
        (n.isMouseDetected = function () {
          return this.Hf;
        }),
        (n.onMouseDetected = function (t, n) {
          return n && t(this.isMouseDetected()), this.Ff.add(t);
        }),
        (n.isKeyboardActive = function () {
          return this.zf;
        }),
        (n.onKeyboardStateChanged = function (t, n) {
          return n && t(this.isKeyboardActive()), this.Bf.add(t);
        }),
        (n.Wf = function (t, n, i) {
          var r = this;
          t.waitForBodyOpen().then(function (t) {
            ir(r.win).mutate(function () {
              t.classList.toggle(n, i);
            });
          });
        }),
        (n.kf = function (t) {
          if (!this.zf && !t.defaultPrevented) {
            var n = t.target;
            (n &&
              ('INPUT' == n.tagName ||
                'TEXTAREA' == n.tagName ||
                'SELECT' == n.tagName ||
                'OPTION' == n.tagName ||
                n.hasAttribute('contenteditable'))) ||
              ((this.zf = !0),
              this.Bf.fire(!0),
              Xt().fine(Ah, 'keyboard activated'));
          }
        }),
        (n.Nf = function () {
          this.zf &&
            ((this.zf = !1),
            this.Bf.fire(!1),
            Xt().fine(Ah, 'keyboard deactivated'));
        }),
        (n.qf = function (t) {
          var n = this;
          if (!t.sourceCapabilities || !t.sourceCapabilities.firesTouchEvents) {
            var i;
            this.Lf ||
              ((this.Lf = this.$f.bind(this)), (this.Df = this.Yf.bind(this)));
            var r = (function (t, n, i, r) {
              var e,
                u = new Promise(function (n) {
                  e = Xe(t, 'click', n, void 0);
                });
              return u.then(e, e), r && r(e), u;
            })(this.win.document, 0, 0, function (t) {
              i = t;
            });
            return Ji(this.win)
              .timeoutPromise(300, r)
              .then(this.Df, function () {
                i && i(), n.Lf();
              });
          }
          this.Yf();
        }),
        (n.$f = function () {
          (this.Hf = !0), this.Ff.fire(!0), Xt().fine(Ah, 'mouse detected');
        }),
        (n.Yf = function () {
          this.Gf++,
            this.Gf <= 3
              ? Xe(this.win.document, 'mousemove', this.jf)
              : Xt().fine(Ah, 'mouse detection failed');
        }),
        t
      );
    })(),
    Eh = ['<link rel=preload referrerpolicy=origin>'],
    Ph = 18e4,
    Th = null,
    Oh = (function () {
      function t(t) {
        (this.Kf = t.document),
          (this.Xf = t.document.head),
          (this.Jf = {}),
          (this.Qf = {}),
          (this.Ih = Yi(t)),
          (this.Jf[vu(t.location.href).origin] = !0),
          (this.Zf = (function (t) {
            if (!Th) {
              var n = t.document.createElement('link'),
                i = n.relList;
              if (((n.as = 'invalid-value'), !i || !i.supports)) return {};
              Th = {
                preconnect: i.supports('preconnect'),
                preload: i.supports('preload'),
                onlyValidAs: 'invalid-value' != n.as,
              };
            }
            return Th;
          })(t)),
          (this.Xo = Ji(t));
      }
      var n = t.prototype;
      return (
        (n.url = function (t, n, i) {
          var r = this;
          t.whenFirstVisible().then(function () {
            r.je(t, n, i);
          });
        }),
        (n.je = function (t, n, i) {
          if (this.tc(n)) {
            var r = vu(n).origin,
              e = Date.now(),
              u = this.Jf[r];
            if (u && e < u) i && (this.Jf[r] = e + Ph);
            else {
              var o,
                s = i ? Ph : 1e4;
              (this.Jf[r] = e + s),
                this.Zf.preconnect ||
                  ((o = this.Kf.createElement('link')).setAttribute(
                    'rel',
                    'dns-prefetch'
                  ),
                  o.setAttribute('href', r),
                  this.Xf.appendChild(o));
              var h = this.Kf.createElement('link');
              h.setAttribute('rel', 'preconnect'),
                h.setAttribute('href', r),
                h.setAttribute('referrerpolicy', 'origin'),
                this.Xf.appendChild(h),
                this.Xo.delay(function () {
                  o && o.parentNode && o.parentNode.removeChild(o),
                    h.parentNode && h.parentNode.removeChild(h);
                }, 1e4),
                this.nc(t, r);
            }
          }
        }),
        (n.preload = function (t, n, i) {
          var r = this;
          this.tc(n) &&
            (this.Qf[n] ||
              ((this.Qf[n] = !0),
              this.url(t, n, !0),
              this.Zf.preload &&
                (('document' == i && this.Ih.isSafari()) ||
                  t.whenFirstVisible().then(function () {
                    r.ic(n);
                  }))));
        }),
        (n.ic = function (t) {
          var n = ke(this.Kf)(Eh);
          n.setAttribute('href', t),
            this.Zf.onlyValidAs ? (n.as = 'fetch') : (n.as = ''),
            this.Xf.appendChild(n);
        }),
        (n.tc = function (t) {
          return !(!t.startsWith('https:') && !t.startsWith('http:'));
        }),
        (n.nc = function (t, n) {
          if (!this.Zf.preconnect && (this.Ih.isSafari() || this.Ih.isIos())) {
            var i = Date.now();
            this.Jf[n] = i + Ph;
            var r =
                n +
                '/robots.txt?_AMP_safari_preconnect_polyfill_cachebust=' +
                (i - (i % Ph)),
              e = new XMLHttpRequest();
            e.open('HEAD', r, !0), (e.withCredentials = !0), e.send();
          }
        }),
        t
      );
    })();
  function Ih(t) {
    var n;
    !(function (t) {
      ai(t, 'crypto', As);
    })(t),
      ai(t, 'batched-xhr', gs),
      Ys(t),
      eh(t),
      eh((n = t)),
      ai(n, 'vsync', bh),
      (function (t) {
        ai(t, 'xhr', ps);
      })(t),
      (function (t) {
        ai(t, 'input', xh);
      })(t),
      (function (t) {
        ai(t, 'preconnect', Oh);
      })(t);
  }
  var Rh = ['AMP-AD', 'AMP-ANALYTICS', 'AMP-PIXEL', 'AMP-AD-EXIT'];
  function Sh(t) {
    if (null == t) return 0;
    var n = (function (t) {
        for (var n = t; null != (t = t.parentNode); )
          t.nodeName.startsWith('AMP-') && (n = t);
        return n;
      })(t),
      i = n.nodeName;
    return 'IMG' === i || 'AMP-IMG' === i
      ? 1
      : 'VIDEO' === i || 'AMP-VIDEO' === i
      ? 2
      : 'AMP-CAROUSEL' === i
      ? 8
      : 'AMP-BASE-CAROUSEL' === i
      ? 16
      : 'AMP-AD' === i
      ? 4
      : !i.startsWith('AMP-') && n.textContent
      ? 32
      : 0;
  }
  var _h = (function () {
      function t(t) {
        var n = this;
        (this.win = t),
          (this.rc = ys(ft(t, 16))),
          (this.ec = []),
          (this.uc =
            t.performance.timeOrigin || t.performance.timing.navigationStart),
          (this.vu = null),
          (this.yh = null),
          (this.qe = null),
          (this.oc = null),
          (this.sc = !1),
          (this.hc = !1),
          (this.ac = A()),
          (this.fc = void 0),
          (this.cc = new cr()),
          (this.lc = 0),
          (this.vc = []),
          (this.dc = 0);
        var i =
          (this.win.PerformanceObserver &&
            this.win.PerformanceObserver.supportedEntryTypes) ||
          [];
        if (
          (i.includes('paint') ||
            this.cc.rejectSignal(
              'fcp',
              Xt().createExpectedError('First Contentful Paint not supported')
            ),
          (this.mc = i.includes('layout-shift')),
          !this.mc)
        ) {
          var r = Xt().createExpectedError(
            'Cumulative Layout Shift not supported'
          );
          this.cc.rejectSignal(Jn, r), this.cc.rejectSignal(Zn, r);
        }
        (this.gc = i.includes('first-input')),
          this.gc ||
            this.cc.rejectSignal(
              'fid',
              Xt().createExpectedError('First Input Delay not supported')
            ),
          (this.bc = i.includes('largest-contentful-paint')),
          this.bc ||
            this.cc.rejectSignal(
              'lcp',
              Xt().createExpectedError('Largest Contentful Paint not supported')
            ),
          (this.yc = i.includes('navigation')),
          (this.wc = i.includes('event') && Ge(t, 'interaction-to-next-paint')),
          this.wc ||
            this.cc.rejectSignal(
              ni,
              Xt().createExpectedError(
                'Interaction to next paint not supported'
              )
            ),
          (this.Ac = this.Ac.bind(this)),
          this.addEnabledExperiment('rtv-' + Ct(this.win).rtvVersion),
          Ar(t.document).then(function () {
            n.tick('dr'), n.flush();
          }),
          xr(t.document).then(function () {
            return n.xc();
          }),
          xr(t.document).then(function () {
            return n.Ec(40);
          }),
          this.Pc(),
          (this.Tc = !1),
          (this.Oc = vt(
            t,
            function () {
              n.Ic();
            },
            6e3
          ));
      }
      var n = t.prototype;
      return (
        (n.coreServicesAvailable = function () {
          var t = this,
            n = this.win.document.documentElement;
          (this.vu = Li(n)),
            (this.yh = nr(n)),
            (this.qe = Xi(n)),
            (this.oc = Vi(this.vu)),
            (this.hc = this.yh.isEmbedded() && '1' === this.yh.getParam('csi')),
            this.vu.onVisibilityChanged(this.flush.bind(this)),
            this.Rc();
          var i = this.yh.whenMessagingReady();
          return (
            this.vu.whenFirstVisible().then(function () {
              t.tick('ofv'), t.flush();
            }),
            (this.bc || this.mc) && this.vu.onVisibilityChanged(this.Ac),
            i
              ? i
                  .then(function () {
                    t.tickDelta('msr', t.win.performance.now()),
                      t.tick('timeOrigin', void 0, t.uc);
                    var n = t.vu.getMetaByName('amp-usqp');
                    return (
                      n &&
                        n.split(',').forEach(function (n) {
                          t.addEnabledExperiment('ssr-' + n);
                        }),
                      t.Sc()
                    );
                  })
                  .then(function () {
                    (t.sc = !0), t._c(), t.flush();
                  })
              : h()
          );
        }),
        (n.Sc = function () {
          var t,
            n = this;
          return ((t = Ui(this.win).getSingleDoc()),
          t.waitForBodyOpen().then(function () {
            var n,
              i,
              r = t.getBody(),
              e =
                ((n = r),
                (i = function () {
                  return !!r.firstElementChild;
                }),
                new Promise(function (t) {
                  En(n, i, t);
                }));
            return Ji(t.win)
              .timeoutPromise(2e3, e)
              .then(
                function () {
                  return 'AMP-STORY' === r.firstElementChild.tagName;
                },
                function () {
                  return !1;
                }
              );
          })).then(function (t) {
            t && n.addEnabledExperiment('story');
          });
        }),
        (n.xc = function () {
          this.tick('ol'), this.flush();
        }),
        (n.Pc = function () {
          var t = this;
          if ('inabox' !== Ct(this.win).runtime) {
            var n = !1,
              i = !1,
              r = !1,
              e = !1,
              u = function (u) {
                if ('first-paint' != u.name || n)
                  if ('first-contentful-paint' != u.name || i)
                    if ('first-input' !== u.entryType || r)
                      'layout-shift' === u.entryType
                        ? u.hadRecentInput || (t.Mc(u), (t.dc += u.value))
                        : 'largest-contentful-paint' === u.entryType
                        ? t.kc(u)
                        : 'navigation' != u.entryType || e
                        ? 'event' == u.entryType &&
                          u.interactionId &&
                          t.Ec(u.duration)
                        : ([
                            'domComplete',
                            'domContentLoadedEventEnd',
                            'domContentLoadedEventStart',
                            'domInteractive',
                            'loadEventEnd',
                            'loadEventStart',
                            'requestStart',
                            'responseStart',
                          ].forEach(function (n) {
                            return t.tick(n, u[n]);
                          }),
                          (e = !0));
                    else {
                      var o = u.processingStart - u.startTime;
                      t.tickDelta('fid', o), (r = !0);
                    }
                  else {
                    var s = u.startTime + u.duration;
                    t.tickDelta('fcp', s),
                      t.tickSinceVisible('fcpv', s),
                      (i = !0);
                  }
                else t.tickDelta('fp', u.startTime + u.duration), (n = !0);
              },
              o = [];
            this.win.PerformancePaintTiming &&
              (this.win.performance.getEntriesByType('paint').forEach(u),
              o.push('paint')),
              this.gc && this.Cc(u, { type: 'first-input', buffered: !0 }),
              this.mc && this.Cc(u, { type: 'layout-shift', buffered: !0 }),
              this.bc &&
                this.Cc(u, { type: 'largest-contentful-paint', buffered: !0 }),
              this.yc && this.Cc(u, { type: 'navigation', buffered: !0 }),
              this.wc &&
                this.Cc(u, {
                  type: 'event',
                  durationThreshold: 40,
                  buffered: !0,
                }),
              o.length > 0 && this.Cc(u, { entryTypes: o });
          }
        }),
        (n.Cc = function (t, n) {
          var i = this;
          try {
            new this.win.PerformanceObserver(function (n) {
              n.getEntries().forEach(t), i.flush();
            }).observe(n);
          } catch (t) {
            Xt().warn('Performance', t);
          }
        }),
        (n.Nc = function () {
          var t = this.vu.getVisibilityState();
          return t === ar || t === sr;
        }),
        (n.Ac = function () {
          this.Nc() && (this.jc(), this.Ic());
        }),
        (n.Dc = function () {
          if (!this.Tc) {
            this.Tc = !0;
            var t = this.win,
              n = parseInt(
                Cr(t, t.document.body).getPropertyValue('--google-font-exp'),
                10
              );
            n >= 0 && this.addEnabledExperiment('google-font-exp='.concat(n));
          }
        }),
        (n.jc = function () {
          this.mc && (this.Dc(), this.Lc());
        }),
        (n.Mc = function (t) {
          if (this.vu && !this.Nc()) {
            var n = this.vc;
            if (n.length > 0) {
              var i = n[0],
                r = n[n.length - 1];
              if (
                t.startTime - r.startTime < 1e3 &&
                t.startTime - i.startTime < 5e3
              )
                return void n.push(t);
              this.Ic();
            }
            n.push(t), this.Oc();
          }
        }),
        (n.Ic = function () {
          for (
            var t, n = this.vc, i = this.cc.get(Jn), r = 0, e = 0, u = s(n, !0);
            !(t = u()).done;

          ) {
            var o = t.value;
            if (o.sources)
              for (var h, a = s(o.sources, !0); !(h = a()).done; )
                r |= Sh(h.value.node);
            e += o.value;
          }
          (n.length = 0),
            this.Dc(),
            (null == i || e > i) &&
              (this.cc.reset(Jn),
              this.cc.reset(Qn),
              this.tickDelta(Jn, e),
              this.tickDelta(Qn, r),
              this.flush());
        }),
        (n.Ec = function (t) {
          if (this.vu) {
            var n = this.cc.get(ni);
            (null == n || t > n) &&
              (this.tickDelta(ni, t - (null != n ? n : 0)), this.flush());
          }
        }),
        (n.Lc = function () {
          0 === this.lc
            ? (this.tickDelta(Zn, this.dc), this.flush(), (this.lc = 1))
            : 1 === this.lc &&
              (this.tickDelta('cls-2', this.dc), this.flush(), (this.lc = 2));
        }),
        (n.kc = function (t) {
          var n = t.element,
            i = t.startTime,
            r = Sh(n);
          this.tickDelta('lcpt', r),
            this.tickDelta('lcp', i),
            this.tickSinceVisible('lcpv', i),
            this.flush();
        }),
        (n.Rc = function () {
          var t = this,
            n = !this.vu.hasBeenVisible(),
            i = -1;
          this.vu.whenFirstVisible().then(function () {
            (i = t.win.performance.now()), t.mark('visible');
          }),
            this.Uc().then(function () {
              if (n) {
                var r = i > -1 ? t.win.performance.now() - i : 0;
                t.vu.whenFirstVisible().then(function () {
                  t.tickDelta(ti, r);
                }),
                  t.zc(r),
                  t.mark(ti);
              } else t.tick(ti), t.zc(t.win.performance.now() - i);
              t.flush();
            });
        }),
        (n.Uc = function () {
          var t = this;
          return this.qe.whenFirstPass().then(function () {
            var n,
              i = t.win.document.documentElement,
              r = rr(i).getSize();
            return (
              Ln(0, 0, r.width, r.height),
              (n = i),
              t.win,
              (function (t, n) {
                var i = Li(t);
                return i
                  .signals()
                  .whenSignal(Gu)
                  .then(function () {
                    var t = Xi(i)
                      .get()
                      .filter(function (t) {
                        return !(
                          !t.prerenderAllowed() ||
                          Rh.includes(t.element.tagName)
                        );
                      })
                      .map(function (t) {
                        return t.element;
                      });
                    return 0 === t.length
                      ? Promise.resolve([])
                      : new Promise(function (n) {
                          for (
                            var r = i.win,
                              e = new r.IntersectionObserver(
                                function (t) {
                                  e.disconnect();
                                  for (var i = [], r = 0; r < t.length; r++) {
                                    var u = t[r],
                                      o = u.isIntersecting,
                                      s = u.target;
                                    o && i.push(s);
                                  }
                                  n(i);
                                },
                                {
                                  root: kn(r) ? r.document : null,
                                  threshold: 0.01,
                                }
                              ),
                              u = 0;
                            u < Math.min(t.length, 100);
                            u++
                          )
                            e.observe(t[u]);
                        }).then(function (t) {
                          return Promise.all(
                            t.map(function (t) {
                              return t.whenLoaded();
                            })
                          );
                        });
                  });
              })(n)
            );
          });
        }),
        (n.tick = function (t, n, i) {
          Jt(null == n || null == i);
          var r,
            e = { label: t };
          null != n
            ? (e.delta = r = Math.max(n, 0))
            : null != i
            ? (e.value = i)
            : (this.mark(t),
              (r = this.win.performance.now()),
              (e.value = this.uc + r)),
            this.win.dispatchEvent(
              $e(this.win, 'perf', { label: t, delta: r })
            ),
            this.sc && this.hc ? this.yh.sendMessage('tick', e) : this.Hc(e),
            this.cc.signal(t, r);
        }),
        (n.mark = function (t) {
          var n, i;
          null === (n = (i = this.win.performance).mark) ||
            void 0 === n ||
            n.call(i, t);
        }),
        (n.tickDelta = function (t, n) {
          this.tick(t, n);
        }),
        (n.tickSinceVisible = function (t, n) {
          var i,
            r,
            e = null == n ? this.win.performance.now() : n,
            u = this.uc + e,
            o =
              null !== (i = this.yh) && void 0 !== i && i.isEmbedded()
                ? null === (r = this.vu) || void 0 === r
                  ? void 0
                  : r.getFirstVisibleTime()
                : this.uc,
            s = o ? Math.max(u - o, 0) : 0;
          this.tickDelta(t, s);
        }),
        (n.flush = function () {
          this.sc &&
            this.hc &&
            (null == this.fc && (this.fc = Object.keys(this.ac).join(',')),
            this.yh.sendMessage(
              'sendCsi',
              {
                ampexp: this.fc,
                canonicalUrl: this.oc.canonicalUrl,
                eventid: this.rc,
              },
              !0
            ));
        }),
        (n.addEnabledExperiment = function (t) {
          (this.ac[t] = !0), (this.fc = void 0);
        }),
        (n.Hc = function (t) {
          this.ec.length >= 50 && this.ec.shift(), this.ec.push(t);
        }),
        (n._c = function () {
          var t = this;
          this.yh &&
            (this.hc
              ? (this.ec.forEach(function (n) {
                  t.yh.sendMessage('tick', n);
                }),
                (this.ec.length = 0))
              : (this.ec.length = 0));
        }),
        (n.zc = function (t) {
          this.yh && this.yh.sendMessage('prerenderComplete', { value: t }, !0);
        }),
        (n.isPerformanceTrackingOn = function () {
          return this.hc;
        }),
        (n.getMetric = function (t) {
          return this.cc.whenSignal(t);
        }),
        t
      );
    })(),
    Mh = (function () {
      function t() {}
      var n = t.prototype;
      return (
        (n.get = function () {
          return Promise.resolve(null);
        }),
        (n.optOut = function () {}),
        t
      );
    })(),
    kh = (function () {
      function t(t, n) {
        (this.t = t),
          (this.dt = Ct().rtvVersion || null),
          (this.bt = n || null),
          (this.gt = null),
          (this.wt = 1),
          (this.yt = A()),
          this.xt();
      }
      var n = t.prototype;
      return (
        (n.getData = function (t, n, i) {
          var r = t + '-result',
            e = this.wt++,
            u = this.registerCallback(r, function (t) {
              t.messageId === e && (u(), i(t.content));
            }),
            o = {};
          (o.payload = n), (o.messageId = e), this.sendMessage(t, o);
        }),
        (n.makeRequest = function (t, n, i) {
          var r = this.registerCallback(n, i);
          return this.sendMessage(t), r;
        }),
        (n.requestOnce = function (t, n, i) {
          var r = this.registerCallback(n, function (t) {
            r(), i(t);
          });
          return this.sendMessage(t), r;
        }),
        (n.registerCallback = function (t, n) {
          return this.jt(t).add(n);
        }),
        (n.sendMessage = function (t, n) {
          var i = (function (t, n) {
            var i =
                arguments.length > 3 && void 0 !== arguments[3]
                  ? arguments[3]
                  : null,
              r =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : {};
            return (
              (r.type = t), (r.sentinel = n), oo + (i || '') + JSON.stringify(r)
            );
          })(t, this.gt, n, this.dt);
          if (this.bt) this.At(this.bt, i);
          else
            for (var r = 0, e = this.t; r < 10 && e != this.t.top; r++)
              (e = e.parent), this.At(e, i), r++;
        }),
        (n.At = function (t, n) {
          this.kt(t) ? this.Et(t, n) : t.postMessage(n, '*');
        }),
        (n.Et = function (t, n) {
          t.postMessage(n, { targetOrigin: '*', includeUserActivation: !0 });
        }),
        (n.xt = function () {
          var t = this;
          qe(
            this.t,
            'message',
            function (n) {
              if (!t.bt || n.source == t.bt) {
                var i = (function (t) {
                  if (
                    !(function (t) {
                      return (
                        'string' == typeof t &&
                        t.startsWith(oo) &&
                        -1 != t.indexOf('{')
                      );
                    })(t)
                  )
                    return null;
                  it(t);
                  var n = t.indexOf('{');
                  return (
                    tt(-1 != n),
                    ot(t.substr(n), function (n) {
                      d(
                        new Error(
                          'MESSAGING: Failed to parse message: '
                            .concat(t, '\n')
                            .concat(n.message)
                        )
                      );
                    })
                  );
                })(Ke(n));
                i &&
                  i.sentinel == t.gt &&
                  ((i.origin = n.origin),
                  t.bt || (t.bt = n.source),
                  t.St(i.type, i));
              }
            },
            void 0
          );
        }),
        (n.setSentinel = function (t) {
          this.gt = t;
        }),
        (n.jt = function (t) {
          return t in this.yt || (this.yt[t] = new fr()), this.yt[t];
        }),
        (n.St = function (t, n) {
          t in this.yt && this.yt[t].fire(n);
        }),
        (n.kt = function (t) {
          return 1 == t.postMessage.length;
        }),
        t
      );
    })();
  function Ch(t) {
    ao(t.top) || ai(t, 'iframeMessagingClient', Nh.bind(null, t), !0);
  }
  function Nh(t) {
    var n = new kh(t),
      i = ot(t.name),
      r = null;
    return (
      i && i._context && (r = i._context.sentinel),
      n.setSentinel(
        r ||
          (function (t) {
            return String(t.Math.random()).substr(2);
          })(t)
      ),
      n
    );
  }
  var jh = (function () {
      function t(t) {
        (this.qe = Xi(t)), (this.Gc = ir(t.win));
      }
      var n = t.prototype;
      return (
        (n.forceChangeSize = function (t, n, i, r, e) {
          this.requestChangeSize(t, n, i, e).then(function () {
            r && r();
          });
        }),
        (n.requestChangeSize = function (t, n, i, r) {
          var e = this;
          return this.mutateElement(t, function () {
            e.qe.getResourceForElement(t).changeSize(n, i, r);
          });
        }),
        (n.expandElement = function (t) {
          this.qe.getResourceForElement(t).completeExpand(),
            this.qe.schedulePass();
        }),
        (n.attemptCollapse = function (t) {
          var n = this;
          return this.mutateElement(t, function () {
            n.qe.getResourceForElement(t).completeCollapse();
          });
        }),
        (n.collapseElement = function (t) {
          this.qe.getResourceForElement(t).completeCollapse(),
            this.qe.schedulePass();
        }),
        (n.measureElement = function (t) {
          return this.Gc.measurePromise(t);
        }),
        (n.mutateElement = function (t, n) {
          return this.measureMutateElement(t, null, n);
        }),
        (n.measureMutateElement = function (t, n, i) {
          var r = this;
          return this.Gc.runPromise({
            measure: function () {
              n && n();
            },
            mutate: function () {
              i(), r.qe.schedulePass();
            },
          });
        }),
        t
      );
    })(),
    Dh = (function () {
      function t(t) {
        this.vu = t;
      }
      var n = t.prototype;
      return (
        (n.getAmpDoc = function () {
          return this.vu;
        }),
        (n.getParam = function (t) {
          return this.vu.getParam(t);
        }),
        (n.hasCapability = function () {
          return !1;
        }),
        (n.isEmbedded = function () {
          return !1;
        }),
        (n.isWebviewEmbedded = function () {
          return !1;
        }),
        (n.isCctEmbedded = function () {
          return !1;
        }),
        (n.isProxyOrigin = function () {
          return !1;
        }),
        (n.maybeUpdateFragmentForCct = function () {}),
        (n.isRuntimeOn = function () {
          return !0;
        }),
        (n.toggleRuntime = function () {}),
        (n.onRuntimeState = function () {
          return function () {};
        }),
        (n.isOvertakeHistory = function () {
          return !1;
        }),
        (n.getResolvedViewerUrl = function () {
          return this.vu.win.location.href;
        }),
        (n.maybeGetMessagingOrigin = function () {
          return null;
        }),
        (n.getUnconfirmedReferrerUrl = function () {
          return this.vu.win.document.referrer;
        }),
        (n.getReferrerUrl = function () {
          return Promise.resolve(this.getUnconfirmedReferrerUrl());
        }),
        (n.isTrustedViewer = function () {
          return Promise.resolve(!1);
        }),
        (n.getViewerOrigin = function () {
          return Promise.resolve('');
        }),
        (n.onMessage = function () {
          return function () {};
        }),
        (n.onMessageRespond = function () {
          return function () {};
        }),
        (n.receiveMessage = function () {}),
        (n.setMessageDeliverer = function () {}),
        (n.maybeGetMessageDeliverer = function () {
          return null;
        }),
        (n.sendMessage = function () {}),
        (n.sendMessageAwaitResponse = function () {
          return h();
        }),
        (n.broadcast = function () {
          return Promise.resolve(!1);
        }),
        (n.onBroadcast = function () {
          return function () {};
        }),
        (n.whenMessagingReady = function () {
          return null;
        }),
        (n.replaceUrl = function () {}),
        t
      );
    })();
  function Lh(t, n, i) {
    t.requestAnimationFrame(function () {
      n.measure && n.measure(i), n.mutate && n.mutate(i);
    });
  }
  var Uh = (function () {
      function t(t) {
        (this.t = t),
          (this.ne = !1),
          (this.te = !1),
          (this.re = null),
          this.ie();
      }
      var n = t.prototype;
      return (
        (n.ie = function () {
          var t = this;
          this.t.addEventListener('resize', function () {
            return t.onWindowResize();
          });
        }),
        (n.onWindowResize = function () {
          this.ne && (this.te = !0);
        }),
        (n.expandFrame = function (t, n) {
          var i = this;
          !(function (t, n, i) {
            Lh(
              t,
              {
                measure: function (i) {
                  (i.viewportSize = {
                    width: t.innerWidth,
                    height: t.innerHeight,
                  }),
                    (i.rect = Un(n.getBoundingClientRect()));
                },
                mutate: function (r) {
                  var e,
                    u = r.viewportSize,
                    o = u.height,
                    s = Ln(0, 0, u.width, o);
                  !(function (t, n, i, r) {
                    var e,
                      u,
                      o = Mr(i.width / 2 - n.width / 2 - n.left),
                      s = Mr(i.height / 2 - n.height / 2 - n.top);
                    Sr(t, {
                      position: 'fixed',
                      top: Mr(n.top),
                      right: Mr(i.width - (n.left + n.width)),
                      left: Mr(n.left),
                      bottom: Mr(i.height - (n.top + n.height)),
                      height: Mr(n.height),
                      width: Mr(n.width),
                      transition: 'transform '.concat(150, 'ms ease'),
                      transform:
                        ((e = o),
                        (u = s),
                        null == u
                          ? 'translate('.concat(kr(e, Mr), ')')
                          : 'translate('
                              .concat(kr(e, Mr), ', ')
                              .concat(kr(u, Mr), ')')),
                      margin: 0,
                    });
                  })(n, r.rect, r.viewportSize),
                    Ir(n, { 'pointer-events': 'none' }),
                    (e = function () {
                      Lh(t, {
                        mutate: function () {
                          Nr(n, ['pointer-events']),
                            (function (t) {
                              Sr(t, {
                                position: 'fixed',
                                'z-index': 1e3,
                                left: 0,
                                right: 0,
                                top: 0,
                                bottom: 0,
                                width: '100vw',
                                height: '100vh',
                                transition: null,
                                transform: null,
                                margin: 0,
                                border: 0,
                              });
                            })(n),
                            i(r.rect, s);
                        },
                      });
                    }),
                    setTimeout(e, 200);
                },
              },
              {}
            );
          })(this.t, t, function (t, r) {
            (i.ne = !0), (i.te = !1), (i.re = t), n(r);
          });
        }),
        (n.collapseFrame = function (t, n) {
          var i = this;
          !(function (t, r, e, u) {
            Lh(t, {
              mutate: function () {
                !(function (t) {
                  Nr(t, [
                    'position',
                    'z-index',
                    'left',
                    'right',
                    'top',
                    'bottom',
                    'width',
                    'height',
                    'margin',
                    'border',
                  ]);
                })(r),
                  (i.ne = !1),
                  i.te || n(i.re),
                  Lh(t, {
                    measure: function () {
                      var t;
                      (t = Un(r.getBoundingClientRect())),
                        (i.re = t),
                        i.te && n(i.re);
                    },
                  });
              },
            });
          })(this.t, t);
        }),
        t
      );
    })(),
    zh = (function () {
      function t(t) {
        (this.t = t),
          (this.ee = null),
          (this.oe = (function (t) {
            var n,
              i = t.document;
            return i.scrollingElement
              ? i.scrollingElement
              : i.body &&
                ((n = t.navigator.userAgent),
                /WebKit/i.test(n) && !/Edge/i.test(n))
              ? i.body
              : i.documentElement;
          })(this.t)),
          (this.ue = null);
      }
      var n = t.prototype;
      return (
        (n.observe = function (t, n) {
          var i = this;
          if (!this.ee) {
            this.ee = new fr();
            var r = lt(
              this.t,
              function () {
                i.fe(), i.ee.fire();
              },
              100
            );
            this.fe(),
              this.t.addEventListener('scroll', r, !0),
              this.t.addEventListener('resize', r, !0);
          }
          return (
            n(this.se(t)),
            this.ee.add(function () {
              n(i.se(t));
            })
          );
        }),
        (n.fe = function () {
          this.ue = this.getViewportRect();
        }),
        (n.se = function (t) {
          return { viewportRect: this.ue, targetRect: this.getTargetRect(t) };
        }),
        (n.getViewportRect = function () {
          var t = this.oe,
            n = this.t,
            i = t.scrollLeft || n.pageXOffset,
            r = t.scrollTop || n.pageYOffset;
          return Ln(Math.round(i), Math.round(r), n.innerWidth, n.innerHeight);
        }),
        (n.getTargetRect = function (t) {
          for (
            var n = Un(t.getBoundingClientRect()),
              i = 0,
              r = t.ownerDocument.defaultView;
            i < 10 && r && r != this.t && r != this.t.top;
            i++, r = r.parent
          ) {
            var e = Un(r.frameElement.getBoundingClientRect());
            n = zn(n, e.left, e.top);
          }
          return n;
        }),
        t
      );
    })(),
    Hh = 'inabox-viewport',
    Gh = (function () {
      function t(t, n) {
        var i = t.win;
        (this.ampdoc = t),
          (this.Bs = n),
          (this.Vc = null),
          (this.Fc = new fr()),
          (this.Bc = new fr()),
          (this.qc = new fr()),
          this.Bs.onScroll(this.Wc.bind(this)),
          this.Bs.onResize(this.$c.bind(this)),
          (this.Yc = !1),
          this.ampdoc.onVisibilityChanged(this.Kc.bind(this)),
          this.Kc(),
          (this.Xc = this.dispose.bind(this)),
          i.addEventListener('pagehide', this.Xc);
        var r = i.document.documentElement;
        r.classList.add('i-amphtml-singledoc'),
          r.classList.add('i-amphtml-standalone'),
          kn(i) && r.classList.add('i-amphtml-iframed');
      }
      var n = t.prototype;
      return (
        (n.dispose = function () {
          this.Bs.disconnect(),
            this.ampdoc.win.removeEventListener('pagehide', this.Xc);
        }),
        (n.ensureReadyForElements = function () {}),
        (n.getPaddingTop = function () {
          return 0;
        }),
        (n.getScrollTop = function () {
          return this.Bs.getScrollTop();
        }),
        (n.getScrollLeft = function () {
          return this.Bs.getScrollLeft();
        }),
        (n.setScrollTop = function (t) {}),
        (n.updatePaddingBottom = function (t) {}),
        (n.getSize = function () {
          return this.Bs.getSize();
        }),
        (n.getHeight = function () {
          return this.getSize().height;
        }),
        (n.getWidth = function () {
          return this.getSize().width;
        }),
        (n.getScrollWidth = function () {
          return this.Bs.getScrollWidth();
        }),
        (n.getScrollHeight = function () {
          return this.Bs.getScrollHeight();
        }),
        (n.getContentHeight = function () {
          return this.Bs.getContentHeight();
        }),
        (n.contentHeightChanged = function () {}),
        (n.getRect = function () {
          if (null == this.Vc) {
            var t = this.getSize();
            this.Vc = Ln(
              this.getScrollLeft(),
              this.getScrollTop(),
              t.width,
              t.height
            );
          }
          return this.Vc;
        }),
        (n.getLayoutRect = function (t) {
          return this.Bs.getLayoutRect(t);
        }),
        (n.getClientRectAsync = function (t) {
          var n = t.getBoundingClientRect();
          return this.Bs.getRootClientRectAsync().then(function (t) {
            return t ? zn(n, t.left, t.top) : Un(n);
          });
        }),
        (n.supportsPositionFixed = function () {
          return !1;
        }),
        (n.isDeclaredFixed = function (t) {
          return !1;
        }),
        (n.scrollIntoView = function (t) {
          return h();
        }),
        (n.animateScrollIntoView = function (t, n, i, r) {
          return h();
        }),
        (n.animateScrollWithinParent = function (t, n, i, r, e) {
          return h();
        }),
        (n.getScrollingElement = function () {
          return this.Bs.getScrollingElement();
        }),
        (n.onChanged = function (t) {
          return this.Fc.add(t);
        }),
        (n.onScroll = function (t) {
          return this.Bc.add(t);
        }),
        (n.onResize = function (t) {
          return this.qc.add(t);
        }),
        (n.enterLightboxMode = function (t, n) {
          return this.enterOverlayMode(), this.Bs.updateLightboxMode(!0);
        }),
        (n.leaveLightboxMode = function (t) {
          return this.leaveOverlayMode(), this.Bs.updateLightboxMode(!1);
        }),
        (n.enterOverlayMode = function () {
          this.disableTouchZoom(), this.disableScroll();
        }),
        (n.leaveOverlayMode = function () {
          this.resetScroll(), this.restoreOriginalTouchZoom();
        }),
        (n.disableScroll = function () {}),
        (n.resetScroll = function () {}),
        (n.resetTouchZoom = function () {}),
        (n.disableTouchZoom = function () {
          return !1;
        }),
        (n.restoreOriginalTouchZoom = function () {
          return !1;
        }),
        (n.updateFixedLayer = function () {
          return h();
        }),
        (n.addToFixedLayer = function (t, n) {
          return h();
        }),
        (n.removeFromFixedLayer = function (t) {}),
        (n.createFixedLayer = function (t) {}),
        (n.Jc = function () {
          var t = this.getSize(),
            n = this.getScrollTop(),
            i = this.getScrollLeft();
          this.Fc.fire({
            relayoutAll: !1,
            top: n,
            left: i,
            width: t.width,
            height: t.height,
            velocity: 0,
          });
        }),
        (n.Wc = function () {
          (this.Vc = null),
            this.Bs.getScrollTop() < 0 || (this.Jc(), this.Bc.fire());
        }),
        (n.$c = function () {
          this.Vc = null;
          var t = this.getSize();
          this.Jc(),
            this.qc.fire({ relayoutAll: !1, width: t.width, height: t.height });
        }),
        (n.Kc = function () {
          var t = this.ampdoc.isVisible();
          t != this.Yc &&
            ((this.Yc = t),
            t ? (this.Bs.connect(), this.$c()) : this.Bs.disconnect());
        }),
        t
      );
    })(),
    Vh = (function () {
      function t(t) {
        var n = this;
        (this.win = t), (this.Bc = new fr()), (this.qc = new fr());
        var i = t.innerWidth,
          r = t.innerHeight;
        (this.ue = Ln(0, 0, i, r)),
          (this.Qc = Ln(0, r + 1, i, r)),
          (this.Zc = (function (t) {
            return li(t, 'iframeMessagingClient');
          })(t)),
          (this.tl = null),
          (this.nl = lt(
            this.win,
            function () {
              n.Bc.fire();
            },
            100
          )),
          (this.il = ao(this.win.top)),
          (this.rl = this.il
            ? (function (t) {
                return (
                  (t.ampInaboxPositionObserver =
                    t.ampInaboxPositionObserver || new zh(t)),
                  t.ampInaboxPositionObserver
                );
              })(this.win.top)
            : null),
          (this.el = this.il
            ? (function (t) {
                return (
                  (t.ampInaboxFrameOverlayManager =
                    t.ampInaboxFrameOverlayManager || new Uh(t)),
                  t.ampInaboxFrameOverlayManager
                );
              })(this.win.top)
            : null),
          (this.ul = null),
          Xt().fine(Hh, 'initialized inabox viewport');
      }
      var n = t.prototype;
      return (
        (n.connect = function () {
          return this.il ? this.ol() : this.sl();
        }),
        (n.sl = function () {
          var t = this;
          return (
            this.Zc.makeRequest(so, ho, function (n) {
              Xt().fine(Hh, 'Position changed: ', n),
                t.hl(n.viewportRect, n.targetRect);
            }),
            h()
          );
        }),
        (n.ol = function () {
          var t,
            n = this;
          return ((t = this.win.document.documentElement),
          mi(t, 'resources')).then(function () {
            n.ul =
              n.ul ||
              n.rl.observe(
                n.win.frameElement || n.getScrollingElement(),
                function (t) {
                  n.hl(t.viewportRect, t.targetRect);
                }
              );
          });
        }),
        (n.hl = function (t, n) {
          var i = this.ue;
          (this.ue = t),
            this.al(n),
            Bh(this.ue, i) && this.qc.fire(),
            Fh(this.ue, i) && this.nl();
        }),
        (n.getLayoutRect = function (t) {
          var n = t.getBoundingClientRect(),
            i = n.left,
            r = n.top;
          return Ln(
            Math.round(i + this.Qc.left),
            Math.round(r + this.Qc.top),
            Math.round(n.width),
            Math.round(n.height)
          );
        }),
        (n.onScroll = function (t) {
          this.Bc.add(t);
        }),
        (n.onResize = function (t) {
          this.qc.add(t);
        }),
        (n.getSize = function () {
          return { width: this.ue.width, height: this.ue.height };
        }),
        (n.getScrollTop = function () {
          return this.ue.top;
        }),
        (n.getScrollLeft = function () {
          return this.ue.left;
        }),
        (n.getScrollingElement = function () {
          return this.getBodyElement();
        }),
        (n.getScrollingElementScrollsLikeViewport = function () {
          return !0;
        }),
        (n.supportsPositionFixed = function () {
          return !1;
        }),
        (n.al = function (t) {
          if (t) {
            var n,
              i,
              r = zn(t, this.ue.left, this.ue.top);
            (Fh((n = r), (i = this.Qc)) || Bh(n, i)) &&
              (Xt().fine(Hh, 'Updating viewport box rect: ', r),
              (this.Qc = r),
              this.fl());
          }
        }),
        (n.getChildResources = function () {
          return Xi(this.win.document.documentElement).get();
        }),
        (n.fl = function () {
          this.getChildResources().forEach(function (t) {
            return t.measure();
          });
        }),
        (n.updateLightboxMode = function (t) {
          return t ? this.cl() : this.ll();
        }),
        (n.getRootClientRectAsync = function () {
          var t = this;
          return this.il
            ? this.ol().then(function () {
                return t.rl.getTargetRect(
                  t.win.frameElement || t.getScrollingElement()
                );
              })
            : (this.tl ||
                (this.tl = new Promise(function (n) {
                  t.Zc.requestOnce(so, ho, function (i) {
                    (t.tl = null), tt(i.targetRect), n(i.targetRect);
                  });
                })),
              this.tl);
        }),
        (n.cl = function () {
          var t = this;
          return this.vl().then(function () {
            return t.dl();
          });
        }),
        (n.ll = function () {
          var t = this;
          return this.ml().then(function () {
            return t.pl();
          });
        }),
        (n.vl = function () {
          return (function (t, n) {
            return ir(t).runPromise(
              {
                measure: function (n) {
                  (n.width = t.innerWidth), (n.height = t.innerHeight);
                },
                mutate: function (t) {
                  Ir(n, {
                    background: 'transparent',
                    left: '50%',
                    top: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    position: 'absolute',
                    height: Mr(t.height),
                    width: Mr(t.width),
                    'margin-top': Mr(-t.height / 2),
                    'margin-left': Mr(-t.width / 2),
                  });
                },
              },
              {}
            );
          })(this.win, this.getBodyElement());
        }),
        (n.pl = function () {
          return (function (t, n) {
            return ir(t).mutatePromise(function () {
              Nr(n, [
                'position',
                'left',
                'top',
                'right',
                'bottom',
                'width',
                'height',
                'margin-left',
                'margin-top',
              ]);
            });
          })(this.win, this.getBodyElement());
        }),
        (n.dl = function () {
          var t = this;
          return new Promise(function (n, i) {
            if (t.il) {
              var r = t.win.frameElement;
              r
                ? t.el.expandFrame(r, function (i) {
                    t.al(i), n();
                  })
                : i('Request to open lightbox failed; frame does not exist.');
            } else
              t.Zc.requestOnce(
                'full-overlay-frame',
                'full-overlay-frame-response',
                function (r) {
                  r.success
                    ? (t.al(r.boxRect), n())
                    : i('Request to open lightbox rejected by host document');
                }
              );
          });
        }),
        (n.ml = function () {
          var t = this;
          return new Promise(function (n, i) {
            if (t.il) {
              var r = t.win.frameElement;
              r
                ? t.el.collapseFrame(r, function (i) {
                    t.al(i), n();
                  })
                : i('Request to open lightbox failed; frame does not exist.');
            } else
              t.Zc.requestOnce(
                'cancel-full-overlay-frame',
                'cancel-full-overlay-frame-response',
                function (i) {
                  t.al(i.boxRect), n();
                }
              );
          });
        }),
        (n.getBodyElement = function () {
          return nt(this.win.document.body);
        }),
        (n.disconnect = function () {
          this.ul && (this.ul(), (this.ul = null));
        }),
        (n.getScrollWidth = function () {
          return this.getScrollingElement().offsetWidth;
        }),
        (n.getScrollHeight = function () {
          return this.getScrollingElement().offsetHeight;
        }),
        (n.getContentHeight = function () {
          return this.getScrollHeight();
        }),
        (n.updatePaddingTop = function () {}),
        (n.hideViewerHeader = function () {}),
        (n.showViewerHeader = function () {}),
        (n.disableScroll = function () {}),
        (n.resetScroll = function () {}),
        (n.ensureReadyForElements = function () {}),
        (n.setScrollTop = function () {}),
        (n.contentHeightChanged = function () {}),
        (n.getBorderTop = function () {
          return 0;
        }),
        (n.requiresFixedLayerTransfer = function () {
          return !1;
        }),
        (n.overrideGlobalScrollTo = function () {
          return !1;
        }),
        t
      );
    })();
  function Fh(t, n) {
    return t.left != n.left || t.top != n.top;
  }
  function Bh(t, n) {
    return t.width != n.width || t.height != n.height;
  }
  var qh,
    Wh,
    $h,
    Yh = (function () {
      function t(t) {
        var n = this;
        (this.oa = Wi(t)),
          (this.si = t.win.document),
          (this.gl = this.si.createElement('div')),
          this.oa.mutateElement(this.gl, function () {
            n.si.body.appendChild(n.gl),
              Sr(n.gl, {
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1,
                visibility: 'hidden',
                'font-weight': 'bold',
                'letter-spacing': '0.2px',
              });
          });
      }
      var n = t.prototype;
      return (
        (n.fit = function (t, n, i) {
          var r = this,
            e = !1;
          return this.oa
            .mutateElement(n, function () {
              r.gl.textContent = i;
              var u = (function (t, n, i, r, e) {
                for (var u = 14; u >= 12; u--) {
                  Rr(t, 'fontSize', Mr(u));
                  var o = t.offsetHeight,
                    s = t.offsetWidth;
                  if (o < 32 && s < i) return u;
                }
                return 11;
              })(r.gl, 0, r.bl(t));
              u >= 12 && (r.yl(n, u), (e = !0));
            })
            .then(function () {
              return e;
            });
        }),
        (n.bl = function (t) {
          return t.offsetWidth - 84;
        }),
        (n.yl = function (t, n) {
          Rr(t, 'fontSize', Mr(n));
        }),
        t
      );
    })(),
    Kh =
      (k((qh = {}), 34, function (t, n) {
        return t.length !== n.length;
      }),
      k(qh, 15, function (t, n) {
        return t.element !== n.element || t.state !== n.state;
      }),
      k(qh, 39, function (t, n) {
        return t.length !== n.length;
      }),
      k(qh, 41, function (t, n) {
        return t.length !== n.length;
      }),
      k(qh, 42, function (t, n) {
        return (
          null === t ||
          null === n ||
          t.width !== n.width ||
          t.height !== n.height
        );
      }),
      k(qh, 23, function (t, n) {
        return null === t || null === n || !st(t, n, 2);
      }),
      k(qh, 28, function (t, n) {
        return null === t || null === n || !st(t, n, 2);
      }),
      k(qh, 16, function (t, n) {
        return !st(t, n, 3);
      }),
      'none'),
    Xh = 'v0';
  function Jh(t) {
    return (
      void 0 === Wh &&
        ((n = t || Element),
        (Wh = n.prototype.attachShadow
          ? 'v1'
          : n.prototype.createShadowRoot
          ? Xh
          : Kh)),
      Wh
    );
    var n;
  }
  function Qh(t, n, i) {
    var r = '';
    return (
      t &&
        Array.prototype.forEach.call(t, function (t) {
          if (t.selectorText && t.style && void 0 !== t.style.cssText)
            (r +=
              (function (t, n, i) {
                var r = [];
                return (
                  t.split(',').forEach(function (t) {
                    (t = t.trim()),
                      i && (t = i(t)),
                      (function (t, n) {
                        var i = (function (t) {
                          return (
                            (t = t.replace(/\[/g, '\\[').replace(/\]/g, '\\]')),
                            new RegExp('^(' + t + ')' + na, 'm')
                          );
                        })(n);
                        return !t.match(i);
                      })(t, n) &&
                        (t = (function (t, n) {
                          return (function (t, n) {
                            return t.match(ra)
                              ? (t = t.replace(ia, n)).replace(ra, n + ' ')
                              : n + ' ' + t;
                          })(t, n);
                        })(t, n)),
                      r.push(t);
                  }),
                  r.join(', ')
                );
              })(t.selectorText, n, i) + ' {\n\t'),
              (r +=
                (function (t) {
                  var n = t.style.cssText;
                  t.style.content &&
                    !t.style.content.match(/['"]+|attr/) &&
                    (n = n.replace(
                      /content:[^;]*;/g,
                      "content: '" + t.style.content + "';"
                    ));
                  var i = t.style;
                  for (var r in i)
                    'initial' === i[r] && (n += r + ': initial; ');
                  return n;
                })(t) + '\n}\n\n');
          else if (t.type === CSSRule.MEDIA_RULE)
            (r += '@media ' + t.media.mediaText + ' {\n'),
              (r += Qh(t.cssRules, n)),
              (r += '\n}\n\n');
          else
            try {
              t.cssText && (r += t.cssText + '\n\n');
            } catch (t) {}
        }),
      r
    );
  }
  var Zh = '-shadowcsshost',
    ta = ')(?:\\(((?:\\([^)(]*\\)|[^)(]*)+?)\\))?([^,{]*)',
    na =
      (new RegExp('(' + Zh + ta, 'gim'),
      new RegExp('(-shadowcsscontext' + ta, 'gim'),
      '([>\\s~+[.,{:][\\s\\S]*)?$'),
    ia = Zh + '-no-combinator',
    ra = new RegExp(Zh, 'gim'),
    ea = (new RegExp('-shadowcsscontext', 'gim'), /[^\.\-\_0-9a-zA-Z]/),
    ua = /[^\-\_0-9a-zA-Z]/;
  function oa(t) {
    var n,
      i = on(t),
      r = t.shadowRoot || t.__AMP_SHADOW_ROOT;
    if (r) {
      if (self.trustedTypes && self.trustedTypes.createPolicy) {
        var e = self.trustedTypes.createPolicy(
          'shadow-embed#createShadowRoot',
          {
            createHTML: function (t) {
              return '';
            },
          }
        );
        r.innerHTML = e.createHTML('');
      } else r.innerHTML = '';
      return r;
    }
    var u,
      o = Jh();
    if (
      ('v1' == o
        ? (n = t.attachShadow({ mode: 'open' })).styleSheets ||
          Object.defineProperty(n, 'styleSheets', {
            get: function () {
              var t = [];
              return (
                n.childNodes.forEach(function (n) {
                  'STYLE' === n.tagName && t.push(n.sheet);
                }),
                t
              );
            },
          })
        : (n =
            o == Xh
              ? t.createShadowRoot()
              : (function (t) {
                  var n = t.ownerDocument;
                  t.classList.add('i-amphtml-shadow-host-polyfill');
                  var i = n.createElement('style');
                  (i.textContent =
                    '.i-amphtml-shadow-host-polyfill>:not(i-amphtml-shadow-root){display:none!important}'),
                    t.appendChild(i);
                  var r = n.createElement('i-amphtml-shadow-root');
                  return (
                    t.appendChild(r),
                    (t.__AMP_SHADOW_ROOT = r),
                    Object.defineProperty(t, 'shadowRoot', {
                      enumerable: !0,
                      configurable: !0,
                      value: r,
                    }),
                    (r.host = t),
                    (r.getElementById = function (t) {
                      var n = ln(t);
                      return r.querySelector('#'.concat(n));
                    }),
                    Object.defineProperty(r, 'styleSheets', {
                      get: function () {
                        return n.styleSheets
                          ? H(n.styleSheets).filter(function (t) {
                              return r.contains(t.ownerNode);
                            })
                          : [];
                      },
                    }),
                    r
                  );
                })(t)),
      !(function () {
        if (void 0 !== $h) return $h;
        if (Jh() == Kh) $h = !1;
        else {
          var t =
            Jh() === Xh
              ? self.document.createElement('div').createShadowRoot()
              : self.document
                  .createElement('div')
                  .attachShadow({ mode: 'open' });
          (n = ShadowRoot),
            ($h =
              !!n &&
              -1 != n.toString().indexOf('[native code]') &&
              t instanceof ShadowRoot);
        }
        var n;
        return $h;
      })())
    ) {
      var s = 'i-amphtml-sd-'.concat(i.Math.floor(1e4 * i.Math.random()));
      (n.id = s),
        n.host.classList.add(s),
        (u = function (t) {
          return (function (t, n) {
            return (function (t, n) {
              var i = Jt(t.id),
                r = t.ownerDocument,
                e = null;
              try {
                e = aa(r.implementation.createHTMLDocument(''), n);
              } catch (t) {}
              if (!e)
                try {
                  e = aa(r, n);
                } catch (t) {}
              return e ? Qh(e, '.'.concat(i), sa) : n;
            })(t, n);
          })(n, t);
        }),
        (n.__AMP_CSS_TR = u);
    }
    return n;
  }
  function sa(t) {
    return t.replace(/(html|body)/g, ha);
  }
  function ha(t, n, i, r) {
    var e = r.charAt(i - 1),
      u = r.charAt(i + t.length);
    return (e && !ea.test(e)) || (u && !ua.test(u)) ? t : 'amp-' + t;
  }
  function aa(t, n) {
    var i = t.createElement('style');
    i.textContent = n;
    try {
      return (
        (t.head || t.documentElement).appendChild(i),
        i.sheet ? i.sheet.cssRules : null
      );
    } finally {
      i.parentNode && i.parentNode.removeChild(i);
    }
  }
  function fa(t, n, i) {
    var r = self.document.createElement('style');
    r.textContent = i;
    var e = oa(t);
    return e.appendChild(r), e.appendChild(n), t;
  }
  '['.concat('data-text-background-color', ']');
  var ca = 'amp-story-auto-ads:ui',
    la = 'amp4ads-vars-',
    va = ['cta-accent-color', 'cta-accent-element', 'cta-image', 'theme'];
  function da(t) {
    var n = t.document;
    if (n.fonts && n.fonts.values)
      for (var i, r = n.fonts.values(); (i = r.next()); ) {
        var e = i.value;
        if (!e) return;
        'loading' == e.status &&
          'display' in e &&
          'auto' == e.display &&
          (e.display = 'swap');
      }
  }
  var ma,
    pa = ['amp-ad', 'amp-embed', 'amp-video'],
    ga = 'extensions',
    ba = '0.1',
    ya = 'latest',
    wa = '__AMP_EXT_LDR',
    Aa = (function () {
      function t(t) {
        (this.win = t),
          (this.mf = Ui(t)),
          (this.wl = {}),
          (this.Al = null),
          (this.xl = null),
          (this.El = null);
      }
      var n = t.prototype;
      return (
        (n.registerExtension = function (t, n, i, r, e) {
          var u,
            o = i ? this.wl[Pa(t, ya)] : null,
            s = this.Pl(
              t,
              n,
              null === (u = null == o ? void 0 : o.auto) || void 0 === u || u
            );
          if (((s.latest = i), !s.loaded)) {
            i && (this.wl[Pa(t, ya)] = s);
            try {
              var h, a;
              (this.Al = t),
                (this.xl = n),
                (this.El = i),
                r(e, e._),
                (s.loaded = !0),
                null === (h = s.resolve) ||
                  void 0 === h ||
                  h.call(s, s.extension),
                null == o ||
                  null === (a = o.resolve) ||
                  void 0 === a ||
                  a.call(o, s.extension);
            } catch (t) {
              var f, c;
              throw (
                ((s.error = t),
                null === (f = s.reject) || void 0 === f || f.call(s, t),
                null == o ||
                  null === (c = o.reject) ||
                  void 0 === c ||
                  c.call(o, t),
                t)
              );
            } finally {
              (this.Al = null), (this.xl = null), (this.El = null);
            }
          }
        }),
        (n.waitForExtension = function (t, n) {
          var i = this.Tl(this.Pl(t, n));
          return Ji(this.win)
            .timeoutPromise(16e3, i)
            .catch(function (n) {
              if (!n.message.includes('timeout')) throw n;
              return (
                Yt().error(
                  ga,
                  'Waited over 16s to load extension '.concat(t, '.')
                ),
                i
              );
            });
        }),
        (n.preloadExtension = function (t) {
          var n =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ba;
          'amp-embed' == t && (t = 'amp-ad');
          var i = this.Pl(t, n);
          return this.Ol(t, n, i), this.Tl(i);
        }),
        (n.installExtensionForDoc = function (t, n) {
          var i = this,
            r =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : ba,
            e = t.getRootNode(),
            u = e[wa];
          return (
            u || (u = e[wa] = A()),
            u[n]
              ? u[n]
              : (t.declareExtension(n, r),
                Po(t.win, n),
                (u[n] = this.preloadExtension(n, r).then(function () {
                  return i.installExtensionInDoc(t, n, r);
                })))
          );
        }),
        (n.reloadExtension = function (t, n, i) {
          var r = si(this.win, t, n, i, !1),
            e = this.wl[Pa(t, n)];
          return (
            e && (Jt(!e.loaded && !e.error), (e.scriptPresent = !1)),
            r.forEach(function (n) {
              return n.setAttribute('i-amphtml-loaded-new-version', t);
            }),
            this.preloadExtension(t, n)
          );
        }),
        (n.importUnwrapped = function (t, n) {
          var i,
            r =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : ba,
            e =
              !(arguments.length > 3 && void 0 !== arguments[3]) ||
              arguments[3],
            u = si(t, n, r, e),
            o = u.length > 0 ? u[0] : null;
          return (
            o
              ? (i = o.__AMP_SCR_LOADED)
              : ((i = (o = oi(this.win, n, r)).__AMP_SCR_LOADED =
                  new Promise(function (t, n) {
                    (o.onload = t), (o.onerror = n);
                  })),
                t.document.head.appendChild(o)),
            i
          );
        }),
        (n.loadElementClass = function (t) {
          var n =
            arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ba;
          return this.preloadExtension(t, n).then(function (n) {
            return Jt(n.elements[t]).implementationClass;
          });
        }),
        (n.addElement = function (t, n, i) {
          var r = this;
          (this.Il(t).extension.elements[t] = {
            implementationClass: n,
            css: i,
          }),
            this.addDocFactory(function (e) {
              r.Rl(e, t, n, i);
            });
        }),
        (n.addTemplate = function (t, n) {
          this.addDocFactory(function (i) {
            !(function (t, n, i) {
              vi(t, 'templates').Ra(n, i);
            })(i, t, n);
          });
        }),
        (n.Rl = function (t, n, i, r) {
          var e = this;
          r
            ? nu(
                t,
                r,
                function () {
                  e.Sl(t.win, n, i);
                },
                !1,
                n
              )
            : this.Sl(t.win, n, i);
        }),
        (n.Sl = function (t, n, i) {
          (function (t, n, i) {
            var r = (function (t, n) {
              if (n.requiresShadowDom() && !t.Element.prototype.attachShadow)
                return Fi(t).importUnwrapped(t, 'amp-shadow-dom-polyfill');
            })(t, i);
            r
              ? r.then(function () {
                  return Ao(t, n, i);
                })
              : Ao(t, n, i);
          })(t, n, i),
            ai(t, n, Ea);
        }),
        (n.addService = function (t, n) {
          this.Il(t).extension.services.push({
            serviceName: t,
            serviceClass: n,
          }),
            this.addDocFactory(function (i) {
              fi(i, t, n, !0);
            });
        }),
        (n.addDocFactory = function (t, n) {
          var i = this.Il(n);
          if ((i.docFactories.push(t), this.Al && this.mf.isSingleDoc())) {
            var r = this.mf.getAmpDoc(this.win.document),
              e = this.Al,
              u = this.xl,
              o = this.El || !1;
            (r.declaresExtension(e, u) ||
              (o && r.declaresExtension(e, ya)) ||
              i.auto) &&
              t(r);
          }
        }),
        (n.preinstallEmbed = function (t, n) {
          var i = this.win,
            r = t.win;
          !(function (t, n) {
            To(t, n, 'amp-img'), To(t, n, 'amp-pixel');
          })(i, r),
            xa(r),
            n.forEach(function (n) {
              var i = n.extensionId,
                e = n.extensionVersion;
              t.declareExtension(i, e), pa.includes(i) || Po(r, i);
            });
        }),
        (n.installExtensionsInDoc = function (t, n) {
          var i = this;
          return Promise.all(
            n.map(function (n) {
              var r = n.extensionId,
                e = n.extensionVersion;
              return i.installExtensionInDoc(t, r, e);
            })
          );
        }),
        (n.installExtensionInDoc = function (t, n) {
          var i = this,
            r =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : ba;
          return (
            t.declareExtension(n, r),
            this.Tl(this.Pl(n, r)).then(function () {
              i.Pl(n, r).docFactories.forEach(function (i) {
                try {
                  i(t);
                } catch (t) {
                  d('Doc factory failed: ', t, n);
                }
              });
            })
          );
        }),
        (n.Pl = function (t, n, i) {
          var r = Pa(t, n),
            e = this.wl[r];
          return (
            e ||
              ((e = {
                version: n,
                latest: n == ya,
                extension: { elements: {}, services: [] },
                auto: i || !1,
                docFactories: [],
                promise: void 0,
                resolve: void 0,
                reject: void 0,
                loaded: void 0,
                error: void 0,
                scriptPresent: void 0,
              }),
              (this.wl[r] = e)),
            e
          );
        }),
        (n.Il = function (t) {
          return (
            this.Al || Xt().error(ga, 'unknown extension for ', t),
            this.Pl(this.Al || '_UNKNOWN_', this.xl || '')
          );
        }),
        (n.Tl = function (t) {
          if (!t.promise)
            if (t.loaded) t.promise = Promise.resolve(t.extension);
            else if (t.error) t.promise = Promise.reject(t.error);
            else {
              var n = new a();
              (t.promise = n.promise),
                (t.resolve = n.resolve),
                (t.reject = n.reject);
            }
          return t.promise;
        }),
        (n.Ol = function (t, n, i) {
          if (this._l(t, n, i)) {
            var r = oi(this.win, t, n);
            this.win.document.head.appendChild(r), (i.scriptPresent = !0);
          }
        }),
        (n._l = function (t, n, i) {
          if (i.loaded || i.error) return !1;
          if (void 0 === i.scriptPresent) {
            var r = si(this.win, t, n, i.latest);
            i.scriptPresent = r.length > 0;
          }
          return !i.scriptPresent;
        }),
        t
      );
    })();
  function xa(t) {
    pa.forEach(function (n) {
      Po(t, n);
    });
  }
  function Ea() {
    return {};
  }
  function Pa(t, n) {
    return ''.concat(t, ':').concat(n);
  }
  (Wt = Bt),
    Xt(),
    Yt(),
    (ma = function (t, n, i) {
      ju(n, i),
        n &&
          t &&
          J(n.message) &&
          !(n.message.indexOf(K) >= 0) &&
          (function (t, n) {
            if (Ui(n).isSingleDoc()) {
              var i = { errorName: t.name, errorMessage: t.message };
              !(function (t, n) {
                var i =
                    arguments.length > 2 && void 0 !== arguments[2]
                      ? arguments[2]
                      : {},
                  r =
                    !(arguments.length > 3 && void 0 !== arguments[3]) ||
                    arguments[3];
                zi(t).then(function (e) {
                  e && e.triggerEventForTarget(t, n, i, r);
                });
              })(
                (function (t) {
                  var n = Ui(t).getSingleDoc().getRootNode();
                  return n.documentElement || n.body || n;
                })(n),
                'user-error',
                i,
                !1
              );
            }
          })(n, t);
    }.bind(null, self)),
    (self.__AMP_REPORT_ERROR = ma);
  var Ta,
    Oa,
    Ia = 'runtime';
  function Ra(t, n) {
    if (t.__AMP_TAG) return h();
    t.__AMP_TAG = !0;
    var i = t.AMP || [];
    ai(t, 'extensions', Aa);
    var r = Fi(t);
    Ih(t),
      xa(t),
      (t.AMP = { win: t, _: t.AMP ? t.AMP._ : void 0 }),
      (t.AMP.config = {
        urls: {
          thirdParty: xt,
          thirdPartyFrameHost: Et,
          thirdPartyFrameRegex: Pt,
          cdn: Tt,
          cdnProxyRegex: wt,
          localhostRegex: Ot,
          errorReporting: It,
          betaErrorReporting: Rt,
          localDev: St,
          trustedViewerHosts: _t,
          geoApi: Mt,
        },
      }),
      (t.AMP.addGlobalConsentListener = function () {}),
      (t.AMP.addGranularConsentListener = function () {}),
      (t.AMP.BaseElement = ro),
      (t.AMP.registerElement = r.addElement.bind(r)),
      (t.AMP.registerTemplate = r.addTemplate.bind(r)),
      (t.AMP.registerServiceForDoc = r.addService.bind(r)),
      (t.AMP.isExperimentOn = Ge.bind(null, t)),
      (t.AMP.toggleExperiment = Ve.bind(null, t)),
      (t.AMP.setLogLevel = Ut.bind(null)),
      (t.AMP.setTickFunction = function (t, n) {});
    var e = n(t, r);
    function u(n) {
      !(function (t, n, i) {
        'function' == typeof n || 'high' == n.p
          ? h().then(i)
          : ((i.displayName = n.n), Ju(t.document, i));
      })(t, n, function () {
        e.then(function () {
          'function' == typeof n
            ? n(t.AMP, t.AMP.Ml)
            : r.registerExtension(n.n, n.ev, n.l, n.f, t.AMP);
        });
      });
    }
    for (var o = 0; o < i.length; o++) {
      var s = i[o];
      if (Sa(t, s)) i.splice(o--, 1);
      else if ('function' == typeof s || 'high' == s.p) {
        try {
          u(s);
        } catch (t) {
          Xt().error(Ia, 'Extension failed: ', t, s.n);
        }
        i.splice(o--, 1);
      }
    }
    !(function (t, n) {
      t.document.body &&
      !(function (t) {
        return tu(t).length > 0;
      })(t)
        ? Ji(t).delay(n, 1)
        : n();
    })(t, function () {
      t.AMP.push = function (n) {
        Sa(t, n) || u(n);
      };
      for (var n = 0; n < i.length; n++) {
        var r = i[n];
        if (!Sa(t, r))
          try {
            u(r);
          } catch (t) {
            Xt().error(Ia, 'Extension failed: ', t, r.n);
          }
      }
      i.length = 0;
    }),
      t.AMP.push || (t.AMP.push = i.push.bind(i)),
      Yi(t).isIos() && Rr(t.document.documentElement, 'cursor', 'pointer');
    var a = Fi(t);
    return (
      $n(t) && a.preloadExtension('amp-resize-observer-polyfill'),
      Gn(t) && a.preloadExtension('amp-intersection-observer-polyfill'),
      e
    );
  }
  function Sa(t, n) {
    return (
      'function' != typeof n &&
      (!!n.m ||
        ('2410292120000' != n.v && (Fi(t).reloadExtension(n.n, n.ev, n.l), !0)))
    );
  }
  (Ct(self).runtime = 'inabox'),
    (Ct(self).a4aId = (Oa = self.document.head.querySelector(
      'meta[name="amp4ads-id"]'
    ))
      ? Oa.getAttribute('content')
      : null);
  try {
    !(function (t) {
      (t.onerror = Uu),
        t.addEventListener('unhandledrejection', function (t) {
          !t.reason ||
          (t.reason.message !== Mu &&
            t.reason.message !== ku &&
            'AbortError' !== t.reason.message)
            ? ju(t.reason || new Error('rejected promise ' + t))
            : t.preventDefault();
        });
    })(self),
      (function (t, n, i) {
        ai(t, 'ampdoc', function () {
          return new qr(t, !0, void 0);
        });
      })(self),
      (Ta = Ui(self));
  } catch (t) {
    throw (eu(self.document), t);
  }
  (Ku = !0),
    Ju(self.document, function () {
      var t = Ta.getAmpDoc(self.document);
      Ys(self), ai(self, 'performance', _h);
      var n = $i(self);
      n.tick('is'),
        self.document.documentElement.classList.add('i-amphtml-inabox'),
        nu(
          t,
          '[hidden]{display:none!important}.i-amphtml-element{display:inline-block}.i-amphtml-blurry-placeholder{transition:opacity 0.3s cubic-bezier(0.0,0.0,0.2,1)!important;pointer-events:none}[layout=nodisplay]:not(.i-amphtml-element){display:none!important}.i-amphtml-layout-fixed,[layout=fixed][width][height]:not(.i-amphtml-layout-fixed){display:inline-block;position:relative}.i-amphtml-layout-responsive,[layout=responsive][width][height]:not(.i-amphtml-layout-responsive),[width][height][heights]:not([layout]):not(.i-amphtml-layout-responsive),[width][height][sizes]:not(img):not([layout]):not(.i-amphtml-layout-responsive){display:block;position:relative}.i-amphtml-layout-intrinsic,[layout=intrinsic][width][height]:not(.i-amphtml-layout-intrinsic){display:inline-block;position:relative;max-width:100%}.i-amphtml-layout-intrinsic .i-amphtml-sizer{max-width:100%}.i-amphtml-intrinsic-sizer{max-width:100%;display:block!important}.i-amphtml-layout-container,.i-amphtml-layout-fixed-height,[layout=container],[layout=fixed-height][height]:not(.i-amphtml-layout-fixed-height){display:block;position:relative}.i-amphtml-layout-fill,.i-amphtml-layout-fill.i-amphtml-notbuilt,[layout=fill]:not(.i-amphtml-layout-fill),body noscript>*{display:block;overflow:hidden!important;position:absolute;top:0;left:0;bottom:0;right:0}body noscript>*{position:absolute!important;width:100%;height:100%;z-index:2}body noscript{display:inline!important}.i-amphtml-layout-flex-item,[layout=flex-item]:not(.i-amphtml-layout-flex-item){display:block;position:relative;-ms-flex:1 1 auto;flex:1 1 auto}.i-amphtml-layout-fluid{position:relative}.i-amphtml-layout-size-defined{overflow:hidden!important}.i-amphtml-layout-awaiting-size{position:absolute!important;top:auto!important;bottom:auto!important}i-amphtml-sizer{display:block!important}@supports (aspect-ratio:1/1){i-amphtml-sizer.i-amphtml-disable-ar{display:none!important}}.i-amphtml-blurry-placeholder,.i-amphtml-fill-content{display:block;height:0;max-height:100%;max-width:100%;min-height:100%;min-width:100%;width:0;margin:auto}.i-amphtml-layout-size-defined .i-amphtml-fill-content{position:absolute;top:0;left:0;bottom:0;right:0}.i-amphtml-replaced-content,.i-amphtml-screen-reader{padding:0!important;border:none!important}.i-amphtml-screen-reader{position:fixed!important;top:0px!important;left:0px!important;width:4px!important;height:4px!important;opacity:0!important;overflow:hidden!important;margin:0!important;display:block!important;visibility:visible!important}.i-amphtml-screen-reader~.i-amphtml-screen-reader{left:8px!important}.i-amphtml-screen-reader~.i-amphtml-screen-reader~.i-amphtml-screen-reader{left:12px!important}.i-amphtml-screen-reader~.i-amphtml-screen-reader~.i-amphtml-screen-reader~.i-amphtml-screen-reader{left:16px!important}.i-amphtml-unresolved{position:relative;overflow:hidden!important}.i-amphtml-select-disabled{-webkit-user-select:none!important;-ms-user-select:none!important;user-select:none!important}.i-amphtml-notbuilt,[layout]:not(.i-amphtml-element),[width][height][heights]:not([layout]):not(.i-amphtml-element),[width][height][sizes]:not(img):not([layout]):not(.i-amphtml-element){position:relative;overflow:hidden!important;color:transparent!important}.i-amphtml-notbuilt:not(.i-amphtml-layout-container)>*,[layout]:not([layout=container]):not(.i-amphtml-element)>*,[width][height][heights]:not([layout]):not(.i-amphtml-element)>*,[width][height][sizes]:not([layout]):not(.i-amphtml-element)>*{display:none}amp-img:not(.i-amphtml-element)[i-amphtml-ssr]>img.i-amphtml-fill-content{display:block}.i-amphtml-notbuilt:not(.i-amphtml-layout-container),[layout]:not([layout=container]):not(.i-amphtml-element),[width][height][heights]:not([layout]):not(.i-amphtml-element),[width][height][sizes]:not(img):not([layout]):not(.i-amphtml-element){color:transparent!important;line-height:0!important}.i-amphtml-ghost{visibility:hidden!important}.i-amphtml-element>[placeholder],[layout]:not(.i-amphtml-element)>[placeholder],[width][height][heights]:not([layout]):not(.i-amphtml-element)>[placeholder],[width][height][sizes]:not([layout]):not(.i-amphtml-element)>[placeholder]{display:block;line-height:normal}.i-amphtml-element>[placeholder].amp-hidden,.i-amphtml-element>[placeholder].hidden{visibility:hidden}.i-amphtml-element:not(.amp-notsupported)>[fallback],.i-amphtml-layout-container>[placeholder].amp-hidden,.i-amphtml-layout-container>[placeholder].hidden{display:none}.i-amphtml-layout-size-defined>[fallback],.i-amphtml-layout-size-defined>[placeholder]{position:absolute!important;top:0!important;left:0!important;right:0!important;bottom:0!important;z-index:1}amp-img[i-amphtml-ssr]:not(.i-amphtml-element)>[placeholder]{z-index:auto}.i-amphtml-notbuilt>[placeholder]{display:block!important}.i-amphtml-hidden-by-media-query{display:none!important}.i-amphtml-element-error{background:red!important;color:#fff!important;position:relative!important}.i-amphtml-element-error:before{content:attr(error-message)}i-amp-scroll-container,i-amphtml-scroll-container{position:absolute;top:0;left:0;right:0;bottom:0;display:block}i-amp-scroll-container.amp-active,i-amphtml-scroll-container.amp-active{overflow:auto;-webkit-overflow-scrolling:touch}.i-amphtml-loading-container{display:block!important;pointer-events:none;z-index:1}.i-amphtml-notbuilt>.i-amphtml-loading-container{display:block!important}.i-amphtml-loading-container.amp-hidden{visibility:hidden}.i-amphtml-element>[overflow]{cursor:pointer;position:relative;z-index:2;visibility:hidden;display:initial;line-height:normal}.i-amphtml-layout-size-defined>[overflow]{position:absolute}.i-amphtml-element>[overflow].amp-visible{visibility:visible}template{display:none!important}.amp-border-box,.amp-border-box *,.amp-border-box :after,.amp-border-box :before{box-sizing:border-box}amp-pixel{display:none!important}amp-analytics,amp-auto-ads,amp-story-auto-ads{position:fixed!important;top:0!important;width:1px!important;height:1px!important;overflow:hidden!important;visibility:hidden}amp-story{visibility:hidden!important}html.i-amphtml-fie>amp-analytics{position:initial!important}[visible-when-invalid]:not(.visible),form [submit-error],form [submit-success],form [submitting]{display:none}amp-accordion{display:block!important}@media (min-width:1px){:where(amp-accordion>section)>:first-child{margin:0;background-color:#efefef;padding-right:20px;border:1px solid #dfdfdf}:where(amp-accordion>section)>:last-child{margin:0}}amp-accordion>section{float:none!important}amp-accordion>section>*{float:none!important;display:block!important;overflow:hidden!important;position:relative!important}amp-accordion,amp-accordion>section{margin:0}amp-accordion:not(.i-amphtml-built)>section>:last-child{display:none!important}amp-accordion:not(.i-amphtml-built)>section[expanded]>:last-child{display:block!important}\n/*# sourceURL=/css/ampshared.css*/html.i-amphtml-inabox{width:100%!important;height:100%!important}',
          function () {
            Ju(self.document, function () {
              Ih(self),
                (function (t) {
                  yr(t.document, function () {
                    return (function (t) {
                      var n = 1500,
                        i = t.performance;
                      i &&
                        i.timing &&
                        i.timing.navigationStart &&
                        (n = Date.now() - i.timing.navigationStart);
                      var r = Math.max(1, 2100 - n);
                      t.setTimeout(function () {
                        da(t);
                        var n = t.document.styleSheets;
                        if (n) {
                          for (
                            var i = t.document.querySelectorAll(
                                'link[rel~="stylesheet"]:not([href^="https://translate.googleapis.com/translate_static/css/"]):not([href^="'.concat(
                                  ln(Tt),
                                  '"])'
                                )
                              ),
                              e = [],
                              u = 0;
                            u < i.length;
                            u++
                          ) {
                            for (var o = i[u], s = !1, h = 0; h < n.length; h++)
                              if (n[h].ownerNode == o) {
                                s = !0;
                                break;
                              }
                            s || e.push(o);
                          }
                          for (
                            var a = function (n) {
                                var i = e[n],
                                  u = i.media || 'all';
                                (i.media = 'print'),
                                  (i.onload = function () {
                                    (i.media = u), da(t);
                                  }),
                                  i.setAttribute('i-amphtml-timeout', r),
                                  i.parentNode.insertBefore(i, i.nextSibling);
                              },
                              f = 0;
                            f < e.length;
                            f++
                          )
                            a(f);
                        }
                      }, r);
                    })(t);
                  });
                })(self),
                (function (t) {
                  Ch(t.win),
                    (function (t) {
                      fi(t, 'url', uh, !0);
                    })(t),
                    (function (t) {
                      fi(t, 'templates', ih);
                    })(t),
                    fi(t, 'documentInfo', Es),
                    (function (t) {
                      fi(t, 'cid', Mh);
                    })(t),
                    (function (t) {
                      fi(t, 'viewer', Dh, !0);
                    })(t),
                    (function (t) {
                      var n = new Vh(t.win);
                      fi(
                        t,
                        'viewport',
                        function () {
                          return new Gh(t, n);
                        },
                        !0
                      );
                    })(t),
                    (function (t) {
                      fi(t, 'hidden-observer', Ts);
                    })(t),
                    (function (t) {
                      fi(t, 'history', ks);
                    })(t),
                    (function (t) {
                      fi(t, 'resources', zo);
                    })(t),
                    (function (t) {
                      fi(t, 'owners', Ws);
                    })(t),
                    (function (t) {
                      fi(t, 'mutator', jh);
                    })(t),
                    (function (t) {
                      fi(t, 'url-replace', function (t) {
                        return new gh(t, new ph(t));
                      });
                    })(t),
                    (function (t) {
                      fi(t, 'action', Ko, !0);
                    })(t),
                    (function (t) {
                      fi(t, 'standard-actions', Zs, !0);
                    })(t),
                    (function (t, n) {
                      var i, r;
                      (i = t),
                        (r = new Error('Un-supported service: ' + 'storage')),
                        (function (t, n, i) {
                          var r = Ti(t),
                            e = r[n];
                          e
                            ? e.reject && e.reject(i)
                            : ((r[n] = Si()), r[n].reject(i));
                        })(wi(yi(i)), 'storage', r);
                    })(t),
                    (function (t) {
                      fi(t, Ls, Vs, !0);
                    })(t),
                    (function (t) {
                      t.whenExtensionsKnown().then(function () {
                        t.declaresExtension('amp-form') &&
                          t.getRootNode().addEventListener('submit', wh, !0);
                      });
                    })(t);
                })(t),
                n.coreServicesAvailable(),
                (Cs = h()),
                (function (t) {
                  var n,
                    i,
                    r,
                    e,
                    u = t.win,
                    o = t.getRootNode();
                  ((n = t),
                  (i = u),
                  (r = rr(t).getLayoutRect(o.documentElement || o.body || o)),
                  (function (t, n, i) {
                    return t
                      .signals()
                      .whenSignal(Gu)
                      .then(function () {
                        var i = [];
                        return (
                          Xi(t)
                            .get()
                            .forEach(function (t) {
                              t.hasBeenMeasured() ||
                                t.hostWin != n ||
                                t.hasOwner() ||
                                i.push(t.ensureMeasured());
                            }),
                          Promise.all(i)
                        );
                      })
                      .then(function () {
                        return Xi(t)
                          .get()
                          .filter(function (t) {
                            return (
                              t.hostWin == n &&
                              !t.hasOwner() &&
                              t.hasBeenMeasured() &&
                              (function (t) {
                                return !(
                                  !t.isDisplayed() ||
                                  (!t.overlaps(r) && !t.isFixed()) ||
                                  (e && !t.prerenderAllowed())
                                );
                              })(t)
                            );
                          });
                      });
                  })(Li(n), i).then(function (t) {
                    var n = [];
                    return (
                      t.forEach(function (t) {
                        Rh.includes(t.element.tagName) ||
                          n.push(t.loadedOnce());
                      }),
                      Promise.all(n)
                    );
                  })).then(function () {
                    u.dispatchEvent(
                      $e(u, 'amp-ini-load', null, { bubbles: !0 })
                    ),
                      u.parent && u.parent.postMessage('amp-ini-load', '*');
                  });
                })(t);
            }),
              Ju(self.document, function () {
                !(function (t) {
                  !(function (t) {
                    Oo(t, Ro, _o);
                  })(t),
                    (function (t) {
                      Oo(t, jo, Do);
                    })(t),
                    (function (t) {
                      Oo(t, 'amp-layout', Mo);
                    })(t);
                })(self);
              }),
              Ju(self.document, function () {
                Ra(self, function (t) {
                  return (
                    (function (t) {
                      var n = t.document.documentElement,
                        i = Ui(t).getSingleDoc();
                      t.AMP.ampdoc = i;
                      var r = nr(n);
                      (t.AMP.viewer = r),
                        Ct().development &&
                          ((t.AMP.toggleRuntime = r.toggleRuntime.bind(r)),
                          (t.AMP.resources = Xi(n)));
                      var e = rr(n);
                      (t.AMP.viewport = {}),
                        (t.AMP.viewport.getScrollLeft =
                          e.getScrollLeft.bind(e)),
                        (t.AMP.viewport.getScrollWidth =
                          e.getScrollWidth.bind(e)),
                        (t.AMP.viewport.getWidth = e.getWidth.bind(e));
                    })(t),
                    Pn(t.document).then(function () {
                      Eo(t.AMP.ampdoc);
                    })
                  );
                });
              }),
              Ju(self.document, function () {
                Eo(t);
              }),
              Ju(
                self.document,
                function () {
                  Vs.installAnchorClickInterceptor(t, self),
                    (function (t) {
                      var n,
                        i,
                        r = t.win,
                        e = r.document,
                        u =
                          ((n = (function (t) {
                            return t.querySelectorAll('meta[name]');
                          })(e)),
                          (i = A()),
                          n.forEach(function (t) {
                            var n = t.content,
                              r = t.name;
                            if (r.startsWith('amp-cta-')) {
                              var e = r.split('amp-')[1];
                              i[e] = n;
                            } else if (r.startsWith(la)) {
                              var u = r.split(la)[1];
                              i[u] = n;
                            }
                          }),
                          i);
                      if ((o = u)['cta-type'] && o['cta-url']) {
                        var o;
                        nu(
                          t,
                          '.i-amphtml-story-ad-link-root{all:initial!important;color:initial!important;display:-ms-flexbox!important;display:flex!important;-ms-flex-direction:column!important;flex-direction:column!important;-ms-flex-align:center!important;align-items:center!important}\n/*# sourceURL=/extensions/amp-story-auto-ads/0.1/amp-story-auto-ads-shared.css*/amp-story-cta-layer{display:block!important;position:absolute!important;top:80%!important;right:0!important;bottom:0!important;left:0!important;margin:0!important;z-index:2147483642!important}\n/*# sourceURL=/extensions/amp-story-auto-ads/0.1/amp-story-auto-ads-inabox.css*/',
                          function () {}
                        ),
                          (function (t, n, i) {
                            var r = t.document;
                            try {
                              var e = n['attribution-url'],
                                u = n['attribution-icon'];
                              if (!e || !u) return null;
                              wu(e, i, 'amp-story-auto-ads attribution url'),
                                wu(u, i, 'amp-story-auto-ads attribution icon');
                              var o = In(r, 'div', {
                                  role: 'button',
                                  class: 'i-amphtml-attribution-host',
                                }),
                                s = In(r, 'img', {
                                  class: 'i-amphtml-story-ad-attribution',
                                  src: u,
                                });
                              s.addEventListener('click', function (n) {
                                return (function (t, n) {
                                  Ds(t, n, '_blank');
                                })(t, e);
                              }),
                                fa(
                                  o,
                                  s,
                                  '.i-amphtml-story-ad-attribution{position:absolute;bottom:0!important;left:0!important;max-height:15px!important;z-index:4!important}.i-amphtml-story-ad-fullbleed.i-amphtml-story-ad-attribution{bottom:12.5vh!important;left:50%!important;transform:translateX(-22.5vh)!important}\n/*# sourceURL=/extensions/amp-story-auto-ads/0.1/amp-story-auto-ads-attribution.css*/'
                                ),
                                i.appendChild(o);
                            } catch (t) {
                              return null;
                            }
                          })(r, u, e.body);
                        var h = new Yh(t),
                          a = e.createElement('div');
                        (function (t, n, i, r) {
                          var e = r['cta-url'],
                            u = r['cta-type'],
                            o = In(t, 'a', {
                              class: 'i-amphtml-story-ad-link',
                              target: '_blank',
                              href: e,
                            });
                          return n.fit(i, o, u).then(function (n) {
                            if (!n)
                              return (
                                Yt().warn(
                                  ca,
                                  'CTA button text is too long. Ad was discarded.'
                                ),
                                null
                              );
                            if (
                              ((o.href = e),
                              (o.textContent = u),
                              'https:' !== o.protocol && 'http:' !== o.protocol)
                            )
                              return (
                                Yt().warn(
                                  ca,
                                  'CTA url is not valid. Ad was discarded'
                                ),
                                null
                              );
                            var h = (function (t, n) {
                              return t.__AMP_EXPERIMENT_BRANCHES
                                ? t.__AMP_EXPERIMENT_BRANCHES[
                                    'story-ad-auto-advance'
                                  ]
                                : null;
                            })(t.defaultView);
                            return '31067118' == h || '31067119' == h
                              ? (function (t, n, i) {
                                  var r = t.createElement(
                                    'amp-story-page-outlink'
                                  );
                                  r.setAttribute('layout', 'nodisplay');
                                  var e = In(t, 'a', {
                                    class: 'i-amphtml-story-ad-link',
                                    target: '_top',
                                    href: n['cta-url'],
                                  });
                                  (e.textContent = n['cta-type']),
                                    r.appendChild(e);
                                  for (
                                    var u, o = s(va, !0);
                                    !(u = o()).done;

                                  ) {
                                    var h = u.value;
                                    n[h] && r.setAttribute(h, n[h]);
                                  }
                                  return (
                                    Fi(on(t)).installExtensionForDoc(
                                      yi(t),
                                      'amp-story-page-attachment',
                                      '0.1'
                                    ),
                                    (r.className =
                                      'i-amphtml-story-page-outlink-container'),
                                    i.appendChild(r),
                                    e
                                  );
                                })(t, r, i)
                              : (function (t, n, i) {
                                  var r = n.createElement(
                                    'amp-story-cta-layer'
                                  );
                                  r.className = 'i-amphtml-cta-container';
                                  var e = In(n, 'div', {
                                    class: 'i-amphtml-story-ad-link-root',
                                    role: 'button',
                                  });
                                  return (
                                    fa(
                                      e,
                                      t,
                                      '.i-amphtml-story-ad-link{background-color:#fff!important;border-radius:20px!important;box-sizing:border-box!important;bottom:32px!important;box-shadow:0px 2px 12px rgba(0,0,0,.16)!important;color:#4285f4!important;font-family:Roboto,sans-serif!important;font-weight:700!important;height:36px!important;letter-spacing:0.2px!important;line-height:36px!important;overflow:hidden!important;opacity:0;padding:0 10px!important;position:absolute!important;text-align:center!important;text-decoration:none!important;min-width:120px!important;max-width:calc(100vw - 64px)}[cta-active].i-amphtml-story-ad-link{animation-delay:100ms!important;animation-duration:300ms!important;animation-timing-function:cubic-bezier(0.4,0,0.2,1)!important;animation-fill-mode:forwards!important;animation-name:ad-cta!important}@keyframes ad-cta{0%{opacity:0;transform:scale(0)}to{opacity:1;transform:scale(1)}}\n/*# sourceURL=/extensions/amp-story-auto-ads/0.1/amp-story-auto-ads-cta-button.css*/'
                                    ),
                                    r.appendChild(e),
                                    i.appendChild(r),
                                    t
                                  );
                                })(o, t, i);
                          });
                        })(e, h, a, u).then(function (t) {
                          return t && t.setAttribute('cta-active', '');
                        }),
                          e.body.appendChild(a),
                          r.parent &&
                            r.parent.postMessage('amp-story-ad-load', '*');
                      }
                    })(t),
                    (function (t) {
                      var n = t.location.href;
                      if (!n.startsWith('about:')) {
                        var i = !1,
                          r = bt(t);
                        jt(t, r) && (i = '0' !== r.validate),
                          i &&
                            (function (t, n) {
                              var i = t.createElement('script');
                              if (
                                self.trustedTypes &&
                                self.trustedTypes.createPolicy
                              ) {
                                var r = self.trustedTypes.createPolicy(
                                  'validator-integration#loadScript',
                                  {
                                    createScriptURL: function (t) {
                                      return 'https://cdn.ampproject.org/v0/validator_wasm.js' ===
                                        t
                                        ? t
                                        : '';
                                    },
                                  }
                                );
                                i.src = r.createScriptURL(n);
                              } else i.src = n;
                              Dn(t, i);
                              var e = Je(i).then(
                                function () {
                                  t.head.removeChild(i);
                                },
                                function () {}
                              );
                              return t.head.appendChild(i), e;
                            })(
                              t.document,
                              ''.concat(Tt, '/v0/validator_wasm.js')
                            ).then(function () {
                              amp.validator.validateUrlAndLog(n, t.document);
                            });
                      }
                    })(self),
                    (function (t) {
                      Jt(t.defaultView);
                      var n = t.defaultView;
                      Pn(t)
                        .then(function () {
                          return (function (t) {
                            var n = tu(t).map(function (n) {
                              var i = (function (t, n) {
                                return Ei(t, n);
                              })(t, n).then(function (t) {
                                return t &&
                                  (function (t) {
                                    return 'function' == typeof t.whenReady;
                                  })(t)
                                  ? t.whenReady().then(function () {
                                      return t;
                                    })
                                  : t;
                              });
                              return Ji(t).timeoutPromise(
                                3e3,
                                i,
                                'Render timeout waiting for service '.concat(
                                  n,
                                  ' to be ready.'
                                )
                              );
                            });
                            return Promise.all(n);
                          })(n);
                        })
                        .catch(function (t) {
                          return d(t), [];
                        })
                        .then(function (i) {
                          (ru = !0),
                            t.body.getBoundingClientRect(),
                            uu(t),
                            yi(t).signals().signal(Te),
                            i.length > 0 &&
                              Xi(t.documentElement).schedulePass(1, !0);
                          try {
                            var r = $i(n);
                            r.tick('mbv'), r.flush();
                          } catch (t) {}
                        });
                    })(self.document);
                },
                !0
              ),
              Ju(self.document, function () {
                n.tick('e_is'), Xi(t).ampInitComplete(), n.flush();
              });
          },
          !0,
          'amp-runtime'
        );
    }),
    self.console &&
      (console.info || console.log).call(
        console,
        'Powered by AMP ⚡ HTML – Version '.concat('2410292120000'),
        self.location.href
      ),
    self.document.documentElement.setAttribute('amp-version', '2410292120000');
})();
/*! https://mths.be/cssescape v1.5.1 by @mathias | MIT license */
/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file or at
 * https://developers.google.com/open-source/licenses/bsd
 */
//# sourceMappingURL=amp4ads-v0.js.map
