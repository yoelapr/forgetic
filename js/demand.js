/* ============================================================
   FORGETIC — DEMAND SECTION
   demand.js — Sales Trend, Seasonality, Best-Selling Products
   ============================================================ */

'use strict';

window.ForgeticDemand = {
  _charts: {},

  render(data) {
    const el = document.getElementById('content-body');
    if (!el) return;

    el.innerHTML = `
      <div class="section-content">

        <!-- Sales Trend -->
        <div class="section-block">
          <div class="section-title">Sales Trend</div>
          <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.75rem;">
              <div>
                <div style="font-weight:700; font-size:1rem; color:var(--text-primary);">Daily Sales Volume</div>
                <div style="font-size:0.8rem; color:var(--text-secondary);">Last 90 days — ${data.productName}</div>
              </div>
              <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
                <div style="display:flex; align-items:center; gap:0.4rem; font-size:0.75rem; color:var(--text-secondary);">
                  <div style="width:24px; height:2px; background:var(--purple-500); border-radius:2px;"></div>
                  Units Sold
                </div>
                <span class="badge badge-success">Live Data</span>
              </div>
            </div>

            <!-- Summary stats row -->
            <div style="display:flex; gap:1.5rem; margin-bottom:1.25rem; flex-wrap:wrap;">
              <div>
                <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em;">Peak Day</div>
                <div style="font-size:1.1rem; font-weight:700; color:var(--text-primary);">${Math.max(...data.salesSeries)} units</div>
              </div>
              <div>
                <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em;">Avg Daily</div>
                <div style="font-size:1.1rem; font-weight:700; color:var(--text-primary);">${Math.round(data.salesSeries.reduce((a,b)=>a+b,0)/data.salesSeries.length)} units</div>
              </div>
              <div>
                <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em;">Total (90d)</div>
                <div style="font-size:1.1rem; font-weight:700; color:var(--purple-300);">${data.salesSeries.reduce((a,b)=>a+b,0).toLocaleString()} units</div>
              </div>
            </div>

            <div class="chart-wrapper chart-wrapper-lg">
              <canvas id="sales-trend-chart"></canvas>
            </div>
          </div>
        </div>

        <!-- Seasonality Analysis -->
        <div class="section-block">
          <div class="section-title">Seasonality Analysis</div>
          <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; flex-wrap:wrap; gap:0.75rem;">
              <div>
                <div style="font-weight:700; font-size:1rem; color:var(--text-primary);">Monthly Demand Forecast</div>
                <div style="font-size:0.8rem; color:var(--text-secondary);">Predicted seasonality with Q4 spike analysis</div>
              </div>
              <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                <span class="badge badge-warning">⚡ Q4 Spike Detected</span>
                <span class="badge badge-purple">Predictive Model</span>
              </div>
            </div>

            <!-- Q4 Alert -->
            <div style="background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.3); border-radius:10px; padding:0.875rem 1rem; margin-bottom:1.25rem; display:flex; align-items:center; gap:0.75rem;">
              <span style="font-size:1.5rem;">🎄</span>
              <div>
                <div style="font-size:0.85rem; font-weight:600; color:var(--warning);">Q4 Season (Oct–Dec) Peak Forecast</div>
                <div style="font-size:0.78rem; color:var(--text-secondary);">Historical data suggests demand increases <strong style="color:var(--warning);">${Math.round(data.seasonality.slice(9).reduce((a,b)=>a+b,0) / data.seasonality.slice(0,9).reduce((a,b)=>a+b,0) * 100 - 100)}%</strong> during the holiday season. Prepare inventory 4–6 weeks in advance.</div>
              </div>
            </div>

            <div class="chart-wrapper chart-wrapper-lg">
              <canvas id="seasonality-chart"></canvas>
            </div>
          </div>
        </div>

        <!-- Best Selling Products -->
        <div class="section-block">
          <div class="section-title">Best-Selling Products</div>
          <div class="card" style="padding:0; overflow:hidden;">
            <div style="padding:1.25rem 1.5rem; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary);">Top Performers</div>
                <div style="font-size:0.75rem; color:var(--text-secondary);">Similar products ranked by units sold</div>
              </div>
              <span class="badge badge-purple">${data.category}</span>
            </div>
            <div style="overflow-x:auto;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th style="padding-left:1.5rem;">Rank</th>
                    <th>Product</th>
                    <th>Units Sold</th>
                    <th>Avg Price</th>
                    <th>Est. Revenue</th>
                    <th>Performance</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.bestSellers.map(item => {
                    const maxSold = data.bestSellers[0].unitsSold;
                    const pct = Math.round((item.unitsSold / maxSold) * 100);
                    return `
                      <tr>
                        <td style="padding-left:1.5rem;">
                          <div class="ranked-num ${['gold','silver','bronze','other','other','other'][item.rank-1]}" style="margin:0;">${item.rank}</div>
                        </td>
                        <td>
                          <div style="display:flex; align-items:center; gap:0.5rem;">
                            <span style="font-size:1.3rem;">${item.emoji}</span>
                            <span style="font-size:0.83rem; font-weight:500; max-width:200px;" class="truncate">${item.title}</span>
                          </div>
                        </td>
                        <td><strong style="color:var(--text-primary);">${item.unitsSold.toLocaleString()}</strong></td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td style="color:var(--success); font-weight:600;">$${item.revenue.toLocaleString()}</td>
                        <td style="min-width:120px;">
                          <div style="display:flex; align-items:center; gap:0.5rem;">
                            <div style="flex:1; height:6px; background:var(--bg-card-hover); border-radius:99px; overflow:hidden;">
                              <div style="width:${pct}%; height:100%; background:linear-gradient(90deg, var(--purple-700), var(--purple-400)); border-radius:99px; transition:width 0.8s ease;"></div>
                            </div>
                            <span style="font-size:0.72rem; color:var(--text-muted); flex-shrink:0;">${pct}%</span>
                          </div>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    `;

    this._renderCharts(data);
  },

  _renderCharts(data) {
    const tooltipDefaults = {
      backgroundColor: '#16161F',
      borderColor: '#252535',
      borderWidth: 1,
      titleColor: '#F0EEFF',
      bodyColor: '#9B97B8',
      padding: 10,
    };

    // Sales Trend Line Chart
    const sctx = document.getElementById('sales-trend-chart');
    if (sctx) {
      if (this._charts.sales) this._charts.sales.destroy();
      this._charts.sales = new Chart(sctx, {
        type: 'line',
        data: {
          labels: data.salesLabels.filter((_,i) => i % 7 === 0 || i === data.salesLabels.length-1),
          datasets: [{
            label: 'Units Sold',
            data: data.salesSeries.filter((_,i) => i % 7 === 0 || i === data.salesSeries.length-1),
            borderColor: '#7C3AED',
            backgroundColor: (ctx) => {
              const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
              g.addColorStop(0, 'rgba(124,58,237,0.35)');
              g.addColorStop(1, 'rgba(124,58,237,0.01)');
              return g;
            },
            fill: true,
            tension: 0.45,
            borderWidth: 2.5,
            pointBackgroundColor: '#7C3AED',
            pointBorderColor: '#0A0A16',
            pointRadius: 4,
            pointHoverRadius: 7,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { ...tooltipDefaults } },
          scales: {
            x: { grid: { color: 'rgba(37,37,53,0.5)' }, ticks: { color: '#5C5880', font: { size: 10 } } },
            y: { grid: { color: 'rgba(37,37,53,0.5)' }, ticks: { color: '#5C5880', font: { size: 10 } }, beginAtZero: true },
          },
        },
      });
    }

    // Seasonality Bar Chart
    const seactx = document.getElementById('seasonality-chart');
    if (seactx) {
      if (this._charts.season) this._charts.season.destroy();
      const colors = data.seasonalityLabels.map((_, i) => {
        if (i >= 9) return 'rgba(245,158,11,0.85)'; // Q4 orange
        return 'rgba(124,58,237,0.7)';
      });
      this._charts.season = new Chart(seactx, {
        type: 'bar',
        data: {
          labels: data.seasonalityLabels,
          datasets: [{
            label: 'Predicted Demand',
            data: data.seasonality,
            backgroundColor: colors,
            borderColor: colors.map(c => c.replace('0.85','1').replace('0.7','1')),
            borderWidth: 0,
            borderRadius: 6,
            borderSkipped: false,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              ...tooltipDefaults,
              callbacks: {
                label: (ctx) => {
                  const isQ4 = ctx.dataIndex >= 9;
                  return ` Demand: ${ctx.parsed.y} units${isQ4 ? ' 🎄 Holiday Season' : ''}`;
                }
              }
            },
          },
          scales: {
            x: { grid: { color: 'rgba(37,37,53,0.5)' }, ticks: { color: '#5C5880', font: { size: 11 } } },
            y: { grid: { color: 'rgba(37,37,53,0.5)' }, ticks: { color: '#5C5880', font: { size: 10 } }, beginAtZero: true },
          },
        },
      });
    }
  }
};
