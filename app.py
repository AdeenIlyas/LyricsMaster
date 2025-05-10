from flask import Flask, render_template, request, jsonify
import torch
from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import re

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

# Load the model and tokenizer (lazy loading - only when needed)
model = None
tokenizer = None

def load_model():
    global model, tokenizer
    if model is None or tokenizer is None:
        print("Loading model and tokenizer...")
        base_model = AutoModelForCausalLM.from_pretrained("unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit")
        model = PeftModel.from_pretrained(base_model, "Adeen123/my_model")
        tokenizer = AutoTokenizer.from_pretrained("unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit")
        tokenizer.pad_token = tokenizer.eos_token
        print("Model and tokenizer loaded!")

def generate_lyrics(prompt):
    load_model()
    
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512).to("cuda")
    
    outputs = model.generate(
        **inputs,
        max_new_tokens=2048,
        temperature=0.7,
        top_p=0.9,
        repetition_penalty=1.2,
        do_sample=True,
        eos_token_id=tokenizer.eos_token_id,
        pad_token_id=tokenizer.eos_token_id,
    )
    
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    # Remove any content within <think>...</think> tags
    clean_text = re.sub(r'<think>.*?</think>', '', generated_text, flags=re.DOTALL)
    
    return clean_text

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    prompt = request.form['prompt']
    
    try:
        lyrics = generate_lyrics(prompt)
        return jsonify({"success": True, "lyrics": lyrics})
    except Exception as e:
        print(f"Error generating lyrics: {e}")
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
