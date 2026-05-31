import pandas as pd
from features import extract_feat, lcs, misspell_score ,cal_ana_entropy
print("Loading datasets...")
# Load PhishTank (Malicious = 1)
df_phish = pd.read_csv("data\verified_online.csv.gz")
phish_urls = df_phish["url"].dropna().tolist()[:15000]  # Take 15k samples

# Load Tranco (Benign = 0)
# Tranco only gives domains (e.g., google.com), so we append 'https://' to make them URLs
df_tranco = pd.read_csv("data\tranco_XW5QN.csv", header=None, names=["index", "domain"])
benign_urls = ("https://" + df_tranco["domain"].dropna()).tolist()[:15000]  # Take 15k samples

print(f"Loaded {len(phish_urls)} phishing URLs and {len(benign_urls)} benign URLs.")
dataset_rows = []
for ur in phish_urls:
  dataset_rows.append(extract_feat(ur,1))
for ur in benign_urls:
  dataset_rows.append(extract_feat(ur,0))

df = pd.DataFrame(dataset_rows)
df.to_csv("phishing_dataset.csv",index=False)
print(df.head())