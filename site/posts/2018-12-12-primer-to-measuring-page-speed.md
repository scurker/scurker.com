---
title: "Primer to Measuring Page Speed"
date: 2018-12-12
draft: true
---

That are many different things that contribute to the speed of a page load. The amount of javascript that is being loading, the code that is being run in javascript, or even how assets are being loaded. Understanding the things that impact a page load can be overwhelming, but making small improvements can make a gradual impact towards making pages load faster.

But how do you know if your site is slow or fast?

https://twitter.com/scurker/status/1057719401292673024

Measuring is a key component of helping to make sites faster. Without having some baseline measurements to compare changes against, or knowing what performance targets you want to hit - it's very difficult to actually know if the changes being made are having a positive effect.

## Key Terms

In order to first measure something, one must understand the different terms of measurement. A page load isn't made up of a single specific metric as there are different aspects of loading that happen over a span of time. Understanding these measurements help point out specific areas to profile and improve.

However, what we particularly care about are the measurements that are directly related to how a user _perceives_ how fast a given page is.

### Time to First Byte (TTFB)

<abbr title="Time to first byte">TTFB</abbr> is a key metric for measuring server performance. This metric measures the time from the initial client request, to when the client receives its first byte. It's important to note the user will never see content during this phase.

### First Contentful Paint (FCP)

After the initial request starts to return content, <abbr title="First contentful paint">FCP</abbr> helps to measure when the user first sees some <em>meaningful</em> content, such as text or images. This is the first indication to the user that something is happening.

### First Meaningful Paint (FMP)

<abbr title="First meaningful paint">FMP</abbr> this is the first paint activity that is actually meaningful and contains content that is useful to the user. There's no standard definition of when this happens, as the content that is meaningful to the user can very from page to page. In order to track <abbr title="First meaningful paint">FMP</abbr>, you will need to place specific user timings to track what you would consider to be the first meaningful paint to be, such as above the fold content or specific hero elements.

### Time to Interactive (TTI)

<abbr title="Time to interactive">TTI</abbr> happens after the first bit of content renders, and when the page responds to user interactions within 50ms. Long gaps between <abbr title="First contentful paint">FCP</abbr> or <abbr title="First meaningful paint">FMP</abbr> and <abbr title="Time to interactive">TTI</abbr> can lead to a bit of an "uncanny valley" experience for users, since a page may appear to be ready but user interactions are slow or unresponsive.

### DOM Content Loaded

`DOMContentLoaded` is an event when the DOM is ready and there are no more stylesheets blocking javascript execution. This may not be a significant metric for users since it may not actually mirror the experience of when it appears to a user that a page is loaded.

### Load

Finally, the `load` event that happens after everything on a page has completely loaded. However, a user may be able to interact and view meaningful content well before this event occurs.

Here's a simplified visualization of what these events might look like on a timeline:

<img src="/assets/images/posts/timeline-performance-metrics.svg" alt="timeline performance metrics" width="800" />

Of these events, the ones we care about are the ones that help answer how a user might perceive the given speed of a page:

* *Is something happening?* - First Contentful Paint (<abbr title="First contentful paint">FCP</abbr>)
* *Is it useful?* - First Meaningful Paint (<abbr title="First meaningful paint">FMP</abbr>)
* *Can it be used?* - Time to Interactive (<abbr title="Time to interactive">TTI</abbr>)

Now that we know a little bit more about some of the different page speed metrics, let's take a look at some sample of tools that help to profile and provide insights into your page speed.

## Lighthouse

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) is built into Google Chrome's developer tools along with being available as a [CLI or via a node module](https://github.com/GoogleChrome/lighthouse). Lighthouse is a great place to start to capture a quick overview of common performance metrics as well as scoring a lot of other useful things.

![scurker.com lighthouse audit results](/assets/images/posts/lighthouse-audit-results.png)

Using Lighthouse directly from Chrome's devtools is the easiest way to get started, and provides the 3 key metrics we're looking for: <abbr title="First contentful paint">FCP</abbr>, <abbr title="First meaningful paint">FMP</abbr>, and <abbr title="Time to interactive">TTI</abbr>. From the report, you can view tips and suggestions on things to improve to help make your page faster along with viewing the trace to dig into the details.

Since you are likely running Lighthouse locally, the results can vary from what real users may experience. Results can be skewed by other Chrome extensions, background programs, or even network behavior. For the cleanest results it's recommended to run Lighthouse in either an incognito window or in a separate Chrome profile without any Chrome extensions enabled.

As previously mentioned, Lighthouse is a great place to start - but may not accurate reflect what your real-world users are experiencing. Which brings us to our next tool...

## Webpagetest.org

