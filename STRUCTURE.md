# 📂 Ambika - Multi-Page Application Structure

## 📁 Folder Organization

```
app/
├── index.html                    # Home/Welcome page
├── assets/
│   ├── css/
│   │   └── main.css             # Shared styles for all pages
│   ├── js/
│   │   └── app.js               # Shared JavaScript (data management, utilities)
│   └── partials/
│       └── header.html          # Navigation bar (reference)
├── pages/
│   ├── dashboard.html           # Dashboard with metrics
│   ├── sales.html               # Record and manage sales
│   ├── purchases.html           # Record and manage purchases
│   ├── bills.html               # Create and manage bills
│   ├── reports.html             # View financial reports
│   └── settings.html            # Settings and data management
├── sample_data.json             # Sample data for testing
├── README.md                     # User guide
├── SERVER_SETUP.md              # Optional server setup guide
└── STRUCTURE.md                 # This file
```

---

## 🎯 Page Structure

### **index.html** (Home)
- Welcome/landing page
- Feature overview
- Quick access links to all pages
- FAQ section
- How to use guide

### **pages/dashboard.html** (Dashboard)
- Key metrics (Sales, Purchases, Profit, GST, etc.)
- Monthly summary table
- Quick action buttons
- Real-time calculations

### **pages/sales.html** (Sales Management)
- Form to add new sales
- Customer name, item description, qty, rate, GST
- Automatic amount calculation
- List of all sales transactions
- Delete functionality

### **pages/purchases.html** (Purchase Management)
- Form to add new purchases
- Supplier name, item description, qty, rate, GST
- Automatic amount calculation
- List of all purchase transactions
- Delete functionality

### **pages/bills.html** (Bills Management)
- Create bills from sales
- Professional bill preview with company details
- Print to PDF functionality
- List of all saved bills
- View/Delete bills

### **pages/reports.html** (Financial Reports)
- Yearly summary table
- Monthly summary table
- Filter by month/year
- Export to CSV
- Print functionality

### **pages/settings.html** (Settings & Data)
- Company information form
- GST number, address, phone, email
- Import data from JSON file
- Export data as JSON (full backup)
- Export data as CSV (transactions)
- Clear all data (with confirmation)
- Application info

---

## 🔧 Shared Assets

### **assets/css/main.css**
Centralized styles for all pages including:
- Color variables (primary, secondary, success, danger, warning)
- Navbar styles
- Form styles
- Button styles
- Table styles
- Card styles
- Modal styles
- Responsive design
- Print styles
- Alert styles

### **assets/js/app.js**
Shared JavaScript functions:
- Data storage (localStorage)
- Data loading/saving
- Date utilities (format, months, year population)
- Calculation functions (amount, currency formatting)
- Form submission handlers
- Item CRUD operations
- Bill generation
- Dashboard calculations
- Export/Import functions
- Settings management
- Alert/notification system

---

## 🔄 How Pages Work Together

### Data Flow:
```
1. User opens any page
   ↓
2. app.js loads from localStorage (shared data)
   ↓
3. Page-specific script populates forms/tables
   ↓
4. User performs action (add/delete/export)
   ↓
5. app.js updates appData object
   ↓
6. Data saved to localStorage
   ↓
7. All pages automatically sync (same data source)
```

### Example: Adding a Sale

1. User goes to **sales.html**
2. Fills the form (customer, item, qty, rate, GST)
3. JavaScript auto-calculates amount
4. Clicks "Add Sale"
5. `addSale()` function in **app.js** is called
6. Sale object created and added to `appData.sales[]`
7. Data saved to **localStorage**
8. Page reloads the list
9. User can view in **dashboard.html** immediately
10. Bill can be created from this sale in **bills.html**
11. Report will include this sale in **reports.html**

---

## 💾 Data Structure

```javascript
appData = {
    company: {
        name: 'Ambika',
        gst: '27AABCT1234A1ZZ',
        address: '...',
        phone: '...',
        email: '...'
    },
    sales: [
        {
            id: timestamp,
            date: 'YYYY-MM-DD',
            customer: 'Name',
            description: 'Item',
            quantity: 10,
            rate: 500,
            gst: 18,
            amount: 5900
        }
    ],
    purchases: [
        {
            id: timestamp,
            date: 'YYYY-MM-DD',
            supplier: 'Name',
            description: 'Item',
            quantity: 25,
            rate: 600,
            gst: 18,
            amount: 17700
        }
    ],
    bills: [
        {
            id: timestamp,
            billNo: 'BILL-0001',
            date: 'YYYY-MM-DD',
            items: [...],
            notes: ''
        }
    ],
    payments: []
}
```

---

## ✅ Features by Page

