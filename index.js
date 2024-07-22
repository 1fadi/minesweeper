import * as helper from "./helper.js";

let difficulties = {
    Easy: {size: 6, mines: 5},
    Medium: {size: 12, mines: 18},
    Hard: {size: 20, mines: 50}
};


let lost = false;

let controller = new AbortController();

let urlParams = new URLSearchParams(window.location.search);
let modes = ["Easy", "Medium", "Hard"];
let mode = urlParams.get("mode") || "Medium";
if (modes.includes(mode) == false) {
    urlParams.set("mode", "Medium");
    history.replaceState(null, null, "?" + urlParams.toString());
    mode = "Medium";
}

let MINES_COUNT = difficulties[mode].mines;


function updateMinesCount()
{
    if (MINES_COUNT.toString().length == 1) {
        document.getElementById("mines-count").innerText = `0${MINES_COUNT}`;
    }
    else {
        document.getElementById("mines-count").innerText = MINES_COUNT;
    }
}


function createTable(raw_table, mines_count)
{
    let table_element = document.getElementById("main-table");
    raw_table.forEach((row, row_i) => {
        let tr = document.createElement("tr");
        tr.classList.add("gamefield-row");
        row.forEach((sq, sq_i) => {
            let td = document.createElement("td");
            td.classList.add("gamefield-cell");
            tr.appendChild(td);
            td.addEventListener("click", function(event){
                flip(td, sq, [row_i, sq_i], raw_table, mines_count);
            }, {signal: controller.signal});
            td.addEventListener('contextmenu', function(e) {
                let value = td.innerText;
                if (lost === false){
                    if (value !== "⁮" && value !== "🚩" && value !== "X" && /^-?\d+$/.test(value) == false){
                        if (MINES_COUNT > 0){
                            td.innerText = "🚩";
                            MINES_COUNT -= 1;
                            updateMinesCount();
                            HasWon(mines_count);
                        }
                    }
                    else if (value == "🚩"){
                        MINES_COUNT += 1;
                        updateMinesCount();
                        td.innerText = "";
                    }

                }
                e.preventDefault();
            }, {signal: controller.signal},false);
        })
        table_element.appendChild(tr);
    });
}


function createTemporaryTable(mode_)
{
    let size = difficulties[mode_].size;
    let mines_count = difficulties[mode_].mines;

    let table_element = document.getElementById("main-table");
    for (let x = 0; x < size; x++){
        let tr = document.createElement("tr");
        tr.classList.add("gamefield-row");
        for (let y = 0; y < size; y++){
            let td = document.createElement("td");
            td.classList.add("gamefield-cell");
            td.addEventListener("click", function(event){initTable(size, [x, y], mines_count)});
            tr.appendChild(td);
        }
        table_element.appendChild(tr);
    }
}


function initTable(size, chosen_square, mines_count)
{
    document.getElementById("main-table").innerHTML = "";
    let mines = helper.generateMines(mines_count, size, chosen_square);
    let table = helper.generateTable(size);
    helper.spreadMines(mines, table);
    let safe_squares = helper.getSafeSquares(table);
    helper.calcNumbers(safe_squares, table);
    createTable(table, mines_count);
    let tr = Array.from(document.getElementsByClassName("gamefield-row"))[chosen_square[0]];
    let td = Array.from(tr.getElementsByClassName("gamefield-cell"))[chosen_square[1]];
    td.click();
}


function flip(td, sq, coordinates, raw_table, mines_count)
{
    if (sq !== 0){
        if (sq === "X"){
            if (lost === false){
                revealAllMines();
            }
            if (td.innerText == "🚩"){
                td.style.backgroundColor = "green";
                return;
            }
            else {
                td.innerText = "💣";
                td.style.backgroundColor = "red";
            }
            return;
        }
        if (lost) return;
        else td.innerText = sq;
    }
    else {
        if (lost) return;
        td.innerText = "";
        unvealNearbySafeSquares(coordinates, raw_table)
    }
    td.style.borderColor = "white";
    td.style.backgroundColor = "white";
    HasWon(mines_count);
}


function unvealNearbySafeSquares(coordinates, raw_table) // recursive method
{
    // check the 8 nearby squares. 
    // same list and index -/+ 1
    // list -/+ 1 and index, index -/+ 1
    let cells = [];

    // create a method to avoid code repetition when creating position/ value pairs
    const appendCell = (coordinates_) => cells.push({position: coordinates_, value: raw_table[coordinates_[0]][coordinates_[1]]});

    if (coordinates[0] > 0){  // the list before
        if (coordinates[1] > 0) appendCell([coordinates[0] - 1, coordinates[1] - 1]);  // index - 1
        if (coordinates[1] !== raw_table[coordinates[0]].length - 1) appendCell([coordinates[0] - 1, coordinates[1] + 1]);  // index + 1
        appendCell([coordinates[0] - 1, coordinates[1]]);  // index
    }
    if (coordinates[0] !== raw_table.length - 1){  // the list after
        if (coordinates[1] > 0) appendCell([coordinates[0] + 1, coordinates[1] - 1]);  // index - 1
        if (coordinates[1] !== raw_table[coordinates[0]].length - 1) appendCell([coordinates[0] + 1, coordinates[1] + 1]);  // index + 1
        appendCell([coordinates[0] + 1, coordinates[1]]);  // index
    }
    if (coordinates[1] !== 0){  // same list
        appendCell([coordinates[0], coordinates[1] - 1]);  // index - 1
    }
    if (coordinates[1] !== raw_table[coordinates[0]].length - 1){  // same list
        appendCell([coordinates[0], coordinates[1] + 1]);  // index - 1
    }

    let all_td = Array.from(document.getElementsByClassName("gamefield-cell"));
    cells.forEach(cell => {
        let cell_index = cell.position[0] * raw_table[0].length + cell.position[1];
        let td = all_td[cell_index];
        if (td.innerText !== "🚩"){
            if (cell.value == 0){
                if (td.innerText !== "⁮"){
                    td.innerText = "⁮";
                    unvealNearbySafeSquares([cell.position[0], cell.position[1]], raw_table);
                }
            }
            else{
                td.innerText = cell.value;
            }
            td.style.borderColor = "white";
            td.style.backgroundColor = "white";
        }
    })

}


function revealAllMines()
{
    lost = true;
    let all_td = Array.from(document.getElementsByClassName("gamefield-cell"));
    while (all_td.length > 0){
        let td = all_td.shift();
        td.click();
    }
    controller.abort()
}


function HasWon(mines_count)
{
    let tds = Array.from(document.getElementsByClassName("gamefield-cell")).filter(x => x.innerText !== "⁮" && /^-?\d+$/.test(x.innerText) == false);
    if (tds.length == mines_count)
    {
        controller.abort();
        setTimeout(function(){
            alert("Won");
        }, 600)
    }
}

let refresh_btn = document.getElementById("refresh");
refresh_btn.addEventListener("click", resetGame);

function resetGame()
{
    location.reload();
    console.log("hh");
}


let back_button = document.getElementById("back-button");
back_button.addEventListener("click", function(){
    window.location.href = "index.html";
})

updateMinesCount();
createTemporaryTable(mode);