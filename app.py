from flask import Flask, render_template

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
