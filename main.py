from selenium import webdriver 
from selenium.webdriver.chrome.options import Options
from notifypy import Notify
from bs4 import BeautifulSoup
from datetime import datetime
from pymongo import MongoClient


# To make the connection with MongoDB

client = MongoClient("mongodb://localhost:27017/")
db = client["amazon"]
collection = db["prices"]


import os

# To display the notifications 
def notify():
    notification = Notify()
    notification.title = "Extracting Data"
    notification.message = "Extracting data from Amazon"
    notification.send()

#To display the Chrome options and extract data from Amazon product pages 
def get_data():
    options = Options()
# Set Chrome to run without a browser window 
    options.add_argument("--headless")
    
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36")
    
#Read the product ASINs from the "products.txt" file
    with open ("products.txt") as f:
        products = f.readlines()
#To initialize the Chrome WebDriver with the given options
    driver = webdriver.Chrome(options=options)

# Loop through each product, load the page, and save the HTML
  
   
    for product in products:
        driver.get(f"https://www.amazon.in/dp/{product}")
    
        
        page_source = driver.page_source

        with open(f"data/{product.strip()}.html", "w", encoding="utf-8") as f:
            f.write(page_source)
# Extract relevant data (price, title, ASIN) from the saved HTML files and store it in MongoDB       
def extract_data():
    files = os.listdir("data")
    for file in files:
        print(file)
        with open(f"data/{file}", encoding="utf-8") as f:
            content = f.read()
  # Parse the HTML content using BeautifulSoup           
        soup = BeautifulSoup(content, 'html.parser') 
        title = soup.find("title")
        if title:
            title = title.getText().split(":")[0]
        else:
            title = "Title not found"
        
        time = datetime.now()
        
  # Extract the price of the product            
        price = soup.find( class_="a-price-whole")
        if price:
            priceInt = price.getText().replace(".", "").replace(",", "")
        else:
            priceInt = "Price not found"
          
  # Extract the ASIN from the product details table           
        table = soup.find(id = "productDetails_detailBullets_sections1")
        if table:
            asin = table.find(class_="prodDetAttrValue")
            if asin:
                asin = asin.getText().strip()
            else:
                asin = "ASIN not found"
                
        else:
            asin = "Table not found"
           
                    
# Store the extracted data in the MongoDB collection         
        collection.insert_one({"priceInt": priceInt, "asin": asin, "title": title, "time": time})
 # Store the extracted data in the MongoDB collection                 
if __name__ == "__main__":
    notify()
    
    get_data()
    extract_data()
    
       