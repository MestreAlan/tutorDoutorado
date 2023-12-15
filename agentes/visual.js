/**Dados est�ticos*/
var head = ["imgRobo/cabeca/head0001.png","imgRobo/cabeca/head0002.png","imgRobo/cabeca/head0003.png","imgRobo/cabeca/head0004.png","imgRobo/cabeca/head0005.png","imgRobo/cabeca/head0006.png"];//Vetor com todas as imagens de cabe�a
var arm = ["imgRobo/braco/arm0001.png","imgRobo/braco/arm0002.png","imgRobo/braco/arm0003.png","imgRobo/braco/arm0004.png","imgRobo/braco/arm0005.png","imgRobo/braco/arm0006.png","imgRobo/braco/arm0007.png","imgRobo/braco/arm0008.png",
"imgRobo/braco/arm0009.png","imgRobo/braco/arm0010.png","imgRobo/braco/arm0011.png","imgRobo/braco/arm0012.png","imgRobo/braco/arm0013.png","imgRobo/braco/arm0014.png","imgRobo/braco/arm0015.png","imgRobo/braco/arm0016.png","imgRobo/braco/arm0017.png",
"imgRobo/braco/arm0018.png","imgRobo/braco/arm0019.png","imgRobo/braco/arm0020.png","imgRobo/braco/arm0021.png","imgRobo/braco/arm0022.png","imgRobo/braco/arm0023.png","imgRobo/braco/arm0024.png","imgRobo/braco/arm0025.png","imgRobo/braco/arm0026.png"];//Vetor com todas as imagens de bra�o
var trunk = ["imgRobo/peito/body0001.png"];//Vetor com todas as imagens de peito

/**Vari�veis de suporte*/
var animation;//Id da a��o atual
var oldAnimation;
//Variaveis da anima��o da cabe�a
var animationHead;
var selectedAnimationHead;
var lengthPosiHead;
var imgPosiHead;
var loopHead;
var loopHeadTimes;
//Variaveis da anima��o do tronco
var animationTrunk;
var selectedAnimationTrunk;
var lengthPosiTrunk;
var imgPosiTrunk;
var loopTrunk;
var loopTrunkTimes;
//Variaveis da anima��o do bra�o esquerdo
var animationLeftArm;
var selectedAnimationLeftArm;
var lengthPosiLeftArm;
var imgPosiLeftArm;
var loopLeftArm;
var loopLeftArmTimes;
//Variaveis da anima��o do bra�o direito
var animationRightArm;
var selectedAnimationRightArm;
var lengthPosiRightArm;
var imgPosiRightArm;
var loopRightArm;
var loopRightArmTimes;

/**Anima��es por parte*/
/*Obs: Anima��es devem ser postas do fim do vetor para o in�cio, a posi��o 0 fica o tempo do frame da anima��o*/
/*Head*/
var toSpeak1 = [2,1,0,2,1,0,0.1];//Anima��o falando
var toSpeak2 = [2,1,0,2,4,3,0.1];//Anima��o falando
var toSpeak3 = [2,1,0,5,4,0,0.1];//Anima��o falando
var toSpeak4 = [2,1,3,5,1,0,0.1];//Anima��o falando
var toSpeak5 = [2,4,3,2,1,0,0.1];//Anima��o falando
var staid1 = [0,0,0,0,0,0,0.1];//Anima��o piscando serio
var staid2 = [0,0,0,0,3,3,0.1];//Anima��o piscando serio
var staid3 = [0,0,0,3,3,0,0.1];//Anima��o piscando serio
var staid4 = [0,0,3,3,0,0,0.1];//Anima��o piscando serio
var staid5 = [0,3,3,0,0,0,0.1];//Anima��o piscando serio

