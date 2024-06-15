import fs from 'fs'
import {SLK} from '../slk/SLK.mjs'
import WorldEditStrings from '../westring/WorldEditStrings.mjs'

const upper = ['', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

const w3a = 'AbilityMetaData'
const w3q = 'UpgradeMetaData'

const gen = (n, p) => {
    const slk = new SLK(fs.readFileSync(`../../extract/${p}/${n}.slk`, {encoding: 'utf8'}))

    /**
     * @type {{
     * ID:string,
     * field:string,
     * displayName:string
     * type:string
     * repeat:number?
     * data:number
     * }[]}
     */
    const map = slk.map

    map.sort((a, b) => a.ID.localeCompare(b.ID))

    for (const item of map) {
        item.displayName = WorldEditStrings(item.displayName)
    }
    //fs.writeFileSync('metadata.json', JSON.stringify(map, null, 2), {flag: 'w+'})

    let kt = `package raft.war.binary.parser.data

val ${n} : HashMap<String, MetaData> = hashMapOf(
`
    for (const item of map) {
        let field = item.field

        switch (n) {
            case w3a:
                if (field === 'Data') field += upper[item.data]
                break
        }

        kt += `\t"${item.ID}" to MetaData("${field}", "${item.displayName}", "${item.type}", ${item.repeat ?? 0}),\n`
    }

    kt += ')'
    fs.writeFileSync(`data/${n}.kt`, kt, {flag: 'w+'})
}

gen(w3a, 'Units')
gen('DestructableMetaData', 'Units')
gen('DoodadMetaData', 'Doodads')
gen('AbilityBuffMetaData', 'Units')
gen(w3q, 'Units')
gen('UnitMetaData', 'Units')

