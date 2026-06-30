// ==================== SHARED APP DATA & FUNCTIONS ====================

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
    payments: []
};

// ==================== STORAGE FUNCTIONS ====================
function saveDataToStorage() {
    localStorage.setItem('ambikaAppData', JSON.stringify(appData));
}

function loadDataFromStorage() {
    const stored = localStorage.getItem('ambikaAppData');
    if (stored) {
        try {
            appData = JSON.parse(stored);
        } catch (e) {
            console.error('Error loading data:', e);
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDataFromStorage();
});

// ==================== DATE UTILITIES ====================
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

function setTodayDate(elementId) {
    const today = new Date().toISOString().split('T')[0];
    const element = document.getElementById(elementId);
    if (element) {
        element.value = today;
    }
}

function populateYearSelect(selectId) {
    const yearSelect = document.getElementById(selectId);
    if (!yearSelect) return;
    
    const currentYear = new Date().getFullYear();
    
    for (let i = currentYear; i >= currentYear - 10; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }
}

// ==================== CALCULATION UTILITIES ====================
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
function logoutUser() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}
// Auto-calculate on form input
document.addEventListener('input', function(e) {
    // For sell forms
    if (e.target.id === 'sellQuantity' || e.target.id === 'sellRate' || e.target.id === 'sellGST') {
        const qty = parseFloat(document.getElementById('sellQuantity')?.value) || 0;
        const rate = parseFloat(document.getElementById('sellRate')?.value) || 0;
        const gst = parseFloat(document.getElementById('sellGST')?.value) || 0;
        
        if (qty > 0 && rate > 0) {
            const amounts = calculateAmount(qty, rate, gst);
            const totalElement = document.getElementById('sellTotalAmount');
            if (totalElement) {
                totalElement.textContent = formatCurrency(amounts.total);
            }
            document.getElementById('sellAmount').value = amounts.total;
        }
    }
    
    // For buy forms
    if (e.target.id === 'buyQuantity' || e.target.id === 'buyRate' || e.target.id === 'buyGST') {
        const qty = parseFloat(document.getElementById('buyQuantity')?.value) || 0;
        const rate = parseFloat(document.getElementById('buyRate')?.value) || 0;
        const gst = parseFloat(document.getElementById('buyGST')?.value) || 0;
        
        if (qty > 0 && rate > 0) {
            const amounts = calculateAmount(qty, rate, gst);
            const totalElement = document.getElementById('buyTotalAmount');
            if (totalElement) {
                totalElement.textContent = formatCurrency(amounts.total);
            }
            document.getElementById('buyAmount').value = amounts.total;
        }
    }
});

// ==================== SALES FUNCTIONS ====================
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
    
    document.getElementById('sellForm').reset();
    setTodayDate('sellDate');
    
    showAlert('✅ Sale recorded successfully!', 'success');
    
    if (typeof loadSalesList === 'function') {
        loadSalesList();
    }
    if (typeof updateDashboard === 'function') {
        updateDashboard();
    }
}

function deleteSale(id) {
    if (confirm('Delete this sale record?')) {
        appData.sales = appData.sales.filter(s => s.id !== id);
        saveDataToStorage();
        
        if (typeof loadSalesList === 'function') {
            loadSalesList();
        }
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
    }
}

// ==================== PURCHASE FUNCTIONS ====================
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
    
    document.getElementById('buyForm').reset();
    setTodayDate('buyDate');
    
    showAlert('✅ Purchase recorded successfully!', 'success');
    
    if (typeof loadPurchasesList === 'function') {
        loadPurchasesList();
    }
    if (typeof updateDashboard === 'function') {
        updateDashboard();
    }
}

function deletePurchase(id) {
    if (confirm('Delete this purchase record?')) {
        appData.purchases = appData.purchases.filter(p => p.id !== id);
        saveDataToStorage();
        
        if (typeof loadPurchasesList === 'function') {
            loadPurchasesList();
        }
        if (typeof updateDashboard === 'function') {
            updateDashboard();
        }
    }
}

// ==================== BILL FUNCTIONS ====================
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

function showBillPreview(bill) {
    const modal = document.getElementById('billModal');
    const preview = document.getElementById('billPreview');
    
    if (modal && preview) {
        let billHTML = generateBillHTML(bill);
        preview.innerHTML = billHTML;
        window.currentBill = bill;
        modal.classList.add('active');
    }
}

