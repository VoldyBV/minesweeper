function Start_New_Game(){
    var rb = document.querySelectorAll("#modal-new input[name=lvl]");
    var i = 0;
    var rows = document.querySelector("#rows").value;
    var cols = document.querySelector("#cols").value;
    var noms = document.querySelector("#noms").value;

    for(i; i < rb.length; i++){
        if(rb[i].checked) break;
    }

    switch(i){
        case 0: rows = "8", cols = "8", noms = "12"; break;
        case 1: rows = "12", cols = "12", noms = "27"; break;
        case 2: rows = "16", cols = "12", noms = "48"; break;
        default: break;
    }

    localStorage.setItem("ROWS", rows);
    localStorage.setItem("COLS", cols);
    localStorage.setItem("NOMS", noms);
    window.location.reload();
}
function Show_Custom_Settings(rb){
    if(rb.value == "3") document.querySelector("#custom").style.display = "block";
    else document.querySelector("#custom").style.display = "none";
}
function Bind_To_Limit(input_number){
    var max = input_number.max;
    var min = input_number.min;
    if(+input_number.value > max) input_number.value = max;
    if(+input_number.value < min) input_number.value = min ;
}
function NOMS_Min_Max(){
    var rows = +document.querySelector("#rows").value;
    var cols = +document.querySelector("#cols").value;
    var noms = document.querySelector("#noms");

    noms.min = Math.floor(rows * cols * 0.125);
    noms.value = Math.floor(rows * cols * 0.1875);
    noms.max = Math.floor(rows * cols * 0.25);
}