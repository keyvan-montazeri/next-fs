# Dockerized LLM with FastAPI
## GPT Model
Model needs to be downloaded to model dir from:  
https://huggingface.co/spaces/cyberneel/dermalyze-streamlit/blob/a5624942d2d5c4abce741df1432ff89d18aa9c72/images/gpt4all-falcon-

## Run
``` bash
cd app
pip install --no-cache-dir -r requirements.txt
uvicorn main:app --port 8000
```

## Test

``` bash
curl -X POST "http://localhost:8000/chat" \
     -H "Content-Type: application/json" \
     -d '{"prompt": "Hello, can you explain quantum computing simply?"}'
```

## Docker
has issue with M1.
``` bash
docker build -t llm-fastapi .
docker run -p 8000:8000 -v ./models:/root/.cache/gpt4all llm-fastapi
```