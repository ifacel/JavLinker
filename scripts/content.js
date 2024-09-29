javHolders = [
    new JavBus(),
    new JavLibrary(),
    new JavDb(),
]
holder = javHolders.find(it => it.match())
console.info("hello add")

if (holder) {
    holder.execute()
}