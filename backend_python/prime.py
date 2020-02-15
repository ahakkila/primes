from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

def checkPrime(num):
    if (num < 2):
        return {"success": False, "isPrime": False, "err": "Number smaller than 2"}

    i = None
    for i in range(2, num+1):
        if (num % i == 0):
            break
    if i == num:
        return {"success": True, "isPrime": True}
    else:
        return {"success": True, "isPrime": False, "err": f"Number has a divisor of {i}" }

@app.route('/')
def root():
    return 'Not found', 404

@app.route('/api/sum', methods=['POST'])
def sumAndPrime():
    numArray = request.get_json()["numberList"].split(",")
    total = 0
    for num in numArray:
        total = total + int(num)

    result = checkPrime(total)
    result["sum"] = total
    return jsonify(result)

@app.route('/api/isprime', methods=['POST'])
def isPrime():
    number = int(request.get_json()["primeCandidate"])
    result = checkPrime(number)
    return jsonify(result)

PORT=3003

if __name__ == '__main__':
    app.run(port=PORT, use_reloader=True)

