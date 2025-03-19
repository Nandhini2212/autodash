
import plotly.express as px
import pandas as pd

# # Assuming df is already loaded and contains the data

# figures = {}
df=pd.read_csv(r"C:\Dashboard Assist\server\uploads\uploaded_file.csv")
# # 1. Bar Chart: Brand Distribution
# try:
#     brand_counts = df.groupby('Brand')['Brand'].count().reset_index()
#     fig1 = px.bar(brand_counts, x='Brand', y='Brand', title='Brand Distribution')
#     figures['Brand Distribution'] = fig1.to_json()
# except Exception as e:
#     print(f"Error in Brand Distribution chart: {e}")

# # 2. Pie Chart: Fuel Type Distribution
# try:
#     fuel_counts = df.groupby('Fuel_Type')['Fuel_Type'].count().reset_index()
#     fig2 = px.pie(fuel_counts, names='Fuel_Type', title='Fuel Type Distribution')
#     figures['Fuel Type Distribution'] = fig2.to_json()
# except Exception as e:
#     print(f"Error in Fuel Type Distribution chart: {e}")

# # 3. Stacked Bar Chart: Transmission Type by Brand
# try:
#     transmission_counts = df.groupby(['Brand', 'Transmission']).size().reset_index()
#     fig3 = px.bar(transmission_counts, x='Brand', y='size', color='Transmission',
#                   title='Transmission Type by Brand')
#     figures['Transmission Type by Brand'] = fig3.to_json()
# except Exception as e:
#     print(f"Error in Transmission Type by Brand chart: {e}")

# # 4. Line Chart: Average Mileage by Year
# try:
#     avg_mileage = df.groupby('Year')['Mileage'].mean().reset_index()
#     fig4 = px.line(avg_mileage, x='Year', y='Mileage',
#                    title='Average Mileage by Year')
#     figures['Average Mileage by Year'] = fig4.to_json()
# except Exception as e:
#     print(f"Error in Average Mileage by Year chart: {e}")

# # 5. Sunburst Chart: Vehicle Attributes by Brand
# try:
#     fig5 = px.sunburst(df, path=['Brand', 'Model'],
#                        title='Vehicle Attributes by Brand')
#     figures['Vehicle Attributes by Brand'] = fig5.to_json()
# except Exception as e:
#     print(f"Error in Vehicle Attributes by Brand chart: {e}")

# # 6. Horizontal Bar Chart: Average Price by Model
# try:
#     avg_price = df.groupby('Model')['Price'].mean().reset_index()
#     fig6 = px.bar(avg_price, x='Price', y='Model',
#                  title='Average Price by Model',
#                  orientation='h')
#     figures['Average Price by Model'] = fig6.to_json()
# except Exception as e:
#     print(f"Error in Average Price by Model chart: {e}")

# # Print the figures dictionary
# # print(figures)

# import json

# # Save figures JSON to file
# with open("plotly_charts2.json", "w") as f:
#     json.dump(figures, f)
# print("JSON file saved successfully.")
# Assuming df is the DataFrame containing the data

import plotly.express as px
import plotly.graph_objects as go
import pandas as pd

# Bar Chart: Average Price by Brand
fig1 = px.bar(df.groupby("Brand", as_index=False)["Price"].mean(), x="Brand", y="Price", 
              title="Average Price by Brand")
fig1.show()

# Horizontal Bar Chart: Average Mileage by Model
fig2 = px.bar(df.groupby("Model", as_index=False)["Mileage"].mean(), x="Mileage", y="Model", 
              title="Average Mileage by Model", orientation='h')
fig2.show()

# Line Chart: Average Price by Year
fig3 = px.line(df.groupby("Year", as_index=False)["Price"].mean(), x="Year", y="Price", 
               title="Average Price by Year")
fig3.show()

# Donut Chart: Fuel Type Distribution
fuel_counts = df["Fuel_Type"].value_counts().reset_index()
fig4 = px.pie(fuel_counts, names="index", values="Fuel_Type", hole=0.4, 
              title="Fuel Type Distribution")
fig4.show()

# Stacked Bar Chart: Transmission Type Distribution by Brand
transmission_counts = df.groupby(["Brand", "Transmission"]).size().reset_index(name="count")
fig5 = px.bar(transmission_counts, x="Brand", y="count", color="Transmission", 
              title="Transmission Type Distribution by Brand", barmode="stack")
fig5.show()

# Sunburst Chart: Brand and Model with Average Price
avg_price = df.groupby(["Brand", "Model"], as_index=False)["Price"].mean()
fig6 = px.sunburst(avg_price, path=["Brand", "Model"], values="Price", 
                   title="Brand and Model with Average Price")
fig6.show()

# Bar Chart: Average Engine Size by Brand
fig7 = px.bar(df.groupby("Brand", as_index=False)["Engine_Size"].mean(), x="Brand", y="Engine_Size", 
              title="Average Engine Size by Brand")
fig7.show()

