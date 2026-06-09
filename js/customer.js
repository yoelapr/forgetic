/* ============================================================
   FORGETIC — CUSTOMER INSIGHT SECTION
   customer.js — Sentiment, Feedback, Complaints, Praise
   ============================================================ */

'use strict';

window.ForgeticCustomer = {
  _charts: {},

  render(data) {
    const el = document.getElementById('content-body');
    if (!el) return;

    el.innerHTML = `
      <div class="section-content">

        <!-- Row 1: Sentiment Summary Cards -->
        <div class="section-block">
          <div class="section-title">Sentiment Analysis</div>
          <div class="sentiment-cards">
            <div class="sentiment-card positive">
              <div class="sentiment-icon pos">😊</div>
              <div>
                <div class="sentiment-pct pos">${data.avgPosSentiment}%</div>
                <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:0.2rem;">Positive Sentiment</div>
              </div>
              <div style="margin-left:auto; text-align:right;">
                <span class="badge badge-success">↑ Good</span>
              </div>
            </div>
            <div class="sentiment-card negative">
              <div class="sentiment-icon neg">😞</div>
              <div>
                <div class="sentiment-pct neg">${data.avgNegSentiment}%</div>
                <div style="font-size:0.78rem; color:var(--text-secondary); margin-top:0.2rem;">Negative Sentiment</div>
              </div>
              <div style="margin-left:auto; text-align:right;">
                <span class="badge badge-danger">${data.avgNegSentiment > 30 ? '↑ High' : '↓ Low'}</span>
              </div>
            </div>
          </div>

          <!-- Sentiment Line Chart -->
          <div class="card" style="margin-top:0;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; flex-wrap:wrap; gap:0.75rem;">
              <div>
                <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary);">Sentiment Over Time</div>
                <div style="font-size:0.78rem; color:var(--text-secondary);">30-day positive vs. negative trend for your store</div>
              </div>
              <div style="display:flex; gap:1rem;">
                <div style="display:flex; align-items:center; gap:0.4rem; font-size:0.75rem; color:var(--text-secondary);">
                  <div style="width:20px; height:2px; background:var(--success); border-radius:2px;"></div> Positive
                </div>
                <div style="display:flex; align-items:center; gap:0.4rem; font-size:0.75rem; color:var(--text-secondary);">
                  <div style="width:20px; height:2px; background:var(--danger); border-radius:2px;"></div> Negative
                </div>
              </div>
            </div>
            <div class="chart-wrapper chart-wrapper-lg">
              <canvas id="sentiment-chart"></canvas>
            </div>
          </div>
        </div>

        <!-- Row 2: Feedback Percentage -->
        <div class="section-block">
          <div class="section-title">Feedback Percentage</div>
          <div class="grid-2" style="gap:1rem; align-items:start;">

            <!-- Feedback Donut -->
            <div class="card" style="display:flex; flex-direction:column; align-items:center;">
              <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary); margin-bottom:0.25rem; align-self:flex-start;">Customer Feedback Breakdown</div>
              <div style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:1.25rem; align-self:flex-start;">Based on verified buyer reviews</div>
              <div style="position:relative; width:200px; height:200px; margin-bottom:1.25rem;">
                <canvas id="feedback-chart" style="width:200px; height:200px;"></canvas>
                <div style="position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                  <div style="font-size:1.75rem; font-weight:800; color:var(--text-primary);">${data.feedbackPositive}%</div>
                  <div style="font-size:0.72rem; color:var(--success); font-weight:600;">Positive</div>
                </div>
              </div>
              <div style="display:flex; gap:1.25rem; flex-wrap:wrap; justify-content:center;">
                <div style="display:flex; align-items:center; gap:0.4rem; font-size:0.82rem;">
                  <div style="width:10px; height:10px; border-radius:50%; background:var(--success);"></div>
                  <span style="color:var(--text-secondary);">Positive</span>
                  <strong style="color:var(--text-primary);">${data.feedbackPositive}%</strong>
                </div>
                <div style="display:flex; align-items:center; gap:0.4rem; font-size:0.82rem;">
                  <div style="width:10px; height:10px; border-radius:50%; background:var(--warning);"></div>
                  <span style="color:var(--text-secondary);">Neutral</span>
                  <strong style="color:var(--text-primary);">${data.feedbackNeutral}%</strong>
                </div>
                <div style="display:flex; align-items:center; gap:0.4rem; font-size:0.82rem;">
                  <div style="width:10px; height:10px; border-radius:50%; background:var(--danger);"></div>
                  <span style="color:var(--text-secondary);">Negative</span>
                  <strong style="color:var(--text-primary);">${data.feedbackNegative}%</strong>
                </div>
              </div>
            </div>

            <!-- Score Summary -->
            <div style="display:flex; flex-direction:column; gap:0.875rem;">
              <!-- Overall rating card -->
              <div class="card card-accent" style="text-align:center; padding:1.5rem;">
                <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:0.5rem;">eBay Feedback Score</div>
                <div style="font-size:3rem; font-weight:900; background:linear-gradient(135deg, var(--purple-300), var(--success)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; letter-spacing:-0.04em;">${data.feedbackPositive >= 98 ? 'Top Rated' : data.feedbackPositive >= 90 ? 'Excellent' : data.feedbackPositive >= 75 ? 'Good' : 'Needs Work'}</div>
                <div style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.3rem;">${data.feedbackPositive}% positive feedback</div>
              </div>

              <!-- Metric bars -->
              ${[
                { label: 'Item as Described', val: Math.min(data.feedbackPositive + 2, 100) },
                { label: 'Communication',     val: Math.min(data.feedbackPositive + 1, 100) },
                { label: 'Shipping Speed',    val: Math.max(data.feedbackPositive - 5, 60)  },
                { label: 'Shipping Cost',     val: Math.max(data.feedbackPositive - 8, 55)  },
              ].map(m => `
                <div style="display:flex; align-items:center; gap:0.75rem; font-size:0.8rem;">
                  <div style="width:130px; color:var(--text-secondary); flex-shrink:0;">${m.label}</div>
                  <div style="flex:1; height:6px; background:var(--bg-card-hover); border-radius:99px; overflow:hidden;">
                    <div style="width:${m.val}%; height:100%; background:linear-gradient(90deg, var(--purple-700), var(--success)); border-radius:99px;"></div>
                  </div>
                  <div style="font-size:0.78rem; font-weight:600; color:var(--text-primary); width:36px; text-align:right;">${m.val}%</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Row 3: Complaints + Positive Appreciation -->
        <div class="section-block">
          <div class="grid-2" style="gap:1rem;">

            <!-- Common Complaints -->
            <div class="card">
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.3rem;">
                <span style="font-size:1.2rem;">⚠️</span>
                <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary);">Common Complaints</div>
              </div>
              <p style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:1rem;">Issues reported most frequently by buyers</p>
              <div class="ranked-list">
                ${data.complaints.map((c, i) => `
                  <div class="ranked-item">
                    <div class="ranked-num ${['gold','silver','bronze','other','other'][i]}">${i+1}</div>
                    <span class="ranked-name">${c.text}</span>
                    <div class="ranked-count" style="background:var(--danger-soft); color:var(--danger);">${c.count}</div>
                  </div>
                `).join('')}
              </div>
              <div style="margin-top:1rem; padding:0.75rem; background:var(--danger-soft); border:1px solid rgba(239,68,68,0.25); border-radius:var(--radius-md); font-size:0.78rem; color:var(--danger);">
                💡 Address the top 2 complaints to significantly improve your feedback score.
              </div>
            </div>

            <!-- Positive Appreciation -->
            <div class="card">
              <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.3rem;">
                <span style="font-size:1.2rem;">🌟</span>
                <div style="font-weight:700; font-size:0.95rem; color:var(--text-primary);">Positive Appreciation</div>
              </div>
              <p style="font-size:0.75rem; color:var(--text-secondary); margin-bottom:1rem;">What buyers love about your store</p>
              <div class="ranked-list">
                ${data.praise.map((p, i) => `
                  <div class="ranked-item">
                    <div class="ranked-num ${['gold','silver','bronze','other','other'][i]}">${i+1}</div>
                    <span class="ranked-name">${p.text}</span>
                    <div class="ranked-count" style="background:var(--success-soft); color:var(--success);">${p.count}</div>
                  </div>
                `).join('')}
              </div>
              <div style="margin-top:1rem; padding:0.75rem; background:var(--success-soft); border:1px solid rgba(34,197,94,0.25); border-radius:var(--radius-md); font-size:0.78rem; color:var(--success);">
                ✅ Highlight your strengths in listing descriptions to attract more buyers.
              </div>
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

    // Sentiment dual line chart
    const sctx = document.getElementById('sentiment-chart');
    if (sctx) {
      if (this._charts.sentiment) this._charts.sentiment.destroy();
      const labels = data.sentimentLabels.filter((_, i) => i % 5 === 0 || i === data.sentimentLabels.length - 1);
      const pos    = data.sentimentPos.filter((_, i) => i % 5 === 0 || i === data.sentimentPos.length - 1);
      const neg    = data.sentimentNeg.filter((_, i) => i % 5 === 0 || i === data.sentimentNeg.length - 1);

      this._charts.sentiment = new Chart(sctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Positive',
              data: pos,
              borderColor: '#22C55E',
              backgroundColor: 'rgba(34,197,94,0.08)',
              fill: true,
              tension: 0.4,
              borderWidth: 2.5,
              pointBackgroundColor: '#22C55E',
              pointBorderColor: '#0A0A16',
              pointRadius: 4,
              pointHoverRadius: 7,
            },
            {
              label: 'Negative',
              data: neg,
              borderColor: '#EF4444',
              backgroundColor: 'rgba(239,68,68,0.06)',
              fill: true,
              tension: 0.4,
              borderWidth: 2,
              borderDash: [5, 3],
              pointBackgroundColor: '#EF4444',
              pointBorderColor: '#0A0A16',
              pointRadius: 3,
              pointHoverRadius: 6,
            }
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              ...tooltipDefaults,
              callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` }
            }
          },
          scales: {
            x: { grid: { color: 'rgba(37,37,53,0.5)' }, ticks: { color: '#5C5880', font: { size: 10 } } },
            y: {
              grid: { color: 'rgba(37,37,53,0.5)' },
              ticks: { color: '#5C5880', font: { size: 10 }, callback: v => `${v}%` },
              min: 0, max: 100,
            },
          },
        },
      });
    }

    // Feedback Donut
    const fctx = document.getElementById('feedback-chart');
    if (fctx) {
      if (this._charts.feedback) this._charts.feedback.destroy();
      this._charts.feedback = new Chart(fctx, {
        type: 'doughnut',
        data: {
          labels: ['Positive', 'Neutral', 'Negative'],
          datasets: [{
            data: [data.feedbackPositive, data.feedbackNeutral, data.feedbackNegative],
            backgroundColor: ['#22C55E', '#F59E0B', '#EF4444'],
            borderColor: '#0A0A16',
            borderWidth: 4,
            hoverOffset: 6,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: { display: false },
            tooltip: {
              ...tooltipDefaults,
              callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` },
            },
          },
        },
      });
    }
  }
};