[Webpagetest.org](https://www.webpagetest.org/) is a great tool for measuring speed from real world locations with real user connection speeds on a variety of different browsers and devices.

![web page test site](/assets/images/posts/web-page-test.png)

Since WebPageTest runs on real devices there's a limited pool available so test times may vary depending on the number of people running tests.

Given the variety of options, it's easy to configure the different options to get a ballpark metric of what real world users are seeing:

* Connection Speed
* Number of Tests to Run (more tests will provide an average of the results and be less susceptible to abnormal spikes)
* Repeat or First View (comparing between initial (uncached) or repeat (cached) times)
* Capture video (provide a film strip of the page load over time)

![web page test scurker.com results](/assets/images/posts/web-page-test-results.png)

The output from WebPageTest provides a cornucopia of results and metrics, along with a resource of other items to review. The 2 of the 3 key metrics are provided as well, Start Render (<abbr title="First contentful paint">FCP</abbr>) and First Interactive (<abbr title="Time to interactive">TTI</abbr>). In the results you can review your page's waterfall, which mirrors what you would see in Chrome's dev tools.

For more advanced metrics (such as <abbr title="First meaningful paint">FMP</abbr>) there is a [custom metrics option](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/scripting) that allows you to run arbitrary javascript at the end of a test to collect custom metrics. From here you could retrieve a specific [user timing](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) to be returned to the WebPageTest front-end.

There are limitations to the public version of WebPageTest, as you are sharing instances with other users but there is a [self hosting option](https://github.com/WPO-Foundation/webpagetest-docs/blob/master/user/Private%20Instances/README.md) if you need more custimization or reliability.

## Puppeteer

[Puppeteer](https://github.com/GoogleChrome/puppeteer) is a node library that provides a high-level API to control Chrome/Chromium and allows for the ultimate flexibility in capturing page speed metrics. While Puppeteer may not be as simple to use as the previous tools, it does offer an extended ability to track additional custom metrics.

### Getting Started with Puppeteer

To get started with Puppeteer, you either need to have it installed globally (`npm install -g puppeteer`) or locally inside of a project (`npm install puppeteer`).

With Puppeteer you have access to the [`browser`](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-browser) to control the Chrome instance, and [`page`](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#class-page) allowing you to control various page aspects such as the viewport size, or navigation. Additionally creating a CDPSession is used to access the [Chrome Devtools Protocol](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#targetcreatecdpsession) for things that are not natively available through the Puppeteer api.

> These examples are heavily dependant upon [`async`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) and [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) so for native Node support, you will need to be using Node 8 or greater.

```javascript
const puppeteer = require('puppeteer');

(async function() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const client = await page.target().createCDPSession();

  // capture results
})();
```

### Navigating to a Page

```javascript
await page.goto('https://example.com');
```

<span class="demo-link">
  <a href="https://github.com/scurker/page-speed-metrics-with-puppeteer/blob/master/examples/navigate-to-page.js">view navigating to a page example</a>
</span>

The above step works for pages where no authentication or user interaction is required. For more complex steps, Puppeteer allows for complete control of the page to perform any interactions that typically require a user.

```javascript
await page.goto('https://example.com');
await page.type('#username', 'username');
await page.type('#password', 'password');
await page.$eval('#login', form => form.submit());
await page.waitForNavigation();
```

<span class="demo-link">
  <a href="https://github.com/scurker/page-speed-metrics-with-puppeteer/blob/master/examples/navigate-to-page-with-login.js">view authentication example</a>
</span>

### Simulating Network Speed

For more "real world" page speed metrics, we need to simulate slower network conditions. Puppeteer can emulate these conditions using the [Chrome Devtools Protocol](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#targetcreatecdpsession) and [`Network.emulateNetworkConditions`](https://chromedevtools.github.io/devtools-protocol/tot/Network#method-emulateNetworkConditions). `Network.emulateNetworkConditions` expects throughput in bits vs bytes, so you will need to divide any byte value by `8` for accurate results.

```javascript
// Simulate 3G Conditions
await client.send('Network.emulateNetworkConditions', {
  offline: false,
  downloadThroughput: 1.6 * 1024 * 1024 / 8, // 1.6 mb/s
  uploadThroughput: 768 * 1024 / 8, // 400 kb/s
  latency: 300 // 300ms
});
```

<span class="demo-link">
  <a href="https://github.com/scurker/page-speed-metrics-with-puppeteer/blob/master/examples/simulate-network-speed.js">view simulate network speed example</a>
</span>

### Tracking Cached vs First View

For measuring a first view request, there's two things that need to happen: prevent requests from being fetched from the cache and preventing requests from being fetched via a service worker (if available). There's no direct access ([yet](https://github.com/GoogleChrome/puppeteer/issues/2634)) to shutting down a service worker, but service workers can be [unregistered](https://chromedevtools.github.io/devtools-protocol/tot/ServiceWorker#method-unregister) using the Chrome Devtools Protocol. Service workers need to be unregistered *per page request*, so the protocol will need to be called for each iteration.

Whether you want cached or first view speed metrics is dependant on the type of your application and how your users use it. For applications with heavy repeat usage, it's likely knowing cached times will be a better measurement of real world usage.

```javascript
const metrics = []; // array for collecting metrics per iteration
const runs = 10;
const useCache = false;
const useServiceWorker = false;

await page.setCacheEnabled(useCache);

async function disableServiceWorker(disable) {
  if(disable) {
    await client.send('ServiceWorker.enable');
    await client.send('ServiceWorker.unregister', {
      scopeURL: new URL(page.url()).origin
    });
  }
}

for(let i = 0; i < runs; i++) {
  await disableServiceWorker(!useServiceWorker);

  // capture metrics per iteration
}
```

<div class="demo-link">
  <a href="https://github.com/scurker/page-speed-metrics-with-puppeteer/blob/master/examples/disable-caching.js">view disable cache example</a>
</div>

<div class="demo-link">
  <a href="https://github.com/scurker/page-speed-metrics-with-puppeteer/blob/master/examples/disable-service-worker.js">view disable service worker example</a>
</div>

### Tracking Page Metrics

Page speed metrics need to be captured over multiple iterations to minimize any natural variations that might occur. We can collect these metrics using the [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance). This allows us to collect the native measurements we're interesting in, such as navigation and paint as well as custom measurements.

To track custom measurements, you will need to create measurements with [`Performance.mark()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark) or [`Performance.measure()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark).

#### Tracking First Meaningful Paint

Since there is no standardized measurement for <abbr title="First meaningful paint">FMP</abbr>, you will need to manually include a performance mark to indicate where the first meaningful paint should happen.

```
<div class="hero">
  ...
</div>
<script>
performance.mark('first-meaningful-paint');
</script>
```

#### Tracking Time to Interactive

While puppeteer doesn't provide <abbr title="Time to interactive">TTI</abbr>, there are other things that you can track that can still provide some indication of interactiveness. If you're using a javascript library such as React or Vue, you could use lifecycle hooks inside of an important component to indicate that things are ready.

> React Example

```javascript
class ImportantComponent extends React.Component {
  componentDidMount() {
    performance.mark('important component mounted');
  }
}
```

> Vue Example

```javascript
export default {
  mounted() {
    this.$nextTick(() => performance.mark('important component mounted'));
  }
}
```

Since these measurements will largely be app specific, there's no standard way to set where these measurements should be placed.

With puppeteer, we can use [`page.evaluate()`](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pageevaluatepagefunction-args) to run a function inside the context of the page. This can be used to access the performance api and return the results to our script.

In addition, for each iteration we likely want to wait some time between requests to not introduce significant load to the server. Using `page.waitFor()` between iterations will allow for some time to ease the load.

```javascript
for(let i = 0; i < runs; i++) {
  await disableServiceWorker(!useServiceWorker);

  // Allow time between requests
  await page.waitFor(500);

  await page.reload({ waitUntil: 'networkIdle0' });

  let navigationMetrics = JSON.parse(
    await page.evaluate(() =>
      JSON.stringify(performance.getEntriesByType('navigation'))
    )
  );

  let firstContentfulPaint = JSON.parse(
    await page.evaluate(() =>
      JSON.stringify(performance.getEntriesByName('first-contentful-paint'))
    )
  );

  let firstMeaningfulPaint = JSON.parse(
    await page.evaluate(() =>
      JSON.stringify(performance.getEntriesByName('first-meaningful-paint'))
    )
  );

  // any other additional custom metrics can be included and tracked

  metrics.push({
    responseEnd: navigationMetrics[0].responseEnd,
    loaded: navigationMetrics[0].domContentLoadedEventEnd,
    complete: navigationMetrics[0].domComplete,
    firstContentfulPaint: firstContentfulPaint[0].startTime,
    firstMeaningfulPaint: firstMeaningfulPaint[0].startTime
  });
}

// Do something with the results

await browser.close();
```

<span class="demo-link">
  <a href="https://github.com/scurker/page-speed-metrics-with-puppeteer/blob/master/examples/everything.js">view full puppeteer example</a>
</span>

Once you've collected all of the metric results that your heart desires, be sure to call `browser.close()` to ensure you don't keep your Puppeteer instance running.

### Analyzing Puppeteer's Results

There's a number of things you could do to analyze the results from Puppeteer:

* Toggle service worker on/off to see impact on repeat requests
* Add additional custom metrics to see more granular results
* Test against multiple network profiles

Since you have near complete control over Chrome using puppeteer's api, there's few limitations in what speed metrics you can track provided you have placed useful marks in places that matter.

## Measure, Measure, Measure (and measure again)

Knowing how fast or slow your site is important, and it's impossible to know without continually measuring and monitoring changes. For users that use your site every day, they feel pain when things don't appear to be responsive. The tools listed above are by no means an exhaustive list, but are just a starting point to begin having a better understanding of the different metrics that affect your users. From this, hopefully you will feel more empowered to start tracking and measuring leading to a better experience for all of your users.
