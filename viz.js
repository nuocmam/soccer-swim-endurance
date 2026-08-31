/* Sourced D3 charts — numbers copied from index.html only. */
(function () {
  "use strict";

  var AQUA = "#1fb8ae";
  var AQUA_BRIGHT = "#3ee0d4";
  var TURF = "#3a9a5c";
  var MUTED = "#8aa3b3";
  var INK = "#d7e8ef";
  var PAPER = "#f2ece0";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function mount(selector, draw) {
    var el = document.querySelector(selector);
    if (!el || typeof d3 === "undefined") return;

    function render() {
      var width = Math.max(el.clientWidth, 240);
      el.innerHTML = "";
      draw(el, width);
    }

    render();

    if (typeof ResizeObserver === "function") {
      var ro = new ResizeObserver(function () { render(); });
      ro.observe(el);
    } else {
      window.addEventListener("resize", render);
    }
  }

  function svgRoot(el, width, height) {
    return d3.select(el)
      .append("svg")
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("role", "img")
      .style("width", "100%")
      .style("height", "auto");
  }

  /* 1. Qatar 2022 team distances — three sourced km values */
  function qatarDistances(el, width) {
    var rows = [
      { name: "Team total", v: 108.1, fill: "#5d7e93", label: "108.1 km" },
      { name: "HID ≥20 km/h", v: 9.001, fill: AQUA, label: "9.001 km" },
      { name: "Sprint ≥25 km/h", v: 2.345, fill: TURF, label: "2.345 km" }
    ];
    var height = 210;
    var margin = { top: 8, right: 88, bottom: 28, left: 118 };
    var innerW = Math.max(width - margin.left - margin.right, 80);
    var innerH = height - margin.top - margin.bottom;
    var y = d3.scaleBand().domain(rows.map(function (d) { return d.name; })).range([0, innerH]).padding(0.28);
    var x = d3.scaleLinear().domain([0, 108.1]).range([0, innerW]);
    var svg = svgRoot(el, width, height);
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("title").text("Qatar 2022 team distances: 108.1 km total, 9.001 km high-intensity, 2.345 km sprint.");

    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + innerH + ")")
      .call(d3.axisBottom(x).ticks(5).tickFormat(function (d) { return d + " km"; }));
    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).tickSize(0))
      .select(".domain").remove();

    g.selectAll("rect.track")
      .data(rows)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", function (d) { return y(d.name); })
      .attr("width", innerW)
      .attr("height", y.bandwidth())
      .attr("fill", "#0a2438");

    g.selectAll("rect.bar")
      .data(rows)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", function (d) { return y(d.name); })
      .attr("width", function (d) { return x(d.v); })
      .attr("height", y.bandwidth())
      .attr("fill", function (d) { return d.fill; });

    g.selectAll("text.val")
      .data(rows)
      .enter()
      .append("text")
      .attr("x", function (d) { return Math.min(x(d.v) + 8, innerW + 8); })
      .attr("y", function (d) { return y(d.name) + y.bandwidth() / 2 + 4; })
      .attr("fill", INK)
      .attr("font-size", 12)
      .attr("font-weight", 600)
      .text(function (d) { return d.label; });
  }

  /* 2. Intensity grew faster than volume — grouped % change */
  function intensityVolume(el, width) {
    var height = 300;
    var margin = { top: 16, right: 16, bottom: 68, left: 44 };
    var innerW = width - margin.left - margin.right;
    var innerH = height - margin.top - margin.bottom;
    var groups = [
      {
        name: "Qatar 2022 vs 2018",
        bars: [
          { key: "TD", v: 3, lo: 3, hi: 3, label: "+3%" },
          { key: "HID", v: 17.5, lo: 16, hi: 19, label: "+16–19%" }
        ]
      },
      {
        name: "EPL 10 seasons",
        bars: [
          { key: "TD", v: 2, lo: 2, hi: 2, label: "+2%" },
          { key: "HID", v: 27, lo: 27, hi: 27, label: "+27%" },
          { key: "HSR", v: 23, lo: 23, hi: 23, label: "+23%" },
          { key: "Sprint", v: 40, lo: 40, hi: 40, label: "+40%" }
        ]
      }
    ];
    var colors = { TD: "#5d7e93", HID: AQUA, HSR: AQUA_BRIGHT, Sprint: TURF };
    var x0 = d3.scaleBand().domain(groups.map(function (d) { return d.name; })).range([0, innerW]).padding(0.18);
    var y = d3.scaleLinear().domain([0, 45]).range([innerH, 0]);
    var svg = svgRoot(el, width, height);
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("title").text("Percent change: Qatar 2022 versus 2018 total distance +3% and high-intensity +16 to 19%; Premier League ten seasons total +2%, HID +27%, high-speed +23%, sprint +40%.");

    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerW).tickFormat(""))
      .select(".domain").remove();

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(5).tickFormat(function (d) { return d + "%"; }));

    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + innerH + ")")
      .call(d3.axisBottom(x0).tickSize(0));

    groups.forEach(function (grp) {
      var x1 = d3.scaleBand().domain(grp.bars.map(function (b) { return b.key; })).range([0, x0.bandwidth()]).padding(0.22);
      var gg = g.append("g").attr("transform", "translate(" + x0(grp.name) + ",0)");
      gg.selectAll("rect")
        .data(grp.bars)
        .enter()
        .append("rect")
        .attr("x", function (d) { return x1(d.key); })
        .attr("y", function (d) { return y(d.v); })
        .attr("width", x1.bandwidth())
        .attr("height", function (d) { return innerH - y(d.v); })
        .attr("fill", function (d) { return colors[d.key]; });

      gg.selectAll("line.range")
        .data(grp.bars.filter(function (d) { return d.lo !== d.hi; }))
        .enter()
        .append("line")
        .attr("class", "range")
        .attr("x1", function (d) { return x1(d.key) + x1.bandwidth() / 2; })
        .attr("x2", function (d) { return x1(d.key) + x1.bandwidth() / 2; })
        .attr("y1", function (d) { return y(d.hi); })
        .attr("y2", function (d) { return y(d.lo); })
        .attr("stroke", PAPER)
        .attr("stroke-width", 2);

      gg.selectAll("text.lab")
        .data(grp.bars)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", function (d) { return x1(d.key) + x1.bandwidth() / 2; })
        .attr("y", function (d) { return y(d.hi) - 6; })
        .attr("text-anchor", "middle")
        .attr("font-size", 10)
        .attr("fill", INK)
        .text(function (d) { return d.label; });
    });

    var keys = [
      { key: "TD", fill: "#5d7e93" },
      { key: "HID", fill: AQUA },
      { key: "HSR", fill: AQUA_BRIGHT },
      { key: "Sprint", fill: TURF }
    ];
    keys.forEach(function (k, i) {
      var lx = i * 78;
      g.append("rect").attr("x", lx).attr("y", innerH + 34).attr("width", 9).attr("height", 9).attr("fill", k.fill);
      g.append("text").attr("x", lx + 13).attr("y", innerH + 43).attr("fill", MUTED).attr("font-size", 11).text(k.key);
    });
  }

  /* 3. Buoyancy offload — remaining dry-weight % */
  function buoyancy(el, width) {
    var rows = [
      { name: "Neck (midpoint of ~6–10%)", v: 8, note: "8%" },
      { name: "Xiphoid / nipple", v: 24, note: "~24%" },
      { name: "Navel", v: 51, note: "~51%" },
      { name: "DWR vertical GRF", v: 0, note: "0" }
    ];
    var height = 248;
    var margin = { top: 8, right: 72, bottom: 28, left: 168 };
    var innerW = Math.max(width - margin.left - margin.right, 80);
    var innerH = height - margin.top - margin.bottom;
    var y = d3.scaleBand().domain(rows.map(function (d) { return d.name; })).range([0, innerH]).padding(0.28);
    var x = d3.scaleLinear().domain([0, 100]).range([0, innerW]);
    var svg = svgRoot(el, width, height);
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("title").text("Percent of dry weight remaining: neck about 8%, xiphoid about 24%, navel about 51%, deep-water running vertical ground-reaction force 0.");

    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + innerH + ")")
      .call(d3.axisBottom(x).ticks(5).tickFormat(function (d) { return d + "%"; }));

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).tickSize(0))
      .select(".domain").remove();

    g.selectAll("rect.track")
      .data(rows)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", function (d) { return y(d.name); })
      .attr("width", innerW)
      .attr("height", y.bandwidth())
      .attr("fill", "#0a2438");

    g.selectAll("rect.bar")
      .data(rows)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", function (d) { return y(d.name); })
      .attr("width", function (d) { return x(d.v); })
      .attr("height", y.bandwidth())
      .attr("fill", function (d) { return d.v === 0 ? TURF : AQUA; });

    g.selectAll("text.val")
      .data(rows)
      .enter()
      .append("text")
      .attr("x", function (d) { return x(d.v) + 8; })
      .attr("y", function (d) { return y(d.name) + y.bandwidth() / 2 + 4; })
      .attr("fill", INK)
      .attr("font-size", 12)
      .attr("font-weight", 600)
      .text(function (d) { return d.note; });
  }

  /* 4. Town & Bradley DWR / SWR share of treadmill VO2max */
  function townBradley(el, width) {
    var rows = [
      { name: "DWR", v: 73.5 },
      { name: "SWR", v: 90.3 },
      { name: "Treadmill", v: 100 }
    ];
    var height = 200;
    var margin = { top: 12, right: 56, bottom: 28, left: 88 };
    var innerW = Math.max(width - margin.left - margin.right, 80);
    var innerH = height - margin.top - margin.bottom;
    var y = d3.scaleBand().domain(rows.map(function (d) { return d.name; })).range([0, innerH]).padding(0.3);
    var x = d3.scaleLinear().domain([0, 100]).range([0, innerW]);
    var svg = svgRoot(el, width, height);
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("title").text("Town and Bradley: deep-water running VO2max 73.5 percent of treadmill; shallow-water running 90.3 percent.");

    g.append("line")
      .attr("x1", x(100))
      .attr("x2", x(100))
      .attr("y1", 0)
      .attr("y2", innerH)
      .attr("stroke", "#2a4d66")
      .attr("stroke-dasharray", "3 4");

    g.selectAll("rect")
      .data(rows)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", function (d) { return y(d.name); })
      .attr("width", function (d) { return x(d.v); })
      .attr("height", y.bandwidth())
      .attr("fill", function (d) {
        if (d.name === "DWR") return AQUA;
        if (d.name === "SWR") return AQUA_BRIGHT;
        return "#5d7e93";
      });

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).tickSize(0))
      .select(".domain").remove();

    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + innerH + ")")
      .call(d3.axisBottom(x).ticks(5).tickFormat(function (d) { return d + "%"; }));

    g.selectAll("text.val")
      .data(rows)
      .enter()
      .append("text")
      .attr("x", function (d) { return x(d.v) - 8; })
      .attr("y", function (d) { return y(d.name) + y.bandwidth() / 2 + 4; })
      .attr("text-anchor", "end")
      .attr("fill", "#071422")
      .attr("font-size", 12)
      .attr("font-weight", 700)
      .text(function (d) { return d.v + "%"; });
  }

  /* 5. Transfer fork — Helgerud before/after + Magel callout */
  function transferFork(el, width) {
    var panels = [
      { title: "VO₂max (mL·kg⁻¹·min⁻¹)", pre: 58.1, post: 64.3, unit: "" },
      { title: "Match distance (m)", pre: 8619, post: 10335, unit: "" },
      { title: "Sprints ≥2 s", pre: 6.2, post: 12.4, unit: "" }
    ];
    var height = 320;
    var margin = { top: 28, right: 18, bottom: 88, left: 18 };
    var innerW = width - margin.left - margin.right;
    var colW = innerW / panels.length;
    var svg = svgRoot(el, width, height);
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("title").text("Helgerud 2001 training group: VO2max 58.1 to 64.3, match metres 8619 to 10335, sprints 6.2 to 12.4. Magel 1975: swim VO2max plus 380 millilitres per minute; treadmill VO2max did not move.");

    g.append("text")
      .attr("x", 0)
      .attr("y", -8)
      .attr("fill", TURF)
      .attr("font-size", 12)
      .attr("font-weight", 600)
      .text("Helgerud 2001 · training group (run 4×4)");

    panels.forEach(function (p, i) {
      var x = d3.scalePoint().domain(["Pre", "Post"]).range([24, colW - 24]);
      var y = d3.scaleLinear().domain([p.pre * 0.82, p.post * 1.08]).range([168, 18]);
      var gg = g.append("g").attr("transform", "translate(" + (i * colW) + ",8)");
      gg.append("text")
        .attr("x", colW / 2)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .attr("fill", MUTED)
        .attr("font-size", 11)
        .text(p.title);
      gg.append("line")
        .attr("x1", x("Pre"))
        .attr("x2", x("Post"))
        .attr("y1", y(p.pre))
        .attr("y2", y(p.post))
        .attr("stroke", AQUA)
        .attr("stroke-width", 2);
      [
        { k: "Pre", v: p.pre, c: "#5d7e93" },
        { k: "Post", v: p.post, c: TURF }
      ].forEach(function (pt) {
        gg.append("circle")
          .attr("cx", x(pt.k))
          .attr("cy", y(pt.v))
          .attr("r", 5.5)
          .attr("fill", pt.c);
        gg.append("text")
          .attr("x", x(pt.k))
          .attr("y", y(pt.v) - 10)
          .attr("text-anchor", "middle")
          .attr("fill", INK)
          .attr("font-size", 11)
          .attr("font-weight", 600)
          .text(pt.v);
        gg.append("text")
          .attr("x", x(pt.k))
          .attr("y", 188)
          .attr("text-anchor", "middle")
          .attr("fill", MUTED)
          .attr("font-size", 10)
          .text(pt.k);
      });
    });

    var box = g.append("g").attr("transform", "translate(0,236)");
    box.append("rect")
      .attr("width", innerW)
      .attr("height", 56)
      .attr("fill", "#0a2438")
      .attr("stroke", AQUA)
      .attr("stroke-width", 1);
    box.append("text")
      .attr("x", 14)
      .attr("y", 22)
      .attr("fill", AQUA_BRIGHT)
      .attr("font-size", 12)
      .attr("font-weight", 600)
      .text("Magel 1975 · swim VO₂max +380 mL/min");
    box.append("text")
      .attr("x", 14)
      .attr("y", 42)
      .attr("fill", INK)
      .attr("font-size", 12)
      .text("Treadmill VO₂max: no significant gain. No land before/after pair was reported — nothing is plotted.");
  }

  /* 6. Dose quality — Wilber held vs Eyestone drop */
  function doseQuality(el, width) {
    var series = [
      { name: "Wilber water-run", pre: 58.7, post: 59.6, color: AQUA, delta: "held" },
      { name: "Eyestone", pre: 56.29, post: 53.52, color: "#8aa3b3", delta: "−4.9%" }
    ];
    var height = 248;
    var margin = { top: 20, right: 20, bottom: 64, left: 48 };
    var innerW = width - margin.left - margin.right;
    var innerH = height - margin.top - margin.bottom;
    var x = d3.scalePoint().domain(["Pre", "Post"]).range([20, innerW - 20]);
    var y = d3.scaleLinear().domain([52, 61]).range([innerH, 0]);
    var svg = svgRoot(el, width, height);
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("title").text("Wilber water-run VO2max 58.7 to 59.6 held; Eyestone 56.29 to 53.52, a 4.9 percent drop.");

    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerW).tickFormat(""))
      .select(".domain").remove();
    g.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(5));
    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + innerH + ")")
      .call(d3.axisBottom(x).tickSize(0));

    series.forEach(function (s) {
      g.append("line")
        .attr("x1", x("Pre"))
        .attr("x2", x("Post"))
        .attr("y1", y(s.pre))
        .attr("y2", y(s.post))
        .attr("stroke", s.color)
        .attr("stroke-width", 2.4);
      ["pre", "post"].forEach(function (k) {
        g.append("circle")
          .attr("cx", x(k === "pre" ? "Pre" : "Post"))
          .attr("cy", y(s[k]))
          .attr("r", 5)
          .attr("fill", s.color);
      });
    });

    series.forEach(function (s, i) {
      var lx = i === 0 ? 8 : innerW / 2;
      g.append("rect").attr("x", lx).attr("y", innerH + 32).attr("width", 9).attr("height", 9).attr("fill", s.color);
      g.append("text")
        .attr("x", lx + 14)
        .attr("y", innerH + 41)
        .attr("fill", INK)
        .attr("font-size", 11)
        .text(s.name + "  " + s.pre + "→" + s.post + "  " + s.delta);
    });
  }

  /* 7. Youth academy sample vs elite band */
  function youthElite(el, width) {
    var bars = [
      { name: "U12 Soccer-7", v: 3.064 },
      { name: "U12 Soccer-8", v: 3.364 },
      { name: "U12 Soccer-11", v: 4.598 }
    ];
    var height = 260;
    var margin = { top: 16, right: 16, bottom: 56, left: 44 };
    var innerW = width - margin.left - margin.right;
    var innerH = height - margin.top - margin.bottom;
    var x = d3.scaleBand().domain(bars.map(function (d) { return d.name; }).concat(["Elite outfield"])).range([0, innerW]).padding(0.28);
    var y = d3.scaleLinear().domain([0, 14]).range([innerH, 0]);
    var svg = svgRoot(el, width, height);
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.append("title").text("Sanchez U12 academy sample: Soccer-7 3064 m, Soccer-8 3364 m, Soccer-11 4598 m. Elite player band 10 to 13 km.");

    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).ticks(7).tickSize(-innerW).tickFormat(""))
      .select(".domain").remove();
    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(7).tickFormat(function (d) { return d + " km"; }));
    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + innerH + ")")
      .call(d3.axisBottom(x).tickSize(0))
      .selectAll("text")
      .attr("dy", "1.15em");

    g.append("rect")
      .attr("x", x("Elite outfield"))
      .attr("y", y(13))
      .attr("width", x.bandwidth())
      .attr("height", y(10) - y(13))
      .attr("fill", TURF)
      .attr("opacity", 0.55);

    g.append("text")
      .attr("x", x("Elite outfield") + x.bandwidth() / 2)
      .attr("y", y(13) - 8)
      .attr("text-anchor", "middle")
      .attr("fill", TURF)
      .attr("font-size", 11)
      .attr("font-weight", 600)
      .text("10–13 km");

    g.selectAll("rect.bar")
      .data(bars)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) { return x(d.name); })
      .attr("y", function (d) { return y(d.v); })
      .attr("width", x.bandwidth())
      .attr("height", function (d) { return innerH - y(d.v); })
      .attr("fill", AQUA);

    g.selectAll("text.val")
      .data(bars)
      .enter()
      .append("text")
      .attr("x", function (d) { return x(d.name) + x.bandwidth() / 2; })
      .attr("y", function (d) { return y(d.v) - 6; })
      .attr("text-anchor", "middle")
      .attr("fill", INK)
      .attr("font-size", 11)
      .attr("font-weight", 600)
      .text(function (d) { return (d.v * 1000).toFixed(0) + " m"; });
  }

  ready(function () {
    mount("#chart-qatar", qatarDistances);
    mount("#chart-intensity", intensityVolume);
    mount("#chart-buoyancy", buoyancy);
    mount("#chart-town-bradley", townBradley);
    mount("#chart-transfer", transferFork);
    mount("#chart-dose", doseQuality);
    mount("#chart-youth", youthElite);
  });
})();
