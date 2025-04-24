#!/usr/bin/env python
# coding: utf-8

import os
import sys
import json
import joblib
import pandas as pd



# Base directory path
base_path = os.path.dirname(os.path.abspath(__file__))

# Correct paths using base_path
pipeline = joblib.load(os.path.join(base_path, 'midcrop_price_model.joblib'))
pipelinemin = joblib.load(os.path.join(base_path, 'mincrop_price_model.joblib'))
pipelinemax = joblib.load(os.path.join(base_path, 'maxcrop_price_model.joblib'))

def predict_crop_price(input_data):
    """Predicts crop prices (mid, min, max) using the model."""
    try:
        input_df = pd.DataFrame([input_data])

        # Convert categorical columns to 'category' type
        for col in ['State', 'Commodity', 'Predominant Soil Types']:
            input_df[col] = input_df[col].astype('category')

        predicted_mid_price = pipeline.predict(input_df)[0]
        predicted_min_price = pipelinemin.predict(input_df)[0]
        predicted_max_price = pipelinemax.predict(input_df)[0]

        return {
            'mid_price': round(predicted_mid_price, 2),
            'min_price': round(predicted_min_price, 2),
            'max_price': round(predicted_max_price, 2)
        }
    except Exception as e:
        return {'error': str(e)}

# --- Main logic ---
if __name__ == '__main__':
    try:
        input_json = sys.argv[1]
        input_data = json.loads(input_json)

        result = predict_crop_price(input_data)

        # Handle float32 serialization
        print(json.dumps(result, default=lambda o: float(o)))
    except Exception as e:
        print(json.dumps({'error': str(e)}))

