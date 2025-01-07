from selenium import webdriver
from selenium.webdriver.common.by import By
from time import sleep
import base64
from pathlib import Path
import re

options = webdriver.ChromeOptions()

def scrape_images(keyword, total_images, batch_size, headless=True):
    if headless:
        options.add_argument("--headless")

    formatted_keyword = keyword.replace(" ", "+")
    folder_name = keyword.replace(" ", "-")
    output_folder = Path(f"{folder_name}")
    output_folder.mkdir(parents=True, exist_ok=True)

    result_count = 0
    batch_count = 0
    not_counted = 0

    driver = webdriver.Chrome(options=options)
    driver.get(f"https://www.google.com/search?tbm=isch&q={formatted_keyword}+images")
    sleep(2)

    not_data = 0
    gif = 0
    last_height = driver.execute_script("return document.body.scrollHeight")
    current_images = set()

    while result_count < total_images:
        current_batch = 0
        while current_batch < batch_size and result_count < total_images:
            # Scroll down and wait for images to load
            driver.execute_script("window.scrollBy(0, 300);")
            sleep(2)

            img_tags = driver.find_elements(By.CSS_SELECTOR, "g-img.mNsIhb > img")

            for img_tag in img_tags:
                try:
                    src = img_tag.get_attribute("src")
                    if not src or not src.startswith("data:image/"):
                        not_data += 1
                        not_counted += 1
                        continue

                    base64_binary = src.split("base64,")[-1]
                    mime_type = src.split(";")[0].split(":")[1]
                    file_extension = mime_type.split("/")[-1]
                    if file_extension == "gif":
                        gif += 1
                        not_counted += 1
                        continue

                    filename = f"image_{result_count}.{file_extension}"

                    if src in current_images:
                        continue

                    current_images.add(src)

                    image_binary = base64.b64decode(base64_binary)
                    output_path = output_folder.joinpath(filename)

                    with open(output_path, "wb") as file:
                        file.write(image_binary)
                    result_count += 1
                    current_batch += 1
                    print(f"Saved: {filename}")

                except Exception as e:
                    print(f"Error saving image: {e}. Moving to next image.")
                    continue

            # Ensure batch limit is respected by breaking after batch is completed
            if current_batch >= batch_size:
                print(f"Batch {batch_count + 1} completed.")
                batch_count += 1
                break
            
        # Scroll to load more images after each batch
        # if result_count < total_images:
        #     driver.execute_script("window.scrollBy(0, 20000);")
        #     sleep(5)

        #     # Check if the page height has increased (indicating new images loaded)
        #     new_height = driver.execute_script("return document.body.scrollHeight")
        #     if new_height == last_height:
        #         print("No more images to load.")
        #         break  # Exit if no new images are loaded
        #     last_height = new_height
        break
    print(f'Not source: {not_data}')
    print(f'Gif: {gif}')
    print(f"Scraping complete. Total {result_count} images saved.")
    print(f"Not counted: {not_counted}")
    driver.quit()

if __name__ == "__main__":

    classes = ['cat', 'chair', 'wok', 'candle', 'soda bottle', 'gazelle', 'cock', 'kite', 'dinosaur', 'basketball', 'canoe', 'wallclock', 'washer', 'washing machine', 'violin', 'comic book', 'crossword puzzle', 'monkey', 'elephant', 'gorilla', 'bus']

    for cls in classes:
        scrape_images(cls, total_images=30, batch_size=3)
        print(f"Done with class: {cls}")
