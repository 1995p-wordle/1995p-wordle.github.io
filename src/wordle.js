this.wordle = this.wordle || {}, this.wordle.bundle = function(e) {
    "use strict";
    function a(e) {
        return (a = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        })(e)
    }
    function s(e, a) {
        if (!(e instanceof a))
            throw new TypeError("Cannot call a class as a function")
    }
    function t(e, a) {
        for (var s = 0; s < a.length; s++) {
            var t = a[s];
            t.enumerable = t.enumerable || !1, t.configurable = !0, "value" in t && (t.writable = !0), Object.defineProperty(e, t.key, t)
        }
    }
    function o(e, a, s) {
        return a && t(e.prototype, a), s && t(e, s), e
    }
    function n(e, a, s) {
        return a in e ? Object.defineProperty(e, a, {
                value: s,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[a] = s, e
    }
    function r(e, a) {
        if ("function" != typeof a && null !== a)
            throw new TypeError("Super expression must either be null or a function");
        e.prototype = Object.create(a && a.prototype, {
            constructor: {
                value: e,
                writable: !0,
                configurable: !0
            }
        }), a && l(e, a)
    }
    function i(e) {
        return (i = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
            return e.__proto__ || Object.getPrototypeOf(e)
        })(e)
    }
    function l(e, a) {
        return (l = Object.setPrototypeOf || function(e, a) {
            return e.__proto__ = a, e
        })(e, a)
    }
    function d() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
            return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], (function() {}))), !0
        } catch ( e ) {
            return !1
        }
    }
    function u(e, a, s) {
        return (u = d() ? Reflect.construct : function(e, a, s) {
            var t = [null];
            t.push.apply(t, a);
            var o = new (Function.bind.apply(e, t));
            return s && l(o, s.prototype), o
        }).apply(null, arguments)
    }
    function c(e) {
        var a = "function" == typeof Map ? new Map : void 0;
        return (c = function(e) {
            if (null === e || (s = e, -1 === Function.toString.call(s).indexOf("[native code]"))) return e;
            var s;
            if ("function" != typeof e)
                throw new TypeError("Super expression must either be null or a function");
            if (void 0 !== a) {
                if (a.has(e)) return a.get(e);
                a.set(e, t)
            }
            function t() {
                return u(e, arguments, i(this).constructor)
            }
            return t.prototype = Object.create(e.prototype, {
                    constructor: {
                        value: t,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), l(t, e)
        })(e)
    }
    function p(e) {
        if (void 0 === e)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return e
    }
    function m(e, a) {
        return !a || "object" != typeof a && "function" != typeof a ? p(e) : a
    }
    function h(e) {
        var a = d();
        return function() {
            var s,
                t = i(e);
            if (a) {
                var o = i(this).constructor;
                s = Reflect.construct(t, arguments, o)
            } else
                s = t.apply(this, arguments);
            return m(this, s)
        }
    }
    function y(e, a) {
        return function(e) {
                if (Array.isArray(e)) return e
            }(e) || function(e, a) {
                var s = null == e ? null : "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
                if (null == s) return;
                var t,
                    o,
                    n = [],
                    r = !0,
                    i = !1;
                try {
                    for (s = s.call(e); !(r = (t = s.next()).done) && (n.push(t.value), !a || n.length !== a); r = !0) ;
                } catch ( e ) {
                    i = !0, o = e
                } finally {
                    try {
                        r || null == s.return || s.return()
                    } finally {
                        if (i)
                            throw o
                    }
                }
                return n
            }(e, a) || b(e, a) || function() {
                throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
    }
    function g(e) {
        return function(e) {
                if (Array.isArray(e)) return f(e)
            }(e) || function(e) {
                if ("undefined" != typeof Symbol && null != e[Symbol.iterator] || null != e["@@iterator"]) return Array.from(e)
            }(e) || b(e) || function() {
                throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
            }()
    }
    function b(e, a) {
        if (e) {
            if ("string" == typeof e) return f(e, a);
            var s = Object.prototype.toString.call(e).slice(8, -1);
            return "Object" === s && e.constructor && (s = e.constructor.name), "Map" === s || "Set" === s ? Array.from(e) : "Arguments" === s || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s) ? f(e, a) : void 0
        }
    }
    function f(e, a) {
        (null == a || a > e.length) && (a = e.length);
        for (var s = 0, t = new Array(a); s < a; s++) t[s] = e[s];
        return t
    }
    var k = document.createElement("template");
    k.innerHTML = `
<style>
  :host {
    display: inline-block;
  }

  .tile {
    width: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    line-height: 2rem;
    font-weight: bold;
    vertical-align: middle;
    box-sizing: border-box;
    color: var(--tile-text-color);
    text-transform: uppercase;
    user-select: none;
  }

  .tile::before {
    content: '';
    display: inline-block;
    padding-bottom: 100%;
  }

  @media (max-height: 600px) {
    .tile {
      font-size: 1em;
      line-height: 1em;
    }
  }

  @media (max-width: 330px) {
    .tile {
      font-size: 1.7rem;
      line-height: 1.7rem;
    }
  }

  .tile[data-state='empty'] {
    border: 2px solid var(--color-tone-4);
  }

  .tile[data-state='tbd'] {
    background-color: var(--color-tone-7);
    border: 2px solid var(--color-tone-3);
    color: var(--color-tone-1);
  }

  .tile[data-state='correct'] {
    background-color: var(--color-correct);
  }

  .tile[data-state='present'] {
    background-color: var(--color-present);
  }

  .tile[data-state='absent'] {
    background-color: var(--color-absent);
  }

  .tile[data-animation='pop'] {
    animation-name: PopIn;
    animation-duration: 100ms;
  }

  @keyframes PopIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    40% {
      transform: scale(1.1);
      opacity: 1;
    }
  }

  .tile[data-animation='flip-in'] {
    animation-name: FlipIn;
    animation-duration: 250ms;
    animation-timing-function: ease-in;
  }

  @keyframes FlipIn {
    0% {
      transform: rotateX(0);
    }
    100% {
      transform: rotateX(-90deg);
    }
  }

  .tile[data-animation='flip-out'] {
    animation-name: FlipOut;
    animation-duration: 250ms;
    animation-timing-function: ease-in;
  }

  @keyframes FlipOut {
    0% {
      transform: rotateX(-90deg);
    }
    100% {
      transform: rotateX(0);
    }
  }
</style>
<div class="tile" data-state="empty" data-animation="idle"></div>
`;
    var v = function(e) {
        r(t, e);
        var a = h(t);
        function t() {
            var e;
            return s(this, t), n(p(e = a.call(this)), "_letter", ""), n(p(e), "_state", "empty"), n(p(e), "_animation", "idle"), n(p(e), "_last", !1), n(p(e), "_reveal", !1), e.attachShadow({
                    mode: "open"
                }), e
        }
        return o(t, [{
                key: "last",
                set: function(e) {
                    this._last = e
                }
            }, {
                key: "connectedCallback",
                value: function() {
                    var e = this;
                    this.shadowRoot.appendChild(k.content.cloneNode(!0)), this.$tile = this.shadowRoot.querySelector(".tile"), this.$tile.addEventListener("animationend", (function(a) {
                        "PopIn" === a.animationName && (e._animation = "idle"), "FlipIn" === a.animationName && (e.$tile.dataset.state = e._state, e._animation = "flip-out"), "FlipOut" === a.animationName && (e._animation = "idle", e._last && e.dispatchEvent(new CustomEvent("game-last-tile-revealed-in-row", {
                            bubbles: !0,
                            composed: !0
                        }))), e._render()
                    })), this._render()
                }
            }, {
                key: "attributeChangedCallback",
                value: function(e, a, s) {
                    switch (e) {
                    case "letter":
                        if (s === a) break;
                        var t = "null" === s ? "" : s;
                        this._letter = t, this._state = t ? "tbd" : "empty", this._animation = t ? "pop" : "idle";
                        break;case "evaluation":
                        if (!s) break;
                        this._state = s;
                        break;case "reveal":
                        this._animation = "flip-in", this._reveal = !0
                    }
                    this._render()
                }
            }, {
                key: "_render",
                value: function() {
                    this.$tile && (this.$tile.textContent = this._letter, ["empty", "tbd"].includes(this._state) && (this.$tile.dataset.state = this._state), (["empty", "tbd"].includes(this._state) || this._reveal) && this.$tile.dataset.animation != this._animation && (this.$tile.dataset.animation = this._animation))
                }
            }], [{
                key: "observedAttributes",
                get: function() {
                    return ["letter", "evaluation", "reveal"]
                }
            }]), t
    }(c(HTMLElement));
    customElements.define("game-tile", v);
    var gameRow = document.createElement("template");
    gameRow.innerHTML = `
  <style>
    :host {
      display: block;
    }

    :host([invalid]) {
      animation-name: Shake;
      animation-duration: 600ms;
    }

    .row {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: 5px;
    }

    .win {
      animation-name: Bounce;
      animation-duration: 1000ms;
    }

    @keyframes Bounce {
      0%, 20% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-30px);
      }
      50% {
        transform: translateY(5px);
      }
      60% {
        transform: translateY(-15px);
      }
      80% {
        transform: translateY(2px);
      }
      100% {
        transform: translateY(0);
      }
    }

    @keyframes Shake {
      10%, 90% {
        transform: translateX(-1px);
      }
      20%, 80% {
        transform: translateX(2px);
      }
      30%, 50%, 70% {
        transform: translateX(-4px);
      }
      40%, 60% {
        transform: translateX(4px);
      }
    }
  </style>
  <div class="row"></div>
`;
    var x = function(e) {
        r(t, e);
        var a = h(t);
        function t() {
            var e;
            return s(this, t), (e = a.call(this)).attachShadow({
                    mode: "open"
                }), e._letters = "", e._evaluation = [], e._length, e
        }
        return o(t, [{
                key: "evaluation",
                get: function() {
                    return this._evaluation
                },
                set: function(e) {
                    var a = this;
                    this._evaluation = e, this.$tiles && this.$tiles.forEach((function(e, s) {
                        e.setAttribute("evaluation", a._evaluation[s]), setTimeout((function() {
                            e.setAttribute("reveal", "")
                        }), 300 * s)
                    }))
                }
            }, {
                key: "connectedCallback",
                value: function() {
                    var e = this;
                    this.shadowRoot.appendChild(gameRow.content.cloneNode(!0)), this.$row = this.shadowRoot.querySelector(".row");
                    for (var a = function(a) {
                                var s = document.createElement("game-tile"),
                                    t = e._letters[a];
                                (t && s.setAttribute("letter", t), e._evaluation[a]) && (s.setAttribute("evaluation", e._evaluation[a]), setTimeout((function() {
                                    s.setAttribute("reveal", "")
                                }), 100 * a));a === e._length - 1 && (s.last = !0), e.$row.appendChild(s)
                            }, s = 0;s < this._length; s++) a(s);
                    this.$tiles = this.shadowRoot.querySelectorAll("game-tile"), this.addEventListener("animationend", (function(a) {
                        "Shake" === a.animationName && e.removeAttribute("invalid")
                    }))
                }
            }, {
                key: "attributeChangedCallback",
                value: function(e, a, s) {
                    switch (e) {
                    case "letters":
                        this._letters = s || "";
                        break;case "length":
                        this._length = parseInt(s, 10);
                        break;case "win":
                        if (null === s) {
                            this.$tiles.forEach((function(e) {
                                e.classList.remove("win")
                            }));
                            break
                        }
                        this.$tiles.forEach((function(e, a) {
                            e.classList.add("win"), e.style.animationDelay = "".concat(100 * a, "ms")
                        }))
                    }
                    this._render()
                }
            }, {
                key: "_render",
                value: function() {
                    var e = this;
                    this.$row && this.$tiles.forEach((function(a, s) {
                        var t = e._letters[s];
                        t ? a.setAttribute("letter", t) : a.removeAttribute("letter")
                    }))
                }
            }], [{
                key: "observedAttributes",
                get: function() {
                    return ["letters", "length", "invalid", "win"]
                }
            }]), t
    }(c(HTMLElement));
    customElements.define("game-row", x);
    var z = document.createElement("template");
    z.innerHTML = `<slot></slot>`;
    var j = "darkTheme",
        S = "colorBlindTheme",
        _ = function(e) {
            r(t, e);
            var a = h(t);
            function t() {
                var e;
                s(this, t), n(p(e = a.call(this)), "isDarkTheme", !1), n(p(e), "isColorBlindTheme", !1), e.attachShadow({
                    mode: "open"
                });var o = JSON.parse(window.localStorage.getItem(j)),
                    r = window.matchMedia("(prefers-color-scheme: dark)").matches,
                    i = JSON.parse(window.localStorage.getItem(S));
                return !0 === o || !1 === o ? e.setDarkTheme(o) : r && e.setDarkTheme(!0), !0 !== i && !1 !== i || e.setColorBlindTheme(i), e
            }
            return o(t, [{
                    key: "setDarkTheme",
                    value: function(e) {
                        var a = document.querySelector("body");
                        e && !a.classList.contains("nightmode") ? a.classList.add("nightmode") : a.classList.remove("nightmode"), this.isDarkTheme = e, window.localStorage.setItem(j, JSON.stringify(e))
                    }
                }, {
                    key: "setColorBlindTheme",
                    value: function(e) {
                        var a = document.querySelector("body");
                        e && !a.classList.contains("colorblind") ? a.classList.add("colorblind") : a.classList.remove("colorblind"), this.isColorBlindTheme = e, window.localStorage.setItem(S, JSON.stringify(e))
                    }
                }, {
                    key: "connectedCallback",
                    value: function() {
                        var e = this;
                        this.shadowRoot.appendChild(z.content.cloneNode(!0)), this.shadowRoot.addEventListener("game-setting-change", (function(a) {
                            var s = a.detail,
                                t = s.name,
                                o = s.checked;
                            switch (t) {
                            case "dark-theme":
                                return void e.setDarkTheme(o);case "color-blind-theme":
                                return void e.setColorBlindTheme(o)
                            }
                        }))
                    }
                }]), t
        }(c(HTMLElement));
    function q(e, a) {
        return e === a || e != e && a != a
    }
    function E(e, a) {
        for (var s = e.length; s--;)
            if (q(e[s][0], a)) return s;
        return -1
    }
    customElements.define("game-theme-manager", _);
    var A = Array.prototype.splice;
    function C(e) {
        var a = -1,
            s = null == e ? 0 : e.length;
        for (this.clear(); ++a < s;) {
            var t = e[a];
            this.set(t[0], t[1])
        }
    }
    C.prototype.clear = function() {
        this.__data__ = [], this.size = 0
    }, C.prototype.delete = function(e) {
        var a = this.__data__,
            s = E(a, e);
        return !(s < 0) && (s == a.length - 1 ? a.pop() : A.call(a, s, 1), --this.size, !0)
    }, C.prototype.get = function(e) {
        var a = this.__data__,
            s = E(a, e);
        return s < 0 ? void 0 : a[s][1]
    }, C.prototype.has = function(e) {
        return E(this.__data__, e) > -1
    }, C.prototype.set = function(e, a) {
        var s = this.__data__,
            t = E(s, e);
        return t < 0 ? (++this.size, s.push([e, a])) : s[t][1] = a, this
    };
    var L = "object" == ("undefined" == typeof global ? "undefined" : a(global)) && global && global.Object === Object && global,
        T = "object" == ("undefined" == typeof self ? "undefined" : a(self)) && self && self.Object === Object && self,
        I = L || T || Function("return this")(),
        M = I.Symbol,
        O = Object.prototype,
        R = O.hasOwnProperty,
        P = O.toString,
        $ = M ? M.toStringTag : void 0;
    var H = Object.prototype.toString;
    var N = M ? M.toStringTag : void 0;
    function D(e) {
        return null == e ? void 0 === e ? "[object Undefined]" : "[object Null]" : N && N in Object(e) ? function(e) {
            var a = R.call(e, $),
                s = e[$];
            try {
                e[$] = void 0;var t = !0
            } catch ( e ) {}
            var o = P.call(e);
            return t && (a ? e[$] = s :
                    delete e[$]
                ), o
        }(e) : function(e) {
            return H.call(e)
        }(e)
    }
    function G(e) {
        var s = a(e);
        return null != e && ("object" == s || "function" == s)
    }
    function B(e) {
        if (!G(e)) return !1;
        var a = D(e);
        return "[object Function]" == a || "[object GeneratorFunction]" == a || "[object AsyncFunction]" == a || "[object Proxy]" == a
    }
    var F,
        W = I["__core-js_shared__"],
        Y = (F = /[^.]+$/.exec(W && W.keys && W.keys.IE_PROTO || "")) ? "Symbol(src)_1." + F : "";
    var J = Function.prototype.toString;
    var U = /^\[object .+?Constructor\]$/,
        X = Function.prototype,
        V = Object.prototype,
        K = X.toString,
        Q = V.hasOwnProperty,
        Z = RegExp("^" + K.call(Q).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
    function ee(e) {
        return !(!G(e) || (a = e, Y && Y in a)) && (B(e) ? Z : U).test(function(e) {
                if (null != e) {
                    try {
                        return J.call(e)
                    } catch ( e ) {} try {
                        return e + ""
                    } catch ( e ) {}
                }
                return ""
            }(e));var a
    }
    function ae(e, a) {
        var s = function(e, a) {
            return null == e ? void 0 : e[a]
        }(e, a);
        return ee(s) ? s : void 0
    }
    var se = ae(I, "Map"),
        te = ae(Object, "create");
    var oe = Object.prototype.hasOwnProperty;
    var ne = Object.prototype.hasOwnProperty;
    function re(e) {
        var a = -1,
            s = null == e ? 0 : e.length;
        for (this.clear(); ++a < s;) {
            var t = e[a];
            this.set(t[0], t[1])
        }
    }
    function ie(e, s) {
        var t,
            o,
            n = e.__data__;
        return ("string" == (o = a(t = s)) || "number" == o || "symbol" == o || "boolean" == o ? "__proto__" !== t : null === t) ? n["string" == typeof s ? "string" : "hash"] : n.map
    }
    function le(e) {
        var a = -1,
            s = null == e ? 0 : e.length;
        for (this.clear(); ++a < s;) {
            var t = e[a];
            this.set(t[0], t[1])
        }
    }
    re.prototype.clear = function() {
        this.__data__ = te ? te(null) : {}, this.size = 0
    }, re.prototype.delete = function(e) {
        var a = this.has(e) &&
            delete this.__data__[e];
        return this.size -= a ? 1 : 0, a
    }, re.prototype.get = function(e) {
        var a = this.__data__;
        if (te) {
            var s = a[e];
            return "__lodash_hash_undefined__" === s ? void 0 : s
        }
        return oe.call(a, e) ? a[e] : void 0
    }, re.prototype.has = function(e) {
        var a = this.__data__;
        return te ? void 0 !== a[e] : ne.call(a, e)
    }, re.prototype.set = function(e, a) {
        var s = this.__data__;
        return this.size += this.has(e) ? 0 : 1, s[e] = te && void 0 === a ? "__lodash_hash_undefined__" : a, this
    }, le.prototype.clear = function() {
        this.size = 0, this.__data__ = {
            hash: new re,
            map: new (se || C),
            string: new re
        }
    }, le.prototype.delete = function(e) {
        var a = ie(this, e).delete(e);
        return this.size -= a ? 1 : 0, a
    }, le.prototype.get = function(e) {
        return ie(this, e).get(e)
    }, le.prototype.has = function(e) {
        return ie(this, e).has(e)
    }, le.prototype.set = function(e, a) {
        var s = ie(this, e),
            t = s.size;
        return s.set(e, a), this.size += s.size == t ? 0 : 1, this
    };
    function de(e) {
        var a = this.__data__ = new C(e);
        this.size = a.size
    }
    de.prototype.clear = function() {
        this.__data__ = new C, this.size = 0
    }, de.prototype.delete = function(e) {
        var a = this.__data__,
            s = a.delete(e);
        return this.size = a.size, s
    }, de.prototype.get = function(e) {
        return this.__data__.get(e)
    }, de.prototype.has = function(e) {
        return this.__data__.has(e)
    }, de.prototype.set = function(e, a) {
        var s = this.__data__;
        if (s instanceof C) {
            var t = s.__data__;
            if (!se || t.length < 199) return t.push([e, a]), this.size = ++s.size, this;
            s = this.__data__ = new le(t)
        }
        return s.set(e, a), this.size = s.size, this
    };
    var ue = function() {
        try {
            var e = ae(Object, "defineProperty");
            return e({}, "", {}), e
        } catch ( e ) {}
    }();
    function ce(e, a, s) {
        "__proto__" == a && ue ? ue(e, a, {
            configurable: !0,
            enumerable: !0,
            value: s,
            writable: !0
        }) : e[a] = s
    }
    function pe(e, a, s) {
        (void 0 !== s && !q(e[a], s) || void 0 === s && !(a in e)) && ce(e, a, s)
    }
    var me,
        he = function(e, a, s) {
            for (var t = -1, o = Object(e), n = s(e), r = n.length; r--;) {
                var i = n[me ? r : ++t];
                if (!1 === a(o[i], i, o)) break
            }
            return e
        },
        ye = "object" == (void 0 === e ? "undefined" : a(e)) && e && !e.nodeType && e,
        ge = ye && "object" == ("undefined" == typeof module ? "undefined" : a(module)) && module && !module.nodeType && module,
        be = ge && ge.exports === ye ? I.Buffer : void 0,
        fe = be ? be.allocUnsafe : void 0;
    var ke = I.Uint8Array;
    function ve(e, a) {
        var s,
            t,
            o = a ? (s = e.buffer, t = new s.constructor(s.byteLength), new ke(t).set(new ke(s)), t) : e.buffer;
        return new e.constructor(o, e.byteOffset, e.length)
    }
    var we = Object.create,
        xe = function() {
            function e() {
            }
            return function(a) {
                if (!G(a)) return {};
                if (we) return we(a);
                e.prototype = a;
                var s = new e;
                return e.prototype = void 0, s
            }
        }();
    var ze,
        je,
        Se = (ze = Object.getPrototypeOf, je = Object, function(e) {
            return ze(je(e))
        }),
        _e = Object.prototype;
    function qe(e) {
        var a = e && e.constructor;
        return e === ("function" == typeof a && a.prototype || _e)
    }
    function Ee(e) {
        return null != e && "object" == a(e)
    }
    function Ae(e) {
        return Ee(e) && "[object Arguments]" == D(e)
    }
    var Ce = Object.prototype,
        Le = Ce.hasOwnProperty,
        Te = Ce.propertyIsEnumerable,
        Ie = Ae(function() {
            return arguments
        }()) ? Ae : function(e) {
            return Ee(e) && Le.call(e, "callee") && !Te.call(e, "callee")
        },
        Me = Array.isArray;
    function Oe(e) {
        return "number" == typeof e && e > -1 && e % 1 == 0 && e <= 9007199254740991
    }
    function Re(e) {
        return null != e && Oe(e.length) && !B(e)
    }
    var Pe = "object" == (void 0 === e ? "undefined" : a(e)) && e && !e.nodeType && e,
        $e = Pe && "object" == ("undefined" == typeof module ? "undefined" : a(module)) && module && !module.nodeType && module,
        He = $e && $e.exports === Pe ? I.Buffer : void 0,
        Ne = (He ? He.isBuffer : void 0) || function() {
            return !1
        },
        De = Function.prototype,
        Ge = Object.prototype,
        Be = De.toString,
        Fe = Ge.hasOwnProperty,
        We = Be.call(Object);
    var Ye = {};
    Ye["[object Float32Array]"] = Ye["[object Float64Array]"] = Ye["[object Int8Array]"] = Ye["[object Int16Array]"] = Ye["[object Int32Array]"] = Ye["[object Uint8Array]"] = Ye["[object Uint8ClampedArray]"] = Ye["[object Uint16Array]"] = Ye["[object Uint32Array]"] = !0, Ye["[object Arguments]"] = Ye["[object Array]"] = Ye["[object ArrayBuffer]"] = Ye["[object Boolean]"] = Ye["[object DataView]"] = Ye["[object Date]"] = Ye["[object Error]"] = Ye["[object Function]"] = Ye["[object Map]"] = Ye["[object Number]"] = Ye["[object Object]"] = Ye["[object RegExp]"] = Ye["[object Set]"] = Ye["[object String]"] = Ye["[object WeakMap]"] = !1;
    var Je = "object" == (void 0 === e ? "undefined" : a(e)) && e && !e.nodeType && e,
        Ue = Je && "object" == ("undefined" == typeof module ? "undefined" : a(module)) && module && !module.nodeType && module,
        Xe = Ue && Ue.exports === Je && L.process,
        Ve = function() {
            try {
                var e = Ue && Ue.require && Ue.require("util").types;
                return e || Xe && Xe.binding && Xe.binding("util")
            } catch ( e ) {}
        }(),
        Ke = Ve && Ve.isTypedArray,
        Qe = Ke ? function(e) {
            return function(a) {
                return e(a)
            }
        }(Ke) : function(e) {
            return Ee(e) && Oe(e.length) && !!Ye[D(e)]
        };
    function Ze(e, a) {
        if (("constructor" !== a || "function" != typeof e[a]) && "__proto__" != a) return e[a]
    }
    var ea = Object.prototype.hasOwnProperty;
    function aa(e, a, s) {
        var t = e[a];
        ea.call(e, a) && q(t, s) && (void 0 !== s || a in e) || ce(e, a, s)
    }
    var sa = /^(?:0|[1-9]\d*)$/;
    function ta(e, s) {
        var t = a(e);
        return !!(s = null == s ? 9007199254740991 : s) && ("number" == t || "symbol" != t && sa.test(e)) && e > -1 && e % 1 == 0 && e < s
    }
    var oa = Object.prototype.hasOwnProperty;
    function na(e, a) {
        var s = Me(e),
            t = !s && Ie(e),
            o = !s && !t && Ne(e),
            n = !s && !t && !o && Qe(e),
            r = s || t || o || n,
            i = r ? function(e, a) {
                for (var s = -1, t = Array(e); ++s < e;) t[s] = a(s);
                return t
            }(e.length, String) : [],
            l = i.length;
        for (var d in e) !a && !oa.call(e, d) || r && ("length" == d || o && ("offset" == d || "parent" == d) || n && ("buffer" == d || "byteLength" == d || "byteOffset" == d) || ta(d, l)) || i.push(d);
        return i
    }
    var ra = Object.prototype.hasOwnProperty;
    function ia(e) {
        if (!G(e)) return function(e) {
                var a = [];
                if (null != e)
                    for (var s in Object(e)) a.push(s);
                return a
            }(e);
        var a = qe(e),
            s = [];
        for (var t in e) ("constructor" != t || !a && ra.call(e, t)) && s.push(t);
        return s
    }
    function la(e) {
        return Re(e) ? na(e, !0) : ia(e)
    }
    function da(e) {
        return function(e, a, s, t) {
            var o = !s;
            s || (s = {});
            for (var n = -1, r = a.length; ++n < r;) {
                var i = a[n],
                    l = t ? t(s[i], e[i], i, s, e) : void 0;
                void 0 === l && (l = e[i]), o ? ce(s, i, l) : aa(s, i, l)
            }
            return s
        }(e, la(e))
    }
    function ua(e, a, s, t, o, n, r) {
        var i = Ze(e, s),
            l = Ze(a, s),
            d = r.get(l);
        if (d) pe(e, s, d);
        else {
            var u,
                c = n ? n(i, l, s + "", e, a, r) : void 0,
                p = void 0 === c;
            if (p) {
                var m = Me(l),
                    h = !m && Ne(l),
                    y = !m && !h && Qe(l);
                c = l, m || h || y ? Me(i) ? c = i : Ee(u = i) && Re(u) ? c = function(e, a) {
                    var s = -1,
                        t = e.length;
                    for (a || (a = Array(t)); ++s < t;) a[s] = e[s];
                    return a
                }(i) : h ? (p = !1, c = function(e, a) {
                    if (a) return e.slice();
                    var s = e.length,
                        t = fe ? fe(s) : new e.constructor(s);
                    return e.copy(t), t
                }(l, !0)) : y ? (p = !1, c = ve(l, !0)) : c = [] : function(e) {
                    if (!Ee(e) || "[object Object]" != D(e)) return !1;
                    var a = Se(e);
                    if (null === a) return !0;
                    var s = Fe.call(a, "constructor") && a.constructor;
                    return "function" == typeof s && s instanceof s && Be.call(s) == We
                }(l) || Ie(l) ? (c = i, Ie(i) ? c = da(i) : G(i) && !B(i) || (c = function(e) {
                    return "function" != typeof e.constructor || qe(e) ? {} : xe(Se(e))
                }(l))) : p = !1
            }
            p && (r.set(l, c), o(c, l, t, n, r), r.delete(l)), pe(e, s, c)
        }
    }
    function ca(e, a, s, t, o) {
        e !== a && he(a, (function(n, r) {
            if (o || (o = new de), G(n)) ua(e, a, r, s, ca, t, o);
            else {
                var i = t ? t(Ze(e, r), n, r + "", e, a, o) : void 0;
                void 0 === i && (i = n), pe(e, r, i)
            }
        }), la)
    }
    function pa(e) {
        return e
    }
    function ma(e, a, s) {
        switch (s.length) {
        case 0:
            return e.call(a);case 1:
            return e.call(a, s[0]);case 2:
            return e.call(a, s[0], s[1]);case 3:
            return e.call(a, s[0], s[1], s[2])
        }
        return e.apply(a, s)
    }
    var ha = Math.max;
    var ya = ue ? function(e, a) {
            return ue(e, "toString", {
                configurable: !0,
                enumerable: !1,
                value: (s = a, function() {
                    return s
                }),
                writable: !0
            });
            var s
        } : pa,
        ga = Date.now;
    var ba = function(e) {
        var a = 0,
            s = 0;
        return function() {
            var t = ga(),
                o = 16 - (t - s);
            if (s = t, o > 0) {
                if (++a >= 800) return arguments[0]
            } else
                a = 0;
            return e.apply(void 0, arguments)
        }
    }(ya);
    function fa(e, a) {
        return ba(function(e, a, s) {
            return a = ha(void 0 === a ? e.length - 1 : a, 0), function() {
                    for (var t = arguments, o = -1, n = ha(t.length - a, 0), r = Array(n); ++o < n;) r[o] = t[a + o];
                    o = -1;
                    for (var i = Array(a + 1); ++o < a;) i[o] = t[o];
                    return i[a] = s(r), ma(e, this, i)
            }
        }(e, a, pa), e + "")
    }
    var ka,
        va = (ka = function(e, a, s) {
            ca(e, a, s)
        }, fa((function(e, s) {
            var t = -1,
                o = s.length,
                n = o > 1 ? s[o - 1] : void 0,
                r = o > 2 ? s[2] : void 0;
            for (n = ka.length > 3 && "function" == typeof n ? (o--, n) : void 0, r && function(e, s, t) {
                    if (!G(t)) return !1;
                    var o = a(s);
                    return !!("number" == o ? Re(t) && ta(s, t.length) : "string" == o && s in t) && q(t[s], e)
                }(s[0], s[1], r) && (n = o < 3 ? void 0 : n, o = 1), e = Object(e);++t < o;) {
                var i = s[t];
                i && ka(e, i, t, n)
            }
            return e
        }))),
        wa = "gameState",
        xa = {
            boardState: null,
            evaluations: null,
            rowIndex: null,
            solution: null,
            gameStatus: null,
            lastPlayedTs: null,
            lastCompletedTs: null,
            restoringFromLocalStorage: null,
            hardMode: !1
        };
    function za() {
        var e = window.localStorage.getItem(wa) || JSON.stringify(xa);
        return JSON.parse(e)
    }
    function ja(e) {
        var a = za();
        !function(e) {
            window.localStorage.setItem(wa, JSON.stringify(e))
        }(va(a, e))
    }
    var Sa = document.createElement("template");
    Sa.innerHTML = `
  <style>
  .setting {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-tone-4);
    padding: 16px 0;
  }

  a, a:visited {
    color: var(--color-tone-2);
  }

  .title {
    font-size: 18px;
  }

  .text {
    padding-right: 8px;
  }

  .description {
    font-size: 12px;
    color: var(--color-tone-2);
  }

  #footnote {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    color: var(--color-tone-2);
    font-size: 12px;
    text-align: right;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  #privacy-policy,
  #copyright {
    text-align: left;
  }

  @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
    .setting {
      padding: 16px;
    }
  }
  </style>

  <div class="sections">
    <section>
      <div class="setting">
        <div class="text">
          <div class="title">Hard Mode</div>
          <div class="description">Any revealed hints must be used in subsequent guesses</div>
        </div>
        <div class="control">
          <game-switch id="hard-mode" name="hard-mode"></game-switch>
        </div>
      </div>
      <div class="setting">
        <div class="text">
          <div class="title">Dark Theme</div>
        </div>
        <div class="control">
          <game-switch id="dark-theme" name="dark-theme"></game-switch>
        </div>
      </div>
      <div class="setting">
        <div class="text">
          <div class="title">Color Blind Mode</div>
          <div class="description">High contrast colors</div>
        </div>
        <div class="control">
          <game-switch id="color-blind-theme" name="color-blind-theme"></game-switch>
        </div>
      </div>
    </section>
  </div>

  <div id="footnote">
    <div>
      <div id="privacy-policy"><a href="https://www.powerlanguage.co.uk/privacy-policy.html" target="_blank">Privacy Policy</a></div>
      <div id="copyright">Copyright 2021-2022. All Rights Reserved.</div>
    </div>
    <div>
      <div id="puzzle-number"></div>
      <div id="hash"></div>
    </div>
  </div>
`;
    var _a = function(e) {
        r(t, e);
        var a = h(t);
        function t() {
            var e;
            return s(this, t), n(p(e = a.call(this)), "gameApp", void 0), e.attachShadow({
                    mode: "open"
                }), e
        }
        return o(t, [{
                key: "connectedCallback",
                value: function() {
                    var e,
                        a = this;
                    this.shadowRoot.appendChild(Sa.content.cloneNode(!0)), this.shadowRoot.querySelector("#hash").textContent = null === (e = window.wordle) || void 0 === e ? void 0 : e.hash, this.shadowRoot.querySelector("#puzzle-number").textContent = "#".concat(this.gameApp.dayOffset), this.shadowRoot.addEventListener("game-switch-change", (function(e) {
                        e.stopPropagation();
                        var s = e.detail,
                            t = s.name,
                            o = s.checked,
                            n = s.disabled;
                        a.dispatchEvent(new CustomEvent("game-setting-change", {
                            bubbles: !0,
                            composed: !0,
                            detail: {
                                name: t,
                                checked: o,
                                disabled: n
                            }
                        })), a.render()
                    })), this.render()
                }
            }, {
                key: "render",
                value: function() {
                    var e = document.querySelector("body");
                    e.classList.contains("nightmode") && this.shadowRoot.querySelector("#dark-theme").setAttribute("checked", ""), e.classList.contains("colorblind") && this.shadowRoot.querySelector("#color-blind-theme").setAttribute("checked", "");
                    var a = za();
                    a.hardMode && this.shadowRoot.querySelector("#hard-mode").setAttribute("checked", ""), a.hardMode || "IN_PROGRESS" !== a.gameStatus || 0 === a.rowIndex || (this.shadowRoot.querySelector("#hard-mode").removeAttribute("checked"), this.shadowRoot.querySelector("#hard-mode").setAttribute("disabled", ""))
                }
            }]), t
    }(c(HTMLElement));
    customElements.define("game-settings", _a);
    var toastStyles = document.createElement("template");
    toastStyles.innerHTML = `
  <style>
    .toast {
      position: relative;
      margin: 16px;
      background-color: var(--color-tone-1);
      color: var(--color-tone-7);
      padding: 16px;
      border: none;
      border-radius: 4px;
      opacity: 1;
      transition: opacity 300ms cubic-bezier(0.645, 0.045, 0.355, 1);
      font-weight: 700;
    }

    .win {
      background-color: var(--color-correct);
      color: var(--tile-text-color);
    }

    .fade {
      opacity: 0;
    }
  </style>
  <div class="toast"></div>
`;
    var Ea,
        Aa = function(e) {
            r(t, e);
            var a = h(t);
            function t() {
                var e;
                return s(this, t), n(p(e = a.call(this)), "_duration", void 0), e.attachShadow({
                        mode: "open"
                    }), e
            }
            return o(t, [{
                    key: "connectedCallback",
                    value: function() {
                        var e = this;
                        this.shadowRoot.appendChild(toastStyles.content.cloneNode(!0));
                        var a = this.shadowRoot.querySelector(".toast");
                        a.textContent = this.getAttribute("text"), this._duration = this.getAttribute("duration") || 1e3, "Infinity" !== this._duration && setTimeout((function() {
                            a.classList.add("fade")
                        }), this._duration), a.addEventListener("transitionend", (function(a) {
                            e.parentNode.removeChild(e)
                        }))
                    }
                }]), t
        }(c(HTMLElement));
    function Ca() {
        dataLayer.push(arguments)
    }
    customElements.define("game-toast", Aa), window.dataLayer = window.dataLayer || [], Ca("js", new Date);Ca("config", "G-2SSGMHY3NP", {
        app_version: null === (Ea = window.wordle) || void 0 === Ea ? void 0 : Ea.hash,
        debug_mode: !1
    });
    const PRESENT = "present";
    const CORRECT = "correct";
    const ABSENT = "absent";
    const STATE_PRECEDENCE = {
        unknown: 0,
        absent: 1,
        present: 2,
        correct: 3
    };
    function aggregateLetterEvaluations(e, a) {
        var s = {};
        return e.forEach((function(e, t) {
                if (a[t])
                    for (var o = 0; o < e.length; o++) {
                        var n = e[o],
                            r = a[t][o],
                            i = s[n] || "unknown";
                        STATE_PRECEDENCE[r] > STATE_PRECEDENCE[i] && (s[n] = r)
                }
            })), s
    }
    function getOrdinal(e) {
        var a = ["th", "st", "nd", "rd"],
            s = e % 100;
        return e + (a[(s - 20) % 10] || a[s] || a[0])
    }
    const PUZZLE_START_DATE = new Date(2021, 5, 19, 0, 0, 0, 0);
    function calculateDaysBetween(e, a) {
        var s = new Date(e),
            t = new Date(a).setHours(0, 0, 0, 0) - s.setHours(0, 0, 0, 0);
        return Math.round(t / 864e5)
    }
    function getSolution(e) {
        var a,
            s = getDayOffset(e);
        return a = s % answer_list.length, answer_list[a]
    }
    function getDayOffset(e) {
        return calculateDaysBetween(PUZZLE_START_DATE, e)
    }
    var Ba = "abcdefghijklmnopqrstuvwxyz",
        Fa = [].concat(g(Ba.split("").slice(13)), g(Ba.split("").slice(0, 13)));
    function encodeWord(e) {
        console.debug('parsing stats', e);
        for (var a = "", s = 0; s < e.length; s++) {
            var t = Ba.indexOf(e[s]);
            a += t >= 0 ? Fa[t] : "_"
        }
        return a
    }
    const FAIL_KEY = "fail";
    const   DEFAULT_STATISTICS = {
            currentStreak: 0,
            maxStreak: 0,
            guesses: n({
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0
            }, FAIL_KEY, 0),
            winPercentage: 0,
            gamesPlayed: 0,
            gamesWon: 0,
            averageGuesses: 0
        };
    function getStatistics() {
        var storedStats = window.localStorage.getItem("statistics") || JSON.stringify(DEFAULT_STATISTICS);
        console.debug('loaded stats', storedStats);
        return JSON.parse(storedStats)
    }
    function updateStatistics(gameResults) {
        var stats = getStatistics();

        // Update guesses and streak
        if (gameResults.isWin) {
            stats.guesses[gameResults.numGuesses] += 1;
            stats.currentStreak = gameResults.isStreak ? stats.currentStreak + 1 : 1;
        } else {
            stats.currentStreak = 0;
            stats.guesses.fail += 1;
        }

        stats.maxStreak = Math.max(stats.currentStreak, stats.maxStreak);
        stats.gamesPlayed += 1;
        stats.gamesWon += gameResults.isWin ? 1 : 0;
        stats.winPercentage = Math.round(stats.gamesWon / stats.gamesPlayed * 100);

        // Calculate average guesses (excluding failures)
        stats.averageGuesses = Math.round(
            Object.entries(stats.guesses).reduce(function(total, entry) {
                var key = entry[0];
                var count = entry[1];
                return key !== FAIL_KEY ? total + key * count : total;
            }, 0) / stats.gamesWon
        );

        window.localStorage.setItem("statistics", JSON.stringify(stats));
    }
    function evaluateGuess(guessed_wd, ans_wd) {
      var result = Array(ans_wd.length).fill(ABSENT);
      var guessUnmatched = Array(ans_wd.length).fill(true);
      var solutionUnmatched = Array(ans_wd.length).fill(true);

      // First pass: mark exact matches
      for (var idx = 0; idx < guessed_wd.length; idx++) {
        if (guessed_wd[idx] === ans_wd[idx] && solutionUnmatched[idx]) {
          result[idx] = CORRECT;
          guessUnmatched[idx] = false;
          solutionUnmatched[idx] = false;
        }
      }

      // Second pass: mark present (right letter, wrong position)
      for (var idx = 0; idx < guessed_wd.length; idx++) {
        if (guessUnmatched[idx]) {
          var guessChar = guessed_wd[idx];
          for (var ans_idx = 0; ans_idx < ans_wd.length; ans_idx++) {
            if (solutionUnmatched[ans_idx] && guessChar === ans_wd[ans_idx]) {
              result[idx] = PRESENT;
              solutionUnmatched[ans_idx] = false;
              break;
            }
          }
        }
      }

      return result;
    }
    function validateHardMode(guess, previousGuess, previousEvaluation) {
        if (!guess || !previousGuess || !previousEvaluation) {
            return { validGuess: true };
        }

        // Check that all previously correct letters are in the same positions
        for (var idx = 0; idx < previousEvaluation.length; idx++) {
            if (previousEvaluation[idx] === CORRECT && guess[idx] !== previousGuess[idx]) {
                return {
                    validGuess: false,
                    errorMessage: "".concat(getOrdinal(idx + 1), " letter must be ").concat(previousGuess[idx].toUpperCase())
                };
            }
        }

        // Count required letters (those marked correct or present in previous evaluation)
        var requiredLetters = {};
        for (var idx = 0; idx < previousEvaluation.length; idx++) {
            if ([CORRECT, PRESENT].includes(previousEvaluation[idx])) {
                var letter = previousGuess[idx];
                requiredLetters[letter] = (requiredLetters[letter] || 0) + 1;
            }
        }

        // Count letters in current guess
        var guessLetterCounts = guess.split("").reduce(function(counts, letter) {
            counts[letter] = (counts[letter] || 0) + 1;
            return counts;
        }, {});

        // Check that all required letters appear enough times
        for (var requiredLetter in requiredLetters) {
            if ((guessLetterCounts[requiredLetter] || 0) < requiredLetters[requiredLetter]) {
                return {
                    validGuess: false,
                    errorMessage: "Guess must contain ".concat(requiredLetter.toUpperCase())
                };
            }
        }

        return { validGuess: true };
    }
    var Ka = document.createElement("template");
    Ka.innerHTML = document.getElementById('header-container').innerHTML;
    var qaButtons = document.createElement("template");
    qaButtons.innerHTML = `
<button id="reveal">reveal</button>
<button id="shake">shake</button>
<button id="bounce">bounce</button>
<button id="toast">toast</button>
<button id="modal">modal</button>
`;
    const GAME_STATUS_IN_PROGRESS = "IN_PROGRESS";
    const GAME_STATUS_WIN = "WIN";
    const GAME_STATUS_FAIL = "FAIL";
    const COMMENT_WDS = ["Genius", "Magnificent", "Impressive", "Splendid", "Great", "Phew"];
    var ts = function(e) {
            r(t, e);
            var a = h(t);
            function t() {
                var e;
                s(this, t), n(p(e = a.call(this)), "tileIndex", 0), n(p(e), "rowIndex", 0), n(p(e), "solution", void 0), n(p(e), "boardState", void 0), n(p(e), "evaluations", void 0), n(p(e), "canInput", !0), n(p(e), "gameStatus", GAME_STATUS_IN_PROGRESS), n(p(e), "letterEvaluations", {}), n(p(e), "$board", void 0), n(p(e), "$keyboard", void 0), n(p(e), "$game", void 0), n(p(e), "today", void 0), n(p(e), "lastPlayedTs", void 0), n(p(e), "lastCompletedTs", void 0), n(p(e), "hardMode", void 0), n(p(e), "dayOffset", void 0), e.attachShadow({
                    mode: "open"
                }), e.today = new Date;var o = za();
                return e.lastPlayedTs = o.lastPlayedTs, !e.lastPlayedTs || calculateDaysBetween(new Date(e.lastPlayedTs), e.today) >= 1 ? (e.boardState = new Array(6).fill(""), e.evaluations = new Array(6).fill(null), e.solution = getSolution(e.today), e.dayOffset = getDayOffset(e.today), e.lastCompletedTs = o.lastCompletedTs, e.hardMode = o.hardMode, e.restoringFromLocalStorage = !1, ja({
                        rowIndex: e.rowIndex,
                        boardState: e.boardState,
                        evaluations: e.evaluations,
                        solution: e.solution,
                        gameStatus: e.gameStatus
                    }), Ca("event", "level_start", {
                        level_name: encodeWord(e.solution)
                    })) : (e.boardState = o.boardState, e.evaluations = o.evaluations, e.rowIndex = o.rowIndex, e.solution = o.solution, e.dayOffset = getDayOffset(e.today), e.letterEvaluations = aggregateLetterEvaluations(e.boardState, e.evaluations), e.gameStatus = o.gameStatus, e.lastCompletedTs = o.lastCompletedTs, e.hardMode = o.hardMode, e.gameStatus !== GAME_STATUS_IN_PROGRESS && (e.canInput = !1), e.restoringFromLocalStorage = !0), e
            }
            return o(t, [{
                    key: "evaluateRow",
                    value: function() {
                        if (5 === this.tileIndex && !(this.rowIndex >= 6)) {
                            var e,
                                a = this.$board.querySelectorAll("game-row")[this.rowIndex],
                                s = this.boardState[this.rowIndex];
                            if (e = s, !valid_guesses.includes(e) && !answer_list.includes(e)) return a.setAttribute("invalid", ""), void this.addToast("Not in word list");
                            if (this.hardMode) {
                                var t = validateHardMode(s, this.boardState[this.rowIndex - 1], this.evaluations[this.rowIndex - 1]),
                                    o = t.validGuess,
                                    n = t.errorMessage;
                                if (!o) return a.setAttribute("invalid", ""), void this.addToast(n || "Not valid in hard mode")
                            }
                            var r = evaluateGuess(s, this.solution);
                            this.evaluations[this.rowIndex] = r, this.letterEvaluations = aggregateLetterEvaluations(this.boardState, this.evaluations), a.evaluation = this.evaluations[this.rowIndex], this.rowIndex += 1;
                            var i = this.rowIndex >= 6,
                                l = r.every((function(e) {
                                    return "correct" === e
                                }));
                            if (i || l) updateStatistics({
                                    isWin: l,
                                    isStreak: !!this.lastCompletedTs && 1 === calculateDaysBetween(new Date(this.lastCompletedTs), new Date),
                                    numGuesses: this.rowIndex
                                }), ja({
                                    lastCompletedTs: Date.now()
                                }), this.gameStatus = l ? GAME_STATUS_WIN : GAME_STATUS_FAIL, Ca("event", "level_end", {
                                    level_name: encodeWord(this.solution),
                                    num_guesses: this.rowIndex,
                                    success: l
                                });
                            this.tileIndex = 0, this.canInput = !1, ja({
                                rowIndex: this.rowIndex,
                                boardState: this.boardState,
                                evaluations: this.evaluations,
                                solution: this.solution,
                                gameStatus: this.gameStatus,
                                lastPlayedTs: Date.now()
                            })
                        }
                    }
                }, {
                    key: "addLetter",
                    value: function(e) {
                        this.gameStatus === GAME_STATUS_IN_PROGRESS && (this.canInput && (this.tileIndex >= 5 || (this.boardState[this.rowIndex] += e, this.$board.querySelectorAll("game-row")[this.rowIndex].setAttribute("letters", this.boardState[this.rowIndex]), this.tileIndex += 1)))
                    }
                }, {
                    key: "removeLetter",
                    value: function() {
                        if (this.gameStatus === GAME_STATUS_IN_PROGRESS && this.canInput && !(this.tileIndex <= 0)) {
                            this.boardState[this.rowIndex] = this.boardState[this.rowIndex].slice(0, this.boardState[this.rowIndex].length - 1);
                            var e = this.$board.querySelectorAll("game-row")[this.rowIndex];
                            this.boardState[this.rowIndex] ? e.setAttribute("letters", this.boardState[this.rowIndex]) : e.removeAttribute("letters"), e.removeAttribute("invalid"), this.tileIndex -= 1
                        }
                    }
                }, {
                    key: "submitGuess",
                    value: function() {
                        if (this.gameStatus === GAME_STATUS_IN_PROGRESS && this.canInput) {
                            if (5 !== this.tileIndex) return this.$board.querySelectorAll("game-row")[this.rowIndex].setAttribute("invalid", ""), void this.addToast("Not enough letters");
                            this.evaluateRow()
                        }
                    }
                }, {
                    key: "addToast",
                    value: function(e, a) {
                        var s = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                            t = document.createElement("game-toast");
                        t.setAttribute("text", e), a && t.setAttribute("duration", a), s ? this.shadowRoot.querySelector("#system-toaster").prepend(t) : this.shadowRoot.querySelector("#game-toaster").prepend(t)
                    }
                }, {
                    key: "sizeBoard",
                    value: function() {
                        var e = this.shadowRoot.querySelector("#board-container"),
                            maxBoardWidth = window.innerWidth < 331 ? 268 : window.innerWidth < 560 ? 315 : 350,
                            a = Math.min(Math.floor(e.clientHeight * (5 / 6)), maxBoardWidth),
                            s = 6 * Math.floor(a / 5);
                        this.$board.style.width = "".concat(a, "px"), this.$board.style.height = "".concat(s, "px")
                    }
                }, {
                    key: "showStatsModal",
                    value: function() {
                        var e = this.$game.querySelector("game-modal"),
                            a = document.createElement("game-stats");
                        this.gameStatus === GAME_STATUS_WIN && this.rowIndex <= 6 && a.setAttribute("highlight-guess", this.rowIndex), a.gameApp = this, e.appendChild(a), e.setAttribute("open", "")
                    }
                }, {
                    key: "showHelpModal",
                    value: function() {
                        var e = this.$game.querySelector("game-modal");
                        e.appendChild(document.createElement("game-help")), e.setAttribute("open", "")
                    }
                }, {
                    key: "connectedCallback",
                    value: function() {
                        var e = this;
                        this.shadowRoot.appendChild(Ka.content.cloneNode(!0)), this.$game = this.shadowRoot.querySelector("#game"), this.$board = this.shadowRoot.querySelector("#board"), this.$keyboard = this.shadowRoot.querySelector("game-keyboard"), this.sizeBoard(), this.lastPlayedTs || setTimeout((function() {
                            return e.showHelpModal()
                        }), 100);
                        for (var a = 0; a < 6; a++) {
                            var s = document.createElement("game-row");
                            s.setAttribute("letters", this.boardState[a]), s.setAttribute("length", 5), this.evaluations[a] && (s.evaluation = this.evaluations[a]), this.$board.appendChild(s)
                        }
                        this.$game.addEventListener("game-key-press", (function(a) {
                            var s = a.detail.key;
                            "←" === s || "Backspace" === s ? e.removeLetter() : "↵" === s || "Enter" === s ? e.submitGuess() : Ba.includes(s.toLowerCase()) && e.addLetter(s.toLowerCase())
                        })), this.$game.addEventListener("game-last-tile-revealed-in-row", (function(a) {
                            e.$keyboard.letterEvaluations = e.letterEvaluations, e.rowIndex < 6 && (e.canInput = !0);
                            var s = e.$board.querySelectorAll("game-row")[e.rowIndex - 1];
                            (a.path || a.composedPath && a.composedPath()).includes(s) && ([GAME_STATUS_WIN, GAME_STATUS_FAIL].includes(e.gameStatus) && (e.restoringFromLocalStorage ? e.showStatsModal() : (e.gameStatus === GAME_STATUS_WIN && (s.setAttribute("win", ""), e.addToast(COMMENT_WDS[e.rowIndex - 1], 2e3)), e.gameStatus === GAME_STATUS_FAIL && e.addToast(e.solution.toUpperCase(), 1 / 0), setTimeout((function() {
                                e.showStatsModal()
                            }), 2500))), e.restoringFromLocalStorage = !1)
                        })), this.shadowRoot.addEventListener("game-setting-change", (function(a) {
                            var s = a.detail,
                                t = s.name,
                                o = s.checked,
                                n = s.disabled;
                            switch (t) {
                            case "hard-mode":
                                return void (n ? e.addToast("Hard mode can only be enabled at the start of a round", 1500, !0) : (e.hardMode = o, ja({
                                    hardMode: o
                                })))
                            }
                        })), this.shadowRoot.getElementById("settings-button").addEventListener("click", (function(a) {
                            var s = e.$game.querySelector("game-page"),
                                t = document.createTextNode("Settings");
                            s.appendChild(t);
                            var o = document.createElement("game-settings");
                            o.setAttribute("slot", "content"), o.gameApp = e, s.appendChild(o), s.setAttribute("open", "")
                        })), this.shadowRoot.getElementById("help-button").addEventListener("click", (function(a) {
                            var s = e.$game.querySelector("game-page"),
                                t = document.createTextNode("How to play");
                            s.appendChild(t);
                            var o = document.createElement("game-help");
                            o.setAttribute("page", ""), o.setAttribute("slot", "content"), s.appendChild(o), s.setAttribute("open", "")
                        })), this.shadowRoot.getElementById("statistics-button").addEventListener("click", (function(a) {
                            e.showStatsModal()
                        })), this.shadowRoot.getElementById("save-button").addEventListener("click", (function(a) {
                            var s = document.querySelector('#save');
                            s.classList.toggle('hidden');

                        })), window.addEventListener("resize", this.sizeBoard.bind(this))
                    }
                }, {
                    key: "disconnectedCallback",
                    value: function() {}
                }, {
                    key: "debugTools",
                    value: function() {
                        var e = this;
                        this.shadowRoot.getElementById("debug-tools").appendChild(qaButtons.content.cloneNode(!0)), this.shadowRoot.getElementById("toast").addEventListener("click", (function(a) {
                            e.addToast("hello world")
                        })), this.shadowRoot.getElementById("modal").addEventListener("click", (function(a) {
                            var s = e.$game.querySelector("game-modal");
                            s.textContent = "hello plz", s.setAttribute("open", "")
                        })), this.shadowRoot.getElementById("reveal").addEventListener("click", (function() {
                            e.evaluateRow()
                        })), this.shadowRoot.getElementById("shake").addEventListener("click", (function() {
                            e.$board.querySelectorAll("game-row")[e.rowIndex].setAttribute("invalid", "")
                        })), this.shadowRoot.getElementById("bounce").addEventListener("click", (function() {
                            var a = e.$board.querySelectorAll("game-row")[e.rowIndex - 1];
                            "" === a.getAttribute("win") ? a.removeAttribute("win") : a.setAttribute("win", "")
                        }))
                    }
                }]), t
        }(c(HTMLElement));
    customElements.define("game-app", ts);
    var os = document.createElement("template");
    os.innerHTML = `
  <style>
    .overlay {
      display: none;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      justify-content: center;
      align-items: center;
      background-color: var(--opacity-50);
      z-index: ${3e3};
    }

    :host([open]) .overlay {
      display: flex;
    }

    .content {
      position: relative;
      border-radius: 8px;
      border: 1px solid var(--color-tone-6);
      background-color: var(--modal-content-bg);
      color: var(--color-tone-1);
      box-shadow: 0 4px 23px 0 rgba(0, 0, 0, 0.2);
      width: 90%;
      max-height: 90%;
      overflow-y: auto;
      animation: SlideIn 200ms;
      max-width: var(--game-max-width);
      padding: 16px;
      box-sizing: border-box;
    }

    .content.closing {
      animation: SlideOut 200ms;
    }

    .close-icon {
      width: 24px;
      height: 24px;
      position: absolute;
      top: 16px;
      right: 16px;
    }

    game-icon {
      position: fixed;
      user-select: none;
      cursor: pointer;
    }

    @keyframes SlideIn {
      0% {
        transform: translateY(30px);
        opacity: 0;
      }
      100% {
        transform: translateY(0px);
        opacity: 1;
      }
    }

    @keyframes SlideOut {
      0% {
        transform: translateY(0px);
        opacity: 1;
      }
      90% {
        opacity: 0;
      }
      100% {
        opacity: 0;
        transform: translateY(60px);
      }
    }
  </style>
  <div class="overlay">
    <div class="content">
      <slot></slot>
      <div class="close-icon">
        <game-icon icon="close"></game-icon>
      </div>
    </div>
  </div>
`;
    var ns = function(e) {
        r(t, e);
        var a = h(t);
        function t() {
            var e;
            return s(this, t), (e = a.call(this)).attachShadow({
                    mode: "open"
                }), e
        }
        return o(t, [{
                key: "connectedCallback",
                value: function() {
                    var e = this;
                    this.shadowRoot.appendChild(os.content.cloneNode(!0)), this.addEventListener("click", (function(a) {
                        e.shadowRoot.querySelector(".content").classList.add("closing")
                    })), this.shadowRoot.addEventListener("animationend", (function(a) {
                        "SlideOut" === a.animationName && (e.shadowRoot.querySelector(".content").classList.remove("closing"), e.removeChild(e.firstChild), e.removeAttribute("open"))
                    }))
                }
            }]), t
    }(c(HTMLElement));
    customElements.define("game-modal", ns);
    var rs = document.createElement("template");
    rs.innerHTML = `
  <style>
  :host {
    height: var(--keyboard-height);
  }

  #keyboard {
    margin: 0 8px;
    user-select: none;
  }

  @media (max-width: 509px) {
    #keyboard {
      margin: 0 4px;
    }
  }

  @media (max-width: 480px) {
    #keyboard {
      margin: 0 2px;
    }
  }

  @media (max-width: 330px) {
    #keyboard {
      margin: 0 1px;
    }
  }

  .row {
    display: flex;
    width: 100%;
    margin: 0 auto 8px;
    touch-action: manipulation;
  }

  button {
    font-family: "Libre Franklin", "Helvetica Neue", Arial, sans-serif;
    font-weight: 700;
    border: 0;
    padding: 0;
    margin: 0 6px 0 0;
    height: 58px;
    border-radius: 4px;
    cursor: pointer;
    user-select: none;
    background-color: var(--key-bg);
    color: var(--color-tone-1);
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    -webkit-tap-highlight-color: rgba(0,0,0,0.3);
    font-size: 20px;
    -webkit-text-stroke: 0.5px currentColor;
    letter-spacing: 0.025em;
  }

  @media (max-width: 559px) {
    button {
      height: 52px;
      margin: 0 5px 0 0;
      font-size: 18px;
    }
    .row {
      margin: 0 auto 6px;
    }
  }

  @media (max-width: 509px) {
    button {
      margin: 0 4px 0 0;
    }
  }

  @media (max-width: 480px) {
    button {
      margin: 0 3px 0 0;
      font-size: 18px;
    }
  }

  @media (max-width: 330px) {
    button {
      height: 44px;
      margin: 0 2px 0 0;
      font-size: 15px;
    }
    .row {
      margin: 0 auto 5px;
    }
  }

  button:focus {
    outline: none;
  }

  button.fade {
    transition: background-color 0.1s ease, color 0.1s ease;
  }

  button:last-of-type {
    margin: 0;
  }

  .half {
    flex: 0.5;
  }

  .one {
    flex: 1;
  }

  .one-and-a-half {
    flex: 1.5;
    font-size: 12px;
  }

  .two {
    flex: 2;
  }

  button[data-state='correct'] {
    background-color: var(--key-bg-correct);
    color: var(--key-evaluated-text-color);
  }

  button[data-state='present'] {
    background-color: var(--key-bg-present);
    color: var(--key-evaluated-text-color);
  }

  button[data-state='absent'] {
    background-color: var(--key-bg-absent);
    color: var(--key-evaluated-text-color);
  }

  </style>
  <div id="keyboard"></div>
`;
    var is = document.createElement("template");
    is.innerHTML = `<button>key</button>`;
    var spacerDiv = document.createElement("template");
    spacerDiv.innerHTML = `<div class="spacer"></div>`;
    var keyLabels = [["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["-", "a", "s", "d", "f", "g", "h", "j", "k", "l", "-"],
        ["↵", "z", "x", "c", "v", "b", "n", "m", "←"]],
        us = function(e) {
            r(t, e);
            var a = h(t);
            function t() {
                var e;
                return s(this, t), n(p(e = a.call(this)), "_letterEvaluations", {}), e.attachShadow({
                        mode: "open"
                    }), e
            }
            return o(t, [{
                    key: "letterEvaluations",
                    set: function(e) {
                        this._letterEvaluations = e, this._render()
                    }
                }, {
                    key: "dispatchKeyPressEvent",
                    value: function(e) {
                        this.dispatchEvent(new CustomEvent("game-key-press", {
                            bubbles: !0,
                            composed: !0,
                            detail: {
                                key: e
                            }
                        }))
                    }
                }, {
                    key: "connectedCallback",
                    value: function() {
                        var e = this;
                        this.shadowRoot.appendChild(rs.content.cloneNode(!0)), this.$keyboard = this.shadowRoot.getElementById("keyboard"), this.$keyboard.addEventListener("click", (function(a) {
                            var s = a.target.closest("button");
                            s && e.$keyboard.contains(s) && e.dispatchKeyPressEvent(s.dataset.key)
                        })), window.addEventListener("keydown", (function(a) {
                            if (!0 !== a.repeat) {
                                var s = a.key,
                                    t = a.metaKey,
                                    o = a.ctrlKey;
                                t || o || (Ba.includes(s.toLowerCase()) || "Backspace" === s || "Enter" === s) && e.dispatchKeyPressEvent(s)
                            }
                        })), this.$keyboard.addEventListener("transitionend", (function(a) {
                            var s = a.target.closest("button");
                            s && e.$keyboard.contains(s) && s.classList.remove("fade")
                        })), keyLabels.forEach((function(a) {
                            var s = document.createElement("div");
                            s.classList.add("row"), a.forEach((function(e) {
                                var a;
                                if (e >= "a" && e <= "z" || "←" === e || "↵" === e) {
                                    if ((a = is.content.cloneNode(!0).firstElementChild).dataset.key = e, a.textContent = e, "←" === e) {
                                        var t = document.createElement("game-icon");
                                        t.setAttribute("icon", "backspace"), a.textContent = "", a.appendChild(t), a.classList.add("one-and-a-half")
                                    }
                                    "↵" == e && (a.textContent = "enter", a.classList.add("one-and-a-half"))
                                } else (a = spacerDiv.content.cloneNode(!0).firstElementChild).classList.add(1 === e.length ? "half" : "one");
                                s.appendChild(a)
                            })), e.$keyboard.appendChild(s)
                        })), this._render()
                    }
                }, {
                    key: "_render",
                    value: function() {
                        for (var e in this._letterEvaluations) {
                            var a = this.$keyboard.querySelector('[data-key="'.concat(e, '"]'));
                            a.dataset.state = this._letterEvaluations[e], a.classList.add("fade")
                        }
                    }
                }]), t
        }(c(HTMLElement));
    /*! *****************************************************************************
      Copyright (c) Microsoft Corporation.

      Permission to use, copy, modify, and/or distribute this software for any
      purpose with or without fee is hereby granted.

      THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
      REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
      AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
      INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
      LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
      OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
      PERFORMANCE OF THIS SOFTWARE.
      ***************************************************************************** */
    function cs(e, a, s, t) {
        return new (s || (s = Promise))((function(o, n) {
            function r(e) {
                try {
                    l(t.next(e))
                } catch ( e ) {
                    n(e)
                }
            }
            function i(e) {
                try {
                    l(t.throw(e))
                } catch ( e ) {
                    n(e)
                }
            }
            function l(e) {
                var a;
                e.done ? o(e.value) : (a = e.value, a instanceof s ? a : new s((function(e) {
                    e(a)
                }))).then(r, i)
            }
            l((t = t.apply(e, a || [])).next())
        }))
    }
    function ps(e, a) {
        var s,
            t,
            o,
            n,
            r = {
                label: 0,
                sent: function() {
                    if (1 & o[0])
                        throw o[1];
                    return o[1]
                },
                trys: [],
                ops: []
            };
        return n = {
                next: i(0),
                throw: i(1),
                return: i(2)
            }, "function" == typeof Symbol && (n[Symbol.iterator] = function() {
                return this
            }), n;
        function i(n) {
            return function(i) {
                return function(n) {
                    if (s)
                        throw new TypeError("Generator is already executing.");
                    for (; r;) try {
                            if (s = 1, t && (o = 2 & n[0] ? t.return : n[0] ? t.throw || ((o = t.return) && o.call(t), 0) : t.next) && !(o = o.call(t, n[1])).done) return o;
                            switch (t = 0, o && (n = [2 & n[0], o.value]), n[0]) {
                            case 0:
                            case 1:
                                o = n;
                                break;case 4:
                                return r.label++, {
                                        value: n[1],
                                        done: !1
                                    };case 5:
                                r.label++, t = n[1], n = [0];continue;case 7:
                                n = r.ops.pop(), r.trys.pop();continue;default:
                                if (!((o = (o = r.trys).length > 0 && o[o.length - 1]) || 6 !== n[0] && 2 !== n[0])) {
                                    r = 0;continue
                                }
                                if (3 === n[0] && (!o || n[1] > o[0] && n[1] < o[3])) {
                                    r.label = n[1];break
                                }
                                if (6 === n[0] && r.label < o[1]) {
                                    r.label = o[1], o = n;break
                                }
                                if (o && r.label < o[2]) {
                                    r.label = o[2], r.ops.push(n);
                                    break
                                }
                                o[2] && r.ops.pop(), r.trys.pop();continue
                            }
                            n = a.call(e, r)
                        } catch ( e ) {
                            n = [6, e], t = 0
                        } finally {
                            s = o = 0
                    }
                    if (5 & n[0])
                        throw n[1];
                    return {
                        value: n[0] ? n[1] : void 0,
                        done: !0
                    }
                }([n, i])
            }
        }
    }
    customElements.define("game-keyboard", us), function() {
        (console.warn || console.log).apply(console, arguments)
    }.bind("[clipboard-polyfill]");
    var ms,
        hs,
        ys,
        gs,
        bs = "undefined" == typeof navigator ? void 0 : navigator,
        fs = null == bs ? void 0 : bs.clipboard;
    null === (ms = null == fs ? void 0 : fs.read) || void 0 === ms || ms.bind(fs), null === (hs = null == fs ? void 0 : fs.readText) || void 0 === hs || hs.bind(fs);
    var ks = (null === (ys = null == fs ? void 0 : fs.write) || void 0 === ys || ys.bind(fs), null === (gs = null == fs ? void 0 : fs.writeText) || void 0 === gs ? void 0 : gs.bind(fs)),
        vs = "undefined" == typeof window ? void 0 : window,
        ws = (null == vs || vs.ClipboardItem, vs);
    var xs = function() {
        this.success = !1
    };
    function zs(e, a, s) {
        for (var t in e.success = !0, a) {
            var o = a[t],
                n = s.clipboardData;
            n.setData(t, o), "text/plain" === t && n.getData(t) !== o && (e.success = !1)
        }
        s.preventDefault()
    }
    function js(e) {
        var a = new xs,
            s = zs.bind(this, a, e);
        document.addEventListener("copy", s);try {
            document.execCommand("copy")
        } finally {
            document.removeEventListener("copy", s)
        }
        return a.success
    }
    function Ss(e, a) {
        _s(e);var s = js(a);
        return qs(), s
    }
    function _s(e) {
        var a = document.getSelection();
        if (a) {
            var s = document.createRange();
            s.selectNodeContents(e), a.removeAllRanges(), a.addRange(s)
        }
    }
    function qs() {
        var e = document.getSelection();
        e && e.removeAllRanges()
    }
    function Es(e) {
        return cs(this, void 0, void 0, (function() {
            var a;
            return ps(this, (function(s) {
                if (a = "text/plain" in e, "undefined" == typeof ClipboardEvent && void 0 !== ws.clipboardData && void 0 !== ws.clipboardData.setData) {
                    if (!a)
                        throw new Error("No `text/plain` value was specified.");
                    if (t = e["text/plain"], ws.clipboardData.setData("Text", t)) return [2, !0];
                    throw new Error("Copying failed, possibly because the user rejected it.")
                }
                var t;
                return js(e) || navigator.userAgent.indexOf("Edge") > -1 || Ss(document.body, e) || function(e) {
                    var a = document.createElement("div");
                    a.setAttribute("style", "-webkit-user-select: text !important"), a.textContent = "temporary element", document.body.appendChild(a);
                    var s = Ss(a, e);
                    return document.body.removeChild(a), s
                }(e) || function(e) {
                    var a = document.createElement("div");
                    a.setAttribute("style", "-webkit-user-select: text !important");
                    var s = a;
                    a.attachShadow && (s = a.attachShadow({
                        mode: "open"
                    }));
                    var t = document.createElement("span");
                    t.innerText = e, s.appendChild(t), document.body.appendChild(a), _s(t);
                    var o = document.execCommand("copy");
                    return qs(), document.body.removeChild(a), o
                }(e["text/plain"]) ? [2, !0] : [2, !1]
            }))
        }))
    }
    // Share results via native share API or fall back to clipboard
    async function shareOrCopy(data, onSuccess, onError) {
        try {
            // Try native share if available and supported
            if (navigator.canShare?.(data)) {
                await navigator.share(data);
                onSuccess();
                return;
            }
        } catch (err) {
            // User cancelled share or share failed - fall through to clipboard
            if (err.name === 'AbortError') {
                // User cancelled - don't show error, just return
                return;
            }
        }

        // Clipboard fallback
        try {
            await navigator.clipboard.writeText(data.text);
            onSuccess();
        } catch (err) {
            onError();
        }
    }

    var Cs = document.createElement("template");
    Cs.innerHTML = `
  <style>
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 16px 0;
    }

    h1 {
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: 10px;
    }

    #statistics {
      display: flex;
      margin-bottom: 10px;
    }

    .statistic-container {
      flex: 1;
    }

    .statistic-container .statistic {
      font-size: 36px;
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      letter-spacing: 0.05em;
      font-variant-numeric: proportional-nums;
    }

    .statistic.timer {
      font-variant-numeric: initial;
    }

    .statistic-container .label {
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    #guess-distribution {
      width: 80%;
    }

    .graph-container {
      width: 100%;
      height: 20px;
      display: flex;
      align-items: center;
      padding-bottom: 4px;
      font-size: 14px;
      line-height: 20px;
    }

    .graph-container .graph {
      width: 100%;
      height: 100%;
      padding-left: 4px;
    }

    .graph-container .graph .graph-bar {
      height: 100%;
      width: 0%;
      position: relative;
      background-color: var(--color-absent);
      display: flex;
      justify-content: center;
    }

    .graph-container .graph .graph-bar.highlight {
      background-color: var(--color-correct);
    }

    .graph-container .graph .graph-bar.align-right {
      justify-content: flex-end;
      padding-right: 8px;
    }

    .graph-container .graph .num-guesses {
      font-weight: bold;
      color: var(--tile-text-color);
    }

    #statistics,
    #guess-distribution {
      padding-bottom: 10px;
    }

    .footer {
      display: flex;
      width: 100%;
    }

    .countdown {
      border-right: 1px solid var(--color-tone-1);
      padding-right: 12px;
      width: 50%;
    }

    .share {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-left: 12px;
      width: 50%;
    }

    .no-data {
      text-align: center;
    }

    button#share-button {
      background-color: var(--key-bg-correct);
      color: var(--key-evaluated-text-color);
      font-family: inherit;
      font-weight: bold;
      border-radius: 4px;
      cursor: pointer;
      border: none;
      user-select: none;
      display: flex;
      justify-content: center;
      align-items: center;
      text-transform: uppercase;
      -webkit-tap-highlight-color: rgba(0,0,0,0.3);
      width: 80%;
      font-size: 20px;
      height: 52px;
      -webkit-filter: brightness(100%);
    }

    button#share-button:hover {
      opacity: 0.9;
    }

    button#share-button game-icon {
      width: 24px;
      height: 24px;
      padding-left: 8px;
    }
  </style>

  <div class="container">
    <h1>Statistics</h1>
    <div id="statistics"></div>
    <h1>Guess Distribution</h1>
    <div id="guess-distribution"></div>
    <div class="footer"></div>
  </div>
`;
    var Ls = document.createElement("template");
    Ls.innerHTML = `
  <div class="statistic-container">
    <div class="statistic"></div>
    <div class="label"></div>
  </div>
`;
    var Ts = document.createElement("template");
    Ts.innerHTML = `
  <div class="graph-container">
    <div class="guess"></div>
    <div class="graph">
      <div class="graph-bar">
        <div class="num-guesses"></div>
      </div>
    </div>
  </div>
`;
    var Is = document.createElement("template");
    Is.innerHTML = `
  <div class="countdown">
    <h1>Next WORDLE</h1>
    <div id="timer">
      <div class="statistic-container">
        <div class="statistic timer">
          <countdown-timer></countdown-timer>
        </div>
      </div>
    </div>
  </div>
  <div class="share">
    <button id="share-button">
      Share <game-icon icon="share"></game-icon>
    </button>
  </div>
`;
    var Ms = {
            currentStreak: "Current Streak",
            maxStreak: "Max Streak",
            winPercentage: "Win %",
            gamesPlayed: "Played",
            gamesWon: "Won",
            averageGuesses: "Av. Guesses"
        },
        Os = function(e) {
            r(t, e);
            var a = h(t);
            function t() {
                var e;
                return s(this, t), n(p(e = a.call(this)), "stats", {}), n(p(e), "gameApp", void 0), e.attachShadow({
                        mode: "open"
                    }), e.stats = getStatistics(), e
            }
            return o(t, [{
                    key: "connectedCallback",
                    value: function() {
                        var e = this;
                        this.shadowRoot.appendChild(Cs.content.cloneNode(!0));
                        var a = this.shadowRoot.getElementById("statistics"),
                            s = this.shadowRoot.getElementById("guess-distribution"),
                            t = Math.max.apply(Math, g(Object.values(this.stats.guesses)));
                        if (Object.values(this.stats.guesses).every((function(e) {
                                    return 0 === e
                                }))) {
                            var o = document.createElement("div");
                            o.classList.add("no-data"), o.innerText = "No Data", s.appendChild(o)
                        } else
                            for (var n = 1; n < Object.keys(this.stats.guesses).length; n++) {
                                var r = n,
                                    i = this.stats.guesses[n],
                                    l = Ts.content.cloneNode(!0),
                                    d = Math.max(7, Math.round(i / t * 100));
                                l.querySelector(".guess").textContent = r;var u = l.querySelector(".graph-bar");
                                if (u.style.width = "".concat(d, "%"), "number" == typeof i) {
                                    l.querySelector(".num-guesses").textContent = i, i > 0 && u.classList.add("align-right");
                                    var c = parseInt(this.getAttribute("highlight-guess"), 10);
                                    c && n === c && u.classList.add("highlight")
                                }
                                s.appendChild(l)
                        }
                        if (["gamesPlayed", "winPercentage", "currentStreak", "maxStreak"].forEach((function(s) {
                                    var t = Ms[s],
                                        o = e.stats[s],
                                        n = Ls.content.cloneNode(!0);
                                    n.querySelector(".label").textContent = t, n.querySelector(".statistic").textContent = o, a.appendChild(n)
                                })), this.gameApp.gameStatus !== GAME_STATUS_IN_PROGRESS) {
                            var p = this.shadowRoot.querySelector(".footer"),
                                m = Is.content.cloneNode(!0);
                            p.appendChild(m), this.shadowRoot.querySelector("button#share-button").addEventListener("click", (function(a) {
                                a.preventDefault(), a.stopPropagation();shareOrCopy(function(e) {
                                    var a = e.evaluations,
                                        s = e.dayOffset,
                                        t = e.rowIndex,
                                        o = e.isHardMode,
                                        n = e.isWin,
                                        r = JSON.parse(window.localStorage.getItem(j)),
                                        i = JSON.parse(window.localStorage.getItem(S)),
                                        l = "Wordle ".concat(s);
                                    l += " ".concat(n ? t : "X", "/").concat(6), o && (l += "*");
                                    var d = "";
                                    return a.forEach((function(e) {
                                            e && (e.forEach((function(e) {
                                                if (e) {
                                                    var a = "";
                                                    switch (e) {
                                                    case CORRECT:
                                                        a = function(e) {
                                                            return e ? "🟧" : "🟩"
                                                        }(i);
                                                        break;case PRESENT:
                                                        a = function(e) {
                                                            return e ? "🟦" : "🟨"
                                                        }(i);
                                                        break;case ABSENT:
                                                        a = function(e) {
                                                            return e ? "⬛" : "⬜"
                                                        }(r)
                                                    }
                                                    d += a
                                                }
                                            })), d += "\n")
                                        })), {
                                            text: "".concat(l, "\n\n").concat(d.trimEnd())
                                    }
                                }({
                                    evaluations: e.gameApp.evaluations,
                                    dayOffset: e.gameApp.dayOffset,
                                    rowIndex: e.gameApp.rowIndex,
                                    isHardMode: e.gameApp.hardMode,
                                    isWin: e.gameApp.gameStatus === GAME_STATUS_WIN
                                }), (function() {
                                    e.gameApp.addToast("Copied results to clipboard", 2e3, !0)
                                }), (function() {
                                    e.gameApp.addToast("Share failed", 2e3, !0)
                                }))
                            }))
                        }
                    }
                }]), t
        }(c(HTMLElement));
    customElements.define("game-stats", Os);
    var Rs = document.createElement("template");
    Rs.innerHTML = `
  <style>
    :host {
    }

    .container {
      display: flex;
      justify-content: space-between;
    }

    .switch {
      height: 20px;
      width: 32px;
      vertical-align: middle;
      background: var(--color-tone-3);
      border-radius: 999px;
      display: block;
      position: relative;
    }

    .knob {
      display: block;
      position: absolute;
      left: 2px;
      top: 2px;
      height: calc(100% - 4px);
      width: 50%;
      border-radius: 8px;
      background: var(--white);
      transform: translateX(0);
      transition: transform 0.3s;
    }

    :host([checked]) .switch {
      background: var(--color-correct);
    }

    :host([checked]) .knob {
      transform: translateX(calc(100% - 4px));
    }

    :host([disabled]) .switch {
      opacity: 0.5;
    }
  </style>
  <div class="container">
    <label><slot></slot></label>
    <div class="switch">
      <span class="knob"></span>
    </div>
  </div>
`;
    var Ps = function(e) {
        r(t, e);
        var a = h(t);
        function t() {
            var e;
            return s(this, t), (e = a.call(this)).attachShadow({
                    mode: "open"
                }), e
        }
        return o(t, [{
                key: "connectedCallback",
                value: function() {
                    var e = this;
                    this.shadowRoot.appendChild(Rs.content.cloneNode(!0)), this.shadowRoot.querySelector(".container").addEventListener("click", (function(a) {
                        a.stopPropagation(), e.hasAttribute("checked") ? e.removeAttribute("checked") : e.setAttribute("checked", ""), e.dispatchEvent(new CustomEvent("game-switch-change", {
                            bubbles: !0,
                            composed: !0,
                            detail: {
                                name: e.getAttribute("name"),
                                checked: e.hasAttribute("checked"),
                                disabled: e.hasAttribute("disabled")
                            }
                        }))
                    }))
                }
            }], [{
                key: "observedAttributes",
                get: function() {
                    return ["checked"]
                }
            }]), t
    }(c(HTMLElement));
    customElements.define("game-switch", Ps);
    var $s = document.createElement("template");
    $s.innerHTML = `
  <style>
  .instructions {
    font-size: 14px;
    color: var(--color-tone-1);
  }

  .examples {
    border-bottom: 1px solid var(--color-tone-4);
    border-top: 1px solid var(--color-tone-4);
  }

  .example {
    margin-top: 24px;
    margin-bottom: 24px;
  }

  game-tile {
    width: 40px;
    height: 40px;
  }

  :host([page]) section {
    padding: 16px;
    padding-top: 0px;
  }
  </style>

  <section>
    <div class="instructions">
      <p>Guess the <strong>WORDLE</strong> in 6 tries.</p>
      <p>Each guess must be a valid 5 letter word. Hit the enter button to submit.</p>
      <p>After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
      <div class="examples">
        <p><strong>Examples</strong></p>
        <div class="example">
          <div class="row">
            <game-tile letter="w" evaluation="correct" reveal></game-tile>
            <game-tile letter="e"></game-tile>
            <game-tile letter="a"></game-tile>
            <game-tile letter="r"></game-tile>
            <game-tile letter="y"></game-tile>
          </div>
          <p>The letter <strong>W</strong> is in the word and in the correct spot.</p>
        </div>
        <div class="example">
          <div class="row">
            <game-tile letter="p"></game-tile>
            <game-tile letter="i" evaluation="present" reveal></game-tile>
            <game-tile letter="l"></game-tile>
            <game-tile letter="l"></game-tile>
            <game-tile letter="s"></game-tile>
          </div>
          <p>The letter <strong>I</strong> is in the word but in the wrong spot.</p>
        </div>
        <div class="example">
          <div class="row">
            <game-tile letter="v"></game-tile>
            <game-tile letter="a"></game-tile>
            <game-tile letter="g"></game-tile>
            <game-tile letter="u" evaluation="absent" reveal></game-tile>
            <game-tile letter="e"></game-tile>
          </div>
          <p>The letter <strong>U</strong> is not in the word in any spot.</p>
        </div>
      </div>
      <p><strong>A new WORDLE will be available each day!</strong></p>
    </div>
  </section>
`;
    var Hs = function(e) {
        r(t, e);
        var a = h(t);
        function t() {
            var e;
            return s(this, t), (e = a.call(this)).attachShadow({
                    mode: "open"
                }), e
        }
        return o(t, [{
                key: "connectedCallback",
                value: function() {
                    this.shadowRoot.appendChild($s.content.cloneNode(!0))
                }
            }]), t
    }(c(HTMLElement));
    customElements.define("game-help", Hs);
    var Ns = document.createElement("template");
    Ns.innerHTML = `
  <style>
    .overlay {
      display: none;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      justify-content: center;
      background-color: var(--color-background);
      animation: SlideIn 100ms linear;
      z-index: ${2e3};
    }

    :host([open]) .overlay {
      display: flex;
    }

    .content {
      position: relative;
      color: var(--color-tone-1);
      padding: 0 32px;
      max-width: var(--game-max-width);
      width: 100%;
      overflow-y: auto;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .content-container {
      height: 100%;
    }

    .overlay.closing {
      animation: SlideOut 150ms linear;
    }

    header {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    h1 {
      font-weight: 700;
      font-size: 16px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      text-align: center;
      margin-bottom: 10px;
    }

    game-icon {
      position: absolute;
      right: 0;
      user-select: none;
      cursor: pointer;
    }

    @media only screen and (min-device-width: 320px) and (max-device-width: 480px) {
      .content {
        max-width: 100%;
        padding: 0;
      }
      game-icon {
        padding: 0 16px;
      }
    }

    @keyframes SlideIn {
      0% {
        transform: translateY(30px);
        opacity: 0;
      }
      100% {
        transform: translateY(0px);
        opacity: 1;
      }
    }

    @keyframes SlideOut {
      0% {
        transform: translateY(0px);
        opacity: 1;
      }
      90% {
        opacity: 0;
      }
      100% {
        opacity: 0;
        transform: translateY(60px);
      }
    }
  </style>
  <div class="overlay">
    <div class="content">
      <header>
        <h1><slot></slot></h1>
        <game-icon icon="close"></game-icon>
      </header>
      <div class="content-container">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
`;
    var Ds = function(e) {
        r(t, e);
        var a = h(t);
        function t() {
            var e;
            return s(this, t), (e = a.call(this)).attachShadow({
                    mode: "open"
                }), e
        }
        return o(t, [{
                key: "connectedCallback",
                value: function() {
                    var e = this;
                    this.shadowRoot.appendChild(Ns.content.cloneNode(!0)), this.shadowRoot.querySelector("game-icon").addEventListener("click", (function(a) {
                        e.shadowRoot.querySelector(".overlay").classList.add("closing")
                    })), this.shadowRoot.addEventListener("animationend", (function(a) {
                        "SlideOut" === a.animationName && (e.shadowRoot.querySelector(".overlay").classList.remove("closing"), Array.from(e.childNodes).forEach((function(a) {
                            e.removeChild(a)
                        })), e.removeAttribute("open"))
                    }))
                }
            }]), t
    }(c(HTMLElement));
    customElements.define("game-page", Ds);
    var iconTemplate = document.createElement("template");
    iconTemplate.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
    <path fill="var(--color-tone-3)" />
  </svg>
`;
    var ICON_PATHS = {
            help: "M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z",
            settings: "M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z",
            backspace: "M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z",
            close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
            share: "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z",
            statistics: "M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z",
            save: "M3,20.05V3.72H17.48L21,7.58V20.05ZM6.85,9.64m0-5.92V9.64h8.23V3.72m-2.76,0v4M6.85,13.11h8.23M6.85,16.46H17.13"
        },
        Fs = function(e) {
            r(t, e);
            var a = h(t);
            function t() {
                var e;
                return s(this, t), (e = a.call(this)).attachShadow({
                        mode: "open"
                    }), e
            }
            return o(t, [{
                    key: "connectedCallback",
                    value: function() {
                        this.shadowRoot.appendChild(iconTemplate.content.cloneNode(true));
                        var iconName = this.getAttribute("icon");
                        var path = this.shadowRoot.querySelector("path");
                        path.setAttribute("d", ICON_PATHS[iconName]);
                        if (iconName === "backspace") {
                            path.setAttribute("fill", "var(--color-tone-1)");
                        }
                        if (iconName === "share") {
                            path.setAttribute("fill", "var(--white)");
                        }
                    }
                }]), t
        }(c(HTMLElement));
    customElements.define("game-icon", Fs);
    var Ws = document.createElement("template");
    Ws.innerHTML = `<div id="timer"></div>`;
    var Ys = 6e4,
        Js = 36e5,
        Us = function(e) {
            r(t, e);
            var a = h(t);
            function t() {
                var e;
                s(this, t), n(p(e = a.call(this)), "targetEpochMS", void 0), n(p(e), "intervalId", void 0), n(p(e), "$timer", void 0), e.attachShadow({
                    mode: "open"
                });var o = new Date;
                return o.setDate(o.getDate() + 1), o.setHours(0, 0, 0, 0), e.targetEpochMS = o.getTime(), e
            }
            return o(t, [{
                    key: "padDigit",
                    value: function(e) {
                        return e.toString().padStart(2, "0")
                    }
                }, {
                    key: "updateTimer",
                    value: function() {
                        var e,
                            a = (new Date).getTime(),
                            s = Math.floor(this.targetEpochMS - a);
                        if (s <= 0)
                            e = "00:00:00";
                        else {
                            var t = Math.floor(s % 864e5 / Js),
                                o = Math.floor(s % Js / Ys),
                                n = Math.floor(s % Ys / 1e3);
                            e = "".concat(this.padDigit(t), ":").concat(this.padDigit(o), ":").concat(this.padDigit(n))
                        }
                        this.$timer.textContent = e
                    }
                }, {
                    key: "connectedCallback",
                    value: function() {
                        var e = this;
                        this.shadowRoot.appendChild(Ws.content.cloneNode(!0)), this.$timer = this.shadowRoot.querySelector("#timer"), this.intervalId = setInterval((function() {
                            e.updateTimer()
                        }), 200)
                    }
                }, {
                    key: "disconnectedCallback",
                    value: function() {
                        clearInterval(this.intervalId)
                    }
                }]), t
        }(c(HTMLElement));
    // Export pure functions for testing (obfuscated names will be renamed during refactoring)
    e._testExports = {
      // Constants
      PRESENT: PRESENT, // PRESENT = "present"
      CORRECT: CORRECT, // CORRECT = "correct"
      ABSENT: ABSENT, // ABSENT = "absent"
      STATE_PRECEDENCE: STATE_PRECEDENCE, // STATE_PRECEDENCE
      PUZZLE_START_DATE: PUZZLE_START_DATE, // PUZZLE_START_DATE
      GAME_STATUS_IN_PROGRESS: GAME_STATUS_IN_PROGRESS, // GAME_STATUS_IN_PROGRESS = "IN_PROGRESS"
      GAME_STATUS_WIN: GAME_STATUS_WIN, // GAME_STATUS_WIN = "WIN"
      GAME_STATUS_FAIL: GAME_STATUS_FAIL, // GAME_STATUS_FAIL = "FAIL"
      FAIL_KEY: FAIL_KEY, // FAIL_KEY = "fail"
      DEFAULT_STATISTICS: DEFAULT_STATISTICS, // DEFAULT_STATISTICS
      ICON_PATHS: ICON_PATHS, // Bs -> ICON_PATHS

      // Functions
      aggregateLetterEvaluations: aggregateLetterEvaluations, // aggregateLetterEvaluations(boardState, evaluations)
      getOrdinal: getOrdinal, // getOrdinal(n)
      calculateDaysBetween: calculateDaysBetween, // calculateDaysBetween(startDate, endDate)
      getSolution: getSolution, // getSolution(date)
      getDayOffset: getDayOffset, // getDayOffset(date)
      encodeWord: encodeWord, // encodeWord(word) - ROT13-like cipher
      getStatistics: getStatistics, // Xa - > getStatistics
      updateStatistics: updateStatistics, // Va -> updateStatistics
      evaluateGuess: evaluateGuess, // IIFE extraction
      validateHardMode: validateHardMode, // IIFE extraction
    };

    return customElements.define("countdown-timer", Us), e.CountdownTimer = Us, e.GameApp = ts, e.GameHelp = Hs, e.GameIcon = Fs, e.GameKeyboard = us, e.GameModal = ns, e.GamePage = Ds, e.GameRow = x, e.GameSettings = _a, e.GameStats = Os, e.GameSwitch = Ps, e.GameThemeManager = _, e.GameTile = v, e.GameToast = Aa, Object.defineProperty(e, "__esModule", {
            value: !0
        }), e
}({});
