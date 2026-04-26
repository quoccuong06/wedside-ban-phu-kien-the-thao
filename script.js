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
