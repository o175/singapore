const fs = require('fs')
let lines = fs.readFileSync('map').toString().split("\n");
lines =  lines.slice(1, lines.length -1);
let data = lines.map( (line, y) =>
                       line.trim().split(" ")
                       .map((height, x) =>
                            ({
                                height: Number(height),
                                y,
                                x,
                                solved: false, // pre-defining fields in object lets compiler to optimise better
                                maxPath: 0,    // without changing a class when new field added.
                                maxSteep: 0,   // ~30% speed benefit for solve function.
                            })
                           )
                       )

const getNeighbours = ({x, y}, data) => {              // returns skiable cells
    return [
        data[y-1]    !== undefined && data[y-1][x],
        data[y][x-1] !== undefined && data[y][x-1],
        data[y+1]    !== undefined && data[y+1][x],
        data[y][x+1] !== undefined && data[y][x+1],
    ].filter( _ => _ && data[y][x].height > _.height)
}

const chooseBest = cells => {                     // returns best cell to start skiing
    let ans = cells[0];
    for(let i = 1; i < cells.length; i++) {
        if (
            ans.maxPath < cells[i].maxPath ||
                (ans.maxPath === cells[i].maxPath && ans.maxSteep < cells[i].maxSteep)
        ) {
            ans = cells[i];
        }
    }
    return ans
}

let top = {maxPath: 1, maxSteep: 0}; // storage for best condidate
const solve = cell => {
    if (cell.solved) return
    let neighbours = getNeighbours(cell, data);
    if (neighbours.length === 0) {
        cell.solved = true;
        cell.maxPath = 1;
        cell.maxSteep = 0;
    } else {
        neighbours.forEach(solve);
        let bestNeighbour = chooseBest(neighbours);
        cell.maxPath = bestNeighbour.maxPath+1;
        cell.maxSteep = bestNeighbour.maxSteep + cell.height - bestNeighbour.height;
        cell.solved = true;
        top = chooseBest([cell, top]);
    }
}

for ( let line of data )
    for( let cell of line )
        if (!cell.solved) solve(cell, data);

console.log(top);
