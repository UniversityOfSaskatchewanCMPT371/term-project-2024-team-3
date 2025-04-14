import os
import json
import pandas as pd
from glob import glob
from datetime import datetime
from tqdm import tqdm  # For progress bar

def extract_fitbit_json(json_file, value_key):
    """Extracts relevant data from each JSON file."""
    try:
        with open(json_file, "r") as f:
            data = json.load(f)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        print(f"Could not parse {json_file}: {e}")
        return []

    records = []
    for item in data:
        try:
            dt = datetime.strptime(item["dateTime"], "%m/%d/%y %H:%M:%S")
            val = item["value"]
            # For heart rate, extract "bpm"
            if isinstance(val, dict):
                val = val.get(value_key, None)
            formatted_dt = dt.strftime("%m/%d/%y %H:%M:%S")  # format DateTime to string
            records.append((formatted_dt, val))
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

    # List to collect all merged records
    all_merged_records = []

    for label, (pattern, value_key) in patterns.items():
        files = glob(os.path.join(data_dir, pattern))
        if not files:
            print(f"⚠️ No files found for {label}")
            continue

        all_records = []
        print(f"Processing {label} data...")
        # Adding progress bar for processing files
        for file in tqdm(files, desc=f"Processing {label} files"):
            recs = extract_fitbit_json(file, value_key)
            all_records.extend(recs)

        if all_records:
            df = pd.DataFrame(all_records, columns=["DateTime", label])
            df = df.sort_values("DateTime")
            # Saving individual CSV for each category
            output_file = os.path.join(output_dir, f"{label.lower()}.csv")
            df.to_csv(output_file, index=False)
            print(f"Saved: {output_file} with {len(df)} rows")
            # Add the records to the merged list
            all_merged_records.extend(all_records)
        else:
            print(f"No valid data for {label}")

    # Merging all data into a single CSV file
    if all_merged_records:
        merged_df = pd.DataFrame(all_merged_records, columns=["DateTime", "Heart", "Calories", "Steps", "Distance"])
        merged_df = merged_df.sort_values("DateTime")
        merged_output_file = os.path.join(output_dir, "fitbit_data.csv")
        merged_df.to_csv(merged_output_file, index=False)
        print(f"Merged data saved to: {merged_output_file}")

if __name__ == "__main__":
    base_path = "."  # Change to your working directory if needed
    input_dir = os.path.join(base_path, "Physical Activity")
    output_dir = os.path.join(base_path, "output")
    parse_fitbit_directory(input_dir, output_dir)
