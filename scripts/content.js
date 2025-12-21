const platforms = [
    new JavBus(),
    new JavLibrary(),
    new JavDb(),
]
p = platforms.find(it => it.match())
if (p) {
    console.info("javlinker init")
    p.execute()
}