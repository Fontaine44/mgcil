# import json

# # Path to the JSON file
# file_path = 'static/sounds.json'

# # Load the JSON data
# with open(file_path, 'r', encoding="utf8") as file:
#     data = json.load(file)

# # Add the "name" attribute to each object in the array
# for obj in data:
#     obj['endpoint'] = ""

# # Save the updated JSON data back to the file
# with open(file_path, 'w', encoding="utf8") as file:
#     json.dump(data, file, indent=2)