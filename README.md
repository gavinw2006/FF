# Further Finance Group — 鉴远金融

Bilingual static website for **Further Finance Group (鉴远金融)**, an Australian mortgage broker based in Camberwell, Melbourne.

## Overview

- **Languages:** English (root) + Simplified Chinese (`cn/`)
- **Tech stack:** Pure HTML, CSS, JavaScript — no framework, no build step
- **Forms:** Email delivery via [Formsubmit.co](https://formsubmit.co) AJAX to `info@furtherfinance.com.au`
- **Deployment:** Auto-deploy to Hostinger on every push via GitHub webhook

## Structure

```
FF/
├── index.html                  # EN home
├── about.html                  # EN about
├── contact.html                # EN contact
├── interest-rates.html         # EN interest rates
├── services/                   # EN service pages
│   ├── home-loan.html
│   ├── commercial-loan.html
│   ├── car-loan.html
│   ├── overseas-loan.html
│   ├── construction-loan.html
│   └── smsf-loan.html
├── tools/
│   └── property-valuation.html
├── cn/                         # Chinese mirror (identical structure)
│   ├── index.html
│   ├── about.html
│   ├── contact.html
│   ├── interest-rates.html
│   ├── services/
│   └── tools/
├── css/style.css               # Single shared stylesheet
├── js/main.js                  # Single shared script
└── images/                     # Logo and assets
```

## Services Covered

- Home Loan / 住房贷款
- Commercial Loan / 商业房产贷款
- Car Loan / 汽车贷款
- Overseas Income Loan / 海外收入贷款
- Construction Loan / 建设贷款
- SMSF Loan / SMSF贷款

## Contact

**Further Finance Group**  
386 Burke Road, Camberwell VIC 3124  
📞 03 9008 5660  
✉️ info@furtherfinance.com.au  
🌐 https://furtherfinance.com.au
