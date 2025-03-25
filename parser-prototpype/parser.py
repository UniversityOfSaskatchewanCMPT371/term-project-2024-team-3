import os
import json
import pandas as pd
from glob import glob
from datetime import datetime

def extract_fitbit_json(json_file, value_key):
    with open(json_file, "r") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            print(f"Could not parse {json_file}")
            return []

    records = []
    for item in data:
        try:
            dt = datetime.strptime(item["dateTime"], "%m/%d/%y %H:%M:%S")
            val = item["value"]
            # For heart rate, extract "bpm"
            if isinstance(val, dict):
                val = val.get(value_key, None)
            records.append((dt, val))
        except Exception as e:
            print(f"Skipping entry in {json_file}: {e}")
    return records

def parse_fitbit_directory(data_dir, output_dir):
    os.makedirs(output_dir, exist_ok=True)

    patterns = {
        "Heart": ("heart_rate-*.json", "bpm"),
        "Calories": ("calories-*.json", None),
        "Steps": ("steps-*.json", None),
        "Distance": ("distance-*.json", None),
    }

    for label, (pattern, value_key) in patterns.items():
        files = glob(os.path.join(data_dir, pattern))
        if not files:
            print(f"No files found for {label}")
            continue

        all_records = []
        for file in files:
            print(f"Processing: {os.path.basename(file)}")
            recs = extract_fitbit_json(file, value_key)
            all_records.extend(recs)

        if all_records:
            df = pd.DataFrame(all_records, columns=["DateTime", label])
            df = df.sort_values("DateTime")
            df.to_csv(os.path.join(output_dir, f"{label.lower()}.csv"), index=False)
            print(f"Saved: {label.lower()}.csv with {len(df)} rows")
        else:
            print(f"No valid data for {label}")

if __name__ == "__main__":
    base_path = "."  # Change to your working directory if needed
    input_dir = os.path.join(base_path, "Physical Activity")
    output_dir = os.path.join(base_path, "output")
    parse_fitbit_directory(input_dir, output_dir)

