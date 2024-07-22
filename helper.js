export function generateTable(len)
{
    let arr = [];
    for (let x = 0; x < len; x++)
    {
        arr.push([]);
        for (let _ = 0; _ < len; _++)
        {
            arr[x].push("");
        }
    }
    return arr;
}


export function getMines(table)
// return mines with their absolute position in the table.
{
    let mines = [];
    table.forEach((l, li) => {l.forEach((m, mi) => {if (m === "X"){mines.push({list: li, index: mi})}})});
    return mines;
}


export function generateMines(count, size, blocked_square_)
// generates x random numbers without the possibility of getting the square coordinates of the square that was firstly clicked by the user. 
{
    const table_size = size * size;
    let squares = [];
    const num = max => Math.floor(Math.random() * max); // takes the max num as an argument and generates a random num between 0 and the given arg
    let blocked_squares  = [];
    let blocked_squares_n  = [];
    if (blocked_square_[0] !== 0){

        if (blocked_square_[1] !== 0){
            blocked_squares.push([blocked_square_[0] - 1, blocked_square_[1] - 1]);
        }

        blocked_squares.push([blocked_square_[0] -1, blocked_square_[1]]);
        if (blocked_square_[1] !== size - 1) {
            blocked_squares.push([blocked_square_[0] - 1, blocked_square_[1] + 1]);
        }
    }

    if (blocked_square_[1] !== 0){
        blocked_squares.push([blocked_square_[0], blocked_square_[1] - 1]);
    }

    if (blocked_square_[1] !== size - 1) {
        blocked_squares.push([blocked_square_[0], blocked_square_[1] + 1]);
    }

    if (blocked_square_[0] !== size - 1){
        if (blocked_square_[1] !== 0){
            blocked_squares.push([blocked_square_[0] + 1, blocked_square_[1] - 1]);
        }
        blocked_squares.push([blocked_square_[0] + 1, blocked_square_[1]]);
        if (blocked_square_[1] !== size - 1) {
            blocked_squares.push([blocked_square_[0] + 1, blocked_square_[1] + 1]);
        }
    }
    blocked_squares.push(blocked_square_);
    blocked_squares.forEach(bs => {
        let index = bs[0] * size + bs[1];
        blocked_squares_n.push(index);
    })

    let skip_from_bigger_while = false;
    while (squares.length < count){
        let n = num(table_size - 1);
        for (let i = 0; i < blocked_squares_n.length; i++) {
            if (n == blocked_squares_n[i]) {
                skip_from_bigger_while = true
                break;
            }
            else{
                skip_from_bigger_while = false;
            }
        }
        if (skip_from_bigger_while == false){
            if (squares.indexOf(n) === -1){
                squares.push(n);
            }
        }
    }
    return squares;
}


export function spreadMines(mines, table)
{
    mines.forEach(mine => {
        if (mine < table.length){
            table[0][mine] = "X";
            return;
        }
        let list_index = parseInt(mine / table.length);
        let mine_index = mine % table.length;
        table[list_index][mine_index] = "X";
    })
}


export function calcNumbers(safe_squares, table)
{
    // calculate each square based on how many mines are surrounding it.
    safe_squares.forEach(square => {
        let squares = [];
        let mines_count = 0;
        if (square.list !== 0){

            if (square.index !== 0){
                squares.push(table[square.list - 1][square.index - 1]);
            }

            squares.push(table[square.list - 1][square.index]);
            if (square.index !== table[square.list].length - 1) {
                squares.push(table[square.list - 1][square.index + 1]);
            }
        }

        if (square.index !== 0){
            squares.push(table[square.list][square.index - 1]);
        }

        if (square.index !== table[square.list].length - 1) {
            squares.push(table[square.list][square.index + 1]);
        }

        if (square.list !== table.length - 1){
            if (square.index !== 0){
                squares.push(table[square.list + 1][square.index - 1]);
            }
            squares.push(table[square.list + 1][square.index]);
            if (square.index !== table[square.list].length - 1) {
                squares.push(table[square.list + 1][square.index + 1]);
            }
        }

        squares.forEach(sq => {
            if (sq === "X"){
                mines_count += 1;
            }
        })
        table[square.list][square.index] = mines_count;
    })
}


export function getSafeSquares(table)
// *FOR TESTING PURPOSES*
// get all squares that don't have mines
{
    // return mines with their absolute position in the table.
    let squares = [];
    table.forEach((l, li) => {l.forEach((s, si) => {if (s === ""){squares.push({list: li, index: si})}})});
    return squares;
}