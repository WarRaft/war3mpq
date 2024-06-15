// https://github.com/stijnherfst/HiveWE/wiki/SLK

export class SLK {

    /**
     * @param {string} text
     */
    constructor(text) {
        let y = -1
        let def = null

        /**
         * @param {string} s
         * @return {string|number}
         */
        const _value = s => {
            if (s.substring(0, 1) === '"') {
                const v = s.split('')
                if (v.shift() !== '"') throw new Error('Wrong string begining')
                if (v.pop() !== '"') throw new Error('Wrong string ending')
                return v.join('')
            }
            return Number(s)
        }

        for (const string of text.split('\n')) {
            const chunks = string.split(';')
            if (chunks.length === 0) continue
            switch (chunks.shift()) {
                case 'B':
                    for (const value of chunks) {
                        const list = value.split('')
                        const k = list.shift()
                        const v = list.join('')
                        switch (k) {
                            case 'X':
                                this.width = Number(v)
                                break
                            case 'Y':
                                this.height = Number(v)
                                break
                            case 'D':
                                def = _value(v)
                        }
                    }
                    if (this.width < 0 || this.height < 0) throw new Error('Missing size chunk')
                    for (let h = 0; h < this.height; h++) {
                        const list = []
                        for (let w = 0; w < this.width; w++) {
                            list.push(def)
                        }
                        this.list.push(list)
                    }
                    break
                case 'C':
                    if (this.width < 0 || this.height < 0) throw new Error('Missing table size')

                    let x = -1
                    let value = def
                    for (const chunk of chunks) {
                        const list = chunk.split('')
                        const k = list.shift()
                        const v = list.join('')
                        switch (k) {
                            case 'X':
                                x = Number(v) - 1
                                break
                            case 'Y':
                                y = Number(v) - 1
                                break
                            case 'K':
                                value = _value(v)
                        }
                    }
                    if (value === undefined) throw new Error('Missing value')
                    this.list[y][x] = value
                    break
            }
        }
        this.header = this.list.shift()
        for (let i = this.list.length - 1; i >= 0; i--) {
            const length = this.list[i].reduce((a, v) => a + (v === def ? 1 : 0), 0)
            if (length === this.list[i].length) this.list.pop()
        }

        for (const item of this.list) {
            const m = {}
            for (let i = 0; i < this.header.length; i++) {
                m[this.header[i]] = item[i]
            }
            this.map.push(m)
        }
    }


    list = []
    map = []

    width = -1
    height = -1
}
