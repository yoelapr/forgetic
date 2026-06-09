/* ============================================================
   FORGETIC — PRODUCT RESEARCH SECTION
   research.js — Performance, Comparison, Demand Volume, Market Share
   ============================================================ */

'use strict';

window.ForgeticResearch = {
  _charts: {},
  _compData: [],

  render(data) {
    this._compData = [...data.comparison];
    const el = document.getElementById('content-body');
    if (!el) return;

    el.innerHTML = `
      <div class="section-content">

        <!-- Row 1: Product Performance -->
        <div class="section-block">
          <div class="section-title">Product Performance</div>
          <div class="grid-4" style="gap:0.875rem;">

            <div class="stat-card">
              <div class="stat-card-label">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                Total Views
              </div>
              <div class="stat-card-value">${data.viewCount.toLocaleString()}</div>
              <span class="stat-card-change up">Active listing</span>
            </div>

            <div class="stat-card">
              <div class="stat-card-label">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                Units Sold
              </div>
              <div class="stat-card-value">${data.soldCount.toLocaleString()}</div>
              <span class="stat-card-change up">Past 30 days</span>
            </div>

            <div class="stat-card">
              <div class="stat-card-label">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                Watchlist Count
              </div>
              <div class="stat-card-value">${data.watchCount.toLocaleString()}</div>
              <span class="stat-card-change up">High demand signal</span>
            </div>

            <div class="stat-card">
              <div class="stat-card-label">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                Sell-Through Rate
              </div>
              <div class="stat-card-value">${data.sellThroughRate}%</div>
              <span class="stat-card-change ${data.sellThroughRate > 50 ? 'up' : 'down'}">
                ${data.sellThroughRate > 70 ? 'Excellent' : data.sellThroughRate > 40 ? 'Good' : 'Below average'}
              </span>
            </div>
          </div>
        </div>

        <!-- Row 2: Demand Volume + Market Share -->
        <div class="section-block">
          <div class="grid-2" style="gap:1rem;">
            <!-- Demand Volume Bar Chart -->
            <div class="card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <div>
                  <div style="font-weight:600; font-size:0.9rem; color:var(--text-primary);">Demand Volume</div>
                  <div style="font-size:0.75rem; color:var(--text-secondary);">Daily demand — last 30 days</div>
                </div>
                <span class="badge badge-purple">30D</span>
              </div>
              <div class="chart-wrapper">
                <canvas id="demand-chart"></canvas>
              </div>
            </div>

            <!-- Market Share Pie Chart -->
            <div class="card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <div>
                  <div style="font-weight:600; font-size:0.9rem; color:var(--text-primary);">Market Share</div>
                  <div style="font-size:0.75rem; color:var(--text-secondary);">Similar listings by seller</div>
                </div>
                <span class="badge badge-purple">${data.category}</span>
              </div>
              <div class="chart-wrapper" style="height:220px; display:flex; align-items:center; justify-content:center;">
                <canvas id="market-share-chart" style="max-width:220px; max-height:220px;"></canvas>
              </div>
              <div id="market-share-legend" style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-top:0.75rem; justify-content:center;"></div>
            </div>
          </div>
        </div>

        <!-- Row 3: Product Comparison -->
        <div class="section-block">
          <div class="section-title">Product Comparison <span style="font-weight:400; color:var(--text-muted); font-size:0.7rem; text-transform:none; margin-left:0.5rem;">Up to 3 products</span></div>
          <div class="comparison-grid" id="comparison-grid">
            ${this._renderComparisonItems(data)}
          </div>
        </div>

      </div>
    `;

    this._renderCharts(data);
    this._bindComparisonEvents(data);
  },

  _renderComparisonItems(data) {
    let html = '';
    for (let i = 0; i < 3; i++) {
      const item = this._compData[i];
      if (item) {
        html += `
          <div class="comparison-item filled">
            <div class="comp-item-label">Product ${String.fromCharCode(65 + i)}</div>
            <div class="comp-item-title">${item.title}</div>
            <div class="comp-metric"><span class="comp-metric-label">Avg Price</span><span class="comp-metric-value">$${item.price.toFixed(2)}</span></div>
            <div class="comp-metric"><span class="comp-metric-label">Units Sold</span><span class="comp-metric-value">${item.soldCount.toLocaleString()}</span></div>
            <div class="comp-metric"><span class="comp-metric-label">Views</span><span class="comp-metric-value">${item.views.toLocaleString()}</span></div>
            <div class="comp-metric"><span class="comp-metric-label">Sell-Through</span><span class="comp-metric-value">${item.sellThrough}%</span></div>
            <div class="comp-metric"><span class="comp-metric-label">Rating</span><span class="comp-metric-value">${'★'.repeat(Math.round(item.rating))} ${item.rating}</span></div>
            <div class="comp-metric"><span class="comp-metric-label">Top Seller</span><span class="comp-metric-value" style="font-size:0.72rem;">${item.seller}</span></div>
            ${i > 0 ? `<button class="btn btn-ghost btn-sm" style="width:100%; margin-top:0.5rem; color:var(--danger); font-size:0.75rem;" data-remove-comp="${i}">✕ Remove</button>` : ''}
          </div>
        `;
      } else if (i === this._compData.length) {
        html += `
          <div class="comparison-item empty" id="add-comp-${i}" data-slot="${i}" role="button" tabindex="0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
            <span>Add product URL</span>
            <span style="font-size:0.72rem; color:var(--text-disabled);">Paste eBay URL to compare</span>
          </div>
        `;
      } else {
        html += `<div class="comparison-item empty" style="opacity:0.3; pointer-events:none; border-style:dashed;"></div>`;
      }
    }
    return html;
  },

  _bindComparisonEvents(data) {
    // Remove buttons
    document.querySelectorAll('[data-remove-comp]').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.removeComp);
        this._compData.splice(idx, 1);
        document.getElementById('comparison-grid').innerHTML = this._renderComparisonItems(data);
        this._bindComparisonEvents(data);
      });
    });

    // Add slot
    for (let i = 0; i < 3; i++) {
      const slot = document.getElementById(`add-comp-${i}`);
      if (!slot) continue;
      slot.addEventListener('click', () => {
        const url = prompt('Enter eBay product URL to compare:');
        if (!url || !url.trim()) return;
        const cd = window.ForgeticScraper.analyze(url.trim());
        this._compData.push({
          label: `Product ${String.fromCharCode(65 + this._compData.length)}`,
          title: `${cd.productName} — ${cd.category}`,
          price: cd.avgPrice,
          soldCount: cd.soldCount,
          views: cd.viewCount,
          sellThrough: cd.sellThroughRate,
          rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
          seller: cd.marketShare[0]?.seller || '—',
        });
        document.getElementById('comparison-grid').innerHTML = this._renderComparisonItems(data);
        this._bindComparisonEvents(data);
      });
    }
  },

  _renderCharts(data) {
    const chartDefaults = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#16161F', borderColor: '#252535', borderWidth: 1, titleColor: '#F0EEFF', bodyColor: '#9B97B8', padding: 10 } },
    };

    // Demand Volume Bar Chart
    const dctx = document.getElementById('demand-chart');
    if (dctx) {
      if (this._charts.demand) this._charts.demand.destroy();
      this._charts.demand = new Chart(dctx, {
        type: 'bar',
        data: {
          labels: data.demandLabels.filter((_, i) => i % 5 === 0 || i === data.demandLabels.length - 1),
          datasets: [{
            label: 'Demand',
            data: data.demandSeries.filter((_, i) => i % 5 === 0 || i === data.demandSeries.length - 1),
            backgroundColor: (ctx) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 240);
              g.addColorStop(0, 'rgba(124,58,237,0.8)');
              g.addColorStop(1, 'rgba(124,58,237,0.15)');
              return g;
            },
            borderRadius: 6,
            borderSkipped: false,
          }],
        },
        options: {
          ...chartDefaults,
          scales: {
            x: { grid: { color: 'rgba(37,37,53,0.5)' }, ticks: { color: '#5C5880', font: { size: 10 } } },
            y: { grid: { color: 'rgba(37,37,53,0.5)' }, ticks: { color: '#5C5880', font: { size: 10 } } },
          },
        },
      });
    }

    // Market Share Doughnut
    const mctx = document.getElementById('market-share-chart');
    if (mctx) {
      if (this._charts.market) this._charts.market.destroy();
      const colors = ['#7C3AED','#8B5CF6','#A78BFA','#6B21A8','#5B21B6','#4C1D95'];
      const labels = data.marketShare.map(m => m.seller);
      const shares = data.marketShare.map(m => m.share);

      this._charts.market = new Chart(mctx, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{
            data: shares,
            backgroundColor: colors,
            borderColor: '#0A0A16',
            borderWidth: 3,
            hoverOffset: 8,
          }],
        },
        options: {
          ...chartDefaults,
          cutout: '60%',
          plugins: {
            legend: { display: false },
            tooltip: {
              ...chartDefaults.plugins.tooltip,
              callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` },
            },
          },
        },
      });

      // Legend
      const legend = document.getElementById('market-share-legend');
      if (legend) {
        legend.innerHTML = labels.map((l, i) => `
          <div style="display:flex; align-items:center; gap:0.3rem; font-size:0.72rem; color:var(--text-secondary);">
            <div style="width:8px; height:8px; border-radius:50%; background:${colors[i % colors.length]};"></div>
            ${l} <strong style="color:var(--text-primary);">${shares[i]}%</strong>
          </div>
        `).join('');
      }
    }
  }
};
