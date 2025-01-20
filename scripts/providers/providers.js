const playerProviders = [
    new Jable(),
    new P123av(),
    new Missav(),
].filter(p => p.enable)