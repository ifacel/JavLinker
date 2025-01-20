const platforms = [
    new JavBus(),
    new JavLibrary(),
    new JavDb(),
]
holder = platforms.find(it => it.match())

if (holder) {
    holder.execute()
}