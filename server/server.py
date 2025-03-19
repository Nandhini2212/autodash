from flask import Flask, request, jsonify
from flask_cors import CORS
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
import google.generativeai as genai
from langchain.schema import HumanMessage
import io
from io import StringIO
import sys
import logging
import os
import requests


from langchain.chains import LLMChain, SimpleSequentialChain
from langchain.prompts import PromptTemplate
import pandas as pd
from langchain_groq import ChatGroq
import re
import json
import matplotlib.pyplot as plt
import plotly.express as px



app = Flask(__name__)
CORS(app)  


UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the directory exists
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# def create_llama_index():
#     try:
#         index_dir = "index"
#         os.makedirs(index_dir, exist_ok=True)

#         # Load documents from "uploads" directory
#         documents = SimpleDirectoryReader("uploads").load_data()
#         if not documents:
#             return jsonify({"error": "No documents found in the 'uploads' directory."}), 400

#         # Set Gemini API key manually
#         GEMINI_API_KEY = "AIzaSyAkgq_FkTZU8Hl5jBZyc9vnRAlJ9ms7yaM"  # Replace with actual API key
#         genai.configure(api_key=GEMINI_API_KEY)
#         model = genai.GenerativeModel("gemini-2.0-flash")

#         # Generate LLM response (optional)
#         response = model.generate_content(f"Analyze these documents: {documents}")

#         # Create index using documents
#         index = VectorStoreIndex.from_documents(documents)
        
#         # Persist the index
#         index.storage_context.persist(persist_dir=index_dir)

#         # Verify if indexing was successful
#         if not os.path.exists(index_dir) or not os.listdir(index_dir):
#             return jsonify({"error": "Indexing failed. No files found in the index directory."}), 500

#         return jsonify({
#             "result": "File indexed successfully.",
#             "gemini_response": response.text if response else "No response"
#         }), 200
#     except Exception as e:
#         logging.error(f"Error during indexing: {str(e)}")
#         return jsonify({"error": f"Exception occurred: {str(e)}"}), 500


@app.route('/upload_file', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'uploaded_file.csv')
        file.save(file_path)

    requests.post("http://localhost:5000/generate_dashboard", json={"file_path": file_path})
    return jsonify({'message': 'File uploaded successfully'})
        # return create_llama_index ()