/*Arm*/
//Left
var armLeftRelaxed = [7,6,5,4,7,6,5,4,0.2];//Anima��o do bra�o relaxado
var armLeftRelaxed2 = [4,4,4,4,4,4,0.1];
var armLeftExpose = [16,16,16,15,14,13,12,11,10,9,8,0.12];
//Right
var armRightRelaxed = [3,2,1,0,3,2,1,0,0.2];//Anima��o do bra�o relaxado
var armRightRelaxed2 = [0,0,0,0,0,0,0.1];
var armRightExpose = [25,25,25,24,23,22,21,20,19,18,17,0.12];

/*Trunk*/
var staticTrunk = [0,0.1];

/**Anima��es*/
/*Obs: As anima��es seguem a seguinte estrutura, chamando os vetores de anima��es mais o tempo de execu��o: cabe�a++++, peito, bra�oE, bra�oD e tempo de execu��o*/
/*Anima��es padr�es*/
//head
var headRelaxed = [staid1,staid2,staid3,staid4,staid5,true,0];
var headSpeaking = [toSpeak1,toSpeak2,toSpeak3,toSpeak4,toSpeak5,true,0];
var headSpeakingTemporary = [toSpeak1,toSpeak2,toSpeak3,toSpeak4,toSpeak5,false,5];
//arm left
var leftArmPosiRelaxed = [armLeftRelaxed, armLeftRelaxed2, true, 0];
var leftArmPosiPresenting = [armLeftRelaxed, armLeftRelaxed2, armLeftExpose, true, 0];
var leftArmPosiPresentingTemporary = [armLeftRelaxed, armLeftRelaxed2, armLeftExpose, false, 3];
//arm right
var rightArmPosiRelaxed = [armRightRelaxed, armRightRelaxed2, true, 0];
var rightArmPosiPresenting = [armRightRelaxed, armRightRelaxed2, armRightExpose, true, 0];
var rightArmPosiPresentingTemporary = [armRightRelaxed, armRightRelaxed2, armRightExpose, false, 3];
//trunk
var trunkOff = [staticTrunk, false, 1];

/*anima��es de intera��o com outros objetos e personagens*/

/*anima��o pontual*/

