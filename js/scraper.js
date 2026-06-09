/* ============================================================
   FORGETIC — DATA ENGINE / SCRAPER SIMULATION
   scraper.js — Deterministic eBay data generator seeded by URL
   ============================================================ */

'use strict';

/**
 * Seeded pseudo-random number generator (Mulberry32).
 * Returns a function that produces [0, 1) values deterministically.
 */
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/** Convert a URL string into a numeric seed */
function urlToSeed(url) {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash) + url.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Generate an integer in [min, max] */
function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/** Pick a random item from an array */
function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

/** Generate a floating point with given decimal places */
function randFloat(rng, min, max, decimals = 2) {
  return parseFloat((rng() * (max - min) + min).toFixed(decimals));
}

/** Generate an array of daily data for N days */
function generateDailySeries(rng, days, baseMin, baseMax, volatility = 0.15) {
  const values = [];
  let val = randFloat(rng, baseMin, baseMax, 0);
  for (let i = 0; i < days; i++) {
    const change = (rng() - 0.48) * volatility * val;
    val = Math.max(baseMin * 0.4, val + change);
    values.push(Math.round(val));
  }
  return values;
}

/** Get last N day labels as "Mon DD" */
function getDayLabels(days) {
  const labels = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }
  return labels;
}

/** Get month labels for current year */
function getMonthLabels() {
  return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
}

/* ─── Product Categories ─────────────────────────────────── */
const CATEGORIES = [
  { name: 'Electronics', emoji: '💻', products: ['Laptop', 'Smartphone', 'Tablet', 'Smart Watch', 'Wireless Earbuds', 'Gaming Console', 'GPU', 'SSD', 'RAM', 'Monitor'] },
  { name: 'Fashion',     emoji: '👗', products: ['Sneakers', 'Denim Jacket', 'Leather Bag', 'Watch', 'Sunglasses', 'Running Shoes', 'Hoodie', 'Dress'] },
  { name: 'Home & Garden', emoji: '🏠', products: ['Coffee Maker', 'Air Purifier', 'Smart Bulb', 'Robot Vacuum', 'Blender', 'Pillow Set', 'Desk Lamp'] },
  { name: 'Sports',      emoji: '⚽', products: ['Yoga Mat', 'Resistance Bands', 'Dumbbells', 'Cycling Helmet', 'Protein Powder', 'Running Belt'] },
  { name: 'Collectibles', emoji: '🎮', products: ['Trading Card', 'Action Figure', 'Vintage Coin', 'Comic Book', 'Vintage Poster'] },
  { name: 'Automotive',  emoji: '🚗', products: ['Car Cover', 'Dash Cam', 'Car Charger', 'Floor Mats', 'LED Strip Lights'] },
];

const KEYWORDS_POOL = [
  'vintage', 'new', 'sealed', 'original', 'authentic', 'bundle', 'lot', 'rare', 'limited',
  'fast shipping', 'free shipping', 'wholesale', 'OEM', 'refurbished', 'mint condition',
  'collectors item', 'trending', 'bestseller', 'premium quality', 'handmade',
];

const COMPLAINTS_POOL = [
  'Slow shipping', 'Item not as described', 'Packaging damaged', 'Missing accessories',
  'Wrong color sent', 'Communication delay', 'Customs delay', 'Size runs small',
  'Battery drains fast', 'Scratches on item',
];

const PRAISE_POOL = [
  'Fast delivery', 'Exactly as described', 'Great packaging', 'Responsive seller',
  'Excellent quality', 'Well protected in box', 'Came early', 'Better than expected',
  'Authentic product', 'Great value for money',
];

const SELLERS = [
  'TechDeals_Pro', 'EliteGadgets', 'ValueShop99', 'PremiumFinds', 'QuickShip_US',
  'MegaSellers', 'DirectFactory', 'TopRatedGoods', 'ClearancePro', 'GlobalMart',
];

/* ─── Main Scraper Function ──────────────────────────────── */

