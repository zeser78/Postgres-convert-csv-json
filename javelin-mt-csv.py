from csv import reader
import json
# Create a json file from csv
# Open file
with open("mt-data-union-square-March03-2022.csv") as file:
    csv_reader = reader(file)
    data = list(csv_reader)

# Remove header and id from data, creating an array with Dictionary / Objects
data_mt = []
for idx, item in enumerate(data):
    if idx > 0:
        new_data = json.loads(item[1])
        data_mt.append(new_data)


# Directly from dictionary/ object create json file
# Change name
with open('json_data_03-03.json', 'w') as outfile:
    json.dump(data_mt, outfile)
