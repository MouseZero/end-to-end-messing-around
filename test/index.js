const { expect } = require('chai')
const { remote } = require('webdriverio')
const standalone = require('selenium-standalone')

let browser
let selenium

before((done) => {
  standalone.start((err, _selenium) => {
    if (err) return done(err)
    selenium = _selenium
    browser = remote({
      desiredCapabilities: {
        browserName: 'chrome'
      }
    })
    browser.init()
      .then(() => done())
  })
})

describe('our first', () => {
  it('should work', async () => {
    await browser.url("http://www.google.com")
    await browser
      .waitForExist('#lst-ib')
      .setValue('#lst-ib','react while punched in face')

    await browser
      .waitForExist('input[value="Google Search"]')
      .click('input[value="Google Search"]')

    await browser
      .waitForExist('a=Images')
      .click('a=Images')

      const buttonText = await browser
      .waitForExist('div[class="ZO5Spb"]')
      .getText('div[class="ZO5Spb"]')

    expect(buttonText[0]).to.equal('russian')
  })
})

const keys = [
  'Price',
  'No. Units',
  'No. Stories'
]
function wantKey(td) {
  for (let i=0; i<keys.length; i++) {
    if (td.includes(keys[i])) return keys[i]
  }
  return false
}

async function getPropData(browser) {
  const rawData = await browser
    .waitForExist('table[class="property-data"]')
    .getHTML('table[class="property-data"]')
    .getHTML('tbody > tr > td')


  const data = {}
  for (let i=0; i<10; i = i+2) {
    let key = wantKey(rawData[i])
    if (key) {
      data[key] = rawData[i+1]
        .replace('<td>', '')
        .replace('</td>', '')
        .replace('\n', '')
        .replace(/^\s+|\s+$/g,'')
    }
  }

  console.log(data)
  // for (let i=0; i<data.lenght; i = i+2) {

  // }
  // price.reduce((prev, elem) => {
  //   console.log('-------------------')

  //   console.log('-------------------')
    // const data = tr.match(/<td>.*<\/td>/g)
    // console.log(data)

  return data
}


describe('loop net bot', () => {
  it.only('automate info', async () => {
    await browser.url('http://www.loopnet.com/for-sale/va/multifamily')
    await browser
      .waitForExist('article')
      .click('article')

    const data = await getPropData(browser)

    // console.log(data)

    // await browser
    //   .waitForExist('a=Next')
    //   .click('a=Next')
  })
})

after(() => {
  browser && browser.end()
  selenium && selenium.kill()
})

module.exports = {
  getBrowser: () => browser,
  expect
}
