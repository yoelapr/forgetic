/* ============================================================
   FORGETIC — OVERVIEW SECTION
   overview.js — Market Summary, Opportunity Score, Stats, Trending
   ============================================================ */

'use strict';

window.ForgeticOverview = {

  render(data) {
    const el = document.getElementById('content-body');
    if (!el) return;

    el.innerHTML = `
      <div class="section-content">

        <!-- Row 1: Market Summary + Opportunity Score -->
        <div class="section-block">
          <div class="section-title">Market Intelligence</div>
          <div class="grid-2-1" style="gap:1rem;">
            <!-- Market Summary -->
            <div class="market-summary-card">
              <div class="market-summary-header">
                <div>
                  <div style="font-size:1rem; font-weight:700; color:var(--text-primary); margin-bottom:0.3rem;">
                    ${data.emoji} ${data.productName}
                    <span style="font-weight:400; color:var(--text-secondary); font-size:0.85rem;"> · ${data.category}</span>
                  </div>
                  <div style="font-size:0.72rem; color:var(--text-muted);">Item ID: ${data.itemId}</div>
                </div>
                <div class="market-summary-tag">AI Summary</div>
              </div>
              <p class="market-summary-text">${data.marketSummary}</p>
            </div>

            <!-- Opportunity Score -->
            <div class="card" style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:1.5rem;">
              <div style="font-size:0.7rem; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:0.75rem;">Opportunity Score</div>
              <div class="score-ring-wrapper">
                <svg viewBox="0 0 140 140">
                  <circle class="score-ring-bg" cx="70" cy="70" r="55" />
                  <circle class="score-ring-fill" id="score-ring" cx="70" cy="70" r="55"
                    stroke="${this._scoreColor(data.opportunityScore)}"
                  />
                </svg>
                <div class="score-center">
                  <div class="score-value" id="score-animated-value">0</div>
                  <div class="score-unit">/100</div>
                </div>
              </div>
              <div class="score-label" style="color:${this._scoreColor(data.opportunityScore)}">
                ${this._scoreLabel(data.opportunityScore)}
              </div>
              <div style="margin-top:0.75rem; display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center;">
                ${data.opportunityScore >= 70
                  ? '<span class="badge badge-success">High Potential</span>'
                  : data.opportunityScore >= 45
                  ? '<span class="badge badge-warning">Moderate</span>'
                  : '<span class="badge badge-danger">Competitive</span>'
                }
                <span class="badge badge-purple">Updated Now</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 2: Stat Cards -->
        <div class="section-block">
          <div class="section-title">Key Metrics</div>
          <div class="grid-3" style="gap:1rem;">
            <!-- Avg Sold Price -->
            <div class="stat-card">
              <div class="stat-card-label">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Avg Sold Price
              </div>
              <div class="stat-card-value">$${data.avgPrice.toFixed(2)}</div>
              <span class="stat-card-change up">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" width="10" height="10"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
                +${(Math.random()*8+1).toFixed(1)}% vs last month
              </span>
            </div>

            <!-- Total Sellers -->
            <div class="stat-card">
              <div class="stat-card-label">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Total Sellers
              </div>
              <div class="stat-card-value">${data.totalSellers}</div>
              <span class="stat-card-change ${data.totalSellers > 80 ? 'down' : 'up'}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" width="10" height="10">
                  ${data.totalSellers > 80
                    ? '<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>'
                    : '<path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/>'}
                </svg>
                ${data.totalSellers > 80 ? 'High' : 'Low'} competition
              </span>
            </div>

            <!-- Units Sold -->
            <div class="stat-card">
              <div class="stat-card-label">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                Units Sold (30d)
              </div>
              <div class="stat-card-value">${data.soldCount.toLocaleString()}</div>
              <span class="stat-card-change up">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3" width="10" height="10"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
                Sell-through: ${data.sellThroughRate}%
              </span>
            </div>
          </div>
        </div>

        <!-- Row 3: Trending Similar Products -->
        <div class="section-block">
          <div class="section-title">Similar Products Trending</div>
          <div class="trending-scroll" id="trending-scroll">
            ${data.trending.map(item => `
              <div class="trending-item">
                <div class="trending-item-img">${item.emoji}</div>
                <div class="trending-item-title">${item.title}</div>
                <div class="trending-item-price">$${item.price.toFixed(2)}</div>
                <div class="trending-item-badge">
                  <span class="badge ${this._trendBadge(item.trend)}">${this._trendIcon(item.trend)} ${item.trend}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    // Animate score ring
    this._animateScore(data.opportunityScore);
  },

  _scoreColor(score) {
    if (score >= 70) return 'var(--success)';
    if (score >= 45) return 'var(--warning)';
    return 'var(--danger)';
  },
  _scoreLabel(score) {
    if (score >= 80) return '🔥 Excellent Opportunity';
    if (score >= 65) return '✅ Good Opportunity';
    if (score >= 45) return '⚠️ Moderate Market';
    return '🔴 Saturated Market';
  },
  _trendBadge(trend) {
    const map = { hot:'badge-danger', rising:'badge-success', stable:'badge-info', declining:'badge-warning' };
    return map[trend] || 'badge-purple';
  },
  _trendIcon(trend) {
    const map = { hot:'🔥', rising:'📈', stable:'➡️', declining:'📉' };
    return map[trend] || '';
  },

  _animateScore(target) {
    const ring  = document.getElementById('score-ring');
    const value = document.getElementById('score-animated-value');
    if (!ring || !value) return;

    const circumference = 2 * Math.PI * 55; // r=55
    ring.style.strokeDasharray  = circumference;
    ring.style.strokeDashoffset = circumference;

    const duration = 1400;
    const start = performance.now();
    const animate = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(eased * target);

      value.textContent = current;
      ring.style.strokeDashoffset = circumference - (eased * (target / 100) * circumference);

      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
};
