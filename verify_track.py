import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 720})

        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))

        print("Connecting to http://localhost:5173...")
        try:
            await page.goto("http://localhost:5173", wait_until="networkidle")
        except Exception as e:
            print(f"Initial load failed: {e}")
            return

        await asyncio.sleep(5)

        await page.screenshot(path="main_menu.png")
        print("Saved main_menu.png")

        # Press Enter
        await page.keyboard.press("Enter")
        await asyncio.sleep(5)

        await page.screenshot(path="gameplay.png")
        print("Saved gameplay.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
