PHISH GUARD
An ML-Powered Phishing URL Detection System with Cyber Threat Intelligence Integration
**Architecture:**
[ Chrome Extension ]  ──(POST /scan)──> [ FastAPI Backend ] ──> [ Serialized XGBoost ]
 (Intercepts active tab)                   (Orchestrator)         (Runs feature vector)
          │                                      │
    (Saves to DB)                          (Fetches CTI)
          │                                      │
          ▼                                      ▼
 [ Analyst Dashboard ] <───────────────── [ Live Threat Feeds ]
 (Renders risk charts)                    (VirusTotal / URLhaus / WHOIS)
**Features**
- XGBoost model trained on 80k URLs (PhishTank + ISCX)
- CV F1: 0.961 ± 0.001 | ROC-AUC: 0.9968
- Live threat intelligence via VirusTotal + URLhaus
- WHOIS domain age checking
- Chrome extension for real-time protection
- React dashboard with scan history and IoC export
**SetUp**
  -- Backend --
Run build_data.py , features.py , model_train.py and predict.py before you run the below commands.
Add a variable "VIRUSTOTAL_KEY" equals to the virustotalcheck key in a .env file
pip install -r requirements.txt
cd src/fastapi_backend
uvicorn main:app --reload
checkout the default url given after succesfull run, (add /docs to check)
-- Dashboard --
cd dashboard
npm install
npm start
-- Chrome Extension --
1. Open chrome://extensions
2. Enable Developer mode
3. Load unpacked → select chrome_extension/
**Dataset**
- Exact files aren't added considering the file size
- Phishing: PhishTank verified URLs
- Benign: Legitimate URL Haus
- 80,000(40,000 each) total samples, balanced classes
**Results:**
Accuracy: 0.9798125
CV F1: 0.961 ± 0.001
Confusion Matrix - [[7822  199] [ 124 7855]]
precision    recall  f1-score   support

           0       0.98      0.98      0.98      8021
           1       0.98      0.98      0.98      7979

    accuracy                           0.98     16000
   macro avg       0.98      0.98      0.98     16000
weighted avg       0.98      0.98      0.98     16000
ROC-AUC: 0.9968


