from selenium import webdriver
from selenium.webdriver.common.by import By
from time import sleep
import base64
from pathlib import Path

options = webdriver.ChromeOptions()

def scrape_images(keyword, batch_size, headless=True):
    if headless:
        options.add_argument("--headless")

    formatted_keyword = keyword.replace(" ", "+")
    folder_name = keyword.replace(" ", "-")
    output_folder = Path(f"{folder_name}")
    output_folder.mkdir(parents=True, exist_ok=True)

    result_count = 0

    driver = webdriver.Chrome(options=options)
    driver.get(f"https://www.google.com/search?q={formatted_keyword}")
    sleep(1)

    list_items = driver.find_elements(By.CSS_SELECTOR, "div[role='listitem']")
    list_items[1].click()

    while result_count < batch_size:
        driver.execute_script("window.scrollBy(0, 300);")
        sleep(1)

        img_tags = driver.find_elements(By.CSS_SELECTOR, "g-img > img")
        for img_tag in img_tags:
            try:
                src = img_tag.get_attribute("src")
                if not src or not src.startswith("data:image/"):
                    continue

                base64_binary = src.split("base64,")[-1]
                mime_type = src.split(";")[0].split(":")[1]
                file_extension = mime_type.split("/")[-1]
                if file_extension == "gif":
                    continue

                alt_text = img_tag.get_attribute("alt") or "image"
                filename = f"{alt_text}-{result_count}.{file_extension}"

                image_binary = base64.b64decode(base64_binary)
                output_path = output_folder.joinpath(filename)

                with open(output_path, "wb") as file:
                    file.write(image_binary)
                result_count += 1
                print(f"Saved: {filename}")

            except Exception as e:
                print(f"Error saving image: {e}. Moving to next image.")
                continue

    driver.quit()

if __name__ == "__main__":
    scrape_images("cat", 3)
