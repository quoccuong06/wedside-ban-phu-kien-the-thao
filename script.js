const categories = {
    football: { name: "Trang Bóng đá", keywords: ["Bóng đá", "Găng tay thủ môn", "Áo đấu"], img: "soccer" },
    badminton: { name: "Trang Cầu lông", keywords: ["Vợt cầu lông", "Quả cầu lông"], img: "badminton" },
    gym: { name: "Trang Gym & Yoga", keywords: ["Găng tay tập Gym", "Thảm tập Yoga", "Tạ"], img: "gym" },
    running: { name: "Trang Chạy bộ", keywords: ["Giày chạy bộ", "Bình nước", "Balo"], img: "running" }
};

let allProducts = [];
let currentPage = 'all';
let isLoggedIn = false; // Biến kiểm tra trạng thái đăng nhập

// Tạo 70 sản phẩm
const typeKeys = Object.keys(categories);
for (let i = 1; i <= 70; i++) {
    let type = typeKeys[i % typeKeys.length];
    let productName = categories[type].keywords[i % categories[type].keywords.length];
    allProducts.push({
        id: i,
        category: type,
        name: `${productName} Cao Cấp mẫu ${i}`,
        price: 150000 + (i * 8000),
        img: `https://loremflickr.com/300/200/${categories[type].img}?lock=${i}`
    });
}

let cartCount = 0, cartTotal = 0;

function render(data) {
    let html = "";
    data.forEach(p => {
        html += `
        <div class="product">
            <img src="${p.img}" alt="${p.name}">
            <h4>${p.name}</h4>
            <div class="price">${p.price.toLocaleString()}đ</div>
            <button class="btn-buy" onclick="buy(${p.price})">MUA NGAY</button>
        </div>`;
    });
    document.getElementById("productList").innerHTML = html;
}

function changePage(cat, btn) {
    currentPage = cat;
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if(cat === 'all') { 
        render(allProducts); 
        document.getElementById("pageTitle").innerText = "Tất cả sản phẩm"; 
    }
    else { 
        render(allProducts.filter(p => p.category === cat)); 
        document.getElementById("pageTitle").innerText = categories[cat].name; 
    }
}

function buy(price) {
    cartCount++; cartTotal += price;
    document.getElementById("count").innerText = cartCount;
    document.getElementById("total").innerText = cartTotal.toLocaleString();
}

function search() {
    let kw = document.getElementById("searchInput").value.toLowerCase();
    let currentList = currentPage === 'all' ? allProducts : allProducts.filter(p => p.category === currentPage);
    render(currentList.filter(p => p.name.toLowerCase().includes(kw)));
}

// HÀM THANH TOÁN ĐÃ CẬP NHẬT LOGIC ĐĂNG NHẬP
function pay() {
    let totalValue = document.getElementById('total').innerText;
    
    if(totalValue === "0") {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }

    // Kiểm tra xem đã đăng nhập chưa
    if (!isLoggedIn) {
        alert("Bạn phải Đăng nhập / Đăng ký mới có thể thanh toán!");
        openAuth('login'); // Gọi hàm mở modal đăng nhập từ index.html
        return;
    }

    // Nếu đã đăng nhập thì mới cho đi tiếp
    window.location.href = "checkout.html?total=" + totalValue;
}

// HÀM XỬ LÝ ĐĂNG NHẬP THÀNH CÔNG (Dùng cho nút Xác nhận trong Modal)
function handleAuthAction() {
    const title = document.getElementById('authTitle').innerText;
    
    if (title === "Đăng nhập") {
        isLoggedIn = true;
        alert("Đăng nhập thành công! Bây giờ bạn đã có thể thanh toán.");
        closeAuth();
        
        // Cập nhật Top bar hiển thị tên (giả lập)
        document.querySelector('.top-bar-right').innerHTML = `
            <span style="color: #28a745">👤 Chào, Thành viên!</span>
            <span style="color: #666">|</span>
            <a href="#" onclick="location.reload()" style="color: white">Đăng xuất</a>
        `;
    } else {
        alert("Đăng ký thành công! Hãy đăng nhập để mua hàng.");
        openAuth('login');
    }
}

function closeModal() {
    document.getElementById("qrModal").style.display = "none";
}

function confirmPaid() {
    alert("Cảm ơn quý khách! Hệ thống đang kiểm tra tiền về tài khoản.\nCường & Thanh sẽ liên hệ ngay khi nhận được tiền.");
    closeModal();
    cartCount = 0; cartTotal = 0;
    document.getElementById("count").innerText = 0;
    document.getElementById("total").innerText = 0;
}

// Chạy lần đầu tiên
render(allProducts);
// 1. Đồng hồ đếm ngược (đếm ngược 2 giờ mỗi lần load)
function startCountdown() {
    let time = 7200; // 2 giờ tính bằng giây
    setInterval(() => {
        let hours = Math.floor(time / 3600);
        let mins = Math.floor((time % 3600) / 60);
        let secs = time % 60;
        document.getElementById("timer").innerText = 
            `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        if (time > 0) time--;
    }, 1000);
}

// 2. Hiển thị sản phẩm Flash Sale
function renderFlashSale() {
    let flashProducts = allProducts.slice(0, 5); // Lấy 5 sản phẩm đầu làm sale
    let html = "";
    flashProducts.forEach(p => {
        let salePrice = p.price * 0.5; // Giảm giá 50%
        html += `
        <div class="flash-product">
            <div class="sale-badge">-50%</div>
            <img src="${p.img}" width="100%">
            <p style="font-size:12px">${p.name}</p>
            <div style="color:#e44d26; font-weight:bold">${salePrice.toLocaleString()}đ</div>
            <del style="font-size:11px; color:#999">${p.price.toLocaleString()}đ</del>
        </div>`;
    });
    document.getElementById("flashSaleList").innerHTML = html;
}

// Gọi hàm khi trang web tải xong
startCountdown();
renderFlashSale();
function openAffiliateModal() {
    document.getElementById('partnerModal').style.display = 'flex';
}

function closePartnerModal() {
    document.getElementById('partnerModal').style.display = 'none';
}

// Bổ sung vào window.onclick hiện tại của bạn
window.onclick = function(event) {
    let authModal = document.getElementById('authModal');
    let partnerModal = document.getElementById('partnerModal');
    if (event.target == authModal) closeAuth();
    if (event.target == partnerModal) closePartnerModal();
}
