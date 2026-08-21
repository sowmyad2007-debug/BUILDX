import urllib.request, json
try:
    data = json.loads(urllib.request.urlopen('http://127.0.0.1:8000/api/code').read())
    print('SUCCESS:', json.dumps(data, indent=2))
except Exception as e:
    print('ERROR:', e)
