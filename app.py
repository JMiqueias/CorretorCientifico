from flask import Flask, render_template, request, jsonify
from textprocessor import TextProcessor
import json

app = Flask(__name__)
app.static_folder = 'static'

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        text = request.form['text']
        # cria um novo objeto TextProcessor com o texto fornecido
        tp = TextProcessor(text)

        # obtém a pontuação do texto e o texto com períodos longos destacados
        score = tp.getScore()
        highlighted_text = tp.getHighlightedText()

        # retorna os resultados em formato JSON
        return jsonify(score=score, highlighted_text=highlighted_text)
    else:
        return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
