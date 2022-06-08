var tabla;
var dugmici;
var pozicijeMina;
var prazna_polja;
var mute = false;
var ROWS;//number of rows
var COLS;//number of columns
var NOMS;//number of mines
var modal_help, modal_quit, modal_new, modal_end;//modal boxes
(
    () => {

        if(localStorage.getItem("ROWS") === null) localStorage.setItem("ROWS", "8");
        if(localStorage.getItem("COLS") === null) localStorage.setItem("COLS", "8");
        if(localStorage.getItem("NOMS") === null) localStorage.setItem("NOMS", "12");

        ROWS = +localStorage.getItem("ROWS");
        COLS = +localStorage.getItem("COLS");
        NOMS = +localStorage.getItem("NOMS");

        prazna_polja = ROWS * COLS - NOMS;

        tabla = new Array(ROWS);
        for(var i = 0; i < ROWS; i++){
            tabla[i] = new Array(COLS);
            tabla[i] = tabla[i].fill("0");
        }
        
        window.addEventListener("DOMContentLoaded", function() {
            modal_help = document.querySelector("#modal-help");
            modal_quit = document.querySelector("#modal-quit");
            modal_new = document.querySelector("#modal-new");
            modal_end = document.querySelector("#modal-end");

            CreateField();
            var redovi = document.querySelectorAll("table tr");
            dugmici = new Array(redovi.length);

            for(var i = 0;i < dugmici.length; i++){
                dugmici[i] = redovi[i].querySelectorAll("td button");
            }

            console.log(dugmici);

            dugmici.forEach(function (element){
                element.forEach(function (element){
                    element.setAttribute("oncontextmenu", "Mark(this, event)");
                    element.setAttribute("onclick", "Dig(this)");

                    if(Math.floor(100 / ROWS) - 2 > 20) element.style.fontSize = "20vh";
                    else element.style.fontSize = Math.floor(100 / ROWS) - 2 + "vh";
                });
            });
            petlja:
                for(var i = 0;i < ROWS;i++){
                    for(var j = 0;j < COLS;j++){
                        if(tabla[i][j] == "0"){
                            dugmici[i][j].classList.toggle("pulsing-btn");
                            break petlja;
                        }
                    }
                }
            document.querySelector("#mine-number").innerHTML = NOMS;
            Adjust_Size();
        });
        window.addEventListener("keydown", function(event) {
            switch(event.key){
                case 'h':
                case 'H': modal_help.open(); break;
                case 'n':
                case 'N': modal_new.open();break;
                case 'q':
                case 'Q': modal_quit.open();break;
                case 'm':
                case 'M': Mute_Unmute();break;
                case "Escape":
                    if(modal_help.opened) modal_help.close();
                    else if(modal_quit.opened) modal_quit.close();
                    else if(modal_new.opened) modal_new.close();
                    break;
                default: ;
            }
        });

        window.addEventListener("contextmenu", function(event){
            event.preventDefault();
        })

        Set_Field();
    }
)();

//Create field aka table
function CreateField(){//create and append table
    var table = document.createElement("table");
    var tr;

    for(var i = 0; i < ROWS; i++){
        tr = GetRow(i);
        table.appendChild(tr);
    }

    document.querySelector("#field").appendChild(table);
}
function GetRow(x){//create rows for table
    var tr = document.createElement("tr");
    var td;

    for(var i = 0;i < COLS;i++){
        td = GetBtn(x, i);
        tr.appendChild(td);
    }

    return tr;
}
function GetBtn(x, y){//create td and button for rows
    var td = document.createElement("td");
    var button = document.createElement("button");

    button.setAttribute("index", `${x}-${y}`);
    td.appendChild(button);

    return td;
}

//Sets field
function Set_Field(){
    var mines = Get_Mines_Positions();
    pozicijeMina = mines;

    for(var i = 0;i < mines.length;i++){
        var r = Math.floor(mines[i] / COLS);
        var c = mines[i] % COLS;
        Set_Mine(r, c);
    }
    console.log(tabla);
}

//Gives positions for mines
function Get_Mines_Positions(){
    if(localStorage.getItem("previous_mines")){
        var mines =  JSON.parse(localStorage.getItem("previous_mines"));
        localStorage.removeItem("previous_mines");
        return mines;
    }

    var mines = new Array(NOMS);
    var i = 0;

    mines = mines.fill(-1);

    while(i < NOMS){
        var position = Math.floor(Math.random() * ROWS * COLS);
        if(mines.indexOf(position) == -1){
            mines[i] = position;
            i++;
        }
    }

    return mines;
}

//Sets mine to a given position
function Set_Mine(r, c){
    tabla[r][c] = "#";

    var r1 = r - 1;
    var r2 = r + 1;
    var c1 = c - 1;
    var c2 = c + 1;

    if(r1 > -1 && c1 > -1 && tabla[r1][c1] != "#") tabla[r1][c1] = +tabla[r1][c1] + 1;
    if(r2 < ROWS && c2 < COLS && tabla[r2][c2] != "#") tabla[r2][c2] = +tabla[r2][c2] + 1;

    if(r1 > -1 && c2 < COLS && tabla[r1][c2] != "#") tabla[r1][c2] = +tabla[r1][c2] + 1;
    if(r2 < ROWS && c1 > -1 && tabla[r2][c1] != "#") tabla[r2][c1] = +tabla[r2][c1] + 1;

    if(c1 > -1 && tabla[r][c1] != "#") tabla[r][c1] = +tabla[r][c1] + 1;
    if(c2 < COLS && tabla[r][c2] != "#") tabla[r][c2] = +tabla[r][c2] + 1;
    
    if(r1 > -1 && tabla[r1][c] != "#") tabla[r1][c] = +tabla[r1][c] + 1;
    if(r2 < ROWS && tabla[r2][c] != "#") tabla[r2][c] = +tabla[r2][c] + 1;

}

