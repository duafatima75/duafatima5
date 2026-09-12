import { fileURLToPath } from 'url';
import { cmd } from '../command.js';

const __filename = fileURLToPath(import.meta.url);

const htmlPayload = `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sania Khan Store - Exclusive Collection</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --bg-dark: #0b0f19;
            --card-dark: #131b2e;
            --accent: #f59e0b;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --danger: #ef4444;
            --success: #22c55e;
            --nav-bg: #0f172a;
            --border-clr: #1e293b;
        }

        body.light-theme {
            --bg-dark: #f1f5f9;
            --card-dark: #ffffff;
            --text-main: #0f172a;
            --text-muted: #64748b;
            --nav-bg: #ffffff;
            --border-clr: #cbd5e1;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', sans-serif; }
        
        #splashScreen {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: #070a12;
            display: flex; flex-direction: column; justify-content: center; align-items: center;
            gap: 20px; z-index: 9999; transition: opacity 0.5s ease;
        }

        .splash-logo { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: 1px; text-transform: uppercase; text-shadow: 0 0 10px rgba(245, 158, 11, 0.5); }
        .small-spinner { width: 35px; height: 35px; border: 3px solid rgba(245, 158, 11, 0.2); border-top: 3px solid var(--accent); border-radius: 50%; animation: spinCircle 0.8s linear infinite; }
        @keyframes spinCircle { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .splash-sub { color: var(--text-muted); font-size: 11px; letter-spacing: 1px; text-transform: uppercase; }

        body { 
            background: linear-gradient(135deg, #0b0f19, #1e1b4b, #111827, #31103a);
            background-size: 400% 400%;
            animation: moveBackground 12s ease infinite;
            color: var(--text-main); line-height: 1.6; padding-bottom: 75px; transition: color 0.3s; 
        }

        body.light-theme {
            background: linear-gradient(135deg, #f1f5f9, #e2e8f0, #cbd5e1, #f8fafc);
            background-size: 400% 400%;
            animation: moveBackground 12s ease infinite;
        }

        @keyframes moveBackground {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        header { background: rgba(7, 10, 18, 0.9); backdrop-filter: blur(10px); color: #fff; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; border-bottom: 1px solid var(--border-clr); }
        .store-name { font-size: 18px; font-weight: 800; color: #fff; letter-spacing: 0.5px; }
        
        .header-controls { display: flex; align-items: center; gap: 8px; }
        .theme-toggle { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; }

        .hero-banner { background: linear-gradient(135deg, #1e1b4b 0%, #31103a 100%); color: #fff; text-align: center; padding: 30px 20px; border-bottom: 1px solid var(--border-clr); }
        .hero-badge { background: rgba(245, 158, 11, 0.15); color: var(--accent); border: 1px solid rgba(245, 158, 11, 0.3); font-weight: 700; font-size: 11px; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; display: inline-block; margin-bottom: 8px; }
        .hero-banner h1 { font-size: 24px; font-weight: 800; margin-bottom: 4px; }
        .hero-banner p { color: var(--text-muted); font-size: 13px; max-width: 500px; margin: 0 auto; }

        .quick-nav { display: flex; gap: 15px; overflow-x: auto; padding: 15px 20px; scrollbar-width: none; }
        .quick-nav::-webkit-scrollbar { display: none; }
        .quick-item { display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: 70px; cursor: pointer; text-decoration: none; }
        .quick-circle { width: 45px; height: 45px; background: var(--card-dark); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--accent); border: 1px solid var(--border-clr); font-size: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .quick-text { font-size: 10px; color: var(--text-main); font-weight: 600; text-align: center; }

        .search-container { max-width: 600px; margin: 10px auto 20px auto; padding: 0 20px; }
        .search-box-wrapper { background: var(--card-dark); display: flex; align-items: center; padding: 10px 18px; border-radius: 50px; border: 1px solid var(--border-clr); }
        .search-box-wrapper i { color: var(--text-muted); font-size: 16px; margin-right: 12px; }
        .search-input { width: 100%; border: none; outline: none; font-size: 15px; color: var(--text-main); background: transparent; }

        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px 40px 20px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 6px; border-bottom: 1px solid var(--border-clr); }
        .section-title { font-size: 16px; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 8px; }
        .section-title i { color: var(--accent); }

        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
        .product-card { background: var(--card-dark); border-radius: 14px; overflow: hidden; border: 1px solid var(--border-clr); display: flex; flex-direction: column; position: relative; transition: transform 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .product-card:hover { transform: translateY(-4px); border-color: var(--accent); }
        
        .card-badge { position: absolute; top: 12px; left: 12px; background: var(--danger); color: #fff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; z-index: 10; }
        .card-rating { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); color: #fbbf24; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 6px; z-index: 10; display: flex; align-items: center; gap: 4px; }

        .img-container { width: 100%; height: 230px; background: rgba(0,0,0,0.2); position: relative; overflow: hidden; }
        .product-img { width: 100%; height: 100%; object-fit: cover; }
        
        .product-info { padding: 16px; display: flex; flex-direction: column; flex-grow: 1; }
        .product-tag { font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px; }
        .product-title { font-size: 15px; font-weight: 700; margin-bottom: 6px; color: var(--text-main); }
        
        .price-box { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .old-price { font-size: 13px; color: var(--text-muted); text-decoration: line-through; }
        .new-price { font-size: 17px; color: #38bdf8; font-weight: 800; }

        .qty-box { display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.2); border: 1px solid var(--border-clr); border-radius: 8px; padding: 6px 12px; margin-bottom: 12px; }
        .qty-label { font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; }
        .qty-controls { display: flex; align-items: center; gap: 10px; }
        .qty-btn { background: var(--card-dark); border: 1px solid var(--border-clr); width: 24px; height: 24px; border-radius: 6px; font-weight: bold; cursor: pointer; color: var(--text-main); display: flex; align-items: center; justify-content: center; }
        .qty-input { width: 30px; text-align: center; border: none; background: transparent; font-size: 14px; font-weight: 700; color: var(--text-main); outline: none; }
        
        .buy-btn { margin-top: auto; display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 11px; background: #25d366; border: none; color: #fff; font-weight: 700; font-size: 13px; text-align: center; border-radius: 8px; cursor: pointer; text-decoration: none; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2); }
        
        .bottom-nav { position: fixed; bottom: 0; left: 0; width: 100%; background: var(--nav-bg); border-top: 1px solid var(--border-clr); display: flex; justify-content: space-around; padding: 10px 0; z-index: 1000; }
        .nav-item { display: flex; flex-direction: column; align-items: center; text-decoration: none; color: var(--text-muted); font-size: 11px; font-weight: 600; gap: 4px; cursor: pointer; background: none; border: none; }
        .nav-item i { font-size: 18px; }
        .nav-item.active { color: var(--accent); }

        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: none; justify-content: center; align-items: center; z-index: 2000; backdrop-filter: blur(4px); }
        .modal-content { background: var(--card-dark); padding: 25px; border-radius: 16px; width: 90%; max-width: 400px; border: 1px solid var(--border-clr); position: relative; color: var(--text-main); }
        .modal-content h3 { margin-bottom: 15px; font-size: 18px; color: var(--accent); }
        .modal-close { position: absolute; top: 15px; right: 15px; background: none; border: none; color: var(--text-muted); font-size: 18px; cursor: pointer; }
        .modal-body { font-size: 14px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.6; }
        .auth-input { width: 100%; padding: 12px; background: rgba(0,0,0,0.2); border: 1px solid var(--border-clr); color: var(--text-main); border-radius: 8px; margin-bottom: 12px; outline: none; }
        .auth-submit { width: 100%; padding: 12px; background: var(--accent); color: #000; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
    </style>
</head>
<body>

    <div id="splashScreen">
        <div class="splash-logo">SANIA KHAN STORE</div>
        <div class="small-spinner"></div>
        <div class="splash-sub">Loading...</div>
    </div>

    <header>
        <div class="store-name">Sania Khan Store</div>
        <div class="header-controls">
            <button class="theme-toggle" onclick="toggleTheme()">
                <i class="fa-solid fa-moon" id="themeIcon"></i> <span id="themeText">Light</span>
            </button>
        </div>
    </header>

    <div class="hero-banner">
        <span class="hero-badge"><i class="fa-solid fa-star"></i> Verified Store</span>
        <h1>Exclusive Collection</h1>
        <p>Trending essentials & premium lifestyle products.</p>
    </div>

    <div class="quick-nav">
        <a href="https://wa.me/923475420029" target="_blank" class="quick-item">
            <div class="quick-circle" style="color: #25d366;"><i class="fa-brands fa-whatsapp"></i></div>
            <span class="quick-text">WhatsApp</span>
        </a>
        <div class="quick-item" onclick="openModal('trackModal')">
            <div class="quick-circle" style="color: #3b82f6;"><i class="fa-solid fa-truck-fast"></i></div>
            <span class="quick-text">Delivery</span>
        </div>
        <div class="quick-item" onclick="openModal('originalModal')">
            <div class="quick-circle" style="color: #10b981;"><i class="fa-solid fa-shield-check"></i></div>
            <span class="quick-text">Original</span>
        </div>
    </div>

    <div class="search-container">
        <div class="search-box-wrapper">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="searchInput" class="search-input" placeholder="Search products..." onkeyup="filterProducts()">
        </div>
    </div>

    <div class="container">
        <div class="section-header">
            <div class="section-title"><i class="fa-solid fa-fire"></i> Featured Collection</div>
        </div>
        <div class="product-grid" id="productGrid"></div>
    </div>

    <div class="bottom-nav">
        <button class="nav-item active" onclick="location.reload()">
            <i class="fa-solid fa-house"></i>
            <span>Home</span>
        </button>
        <button class="nav-item" onclick="openModal('trackModal')">
            <i class="fa-solid fa-location-crosshairs"></i>
            <span>Track</span>
        </button>
    </div>

    <div class="modal-overlay" id="trackModal">
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal('trackModal')">&times;</button>
            <h3><i class="fa-solid fa-truck-fast"></i> Order Tracking</h3>
            <div class="modal-body">Enter your Order ID or phone number:</div>
            <input type="text" class="auth-input" placeholder="Enter Order ID...">
            <button onclick="alert('Please contact on WhatsApp for instant support.')" class="auth-submit">Track Order</button>
        </div>
    </div>

    <div class="modal-overlay" id="originalModal">
        <div class="modal-content">
            <button class="modal-close" onclick="closeModal('originalModal')">&times;</button>
            <h3><i class="fa-solid fa-shield-check" style="color: #10b981;"></i> 100% Original</h3>
            <div class="modal-body">All items available on our platform are 100% genuine and authentic.</div>
            <button onclick="closeModal('originalModal')" class="auth-submit">Got It</button>
        </div>
    </div>

    <script>
        window.addEventListener('load', () => {
            setTimeout(() => {
                const splash = document.getElementById('splashScreen');
                splash.style.opacity = '0';
                setTimeout(() => splash.style.display = 'none', 500);
            }, 1500);
        });

        function toggleTheme() {
            const body = document.body;
            const icon = document.getElementById('themeIcon');
            const text = document.getElementById('themeText');
            body.classList.toggle('light-theme');
            if (body.classList.contains('light-theme')) {
                icon.className = "fa-solid fa-sun";
                text.innerText = "Dark";
            } else {
                icon.className = "fa-solid fa-moon";
                text.innerText = "Light";
            }
        }

        const products = [
            { id: 1, name: "Luxury Designer Handbag", price: 2499, oldPrice: 3800, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500" },
            { id: 2, name: "Gold Plated Elegant Watch", price: 1899, oldPrice: 2999, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
            { id: 3, name: "Classic Pearl Necklace", price: 1299, oldPrice: 1999, image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500" },
            { id: 4, name: "Premium Velvet Kurti", price: 2199, oldPrice: 3200, image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=500" }
        ];

        const productGrid = document.getElementById('productGrid');

        function renderProducts(list) {
            productGrid.innerHTML = '';
            if (list.length === 0) {
                productGrid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:30px; color:var(--text-muted);">No products found.</div>';
                return;
            }
            list.forEach(p => {
                let discount = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
                productGrid.innerHTML += `
                    <div class="product-card">
                        <div class="card-badge">-${discount}%</div>
                        <div class="card-rating"><i class="fa-solid fa-star"></i> 5 (1)</div>
                        <div class="img-container">
                            <img src="${p.image}" alt="${p.name}" class="product-img">
                        </div>
                        <div class="product-info">
                            <div class="product-tag">EXCLUSIVE COLLECTION</div>
                            <div class="product-title">${p.name}</div>
                            <div class="price-box">
                                <span class="old-price">Rs. ${p.oldPrice}</span>
                                <span class="new-price">Rs. ${p.price}</span>
                            </div>
                            <div class="qty-box">
                                <span class="qty-label">Qty:</span>
                                <div class="qty-controls">
                                    <button class="qty-btn" onclick="updateQty(${p.id}, -1)">-</button>
                                    <input type="text" id="qty_${p.id}" class="qty-input" value="1" readonly>
                                    <button class="qty-btn" onclick="updateQty(${p.id}, 1)">+</button>
                                </div>
                            </div>
                            <a href="javascript:void(0)" onclick="orderOnWhatsApp('${p.name}', ${p.price}, ${p.id})" class="buy-btn">
                                <i class="fa-brands fa-whatsapp fa-lg"></i> Order on WhatsApp
                            </a>
                        </div>
                    </div>
                `;
            });
        }

        function updateQty(id, change) {
            let input = document.getElementById(\`qty_\${id}\`);
            let val = parseInt(input.value) + change;
            if (val >= 1 && val <= 20) input.value = val;
        }

        function orderOnWhatsApp(name, price, id) {
            let qty = document.getElementById(\`qty_\${id}\`).value;
            let total = price * qty;
            let msg = \`Hello, I want to buy:\\n*Product:* \${name}\\n*Quantity:* \${qty}\\n*Total Price:* Rs. \${total}\`;
            window.open(\`https://wa.me/923475420029?text=\${encodeURIComponent(msg)}\`, '_blank');
        }

        function filterProducts() {
            let q = document.getElementById('searchInput').value.toLowerCase().trim();
            let filtered = products.filter(p => p.name.toLowerCase().includes(q));
            renderProducts(filtered);
        }

        function openModal(id) { document.getElementById(id).style.display = 'flex'; }
        function closeModal(id) { document.getElementById(id).style.display = 'none'; }

        renderProducts(products);
    </script>
</body>
</html>`;

