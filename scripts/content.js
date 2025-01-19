javHolders = [
    new JavBus(),
    new JavLibrary(),
    new JavDb(),
]
holder = javHolders.find(it => it.match())

if (holder) {
    holder.execute()
}