/**
 * analyzeURL(url)
 * Given any eBay URL, returns a deterministic, realistic dataset.
 * Same URL always returns same data.
 */
window.ForgeticScraper = {
  analyze(url) {
    const seed = urlToSeed(url);
    const rng  = mulberry32(seed);

    // Determine category from URL or randomly
    const catIdx = randInt(rng, 0, CATEGORIES.length - 1);
    const cat    = CATEGORIES[catIdx];
    const rng2   = mulberry32(seed + 1);
    const rng3   = mulberry32(seed + 2);

    const productName = pick(rng, cat.products);
    const itemId      = `${randInt(rng, 100000000000, 999999999999)}`;
    const avgPrice    = randFloat(rng, 12, 480, 2);
    const totalSellers= randInt(rng, 8, 320);
    const oppScore    = randInt(rng, 22, 96);
    const soldCount   = randInt(rng, 15, 2400);
    const viewCount   = randInt(rng, soldCount * 3, soldCount * 18);
    const watchCount  = randInt(rng, soldCount, soldCount * 5);
    const sellThroughRate = randFloat(rng, 18, 95, 1);

    // MPN / UPC
    const mpn = `${pick(rng, ['MPN','SKU','REF'])}-${randInt(rng,1000,9999)}-${pick(rng,['A','B','C','X'])}`;
    const upc = `${randInt(rng, 100,999)}-${randInt(rng,100000,999999)}-${randInt(rng,100000,999999)}`;

    // Market share — top sellers
    const marketShare = [];
    let remaining = 100;
    const numSellers = Math.min(totalSellers, 6);
    for (let i = 0; i < numSellers; i++) {
      const share = i === numSellers - 1
        ? remaining
        : randInt(rng, Math.max(1, Math.floor(remaining / (numSellers - i + 1))), Math.floor(remaining * 0.45));
      remaining -= share;
      marketShare.push({ seller: SELLERS[i % SELLERS.length], share });
    }

    // Demand volume (30 days)
    const demandBase = randInt(rng2, 20, 280);
    const demandSeries = generateDailySeries(rng2, 30, demandBase * 0.3, demandBase * 1.8, 0.2);

    // Sales trend (90 days)
    const salesBase = randInt(rng2, 5, 80);
    const salesSeries = generateDailySeries(rng2, 90, salesBase * 0.2, salesBase * 2, 0.18);

    // Seasonality (monthly — simulated with Q4 spike)
    const seasonBase = randInt(rng3, 30, 200);
    const seasonality = getMonthLabels().map((_, i) => {
      const q4Boost = (i >= 9) ? randFloat(rng3, 1.4, 2.2, 2) : 1;
      return Math.round(randFloat(rng3, seasonBase * 0.5, seasonBase * 1.3, 0) * q4Boost);
    });

    // Sentiment (30 days positive / negative)
    const sentimentPos = generateDailySeries(rng3, 30, 50, 95, 0.12);
    const sentimentNeg = sentimentPos.map(v => Math.max(2, 100 - v - randInt(rng3, 0, 8)));
    const avgPosSentiment = Math.round(sentimentPos.reduce((a,b)=>a+b,0)/sentimentPos.length);
    const avgNegSentiment = Math.round(sentimentNeg.reduce((a,b)=>a+b,0)/sentimentNeg.length);

    // Feedback percentage
    const feedbackPositive = randInt(rng3, 68, 99);
    const feedbackNeutral  = randInt(rng3, 1, Math.min(15, 100 - feedbackPositive - 1));
    const feedbackNegative = 100 - feedbackPositive - feedbackNeutral;

    // Complaints & Praise
    const shuffledComplaints = [...COMPLAINTS_POOL].sort(() => rng3() - 0.5).slice(0, 5);
    const shuffledPraise     = [...PRAISE_POOL].sort(() => rng3() - 0.5).slice(0, 5);
    const complaints = shuffledComplaints.map(c => ({ text: c, count: randInt(rng3, 3, 58) })).sort((a,b) => b.count - a.count);
    const praise     = shuffledPraise.map(p => ({ text: p, count: randInt(rng3, 12, 120) })).sort((a,b) => b.count - a.count);

    // Best-selling products
    const bestSellers = Array.from({ length: 6 }, (_, i) => {
      const p = pick(rng3, cat.products);
      const unitsSold = randInt(rng3, 50, 2500);
      const price = randFloat(rng3, avgPrice * 0.6, avgPrice * 1.6, 2);
      return {
        rank: i + 1,
        title: `${pick(rng3, ['Premium','Genuine','New','Authentic','Original'])} ${p} ${pick(rng3, ['2024','2025','Pro','Plus','Max','Ultra'])}`,
        unitsSold,
        price,
        revenue: parseFloat((unitsSold * price).toFixed(2)),
        emoji: cat.emoji,
      };
    }).sort((a,b) => b.unitsSold - a.unitsSold).map((item,i) => ({...item, rank: i+1}));

    // Trending similar products
    const trending = Array.from({ length: 8 }, () => {
      const p = pick(rng3, cat.products);
      const price = randFloat(rng3, avgPrice * 0.5, avgPrice * 1.8, 2);
      const trend = pick(rng3, ['hot', 'rising', 'stable', 'declining']);
      return {
        title: `${pick(rng3, ['Premium','Genuine','New','Authentic'])} ${p}`,
        price,
        trend,
        emoji: cat.emoji,
      };
    });

    // Keywords
    const keywords = [...KEYWORDS_POOL]
      .sort(() => rng3() - 0.5)
      .slice(0, 10)
      .map(kw => ({ text: kw, score: randInt(rng3, 30, 99) }))
      .sort((a,b) => b.score - a.score);
    keywords.unshift({ text: productName.toLowerCase(), score: 99 });
    keywords.unshift({ text: cat.name.toLowerCase(), score: 95 });

    // Product comparison slots (initially only 1 filled)
    const comparison = [{
      label: 'Product A',
      title: `${pick(rng3, ['Original','Authentic'])} ${productName}`,
      price: avgPrice,
      soldCount,
      views: viewCount,
      sellThrough: sellThroughRate,
      rating: randFloat(rng3, 3.5, 5.0, 1),
      seller: SELLERS[0],
    }];

    // Market summary narrative
    const condition = oppScore > 70 ? 'strong market opportunity' : oppScore > 45 ? 'moderate competition' : 'saturated market';
    const priceDir  = rng() > 0.5 ? 'slightly above' : 'at par with';
    const narrative = `The ${productName} market in the <strong>${cat.name}</strong> category shows ${condition} with ${totalSellers} active sellers. Average sold price is <strong>$${avgPrice}</strong>, and sell-through rate sits at <strong>${sellThroughRate}%</strong>. Demand volume is ${demandBase > 150 ? 'high' : demandBase > 60 ? 'moderate' : 'low'}, and your listing price is ${priceDir} the market median. ${oppScore > 65 ? '🟢 This is a strong entry opportunity.' : oppScore > 40 ? '🟡 Proceed with a competitive pricing strategy.' : '🔴 Consider niche differentiation to stand out.'}`;

    return {
      url,
      itemId,
      productName,
      category: cat.name,
      emoji: cat.emoji,
      // Overview
      marketSummary: narrative,
      opportunityScore: oppScore,
      avgPrice,
      totalSellers,
      trending,
      // Research
      soldCount,
      viewCount,
      watchCount,
      sellThroughRate,
      marketShare,
      demandSeries,
      demandLabels: getDayLabels(30),
      comparison,
      // Details
      mpn,
      upc,
      keywords,
      // Demand
      salesSeries,
      salesLabels: getDayLabels(90),
      seasonality,
      seasonalityLabels: getMonthLabels(),
      bestSellers,
      // Customer
      sentimentPos,
      sentimentNeg,
      sentimentLabels: getDayLabels(30),
      avgPosSentiment,
      avgNegSentiment,
      feedbackPositive,
      feedbackNeutral,
      feedbackNegative,
      complaints,
      praise,
    };
  }
};
