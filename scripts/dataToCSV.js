const fs = require('fs');



const data = JSON.parse(fs.readFileSync('src/assets/data.json').toString())

for(const state of data){
    
    fs.writeFileSync(`./src/assets/data/${state.State}.csv`, `${Object.keys(state).slice(1).join(",")}\n${Object.values(state).slice(1).join(',')}`)
    
}
