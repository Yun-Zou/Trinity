# Import flask and datetime module for showing date and time
from flask import Flask, request
import openaiRequests
import datetime
 
x = datetime.datetime.now()
 
# Initializing flask app
app = Flask(__name__)
 
# Route for getting inital suggestions
@app.route('/initialsuggestions')
def get_initial_suggestions():
    message = [{
        "text":"Can you send 3 questions that may be relevant to our conversation within 20 words that a user might ask a banking assistant? The first question will be about financial advice, the second question will be about specific insights from their data and the third will be about the bank's services",
        "role": "user"
    }]

    return openaiRequests.getThreeSuggestions(message)

# Route for getting question suggestions
@app.route('/followupsuggestions', methods = ['POST'])
def get_suggestions():
    request_data = request.get_json()
    text = "Can you send 3 questions that may be relevant to our conversation within 15 words that a user might ask a banking assistant? The last statement that was said was the follow. "
    return openaiRequests.getThreeSuggestions(request_data)

@app.route('/response', methods = ['POST'])
def get_question():
    request_data = request.get_json()
    return openaiRequests.getGenericResponse(request_data)
     
# Running app
if __name__ == '__main__':
    app.run(debug=True)