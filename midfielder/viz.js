/* Charts from verified numbers only (01-demand-strategy.md + 02-drills.md). */
(function () {
  function start() {

  const turf = "#1c6b38";
  const turfMid = "#24824a";
  const lime = "#c8e05a";
  const navy = "#08111c";
  const chalk = "#4d5a52";
  const warn = "#7a5210";

  function size(el, fallbackH) {
    const w = Math.max(280, el.clientWidth || 640);
    const h = fallbackH || 300;
    return { w, h, m: { t: 16, r: 16, b: 44, l: 48 } };
  }

  function svgOf(sel, w, h) {
    const el = document.querySelector(sel);
    if (!el) return null;
    el.innerHTML = "";
    return d3.select(el).append("svg").attr("viewBox", `0 0 ${w} ${h}`).attr("role", "img");
  }

  /* 1. HID share in vs out of possession */
  function hidShare() {
    const el = document.querySelector("#chart-hid-share");
    if (!el) return;
    const { w, h, m } = size(el, 320);
    const innerW = w - m.l - m.r;
    const innerH = h - m.t - m.b;
    const svg = svgOf("#chart-hid-share", w, h);
    if (!svg) return;
    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);

    /* Range midpoints for display; table carries the bands. */
    const rows = [
      { role: "DM/CM HID+sprint", oopLo: 71, oopHi: 83, ipLo: 17, ipHi: 29, note: "OOP 71–83%" },
      { role: "AM (w/ WF/CF band)", oopLo: 32, oopHi: 45, ipLo: 55, ipHi: 68, note: "IP 55–68%" }
    ];
    /* AM IP is 55–68 of HID/sprint; complement is 32–45 OOP. Not independently measured as a single AM-only row. */

    const y = d3.scaleBand().domain(rows.map(d => d.role)).range([0, innerH]).padding(0.28);
    const x = d3.scaleLinear().domain([0, 100]).range([0, innerW]);

    g.append("g").attr("class", "axis")
      .attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => d + "%"));
    g.append("g").attr("class", "axis").call(d3.axisLeft(y).tickSize(0)).select(".domain").remove();

    rows.forEach(d => {
      const yy = y(d.role);
      const bh = y.bandwidth();
      /* OOP range */
      g.append("rect")
        .attr("x", x(d.oopLo)).attr("y", yy)
        .attr("width", Math.max(1, x(d.oopHi) - x(d.oopLo)))
        .attr("height", bh * 0.42)
        .attr("fill", turf);
      g.append("rect")
        .attr("x", x(d.ipLo)).attr("y", yy + bh * 0.52)
        .attr("width", Math.max(1, x(d.ipHi) - x(d.ipLo)))
        .attr("height", bh * 0.42)
        .attr("fill", lime);
      g.append("text").attr("x", x(d.oopHi) + 6).attr("y", yy + bh * 0.32)
        .attr("fill", navy).attr("font-size", 11).attr("font-family", "Barlow, sans-serif")
        .text("OOP " + d.oopLo + "–" + d.oopHi + "%");
      g.append("text").attr("x", x(d.ipHi) + 6).attr("y", yy + bh * 0.84)
        .attr("fill", navy).attr("font-size", 11).attr("font-family", "Barlow, sans-serif")
        .text("IP " + d.ipLo + "–" + d.ipHi + "%");
    });

    const legend = svg.append("g").attr("transform", `translate(${m.l},${h - 14})`);
    legend.append("rect").attr("width", 10).attr("height", 10).attr("fill", turf);
    legend.append("text").attr("x", 14).attr("y", 10).attr("font-size", 11).attr("fill", chalk).text("Out of possession");
    legend.append("rect").attr("x", 150).attr("width", 10).attr("height", 10).attr("fill", lime);
    legend.append("text").attr("x", 164).attr("y", 10).attr("font-size", 11).attr("fill", chalk).text("In possession");
  }

  /* 2. Second-half drops (only verified %). */
  function halfDrop() {
    const el = document.querySelector("#chart-half-drop");
    if (!el) return;
    const { w, h, m } = size(el, 300);
    m.l = 170;
    const innerW = w - m.l - m.r;
    const innerH = h - m.t - m.b;
    const svg = svgOf("#chart-half-drop", w, h);
    if (!svg) return;
    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);

    const rows = [
      { label: "All roles, relative TD", lo: 7, hi: 7 },
      { label: "DM relative TD", lo: 9.8, hi: 9.8 },
      { label: "WD relative TD (least)", lo: 6.0, hi: 6.0 },
      { label: "All roles, HID+sprint", lo: 8, hi: 10 },
      { label: "AM HID+sprint (most)", lo: 17.5, hi: 20.0 }
    ];
    const y = d3.scaleBand().domain(rows.map(d => d.label)).range([0, innerH]).padding(0.28);
    const x = d3.scaleLinear().domain([0, 22]).range([0, innerW]);
    g.append("g").attr("class", "axis").attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d => d + "%"));
    g.append("g").attr("class", "axis").call(d3.axisLeft(y).tickSize(0)).select(".domain").remove();
    rows.forEach(d => {
      const yy = y(d.label) + y.bandwidth() * 0.22;
      const bh = y.bandwidth() * 0.56;
      g.append("rect")
        .attr("x", x(0)).attr("y", yy)
        .attr("width", x(d.lo))
        .attr("height", bh)
        .attr("fill", d.lo >= 15 ? warn : turf);
      if (d.hi !== d.lo) {
        g.append("rect")
          .attr("x", x(d.lo)).attr("y", yy)
          .attr("width", x(d.hi) - x(d.lo))
          .attr("height", bh)
          .attr("fill", lime)
          .attr("stroke", navy).attr("stroke-width", 0.6);
      }
      g.append("text")
        .attr("x", x(d.hi) + 6).attr("y", yy + bh * 0.78)
        .attr("font-size", 11).attr("fill", navy).attr("font-family", "IBM Plex Mono, monospace")
        .text(d.lo === d.hi ? d.lo + "%" : d.lo + "–" + d.hi + "%");
    });
  }

  /* 3. League HSR */
  function leagueHsr() {
    const el = document.querySelector("#chart-league-hsr");
    if (!el) return;
    const { w, h, m } = size(el, 300);
    m.b = 36;
    const innerW = w - m.l - m.r;
    const innerH = h - m.t - m.b;
    const svg = svgOf("#chart-league-hsr", w, h);
    if (!svg) return;
    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);
    const data = [
      { league: "Premier League", hsr: 681, sprint: 248 },
      { league: "Championship", hsr: 803, sprint: 308 },
      { league: "League 1", hsr: 881, sprint: 360 }
    ];
    const x = d3.scaleBand().domain(data.map(d => d.league)).range([0, innerW]).padding(0.28);
    const y = d3.scaleLinear().domain([0, 1000]).range([innerH, 0]);
    g.append("g").attr("class", "axis").attr("transform", `translate(0,${innerH})`).call(d3.axisBottom(x));
    g.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(5).tickFormat(d => d + " m"));
    const x1 = d3.scaleBand().domain(["hsr", "sprint"]).range([0, x.bandwidth()]).padding(0.12);
    data.forEach(d => {
      g.append("rect")
        .attr("x", x(d.league) + x1("hsr")).attr("y", y(d.hsr))
        .attr("width", x1.bandwidth()).attr("height", innerH - y(d.hsr))
        .attr("fill", turf);
      g.append("text").attr("x", x(d.league) + x1("hsr") + x1.bandwidth() / 2)
        .attr("y", y(d.hsr) - 6).attr("text-anchor", "middle")
        .attr("font-size", 11).attr("fill", navy).attr("font-family", "IBM Plex Mono, monospace")
        .text(d.hsr);
      g.append("rect")
        .attr("x", x(d.league) + x1("sprint")).attr("y", y(d.sprint))
        .attr("width", x1.bandwidth()).attr("height", innerH - y(d.sprint))
        .attr("fill", lime);
      g.append("text").attr("x", x(d.league) + x1("sprint") + x1.bandwidth() / 2)
        .attr("y", y(d.sprint) - 6).attr("text-anchor", "middle")
        .attr("font-size", 11).attr("fill", navy).attr("font-family", "IBM Plex Mono, monospace")
        .text(d.sprint);
    });
    const legend = svg.append("g").attr("transform", `translate(${m.l},${h - 12})`);
    legend.append("rect").attr("width", 10).attr("height", 10).attr("fill", turf);
    legend.append("text").attr("x", 14).attr("y", 10).attr("font-size", 11).attr("fill", chalk).text("HSR >19 km/h (m)");
    legend.append("rect").attr("x", 160).attr("width", 10).attr("height", 10).attr("fill", lime);
    legend.append("text").attr("x", 174).attr("y", 10).attr("font-size", 11).attr("fill", chalk).text("Sprint (m)");
  }

  /* 4. FIFA drill pitch sizes as proportional rectangles */
  function pitches() {
    const el = document.querySelector("#chart-pitches");
    if (!el) return;
    const { w } = size(el, 420);
    const h = 440;
    const svg = svgOf("#chart-pitches", w, h);
    if (!svg) return;
    const pitches = [
      { name: "10×10 m (A3 / A9)", L: 10, W: 10 },
      { name: "20×20 m (A10)", L: 20, W: 20 },
      { name: "25×15 m (A5)", L: 25, W: 15 },
      { name: "20×30 m (A4)", L: 20, W: 30 },
      { name: "40×22 m (A6)", L: 40, W: 22 },
      { name: "50×30 m (A7)", L: 50, W: 30 },
      { name: "50×40 m (A8)", L: 50, W: 40 }
    ];
    const maxL = 50, maxW = 40;
    const pad = 16;
    const cols = w > 700 ? 4 : 3;
    const cellW = (w - pad) / cols;
    const cellH = 200;
    pitches.forEach((p, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = pad / 2 + col * cellW;
      const cy = 8 + row * cellH;
      const scale = Math.min((cellW - 24) / maxL, 140 / maxW);
      const rw = p.L * scale;
      const rh = p.W * scale;
      const g = svg.append("g").attr("transform", `translate(${cx + 8},${cy + 28})`);
      g.append("rect")
        .attr("width", rw).attr("height", rh)
        .attr("fill", turfMid)
        .attr("stroke", "#eef3e6").attr("stroke-width", 2);
      /* center circle scaled only as decoration on larger pitches */
      if (p.L >= 20) {
        g.append("circle")
          .attr("cx", rw / 2).attr("cy", rh / 2)
          .attr("r", Math.min(rw, rh) * 0.12)
          .attr("fill", "none").attr("stroke", "#eef3e6").attr("stroke-width", 1.2);
        g.append("line")
          .attr("x1", 0).attr("x2", rw).attr("y1", rh / 2).attr("y2", rh / 2)
          .attr("stroke", "#eef3e6").attr("stroke-width", 1);
      }
      svg.append("text")
        .attr("x", cx + 8).attr("y", cy + 18)
        .attr("font-size", 12).attr("fill", navy)
        .attr("font-family", "Barlow Condensed, sans-serif")
        .attr("letter-spacing", "0.04em")
        .text(p.name);
    });
  }

  /* 5. Quadrant occupancy */
  function quadrants() {
    const el = document.querySelector("#chart-quadrants");
    if (!el) return;
    const { w, h, m } = size(el, 320);
    m.b = 48;
    const innerW = w - m.l - m.r;
    const innerH = h - m.t - m.b;
    const svg = svgOf("#chart-quadrants", w, h);
    if (!svg) return;
    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);
    const keys = ["LLQ", "LRQ", "ULQ", "URQ"];
    const colors = { LLQ: "#7a8a7c", LRQ: turf, ULQ: warn, URQ: lime };
    const data = [
      { role: "DM", LLQ: 9, LRQ: 60, ULQ: 0, URQ: 31 },
      { role: "CM", LLQ: 17, LRQ: 43, ULQ: 0, URQ: 40 },
      { role: "AM", LLQ: 19, LRQ: 24, ULQ: 24, URQ: 33 },
      { role: "WM", LLQ: 15, LRQ: 10, ULQ: 20, URQ: 55 }
    ];
    const stacked = d3.stack().keys(keys)(data);
    const x = d3.scaleBand().domain(data.map(d => d.role)).range([0, innerW]).padding(0.28);
    const y = d3.scaleLinear().domain([0, 100]).range([innerH, 0]);
    g.append("g").attr("class", "axis").attr("transform", `translate(0,${innerH})`).call(d3.axisBottom(x));
    g.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(5).tickFormat(d => d + "%"));
    g.selectAll("g.layer").data(stacked).join("g")
      .attr("fill", d => colors[d.key])
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", d => x(d.data.role))
      .attr("y", d => y(d[1]))
      .attr("height", d => Math.max(0, y(d[0]) - y(d[1])))
      .attr("width", x.bandwidth());
    let lx = m.l;
    keys.forEach(k => {
      const lg = svg.append("g").attr("transform", `translate(${lx},${h - 14})`);
      lg.append("rect").attr("width", 10).attr("height", 10).attr("fill", colors[k]);
      lg.append("text").attr("x", 14).attr("y", 10).attr("font-size", 11).attr("fill", chalk).text(k);
      lx += 70;
    });
  }

  /* 6. Lacome CM TD intercepts */
  function lacome() {
    const el = document.querySelector("#chart-lacome");
    if (!el) return;
    const { w, h, m } = size(el, 280);
    const innerW = w - m.l - m.r;
    const innerH = h - m.t - m.b;
    const svg = svgOf("#chart-lacome", w, h);
    if (!svg) return;
    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);
    const data = [
      { fmt: "4v4", td: 152.3 },
      { fmt: "6v6", td: 137.7 },
      { fmt: "8v8", td: 149.4 },
      { fmt: "10v10", td: 181.8 },
      { fmt: "Match", td: 176.0 }
    ];
    const x = d3.scaleBand().domain(data.map(d => d.fmt)).range([0, innerW]).padding(0.28);
    const y = d3.scaleLinear().domain([0, 200]).range([innerH, 0]);
    g.append("g").attr("class", "axis").attr("transform", `translate(0,${innerH})`).call(d3.axisBottom(x));
    g.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(5));
    data.forEach(d => {
      g.append("rect")
        .attr("x", x(d.fmt)).attr("y", y(d.td))
        .attr("width", x.bandwidth()).attr("height", innerH - y(d.td))
        .attr("fill", d.fmt === "Match" || d.fmt === "10v10" ? lime : turf);
      g.append("text").attr("x", x(d.fmt) + x.bandwidth() / 2).attr("y", y(d.td) - 6)
        .attr("text-anchor", "middle").attr("font-size", 11).attr("fill", navy)
        .attr("font-family", "IBM Plex Mono, monospace").text(d.td);
    });
  }

  /* 7. U10 tournament TD by position (paper sample) */
  function youthTd() {
    const el = document.querySelector("#chart-youth-td");
    if (!el) return;
    const { w, h, m } = size(el, 280);
    const innerW = w - m.l - m.r;
    const innerH = h - m.t - m.b;
    const svg = svgOf("#chart-youth-td", w, h);
    if (!svg) return;
    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);
    const data = [
      { pos: "Defenders", td: 1515.78 },
      { pos: "Midfielders", td: 2683.13 },
      { pos: "Forwards", td: 1294.94 }
    ];
    const x = d3.scaleBand().domain(data.map(d => d.pos)).range([0, innerW]).padding(0.28);
    const y = d3.scaleLinear().domain([0, 3200]).range([innerH, 0]);
    g.append("g").attr("class", "axis").attr("transform", `translate(0,${innerH})`).call(d3.axisBottom(x));
    g.append("g").attr("class", "axis").call(d3.axisLeft(y).ticks(5));
    data.forEach(d => {
      g.append("rect")
        .attr("x", x(d.pos)).attr("y", y(d.td))
        .attr("width", x.bandwidth()).attr("height", innerH - y(d.td))
        .attr("fill", d.pos === "Midfielders" ? lime : turf);
      g.append("text").attr("x", x(d.pos) + x.bandwidth() / 2).attr("y", y(d.td) - 6)
        .attr("text-anchor", "middle").attr("font-size", 11).attr("fill", navy)
        .attr("font-family", "IBM Plex Mono, monospace").text(d.td.toFixed(0));
    });
  }

  /* 8. Why teams run — r values */
  function corr() {
    const el = document.querySelector("#chart-corr");
    if (!el) return;
    const { w, h, m } = size(el, 320);
    m.l = 210;
    const innerW = w - m.l - m.r;
    const innerH = h - m.t - m.b;
    const svg = svgOf("#chart-corr", w, h);
    if (!svg) return;
    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);
    const data = [
      { k: "Recovery + def. transition vs OOP HID", r: 0.6 },
      { k: "Progression count vs IP HID", r: 0.7 },
      { k: "Final-third count vs IP HID", r: 0.8 },
      { k: "Low-block vs OOP Zone 3", r: 0.6 },
      { k: "Unopposed mid-third build-up vs IP Z3", r: 0.7 },
      { k: "Movements to receive vs IP Zone 3", r: 0.9 }
    ];
    const y = d3.scaleBand().domain(data.map(d => d.k)).range([0, innerH]).padding(0.22);
    const x = d3.scaleLinear().domain([0, 1]).range([0, innerW]);
    g.append("g").attr("class", "axis").attr("transform", `translate(0,${innerH})`)
      .call(d3.axisBottom(x).ticks(5));
    g.append("g").attr("class", "axis").call(d3.axisLeft(y).tickSize(0)).select(".domain").remove();
    data.forEach(d => {
      g.append("rect")
        .attr("x", 0).attr("y", y(d.k) + y.bandwidth() * 0.18)
        .attr("width", x(d.r)).attr("height", y.bandwidth() * 0.64)
        .attr("fill", turf);
      g.append("text").attr("x", x(d.r) + 6)
        .attr("y", y(d.k) + y.bandwidth() * 0.68)
        .attr("font-size", 11).attr("fill", navy)
        .attr("font-family", "IBM Plex Mono, monospace").text("r=" + d.r);
    });
  }

  function draw() {
    hidShare();
    halfDrop();
    leagueHsr();
    pitches();
    quadrants();
    lacome();
    youthTd();
    corr();
  }

  draw();
  window.addEventListener("resize", (() => {
    let t;
    return () => { clearTimeout(t); t = setTimeout(draw, 180); };
  })());

  /* sticky TOC active state */
  const links = Array.from(document.querySelectorAll("nav.toc a[href^='#']"));
  const ids = links.map(a => a.getAttribute("href").slice(1));
  const secs = ids.map(id => document.getElementById(id)).filter(Boolean);
  if (secs.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
    secs.forEach(s => io.observe(s));
  }

  }
  if (typeof d3 !== "undefined") {
    start();
  } else {
    var el = document.createElement("script");
    el.src = 'https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js';
    el.onload = start;
    document.head.appendChild(el);
  }
})();
