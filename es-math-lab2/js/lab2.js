// Lab2Ctrl — original controller from Wright State EGR 1010 virtual lab 2.
// Only local change: compass orientation in A() (see comment there).
// Requires: jQuery < 3 (for $ and element.selector), AngularJS 1.x, d3 v3, and $rootScope.$storage.
(function(k) {
    k.module("ngdistance.controllers.egr1010.lab2", []).controller("Lab2Ctrl", ["$scope", "$state", "$timeout", "$window", function(f, B, w, x) {
        f.$storage.lab2mode || (f.$storage.lab2mode = "one");
        var c = x.d3,
            p,
            q,
            d,
            m = !1,
            e = 0,
            g,
            l = !1,
            y = function() {
                d.append("circle").attr("class", "link point").attr("r", 2);
                d.append("circle").attr("class", "outer-circle").attr("r", 200);
                d.append("circle").attr("class", "outer-circle").attr("r", 400);
                var b = c.geo.projection(function(a, b) {
                        var h = Math.cos(a),
                            c = Math.cos(b),
                            h = 1 / (1 + h * c);
                        return [h * c * Math.sin(a), -h * Math.sin(b)]
                    }).scale(120).rotate([0, -90, 90]).translate([400.5, 400.5]).precision(.1),
                    a = c.geo.path().projection(b);
                d.append("path").datum(c.geo.circle().origin([0, 90])).attr("class", "inner-circle").attr("d", a).attr("transform", "translate(-400,-400)");
                a = d.append("g").attr("class", "circle-ticks").attr("transform", "translate(-400,-400)");
                a.selectAll("line").data(c.range(360)).enter().append("line").each(function(a) {
                    if (0 == a % 10) {
                        var d = b([a, 0]);
                        a = b([a, a % 30 ? 4 : 8]);
                        c.select(this).attr("x1",
                        d[0]).attr("y1", d[1]).attr("x2", a[0]).attr("y2", a[1])
                    } else
                        c.select(this).remove()
                });
                a.selectAll("text").data(c.range(-360, 0, 30)).enter().append("text").each(function(a) {
                    a = b.scale(80)([a, 0]);
                    c.select(this).attr("x", a[0]).attr("y", a[1]).attr("text-anchor", "middle")
                }).attr("dy", ".35em").text(function(a) {
                    a = Math.abs(a);
                    360 == a && (a = 0);
                    return a + "°"
                })
            },
            z = function() {
                var b = c.scale.linear().domain([-100, 100]).range([0, 800]),
                    a = c.scale.linear().domain([-100, 100]).range([800, 0]),
                    b = c.svg.axis().scale(b).ticks(Math.round(20.5)),
                    a = c.svg.axis().scale(a).ticks(Math.round(20.5));
                d.append("g").attr("class", "x grid-line").selectAll("line").data(c.range(-400, 410, 20)).enter().append("line").attr("x1", function(a) {
                    return a
                }).attr("y1", -400).attr("x2", function(a) {
                    return a
                }).attr("y2", 400);
                d.append("g").attr("class", "y grid-line").selectAll("line").data(c.range(-400, 410, 20)).enter().append("line").attr("x1", -400).attr("y1", function(a) {
                    return a
                }).attr("x2", 400).attr("y2", function(a) {
                    return a
                });
                d.append("g").attr("class", "x axis").attr("transform",
                "translate(-400,400)").call(b.orient("bottom"));
                d.append("g").attr("class", "x axis").attr("transform", "translate(-400,-400)").call(b.orient("top"));
                d.append("g").attr("class", "y axis").attr("transform", "translate(-400,-400)").call(a.orient("left"));
                d.append("g").attr("class", "y axis").attr("transform", "translate(400,-400)").call(a.orient("right"))
            },
            n = function(b, a, c) {
                k.isDefined(a) || (a = 0);
                k.isArray(b) || (b = [0, 0]);
                var e = Math.cos(a),
                    h = Math.sin(a);
                a = {};
                "one" == f.$storage.lab2mode ? (a.x = b[0], a.y = b[1], 400 <=
                a.x ? a.x = 400 : -400 >= a.x && (a.x = -400), 400 <= a.y ? a.y = 400 : -400 >= a.y && (a.y = -400)) : (a.x = 200 * e, a.y = 200 * h);
                c || (g = a);
                b = d.append("line").attr("class", "link " + (c ? "second" : "first")).attr("x1", 0).attr("y1", 0).attr("x2", a.x).attr("y2", a.y);
                e = d.append("circle").attr("class", "link point endPoint " + (c ? "second" : "first")).attr("cx", a.x).attr("cy", a.y).attr("r", 2);
                c && (b.attr("transform", "translate(" + g.x + "," + g.y + ")"), e.attr("transform", "translate(" + g.x + "," + g.y + ")"))
            },
            A = function(b, a) {
                // Local fix: orient the compass along link 1 (origin -> tip g). The original used the
                // angle from the tip to the mouse on the first mousemove after the click, plus 180 if the
                // mouse was inside r = 200, which is off whenever the mouse drifts off link 1's ray.
                var e = 180 / Math.PI * Math.atan2(g.y, g.x);
                var f = c.geo.projection(function(a, b) {
                    var c = Math.cos(a),
                        d = Math.cos(b),
                        c = 1 / (1 + c * d);
                    return [c * d * Math.sin(a), -c * Math.sin(b)]
                }).scale(30).rotate([e, -90, 90]).translate([400, 400]).precision(.1);
                c.geo.path().projection(f);
                d.append("circle").attr("class", "link-compass outer-circle").attr("r", 30).attr("transform", "translate(" + g.x + "," + g.y + ")");
                e = d.append("g").attr("class", "link-compass circle-ticks").attr("transform", "translate(" + (g.x - 400) + "," + (g.y -
                400) + ")");
                e.selectAll("line").data(c.range(360)).enter().append("line").each(function(a) {
                    if (0 == a % 30) {
                        var b = f([a, 0]);
                        a = f([a, 15]);
                        c.select(this).attr("x1", b[0]).attr("y1", b[1]).attr("x2", a[0]).attr("y2", a[1])
                    } else
                        c.select(this).remove()
                });
                e.selectAll("text").data(c.range(-360, 0, 30)).enter().append("text").each(function(a) {
                    a = f.scale(50)([a, 0]);
                    c.select(this).attr("x", a[0]).attr("y", a[1]).attr("text-anchor", "middle")
                }).attr("dy", ".35em").text(function(a) {
                    a = Math.abs(a);
                    360 == a && (a = 0);
                    return a + "°"
                })
            },
            r = function() {
                $(".link-compass").remove()
            },
            t = function() {
                $("line.link, .endPoint.link").remove()
            },
            u = function() {
                $("line.link.second, .endPoint.link.second").remove()
            },
            v = function(b) {
                if (!("one" == f.$storage.lab2mode && 0 != e || "two" == f.$storage.lab2mode && 2 <= e)) {
                    b = c.mouse(b);
                    var a,
                        d = !1;
                    if (0 !== b[0] && 0 !== b[1]) {
                        "two" == f.$storage.lab2mode && 1 == e && (d = !0, b[0] -= g.x, b[1] -= g.y);
                        "two" == f.$storage.lab2mode && 1 != e && l && (r(), l = !1);
                        a = Math.atan(b[1] / b[0]);
                        a += 0 > a ? Math.PI / 2 : 0;
                        if (!(0 <= b[0] && 0 <= b[1]))
                            if (0 >= b[0] && 0 <= b[1])
                                a += Math.PI /
                                2;
                            else if (0 >= b[0] && 0 >= b[1])
                                a += Math.PI;
                            else if (0 <= b[0] && 0 >= b[1])
                                a += Math.PI / 2 * 3;
                            else
                                return;
                        l || "two" != f.$storage.lab2mode || 1 != e || (A(a, b), l = !0);
                        d ? (u(), n(b, a, !0)) : (t(), n(b, a));
                        m = !0;
                        setTimeout(function() {
                            m = !1
                        }, 10)
                    }
                }
            };
        f.$watch("$storage.lab2mode", function(b, a) {
            b != a && (e = 0, r(), u(), t())
        });
        w(function() {
            p = k.element("div#svg-container");
            q = c.select(p.selector).append("svg");
            d = q.attr("width", 920).attr("height", 920).append("g").attr("transform", "translate(60,60)").append("g").attr("transform", "translate(400,400)");
            z();
            y();
            n(.5235);
            d.append("rect").attr("transform", "translate(-400,-400)").attr("fill-opacity", "0").attr("width", 800).attr("height", 800);
            d.on("mousemove", function() {
                m || v(this)
            });
            d.on("click", function() {
                "one" == f.$storage.lab2mode && (e = (e + 1) % 2);
                "two" == f.$storage.lab2mode && (e = (e + 1) % 3);
                0 == e && v(this)
            })
        })
    }])
})(angular);
