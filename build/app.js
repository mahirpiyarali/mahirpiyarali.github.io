(function(){
"use strict";

var _$geoJson_9 = function (element) {
  if (!element.children.length) {
    //this is a raw GEOJSON source node, just parse it
    var src = element.innerHTML;
    try {
      src = JSON.parse(src);
    } catch (e) {
      if (src.length) console.warn("Error parsing GeoJSON:", src);
      src = null;
    }
    var json = {
      data: src,
      id: element.getAttribute("id"),
      src: element.getAttribute("src")
    };
    this.geojson.push(json);
  } else {

    var url = element.getAttribute("src");

    var data = element.querySelector("geo-data");
    if (data) {
      try {
        data = JSON.parse(data.innerHTML);
      } catch (e) {
        console.error("Incorrect or missing geo-data element");
        return;
      }
    }

    var style = element.querySelector("geo-style");
    if (style) {
      try {
        style = JSON.parse(style.innerHTML);
      } catch (e) {
        console.error("Incorrect or missing geo-style element");
        return;
      }
    }

    var palette = element.querySelector("geo-palette");
    if (palette) {
      try {
        var prop = palette.getAttribute("property");
        var mappings = palette.querySelectorAll("color-mapping");
        var map = {};
        var baseStyle = style || {};
        for (var i = 0; i < mappings.length; i++) {
          var mapping = mappings[i];
          var min = mapping.getAttribute("min") || -Infinity;
          var max = mapping.getAttribute("max") || Infinity;
          var color = mapping.getAttribute("color") || "pink";
          map[color] = { min: min * 1, max: max * 1 };
        }
        style = function style(feature) {
          var value = feature.properties[prop];
          var styleCopy = {};
          for (var s in baseStyle) {
            styleCopy[s] = baseStyle[s];
          }
          for (var color in map) {
            var range = map[color];
            if (value >= range.min && value <= range.max) {
              styleCopy.fillColor = color;
            }
          }
          return styleCopy;
        };
      } catch (e) {
        console.error("Incorrect or missing geo-palette element");
        return;
      }
    }

    var popup = element.querySelector("geo-popup");
    if (popup) {
      var template = popup.innerHTML;
      popup = function popup(feature, layer) {
        //WORLD'S WORST TEMPLATING
        var html = template;
        for (var key in feature.properties) {
          var val = feature.properties[key];
          html = html.split("{{" + key + "}}").join(val);
        }
        layer.bindPopup(html);
      };
    }

    this.geojson.push({
      src: url,
      data: data,
      style: style,
      eachFeature: popup,
      id: element.getAttribute("id")
    });
  }
};

"use strict";

var _$mapMarker_10 = function (element) {
  this.markers.push({
    html: element.innerHTML,
    latlng: [element.getAttribute("lat"), element.getAttribute("lng")].map(Number),
    style: element.getAttribute("style"),
    class: element.className,
    title: element.getAttribute("title"),
    id: element.getAttribute("id")
  });
};

"use strict";

var _$mapOptions_11 = function (element) {
  var json;
  try {
    json = JSON.parse(element.innerHTML);
  } catch (e) {
    console.warn(e, element.innerHTML);
  }
  for (var key in json) {
    this.options[key] = json[key];
  }
};

"use strict";

var _$tileLayer_12 = function (element) {
  this.tiles.push({
    layer: element.getAttribute("layer"),
    url: element.getAttribute("url"),
    options: {
      subdomains: element.getAttribute("subdomains") || "",
      opacity: element.getAttribute("opacity") || 1,
      continuousWorld: element.hasAttribute("continuous"),
      noWrap: element.hasAttribute("nowrap"),
      tms: element.hasAttribute("tms")
    },
    id: element.getAttribute("id")
  });
};

"use strict";

//All tag parsers have the config bound to this before being called with an
//element matching their selector
var parsers = {
  "tile-layer": _$tileLayer_12,
  "map-marker": _$mapMarker_10,
  "geo-json": _$geoJson_9,
  "map-options": _$mapOptions_11
};

var _$configParser_1 = function (element) {
  var config = {
    tiles: [],
    geojson: [],
    kml: [],
    markers: [],
    options: {}
  };
  //run through parsers
  for (var selector in parsers) {
    var elements = Array.prototype.slice.call(element.querySelectorAll(selector));
    var parser = parsers[selector].bind(config);
    elements.forEach(parser);
  }

  //handle options on the element itself
  if (element.hasAttribute("lat")) {
    config.options.center = [element.getAttribute("lat"), element.getAttribute("lng")];
  } else {
    config.options.center = [47.609, -122.333];
  }
  if (!config.options.zoom) {
    config.options.zoom = element.getAttribute("zoom") || 7;
  }
  if (element.hasAttribute("fixed")) {
    config.options.boxZoom = false;
    config.options.doubleClickZoom = false;
    config.options.dragging = false;
    config.options.keyboard = false;
    config.options.scrollWheelZoom = false;
    config.options.touchZoom = false;
    config.options.zoomControl = false;
    config.options.tap = false;
  }
  return config;
};

var _$leaflet_14 = { exports: {} };
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* @preserve
 * Leaflet 1.3.1, a JS library for interactive maps. http://leafletjs.com
 * (c) 2010-2017 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */
!function (t, i) {
  "object" == (typeof _$leaflet_14.exports === "undefined" ? "undefined" : _typeof(_$leaflet_14.exports)) && "undefined" != "object" ? i(_$leaflet_14.exports) : "function" == typeof define && define.amd ? define(["exports"], i) : i(t.L = {});
}(undefined, function (t) {
  "use strict";
  function i(t) {
    var i, e, n, o;for (e = 1, n = arguments.length; e < n; e++) {
      o = arguments[e];for (i in o) {
        t[i] = o[i];
      }
    }return t;
  }function e(t, i) {
    var e = Array.prototype.slice;if (t.bind) return t.bind.apply(t, e.call(arguments, 1));var n = e.call(arguments, 2);return function () {
      return t.apply(i, n.length ? n.concat(e.call(arguments)) : arguments);
    };
  }function n(t) {
    return t._leaflet_id = t._leaflet_id || ++ti, t._leaflet_id;
  }function o(t, i, e) {
    var n, o, s, r;return r = function r() {
      n = !1, o && (s.apply(e, o), o = !1);
    }, s = function s() {
      n ? o = arguments : (t.apply(e, arguments), setTimeout(r, i), n = !0);
    };
  }function s(t, i, e) {
    var n = i[1],
        o = i[0],
        s = n - o;return t === n && e ? t : ((t - o) % s + s) % s + o;
  }function r() {
    return !1;
  }function a(t, i) {
    var e = Math.pow(10, void 0 === i ? 6 : i);return Math.round(t * e) / e;
  }function h(t) {
    return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, "");
  }function u(t) {
    return h(t).split(/\s+/);
  }function l(t, i) {
    t.hasOwnProperty("options") || (t.options = t.options ? Qt(t.options) : {});for (var e in i) {
      t.options[e] = i[e];
    }return t.options;
  }function c(t, i, e) {
    var n = [];for (var o in t) {
      n.push(encodeURIComponent(e ? o.toUpperCase() : o) + "=" + encodeURIComponent(t[o]));
    }return (i && -1 !== i.indexOf("?") ? "&" : "?") + n.join("&");
  }function _(t, i) {
    return t.replace(ii, function (t, e) {
      var n = i[e];if (void 0 === n) throw new Error("No value provided for variable " + t);return "function" == typeof n && (n = n(i)), n;
    });
  }function d(t, i) {
    for (var e = 0; e < t.length; e++) {
      if (t[e] === i) return e;
    }return -1;
  }function p(t) {
    return window["webkit" + t] || window["moz" + t] || window["ms" + t];
  }function m(t) {
    var i = +new Date(),
        e = Math.max(0, 16 - (i - oi));return oi = i + e, window.setTimeout(t, e);
  }function f(t, i, n) {
    if (!n || si !== m) return si.call(window, e(t, i));t.call(i);
  }function g(t) {
    t && ri.call(window, t);
  }function v() {}function y(t) {
    if ("undefined" != typeof L && L && L.Mixin) {
      t = ei(t) ? t : [t];for (var i = 0; i < t.length; i++) {
        t[i] === L.Mixin.Events && console.warn("Deprecated include of L.Mixin.Events: this property will be removed in future releases, please inherit from L.Evented instead.", new Error().stack);
      }
    }
  }function x(t, i, e) {
    this.x = e ? Math.round(t) : t, this.y = e ? Math.round(i) : i;
  }function w(t, i, e) {
    return t instanceof x ? t : ei(t) ? new x(t[0], t[1]) : void 0 === t || null === t ? t : "object" == (typeof t === "undefined" ? "undefined" : _typeof(t)) && "x" in t && "y" in t ? new x(t.x, t.y) : new x(t, i, e);
  }function P(t, i) {
    if (t) for (var e = i ? [t, i] : t, n = 0, o = e.length; n < o; n++) {
      this.extend(e[n]);
    }
  }function b(t, i) {
    return !t || t instanceof P ? t : new P(t, i);
  }function T(t, i) {
    if (t) for (var e = i ? [t, i] : t, n = 0, o = e.length; n < o; n++) {
      this.extend(e[n]);
    }
  }function z(t, i) {
    return t instanceof T ? t : new T(t, i);
  }function M(t, i, e) {
    if (isNaN(t) || isNaN(i)) throw new Error("Invalid LatLng object: (" + t + ", " + i + ")");this.lat = +t, this.lng = +i, void 0 !== e && (this.alt = +e);
  }function C(t, i, e) {
    return t instanceof M ? t : ei(t) && "object" != _typeof(t[0]) ? 3 === t.length ? new M(t[0], t[1], t[2]) : 2 === t.length ? new M(t[0], t[1]) : null : void 0 === t || null === t ? t : "object" == (typeof t === "undefined" ? "undefined" : _typeof(t)) && "lat" in t ? new M(t.lat, "lng" in t ? t.lng : t.lon, t.alt) : void 0 === i ? null : new M(t, i, e);
  }function Z(t, i, e, n) {
    if (ei(t)) return this._a = t[0], this._b = t[1], this._c = t[2], void (this._d = t[3]);this._a = t, this._b = i, this._c = e, this._d = n;
  }function S(t, i, e, n) {
    return new Z(t, i, e, n);
  }function E(t) {
    return document.createElementNS("http://www.w3.org/2000/svg", t);
  }function k(t, i) {
    var e,
        n,
        o,
        s,
        r,
        a,
        h = "";for (e = 0, o = t.length; e < o; e++) {
      for (n = 0, s = (r = t[e]).length; n < s; n++) {
        a = r[n], h += (n ? "L" : "M") + a.x + " " + a.y;
      }h += i ? Xi ? "z" : "x" : "";
    }return h || "M0 0";
  }function I(t) {
    return navigator.userAgent.toLowerCase().indexOf(t) >= 0;
  }function A(t, i, e, n) {
    return "touchstart" === i ? O(t, e, n) : "touchmove" === i ? W(t, e, n) : "touchend" === i && H(t, e, n), this;
  }function B(t, i, e) {
    var n = t["_leaflet_" + i + e];return "touchstart" === i ? t.removeEventListener(Qi, n, !1) : "touchmove" === i ? t.removeEventListener(te, n, !1) : "touchend" === i && (t.removeEventListener(ie, n, !1), t.removeEventListener(ee, n, !1)), this;
  }function O(t, i, n) {
    var o = e(function (t) {
      if ("mouse" !== t.pointerType && t.MSPOINTER_TYPE_MOUSE && t.pointerType !== t.MSPOINTER_TYPE_MOUSE) {
        if (!(ne.indexOf(t.target.tagName) < 0)) return;$(t);
      }j(t, i);
    });t["_leaflet_touchstart" + n] = o, t.addEventListener(Qi, o, !1), se || (document.documentElement.addEventListener(Qi, R, !0), document.documentElement.addEventListener(te, D, !0), document.documentElement.addEventListener(ie, N, !0), document.documentElement.addEventListener(ee, N, !0), se = !0);
  }function R(t) {
    oe[t.pointerId] = t, re++;
  }function D(t) {
    oe[t.pointerId] && (oe[t.pointerId] = t);
  }function N(t) {
    delete oe[t.pointerId], re--;
  }function j(t, i) {
    t.touches = [];for (var e in oe) {
      t.touches.push(oe[e]);
    }t.changedTouches = [t], i(t);
  }function W(t, i, e) {
    var n = function n(t) {
      (t.pointerType !== t.MSPOINTER_TYPE_MOUSE && "mouse" !== t.pointerType || 0 !== t.buttons) && j(t, i);
    };t["_leaflet_touchmove" + e] = n, t.addEventListener(te, n, !1);
  }function H(t, i, e) {
    var n = function n(t) {
      j(t, i);
    };t["_leaflet_touchend" + e] = n, t.addEventListener(ie, n, !1), t.addEventListener(ee, n, !1);
  }function F(t, i, e) {
    function n(t) {
      var i;if (Ui) {
        if (!Pi || "mouse" === t.pointerType) return;i = re;
      } else i = t.touches.length;if (!(i > 1)) {
        var e = Date.now(),
            n = e - (s || e);r = t.touches ? t.touches[0] : t, a = n > 0 && n <= h, s = e;
      }
    }function o(t) {
      if (a && !r.cancelBubble) {
        if (Ui) {
          if (!Pi || "mouse" === t.pointerType) return;var e,
              n,
              o = {};for (n in r) {
            e = r[n], o[n] = e && e.bind ? e.bind(r) : e;
          }r = o;
        }r.type = "dblclick", i(r), s = null;
      }
    }var s,
        r,
        a = !1,
        h = 250;return t[ue + ae + e] = n, t[ue + he + e] = o, t[ue + "dblclick" + e] = i, t.addEventListener(ae, n, !1), t.addEventListener(he, o, !1), t.addEventListener("dblclick", i, !1), this;
  }function U(t, i) {
    var e = t[ue + ae + i],
        n = t[ue + he + i],
        o = t[ue + "dblclick" + i];return t.removeEventListener(ae, e, !1), t.removeEventListener(he, n, !1), Pi || t.removeEventListener("dblclick", o, !1), this;
  }function V(t, i, e, n) {
    if ("object" == (typeof i === "undefined" ? "undefined" : _typeof(i))) for (var o in i) {
      G(t, o, i[o], e);
    } else for (var s = 0, r = (i = u(i)).length; s < r; s++) {
      G(t, i[s], e, n);
    }return this;
  }function q(t, i, e, n) {
    if ("object" == (typeof i === "undefined" ? "undefined" : _typeof(i))) for (var o in i) {
      K(t, o, i[o], e);
    } else if (i) for (var s = 0, r = (i = u(i)).length; s < r; s++) {
      K(t, i[s], e, n);
    } else {
      for (var a in t[le]) {
        K(t, a, t[le][a]);
      }delete t[le];
    }return this;
  }function G(t, i, e, o) {
    var s = i + n(e) + (o ? "_" + n(o) : "");if (t[le] && t[le][s]) return this;var r = function r(i) {
      return e.call(o || t, i || window.event);
    },
        a = r;Ui && 0 === i.indexOf("touch") ? A(t, i, r, s) : !Vi || "dblclick" !== i || !F || Ui && Si ? "addEventListener" in t ? "mousewheel" === i ? t.addEventListener("onwheel" in t ? "wheel" : "mousewheel", r, !1) : "mouseenter" === i || "mouseleave" === i ? (r = function r(i) {
      i = i || window.event, ot(t, i) && a(i);
    }, t.addEventListener("mouseenter" === i ? "mouseover" : "mouseout", r, !1)) : ("click" === i && Ti && (r = function r(t) {
      st(t, a);
    }), t.addEventListener(i, r, !1)) : "attachEvent" in t && t.attachEvent("on" + i, r) : F(t, r, s), t[le] = t[le] || {}, t[le][s] = r;
  }function K(t, i, e, o) {
    var s = i + n(e) + (o ? "_" + n(o) : ""),
        r = t[le] && t[le][s];if (!r) return this;Ui && 0 === i.indexOf("touch") ? B(t, i, s) : !Vi || "dblclick" !== i || !U || Ui && Si ? "removeEventListener" in t ? "mousewheel" === i ? t.removeEventListener("onwheel" in t ? "wheel" : "mousewheel", r, !1) : t.removeEventListener("mouseenter" === i ? "mouseover" : "mouseleave" === i ? "mouseout" : i, r, !1) : "detachEvent" in t && t.detachEvent("on" + i, r) : U(t, s), t[le][s] = null;
  }function Y(t) {
    return t.stopPropagation ? t.stopPropagation() : t.originalEvent ? t.originalEvent._stopped = !0 : t.cancelBubble = !0, nt(t), this;
  }function X(t) {
    return G(t, "mousewheel", Y), this;
  }function J(t) {
    return V(t, "mousedown touchstart dblclick", Y), G(t, "click", et), this;
  }function $(t) {
    return t.preventDefault ? t.preventDefault() : t.returnValue = !1, this;
  }function Q(t) {
    return $(t), Y(t), this;
  }function tt(t, i) {
    if (!i) return new x(t.clientX, t.clientY);var e = i.getBoundingClientRect(),
        n = e.width / i.offsetWidth || 1,
        o = e.height / i.offsetHeight || 1;return new x(t.clientX / n - e.left - i.clientLeft, t.clientY / o - e.top - i.clientTop);
  }function it(t) {
    return Pi ? t.wheelDeltaY / 2 : t.deltaY && 0 === t.deltaMode ? -t.deltaY / ce : t.deltaY && 1 === t.deltaMode ? 20 * -t.deltaY : t.deltaY && 2 === t.deltaMode ? 60 * -t.deltaY : t.deltaX || t.deltaZ ? 0 : t.wheelDelta ? (t.wheelDeltaY || t.wheelDelta) / 2 : t.detail && Math.abs(t.detail) < 32765 ? 20 * -t.detail : t.detail ? t.detail / -32765 * 60 : 0;
  }function et(t) {
    _e[t.type] = !0;
  }function nt(t) {
    var i = _e[t.type];return _e[t.type] = !1, i;
  }function ot(t, i) {
    var e = i.relatedTarget;if (!e) return !0;try {
      for (; e && e !== t;) {
        e = e.parentNode;
      }
    } catch (t) {
      return !1;
    }return e !== t;
  }function st(t, i) {
    var e = t.timeStamp || t.originalEvent && t.originalEvent.timeStamp,
        n = pi && e - pi;n && n > 100 && n < 500 || t.target._simulatedClick && !t._simulated ? Q(t) : (pi = e, i(t));
  }function rt(t) {
    return "string" == typeof t ? document.getElementById(t) : t;
  }function at(t, i) {
    var e = t.style[i] || t.currentStyle && t.currentStyle[i];if ((!e || "auto" === e) && document.defaultView) {
      var n = document.defaultView.getComputedStyle(t, null);e = n ? n[i] : null;
    }return "auto" === e ? null : e;
  }function ht(t, i, e) {
    var n = document.createElement(t);return n.className = i || "", e && e.appendChild(n), n;
  }function ut(t) {
    var i = t.parentNode;i && i.removeChild(t);
  }function lt(t) {
    for (; t.firstChild;) {
      t.removeChild(t.firstChild);
    }
  }function ct(t) {
    var i = t.parentNode;i.lastChild !== t && i.appendChild(t);
  }function _t(t) {
    var i = t.parentNode;i.firstChild !== t && i.insertBefore(t, i.firstChild);
  }function dt(t, i) {
    if (void 0 !== t.classList) return t.classList.contains(i);var e = gt(t);return e.length > 0 && new RegExp("(^|\\s)" + i + "(\\s|$)").test(e);
  }function pt(t, i) {
    if (void 0 !== t.classList) for (var e = u(i), n = 0, o = e.length; n < o; n++) {
      t.classList.add(e[n]);
    } else if (!dt(t, i)) {
      var s = gt(t);ft(t, (s ? s + " " : "") + i);
    }
  }function mt(t, i) {
    void 0 !== t.classList ? t.classList.remove(i) : ft(t, h((" " + gt(t) + " ").replace(" " + i + " ", " ")));
  }function ft(t, i) {
    void 0 === t.className.baseVal ? t.className = i : t.className.baseVal = i;
  }function gt(t) {
    return void 0 === t.className.baseVal ? t.className : t.className.baseVal;
  }function vt(t, i) {
    "opacity" in t.style ? t.style.opacity = i : "filter" in t.style && yt(t, i);
  }function yt(t, i) {
    var e = !1,
        n = "DXImageTransform.Microsoft.Alpha";try {
      e = t.filters.item(n);
    } catch (t) {
      if (1 === i) return;
    }i = Math.round(100 * i), e ? (e.Enabled = 100 !== i, e.Opacity = i) : t.style.filter += " progid:" + n + "(opacity=" + i + ")";
  }function xt(t) {
    for (var i = document.documentElement.style, e = 0; e < t.length; e++) {
      if (t[e] in i) return t[e];
    }return !1;
  }function wt(t, i, e) {
    var n = i || new x(0, 0);t.style[pe] = (Oi ? "translate(" + n.x + "px," + n.y + "px)" : "translate3d(" + n.x + "px," + n.y + "px,0)") + (e ? " scale(" + e + ")" : "");
  }function Lt(t, i) {
    t._leaflet_pos = i, Ni ? wt(t, i) : (t.style.left = i.x + "px", t.style.top = i.y + "px");
  }function Pt(t) {
    return t._leaflet_pos || new x(0, 0);
  }function bt() {
    V(window, "dragstart", $);
  }function Tt() {
    q(window, "dragstart", $);
  }function zt(t) {
    for (; -1 === t.tabIndex;) {
      t = t.parentNode;
    }t.style && (Mt(), ve = t, ye = t.style.outline, t.style.outline = "none", V(window, "keydown", Mt));
  }function Mt() {
    ve && (ve.style.outline = ye, ve = void 0, ye = void 0, q(window, "keydown", Mt));
  }function Ct(t, i) {
    if (!i || !t.length) return t.slice();var e = i * i;return t = kt(t, e), t = St(t, e);
  }function Zt(t, i, e) {
    return Math.sqrt(Rt(t, i, e, !0));
  }function St(t, i) {
    var e = t.length,
        n = new ((typeof Uint8Array === "undefined" ? "undefined" : _typeof(Uint8Array)) != void 0 + "" ? Uint8Array : Array)(e);n[0] = n[e - 1] = 1, Et(t, n, i, 0, e - 1);var o,
        s = [];for (o = 0; o < e; o++) {
      n[o] && s.push(t[o]);
    }return s;
  }function Et(t, i, e, n, o) {
    var s,
        r,
        a,
        h = 0;for (r = n + 1; r <= o - 1; r++) {
      (a = Rt(t[r], t[n], t[o], !0)) > h && (s = r, h = a);
    }h > e && (i[s] = 1, Et(t, i, e, n, s), Et(t, i, e, s, o));
  }function kt(t, i) {
    for (var e = [t[0]], n = 1, o = 0, s = t.length; n < s; n++) {
      Ot(t[n], t[o]) > i && (e.push(t[n]), o = n);
    }return o < s - 1 && e.push(t[s - 1]), e;
  }function It(t, i, e, n, o) {
    var s,
        r,
        a,
        h = n ? Se : Bt(t, e),
        u = Bt(i, e);for (Se = u;;) {
      if (!(h | u)) return [t, i];if (h & u) return !1;a = Bt(r = At(t, i, s = h || u, e, o), e), s === h ? (t = r, h = a) : (i = r, u = a);
    }
  }function At(t, i, e, n, o) {
    var s,
        r,
        a = i.x - t.x,
        h = i.y - t.y,
        u = n.min,
        l = n.max;return 8 & e ? (s = t.x + a * (l.y - t.y) / h, r = l.y) : 4 & e ? (s = t.x + a * (u.y - t.y) / h, r = u.y) : 2 & e ? (s = l.x, r = t.y + h * (l.x - t.x) / a) : 1 & e && (s = u.x, r = t.y + h * (u.x - t.x) / a), new x(s, r, o);
  }function Bt(t, i) {
    var e = 0;return t.x < i.min.x ? e |= 1 : t.x > i.max.x && (e |= 2), t.y < i.min.y ? e |= 4 : t.y > i.max.y && (e |= 8), e;
  }function Ot(t, i) {
    var e = i.x - t.x,
        n = i.y - t.y;return e * e + n * n;
  }function Rt(t, i, e, n) {
    var o,
        s = i.x,
        r = i.y,
        a = e.x - s,
        h = e.y - r,
        u = a * a + h * h;return u > 0 && ((o = ((t.x - s) * a + (t.y - r) * h) / u) > 1 ? (s = e.x, r = e.y) : o > 0 && (s += a * o, r += h * o)), a = t.x - s, h = t.y - r, n ? a * a + h * h : new x(s, r);
  }function Dt(t) {
    return !ei(t[0]) || "object" != _typeof(t[0][0]) && void 0 !== t[0][0];
  }function Nt(t) {
    return console.warn("Deprecated use of _flat, please use L.LineUtil.isFlat instead."), Dt(t);
  }function jt(t, i, e) {
    var n,
        o,
        s,
        r,
        a,
        h,
        u,
        l,
        c,
        _ = [1, 4, 2, 8];for (o = 0, u = t.length; o < u; o++) {
      t[o]._code = Bt(t[o], i);
    }for (r = 0; r < 4; r++) {
      for (l = _[r], n = [], o = 0, s = (u = t.length) - 1; o < u; s = o++) {
        a = t[o], h = t[s], a._code & l ? h._code & l || ((c = At(h, a, l, i, e))._code = Bt(c, i), n.push(c)) : (h._code & l && ((c = At(h, a, l, i, e))._code = Bt(c, i), n.push(c)), n.push(a));
      }t = n;
    }return t;
  }function Wt(t, i) {
    var e,
        n,
        o,
        s,
        r = "Feature" === t.type ? t.geometry : t,
        a = r ? r.coordinates : null,
        h = [],
        u = i && i.pointToLayer,
        l = i && i.coordsToLatLng || Ht;if (!a && !r) return null;switch (r.type) {case "Point":
        return e = l(a), u ? u(t, e) : new Xe(e);case "MultiPoint":
        for (o = 0, s = a.length; o < s; o++) {
          e = l(a[o]), h.push(u ? u(t, e) : new Xe(e));
        }return new qe(h);case "LineString":case "MultiLineString":
        return n = Ft(a, "LineString" === r.type ? 0 : 1, l), new tn(n, i);case "Polygon":case "MultiPolygon":
        return n = Ft(a, "Polygon" === r.type ? 1 : 2, l), new en(n, i);case "GeometryCollection":
        for (o = 0, s = r.geometries.length; o < s; o++) {
          var c = Wt({ geometry: r.geometries[o], type: "Feature", properties: t.properties }, i);c && h.push(c);
        }return new qe(h);default:
        throw new Error("Invalid GeoJSON object.");}
  }function Ht(t) {
    return new M(t[1], t[0], t[2]);
  }function Ft(t, i, e) {
    for (var n, o = [], s = 0, r = t.length; s < r; s++) {
      n = i ? Ft(t[s], i - 1, e) : (e || Ht)(t[s]), o.push(n);
    }return o;
  }function Ut(t, i) {
    return i = "number" == typeof i ? i : 6, void 0 !== t.alt ? [a(t.lng, i), a(t.lat, i), a(t.alt, i)] : [a(t.lng, i), a(t.lat, i)];
  }function Vt(t, i, e, n) {
    for (var o = [], s = 0, r = t.length; s < r; s++) {
      o.push(i ? Vt(t[s], i - 1, e, n) : Ut(t[s], n));
    }return !i && e && o.push(o[0]), o;
  }function qt(t, e) {
    return t.feature ? i({}, t.feature, { geometry: e }) : Gt(e);
  }function Gt(t) {
    return "Feature" === t.type || "FeatureCollection" === t.type ? t : { type: "Feature", properties: {}, geometry: t };
  }function Kt(t, i) {
    return new nn(t, i);
  }function Yt(t, i) {
    return new dn(t, i);
  }function Xt(t) {
    return Yi ? new fn(t) : null;
  }function Jt(t) {
    return Xi || Ji ? new xn(t) : null;
  }var $t = Object.freeze;Object.freeze = function (t) {
    return t;
  };var Qt = Object.create || function () {
    function t() {}return function (i) {
      return t.prototype = i, new t();
    };
  }(),
      ti = 0,
      ii = /\{ *([\w_-]+) *\}/g,
      ei = Array.isArray || function (t) {
    return "[object Array]" === Object.prototype.toString.call(t);
  },
      ni = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
      oi = 0,
      si = window.requestAnimationFrame || p("RequestAnimationFrame") || m,
      ri = window.cancelAnimationFrame || p("CancelAnimationFrame") || p("CancelRequestAnimationFrame") || function (t) {
    window.clearTimeout(t);
  },
      ai = (Object.freeze || Object)({ freeze: $t, extend: i, create: Qt, bind: e, lastId: ti, stamp: n, throttle: o, wrapNum: s, falseFn: r, formatNum: a, trim: h, splitWords: u, setOptions: l, getParamString: c, template: _, isArray: ei, indexOf: d, emptyImageUrl: ni, requestFn: si, cancelFn: ri, requestAnimFrame: f, cancelAnimFrame: g });v.extend = function (t) {
    var e = function e() {
      this.initialize && this.initialize.apply(this, arguments), this.callInitHooks();
    },
        n = e.__super__ = this.prototype,
        o = Qt(n);o.constructor = e, e.prototype = o;for (var s in this) {
      this.hasOwnProperty(s) && "prototype" !== s && "__super__" !== s && (e[s] = this[s]);
    }return t.statics && (i(e, t.statics), delete t.statics), t.includes && (y(t.includes), i.apply(null, [o].concat(t.includes)), delete t.includes), o.options && (t.options = i(Qt(o.options), t.options)), i(o, t), o._initHooks = [], o.callInitHooks = function () {
      if (!this._initHooksCalled) {
        n.callInitHooks && n.callInitHooks.call(this), this._initHooksCalled = !0;for (var t = 0, i = o._initHooks.length; t < i; t++) {
          o._initHooks[t].call(this);
        }
      }
    }, e;
  }, v.include = function (t) {
    return i(this.prototype, t), this;
  }, v.mergeOptions = function (t) {
    return i(this.prototype.options, t), this;
  }, v.addInitHook = function (t) {
    var i = Array.prototype.slice.call(arguments, 1),
        e = "function" == typeof t ? t : function () {
      this[t].apply(this, i);
    };return this.prototype._initHooks = this.prototype._initHooks || [], this.prototype._initHooks.push(e), this;
  };var hi = { on: function on(t, i, e) {
      if ("object" == (typeof t === "undefined" ? "undefined" : _typeof(t))) for (var n in t) {
        this._on(n, t[n], i);
      } else for (var o = 0, s = (t = u(t)).length; o < s; o++) {
        this._on(t[o], i, e);
      }return this;
    }, off: function off(t, i, e) {
      if (t) {
        if ("object" == (typeof t === "undefined" ? "undefined" : _typeof(t))) for (var n in t) {
          this._off(n, t[n], i);
        } else for (var o = 0, s = (t = u(t)).length; o < s; o++) {
          this._off(t[o], i, e);
        }
      } else delete this._events;return this;
    }, _on: function _on(t, i, e) {
      this._events = this._events || {};var n = this._events[t];n || (n = [], this._events[t] = n), e === this && (e = void 0);for (var o = { fn: i, ctx: e }, s = n, r = 0, a = s.length; r < a; r++) {
        if (s[r].fn === i && s[r].ctx === e) return;
      }s.push(o);
    }, _off: function _off(t, i, e) {
      var n, o, s;if (this._events && (n = this._events[t])) if (i) {
        if (e === this && (e = void 0), n) for (o = 0, s = n.length; o < s; o++) {
          var a = n[o];if (a.ctx === e && a.fn === i) return a.fn = r, this._firingCount && (this._events[t] = n = n.slice()), void n.splice(o, 1);
        }
      } else {
        for (o = 0, s = n.length; o < s; o++) {
          n[o].fn = r;
        }delete this._events[t];
      }
    }, fire: function fire(t, e, n) {
      if (!this.listens(t, n)) return this;var o = i({}, e, { type: t, target: this, sourceTarget: e && e.sourceTarget || this });if (this._events) {
        var s = this._events[t];if (s) {
          this._firingCount = this._firingCount + 1 || 1;for (var r = 0, a = s.length; r < a; r++) {
            var h = s[r];h.fn.call(h.ctx || this, o);
          }this._firingCount--;
        }
      }return n && this._propagateEvent(o), this;
    }, listens: function listens(t, i) {
      var e = this._events && this._events[t];if (e && e.length) return !0;if (i) for (var n in this._eventParents) {
        if (this._eventParents[n].listens(t, i)) return !0;
      }return !1;
    }, once: function once(t, i, n) {
      if ("object" == (typeof t === "undefined" ? "undefined" : _typeof(t))) {
        for (var o in t) {
          this.once(o, t[o], i);
        }return this;
      }var s = e(function () {
        this.off(t, i, n).off(t, s, n);
      }, this);return this.on(t, i, n).on(t, s, n);
    }, addEventParent: function addEventParent(t) {
      return this._eventParents = this._eventParents || {}, this._eventParents[n(t)] = t, this;
    }, removeEventParent: function removeEventParent(t) {
      return this._eventParents && delete this._eventParents[n(t)], this;
    }, _propagateEvent: function _propagateEvent(t) {
      for (var e in this._eventParents) {
        this._eventParents[e].fire(t.type, i({ layer: t.target, propagatedFrom: t.target }, t), !0);
      }
    } };hi.addEventListener = hi.on, hi.removeEventListener = hi.clearAllEventListeners = hi.off, hi.addOneTimeEventListener = hi.once, hi.fireEvent = hi.fire, hi.hasEventListeners = hi.listens;var ui = v.extend(hi),
      li = Math.trunc || function (t) {
    return t > 0 ? Math.floor(t) : Math.ceil(t);
  };x.prototype = { clone: function clone() {
      return new x(this.x, this.y);
    }, add: function add(t) {
      return this.clone()._add(w(t));
    }, _add: function _add(t) {
      return this.x += t.x, this.y += t.y, this;
    }, subtract: function subtract(t) {
      return this.clone()._subtract(w(t));
    }, _subtract: function _subtract(t) {
      return this.x -= t.x, this.y -= t.y, this;
    }, divideBy: function divideBy(t) {
      return this.clone()._divideBy(t);
    }, _divideBy: function _divideBy(t) {
      return this.x /= t, this.y /= t, this;
    }, multiplyBy: function multiplyBy(t) {
      return this.clone()._multiplyBy(t);
    }, _multiplyBy: function _multiplyBy(t) {
      return this.x *= t, this.y *= t, this;
    }, scaleBy: function scaleBy(t) {
      return new x(this.x * t.x, this.y * t.y);
    }, unscaleBy: function unscaleBy(t) {
      return new x(this.x / t.x, this.y / t.y);
    }, round: function round() {
      return this.clone()._round();
    }, _round: function _round() {
      return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
    }, floor: function floor() {
      return this.clone()._floor();
    }, _floor: function _floor() {
      return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
    }, ceil: function ceil() {
      return this.clone()._ceil();
    }, _ceil: function _ceil() {
      return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
    }, trunc: function trunc() {
      return this.clone()._trunc();
    }, _trunc: function _trunc() {
      return this.x = li(this.x), this.y = li(this.y), this;
    }, distanceTo: function distanceTo(t) {
      var i = (t = w(t)).x - this.x,
          e = t.y - this.y;return Math.sqrt(i * i + e * e);
    }, equals: function equals(t) {
      return (t = w(t)).x === this.x && t.y === this.y;
    }, contains: function contains(t) {
      return t = w(t), Math.abs(t.x) <= Math.abs(this.x) && Math.abs(t.y) <= Math.abs(this.y);
    }, toString: function toString() {
      return "Point(" + a(this.x) + ", " + a(this.y) + ")";
    } }, P.prototype = { extend: function extend(t) {
      return t = w(t), this.min || this.max ? (this.min.x = Math.min(t.x, this.min.x), this.max.x = Math.max(t.x, this.max.x), this.min.y = Math.min(t.y, this.min.y), this.max.y = Math.max(t.y, this.max.y)) : (this.min = t.clone(), this.max = t.clone()), this;
    }, getCenter: function getCenter(t) {
      return new x((this.min.x + this.max.x) / 2, (this.min.y + this.max.y) / 2, t);
    }, getBottomLeft: function getBottomLeft() {
      return new x(this.min.x, this.max.y);
    }, getTopRight: function getTopRight() {
      return new x(this.max.x, this.min.y);
    }, getTopLeft: function getTopLeft() {
      return this.min;
    }, getBottomRight: function getBottomRight() {
      return this.max;
    }, getSize: function getSize() {
      return this.max.subtract(this.min);
    }, contains: function contains(t) {
      var i, e;return (t = "number" == typeof t[0] || t instanceof x ? w(t) : b(t)) instanceof P ? (i = t.min, e = t.max) : i = e = t, i.x >= this.min.x && e.x <= this.max.x && i.y >= this.min.y && e.y <= this.max.y;
    }, intersects: function intersects(t) {
      t = b(t);var i = this.min,
          e = this.max,
          n = t.min,
          o = t.max,
          s = o.x >= i.x && n.x <= e.x,
          r = o.y >= i.y && n.y <= e.y;return s && r;
    }, overlaps: function overlaps(t) {
      t = b(t);var i = this.min,
          e = this.max,
          n = t.min,
          o = t.max,
          s = o.x > i.x && n.x < e.x,
          r = o.y > i.y && n.y < e.y;return s && r;
    }, isValid: function isValid() {
      return !(!this.min || !this.max);
    } }, T.prototype = { extend: function extend(t) {
      var i,
          e,
          n = this._southWest,
          o = this._northEast;if (t instanceof M) i = t, e = t;else {
        if (!(t instanceof T)) return t ? this.extend(C(t) || z(t)) : this;if (i = t._southWest, e = t._northEast, !i || !e) return this;
      }return n || o ? (n.lat = Math.min(i.lat, n.lat), n.lng = Math.min(i.lng, n.lng), o.lat = Math.max(e.lat, o.lat), o.lng = Math.max(e.lng, o.lng)) : (this._southWest = new M(i.lat, i.lng), this._northEast = new M(e.lat, e.lng)), this;
    }, pad: function pad(t) {
      var i = this._southWest,
          e = this._northEast,
          n = Math.abs(i.lat - e.lat) * t,
          o = Math.abs(i.lng - e.lng) * t;return new T(new M(i.lat - n, i.lng - o), new M(e.lat + n, e.lng + o));
    }, getCenter: function getCenter() {
      return new M((this._southWest.lat + this._northEast.lat) / 2, (this._southWest.lng + this._northEast.lng) / 2);
    }, getSouthWest: function getSouthWest() {
      return this._southWest;
    }, getNorthEast: function getNorthEast() {
      return this._northEast;
    }, getNorthWest: function getNorthWest() {
      return new M(this.getNorth(), this.getWest());
    }, getSouthEast: function getSouthEast() {
      return new M(this.getSouth(), this.getEast());
    }, getWest: function getWest() {
      return this._southWest.lng;
    }, getSouth: function getSouth() {
      return this._southWest.lat;
    }, getEast: function getEast() {
      return this._northEast.lng;
    }, getNorth: function getNorth() {
      return this._northEast.lat;
    }, contains: function contains(t) {
      t = "number" == typeof t[0] || t instanceof M || "lat" in t ? C(t) : z(t);var i,
          e,
          n = this._southWest,
          o = this._northEast;return t instanceof T ? (i = t.getSouthWest(), e = t.getNorthEast()) : i = e = t, i.lat >= n.lat && e.lat <= o.lat && i.lng >= n.lng && e.lng <= o.lng;
    }, intersects: function intersects(t) {
      t = z(t);var i = this._southWest,
          e = this._northEast,
          n = t.getSouthWest(),
          o = t.getNorthEast(),
          s = o.lat >= i.lat && n.lat <= e.lat,
          r = o.lng >= i.lng && n.lng <= e.lng;return s && r;
    }, overlaps: function overlaps(t) {
      t = z(t);var i = this._southWest,
          e = this._northEast,
          n = t.getSouthWest(),
          o = t.getNorthEast(),
          s = o.lat > i.lat && n.lat < e.lat,
          r = o.lng > i.lng && n.lng < e.lng;return s && r;
    }, toBBoxString: function toBBoxString() {
      return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(",");
    }, equals: function equals(t, i) {
      return !!t && (t = z(t), this._southWest.equals(t.getSouthWest(), i) && this._northEast.equals(t.getNorthEast(), i));
    }, isValid: function isValid() {
      return !(!this._southWest || !this._northEast);
    } }, M.prototype = { equals: function equals(t, i) {
      return !!t && (t = C(t), Math.max(Math.abs(this.lat - t.lat), Math.abs(this.lng - t.lng)) <= (void 0 === i ? 1e-9 : i));
    }, toString: function toString(t) {
      return "LatLng(" + a(this.lat, t) + ", " + a(this.lng, t) + ")";
    }, distanceTo: function distanceTo(t) {
      return _i.distance(this, C(t));
    }, wrap: function wrap() {
      return _i.wrapLatLng(this);
    }, toBounds: function toBounds(t) {
      var i = 180 * t / 40075017,
          e = i / Math.cos(Math.PI / 180 * this.lat);return z([this.lat - i, this.lng - e], [this.lat + i, this.lng + e]);
    }, clone: function clone() {
      return new M(this.lat, this.lng, this.alt);
    } };var ci = { latLngToPoint: function latLngToPoint(t, i) {
      var e = this.projection.project(t),
          n = this.scale(i);return this.transformation._transform(e, n);
    }, pointToLatLng: function pointToLatLng(t, i) {
      var e = this.scale(i),
          n = this.transformation.untransform(t, e);return this.projection.unproject(n);
    }, project: function project(t) {
      return this.projection.project(t);
    }, unproject: function unproject(t) {
      return this.projection.unproject(t);
    }, scale: function scale(t) {
      return 256 * Math.pow(2, t);
    }, zoom: function zoom(t) {
      return Math.log(t / 256) / Math.LN2;
    }, getProjectedBounds: function getProjectedBounds(t) {
      if (this.infinite) return null;var i = this.projection.bounds,
          e = this.scale(t);return new P(this.transformation.transform(i.min, e), this.transformation.transform(i.max, e));
    }, infinite: !1, wrapLatLng: function wrapLatLng(t) {
      var i = this.wrapLng ? s(t.lng, this.wrapLng, !0) : t.lng;return new M(this.wrapLat ? s(t.lat, this.wrapLat, !0) : t.lat, i, t.alt);
    }, wrapLatLngBounds: function wrapLatLngBounds(t) {
      var i = t.getCenter(),
          e = this.wrapLatLng(i),
          n = i.lat - e.lat,
          o = i.lng - e.lng;if (0 === n && 0 === o) return t;var s = t.getSouthWest(),
          r = t.getNorthEast();return new T(new M(s.lat - n, s.lng - o), new M(r.lat - n, r.lng - o));
    } },
      _i = i({}, ci, { wrapLng: [-180, 180], R: 6371e3, distance: function distance(t, i) {
      var e = Math.PI / 180,
          n = t.lat * e,
          o = i.lat * e,
          s = Math.sin((i.lat - t.lat) * e / 2),
          r = Math.sin((i.lng - t.lng) * e / 2),
          a = s * s + Math.cos(n) * Math.cos(o) * r * r,
          h = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));return this.R * h;
    } }),
      di = { R: 6378137, MAX_LATITUDE: 85.0511287798, project: function project(t) {
      var i = Math.PI / 180,
          e = this.MAX_LATITUDE,
          n = Math.max(Math.min(e, t.lat), -e),
          o = Math.sin(n * i);return new x(this.R * t.lng * i, this.R * Math.log((1 + o) / (1 - o)) / 2);
    }, unproject: function unproject(t) {
      var i = 180 / Math.PI;return new M((2 * Math.atan(Math.exp(t.y / this.R)) - Math.PI / 2) * i, t.x * i / this.R);
    }, bounds: function () {
      var t = 6378137 * Math.PI;return new P([-t, -t], [t, t]);
    }() };Z.prototype = { transform: function transform(t, i) {
      return this._transform(t.clone(), i);
    }, _transform: function _transform(t, i) {
      return i = i || 1, t.x = i * (this._a * t.x + this._b), t.y = i * (this._c * t.y + this._d), t;
    }, untransform: function untransform(t, i) {
      return i = i || 1, new x((t.x / i - this._b) / this._a, (t.y / i - this._d) / this._c);
    } };var pi,
      mi,
      fi,
      gi,
      vi = i({}, _i, { code: "EPSG:3857", projection: di, transformation: function () {
      var t = .5 / (Math.PI * di.R);return S(t, .5, -t, .5);
    }() }),
      yi = i({}, vi, { code: "EPSG:900913" }),
      xi = document.documentElement.style,
      wi = "ActiveXObject" in window,
      Li = wi && !document.addEventListener,
      Pi = "msLaunchUri" in navigator && !("documentMode" in document),
      bi = I("webkit"),
      Ti = I("android"),
      zi = I("android 2") || I("android 3"),
      Mi = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10),
      Ci = Ti && I("Google") && Mi < 537 && !("AudioNode" in window),
      Zi = !!window.opera,
      Si = I("chrome"),
      Ei = I("gecko") && !bi && !Zi && !wi,
      ki = !Si && I("safari"),
      Ii = I("phantom"),
      Ai = "OTransition" in xi,
      Bi = 0 === navigator.platform.indexOf("Win"),
      Oi = wi && "transition" in xi,
      Ri = "WebKitCSSMatrix" in window && "m11" in new window.WebKitCSSMatrix() && !zi,
      Di = "MozPerspective" in xi,
      Ni = !window.L_DISABLE_3D && (Oi || Ri || Di) && !Ai && !Ii,
      ji = "undefined" != typeof orientation || I("mobile"),
      Wi = ji && bi,
      Hi = ji && Ri,
      Fi = !window.PointerEvent && window.MSPointerEvent,
      Ui = !(!window.PointerEvent && !Fi),
      Vi = !window.L_NO_TOUCH && (Ui || "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch),
      qi = ji && Zi,
      Gi = ji && Ei,
      Ki = (window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI) > 1,
      Yi = !!document.createElement("canvas").getContext,
      Xi = !(!document.createElementNS || !E("svg").createSVGRect),
      Ji = !Xi && function () {
    try {
      var t = document.createElement("div");t.innerHTML = '<v:shape adj="1"/>';var i = t.firstChild;return i.style.behavior = "url(#default#VML)", i && "object" == _typeof(i.adj);
    } catch (t) {
      return !1;
    }
  }(),
      $i = (Object.freeze || Object)({ ie: wi, ielt9: Li, edge: Pi, webkit: bi, android: Ti, android23: zi, androidStock: Ci, opera: Zi, chrome: Si, gecko: Ei, safari: ki, phantom: Ii, opera12: Ai, win: Bi, ie3d: Oi, webkit3d: Ri, gecko3d: Di, any3d: Ni, mobile: ji, mobileWebkit: Wi, mobileWebkit3d: Hi, msPointer: Fi, pointer: Ui, touch: Vi, mobileOpera: qi, mobileGecko: Gi, retina: Ki, canvas: Yi, svg: Xi, vml: Ji }),
      Qi = Fi ? "MSPointerDown" : "pointerdown",
      te = Fi ? "MSPointerMove" : "pointermove",
      ie = Fi ? "MSPointerUp" : "pointerup",
      ee = Fi ? "MSPointerCancel" : "pointercancel",
      ne = ["INPUT", "SELECT", "OPTION"],
      oe = {},
      se = !1,
      re = 0,
      ae = Fi ? "MSPointerDown" : Ui ? "pointerdown" : "touchstart",
      he = Fi ? "MSPointerUp" : Ui ? "pointerup" : "touchend",
      ue = "_leaflet_",
      le = "_leaflet_events",
      ce = Bi && Si ? 2 * window.devicePixelRatio : Ei ? window.devicePixelRatio : 1,
      _e = {},
      de = (Object.freeze || Object)({ on: V, off: q, stopPropagation: Y, disableScrollPropagation: X, disableClickPropagation: J, preventDefault: $, stop: Q, getMousePosition: tt, getWheelDelta: it, fakeStop: et, skipped: nt, isExternalTarget: ot, addListener: V, removeListener: q }),
      pe = xt(["transform", "WebkitTransform", "OTransform", "MozTransform", "msTransform"]),
      me = xt(["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]),
      fe = "webkitTransition" === me || "OTransition" === me ? me + "End" : "transitionend";if ("onselectstart" in document) mi = function mi() {
    V(window, "selectstart", $);
  }, fi = function fi() {
    q(window, "selectstart", $);
  };else {
    var ge = xt(["userSelect", "WebkitUserSelect", "OUserSelect", "MozUserSelect", "msUserSelect"]);mi = function mi() {
      if (ge) {
        var t = document.documentElement.style;gi = t[ge], t[ge] = "none";
      }
    }, fi = function fi() {
      ge && (document.documentElement.style[ge] = gi, gi = void 0);
    };
  }var ve,
      ye,
      xe = (Object.freeze || Object)({ TRANSFORM: pe, TRANSITION: me, TRANSITION_END: fe, get: rt, getStyle: at, create: ht, remove: ut, empty: lt, toFront: ct, toBack: _t, hasClass: dt, addClass: pt, removeClass: mt, setClass: ft, getClass: gt, setOpacity: vt, testProp: xt, setTransform: wt, setPosition: Lt, getPosition: Pt, disableTextSelection: mi, enableTextSelection: fi, disableImageDrag: bt, enableImageDrag: Tt, preventOutline: zt, restoreOutline: Mt }),
      we = ui.extend({ run: function run(t, i, e, n) {
      this.stop(), this._el = t, this._inProgress = !0, this._duration = e || .25, this._easeOutPower = 1 / Math.max(n || .5, .2), this._startPos = Pt(t), this._offset = i.subtract(this._startPos), this._startTime = +new Date(), this.fire("start"), this._animate();
    }, stop: function stop() {
      this._inProgress && (this._step(!0), this._complete());
    }, _animate: function _animate() {
      this._animId = f(this._animate, this), this._step();
    }, _step: function _step(t) {
      var i = +new Date() - this._startTime,
          e = 1e3 * this._duration;i < e ? this._runFrame(this._easeOut(i / e), t) : (this._runFrame(1), this._complete());
    }, _runFrame: function _runFrame(t, i) {
      var e = this._startPos.add(this._offset.multiplyBy(t));i && e._round(), Lt(this._el, e), this.fire("step");
    }, _complete: function _complete() {
      g(this._animId), this._inProgress = !1, this.fire("end");
    }, _easeOut: function _easeOut(t) {
      return 1 - Math.pow(1 - t, this._easeOutPower);
    } }),
      Le = ui.extend({ options: { crs: vi, center: void 0, zoom: void 0, minZoom: void 0, maxZoom: void 0, layers: [], maxBounds: void 0, renderer: void 0, zoomAnimation: !0, zoomAnimationThreshold: 4, fadeAnimation: !0, markerZoomAnimation: !0, transform3DLimit: 8388608, zoomSnap: 1, zoomDelta: 1, trackResize: !0 }, initialize: function initialize(t, i) {
      i = l(this, i), this._initContainer(t), this._initLayout(), this._onResize = e(this._onResize, this), this._initEvents(), i.maxBounds && this.setMaxBounds(i.maxBounds), void 0 !== i.zoom && (this._zoom = this._limitZoom(i.zoom)), i.center && void 0 !== i.zoom && this.setView(C(i.center), i.zoom, { reset: !0 }), this._handlers = [], this._layers = {}, this._zoomBoundLayers = {}, this._sizeChanged = !0, this.callInitHooks(), this._zoomAnimated = me && Ni && !qi && this.options.zoomAnimation, this._zoomAnimated && (this._createAnimProxy(), V(this._proxy, fe, this._catchTransitionEnd, this)), this._addLayers(this.options.layers);
    }, setView: function setView(t, e, n) {
      return e = void 0 === e ? this._zoom : this._limitZoom(e), t = this._limitCenter(C(t), e, this.options.maxBounds), n = n || {}, this._stop(), this._loaded && !n.reset && !0 !== n && (void 0 !== n.animate && (n.zoom = i({ animate: n.animate }, n.zoom), n.pan = i({ animate: n.animate, duration: n.duration }, n.pan)), this._zoom !== e ? this._tryAnimatedZoom && this._tryAnimatedZoom(t, e, n.zoom) : this._tryAnimatedPan(t, n.pan)) ? (clearTimeout(this._sizeTimer), this) : (this._resetView(t, e), this);
    }, setZoom: function setZoom(t, i) {
      return this._loaded ? this.setView(this.getCenter(), t, { zoom: i }) : (this._zoom = t, this);
    }, zoomIn: function zoomIn(t, i) {
      return t = t || (Ni ? this.options.zoomDelta : 1), this.setZoom(this._zoom + t, i);
    }, zoomOut: function zoomOut(t, i) {
      return t = t || (Ni ? this.options.zoomDelta : 1), this.setZoom(this._zoom - t, i);
    }, setZoomAround: function setZoomAround(t, i, e) {
      var n = this.getZoomScale(i),
          o = this.getSize().divideBy(2),
          s = (t instanceof x ? t : this.latLngToContainerPoint(t)).subtract(o).multiplyBy(1 - 1 / n),
          r = this.containerPointToLatLng(o.add(s));return this.setView(r, i, { zoom: e });
    }, _getBoundsCenterZoom: function _getBoundsCenterZoom(t, i) {
      i = i || {}, t = t.getBounds ? t.getBounds() : z(t);var e = w(i.paddingTopLeft || i.padding || [0, 0]),
          n = w(i.paddingBottomRight || i.padding || [0, 0]),
          o = this.getBoundsZoom(t, !1, e.add(n));if ((o = "number" == typeof i.maxZoom ? Math.min(i.maxZoom, o) : o) === 1 / 0) return { center: t.getCenter(), zoom: o };var s = n.subtract(e).divideBy(2),
          r = this.project(t.getSouthWest(), o),
          a = this.project(t.getNorthEast(), o);return { center: this.unproject(r.add(a).divideBy(2).add(s), o), zoom: o };
    }, fitBounds: function fitBounds(t, i) {
      if (!(t = z(t)).isValid()) throw new Error("Bounds are not valid.");var e = this._getBoundsCenterZoom(t, i);return this.setView(e.center, e.zoom, i);
    }, fitWorld: function fitWorld(t) {
      return this.fitBounds([[-90, -180], [90, 180]], t);
    }, panTo: function panTo(t, i) {
      return this.setView(t, this._zoom, { pan: i });
    }, panBy: function panBy(t, i) {
      if (t = w(t).round(), i = i || {}, !t.x && !t.y) return this.fire("moveend");if (!0 !== i.animate && !this.getSize().contains(t)) return this._resetView(this.unproject(this.project(this.getCenter()).add(t)), this.getZoom()), this;if (this._panAnim || (this._panAnim = new we(), this._panAnim.on({ step: this._onPanTransitionStep, end: this._onPanTransitionEnd }, this)), i.noMoveStart || this.fire("movestart"), !1 !== i.animate) {
        pt(this._mapPane, "leaflet-pan-anim");var e = this._getMapPanePos().subtract(t).round();this._panAnim.run(this._mapPane, e, i.duration || .25, i.easeLinearity);
      } else this._rawPanBy(t), this.fire("move").fire("moveend");return this;
    }, flyTo: function flyTo(t, i, e) {
      function n(t) {
        var i = (g * g - m * m + (t ? -1 : 1) * x * x * v * v) / (2 * (t ? g : m) * x * v),
            e = Math.sqrt(i * i + 1) - i;return e < 1e-9 ? -18 : Math.log(e);
      }function o(t) {
        return (Math.exp(t) - Math.exp(-t)) / 2;
      }function s(t) {
        return (Math.exp(t) + Math.exp(-t)) / 2;
      }function r(t) {
        return o(t) / s(t);
      }function a(t) {
        return m * (s(w) / s(w + y * t));
      }function h(t) {
        return m * (s(w) * r(w + y * t) - o(w)) / x;
      }function u(t) {
        return 1 - Math.pow(1 - t, 1.5);
      }function l() {
        var e = (Date.now() - L) / b,
            n = u(e) * P;e <= 1 ? (this._flyToFrame = f(l, this), this._move(this.unproject(c.add(_.subtract(c).multiplyBy(h(n) / v)), p), this.getScaleZoom(m / a(n), p), { flyTo: !0 })) : this._move(t, i)._moveEnd(!0);
      }if (!1 === (e = e || {}).animate || !Ni) return this.setView(t, i, e);this._stop();var c = this.project(this.getCenter()),
          _ = this.project(t),
          d = this.getSize(),
          p = this._zoom;t = C(t), i = void 0 === i ? p : i;var m = Math.max(d.x, d.y),
          g = m * this.getZoomScale(p, i),
          v = _.distanceTo(c) || 1,
          y = 1.42,
          x = y * y,
          w = n(0),
          L = Date.now(),
          P = (n(1) - w) / y,
          b = e.duration ? 1e3 * e.duration : 1e3 * P * .8;return this._moveStart(!0, e.noMoveStart), l.call(this), this;
    }, flyToBounds: function flyToBounds(t, i) {
      var e = this._getBoundsCenterZoom(t, i);return this.flyTo(e.center, e.zoom, i);
    }, setMaxBounds: function setMaxBounds(t) {
      return (t = z(t)).isValid() ? (this.options.maxBounds && this.off("moveend", this._panInsideMaxBounds), this.options.maxBounds = t, this._loaded && this._panInsideMaxBounds(), this.on("moveend", this._panInsideMaxBounds)) : (this.options.maxBounds = null, this.off("moveend", this._panInsideMaxBounds));
    }, setMinZoom: function setMinZoom(t) {
      var i = this.options.minZoom;return this.options.minZoom = t, this._loaded && i !== t && (this.fire("zoomlevelschange"), this.getZoom() < this.options.minZoom) ? this.setZoom(t) : this;
    }, setMaxZoom: function setMaxZoom(t) {
      var i = this.options.maxZoom;return this.options.maxZoom = t, this._loaded && i !== t && (this.fire("zoomlevelschange"), this.getZoom() > this.options.maxZoom) ? this.setZoom(t) : this;
    }, panInsideBounds: function panInsideBounds(t, i) {
      this._enforcingBounds = !0;var e = this.getCenter(),
          n = this._limitCenter(e, this._zoom, z(t));return e.equals(n) || this.panTo(n, i), this._enforcingBounds = !1, this;
    }, invalidateSize: function invalidateSize(t) {
      if (!this._loaded) return this;t = i({ animate: !1, pan: !0 }, !0 === t ? { animate: !0 } : t);var n = this.getSize();this._sizeChanged = !0, this._lastCenter = null;var o = this.getSize(),
          s = n.divideBy(2).round(),
          r = o.divideBy(2).round(),
          a = s.subtract(r);return a.x || a.y ? (t.animate && t.pan ? this.panBy(a) : (t.pan && this._rawPanBy(a), this.fire("move"), t.debounceMoveend ? (clearTimeout(this._sizeTimer), this._sizeTimer = setTimeout(e(this.fire, this, "moveend"), 200)) : this.fire("moveend")), this.fire("resize", { oldSize: n, newSize: o })) : this;
    }, stop: function stop() {
      return this.setZoom(this._limitZoom(this._zoom)), this.options.zoomSnap || this.fire("viewreset"), this._stop();
    }, locate: function locate(t) {
      if (t = this._locateOptions = i({ timeout: 1e4, watch: !1 }, t), !("geolocation" in navigator)) return this._handleGeolocationError({ code: 0, message: "Geolocation not supported." }), this;var n = e(this._handleGeolocationResponse, this),
          o = e(this._handleGeolocationError, this);return t.watch ? this._locationWatchId = navigator.geolocation.watchPosition(n, o, t) : navigator.geolocation.getCurrentPosition(n, o, t), this;
    }, stopLocate: function stopLocate() {
      return navigator.geolocation && navigator.geolocation.clearWatch && navigator.geolocation.clearWatch(this._locationWatchId), this._locateOptions && (this._locateOptions.setView = !1), this;
    }, _handleGeolocationError: function _handleGeolocationError(t) {
      var i = t.code,
          e = t.message || (1 === i ? "permission denied" : 2 === i ? "position unavailable" : "timeout");this._locateOptions.setView && !this._loaded && this.fitWorld(), this.fire("locationerror", { code: i, message: "Geolocation error: " + e + "." });
    }, _handleGeolocationResponse: function _handleGeolocationResponse(t) {
      var i = new M(t.coords.latitude, t.coords.longitude),
          e = i.toBounds(t.coords.accuracy),
          n = this._locateOptions;if (n.setView) {
        var o = this.getBoundsZoom(e);this.setView(i, n.maxZoom ? Math.min(o, n.maxZoom) : o);
      }var s = { latlng: i, bounds: e, timestamp: t.timestamp };for (var r in t.coords) {
        "number" == typeof t.coords[r] && (s[r] = t.coords[r]);
      }this.fire("locationfound", s);
    }, addHandler: function addHandler(t, i) {
      if (!i) return this;var e = this[t] = new i(this);return this._handlers.push(e), this.options[t] && e.enable(), this;
    }, remove: function remove() {
      if (this._initEvents(!0), this._containerId !== this._container._leaflet_id) throw new Error("Map container is being reused by another instance");try {
        delete this._container._leaflet_id, delete this._containerId;
      } catch (t) {
        this._container._leaflet_id = void 0, this._containerId = void 0;
      }void 0 !== this._locationWatchId && this.stopLocate(), this._stop(), ut(this._mapPane), this._clearControlPos && this._clearControlPos(), this._clearHandlers(), this._loaded && this.fire("unload");var t;for (t in this._layers) {
        this._layers[t].remove();
      }for (t in this._panes) {
        ut(this._panes[t]);
      }return this._layers = [], this._panes = [], delete this._mapPane, delete this._renderer, this;
    }, createPane: function createPane(t, i) {
      var e = ht("div", "leaflet-pane" + (t ? " leaflet-" + t.replace("Pane", "") + "-pane" : ""), i || this._mapPane);return t && (this._panes[t] = e), e;
    }, getCenter: function getCenter() {
      return this._checkIfLoaded(), this._lastCenter && !this._moved() ? this._lastCenter : this.layerPointToLatLng(this._getCenterLayerPoint());
    }, getZoom: function getZoom() {
      return this._zoom;
    }, getBounds: function getBounds() {
      var t = this.getPixelBounds();return new T(this.unproject(t.getBottomLeft()), this.unproject(t.getTopRight()));
    }, getMinZoom: function getMinZoom() {
      return void 0 === this.options.minZoom ? this._layersMinZoom || 0 : this.options.minZoom;
    }, getMaxZoom: function getMaxZoom() {
      return void 0 === this.options.maxZoom ? void 0 === this._layersMaxZoom ? 1 / 0 : this._layersMaxZoom : this.options.maxZoom;
    }, getBoundsZoom: function getBoundsZoom(t, i, e) {
      t = z(t), e = w(e || [0, 0]);var n = this.getZoom() || 0,
          o = this.getMinZoom(),
          s = this.getMaxZoom(),
          r = t.getNorthWest(),
          a = t.getSouthEast(),
          h = this.getSize().subtract(e),
          u = b(this.project(a, n), this.project(r, n)).getSize(),
          l = Ni ? this.options.zoomSnap : 1,
          c = h.x / u.x,
          _ = h.y / u.y,
          d = i ? Math.max(c, _) : Math.min(c, _);return n = this.getScaleZoom(d, n), l && (n = Math.round(n / (l / 100)) * (l / 100), n = i ? Math.ceil(n / l) * l : Math.floor(n / l) * l), Math.max(o, Math.min(s, n));
    }, getSize: function getSize() {
      return this._size && !this._sizeChanged || (this._size = new x(this._container.clientWidth || 0, this._container.clientHeight || 0), this._sizeChanged = !1), this._size.clone();
    }, getPixelBounds: function getPixelBounds(t, i) {
      var e = this._getTopLeftPoint(t, i);return new P(e, e.add(this.getSize()));
    }, getPixelOrigin: function getPixelOrigin() {
      return this._checkIfLoaded(), this._pixelOrigin;
    }, getPixelWorldBounds: function getPixelWorldBounds(t) {
      return this.options.crs.getProjectedBounds(void 0 === t ? this.getZoom() : t);
    }, getPane: function getPane(t) {
      return "string" == typeof t ? this._panes[t] : t;
    }, getPanes: function getPanes() {
      return this._panes;
    }, getContainer: function getContainer() {
      return this._container;
    }, getZoomScale: function getZoomScale(t, i) {
      var e = this.options.crs;return i = void 0 === i ? this._zoom : i, e.scale(t) / e.scale(i);
    }, getScaleZoom: function getScaleZoom(t, i) {
      var e = this.options.crs;i = void 0 === i ? this._zoom : i;var n = e.zoom(t * e.scale(i));return isNaN(n) ? 1 / 0 : n;
    }, project: function project(t, i) {
      return i = void 0 === i ? this._zoom : i, this.options.crs.latLngToPoint(C(t), i);
    }, unproject: function unproject(t, i) {
      return i = void 0 === i ? this._zoom : i, this.options.crs.pointToLatLng(w(t), i);
    }, layerPointToLatLng: function layerPointToLatLng(t) {
      var i = w(t).add(this.getPixelOrigin());return this.unproject(i);
    }, latLngToLayerPoint: function latLngToLayerPoint(t) {
      return this.project(C(t))._round()._subtract(this.getPixelOrigin());
    }, wrapLatLng: function wrapLatLng(t) {
      return this.options.crs.wrapLatLng(C(t));
    }, wrapLatLngBounds: function wrapLatLngBounds(t) {
      return this.options.crs.wrapLatLngBounds(z(t));
    }, distance: function distance(t, i) {
      return this.options.crs.distance(C(t), C(i));
    }, containerPointToLayerPoint: function containerPointToLayerPoint(t) {
      return w(t).subtract(this._getMapPanePos());
    }, layerPointToContainerPoint: function layerPointToContainerPoint(t) {
      return w(t).add(this._getMapPanePos());
    }, containerPointToLatLng: function containerPointToLatLng(t) {
      var i = this.containerPointToLayerPoint(w(t));return this.layerPointToLatLng(i);
    }, latLngToContainerPoint: function latLngToContainerPoint(t) {
      return this.layerPointToContainerPoint(this.latLngToLayerPoint(C(t)));
    }, mouseEventToContainerPoint: function mouseEventToContainerPoint(t) {
      return tt(t, this._container);
    }, mouseEventToLayerPoint: function mouseEventToLayerPoint(t) {
      return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(t));
    }, mouseEventToLatLng: function mouseEventToLatLng(t) {
      return this.layerPointToLatLng(this.mouseEventToLayerPoint(t));
    }, _initContainer: function _initContainer(t) {
      var i = this._container = rt(t);if (!i) throw new Error("Map container not found.");if (i._leaflet_id) throw new Error("Map container is already initialized.");V(i, "scroll", this._onScroll, this), this._containerId = n(i);
    }, _initLayout: function _initLayout() {
      var t = this._container;this._fadeAnimated = this.options.fadeAnimation && Ni, pt(t, "leaflet-container" + (Vi ? " leaflet-touch" : "") + (Ki ? " leaflet-retina" : "") + (Li ? " leaflet-oldie" : "") + (ki ? " leaflet-safari" : "") + (this._fadeAnimated ? " leaflet-fade-anim" : ""));var i = at(t, "position");"absolute" !== i && "relative" !== i && "fixed" !== i && (t.style.position = "relative"), this._initPanes(), this._initControlPos && this._initControlPos();
    }, _initPanes: function _initPanes() {
      var t = this._panes = {};this._paneRenderers = {}, this._mapPane = this.createPane("mapPane", this._container), Lt(this._mapPane, new x(0, 0)), this.createPane("tilePane"), this.createPane("shadowPane"), this.createPane("overlayPane"), this.createPane("markerPane"), this.createPane("tooltipPane"), this.createPane("popupPane"), this.options.markerZoomAnimation || (pt(t.markerPane, "leaflet-zoom-hide"), pt(t.shadowPane, "leaflet-zoom-hide"));
    }, _resetView: function _resetView(t, i) {
      Lt(this._mapPane, new x(0, 0));var e = !this._loaded;this._loaded = !0, i = this._limitZoom(i), this.fire("viewprereset");var n = this._zoom !== i;this._moveStart(n, !1)._move(t, i)._moveEnd(n), this.fire("viewreset"), e && this.fire("load");
    }, _moveStart: function _moveStart(t, i) {
      return t && this.fire("zoomstart"), i || this.fire("movestart"), this;
    }, _move: function _move(t, i, e) {
      void 0 === i && (i = this._zoom);var n = this._zoom !== i;return this._zoom = i, this._lastCenter = t, this._pixelOrigin = this._getNewPixelOrigin(t), (n || e && e.pinch) && this.fire("zoom", e), this.fire("move", e);
    }, _moveEnd: function _moveEnd(t) {
      return t && this.fire("zoomend"), this.fire("moveend");
    }, _stop: function _stop() {
      return g(this._flyToFrame), this._panAnim && this._panAnim.stop(), this;
    }, _rawPanBy: function _rawPanBy(t) {
      Lt(this._mapPane, this._getMapPanePos().subtract(t));
    }, _getZoomSpan: function _getZoomSpan() {
      return this.getMaxZoom() - this.getMinZoom();
    }, _panInsideMaxBounds: function _panInsideMaxBounds() {
      this._enforcingBounds || this.panInsideBounds(this.options.maxBounds);
    }, _checkIfLoaded: function _checkIfLoaded() {
      if (!this._loaded) throw new Error("Set map center and zoom first.");
    }, _initEvents: function _initEvents(t) {
      this._targets = {}, this._targets[n(this._container)] = this;var i = t ? q : V;i(this._container, "click dblclick mousedown mouseup mouseover mouseout mousemove contextmenu keypress", this._handleDOMEvent, this), this.options.trackResize && i(window, "resize", this._onResize, this), Ni && this.options.transform3DLimit && (t ? this.off : this.on).call(this, "moveend", this._onMoveEnd);
    }, _onResize: function _onResize() {
      g(this._resizeRequest), this._resizeRequest = f(function () {
        this.invalidateSize({ debounceMoveend: !0 });
      }, this);
    }, _onScroll: function _onScroll() {
      this._container.scrollTop = 0, this._container.scrollLeft = 0;
    }, _onMoveEnd: function _onMoveEnd() {
      var t = this._getMapPanePos();Math.max(Math.abs(t.x), Math.abs(t.y)) >= this.options.transform3DLimit && this._resetView(this.getCenter(), this.getZoom());
    }, _findEventTargets: function _findEventTargets(t, i) {
      for (var e, o = [], s = "mouseout" === i || "mouseover" === i, r = t.target || t.srcElement, a = !1; r;) {
        if ((e = this._targets[n(r)]) && ("click" === i || "preclick" === i) && !t._simulated && this._draggableMoved(e)) {
          a = !0;break;
        }if (e && e.listens(i, !0)) {
          if (s && !ot(r, t)) break;if (o.push(e), s) break;
        }if (r === this._container) break;r = r.parentNode;
      }return o.length || a || s || !ot(r, t) || (o = [this]), o;
    }, _handleDOMEvent: function _handleDOMEvent(t) {
      if (this._loaded && !nt(t)) {
        var i = t.type;"mousedown" !== i && "keypress" !== i || zt(t.target || t.srcElement), this._fireDOMEvent(t, i);
      }
    }, _mouseEvents: ["click", "dblclick", "mouseover", "mouseout", "contextmenu"], _fireDOMEvent: function _fireDOMEvent(t, e, n) {
      if ("click" === t.type) {
        var o = i({}, t);o.type = "preclick", this._fireDOMEvent(o, o.type, n);
      }if (!t._stopped && (n = (n || []).concat(this._findEventTargets(t, e))).length) {
        var s = n[0];"contextmenu" === e && s.listens(e, !0) && $(t);var r = { originalEvent: t };if ("keypress" !== t.type) {
          var a = s.getLatLng && (!s._radius || s._radius <= 10);r.containerPoint = a ? this.latLngToContainerPoint(s.getLatLng()) : this.mouseEventToContainerPoint(t), r.layerPoint = this.containerPointToLayerPoint(r.containerPoint), r.latlng = a ? s.getLatLng() : this.layerPointToLatLng(r.layerPoint);
        }for (var h = 0; h < n.length; h++) {
          if (n[h].fire(e, r, !0), r.originalEvent._stopped || !1 === n[h].options.bubblingMouseEvents && -1 !== d(this._mouseEvents, e)) return;
        }
      }
    }, _draggableMoved: function _draggableMoved(t) {
      return (t = t.dragging && t.dragging.enabled() ? t : this).dragging && t.dragging.moved() || this.boxZoom && this.boxZoom.moved();
    }, _clearHandlers: function _clearHandlers() {
      for (var t = 0, i = this._handlers.length; t < i; t++) {
        this._handlers[t].disable();
      }
    }, whenReady: function whenReady(t, i) {
      return this._loaded ? t.call(i || this, { target: this }) : this.on("load", t, i), this;
    }, _getMapPanePos: function _getMapPanePos() {
      return Pt(this._mapPane) || new x(0, 0);
    }, _moved: function _moved() {
      var t = this._getMapPanePos();return t && !t.equals([0, 0]);
    }, _getTopLeftPoint: function _getTopLeftPoint(t, i) {
      return (t && void 0 !== i ? this._getNewPixelOrigin(t, i) : this.getPixelOrigin()).subtract(this._getMapPanePos());
    }, _getNewPixelOrigin: function _getNewPixelOrigin(t, i) {
      var e = this.getSize()._divideBy(2);return this.project(t, i)._subtract(e)._add(this._getMapPanePos())._round();
    }, _latLngToNewLayerPoint: function _latLngToNewLayerPoint(t, i, e) {
      var n = this._getNewPixelOrigin(e, i);return this.project(t, i)._subtract(n);
    }, _latLngBoundsToNewLayerBounds: function _latLngBoundsToNewLayerBounds(t, i, e) {
      var n = this._getNewPixelOrigin(e, i);return b([this.project(t.getSouthWest(), i)._subtract(n), this.project(t.getNorthWest(), i)._subtract(n), this.project(t.getSouthEast(), i)._subtract(n), this.project(t.getNorthEast(), i)._subtract(n)]);
    }, _getCenterLayerPoint: function _getCenterLayerPoint() {
      return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
    }, _getCenterOffset: function _getCenterOffset(t) {
      return this.latLngToLayerPoint(t).subtract(this._getCenterLayerPoint());
    }, _limitCenter: function _limitCenter(t, i, e) {
      if (!e) return t;var n = this.project(t, i),
          o = this.getSize().divideBy(2),
          s = new P(n.subtract(o), n.add(o)),
          r = this._getBoundsOffset(s, e, i);return r.round().equals([0, 0]) ? t : this.unproject(n.add(r), i);
    }, _limitOffset: function _limitOffset(t, i) {
      if (!i) return t;var e = this.getPixelBounds(),
          n = new P(e.min.add(t), e.max.add(t));return t.add(this._getBoundsOffset(n, i));
    }, _getBoundsOffset: function _getBoundsOffset(t, i, e) {
      var n = b(this.project(i.getNorthEast(), e), this.project(i.getSouthWest(), e)),
          o = n.min.subtract(t.min),
          s = n.max.subtract(t.max);return new x(this._rebound(o.x, -s.x), this._rebound(o.y, -s.y));
    }, _rebound: function _rebound(t, i) {
      return t + i > 0 ? Math.round(t - i) / 2 : Math.max(0, Math.ceil(t)) - Math.max(0, Math.floor(i));
    }, _limitZoom: function _limitZoom(t) {
      var i = this.getMinZoom(),
          e = this.getMaxZoom(),
          n = Ni ? this.options.zoomSnap : 1;return n && (t = Math.round(t / n) * n), Math.max(i, Math.min(e, t));
    }, _onPanTransitionStep: function _onPanTransitionStep() {
      this.fire("move");
    }, _onPanTransitionEnd: function _onPanTransitionEnd() {
      mt(this._mapPane, "leaflet-pan-anim"), this.fire("moveend");
    }, _tryAnimatedPan: function _tryAnimatedPan(t, i) {
      var e = this._getCenterOffset(t)._trunc();return !(!0 !== (i && i.animate) && !this.getSize().contains(e)) && (this.panBy(e, i), !0);
    }, _createAnimProxy: function _createAnimProxy() {
      var t = this._proxy = ht("div", "leaflet-proxy leaflet-zoom-animated");this._panes.mapPane.appendChild(t), this.on("zoomanim", function (t) {
        var i = pe,
            e = this._proxy.style[i];wt(this._proxy, this.project(t.center, t.zoom), this.getZoomScale(t.zoom, 1)), e === this._proxy.style[i] && this._animatingZoom && this._onZoomTransitionEnd();
      }, this), this.on("load moveend", function () {
        var t = this.getCenter(),
            i = this.getZoom();wt(this._proxy, this.project(t, i), this.getZoomScale(i, 1));
      }, this), this._on("unload", this._destroyAnimProxy, this);
    }, _destroyAnimProxy: function _destroyAnimProxy() {
      ut(this._proxy), delete this._proxy;
    }, _catchTransitionEnd: function _catchTransitionEnd(t) {
      this._animatingZoom && t.propertyName.indexOf("transform") >= 0 && this._onZoomTransitionEnd();
    }, _nothingToAnimate: function _nothingToAnimate() {
      return !this._container.getElementsByClassName("leaflet-zoom-animated").length;
    }, _tryAnimatedZoom: function _tryAnimatedZoom(t, i, e) {
      if (this._animatingZoom) return !0;if (e = e || {}, !this._zoomAnimated || !1 === e.animate || this._nothingToAnimate() || Math.abs(i - this._zoom) > this.options.zoomAnimationThreshold) return !1;var n = this.getZoomScale(i),
          o = this._getCenterOffset(t)._divideBy(1 - 1 / n);return !(!0 !== e.animate && !this.getSize().contains(o)) && (f(function () {
        this._moveStart(!0, !1)._animateZoom(t, i, !0);
      }, this), !0);
    }, _animateZoom: function _animateZoom(t, i, n, o) {
      this._mapPane && (n && (this._animatingZoom = !0, this._animateToCenter = t, this._animateToZoom = i, pt(this._mapPane, "leaflet-zoom-anim")), this.fire("zoomanim", { center: t, zoom: i, noUpdate: o }), setTimeout(e(this._onZoomTransitionEnd, this), 250));
    }, _onZoomTransitionEnd: function _onZoomTransitionEnd() {
      this._animatingZoom && (this._mapPane && mt(this._mapPane, "leaflet-zoom-anim"), this._animatingZoom = !1, this._move(this._animateToCenter, this._animateToZoom), f(function () {
        this._moveEnd(!0);
      }, this));
    } }),
      Pe = v.extend({ options: { position: "topright" }, initialize: function initialize(t) {
      l(this, t);
    }, getPosition: function getPosition() {
      return this.options.position;
    }, setPosition: function setPosition(t) {
      var i = this._map;return i && i.removeControl(this), this.options.position = t, i && i.addControl(this), this;
    }, getContainer: function getContainer() {
      return this._container;
    }, addTo: function addTo(t) {
      this.remove(), this._map = t;var i = this._container = this.onAdd(t),
          e = this.getPosition(),
          n = t._controlCorners[e];return pt(i, "leaflet-control"), -1 !== e.indexOf("bottom") ? n.insertBefore(i, n.firstChild) : n.appendChild(i), this;
    }, remove: function remove() {
      return this._map ? (ut(this._container), this.onRemove && this.onRemove(this._map), this._map = null, this) : this;
    }, _refocusOnMap: function _refocusOnMap(t) {
      this._map && t && t.screenX > 0 && t.screenY > 0 && this._map.getContainer().focus();
    } }),
      be = function be(t) {
    return new Pe(t);
  };Le.include({ addControl: function addControl(t) {
      return t.addTo(this), this;
    }, removeControl: function removeControl(t) {
      return t.remove(), this;
    }, _initControlPos: function _initControlPos() {
      function t(t, o) {
        var s = e + t + " " + e + o;i[t + o] = ht("div", s, n);
      }var i = this._controlCorners = {},
          e = "leaflet-",
          n = this._controlContainer = ht("div", e + "control-container", this._container);t("top", "left"), t("top", "right"), t("bottom", "left"), t("bottom", "right");
    }, _clearControlPos: function _clearControlPos() {
      for (var t in this._controlCorners) {
        ut(this._controlCorners[t]);
      }ut(this._controlContainer), delete this._controlCorners, delete this._controlContainer;
    } });var Te = Pe.extend({ options: { collapsed: !0, position: "topright", autoZIndex: !0, hideSingleBase: !1, sortLayers: !1, sortFunction: function sortFunction(t, i, e, n) {
        return e < n ? -1 : n < e ? 1 : 0;
      } }, initialize: function initialize(t, i, e) {
      l(this, e), this._layerControlInputs = [], this._layers = [], this._lastZIndex = 0, this._handlingClick = !1;for (var n in t) {
        this._addLayer(t[n], n);
      }for (n in i) {
        this._addLayer(i[n], n, !0);
      }
    }, onAdd: function onAdd(t) {
      this._initLayout(), this._update(), this._map = t, t.on("zoomend", this._checkDisabledLayers, this);for (var i = 0; i < this._layers.length; i++) {
        this._layers[i].layer.on("add remove", this._onLayerChange, this);
      }return this._container;
    }, addTo: function addTo(t) {
      return Pe.prototype.addTo.call(this, t), this._expandIfNotCollapsed();
    }, onRemove: function onRemove() {
      this._map.off("zoomend", this._checkDisabledLayers, this);for (var t = 0; t < this._layers.length; t++) {
        this._layers[t].layer.off("add remove", this._onLayerChange, this);
      }
    }, addBaseLayer: function addBaseLayer(t, i) {
      return this._addLayer(t, i), this._map ? this._update() : this;
    }, addOverlay: function addOverlay(t, i) {
      return this._addLayer(t, i, !0), this._map ? this._update() : this;
    }, removeLayer: function removeLayer(t) {
      t.off("add remove", this._onLayerChange, this);var i = this._getLayer(n(t));return i && this._layers.splice(this._layers.indexOf(i), 1), this._map ? this._update() : this;
    }, expand: function expand() {
      pt(this._container, "leaflet-control-layers-expanded"), this._form.style.height = null;var t = this._map.getSize().y - (this._container.offsetTop + 50);return t < this._form.clientHeight ? (pt(this._form, "leaflet-control-layers-scrollbar"), this._form.style.height = t + "px") : mt(this._form, "leaflet-control-layers-scrollbar"), this._checkDisabledLayers(), this;
    }, collapse: function collapse() {
      return mt(this._container, "leaflet-control-layers-expanded"), this;
    }, _initLayout: function _initLayout() {
      var t = "leaflet-control-layers",
          i = this._container = ht("div", t),
          e = this.options.collapsed;i.setAttribute("aria-haspopup", !0), J(i), X(i);var n = this._form = ht("form", t + "-list");e && (this._map.on("click", this.collapse, this), Ti || V(i, { mouseenter: this.expand, mouseleave: this.collapse }, this));var o = this._layersLink = ht("a", t + "-toggle", i);o.href = "#", o.title = "Layers", Vi ? (V(o, "click", Q), V(o, "click", this.expand, this)) : V(o, "focus", this.expand, this), e || this.expand(), this._baseLayersList = ht("div", t + "-base", n), this._separator = ht("div", t + "-separator", n), this._overlaysList = ht("div", t + "-overlays", n), i.appendChild(n);
    }, _getLayer: function _getLayer(t) {
      for (var i = 0; i < this._layers.length; i++) {
        if (this._layers[i] && n(this._layers[i].layer) === t) return this._layers[i];
      }
    }, _addLayer: function _addLayer(t, i, n) {
      this._map && t.on("add remove", this._onLayerChange, this), this._layers.push({ layer: t, name: i, overlay: n }), this.options.sortLayers && this._layers.sort(e(function (t, i) {
        return this.options.sortFunction(t.layer, i.layer, t.name, i.name);
      }, this)), this.options.autoZIndex && t.setZIndex && (this._lastZIndex++, t.setZIndex(this._lastZIndex)), this._expandIfNotCollapsed();
    }, _update: function _update() {
      if (!this._container) return this;lt(this._baseLayersList), lt(this._overlaysList), this._layerControlInputs = [];var t,
          i,
          e,
          n,
          o = 0;for (e = 0; e < this._layers.length; e++) {
        n = this._layers[e], this._addItem(n), i = i || n.overlay, t = t || !n.overlay, o += n.overlay ? 0 : 1;
      }return this.options.hideSingleBase && (t = t && o > 1, this._baseLayersList.style.display = t ? "" : "none"), this._separator.style.display = i && t ? "" : "none", this;
    }, _onLayerChange: function _onLayerChange(t) {
      this._handlingClick || this._update();var i = this._getLayer(n(t.target)),
          e = i.overlay ? "add" === t.type ? "overlayadd" : "overlayremove" : "add" === t.type ? "baselayerchange" : null;e && this._map.fire(e, i);
    }, _createRadioElement: function _createRadioElement(t, i) {
      var e = '<input type="radio" class="leaflet-control-layers-selector" name="' + t + '"' + (i ? ' checked="checked"' : "") + "/>",
          n = document.createElement("div");return n.innerHTML = e, n.firstChild;
    }, _addItem: function _addItem(t) {
      var i,
          e = document.createElement("label"),
          o = this._map.hasLayer(t.layer);t.overlay ? ((i = document.createElement("input")).type = "checkbox", i.className = "leaflet-control-layers-selector", i.defaultChecked = o) : i = this._createRadioElement("leaflet-base-layers", o), this._layerControlInputs.push(i), i.layerId = n(t.layer), V(i, "click", this._onInputClick, this);var s = document.createElement("span");s.innerHTML = " " + t.name;var r = document.createElement("div");return e.appendChild(r), r.appendChild(i), r.appendChild(s), (t.overlay ? this._overlaysList : this._baseLayersList).appendChild(e), this._checkDisabledLayers(), e;
    }, _onInputClick: function _onInputClick() {
      var t,
          i,
          e = this._layerControlInputs,
          n = [],
          o = [];this._handlingClick = !0;for (var s = e.length - 1; s >= 0; s--) {
        t = e[s], i = this._getLayer(t.layerId).layer, t.checked ? n.push(i) : t.checked || o.push(i);
      }for (s = 0; s < o.length; s++) {
        this._map.hasLayer(o[s]) && this._map.removeLayer(o[s]);
      }for (s = 0; s < n.length; s++) {
        this._map.hasLayer(n[s]) || this._map.addLayer(n[s]);
      }this._handlingClick = !1, this._refocusOnMap();
    }, _checkDisabledLayers: function _checkDisabledLayers() {
      for (var t, i, e = this._layerControlInputs, n = this._map.getZoom(), o = e.length - 1; o >= 0; o--) {
        t = e[o], i = this._getLayer(t.layerId).layer, t.disabled = void 0 !== i.options.minZoom && n < i.options.minZoom || void 0 !== i.options.maxZoom && n > i.options.maxZoom;
      }
    }, _expandIfNotCollapsed: function _expandIfNotCollapsed() {
      return this._map && !this.options.collapsed && this.expand(), this;
    }, _expand: function _expand() {
      return this.expand();
    }, _collapse: function _collapse() {
      return this.collapse();
    } }),
      ze = Pe.extend({ options: { position: "topleft", zoomInText: "+", zoomInTitle: "Zoom in", zoomOutText: "&#x2212;", zoomOutTitle: "Zoom out" }, onAdd: function onAdd(t) {
      var i = "leaflet-control-zoom",
          e = ht("div", i + " leaflet-bar"),
          n = this.options;return this._zoomInButton = this._createButton(n.zoomInText, n.zoomInTitle, i + "-in", e, this._zoomIn), this._zoomOutButton = this._createButton(n.zoomOutText, n.zoomOutTitle, i + "-out", e, this._zoomOut), this._updateDisabled(), t.on("zoomend zoomlevelschange", this._updateDisabled, this), e;
    }, onRemove: function onRemove(t) {
      t.off("zoomend zoomlevelschange", this._updateDisabled, this);
    }, disable: function disable() {
      return this._disabled = !0, this._updateDisabled(), this;
    }, enable: function enable() {
      return this._disabled = !1, this._updateDisabled(), this;
    }, _zoomIn: function _zoomIn(t) {
      !this._disabled && this._map._zoom < this._map.getMaxZoom() && this._map.zoomIn(this._map.options.zoomDelta * (t.shiftKey ? 3 : 1));
    }, _zoomOut: function _zoomOut(t) {
      !this._disabled && this._map._zoom > this._map.getMinZoom() && this._map.zoomOut(this._map.options.zoomDelta * (t.shiftKey ? 3 : 1));
    }, _createButton: function _createButton(t, i, e, n, o) {
      var s = ht("a", e, n);return s.innerHTML = t, s.href = "#", s.title = i, s.setAttribute("role", "button"), s.setAttribute("aria-label", i), J(s), V(s, "click", Q), V(s, "click", o, this), V(s, "click", this._refocusOnMap, this), s;
    }, _updateDisabled: function _updateDisabled() {
      var t = this._map,
          i = "leaflet-disabled";mt(this._zoomInButton, i), mt(this._zoomOutButton, i), (this._disabled || t._zoom === t.getMinZoom()) && pt(this._zoomOutButton, i), (this._disabled || t._zoom === t.getMaxZoom()) && pt(this._zoomInButton, i);
    } });Le.mergeOptions({ zoomControl: !0 }), Le.addInitHook(function () {
    this.options.zoomControl && (this.zoomControl = new ze(), this.addControl(this.zoomControl));
  });var Me = Pe.extend({ options: { position: "bottomleft", maxWidth: 100, metric: !0, imperial: !0 }, onAdd: function onAdd(t) {
      var i = ht("div", "leaflet-control-scale"),
          e = this.options;return this._addScales(e, "leaflet-control-scale-line", i), t.on(e.updateWhenIdle ? "moveend" : "move", this._update, this), t.whenReady(this._update, this), i;
    }, onRemove: function onRemove(t) {
      t.off(this.options.updateWhenIdle ? "moveend" : "move", this._update, this);
    }, _addScales: function _addScales(t, i, e) {
      t.metric && (this._mScale = ht("div", i, e)), t.imperial && (this._iScale = ht("div", i, e));
    }, _update: function _update() {
      var t = this._map,
          i = t.getSize().y / 2,
          e = t.distance(t.containerPointToLatLng([0, i]), t.containerPointToLatLng([this.options.maxWidth, i]));this._updateScales(e);
    }, _updateScales: function _updateScales(t) {
      this.options.metric && t && this._updateMetric(t), this.options.imperial && t && this._updateImperial(t);
    }, _updateMetric: function _updateMetric(t) {
      var i = this._getRoundNum(t),
          e = i < 1e3 ? i + " m" : i / 1e3 + " km";this._updateScale(this._mScale, e, i / t);
    }, _updateImperial: function _updateImperial(t) {
      var i,
          e,
          n,
          o = 3.2808399 * t;o > 5280 ? (i = o / 5280, e = this._getRoundNum(i), this._updateScale(this._iScale, e + " mi", e / i)) : (n = this._getRoundNum(o), this._updateScale(this._iScale, n + " ft", n / o));
    }, _updateScale: function _updateScale(t, i, e) {
      t.style.width = Math.round(this.options.maxWidth * e) + "px", t.innerHTML = i;
    }, _getRoundNum: function _getRoundNum(t) {
      var i = Math.pow(10, (Math.floor(t) + "").length - 1),
          e = t / i;return e = e >= 10 ? 10 : e >= 5 ? 5 : e >= 3 ? 3 : e >= 2 ? 2 : 1, i * e;
    } }),
      Ce = Pe.extend({ options: { position: "bottomright", prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>' }, initialize: function initialize(t) {
      l(this, t), this._attributions = {};
    }, onAdd: function onAdd(t) {
      t.attributionControl = this, this._container = ht("div", "leaflet-control-attribution"), J(this._container);for (var i in t._layers) {
        t._layers[i].getAttribution && this.addAttribution(t._layers[i].getAttribution());
      }return this._update(), this._container;
    }, setPrefix: function setPrefix(t) {
      return this.options.prefix = t, this._update(), this;
    }, addAttribution: function addAttribution(t) {
      return t ? (this._attributions[t] || (this._attributions[t] = 0), this._attributions[t]++, this._update(), this) : this;
    }, removeAttribution: function removeAttribution(t) {
      return t ? (this._attributions[t] && (this._attributions[t]--, this._update()), this) : this;
    }, _update: function _update() {
      if (this._map) {
        var t = [];for (var i in this._attributions) {
          this._attributions[i] && t.push(i);
        }var e = [];this.options.prefix && e.push(this.options.prefix), t.length && e.push(t.join(", ")), this._container.innerHTML = e.join(" | ");
      }
    } });Le.mergeOptions({ attributionControl: !0 }), Le.addInitHook(function () {
    this.options.attributionControl && new Ce().addTo(this);
  });Pe.Layers = Te, Pe.Zoom = ze, Pe.Scale = Me, Pe.Attribution = Ce, be.layers = function (t, i, e) {
    return new Te(t, i, e);
  }, be.zoom = function (t) {
    return new ze(t);
  }, be.scale = function (t) {
    return new Me(t);
  }, be.attribution = function (t) {
    return new Ce(t);
  };var Ze = v.extend({ initialize: function initialize(t) {
      this._map = t;
    }, enable: function enable() {
      return this._enabled ? this : (this._enabled = !0, this.addHooks(), this);
    }, disable: function disable() {
      return this._enabled ? (this._enabled = !1, this.removeHooks(), this) : this;
    }, enabled: function enabled() {
      return !!this._enabled;
    } });Ze.addTo = function (t, i) {
    return t.addHandler(i, this), this;
  };var Se,
      Ee = { Events: hi },
      ke = Vi ? "touchstart mousedown" : "mousedown",
      Ie = { mousedown: "mouseup", touchstart: "touchend", pointerdown: "touchend", MSPointerDown: "touchend" },
      Ae = { mousedown: "mousemove", touchstart: "touchmove", pointerdown: "touchmove", MSPointerDown: "touchmove" },
      Be = ui.extend({ options: { clickTolerance: 3 }, initialize: function initialize(t, i, e, n) {
      l(this, n), this._element = t, this._dragStartTarget = i || t, this._preventOutline = e;
    }, enable: function enable() {
      this._enabled || (V(this._dragStartTarget, ke, this._onDown, this), this._enabled = !0);
    }, disable: function disable() {
      this._enabled && (Be._dragging === this && this.finishDrag(), q(this._dragStartTarget, ke, this._onDown, this), this._enabled = !1, this._moved = !1);
    }, _onDown: function _onDown(t) {
      if (!t._simulated && this._enabled && (this._moved = !1, !dt(this._element, "leaflet-zoom-anim") && !(Be._dragging || t.shiftKey || 1 !== t.which && 1 !== t.button && !t.touches || (Be._dragging = this, this._preventOutline && zt(this._element), bt(), mi(), this._moving)))) {
        this.fire("down");var i = t.touches ? t.touches[0] : t;this._startPoint = new x(i.clientX, i.clientY), V(document, Ae[t.type], this._onMove, this), V(document, Ie[t.type], this._onUp, this);
      }
    }, _onMove: function _onMove(t) {
      if (!t._simulated && this._enabled) if (t.touches && t.touches.length > 1) this._moved = !0;else {
        var i = t.touches && 1 === t.touches.length ? t.touches[0] : t,
            e = new x(i.clientX, i.clientY).subtract(this._startPoint);(e.x || e.y) && (Math.abs(e.x) + Math.abs(e.y) < this.options.clickTolerance || ($(t), this._moved || (this.fire("dragstart"), this._moved = !0, this._startPos = Pt(this._element).subtract(e), pt(document.body, "leaflet-dragging"), this._lastTarget = t.target || t.srcElement, window.SVGElementInstance && this._lastTarget instanceof SVGElementInstance && (this._lastTarget = this._lastTarget.correspondingUseElement), pt(this._lastTarget, "leaflet-drag-target")), this._newPos = this._startPos.add(e), this._moving = !0, g(this._animRequest), this._lastEvent = t, this._animRequest = f(this._updatePosition, this, !0)));
      }
    }, _updatePosition: function _updatePosition() {
      var t = { originalEvent: this._lastEvent };this.fire("predrag", t), Lt(this._element, this._newPos), this.fire("drag", t);
    }, _onUp: function _onUp(t) {
      !t._simulated && this._enabled && this.finishDrag();
    }, finishDrag: function finishDrag() {
      mt(document.body, "leaflet-dragging"), this._lastTarget && (mt(this._lastTarget, "leaflet-drag-target"), this._lastTarget = null);for (var t in Ae) {
        q(document, Ae[t], this._onMove, this), q(document, Ie[t], this._onUp, this);
      }Tt(), fi(), this._moved && this._moving && (g(this._animRequest), this.fire("dragend", { distance: this._newPos.distanceTo(this._startPos) })), this._moving = !1, Be._dragging = !1;
    } }),
      Oe = (Object.freeze || Object)({ simplify: Ct, pointToSegmentDistance: Zt, closestPointOnSegment: function closestPointOnSegment(t, i, e) {
      return Rt(t, i, e);
    }, clipSegment: It, _getEdgeIntersection: At, _getBitCode: Bt, _sqClosestPointOnSegment: Rt, isFlat: Dt, _flat: Nt }),
      Re = (Object.freeze || Object)({ clipPolygon: jt }),
      De = { project: function project(t) {
      return new x(t.lng, t.lat);
    }, unproject: function unproject(t) {
      return new M(t.y, t.x);
    }, bounds: new P([-180, -90], [180, 90]) },
      Ne = { R: 6378137, R_MINOR: 6356752.314245179, bounds: new P([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]), project: function project(t) {
      var i = Math.PI / 180,
          e = this.R,
          n = t.lat * i,
          o = this.R_MINOR / e,
          s = Math.sqrt(1 - o * o),
          r = s * Math.sin(n),
          a = Math.tan(Math.PI / 4 - n / 2) / Math.pow((1 - r) / (1 + r), s / 2);return n = -e * Math.log(Math.max(a, 1e-10)), new x(t.lng * i * e, n);
    }, unproject: function unproject(t) {
      for (var i, e = 180 / Math.PI, n = this.R, o = this.R_MINOR / n, s = Math.sqrt(1 - o * o), r = Math.exp(-t.y / n), a = Math.PI / 2 - 2 * Math.atan(r), h = 0, u = .1; h < 15 && Math.abs(u) > 1e-7; h++) {
        i = s * Math.sin(a), i = Math.pow((1 - i) / (1 + i), s / 2), a += u = Math.PI / 2 - 2 * Math.atan(r * i) - a;
      }return new M(a * e, t.x * e / n);
    } },
      je = (Object.freeze || Object)({ LonLat: De, Mercator: Ne, SphericalMercator: di }),
      We = i({}, _i, { code: "EPSG:3395", projection: Ne, transformation: function () {
      var t = .5 / (Math.PI * Ne.R);return S(t, .5, -t, .5);
    }() }),
      He = i({}, _i, { code: "EPSG:4326", projection: De, transformation: S(1 / 180, 1, -1 / 180, .5) }),
      Fe = i({}, ci, { projection: De, transformation: S(1, 0, -1, 0), scale: function scale(t) {
      return Math.pow(2, t);
    }, zoom: function zoom(t) {
      return Math.log(t) / Math.LN2;
    }, distance: function distance(t, i) {
      var e = i.lng - t.lng,
          n = i.lat - t.lat;return Math.sqrt(e * e + n * n);
    }, infinite: !0 });ci.Earth = _i, ci.EPSG3395 = We, ci.EPSG3857 = vi, ci.EPSG900913 = yi, ci.EPSG4326 = He, ci.Simple = Fe;var Ue = ui.extend({ options: { pane: "overlayPane", attribution: null, bubblingMouseEvents: !0 }, addTo: function addTo(t) {
      return t.addLayer(this), this;
    }, remove: function remove() {
      return this.removeFrom(this._map || this._mapToAdd);
    }, removeFrom: function removeFrom(t) {
      return t && t.removeLayer(this), this;
    }, getPane: function getPane(t) {
      return this._map.getPane(t ? this.options[t] || t : this.options.pane);
    }, addInteractiveTarget: function addInteractiveTarget(t) {
      return this._map._targets[n(t)] = this, this;
    }, removeInteractiveTarget: function removeInteractiveTarget(t) {
      return delete this._map._targets[n(t)], this;
    }, getAttribution: function getAttribution() {
      return this.options.attribution;
    }, _layerAdd: function _layerAdd(t) {
      var i = t.target;if (i.hasLayer(this)) {
        if (this._map = i, this._zoomAnimated = i._zoomAnimated, this.getEvents) {
          var e = this.getEvents();i.on(e, this), this.once("remove", function () {
            i.off(e, this);
          }, this);
        }this.onAdd(i), this.getAttribution && i.attributionControl && i.attributionControl.addAttribution(this.getAttribution()), this.fire("add"), i.fire("layeradd", { layer: this });
      }
    } });Le.include({ addLayer: function addLayer(t) {
      if (!t._layerAdd) throw new Error("The provided object is not a Layer.");var i = n(t);return this._layers[i] ? this : (this._layers[i] = t, t._mapToAdd = this, t.beforeAdd && t.beforeAdd(this), this.whenReady(t._layerAdd, t), this);
    }, removeLayer: function removeLayer(t) {
      var i = n(t);return this._layers[i] ? (this._loaded && t.onRemove(this), t.getAttribution && this.attributionControl && this.attributionControl.removeAttribution(t.getAttribution()), delete this._layers[i], this._loaded && (this.fire("layerremove", { layer: t }), t.fire("remove")), t._map = t._mapToAdd = null, this) : this;
    }, hasLayer: function hasLayer(t) {
      return !!t && n(t) in this._layers;
    }, eachLayer: function eachLayer(t, i) {
      for (var e in this._layers) {
        t.call(i, this._layers[e]);
      }return this;
    }, _addLayers: function _addLayers(t) {
      for (var i = 0, e = (t = t ? ei(t) ? t : [t] : []).length; i < e; i++) {
        this.addLayer(t[i]);
      }
    }, _addZoomLimit: function _addZoomLimit(t) {
      !isNaN(t.options.maxZoom) && isNaN(t.options.minZoom) || (this._zoomBoundLayers[n(t)] = t, this._updateZoomLevels());
    }, _removeZoomLimit: function _removeZoomLimit(t) {
      var i = n(t);this._zoomBoundLayers[i] && (delete this._zoomBoundLayers[i], this._updateZoomLevels());
    }, _updateZoomLevels: function _updateZoomLevels() {
      var t = 1 / 0,
          i = -1 / 0,
          e = this._getZoomSpan();for (var n in this._zoomBoundLayers) {
        var o = this._zoomBoundLayers[n].options;t = void 0 === o.minZoom ? t : Math.min(t, o.minZoom), i = void 0 === o.maxZoom ? i : Math.max(i, o.maxZoom);
      }this._layersMaxZoom = i === -1 / 0 ? void 0 : i, this._layersMinZoom = t === 1 / 0 ? void 0 : t, e !== this._getZoomSpan() && this.fire("zoomlevelschange"), void 0 === this.options.maxZoom && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom && this.setZoom(this._layersMaxZoom), void 0 === this.options.minZoom && this._layersMinZoom && this.getZoom() < this._layersMinZoom && this.setZoom(this._layersMinZoom);
    } });var Ve = Ue.extend({ initialize: function initialize(t, i) {
      l(this, i), this._layers = {};var e, n;if (t) for (e = 0, n = t.length; e < n; e++) {
        this.addLayer(t[e]);
      }
    }, addLayer: function addLayer(t) {
      var i = this.getLayerId(t);return this._layers[i] = t, this._map && this._map.addLayer(t), this;
    }, removeLayer: function removeLayer(t) {
      var i = t in this._layers ? t : this.getLayerId(t);return this._map && this._layers[i] && this._map.removeLayer(this._layers[i]), delete this._layers[i], this;
    }, hasLayer: function hasLayer(t) {
      return !!t && (t in this._layers || this.getLayerId(t) in this._layers);
    }, clearLayers: function clearLayers() {
      return this.eachLayer(this.removeLayer, this);
    }, invoke: function invoke(t) {
      var i,
          e,
          n = Array.prototype.slice.call(arguments, 1);for (i in this._layers) {
        (e = this._layers[i])[t] && e[t].apply(e, n);
      }return this;
    }, onAdd: function onAdd(t) {
      this.eachLayer(t.addLayer, t);
    }, onRemove: function onRemove(t) {
      this.eachLayer(t.removeLayer, t);
    }, eachLayer: function eachLayer(t, i) {
      for (var e in this._layers) {
        t.call(i, this._layers[e]);
      }return this;
    }, getLayer: function getLayer(t) {
      return this._layers[t];
    }, getLayers: function getLayers() {
      var t = [];return this.eachLayer(t.push, t), t;
    }, setZIndex: function setZIndex(t) {
      return this.invoke("setZIndex", t);
    }, getLayerId: function getLayerId(t) {
      return n(t);
    } }),
      qe = Ve.extend({ addLayer: function addLayer(t) {
      return this.hasLayer(t) ? this : (t.addEventParent(this), Ve.prototype.addLayer.call(this, t), this.fire("layeradd", { layer: t }));
    }, removeLayer: function removeLayer(t) {
      return this.hasLayer(t) ? (t in this._layers && (t = this._layers[t]), t.removeEventParent(this), Ve.prototype.removeLayer.call(this, t), this.fire("layerremove", { layer: t })) : this;
    }, setStyle: function setStyle(t) {
      return this.invoke("setStyle", t);
    }, bringToFront: function bringToFront() {
      return this.invoke("bringToFront");
    }, bringToBack: function bringToBack() {
      return this.invoke("bringToBack");
    }, getBounds: function getBounds() {
      var t = new T();for (var i in this._layers) {
        var e = this._layers[i];t.extend(e.getBounds ? e.getBounds() : e.getLatLng());
      }return t;
    } }),
      Ge = v.extend({ options: { popupAnchor: [0, 0], tooltipAnchor: [0, 0] }, initialize: function initialize(t) {
      l(this, t);
    }, createIcon: function createIcon(t) {
      return this._createIcon("icon", t);
    }, createShadow: function createShadow(t) {
      return this._createIcon("shadow", t);
    }, _createIcon: function _createIcon(t, i) {
      var e = this._getIconUrl(t);if (!e) {
        if ("icon" === t) throw new Error("iconUrl not set in Icon options (see the docs).");return null;
      }var n = this._createImg(e, i && "IMG" === i.tagName ? i : null);return this._setIconStyles(n, t), n;
    }, _setIconStyles: function _setIconStyles(t, i) {
      var e = this.options,
          n = e[i + "Size"];"number" == typeof n && (n = [n, n]);var o = w(n),
          s = w("shadow" === i && e.shadowAnchor || e.iconAnchor || o && o.divideBy(2, !0));t.className = "leaflet-marker-" + i + " " + (e.className || ""), s && (t.style.marginLeft = -s.x + "px", t.style.marginTop = -s.y + "px"), o && (t.style.width = o.x + "px", t.style.height = o.y + "px");
    }, _createImg: function _createImg(t, i) {
      return i = i || document.createElement("img"), i.src = t, i;
    }, _getIconUrl: function _getIconUrl(t) {
      return Ki && this.options[t + "RetinaUrl"] || this.options[t + "Url"];
    } }),
      Ke = Ge.extend({ options: { iconUrl: "marker-icon.png", iconRetinaUrl: "marker-icon-2x.png", shadowUrl: "marker-shadow.png", iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], tooltipAnchor: [16, -28], shadowSize: [41, 41] }, _getIconUrl: function _getIconUrl(t) {
      return Ke.imagePath || (Ke.imagePath = this._detectIconPath()), (this.options.imagePath || Ke.imagePath) + Ge.prototype._getIconUrl.call(this, t);
    }, _detectIconPath: function _detectIconPath() {
      var t = ht("div", "leaflet-default-icon-path", document.body),
          i = at(t, "background-image") || at(t, "backgroundImage");return document.body.removeChild(t), i = null === i || 0 !== i.indexOf("url") ? "" : i.replace(/^url\(["']?/, "").replace(/marker-icon\.png["']?\)$/, "");
    } }),
      Ye = Ze.extend({ initialize: function initialize(t) {
      this._marker = t;
    }, addHooks: function addHooks() {
      var t = this._marker._icon;this._draggable || (this._draggable = new Be(t, t, !0)), this._draggable.on({ dragstart: this._onDragStart, predrag: this._onPreDrag, drag: this._onDrag, dragend: this._onDragEnd }, this).enable(), pt(t, "leaflet-marker-draggable");
    }, removeHooks: function removeHooks() {
      this._draggable.off({ dragstart: this._onDragStart, predrag: this._onPreDrag, drag: this._onDrag, dragend: this._onDragEnd }, this).disable(), this._marker._icon && mt(this._marker._icon, "leaflet-marker-draggable");
    }, moved: function moved() {
      return this._draggable && this._draggable._moved;
    }, _adjustPan: function _adjustPan(t) {
      var i = this._marker,
          e = i._map,
          n = this._marker.options.autoPanSpeed,
          o = this._marker.options.autoPanPadding,
          s = L.DomUtil.getPosition(i._icon),
          r = e.getPixelBounds(),
          a = e.getPixelOrigin(),
          h = b(r.min._subtract(a).add(o), r.max._subtract(a).subtract(o));if (!h.contains(s)) {
        var u = w((Math.max(h.max.x, s.x) - h.max.x) / (r.max.x - h.max.x) - (Math.min(h.min.x, s.x) - h.min.x) / (r.min.x - h.min.x), (Math.max(h.max.y, s.y) - h.max.y) / (r.max.y - h.max.y) - (Math.min(h.min.y, s.y) - h.min.y) / (r.min.y - h.min.y)).multiplyBy(n);e.panBy(u, { animate: !1 }), this._draggable._newPos._add(u), this._draggable._startPos._add(u), L.DomUtil.setPosition(i._icon, this._draggable._newPos), this._onDrag(t), this._panRequest = f(this._adjustPan.bind(this, t));
      }
    }, _onDragStart: function _onDragStart() {
      this._oldLatLng = this._marker.getLatLng(), this._marker.closePopup().fire("movestart").fire("dragstart");
    }, _onPreDrag: function _onPreDrag(t) {
      this._marker.options.autoPan && (g(this._panRequest), this._panRequest = f(this._adjustPan.bind(this, t)));
    }, _onDrag: function _onDrag(t) {
      var i = this._marker,
          e = i._shadow,
          n = Pt(i._icon),
          o = i._map.layerPointToLatLng(n);e && Lt(e, n), i._latlng = o, t.latlng = o, t.oldLatLng = this._oldLatLng, i.fire("move", t).fire("drag", t);
    }, _onDragEnd: function _onDragEnd(t) {
      g(this._panRequest), delete this._oldLatLng, this._marker.fire("moveend").fire("dragend", t);
    } }),
      Xe = Ue.extend({ options: { icon: new Ke(), interactive: !0, draggable: !1, autoPan: !1, autoPanPadding: [50, 50], autoPanSpeed: 10, keyboard: !0, title: "", alt: "", zIndexOffset: 0, opacity: 1, riseOnHover: !1, riseOffset: 250, pane: "markerPane", bubblingMouseEvents: !1 }, initialize: function initialize(t, i) {
      l(this, i), this._latlng = C(t);
    }, onAdd: function onAdd(t) {
      this._zoomAnimated = this._zoomAnimated && t.options.markerZoomAnimation, this._zoomAnimated && t.on("zoomanim", this._animateZoom, this), this._initIcon(), this.update();
    }, onRemove: function onRemove(t) {
      this.dragging && this.dragging.enabled() && (this.options.draggable = !0, this.dragging.removeHooks()), delete this.dragging, this._zoomAnimated && t.off("zoomanim", this._animateZoom, this), this._removeIcon(), this._removeShadow();
    }, getEvents: function getEvents() {
      return { zoom: this.update, viewreset: this.update };
    }, getLatLng: function getLatLng() {
      return this._latlng;
    }, setLatLng: function setLatLng(t) {
      var i = this._latlng;return this._latlng = C(t), this.update(), this.fire("move", { oldLatLng: i, latlng: this._latlng });
    }, setZIndexOffset: function setZIndexOffset(t) {
      return this.options.zIndexOffset = t, this.update();
    }, setIcon: function setIcon(t) {
      return this.options.icon = t, this._map && (this._initIcon(), this.update()), this._popup && this.bindPopup(this._popup, this._popup.options), this;
    }, getElement: function getElement() {
      return this._icon;
    }, update: function update() {
      if (this._icon && this._map) {
        var t = this._map.latLngToLayerPoint(this._latlng).round();this._setPos(t);
      }return this;
    }, _initIcon: function _initIcon() {
      var t = this.options,
          i = "leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide"),
          e = t.icon.createIcon(this._icon),
          n = !1;e !== this._icon && (this._icon && this._removeIcon(), n = !0, t.title && (e.title = t.title), "IMG" === e.tagName && (e.alt = t.alt || "")), pt(e, i), t.keyboard && (e.tabIndex = "0"), this._icon = e, t.riseOnHover && this.on({ mouseover: this._bringToFront, mouseout: this._resetZIndex });var o = t.icon.createShadow(this._shadow),
          s = !1;o !== this._shadow && (this._removeShadow(), s = !0), o && (pt(o, i), o.alt = ""), this._shadow = o, t.opacity < 1 && this._updateOpacity(), n && this.getPane().appendChild(this._icon), this._initInteraction(), o && s && this.getPane("shadowPane").appendChild(this._shadow);
    }, _removeIcon: function _removeIcon() {
      this.options.riseOnHover && this.off({ mouseover: this._bringToFront, mouseout: this._resetZIndex }), ut(this._icon), this.removeInteractiveTarget(this._icon), this._icon = null;
    }, _removeShadow: function _removeShadow() {
      this._shadow && ut(this._shadow), this._shadow = null;
    }, _setPos: function _setPos(t) {
      Lt(this._icon, t), this._shadow && Lt(this._shadow, t), this._zIndex = t.y + this.options.zIndexOffset, this._resetZIndex();
    }, _updateZIndex: function _updateZIndex(t) {
      this._icon.style.zIndex = this._zIndex + t;
    }, _animateZoom: function _animateZoom(t) {
      var i = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center).round();this._setPos(i);
    }, _initInteraction: function _initInteraction() {
      if (this.options.interactive && (pt(this._icon, "leaflet-interactive"), this.addInteractiveTarget(this._icon), Ye)) {
        var t = this.options.draggable;this.dragging && (t = this.dragging.enabled(), this.dragging.disable()), this.dragging = new Ye(this), t && this.dragging.enable();
      }
    }, setOpacity: function setOpacity(t) {
      return this.options.opacity = t, this._map && this._updateOpacity(), this;
    }, _updateOpacity: function _updateOpacity() {
      var t = this.options.opacity;vt(this._icon, t), this._shadow && vt(this._shadow, t);
    }, _bringToFront: function _bringToFront() {
      this._updateZIndex(this.options.riseOffset);
    }, _resetZIndex: function _resetZIndex() {
      this._updateZIndex(0);
    }, _getPopupAnchor: function _getPopupAnchor() {
      return this.options.icon.options.popupAnchor;
    }, _getTooltipAnchor: function _getTooltipAnchor() {
      return this.options.icon.options.tooltipAnchor;
    } }),
      Je = Ue.extend({ options: { stroke: !0, color: "#3388ff", weight: 3, opacity: 1, lineCap: "round", lineJoin: "round", dashArray: null, dashOffset: null, fill: !1, fillColor: null, fillOpacity: .2, fillRule: "evenodd", interactive: !0, bubblingMouseEvents: !0 }, beforeAdd: function beforeAdd(t) {
      this._renderer = t.getRenderer(this);
    }, onAdd: function onAdd() {
      this._renderer._initPath(this), this._reset(), this._renderer._addPath(this);
    }, onRemove: function onRemove() {
      this._renderer._removePath(this);
    }, redraw: function redraw() {
      return this._map && this._renderer._updatePath(this), this;
    }, setStyle: function setStyle(t) {
      return l(this, t), this._renderer && this._renderer._updateStyle(this), this;
    }, bringToFront: function bringToFront() {
      return this._renderer && this._renderer._bringToFront(this), this;
    }, bringToBack: function bringToBack() {
      return this._renderer && this._renderer._bringToBack(this), this;
    }, getElement: function getElement() {
      return this._path;
    }, _reset: function _reset() {
      this._project(), this._update();
    }, _clickTolerance: function _clickTolerance() {
      return (this.options.stroke ? this.options.weight / 2 : 0) + this._renderer.options.tolerance;
    } }),
      $e = Je.extend({ options: { fill: !0, radius: 10 }, initialize: function initialize(t, i) {
      l(this, i), this._latlng = C(t), this._radius = this.options.radius;
    }, setLatLng: function setLatLng(t) {
      return this._latlng = C(t), this.redraw(), this.fire("move", { latlng: this._latlng });
    }, getLatLng: function getLatLng() {
      return this._latlng;
    }, setRadius: function setRadius(t) {
      return this.options.radius = this._radius = t, this.redraw();
    }, getRadius: function getRadius() {
      return this._radius;
    }, setStyle: function setStyle(t) {
      var i = t && t.radius || this._radius;return Je.prototype.setStyle.call(this, t), this.setRadius(i), this;
    }, _project: function _project() {
      this._point = this._map.latLngToLayerPoint(this._latlng), this._updateBounds();
    }, _updateBounds: function _updateBounds() {
      var t = this._radius,
          i = this._radiusY || t,
          e = this._clickTolerance(),
          n = [t + e, i + e];this._pxBounds = new P(this._point.subtract(n), this._point.add(n));
    }, _update: function _update() {
      this._map && this._updatePath();
    }, _updatePath: function _updatePath() {
      this._renderer._updateCircle(this);
    }, _empty: function _empty() {
      return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
    }, _containsPoint: function _containsPoint(t) {
      return t.distanceTo(this._point) <= this._radius + this._clickTolerance();
    } }),
      Qe = $e.extend({ initialize: function initialize(t, e, n) {
      if ("number" == typeof e && (e = i({}, n, { radius: e })), l(this, e), this._latlng = C(t), isNaN(this.options.radius)) throw new Error("Circle radius cannot be NaN");this._mRadius = this.options.radius;
    }, setRadius: function setRadius(t) {
      return this._mRadius = t, this.redraw();
    }, getRadius: function getRadius() {
      return this._mRadius;
    }, getBounds: function getBounds() {
      var t = [this._radius, this._radiusY || this._radius];return new T(this._map.layerPointToLatLng(this._point.subtract(t)), this._map.layerPointToLatLng(this._point.add(t)));
    }, setStyle: Je.prototype.setStyle, _project: function _project() {
      var t = this._latlng.lng,
          i = this._latlng.lat,
          e = this._map,
          n = e.options.crs;if (n.distance === _i.distance) {
        var o = Math.PI / 180,
            s = this._mRadius / _i.R / o,
            r = e.project([i + s, t]),
            a = e.project([i - s, t]),
            h = r.add(a).divideBy(2),
            u = e.unproject(h).lat,
            l = Math.acos((Math.cos(s * o) - Math.sin(i * o) * Math.sin(u * o)) / (Math.cos(i * o) * Math.cos(u * o))) / o;(isNaN(l) || 0 === l) && (l = s / Math.cos(Math.PI / 180 * i)), this._point = h.subtract(e.getPixelOrigin()), this._radius = isNaN(l) ? 0 : h.x - e.project([u, t - l]).x, this._radiusY = h.y - r.y;
      } else {
        var c = n.unproject(n.project(this._latlng).subtract([this._mRadius, 0]));this._point = e.latLngToLayerPoint(this._latlng), this._radius = this._point.x - e.latLngToLayerPoint(c).x;
      }this._updateBounds();
    } }),
      tn = Je.extend({ options: { smoothFactor: 1, noClip: !1 }, initialize: function initialize(t, i) {
      l(this, i), this._setLatLngs(t);
    }, getLatLngs: function getLatLngs() {
      return this._latlngs;
    }, setLatLngs: function setLatLngs(t) {
      return this._setLatLngs(t), this.redraw();
    }, isEmpty: function isEmpty() {
      return !this._latlngs.length;
    }, closestLayerPoint: function closestLayerPoint(t) {
      for (var i, e, n = 1 / 0, o = null, s = Rt, r = 0, a = this._parts.length; r < a; r++) {
        for (var h = this._parts[r], u = 1, l = h.length; u < l; u++) {
          var c = s(t, i = h[u - 1], e = h[u], !0);c < n && (n = c, o = s(t, i, e));
        }
      }return o && (o.distance = Math.sqrt(n)), o;
    }, getCenter: function getCenter() {
      if (!this._map) throw new Error("Must add layer to map before using getCenter()");var t,
          i,
          e,
          n,
          o,
          s,
          r,
          a = this._rings[0],
          h = a.length;if (!h) return null;for (t = 0, i = 0; t < h - 1; t++) {
        i += a[t].distanceTo(a[t + 1]) / 2;
      }if (0 === i) return this._map.layerPointToLatLng(a[0]);for (t = 0, n = 0; t < h - 1; t++) {
        if (o = a[t], s = a[t + 1], e = o.distanceTo(s), (n += e) > i) return r = (n - i) / e, this._map.layerPointToLatLng([s.x - r * (s.x - o.x), s.y - r * (s.y - o.y)]);
      }
    }, getBounds: function getBounds() {
      return this._bounds;
    }, addLatLng: function addLatLng(t, i) {
      return i = i || this._defaultShape(), t = C(t), i.push(t), this._bounds.extend(t), this.redraw();
    }, _setLatLngs: function _setLatLngs(t) {
      this._bounds = new T(), this._latlngs = this._convertLatLngs(t);
    }, _defaultShape: function _defaultShape() {
      return Dt(this._latlngs) ? this._latlngs : this._latlngs[0];
    }, _convertLatLngs: function _convertLatLngs(t) {
      for (var i = [], e = Dt(t), n = 0, o = t.length; n < o; n++) {
        e ? (i[n] = C(t[n]), this._bounds.extend(i[n])) : i[n] = this._convertLatLngs(t[n]);
      }return i;
    }, _project: function _project() {
      var t = new P();this._rings = [], this._projectLatlngs(this._latlngs, this._rings, t);var i = this._clickTolerance(),
          e = new x(i, i);this._bounds.isValid() && t.isValid() && (t.min._subtract(e), t.max._add(e), this._pxBounds = t);
    }, _projectLatlngs: function _projectLatlngs(t, i, e) {
      var n,
          o,
          s = t[0] instanceof M,
          r = t.length;if (s) {
        for (o = [], n = 0; n < r; n++) {
          o[n] = this._map.latLngToLayerPoint(t[n]), e.extend(o[n]);
        }i.push(o);
      } else for (n = 0; n < r; n++) {
        this._projectLatlngs(t[n], i, e);
      }
    }, _clipPoints: function _clipPoints() {
      var t = this._renderer._bounds;if (this._parts = [], this._pxBounds && this._pxBounds.intersects(t)) if (this.options.noClip) this._parts = this._rings;else {
        var i,
            e,
            n,
            o,
            s,
            r,
            a,
            h = this._parts;for (i = 0, n = 0, o = this._rings.length; i < o; i++) {
          for (e = 0, s = (a = this._rings[i]).length; e < s - 1; e++) {
            (r = It(a[e], a[e + 1], t, e, !0)) && (h[n] = h[n] || [], h[n].push(r[0]), r[1] === a[e + 1] && e !== s - 2 || (h[n].push(r[1]), n++));
          }
        }
      }
    }, _simplifyPoints: function _simplifyPoints() {
      for (var t = this._parts, i = this.options.smoothFactor, e = 0, n = t.length; e < n; e++) {
        t[e] = Ct(t[e], i);
      }
    }, _update: function _update() {
      this._map && (this._clipPoints(), this._simplifyPoints(), this._updatePath());
    }, _updatePath: function _updatePath() {
      this._renderer._updatePoly(this);
    }, _containsPoint: function _containsPoint(t, i) {
      var e,
          n,
          o,
          s,
          r,
          a,
          h = this._clickTolerance();if (!this._pxBounds || !this._pxBounds.contains(t)) return !1;for (e = 0, s = this._parts.length; e < s; e++) {
        for (n = 0, o = (r = (a = this._parts[e]).length) - 1; n < r; o = n++) {
          if ((i || 0 !== n) && Zt(t, a[o], a[n]) <= h) return !0;
        }
      }return !1;
    } });tn._flat = Nt;var en = tn.extend({ options: { fill: !0 }, isEmpty: function isEmpty() {
      return !this._latlngs.length || !this._latlngs[0].length;
    }, getCenter: function getCenter() {
      if (!this._map) throw new Error("Must add layer to map before using getCenter()");var t,
          i,
          e,
          n,
          o,
          s,
          r,
          a,
          h,
          u = this._rings[0],
          l = u.length;if (!l) return null;for (s = r = a = 0, t = 0, i = l - 1; t < l; i = t++) {
        e = u[t], n = u[i], o = e.y * n.x - n.y * e.x, r += (e.x + n.x) * o, a += (e.y + n.y) * o, s += 3 * o;
      }return h = 0 === s ? u[0] : [r / s, a / s], this._map.layerPointToLatLng(h);
    }, _convertLatLngs: function _convertLatLngs(t) {
      var i = tn.prototype._convertLatLngs.call(this, t),
          e = i.length;return e >= 2 && i[0] instanceof M && i[0].equals(i[e - 1]) && i.pop(), i;
    }, _setLatLngs: function _setLatLngs(t) {
      tn.prototype._setLatLngs.call(this, t), Dt(this._latlngs) && (this._latlngs = [this._latlngs]);
    }, _defaultShape: function _defaultShape() {
      return Dt(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
    }, _clipPoints: function _clipPoints() {
      var t = this._renderer._bounds,
          i = this.options.weight,
          e = new x(i, i);if (t = new P(t.min.subtract(e), t.max.add(e)), this._parts = [], this._pxBounds && this._pxBounds.intersects(t)) if (this.options.noClip) this._parts = this._rings;else for (var n, o = 0, s = this._rings.length; o < s; o++) {
        (n = jt(this._rings[o], t, !0)).length && this._parts.push(n);
      }
    }, _updatePath: function _updatePath() {
      this._renderer._updatePoly(this, !0);
    }, _containsPoint: function _containsPoint(t) {
      var i,
          e,
          n,
          o,
          s,
          r,
          a,
          h,
          u = !1;if (!this._pxBounds.contains(t)) return !1;for (o = 0, a = this._parts.length; o < a; o++) {
        for (s = 0, r = (h = (i = this._parts[o]).length) - 1; s < h; r = s++) {
          e = i[s], n = i[r], e.y > t.y != n.y > t.y && t.x < (n.x - e.x) * (t.y - e.y) / (n.y - e.y) + e.x && (u = !u);
        }
      }return u || tn.prototype._containsPoint.call(this, t, !0);
    } }),
      nn = qe.extend({ initialize: function initialize(t, i) {
      l(this, i), this._layers = {}, t && this.addData(t);
    }, addData: function addData(t) {
      var i,
          e,
          n,
          o = ei(t) ? t : t.features;if (o) {
        for (i = 0, e = o.length; i < e; i++) {
          ((n = o[i]).geometries || n.geometry || n.features || n.coordinates) && this.addData(n);
        }return this;
      }var s = this.options;if (s.filter && !s.filter(t)) return this;var r = Wt(t, s);return r ? (r.feature = Gt(t), r.defaultOptions = r.options, this.resetStyle(r), s.onEachFeature && s.onEachFeature(t, r), this.addLayer(r)) : this;
    }, resetStyle: function resetStyle(t) {
      return t.options = i({}, t.defaultOptions), this._setLayerStyle(t, this.options.style), this;
    }, setStyle: function setStyle(t) {
      return this.eachLayer(function (i) {
        this._setLayerStyle(i, t);
      }, this);
    }, _setLayerStyle: function _setLayerStyle(t, i) {
      "function" == typeof i && (i = i(t.feature)), t.setStyle && t.setStyle(i);
    } }),
      on = { toGeoJSON: function toGeoJSON(t) {
      return qt(this, { type: "Point", coordinates: Ut(this.getLatLng(), t) });
    } };Xe.include(on), Qe.include(on), $e.include(on), tn.include({ toGeoJSON: function toGeoJSON(t) {
      var i = !Dt(this._latlngs),
          e = Vt(this._latlngs, i ? 1 : 0, !1, t);return qt(this, { type: (i ? "Multi" : "") + "LineString", coordinates: e });
    } }), en.include({ toGeoJSON: function toGeoJSON(t) {
      var i = !Dt(this._latlngs),
          e = i && !Dt(this._latlngs[0]),
          n = Vt(this._latlngs, e ? 2 : i ? 1 : 0, !0, t);return i || (n = [n]), qt(this, { type: (e ? "Multi" : "") + "Polygon", coordinates: n });
    } }), Ve.include({ toMultiPoint: function toMultiPoint(t) {
      var i = [];return this.eachLayer(function (e) {
        i.push(e.toGeoJSON(t).geometry.coordinates);
      }), qt(this, { type: "MultiPoint", coordinates: i });
    }, toGeoJSON: function toGeoJSON(t) {
      var i = this.feature && this.feature.geometry && this.feature.geometry.type;if ("MultiPoint" === i) return this.toMultiPoint(t);var e = "GeometryCollection" === i,
          n = [];return this.eachLayer(function (i) {
        if (i.toGeoJSON) {
          var o = i.toGeoJSON(t);if (e) n.push(o.geometry);else {
            var s = Gt(o);"FeatureCollection" === s.type ? n.push.apply(n, s.features) : n.push(s);
          }
        }
      }), e ? qt(this, { geometries: n, type: "GeometryCollection" }) : { type: "FeatureCollection", features: n };
    } });var sn = Kt,
      rn = Ue.extend({ options: { opacity: 1, alt: "", interactive: !1, crossOrigin: !1, errorOverlayUrl: "", zIndex: 1, className: "" }, initialize: function initialize(t, i, e) {
      this._url = t, this._bounds = z(i), l(this, e);
    }, onAdd: function onAdd() {
      this._image || (this._initImage(), this.options.opacity < 1 && this._updateOpacity()), this.options.interactive && (pt(this._image, "leaflet-interactive"), this.addInteractiveTarget(this._image)), this.getPane().appendChild(this._image), this._reset();
    }, onRemove: function onRemove() {
      ut(this._image), this.options.interactive && this.removeInteractiveTarget(this._image);
    }, setOpacity: function setOpacity(t) {
      return this.options.opacity = t, this._image && this._updateOpacity(), this;
    }, setStyle: function setStyle(t) {
      return t.opacity && this.setOpacity(t.opacity), this;
    }, bringToFront: function bringToFront() {
      return this._map && ct(this._image), this;
    }, bringToBack: function bringToBack() {
      return this._map && _t(this._image), this;
    }, setUrl: function setUrl(t) {
      return this._url = t, this._image && (this._image.src = t), this;
    }, setBounds: function setBounds(t) {
      return this._bounds = z(t), this._map && this._reset(), this;
    }, getEvents: function getEvents() {
      var t = { zoom: this._reset, viewreset: this._reset };return this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
    }, setZIndex: function setZIndex(t) {
      return this.options.zIndex = t, this._updateZIndex(), this;
    }, getBounds: function getBounds() {
      return this._bounds;
    }, getElement: function getElement() {
      return this._image;
    }, _initImage: function _initImage() {
      var t = "IMG" === this._url.tagName,
          i = this._image = t ? this._url : ht("img");pt(i, "leaflet-image-layer"), this._zoomAnimated && pt(i, "leaflet-zoom-animated"), this.options.className && pt(i, this.options.className), i.onselectstart = r, i.onmousemove = r, i.onload = e(this.fire, this, "load"), i.onerror = e(this._overlayOnError, this, "error"), this.options.crossOrigin && (i.crossOrigin = ""), this.options.zIndex && this._updateZIndex(), t ? this._url = i.src : (i.src = this._url, i.alt = this.options.alt);
    }, _animateZoom: function _animateZoom(t) {
      var i = this._map.getZoomScale(t.zoom),
          e = this._map._latLngBoundsToNewLayerBounds(this._bounds, t.zoom, t.center).min;wt(this._image, e, i);
    }, _reset: function _reset() {
      var t = this._image,
          i = new P(this._map.latLngToLayerPoint(this._bounds.getNorthWest()), this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
          e = i.getSize();Lt(t, i.min), t.style.width = e.x + "px", t.style.height = e.y + "px";
    }, _updateOpacity: function _updateOpacity() {
      vt(this._image, this.options.opacity);
    }, _updateZIndex: function _updateZIndex() {
      this._image && void 0 !== this.options.zIndex && null !== this.options.zIndex && (this._image.style.zIndex = this.options.zIndex);
    }, _overlayOnError: function _overlayOnError() {
      this.fire("error");var t = this.options.errorOverlayUrl;t && this._url !== t && (this._url = t, this._image.src = t);
    } }),
      an = rn.extend({ options: { autoplay: !0, loop: !0 }, _initImage: function _initImage() {
      var t = "VIDEO" === this._url.tagName,
          i = this._image = t ? this._url : ht("video");if (pt(i, "leaflet-image-layer"), this._zoomAnimated && pt(i, "leaflet-zoom-animated"), i.onselectstart = r, i.onmousemove = r, i.onloadeddata = e(this.fire, this, "load"), t) {
        for (var n = i.getElementsByTagName("source"), o = [], s = 0; s < n.length; s++) {
          o.push(n[s].src);
        }this._url = n.length > 0 ? o : [i.src];
      } else {
        ei(this._url) || (this._url = [this._url]), i.autoplay = !!this.options.autoplay, i.loop = !!this.options.loop;for (var a = 0; a < this._url.length; a++) {
          var h = ht("source");h.src = this._url[a], i.appendChild(h);
        }
      }
    } }),
      hn = Ue.extend({ options: { offset: [0, 7], className: "", pane: "popupPane" }, initialize: function initialize(t, i) {
      l(this, t), this._source = i;
    }, onAdd: function onAdd(t) {
      this._zoomAnimated = t._zoomAnimated, this._container || this._initLayout(), t._fadeAnimated && vt(this._container, 0), clearTimeout(this._removeTimeout), this.getPane().appendChild(this._container), this.update(), t._fadeAnimated && vt(this._container, 1), this.bringToFront();
    }, onRemove: function onRemove(t) {
      t._fadeAnimated ? (vt(this._container, 0), this._removeTimeout = setTimeout(e(ut, void 0, this._container), 200)) : ut(this._container);
    }, getLatLng: function getLatLng() {
      return this._latlng;
    }, setLatLng: function setLatLng(t) {
      return this._latlng = C(t), this._map && (this._updatePosition(), this._adjustPan()), this;
    }, getContent: function getContent() {
      return this._content;
    }, setContent: function setContent(t) {
      return this._content = t, this.update(), this;
    }, getElement: function getElement() {
      return this._container;
    }, update: function update() {
      this._map && (this._container.style.visibility = "hidden", this._updateContent(), this._updateLayout(), this._updatePosition(), this._container.style.visibility = "", this._adjustPan());
    }, getEvents: function getEvents() {
      var t = { zoom: this._updatePosition, viewreset: this._updatePosition };return this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
    }, isOpen: function isOpen() {
      return !!this._map && this._map.hasLayer(this);
    }, bringToFront: function bringToFront() {
      return this._map && ct(this._container), this;
    }, bringToBack: function bringToBack() {
      return this._map && _t(this._container), this;
    }, _updateContent: function _updateContent() {
      if (this._content) {
        var t = this._contentNode,
            i = "function" == typeof this._content ? this._content(this._source || this) : this._content;if ("string" == typeof i) t.innerHTML = i;else {
          for (; t.hasChildNodes();) {
            t.removeChild(t.firstChild);
          }t.appendChild(i);
        }this.fire("contentupdate");
      }
    }, _updatePosition: function _updatePosition() {
      if (this._map) {
        var t = this._map.latLngToLayerPoint(this._latlng),
            i = w(this.options.offset),
            e = this._getAnchor();this._zoomAnimated ? Lt(this._container, t.add(e)) : i = i.add(t).add(e);var n = this._containerBottom = -i.y,
            o = this._containerLeft = -Math.round(this._containerWidth / 2) + i.x;this._container.style.bottom = n + "px", this._container.style.left = o + "px";
      }
    }, _getAnchor: function _getAnchor() {
      return [0, 0];
    } }),
      un = hn.extend({ options: { maxWidth: 300, minWidth: 50, maxHeight: null, autoPan: !0, autoPanPaddingTopLeft: null, autoPanPaddingBottomRight: null, autoPanPadding: [5, 5], keepInView: !1, closeButton: !0, autoClose: !0, closeOnEscapeKey: !0, className: "" }, openOn: function openOn(t) {
      return t.openPopup(this), this;
    }, onAdd: function onAdd(t) {
      hn.prototype.onAdd.call(this, t), t.fire("popupopen", { popup: this }), this._source && (this._source.fire("popupopen", { popup: this }, !0), this._source instanceof Je || this._source.on("preclick", Y));
    }, onRemove: function onRemove(t) {
      hn.prototype.onRemove.call(this, t), t.fire("popupclose", { popup: this }), this._source && (this._source.fire("popupclose", { popup: this }, !0), this._source instanceof Je || this._source.off("preclick", Y));
    }, getEvents: function getEvents() {
      var t = hn.prototype.getEvents.call(this);return (void 0 !== this.options.closeOnClick ? this.options.closeOnClick : this._map.options.closePopupOnClick) && (t.preclick = this._close), this.options.keepInView && (t.moveend = this._adjustPan), t;
    }, _close: function _close() {
      this._map && this._map.closePopup(this);
    }, _initLayout: function _initLayout() {
      var t = "leaflet-popup",
          i = this._container = ht("div", t + " " + (this.options.className || "") + " leaflet-zoom-animated"),
          e = this._wrapper = ht("div", t + "-content-wrapper", i);if (this._contentNode = ht("div", t + "-content", e), J(e), X(this._contentNode), V(e, "contextmenu", Y), this._tipContainer = ht("div", t + "-tip-container", i), this._tip = ht("div", t + "-tip", this._tipContainer), this.options.closeButton) {
        var n = this._closeButton = ht("a", t + "-close-button", i);n.href = "#close", n.innerHTML = "&#215;", V(n, "click", this._onCloseButtonClick, this);
      }
    }, _updateLayout: function _updateLayout() {
      var t = this._contentNode,
          i = t.style;i.width = "", i.whiteSpace = "nowrap";var e = t.offsetWidth;e = Math.min(e, this.options.maxWidth), e = Math.max(e, this.options.minWidth), i.width = e + 1 + "px", i.whiteSpace = "", i.height = "";var n = t.offsetHeight,
          o = this.options.maxHeight;o && n > o ? (i.height = o + "px", pt(t, "leaflet-popup-scrolled")) : mt(t, "leaflet-popup-scrolled"), this._containerWidth = this._container.offsetWidth;
    }, _animateZoom: function _animateZoom(t) {
      var i = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center),
          e = this._getAnchor();Lt(this._container, i.add(e));
    }, _adjustPan: function _adjustPan() {
      if (!(!this.options.autoPan || this._map._panAnim && this._map._panAnim._inProgress)) {
        var t = this._map,
            i = parseInt(at(this._container, "marginBottom"), 10) || 0,
            e = this._container.offsetHeight + i,
            n = this._containerWidth,
            o = new x(this._containerLeft, -e - this._containerBottom);o._add(Pt(this._container));var s = t.layerPointToContainerPoint(o),
            r = w(this.options.autoPanPadding),
            a = w(this.options.autoPanPaddingTopLeft || r),
            h = w(this.options.autoPanPaddingBottomRight || r),
            u = t.getSize(),
            l = 0,
            c = 0;s.x + n + h.x > u.x && (l = s.x + n - u.x + h.x), s.x - l - a.x < 0 && (l = s.x - a.x), s.y + e + h.y > u.y && (c = s.y + e - u.y + h.y), s.y - c - a.y < 0 && (c = s.y - a.y), (l || c) && t.fire("autopanstart").panBy([l, c]);
      }
    }, _onCloseButtonClick: function _onCloseButtonClick(t) {
      this._close(), Q(t);
    }, _getAnchor: function _getAnchor() {
      return w(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
    } });Le.mergeOptions({ closePopupOnClick: !0 }), Le.include({ openPopup: function openPopup(t, i, e) {
      return t instanceof un || (t = new un(e).setContent(t)), i && t.setLatLng(i), this.hasLayer(t) ? this : (this._popup && this._popup.options.autoClose && this.closePopup(), this._popup = t, this.addLayer(t));
    }, closePopup: function closePopup(t) {
      return t && t !== this._popup || (t = this._popup, this._popup = null), t && this.removeLayer(t), this;
    } }), Ue.include({ bindPopup: function bindPopup(t, i) {
      return t instanceof un ? (l(t, i), this._popup = t, t._source = this) : (this._popup && !i || (this._popup = new un(i, this)), this._popup.setContent(t)), this._popupHandlersAdded || (this.on({ click: this._openPopup, keypress: this._onKeyPress, remove: this.closePopup, move: this._movePopup }), this._popupHandlersAdded = !0), this;
    }, unbindPopup: function unbindPopup() {
      return this._popup && (this.off({ click: this._openPopup, keypress: this._onKeyPress, remove: this.closePopup, move: this._movePopup }), this._popupHandlersAdded = !1, this._popup = null), this;
    }, openPopup: function openPopup(t, i) {
      if (t instanceof Ue || (i = t, t = this), t instanceof qe) for (var e in this._layers) {
        t = this._layers[e];break;
      }return i || (i = t.getCenter ? t.getCenter() : t.getLatLng()), this._popup && this._map && (this._popup._source = t, this._popup.update(), this._map.openPopup(this._popup, i)), this;
    }, closePopup: function closePopup() {
      return this._popup && this._popup._close(), this;
    }, togglePopup: function togglePopup(t) {
      return this._popup && (this._popup._map ? this.closePopup() : this.openPopup(t)), this;
    }, isPopupOpen: function isPopupOpen() {
      return !!this._popup && this._popup.isOpen();
    }, setPopupContent: function setPopupContent(t) {
      return this._popup && this._popup.setContent(t), this;
    }, getPopup: function getPopup() {
      return this._popup;
    }, _openPopup: function _openPopup(t) {
      var i = t.layer || t.target;this._popup && this._map && (Q(t), i instanceof Je ? this.openPopup(t.layer || t.target, t.latlng) : this._map.hasLayer(this._popup) && this._popup._source === i ? this.closePopup() : this.openPopup(i, t.latlng));
    }, _movePopup: function _movePopup(t) {
      this._popup.setLatLng(t.latlng);
    }, _onKeyPress: function _onKeyPress(t) {
      13 === t.originalEvent.keyCode && this._openPopup(t);
    } });var ln = hn.extend({ options: { pane: "tooltipPane", offset: [0, 0], direction: "auto", permanent: !1, sticky: !1, interactive: !1, opacity: .9 }, onAdd: function onAdd(t) {
      hn.prototype.onAdd.call(this, t), this.setOpacity(this.options.opacity), t.fire("tooltipopen", { tooltip: this }), this._source && this._source.fire("tooltipopen", { tooltip: this }, !0);
    }, onRemove: function onRemove(t) {
      hn.prototype.onRemove.call(this, t), t.fire("tooltipclose", { tooltip: this }), this._source && this._source.fire("tooltipclose", { tooltip: this }, !0);
    }, getEvents: function getEvents() {
      var t = hn.prototype.getEvents.call(this);return Vi && !this.options.permanent && (t.preclick = this._close), t;
    }, _close: function _close() {
      this._map && this._map.closeTooltip(this);
    }, _initLayout: function _initLayout() {
      var t = "leaflet-tooltip " + (this.options.className || "") + " leaflet-zoom-" + (this._zoomAnimated ? "animated" : "hide");this._contentNode = this._container = ht("div", t);
    }, _updateLayout: function _updateLayout() {}, _adjustPan: function _adjustPan() {}, _setPosition: function _setPosition(t) {
      var i = this._map,
          e = this._container,
          n = i.latLngToContainerPoint(i.getCenter()),
          o = i.layerPointToContainerPoint(t),
          s = this.options.direction,
          r = e.offsetWidth,
          a = e.offsetHeight,
          h = w(this.options.offset),
          u = this._getAnchor();"top" === s ? t = t.add(w(-r / 2 + h.x, -a + h.y + u.y, !0)) : "bottom" === s ? t = t.subtract(w(r / 2 - h.x, -h.y, !0)) : "center" === s ? t = t.subtract(w(r / 2 + h.x, a / 2 - u.y + h.y, !0)) : "right" === s || "auto" === s && o.x < n.x ? (s = "right", t = t.add(w(h.x + u.x, u.y - a / 2 + h.y, !0))) : (s = "left", t = t.subtract(w(r + u.x - h.x, a / 2 - u.y - h.y, !0))), mt(e, "leaflet-tooltip-right"), mt(e, "leaflet-tooltip-left"), mt(e, "leaflet-tooltip-top"), mt(e, "leaflet-tooltip-bottom"), pt(e, "leaflet-tooltip-" + s), Lt(e, t);
    }, _updatePosition: function _updatePosition() {
      var t = this._map.latLngToLayerPoint(this._latlng);this._setPosition(t);
    }, setOpacity: function setOpacity(t) {
      this.options.opacity = t, this._container && vt(this._container, t);
    }, _animateZoom: function _animateZoom(t) {
      var i = this._map._latLngToNewLayerPoint(this._latlng, t.zoom, t.center);this._setPosition(i);
    }, _getAnchor: function _getAnchor() {
      return w(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
    } });Le.include({ openTooltip: function openTooltip(t, i, e) {
      return t instanceof ln || (t = new ln(e).setContent(t)), i && t.setLatLng(i), this.hasLayer(t) ? this : this.addLayer(t);
    }, closeTooltip: function closeTooltip(t) {
      return t && this.removeLayer(t), this;
    } }), Ue.include({ bindTooltip: function bindTooltip(t, i) {
      return t instanceof ln ? (l(t, i), this._tooltip = t, t._source = this) : (this._tooltip && !i || (this._tooltip = new ln(i, this)), this._tooltip.setContent(t)), this._initTooltipInteractions(), this._tooltip.options.permanent && this._map && this._map.hasLayer(this) && this.openTooltip(), this;
    }, unbindTooltip: function unbindTooltip() {
      return this._tooltip && (this._initTooltipInteractions(!0), this.closeTooltip(), this._tooltip = null), this;
    }, _initTooltipInteractions: function _initTooltipInteractions(t) {
      if (t || !this._tooltipHandlersAdded) {
        var i = t ? "off" : "on",
            e = { remove: this.closeTooltip, move: this._moveTooltip };this._tooltip.options.permanent ? e.add = this._openTooltip : (e.mouseover = this._openTooltip, e.mouseout = this.closeTooltip, this._tooltip.options.sticky && (e.mousemove = this._moveTooltip), Vi && (e.click = this._openTooltip)), this[i](e), this._tooltipHandlersAdded = !t;
      }
    }, openTooltip: function openTooltip(t, i) {
      if (t instanceof Ue || (i = t, t = this), t instanceof qe) for (var e in this._layers) {
        t = this._layers[e];break;
      }return i || (i = t.getCenter ? t.getCenter() : t.getLatLng()), this._tooltip && this._map && (this._tooltip._source = t, this._tooltip.update(), this._map.openTooltip(this._tooltip, i), this._tooltip.options.interactive && this._tooltip._container && (pt(this._tooltip._container, "leaflet-clickable"), this.addInteractiveTarget(this._tooltip._container))), this;
    }, closeTooltip: function closeTooltip() {
      return this._tooltip && (this._tooltip._close(), this._tooltip.options.interactive && this._tooltip._container && (mt(this._tooltip._container, "leaflet-clickable"), this.removeInteractiveTarget(this._tooltip._container))), this;
    }, toggleTooltip: function toggleTooltip(t) {
      return this._tooltip && (this._tooltip._map ? this.closeTooltip() : this.openTooltip(t)), this;
    }, isTooltipOpen: function isTooltipOpen() {
      return this._tooltip.isOpen();
    }, setTooltipContent: function setTooltipContent(t) {
      return this._tooltip && this._tooltip.setContent(t), this;
    }, getTooltip: function getTooltip() {
      return this._tooltip;
    }, _openTooltip: function _openTooltip(t) {
      var i = t.layer || t.target;this._tooltip && this._map && this.openTooltip(i, this._tooltip.options.sticky ? t.latlng : void 0);
    }, _moveTooltip: function _moveTooltip(t) {
      var i,
          e,
          n = t.latlng;this._tooltip.options.sticky && t.originalEvent && (i = this._map.mouseEventToContainerPoint(t.originalEvent), e = this._map.containerPointToLayerPoint(i), n = this._map.layerPointToLatLng(e)), this._tooltip.setLatLng(n);
    } });var cn = Ge.extend({ options: { iconSize: [12, 12], html: !1, bgPos: null, className: "leaflet-div-icon" }, createIcon: function createIcon(t) {
      var i = t && "DIV" === t.tagName ? t : document.createElement("div"),
          e = this.options;if (i.innerHTML = !1 !== e.html ? e.html : "", e.bgPos) {
        var n = w(e.bgPos);i.style.backgroundPosition = -n.x + "px " + -n.y + "px";
      }return this._setIconStyles(i, "icon"), i;
    }, createShadow: function createShadow() {
      return null;
    } });Ge.Default = Ke;var _n = Ue.extend({ options: { tileSize: 256, opacity: 1, updateWhenIdle: ji, updateWhenZooming: !0, updateInterval: 200, zIndex: 1, bounds: null, minZoom: 0, maxZoom: void 0, maxNativeZoom: void 0, minNativeZoom: void 0, noWrap: !1, pane: "tilePane", className: "", keepBuffer: 2 }, initialize: function initialize(t) {
      l(this, t);
    }, onAdd: function onAdd() {
      this._initContainer(), this._levels = {}, this._tiles = {}, this._resetView(), this._update();
    }, beforeAdd: function beforeAdd(t) {
      t._addZoomLimit(this);
    }, onRemove: function onRemove(t) {
      this._removeAllTiles(), ut(this._container), t._removeZoomLimit(this), this._container = null, this._tileZoom = void 0;
    }, bringToFront: function bringToFront() {
      return this._map && (ct(this._container), this._setAutoZIndex(Math.max)), this;
    }, bringToBack: function bringToBack() {
      return this._map && (_t(this._container), this._setAutoZIndex(Math.min)), this;
    }, getContainer: function getContainer() {
      return this._container;
    }, setOpacity: function setOpacity(t) {
      return this.options.opacity = t, this._updateOpacity(), this;
    }, setZIndex: function setZIndex(t) {
      return this.options.zIndex = t, this._updateZIndex(), this;
    }, isLoading: function isLoading() {
      return this._loading;
    }, redraw: function redraw() {
      return this._map && (this._removeAllTiles(), this._update()), this;
    }, getEvents: function getEvents() {
      var t = { viewprereset: this._invalidateAll, viewreset: this._resetView, zoom: this._resetView, moveend: this._onMoveEnd };return this.options.updateWhenIdle || (this._onMove || (this._onMove = o(this._onMoveEnd, this.options.updateInterval, this)), t.move = this._onMove), this._zoomAnimated && (t.zoomanim = this._animateZoom), t;
    }, createTile: function createTile() {
      return document.createElement("div");
    }, getTileSize: function getTileSize() {
      var t = this.options.tileSize;return t instanceof x ? t : new x(t, t);
    }, _updateZIndex: function _updateZIndex() {
      this._container && void 0 !== this.options.zIndex && null !== this.options.zIndex && (this._container.style.zIndex = this.options.zIndex);
    }, _setAutoZIndex: function _setAutoZIndex(t) {
      for (var i, e = this.getPane().children, n = -t(-1 / 0, 1 / 0), o = 0, s = e.length; o < s; o++) {
        i = e[o].style.zIndex, e[o] !== this._container && i && (n = t(n, +i));
      }isFinite(n) && (this.options.zIndex = n + t(-1, 1), this._updateZIndex());
    }, _updateOpacity: function _updateOpacity() {
      if (this._map && !Li) {
        vt(this._container, this.options.opacity);var t = +new Date(),
            i = !1,
            e = !1;for (var n in this._tiles) {
          var o = this._tiles[n];if (o.current && o.loaded) {
            var s = Math.min(1, (t - o.loaded) / 200);vt(o.el, s), s < 1 ? i = !0 : (o.active ? e = !0 : this._onOpaqueTile(o), o.active = !0);
          }
        }e && !this._noPrune && this._pruneTiles(), i && (g(this._fadeFrame), this._fadeFrame = f(this._updateOpacity, this));
      }
    }, _onOpaqueTile: r, _initContainer: function _initContainer() {
      this._container || (this._container = ht("div", "leaflet-layer " + (this.options.className || "")), this._updateZIndex(), this.options.opacity < 1 && this._updateOpacity(), this.getPane().appendChild(this._container));
    }, _updateLevels: function _updateLevels() {
      var t = this._tileZoom,
          i = this.options.maxZoom;if (void 0 !== t) {
        for (var e in this._levels) {
          this._levels[e].el.children.length || e === t ? (this._levels[e].el.style.zIndex = i - Math.abs(t - e), this._onUpdateLevel(e)) : (ut(this._levels[e].el), this._removeTilesAtZoom(e), this._onRemoveLevel(e), delete this._levels[e]);
        }var n = this._levels[t],
            o = this._map;return n || ((n = this._levels[t] = {}).el = ht("div", "leaflet-tile-container leaflet-zoom-animated", this._container), n.el.style.zIndex = i, n.origin = o.project(o.unproject(o.getPixelOrigin()), t).round(), n.zoom = t, this._setZoomTransform(n, o.getCenter(), o.getZoom()), n.el.offsetWidth, this._onCreateLevel(n)), this._level = n, n;
      }
    }, _onUpdateLevel: r, _onRemoveLevel: r, _onCreateLevel: r, _pruneTiles: function _pruneTiles() {
      if (this._map) {
        var t,
            i,
            e = this._map.getZoom();if (e > this.options.maxZoom || e < this.options.minZoom) this._removeAllTiles();else {
          for (t in this._tiles) {
            (i = this._tiles[t]).retain = i.current;
          }for (t in this._tiles) {
            if ((i = this._tiles[t]).current && !i.active) {
              var n = i.coords;this._retainParent(n.x, n.y, n.z, n.z - 5) || this._retainChildren(n.x, n.y, n.z, n.z + 2);
            }
          }for (t in this._tiles) {
            this._tiles[t].retain || this._removeTile(t);
          }
        }
      }
    }, _removeTilesAtZoom: function _removeTilesAtZoom(t) {
      for (var i in this._tiles) {
        this._tiles[i].coords.z === t && this._removeTile(i);
      }
    }, _removeAllTiles: function _removeAllTiles() {
      for (var t in this._tiles) {
        this._removeTile(t);
      }
    }, _invalidateAll: function _invalidateAll() {
      for (var t in this._levels) {
        ut(this._levels[t].el), this._onRemoveLevel(t), delete this._levels[t];
      }this._removeAllTiles(), this._tileZoom = void 0;
    }, _retainParent: function _retainParent(t, i, e, n) {
      var o = Math.floor(t / 2),
          s = Math.floor(i / 2),
          r = e - 1,
          a = new x(+o, +s);a.z = +r;var h = this._tileCoordsToKey(a),
          u = this._tiles[h];return u && u.active ? (u.retain = !0, !0) : (u && u.loaded && (u.retain = !0), r > n && this._retainParent(o, s, r, n));
    }, _retainChildren: function _retainChildren(t, i, e, n) {
      for (var o = 2 * t; o < 2 * t + 2; o++) {
        for (var s = 2 * i; s < 2 * i + 2; s++) {
          var r = new x(o, s);r.z = e + 1;var a = this._tileCoordsToKey(r),
              h = this._tiles[a];h && h.active ? h.retain = !0 : (h && h.loaded && (h.retain = !0), e + 1 < n && this._retainChildren(o, s, e + 1, n));
        }
      }
    }, _resetView: function _resetView(t) {
      var i = t && (t.pinch || t.flyTo);this._setView(this._map.getCenter(), this._map.getZoom(), i, i);
    }, _animateZoom: function _animateZoom(t) {
      this._setView(t.center, t.zoom, !0, t.noUpdate);
    }, _clampZoom: function _clampZoom(t) {
      var i = this.options;return void 0 !== i.minNativeZoom && t < i.minNativeZoom ? i.minNativeZoom : void 0 !== i.maxNativeZoom && i.maxNativeZoom < t ? i.maxNativeZoom : t;
    }, _setView: function _setView(t, i, e, n) {
      var o = this._clampZoom(Math.round(i));(void 0 !== this.options.maxZoom && o > this.options.maxZoom || void 0 !== this.options.minZoom && o < this.options.minZoom) && (o = void 0);var s = this.options.updateWhenZooming && o !== this._tileZoom;n && !s || (this._tileZoom = o, this._abortLoading && this._abortLoading(), this._updateLevels(), this._resetGrid(), void 0 !== o && this._update(t), e || this._pruneTiles(), this._noPrune = !!e), this._setZoomTransforms(t, i);
    }, _setZoomTransforms: function _setZoomTransforms(t, i) {
      for (var e in this._levels) {
        this._setZoomTransform(this._levels[e], t, i);
      }
    }, _setZoomTransform: function _setZoomTransform(t, i, e) {
      var n = this._map.getZoomScale(e, t.zoom),
          o = t.origin.multiplyBy(n).subtract(this._map._getNewPixelOrigin(i, e)).round();Ni ? wt(t.el, o, n) : Lt(t.el, o);
    }, _resetGrid: function _resetGrid() {
      var t = this._map,
          i = t.options.crs,
          e = this._tileSize = this.getTileSize(),
          n = this._tileZoom,
          o = this._map.getPixelWorldBounds(this._tileZoom);o && (this._globalTileRange = this._pxBoundsToTileRange(o)), this._wrapX = i.wrapLng && !this.options.noWrap && [Math.floor(t.project([0, i.wrapLng[0]], n).x / e.x), Math.ceil(t.project([0, i.wrapLng[1]], n).x / e.y)], this._wrapY = i.wrapLat && !this.options.noWrap && [Math.floor(t.project([i.wrapLat[0], 0], n).y / e.x), Math.ceil(t.project([i.wrapLat[1], 0], n).y / e.y)];
    }, _onMoveEnd: function _onMoveEnd() {
      this._map && !this._map._animatingZoom && this._update();
    }, _getTiledPixelBounds: function _getTiledPixelBounds(t) {
      var i = this._map,
          e = i._animatingZoom ? Math.max(i._animateToZoom, i.getZoom()) : i.getZoom(),
          n = i.getZoomScale(e, this._tileZoom),
          o = i.project(t, this._tileZoom).floor(),
          s = i.getSize().divideBy(2 * n);return new P(o.subtract(s), o.add(s));
    }, _update: function _update(t) {
      var i = this._map;if (i) {
        var e = this._clampZoom(i.getZoom());if (void 0 === t && (t = i.getCenter()), void 0 !== this._tileZoom) {
          var n = this._getTiledPixelBounds(t),
              o = this._pxBoundsToTileRange(n),
              s = o.getCenter(),
              r = [],
              a = this.options.keepBuffer,
              h = new P(o.getBottomLeft().subtract([a, -a]), o.getTopRight().add([a, -a]));if (!(isFinite(o.min.x) && isFinite(o.min.y) && isFinite(o.max.x) && isFinite(o.max.y))) throw new Error("Attempted to load an infinite number of tiles");for (var u in this._tiles) {
            var l = this._tiles[u].coords;l.z === this._tileZoom && h.contains(new x(l.x, l.y)) || (this._tiles[u].current = !1);
          }if (Math.abs(e - this._tileZoom) > 1) this._setView(t, e);else {
            for (var c = o.min.y; c <= o.max.y; c++) {
              for (var _ = o.min.x; _ <= o.max.x; _++) {
                var d = new x(_, c);if (d.z = this._tileZoom, this._isValidTile(d)) {
                  var p = this._tiles[this._tileCoordsToKey(d)];p ? p.current = !0 : r.push(d);
                }
              }
            }if (r.sort(function (t, i) {
              return t.distanceTo(s) - i.distanceTo(s);
            }), 0 !== r.length) {
              this._loading || (this._loading = !0, this.fire("loading"));var m = document.createDocumentFragment();for (_ = 0; _ < r.length; _++) {
                this._addTile(r[_], m);
              }this._level.el.appendChild(m);
            }
          }
        }
      }
    }, _isValidTile: function _isValidTile(t) {
      var i = this._map.options.crs;if (!i.infinite) {
        var e = this._globalTileRange;if (!i.wrapLng && (t.x < e.min.x || t.x > e.max.x) || !i.wrapLat && (t.y < e.min.y || t.y > e.max.y)) return !1;
      }if (!this.options.bounds) return !0;var n = this._tileCoordsToBounds(t);return z(this.options.bounds).overlaps(n);
    }, _keyToBounds: function _keyToBounds(t) {
      return this._tileCoordsToBounds(this._keyToTileCoords(t));
    }, _tileCoordsToNwSe: function _tileCoordsToNwSe(t) {
      var i = this._map,
          e = this.getTileSize(),
          n = t.scaleBy(e),
          o = n.add(e);return [i.unproject(n, t.z), i.unproject(o, t.z)];
    }, _tileCoordsToBounds: function _tileCoordsToBounds(t) {
      var i = this._tileCoordsToNwSe(t),
          e = new T(i[0], i[1]);return this.options.noWrap || (e = this._map.wrapLatLngBounds(e)), e;
    }, _tileCoordsToKey: function _tileCoordsToKey(t) {
      return t.x + ":" + t.y + ":" + t.z;
    }, _keyToTileCoords: function _keyToTileCoords(t) {
      var i = t.split(":"),
          e = new x(+i[0], +i[1]);return e.z = +i[2], e;
    }, _removeTile: function _removeTile(t) {
      var i = this._tiles[t];i && (Ci || i.el.setAttribute("src", ni), ut(i.el), delete this._tiles[t], this.fire("tileunload", { tile: i.el, coords: this._keyToTileCoords(t) }));
    }, _initTile: function _initTile(t) {
      pt(t, "leaflet-tile");var i = this.getTileSize();t.style.width = i.x + "px", t.style.height = i.y + "px", t.onselectstart = r, t.onmousemove = r, Li && this.options.opacity < 1 && vt(t, this.options.opacity), Ti && !zi && (t.style.WebkitBackfaceVisibility = "hidden");
    }, _addTile: function _addTile(t, i) {
      var n = this._getTilePos(t),
          o = this._tileCoordsToKey(t),
          s = this.createTile(this._wrapCoords(t), e(this._tileReady, this, t));this._initTile(s), this.createTile.length < 2 && f(e(this._tileReady, this, t, null, s)), Lt(s, n), this._tiles[o] = { el: s, coords: t, current: !0 }, i.appendChild(s), this.fire("tileloadstart", { tile: s, coords: t });
    }, _tileReady: function _tileReady(t, i, n) {
      if (this._map) {
        i && this.fire("tileerror", { error: i, tile: n, coords: t });var o = this._tileCoordsToKey(t);(n = this._tiles[o]) && (n.loaded = +new Date(), this._map._fadeAnimated ? (vt(n.el, 0), g(this._fadeFrame), this._fadeFrame = f(this._updateOpacity, this)) : (n.active = !0, this._pruneTiles()), i || (pt(n.el, "leaflet-tile-loaded"), this.fire("tileload", { tile: n.el, coords: t })), this._noTilesToLoad() && (this._loading = !1, this.fire("load"), Li || !this._map._fadeAnimated ? f(this._pruneTiles, this) : setTimeout(e(this._pruneTiles, this), 250)));
      }
    }, _getTilePos: function _getTilePos(t) {
      return t.scaleBy(this.getTileSize()).subtract(this._level.origin);
    }, _wrapCoords: function _wrapCoords(t) {
      var i = new x(this._wrapX ? s(t.x, this._wrapX) : t.x, this._wrapY ? s(t.y, this._wrapY) : t.y);return i.z = t.z, i;
    }, _pxBoundsToTileRange: function _pxBoundsToTileRange(t) {
      var i = this.getTileSize();return new P(t.min.unscaleBy(i).floor(), t.max.unscaleBy(i).ceil().subtract([1, 1]));
    }, _noTilesToLoad: function _noTilesToLoad() {
      for (var t in this._tiles) {
        if (!this._tiles[t].loaded) return !1;
      }return !0;
    } }),
      dn = _n.extend({ options: { minZoom: 0, maxZoom: 18, subdomains: "abc", errorTileUrl: "", zoomOffset: 0, tms: !1, zoomReverse: !1, detectRetina: !1, crossOrigin: !1 }, initialize: function initialize(t, i) {
      this._url = t, (i = l(this, i)).detectRetina && Ki && i.maxZoom > 0 && (i.tileSize = Math.floor(i.tileSize / 2), i.zoomReverse ? (i.zoomOffset--, i.minZoom++) : (i.zoomOffset++, i.maxZoom--), i.minZoom = Math.max(0, i.minZoom)), "string" == typeof i.subdomains && (i.subdomains = i.subdomains.split("")), Ti || this.on("tileunload", this._onTileRemove);
    }, setUrl: function setUrl(t, i) {
      return this._url = t, i || this.redraw(), this;
    }, createTile: function createTile(t, i) {
      var n = document.createElement("img");return V(n, "load", e(this._tileOnLoad, this, i, n)), V(n, "error", e(this._tileOnError, this, i, n)), this.options.crossOrigin && (n.crossOrigin = ""), n.alt = "", n.setAttribute("role", "presentation"), n.src = this.getTileUrl(t), n;
    }, getTileUrl: function getTileUrl(t) {
      var e = { r: Ki ? "@2x" : "", s: this._getSubdomain(t), x: t.x, y: t.y, z: this._getZoomForUrl() };if (this._map && !this._map.options.crs.infinite) {
        var n = this._globalTileRange.max.y - t.y;this.options.tms && (e.y = n), e["-y"] = n;
      }return _(this._url, i(e, this.options));
    }, _tileOnLoad: function _tileOnLoad(t, i) {
      Li ? setTimeout(e(t, this, null, i), 0) : t(null, i);
    }, _tileOnError: function _tileOnError(t, i, e) {
      var n = this.options.errorTileUrl;n && i.getAttribute("src") !== n && (i.src = n), t(e, i);
    }, _onTileRemove: function _onTileRemove(t) {
      t.tile.onload = null;
    }, _getZoomForUrl: function _getZoomForUrl() {
      var t = this._tileZoom,
          i = this.options.maxZoom,
          e = this.options.zoomReverse,
          n = this.options.zoomOffset;return e && (t = i - t), t + n;
    }, _getSubdomain: function _getSubdomain(t) {
      var i = Math.abs(t.x + t.y) % this.options.subdomains.length;return this.options.subdomains[i];
    }, _abortLoading: function _abortLoading() {
      var t, i;for (t in this._tiles) {
        this._tiles[t].coords.z !== this._tileZoom && ((i = this._tiles[t].el).onload = r, i.onerror = r, i.complete || (i.src = ni, ut(i), delete this._tiles[t]));
      }
    } }),
      pn = dn.extend({ defaultWmsParams: { service: "WMS", request: "GetMap", layers: "", styles: "", format: "image/jpeg", transparent: !1, version: "1.1.1" }, options: { crs: null, uppercase: !1 }, initialize: function initialize(t, e) {
      this._url = t;var n = i({}, this.defaultWmsParams);for (var o in e) {
        o in this.options || (n[o] = e[o]);
      }var s = (e = l(this, e)).detectRetina && Ki ? 2 : 1,
          r = this.getTileSize();n.width = r.x * s, n.height = r.y * s, this.wmsParams = n;
    }, onAdd: function onAdd(t) {
      this._crs = this.options.crs || t.options.crs, this._wmsVersion = parseFloat(this.wmsParams.version);var i = this._wmsVersion >= 1.3 ? "crs" : "srs";this.wmsParams[i] = this._crs.code, dn.prototype.onAdd.call(this, t);
    }, getTileUrl: function getTileUrl(t) {
      var i = this._tileCoordsToNwSe(t),
          e = this._crs,
          n = b(e.project(i[0]), e.project(i[1])),
          o = n.min,
          s = n.max,
          r = (this._wmsVersion >= 1.3 && this._crs === He ? [o.y, o.x, s.y, s.x] : [o.x, o.y, s.x, s.y]).join(","),
          a = L.TileLayer.prototype.getTileUrl.call(this, t);return a + c(this.wmsParams, a, this.options.uppercase) + (this.options.uppercase ? "&BBOX=" : "&bbox=") + r;
    }, setParams: function setParams(t, e) {
      return i(this.wmsParams, t), e || this.redraw(), this;
    } });dn.WMS = pn, Yt.wms = function (t, i) {
    return new pn(t, i);
  };var mn = Ue.extend({ options: { padding: .1, tolerance: 0 }, initialize: function initialize(t) {
      l(this, t), n(this), this._layers = this._layers || {};
    }, onAdd: function onAdd() {
      this._container || (this._initContainer(), this._zoomAnimated && pt(this._container, "leaflet-zoom-animated")), this.getPane().appendChild(this._container), this._update(), this.on("update", this._updatePaths, this);
    }, onRemove: function onRemove() {
      this.off("update", this._updatePaths, this), this._destroyContainer();
    }, getEvents: function getEvents() {
      var t = { viewreset: this._reset, zoom: this._onZoom, moveend: this._update, zoomend: this._onZoomEnd };return this._zoomAnimated && (t.zoomanim = this._onAnimZoom), t;
    }, _onAnimZoom: function _onAnimZoom(t) {
      this._updateTransform(t.center, t.zoom);
    }, _onZoom: function _onZoom() {
      this._updateTransform(this._map.getCenter(), this._map.getZoom());
    }, _updateTransform: function _updateTransform(t, i) {
      var e = this._map.getZoomScale(i, this._zoom),
          n = Pt(this._container),
          o = this._map.getSize().multiplyBy(.5 + this.options.padding),
          s = this._map.project(this._center, i),
          r = this._map.project(t, i).subtract(s),
          a = o.multiplyBy(-e).add(n).add(o).subtract(r);Ni ? wt(this._container, a, e) : Lt(this._container, a);
    }, _reset: function _reset() {
      this._update(), this._updateTransform(this._center, this._zoom);for (var t in this._layers) {
        this._layers[t]._reset();
      }
    }, _onZoomEnd: function _onZoomEnd() {
      for (var t in this._layers) {
        this._layers[t]._project();
      }
    }, _updatePaths: function _updatePaths() {
      for (var t in this._layers) {
        this._layers[t]._update();
      }
    }, _update: function _update() {
      var t = this.options.padding,
          i = this._map.getSize(),
          e = this._map.containerPointToLayerPoint(i.multiplyBy(-t)).round();this._bounds = new P(e, e.add(i.multiplyBy(1 + 2 * t)).round()), this._center = this._map.getCenter(), this._zoom = this._map.getZoom();
    } }),
      fn = mn.extend({ getEvents: function getEvents() {
      var t = mn.prototype.getEvents.call(this);return t.viewprereset = this._onViewPreReset, t;
    }, _onViewPreReset: function _onViewPreReset() {
      this._postponeUpdatePaths = !0;
    }, onAdd: function onAdd() {
      mn.prototype.onAdd.call(this), this._draw();
    }, _initContainer: function _initContainer() {
      var t = this._container = document.createElement("canvas");V(t, "mousemove", o(this._onMouseMove, 32, this), this), V(t, "click dblclick mousedown mouseup contextmenu", this._onClick, this), V(t, "mouseout", this._handleMouseOut, this), this._ctx = t.getContext("2d");
    }, _destroyContainer: function _destroyContainer() {
      delete this._ctx, ut(this._container), q(this._container), delete this._container;
    }, _updatePaths: function _updatePaths() {
      if (!this._postponeUpdatePaths) {
        this._redrawBounds = null;for (var t in this._layers) {
          this._layers[t]._update();
        }this._redraw();
      }
    }, _update: function _update() {
      if (!this._map._animatingZoom || !this._bounds) {
        this._drawnLayers = {}, mn.prototype._update.call(this);var t = this._bounds,
            i = this._container,
            e = t.getSize(),
            n = Ki ? 2 : 1;Lt(i, t.min), i.width = n * e.x, i.height = n * e.y, i.style.width = e.x + "px", i.style.height = e.y + "px", Ki && this._ctx.scale(2, 2), this._ctx.translate(-t.min.x, -t.min.y), this.fire("update");
      }
    }, _reset: function _reset() {
      mn.prototype._reset.call(this), this._postponeUpdatePaths && (this._postponeUpdatePaths = !1, this._updatePaths());
    }, _initPath: function _initPath(t) {
      this._updateDashArray(t), this._layers[n(t)] = t;var i = t._order = { layer: t, prev: this._drawLast, next: null };this._drawLast && (this._drawLast.next = i), this._drawLast = i, this._drawFirst = this._drawFirst || this._drawLast;
    }, _addPath: function _addPath(t) {
      this._requestRedraw(t);
    }, _removePath: function _removePath(t) {
      var i = t._order,
          e = i.next,
          n = i.prev;e ? e.prev = n : this._drawLast = n, n ? n.next = e : this._drawFirst = e, delete t._order, delete this._layers[L.stamp(t)], this._requestRedraw(t);
    }, _updatePath: function _updatePath(t) {
      this._extendRedrawBounds(t), t._project(), t._update(), this._requestRedraw(t);
    }, _updateStyle: function _updateStyle(t) {
      this._updateDashArray(t), this._requestRedraw(t);
    }, _updateDashArray: function _updateDashArray(t) {
      if (t.options.dashArray) {
        var i,
            e = t.options.dashArray.split(","),
            n = [];for (i = 0; i < e.length; i++) {
          n.push(Number(e[i]));
        }t.options._dashArray = n;
      }
    }, _requestRedraw: function _requestRedraw(t) {
      this._map && (this._extendRedrawBounds(t), this._redrawRequest = this._redrawRequest || f(this._redraw, this));
    }, _extendRedrawBounds: function _extendRedrawBounds(t) {
      if (t._pxBounds) {
        var i = (t.options.weight || 0) + 1;this._redrawBounds = this._redrawBounds || new P(), this._redrawBounds.extend(t._pxBounds.min.subtract([i, i])), this._redrawBounds.extend(t._pxBounds.max.add([i, i]));
      }
    }, _redraw: function _redraw() {
      this._redrawRequest = null, this._redrawBounds && (this._redrawBounds.min._floor(), this._redrawBounds.max._ceil()), this._clear(), this._draw(), this._redrawBounds = null;
    }, _clear: function _clear() {
      var t = this._redrawBounds;if (t) {
        var i = t.getSize();this._ctx.clearRect(t.min.x, t.min.y, i.x, i.y);
      } else this._ctx.clearRect(0, 0, this._container.width, this._container.height);
    }, _draw: function _draw() {
      var t,
          i = this._redrawBounds;if (this._ctx.save(), i) {
        var e = i.getSize();this._ctx.beginPath(), this._ctx.rect(i.min.x, i.min.y, e.x, e.y), this._ctx.clip();
      }this._drawing = !0;for (var n = this._drawFirst; n; n = n.next) {
        t = n.layer, (!i || t._pxBounds && t._pxBounds.intersects(i)) && t._updatePath();
      }this._drawing = !1, this._ctx.restore();
    }, _updatePoly: function _updatePoly(t, i) {
      if (this._drawing) {
        var e,
            n,
            o,
            s,
            r = t._parts,
            a = r.length,
            h = this._ctx;if (a) {
          for (this._drawnLayers[t._leaflet_id] = t, h.beginPath(), e = 0; e < a; e++) {
            for (n = 0, o = r[e].length; n < o; n++) {
              s = r[e][n], h[n ? "lineTo" : "moveTo"](s.x, s.y);
            }i && h.closePath();
          }this._fillStroke(h, t);
        }
      }
    }, _updateCircle: function _updateCircle(t) {
      if (this._drawing && !t._empty()) {
        var i = t._point,
            e = this._ctx,
            n = Math.max(Math.round(t._radius), 1),
            o = (Math.max(Math.round(t._radiusY), 1) || n) / n;this._drawnLayers[t._leaflet_id] = t, 1 !== o && (e.save(), e.scale(1, o)), e.beginPath(), e.arc(i.x, i.y / o, n, 0, 2 * Math.PI, !1), 1 !== o && e.restore(), this._fillStroke(e, t);
      }
    }, _fillStroke: function _fillStroke(t, i) {
      var e = i.options;e.fill && (t.globalAlpha = e.fillOpacity, t.fillStyle = e.fillColor || e.color, t.fill(e.fillRule || "evenodd")), e.stroke && 0 !== e.weight && (t.setLineDash && t.setLineDash(i.options && i.options._dashArray || []), t.globalAlpha = e.opacity, t.lineWidth = e.weight, t.strokeStyle = e.color, t.lineCap = e.lineCap, t.lineJoin = e.lineJoin, t.stroke());
    }, _onClick: function _onClick(t) {
      for (var i, e, n = this._map.mouseEventToLayerPoint(t), o = this._drawFirst; o; o = o.next) {
        (i = o.layer).options.interactive && i._containsPoint(n) && !this._map._draggableMoved(i) && (e = i);
      }e && (et(t), this._fireEvent([e], t));
    }, _onMouseMove: function _onMouseMove(t) {
      if (this._map && !this._map.dragging.moving() && !this._map._animatingZoom) {
        var i = this._map.mouseEventToLayerPoint(t);this._handleMouseHover(t, i);
      }
    }, _handleMouseOut: function _handleMouseOut(t) {
      var i = this._hoveredLayer;i && (mt(this._container, "leaflet-interactive"), this._fireEvent([i], t, "mouseout"), this._hoveredLayer = null);
    }, _handleMouseHover: function _handleMouseHover(t, i) {
      for (var e, n, o = this._drawFirst; o; o = o.next) {
        (e = o.layer).options.interactive && e._containsPoint(i) && (n = e);
      }n !== this._hoveredLayer && (this._handleMouseOut(t), n && (pt(this._container, "leaflet-interactive"), this._fireEvent([n], t, "mouseover"), this._hoveredLayer = n)), this._hoveredLayer && this._fireEvent([this._hoveredLayer], t);
    }, _fireEvent: function _fireEvent(t, i, e) {
      this._map._fireDOMEvent(i, e || i.type, t);
    }, _bringToFront: function _bringToFront(t) {
      var i = t._order,
          e = i.next,
          n = i.prev;e && (e.prev = n, n ? n.next = e : e && (this._drawFirst = e), i.prev = this._drawLast, this._drawLast.next = i, i.next = null, this._drawLast = i, this._requestRedraw(t));
    }, _bringToBack: function _bringToBack(t) {
      var i = t._order,
          e = i.next,
          n = i.prev;n && (n.next = e, e ? e.prev = n : n && (this._drawLast = n), i.prev = null, i.next = this._drawFirst, this._drawFirst.prev = i, this._drawFirst = i, this._requestRedraw(t));
    } }),
      gn = function () {
    try {
      return document.namespaces.add("lvml", "urn:schemas-microsoft-com:vml"), function (t) {
        return document.createElement("<lvml:" + t + ' class="lvml">');
      };
    } catch (t) {
      return function (t) {
        return document.createElement("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
      };
    }
  }(),
      vn = { _initContainer: function _initContainer() {
      this._container = ht("div", "leaflet-vml-container");
    }, _update: function _update() {
      this._map._animatingZoom || (mn.prototype._update.call(this), this.fire("update"));
    }, _initPath: function _initPath(t) {
      var i = t._container = gn("shape");pt(i, "leaflet-vml-shape " + (this.options.className || "")), i.coordsize = "1 1", t._path = gn("path"), i.appendChild(t._path), this._updateStyle(t), this._layers[n(t)] = t;
    }, _addPath: function _addPath(t) {
      var i = t._container;this._container.appendChild(i), t.options.interactive && t.addInteractiveTarget(i);
    }, _removePath: function _removePath(t) {
      var i = t._container;ut(i), t.removeInteractiveTarget(i), delete this._layers[n(t)];
    }, _updateStyle: function _updateStyle(t) {
      var i = t._stroke,
          e = t._fill,
          n = t.options,
          o = t._container;o.stroked = !!n.stroke, o.filled = !!n.fill, n.stroke ? (i || (i = t._stroke = gn("stroke")), o.appendChild(i), i.weight = n.weight + "px", i.color = n.color, i.opacity = n.opacity, n.dashArray ? i.dashStyle = ei(n.dashArray) ? n.dashArray.join(" ") : n.dashArray.replace(/( *, *)/g, " ") : i.dashStyle = "", i.endcap = n.lineCap.replace("butt", "flat"), i.joinstyle = n.lineJoin) : i && (o.removeChild(i), t._stroke = null), n.fill ? (e || (e = t._fill = gn("fill")), o.appendChild(e), e.color = n.fillColor || n.color, e.opacity = n.fillOpacity) : e && (o.removeChild(e), t._fill = null);
    }, _updateCircle: function _updateCircle(t) {
      var i = t._point.round(),
          e = Math.round(t._radius),
          n = Math.round(t._radiusY || e);this._setPath(t, t._empty() ? "M0 0" : "AL " + i.x + "," + i.y + " " + e + "," + n + " 0,23592600");
    }, _setPath: function _setPath(t, i) {
      t._path.v = i;
    }, _bringToFront: function _bringToFront(t) {
      ct(t._container);
    }, _bringToBack: function _bringToBack(t) {
      _t(t._container);
    } },
      yn = Ji ? gn : E,
      xn = mn.extend({ getEvents: function getEvents() {
      var t = mn.prototype.getEvents.call(this);return t.zoomstart = this._onZoomStart, t;
    }, _initContainer: function _initContainer() {
      this._container = yn("svg"), this._container.setAttribute("pointer-events", "none"), this._rootGroup = yn("g"), this._container.appendChild(this._rootGroup);
    }, _destroyContainer: function _destroyContainer() {
      ut(this._container), q(this._container), delete this._container, delete this._rootGroup, delete this._svgSize;
    }, _onZoomStart: function _onZoomStart() {
      this._update();
    }, _update: function _update() {
      if (!this._map._animatingZoom || !this._bounds) {
        mn.prototype._update.call(this);var t = this._bounds,
            i = t.getSize(),
            e = this._container;this._svgSize && this._svgSize.equals(i) || (this._svgSize = i, e.setAttribute("width", i.x), e.setAttribute("height", i.y)), Lt(e, t.min), e.setAttribute("viewBox", [t.min.x, t.min.y, i.x, i.y].join(" ")), this.fire("update");
      }
    }, _initPath: function _initPath(t) {
      var i = t._path = yn("path");t.options.className && pt(i, t.options.className), t.options.interactive && pt(i, "leaflet-interactive"), this._updateStyle(t), this._layers[n(t)] = t;
    }, _addPath: function _addPath(t) {
      this._rootGroup || this._initContainer(), this._rootGroup.appendChild(t._path), t.addInteractiveTarget(t._path);
    }, _removePath: function _removePath(t) {
      ut(t._path), t.removeInteractiveTarget(t._path), delete this._layers[n(t)];
    }, _updatePath: function _updatePath(t) {
      t._project(), t._update();
    }, _updateStyle: function _updateStyle(t) {
      var i = t._path,
          e = t.options;i && (e.stroke ? (i.setAttribute("stroke", e.color), i.setAttribute("stroke-opacity", e.opacity), i.setAttribute("stroke-width", e.weight), i.setAttribute("stroke-linecap", e.lineCap), i.setAttribute("stroke-linejoin", e.lineJoin), e.dashArray ? i.setAttribute("stroke-dasharray", e.dashArray) : i.removeAttribute("stroke-dasharray"), e.dashOffset ? i.setAttribute("stroke-dashoffset", e.dashOffset) : i.removeAttribute("stroke-dashoffset")) : i.setAttribute("stroke", "none"), e.fill ? (i.setAttribute("fill", e.fillColor || e.color), i.setAttribute("fill-opacity", e.fillOpacity), i.setAttribute("fill-rule", e.fillRule || "evenodd")) : i.setAttribute("fill", "none"));
    }, _updatePoly: function _updatePoly(t, i) {
      this._setPath(t, k(t._parts, i));
    }, _updateCircle: function _updateCircle(t) {
      var i = t._point,
          e = Math.max(Math.round(t._radius), 1),
          n = "a" + e + "," + (Math.max(Math.round(t._radiusY), 1) || e) + " 0 1,0 ",
          o = t._empty() ? "M0 0" : "M" + (i.x - e) + "," + i.y + n + 2 * e + ",0 " + n + 2 * -e + ",0 ";this._setPath(t, o);
    }, _setPath: function _setPath(t, i) {
      t._path.setAttribute("d", i);
    }, _bringToFront: function _bringToFront(t) {
      ct(t._path);
    }, _bringToBack: function _bringToBack(t) {
      _t(t._path);
    } });Ji && xn.include(vn), Le.include({ getRenderer: function getRenderer(t) {
      var i = t.options.renderer || this._getPaneRenderer(t.options.pane) || this.options.renderer || this._renderer;return i || (i = this._renderer = this.options.preferCanvas && Xt() || Jt()), this.hasLayer(i) || this.addLayer(i), i;
    }, _getPaneRenderer: function _getPaneRenderer(t) {
      if ("overlayPane" === t || void 0 === t) return !1;var i = this._paneRenderers[t];return void 0 === i && (i = xn && Jt({ pane: t }) || fn && Xt({ pane: t }), this._paneRenderers[t] = i), i;
    } });var wn = en.extend({ initialize: function initialize(t, i) {
      en.prototype.initialize.call(this, this._boundsToLatLngs(t), i);
    }, setBounds: function setBounds(t) {
      return this.setLatLngs(this._boundsToLatLngs(t));
    }, _boundsToLatLngs: function _boundsToLatLngs(t) {
      return t = z(t), [t.getSouthWest(), t.getNorthWest(), t.getNorthEast(), t.getSouthEast()];
    } });xn.create = yn, xn.pointsToPath = k, nn.geometryToLayer = Wt, nn.coordsToLatLng = Ht, nn.coordsToLatLngs = Ft, nn.latLngToCoords = Ut, nn.latLngsToCoords = Vt, nn.getFeature = qt, nn.asFeature = Gt, Le.mergeOptions({ boxZoom: !0 });var Ln = Ze.extend({ initialize: function initialize(t) {
      this._map = t, this._container = t._container, this._pane = t._panes.overlayPane, this._resetStateTimeout = 0, t.on("unload", this._destroy, this);
    }, addHooks: function addHooks() {
      V(this._container, "mousedown", this._onMouseDown, this);
    }, removeHooks: function removeHooks() {
      q(this._container, "mousedown", this._onMouseDown, this);
    }, moved: function moved() {
      return this._moved;
    }, _destroy: function _destroy() {
      ut(this._pane), delete this._pane;
    }, _resetState: function _resetState() {
      this._resetStateTimeout = 0, this._moved = !1;
    }, _clearDeferredResetState: function _clearDeferredResetState() {
      0 !== this._resetStateTimeout && (clearTimeout(this._resetStateTimeout), this._resetStateTimeout = 0);
    }, _onMouseDown: function _onMouseDown(t) {
      if (!t.shiftKey || 1 !== t.which && 1 !== t.button) return !1;this._clearDeferredResetState(), this._resetState(), mi(), bt(), this._startPoint = this._map.mouseEventToContainerPoint(t), V(document, { contextmenu: Q, mousemove: this._onMouseMove, mouseup: this._onMouseUp, keydown: this._onKeyDown }, this);
    }, _onMouseMove: function _onMouseMove(t) {
      this._moved || (this._moved = !0, this._box = ht("div", "leaflet-zoom-box", this._container), pt(this._container, "leaflet-crosshair"), this._map.fire("boxzoomstart")), this._point = this._map.mouseEventToContainerPoint(t);var i = new P(this._point, this._startPoint),
          e = i.getSize();Lt(this._box, i.min), this._box.style.width = e.x + "px", this._box.style.height = e.y + "px";
    }, _finish: function _finish() {
      this._moved && (ut(this._box), mt(this._container, "leaflet-crosshair")), fi(), Tt(), q(document, { contextmenu: Q, mousemove: this._onMouseMove, mouseup: this._onMouseUp, keydown: this._onKeyDown }, this);
    }, _onMouseUp: function _onMouseUp(t) {
      if ((1 === t.which || 1 === t.button) && (this._finish(), this._moved)) {
        this._clearDeferredResetState(), this._resetStateTimeout = setTimeout(e(this._resetState, this), 0);var i = new T(this._map.containerPointToLatLng(this._startPoint), this._map.containerPointToLatLng(this._point));this._map.fitBounds(i).fire("boxzoomend", { boxZoomBounds: i });
      }
    }, _onKeyDown: function _onKeyDown(t) {
      27 === t.keyCode && this._finish();
    } });Le.addInitHook("addHandler", "boxZoom", Ln), Le.mergeOptions({ doubleClickZoom: !0 });var Pn = Ze.extend({ addHooks: function addHooks() {
      this._map.on("dblclick", this._onDoubleClick, this);
    }, removeHooks: function removeHooks() {
      this._map.off("dblclick", this._onDoubleClick, this);
    }, _onDoubleClick: function _onDoubleClick(t) {
      var i = this._map,
          e = i.getZoom(),
          n = i.options.zoomDelta,
          o = t.originalEvent.shiftKey ? e - n : e + n;"center" === i.options.doubleClickZoom ? i.setZoom(o) : i.setZoomAround(t.containerPoint, o);
    } });Le.addInitHook("addHandler", "doubleClickZoom", Pn), Le.mergeOptions({ dragging: !0, inertia: !zi, inertiaDeceleration: 3400, inertiaMaxSpeed: 1 / 0, easeLinearity: .2, worldCopyJump: !1, maxBoundsViscosity: 0 });var bn = Ze.extend({ addHooks: function addHooks() {
      if (!this._draggable) {
        var t = this._map;this._draggable = new Be(t._mapPane, t._container), this._draggable.on({ dragstart: this._onDragStart, drag: this._onDrag, dragend: this._onDragEnd }, this), this._draggable.on("predrag", this._onPreDragLimit, this), t.options.worldCopyJump && (this._draggable.on("predrag", this._onPreDragWrap, this), t.on("zoomend", this._onZoomEnd, this), t.whenReady(this._onZoomEnd, this));
      }pt(this._map._container, "leaflet-grab leaflet-touch-drag"), this._draggable.enable(), this._positions = [], this._times = [];
    }, removeHooks: function removeHooks() {
      mt(this._map._container, "leaflet-grab"), mt(this._map._container, "leaflet-touch-drag"), this._draggable.disable();
    }, moved: function moved() {
      return this._draggable && this._draggable._moved;
    }, moving: function moving() {
      return this._draggable && this._draggable._moving;
    }, _onDragStart: function _onDragStart() {
      var t = this._map;if (t._stop(), this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
        var i = z(this._map.options.maxBounds);this._offsetLimit = b(this._map.latLngToContainerPoint(i.getNorthWest()).multiplyBy(-1), this._map.latLngToContainerPoint(i.getSouthEast()).multiplyBy(-1).add(this._map.getSize())), this._viscosity = Math.min(1, Math.max(0, this._map.options.maxBoundsViscosity));
      } else this._offsetLimit = null;t.fire("movestart").fire("dragstart"), t.options.inertia && (this._positions = [], this._times = []);
    }, _onDrag: function _onDrag(t) {
      if (this._map.options.inertia) {
        var i = this._lastTime = +new Date(),
            e = this._lastPos = this._draggable._absPos || this._draggable._newPos;this._positions.push(e), this._times.push(i), this._prunePositions(i);
      }this._map.fire("move", t).fire("drag", t);
    }, _prunePositions: function _prunePositions(t) {
      for (; this._positions.length > 1 && t - this._times[0] > 50;) {
        this._positions.shift(), this._times.shift();
      }
    }, _onZoomEnd: function _onZoomEnd() {
      var t = this._map.getSize().divideBy(2),
          i = this._map.latLngToLayerPoint([0, 0]);this._initialWorldOffset = i.subtract(t).x, this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
    }, _viscousLimit: function _viscousLimit(t, i) {
      return t - (t - i) * this._viscosity;
    }, _onPreDragLimit: function _onPreDragLimit() {
      if (this._viscosity && this._offsetLimit) {
        var t = this._draggable._newPos.subtract(this._draggable._startPos),
            i = this._offsetLimit;t.x < i.min.x && (t.x = this._viscousLimit(t.x, i.min.x)), t.y < i.min.y && (t.y = this._viscousLimit(t.y, i.min.y)), t.x > i.max.x && (t.x = this._viscousLimit(t.x, i.max.x)), t.y > i.max.y && (t.y = this._viscousLimit(t.y, i.max.y)), this._draggable._newPos = this._draggable._startPos.add(t);
      }
    }, _onPreDragWrap: function _onPreDragWrap() {
      var t = this._worldWidth,
          i = Math.round(t / 2),
          e = this._initialWorldOffset,
          n = this._draggable._newPos.x,
          o = (n - i + e) % t + i - e,
          s = (n + i + e) % t - i - e,
          r = Math.abs(o + e) < Math.abs(s + e) ? o : s;this._draggable._absPos = this._draggable._newPos.clone(), this._draggable._newPos.x = r;
    }, _onDragEnd: function _onDragEnd(t) {
      var i = this._map,
          e = i.options,
          n = !e.inertia || this._times.length < 2;if (i.fire("dragend", t), n) i.fire("moveend");else {
        this._prunePositions(+new Date());var o = this._lastPos.subtract(this._positions[0]),
            s = (this._lastTime - this._times[0]) / 1e3,
            r = e.easeLinearity,
            a = o.multiplyBy(r / s),
            h = a.distanceTo([0, 0]),
            u = Math.min(e.inertiaMaxSpeed, h),
            l = a.multiplyBy(u / h),
            c = u / (e.inertiaDeceleration * r),
            _ = l.multiplyBy(-c / 2).round();_.x || _.y ? (_ = i._limitOffset(_, i.options.maxBounds), f(function () {
          i.panBy(_, { duration: c, easeLinearity: r, noMoveStart: !0, animate: !0 });
        })) : i.fire("moveend");
      }
    } });Le.addInitHook("addHandler", "dragging", bn), Le.mergeOptions({ keyboard: !0, keyboardPanDelta: 80 });var Tn = Ze.extend({ keyCodes: { left: [37], right: [39], down: [40], up: [38], zoomIn: [187, 107, 61, 171], zoomOut: [189, 109, 54, 173] }, initialize: function initialize(t) {
      this._map = t, this._setPanDelta(t.options.keyboardPanDelta), this._setZoomDelta(t.options.zoomDelta);
    }, addHooks: function addHooks() {
      var t = this._map._container;t.tabIndex <= 0 && (t.tabIndex = "0"), V(t, { focus: this._onFocus, blur: this._onBlur, mousedown: this._onMouseDown }, this), this._map.on({ focus: this._addHooks, blur: this._removeHooks }, this);
    }, removeHooks: function removeHooks() {
      this._removeHooks(), q(this._map._container, { focus: this._onFocus, blur: this._onBlur, mousedown: this._onMouseDown }, this), this._map.off({ focus: this._addHooks, blur: this._removeHooks }, this);
    }, _onMouseDown: function _onMouseDown() {
      if (!this._focused) {
        var t = document.body,
            i = document.documentElement,
            e = t.scrollTop || i.scrollTop,
            n = t.scrollLeft || i.scrollLeft;this._map._container.focus(), window.scrollTo(n, e);
      }
    }, _onFocus: function _onFocus() {
      this._focused = !0, this._map.fire("focus");
    }, _onBlur: function _onBlur() {
      this._focused = !1, this._map.fire("blur");
    }, _setPanDelta: function _setPanDelta(t) {
      var i,
          e,
          n = this._panKeys = {},
          o = this.keyCodes;for (i = 0, e = o.left.length; i < e; i++) {
        n[o.left[i]] = [-1 * t, 0];
      }for (i = 0, e = o.right.length; i < e; i++) {
        n[o.right[i]] = [t, 0];
      }for (i = 0, e = o.down.length; i < e; i++) {
        n[o.down[i]] = [0, t];
      }for (i = 0, e = o.up.length; i < e; i++) {
        n[o.up[i]] = [0, -1 * t];
      }
    }, _setZoomDelta: function _setZoomDelta(t) {
      var i,
          e,
          n = this._zoomKeys = {},
          o = this.keyCodes;for (i = 0, e = o.zoomIn.length; i < e; i++) {
        n[o.zoomIn[i]] = t;
      }for (i = 0, e = o.zoomOut.length; i < e; i++) {
        n[o.zoomOut[i]] = -t;
      }
    }, _addHooks: function _addHooks() {
      V(document, "keydown", this._onKeyDown, this);
    }, _removeHooks: function _removeHooks() {
      q(document, "keydown", this._onKeyDown, this);
    }, _onKeyDown: function _onKeyDown(t) {
      if (!(t.altKey || t.ctrlKey || t.metaKey)) {
        var i,
            e = t.keyCode,
            n = this._map;if (e in this._panKeys) {
          if (n._panAnim && n._panAnim._inProgress) return;i = this._panKeys[e], t.shiftKey && (i = w(i).multiplyBy(3)), n.panBy(i), n.options.maxBounds && n.panInsideBounds(n.options.maxBounds);
        } else if (e in this._zoomKeys) n.setZoom(n.getZoom() + (t.shiftKey ? 3 : 1) * this._zoomKeys[e]);else {
          if (27 !== e || !n._popup || !n._popup.options.closeOnEscapeKey) return;n.closePopup();
        }Q(t);
      }
    } });Le.addInitHook("addHandler", "keyboard", Tn), Le.mergeOptions({ scrollWheelZoom: !0, wheelDebounceTime: 40, wheelPxPerZoomLevel: 60 });var zn = Ze.extend({ addHooks: function addHooks() {
      V(this._map._container, "mousewheel", this._onWheelScroll, this), this._delta = 0;
    }, removeHooks: function removeHooks() {
      q(this._map._container, "mousewheel", this._onWheelScroll, this);
    }, _onWheelScroll: function _onWheelScroll(t) {
      var i = it(t),
          n = this._map.options.wheelDebounceTime;this._delta += i, this._lastMousePos = this._map.mouseEventToContainerPoint(t), this._startTime || (this._startTime = +new Date());var o = Math.max(n - (+new Date() - this._startTime), 0);clearTimeout(this._timer), this._timer = setTimeout(e(this._performZoom, this), o), Q(t);
    }, _performZoom: function _performZoom() {
      var t = this._map,
          i = t.getZoom(),
          e = this._map.options.zoomSnap || 0;t._stop();var n = this._delta / (4 * this._map.options.wheelPxPerZoomLevel),
          o = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(n)))) / Math.LN2,
          s = e ? Math.ceil(o / e) * e : o,
          r = t._limitZoom(i + (this._delta > 0 ? s : -s)) - i;this._delta = 0, this._startTime = null, r && ("center" === t.options.scrollWheelZoom ? t.setZoom(i + r) : t.setZoomAround(this._lastMousePos, i + r));
    } });Le.addInitHook("addHandler", "scrollWheelZoom", zn), Le.mergeOptions({ tap: !0, tapTolerance: 15 });var Mn = Ze.extend({ addHooks: function addHooks() {
      V(this._map._container, "touchstart", this._onDown, this);
    }, removeHooks: function removeHooks() {
      q(this._map._container, "touchstart", this._onDown, this);
    }, _onDown: function _onDown(t) {
      if (t.touches) {
        if ($(t), this._fireClick = !0, t.touches.length > 1) return this._fireClick = !1, void clearTimeout(this._holdTimeout);var i = t.touches[0],
            n = i.target;this._startPos = this._newPos = new x(i.clientX, i.clientY), n.tagName && "a" === n.tagName.toLowerCase() && pt(n, "leaflet-active"), this._holdTimeout = setTimeout(e(function () {
          this._isTapValid() && (this._fireClick = !1, this._onUp(), this._simulateEvent("contextmenu", i));
        }, this), 1e3), this._simulateEvent("mousedown", i), V(document, { touchmove: this._onMove, touchend: this._onUp }, this);
      }
    }, _onUp: function _onUp(t) {
      if (clearTimeout(this._holdTimeout), q(document, { touchmove: this._onMove, touchend: this._onUp }, this), this._fireClick && t && t.changedTouches) {
        var i = t.changedTouches[0],
            e = i.target;e && e.tagName && "a" === e.tagName.toLowerCase() && mt(e, "leaflet-active"), this._simulateEvent("mouseup", i), this._isTapValid() && this._simulateEvent("click", i);
      }
    }, _isTapValid: function _isTapValid() {
      return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
    }, _onMove: function _onMove(t) {
      var i = t.touches[0];this._newPos = new x(i.clientX, i.clientY), this._simulateEvent("mousemove", i);
    }, _simulateEvent: function _simulateEvent(t, i) {
      var e = document.createEvent("MouseEvents");e._simulated = !0, i.target._simulatedClick = !0, e.initMouseEvent(t, !0, !0, window, 1, i.screenX, i.screenY, i.clientX, i.clientY, !1, !1, !1, !1, 0, null), i.target.dispatchEvent(e);
    } });Vi && !Ui && Le.addInitHook("addHandler", "tap", Mn), Le.mergeOptions({ touchZoom: Vi && !zi, bounceAtZoomLimits: !0 });var Cn = Ze.extend({ addHooks: function addHooks() {
      pt(this._map._container, "leaflet-touch-zoom"), V(this._map._container, "touchstart", this._onTouchStart, this);
    }, removeHooks: function removeHooks() {
      mt(this._map._container, "leaflet-touch-zoom"), q(this._map._container, "touchstart", this._onTouchStart, this);
    }, _onTouchStart: function _onTouchStart(t) {
      var i = this._map;if (t.touches && 2 === t.touches.length && !i._animatingZoom && !this._zooming) {
        var e = i.mouseEventToContainerPoint(t.touches[0]),
            n = i.mouseEventToContainerPoint(t.touches[1]);this._centerPoint = i.getSize()._divideBy(2), this._startLatLng = i.containerPointToLatLng(this._centerPoint), "center" !== i.options.touchZoom && (this._pinchStartLatLng = i.containerPointToLatLng(e.add(n)._divideBy(2))), this._startDist = e.distanceTo(n), this._startZoom = i.getZoom(), this._moved = !1, this._zooming = !0, i._stop(), V(document, "touchmove", this._onTouchMove, this), V(document, "touchend", this._onTouchEnd, this), $(t);
      }
    }, _onTouchMove: function _onTouchMove(t) {
      if (t.touches && 2 === t.touches.length && this._zooming) {
        var i = this._map,
            n = i.mouseEventToContainerPoint(t.touches[0]),
            o = i.mouseEventToContainerPoint(t.touches[1]),
            s = n.distanceTo(o) / this._startDist;if (this._zoom = i.getScaleZoom(s, this._startZoom), !i.options.bounceAtZoomLimits && (this._zoom < i.getMinZoom() && s < 1 || this._zoom > i.getMaxZoom() && s > 1) && (this._zoom = i._limitZoom(this._zoom)), "center" === i.options.touchZoom) {
          if (this._center = this._startLatLng, 1 === s) return;
        } else {
          var r = n._add(o)._divideBy(2)._subtract(this._centerPoint);if (1 === s && 0 === r.x && 0 === r.y) return;this._center = i.unproject(i.project(this._pinchStartLatLng, this._zoom).subtract(r), this._zoom);
        }this._moved || (i._moveStart(!0, !1), this._moved = !0), g(this._animRequest);var a = e(i._move, i, this._center, this._zoom, { pinch: !0, round: !1 });this._animRequest = f(a, this, !0), $(t);
      }
    }, _onTouchEnd: function _onTouchEnd() {
      this._moved && this._zooming ? (this._zooming = !1, g(this._animRequest), q(document, "touchmove", this._onTouchMove), q(document, "touchend", this._onTouchEnd), this._map.options.zoomAnimation ? this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), !0, this._map.options.zoomSnap) : this._map._resetView(this._center, this._map._limitZoom(this._zoom))) : this._zooming = !1;
    } });Le.addInitHook("addHandler", "touchZoom", Cn), Le.BoxZoom = Ln, Le.DoubleClickZoom = Pn, Le.Drag = bn, Le.Keyboard = Tn, Le.ScrollWheelZoom = zn, Le.Tap = Mn, Le.TouchZoom = Cn;var Zn = window.L;window.L = t, Object.freeze = $t, t.version = "1.3.1", t.noConflict = function () {
    return window.L = Zn, this;
  }, t.Control = Pe, t.control = be, t.Browser = $i, t.Evented = ui, t.Mixin = Ee, t.Util = ai, t.Class = v, t.Handler = Ze, t.extend = i, t.bind = e, t.stamp = n, t.setOptions = l, t.DomEvent = de, t.DomUtil = xe, t.PosAnimation = we, t.Draggable = Be, t.LineUtil = Oe, t.PolyUtil = Re, t.Point = x, t.point = w, t.Bounds = P, t.bounds = b, t.Transformation = Z, t.transformation = S, t.Projection = je, t.LatLng = M, t.latLng = C, t.LatLngBounds = T, t.latLngBounds = z, t.CRS = ci, t.GeoJSON = nn, t.geoJSON = Kt, t.geoJson = sn, t.Layer = Ue, t.LayerGroup = Ve, t.layerGroup = function (t, i) {
    return new Ve(t, i);
  }, t.FeatureGroup = qe, t.featureGroup = function (t) {
    return new qe(t);
  }, t.ImageOverlay = rn, t.imageOverlay = function (t, i, e) {
    return new rn(t, i, e);
  }, t.VideoOverlay = an, t.videoOverlay = function (t, i, e) {
    return new an(t, i, e);
  }, t.DivOverlay = hn, t.Popup = un, t.popup = function (t, i) {
    return new un(t, i);
  }, t.Tooltip = ln, t.tooltip = function (t, i) {
    return new ln(t, i);
  }, t.Icon = Ge, t.icon = function (t) {
    return new Ge(t);
  }, t.DivIcon = cn, t.divIcon = function (t) {
    return new cn(t);
  }, t.Marker = Xe, t.marker = function (t, i) {
    return new Xe(t, i);
  }, t.TileLayer = dn, t.tileLayer = Yt, t.GridLayer = _n, t.gridLayer = function (t) {
    return new _n(t);
  }, t.SVG = xn, t.svg = Jt, t.Renderer = mn, t.Canvas = fn, t.canvas = Xt, t.Path = Je, t.CircleMarker = $e, t.circleMarker = function (t, i) {
    return new $e(t, i);
  }, t.Circle = Qe, t.circle = function (t, i, e) {
    return new Qe(t, i, e);
  }, t.Polyline = tn, t.polyline = function (t, i) {
    return new tn(t, i);
  }, t.Polygon = en, t.polygon = function (t, i) {
    return new en(t, i);
  }, t.Rectangle = wn, t.rectangle = function (t, i) {
    return new wn(t, i);
  }, t.Map = Le, t.map = function (t, i) {
    return new Le(t, i);
  };
});