/**Fun��es auxiliares de modifica��o de expres�o*/
function changeHead() {
	if(imgPosiHead > 0){
            document.getElementById("cabeca").src=head[animationHead[selectedAnimationHead][imgPosiHead]];
            imgPosiHead -= 1;
            setTimeout(function(){changeHead();},animationHead[selectedAnimationHead][lengthPosiHead+1]*1000);
	}else if(imgPosiHead === 0 && loopHead){
            document.getElementById("cabeca").src=head[animationHead[selectedAnimationHead][imgPosiHead]];
            var aux = animationHead.length-2;
            selectedAnimationHead = Math.floor(Math.random() * aux);
            lengthPosiHead = animationHead[selectedAnimationHead].length-2;
            imgPosiHead = lengthPosiHead;
            setTimeout(function(){changeHead();},animationHead[selectedAnimationHead][lengthPosiHead+1]*1000);
	}else if(imgPosiHead === 0 && !loopHead && loopHeadTimes > 0){
            document.getElementById("cabeca").src=head[animationHead[selectedAnimationHead][imgPosiHead]];
            var aux = animationHead.length-2;
            selectedAnimationHead = Math.floor(Math.random() * aux);
            lengthPosiHead = animationHead[selectedAnimationHead].length-2;
            imgPosiHead = lengthPosiHead;
            loopHeadTimes -= 1;
            setTimeout(function(){changeHead();},animationHead[selectedAnimationHead][lengthPosiHead+1]*1000);
	}else if(imgPosiHead === 0 && !loopHead && loopHeadTimes === 0){
            animation = 1;
            updateHead();
            setTimeout(function(){changeHead();}, 0.5*1000);
        }else{
            updateHead();
            setTimeout(function(){changeHead();}, 0.5*1000);
	}
}
function changeTrunk() {
	if(imgPosiTrunk > 0){
            document.getElementById("peito").src=trunk[animationTrunk[selectedAnimationTrunk][imgPosiTrunk]];
            imgPosiTrunk -= 1;
            setTimeout(function(){changeTrunk();},animationTrunk[selectedAnimationTrunk][lengthPosiTrunk+1]*1000);
	}else if(imgPosiTrunk === 0 && loopTrunk){
            document.getElementById("peito").src=trunk[animationTrunk[selectedAnimationTrunk][imgPosiTrunk]];
            var aux = animationTrunk.length-2;
            selectedAnimationTrunk = Math.floor(Math.random() * aux);
            lengthPosiTrunk = animationTrunk[selectedAnimationTrunk].length-2;
            imgPosiTrunk = lengthPosiTrunk;
            setTimeout(function(){changeTrunk();},animationTrunk[selectedAnimationTrunk][lengthPosiTrunk+1]*1000);
	}else if(imgPosiTrunk === 0 && !loopTrunk && loopTrunkTimes > 0){
            document.getElementById("peito").src=trunk[animationTrunk[selectedAnimationTrunk][imgPosiTrunk]];
            var aux = animationTrunk.length-2;
            selectedAnimationTrunk = Math.floor(Math.random() * aux);
            lengthPosiTrunk = animationTrunk[selectedAnimationTrunk].length-2;
            imgPosiTrunk = lengthPosiTrunk;
            loopTrunkTimes -= 1;
            setTimeout(function(){changeTrunk();},animationTrunk[selectedAnimationTrunk][lengthPosiTrunk+1]*1000);
	}else if(imgPosiTrunk === 0 && !loopTrunk && loopTrunkTimes === 0){
            animation = 0;
            updateTrunk();
            setTimeout(function(){changeTrunk();}, 0.5*1000);
        }else{
            updateTrunk();
            setTimeout(function(){changeTrunk();}, 0.5*1000);
	}
}
function changeLeftArm() {
	if(imgPosiLeftArm > 0){
            document.getElementById("bracoE").src=arm[animationLeftArm[selectedAnimationLeftArm][imgPosiLeftArm]];
            imgPosiLeftArm -= 1;
            setTimeout(function(){changeLeftArm();},animationLeftArm[selectedAnimationLeftArm][lengthPosiLeftArm+1]*1000);
	}else if(imgPosiLeftArm === 0 && loopLeftArm){
            document.getElementById("bracoE").src=arm[animationLeftArm[selectedAnimationLeftArm][imgPosiLeftArm]];
            var aux = animationLeftArm.length-2;
            selectedAnimationLeftArm = Math.floor(Math.random() * aux);
            lengthPosiLeftArm = animationLeftArm[selectedAnimationLeftArm].length-2;
            imgPosiLeftArm = lengthPosiLeftArm;
            setTimeout(function(){changeLeftArm();},animationLeftArm[selectedAnimationLeftArm][lengthPosiLeftArm+1]*1000);
	}else if(imgPosiLeftArm === 0 && !loopLeftArm && loopLeftArmTimes > 0){
            document.getElementById("bracoE").src=arm[animationLeftArm[selectedAnimationLeftArm][imgPosiLeftArm]];
            var aux = animationLeftArm.length-2;
            selectedAnimationLeftArm = Math.floor(Math.random() * aux);
            lengthPosiLeftArm = animationLeftArm[selectedAnimationLeftArm].length-2;
            imgPosiLeftArm = lengthPosiLeftArm;
            loopLeftArmTimes -= 1;
            setTimeout(function(){changeLeftArm();},animationLeftArm[selectedAnimationLeftArm][lengthPosiLeftArm+1]*1000);
	}else if(imgPosiLeftArm === 0 && !loopLeftArm && loopLeftArmTimes === 0){
            animation = 1;
            updateLeftArm();
            setTimeout(function(){changeLeftArm();}, 0.5*1000);
        }else{
            updateLeftArm();
            setTimeout(function(){changeLeftArm();}, 0.5*1000);
	}
}
function changeRightArm() {
	if(imgPosiRightArm > 0){
            document.getElementById("bracoD").src=arm[animationRightArm[selectedAnimationRightArm][imgPosiRightArm]];
            imgPosiRightArm -= 1;
            setTimeout(function(){changeRightArm();},animationRightArm[selectedAnimationRightArm][lengthPosiRightArm+1]*1000);
	}else if(imgPosiRightArm === 0 && loopRightArm){
            document.getElementById("bracoD").src=arm[animationRightArm[selectedAnimationRightArm][imgPosiRightArm]];
            var aux = animationRightArm.length-2;
            selectedAnimationRightArm = Math.floor(Math.random() * aux);
            lengthPosiRightArm = animationRightArm[selectedAnimationRightArm].length-2;
            imgPosiRightArm = lengthPosiRightArm;
            setTimeout(function(){changeRightArm();},animationRightArm[selectedAnimationRightArm][lengthPosiRightArm+1]*1000);
	}else if(imgPosiRightArm === 0 && !loopRightArm && loopRightArmTimes > 0){
            document.getElementById("bracoD").src=arm[animationRightArm[selectedAnimationRightArm][imgPosiRightArm]];
            var aux = animationRightArm.length-2;
            selectedAnimationRightArm = Math.floor(Math.random() * aux);
            lengthPosiRightArm = animationRightArm[selectedAnimationRightArm].length-2;
            imgPosiRightArm = lengthPosiRightArm;
            loopRightArmTimes -= 1;
            setTimeout(function(){changeRightArm();},animationRightArm[selectedAnimationRightArm][lengthPosiRightArm+1]*1000);
	}else if(imgPosiRightArm === 0 && !loopRightArm && loopRightArmTimes === 0){
            animation = 1;
            updateRightArm();
            setTimeout(function(){changeRightArm();}, 0.5*1000);
        }else{
            updateRightArm();
            setTimeout(function(){changeRightArm();}, 0.5*1000);
	}
}
function updateAnimation(animat, posi){
	//if(oldAnimation != animation){
		var aux;
		if(posi === 1){//Cabe�a
			animationHead = animat;
			aux = animationHead.length-2;
			selectedAnimationHead = Math.floor(Math.random() * aux);
			lengthPosiHead = animationHead[selectedAnimationHead].length-2;
			imgPosiHead = lengthPosiHead; 
			loopHead = animationHead[animationHead.length-2];
                        loopHeadTimes = animationHead[animationHead.length-1];
		}else if(posi === 2){//Peito
			animationTrunk = animat;
			aux = animationTrunk.length-2;
			selectedAnimationTrunk = Math.floor(Math.random() * aux);
			lengthPosiTrunk = animationTrunk[selectedAnimationTrunk].length-2;
			imgPosiTrunk = lengthPosiTrunk; 
			loopTrunk = animationTrunk[animationTrunk.length-2];
                        loopTrunkTimes = animationTrunk[animationTrunk.length-1];
		}else if(posi === 3){//Bra�o esquerdo
			animationLeftArm = animat;
			aux = animationLeftArm.length-2;
			selectedAnimationLeftArm = Math.floor(Math.random() * aux);
			lengthPosiLeftArm = animationLeftArm[selectedAnimationLeftArm].length-2;
			imgPosiLeftArm = lengthPosiLeftArm; 
			loopLeftArm = animationLeftArm[animationLeftArm.length-2];
                        loopLeftArmTimes = animationLeftArm[animationLeftArm.length-1];
		}else if(posi === 4){//Bra�o direito
			animationRightArm = animat;
			aux = animationRightArm.length-2;
			selectedAnimationRightArm = Math.floor(Math.random() * aux);
			lengthPosiRightArm = animationRightArm[selectedAnimationRightArm].length-2;
			imgPosiRightArm = lengthPosiRightArm; 
			loopRightArm = animationRightArm[animationRightArm.length-2];
                        loopRightArmTimes = animationRightArm[animationRightArm.length-1];
		}
	//}
}


