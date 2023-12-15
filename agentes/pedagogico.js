/*Inicio funções para contexto de atividades em json*/
function chamarDependencias(){
	$.ajax({ 
		url: baseDados, 
		dataType: 'json',  
		async: false, 
		success: function(dominio){ 
			dependencias = dominio.dependencias;
		} 
	});
}

function inicializarInfo(){
	$.ajax({ 
		url: baseDados, 
		dataType: 'json',  
		async: false, 
		success: function(dominio){ 
			aula = dominio.nomeAula;
			chamarAtualizacaoInfo();
		}
	});
}

function chamarAtualizacaoInfo(){
	$.ajax({ 
		url: baseDados, 
		dataType: 'json',  
		async: false, 
		success: function(dominio){ 
			for(var i=0;i<dominio.atividades.length;i++){// Procura por todos os recursos
				if(dominio.atividades[i].id == idAula){// Verifica se existe id nas atividades
					//Variáveis do controlador
					id_conteudo = dominio.atividades[i].id; //id
					codigo_conteudo = dominio.atividades[i].codigo; //codigo
					titulo_conteudo = dominio.atividades[i].titulo; //titulo
					contexto_conteudo = dominio.atividades[i].contexto; //contexto
					atividades_conteudo = dominio.atividades[i].atividades; //atividades
					resumo_conteudo = dominio.atividades[i].resumo; //resumo
					links_conteudo = dominio.atividades[i].links; //links
					i=dominio.atividades.length;
				}
			}
		} 
	});
}

function chamarBotoesSumario(){
	$.ajax({ 
		url: baseDados, 
		dataType: 'json',  
		async: false, 
		success: function(dominio){ 
			botoes = [];
			for(var i=0;i<dominio.atividades.length;i++){// Procura por todos os recursos
				if(dominio.atividades[i].id == idAula){// Verifica se existe id nas atividades
					for(var j=0;j<dominio.atividades[i].atividades.length;j++){// Procura por opções para usuário
						for(var k=0;k<dominio.atividades.length;k++){
							if(dominio.atividades[k].id == dominio.atividades[i].atividades[j]){// Verifica se existe id nas atividades
								botoes.push(dominio.atividades[k].id);
								botoes.push(dominio.atividades[k].contexto);
								botoes.push(dominio.atividades[k].titulo);
								botoes.push(dominio.atividades[k].resumo);
								k = dominio.atividades.length;
							}
						}
					}
					i = dominio.atividades.length;
				}
			}
		} 
	});
}

function montarSumarioPrincipal(){
	chamarBotoesSumario();
	var sumario = "<b>Etapas:</b><BR><BR>"
	var i=0,j=1;
	for(i;i<botoes.length;i=i+4,j++){
		sumario = sumario+" "+j+" "+"<a href='javascript:abrirPagina(\"assets/templates/intro.html\");' onclick='idAula="+botoes[i]+"; chamarAtualizacaoInfo(); funcaoLog(\"Selec_pag(intro-"+botoes[i+2]+")\"); funcaoLog(\"Saiu_pagina\"); animationValue(3);'>"+botoes[i+3]+"</a><BR>";
	}
	sumario = sumario+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	return sumario;
}

function montarSumarioSecundario(){
	chamarBotoesSumario();
	var sumario = "<b>Etapa "+resumo_conteudo+":</b><BR><BR><ul>"
	var i=0,j=1;
	for(i;i<botoes.length;i=i+4,j++){
		sumario = sumario+"<li><a href='javascript:abrirPagina(\"assets/templates/explicacao_recurso.html\");' onclick='idAula="+botoes[i]+"; chamarAtualizacaoInfo(); funcaoLog(\"Selec_pag(intro-"+botoes[i+2]+")\"); funcaoLog(\"Saiu_pagina\"); animationValue(3);'>"+botoes[i+3]+"</a><BR>"+
			"&nbsp;&nbsp;&nbsp;-"+botoes[i+1]+"</li>";
	}
	sumario = sumario+"</ul>"+
	"<button class='btn btn-primary' onclick='idAula=3;  chamarAtualizacaoInfo(); abrirPagina(\"assets/templates/sumario.html\"); funcaoLog(\"Concluiu_missao("+botoes[i+2]+")\"); funcaoLog(\"Saiu_pagina\"); animationValue(1);'>Concluir missão</button>";
	return sumario;
}
/*Fim funções para contexto de atividades em json*/