import pandas as pd
import sys
import json


# Load crop data once to avoid reloading on each call
df, months = None, None
def load_crop_data_once():
    global df, months
    if df is None or months is None:
        df = pd.read_csv('crop.csv')  # Make sure crop.csv is in the same folder
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return df, months

def predict_crops_with_scores(state, soil_type, month):
    df, months = load_crop_data_once()
    try:
        month_index = months.index(month)
    except ValueError:
        return {"error": "Invalid month. Please use one of: " + ", ".join(months)}

    state_data = df[df['State'].str.lower() == state.lower()]
    if state_data.empty:
        return {"error": "No data found for state: {state}".format(state)}

    soil_data = state_data[state_data['Predominant Soil Types'].str.contains(soil_type, case=False)]
    if soil_data.empty:
        return {"error": "No crops found for soil type: {soil_type} in state: {state}".format(state)}

    available_crops = soil_data[soil_data[month] == 1]
    if available_crops.empty:
        return {"error": "No crops available in {month} for {state} with {soil_type} soil".format(state)}

    scores = []
    for _, crop_row in available_crops.iterrows():
        score = calculate_crop_score(crop_row, month, months)
        scores.append((crop_row['Commodity'], score))

    scores.sort(key=lambda x: x[1], reverse=True)
    return {"results": scores}

def calculate_crop_score(crop_row, current_month, months):
    score = 0.0
    growing_months = sum([1 for month in months if crop_row[month] == 1])
    score += growing_months / len(months) * 40

    month_index = months.index(current_month)
    prev_month = months[month_index - 1] if month_index > 0 else months[-1]
    next_month = months[(month_index + 1) % len(months)]

    if crop_row[prev_month] == 1 and crop_row[next_month] == 1:
        score += 30

    score += 30
    return min(score, 100)

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(json.dumps({"error": "Expected 3 arguments: state, soil, month"}))
        sys.exit(1)

    state = sys.argv[1]
    soil = sys.argv[2]
    month = sys.argv[3]

    result = predict_crops_with_scores(state, soil, month)
    print(json.dumps(result))