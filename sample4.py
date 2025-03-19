from langchain_groq import ChatGroq
from langchain.schema import HumanMessage
import pandas as pd
import re
import json
import io
import sys
# Load CSV
df=pd.read_csv(r"C:\Dashboard Assist\server\uploads\uploaded_file.csv")

with open(r'C:\Dashboard Assist\server\columns_metadata.json') as f:
  summary = json.load(f)


# Convert the DataFrame summary into text
print(summary)
# print(summary)
# Define the question
question = "The average price of car brand over the"

# Set up Groq LLM
groq_llm = ChatGroq(model_name="mixtral-8x7b-32768", groq_api_key="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")

# Invoke LLM with a message
response = groq_llm.invoke([HumanMessage(content=f"Here is a description of the data:\n{summary}\n\n and here is the {question}.Now generate a pandas code on the dataframe.DO NOT create any variable to read the dataframe as the dataframe already exists, just ouptut the python code in the format of ```python<code>``` and also include the final print statement inside the code itself and one valid working method/code is enough and while writing the code use the word 'df' for dataframe")])
def extract_code(response_text):
        match = re.search(r'```python\n(.*?)\n```', response_text, re.DOTALL)
        if match:
            return match.group(1)
        return None
print(response.content)
pandas_code=extract_code(response.content)
print(pandas_code)
pandas_code = extract_code(response.content)


# Capture the printed output
output_buffer = io.StringIO()
sys.stdout = output_buffer  # Redirect stdout to capture print output

exec_globals = {"df": df}

exec(pandas_code, exec_globals)  # Execute the Pandas code
sys.stdout = sys.__stdout__  # Restore original stdout

printed_output = output_buffer.getvalue().strip()  # Get the printed output


# Ask LLM to summarize the output
summary_response = groq_llm.invoke([
    HumanMessage(
        content=f"You are a Information Finder. find meaning insights and summarize it for the following output in 3-4 lines:\n{printed_output}. start as {question} and say what you think the answer is.do not mention that you are given/provided a dataset anywhere in the response."
    )
])

summary_text = summary_response.content if summary_response else "Could not generate a summary."

print(summary_text)
# Print the response
# print(response.content)
