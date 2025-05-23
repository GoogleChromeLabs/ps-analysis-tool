!(function () {
  function t(t, i, n) {
    return (
      i in t
        ? Object.defineProperty(t, i, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[i] = n),
      t
    );
  }
  var i = Array.isArray;
  function n(t, i) {
    for (var n = [], r = 0, s = 0; s < t.length; s++) {
      var e = t[s];
      i(e, s, t) ? n.push(e) : (r < s && (t[r] = e), r++);
    }
    return r < t.length && (t.length = r), n;
  }
  function r(t, i) {
    for (var n = 0; n < t.length; n++) if (i(t[n], n, t)) return n;
    return -1;
  }
  function s(t) {
    return 'string' == typeof t;
  }
  function e(t, i) {
    (null == i || i > t.length) && (i = t.length);
    for (var n = 0, r = new Array(i); n < i; n++) r[n] = t[n];
    return r;
  }
  function o(t, i) {
    var n =
      ('undefined' != typeof Symbol && t[Symbol.iterator]) || t['@@iterator'];
    if (n) return (n = n.call(t)).next.bind(n);
    if (
      Array.isArray(t) ||
      (n = (function (t, i) {
        if (t) {
          if ('string' == typeof t) return e(t, i);
          var n = Object.prototype.toString.call(t).slice(8, -1);
          return (
            'Object' === n && t.constructor && (n = t.constructor.name),
            'Map' === n || 'Set' === n
              ? Array.from(t)
              : 'Arguments' === n ||
                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
              ? e(t, i)
              : void 0
          );
        }
      })(t)) ||
      (i && t && 'number' == typeof t.length)
    ) {
      n && (t = n);
      var r = 0;
      return function () {
        return r >= t.length ? { done: !0 } : { done: !1, value: t[r++] };
      };
    }
    throw new TypeError(
      'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
    );
  }
  function a(t) {
    return (a =
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
  var h = Object.prototype;
  function u(t) {
    var i = Object.create(null);
    return t && Object.assign(i, t), i;
  }
  function f(t) {
    return 1 == (null == t ? void 0 : t.nodeType);
  }
  h.hasOwnProperty, h.toString;
  var l = '​​​';
  function c(t) {
    return f(t) ? t.tagName.toLowerCase() + (t.id ? '#'.concat(t.id) : '') : t;
  }
  function p(t, i) {
    var r,
      s,
      e =
        arguments.length > 2 && void 0 !== arguments[2]
          ? arguments[2]
          : 'Assertion failed';
    if (i) return i;
    t && -1 == e.indexOf(t) && (e += t);
    for (var o = 3, a = e.split('%s'), h = a.shift(), u = [h]; a.length; ) {
      var f = arguments[o++],
        l = a.shift();
      (h += c(f) + l), u.push(f, l.trim());
    }
    var p = new Error(h);
    throw (
      ((p.messageArray = n(u, function (t) {
        return '' !== t;
      })),
      null === (r = (s = self).__AMP_REPORT_ERROR) ||
        void 0 === r ||
        r.call(s, p),
      p)
    );
  }
  function m(t, n, r, s, e) {
    return i(e) ? t(r, e.concat([n])) : t(r, ''.concat(e || s, ': %s'), n), n;
  }
  function v(t) {
    var i = Object.getOwnPropertyDescriptor(t, 'message');
    if (null != i && i.writable) return t;
    var n = t.message,
      r = t.stack,
      s = new Error(n);
    for (var e in t) s[e] = t[e];
    return (s.stack = r), s;
  }
  function d(t) {
    for (var i, n = null, r = '', s = o(arguments, !0); !(i = s()).done; ) {
      var e = i.value;
      e instanceof Error && !n ? (n = v(e)) : (r && (r += ' '), (r += e));
    }
    return n ? r && (n.message = r + ': ' + n.message) : (n = new Error(r)), n;
  }
  function y(t) {
    var i = d.apply(null, arguments);
    return (i.expected = !0), i;
  }
  function g(t) {
    var i = !1,
      n = null,
      r = t;
    return function () {
      if (!i) {
        for (var t = arguments.length, s = new Array(t), e = 0; e < t; e++)
          s[e] = arguments[e];
        (n = r.apply(self, s)), (i = !0), (r = null);
      }
      return n;
    };
  }
  function b(t, i, n) {
    var r = 0,
      s = null;
    function e(e) {
      (s = null), (r = t.setTimeout(o, n)), i.apply(null, e);
    }
    function o() {
      (r = 0), s && e(s);
    }
    return function () {
      for (var t = arguments.length, i = new Array(t), n = 0; n < t; n++)
        i[n] = arguments[n];
      r ? (s = i) : e(i);
    };
  }
  var w = /(?:^[#?]?|&)([^=&]+)(?:=([^&]*))?/g;
  function x(t) {
    var i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : '';
    try {
      return decodeURIComponent(t);
    } catch (t) {
      return i;
    }
  }
  function k(t) {
    var i,
      n = u();
    if (!t) return n;
    for (; (i = w.exec(t)); ) {
      var r = x(i[1], i[1]),
        s = i[2] ? x(i[2].replace(/\+/g, ' '), i[2]) : '';
      n[r] = s;
    }
    return n;
  }
  function S(t) {
    var i = (t || self).location;
    return k(i.originalHash || i.hash);
  }
  var A = function (t) {
      return self.AMP_CONFIG ? self.AMP_CONFIG[t] : null;
    },
    j =
      ('string' == typeof A('cdnProxyRegex')
        ? new RegExp(A('cdnProxyRegex'))
        : A('cdnProxyRegex')) ||
      /^https:\/\/([a-zA-Z0-9_-]+\.)?cdn\.ampproject\.org$/;
  function I(t) {
    if (!self.document || !self.document.head) return null;
    if (self.location && j.test(self.location.origin)) return null;
    var i = self.document.head.querySelector('meta[name="'.concat(t, '"]'));
    return (i && i.getAttribute('content')) || null;
  }
  var R = A('cdnUrl') || I('runtime-host') || 'https://cdn.ampproject.org',
    E = '';
  function C(t) {
    var i = t || self;
    return i.__AMP_MODE
      ? i.__AMP_MODE
      : (i.__AMP_MODE = (function (t) {
          return {
            localDev: !1,
            development: M(t, S(t)),
            esm: !1,
            test: !1,
            rtvVersion: O(t),
            ssrReady: !1,
          };
        })(i));
  }
  function O(t) {
    var i;
    return (
      E ||
        (E =
          (null === (i = t.AMP_CONFIG) || void 0 === i ? void 0 : i.v) ||
          '01'.concat('2410292120000')),
      E
    );
  }
  function M(t, i) {
    var n = i || S(t);
    return (
      ['1', 'actions', 'amp', 'amp4ads', 'amp4email'].includes(n.development) ||
      !!t.AMP_DEV_MODE
    );
  }
  var P = function () {},
    T = function () {
      return '01'.concat('2410292120000');
    },
    U = function (t, i) {
      return i.reduce(function (t, i) {
        return ''.concat(t, '&s[]=').concat(q(i));
      }, 'https://log.amp.dev/?v='
        .concat(T(), '&id=')
        .concat(encodeURIComponent(t)));
    },
    z = function () {
      return ''.concat(R, '/rtv/').concat(T(), '/log-messages.simple.json');
    },
    q = function (t) {
      return encodeURIComponent(String(c(t)));
    },
    _ = function (t) {
      return parseInt(S(t).log, 10);
    },
    F = (function () {
      function n(t, i) {
        var n = this,
          r =
            arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : '';
        (this.win = t),
          (this.tt = i),
          (this.nt = this.rt()),
          (this.it = r),
          (this.et = null),
          (this.ft = g(function () {
            t.fetch(z())
              .then(function (t) {
                return t.json();
              }, P)
              .then(function (t) {
                t && (n.et = t);
              });
          })),
          (this.ot = this.assert.bind(this));
      }
      var r = n.prototype;
      return (
        (r.rt = function () {
          var t,
            i = this.win;
          return null !== (t = i.console) && void 0 !== t && t.log && 0 != _(i)
            ? this.ut()
            : 0;
        }),
        (r.ut = function (t) {
          return this.tt(_(t), C().development);
        }),
        (r.st = function (i, n, r) {
          var e, o;
          if (n > this.nt) return !1;
          var a = this.win.console,
            h =
              null !==
                (e = ((o = {}),
                t(o, 1, a.error),
                t(o, 3, a.info),
                t(o, 2, a.warn),
                o)[n]) && void 0 !== e
                ? e
                : a.log,
            u = this.ct(r),
            f = '['.concat(i, ']');
          return (
            s(u[0]) ? (u[0] = f + ' ' + u[0]) : u.unshift(f), h.apply(a, u), !0
          );
        }),
        (r.fine = function (t) {
          for (
            var i = arguments.length, n = new Array(i > 1 ? i - 1 : 0), r = 1;
            r < i;
            r++
          )
            n[r - 1] = arguments[r];
          this.st(t, 4, n);
        }),
        (r.info = function (t) {
          for (
            var i = arguments.length, n = new Array(i > 1 ? i - 1 : 0), r = 1;
            r < i;
            r++
          )
            n[r - 1] = arguments[r];
          this.st(t, 3, n);
        }),
        (r.warn = function (t) {
          for (
            var i = arguments.length, n = new Array(i > 1 ? i - 1 : 0), r = 1;
            r < i;
            r++
          )
            n[r - 1] = arguments[r];
          this.st(t, 2, n);
        }),
        (r.error = function (t) {
          for (
            var i = arguments.length, n = new Array(i > 1 ? i - 1 : 0), r = 1;
            r < i;
            r++
          )
            n[r - 1] = arguments[r];
          if (!this.st(t, 1, n)) {
            var s,
              e,
              o = this.createError.apply(this, n);
            (o.name = t || o.name),
              null === (s = (e = self).__AMP_REPORT_ERROR) ||
                void 0 === s ||
                s.call(e, o);
          }
        }),
        (r.expectedError = function (t) {
          for (
            var i = arguments.length, n = new Array(i > 1 ? i - 1 : 0), r = 1;
            r < i;
            r++
          )
            n[r - 1] = arguments[r];
          var s, e;
          this.st(t, 1, n) ||
            null === (s = (e = self).__AMP_REPORT_ERROR) ||
            void 0 === s ||
            s.call(e, this.createExpectedError.apply(this, n));
        }),
        (r.createError = function (t) {
          return this.ht(d.apply(null, arguments));
        }),
        (r.createExpectedError = function (t) {
          return this.ht(y.apply(null, arguments));
        }),
        (r.ht = function (t) {
          return (
            (t = v(t)),
            this.it
              ? t.message
                ? -1 == t.message.indexOf(this.it) && (t.message += this.it)
                : (t.message = this.it)
              : t.message.indexOf(l) >= 0 &&
                (t.message = t.message.replace(l, '')),
            t
          );
        }),
        (r.ct = function (t) {
          return i(t[0]) ? this.lt(t[0]) : t;
        }),
        (r.lt = function (t) {
          var i,
            n = t.shift();
          return (
            C(this.win).development && this.ft(),
            null !== (i = this.et) && void 0 !== i && i[n]
              ? [this.et[n]].concat(t)
              : ['More info at '.concat(U(n, t))]
          );
        }),
        (r.assert = function (t, n, r) {
          return i(n)
            ? this.assert.apply(this, [t].concat(this.lt(n)))
            : p.apply(
                null,
                [this.it].concat(Array.prototype.slice.call(arguments))
              );
        }),
        (r.assertElement = function (t, i) {
          return (function (t, i, n) {
            return m(t, i, f(i), 'Element expected', n);
          })(this.ot, t, i);
        }),
        (r.assertString = function (t, i) {
          return (function (t, i, n) {
            return m(t, i, s(i), 'String expected', n);
          })(this.ot, t, i);
        }),
        (r.assertNumber = function (t, i) {
          return (function (t, i, n) {
            return m(t, i, 'number' == typeof i, 'Number expected', n);
          })(this.ot, t, i);
        }),
        (r.assertArray = function (t, n) {
          return (function (t, n, r) {
            return m(t, n, i(n), 'Array expected', r);
          })(this.ot, t, n);
        }),
        (r.assertBoolean = function (t, i) {
          return (function (t, i, n) {
            return m(t, i, !!i === i, 'Boolean expected', n);
          })(this.ot, t, i);
        }),
        n
      );
    })();
  self.__AMP_LOG = self.__AMP_LOG || {
    user: null,
    dev: null,
    userForEmbed: null,
  };
  var D = self.__AMP_LOG,
    N = null;
  function Y() {
    (N = F),
      $(),
      (function (t) {
        if ((D.user || (D.user = Z(l)), void D.user.win))
          return D.userForEmbed || (D.userForEmbed = Z('​​​​'));
        D.user;
      })();
  }
  function L(t, i) {
    if (!N) throw new Error('failed to call initLogConstructor');
    return new N(self, t, i);
  }
  function Z(t) {
    return L(function (t, i) {
      return i || t >= 1 ? 4 : 2;
    }, t);
  }
  function $() {
    return (
      D.dev ||
      (D.dev = L(function (t) {
        return t >= 3 ? 4 : t >= 2 ? 3 : 0;
      }))
    );
  }
  var H,
    X = (function () {
      function t(t, i) {
        (this.t = t),
          (this.ri = i),
          (this.si = this.t.document),
          (this.ei = !1),
          (this.oi = !1),
          (this.ai = null);
      }
      var i = t.prototype;
      return (
        (i.buildCallback = function () {
          this.ei || (this.hi(), (this.ei = !0));
        }),
        (i.layoutCallback = function () {
          this.oi || (this.oi = !0);
        }),
        (i.hi = function () {
          this.ai = this.si.createElement('main');
          var t = this.ri.attachShadow({ mode: 'open' }),
            i = this.si.createElement('style');
          (i.textContent =
            'amp-story-entry-point{position:relative;display:block}\n/*# sourceURL=/css/amp-story-entry-point.css*/'),
            t.appendChild(i),
            t.appendChild(this.ai);
        }),
        (i.getElement = function () {
          return this.ri;
        }),
        t
      );
    })();
  function G() {
    return H || (H = Promise.resolve(void 0));
  }
  var J = function () {
    var t = this;
    this.promise = new Promise(function (i, n) {
      (t.resolve = i), (t.reject = n);
    });
  };
  function V(t, i) {
    var n = Object.keys(t);
    if (Object.getOwnPropertySymbols) {
      var r = Object.getOwnPropertySymbols(t);
      i &&
        (r = r.filter(function (i) {
          return Object.getOwnPropertyDescriptor(t, i).enumerable;
        })),
        n.push.apply(n, r);
    }
    return n;
  }
  function B(i) {
    for (var n = 1; n < arguments.length; n++) {
      var r = null != arguments[n] ? arguments[n] : {};
      n % 2
        ? V(Object(r), !0).forEach(function (n) {
            t(i, n, r[n]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(i, Object.getOwnPropertyDescriptors(r))
        : V(Object(r)).forEach(function (t) {
            Object.defineProperty(i, t, Object.getOwnPropertyDescriptor(r, t));
          });
    }
    return i;
  }
  var K =
      'ase art bmp blp cd5 cit cpt cr2 cut dds dib djvu egt exif gif gpl grf icns ico iff jng jpeg jpg jfif jp2 jps lbm max miff mng msp nitf ota pbm pc1 pc2 pc3 pcf pcx pdn pgm PI1 PI2 PI3 pict pct pnm pns ppm psb psd pdd psp px pxm pxr qfx raw rle sct sgi rgb int bw tga tiff tif vtf xbm xcf xpm 3dv amf ai awg cgm cdr cmx dxf e2d egt eps fs gbr odg svg stl vrml x3d sxd v2d vnd wmf emf art xar png webp jxr hdp wdp cur ecw iff lbm liff nrrd pam pcx pgf sgi rgb rgba bw int inta sid ras sun tga'.split(
        ' '
      ),
    W = function (t) {
      return K.some(function (i) {
        return !!t.endsWith('.'.concat(i));
      });
    },
    Q =
      '### #gf $on $tf 0b 8m 8u 12u 15u 64c 075 75 085 85 91 091 096 96 abf acfm acs afm afn afs all amfm apf asf aspf atm auf b30 bco bdf bepf bez bfn bmap bmf bx bzr cbtf cct cef cff cfn cga ch4 cha chm chr chx claf collection compositefont dfont dus dzk eft eot etx euf f00 f06 f08 f09 f3f f10 f11 f12 f13 f16 fd fdb ff ffil flf fli fn3 fnb fnn fnt fnta fo1 fo2 fog fon font fonts fot frf frs ftm fxr fyi gdr gf gft glf glif glyphs gsf gxf hbf ice intellifont lepf lft lwfn mcf mcf mfd mfm mft mgf mmm mrf mtf mvec nlq ntf odttf ofm okf otf pcf pcf pfa pfb pfm pft phf pk pkt prs pss qbf qfn r8? scr sfd sff sfi sfl sfn sfo sfp sfs sif snf spd spritefont sui suit svg sxs t1c t2 tb1 tb2 tdf tfm tmf tpf ttc tte ttf type ufm ufo usl usp us? vf vf1 vf3 vfb vfm vfont vlw vmf vnf w30 wfn wnf woff woff2 xfc xfn xfr xft zfi zsu _v'.split(
        ' '
      ),
    tt = function (t) {
      return Q.some(function (i) {
        return !!t.endsWith('.'.concat(i));
      });
    },
    it =
      'undefined' != typeof globalThis
        ? globalThis
        : 'undefined' != typeof window
        ? window
        : 'undefined' != typeof global
        ? global
        : 'undefined' != typeof self
        ? self
        : {};
  function nt(t, i) {
    if (((i = i.split(':')[0]), !(t = +t))) return !1;
    switch (i) {
      case 'http':
      case 'ws':
        return 80 !== t;
      case 'https':
      case 'wss':
        return 443 !== t;
      case 'ftp':
        return 21 !== t;
      case 'gopher':
        return 70 !== t;
      case 'file':
        return !1;
    }
    return 0 !== t;
  }
  var rt = Object.prototype.hasOwnProperty;
  function st(t) {
    try {
      return decodeURIComponent(t.replace(/\+/g, ' '));
    } catch (t) {
      return null;
    }
  }
  var et = {
      stringify: function (t, i) {
        i = i || '';
        var n,
          r = [];
        for (s in ('string' != typeof i && (i = '?'), t))
          if (rt.call(t, s)) {
            (n = t[s]) || (null != n && !isNaN(n)) || (n = '');
            var s = encodeURIComponent(s);
            (n = encodeURIComponent(n)),
              null !== s && null !== n && r.push(s + '=' + n);
          }
        return r.length ? i + r.join('&') : '';
      },
      parse: function (t) {
        for (var i, n = /([^=?&]+)=?([^&]*)/g, r = {}; (i = n.exec(t)); ) {
          var s = st(i[1]);
          (i = st(i[2])), null === s || null === i || s in r || (r[s] = i);
        }
        return r;
      },
    },
    ot =
      /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/,
    at = /[\n\r\t]/g,
    ht = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//,
    ut = /:\d+$/,
    ft = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i,
    lt = /^[a-zA-Z]:/;
  function ct(t) {
    return (t || '').toString().replace(ot, '');
  }
  var pt = [
      ['#', 'hash'],
      ['?', 'query'],
      function (t, i) {
        return dt(i.protocol) ? t.replace(/\\/g, '/') : t;
      },
      ['/', 'pathname'],
      ['@', 'auth', 1],
      [NaN, 'host', void 0, 1, 1],
      [/:(\d*)$/, 'port', void 0, 1],
      [NaN, 'hostname', void 0, 1, 1],
    ],
    mt = { hash: 1, query: 1 };
  function vt(t) {
    var i =
      ('undefined' != typeof window
        ? window
        : void 0 !== it
        ? it
        : 'undefined' != typeof self
        ? self
        : {}
      ).location || {};
    (t = t || i), (i = {});
    var n,
      r = a(t);
    if ('blob:' === t.protocol) i = new gt(unescape(t.pathname), {});
    else if ('string' === r) for (n in ((i = new gt(t, {})), mt)) delete i[n];
    else if ('object' === r) {
      for (n in t) n in mt || (i[n] = t[n]);
      void 0 === i.slashes && (i.slashes = ht.test(t.href));
    }
    return i;
  }
  function dt(t) {
    return (
      'file:' === t ||
      'ftp:' === t ||
      'http:' === t ||
      'https:' === t ||
      'ws:' === t ||
      'wss:' === t
    );
  }
  function yt(t, i) {
    (t = (t = ct(t)).replace(at, '')), (i = i || {});
    var n = (t = ft.exec(t))[1] ? t[1].toLowerCase() : '',
      r = !!t[2],
      s = !!t[3],
      e = 0;
    return (
      r
        ? s
          ? ((s = t[2] + t[3] + t[4]), (e = t[2].length + t[3].length))
          : ((s = t[2] + t[4]), (e = t[2].length))
        : s
        ? ((s = t[3] + t[4]), (e = t[3].length))
        : (s = t[4]),
      'file:' === n
        ? 2 <= e && (s = s.slice(2))
        : dt(n)
        ? (s = t[4])
        : n
        ? r && (s = s.slice(2))
        : 2 <= e && dt(i.protocol) && (s = t[4]),
      { protocol: n, slashes: r || dt(n), slashesCount: e, rest: s }
    );
  }
  function gt(t, i, n) {
    if (((t = (t = ct(t)).replace(at, '')), !(this instanceof gt)))
      return new gt(t, i, n);
    var r = pt.slice(),
      s = a(i),
      e = 0;
    'object' !== s && 'string' !== s && ((n = i), (i = null)),
      n && 'function' != typeof n && (n = et.parse);
    var o = yt(t || '', (i = vt(i)));
    for (
      s = !o.protocol && !o.slashes,
        this.slashes = o.slashes || (s && i.slashes),
        this.protocol = o.protocol || i.protocol || '',
        t = o.rest,
        (('file:' === o.protocol && (2 !== o.slashesCount || lt.test(t))) ||
          (!o.slashes &&
            (o.protocol || 2 > o.slashesCount || !dt(this.protocol)))) &&
          (r[3] = [/(.*)/, 'pathname']);
      e < r.length;
      e++
    )
      if ('function' == typeof (o = r[e])) t = o(t, this);
      else {
        var h = o[0],
          u = o[1];
        h != h
          ? (this[u] = t)
          : 'string' == typeof h
          ? ~(h = '@' === h ? t.lastIndexOf(h) : t.indexOf(h)) &&
            ('number' == typeof o[2]
              ? ((this[u] = t.slice(0, h)), (t = t.slice(h + o[2])))
              : ((this[u] = t.slice(h)), (t = t.slice(0, h))))
          : (h = h.exec(t)) && ((this[u] = h[1]), (t = t.slice(0, h.index))),
          (this[u] = this[u] || (s && o[3] && i[u]) || ''),
          o[4] && (this[u] = this[u].toLowerCase());
      }
    if (
      (n && (this.query = n(this.query)),
      s &&
        i.slashes &&
        '/' !== this.pathname.charAt(0) &&
        ('' !== this.pathname || '' !== i.pathname))
    ) {
      if (((t = this.pathname), (i = i.pathname), '' !== t)) {
        for (
          n = (i = (i || '/').split('/').slice(0, -1).concat(t.split('/')))[
            (t = i.length) - 1
          ],
            r = !1,
            e = 0;
          t--;

        )
          '.' === i[t]
            ? i.splice(t, 1)
            : '..' === i[t]
            ? (i.splice(t, 1), e++)
            : e && (0 === t && (r = !0), i.splice(t, 1), e--);
        r && i.unshift(''),
          ('.' !== n && '..' !== n) || i.push(''),
          (i = i.join('/'));
      }
      this.pathname = i;
    }
    '/' !== this.pathname.charAt(0) &&
      dt(this.protocol) &&
      (this.pathname = '/' + this.pathname),
      nt(this.port, this.protocol) ||
        ((this.host = this.hostname), (this.port = '')),
      (this.username = this.password = ''),
      this.auth &&
        (~(h = this.auth.indexOf(':'))
          ? ((this.username = this.auth.slice(0, h)),
            (this.username = encodeURIComponent(
              decodeURIComponent(this.username)
            )),
            (this.password = this.auth.slice(h + 1)),
            (this.password = encodeURIComponent(
              decodeURIComponent(this.password)
            )))
          : (this.username = encodeURIComponent(decodeURIComponent(this.auth))),
        (this.auth = this.password
          ? this.username + ':' + this.password
          : this.username)),
      (this.origin =
        'file:' !== this.protocol && dt(this.protocol) && this.host
          ? this.protocol + '//' + this.host
          : 'null'),
      (this.href = this.toString());
  }
  (gt.prototype = {
    set: function (t, i, n) {
      switch (t) {
        case 'query':
          'string' == typeof i && i.length && (i = (n || et.parse)(i)),
            (this[t] = i);
          break;
        case 'port':
          (this[t] = i),
            nt(i, this.protocol)
              ? i && (this.host = this.hostname + ':' + i)
              : ((this.host = this.hostname), (this[t] = ''));
          break;
        case 'hostname':
          (this[t] = i), this.port && (i += ':' + this.port), (this.host = i);
          break;
        case 'host':
          (this[t] = i),
            ut.test(i)
              ? ((i = i.split(':')),
                (this.port = i.pop()),
                (this.hostname = i.join(':')))
              : ((this.hostname = i), (this.port = ''));
          break;
        case 'protocol':
          (this.protocol = i.toLowerCase()), (this.slashes = !n);
          break;
        case 'pathname':
        case 'hash':
          i
            ? ((n = 'pathname' === t ? '/' : '#'),
              (this[t] = i.charAt(0) !== n ? n + i : i))
            : (this[t] = i);
          break;
        case 'username':
        case 'password':
          this[t] = encodeURIComponent(i);
          break;
        case 'auth':
          ~(t = i.indexOf(':'))
            ? ((this.username = i.slice(0, t)),
              (this.username = encodeURIComponent(
                decodeURIComponent(this.username)
              )),
              (this.password = i.slice(t + 1)),
              (this.password = encodeURIComponent(
                decodeURIComponent(this.password)
              )))
            : (this.username = encodeURIComponent(decodeURIComponent(i)));
      }
      for (i = 0; i < pt.length; i++)
        (t = pt[i])[4] && (this[t[1]] = this[t[1]].toLowerCase());
      return (
        (this.auth = this.password
          ? this.username + ':' + this.password
          : this.username),
        (this.origin =
          'file:' !== this.protocol && dt(this.protocol) && this.host
            ? this.protocol + '//' + this.host
            : 'null'),
        (this.href = this.toString()),
        this
      );
    },
    toString: function (t) {
      (t && 'function' == typeof t) || (t = et.stringify);
      var i = this.host,
        n = this.protocol;
      return (
        n && ':' !== n.charAt(n.length - 1) && (n += ':'),
        (n += (this.protocol && this.slashes) || dt(this.protocol) ? '//' : ''),
        this.username
          ? ((n += this.username),
            this.password && (n += ':' + this.password),
            (n += '@'))
          : this.password
          ? ((n += ':' + this.password), (n += '@'))
          : 'file:' !== this.protocol &&
            dt(this.protocol) &&
            !i &&
            '/' !== this.pathname &&
            (n += '@'),
        (':' === i[i.length - 1] || (ut.test(this.hostname) && !this.port)) &&
          (i += ':'),
        (n += i + this.pathname),
        (t = 'object' === a(this.query) ? t(this.query) : this.query) &&
          (n += '?' !== t.charAt(0) ? '?' + t : t),
        this.hash && (n += this.hash),
        n
      );
    },
  }),
    (gt.extractProtocol = yt),
    (gt.location = vt),
    (gt.trimLeft = ct),
    (gt.qs = et);
  var bt = gt,
    wt = /^xn--/,
    xt = /[^\0-\x7E]/,
    kt = /[\x2E\u3002\uFF0E\uFF61]/g,
    St = {
      overflow: 'Overflow: input needs wider integers to process',
      'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
      'invalid-input': 'Invalid input',
    },
    At = Math.floor,
    jt = String.fromCharCode;
  function It(t) {
    throw new RangeError(St[t]);
  }
  function Rt(t, i) {
    var n = t.split('@'),
      r = '';
    1 < n.length && ((r = n[0] + '@'), (t = n[1])), (n = []);
    for (var s = (t = (t = t.replace(kt, '.')).split('.')).length; s--; )
      n[s] = i(t[s]);
    return r + n.join('.');
  }
  function Et(t, i, n) {
    var r = 0;
    for (t = n ? At(t / 700) : t >> 1, t += At(t / i); 455 < t; r += 36)
      t = At(t / 35);
    return At(r + (36 * t) / (t + 38));
  }
  var Ct = function (t) {
      return Rt(t, function (t) {
        return wt.test(t)
          ? (function (t) {
              var i = [],
                n = t.length,
                r = 0,
                s = 128,
                e = 72,
                o = t.lastIndexOf('-');
              0 > o && (o = 0);
              for (var a = 0; a < o; ++a)
                128 <= t.charCodeAt(a) && It('not-basic'),
                  i.push(t.charCodeAt(a));
              for (o = 0 < o ? o + 1 : 0; o < n; ) {
                a = r;
                for (var h = 1, u = 36; ; u += 36) {
                  o >= n && It('invalid-input');
                  var f = t.charCodeAt(o++);
                  (36 <=
                    (f =
                      10 > f - 48
                        ? f - 22
                        : 26 > f - 65
                        ? f - 65
                        : 26 > f - 97
                        ? f - 97
                        : 36) ||
                    f > At((2147483647 - r) / h)) &&
                    It('overflow'),
                    (r += f * h);
                  var l = u <= e ? 1 : u >= e + 26 ? 26 : u - e;
                  if (f < l) break;
                  h > At(2147483647 / (f = 36 - l)) && It('overflow'), (h *= f);
                }
                (e = Et(r - a, (f = i.length + 1), 0 == a)),
                  At(r / f) > 2147483647 - s && It('overflow'),
                  (s += At(r / f)),
                  (r %= f),
                  i.splice(r++, 0, s);
              }
              return String.fromCodePoint.apply(String, i);
            })(t.slice(4).toLowerCase())
          : t;
      });
    },
    Ot =
      /[A-Za-z\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02b8\u0300-\u0590\u0800-\u1fff\u200e\u2c00-\ufb1c\ufe00-\ufe6f\ufefd-\uffff]/,
    Mt = /[\u0591-\u06ef\u06fa-\u07ff\u200f\ufb1d-\ufdff\ufe70-\ufefc]/;
  function Pt(t) {
    if (Ut((t = new bt(t).hostname))) var i = !1;
    else
      (i = Ct(t)),
        (i =
          63 >= t.length &&
          !(Ot.test(i) && Mt.test(i)) &&
          -1 != t.indexOf('.'));
    return i
      ? 63 <
        (i = (function (t) {
          return Rt(t, function (t) {
            return xt.test(t)
              ? 'xn--' +
                  (function (t) {
                    for (
                      var i,
                        n = [],
                        r = (t = (function (t) {
                          for (var i = [], n = 0, r = t.length; n < r; ) {
                            var s = t.charCodeAt(n++);
                            if (55296 <= s && 56319 >= s && n < r) {
                              var e = t.charCodeAt(n++);
                              56320 == (64512 & e)
                                ? i.push(
                                    ((1023 & s) << 10) + (1023 & e) + 65536
                                  )
                                : (i.push(s), n--);
                            } else i.push(s);
                          }
                          return i;
                        })(t)).length,
                        s = 128,
                        e = 0,
                        a = 72,
                        h = o(t, !0);
                      !(i = h()).done;

                    ) {
                      var u = i.value;
                      128 > u && n.push(jt(u));
                    }
                    var f = (u = n.length);
                    for (u && n.push('-'); f < r; ) {
                      for (
                        var l, c = 2147483647, p = o(t, !0);
                        !(l = p()).done;

                      ) {
                        var m = l.value;
                        m >= s && m < c && (c = m);
                      }
                      var v = f + 1;
                      c - s > At((2147483647 - e) / v) && It('overflow'),
                        (e += (c - s) * v),
                        (s = c);
                      for (var d, y = o(t, !0); !(d = y()).done; ) {
                        var g = d.value;
                        if (
                          (g < s && 2147483647 < ++e && It('overflow'), g == s)
                        ) {
                          var b = e;
                          for (c = 36; ; c += 36) {
                            var w = c <= a ? 1 : c >= a + 26 ? 26 : c - a;
                            if (b < w) break;
                            var x = b - w,
                              k = 36 - w;
                            (w += x % k),
                              (b = n).push.call(
                                b,
                                jt(w + 22 + 75 * (26 > w) - 0)
                              ),
                              (b = At(x / k));
                          }
                          n.push(jt(b + 22 + 75 * (26 > b) - 0)),
                            (a = Et(e, v, f == u)),
                            (e = 0),
                            ++f;
                        }
                      }
                      ++e, ++s;
                    }
                    return n.join('');
                  })(t)
              : t;
          });
        })(
          (i = (i = (i = Ct(t)).split('-').join('--')).split('.').join('-'))
        ).toLowerCase()).length
        ? Tt(t)
        : (Ut(i) && (i = '0-'.concat(i, '-0')), Promise.resolve(i))
      : Tt(t);
  }
  function Tt(t) {
    return (t =
      'undefined' != typeof window
        ? (function (t) {
            return (
              (t = new TextEncoder('utf-8').encode(t)),
              window.crypto.subtle.digest('SHA-256', t).then(function (t) {
                var i = [];
                t = new DataView(t);
                for (var n = 0; n < t.byteLength; n += 4) {
                  var r = ('00000000' + t.getUint32(n).toString(16)).slice(-8);
                  i.push(r);
                }
                return i.join('');
              })
            );
          })(t)
        : void 0).then(function (t) {
      return (function (t) {
        var i = [];
        t.match(/.{1,2}/g).forEach(function (t, n) {
          i[n] = parseInt(t, 16);
        });
        var n = i.length % 5,
          r = Math.floor(i.length / 5);
        if (((t = []), 0 != n)) {
          for (var s = 0; s < 5 - n; s++) i += '\0';
          r += 1;
        }
        for (s = 0; s < r; s++)
          t.push('abcdefghijklmnopqrstuvwxyz234567'.charAt(i[5 * s] >> 3)),
            t.push(
              'abcdefghijklmnopqrstuvwxyz234567'.charAt(
                ((7 & i[5 * s]) << 2) | (i[5 * s + 1] >> 6)
              )
            ),
            t.push(
              'abcdefghijklmnopqrstuvwxyz234567'.charAt(
                (63 & i[5 * s + 1]) >> 1
              )
            ),
            t.push(
              'abcdefghijklmnopqrstuvwxyz234567'.charAt(
                ((1 & i[5 * s + 1]) << 4) | (i[5 * s + 2] >> 4)
              )
            ),
            t.push(
              'abcdefghijklmnopqrstuvwxyz234567'.charAt(
                ((15 & i[5 * s + 2]) << 1) | (i[5 * s + 3] >> 7)
              )
            ),
            t.push(
              'abcdefghijklmnopqrstuvwxyz234567'.charAt(
                (127 & i[5 * s + 3]) >> 2
              )
            ),
            t.push(
              'abcdefghijklmnopqrstuvwxyz234567'.charAt(
                ((3 & i[5 * s + 3]) << 3) | (i[5 * s + 4] >> 5)
              )
            ),
            t.push(
              'abcdefghijklmnopqrstuvwxyz234567'.charAt(31 & i[5 * s + 4])
            );
        for (
          r = 0,
            1 == n
              ? (r = 6)
              : 2 == n
              ? (r = 4)
              : 3 == n
              ? (r = 3)
              : 4 == n && (r = 1),
            n = 0;
          n < r;
          n++
        )
          t.pop();
        for (n = 0; n < r; n++) t.push('=');
        return t.join('');
      })('ffffffffff' + t + '000000').substr(8, Math.ceil((4 * t.length) / 5));
    });
  }
  function Ut(t) {
    return '--' == t.slice(2, 4) && 'xn' != t.slice(0, 2);
  }
  var zt = 'viewer';
  function qt(t) {
    var i =
      arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
    return W(t) ? '/i' : tt(t) ? '/r' : i === zt ? '/v' : '/c';
  }
  var _t = 'amp-viewer-messaging',
    Ft = 'channelOpen',
    Dt = '__AMPHTML__';
  function Nt(t) {
    if ('string' != typeof t) return t;
    if ('{' != t.charAt(0)) return null;
    try {
      return JSON.parse(t);
    } catch (t) {
      return null;
    }
  }
  var Yt = (function () {
      function t(t, i, n) {
        (this.win_ = t), (this.origin_ = i), (this.target_ = n);
      }
      var i = t.prototype;
      return (
        (i.addEventListener = function (t, i) {
          var n = this;
          this.win_.addEventListener('message', function (t) {
            t.origin == n.origin_ && t.source == n.target_ && i(t);
          });
        }),
        (i.postMessage = function (t) {
          var i = 'null' === this.origin_ ? '*' : this.origin_;
          this.target_.postMessage(t, i);
        }),
        (i.start = function () {}),
        t
      );
    })(),
    Lt = (function () {
      function t(t, i, n, r, s) {
        (this.win_ = t),
          (this.port_ = i),
          (this.isWebview_ = !!n),
          (this.token_ = r || null),
          (this.verifyToken_ = !!s),
          (this.requestIdCounter_ = 0),
          (this.waitingForResponse_ = {}),
          (this.messageHandlers_ = {}),
          (this.defaultHandler_ = null),
          this.port_.addEventListener(
            'message',
            this.handleMessage_.bind(this)
          ),
          this.port_.start();
      }
      (t.initiateHandshakeWithDocument = function (i, n) {
        return new Promise(function (r) {
          var s = setInterval(function () {
            var e = new MessageChannel(),
              o = { app: Dt, name: 'handshake-poll' };
            i.postMessage(o, '*', [e.port2]);
            var a = e.port1;
            a.addEventListener('message', function i(e) {
              var o = Nt(e.data);
              if (o && o.app === Dt && o.name === Ft) {
                clearInterval(s), a.removeEventListener('message', i);
                var h = new t(null, a, !1, n, !0);
                h.sendResponse_(o.requestid, Ft, null), r(h);
              }
            }),
              a.start();
          }, 1e3);
        });
      }),
        (t.waitForHandshakeFromDocument = function (i, n, r, s, e) {
          return new Promise(function (o) {
            i.addEventListener('message', function a(h) {
              var u = Nt(h.data);
              if (
                u &&
                (h.origin == r || (e && e.test(h.origin))) &&
                (!h.source || h.source == n) &&
                u.app === Dt &&
                u.name === Ft
              ) {
                i.removeEventListener('message', a);
                var f = new t(null, new Yt(i, h.origin, n), !1, s, !0);
                f.sendResponse_(u.requestid, Ft, null), o(f);
              }
            });
          });
        });
      var i = t.prototype;
      return (
        (i.registerHandler = function (t, i) {
          this.messageHandlers_[t] = i;
        }),
        (i.unregisterHandler = function (t) {
          delete this.messageHandlers_[t];
        }),
        (i.setDefaultHandler = function (t) {
          this.defaultHandler_ = t;
        }),
        (i.handleMessage_ = function (t) {
          var i = Nt(t.data);
          i &&
            i.app === Dt &&
            (this.token_ &&
            this.verifyToken_ &&
            i.messagingToken !== this.token_
              ? this.logError_(_t + ': handleMessage_ error: ', 'invalid token')
              : 'q' === i.type
              ? this.handleRequest_(i)
              : 's' === i.type && this.handleResponse_(i));
        }),
        (i.sendRequest = function (t, i, n) {
          var r = this,
            s = ++this.requestIdCounter_,
            e = void 0;
          return (
            n &&
              (e = new Promise(function (t, i) {
                r.waitingForResponse_[s] = { resolve: t, reject: i };
              })),
            this.sendMessage_({
              app: Dt,
              requestid: s,
              type: 'q',
              name: t,
              data: i,
              rsvp: n,
            }),
            e
          );
        }),
        (i.sendResponse_ = function (t, i, n) {
          this.sendMessage_({
            app: Dt,
            requestid: t,
            type: 's',
            name: i,
            data: n,
          });
        }),
        (i.sendResponseError_ = function (t, i, n) {
          var r = this.errorToString_(n);
          this.logError_(_t + ': sendResponseError_, message name: ' + i, r),
            this.sendMessage_({
              app: Dt,
              requestid: t,
              type: 's',
              name: i,
              data: null,
              error: r,
            });
        }),
        (i.sendMessage_ = function (t) {
          var i = Object.assign(t, {});
          this.token_ && !this.verifyToken_ && (i.messagingToken = this.token_),
            this.port_.postMessage(this.isWebview_ ? JSON.stringify(i) : i);
        }),
        (i.handleRequest_ = function (t) {
          var i = this,
            n = this.messageHandlers_[t.name];
          if ((n || (n = this.defaultHandler_), !n)) {
            var r = new Error(
              'Cannot handle request because no default handler is set!'
            );
            throw ((r.args = t.name), r);
          }
          var s = n(t.name, t.data, !!t.rsvp);
          if (t.rsvp) {
            var e = t.requestid;
            if (!s)
              throw (
                (this.sendResponseError_(e, t.name, new Error('no response')),
                new Error('expected response but none given: ' + t.name))
              );
            s.then(
              function (n) {
                i.sendResponse_(e, t.name, n);
              },
              function (n) {
                i.sendResponseError_(e, t.name, n);
              }
            );
          }
        }),
        (i.handleResponse_ = function (t) {
          var i = t.requestid,
            n = this.waitingForResponse_[i];
          n &&
            (delete this.waitingForResponse_[i],
            t.error
              ? (this.logError_(_t + ': handleResponse_ error: ', t.error),
                n.reject(
                  new Error(
                    'Request '.concat(t.name, ' failed: ').concat(t.error)
                  )
                ))
              : n.resolve(t.data));
        }),
        (i.logError_ = function (t, i) {
          if (this.win_) {
            var n = 'amp-messaging-error-logger: ' + t;
            (n += ' data: ' + this.errorToString_(i)),
              (this.win_.viewerState = n);
          }
        }),
        (i.errorToString_ = function (t) {
          return t ? (t.message ? t.message : String(t)) : 'unknown error';
        }),
        t
      );
    })();
  function Zt(t, i) {
    return t;
  }
  var $t,
    Ht = 'visible',
    Xt = 'inactive';
  function Gt(t) {
    try {
      t.focus();
    } catch (t) {}
  }
  function Jt(t, i, n) {
    var r = t.hasAttribute(i),
      s = void 0 !== n ? n : !r;
    return s !== r && (s ? t.setAttribute(i, '') : t.removeAttribute(i)), s;
  }
  var Vt,
    Bt = ['Webkit', 'webkit', 'Moz', 'moz', 'ms', 'O', 'o'];
  function Kt(t, i, n, r, s) {
    var e = (function (t, i, n) {
      if (i.startsWith('--')) return i;
      $t || ($t = u());
      var r = $t[i];
      if (!r || n) {
        if (((r = i), void 0 === t[i])) {
          var s = (function (t) {
              return t.charAt(0).toUpperCase() + t.slice(1);
            })(i),
            e = (function (t, i) {
              for (var n = 0; n < Bt.length; n++) {
                var r = Bt[n] + i;
                if (void 0 !== t[r]) return r;
              }
              return '';
            })(t, s);
          void 0 !== t[e] && (r = e);
        }
        n || ($t[i] = r);
      }
      return r;
    })(t.style, i, s);
    if (e) {
      var o,
        a = r ? n + r : n;
      t.style.setProperty(
        ((o = e.replace(/[A-Z]/g, function (t) {
          return '-' + t.toLowerCase();
        })),
        Bt.some(function (t) {
          return o.startsWith(t + '-');
        })
          ? '-'.concat(o)
          : o),
        a
      );
    }
  }
  function Wt(t, i) {
    for (var n in i) Kt(t, n, i[n]);
  }
  function Qt(t, i) {
    for (var n = 0; n < i.length; n++) Kt(t, i[n], null);
  }
  function ti(t, i, n, r) {
    var s = { detail: n };
    if ((Object.assign(s, r), 'function' == typeof t.CustomEvent))
      return new t.CustomEvent(i, s);
    var e = t.document.createEvent('CustomEvent');
    return e.initCustomEvent(i, !!s.bubbles, !!s.cancelable, n), e;
  }
  function ii(t, i, n, r) {
    var s = n,
      e = (function (t, i, n, r) {
        var s = t,
          e = n,
          o = function (t) {
            try {
              return e(t);
            } catch (t) {
              var i, n;
              throw (
                (null === (i = (n = self).__AMP_REPORT_ERROR) ||
                  void 0 === i ||
                  i.call(n, t),
                t)
              );
            }
          },
          a = (function () {
            if (void 0 !== Vt) return Vt;
            Vt = !1;
            try {
              var t = {
                get capture() {
                  return (Vt = !0), !1;
                },
              };
              self.addEventListener('test-options', null, t),
                self.removeEventListener('test-options', null, t);
            } catch (t) {}
            return Vt;
          })(),
          h = !(null == r || !r.capture);
        return (
          s.addEventListener(i, o, a ? r : h),
          function () {
            null == s || s.removeEventListener(i, o, a ? r : h),
              (e = null),
              (s = null),
              (o = null);
          }
        );
      })(
        t,
        i,
        function (t) {
          try {
            s(t);
          } finally {
            (s = null), e();
          }
        },
        r
      );
    return e;
  }
  var ni,
    ri,
    si = (function () {
      function t(t, i, n) {
        (this.t = t), (this.ri = i), (this.ui = n), (this.fi = null), this.li();
      }
      var i = t.prototype;
      return (
        (i.li = function () {
          this.t.IntersectionObserver && this.t === this.t.parent
            ? this.ci()
            : this.pi();
        }),
        (i.ci = function () {
          var t = this,
            i = new this.t.IntersectionObserver(function (n) {
              n.forEach(function (n) {
                n.isIntersecting && (t.ui(), i.unobserve(t.ri));
              });
            });
          i.observe(this.ri);
        }),
        (i.pi = function () {
          (this.fi = b(this.t, this.mi.bind(this), 500)),
            this.t.addEventListener('scroll', this.fi),
            this.mi(this.ri);
        }),
        (i.mi = function () {
          var t = this.ri.getBoundingClientRect().top;
          this.t.innerHeight > t &&
            (this.ui(), this.t.removeEventListener('scroll', this.fi));
        }),
        t
      );
    })(),
    ei = (function () {
      function t(t) {
        (this.t = t),
          (this.vi = {
            startY: 0,
            lastDelta: 0,
            touchStartTimeMs: null,
            touchEndTimeMs: null,
            touchMoveTimeMs: null,
          }),
          (this.di = {
            startY: 0,
            isRunning: !1,
            acceleration: 1,
            speedLimit: 0.3,
            startTimeMs: null,
            maxTimeBetweenSwipesMs: 250,
            moveTimeThresholdMs: 100,
            durationMs: null,
            meetsDeltaYThreshold: !1,
            deltaYThresholdPx: 5,
            deltaY: null,
            offsetThresholdPx: 30,
            offsetPx: null,
            multiplier: 1,
          });
      }
      var i = t.prototype;
      return (
        (i.onTouchStart = function (t, i) {
          (this.vi.startY = i),
            (this.vi.touchStartTimeMs = t),
            (this.di.startY = this.t.scrollY),
            this.di.isRunning &&
            this.vi.touchEndTimeMs - this.vi.touchStartTimeMs <
              this.di.maxTimeBetweenSwipesMs
              ? (this.di.multiplier += this.di.acceleration)
              : (this.di.multiplier = 1),
            (this.di.isRunning = !1);
        }),
        (i.onTouchMove = function (t, i) {
          (this.di.acceleration = Math.abs(
            this.di.deltaY / (t - this.vi.touchMoveTimeMs)
          )),
            (this.vi.touchMoveTimeMs = t),
            b(this.t, this.yi.bind(this, i), 50)();
        }),
        (i.yi = function (t) {
          (this.di.deltaY = t - this.vi.startY),
            (this.di.meetsDeltaYThreshold =
              Math.abs(this.di.deltaY) > this.di.deltaYThresholdPx),
            this.di.meetsDeltaYThreshold && this.t.scrollBy(0, -this.di.deltaY);
        }),
        (i.onTouchEnd = function (t) {
          var i = this;
          if (((this.vi.touchEndTimeMs = t), this.di.meetsDeltaYThreshold)) {
            var n = this.vi.touchEndTimeMs - this.vi.touchMoveTimeMs;
            (this.di.offsetPx = this.gi()),
              n < this.di.moveTimeThresholdMs &&
                Math.abs(this.di.offsetPx) > this.di.offsetThresholdPx &&
                ((this.di.durationMs = 1.2 * this.t.innerHeight),
                (this.di.isRunning = !0),
                requestAnimationFrame(function (t) {
                  (i.di.startTimeMs = t), (i.di.startY = i.t.scrollY), i.bi(t);
                })),
              (this.di.multiplier = 1),
              (this.vi.startY = 0),
              (this.di.deltaY = 0);
          }
        }),
        (i.gi = function () {
          var t = this.t.innerHeight * this.di.speedLimit,
            i = Math.pow(this.di.acceleration, 2) * this.t.innerHeight;
          return (
            (i = Math.min(t, i)) *
            (this.di.deltaY > 0 ? -this.di.multiplier : this.di.multiplier)
          );
        }),
        (i.bi = function (t) {
          var i = t - this.di.startTimeMs;
          if (!(i > this.di.durationMs)) {
            var n = this.wi(i / this.di.durationMs) * this.di.offsetPx,
              r = this.di.startY + n;
            this.di.isRunning
              ? (this.t.scroll(0, r), requestAnimationFrame(this.bi.bind(this)))
              : cancelAnimationFrame(requestAnimationFrame(this.bi.bind(this)));
          }
        }),
        (i.wi = function (t) {
          return 1 - --t * t * t * t;
        }),
        t
      );
    })(),
    oi = (function () {
      function t(t) {
        (this.zt = t), (this.It = 0), (this.Ct = 0), (this.Ot = u());
      }
      var i = t.prototype;
      return (
        (i.has = function (t) {
          return !!this.Ot[t];
        }),
        (i.get = function (t) {
          var i = this.Ot[t];
          if (i) return (i.access = ++this.Ct), i.payload;
        }),
        (i.put = function (t, i) {
          this.has(t) || this.It++,
            (this.Ot[t] = { payload: i, access: this.Ct }),
            this.qt();
        }),
        (i.qt = function () {
          if (!(this.It <= this.zt)) {
            var t,
              i = this.Ot,
              n = this.Ct + 1;
            for (var r in i) {
              var s = i[r].access;
              s < n && ((n = s), (t = r));
            }
            void 0 !== t && (delete i[t], this.It--);
          }
        }),
        t
      );
    })();
  function ai(t, i) {
    return (
      ni ||
        ((ni = self.document.createElement('a')),
        (ri = self.__AMP_URL_CACHE || (self.__AMP_URL_CACHE = new oi(100)))),
      hi(ni, t, i ? null : ri)
    );
  }
  function hi(t, i, n) {
    if (n && n.has(i)) return n.get(i);
    (t.href = i), t.protocol || (t.href = t.href);
    var r,
      s = {
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
    '/' !== s.pathname[0] && (s.pathname = '/' + s.pathname),
      (('http:' == s.protocol && 80 == s.port) ||
        ('https:' == s.protocol && 443 == s.port)) &&
        ((s.port = ''), (s.host = s.hostname)),
      (r =
        t.origin && 'null' != t.origin
          ? t.origin
          : 'data:' != s.protocol && s.host
          ? s.protocol + '//' + s.host
          : s.href),
      (s.origin = r);
    var e = s;
    return n && n.put(i, e), e;
  }
  function ui(t, i) {
    return (function (t, i, n) {
      if (!i) return t;
      var r = t.split('#', 2),
        s = r[0].split('?', 2);
      return (
        s[0] +
        (s[1] ? '?'.concat(s[1], '&').concat(i) : '?'.concat(i)) +
        (r[1] ? '#'.concat(r[1]) : '')
      );
    })(t, fi(i));
  }
  function fi(t) {
    var n,
      r,
      s,
      e = [];
    for (var o in t) {
      var a = t[o];
      if (null != a) {
        a = i((s = a)) ? s : [s];
        for (var h = 0; h < a.length; h++)
          e.push(
            ((n = o),
            (r = a[h]),
            ''.concat(encodeURIComponent(n), '=').concat(encodeURIComponent(r)))
          );
      }
    }
    return e.join('&');
  }
  function li(t) {
    var i = t.indexOf('#');
    return -1 == i ? t : t.substring(0, i);
  }
  function ci(t) {
    var i = t.indexOf('#');
    return -1 == i ? '' : t.substring(i);
  }
  function pi(t) {
    return j.test(
      (function (t) {
        return 'string' == typeof t ? ai(t) : t;
      })(t).origin
    );
  }
  function mi(t) {
    var i = t.indexOf('?');
    if (-1 == i) return t;
    var n = ci(t);
    return t.substring(0, i) + n;
  }
  var vi,
    di,
    yi,
    gi,
    bi = 'i-amphtml-story-player-loading',
    wi = 'i-amphtml-story-player-loaded',
    xi = 'i-amphtml-story-player-error',
    ki = ['cdn.ampproject.org', 'www.bing-amp.com'],
    Si = ['allow-top-navigation'],
    Ai = 'amp-story-player-hide-button',
    ji = 'PAGE_ATTACHMENT_STATE',
    Ii = 'UI_STATE',
    Ri = 'MUTED_STATE',
    Ei = 'CURRENT_PAGE_ID',
    Ci = 'i-amphtml-story-player-no-navigation-transition',
    Oi = 'amp-story-player',
    Mi = 'amp-story-player-dev',
    Pi = (function () {
      function t(t, i) {
        return (
          (this.t = t),
          (this.ri = i),
          (this.si = t.document),
          (this.xi = this.si.createElement('a')),
          (this.ki = []),
          (this.ai = null),
          (this.Si = 0),
          (this.Ai = 0),
          (this.ji = null),
          (this.Ii = null),
          (this.Ri = null),
          (this.vi = { startX: 0, startY: 0, lastX: 0, isSwipeX: null }),
          (this.Ei = null),
          (this.Ci = new J()),
          this.Oi(),
          (this.Mi = new ei(t)),
          (this.Pi = !0),
          (this.Ti = null),
          (this.Ui = null),
          (this.zi = null),
          (this.qi = !1),
          this.ri
        );
      }
      var i = t.prototype;
      return (
        (i.Oi = function () {
          (this.ri.buildPlayer = this.buildPlayer.bind(this)),
            (this.ri.layoutPlayer = this.layoutPlayer.bind(this)),
            (this.ri.getElement = this.getElement.bind(this)),
            (this.ri.getStories = this.getStories.bind(this)),
            (this.ri.load = this.load.bind(this)),
            (this.ri.show = this.show.bind(this)),
            (this.ri.add = this.add.bind(this)),
            (this.ri.play = this.play.bind(this)),
            (this.ri.pause = this.pause.bind(this)),
            (this.ri.go = this.go.bind(this)),
            (this.ri.mute = this.mute.bind(this)),
            (this.ri.unmute = this.unmute.bind(this)),
            (this.ri.getStoryState = this.getStoryState.bind(this)),
            (this.ri.rewind = this.rewind.bind(this));
        }),
        (i.load = function () {
          if (!this.ri.isConnected)
            throw new Error(
              '['.concat(
                Oi,
                '] element must be connected to the DOM before calling load().'
              )
            );
          if (this.ri.ei)
            throw new Error(
              '['.concat(Oi, '] calling load() on an already loaded element.')
            );
          this.buildPlayer(), this.layoutPlayer();
        }),
        (i._i = function (t) {
          (t.idx = this.ki.length),
            (t.distance = t.idx - this.Si),
            (t.connectedDeferred = new J()),
            this.ki.push(t);
        }),
        (i.add = function (t) {
          if (!(t.length <= 0)) {
            if (
              !Array.isArray(t) ||
              !t.every(function (t) {
                return t && t.href;
              })
            )
              throw new Error('"stories" parameter has the wrong structure');
            for (var i = this.ki.length, n = 0; n < t.length; n++) {
              var r = t[n];
              this._i(r), this.Fi(r);
            }
            this.Di(i);
          }
        }),
        (i.play = function () {
          this.ri.oi || this.layoutPlayer(), this.Ni(!1);
        }),
        (i.pause = function () {
          this.Ni(!0);
        }),
        (i.Ni = function (t) {
          this.Pi = !t;
          var i = this.ki[this.Si];
          this.Yi(i, t ? 'paused' : Ht);
        }),
        (i.getElement = function () {
          return this.ri;
        }),
        (i.getStories = function () {
          return this.ki;
        }),
        (i.buildPlayer = function () {
          this.ri.ei ||
            (this.Li(),
            this.hi(),
            this.Zi(),
            this.$i(),
            this.Hi(),
            this.Xi(this.ki.length - this.Si - 1),
            this.Gi(),
            this.Ji(),
            this.Vi(),
            this.Bi(),
            this.Ki(),
            this.Wi(),
            (this.ri.ei = !0));
        }),
        (i.Li = function () {
          var t,
            i = this;
          ((t = this.ri.querySelectorAll('a'))
            ? Array.prototype.slice.call(t)
            : []
          ).forEach(function (t) {
            var n = t.querySelector('img[data-amp-story-player-poster-img]'),
              r = n && n.getAttribute('src'),
              s = {
                href: t.href,
                title: (t.textContent && t.textContent.trim()) || null,
                posterImage: t.getAttribute('data-poster-portrait-src') || r,
              };
            i._i(s);
          });
        }),
        (i.Wi = function () {
          this.ri.dispatchEvent(ti(this.t, 'ready', {})),
            (this.ri.isReady = !0);
        }),
        (i.Zi = function () {
          var t = this;
          this.ki.forEach(function (i) {
            t.Fi(i);
          });
        }),
        (i.hi = function () {
          (this.ai = this.si.createElement('div')),
            this.ai.classList.add('i-amphtml-story-player-main-container');
          var t = this.si.createElement('div');
          t.classList.add(
            'i-amphtml-fill-content',
            'i-amphtml-story-player-shadow-root-intermediary'
          ),
            this.ri.appendChild(t);
          var i = this.ri.attachShadow ? t.attachShadow({ mode: 'open' }) : t,
            n = this.si.createElement('style');
          (n.textContent =
            ':host{all:initial;color:initial}.story-player-iframe{height:100%;width:100%;-ms-flex:0 0 100%;flex:0 0 100%;border:0;opacity:0;transition:opacity 500ms ease;position:absolute}.i-amphtml-story-player-main-container{height:100%;position:relative;overflow:hidden;transform-style:preserve-3d}.i-amphtml-story-player-loaded .story-player-iframe{opacity:1;transition:transform 200ms cubic-bezier(0.4,0,0.2,1)}.i-amphtml-story-player-no-navigation-transition .story-player-iframe{transition-duration:0.01s}.i-amphtml-story-player-main-container .story-player-iframe[i-amphtml-iframe-position="0"],.i-amphtml-story-player-main-container iframe:first-of-type{transform:translateZ(1px)}.i-amphtml-story-player-main-container .story-player-iframe[i-amphtml-iframe-position="1"],.i-amphtml-story-player-main-container iframe:nth-of-type(2),.i-amphtml-story-player-main-container iframe:nth-of-type(3){transform:translate3d(100%,0,0)}.i-amphtml-story-player-main-container .story-player-iframe[i-amphtml-iframe-position="-1"]{transform:translate3d(-100%,0,0)}.amp-story-player-exit-control-button{position:absolute;height:48px;width:48px;background-repeat:no-repeat;background-position:50%;margin-top:7px;background-size:28px;border:0px;background-color:transparent;outline:transparent;cursor:pointer;z-index:1}.amp-story-player-close-button{background-image:url(\'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="%23FFF"><path fill="none" d="M0 0h24v24H0z"/><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>\')}.amp-story-player-back-button{background-image:url(\'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="%23FFF"><path fill="none" d="M0 0h24v24H0z"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"/></svg>\')}.amp-story-player-hide-button{display:none}.i-amphtml-story-player-panel{--i-amphtml-story-player-panel-ratio:69/116;--i-amphtml-story-player-panel-responsive-margin:max(74px,calc(var(--i-amphtml-story-player-height)*0.0825));--i-amphtml-story-player-panel-height:calc(var(--i-amphtml-story-player-height) - var(--i-amphtml-story-player-panel-responsive-margin)*2);--i-amphtml-story-player-panel-width:calc(var(--i-amphtml-story-player-panel-height)*var(--i-amphtml-story-player-panel-ratio));--i-amphtml-story-player-panel-button-margin:max(10px,calc(50vw - 145px - var(--i-amphtml-story-player-panel-width)/2))}.i-amphtml-story-player-panel.i-amphtml-story-player-panel-medium{--i-amphtml-story-player-panel-responsive-margin:0px;--i-amphtml-story-player-panel-width:calc(var(--i-amphtml-story-player-height)*var(--i-amphtml-story-player-panel-ratio))}.i-amphtml-story-player-panel.i-amphtml-story-player-panel-small{--i-amphtml-story-player-panel-ratio:36/53}.i-amphtml-story-player-panel-next,.i-amphtml-story-player-panel-prev{position:absolute;top:50%;transform:translateY(-50%);width:48px;height:48px;z-index:1;background-color:transparent;border:none;background-position:50%;background-repeat:no-repeat;cursor:pointer;transition:opacity 150ms}.i-amphtml-story-player-panel-next[disabled],.i-amphtml-story-player-panel-prev[disabled]{opacity:.1;cursor:initial}.i-amphtml-story-player-full-bleed-story .i-amphtml-story-player-panel-next,.i-amphtml-story-player-full-bleed-story .i-amphtml-story-player-panel-prev,:not(.i-amphtml-story-player-panel)>.i-amphtml-story-player-panel-next,:not(.i-amphtml-story-player-panel)>.i-amphtml-story-player-panel-prev{opacity:0;pointer-events:none}.i-amphtml-story-player-panel-next,.i-amphtml-story-player-panel-prev{background-image:url(\'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none"><path stroke="%23fff" stroke-linecap="round" stroke-width="1.9" d="M17 29.2V18.8c0-1.2 1.4-2 2.5-1.3l7.5 5.2c1 .6 1 2 0 2.6l-7.5 5.2c-1 .7-2.5 0-2.5-1.3Z"/><rect width="1.8" height="15.6" x="30.2" y="16.2" fill="%23fff" rx=".9"/></svg>\')!important}.i-amphtml-story-player-panel-prev{margin-inline-start:calc(var(--i-amphtml-story-player-panel-button-margin));transform:translateY(-50%) rotate(180deg)}.i-amphtml-story-player-panel-next{margin-inline-end:var(--i-amphtml-story-player-panel-button-margin);right:0}[dir=rtl].i-amphtml-story-player-panel-prev{right:0}[dir=rtl].i-amphtml-story-player-panel-next{left:0;transform:translateY(-50%) rotate(180deg)}\n/*# sourceURL=/css/amp-story-player-shadow.css*/'),
            i.appendChild(n),
            i.insertBefore(this.ai, i.firstElementChild);
        }),
        (i.$i = function () {
          var t = this,
            i = this.ri.getAttribute('exit-control');
          if ('back-button' === (n = i) || 'close-button' === n) {
            var n,
              r = this.si.createElement('button');
            this.ai.appendChild(r);
            var s = 'back-button' === i;
            r.classList.add(
              s
                ? 'amp-story-player-back-button'
                : 'amp-story-player-close-button'
            ),
              r.classList.add('amp-story-player-exit-control-button'),
              r.addEventListener('click', function () {
                t.ri.dispatchEvent(
                  ti(
                    t.t,
                    s ? 'amp-story-player-back' : 'amp-story-player-close',
                    {}
                  )
                );
              });
          }
        }),
        (i.Hi = function () {
          if (this.ji) return this.ji;
          var t = this.ri.getAttribute('amp-cache');
          t &&
            !ki.includes(t) &&
            console.error(
              '['.concat(Oi, ']'),
              'Unsupported cache specified, use one of following: '.concat(ki)
            );
          var i,
            n,
            r,
            s = this.ri.querySelector('script');
          if (!s) return null;
          if (
            'SCRIPT' != (i = s).tagName ||
            'APPLICATION/JSON' !=
              (null === (n = i.getAttribute('type')) || void 0 === n
                ? void 0
                : n.toUpperCase())
          )
            throw new Error('<script> child must have type="application/json"');
          try {
            this.ji = ((r = s.textContent), JSON.parse(r));
          } catch (t) {
            console.error('['.concat(Oi, '] '), t);
          }
          return this.ji;
        }),
        (i.Fi = function (t) {
          var i = this.si.createElement('iframe');
          t.posterImage && Kt(i, 'backgroundImage', t.posterImage),
            i.classList.add('story-player-iframe'),
            i.setAttribute('allow', 'autoplay; web-share'),
            (function (t) {
              if (t.sandbox && t.sandbox.supports) {
                for (
                  var i = [
                      'allow-top-navigation-by-user-activation',
                      'allow-popups-to-escape-sandbox',
                    ],
                    n = 0;
                  n < i.length;
                  n++
                ) {
                  var r = i[n];
                  if (!t.sandbox.supports(r))
                    return void $().info(
                      '3p-frame',
                      "Iframe doesn't support %s",
                      r
                    );
                }
                t.sandbox =
                  i.join(' ') +
                  ' ' +
                  [
                    'allow-forms',
                    'allow-modals',
                    'allow-pointer-lock',
                    'allow-popups',
                    'allow-same-origin',
                    'allow-scripts',
                  ].join(' ');
              }
            })(i),
            this.Qi(i),
            this.tr(i),
            (t.iframe = i);
        }),
        (i.Qi = function (t) {
          if (t.sandbox && t.sandbox.supports && !(t.sandbox.length <= 0))
            for (var i = 0; i < Si.length; i++) {
              var n = Si[i];
              if (!t.sandbox.supports(n))
                throw new Error("Iframe doesn't support: ".concat(n));
              t.sandbox.add(n);
            }
        }),
        (i.ir = function (t) {
          var i = this,
            n = t.iframe;
          t.messagingPromise = new Promise(function (r) {
            i.nr(t, n).then(
              function (n) {
                n.setDefaultHandler(function () {
                  return G();
                }),
                  n.registerHandler('touchstart', function (t, n) {
                    i.rr(n);
                  }),
                  n.registerHandler('touchmove', function (t, n) {
                    i.sr(n);
                  }),
                  n.registerHandler('touchend', function (t, n) {
                    i.er(n);
                  }),
                  n.registerHandler('selectDocument', function (t, n) {
                    i.ar(n);
                  }),
                  n.registerHandler('storyContentLoaded', function () {
                    (t.storyContentLoaded = !0), i.hr(t);
                  }),
                  n.sendRequest('onDocumentState', { state: ji }, !1),
                  n.sendRequest('onDocumentState', { state: Ei }, !1),
                  n.sendRequest('onDocumentState', { state: Ri }),
                  n.sendRequest('onDocumentState', { state: Ii }),
                  n.registerHandler('documentStateUpdate', function (t, r) {
                    i.ur(r, n);
                  }),
                  i.ji &&
                    i.ji.controls &&
                    (i.lr(t.idx),
                    n.sendRequest(
                      'customDocumentUI',
                      { controls: i.ji.controls },
                      !1
                    )),
                  r(n);
              },
              function (t) {
                console.error('['.concat(Oi, ']'), t);
              }
            );
          });
        }),
        (i.lr = function (t) {
          if (t === this.ki.length - 1) {
            var i = r(this.ji.controls, function (t) {
              return 'skip-next' === t.name || 'skip-to-next' === t.name;
            });
            i >= 0 && (this.ji.controls[i].state = 'disabled');
          }
        }),
        (i.nr = function (t, i) {
          var n = this;
          return this.cr(t.href).then(function (t) {
            return Lt.waitForHandshakeFromDocument(
              n.t,
              i.contentWindow,
              n.pr(t).origin,
              null,
              j
            );
          });
        }),
        (i.tr = function (t) {
          var i = this;
          this.ai.classList.add(bi),
            (t.onload = function () {
              i.ai.classList.remove(bi),
                i.ai.classList.add(wi),
                i.ri.classList.add(wi);
            }),
            (t.onerror = function () {
              i.ai.classList.remove(bi),
                i.ai.classList.add(xi),
                i.ri.classList.add(xi);
            });
        }),
        (i.layoutPlayer = function () {
          var t = this;
          if (!this.ri.oi) {
            if (
              (new si(this.t, this.ri, function () {
                return t.Ci.resolve();
              }),
              this.t.ResizeObserver)
            )
              new this.t.ResizeObserver(function (i) {
                var n = i[0].contentRect,
                  r = n.height,
                  s = n.width;
                t.mr(r, s);
              }).observe(this.ri);
            else {
              var i = this.ri.getBoundingClientRect(),
                n = i.height,
                r = i.width;
              this.mr(n, r);
            }
            this.Di(), (this.ri.oi = !0);
          }
        }),
        (i.Ki = function () {
          var t = this;
          (this.Ui = this.si.createElement('button')),
            this.Ui.classList.add('i-amphtml-story-player-panel-prev'),
            this.Ui.addEventListener('click', function () {
              return t.vr();
            }),
            this.Ui.setAttribute('aria-label', 'previous story'),
            this.ai.appendChild(this.Ui),
            (this.zi = this.si.createElement('button')),
            this.zi.classList.add('i-amphtml-story-player-panel-next'),
            this.zi.addEventListener('click', function () {
              return t.dr();
            }),
            this.zi.setAttribute('aria-label', 'next story'),
            this.ai.appendChild(this.zi),
            this.yr();
        }),
        (i.yr = function () {
          Jt(this.Ui, 'disabled', this.gr(this.Si - 1) && !this.Ri),
            Jt(this.zi, 'disabled', this.gr(this.Si + 1) && !this.Ri);
        }),
        (i.mr = function (t, i) {
          var n = i / t > 0.775;
          this.ai.classList.toggle('i-amphtml-story-player-panel', n),
            n &&
              (Wt(this.ai, {
                '--i-amphtml-story-player-height': ''.concat(t, 'px'),
              }),
              this.ai.classList.toggle(
                'i-amphtml-story-player-panel-medium',
                t < 756
              ),
              this.ai.classList.toggle(
                'i-amphtml-story-player-panel-small',
                t < 538
              ));
        }),
        (i.br = function () {
          var t = this.ji.behavior.endpoint;
          return t
            ? ((t = t.replace(/\${offset}/, this.ki.length.toString())),
              fetch(t, {
                method: 'GET',
                headers: { Accept: 'application/json' },
              })
                .then(function (t) {
                  return t.json();
                })
                .catch(function (t) {
                  console.error('['.concat(Oi, ']'), t);
                }))
            : ((this.Ii = !1), G());
        }),
        (i.show = function (t) {
          var i = this,
            n =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : null,
            r =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : {},
            s = this.wr(t),
            e = G();
          return (
            s.idx !== this.Si &&
              ((this.Si = s.idx),
              (e = this.Di()),
              !1 === r.animate &&
                (this.ai.classList.toggle(Ci, !0),
                ii(s.iframe, 'transitionend', function () {
                  i.ai.classList.remove(Ci);
                })),
              this.kr()),
            null != n
              ? e.then(function () {
                  return i.Sr(n);
                })
              : e
          );
        }),
        (i.mute = function () {
          var t = this.ki[this.Si];
          this.Ar(t, !0);
        }),
        (i.unmute = function () {
          var t = this.ki[this.Si];
          this.Ar(t, !1);
        }),
        (i.getStoryState = function (t) {
          'page-attachment' === t && this.jr();
        }),
        (i.Ir = function (t) {
          var i = ti(this.t, 'navigation', t);
          this.ri.dispatchEvent(i);
        }),
        (i.kr = function () {
          var t = this,
            i = this.Si,
            n = this.ki.length - this.Si - 1,
            r = { index: i, remaining: n };
          this.yr(),
            this.Rr().then(function (i) {
              return t.Er(i);
            }),
            this.Ir(r),
            this.Xi(n);
        }),
        (i.Rr = function () {
          var t = this.ki[this.Si];
          return new Promise(function (i) {
            t.messagingPromise.then(function (t) {
              t.sendRequest('getDocumentState', { state: Ii }, !0).then(
                function (t) {
                  return i(t.value);
                }
              );
            });
          });
        }),
        (i.Er = function (t) {
          var i = 2 === t || 0 === t;
          this.ai.classList.toggle(
            'i-amphtml-story-player-full-bleed-story',
            i
          );
        }),
        (i.Xi = function (t) {
          var i = this;
          this.ji &&
            this.ji.behavior &&
            this.Cr() &&
            t <= 2 &&
            this.br()
              .then(function (t) {
                t && i.add(t);
              })
              .catch(function (t) {
                console.error('['.concat(Oi, ']'), t);
              });
        }),
        (i.Or = function (t) {
          return t && t.on && t.action;
        }),
        (i.Cr = function () {
          if (null !== this.Ii) return this.Ii;
          var t,
            i = this.ji.behavior;
          return (
            (this.Ii =
              this.Or(i) &&
              'end' === (t = i).on &&
              'fetch' === t.action &&
              t.endpoint),
            this.Ii
          );
        }),
        (i.dr = function () {
          (!this.Ri && this.gr(this.Si + 1)) ||
            (this.Ri && this.gr(this.Si + 1)
              ? this.go(1)
              : (this.Si++, this.Di(), this.kr()));
        }),
        (i.vr = function () {
          (!this.Ri && this.gr(this.Si - 1)) ||
            (this.Ri && this.gr(this.Si - 1)
              ? this.go(-1)
              : (this.Si--, this.Di(), this.kr()));
        }),
        (i.go = function (t) {
          var i = this,
            n =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : 0,
            r =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : {};
          if (0 !== t || 0 !== n) {
            if (!this.Ri && this.gr(this.Si + t))
              throw new Error('Out of Story range.');
            var s = this.Si + t,
              e =
                t > 0
                  ? this.ki[s % this.ki.length]
                  : this.ki[
                      ((s % this.ki.length) + this.ki.length) % this.ki.length
                    ],
              o = G();
            this.Si !== e.idx && (o = this.show(e.href, null, r)),
              o.then(function () {
                i.Mr(n);
              });
          }
        }),
        (i.Pr = function (t) {
          var i = 0 === t.distance ? 0 : t.idx > this.Si ? 1 : -1;
          requestAnimationFrame(function () {
            var n = t.iframe;
            Qt(n, ['transform', 'transition']),
              n.setAttribute('i-amphtml-iframe-position', i);
          });
        }),
        (i.hr = function (t) {
          var i = this;
          t.messagingPromise.then(function (n) {
            n.sendRequest(
              'getDocumentState',
              { state: 'DESKTOP_ASPECT_RATIO' },
              !0
            ).then(function (n) {
              (t.desktopAspectRatio = n.value), i.Tr();
            });
          });
        }),
        (i.Tr = function () {
          this.ki[this.Si].desktopAspectRatio &&
            Wt(this.ai, {
              '--i-amphtml-story-player-panel-ratio':
                this.ki[this.Si].desktopAspectRatio,
            });
        }),
        (i.Ur = function (t) {
          var i,
            n = this;
          return this.ki[this.Si].storyContentLoaded
            ? (this.Tr(), G())
            : 0 !== t.distance
            ? this.Ei.promise
            : (null === (i = this.Ei) ||
                void 0 === i,
              (this.Ei = new J()),
              t.messagingPromise.then(function (i) {
                return i.registerHandler('storyContentLoaded', function () {
                  (t.storyContentLoaded = !0), n.Ei.resolve(), n.hr(t);
                });
              }),
              G());
        }),
        (i.Di = function () {
          for (
            var t = this,
              i =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : this.Si,
              n = [],
              r = function (r) {
                var s = t.ki[(r + i) % t.ki.length],
                  e = s.distance;
                if (
                  ((s.distance = Math.abs(t.Si - s.idx)),
                  e <= 1 && s.distance > 1 && t.zr(s),
                  s.distance <= 1 && !s.iframe.isConnected && t.qr(s),
                  s.distance > 1)
                )
                  return 'continue';
                n.push(
                  t
                    .Ur(s)
                    .then(function () {
                      return t.cr(s.href);
                    })
                    .then(function (i) {
                      t._r(i, s.iframe.src) || t.Fr(s, i);
                    })
                    .then(function () {
                      return t.Ci.promise;
                    })
                    .then(function () {
                      0 === s.distance && t.Pi && t.Yi(s, Ht),
                        0 === e && 1 === s.distance && t.Yi(s, Xt);
                    })
                    .then(function () {
                      t.Pr(s),
                        0 === s.distance &&
                          s.iframe.addEventListener(
                            'animationend',
                            function () {
                              Gt(s.iframe);
                            }
                          );
                    })
                    .catch(function (t) {
                      t.includes(Mi) || console.error('['.concat(Oi, ']'), t);
                    })
                );
              },
              s = 0;
            s < this.ki.length;
            s++
          )
            r(s);
          return Promise.all(n);
        }),
        (i.qr = function (t) {
          this.ai.appendChild(t.iframe),
            this.ir(t),
            t.connectedDeferred.resolve();
        }),
        (i.zr = function (t) {
          (t.storyContentLoaded = !1),
            (t.connectedDeferred = new J()),
            t.iframe.setAttribute('src', ''),
            t.iframe.remove();
        }),
        (i.Fr = function (t, i) {
          var n = t.iframe,
            r = this.pr(i, 'prerender').href;
          n.setAttribute('src', r), t.title && n.setAttribute('title', t.title);
        }),
        (i._r = function (t, i) {
          return !(i.length <= 0) && li(mi(i)) === li(mi(t));
        }),
        (i.cr = function (t) {
          var i = this.ri.getAttribute('amp-cache');
          if (!i || !ki.includes(i)) return Promise.resolve(t);
          if (pi(t)) {
            var n = ai(t);
            return (
              n.pathname.startsWith('/c/') &&
                (n.pathname = '/v/' + n.pathname.substr(3)),
              Promise.resolve(n.toString())
            );
          }
          return (function (t, i) {
            var n =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : null,
              r = new bt(i),
              s = qt(r.pathname, n);
            return (
              (s += 'https:' === r.protocol ? '/s/' : '/'),
              i.endsWith('/') || (r.pathname = r.pathname.replace(/\/$/, '')),
              Pt(r.toString()).then(function (n) {
                var e = new bt(i);
                return (
                  (e.protocol = 'https'),
                  (n = n + '.' + t),
                  (e.host = n),
                  (e.hostname = n),
                  (e.pathname = s + r.hostname + r.pathname),
                  e.toString()
                );
              })
            );
          })(i, t, 'viewer').then(function (t) {
            return t;
          });
        }),
        (i.pr = function (t) {
          var i =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : Xt,
            n = {
              visibilityState: i,
              origin: this.t.origin,
              showStoryUrlInfo: '0',
              storyPlayer: 'v0',
              cap: 'swipe',
            };
          'auto' === this.Ti && (n.attribution = 'auto');
          var r = ci(t),
            s = k(r),
            e = B(B({}, s), n),
            o = li(t);
          if (pi(t)) {
            var a = { amp_js_v: '0.1' };
            o = ui(o, a);
          }
          var h = o + '#' + fi(e);
          return hi(this.xi, h);
        }),
        (i.Yi = function (t, i) {
          t.messagingPromise.then(function (t) {
            return t.sendRequest('visibilitychange', { state: i }, !0);
          });
        }),
        (i.Dr = function (t, i, n) {
          t.messagingPromise.then(function (t) {
            t.sendRequest('setDocumentState', { state: i, value: n });
          });
        }),
        (i.Ar = function (t, i) {
          this.Dr(t, Ri, i);
        }),
        (i.jr = function () {
          var t = this;
          this.ki[this.Si].messagingPromise.then(function (i) {
            i.sendRequest('getDocumentState', { state: ji }, !0).then(function (
              i
            ) {
              return t.Nr(i.value);
            });
          });
        }),
        (i.Sr = function (t) {
          this.ki[this.Si].messagingPromise.then(function (i) {
            return i.sendRequest('selectPage', { id: t });
          });
        }),
        (i.wr = function (t) {
          var i = t
            ? r(this.ki, function (i) {
                return i.href === t;
              })
            : this.Si;
          if (!this.ki[i])
            throw new Error('Story URL not found in the player: '.concat(t));
          return this.ki[i];
        }),
        (i.rewind = function (t) {
          var i = this.wr(t);
          this.Yr(i)
            .then(function () {
              return i.messagingPromise;
            })
            .then(function (t) {
              return t.sendRequest('rewind', {});
            });
        }),
        (i.Yr = function (t) {
          return t.iframe.isConnected ? G() : t.connectedDeferred.promise;
        }),
        (i.Mr = function (t) {
          0 !== t && this.Lr(t);
        }),
        (i.Lr = function (t) {
          this.ki[this.Si].messagingPromise.then(function (i) {
            return i.sendRequest('selectPage', { delta: t });
          });
        }),
        (i.ur = function (t, i) {
          switch (t.state) {
            case ji:
              this.Zr(t.value);
              break;
            case Ei:
              this.$r(t.value, i);
              break;
            case Ri:
              this.Hr(t.value);
              break;
            case Ii:
              this.Er(t.value);
              break;
            case 'AMP_STORY_PLAYER_EVENT':
              this.Xr(t.value);
              break;
            case 'AMP_STORY_COPY_URL':
              this.Gr(t.value, i);
          }
        }),
        (i.Xr = function (t) {
          switch (t) {
            case 'amp-story-player-skip-next':
            case 'amp-story-player-skip-to-next':
              this.dr();
              break;
            default:
              this.ri.dispatchEvent(ti(this.t, t, {}));
          }
        }),
        (i.Gr = function (t, i) {
          var n, r, s, e, o;
          (n = this.t),
            (r = t),
            (s = function () {
              i.sendRequest('copyComplete', { success: !0, url: t }, !1);
            }),
            (e = function () {
              i.sendRequest('copyComplete', { success: !1 }, !1);
            }),
            null !== (o = n.navigator) && void 0 !== o && o.clipboard
              ? n.navigator.clipboard.writeText(r).then(s, e)
              : n.document.queryCommandSupported('copy') &&
                (function (t, i) {
                  var n,
                    r,
                    s,
                    e = !1,
                    o = t.document,
                    a = o.createElement('textarea');
                  Wt(a, {
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
                    (a.value = i),
                    (a.readOnly = !0),
                    (a.contentEditable = 'true'),
                    o.body.appendChild(a),
                    null === (n = t.getSelection()) ||
                      void 0 === n ||
                      n.removeAllRanges(),
                    a.focus(),
                    a.setSelectionRange(0, i.length);
                  try {
                    e = o.execCommand('copy');
                  } catch (t) {}
                  return (
                    null === (s = (r = a).parentElement) ||
                      void 0 === s ||
                      s.removeChild(r),
                    e
                  );
                })(n, r)
              ? s()
              : e();
        }),
        (i.Hr = function (t) {
          this.ri.dispatchEvent(
            ti(this.t, 'amp-story-muted-state', { muted: t })
          );
        }),
        (i.$r = function (t, i) {
          var n = this;
          i.sendRequest(
            'getDocumentState',
            { state: 'STORY_PROGRESS' },
            !0
          ).then(function (i) {
            n.ri.dispatchEvent(
              ti(n.t, 'storyNavigation', { pageId: t, progress: i.value })
            );
          });
        }),
        (i.Zr = function (t) {
          this.Jr(!t), (this.qi = t), this.Nr(t);
        }),
        (i.Jr = function (t) {
          var i = this.ai.querySelector(
            'button.amp-story-player-exit-control-button'
          );
          i && (t ? i.classList.remove(Ai) : i.classList.add(Ai));
        }),
        (i.Nr = function (t) {
          this.ri.dispatchEvent(
            ti(this.t, t ? 'page-attachment-open' : 'page-attachment-close', {})
          );
        }),
        (i.ar = function (t) {
          this.Vr(t), t.next ? this.dr() : t.previous && this.vr();
        }),
        (i.Vr = function (t) {
          var i, n;
          this.Ri ||
            (!t.next && !t.previous) ||
            (t.next
              ? ((i = this.Si + 1 === this.ki.length), (n = 'noNextStory'))
              : ((i = 0 === this.Si), (n = 'noPreviousStory')),
            i && this.ri.dispatchEvent(ti(this.t, n, {})));
        }),
        (i.rr = function (t) {
          var i = this.Br(t);
          i &&
            ((this.vi.startX = i.screenX),
            (this.vi.startY = i.screenY),
            this.Mi && this.Mi.onTouchStart(t.timeStamp, i.clientY),
            this.ri.dispatchEvent(
              ti(this.t, 'amp-story-player-touchstart', { touches: t.touches })
            ));
        }),
        (i.sr = function (t) {
          var i = this.Br(t);
          if (i)
            if (
              (this.ri.dispatchEvent(
                ti(this.t, 'amp-story-player-touchmove', {
                  touches: t.touches,
                  isNavigationalSwipe: this.vi.isSwipeX,
                })
              ),
              !1 !== this.vi.isSwipeX)
            ) {
              var n = i.screenX,
                r = i.screenY;
              (this.vi.lastX = n),
                (null !== this.vi.isSwipeX ||
                  ((this.vi.isSwipeX =
                    Math.abs(this.vi.startX - n) >
                    Math.abs(this.vi.startY - r)),
                  this.vi.isSwipeX)) &&
                  this.Kr({ deltaX: n - this.vi.startX, last: !1 });
            } else this.Mi && this.Mi.onTouchMove(t.timeStamp, i.clientY);
        }),
        (i.er = function (t) {
          this.ri.dispatchEvent(
            ti(this.t, 'amp-story-player-touchend', {
              touches: t.touches,
              isNavigationalSwipe: this.vi.isSwipeX,
            })
          ),
            !0 === this.vi.isSwipeX
              ? this.Kr({ deltaX: this.vi.lastX - this.vi.startX, last: !0 })
              : this.Mi && this.Mi.onTouchEnd(t.timeStamp),
            (this.vi.startX = 0),
            (this.vi.startY = 0),
            (this.vi.lastX = 0),
            (this.vi.isSwipeX = null),
            (this.Ai = 0);
        }),
        (i.Kr = function (t) {
          if (!(this.ki.length <= 1 || this.qi)) {
            var i = t.deltaX;
            if (!0 === t.last) {
              var n = Math.abs(i);
              return (
                1 === this.Ai &&
                  (n > 50 && (this.Wr() || this.Ri) ? this.dr() : this.Qr()),
                void (
                  2 === this.Ai &&
                  (n > 50 && (this.Wr() || this.Ri) ? this.vr() : this.Qr())
                )
              );
            }
            this.ts(i);
          }
        }),
        (i.Qr = function () {
          var t = this.ki[this.Si].iframe;
          requestAnimationFrame(function () {
            Qt(Zt(t), ['transform', 'transition']);
          });
          var i = this.Wr();
          i &&
            requestAnimationFrame(function () {
              Qt(Zt(i.iframe), ['transform', 'transition']);
            });
        }),
        (i.Wr = function () {
          var t = 1 === this.Ai ? this.Si + 1 : this.Si - 1;
          return this.gr(t) ? null : this.ki[t];
        }),
        (i.gr = function (t) {
          return t >= this.ki.length || t < 0;
        }),
        (i.Gi = function () {
          if (this.ji) {
            var t = this.ji.behavior;
            t && 'boolean' == typeof t.autoplay && (this.Pi = t.autoplay);
          }
        }),
        (i.Ji = function () {
          if (this.ji) {
            var t = this.ji.display;
            t && 'auto' === t.attribution && (this.Ti = 'auto');
          }
        }),
        (i.Vi = function () {
          if (this.ji) {
            var t = this.ji.behavior;
            t && !1 === t.pageScroll && (this.Mi = null);
          }
        }),
        (i.Bi = function () {
          if (null !== this.Ri) return this.Ri;
          if (!this.ji) return (this.Ri = !1), !1;
          var t,
            i = this.ji.behavior;
          return (
            (this.Ri =
              this.Or(i) &&
              'end' === (t = i).on &&
              'circular-wrapping' === t.action),
            this.Ri
          );
        }),
        (i.ts = function (t) {
          var i;
          t < 0
            ? ((this.Ai = 1),
              (i = 'translate3d(calc(100% + '.concat(t, 'px), 0, 0)')))
            : ((this.Ai = 2),
              (i = 'translate3d(calc('.concat(t, 'px - 100%), 0, 0)')));
          var n = this.ki[this.Si].iframe,
            r = 'translate3d('.concat(t, 'px, 0, 0)');
          requestAnimationFrame(function () {
            Wt(Zt(n), { transform: r, transition: 'none' });
          });
          var s = this.Wr();
          s &&
            requestAnimationFrame(function () {
              Wt(Zt(s.iframe), { transform: i, transition: 'none' });
            });
        }),
        (i.Br = function (t) {
          var i = t.touches;
          if (!i || i.length < 1) return null;
          var n = i[0],
            r = n.clientX,
            s = n.clientY;
          return {
            screenX: n.screenX,
            screenY: n.screenY,
            clientX: r,
            clientY: s,
          };
        }),
        t
      );
    })(),
    Ti = (function () {
      function t(t) {
        this.t = t;
      }
      var i = t.prototype;
      return (
        (i.ns = function (t) {
          var i = this;
          new si(this.t, t, function () {
            return t.layoutPlayer();
          }),
            this.t.addEventListener('scroll', function n() {
              t.layoutPlayer(), i.t.removeEventListener('scroll', n);
            });
        }),
        (i.loadPlayers = function () {
          var t = this.t.document.getElementsByTagName('amp-story-player');
          Y();
          for (var i = 0; i < t.length; i++) {
            var n = t[i],
              r = new Pi(this.t, n);
            r.buildPlayer(), this.ns(r);
          }
        }),
        (i.loadEntryPoints = function () {
          var t = this.t.document.getElementsByTagName('amp-story-entry-point');
          Y();
          for (var i = 0; i < t.length; i++) {
            var n = t[i],
              r = new X(this.t, n);
            r.buildCallback(), this.ns(r);
          }
        }),
        t
      );
    })();
  (vi = self.document),
    (di = function (t) {
      return 'loading' != t.readyState && 'uninitialized' != t.readyState;
    }),
    (yi = function () {
      new Ti(self).loadPlayers();
    }),
    (gi = di(vi))
      ? yi()
      : vi.addEventListener('readystatechange', function t() {
          di(vi) &&
            (gi || ((gi = !0), yi()),
            vi.removeEventListener('readystatechange', t));
        }),
    (globalThis.AmpStoryPlayer = Pi);
})();
/*! https://mths.be/cssescape v1.5.1 by @mathias | MIT license */
//# sourceMappingURL=amp-story-player-v0.js.map