_$leaflet_14 = _$leaflet_14.exports
"use strict";

/* removed: var _$leaflet_14 = require("leaflet"); */;

var _$geojson_2 = function (map, config, element) {
  config.geojson.forEach(function (json) {
    var config = {};
    if (json.style) config.style = json.style;
    if (json.eachFeature) config.onEachFeature = json.eachFeature;
    var makeLayer = function makeLayer(data) {
      var layer = _$leaflet_14.geoJson(data, config);
      layer.addTo(map);
      layer.bringToBack();
      //add to lookup for later
      if (json.id) element.lookup[json.id] = layer;
    };
    if (json.src) {
      //get the data over AJAX
      var xhr = new XMLHttpRequest();
      xhr.open("GET", json.src);
      xhr.onload = function () {
        var response = xhr.responseText;
        var data;
        try {
          data = JSON.parse(response);
          makeLayer(data);
        } catch (e) {
          console.error("Unable to parse GeoJSON from " + json.src);
        }
      };
      xhr.send();
    } else {
      makeLayer(json.data);
    }
  });
};

"use strict";

/* removed: var _$leaflet_14 = require("leaflet"); */;

var _$markers_3 = function (map, config, element) {

  config.markers.forEach(function (poi) {
    var options = {
      icon: new _$leaflet_14.divIcon({
        className: poi.class || "default-map-marker",
        iconSize: null
      }),
      title: poi.title
    };
    var marker = _$leaflet_14.marker(poi.latlng, options);
    if (poi.html) {
      marker.bindPopup(poi.html);
    }
    if (poi.id) {
      element.lookup[poi.id] = marker;
    }
    marker.addTo(map);
  });
};