@app.route('/generate_dashboard', methods=['POST'])
def generate_dashboard():
    

    llm = ChatGroq(
        temperature=0,
        groq_api_key='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',
        model_name='deepseek-r1-distill-llama-70b'
    
    )


    base_dir = os.path.dirname(os.path.abspath(__file__))  # Directory of the script
    file_path = os.path.join(base_dir, "uploads", "uploaded_file.csv")

    print("Looking for file at:", file_path)  # Debugging
    df=pd.read_csv(r"C:\Dashboard Assist\server\uploads\uploaded_file.csv")

    column_info_promt="Given the DataFrame:\n{df_head}\n.output a json file for all the columns in the dataframe in the format\ncolumn_name:<the respective column_name from the dataframe>\nDescription:<provide one line description of what the column_name is about\nSample Values:<list of atmost 10 sample values>"
                    
                        
                        
    prompt_1 = PromptTemplate(
        input_variables=["df_head"],
        template=column_info_promt
    )
    chain_1 = LLMChain(llm=llm, prompt=prompt_1)
    summary = chain_1.run(df.head().to_string())
    print("Output of First Chain (DataFrame Summary):\n", summary)

    def extract_json_from_response(response_text):
        match = re.search(r'```json\n(.*?)\n```', response_text, re.DOTALL)
        if match:
            return match.group(1)
        return None

    json_text = extract_json_from_response(summary)
    if json_text:
        json_data = json.loads(json_text)
        with open("columns_metadata.json", "w") as json_file:
            json.dump(json_data, json_file, indent=2)
    else:
        print("No JSON found in the response.")

    # print(json_data)
    recommend_visualizations_prompt= "Recommend at most 7 important useful Visualization Charts for the {json_data} by describing appropriate aggreagations using the column names and sample values provided in  data and use appropriate column names only from the json_data. Try Using linechart,bar chart,sunburst,stacked bar chart,horizontal bar chart,pie chart, donut chart .Choose aggregations and appropriate chart types based on the sample values for each column_name. Finally recommend the charts in a json file as Chart_Type:<name and description of the chart>, columns_to_use :<provide the exact column_name from the provided data that will be used to generate the respective chart>, aggregation(optional): <what kind of aggregation should be performed on which column(s) for the respective chart>, goal: <provide what kind of analysis is actually achieved at the end>"

    prompt_2 = PromptTemplate(
        input_variables=["json_data"],
        template= recommend_visualizations_prompt
    )

    chain_2 = LLMChain(llm=llm, prompt=prompt_2)
    visualizations = chain_2.run({"json_data": json_data})
    print(visualizations)

    json_text2 = extract_json_from_response(visualizations)
    if json_text2:
        json_data2 = json.loads(json_text2)
        with open("visualization_metadata.json", "w") as json_file2:
            json.dump(json_data2, json_file2, indent=2)
    else:
        print("No JSON found in the response.")




    prompt_3 = PromptTemplate(
        input_variables=["visualizations"],
        template="Provide a simple plotly code for the recommended charts based on the {visualizations}. Use a try except method for each figure and provide valid aggreations based on it. Do not use any other column names that is not present in the Column names provided in the recommended visualizations and ensure if the code is right and is in right syntax else update it. check out the URL : https://plotly.com/python/ for usage of valid functions in plotly.DO NOT read dataframe and DO NOT create a dataframe as df/dataframe already exist. store the figures in a json format figures[<title of the chart>] = fig<num>.to_json() . Do not use any subplots. Do proper grouping / aggregation only when required based on the column_name and the value it contains"
    )
    chain_3 = LLMChain(llm=llm, prompt=prompt_3)
    response_text = chain_3.run({"visualizations": json_data2})
    print(response_text)

    prompt_4 = PromptTemplate(
        input_variables=["response_text"],
        template = "Ensure the code follows correct syntax and is valid in the {response_text}, if not modify the code to a correct syntax else provide the same exact code from the text"
    )
    chain_4 = LLMChain(llm=llm, prompt=prompt_4)
    response_valid_code = chain_4.run({response_text})
    print(response_valid_code)

    def extract_code(response_text):
        match = re.search(r'```python\n(.*?)\n```', response_text, re.DOTALL)
        if match:
            return match.group(1)
        return None
    code1=extract_code(response_valid_code)
    print(code1)
    exec_globals = {"df": df, "figures": {}}  # Pass df into the execution scope
    exec(code1, exec_globals)  # Execute code1 with explicit scope

    figures = exec_globals.get("figures", {})  # Retrieve figures

    # Save JSON file
    with open("plotly_charts2.json", "w") as f:
        json.dump(figures, f)

    print("JSON file saved successfullys.")
    return jsonify({'message': 'File uploaded successfully'})

JSON_FILE = "plotly_charts2.json"

@app.route('/get_charts', methods=['GET'])
def get_charts():
    if os.path.exists(JSON_FILE):
        with open(JSON_FILE, "r") as f:
            chart_data = f.read()
        return jsonify(json.loads(chart_data))  # Return as JSON
    else:
        return jsonify({'error': 'No chart data found'}), 404
    


