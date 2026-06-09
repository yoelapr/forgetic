/* ============================================================
   FORGETIC — ESTIMATOR SECTION
   estimator.js — Profit calculator, Product Details, Keywords
   ============================================================ */

'use strict';

window.ForgeticEstimator = {

  render(data) {
    const el = document.getElementById('content-body');
    if (!el) return;

    el.innerHTML = `
      <div class="section-content">

        <!-- Row 1: Product Listing Simulation -->
        <div class="section-block">
          <div class="section-title">Product Listing Simulation</div>
          <div class="grid-2" style="gap:1rem; align-items:start;">

            <!-- Inputs -->
            <div class="card">
              <div style="font-weight:600; font-size:0.9rem; color:var(--text-primary); margin-bottom:1.25rem; display:flex; align-items:center; gap:0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                Listing Configuration
              </div>

              <div class="estimator-grid">
                <!-- Title -->
                <div class="form-group full-width">
                  <label class="form-label" for="est-title">Product Title Draft</label>
                  <input type="text" id="est-title" class="form-input" value="${data.productName} - Premium Quality | Fast Shipping" placeholder="Your listing title..." />
                </div>

                <!-- Description -->
                <div class="form-group full-width">
                  <label class="form-label" for="est-desc">Product Description</label>
                  <textarea id="est-desc" class="form-input" rows="3" placeholder="Describe your product...">${data.productName} in excellent condition. ${data.category} category. Ships fast from our warehouse. 100% authentic. Buyer protection included.</textarea>
                </div>

                <!-- Product Cost -->
                <div class="form-group">
                  <label class="form-label" for="est-cost">Product Cost (USD)</label>
                  <div class="input-wrapper">
                    <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <input type="number" id="est-cost" class="form-input" value="${(data.avgPrice * 0.55).toFixed(2)}" min="0" step="0.01" />
                  </div>
                </div>

                <!-- Selling Price -->
                <div class="form-group">
                  <label class="form-label" for="est-sell-price">Selling Price (USD)</label>
                  <div class="input-wrapper">
                    <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                    <input type="number" id="est-sell-price" class="form-input" value="${data.avgPrice.toFixed(2)}" min="0" step="0.01" />
                  </div>
                </div>

                <!-- Shipping Cost -->
                <div class="form-group">
                  <label class="form-label" for="est-shipping">Shipping Cost (USD)</label>
                  <div class="input-wrapper">
                    <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
                    <input type="number" id="est-shipping" class="form-input" value="8.99" min="0" step="0.01" />
                  </div>
                </div>

                <!-- eBay Fee % -->
                <div class="form-group">
                  <label class="form-label" for="est-ebay-fee">eBay Fee (%)</label>
                  <div class="input-wrapper">
                    <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                    <input type="number" id="est-ebay-fee" class="form-input" value="12.9" min="0" max="100" step="0.1" />
                  </div>
                </div>

                <!-- International Fee % -->
                <div class="form-group">
                  <label class="form-label" for="est-intl-fee">International Fee (%)</label>
                  <div class="input-wrapper">
                    <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path stroke-linecap="round" d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                    <input type="number" id="est-intl-fee" class="form-input" value="1.65" min="0" max="100" step="0.1" />
                  </div>
                </div>

                <!-- USD to IDR -->
                <div class="form-group">
                  <label class="form-label" for="est-rate">USD → IDR Rate</label>
                  <div class="input-wrapper">
                    <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="14" height="14"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
                    <input type="number" id="est-rate" class="form-input" value="16250" min="1" step="1" />
                  </div>
                </div>

                <!-- Calculate Button -->
                <div class="full-width" style="margin-top:0.25rem;">
                  <button class="btn btn-primary btn-full" id="est-calculate-btn" style="padding:0.75rem;">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="16" height="16"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                    Calculate Profit
                  </button>
                </div>
              </div>
            </div>

            <!-- Results -->
            <div style="display:flex; flex-direction:column; gap:1rem;">
              <!-- Fee Breakdown -->
              <div class="card">
                <div style="font-weight:600; font-size:0.9rem; color:var(--text-primary); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/></svg>
                  Fee Breakdown
                </div>
                <div class="estimator-result" id="fee-breakdown">
                  <div class="result-row">
                    <span class="result-label">eBay Fee</span>
                    <span class="result-value" id="res-ebay-fee-amt">—</span>
                  </div>
                  <div class="result-row">
                    <span class="result-label">International Fee</span>
                    <span class="result-value" id="res-intl-fee-amt">—</span>
                  </div>
                  <div class="result-row">
                    <span class="result-label">Total Marketplace Fee</span>
                    <span class="result-value" id="res-total-fee" style="color:var(--warning);">—</span>
                  </div>
                </div>
              </div>

              <!-- Profit Results -->
              <div class="card card-accent">
                <div style="font-weight:600; font-size:0.9rem; color:var(--text-primary); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>
                  Profit Analysis
                </div>
                <div class="estimator-result">
                  <div class="result-row">
                    <span class="result-label">Gross Profit</span>
                    <span class="result-value profit" id="res-gross-profit">—</span>
                  </div>
                  <div class="result-row">
                    <span class="result-label">Net Profit (USD)</span>
                    <span class="result-value profit" id="res-net-profit">—</span>
                  </div>
                  <div class="result-row">
                    <span class="result-label">Net Profit (IDR)</span>
                    <span class="result-value profit" id="res-net-idr">—</span>
                  </div>
                  <div class="result-row" style="background:rgba(124,58,237,0.08); border-radius:8px; padding:0.5rem 0.75rem; margin-top:0.5rem; border:none;">
                    <span class="result-label" style="font-weight:600;">Profit Margin</span>
                    <span class="result-value margin" id="res-margin" style="font-size:1.25rem;">—</span>
                  </div>
                </div>
                <div id="profit-advice" style="margin-top:0.875rem; font-size:0.8rem; color:var(--text-secondary); line-height:1.5;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Row 2: Product Details + Keyword Recommendations -->
        <div class="section-block">
          <div class="grid-2" style="gap:1rem;">

            <!-- Product Details -->
            <div class="card">
              <div style="font-weight:600; font-size:0.9rem; color:var(--text-primary); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                Product Details
              </div>
              <div class="estimator-grid">
                <div class="form-group">
                  <label class="form-label">MPN (Manufacturer Part No.)</label>
                  <input type="text" class="form-input" value="${data.mpn}" readonly style="cursor:default; color:var(--purple-300);" />
                </div>
                <div class="form-group">
                  <label class="form-label">UPC (Barcode)</label>
                  <input type="text" class="form-input" value="${data.upc}" readonly style="cursor:default; color:var(--purple-300);" />
                </div>
                <div class="form-group">
                  <label class="form-label">Category</label>
                  <input type="text" class="form-input" value="${data.category}" readonly style="cursor:default;" />
                </div>
                <div class="form-group">
                  <label class="form-label">Item ID</label>
                  <input type="text" class="form-input" value="${data.itemId}" readonly style="cursor:default;" />
                </div>
              </div>
            </div>

            <!-- Keyword Recommendations -->
            <div class="card">
              <div style="font-weight:600; font-size:0.9rem; color:var(--text-primary); margin-bottom:0.3rem; display:flex; align-items:center; gap:0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                Keyword Recommendations
              </div>
              <p style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:1rem;">Recommended search terms to optimize your eBay listing title and tags.</p>

              <!-- Ranked List -->
              <div class="ranked-list" style="margin-bottom:1rem;">
                ${data.keywords.slice(0, 5).map((kw, i) => `
                  <div class="ranked-item">
                    <div class="ranked-num ${['gold','silver','bronze','other','other'][i]}">${i+1}</div>
                    <span class="ranked-name">${kw.text}</span>
                    <div class="ranked-count" style="background:var(--accent-soft); color:var(--purple-300);">Score: ${kw.score}</div>
                  </div>
                `).join('')}
              </div>

              <!-- Tag Cloud -->
              <div class="keyword-cloud">
                ${data.keywords.map(kw => `
                  <div class="keyword-tag">
                    ${kw.text}<span class="score">${kw.score}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    // Bind calculate
    this._bindCalculator();
    // Run initial calculation
    document.getElementById('est-calculate-btn')?.click();
  },

  _bindCalculator() {
    const btn = document.getElementById('est-calculate-btn');
    if (!btn) return;

    // Also calculate on Enter key in inputs
    document.querySelectorAll('.estimator-grid input[type="number"]').forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this._calculate();
      });
      input.addEventListener('input', () => this._calculate());
    });

    btn.addEventListener('click', () => this._calculate());
  },

  _calculate() {
    const get = (id) => parseFloat(document.getElementById(id)?.value) || 0;

    const sellPrice  = get('est-sell-price');
    const cost       = get('est-cost');
    const shipping   = get('est-shipping');
    const ebayFee    = get('est-ebay-fee') / 100;
    const intlFee    = get('est-intl-fee') / 100;
    const rate       = get('est-rate');

    const ebayFeeAmt = sellPrice * ebayFee;
    const intlFeeAmt = sellPrice * intlFee;
    const totalFee   = ebayFeeAmt + intlFeeAmt;

    const grossProfit = sellPrice - cost;
    const netProfit   = grossProfit - totalFee - shipping;
    const netIdr      = netProfit * rate;
    const margin      = sellPrice > 0 ? (netProfit / sellPrice) * 100 : 0;

    const fmt = (n) => `$${n.toFixed(2)}`;
    const fmtIDR = (n) => `Rp ${n.toLocaleString('id-ID', { maximumFractionDigits: 0 })}`;

    const isProfit = netProfit >= 0;

    document.getElementById('res-ebay-fee-amt').textContent = fmt(ebayFeeAmt);
    document.getElementById('res-intl-fee-amt').textContent = fmt(intlFeeAmt);
    document.getElementById('res-total-fee').textContent   = fmt(totalFee);
    document.getElementById('res-gross-profit').textContent = fmt(grossProfit);

    const netEl   = document.getElementById('res-net-profit');
    const idrEl   = document.getElementById('res-net-idr');
    const margEl  = document.getElementById('res-margin');
    const advEl   = document.getElementById('profit-advice');

    netEl.textContent   = fmt(netProfit);
    netEl.className     = `result-value ${isProfit ? 'profit' : 'loss'}`;
    idrEl.textContent   = fmtIDR(netIdr);
    idrEl.className     = `result-value ${isProfit ? 'profit' : 'loss'}`;
    margEl.textContent  = `${margin.toFixed(1)}%`;
    margEl.className    = `result-value ${margin >= 20 ? 'margin' : margin >= 5 ? '' : 'loss'}`;

    if (advEl) {
      if (!isProfit) {
        advEl.innerHTML = '⚠️ <strong style="color:var(--danger);">This listing is at a loss.</strong> Consider raising your selling price or negotiating a lower product cost.';
      } else if (margin < 10) {
        advEl.innerHTML = '⚠️ Margin is thin. Aim for <strong>15–25%</strong> margin for a healthy eBay business.';
      } else if (margin >= 25) {
        advEl.innerHTML = '✅ <strong style="color:var(--success);">Excellent margin!</strong> This listing is highly profitable. Consider scaling volume.';
      } else {
        advEl.innerHTML = '✅ <strong style="color:var(--success);">Healthy margin.</strong> Monitor shipping costs and fees to protect profitability.';
      }
    }
  }
};
