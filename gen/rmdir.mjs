import fs from 'fs'
import path from 'path'

export const rmDir = directoryPath => {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach(file => {
            const curPath = path.join(directoryPath, file)
            if (fs.lstatSync(curPath).isDirectory()) {
                rmDir(curPath)
            } else {
                fs.unlinkSync(curPath)
            }
        })
        fs.rmdirSync(directoryPath)
    }
}
