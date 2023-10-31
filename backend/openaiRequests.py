#Note: The openai-python library support for Azure OpenAI is in preview.
import os
import openai
import json
openai.api_type = "azure"
openai.api_base = "xxx"
openai.api_version = "2023-05-15"
openai.api_key = "xxx"


def getGenericResponse(chatHistory):
    message=[
            {"role": "system", "content": "You are a mobile banking app assistant. Users may ask questions for financial advice, information about their account or ask you to perform actions for them. If they ask for financial advice, reply in a succinct way within 50 words. If they ask for data on their banking usage such as how much spent, if they paid someone or how much they saved in a month, reply in 10 words or less with detailed random data that an average user might have assuming you already have the details. If they ask you to perform an action, offer to perform it after asking for a confirmation for them assuming you already have the details."},
    ]

    for chat in chatHistory:
        newMessage = {
            "role": chat['role'],
            "content": chat['text']
        }
        message.append(newMessage)
        
    response = openai.ChatCompletion.create(
        engine="aiops-deployment", # engine = "deployment_name".
        messages = message
    )
    # print(response['choices'][0]['message'])
    return response['choices'][0]['message']

def getThreeSuggestions(chatHistory):
    message=[
            {"role": "system", "content": "You are a mobile banking app assistant named BankBuddy. Users may ask questions for financial advice, information about their account or ask you to perform actions for them. If the last responses in the conversation was asking for financial advice or information about their data, can you send me 3 questions within 15 words that a user might ask a banking assistant based on this conversation. If the last statement in the conversation was asking for a confirmation checking if something is correct, send three responses with the first response the one word answer Confirm, the second response a one word answer being No and the last response offering more information. "},
    ]

    for chat in chatHistory:
        newMessage = {
            "role": chat['role'],
            "content": chat['text']
        }
        message.append(newMessage)
    
    message.append({
        "role": 'user',
        "content": 'Can you send 3 questions that may be relevant to the last two responses in this conversation within 15 words that a user might ask a banking assistant? Only include the questions and no other text.'
    })

    response = openai.ChatCompletion.create(
        engine="aiops-deployment",
        messages = message
    )
    answer = response['choices'][0]['message']
    print(answer)
    return answer

def run():
    response = openai.ChatCompletion.create(
        engine="aiops-deployment", # engine = "deployment_name".
        messages=[
            {"role": "system", "content": "You are a mobile banking app assistant named BankBuddy. Users may ask questions for financial advice, information about their account or ask you to perform actions for them."},
            {"role": "user", "content": "Can you send me 3 questions within 20 words that a user might ask a banking assistant?"}
            # {"role": "assistant", "content": "Yes, customer managed keys are supported by Azure OpenAI."},
            # {"role": "user", "content": "Do other Azure AI services support this too?"}
        ]
    )
    answer = response['choices'][0]['message']['content']
    return answer

if __name__ == "__main__":
    # run()
    getGenericResponse("What is interest rates?")
    