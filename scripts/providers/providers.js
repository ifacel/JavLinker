const sourceProviders = [
    new Jable(),
    new P123av(),
    new Missav(),
    new Njav(),
    new Supjav(),
    new JapanHub(),
].filter(p => p.enable)