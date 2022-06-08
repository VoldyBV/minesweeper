(function() {
	var style = `
			bv-modal div.overlay{
				position: absolute;
				top: 0%;
				left: 0%;
				width: 100%;
				height: 100%;
				background-color: rgba(0,0,0,0.7);
				animation: modal-show-up 0.3s ease-in-out;
			}

			bv-modal div.body{
				overflow: hidden;
				position: absolute;
				bottom: 5%;
				right: 15%;
				height: 90%;
				width: 70%;
				background-color: white;
				box-sizing: border-box;
				border: black 4px solid;
				border-radius: 30px;
				animation: modal-grow-in 0.3s ease-in-out;
			}

			bv-modal div.header, bv-modal div.footer{
				height: 10%;
				width: 100%;
				box-sizing: border-box;
				position: relative;
			}

			bv-modal div.footer{
				display: flex;
				align-items: center;
				padding: 1%;
				padding-left: 2%;
				padding-right: 2%;
				box-sizing: border-box;
			}

			bv-modal div.title{
				position: absolute;
				top: 0px;
				left: 0px;

				display: flex;
				align-items: center;
				font-size: 30px;
				font-weight: bold;
				background: none;
				height: 100%;
				width: 90%;
				padding: 1%;
				padding-left: 2%;
				padding-right: 2%;
				box-sizing: border-box;
			}

			bv-modal div.close-button{
				position: absolute;
				top: 0px;
				right: 0px;

				display: flex;
				align-items: center;
				font-size: 30px;
				font-weight: bold;
				justify-content: center;
				height: 100%;
				width: 10%;
				cursor: pointer;
				border-left: solid black 4px;
			}

			bv-modal div.close-button:hover{
				color:white;
				background-color: #F5110A;
				animation: modal-close-button 0.5s;
			}

			bv-modal div.content{
				height: 80%;
				width: 100%;
				box-sizing: border-box;
				border-top: solid black 4px;
				padding: 1%;
				padding-left: 2%;
				padding-right: 2%;
				border-bottom: solid black 4px;
				overflow: auto;
			}

			@keyframes modal-close-button {
  				from {
  					background-color: white;
  					color: black;
  				}
 			 	to {
 			 		background-color: #F5110A;
 			 		color: white;
 			 	}
			}

			@keyframes modal-show-up{
				from{
					opacity: 0;
				}
				to{
					opacity: 1;
				}
			}
			@keyframes modal-hide-away{
				from{
					opacity: 1;
				}
				to{
					opacity: 0;
				}
			}


			@keyframes modal-grow-in{
				from{
					height: 22.5%;
					width: 17.5%;
					bottom: 41%;
					right: 43%;
				}
				to{
					height: 90%;
					width: 70%;
					bottom: 5%;
					right: 15%;
				}
			}
			@keyframes modal-shink-away{
				from{
					height: 90%;
					width: 70%;
					bottom: 5%;
					right: 15%;
				}
				to{
					height: 18%;
					width: 14%;
					bottom: 41%;
					right: 43%;
				}
			}	
	`;
	var newStyle = document.createElement('style');
	newStyle.innerHTML = newStyle.innerHTML + style;

	class BVModal extends HTMLElement{
  		constructor(){
  			super();
		}
		connectedCallback(){
			var dodaj = this.#addBody.bind(this);
			if(!this.hasAttribute("title")) this.title = "";
			if(!this.hasAttribute("footer")) this.footer = "";
			document.addEventListener('DOMContentLoaded', dodaj);
		}
		adoptedCallback(){
			var dodaj = this.#addBody.bind(this);
			if(!this.hasAttribute("title")) this.title = "";
			if(!this.hasAttribute("footer")) this.footer = "";
			document.addEventListener('DOMContentLoaded', dodaj);
		}

		static get observedAttributes() {
			return ["title", "footer", "opened"]
    	}

		attributeChangedCallback(name, oldValue, newValue) {
			switch(name){
				case 'title': 
					var elem = this.querySelector("div.title[title]");
					if(elem) elem.innerHTML = this.title;
					break;
				case 'footer':
					var elem = this.querySelector("div.footer[info]");
					if(elem) elem.innerHTML = this.footer;
					break;
				default: break;
			}
		}

		#addBody(){
			var body = `
				<div class="overlay">
					<div class="body">
						<div class="header">
							<div class="title" title>
								this is title
							</div><!--
							--><div class="close-button" close>
								&#10006;
							</div>
						</div>
						<div class="content" content></div>
						<div class="footer" info>
							this is footer.
						</div>
					</div>
				</div>
			`;
			var Close = this.close.bind(this);
			var content = this.innerHTML;
			this.innerHTML = body;
			this.style.display = "none";
			this.querySelector("div.content[content]").innerHTML = content;
			this.querySelector("div.close-button[close]").addEventListener("click", Close);
			this.querySelector("div.title[title]").innerHTML = this.title;
			this.querySelector("div.footer[info]").innerHTML = this.footer;
			this.addEventListener("contextmenu", function (event){ event.preventDefault();})
			if(this.hasAttribute("opened")) this.open();
		}
		open(){
			this.style.display = "block";
		}
		close(){
			this.querySelector("div.overlay").setAttribute("style", "animation: modal-hide-away 0.3s ease-in-out");
			this.querySelector("div.body").setAttribute("style", "animation: modal-shink-away 0.3s ease-in-out");
			function Zatvori(elem) { 
				elem.style.display = "none";
				elem.querySelector("div.overlay").removeAttribute("style");
				elem.querySelector("div.body").removeAttribute("style");
			}
			setTimeout(Zatvori, 290, this);
		}

		set title(newValue){
			this.setAttribute("title", newValue);
		}
		get title(){
			return this.getAttribute("title");
		}

		set footer(newValue){
			this.setAttribute("footer", newValue);
		}
		get footer(){
			return this.getAttribute("footer");
		}
		get opened(){
			if(this.style.display == "block") return true;

			return false;
		}
		disconnectedCallback() {
		}
  	}
  window.customElements.define("bv-modal", BVModal);
  document.addEventListener('DOMContentLoaded', function(){
	 document.head.innerHTML = "<style>" + newStyle.innerHTML + "</style>" + document.head.innerHTML;
  });
})();