import fs from 'fs'

const text = fs.readFileSync('../../extract/UI/WorldEditStrings.txt', {encoding: 'utf8'})

const map = new Map()

for (const s of text.split('\n')) {
    const list = s.split('=')
    if (list.length < 2) continue
    const name = list.shift()
    let value = list.join('=')
    map.set(name, value)
}

let out = ''
for (const [name, value] of map) {
    out += `\t${name} : \`${value}\`,\n`
}
out = `/* eslint-disable quotes */\nconst obj =  {\n${out}\n} \n const map = new Map(Object.entries(obj)); \n

export default (key) => {
    if (!map.has(key)) return key
    const value = map.get(key)
    if (value.startsWith('WESTRING') && map.has(value)) return map.get(value)
    return value
}
`
fs.writeFileSync('WorldEditStrings.mjs', out, {flag: 'w+'})
