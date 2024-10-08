import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    """Converts a CSV file to a JSON file."""
    data = []
    with open(csv_file_path, 'r') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data.append(row)

    with open(json_file_path, 'w') as jsonfile:
        json.dump(data, jsonfile)

# Example usage: Please make a copy of both csv and json before you run.
csv_to_json('output.csv', 'hyd.json')
