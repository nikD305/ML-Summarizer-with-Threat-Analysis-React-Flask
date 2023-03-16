from flask import Flask , request, jsonify
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification, AutoModelForSeq2SeqLM
from flask_cors import CORS

app = Flask(__name__) 
CORS(app)

model = AutoModelForSequenceClassification.from_pretrained("distilbert-base-uncased-finetuned-sst-2-english")
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased-finetuned-sst-2-english")
classifier = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)


model2 = AutoModelForSeq2SeqLM.from_pretrained("snrspeaks/t5-one-line-summary")
tokenizer2 = AutoTokenizer.from_pretrained("snrspeaks/t5-one-line-summary")
classifier2 = pipeline("summarization", model=model2, tokenizer=tokenizer2)


@app.route('/summary', methods=['POST'])
def get_summary():
    data = request.get_json()
    input_text = data['text']
    results = classifier2([input_text])
    return jsonify({'summary': results[0]})



  
@app.route('/sentiment-analysis', methods=['POST'])
def sentiment_analysis():
    data = request.json
    input_text = data['text']
    result = classifier(input_text)[0]
    return jsonify(result)



if __name__ == '__main__':
    app.run(debug=True)