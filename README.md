# LyricsMaster - AI Song Lyrics Generator


![Screenshot 2025-05-04 194210](https://github.com/user-attachments/assets/31e53335-1782-4252-bafc-e02b7cbbe447)

A Flask application that uses a fine-tuned LLM to generate song lyrics in the style of different artists.

## Features

- Generate song lyrics based on your prompts
- Specify artist styles and themes
- Copy generated lyrics to clipboard
- Responsive design for all devices

## Installation

1. Clone this repository:
```
git clone <repository-url>
cd lyrics-master
```

2. Create a virtual environment and activate it:
```
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

3. Install the required packages:
```
pip install -r requirements.txt
```

## Usage

1. Run the Flask application:
```
python app.py
```

2. Open your browser and navigate to `http://127.0.0.1:5000`

3. Enter a prompt like "Generate a song in the style of [artist] about [theme]" and click "Generate Lyrics"

## Requirements

- Python 3.8 or higher
- CUDA-compatible GPU for faster generation (optional but recommended)

## Model Information

This application uses a fine-tuned DeepSeek-R1-Distill-Llama-8B model for generating lyrics.


