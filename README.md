# PHISH GUARD

An ML-Powered Phishing URL Detection System with Cyber Threat Intelligence Integration

## Architecture

```text
[ Chrome Extension ] ──(POST /scan)──> [ FastAPI Backend ] ──> [ Serialized XGBoost ]
 (Intercepts active tab)                   (Orchestrator)         (Runs feature vector)
          │                                      │
    (Saves to DB)                          (Fetches CTI)
          │                                      │
          ▼                                      ▼
 [ Analyst Dashboard ] <───────────────── [ Live Threat Feeds ]
 (Renders risk charts)                    (VirusTotal / URLhaus / WHOIS)
```

---
## Tech Stack
- ML: Python, XGBoost, scikit-learn, pandas
- Backend: FastAPI, uvicorn
- Frontend: React, Recharts, Tailwind
- Extension: Chrome MV3
- CTI: VirusTotal API, URLhaus API, python-whois
---
## Features

- XGBoost model trained on **80k URLs** (PhishTank + ISCX)
- Cross Validation **F1 Score:** `0.961 ± 0.001`
- **ROC-AUC:** `0.9968`
- Live threat intelligence integration using **VirusTotal** and **URLhaus**
- WHOIS domain age checking
- Chrome extension for real-time protection
- React dashboard with scan history and IoC export

---

## Setup

### Backend

Run the following files before starting the backend:

- `build_data.py`
- `features.py`
- `model_train.py`
- `predict.py`

Create a `.env` file and add:

```text
VIRUSTOTAL_KEY=<your_virustotal_api_key>
```

Install the required packages:

```bash
pip install -r requirements.txt
```

Go to the backend directory:

```bash
cd src/fastapi_backend
```

Start the server:

```bash
uvicorn main:app --reload
```

After the server starts successfully, open the default URL and add `/docs` to access the API documentation.

---

### Dashboard

```bash
cd dashboard

npm install

npm start
```

---

### Chrome Extension

1. Open `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select the `chrome_extension/` folder

---

## Dataset

The dataset files are not included in the repository due to their large size.

- **Phishing URLs:** PhishTank verified URLs
- **Benign URLs:** Legitimate URLs
- **Total Samples:** 80,000 (40,000 phishing + 40,000 benign)

---

## Results

**Accuracy**

```
0.9798125
```

**Cross Validation F1 Score**

```
0.961 ± 0.001
```

**Confusion Matrix**

```text
[[7822  199]
 [ 124 7855]]
```

| Class | Precision | Recall | F1-score | Support |
|--------|----------|--------|----------|---------|
| 0 | 0.98 | 0.98 | 0.98 | 8021 |
| 1 | 0.98 | 0.98 | 0.98 | 7979 |

**Overall Accuracy:** `0.98` (16,000 samples)

**ROC-AUC**

```
0.9968
```

