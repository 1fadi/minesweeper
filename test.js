import * as h from "./helper.js";

//////////////////  TESTS //////////////////////////

// console.log(mines);
//
let mines = h.generateMines(10, 10);
let table = h.generateTable(10);
h.spreadMines(mines, table);
let safe_squares = h.getSafeSquares(table);
h.calcNumbers(safe_squares, table);
let table_mines = h.getMines(table);

console.log(table); // perfect
console.log(mines); // perfect
console.log(table_mines); // perfect


let safe = safe_squares[20];
let test = h.findNearbySafeSquares([safe.list, safe.index], table);

console.log(safe);
console.log(test);


//////////////////  TESTS //////////////////////////