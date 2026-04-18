export interface ScreenshotOptions {
  url: string;
  outPath: string;
  viewport: { width: number; height: number };
}

export async function captureScreenshot(opts: ScreenshotOptions): Promise<void> {
  const pw = await import("playwright");
  const browser = await pw.chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: opts.viewport });
    const page = await ctx.newPage();
    await page.goto(opts.url, { waitUntil: "networkidle" });
    await page.screenshot({ path: opts.outPath, fullPage: true });
  } finally {
    await browser.close();
  }
}
