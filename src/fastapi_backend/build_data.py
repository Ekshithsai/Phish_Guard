import random
import pandas as pd
from features import extract_feat, lcs, misspell_score, cal_ana_entropy
print("Loading datasets...")
# Load phishing URLs
df_phish = pd.read_csv("../../data/verified_online.csv.gz")
phish_urls = df_phish["url"].dropna().tolist()[:40000]
# Load benign URLs
df_tranco = pd.read_csv(
    "../../data/tranco_XW5QN.csv",
    header=None,
    names=["rank", "domain"]
)
tranco_urls = ("https://" + df_tranco["domain"].astype(str)).tolist()
# New dataset
df_new = pd.read_csv("../../data/URL_dataset.csv")
df_new = df_new[df_new["type"].str.lower() == "legitimate"]
df_new["url"] = df_new["url"].str.replace("://www.", "://", regex=False)
new_urls = df_new["url"].dropna().tolist()
# Merge and remove duplicates
benign_urls = list(set(tranco_urls + new_urls))
random.seed(42)
random.shuffle(benign_urls)
benign_urls = benign_urls[:40000]
print(len(benign_urls))
print(f"Loaded {len(phish_urls)} phishing URLs and {len(benign_urls)} benign URLs.")
dataset_rows = []
for ur in phish_urls:
    dataset_rows.append(extract_feat(ur, 1))
for ur in benign_urls:
    dataset_rows.append(extract_feat(ur, 0))
df = pd.DataFrame(dataset_rows)
df.to_csv("phishing_dataset.csv", index=False)
print(df.tail())