/*Inicia agente virtual
Estado emocional (Feliz, Normal, Empolgado, Triste)
Posição ()
Foco (Aluno, quadro, tutor){direita, esquerda} Ok
Olhando para (Aluno, quadro, tutor){direita, esquerda} Ok
onFalando()  Ok
OnOlhandoParaMim ()  Ok*/ 
var animation = 1;
var oldAnimation = 0;
var toSpeaking = false;
var lookingTo = false;
var lookingFor = 1;// 1 = aluno 2 = tutor  3 = quadro

window.getAnimation = function(){
	return this.animation;
} 
window.getOldAnimation = function(){
	return this.oldAnimation;
} 

function onLookingToMe (){
	var look = Math.floor(Math.random() * 10);
	if(look < 7){
		//atualiza animation para a animação de olhar
		//lookingTo = true;
		//lokkingFor = 2;
	}
}

function offLookingToMe (){
	//atualiza animation para a animação para a animação padrão
	//lookingTo = false;
	//lokkingFor = 1;
}

function onSpeaking(){
	if(toSpeaking){
		//Carrega animação relacionana da ação
	}else{
		//Carrega animação de concordância
	}
}

function lookingFor(){
	var look = Math.floor(Math.random() * 10);
	if(look < 7){
		if(lookingFor > 1){
			//atualiza animation para a animação para a animação padrão
			//lookingTo = false;
			//lokkingFor = 1;
		}
	}else if(look > 6 && look < 9){
		//atualiza animation para a animação para a animação de olhar
		//lookingTo = true;
		//lokkingFor = 2;
	}else{
		//atualiza animation para a animação para a animação de olhar
		//lookingTo = true;
		//lokkingFor = 3;
	}
}

window.animationValue = function(value){
	if(animation === 1){
		oldAnimation = animation;
		animation = 2;
	}else{
		oldAnimation = animation;
		animation = 1;
	}
	oldAnimation = animation;
		animation = value;
	changeAnimation();
}

function funcaoLog(mensagem){
    var d = new Date();
    var data = d.toISOString().substring(0, 10);
	var hora = d.toTimeString().substring(0, 9);
	mensagem = data + ' ; ' + hora + ' ; '+aula+' ; ' + nome + ' ; ' + idUsuario + ' ; ' + idProcesso + ' ; ' + titulo_conteudo + ' ; ' + mensagem;
    var logMsg = null;
    if(window.ActiveXObject){
        logMsg = new ActiveXObject("Msxml2.DOMDocument.3.0");
        logMsg.async = true;
        logMsg.open("POST", "logPHP.php?msg="+mensagem);
    }else if(window.XMLHttpRequest){
        logMsg = new XMLHttpRequest();
        logMsg.open("POST", "logPHP.php?msg="+mensagem ,true);
        logMsg.send(null);
    }
};