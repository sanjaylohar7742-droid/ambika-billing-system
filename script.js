// Data Storage
let appData = {
    company: {
        name: 'Ambika',
        gst: '',
        address: '',
        phone: '',
        email: ''
    },
    sales: [],
    purchases: [],
    bills: [],
    payments: [] // For tracking paid/received money
};

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
    setTodayDate();
    populateYearSelect();
    updateDashboard();
    loadSettings();
    
    // Form submissions
    document.getElementById('sellForm').addEventListener('submit', addSale);
    document.getElementById('buyForm').addEventListener('submit', addPurchase);
    document.getElementById('settingsForm').addEventListener('submit', saveSettings);
});

// ==================== NAVIGATION ====================
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
}

function showDashboard() {
    showSection('dashboard');
    updateDashboard();
}

function showSell() {
    showSection('sell');
    loadSellList();
}

function showBuy() {
    showSection('buy');
    loadBuyList();
}

function showBills() {
    showSection('bills');
    loadBillsList();
}

function showReports() {
    showSection('reports');
    generateReport();
}

function showSettings() {
    showSection('settings');
}

// ==================== DATE UTILS ====================
function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('sellDate').value = today;
    document.getElementById('buyDate').value = today;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
    });
}

function getMonthName(monthNum) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[parseInt(monthNum) - 1];
}

function populateYearSelect() {
    const yearSelect = document.getElementById('reportYear');
    const currentYear = new Date().getFullYear();
    
    for (let i = currentYear; i >= currentYear - 10; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }
}

// ==================== CALCULATIONS ====================
function calculateAmount(quantity, rate, gst) {
    const subtotal = quantity * rate;
    const gstAmount = (subtotal * gst) / 100;
    const total = subtotal + gstAmount;
    return {
        subtotal: subtotal,
        gst: gstAmount,
        total: total
    };
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
}

// ==================== SELL SECTION ====================
// Calculate total on input change
document.addEventListener('input', function(e) {
    if (e.target.id === 'sellQuantity' || e.target.id === 'sellRate' || e.target.id === 'sellGST') {
        const qty = parseFloat(document.getElementById('sellQuantity').value) || 0;
        const rate = parseFloat(document.getElementById('sellRate').value) || 0;
        const gst = parseFloat(document.getElementById('sellGST').value) || 0;
        
        const amounts = calculateAmount(qty, rate, gst);
        document.getElementById('sellTotalAmount').textContent = formatCurrency(amounts.total);
        document.getElementById('sellAmount').value = amounts.total;
    }
    
    if (e.target.id === 'buyQuantity' || e.target.id === 'buyRate' || e.target.id === 'buyGST') {
        const qty = parseFloat(document.getElementById('buyQuantity').value) || 0;
        const rate = parseFloat(document.getElementById('buyRate').value) || 0;
        const gst = parseFloat(document.getElementById('buyGST').value) || 0;
        
        const amounts = calculateAmount(qty, rate, gst);
        document.getElementById('buyTotalAmount').textContent = formatCurrency(amounts.total);
        document.getElementById('buyAmount').value = amounts.total;
    }
});

function addSale(e) {
    e.preventDefault();
    
    const sale = {
        id: Date.now(),
        date: document.getElementById('sellDate').value,
        customer: document.getElementById('sellCustomer').value,
        description: document.getElementById('sellDescription').value,
        quantity: parseFloat(document.getElementById('sellQuantity').value),
        rate: parseFloat(document.getElementById('sellRate').value),
        gst: parseFloat(document.getElementById('sellGST').value),
        amount: parseFloat(document.getElementById('sellAmount').value)
    };
    
    appData.sales.push(sale);
    saveDataToStorage();
    
    // Clear form
    document.getElementById('sellForm').reset();
    setTodayDate();
    
    // Reload list
    loadSellList();
    updateDashboard();
    
    alert('✅ Sale recorded successfully!');
}