@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    question = data.get("question")

    df = pd.read_csv(r"C:\Dashboard Assist\server\uploads\uploaded_file.csv")
    with open(r"C:\Dashboard Assist\server\columns_metadata.json") as f:
        summary = json.load(f)

    if not question:
        return jsonify({"error": "No question provided"}), 400

    # Function to extract Python code from LLM response
    def extract_code(response_text):
        match = re.search(r"```python\n(.*?)\n```", response_text, re.DOTALL)
        return match.group(1) if match else None

    # Initialize LLM
    chat_groq_llm = ChatGroq(model_name="mixtral-8x7b-32768", groq_api_key="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")

    # Generate Pandas code from LLM
    response = chat_groq_llm.invoke([
        HumanMessage(
            content=f"Here is a description of the data:\n{summary}\n\n and here is the {question}.Now generate a pandas code on the dataframe.DO NOT create any variable to read the dataframe as the dataframe already exists, just ouptut the python code in the format of ```python<code>``` and also include the final print statement inside the code itself and one valid working method/code is enough and while writing the code use the word 'df' for dataframe")])

    pandas_code = extract_code(response.content)
    print(pandas_code)
    output_buffer = io.StringIO()
    sys.stdout = output_buffer

    exec_globals = {"df": df}
    exec(pandas_code, exec_globals)  # Execute the generated Pandas code
    sys.stdout = sys.__stdout__  # Restore stdout
    printed_output = output_buffer.getvalue().strip()
    
    # Generate summary
    summary_response = chat_groq_llm .invoke([
        HumanMessage(
            content=f"You are an Information Finder. Find meaningful insights and summarize them for the following output in 3-4 lines:\n{printed_output}. Start as {question} and say what you think the answer is. Do not mention that you are given/provided a dataset anywhere in the response."
        )
    ])
    
    summary_text = summary_response.content if summary_response else "Could not generate a summary."
    
    return jsonify({"summary": summary_text})
    
# @app.route("/get_ai_insights", methods=["POST"])
# def get_ai_insights():
#     data = request.json
#     chart_json = data.get("chart")

#     # Generate AI insights
#     groq_api_key = "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"  # Replace with your actual API key
#     llm = ChatGroq(api_key=groq_api_key, model="mixtral-8x7b-32768")
#     ai_response = llm.invoke(f"Describe the insights from this plot: {chart_json}")
    
#     return jsonify({"insights": ai_response})



@app.route('/statistics', methods=['GET'])
def get_statistics():
    try:
        df = pd.read_csv(r"C:\Dashboard Assist\server\uploads\uploaded_file.csv")
        numerical_columns = df.select_dtypes(include=['number']).columns.tolist()

        if not numerical_columns:
            return jsonify({"error": "No numerical columns found"}), 400

        column = request.args.get('column', numerical_columns[0])  # Default to the first numerical column

        if column not in df.columns:
            return jsonify({"error": "Column not found"}), 400

        data = df[column]
        stats = {
            "columns": numerical_columns,  # Send numerical columns for the frontend dropdown
            "selected_column": column,
            "mean": round(data.mean(), 2),
            "median": round(data.median(), 2),
            "mode": data.mode().tolist()
        }

        return jsonify(stats)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/get_columns', methods=['GET'])
def get_columns():
    df = pd.read_csv(r"C:\Dashboard Assist\server\uploads\uploaded_file.csv")
    
    categorical_cols = df.select_dtypes(include=['object']).columns.tolist()
    numerical_cols = df.select_dtypes(include=['number']).columns.tolist()

    return jsonify({
        "categorical": categorical_cols,
        "numerical": numerical_cols
    })


@app.route('/aggregate', methods=['GET'])
def aggregate():
    df = pd.read_csv(r"C:\Dashboard Assist\server\uploads\uploaded_file.csv")

    categorical_col = request.args.get('categorical_col')
    numerical_col = request.args.get('numerical_col')
    operation = request.args.get('operation')

    if not all([categorical_col, numerical_col, operation]):
        return jsonify({"error": "Missing parameters"}), 400

    if categorical_col not in df.columns or numerical_col not in df.columns:
        return jsonify({"error": "Invalid columns"}), 400

    if operation == 'sum':
        result = df.groupby(categorical_col)[numerical_col].sum().to_dict()
    elif operation == 'average':
        result = df.groupby(categorical_col)[numerical_col].mean().round(2).to_dict()
    elif operation == 'count':
        result = df.groupby(categorical_col)[numerical_col].count().to_dict()
    else:
        return jsonify({"error": "Invalid operation"}), 400

    return jsonify(result)



if __name__ == '__main__':
    app.run(debug=True)
