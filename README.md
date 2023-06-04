# wikistar

<img src="https://raw.githubusercontent.com/SinaKhalili/wikistar/main/assets/icon.png" align="right"
     alt="wikistar logo" width="250">
     
A chrome extension that lets you "star" wikipedia articles
like you would on github, so that you can find them later.

_currently pending review at the chrome extension, feel free to use it unpacked_
## Demo

<!-- Demo goes here -->

https://github.com/SinaKhalili/wikistar/assets/20732540/43f35576-1434-4635-a5da-930685ab7ec8



## But why?

So we were in a hotel room doing crosswords when the "CIRRI" and
"ACACIA" cross came up. Huh, I thought, that's a tough word.
I went on wikipedia to look it up and turns out I've been had
by ACACIA before! 
"Dude you should star it on wikipedia so you don't forget it again"
"Dude you can't star things on wikipedia"

And so, wikistar was born. Made with plasmo, react, supabase,
github OAuth, crossword anger, in one of the worst hotels
in San Francisco. 

## Hacking guide

This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

First, run the development server:

```bash
yarn
yarn dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit the plasmo Documentation](https://docs.plasmo.com/)

## Making production build

Run the following:

```bash
yarn build && yarn package
```

This should create a production bundle for your extension, ready to be zipped and published to the stores.

## Submit to the webstores

The easiest way to deploy your Plasmo extension is to use the built-in [bpp](https://bpp.browser.market) GitHub action. Prior to using this action however, make sure to build your extension and upload the first version to the store to establish the basic credentials. Then, simply follow [this setup instruction](https://docs.plasmo.com/framework/workflows/submit) and you should be on your way for automated submission.
