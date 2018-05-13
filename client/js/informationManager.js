class InformationManager{
    constructor(){
        this.dom = document.getElementById("informations");
    }

    clean(){
        while (this.dom.firstChild) {
            this.dom.removeChild(this.dom.firstChild);
        }
    }
    
    display(message){
        this.clean();
        this.dom.appendChild(document.createTextNode(message));
    }

}