'use strict';

var stamenAttrib = ['Map tiles by <a href="http://stamen.com/" target="_top">Stamen Design</a>, ', 'under <a href="http://creativecommons.org/licenses/by/3.0" target="_top">CC BY 3.0</a>. ', 'Data by <a href="http://openstreetmap.org/" target="_top">OpenStreetMap</a>, ', 'under <a href="http://creativecommons.org/licenses/by-sa/3.0" target="_top">CC BY SA</a>.'].join("");

var cartoAttrib = '&copy; <a href="http://www.openstreetmap.org/copyright" target="_top">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions" target="_top">CartoDB</a>';

var _$tilesets_5 = {
  // STAMEN
  lite: {
    url: "http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png",
    options: {
      subdomains: "abcd",
      attribution: stamenAttrib
    }
  },
  background: {
    url: "http://{s}.tile.stamen.com/toner-background/{z}/{x}/{y}.png",
    options: {
      subdomains: "abcd",
      attribution: stamenAttrib
    }
  },
  toner: {
    url: "http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png",
    options: {
      subdomains: "abcd",
      attribution: stamenAttrib
    }
  },
  watercolor: {
    url: "http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png",
    options: {
      subdomains: "abcd",
      attribution: stamenAttrib
    }
  },
  terrain: {
    url: "http://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.png",
    options: {
      subdomains: "abcd",
      attribution: stamenAttrib
    }
  },
  // ESRI
  esriStreets: {
    url: "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    options: {
      minZoom: 1,
      maxZoom: 19,
      subdomains: ["server", "services"],
      attribution: "<a href=\"https://static.arcgis.com/attribution/World_Street_Map\">Esri</a>"
    }
  },
  esriTopographic: {
    url: "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    options: {
      minZoom: 1,
      maxZoom: 19,
      subdomains: ["server", "services"],
      attribution: "<a href=\"https://static.arcgis.com/attribution/World_Topo_Map\">Esri</a>"
    }
  },
  esriOceans: {
    url: "//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
    options: {
      minZoom: 1,
      maxZoom: 16,
      subdomains: ["server", "services"],
      attribution: "<a href=\"https://static.arcgis.com/attribution/Ocean_Basemap\">Esri</a>"
    }
  },
  esriOceansLabels: {
    url: "//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}",
    options: {
      minZoom: 1,
      maxZoom: 16,
      subdomains: ["server", "services"]
    }
  },
  esriNationalGeographic: {
    url: "//{s}.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
    options: {
      minZoom: 1,
      maxZoom: 16,
      subdomains: ["server", "services"],
      attribution: "Esri"
    }
  },
  esriDarkGray: {
    url: "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    options: {
      minZoom: 1,
      maxZoom: 16,
      subdomains: ["server", "services"],
      attribution: "Esri, DeLorme, HERE"
    }
  },
  esriDarkGrayLabels: {
    url: "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
    options: {
      minZoom: 1,
      maxZoom: 16,
      subdomains: ["server", "services"]
    }
  },
  esriGray: {
    url: "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    options: {
      minZoom: 1,
      maxZoom: 16,
      subdomains: ["server", "services"],
      attribution: "Esri, NAVTEQ, DeLorme"
    }
  },
  esriGrayLabels: {
    url: "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
    options: {
      minZoom: 1,
      maxZoom: 16,
      subdomains: ["server", "services"]
    }
  },
  esriImagery: {
    url: "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    options: {
      minZoom: 1,
      maxZoom: 19,
      subdomains: ["server", "services"],
      attribution: "Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community"
    }
  },
  esriImageryLabels: {
    url: "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    options: {
      minZoom: 1,
      maxZoom: 19,
      subdomains: ["server", "services"]
    }
  },
  esriImageryTransportation: {
    url: "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
    options: {
      minZoom: 1,
      maxZoom: 19,
      subdomains: ["server", "services"]
    }
  },
  esriShadedRelief: {
    url: "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",
    options: {
      minZoom: 1,
      maxZoom: 13,
      subdomains: ["server", "services"],
      attribution: "ESRI, NAVTEQ, DeLorme"
    }
  },
  esriShadedReliefLabels: {
    url: "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}",
    options: {
      minZoom: 1,
      maxZoom: 12,
      subdomains: ["server", "services"]
    }
  },
  esriTerrain: {
    url: "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
    options: {
      minZoom: 1,
      maxZoom: 13,
      subdomains: ["server", "services"],
      attribution: "Esri, USGS, NOAA"
    }
  },
  esriTerrainLabels: {
    url: "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}",
    options: {
      minZoom: 1,
      maxZoom: 13,
      subdomains: ["server", "services"]
    }
  },
  // CARTODB
  cartoPositron: {
    url: "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    options: {
      subdomains: "abc",
      attribution: cartoAttrib
    }
  },
  cartoPositronBlank: {
    url: "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
    options: {
      subdomains: "abc",
      attribution: cartoAttrib
    }
  },
  cartoDarkMatter: {
    url: "http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    options: {
      subdomains: "abc",
      attribution: cartoAttrib
    }
  },
  cartoDarkMatterBlank: {
    url: "http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
    options: {
      subdomains: "abc",
      attribution: cartoAttrib
    }
  }
};