//Mark field
function Mark(field, event){
    event.preventDefault();

    var container = document.querySelector("#mine-number");

    if(field.innerHTML != "X") {
        field.innerHTML = "X";
        container.innerHTML--;
    }
    else {
        field.innerHTML = "";
        container.innerHTML++;
    }
}

//Dig
function Dig(field){
    if(field.innerHTML == "X") return;

    var index = field.getAttribute("index").split('-');
    var x = +index[0];
    var y = +index[1];
    
    try {
        field.classList.remove("pulsing-btn");
    } catch (error) {
        
    }

    if(tabla[x][y] != "#"){
        field.disabled = true;
        field.innerHTML = tabla[x][y];
        field.classList.toggle("clicked");
        field.classList.toggle("number-" + tabla[x][y]);
        field.parentNode.classList.toggle("td-clicked");
        prazna_polja--;
        if(prazna_polja == 0){
            PlaySound("game-won");
            Open_End_Modal("Congratulations, you won.");
            return;
        }

        PlaySound(tabla[x][y]);

        if(tabla[x][y] == 0){
            var x1 = x - 1;
            var x2 = x;
            var x3 = x + 1;
            var y1 = y - 1;
            var y2 = y;
            var y3 = y + 1;

            if(x1 > -1 && y1 > -1 && tabla[x1][y1] != "#") dugmici[x1][y1].click()
            if(x1 > -1 && tabla[x1][y2] != "#") dugmici[x1][y2].click()
            if(x1 > -1 && y3 < COLS &&  tabla[x1][y3] != "#") dugmici[x1][y3].click()
            
            if(y1 > -1 && tabla[x2][y1] != "#") dugmici[x2][y1].click()
            if(y3 < COLS && tabla[x2][y3] != "#") dugmici[x2][y3].click()
            
            if(x3 < ROWS && y1 > -1 && tabla[x3][y1] != "#") dugmici[x3][y1].click()
            if(x3 < ROWS && tabla[x3][y2] != "#") dugmici[x3][y2].click()
            if(x3 < ROWS && y3 < COLS && tabla[x3][y3] != "#") dugmici[x3][y3].click();
        }
    }
    else{
        var x = +field.getAttribute("index").split("-")[0];
        var y = +field.getAttribute("index").split("-")[1];
        var index = x * COLS + y;
        var i = pozicijeMina.indexOf(index);
        var part1 = pozicijeMina.slice(0, i);
        var part2 = pozicijeMina.slice(i+1, pozicijeMina.length);
        var part3 = [pozicijeMina[i]];
        
        PlaySound("boom");
        pozicijeMina = part1.concat(part2).concat(part3);
        field.classList.toggle("exploded");
        field.parentNode.classList.toggle("exploded");
        Defeat(); 
    }
}
function PlaySound(id){
    if(mute) return;

    if(id == 0) return;
    var sound;

    if(id == "boom") sound = new Audio("sounds/boom.wav");
    else if(id == "game-lost") sound = new Audio("sounds/game-lost.wav");
    else if(id == "game-won") sound = new Audio("sounds/game-won.mp3");
    else sound = new Audio("sounds/sound-" + id + ".wav");

    sound.play();
}
function Defeat(){
    dugmici.forEach(function(element){
        element.forEach(function(element){
            element.disabled = true;
        });
    });
    
    var i = 0;

    var time = setInterval(function (){
        if(i == NOMS - 1) return;

        var x = Math.floor(pozicijeMina[i] / COLS);
        var y = pozicijeMina[i] % COLS;
        i++;

        PlaySound("boom");

        dugmici[x][y].classList.toggle("exploded");
        dugmici[x][y].parentNode.classList.toggle("exploded");
    }, 1500);

    var tout = NOMS * 1500;

    setTimeout(() => {
        clearInterval(time);
        PlaySound("game-lost");
        Open_End_Modal("Game over, you lost.")
    }, tout);
}
function Trigger_Window_KeyDown_Function(key_name){
    window.dispatchEvent(new KeyboardEvent('keydown', {'key': key_name}));
}
function Mute_Unmute(){
    mute = !mute;
    if(mute) document.querySelector("#mute-unmute").innerHTML = "Off";
    else document.querySelector("#mute-unmute").innerHTML = "On";
}
function Adjust_Size(){
    var height = 100 / ROWS + "%";
    var width = 100 / COLS + "%";

    var td = document.querySelectorAll("table td");

    for(var i = 0;i < td.length; i++){
        td[i].style.height = height;
        td[i].style.width = width;
    }
}
function Open_End_Modal(title){
    modal_end.title = title;
    modal_end.open();
}