const SIG = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LVZlcmlmaWNhdGlvblNpZ25hdHVyZS5NZXRhZGF0YeN55YRyad2+ZA==";
const CERT1 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGEOvtJr968bbpKdZreOTwkk9aPN++XPE60RfuzNLkXXc7LE8BOkJOWRpo2oNXaRJ3uCNJ43HY3A+oetnvHSfcxWqmvvTSrBOI5V1NOD6RMsZ/st1XVPUx83AGps1l5jYBOYzqMNy6un2tToJ2Bt9bXRo29tWLZTu8m7TNY/hISwVpVc5tjSet5U7btPN+dMIx2UvykB1jcbWGsdklheeuz8RXSStNXzeaGvsf1lpZ/ugLE4b2BdmlRNKrY6zLE4qFtRYQoS7axOyQX+4QUyN2m9bfm7urQmn+QRSXJwMO7X5kAJJLbkVGJFt9Pm9VXPwQVrK2aaqiXlpusj+7DfDw00OULmYMmZDTqXM0nUVLxj13z0LhMQoQhhNG8utdUn4uKOFceliTZ/xiP+A54GnX9620641bqw3ctfh9NNXPsTEK8hAUD7FDqUhVntHmoEYYEHq8X1tHHZYP49/f2iezTiE8AUaoZo42/jIWQIKohOGNUib2hEqMkW8NsR8vPihvNuqPc0zKZcl6359YFQdjiiW8kCRD/rsDOr9v1eYLFZKYloFyzFqEgj+jcG/V47elOjShJ5CCPwatXwP6HIloVwtgygFsnOFmCg6Ojoivfoz8Nw1qxFwg5OU2cq/1WbWNELKnaFg4eUWCAIJ/3ZIJsEPkgemZxGhE+hdiNn9dkQYBJs1kx2BxdIkJmQ9vJSKkrMz6lTxZM3IJ9mhmKS6zYdU1ppeAao0/ayte997DQParb/AHLN79g0iW1ad0z8ir5jAl0q3a+UZPTSa4YiSqC2PZ/gfxG5wvL2mKmeKowG0RXjmEp5iNxrni+T/HRLZOoH7y0DQ24nMCPg";
const CERT2 = "TklYRUwuTWVzc2FnZUJ1aWxkZXJWNC43LUNlcnRpZmljYXRlQ2hhaW4uTWV0YWRhdGHsL0Ccm0ELINFZ2IaBhKaeWnVuh0o6nZLCioCn9xpSADzwIS5VCWO+1eVXT2atJOyf7FYlpB0/JA3Us+aQtekuIkHu/zBXijORZ4ClF4+sF3cSTNg6gY/+6iwLK/zs3bMg+GeJrcI65vXfs95Shxlb2Rd5GRT2/2yBmR6Zkf5QwMJuptUHWtM26WY7/xlkEKGFZVqOSylusiOzSALa815zC6dCiHoJNLBEKMlaZZQOk57/+OYoU5zzTaEgLhyvNFHSyAlyLQ3SGFtVHAaJZHSmmSPyJowCOB+92Gkk6SWVMsk6FbU8QJWFtlhzV/W/gZ7WzUlS/AKgN0th9/cq20ToFkW7X9c+rtYavufmuieqFhXgaMD8AGsoN9QC/HzNC9D1nydPfFYEUr9BHVy2nF5gM58Y59r2rT8p5LPARIkUp8g+5DLhyW0tdZFZ1305o4AHCayZnp5rjcU2Xi/c1Qf/djBGakmijlMs4aMzKJYD0c4Q8jdI7sNyd876K2wRD+L6KeD2QB3PtCS4P7BWAl5gh5CJ6ZBrwcaKXZqcSjEwm52MqVCgYZdapAaNYUy/QndttjLOG0wxxwuX1hIhMjPnIKZR1kwnqD5EqlHpilrnojRZvjVGN4zEKmilS8rNstt4HHs/D849W+Q6LRVWiWMs0cT2IugrX+Skxd8En7Gq52UEmuVBrSTpN+UpIu20NsVb9lsvuYh3XO441606tOEY2eKcZJdTtqrOTNqbbTk0zVn1yhbOCvmfctBNDhTwaC5QMi0P9wjU5XI9SBtkdQLizc5oqpoiHeqgb8+aJHVLcbgIJ/KLZKtRWFDfzRNM02Csx4etUUapVd2NA/L0oMs/O5T9sVj9FBJ7q99GWr3PVmxJb36mHZLXC4k1gGN9swE0LtzYsUdT5tUo9ri/hS3W/SM+F1p4Kh4QIgRcG3ciIHGN44bnDh3HDCz0fDnzKYw0bclMxZPctEyJ5gEOPF6OAkjD9dEaRGq/tEPf1k9Aub+v2dEjnfrYWAm4E5Zfhs2Xh0CT0k+SzhgKd0K/46ChJ20G5+blwpIvahvTVS68+aVIX6CwXs4tcVx6FnmVsMOOkIasfaqQLZYbNBkuLoZnQAq4j8yRekrQ==";