"use strict";

/* removed: var _$tilesets_5 = require("./tilesets"); */;
/* removed: var _$leaflet_14 = require("leaflet"); */;

var _$tiles_4 = function (map, config, element) {
  //if no tiles, set the toner
  if (!config.tiles || !config.tiles.length) {
    config.tiles = [{ layer: "toner" }];
  }
  //convert tiles into layers
  var layers = config.tiles.forEach(function (setup) {
    setup.options = setup.options || {};
    if (setup.layer && setup.layer in _$tilesets_5) {
      //discard and create one from the layer
      var tileset = _$tilesets_5[setup.layer];
      setup.url = tileset.url;
      for (var original in tileset.options) {
        if (!setup.options[original]) setup.options[original] = tileset.options[original];
      }
    }
    if (!setup.url) return undefined;
    var layer = _$leaflet_14.tileLayer(setup.url, setup.options);
    //make these available in the element lookup for later
    if (setup.id) {
      element.lookup[setup.id] = layer;
    }
    layer.addTo(map);
  });
};

"use strict";

var factories = [_$tiles_4, _$geojson_2, _$markers_3];

var _$factory_6 = {
  build: function build(map, config, element) {
    factories.forEach(function (factory) {
      factory(map, config, element);
    });
  },
  addFactory: function addFactory(factory) {
    factories.push(factory);
  }
};

