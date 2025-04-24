import sys
import joblib
import pandas as pd
import json

# Load pipelines
pipeline = joblib.load('./Modal/crop_price_model.joblib')
pipelinemin = joblib.load('./Modal/mincrop_price_model.joblib')
pipelinemax = joblib.load('./Modal/maxcrop_price_model.joblib')

# Command-line args
args = sys.argv[1:]

# Parse input values
input_data = {
    "State": args[0],
    "Commodity": args[1],
    "Year": int(args[2]),
    "Month": int(args[3]),
    "Rainfall": float(args[4]),
    "Max_Temp": float(args[5]),
    "Min_Temp": float(args[6]),
    "Predominant Soil Types": args[7],
    "Humidity": float(args[8])
}

input_df = pd.DataFrame([input_data])

# Ensure categorical type
for col in ['State', 'Commodity', 'Predominant Soil Types']:
    input_df[col] = input_df[col].astype('category')

# Predict
pred_mid = pipeline.predict(input_df)[0]
pred_min = pipelinemin.predict(input_df)[0]
pred_max = pipelinemax.predict(input_df)[0]

# Output as JSON
print(json.dumps({
    "mid": round(pred_mid, 2),
    "min": round(pred_min, 2),
    "max": round(pred_max, 2)
}))
