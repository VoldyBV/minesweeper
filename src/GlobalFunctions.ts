const generateField = (rows:number, cols:number, mines:number): Array<Array<number>> => {
    var ReturnState: Array<Array<number>> = [];
    var field: Array<number> = new Array<number>(rows*cols);
    field = field.fill(0, 0, rows*cols);

    for(let i = 0; i < mines; i++) {
        var pos;

        do {
            pos = Math.floor(Math.random() * rows * cols);
        }while(field[pos] === -1)

        field[pos] = -1
    }

    while(field.length) {
        ReturnState.push(field.splice(0, cols));
    }

    for(const x in ReturnState) {
        for(const y in ReturnState[x]) {
            if(ReturnState[x][y] !== -1) continue;
            var x1 = Number(x) - 1;
            var x2 = Number(x);
            var x3 = Number(x) + 1;
            var y1 = Number(y) - 1;
            var y2 = Number(y);
            var y3 = Number(y) + 1;

            if(x1 > -1 && y1 > -1 && ReturnState[x1][y1] !== -1) ReturnState[x1][y1]++;
            if(x1 > -1 && ReturnState[x1][y2] !== -1) ReturnState[x1][y2]++;
            if(x1 > -1 && y3 < cols && ReturnState[x1][y3] !== -1) ReturnState[x1][y3]++;

            if(y1 > -1 && ReturnState[x2][y1] !== -1) ReturnState[x2][y1]++;
            if(ReturnState[x2][y2] !== -1) ReturnState[x2][y2]++;
            if(y3 < cols && ReturnState[x2][y3] !== -1) ReturnState[x2][y3]++;

            if(x3 < rows && y1 > -1 && ReturnState[x3][y1] !== -1) ReturnState[x3][y1]++;
            if(x3 < rows && ReturnState[x3][y2] !== -1) ReturnState[x3][y2]++;
            if(x3 < rows && y3 < cols && ReturnState[x3][y3] !== -1) ReturnState[x3][y3]++;
        }
    }

    return ReturnState;
}
const getStarredButtonId = (field: Array<Array<number>>): string => {
    var starred_x: number;
    var starred_y: number;
    do{
        starred_x = Math.floor(Math.random() * field.length)
        starred_y = Math.floor(Math.random() * field[0].length);
    }while(field[starred_x][starred_y] !== 0);
    return `${starred_x}-${starred_y}`
}
export default {
    generateField,
    getStarredButtonId
}