var _$leafletMap_8 = {};
var style = document.createElement("style");
style.setAttribute("less", "leaflet-map.less");
style.innerHTML = "/* required styles */\r\n\r\n.leaflet-pane,\r\n.leaflet-tile,\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow,\r\n.leaflet-tile-container,\r\n.leaflet-pane > svg,\r\n.leaflet-pane > canvas,\r\n.leaflet-zoom-box,\r\n.leaflet-image-layer,\r\n.leaflet-layer {\r\n\tposition: absolute;\r\n\tleft: 0;\r\n\ttop: 0;\r\n\t}\r\n.leaflet-container {\r\n\toverflow: hidden;\r\n\t}\r\n.leaflet-tile,\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow {\r\n\t-webkit-user-select: none;\r\n\t   -moz-user-select: none;\r\n\t        user-select: none;\r\n\t  -webkit-user-drag: none;\r\n\t}\r\n/* Safari renders non-retina tile on retina better with this, but Chrome is worse */\r\n.leaflet-safari .leaflet-tile {\r\n\timage-rendering: -webkit-optimize-contrast;\r\n\t}\r\n/* hack that prevents hw layers \"stretching\" when loading new tiles */\r\n.leaflet-safari .leaflet-tile-container {\r\n\twidth: 1600px;\r\n\theight: 1600px;\r\n\t-webkit-transform-origin: 0 0;\r\n\t}\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow {\r\n\tdisplay: block;\r\n\t}\r\n/* .leaflet-container svg: reset svg max-width decleration shipped in Joomla! (joomla.org) 3.x */\r\n/* .leaflet-container img: map is broken in FF if you have max-width: 100% on tiles */\r\n.leaflet-container .leaflet-overlay-pane svg,\r\n.leaflet-container .leaflet-marker-pane img,\r\n.leaflet-container .leaflet-shadow-pane img,\r\n.leaflet-container .leaflet-tile-pane img,\r\n.leaflet-container img.leaflet-image-layer {\r\n\tmax-width: none !important;\r\n\tmax-height: none !important;\r\n\t}\r\n\r\n.leaflet-container.leaflet-touch-zoom {\r\n\t-ms-touch-action: pan-x pan-y;\r\n\ttouch-action: pan-x pan-y;\r\n\t}\r\n.leaflet-container.leaflet-touch-drag {\r\n\t-ms-touch-action: pinch-zoom;\r\n\t/* Fallback for FF which doesn't support pinch-zoom */\r\n\ttouch-action: none;\r\n\ttouch-action: pinch-zoom;\r\n}\r\n.leaflet-container.leaflet-touch-drag.leaflet-touch-zoom {\r\n\t-ms-touch-action: none;\r\n\ttouch-action: none;\r\n}\r\n.leaflet-container {\r\n\t-webkit-tap-highlight-color: transparent;\r\n}\r\n.leaflet-container a {\r\n\t-webkit-tap-highlight-color: rgba(51, 181, 229, 0.4);\r\n}\r\n.leaflet-tile {\r\n\tfilter: inherit;\r\n\tvisibility: hidden;\r\n\t}\r\n.leaflet-tile-loaded {\r\n\tvisibility: inherit;\r\n\t}\r\n.leaflet-zoom-box {\r\n\twidth: 0;\r\n\theight: 0;\r\n\t-moz-box-sizing: border-box;\r\n\t     box-sizing: border-box;\r\n\tz-index: 800;\r\n\t}\r\n/* workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=888319 */\r\n.leaflet-overlay-pane svg {\r\n\t-moz-user-select: none;\r\n\t}\r\n\r\n.leaflet-pane         { z-index: 400; }\r\n\r\n.leaflet-tile-pane    { z-index: 200; }\r\n.leaflet-overlay-pane { z-index: 400; }\r\n.leaflet-shadow-pane  { z-index: 500; }\r\n.leaflet-marker-pane  { z-index: 600; }\r\n.leaflet-tooltip-pane   { z-index: 650; }\r\n.leaflet-popup-pane   { z-index: 700; }\r\n\r\n.leaflet-map-pane canvas { z-index: 100; }\r\n.leaflet-map-pane svg    { z-index: 200; }\r\n\r\n.leaflet-vml-shape {\r\n\twidth: 1px;\r\n\theight: 1px;\r\n\t}\r\n.lvml {\r\n\tbehavior: url(#default#VML);\r\n\tdisplay: inline-block;\r\n\tposition: absolute;\r\n\t}\r\n\r\n\r\n/* control positioning */\r\n\r\n.leaflet-control {\r\n\tposition: relative;\r\n\tz-index: 800;\r\n\tpointer-events: visiblePainted; /* IE 9-10 doesn't have auto */\r\n\tpointer-events: auto;\r\n\t}\r\n.leaflet-top,\r\n.leaflet-bottom {\r\n\tposition: absolute;\r\n\tz-index: 1000;\r\n\tpointer-events: none;\r\n\t}\r\n.leaflet-top {\r\n\ttop: 0;\r\n\t}\r\n.leaflet-right {\r\n\tright: 0;\r\n\t}\r\n.leaflet-bottom {\r\n\tbottom: 0;\r\n\t}\r\n.leaflet-left {\r\n\tleft: 0;\r\n\t}\r\n.leaflet-control {\r\n\tfloat: left;\r\n\tclear: both;\r\n\t}\r\n.leaflet-right .leaflet-control {\r\n\tfloat: right;\r\n\t}\r\n.leaflet-top .leaflet-control {\r\n\tmargin-top: 10px;\r\n\t}\r\n.leaflet-bottom .leaflet-control {\r\n\tmargin-bottom: 10px;\r\n\t}\r\n.leaflet-left .leaflet-control {\r\n\tmargin-left: 10px;\r\n\t}\r\n.leaflet-right .leaflet-control {\r\n\tmargin-right: 10px;\r\n\t}\r\n\r\n\r\n/* zoom and fade animations */\r\n\r\n.leaflet-fade-anim .leaflet-tile {\r\n\twill-change: opacity;\r\n\t}\r\n.leaflet-fade-anim .leaflet-popup {\r\n\topacity: 0;\r\n\t-webkit-transition: opacity 0.2s linear;\r\n\t   -moz-transition: opacity 0.2s linear;\r\n\t     -o-transition: opacity 0.2s linear;\r\n\t        transition: opacity 0.2s linear;\r\n\t}\r\n.leaflet-fade-anim .leaflet-map-pane .leaflet-popup {\r\n\topacity: 1;\r\n\t}\r\n.leaflet-zoom-animated {\r\n\t-webkit-transform-origin: 0 0;\r\n\t    -ms-transform-origin: 0 0;\r\n\t        transform-origin: 0 0;\r\n\t}\r\n.leaflet-zoom-anim .leaflet-zoom-animated {\r\n\twill-change: transform;\r\n\t}\r\n.leaflet-zoom-anim .leaflet-zoom-animated {\r\n\t-webkit-transition: -webkit-transform 0.25s cubic-bezier(0,0,0.25,1);\r\n\t   -moz-transition:    -moz-transform 0.25s cubic-bezier(0,0,0.25,1);\r\n\t     -o-transition:      -o-transform 0.25s cubic-bezier(0,0,0.25,1);\r\n\t        transition:         transform 0.25s cubic-bezier(0,0,0.25,1);\r\n\t}\r\n.leaflet-zoom-anim .leaflet-tile,\r\n.leaflet-pan-anim .leaflet-tile {\r\n\t-webkit-transition: none;\r\n\t   -moz-transition: none;\r\n\t     -o-transition: none;\r\n\t        transition: none;\r\n\t}\r\n\r\n.leaflet-zoom-anim .leaflet-zoom-hide {\r\n\tvisibility: hidden;\r\n\t}\r\n\r\n\r\n/* cursors */\r\n\r\n.leaflet-interactive {\r\n\tcursor: pointer;\r\n\t}\r\n.leaflet-grab {\r\n\tcursor: -webkit-grab;\r\n\tcursor:    -moz-grab;\r\n\t}\r\n.leaflet-crosshair,\r\n.leaflet-crosshair .leaflet-interactive {\r\n\tcursor: crosshair;\r\n\t}\r\n.leaflet-popup-pane,\r\n.leaflet-control {\r\n\tcursor: auto;\r\n\t}\r\n.leaflet-dragging .leaflet-grab,\r\n.leaflet-dragging .leaflet-grab .leaflet-interactive,\r\n.leaflet-dragging .leaflet-marker-draggable {\r\n\tcursor: move;\r\n\tcursor: -webkit-grabbing;\r\n\tcursor:    -moz-grabbing;\r\n\t}\r\n\r\n/* marker & overlays interactivity */\r\n.leaflet-marker-icon,\r\n.leaflet-marker-shadow,\r\n.leaflet-image-layer,\r\n.leaflet-pane > svg path,\r\n.leaflet-tile-container {\r\n\tpointer-events: none;\r\n\t}\r\n\r\n.leaflet-marker-icon.leaflet-interactive,\r\n.leaflet-image-layer.leaflet-interactive,\r\n.leaflet-pane > svg path.leaflet-interactive {\r\n\tpointer-events: visiblePainted; /* IE 9-10 doesn't have auto */\r\n\tpointer-events: auto;\r\n\t}\r\n\r\n/* visual tweaks */\r\n\r\n.leaflet-container {\r\n\tbackground: #ddd;\r\n\toutline: 0;\r\n\t}\r\n.leaflet-container a {\r\n\tcolor: #0078A8;\r\n\t}\r\n.leaflet-container a.leaflet-active {\r\n\toutline: 2px solid orange;\r\n\t}\r\n.leaflet-zoom-box {\r\n\tborder: 2px dotted #38f;\r\n\tbackground: rgba(255,255,255,0.5);\r\n\t}\r\n\r\n\r\n/* general typography */\r\n.leaflet-container {\r\n\tfont: 12px/1.5 \"Helvetica Neue\", Arial, Helvetica, sans-serif;\r\n\t}\r\n\r\n\r\n/* general toolbar styles */\r\n\r\n.leaflet-bar {\r\n\tbox-shadow: 0 1px 5px rgba(0,0,0,0.65);\r\n\tborder-radius: 4px;\r\n\t}\r\n.leaflet-bar a,\r\n.leaflet-bar a:hover {\r\n\tbackground-color: #fff;\r\n\tborder-bottom: 1px solid #ccc;\r\n\twidth: 26px;\r\n\theight: 26px;\r\n\tline-height: 26px;\r\n\tdisplay: block;\r\n\ttext-align: center;\r\n\ttext-decoration: none;\r\n\tcolor: black;\r\n\t}\r\n.leaflet-bar a,\r\n.leaflet-control-layers-toggle {\r\n\tbackground-position: 50% 50%;\r\n\tbackground-repeat: no-repeat;\r\n\tdisplay: block;\r\n\t}\r\n.leaflet-bar a:hover {\r\n\tbackground-color: #f4f4f4;\r\n\t}\r\n.leaflet-bar a:first-child {\r\n\tborder-top-left-radius: 4px;\r\n\tborder-top-right-radius: 4px;\r\n\t}\r\n.leaflet-bar a:last-child {\r\n\tborder-bottom-left-radius: 4px;\r\n\tborder-bottom-right-radius: 4px;\r\n\tborder-bottom: none;\r\n\t}\r\n.leaflet-bar a.leaflet-disabled {\r\n\tcursor: default;\r\n\tbackground-color: #f4f4f4;\r\n\tcolor: #bbb;\r\n\t}\r\n\r\n.leaflet-touch .leaflet-bar a {\r\n\twidth: 30px;\r\n\theight: 30px;\r\n\tline-height: 30px;\r\n\t}\r\n.leaflet-touch .leaflet-bar a:first-child {\r\n\tborder-top-left-radius: 2px;\r\n\tborder-top-right-radius: 2px;\r\n\t}\r\n.leaflet-touch .leaflet-bar a:last-child {\r\n\tborder-bottom-left-radius: 2px;\r\n\tborder-bottom-right-radius: 2px;\r\n\t}\r\n\r\n/* zoom control */\r\n\r\n.leaflet-control-zoom-in,\r\n.leaflet-control-zoom-out {\r\n\tfont: bold 18px 'Lucida Console', Monaco, monospace;\r\n\ttext-indent: 1px;\r\n\t}\r\n\r\n.leaflet-touch .leaflet-control-zoom-in, .leaflet-touch .leaflet-control-zoom-out  {\r\n\tfont-size: 22px;\r\n\t}\r\n\r\n\r\n/* layers control */\r\n\r\n.leaflet-control-layers {\r\n\tbox-shadow: 0 1px 5px rgba(0,0,0,0.4);\r\n\tbackground: #fff;\r\n\tborder-radius: 5px;\r\n\t}\r\n.leaflet-control-layers-toggle {\r\n\tbackground-image: url(images/layers.png);\r\n\twidth: 36px;\r\n\theight: 36px;\r\n\t}\r\n.leaflet-retina .leaflet-control-layers-toggle {\r\n\tbackground-image: url(images/layers-2x.png);\r\n\tbackground-size: 26px 26px;\r\n\t}\r\n.leaflet-touch .leaflet-control-layers-toggle {\r\n\twidth: 44px;\r\n\theight: 44px;\r\n\t}\r\n.leaflet-control-layers .leaflet-control-layers-list,\r\n.leaflet-control-layers-expanded .leaflet-control-layers-toggle {\r\n\tdisplay: none;\r\n\t}\r\n.leaflet-control-layers-expanded .leaflet-control-layers-list {\r\n\tdisplay: block;\r\n\tposition: relative;\r\n\t}\r\n.leaflet-control-layers-expanded {\r\n\tpadding: 6px 10px 6px 6px;\r\n\tcolor: #333;\r\n\tbackground: #fff;\r\n\t}\r\n.leaflet-control-layers-scrollbar {\r\n\toverflow-y: scroll;\r\n\toverflow-x: hidden;\r\n\tpadding-right: 5px;\r\n\t}\r\n.leaflet-control-layers-selector {\r\n\tmargin-top: 2px;\r\n\tposition: relative;\r\n\ttop: 1px;\r\n\t}\r\n.leaflet-control-layers label {\r\n\tdisplay: block;\r\n\t}\r\n.leaflet-control-layers-separator {\r\n\theight: 0;\r\n\tborder-top: 1px solid #ddd;\r\n\tmargin: 5px -10px 5px -6px;\r\n\t}\r\n\r\n/* Default icon URLs */\r\n.leaflet-default-icon-path {\r\n\tbackground-image: url(images/marker-icon.png);\r\n\t}\r\n\r\n\r\n/* attribution and scale controls */\r\n\r\n.leaflet-container .leaflet-control-attribution {\r\n\tbackground: #fff;\r\n\tbackground: rgba(255, 255, 255, 0.7);\r\n\tmargin: 0;\r\n\t}\r\n.leaflet-control-attribution,\r\n.leaflet-control-scale-line {\r\n\tpadding: 0 5px;\r\n\tcolor: #333;\r\n\t}\r\n.leaflet-control-attribution a {\r\n\ttext-decoration: none;\r\n\t}\r\n.leaflet-control-attribution a:hover {\r\n\ttext-decoration: underline;\r\n\t}\r\n.leaflet-container .leaflet-control-attribution,\r\n.leaflet-container .leaflet-control-scale {\r\n\tfont-size: 11px;\r\n\t}\r\n.leaflet-left .leaflet-control-scale {\r\n\tmargin-left: 5px;\r\n\t}\r\n.leaflet-bottom .leaflet-control-scale {\r\n\tmargin-bottom: 5px;\r\n\t}\r\n.leaflet-control-scale-line {\r\n\tborder: 2px solid #777;\r\n\tborder-top: none;\r\n\tline-height: 1.1;\r\n\tpadding: 2px 5px 1px;\r\n\tfont-size: 11px;\r\n\twhite-space: nowrap;\r\n\toverflow: hidden;\r\n\t-moz-box-sizing: border-box;\r\n\t     box-sizing: border-box;\r\n\r\n\tbackground: #fff;\r\n\tbackground: rgba(255, 255, 255, 0.5);\r\n\t}\r\n.leaflet-control-scale-line:not(:first-child) {\r\n\tborder-top: 2px solid #777;\r\n\tborder-bottom: none;\r\n\tmargin-top: -2px;\r\n\t}\r\n.leaflet-control-scale-line:not(:first-child):not(:last-child) {\r\n\tborder-bottom: 2px solid #777;\r\n\t}\r\n\r\n.leaflet-touch .leaflet-control-attribution,\r\n.leaflet-touch .leaflet-control-layers,\r\n.leaflet-touch .leaflet-bar {\r\n\tbox-shadow: none;\r\n\t}\r\n.leaflet-touch .leaflet-control-layers,\r\n.leaflet-touch .leaflet-bar {\r\n\tborder: 2px solid rgba(0,0,0,0.2);\r\n\tbackground-clip: padding-box;\r\n\t}\r\n\r\n\r\n/* popup */\r\n\r\n.leaflet-popup {\r\n\tposition: absolute;\r\n\ttext-align: center;\r\n\tmargin-bottom: 20px;\r\n\t}\r\n.leaflet-popup-content-wrapper {\r\n\tpadding: 1px;\r\n\ttext-align: left;\r\n\tborder-radius: 12px;\r\n\t}\r\n.leaflet-popup-content {\r\n\tmargin: 13px 19px;\r\n\tline-height: 1.4;\r\n\t}\r\n.leaflet-popup-content p {\r\n\tmargin: 18px 0;\r\n\t}\r\n.leaflet-popup-tip-container {\r\n\twidth: 40px;\r\n\theight: 20px;\r\n\tposition: absolute;\r\n\tleft: 50%;\r\n\tmargin-left: -20px;\r\n\toverflow: hidden;\r\n\tpointer-events: none;\r\n\t}\r\n.leaflet-popup-tip {\r\n\twidth: 17px;\r\n\theight: 17px;\r\n\tpadding: 1px;\r\n\r\n\tmargin: -10px auto 0;\r\n\r\n\t-webkit-transform: rotate(45deg);\r\n\t   -moz-transform: rotate(45deg);\r\n\t    -ms-transform: rotate(45deg);\r\n\t     -o-transform: rotate(45deg);\r\n\t        transform: rotate(45deg);\r\n\t}\r\n.leaflet-popup-content-wrapper,\r\n.leaflet-popup-tip {\r\n\tbackground: white;\r\n\tcolor: #333;\r\n\tbox-shadow: 0 3px 14px rgba(0,0,0,0.4);\r\n\t}\r\n.leaflet-container a.leaflet-popup-close-button {\r\n\tposition: absolute;\r\n\ttop: 0;\r\n\tright: 0;\r\n\tpadding: 4px 4px 0 0;\r\n\tborder: none;\r\n\ttext-align: center;\r\n\twidth: 18px;\r\n\theight: 14px;\r\n\tfont: 16px/14px Tahoma, Verdana, sans-serif;\r\n\tcolor: #c3c3c3;\r\n\ttext-decoration: none;\r\n\tfont-weight: bold;\r\n\tbackground: transparent;\r\n\t}\r\n.leaflet-container a.leaflet-popup-close-button:hover {\r\n\tcolor: #999;\r\n\t}\r\n.leaflet-popup-scrolled {\r\n\toverflow: auto;\r\n\tborder-bottom: 1px solid #ddd;\r\n\tborder-top: 1px solid #ddd;\r\n\t}\r\n\r\n.leaflet-oldie .leaflet-popup-content-wrapper {\r\n\tzoom: 1;\r\n\t}\r\n.leaflet-oldie .leaflet-popup-tip {\r\n\twidth: 24px;\r\n\tmargin: 0 auto;\r\n\r\n\t-ms-filter: \"progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678)\";\r\n\tfilter: progid:DXImageTransform.Microsoft.Matrix(M11=0.70710678, M12=0.70710678, M21=-0.70710678, M22=0.70710678);\r\n\t}\r\n.leaflet-oldie .leaflet-popup-tip-container {\r\n\tmargin-top: -1px;\r\n\t}\r\n\r\n.leaflet-oldie .leaflet-control-zoom,\r\n.leaflet-oldie .leaflet-control-layers,\r\n.leaflet-oldie .leaflet-popup-content-wrapper,\r\n.leaflet-oldie .leaflet-popup-tip {\r\n\tborder: 1px solid #999;\r\n\t}\r\n\r\n\r\n/* div icon */\r\n\r\n.leaflet-div-icon {\r\n\tbackground: #fff;\r\n\tborder: 1px solid #666;\r\n\t}\r\n\r\n\r\n/* Tooltip */\r\n/* Base styles for the element that has a tooltip */\r\n.leaflet-tooltip {\r\n\tposition: absolute;\r\n\tpadding: 6px;\r\n\tbackground-color: #fff;\r\n\tborder: 1px solid #fff;\r\n\tborder-radius: 3px;\r\n\tcolor: #222;\r\n\twhite-space: nowrap;\r\n\t-webkit-user-select: none;\r\n\t-moz-user-select: none;\r\n\t-ms-user-select: none;\r\n\tuser-select: none;\r\n\tpointer-events: none;\r\n\tbox-shadow: 0 1px 3px rgba(0,0,0,0.4);\r\n\t}\r\n.leaflet-tooltip.leaflet-clickable {\r\n\tcursor: pointer;\r\n\tpointer-events: auto;\r\n\t}\r\n.leaflet-tooltip-top:before,\r\n.leaflet-tooltip-bottom:before,\r\n.leaflet-tooltip-left:before,\r\n.leaflet-tooltip-right:before {\r\n\tposition: absolute;\r\n\tpointer-events: none;\r\n\tborder: 6px solid transparent;\r\n\tbackground: transparent;\r\n\tcontent: \"\";\r\n\t}\r\n\r\n/* Directions */\r\n\r\n.leaflet-tooltip-bottom {\r\n\tmargin-top: 6px;\r\n}\r\n.leaflet-tooltip-top {\r\n\tmargin-top: -6px;\r\n}\r\n.leaflet-tooltip-bottom:before,\r\n.leaflet-tooltip-top:before {\r\n\tleft: 50%;\r\n\tmargin-left: -6px;\r\n\t}\r\n.leaflet-tooltip-top:before {\r\n\tbottom: 0;\r\n\tmargin-bottom: -12px;\r\n\tborder-top-color: #fff;\r\n\t}\r\n.leaflet-tooltip-bottom:before {\r\n\ttop: 0;\r\n\tmargin-top: -12px;\r\n\tmargin-left: -6px;\r\n\tborder-bottom-color: #fff;\r\n\t}\r\n.leaflet-tooltip-left {\r\n\tmargin-left: -6px;\r\n}\r\n.leaflet-tooltip-right {\r\n\tmargin-left: 6px;\r\n}\r\n.leaflet-tooltip-left:before,\r\n.leaflet-tooltip-right:before {\r\n\ttop: 50%;\r\n\tmargin-top: -6px;\r\n\t}\r\n.leaflet-tooltip-left:before {\r\n\tright: 0;\r\n\tmargin-right: -12px;\r\n\tborder-left-color: #fff;\r\n\t}\r\n.leaflet-tooltip-right:before {\r\n\tleft: 0;\r\n\tmargin-left: -12px;\r\n\tborder-right-color: #fff;\r\n\t}\r\n\n/*\nIt's recommended to add the following rule to your stylesheet, in order to prevent FOUC\nleaflet-map[^ready] { display: none }\n*/\nleaflet-map {\n  display: block;\n}\nleaflet-map * {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  -ms-box-sizing: border-box;\n  box-sizing: border-box;\n}\nleaflet-map:not([ready]) {\n  display: none;\n}\nleaflet-map .default-map-marker {\n  background: black;\n  border: 1px solid #888;\n  border-radius: 100%;\n  width: 16px;\n  height: 16px;\n  margin-left: -8px;\n  margin-top: -8px;\n}\n";
document.head.appendChild(style);

