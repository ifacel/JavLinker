let browserHolder: any;

if (navigator.userAgent.includes('Chrome')) {
    browserHolder = chrome;
} else if (navigator.userAgent.includes('Firefox')) {
    browserHolder = browser;
} else {
    // @ts-ignore
    browserHolder = chrome;
}

export default browserHolder;
