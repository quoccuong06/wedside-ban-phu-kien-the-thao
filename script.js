const categories = {
    football: { name: "Trang Bóng đá", keywords: ["Bóng đá", "Găng tay thủ môn", "Áo đấu"], img: "soccer" },
    badminton: { name: "Trang Cầu lông", keywords: ["Vợt cầu lông", "Quả cầu lông"], img: "badminton" },
    gym: { name: "Trang Gym & Yoga", keywords: ["Găng tay tập Gym", "Thảm tập Yoga", "Tạ"], img: "gym" },
    running: { name: "Trang Chạy bộ", keywords: ["Giày chạy bộ", "Bình nước", "Balo"], img: "running" }
};

let allProducts = [];
let currentPage = 'all';
let isLoggedIn = false; 

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

// --- HÀM HIỂN THỊ SẢN PHẨM (ĐÃ BỔ SUNG +/-, SAO, BÌNH LUẬN) ---
function render(data) {
    let html = "";
    data.forEach(p => {
        html += `
        <div class="product">
            <img src="${p.img}" alt="${p.name}">
            <h4>${p.name}</h4>
            
            <!-- 1. Đánh giá sao -->
            <div class="stars" style="color: #ffc107; margin-bottom: 5px;">⭐⭐⭐⭐⭐</div>
            
            <div class="price">${p.price.toLocaleString()}đ</div>
            
            <!-- 2. Bộ tăng giảm số lượng -->
            <div class="quantity-control" style="display: flex; justify-content: center; align-items: center; gap: 10px; margin: 10px 0;">
                <button onclick="changeQty(${p.id}, -1)" style="width:25px; cursor:pointer">-</button>
                <input type="text" id="qty-${p.id}" value="1" readonly style="width:30px; text-align:center; border:1px solid #ddd">
                <button onclick="changeQty(${p.id}, 1)" style="width:25px; cursor:pointer">+</button>
            </div>

            <button class="btn-buy" onclick="buyWithQty(${p.id}, ${p.price})">MUA NGAY</button>
            
            <!-- 3. Ô bình luận -->
            <div class="comment-box" style="margin-top:10px; border-top: 1px solid #eee; padding-top:10px;">
                <input type="text" placeholder="Gửi bình luận..." onkeypress="addComment(event, this)" style="width:90%; padding:5px; font-size:12px; border:1px solid #ddd; border-radius:3px;">
            </div>
        </div>`;
    });
    document.getElementById("productList").innerHTML = html;
}

// --- CÁC HÀM LOGIC MỚI BỔ SUNG ---

// Hàm thay đổi số lượng trên ô input
function changeQty(id, delta) {
    let input = document.getElementById(`qty-${id}`);
    let currentQty = parseInt(input.value);
    if (currentQty + delta >= 1) {
        input.value = currentQty + delta;
    }
}

// Hàm mua hàng tính theo số lượng đã chọn
function buyWithQty(id, price) {
    let qty = parseInt(document.getElementById(`qty-${id}`).value);
    cartCount += qty;
    cartTotal += (price * qty);
    
    document.getElementById("count").innerText = cartCount;
    document.getElementById("total").innerText = cartTotal.toLocaleString();
    
    // Hiệu ứng thông báo nhỏ
    alert(`Đã thêm ${qty} sản phẩm vào giỏ hàng!`);
    // Reset lại số lượng về 1 sau khi mua
    document.getElementById(`qty-${id}`).value = 1;
}

// Hàm thêm bình luận (giả lập)
function addComment(e, input) {
    if (e.key === 'Enter' && input.value.trim() !== "") {
        alert("Cường & Thanh đã nhận được bình luận: " + input.value);
        input.value = ""; // Xóa nội dung sau khi gửi
    }
}

// --- CÁC HÀM CŨ GIỮ NGUYÊN VÀ TỐI ƯU ---

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

function search() {
    let kw = document.getElementById("searchInput").value.toLowerCase();
    let currentList = currentPage === 'all' ? allProducts : allProducts.filter(p => p.category === currentPage);
    render(currentList.filter(p => p.name.toLowerCase().includes(kw)));
}

function pay() {
    let totalValue = document.getElementById('total').innerText;
    if(totalValue === "0") {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }
    if (!isLoggedIn) {
        alert("Bạn phải Đăng nhập / Đăng ký mới có thể thanh toán!");
        openAuth('login');
        return;
    }
    window.location.href = "checkout.html?total=" + totalValue;
}

function handleAuthAction() {
    const title = document.getElementById('authTitle').innerText;
    if (title === "Đăng nhập") {
        isLoggedIn = true;
        alert("Đăng nhập thành công!");
        closeAuth();
        document.querySelector('.top-bar-right').innerHTML = `
            <span style="color: #28a745">👤 Chào, Thành viên!</span>
            <span style="color: #666">|</span>
            <a href="#" onclick="location.reload()" style="color: white">Đăng xuất</a>
        `;
    } else {
        alert("Đăng ký thành công! Hãy đăng nhập.");
        openAuth('login');
    }
}

function confirmPaid() {
    alert("Cảm ơn quý khách! Hệ thống đang kiểm tra tiền về tài khoản.");
    cartCount = 0; cartTotal = 0;
    document.getElementById("count").innerText = 0;
    document.getElementById("total").innerText = 0;
}

function startCountdown() {
    let time = 7200; 
    setInterval(() => {
        let hours = Math.floor(time / 3600);
        let mins = Math.floor((time % 3600) / 60);
        let secs = time % 60;
        document.getElementById("timer").innerText = 
            `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        if (time > 0) time--;
    }, 1000);
}

function renderFlashSale() {
    let flashProducts = allProducts.slice(0, 5); 
    let html = "";
    flashProducts.forEach(p => {
        let salePrice = p.price * 0.5;
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

function openAffiliateModal() {
    document.getElementById('partnerModal').style.display = 'flex';
}

function closePartnerModal() {
    document.getElementById('partnerModal').style.display = 'none';
}

window.onclick = function(event) {
    let authModal = document.getElementById('authModal');
    let partnerModal = document.getElementById('partnerModal');
    if (event.target == authModal) closeAuth();
    if (event.target == partnerModal) closePartnerModal();
}

// Khởi chạy các hàm cơ bản
render(allProducts);
startCountdown();
renderFlashSale();