var _$documentRegisterElement_13 = {};
"use strict";

var ___typeof_13 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! (C) Andrea Giammarchi - @WebReflection - Mit Style License */
(function (window, polyfill) {
  "use strict";
  var document = window.document,
      Object = window.Object;var htmlClass = function (info) {
    var catchClass = /^[A-Z]+[a-z]/,
        filterBy = function filterBy(re) {
      var arr = [],
          tag;for (tag in register) {
        if (re.test(tag)) arr.push(tag);
      }return arr;
    },
        add = function add(Class, tag) {
      tag = tag.toLowerCase();if (!(tag in register)) {
        register[Class] = (register[Class] || []).concat(tag);register[tag] = register[tag.toUpperCase()] = Class;
      }
    },
        register = (Object.create || Object)(null),
        htmlClass = {},
        i,
        section,
        tags,
        Class;for (section in info) {
      for (Class in info[section]) {
        tags = info[section][Class];register[Class] = tags;for (i = 0; i < tags.length; i++) {
          register[tags[i].toLowerCase()] = register[tags[i].toUpperCase()] = Class;
        }
      }
    }htmlClass.get = function get(tagOrClass) {
      return typeof tagOrClass === "string" ? register[tagOrClass] || (catchClass.test(tagOrClass) ? [] : "") : filterBy(tagOrClass);
    };htmlClass.set = function set(tag, Class) {
      return catchClass.test(tag) ? add(tag, Class) : add(Class, tag), htmlClass;
    };return htmlClass;
  }({ collections: { HTMLAllCollection: ["all"], HTMLCollection: ["forms"], HTMLFormControlsCollection: ["elements"], HTMLOptionsCollection: ["options"] }, elements: { Element: ["element"], HTMLAnchorElement: ["a"], HTMLAppletElement: ["applet"], HTMLAreaElement: ["area"], HTMLAttachmentElement: ["attachment"], HTMLAudioElement: ["audio"], HTMLBRElement: ["br"], HTMLBaseElement: ["base"], HTMLBodyElement: ["body"], HTMLButtonElement: ["button"], HTMLCanvasElement: ["canvas"], HTMLContentElement: ["content"], HTMLDListElement: ["dl"], HTMLDataElement: ["data"], HTMLDataListElement: ["datalist"], HTMLDetailsElement: ["details"], HTMLDialogElement: ["dialog"], HTMLDirectoryElement: ["dir"], HTMLDivElement: ["div"], HTMLDocument: ["document"], HTMLElement: ["element", "abbr", "address", "article", "aside", "b", "bdi", "bdo", "cite", "code", "command", "dd", "dfn", "dt", "em", "figcaption", "figure", "footer", "header", "i", "kbd", "mark", "nav", "noscript", "rp", "rt", "ruby", "s", "samp", "section", "small", "strong", "sub", "summary", "sup", "u", "var", "wbr"], HTMLEmbedElement: ["embed"], HTMLFieldSetElement: ["fieldset"], HTMLFontElement: ["font"], HTMLFormElement: ["form"], HTMLFrameElement: ["frame"], HTMLFrameSetElement: ["frameset"], HTMLHRElement: ["hr"], HTMLHeadElement: ["head"], HTMLHeadingElement: ["h1", "h2", "h3", "h4", "h5", "h6"], HTMLHtmlElement: ["html"], HTMLIFrameElement: ["iframe"], HTMLImageElement: ["img"], HTMLInputElement: ["input"], HTMLKeygenElement: ["keygen"], HTMLLIElement: ["li"], HTMLLabelElement: ["label"], HTMLLegendElement: ["legend"], HTMLLinkElement: ["link"], HTMLMapElement: ["map"], HTMLMarqueeElement: ["marquee"], HTMLMediaElement: ["media"], HTMLMenuElement: ["menu"], HTMLMenuItemElement: ["menuitem"], HTMLMetaElement: ["meta"], HTMLMeterElement: ["meter"], HTMLModElement: ["del", "ins"], HTMLOListElement: ["ol"], HTMLObjectElement: ["object"], HTMLOptGroupElement: ["optgroup"], HTMLOptionElement: ["option"], HTMLOutputElement: ["output"], HTMLParagraphElement: ["p"], HTMLParamElement: ["param"], HTMLPictureElement: ["picture"], HTMLPreElement: ["pre"], HTMLProgressElement: ["progress"], HTMLQuoteElement: ["blockquote", "q", "quote"], HTMLScriptElement: ["script"], HTMLSelectElement: ["select"], HTMLShadowElement: ["shadow"], HTMLSlotElement: ["slot"], HTMLSourceElement: ["source"], HTMLSpanElement: ["span"], HTMLStyleElement: ["style"], HTMLTableCaptionElement: ["caption"], HTMLTableCellElement: ["td", "th"], HTMLTableColElement: ["col", "colgroup"], HTMLTableElement: ["table"], HTMLTableRowElement: ["tr"], HTMLTableSectionElement: ["thead", "tbody", "tfoot"], HTMLTemplateElement: ["template"], HTMLTextAreaElement: ["textarea"], HTMLTimeElement: ["time"], HTMLTitleElement: ["title"], HTMLTrackElement: ["track"], HTMLUListElement: ["ul"], HTMLUnknownElement: ["unknown", "vhgroupv", "vkeygen"], HTMLVideoElement: ["video"] }, nodes: { Attr: ["node"], Audio: ["audio"], CDATASection: ["node"], CharacterData: ["node"], Comment: ["#comment"], Document: ["#document"], DocumentFragment: ["#document-fragment"], DocumentType: ["node"], HTMLDocument: ["#document"], Image: ["img"], Option: ["option"], ProcessingInstruction: ["node"], ShadowRoot: ["#shadow-root"], Text: ["#text"], XMLDocument: ["xml"] } });if ((typeof polyfill === "undefined" ? "undefined" : ___typeof_13(polyfill)) !== "object") polyfill = { type: polyfill || "auto" };var REGISTER_ELEMENT = "registerElement",
      EXPANDO_UID = "__" + REGISTER_ELEMENT + (window.Math.random() * 1e5 >> 0),
      ADD_EVENT_LISTENER = "addEventListener",
      ATTACHED = "attached",
      CALLBACK = "Callback",
      DETACHED = "detached",
      EXTENDS = "extends",
      ATTRIBUTE_CHANGED_CALLBACK = "attributeChanged" + CALLBACK,
      ATTACHED_CALLBACK = ATTACHED + CALLBACK,
      CONNECTED_CALLBACK = "connected" + CALLBACK,
      DISCONNECTED_CALLBACK = "disconnected" + CALLBACK,
      CREATED_CALLBACK = "created" + CALLBACK,
      DETACHED_CALLBACK = DETACHED + CALLBACK,
      ADDITION = "ADDITION",
      MODIFICATION = "MODIFICATION",
      REMOVAL = "REMOVAL",
      DOM_ATTR_MODIFIED = "DOMAttrModified",
      DOM_CONTENT_LOADED = "DOMContentLoaded",
      DOM_SUBTREE_MODIFIED = "DOMSubtreeModified",
      PREFIX_TAG = "<",
      PREFIX_IS = "=",
      validName = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,
      invalidNames = ["ANNOTATION-XML", "COLOR-PROFILE", "FONT-FACE", "FONT-FACE-SRC", "FONT-FACE-URI", "FONT-FACE-FORMAT", "FONT-FACE-NAME", "MISSING-GLYPH"],
      types = [],
      protos = [],
      query = "",
      documentElement = document.documentElement,
      indexOf = types.indexOf || function (v) {
    for (var i = this.length; i-- && this[i] !== v;) {}return i;
  },
      OP = Object.prototype,
      hOP = OP.hasOwnProperty,
      iPO = OP.isPrototypeOf,
      defineProperty = Object.defineProperty,
      empty = [],
      gOPD = Object.getOwnPropertyDescriptor,
      gOPN = Object.getOwnPropertyNames,
      gPO = Object.getPrototypeOf,
      sPO = Object.setPrototypeOf,
      hasProto = !!Object.__proto__,
      fixGetClass = false,
      DRECEV1 = "__dreCEv1",
      customElements = window.customElements,
      usableCustomElements = !/^force/.test(polyfill.type) && !!(customElements && customElements.define && customElements.get && customElements.whenDefined),
      Dict = Object.create || Object,
      Map = window.Map || function Map() {
    var K = [],
        V = [],
        i;return { get: function get(k) {
        return V[indexOf.call(K, k)];
      }, set: function set(k, v) {
        i = indexOf.call(K, k);if (i < 0) V[K.push(k) - 1] = v;else V[i] = v;
      } };
  },
      Promise = window.Promise || function (fn) {
    var notify = [],
        done = false,
        p = { catch: function _catch() {
        return p;
      }, then: function then(cb) {
        notify.push(cb);if (done) setTimeout(resolve, 1);return p;
      } };function resolve(value) {
      done = true;while (notify.length) {
        notify.shift()(value);
      }
    }fn(resolve);return p;
  },
      justCreated = false,
      constructors = Dict(null),
      waitingList = Dict(null),
      nodeNames = new Map(),
      secondArgument = function secondArgument(is) {
    return is.toLowerCase();
  },
      create = Object.create || function Bridge(proto) {
    return proto ? (Bridge.prototype = proto, new Bridge()) : this;
  },
      setPrototype = sPO || (hasProto ? function (o, p) {
    o.__proto__ = p;return o;
  } : gOPN && gOPD ? function () {
    function setProperties(o, p) {
      for (var key, names = gOPN(p), i = 0, length = names.length; i < length; i++) {
        key = names[i];if (!hOP.call(o, key)) {
          defineProperty(o, key, gOPD(p, key));
        }
      }
    }return function (o, p) {
      do {
        setProperties(o, p);
      } while ((p = gPO(p)) && !iPO.call(p, o));return o;
    };
  }() : function (o, p) {
    for (var key in p) {
      o[key] = p[key];
    }return o;
  }),
      MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
      HTMLElementPrototype = (window.HTMLElement || window.Element || window.Node).prototype,
      IE8 = !iPO.call(HTMLElementPrototype, documentElement),
      safeProperty = IE8 ? function (o, k, d) {
    o[k] = d.value;return o;
  } : defineProperty,
      isValidNode = IE8 ? function (node) {
    return node.nodeType === 1;
  } : function (node) {
    return iPO.call(HTMLElementPrototype, node);
  },
      targets = IE8 && [],
      attachShadow = HTMLElementPrototype.attachShadow,
      cloneNode = HTMLElementPrototype.cloneNode,
      dispatchEvent = HTMLElementPrototype.dispatchEvent,
      getAttribute = HTMLElementPrototype.getAttribute,
      hasAttribute = HTMLElementPrototype.hasAttribute,
      removeAttribute = HTMLElementPrototype.removeAttribute,
      setAttribute = HTMLElementPrototype.setAttribute,
      createElement = document.createElement,
      patchedCreateElement = createElement,
      attributesObserver = MutationObserver && { attributes: true, characterData: true, attributeOldValue: true },
      DOMAttrModified = MutationObserver || function (e) {
    doesNotSupportDOMAttrModified = false;documentElement.removeEventListener(DOM_ATTR_MODIFIED, DOMAttrModified);
  },
      asapQueue,
      asapTimer = 0,
      V0 = REGISTER_ELEMENT in document && !/^force-all/.test(polyfill.type),
      setListener = true,
      justSetup = false,
      doesNotSupportDOMAttrModified = true,
      dropDomContentLoaded = true,
      notFromInnerHTMLHelper = true,
      onSubtreeModified,
      callDOMAttrModified,
      getAttributesMirror,
      observer,
      observe,
      patchIfNotAlready,
      patch,
      tmp;if (MutationObserver) {
    tmp = document.createElement("div");tmp.innerHTML = "<div><div></div></div>";new MutationObserver(function (mutations, observer) {
      if (mutations[0] && mutations[0].type == "childList" && !mutations[0].removedNodes[0].childNodes.length) {
        tmp = gOPD(HTMLElementPrototype, "innerHTML");var _set = tmp && tmp.set;if (_set) defineProperty(HTMLElementPrototype, "innerHTML", { set: function set(value) {
            while (this.lastChild) {
              this.removeChild(this.lastChild);
            }_set.call(this, value);
          } });
      }observer.disconnect();tmp = null;
    }).observe(tmp, { childList: true, subtree: true });tmp.innerHTML = "";
  }if (!V0) {
    if (sPO || hasProto) {
      patchIfNotAlready = function patchIfNotAlready(node, proto) {
        if (!iPO.call(proto, node)) {
          setupNode(node, proto);
        }
      };patch = setupNode;
    } else {
      patchIfNotAlready = function patchIfNotAlready(node, proto) {
        if (!node[EXPANDO_UID]) {
          node[EXPANDO_UID] = Object(true);setupNode(node, proto);
        }
      };patch = patchIfNotAlready;
    }if (IE8) {
      doesNotSupportDOMAttrModified = false;(function () {
        var descriptor = gOPD(HTMLElementPrototype, ADD_EVENT_LISTENER),
            addEventListener = descriptor.value,
            patchedRemoveAttribute = function patchedRemoveAttribute(name) {
          var e = new CustomEvent(DOM_ATTR_MODIFIED, { bubbles: true });e.attrName = name;e.prevValue = getAttribute.call(this, name);e.newValue = null;e[REMOVAL] = e.attrChange = 2;removeAttribute.call(this, name);dispatchEvent.call(this, e);
        },
            patchedSetAttribute = function patchedSetAttribute(name, value) {
          var had = hasAttribute.call(this, name),
              old = had && getAttribute.call(this, name),
              e = new CustomEvent(DOM_ATTR_MODIFIED, { bubbles: true });setAttribute.call(this, name, value);e.attrName = name;e.prevValue = had ? old : null;e.newValue = value;if (had) {
            e[MODIFICATION] = e.attrChange = 1;
          } else {
            e[ADDITION] = e.attrChange = 0;
          }dispatchEvent.call(this, e);
        },
            onPropertyChange = function onPropertyChange(e) {
          var node = e.currentTarget,
              superSecret = node[EXPANDO_UID],
              propertyName = e.propertyName,
              event;if (superSecret.hasOwnProperty(propertyName)) {
            superSecret = superSecret[propertyName];event = new CustomEvent(DOM_ATTR_MODIFIED, { bubbles: true });event.attrName = superSecret.name;event.prevValue = superSecret.value || null;event.newValue = superSecret.value = node[propertyName] || null;if (event.prevValue == null) {
              event[ADDITION] = event.attrChange = 0;
            } else {
              event[MODIFICATION] = event.attrChange = 1;
            }dispatchEvent.call(node, event);
          }
        };descriptor.value = function (type, handler, capture) {
          if (type === DOM_ATTR_MODIFIED && this[ATTRIBUTE_CHANGED_CALLBACK] && this.setAttribute !== patchedSetAttribute) {
            this[EXPANDO_UID] = { className: { name: "class", value: this.className } };this.setAttribute = patchedSetAttribute;this.removeAttribute = patchedRemoveAttribute;addEventListener.call(this, "propertychange", onPropertyChange);
          }addEventListener.call(this, type, handler, capture);
        };defineProperty(HTMLElementPrototype, ADD_EVENT_LISTENER, descriptor);
      })();
    } else if (!MutationObserver) {
      documentElement[ADD_EVENT_LISTENER](DOM_ATTR_MODIFIED, DOMAttrModified);documentElement.setAttribute(EXPANDO_UID, 1);documentElement.removeAttribute(EXPANDO_UID);if (doesNotSupportDOMAttrModified) {
        onSubtreeModified = function onSubtreeModified(e) {
          var node = this,
              oldAttributes,
              newAttributes,
              key;if (node === e.target) {
            oldAttributes = node[EXPANDO_UID];node[EXPANDO_UID] = newAttributes = getAttributesMirror(node);for (key in newAttributes) {
              if (!(key in oldAttributes)) {
                return callDOMAttrModified(0, node, key, oldAttributes[key], newAttributes[key], ADDITION);
              } else if (newAttributes[key] !== oldAttributes[key]) {
                return callDOMAttrModified(1, node, key, oldAttributes[key], newAttributes[key], MODIFICATION);
              }
            }for (key in oldAttributes) {
              if (!(key in newAttributes)) {
                return callDOMAttrModified(2, node, key, oldAttributes[key], newAttributes[key], REMOVAL);
              }
            }
          }
        };callDOMAttrModified = function callDOMAttrModified(attrChange, currentTarget, attrName, prevValue, newValue, action) {
          var e = { attrChange: attrChange, currentTarget: currentTarget, attrName: attrName, prevValue: prevValue, newValue: newValue };e[action] = attrChange;onDOMAttrModified(e);
        };getAttributesMirror = function getAttributesMirror(node) {
          for (var attr, name, result = {}, attributes = node.attributes, i = 0, length = attributes.length; i < length; i++) {
            attr = attributes[i];name = attr.name;if (name !== "setAttribute") {
              result[name] = attr.value;
            }
          }return result;
        };
      }
    }document[REGISTER_ELEMENT] = function registerElement(type, options) {
      upperType = type.toUpperCase();if (setListener) {
        setListener = false;if (MutationObserver) {
          observer = function (attached, detached) {
            function checkEmAll(list, callback) {
              for (var i = 0, length = list.length; i < length; callback(list[i++])) {}
            }return new MutationObserver(function (records) {
              for (var current, node, newValue, i = 0, length = records.length; i < length; i++) {
                current = records[i];if (current.type === "childList") {
                  checkEmAll(current.addedNodes, attached);checkEmAll(current.removedNodes, detached);
                } else {
                  node = current.target;if (notFromInnerHTMLHelper && node[ATTRIBUTE_CHANGED_CALLBACK] && current.attributeName !== "style") {
                    newValue = getAttribute.call(node, current.attributeName);if (newValue !== current.oldValue) {
                      node[ATTRIBUTE_CHANGED_CALLBACK](current.attributeName, current.oldValue, newValue);
                    }
                  }
                }
              }
            });
          }(executeAction(ATTACHED), executeAction(DETACHED));observe = function observe(node) {
            observer.observe(node, { childList: true, subtree: true });return node;
          };observe(document);if (attachShadow) {
            HTMLElementPrototype.attachShadow = function () {
              return observe(attachShadow.apply(this, arguments));
            };
          }
        } else {
          asapQueue = [];document[ADD_EVENT_LISTENER]("DOMNodeInserted", onDOMNode(ATTACHED));document[ADD_EVENT_LISTENER]("DOMNodeRemoved", onDOMNode(DETACHED));
        }document[ADD_EVENT_LISTENER](DOM_CONTENT_LOADED, onReadyStateChange);document[ADD_EVENT_LISTENER]("readystatechange", onReadyStateChange);HTMLElementPrototype.cloneNode = function (deep) {
          var node = cloneNode.call(this, !!deep),
              i = getTypeIndex(node);if (-1 < i) patch(node, protos[i]);if (deep && query.length) loopAndSetup(node.querySelectorAll(query));return node;
        };
      }if (justSetup) return justSetup = false;if (-2 < indexOf.call(types, PREFIX_IS + upperType) + indexOf.call(types, PREFIX_TAG + upperType)) {
        throwTypeError(type);
      }if (!validName.test(upperType) || -1 < indexOf.call(invalidNames, upperType)) {
        throw new Error("The type " + type + " is invalid");
      }var constructor = function constructor() {
        return extending ? document.createElement(nodeName, upperType) : document.createElement(nodeName);
      },
          opt = options || OP,
          extending = hOP.call(opt, EXTENDS),
          nodeName = extending ? options[EXTENDS].toUpperCase() : upperType,
          upperType,
          i;if (extending && -1 < indexOf.call(types, PREFIX_TAG + nodeName)) {
        throwTypeError(nodeName);
      }i = types.push((extending ? PREFIX_IS : PREFIX_TAG) + upperType) - 1;query = query.concat(query.length ? "," : "", extending ? nodeName + '[is="' + type.toLowerCase() + '"]' : nodeName);constructor.prototype = protos[i] = hOP.call(opt, "prototype") ? opt.prototype : create(HTMLElementPrototype);if (query.length) loopAndVerify(document.querySelectorAll(query), ATTACHED);return constructor;
    };document.createElement = patchedCreateElement = function patchedCreateElement(localName, typeExtension) {
      var is = getIs(typeExtension),
          node = is ? createElement.call(document, localName, secondArgument(is)) : createElement.call(document, localName),
          name = "" + localName,
          i = indexOf.call(types, (is ? PREFIX_IS : PREFIX_TAG) + (is || name).toUpperCase()),
          setup = -1 < i;if (is) {
        node.setAttribute("is", is = is.toLowerCase());if (setup) {
          setup = isInQSA(name.toUpperCase(), is);
        }
      }notFromInnerHTMLHelper = !document.createElement.innerHTMLHelper;if (setup) patch(node, protos[i]);return node;
    };
  }function ASAP() {
    var queue = asapQueue.splice(0, asapQueue.length);asapTimer = 0;while (queue.length) {
      queue.shift().call(null, queue.shift());
    }
  }function loopAndVerify(list, action) {
    for (var i = 0, length = list.length; i < length; i++) {
      verifyAndSetupAndAction(list[i], action);
    }
  }function loopAndSetup(list) {
    for (var i = 0, length = list.length, node; i < length; i++) {
      node = list[i];patch(node, protos[getTypeIndex(node)]);
    }
  }function executeAction(action) {
    return function (node) {
      if (isValidNode(node)) {
        verifyAndSetupAndAction(node, action);if (query.length) loopAndVerify(node.querySelectorAll(query), action);
      }
    };
  }function getTypeIndex(target) {
    var is = getAttribute.call(target, "is"),
        nodeName = target.nodeName.toUpperCase(),
        i = indexOf.call(types, is ? PREFIX_IS + is.toUpperCase() : PREFIX_TAG + nodeName);return is && -1 < i && !isInQSA(nodeName, is) ? -1 : i;
  }function isInQSA(name, type) {
    return -1 < query.indexOf(name + '[is="' + type + '"]');
  }function onDOMAttrModified(e) {
    var node = e.currentTarget,
        attrChange = e.attrChange,
        attrName = e.attrName,
        target = e.target,
        addition = e[ADDITION] || 2,
        removal = e[REMOVAL] || 3;if (notFromInnerHTMLHelper && (!target || target === node) && node[ATTRIBUTE_CHANGED_CALLBACK] && attrName !== "style" && (e.prevValue !== e.newValue || e.newValue === "" && (attrChange === addition || attrChange === removal))) {
      node[ATTRIBUTE_CHANGED_CALLBACK](attrName, attrChange === addition ? null : e.prevValue, attrChange === removal ? null : e.newValue);
    }
  }function onDOMNode(action) {
    var executor = executeAction(action);return function (e) {
      asapQueue.push(executor, e.target);if (asapTimer) clearTimeout(asapTimer);asapTimer = setTimeout(ASAP, 1);
    };
  }function onReadyStateChange(e) {
    if (dropDomContentLoaded) {
      dropDomContentLoaded = false;e.currentTarget.removeEventListener(DOM_CONTENT_LOADED, onReadyStateChange);
    }if (query.length) loopAndVerify((e.target || document).querySelectorAll(query), e.detail === DETACHED ? DETACHED : ATTACHED);if (IE8) purge();
  }function patchedSetAttribute(name, value) {
    var self = this;setAttribute.call(self, name, value);onSubtreeModified.call(self, { target: self });
  }function setupNode(node, proto) {
    setPrototype(node, proto);if (observer) {
      observer.observe(node, attributesObserver);
    } else {
      if (doesNotSupportDOMAttrModified) {
        node.setAttribute = patchedSetAttribute;node[EXPANDO_UID] = getAttributesMirror(node);node[ADD_EVENT_LISTENER](DOM_SUBTREE_MODIFIED, onSubtreeModified);
      }node[ADD_EVENT_LISTENER](DOM_ATTR_MODIFIED, onDOMAttrModified);
    }if (node[CREATED_CALLBACK] && notFromInnerHTMLHelper) {
      node.created = true;node[CREATED_CALLBACK]();node.created = false;
    }
  }function purge() {
    for (var node, i = 0, length = targets.length; i < length; i++) {
      node = targets[i];if (!documentElement.contains(node)) {
        length--;targets.splice(i--, 1);verifyAndSetupAndAction(node, DETACHED);
      }
    }
  }function throwTypeError(type) {
    throw new Error("A " + type + " type is already registered");
  }function verifyAndSetupAndAction(node, action) {
    var fn,
        i = getTypeIndex(node),
        counterAction;if (-1 < i) {
      patchIfNotAlready(node, protos[i]);i = 0;if (action === ATTACHED && !node[ATTACHED]) {
        node[DETACHED] = false;node[ATTACHED] = true;counterAction = "connected";i = 1;if (IE8 && indexOf.call(targets, node) < 0) {
          targets.push(node);
        }
      } else if (action === DETACHED && !node[DETACHED]) {
        node[ATTACHED] = false;node[DETACHED] = true;counterAction = "disconnected";i = 1;
      }if (i && (fn = node[action + CALLBACK] || node[counterAction + CALLBACK])) fn.call(node);
    }
  }function CustomElementRegistry() {}CustomElementRegistry.prototype = { constructor: CustomElementRegistry, define: usableCustomElements ? function (name, Class, options) {
      if (options) {
        CERDefine(name, Class, options);
      } else {
        var NAME = name.toUpperCase();constructors[NAME] = { constructor: Class, create: [NAME] };nodeNames.set(Class, NAME);customElements.define(name, Class);
      }
    } : CERDefine, get: usableCustomElements ? function (name) {
      return customElements.get(name) || get(name);
    } : get, whenDefined: usableCustomElements ? function (name) {
      return Promise.race([customElements.whenDefined(name), whenDefined(name)]);
    } : whenDefined };function CERDefine(name, Class, options) {
    var is = options && options[EXTENDS] || "",
        CProto = Class.prototype,
        proto = create(CProto),
        attributes = Class.observedAttributes || empty,
        definition = { prototype: proto };safeProperty(proto, CREATED_CALLBACK, { value: function value() {
        if (justCreated) justCreated = false;else if (!this[DRECEV1]) {
          this[DRECEV1] = true;new Class(this);if (CProto[CREATED_CALLBACK]) CProto[CREATED_CALLBACK].call(this);var info = constructors[nodeNames.get(Class)];if (!usableCustomElements || info.create.length > 1) {
            notifyAttributes(this);
          }
        }
      } });safeProperty(proto, ATTRIBUTE_CHANGED_CALLBACK, { value: function value(name) {
        if (-1 < indexOf.call(attributes, name)) CProto[ATTRIBUTE_CHANGED_CALLBACK].apply(this, arguments);
      } });if (CProto[CONNECTED_CALLBACK]) {
      safeProperty(proto, ATTACHED_CALLBACK, { value: CProto[CONNECTED_CALLBACK] });
    }if (CProto[DISCONNECTED_CALLBACK]) {
      safeProperty(proto, DETACHED_CALLBACK, { value: CProto[DISCONNECTED_CALLBACK] });
    }if (is) definition[EXTENDS] = is;name = name.toUpperCase();constructors[name] = { constructor: Class, create: is ? [is, secondArgument(name)] : [name] };nodeNames.set(Class, name);document[REGISTER_ELEMENT](name.toLowerCase(), definition);whenDefined(name);waitingList[name].r();
  }function get(name) {
    var info = constructors[name.toUpperCase()];return info && info.constructor;
  }function getIs(options) {
    return typeof options === "string" ? options : options && options.is || "";
  }function notifyAttributes(self) {
    var callback = self[ATTRIBUTE_CHANGED_CALLBACK],
        attributes = callback ? self.attributes : empty,
        i = attributes.length,
        attribute;while (i--) {
      attribute = attributes[i];callback.call(self, attribute.name || attribute.nodeName, null, attribute.value || attribute.nodeValue);
    }
  }function whenDefined(name) {
    name = name.toUpperCase();if (!(name in waitingList)) {
      waitingList[name] = {};waitingList[name].p = new Promise(function (resolve) {
        waitingList[name].r = resolve;
      });
    }return waitingList[name].p;
  }function polyfillV1() {
    if (customElements) delete window.customElements;defineProperty(window, "customElements", { configurable: true, value: new CustomElementRegistry() });defineProperty(window, "CustomElementRegistry", { configurable: true, value: CustomElementRegistry });for (var patchClass = function patchClass(name) {
      var Class = window[name];if (Class) {
        window[name] = function CustomElementsV1(self) {
          var info, isNative;if (!self) self = this;if (!self[DRECEV1]) {
            justCreated = true;info = constructors[nodeNames.get(self.constructor)];isNative = usableCustomElements && info.create.length === 1;self = isNative ? Reflect.construct(Class, empty, info.constructor) : document.createElement.apply(document, info.create);self[DRECEV1] = true;justCreated = false;if (!isNative) notifyAttributes(self);
          }return self;
        };window[name].prototype = Class.prototype;try {
          Class.prototype.constructor = window[name];
        } catch (WebKit) {
          fixGetClass = true;defineProperty(Class, DRECEV1, { value: window[name] });
        }
      }
    }, Classes = htmlClass.get(/^HTML[A-Z]*[a-z]/), i = Classes.length; i--; patchClass(Classes[i])) {}document.createElement = function (name, options) {
      var is = getIs(options);return is ? patchedCreateElement.call(this, name, secondArgument(is)) : patchedCreateElement.call(this, name);
    };if (!V0) {
      justSetup = true;document[REGISTER_ELEMENT]("");
    }
  }if (!customElements || /^force/.test(polyfill.type)) polyfillV1();else if (!polyfill.noBuiltIn) {
    try {
      (function (DRE, options, name) {
        options[EXTENDS] = "a";DRE.prototype = create(HTMLAnchorElement.prototype);DRE.prototype.constructor = DRE;window.customElements.define(name, DRE, options);if (getAttribute.call(document.createElement("a", { is: name }), "is") !== name || usableCustomElements && getAttribute.call(new DRE(), "is") !== name) {
          throw options;
        }
      })(function DRE() {
        return Reflect.construct(HTMLAnchorElement, [], DRE);
      }, {}, "document-register-element-a");
    } catch (o_O) {
      polyfillV1();
    }
  }if (!polyfill.noBuiltIn) {
    try {
      createElement.call(document, "a", "a");
    } catch (FireFox) {
      secondArgument = function secondArgument(is) {
        return { is: is.toLowerCase() };
      };
    }
  }
})(window);

