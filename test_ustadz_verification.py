from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Go directly to /ustadz page with biips_user set in localStorage
    page.goto("http://localhost:3002/")
    page.evaluate("""() => {
        localStorage.setItem('biips_user', JSON.stringify({
            username: 'ratih',
            role: 'guru',
            kelas: '1'
        }));
    }""")
    page.goto("http://localhost:3002/ustadz")
    page.wait_for_timeout(3000)

    # Take screenshot of ustadz dashboard showing class 1 restricted & delete button
    page.screenshot(path="/home/jules/verification/ustadz_ratih_class1.png")
    print("Screenshot saved to /home/jules/verification/ustadz_ratih_class1.png")

    browser.close()