cmd({
    pattern: "saniastore",
    alias: ["saniastorelive", "storelive"],
    desc: "Sania Khan Store Live via FATIMA-MD Rich Message",
    category: "game",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.relayMessage(
            from,
            {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2,
                    botMetadata: {
                        messageDisclaimerText: "",
                        botResponseId: "l2m45260-333m-05n7-h71j-270jjg558660",
                        verificationMetadata: {
                            proofs: [
                                {
                                    version: 1,
                                    useCase: 1,
                                    signature: SIG,
                                    certificateChain: [CERT1, CERT2]
                                }
                            ]
                        }
                    }
                },
                botForwardedMessage: {
                    message: {
                        richResponseMessage: {
                            messageType: 1,
                            submessages: [
                                {
                                    messageType: 2,
                                    messageText: "Sania Khan Store - Live Ready"
                                }
                            ],
                            unifiedResponse: {
                                data: Buffer.from(JSON.stringify({
                                    "response_id": "4nl57l2m-8393-184k-6k9j-8m6m1k14l249",
                                    "sections": [
                                        {
                                            "view_model": {
                                                "primitive": {
                                                    "__typename": "GenAIaeacdsnwHtmlPrimitive",
                                                    "payload": htmlPayload,
                                                    "trusted_sources": [
                                                        "fatimamv.dev"
                                                    ]
                                                },
                                                "__typename": "GenAISingleLayoutViewModel"
                                            }
                                        }
                                    ]
                                })).toString('base64')
                            },
                            contextInfo: {
                                forwardingScore: 1,
                                isForwarded: true,
                                forwardedAiBotMessageInfo: {
                                    botJid: "867051314767696@bot"
                                },
                                forwardOrigin: 4
                            }
                        }
                    }
                }
            },
            {}
        );
    } catch (e) {
        console.error('[SANIA STORE ERROR]', e?.message || e);
        return await reply('❌ Gagal mengirim store: ' + (e?.message || e));
    }
});