var _$leafletMap_7 = {};
"use strict";

_$documentRegisterElement_13;
/* removed: var _$leaflet_14 = require("leaflet"); */;
/* removed: var _$configParser_1 = require("./config-parser"); */;
/* removed: var _$factory_6 = require("./factory"); */;

//styles
_$leafletMap_8;

var proto = Object.create(HTMLElement.prototype);

proto.createdCallback = function () {
  //read configuration from the element and its contents
  var config = _$configParser_1(this);

  //clear contents, set the ready attribute for CSS purposes
  this.innerHTML = "";
  this.setAttribute("ready", "");

  //initialize Leaflet
  var map = this.map = _$leaflet_14.map(this, config.options);

  //set up the ID mapping object for factories to use if they want
  this.lookup = {};

  //initialize layers via factories
  _$factory_6.build(map, config, this);
};
proto.leaflet = _$leaflet_14;
proto.map = null;

document.registerElement("leaflet-map", { prototype: proto });

"use strict";

var $ = function $(s) {
  var d = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  return Array.prototype.slice.call(d.querySelectorAll(s));
};

$.one = function (s) {
  var d = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  return d.querySelector(s);
};

var _$$_15 = $;

var _$main_16 = {};
"use strict";

// require("./lib/ads");
// var track = require("./lib/tracking");

