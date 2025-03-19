import json
import plotly.io as pio
from langchain_groq import ChatGroq

# Load the JSON file
with open(r"C:\Dashboard Assist\server\plotly_charts2.json") as f:
    raw_json = json.load(f)

# Set up ChatGroq API
groq_api_key = "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"  # Replace with your actual API key
llm = ChatGroq(api_key=groq_api_key, model="mixtral-8x7b-32768")

# Dictionary to store AI insights
insights = {}

# Process all figures in the JSON
for title, fig_string in raw_json.items():
    # Convert stringified JSON into a dictionary
    plotly_data = json.loads(fig_string)

    # Fix structure: rename title to "layout" and use "data"
    # fixed_json = {
    #     "data": plotly_data["data"],
    #     "layout": {"title": title}
    # }

    # # Convert into a Plotly figure
    # fig = pio.from_json(json.dumps(fixed_json))
    
    # # Display the figure
    # fig.show()

    # Generate AI insights using ChatGroq
    description = llm.invoke(f"Describe the insights from this plot: {plotly_data}")
    
    # Store insights
    insights[title] = description

# Print all AI insights
for title, insight in insights.items():
    print(f"\n🔍 Insights for: {title}\n{insight}")
