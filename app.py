from flask import Flask, request, jsonify
from final_PricePrediction import predict_crop_price

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    # Extract input data from the request
    crop_data = {
        'State': data['state'],
        'Commodity': data['commodity'],
        'Year': data['year'],
        'Month': data['month'],
        'Rainfall': data['rainfall'],
        'Max_Temp': data['max_temp'],
        'Min_Temp': data['min_temp'],
        'Predominant Soil Types': data['soil'],
        'Humidity': data['humidity']
    }
    
    # Call the prediction function
    predictions = predict_crop_price(crop_data)
    
    if 'error' in predictions:
        return jsonify({'error': predictions['error']}), 400

    # Return the predictions as JSON response
    return jsonify(predictions)

if __name__ == '__main__':
    app.run(debug=True)
