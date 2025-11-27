from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher

class ActionRespondKB(Action):
    def name(self):
        return "action_respond_kb"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain):
        intent = tracker.latest_message['intent'].get('name')
        response_key = f"utter_{intent}"
        responses = domain['responses'].get(response_key)
        if responses:
            dispatcher.utter_message(text=responses[0]['text'])
        else:
            dispatcher.utter_message(text="Sorry, I don’t have that information yet.")
        return []
