javHolders = [
    new JavBus(),
    new JavLibrary()
]
holder = javHolders.find(it => it.match())
if (holder) {
    holder.execute()
}