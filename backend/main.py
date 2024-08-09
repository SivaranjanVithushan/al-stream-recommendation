# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# import joblib
# import pandas as pd
# import os

# app = FastAPI()

# # Define the model and encoder paths
# model_path = os.path.join(os.path.dirname(__file__), 'model', 'best_knn_model.pkl')
# encoder_path = os.path.join(os.path.dirname(__file__), 'model', 'encoder.pkl')

# # Load the model and encoder
# best_knn_model = joblib.load(model_path)
# encoder = joblib.load(encoder_path)

# # Load the mapping DataFrame
# df_path = os.path.join(os.path.dirname(__file__), 'model', 'Thurka_Research.csv')  # Ensure this file exists
# df = pd.read_csv(df_path)
# df['Streams'] = pd.Categorical(df['Streams'])
# df['Streams'] = df['Streams'].cat.codes  # Encode stream names to numeric codes

# # Define the feature names used in encoding
# feature_names = [
#     'Career_Influence_No', 'Career_Influence_Yes',
#     'Start_Time_Immediately', 'Start_Time_Later',
#     'Motivations_Personal Growth and Development', 'Motivations_Other',
#     'Challenges_No', 'Challenges_Yes',
#     'Skills_Communication', 'Skills_Leadership', 'Skills_Problem-Solving', 'Skills_Technical Skill',
#     'Skills_Critical Thinking', 'Skills_Organizational Skills', 'Skills_Creativity', 'Skills_Marketing',
#     'Skills_Accounting', 'Skills_Art Skills (Dancing, Singing)',
#     'Occupation_Engineer', 'Occupation_Doctor', 'Occupation_Artist', 'Occupation_Entrepreneur',
#     'Occupation_Scientist', 'Occupation_Teacher'
# ]

# class PredictionRequest(BaseModel):
#     skills: str
#     occupation: str

# def predict_stream(skills: str, occupation: str) -> str:
#     # Create a dataframe for the new input
#     new_data = pd.DataFrame({
#         'Career_Influence': ['No'],
#         'Start_Time': ['Immediately'],
#         'Motivations': ['Personal Growth and Development'],
#         'Challenges': ['No'],
#         'Skills': [skills],
#         'Occupation': [occupation],
#     })

#     # OneHotEncode the new input
#     new_data_encoded = pd.DataFrame(encoder.transform(new_data))
#     new_data_encoded.columns = feature_names[:len(new_data_encoded.columns)]

#     # Align the columns with the training data
#     missing_cols = set(feature_names) - set(new_data_encoded.columns)
#     for c in missing_cols:
#         new_data_encoded[c] = 0
#     new_data_encoded = new_data_encoded[feature_names]

#     # Predict the stream using the best KNN model
#     stream_code = best_knn_model.predict(new_data_encoded)[0]

#     # Decode the stream code to the actual stream name
#     stream_name = df[df['Streams'] == stream_code]['Streams'].iloc[0]

#     return stream_name

# @app.post("/predict")
# async def predict(request: PredictionRequest):
#     try:
#         stream_name = predict_stream(request.skills, request.occupation)
#         return {"recommendedStream": stream_name}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI()

# Define the model and encoder paths
model_path = os.path.join(os.path.dirname(__file__), 'model', 'best_knn_model.pkl')
encoder_path = os.path.join(os.path.dirname(__file__), 'model', 'encoder.pkl')
feature_names_path = os.path.join(os.path.dirname(__file__), 'model', 'feature_names.pkl')
label_encoder_path = os.path.join(os.path.dirname(__file__), 'model', 'label_encoder.pkl')  

# Load the model and encoder
best_knn_model = joblib.load(model_path)
encoder = joblib.load(encoder_path)
feature_names = joblib.load(feature_names_path)
label_encoder = joblib.load(label_encoder_path)


class PredictionRequest(BaseModel):
    skills: str
    occupation: str

@app.post("/predict/")
def predict(request: PredictionRequest):
    try:
        # Create a dataframe for the new input
        new_data = pd.DataFrame({
            'Career_Influence': ['No'],  # default value
            'Start_Time': ['Immediately'],  # default value
            'Motivations': ['Personal Growth and Development'],  # default value
            'Challenges': ['No'],  # default value
            # 'Skills': [request.skills],
            'Skills':['Technical Skill'],
            # 'Occupation': [request.occupation],
            'Occupation': ['Retail and Sales'],
            
        })

        # OneHotEncode the new input
        new_data_encoded = pd.DataFrame(encoder.transform(new_data), columns=feature_names)

        # Align the columns with the training data
        missing_cols = set(feature_names) - set(new_data_encoded.columns)
        for c in missing_cols:
            new_data_encoded[c] = 0
        new_data_encoded = new_data_encoded[feature_names]

        # Predict the stream using the best KNN model
        stream_code = best_knn_model.predict(new_data_encoded)[0]

        # Decode the stream code to the actual stream name
        stream_name = label_encoder.inverse_transform([stream_code])[0]

        return {"predicted_stream": stream_name}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)