/**Fun��es de anima��o*/
function updateHead(){
		if(animation === 1){//Anima��o relaxada
			updateAnimation(headRelaxed, 1);
		}else if(animation === 2){//Anima��o apresentando
			updateAnimation(headSpeaking, 1);
		}else if(animation === 3){//Anima��o falando pouco
			updateAnimation(headSpeakingTemporary, 1);
		}
}
function updateTrunk(){
	if(animation === 1){//Anima��o relaxada
		updateAnimation(trunkOff, 2);
	}else if(animation === 2){//Anima��o apresentando
		updateAnimation(trunkOff, 2);
	}else if(animation === 3){//Anima��o falando pouco
		updateAnimation(trunkOff, 2);
	}
} 
function updateLeftArm(){
	if(animation === 1){//Anima��o relaxada
		updateAnimation(leftArmPosiRelaxed, 3);
	}else if(animation === 2){//Anima��o apresentando
		updateAnimation(leftArmPosiPresenting, 3);
	}else if(animation === 3){//Anima��o falando pouco
		updateAnimation(leftArmPosiPresentingTemporary, 3);
	}
} 
function updateRightArm(){
	if(animation === 1){//Anima��o relaxada
		updateAnimation(rightArmPosiRelaxed, 4);
	}else if(animation === 2){//Anima��o apresentando
		updateAnimation(rightArmPosiPresenting, 4);
	}else if(animation === 3){//Anima��o falando pouco
		updateAnimation(rightArmPosiPresentingTemporary, 4);
	}
}  

