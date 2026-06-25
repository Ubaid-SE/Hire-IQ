import time
import random
from google.genai.errors import APIError, ServerError

def generate_content_with_retry(client, model, contents, max_retries=4, initial_delay=2):
    """
    Helper function to call Gemini generate_content with exponential backoff retry for transient errors.
    """
    delay = initial_delay
    for attempt in range(max_retries):
        try:
            return client.models.generate_content(model=model, contents=contents)
        except Exception as e:
            error_msg = str(e)
            is_transient = False
            
            # Check if it's a 503, 429, or other transient error
            if isinstance(e, ServerError):
                is_transient = True
            elif isinstance(e, APIError):
                # 429 or 503
                if e.code in [429, 503]:
                    is_transient = True
            elif "503" in error_msg or "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg or "UNAVAILABLE" in error_msg:
                is_transient = True
                
            if is_transient and attempt < max_retries - 1:
                # Exponential backoff with jitter
                sleep_time = delay + random.uniform(0.1, 1.0)
                print(f"      [Gemini API Warning]: {error_msg.splitlines()[0] if error_msg else 'Error'}")
                print(f"      Retrying in {sleep_time:.2f} seconds... (Attempt {attempt + 1}/{max_retries})")
                time.sleep(sleep_time)
                delay *= 2
            else:
                raise e
