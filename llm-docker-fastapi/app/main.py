from fastapi import FastAPI, Request
from pydantic import BaseModel
import gpt4all

app = FastAPI()

# When run locally
# model = gpt4all.GPT4All("gpt4all-falcon-newbpe-q4_0.gguf", model_path="../models")

# When run in Docker
model = gpt4all.GPT4All("gpt4all-falcon-newbpe-q4_0.gguf")


class PromptRequest(BaseModel):
    prompt: str

@app.post("/chat")
async def chat(request: PromptRequest):
    response = model.generate(request.prompt, max_tokens=200)
    return {"response": response}