| Feature | Page | Details |
|---------|------|---------|
| **Add Sales** | sales.html | Record customer, item, qty, rate, GST |
| **Add Purchases** | purchases.html | Record supplier, item, qty, rate, GST |
| **View Dashboard** | dashboard.html | Metrics, summaries, quick actions |
| **Create Bills** | bills.html | Generate invoices from sales |
| **Print Bills** | bills.html | Export to PDF via browser print |
| **View Reports** | reports.html | Yearly/monthly financial data |
| **Company Settings** | settings.html | Store company information |
| **Export JSON** | settings.html | Full data backup |
| **Export CSV** | settings.html | Transaction export |
| **Import Data** | settings.html | Restore from backup |
| **Delete Records** | All pages | Remove individual items |
| **Clear All Data** | settings.html | Wipe everything (dangerous) |

---

## 🚀 How to Use

### First Time:
1. Open `index.html` in browser
2. Click "Get Started" → Dashboard
3. Go to Settings, enter company info
4. Go to Sales and add first sale
5. View in Dashboard immediately
6. Create bill from Bills page

### Regular Usage:
1. Open `index.html`
2. Click quick access links for daily tasks
3. Data automatically saves
4. Backup data weekly from Settings

### Backup & Restore:
1. Go to Settings
2. Click "Export JSON"
3. Save file safely
4. To restore: Import file in Settings

---

## 🔐 Security & Privacy

✅ **All data is stored locally on your device**
- No data sent to any server
- No cloud dependency
- Complete privacy
- Works offline

⚠️ **Data is lost if browser cache is cleared**
- Always keep backups
- Export JSON regularly
- Store backups in safe location

---

## 📱 Responsive Design

All pages are mobile-friendly:
- Navigation adapts for small screens
- Forms are touch-friendly
- Tables scroll horizontally on mobile
- Buttons stack vertically
- Readable fonts and spacing

---

## 🎨 Styling Notes

### Color Scheme:
- **Primary:** #2c3e50 (Dark blue-gray)
- **Secondary:** #3498db (Bright blue)
- **Success:** #27ae60 (Green)
- **Danger:** #e74c3c (Red)
- **Warning:** #f39c12 (Orange)
- **Light BG:** #ecf0f1 (Light gray)

### Consistency:
- Same CSS used across all pages
- Same JavaScript utilities used
- Consistent form styling
- Consistent button styling
- Consistent table styling

---

## 📊 Example Workflows

### Workflow 1: Daily Sales Entry
```
1. dashboard.html → View today's summary
2. sales.html → Add new sales
3. dashboard.html → Check updated metrics
4. Repeat as sales happen
```

### Workflow 2: End of Month Reporting
```
1. reports.html → View monthly summary
2. bills.html → Create and send invoices
3. settings.html → Export CSV for accounting
4. settings.html → Backup JSON
```

### Workflow 3: Switching Devices
```
1. On Device A: settings.html → Export JSON
2. On Device B: settings.html → Import JSON
3. Device B now has all data from Device A
4. Continue using on Device B
```

---

## 🔧 Development Notes

### Adding a New Page:
1. Create `pages/newpage.html`
2. Copy navbar from another page
3. Import `<link rel="stylesheet" href="../assets/css/main.css">`
4. Import `<script src="../assets/js/app.js"></script>`
5. Add page-specific JavaScript at bottom
6. Update navbar links in all pages

### Adding a New Feature:
1. Add function to `assets/js/app.js`
2. Call function from relevant page
3. Test on all pages (data is shared)
4. Update README.md

### Debugging:
1. Open browser console (F12)
2. Check `appData` object
3. Check localStorage: `localStorage.getItem('ambikaAppData')`
4. Check for JS errors in console

---

## 📚 File Sizes

- **main.css:** ~15 KB
- **app.js:** ~25 KB
- **dashboard.html:** ~8 KB
- **sales.html:** ~6 KB
- **purchases.html:** ~6 KB
- **bills.html:** ~7 KB
- **reports.html:** ~11 KB
- **settings.html:** ~8 KB
- **index.html:** ~12 KB

**Total:** ~98 KB (very lightweight!)

---

## 🎯 Future Enhancements

- [ ] Database backend (Firebase/MongoDB)
- [ ] Cloud sync across devices
- [ ] Multi-user with login
- [ ] Email bills
- [ ] Payment tracking
- [ ] Expense categories
- [ ] Inventory stock levels
- [ ] Customer portal
- [ ] Mobile app version

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify localStorage isn't full
3. Try importing sample data to test
4. Clear cache and try again
5. Export backup before major changes

---

**Version 2.0 - Multi-Page Edition** 🚀
