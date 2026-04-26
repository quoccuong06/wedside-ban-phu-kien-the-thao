const categories = {
    football: { name: "Trang Bóng đá", keywords: ["Bóng đá", "Găng tay thủ môn", "Áo đấu"], img: "soccer" },
    badminton: { name: "Trang Cầu lông", keywords: ["Vợt cầu lông", "Quả cầu lông"], img: "badminton" },
    gym: { name: "Trang Gym & Yoga", keywords: ["Găng tay tập Gym", "Thảm tập Yoga", "Tạ"], img: "gym" },
    running: { name: "Trang Chạy bộ", keywords: ["Giày chạy bộ", "Bình nước", "Balo"], img: "running" }
};

let allProducts = [];
let currentPage = 'all';

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

function pay() {
    let totalValue = document.getElementById('total').innerText; // Lấy tổng tiền hiện có
    if(totalValue === "0") {
        alert("Giỏ hàng của bạn đang trống!");
        return;
    }
    // Chuyển hướng sang trang checkout.html kèm theo tham số tổng tiền
    window.location.href = "checkout.html?total=" + totalValue;
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