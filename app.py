import os
import requests
import numpy as np
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# ─────────────────────────────────────────────
#  WORLD BANK CONFIG
# ─────────────────────────────────────────────

INDICATORS = {
    "GDP (Current US$)":           "NY.GDP.MKTP.CD",
    "GDP per Capita (US$)":        "NY.GDP.PCAP.CD",
    "Inflation (CPI)":             "FP.CPI.TOTL",
    "Unemployment (%)":            "SL.UEM.TOTL.ZS",
    "Exchange Rate (LCU/USD)":     "PA.NUS.FCRF",
    "Real Interest Rate (%)":      "FR.INR.RINR",
    "FDI Net Inflows (% of GDP)":  "BX.KLT.DINV.WD.GD.ZS",
    "Trade (% of GDP)":            "NE.TRD.GNFS.ZS",
}

COUNTRIES = {
    "Mexico":        "MEX",
    "United States": "USA",
    "Chile":         "CHL",
    "Brazil":        "BRA",
    "Canada":        "CAN",
    "Germany":       "DEU",
    "Japan":         "JPN",
    "China":         "CHN",
    "Argentina":     "ARG",
    "Colombia":      "COL",
}

# ─────────────────────────────────────────────
#  API ENDPOINT — World Bank data
# ─────────────────────────────────────────────

@app.route('/api/worldbank')
def worldbank_data():
    country_code   = request.args.get("country", "MEX")
    indicator_name = request.args.get("indicator", "GDP (Current US$)")
    start_year     = int(request.args.get("start", 2000))
    end_year       = int(request.args.get("end", 2024))

    indicator_code = INDICATORS.get(indicator_name)
    if not indicator_code:
        return jsonify({"error": "Unknown indicator"}), 400

    url = (
        f"https://api.worldbank.org/v2/country/{country_code}"
        f"/indicator/{indicator_code}?format=json&per_page=100"
    )
    try:
        resp = requests.get(url, timeout=15)
        payload = resp.json()
        if len(payload) < 2 or payload[1] is None:
            return jsonify({"labels": [], "values": [], "stats": {}})

        rows = sorted(
            [{"year": int(i["date"]), "value": i["value"]}
             for i in payload[1] if i["value"] is not None],
            key=lambda x: x["year"]
        )
        rows = [r for r in rows if start_year <= r["year"] <= end_year]

        labels = [r["year"] for r in rows]
        values = [r["value"] for r in rows]

        stats = {}
        if values:
            arr = np.array(values)
            stats = {
                "mean":         round(float(arr.mean()), 4),
                "std":          round(float(arr.std()),  4),
                "min":          round(float(arr.min()),  4),
                "max":          round(float(arr.max()),  4),
                "latest_year":  labels[-1],
                "latest_value": round(values[-1], 4),
            }
        return jsonify({"labels": labels, "values": values, "stats": stats})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ─────────────────────────────────────────────
#  EXISTING ROUTES
# ─────────────────────────────────────────────

@app.route('/')
def home():
    return render_template('index.html', active='home')

@app.route('/company')
def company():
    return render_template('company.html', active='company')

@app.route('/industry')
def industry():
    return render_template('industry.html', active='industry')

@app.route('/macro')
def macro():
    return render_template('macro.html', active='macro')

@app.route('/fx-exposure')
def fx_exposure():
    return render_template('fx_exposure.html', active='fx')

@app.route('/hedging')
def hedging():
    return render_template('hedging.html', active='hedging')

@app.route('/references')
def references():
    return render_template('references.html', active='references')

# ─────────────────────────────────────────────
#  NEW ROUTE — Economic Dashboard
# ─────────────────────────────────────────────

@app.route('/dashboard')
def dashboard():
    return render_template(
        'dashboard.html',
        active='dashboard',
        indicators=list(INDICATORS.keys()),
        countries=list(COUNTRIES.keys()),
        country_codes=COUNTRIES,
    )

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