function loadSellList() {
    const container = document.getElementById('sellList');
    
    if (appData.sales.length === 0) {
        container.innerHTML = '<p>No sales recorded yet</p>';
        return;
    }
    
    let html = '';
    appData.sales.slice().reverse().forEach(sale => {
        html += `
            <div class="transaction-item">
                <div class="item-details">
                    <div class="item-date">${formatDate(sale.date)}</div>
                    <div class="item-name">${sale.customer} - ${sale.description}</div>
                    <div>Qty: ${sale.quantity} × ₹${sale.rate.toFixed(2)} | GST: ${sale.gst}%</div>
                </div>
                <div class="item-amount">${formatCurrency(sale.amount)}</div>
                <div class="item-actions">
                    <button class="item-delete" onclick="deleteSale(${sale.id})">Delete</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function deleteSale(id) {
    if (confirm('Delete this sale record?')) {
        appData.sales = appData.sales.filter(s => s.id !== id);
        saveDataToStorage();
        loadSellList();
        updateDashboard();
    }
}

// ==================== BUY SECTION ====================
function addPurchase(e) {
    e.preventDefault();
    
    const purchase = {
        id: Date.now(),
        date: document.getElementById('buyDate').value,
        supplier: document.getElementById('buySupplier').value,
        description: document.getElementById('buyDescription').value,
        quantity: parseFloat(document.getElementById('buyQuantity').value),
        rate: parseFloat(document.getElementById('buyRate').value),
        gst: parseFloat(document.getElementById('buyGST').value),
        amount: parseFloat(document.getElementById('buyAmount').value)
    };
    
    appData.purchases.push(purchase);
    saveDataToStorage();
    
    // Clear form
    document.getElementById('buyForm').reset();
    setTodayDate();
    
    // Reload list
    loadBuyList();
    updateDashboard();
    
    alert('✅ Purchase recorded successfully!');
}

function loadBuyList() {
    const container = document.getElementById('buyList');
    
    if (appData.purchases.length === 0) {
        container.innerHTML = '<p>No purchases recorded yet</p>';
        return;
    }
    
    let html = '';
    appData.purchases.slice().reverse().forEach(purchase => {
        html += `
            <div class="transaction-item">
                <div class="item-details">
                    <div class="item-date">${formatDate(purchase.date)}</div>
                    <div class="item-name">${purchase.supplier} - ${purchase.description}</div>
                    <div>Qty: ${purchase.quantity} × ₹${purchase.rate.toFixed(2)} | GST: ${purchase.gst}%</div>
                </div>
                <div class="item-amount">${formatCurrency(purchase.amount)}</div>
                <div class="item-actions">
                    <button class="item-delete" onclick="deletePurchase(${purchase.id})">Delete</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function deletePurchase(id) {
    if (confirm('Delete this purchase record?')) {
        appData.purchases = appData.purchases.filter(p => p.id !== id);
        saveDataToStorage();
        loadBuyList();
        updateDashboard();
    }
}

// ==================== DASHBOARD ====================
function updateDashboard() {
    // Calculate totals
    const totalSales = appData.sales.reduce((sum, s) => sum + s.amount, 0);
    const totalPurchases = appData.purchases.reduce((sum, p) => sum + p.amount, 0);
    
    const gstCollected = appData.sales.reduce((sum, s) => {
        const subtotal = s.quantity * s.rate;
        const gst = (subtotal * s.gst) / 100;
        return sum + gst;
    }, 0);
    
    const netProfit = totalSales - totalPurchases;
    
    // Get paid/received amounts (from bills or separate tracking)
    const totalPaid = appData.purchases.reduce((sum, p) => sum + p.amount, 0);
    const totalReceived = appData.sales.reduce((sum, s) => sum + s.amount, 0);
    
    // Update display
    document.getElementById('totalSales').textContent = formatCurrency(totalSales);
    document.getElementById('totalPurchases').textContent = formatCurrency(totalPurchases);
    document.getElementById('totalPaid').textContent = formatCurrency(totalPaid);
    document.getElementById('totalReceived').textContent = formatCurrency(totalReceived);
    document.getElementById('gstCollected').textContent = formatCurrency(gstCollected);
    
    const profitElement = document.getElementById('netProfit');
    profitElement.textContent = formatCurrency(netProfit);
    profitElement.style.color = netProfit >= 0 ? '#2ecc71' : '#e74c3c';
    
    updateMonthlySummary();
}

function updateMonthlySummary() {
    const container = document.getElementById('monthlySummary');
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    let html = '<table style="width: 100%; border-collapse: collapse;">';
    html += '<thead><tr style="background-color: #2c3e50; color: white;"><th style="padding: 10px; border: 1px solid #bdc3c7;">Month</th><th style="padding: 10px; border: 1px solid #bdc3c7;">Sales</th><th style="padding: 10px; border: 1px solid #bdc3c7;">Purchases</th><th style="padding: 10px; border: 1px solid #bdc3c7;">Profit</th></tr></thead>';
    html += '<tbody>';
    
    // Show last 12 months
    for (let i = 0; i < 12; i++) {
        const date = new Date(currentYear, currentMonth - i, 1);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        
        const monthSales = appData.sales
            .filter(s => new Date(s.date).getMonth() + 1 === month && new Date(s.date).getFullYear() === year)
            .reduce((sum, s) => sum + s.amount, 0);
        
        const monthPurchases = appData.purchases
            .filter(p => new Date(p.date).getMonth() + 1 === month && new Date(p.date).getFullYear() === year)
            .reduce((sum, p) => sum + p.amount, 0);
        
        const profit = monthSales - monthPurchases;
        
        if (monthSales > 0 || monthPurchases > 0) {
            html += `<tr style="border: 1px solid #bdc3c7;">
                <td style="padding: 10px; border: 1px solid #bdc3c7;">${getMonthName(month)} ${year}</td>
                <td style="padding: 10px; border: 1px solid #bdc3c7; text-align: right;">${formatCurrency(monthSales)}</td>
                <td style="padding: 10px; border: 1px solid #bdc3c7; text-align: right;">${formatCurrency(monthPurchases)}</td>
                <td style="padding: 10px; border: 1px solid #bdc3c7; text-align: right; color: ${profit >= 0 ? '#2ecc71' : '#e74c3c'};">${formatCurrency(profit)}</td>
            </tr>`;
        }
    }
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

// ==================== BILLS ====================
function createNewBill() {
    if (appData.sales.length === 0) {
        alert('❌ No sales to create bill from. Add a sale first!');
        return;
    }
    
    // Create bill from latest sale
    const latestSale = appData.sales[appData.sales.length - 1];
    
    const bill = {
        id: Date.now(),
        billNo: 'BILL-' + String(appData.bills.length + 1).padStart(4, '0'),
        date: new Date().toISOString().split('T')[0],
        items: [{
            description: latestSale.description,
            quantity: latestSale.quantity,
            rate: latestSale.rate,
            gst: latestSale.gst,
            amount: latestSale.amount,
            customer: latestSale.customer
        }],
        notes: ''
    };
    
    appData.bills.push(bill);
    saveDataToStorage();
    
    showBillPreview(bill);
}

function showBillPreview(bill) {
    const modal = document.getElementById('billModal');
    const preview = document.getElementById('billPreview');
    
    let billHTML = generateBillHTML(bill);
    preview.innerHTML = billHTML;
    
    // Store current bill for download/print
    window.currentBill = bill;
    
    modal.classList.add('active');
}

function generateBillHTML(bill) {
    let itemsHTML = '';
    let totalAmount = 0;
    let totalGST = 0;
    
    bill.items.forEach(item => {
        const subtotal = item.quantity * item.rate;
        const gstAmount = (subtotal * item.gst) / 100;
        const total = subtotal + gstAmount;
        totalAmount += total;
        totalGST += gstAmount;
        
        itemsHTML += `
            <tr>
                <td>${item.description}</td>
                <td style="text-align: center;">${item.quantity}</td>
                <td style="text-align: right;">₹${item.rate.toFixed(2)}</td>
                <td style="text-align: right;">₹${subtotal.toFixed(2)}</td>
                <td style="text-align: center;">${item.gst}%</td>
                <td style="text-align: right;">₹${gstAmount.toFixed(2)}</td>
                <td style="text-align: right;">₹${total.toFixed(2)}</td>
            </tr>
        `;
    });
    
    return `
        <div class="bill-header">
            <h1>${appData.company.name}</h1>
            <p style="margin: 5px 0; font-size: 12px;">TAX INVOICE</p>
        </div>
        
        <div class="bill-no">Bill #: ${bill.billNo} | Date: ${formatDate(bill.date)}</div>
        
        <div class="bill-info">
            <div class="bill-section">
                <h3>Bill From</h3>
                <p><strong>${appData.company.name}</strong></p>
                <p>${appData.company.address || 'Address'}</p>
                <p>${appData.company.phone || 'Phone'}</p>
                <p>${appData.company.email || 'Email'}</p>
                ${appData.company.gst ? `<p>GST: ${appData.company.gst}</p>` : ''}
            </div>
            
            <div class="bill-section">
                <h3>Bill To</h3>
                <p><strong>${bill.items[0].customer || 'Customer'}</strong></p>
                <p>Date: ${formatDate(bill.date)}</p>
            </div>
        </div>
        
        <div class="bill-items">
            <table class="bill-items-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th style="text-align: center;">Qty</th>
                        <th>Rate</th>
                        <th>Subtotal</th>
                        <th>GST %</th>
                        <th>GST Amt</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
            </table>
        </div>
        
        <div style="display: flex; justify-content: flex-end; gap: 30px; margin-bottom: 30px;">
            <div style="text-align: right; min-width: 250px;">
                <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #bdc3c7;">
                    <span>Subtotal:</span>
                    <span>₹${(totalAmount - totalGST).toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #bdc3c7;">
                    <span>GST:</span>
                    <span>₹${totalGST.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 18px; font-weight: bold; color: #3498db;">
                    <span>Total:</span>
                    <span>₹${totalAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        <div class="bill-footer">
            <p>Thank you for your business!</p>
            <p>This is a computer-generated invoice.</p>
        </div>
    `;
}

function closeBillModal() {
    document.getElementById('billModal').classList.remove('active');
}

function printBill() {
    window.print();
}

function downloadBillPDF() {
    if (!window.currentBill) return;
    
    alert('📋 For PDF download, please:\n1. Click "Print Bill"\n2. Select "Save as PDF"\n3. Save the file\n\nAlternatively, use a Print-to-PDF driver.');
    printBill();
}

function saveBill() {
    if (!window.currentBill) return;
    
    appData.bills.push(window.currentBill);
    saveDataToStorage();
    closeBillModal();
    loadBillsList();
    alert('✅ Bill saved successfully!');
}

function loadBillsList() {
    const container = document.getElementById('billsList');
    
    if (appData.bills.length === 0) {
        container.innerHTML = '<p>No bills created yet</p>';
        return;
    }
    
    let html = '';
    appData.bills.slice().reverse().forEach(bill => {
        const billAmount = bill.items.reduce((sum, item) => sum + item.amount, 0);
        html += `
            <div class="bill-item">
                <div class="bill-item-info">
                    <strong>${bill.billNo}</strong> - ${formatDate(bill.date)}
                    <br>
                    <span style="font-size: 12px; color: #7f8c8d;">
                        ${bill.items.length} item(s) | Amount: ${formatCurrency(billAmount)}
                    </span>
                </div>
                <div class="bill-item-actions">
                    <button onclick="viewBill(${bill.id})" style="background-color: #3498db; color: white; padding: 8px 15px; border: none; border-radius: 3px; cursor: pointer;">View</button>
                    <button onclick="deleteBill(${bill.id})" style="background-color: #e74c3c; color: white; padding: 8px 15px; border: none; border-radius: 3px; cursor: pointer;">Delete</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function viewBill(id) {
    const bill = appData.bills.find(b => b.id === id);
    if (bill) {
        showBillPreview(bill);
    }
}

function deleteBill(id) {
    if (confirm('Delete this bill?')) {
        appData.bills = appData.bills.filter(b => b.id !== id);
        saveDataToStorage();
        loadBillsList();
    }
}

function downloadAllBills() {
    if (appData.bills.length === 0) {
        alert('❌ No bills to download');
        return;
    }
    
    let html = `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>All Bills - ${appData.company.name}</title>
        <style>
            body { font-family: Arial, sans-serif; }
            .bill { page-break-after: always; padding: 40px; border: 1px solid #ddd; margin-bottom: 20px; }
            @media print { .bill { border: none; page-break-after: always; } }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #2c3e50; color: white; }
        </style>
    </head>
    <body>`;
    
    appData.bills.forEach(bill => {
        html += generateBillHTML(bill);
        html += '<div style="page-break-after: always;"></div>';
    });
    
    html += `</body></html>`;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appData.company.name}_Bills_${new Date().toISOString().split('T')[0]}.html`;
    a.click();
}

// ==================== REPORTS ====================
function generateReport() {
    const selectedMonth = document.getElementById('reportMonth').value;
    const selectedYear = document.getElementById('reportYear').value;
    
    generateYearlyReport();
    generateMonthlyReport(selectedMonth, selectedYear);
}

function generateYearlyReport() {
    const tbody = document.getElementById('yearlyReportBody');
    const years = {};
    
    // Collect data by year
    appData.sales.forEach(sale => {
        const year = new Date(sale.date).getFullYear();
        if (!years[year]) {
            years[year] = {
                sales: 0,
                purchases: 0,
                gst: 0,
                paid: 0,
                received: 0
            };
        }
        const subtotal = sale.quantity * sale.rate;
        const gstAmount = (subtotal * sale.gst) / 100;
        years[year].sales += sale.amount;
        years[year].gst += gstAmount;
        years[year].received += sale.amount;
    });
    
    appData.purchases.forEach(purchase => {
        const year = new Date(purchase.date).getFullYear();
        if (!years[year]) {
            years[year] = {
                sales: 0,
                purchases: 0,
                gst: 0,
                paid: 0,
                received: 0
            };
        }
        years[year].purchases += purchase.amount;
        years[year].paid += purchase.amount;
    });
    
    let html = '';
    const sortedYears = Object.keys(years).sort().reverse();
    
    if (sortedYears.length === 0) {
        html = '<tr><td colspan="7" style="text-align: center;">No data available</td></tr>';
    } else {
        sortedYears.forEach(year => {
            const data = years[year];
            const profit = data.sales - data.purchases;
            html += `
                <tr>
                    <td>${year}</td>
                    <td style="text-align: right;">${formatCurrency(data.sales)}</td>
                    <td style="text-align: right;">${formatCurrency(data.purchases)}</td>
                    <td style="text-align: right;">${formatCurrency(data.gst)}</td>
                    <td style="text-align: right;">${formatCurrency(data.paid)}</td>
                    <td style="text-align: right;">${formatCurrency(data.received)}</td>
                    <td style="text-align: right; color: ${profit >= 0 ? '#2ecc71' : '#e74c3c'};">${formatCurrency(profit)}</td>
                </tr>
            `;
        });
    }
    
    tbody.innerHTML = html;
}

function generateMonthlyReport(month, year) {
    const tbody = document.getElementById('monthlyReportBody');
    const months = {};
    
    // Collect data by month
    if (month && year) {
        // Filter by specific month
        const filteredSales = appData.sales.filter(s => {
            const d = new Date(s.date);
            return (d.getMonth() + 1) == month && d.getFullYear() == year;
        });
        
        const filteredPurchases = appData.purchases.filter(p => {
            const d = new Date(p.date);
            return (d.getMonth() + 1) == month && d.getFullYear() == year;
        });
        
        let sales = 0, purchases = 0, gst = 0, paid = 0, received = 0;
        
        filteredSales.forEach(s => {
            const subtotal = s.quantity * s.rate;
            const gstAmount = (subtotal * s.gst) / 100;
            sales += s.amount;
            gst += gstAmount;
            received += s.amount;
        });
        
        filteredPurchases.forEach(p => {
            purchases += p.amount;
            paid += p.amount;
        });
        
        const profit = sales - purchases;
        let html = `
            <tr>
                <td>${getMonthName(month)} ${year}</td>
                <td style="text-align: right;">${formatCurrency(sales)}</td>
                <td style="text-align: right;">${formatCurrency(purchases)}</td>
                <td style="text-align: right;">${formatCurrency(gst)}</td>
                <td style="text-align: right;">${formatCurrency(paid)}</td>
                <td style="text-align: right;">${formatCurrency(received)}</td>
                <td style="text-align: right; color: ${profit >= 0 ? '#2ecc71' : '#e74c3c'};">${formatCurrency(profit)}</td>
            </tr>
        `;
        tbody.innerHTML = html;
    } else {
        // Show all months
        appData.sales.forEach(sale => {
            const date = new Date(sale.date);
            const m = date.getMonth() + 1;
            const y = date.getFullYear();
            const key = `${y}-${m}`;
            
            if (!months[key]) {
                months[key] = {
                    month: m,
                    year: y,
                    sales: 0,
                    purchases: 0,
                    gst: 0,
                    paid: 0,
                    received: 0
                };
            }
            const subtotal = sale.quantity * sale.rate;
            const gstAmount = (subtotal * sale.gst) / 100;
            months[key].sales += sale.amount;
            months[key].gst += gstAmount;
            months[key].received += sale.amount;
        });
        
        appData.purchases.forEach(purchase => {
            const date = new Date(purchase.date);
            const m = date.getMonth() + 1;
            const y = date.getFullYear();
            const key = `${y}-${m}`;
            
            if (!months[key]) {
                months[key] = {
                    month: m,
                    year: y,
                    sales: 0,
                    purchases: 0,
                    gst: 0,
                    paid: 0,
                    received: 0
                };
            }
            months[key].purchases += purchase.amount;
            months[key].paid += purchase.amount;
        });
        
        let html = '';
        const sortedMonths = Object.keys(months).sort().reverse();
        
        if (sortedMonths.length === 0) {
            html = '<tr><td colspan="7" style="text-align: center;">No data available</td></tr>';
        } else {
            sortedMonths.forEach(key => {
                const data = months[key];
                const profit = data.sales - data.purchases;
                html += `
                    <tr>
                        <td>${getMonthName(data.month)} ${data.year}</td>
                        <td style="text-align: right;">${formatCurrency(data.sales)}</td>
                        <td style="text-align: right;">${formatCurrency(data.purchases)}</td>
                        <td style="text-align: right;">${formatCurrency(data.gst)}</td>
                        <td style="text-align: right;">${formatCurrency(data.paid)}</td>
                        <td style="text-align: right;">${formatCurrency(data.received)}</td>
                        <td style="text-align: right; color: ${profit >= 0 ? '#2ecc71' : '#e74c3c'};">${formatCurrency(profit)}</td>
                    </tr>
                `;
            });
        }
        tbody.innerHTML = html;
    }
}

// ==================== SETTINGS ====================
function saveSettings(e) {
    e.preventDefault();
    
    appData.company.name = document.getElementById('companyName').value;
    appData.company.gst = document.getElementById('companyGST').value;
    appData.company.address = document.getElementById('companyAddress').value;
    appData.company.phone = document.getElementById('companyPhone').value;
    appData.company.email = document.getElementById('companyEmail').value;
    
    saveDataToStorage();
    alert('✅ Settings saved successfully!');
}

function loadSettings() {
    document.getElementById('companyName').value = appData.company.name;
    document.getElementById('companyGST').value = appData.company.gst;
    document.getElementById('companyAddress').value = appData.company.address;
    document.getElementById('companyPhone').value = appData.company.phone;
    document.getElementById('companyEmail').value = appData.company.email;
}

function importData() {
    const file = document.getElementById('importFile').files[0];
    if (!file) {
        alert('❌ Please select a file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            if (confirm('This will replace all current data. Continue?')) {
                appData = imported;
                saveDataToStorage();
                loadSettings();
                updateDashboard();
                alert('✅ Data imported successfully!');
            }
        } catch (err) {
            alert('❌ Invalid file format. Please select a JSON file.');
        }
    };
    reader.readAsText(file);
}

function exportData() {
    const dataStr = JSON.stringify(appData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appData.company.name}_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    alert('✅ Data exported successfully!');
}

function exportCSV() {
    let csv = 'Type,Date,Party,Description,Quantity,Rate,GST%,Amount\n';
    
    appData.sales.forEach(s => {
        csv += `Sale,${s.date},${s.customer},"${s.description}",${s.quantity},${s.rate},${s.gst},${s.amount}\n`;
    });
    
    appData.purchases.forEach(p => {
        csv += `Purchase,${p.date},${p.supplier},"${p.description}",${p.quantity},${p.rate},${p.gst},${p.amount}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appData.company.name}_transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    alert('✅ CSV exported successfully!');
}

function clearAllData() {
    if (confirm('⚠️ This will delete ALL data! Are you absolutely sure?')) {
        if (confirm('Last chance! This action cannot be undone. Continue?')) {
            appData = {
                company: { name: 'Ambika', gst: '', address: '', phone: '', email: '' },
                sales: [],
                purchases: [],
                bills: [],
                payments: []
            };
            saveDataToStorage();
            loadSettings();
            updateDashboard();
            alert('✅ All data cleared!');
        }
    }
}

// ==================== STORAGE ====================
function saveDataToStorage() {
    localStorage.setItem('ambikaAppData', JSON.stringify(appData));
}

function loadDataFromStorage() {
    const stored = localStorage.getItem('ambikaAppData');
    if (stored) {
        appData = JSON.parse(stored);
    }
}

// Close modal on background click
window.addEventListener('click', function(e) {
    const modal = document.getElementById('billModal');
    if (e.target === modal) {
        closeBillModal();
    }
});