/**Fun��o controladora*/
window.onload = function comecar(){
	updateHead();
	updateTrunk();
	updateLeftArm();
	updateRightArm();
	setTimeout(function(){
		changeHead();
		changeTrunk();
		changeLeftArm();
		changeRightArm();
		}, 0.5*1000);
	
}

window.changeAnimation = function(){
	updateHead();
	updateTrunk();
	updateLeftArm();
	updateRightArm();
};


/*
function comecar(){
	
	animacao(posiRelaxed);
	
	if(!ativacaoAnimacao && !estadoAnimacao){
		ativacaoAnimacao = true;
		estadoAnimacao = true;
		tempo = document.getElementById("tempo").value;
		setTimeout(mudarRosto,temporizadorRosto*1000);
		setTimeout(mudarBE,temporizadorBE*1000);
		setTimeout(mudarBD,temporizadorBD*1000);
		contRegre();
	}
}     

function parar(){
	ativacaoAnimacao = false;
	estadoAnimacao = false;
	var contexto = ["", "", ""];
	document.getElementById("rosto1").src = posiInicial[0];
	document.getElementById("bracoE1").src = posiInicial[1];
	document.getElementById("bracoD1").src = posiInicial[2]; 
	tempo = 0;   
	document.getElementById("tempo").value = tempo;
}

function pausar(){
	if(ativacaoAnimacao){
		estadoAnimacao = false;
		contexto[0] = document.getElementById("rosto1").src;
		document.getElementById("rosto1").src = pausado[0];
		contexto[1] = document.getElementById("bracoE1").src;
		document.getElementById("bracoE1").src = pausado[2];
		contexto[2] = document.getElementById("bracoD1").src;
		document.getElementById("bracoD1").src = pausado[1];    
	}
}

function continuar(){
	if(ativacaoAnimacao && !estadoAnimacao){
		estadoAnimacao = true;
		document.getElementById("rosto1").src = contexto[0];
		document.getElementById("bracoE1").src = contexto[1];
		document.getElementById("bracoD1").src = contexto[2];
		contRegre();
	}
}*/