_$leafletMap_7;

/* removed: var _$$_15 = require("./lib/qsa"); */;

var mapElement = _$$_15.one("leaflet-map");
var map = mapElement.map;
var __L_16 = mapElement.leaflet;

var markerLayer = new __L_16.FeatureGroup();

window.cityData.forEach(function (row) {
  var marker = new __L_16.Marker([row.Lat, -row.Long], {
    title: row.City,
    riseOnHover: true,

    icon: __L_16.divIcon({
      className: "city-marker",
      html: "<div class=dot></div>"
    })
  });

  marker.data = row;
  row.marker = marker;

  marker.bindPopup("\n<h1 style=\"color:orange;\",style=\"font-size:200%;\"\">" + row.City + "</h1>\n<ul style=\"color:black;\">\n  <li> Overall job growth (last 10 years): <b>" + row.j_g_p + "</b>\n  <li> Job Growth in Tech Sector (last 5 years): <b>" + row.t_g_p + "</b>\n  <li> Offered tax incentives: <b>" + row.tax_in + "</b>\n  <li> Airport(s) that meet requirements: <b>" + row.Airport_Name + "</b>\n  <li> Traffic congestion: <b>" + row.traftext + "</b>\n  <li> Median rent: <b>" + row.rentdisp + "</b>\n  <li> Cultural diversity ranking (out of all cities in USA): <b>" + row.cds + "</b>\n  <li> State's Political Lean: <b>" + row.lean + "</b>\n</ul>\n  ");
  marker.addTo(markerLayer);
});

markerLayer.addTo(map);

var blocks = _$$_15(".map-item").reverse();
var filters = {
  j_growth: function j_growth(d) {
    return d.j_growth > .05;
  },
  t_growth: function t_growth(d) {
    return d.tech_growth > .06 && d.j_growth > .05;
  },
  rent: function rent(d) {
    return d.rent < 1150;
  },
  airports: function airports(d) {
    return d.Airport < 1;
  },
  traffic: function traffic(d) {
    return d.Traffic < 11;
  },
  incentives: function incentives(d) {
    return d.t_in_num > 0;
  },
  key: function key(d) {
    return d.Traffic > 20;
  },
  swing: function swing(d) {
    return d.swing > 0;
  },
  happy: function happy(d) {
    return d.happy > 0;
  },
  lib: function lib(d) {
    return d.lean2 > 0;
  },
  diverse: function diverse(d) {
    return d.diverse > 0;
  },
  all: function all(d) {
    return true;
  },
  none: function none(d) {
    return false;
  }

};

var cover = _$$_15.one(".cover");
var lockMap = function lockMap(lock) {
  var options = ["scrollWheelZoom", "touchZoom"];
  var method = lock ? "disable" : "enable";
  options.forEach(function (o) {
    return map[o][method]();
  });
  if (lock) {
    map.removeControl(map.zoomControl);
    cover.style.display = "block";
    //map.fitBounds(markerLayer.getBounds());
    map.fitBounds([[50.792, -129.7], [18.64, -62.66]]);
  } else {
    map.addControl(map.zoomControl);
    cover.style.display = "none";
  }
};
var currentFilter = null;
window.addEventListener("scroll", function (e) {

  for (var i = 0; i < blocks.length; i++) {
    var el = blocks[i];
    var bounds = el.getBoundingClientRect();
    if (bounds.top > 0 && bounds.top < window.innerHeight * .8) {
      //check for the unlock getAttribute
      //run the corresponding function

      var filtername = el.getAttribute("data-filter");
      if (!filtername) return;
      if (filtername == currentFilter) return;
      currentFilter = filtername;
      var filter = filters[filtername];
      var highlight = el.getAttribute("data-highlight") || "highlight";
      var matches = window.cityData.filter(filter);
      window.cityData.forEach(function (d) {
        return d.marker.getElement().classList.remove("highlight", "positive", "negative", "liberal");
      });
      matches.forEach(function (d) {
        return d.marker.getElement().classList.add(highlight);
      });
      if (!matches.length) return;
      var bounds = __L_16.latLngBounds();
      matches.forEach(function (m) {
        return bounds.extend(m.marker.getLatLng());
      });
      //console.log(bounds);
      //map.flyToBounds(bounds, { duration: 1.3 , easeLinearity: .1});
      //iconSize: [30,30];
    }
  }
});

window.map = map;
var unlockButton = _$$_15.one(".unlock");
unlockButton.addEventListener("click", function () {
  var unlocked = map.scrollWheelZoom.enabled();
  lockMap(unlocked);
});

lockMap(true);

// map.on("click", e => console.log(e.latlng));

}());
//# sourceMappingURL=app.js.map
