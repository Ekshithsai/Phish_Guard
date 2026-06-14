import re
import tldextract
from urllib.parse import urlparse
from collections import Counter
import math
def extract_feat(url,lbl):
  url = url.replace("://www.", "://")
  feat = {"url": url , "label" : lbl}
  feat["url_length"] = len(url)
  feat["num_dots"] = url.count('.')
  feat["num_digits"] = sum(c.isdigit() for c in url) 
  feat["digit_ratio"] = feat["num_digits"]/len(url)
  # feat["has_@"] = 1 if "@" in url else 0
  ip_pattern = r"https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}"
  feat["has_ip"] = 1 if re.match(ip_pattern,url) else 0
  ext = tldextract.extract(url)
  dom = ext.domain
  sub_dom = ext.subdomain
  # feat["num_sub_dom"] = len(sub_dom.split(".")) if sub_dom else 0
  feat["num_delimiters_dom"]= dom.count("-") + dom.count("_")
  parsed  = urlparse(url)
  path    = parsed.path
  feat["num_delimiters_path"]= path.count("/") + path.count("-")
  # feat["subdomain_depth"] = sub_dom.count(".") + 1 if sub_dom else 0
  keywords = ["login","signin","verify","secure","account","update","confirm","password","wallet","bank","payment","paypal","invoice","gift","bonus","crypto","reward","support","recover","billing"]
  feat["has_key_wrd"] = (1 if any(ky in url.lower() for ky in keywords) else 0)
  tld_phish = ["tk","ml","cf","gq","ga","bond","win","cfd","help","shop","buzz","li","es"]
  feat["phish_TLD"] = (1 if any(t in ext.suffix for t in tld_phish) else 0)
  feat["subtle__misspell"] = misspell_score(dom)
  feat["dom"] = dom
  feat["dom_entropy"]=cal_ana_entropy(dom)
  feat["path_entropy"]=cal_ana_entropy(path)
  tokens = re.split(r'[\-\_\.\/?=&]', url)
  feat["num_tokens"]       = len([t for t in tokens if t])
  feat["max_token_len"]=max(
(len(t) for t in tokens if t),
default=0
)
  # print(ext.suffix)
  return feat
def lcs(a,b):
  m = len(a)
  n = len(b)
  if m <= 3:
    return 0
  dp = [[0]*(n+1) for _ in range(m+1)]
  ans = 0
  for i in range(1,m+1):
    for j in range(1,n+1):
      if a[i-1] == b[j-1]:
        dp[i][j] = dp[i-1][j-1] + 1
        ans = max(ans,dp[i][j])
  return ans
def misspell_score(dom):
    # don't flag if domain is the brand exactly
    brands = ["google", "paypal", "amazon", "facebook", "microsoft",
    "apple", "netflix", "instagram", "twitter", "linkedin",
    "dropbox", "whatsapp", "youtube", "gmail", "outlook","chatgpt","reddit"]
    if dom.lower() in brands:
        return 0.0
    mx = 0
    for b in brands:
        comm = lcs(dom, b)
        score = comm / max(len(b), len(dom))  # normalizing against both lengths
        mx = max(mx, score)
    return mx
def cal_ana_entropy(dom):
  if not dom :
    return 0
  dom_len = len(dom)
  prob = [count/dom_len for count in Counter(dom).values()]
  entropy = -sum(p*math.log(p)/math.log(2) for p in prob)
  # is_sus = (round(entropy,3) > 3.5 and len(dom)>6)
  return entropy