function closeBillModal() {
    const modal = document.getElementById('billModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function printBill() {
    window.print();
}

function downloadBillPDF() {
    if (!window.currentBill) return;
    
    alert('📋 To save as PDF:\n1. Click "Print Bill"\n2. Select "Save as PDF" in printer settings\n3. Save the file');
    printBill();
}

function saveBill() {
    if (!window.currentBill) return;
    
    appData.bills.push(window.currentBill);
    saveDataToStorage();
    closeBillModal();
    
    if (typeof loadBillsList === 'function') {
        loadBillsList();
    }
    
    showAlert('✅ Bill saved successfully!', 'success');
}

function deleteBill(id) {
    if (confirm('Delete this bill?')) {
        appData.bills = appData.bills.filter(b => b.id !== id);
        saveDataToStorage();
        
        if (typeof loadBillsList === 'function') {
            loadBillsList();
        }
    }
}

// ==================== DASHBOARD FUNCTIONS ====================
function calculateTotals() {
    const totalSales = appData.sales.reduce((sum, s) => sum + s.amount, 0);
    const totalPurchases = appData.purchases.reduce((sum, p) => sum + p.amount, 0);
    
    const gstCollected = appData.sales.reduce((sum, s) => {
        const subtotal = s.quantity * s.rate;
        const gst = (subtotal * s.gst) / 100;
        return sum + gst;
    }, 0);
    
    const gstPaid = appData.purchases.reduce((sum, p) => {
        const subtotal = p.quantity * p.rate;
        const gst = (subtotal * p.gst) / 100;
        return sum + gst;
    }, 0);
    
    const netProfit = totalSales - totalPurchases;
    
    return {
        totalSales,
        totalPurchases,
        gstCollected,
        gstPaid,
        totalPaid: totalPurchases,
        totalReceived: totalSales,
        netProfit
    };
}

// ==================== EXPORT/IMPORT FUNCTIONS ====================
function importData() {
    const file = document.getElementById('importFile')?.files[0];
    if (!file) {
        showAlert('❌ Please select a file', 'danger');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            if (confirm('This will replace all current data. Continue?')) {
                appData = imported;
                saveDataToStorage();
                
                if (typeof loadSettings === 'function') {
                    loadSettings();
                }
                if (typeof updateDashboard === 'function') {
                    updateDashboard();
                }
                
                showAlert('✅ Data imported successfully!', 'success');
            }
        } catch (err) {
            showAlert('❌ Invalid file format. Please select a JSON file.', 'danger');
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
    showAlert('✅ Data exported successfully!', 'success');
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
    showAlert('✅ CSV exported successfully!', 'success');
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
            
            if (typeof loadSettings === 'function') {
                loadSettings();
            }
            if (typeof updateDashboard === 'function') {
                updateDashboard();
            }
            
            showAlert('✅ All data cleared!', 'success');
        }
    }
}

// ==================== SETTINGS FUNCTIONS ====================
function saveSettings(e) {
    e.preventDefault();
    
    appData.company.name = document.getElementById('companyName')?.value || 'Ambika';
    appData.company.gst = document.getElementById('companyGST')?.value || '';
    appData.company.address = document.getElementById('companyAddress')?.value || '';
    appData.company.phone = document.getElementById('companyPhone')?.value || '';
    appData.company.email = document.getElementById('companyEmail')?.value || '';
    
    saveDataToStorage();
    showAlert('✅ Settings saved successfully!', 'success');
}

function loadSettings() {
    const nameEl = document.getElementById('companyName');
    const gstEl = document.getElementById('companyGST');
    const addressEl = document.getElementById('companyAddress');
    const phoneEl = document.getElementById('companyPhone');
    const emailEl = document.getElementById('companyEmail');
    
    if (nameEl) nameEl.value = appData.company.name;
    if (gstEl) gstEl.value = appData.company.gst;
    if (addressEl) addressEl.value = appData.company.address;
    if (phoneEl) phoneEl.value = appData.company.phone;
    if (emailEl) emailEl.value = appData.company.email;
}

// ==================== UI HELPER FUNCTIONS ====================
function showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) {
        // Create alert container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'alertContainer';
        container.style.position = 'fixed';
        container.style.top = '80px';
        container.style.right = '20px';
        container.style.zIndex = '999';
        container.style.maxWidth = '400px';
        document.body.appendChild(container);
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.marginBottom = '10px';
    alert.style.animation = 'slideIn 0.3s ease-in';
    
    document.getElementById('alertContainer').appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Add CSS animations for alerts
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Close modal on background click
window.addEventListener('click', function(e) {
    const modal = document.getElementById('billModal');
    if (modal && e.target === modal) {
        closeBillModal();
    }
});
