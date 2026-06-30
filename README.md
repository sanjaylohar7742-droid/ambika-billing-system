# 📊 Ambika - Billing & Inventory Management System

**एक complete web-based बिलिंग और इन्वेंटरी ट्रैकिंग सिस्टम**

## ✨ Features

### 1. **Dashboard** 
- Total Sales, Purchases, Payments, Receipts को एक नज़र में देखें
- Monthly Summary दिखाता है
- Real-time profit/loss calculation

### 2. **Sell (बिक्री)**
- Sale transactions को आसानी से record करें
- Customer name, item description, quantity, rate, GST track करें
- Automatic amount calculation के साथ

### 3. **Buy (ख़रीद)**
- Purchase transactions को record करें
- Supplier name, item description, quantity, rate, GST track करें
- सभी खरीद का automatic calculation

### 4. **Bills Management** 
- अपने sales से bills automatically generate करें
- Bill को print या PDF के रूप में download करें
- Multiple items के साथ bills बना सकते हैं
- Company GST information के साथ professional bills

### 5. **Financial Reports**
- **Yearly Summary**: हर साल का complete analysis
  - Total Sales, Purchases, GST, Paid, Received, Profit
- **Monthly Summary**: महीने दर महीने breakdown
  - किसी भी महीने का detailed data देखें
  - Trend analysis के लिए useful

### 6. **Data Management**
- **Import**: पुरानी data को JSON/CSV से import करें
- **Export**: 
  - JSON format में backup लें (पूरा data)
  - CSV format में transactions export करें
- **Local Storage**: Browser में automatically save होता है (internet की जरूरत नहीं)

### 7. **Settings**
- Company Information:
  - Company name (Ambika)
  - GST Number
  - Address
  - Phone & Email
- Data Backup & Recovery
- Clear all data (danger zone)

---

## 🚀 कैसे Use करें

### **शुरुआत करना**
1. `index.html` को किसी भी browser में खोलें
2. Dashboard देखेंगे

### **Sale Record करना**
1. "Sell" tab पर क्लिक करें
2. Date, Customer Name, Item Description fill करें
3. Quantity, Rate, GST% enter करें
4. Amount automatically calculate हो जाएगा
5. "Add Sale" button दबाएं

### **Purchase Record करना**
1. "Buy" tab पर जाएं
2. Same process, सिर्फ "Supplier Name" होगा "Customer Name" की जगह

### **Bill Generate करना**
1. "Bills" tab खोलें
2. "Create New Bill" button दबाएं
3. Bill का preview दिखेगा
4. "Print Bill" या "Download PDF" चुनें (browser के print-to-PDF से)

### **Reports देखना**
1. "Reports" tab खोलें
2. Month/Year select करें (optional)
3. "Generate Report" दबाएं
4. Yearly और Monthly दोनों summary दिखेगा

### **Data Export/Import करना**
1. "Settings" tab जाएं
2. "Export Data" - JSON backup लें
3. "Export CSV" - spreadsheet format में data लें
4. किसी दूसरे डिवाइस पर "Import" से वापस restore करें

---

## 💾 Data Storage

✅ **सब कुछ Local Storage में save है**
- Internet की जरूरत नहीं
- Data sirf आपके device पर है
- Private और secure

⚠️ **Browser cache clear करने पर data delete हो जाएगा**
- हमेशा backup लें (Settings से)

---

## 📱 Browser Support

✅ Works on:
- Chrome
- Firefox
- Safari
- Edge
- Mobile browsers

---

## 🎨 Features Breakdown

| Feature | Details |
|---------|---------|
| **Sales Entry** | Date, Customer, Description, Qty, Rate, GST% |
| **Purchase Entry** | Date, Supplier, Description, Qty, Rate, GST% |
| **Automatic Calculations** | Amount automatically = (Qty × Rate) + GST |
| **Bill Generation** | Professional invoices with company details |
| **Print** | Direct print या print-to-PDF |
| **Reports** | Yearly & Monthly financial summaries |
| **GST Tracking** | Automatic GST calculation और collection |
| **Profit/Loss** | Real-time calculation |
| **Data Export** | JSON backup + CSV export |
| **Data Import** | पुरानी data restore करें |
| **Mobile Friendly** | सभी devices पर काम करता है |

---

## 🔧 Customization

### Company Details बदलने के लिए:
1. Settings tab खोलें
2. Company name, GST, Address, Phone, Email change करें
3. Save करें

### Default GST Change करने के लिए:
- Sale/Buy form में GST % field दिखेगा
- हर transaction के लिए अलग GST रख सकते हैं

---

## 📊 Example Workflow

```
1. January को कुछ sales करते हैं
   ↓
2. Sale form से 5-6 transactions add करते हैं
   ↓
3. कुछ purchases भी record करते हैं
   ↓
4. Dashboard पर total sales, purchases, profit दिख जाएंगे
   ↓
5. Bills tab से bills generate करते हैं
   ↓
6. Reports tab से January का complete summary देखते हैं
   ↓
7. Settings से data backup ले लेते हैं
```

---

## 🆘 FAQ

**Q: क्या cloud backup है?**
A: अभी local storage है। Data को JSON export करके अपने computer पर backup रख सकते हैं।

**Q: क्या multi-user है?**
A: अभी नहीं। यह single-user application है। सभी को same data मिलेगा।

**Q: क्या GST अलग-अलग states के लिए कर सकते हैं?**
A: हाँ! हर sale/purchase पर अलग GST % डाल सकते हैं।

**Q: क्या offline काम करता है?**
A: हाँ! पूरी तरह offline काम करता है। Internet की कोई जरूरत नहीं।

**Q: मेरा सब data गायब हो गया?**
A: Browser cache clear हो गया होगा। Backup JSON file है तो Import करके restore कर सकते हैं।

---

## 💡 Tips

✅ **Regular backup लें** - हर हफ्ते JSON export करें

✅ **Multiple GST rates** - अगर अलग-अलग items पर अलग GST है तो हर item के लिए अलग rate डालें

✅ **Monthly reconciliation** - महीने के आखिर में Reports देखकर verify करें

✅ **Customer/Supplier names consistent रखें** - future analysis के लिए

---

## 🎯 Future Enhancements

Possible upgrades:
- ☐ Cloud backup support
- ☐ Multiple users with login
- ☐ Email invoices
- ☐ Payment tracking
- ☐ Expense management
- ☐ Inventory stock tracking
- ☐ Mobile app
- ☐ Bank integration

---

## 📝 License

Free to use for personal & business purposes.

---

**Made for Ambika 💼**

आपके business के लिए professional billing & accounting system!
