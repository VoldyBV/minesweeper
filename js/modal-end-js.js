function Nova_Igra(){
    window.location.reload();
}
function Ponovi_Ovu(){
    localStorage.setItem("previous_mines", JSON.stringify(pozicijeMina));
    Nova_Igra();
}
function Izadji(){
    window.close();
}