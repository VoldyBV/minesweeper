function Quit(){
    modal_quit.close();
    setTimeout(function(){ 
        modal_end.title = "You quitted the game";
        modal_end.open()
     }, 300)
}
function Refuse_Quiting(){
    modal_quit.close();
}