// node.js server used to serve assets bundled by Webpack
// use `npm start` command to launch the server.
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

const port = 8080;
const path = require('path');
const fs = require('fs-extra');

const options = {
  publicPath: config.output.publicPath,
  hot: true,
  inline: true,
  stats: { colors: true }
};

let server

const serverStart = () => new Promise((res, rej) => {
  server = new WebpackDevServer(webpack(config), options);
  console.log('Starting the dev web server...');
  server.listen(port, 'localhost', function (err) {
    if (err) {
      console.error(err);
      return rej(err)
    }
    console.log('WebpackDevServer listening at localhost:', port);
    res()
  });
})

const serverStop = () => new Promise((res, rej) => {
  server.close(function (err) {
    if (err) {
      console.error(err);
      return rej(err)
    }
    console.log('WebpackDevServer stopped:');
    res()
  });
})

const puppeteer = require('puppeteer');

const arg = (arg) => process.argv.indexOf(arg) !== -1

if (!arg("test")) {
  (async () => {
    if (!arg("noserver"))
      await serverStart()
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.on('load', () => {
      console.log(`page navigated`)
    })
    
    let routes = await fs.readdir(path.resolve(__dirname, 'src/layouts'))
    routes = routes.map(name => path.parse(name).name)
    
    for (const route of routes) {
      let url = `http://localhost:${port}/#/${route}?nav=false`
      console.log(`Processing route: ${url}`)
      await page.goto(url, {
        waitLoad: true,
        waitNetworkIdle: true // defaults to false
      });
      //await page.waitForNavigation({ waitUntil: 'networkidle' })
      await page.screenshot({path: `pdf/${route}.png`, fullPage: true});
      //await page.emulateMedia('screen');
      await page.pdf({path: `pdf/${route}.pdf`, printBackground: true});
      console.log('...Done')
    }
    console.log('All Done')
    await browser.close();
    
    if (!arg("noserver"))
      await serverStop()
  })();
} else {
  (async () => {
    await serverStart()
  })()
}
