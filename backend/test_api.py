import requests
import json

url = "http://localhost:5000/api/ai/analyze"
payload = {
    "batchId": "AF-290",
    "produce": "Tomato",
    "temperature": 18.2,
    "humidity": 72.5,
    "storage_days": 1
}
headers = {'Content-Type': 'application/json'}

try:
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
