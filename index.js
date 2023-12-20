let codigoAcessoGlobal = null;
let questaoAcessoGlobal = "";
let contadorQuestaoAcessoGlobal = 1;

// Função para gerar um código único de acesso
function gerarCodigoAcesso() {
  const timestamp = new Date().getTime();
  const codigoAleatorio = Math.floor(Math.random() * 10000);
  return `${timestamp}-${codigoAleatorio}`;
}

// Função para definir o código de acesso global
function setCodigoAcesso() {
  codigoAcessoGlobal = gerarCodigoAcesso();
}

// Função para obter o código de acesso global
function getCodigoAcesso() {
  return codigoAcessoGlobal;
}

// Função para definir o código de acesso global
function setQuestaoAcessoGlobal(valor) {
  questaoAcessoGlobal = valor;
}

// Função para obter o código de acesso global
function getQuestaoAcessoGlobal() {
  return questaoAcessoGlobal;
}

// Função para definir o código de acesso global
function setContadorQuestaoAcessoGlobal(valor) {
  contadorQuestaoAcessoGlobal = valor;
}

// Função para obter o código de acesso global
function getContadorQuestaoAcessoGlobal() {
  return contadorQuestaoAcessoGlobal;
}

//Antigo////////////////////////
function registrarEventoNoLog(textoDoEvento) {

  if (!codigoAcessoGlobal) {
    // Se não foi definido, define o código de acesso
    setCodigoAcesso();
  }

  // Obtenha o código de acesso global
  const codigoAcesso = getCodigoAcesso();

  // Crie um objeto contendo informações do evento
  const evento = {
    dateTime: new Date().toLocaleString(), // Data e hora atual
    text: textoDoEvento, // Texto associado ao evento
    codigo: codigoAcesso,
  };

  // Envie o objeto do evento para o servidor
  fetch('/log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(evento),
  })
    .then(response => {
      if (response.ok) {
        //console.log('Evento registrado com sucesso no log.');
      } else {
        //console.error('Falha ao registrar o evento no log.');
      }
    })
    .catch(error => {
      //console.error('Erro ao se comunicar com o servidor:', error);
    });
}

window.addEventListener("load", function () {
  registrarEventoNoLog('Iniciou o tutor.');

  // Obtém os parâmetros da URL
  const urlParams = new URLSearchParams(window.location.search);

  // Verifica se a variável 'meta' está presente na URL
  if (!urlParams.has('teste')) {
    // Obtém o valor da variável 'meta'
    const valorMeta = urlParams.get('teste');

    // Imprime o valor no console
    //('Valor da variável meta:', valorMeta);

    let numeroQuestoesInput = 10;
    setContadorQuestaoAcessoGlobal(1);
    fetch('/selecionarQuestoesEMontarProva', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ numeroQuestoesInput })
    })
      .then(response => response.json())
      .then(data => {
        updateQuestaoGlobal(data.vetor);
        const stepsDiv = document.getElementById('conteudoTexto');
        updateHtmlGlobal(data.html);
        stepsDiv.innerHTML = data.html;
        montarQuestao();
      });
  } else {
    fetch('/inicio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => response.json())
      .then(data => {
        const container = document.querySelector('.container');
        container.style.backgroundImage = `url(${"imgRobo/background/corredor.jpeg"})`;

        const stepsDiv = document.getElementById('conteudoTexto');
        //console.log(data);
        stepsDiv.innerHTML = data;
      });
  }
});

// Declaração da variável global
let questoesGlobal = [];

let htmlGlobal = "";

// Função para atualizar a variável global
function updateQuestaoGlobal(novoValor) {
  questoesGlobal = novoValor;
}
function updateHtmlGlobal(novoValor) {
  htmlGlobal = novoValor;
}

// Função para acessar o valor da variável global
function getQuestaoGlobal() {
  return questoesGlobal;
}
function getHtmlGlobal() {
  return htmlGlobal;
}

function montarQuestao() {

  const labelContador = document.getElementById('contadorProva');

  // Altera o valor da label para 2
  labelContador.innerHTML = getContadorQuestaoAcessoGlobal();

  let listaQuestoes = getQuestaoGlobal();
  let novoVetor = [];
  if (listaQuestoes.length > 0) {
    setContadorQuestaoAcessoGlobal(parseInt(getContadorQuestaoAcessoGlobal()) + 1);

    novoVetor.push(listaQuestoes.shift());
  } else {
    setContadorQuestaoAcessoGlobal(1);
    alert("Prova concluída. Feche esta página ou continue para fazer uma nova prova");
    window.location.reload(true);
  }
  updateQuestaoGlobal(listaQuestoes);
  const { questao, formula, titulo } = generateVariations(novoVetor[0]);
  document.getElementById('titulo').textContent = titulo;
  document.getElementById('equation').value = formula;
  setQuestaoAcessoGlobal(questao);
  document.getElementById('problema').textContent = questao;
}

function gerarProva() {
  registrarEventoNoLog('O Tutor está montando a prova.');

  const container = document.querySelector('.container');
  container.style.backgroundImage = `url(${"imgRobo/background/sala.jpeg"})`;

  const numeroQuestoesInput = document.getElementById('numeroQuetoesProvaGet').value;
  //setContadorQuestaoAcessoGlobal(numeroQuestoesInput);
  fetch('/selecionarQuestoesEMontarProva', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ numeroQuestoesInput })
  })
    .then(response => response.json())
    .then(data => {
      updateQuestaoGlobal(data.vetor);
      const stepsDiv = document.getElementById('conteudoTexto');
      updateHtmlGlobal(data.html);
      stepsDiv.innerHTML = data.html;
      montarQuestao();
    });
}

function atualizarProximaQuestao() {

  var balao = document.querySelector(".balao-de-conversa");

  balao.setAttribute("hidden", "");

  const stepsDiv = document.getElementById('conteudoTexto');
  stepsDiv.innerHTML = getHtmlGlobal();
  montarQuestao();
}

function generateVariations(question) {

  let arraysVariation = [];

  function atuaizarListaVariation(valor, variable) {
    arraysVariation.push({ valor: valor, variable: variable });
  }
  // Regex para encontrar todas as variáveis na questão
  const regex = /\$(\w+)\((\d+)-(\d+)\[(\d+)\]\)/g;

  // Função para gerar todas as variações de uma variável
  function generateVariableVariations(min, max, increment) {
    const variations = [];
    for (let i = min; i <= max; i += increment) {
      variations.push(i);
    }
    return variations;
  }

  // Função para substituir as variáveis na questão por um valor aleatório
  function replaceVariables(match, variable, min, max, increment) {
    const variations = generateVariableVariations(parseInt(min), parseInt(max), parseInt(increment));
    const randomIndex = Math.floor(Math.random() * variations.length);
    atuaizarListaVariation(variations[randomIndex], variable);
    return variations[randomIndex];
  }

  function replaceVariablesFormula(match, variable, arraysVariation) {
    const variationObject = arraysVariation.find((obj) => obj.variable === variable);
    if (variationObject) {
      return variationObject.valor;
    }
    return match; // Mantém a variável original se não encontrar no array
  }

  // Substituir as variáveis na questão
  const modifiedQuestion = question.questao.replace(regex, replaceVariables);


  // Substituir as variáveis na fórmula pelos valores sorteados
  let modifiedFormula = question.formula;
  modifiedFormula = modifiedFormula.replace(/\$(\w+)/g, (match, variable) => {

    return replaceVariablesFormula(match, variable, arraysVariation); // Substitui pela variável sorteada
  });
  return { questao: modifiedQuestion, formula: modifiedFormula, titulo: " " + question.titulo };
}

/*const question1 = {
  titulo: "Combustível Econômico:",
  questao: "João encheu o tanque do seu carro com gasolina a um custo de $a(4-6[1]),00 por litro. Ele dirigiu o carro por $b(100-600[100]) km. Sabendo que o carro de João consome $c(10-12[1]) litros por quilometro rodado, quanto equivale o custo em reais do deslocamento citado?",
  formula: "x = ($b / $c) * $a",
};

const { questao, formula } = generateVariations(question);
console.log(questao);
console.log(formula);*/

function iniciarProblemaUnitario(tipo) {
  document.getElementById('pagina').setAttribute('tipo', tipo);
  fetch('/tutor1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => response.json())
    .then(data => {
      const stepsDiv = document.getElementById('conteudoTexto');

      const container = document.querySelector('.container');
      container.style.backgroundImage = `url(${"imgRobo/background/sala.jpeg"})`;

      //console.log(data);
      stepsDiv.innerHTML = data;
    });
}

function iniciarProva(tipo) {
  registrarEventoNoLog('Iniciando a prova.');

  document.getElementById('pagina').setAttribute('tipo', tipo);
  fetch('/prova', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(response => response.json())
    .then(data => {
      const stepsDiv = document.getElementById('conteudoTexto');
      //console.log(data);
      stepsDiv.innerHTML = data;
    });
}

function randomizarExpressaoNumericaListaUnica(expressaoOriginal) {
  const expressoes = [{ expressao: expressaoOriginal, erro: "Erro na operação" }]; // Começamos com a expressão original

  const elementosTratados = expressaoOriginal.split(/([a-zA-Z]+|[0-9]+|[-+*/=])/).filter(Boolean);

  for (let i = 0; i < elementosTratados.length; i++) {
    const elemento = elementosTratados[i];
    if (/^[0-9]+$/.test(elemento)) {
      // Se encontrarmos um número, geramos uma nova expressão com uma variação desse número
      for (let variacao = -5; variacao <= 5; variacao++) {
        if (variacao !== 0) {
          const expressaoVariada = [...elementosTratados];
          expressaoVariada[i] = (parseInt(elemento) + variacao).toString();
          expressoes.push({ expressao: expressaoVariada.join(''), erro: "Erro na operação" });
        }
      }
    }
  }

  return expressoes;
}

function randomizarExpressaoNumerica(expressaoOriginal, erroSelec, listaTrocaSinal, step) {
  //console.log("Erro selec: " + erroSelec + " Passo: " + step);
  if (erroSelec == "Erro na operação") {
    //console.log("Erro na operação: " + expressaoOriginal);
    // Remova todos os espaços da expressão original
    const expressaoSemEspacos = expressaoOriginal.replace(/\s+/g, '');

    // Inicialize o vetor para armazenar os elementos tratados
    const elementosTratados = [];

    // Inicialize uma variável para rastrear números em sequência
    let numeroAtual = '';

    // Percorra a expressão caractere por caractere
    for (const char of expressaoSemEspacos) {
      // Verifique se o caractere é uma letra, número ou símbolo
      if (/[a-zA-Z]/.test(char)) {
        // É uma letra, adicione-a à sequência atual
        numeroAtual += char;
      } else if (/[0-9]/.test(char)) {
        // É um número, adicione-o à sequência atual
        numeroAtual += char;
      } else {
        // É um símbolo ou separador

        // Se tivermos um número atual, adicione-o à lista de elementos tratados
        if (numeroAtual !== '') {
          elementosTratados.push(numeroAtual);
          numeroAtual = ''; // Reinicie a sequência de números
        }

        // Adicione o símbolo à lista de elementos tratados
        elementosTratados.push(char);
      }
    }

    // Verifique novamente se temos um número atual pendente
    if (numeroAtual !== '') {
      elementosTratados.push(numeroAtual);
    }

    // Agora, elementosTratados contém os elementos separados
    /*const elementosRandomizados = elementosTratados.map(elemento => {
      if (/[0-9]/.test(elemento)) {
        // É um número, randomize-o
        const numeroOriginal = parseInt(elemento);
        const variacao = Math.floor(Math.random() * 11) - 5;
        const numeroRandomizado = numeroOriginal + variacao;
        return numeroRandomizado.toString();
      } else {
        // Não é um número, mantenha o elemento original
        return elemento;
      }
    });*/

    // Selecione todos os índices dos números na entrada
    const indicesDosNumeros = elementosTratados.map((elemento, indice) => ({ elemento, indice }))
      .filter(item => /[0-9]/.test(item.elemento))
      .map(item => item.indice);

    // Se houver números na entrada, randomize um deles
    if (indicesDosNumeros.length > 0) {
      const indiceParaRandomizar = indicesDosNumeros[Math.floor(Math.random() * indicesDosNumeros.length)];
      const numeroOriginal = parseInt(elementosTratados[indiceParaRandomizar]);
      const variacao = Math.floor(Math.random() * 11) - 5;
      elementosTratados[indiceParaRandomizar] = (numeroOriginal + variacao).toString();
    }

    // Converta o resultado de volta para uma string
    const expressaoFinal = elementosTratados.join('');

    const expressaoCorrigida = expressaoFinal.replace(/(\+{2}|-{2}|\+\-|\-\+)/g, (match) => {
      if (match === "++" || match === "--") {
        return "+";
      } else if (match === "+-" || match === "-+") {
        return "-";
      }
    });

    return expressaoCorrigida;

  } else {

    //console.log("Erro de troca de operador: " + expressaoOriginal);

    // Filtrar a lista para incluir apenas elementos com "Erro de sinal" como erro
    const elementosComErroDeSinal = listaTrocaSinal[step - 1].combinacao.arrayCombinado.filter(item => item.erro === "Troca de operador");

    // Verificar se existem elementos com "Erro de sinal"
    if (elementosComErroDeSinal.length > 0) {
      // Obtenha o comprimento da lista filtrada
      const tamanhoLista = elementosComErroDeSinal.length;

      // Gere um índice aleatório dentro do intervalo válido
      const indiceAleatorio = Math.floor(Math.random() * tamanhoLista);

      // Use o índice aleatório para acessar o elemento correspondente
      const elementoAleatorio = elementosComErroDeSinal[indiceAleatorio].expressao;

      return elementoAleatorio;
    } else {
      // Não há elementos com "Erro de sinal", retorne algo apropriado (por exemplo, uma mensagem)
      return "Anulada";
    }
  }

}

function randomizarVetor(vetor) {
  const copiaVetor = [...vetor]; // Crie uma cópia do vetor original para não modificá-lo diretamente
  const vetorRandomizado = [];

  while (copiaVetor.length > 0) {
    // Gere um índice aleatório entre 0 e o comprimento atual do vetor
    const indiceAleatorio = Math.floor(Math.random() * copiaVetor.length);

    // Adicione o elemento aleatório ao novo vetor
    vetorRandomizado.push(copiaVetor[indiceAleatorio]);

    // Remova o elemento do vetor original
    copiaVetor.splice(indiceAleatorio, 1);
  }

  return vetorRandomizado;
}

function selecionarElementosAleatorios(vetorOriginal, passoDesejado) {
  // Filtrar o vetor original com base no passo desejado
  const elementosFiltrados = vetorOriginal.filter(elemento => elemento.passo === passoDesejado);

  // Embaralhar o vetor filtrado
  elementosFiltrados.sort(() => Math.random() - 0.5);

  // Selecionar até 4 elementos
  const elementosSelecionados = elementosFiltrados.slice(0, 4);

  return elementosSelecionados;
}

function criarQuestoes(jsonPassos, jsonErros, listaTrocaSinal) {
  registrarEventoNoLog('O Tutor está criando as questões.');

  const questoes = [];
  let original = "";
  questoes.push({ 'original': jsonPassos[0].original });
  for (let i = 0; i < jsonPassos.length - 1; i++) {

    const passo = jsonPassos[i];

    // Criar um novo objeto de questão
    let questao = [{
      passo: passo.passo,
      resposta: passo.resposta.replace(/\s+/g, ''),
      tipo: 'Certo'
    }];

    // Adicionar elementos selecionados aleatoriamente
    const elementosSelecionados = selecionarElementosAleatorios(jsonErros, passo.passo);

    elementosSelecionados.forEach(step => {
      questao.push({ passo: step.passo, resposta: step.erro.replace(/\s+/g, ''), tipo: step.tipo });
    });

    while (questao.length < 5) {

      const listaErros = ["Troca de operador", "Erro na operação"];
      const indiceAleatorioListaErros = Math.floor(Math.random() * listaErros.length);
      const elementoSelecionadoListaErros = listaErros[indiceAleatorioListaErros];

      const valorProcurado = randomizarExpressaoNumerica(passo.resposta, elementoSelecionadoListaErros, listaTrocaSinal, passo.passo);

      const elementoExiste = questao.some(objeto => objeto.resposta.replace(/\s+/g, '') === valorProcurado.replace(/\s+/g, ''));

      if (!elementoExiste) {
        questao.push({ passo: passo.passo, resposta: valorProcurado.replace(/\s+/g, ''), tipo: elementoSelecionadoListaErros });
      }

    }
    questao = randomizarVetor(questao);
    // Adicionar o objeto de questão ao array
    questoes.push(questao);
  }

  return questoes;
}

function isolateTerms(expression) {
  // Remove espaços em branco e quebra a expressão em termos
  const terms = expression.replace(/\s/g, '').split(/([-+*/()=])/).filter(term => term !== '');

  // Combina símbolos adjacentes (como ++ ou -+) em um único símbolo
  let combinedTerms = [terms[0]];
  for (let i = 1; i < terms.length; i++) {
    if (['+', '-'].includes(terms[i - 1]) && ['+', '-'].includes(terms[i])) {
      combinedTerms[combinedTerms.length - 1] += terms[i];
    } else {
      combinedTerms.push(terms[i]);
    }
  }

  return combinedTerms;
}

function adjustSequentialSigns(combination) {
  let adjustedCombination = combination;

  adjustedCombination = adjustedCombination.replace(/--/g, '+');
  adjustedCombination = adjustedCombination.replace(/\+\+/g, '+');
  adjustedCombination = adjustedCombination.replace(/-\+/g, '-');
  adjustedCombination = adjustedCombination.replace(/\+-/g, '-');

  return adjustedCombination;
}

function generateSignCombinations(terms, indice, atual, saida) {
  if (indice == terms.length) {
    saida.push(adjustSequentialSigns(atual.join(' ').replace(/\s+/g, '')));
  } else {
    let atual_ = [...atual];
    atual_.push(terms[indice]);
    generateSignCombinations([...terms], indice + 1, atual_, saida);

    if (/^[+\-*/]$/.test(terms[indice].charAt(0))) {
      terms[indice] = terms[indice].replace(/-/g, '+').replace(/\+/g, '-').replace(/[*]/g, '/').replace('/', '*');

      atual_ = [...atual];
      atual_.push(terms[indice]);
      generateSignCombinations([...terms], indice + 1, atual_, saida);
    } else if (/^(?:[a-zA-Z0-9]+|\(|\{|\[)$/.test(terms[indice])) {
      terms[indice] = "-" + terms[indice];

      atual_ = [...atual];
      atual_.push(terms[indice]);
      generateSignCombinations([...terms], indice + 1, atual_, saida);
    }
  }
}

function fecharBalao() {
  var balao = document.querySelector(".balao-de-conversa");
  balao.setAttribute("hidden", "");
}

function gerarPassoQuestoes(questoesGeradas, j) {
  registrarEventoNoLog('O Tutor está gerando os distratores.');

  const urlParams = new URLSearchParams(window.location.search);

  let tipo = document.getElementById('pagina').getAttribute('tipo');

  // Verifica se a variável 'meta' está presente na URL
  if (!urlParams.has('teste')) {
    if (questoesGeradas.length > 2) {
      tipo = Math.floor(Math.random() * 2); // Isso gera 0 ou 1 aleatoriamente
      document.getElementById('pagina').setAttribute('tipo', tipo);
    } else {
      document.getElementById('pagina').setAttribute('tipo', 1);
    }
  } else {
    //console.log("Está em teste");
    tipo = document.getElementById('pagina').getAttribute('tipo');
  }

  //const tipo = document.getElementById('pagina').getAttribute('tipo');
  if (tipo == 0) {
    registrarEventoNoLog('Formato: questão objetiva.');
    let i = j;
    if (questoesGeradas.length > 1) {
      if (i == 0) {
        document.getElementById('conteudoTexto').innerHTML = getQuestaoAcessoGlobal() + "<br><br><br>O problema atual é: " + questoesGeradas[0].original + ". Entre as alternativas a seguir, qual o próximo passo correto? (Clique em uma das opções para selecioná-la). ";
        i = i + 1;
        registrarEventoNoLog('Questão:, ' + i + ', Passo atual:, ' + questoesGeradas[0].original);
      } else {
        const resposta = questoesGeradas[i - 1].find(elemento => elemento.tipo === "Certo");
        document.getElementById('conteudoTexto').innerHTML = getQuestaoAcessoGlobal() + "<br><br><br>O passo atual é: " + resposta.resposta + ". Entre as alternativa a seguir, qual o próximo passo correto? ";
        registrarEventoNoLog('Questão:, ' + i + ', Passo atual:, ' + resposta.resposta);
      }
      const stepsDiv = document.getElementById('conteudoTexto');
      let stepElement = document.createElement('p');
      stepElement.innerHTML = "A) " + questoesGeradas[i][0].resposta;
      stepsDiv.appendChild(stepElement);
      stepElement.addEventListener('click', function () {

        var balao = document.querySelector(".balao-de-conversa");

        balao.removeAttribute("hidden");

        animation = 3;
        changeAnimation();

        const chatDiv = document.getElementById('conteudoBalao');
        chatDiv.innerHTML = "Escolheu a alternativa A?";

        let bootomSA = document.createElement('p');
        bootomSA.innerHTML = '<button id="botaoASim">Sim</button>';
        chatDiv.appendChild(bootomSA);

        let bootomNA = document.createElement('p');
        bootomNA.innerHTML = '<button id="botaoBNao">Não</button>';
        chatDiv.appendChild(bootomNA);

        document.getElementById('botaoASim').addEventListener('click', function () {
          const chatDiv = document.getElementById('conteudoBalao');
          if (questoesGeradas[i][0].tipo == "Certo") {
            if (questoesGeradas.length > i + 1) {
              animation = 3;
              changeAnimation();
              chatDiv.innerHTML = "Parabéns, está correto.";
              setTimeout(fecharBalao, 3000);
              registrarEventoNoLog('Questão:, ' + i + ', Resposta:, (A), ' + questoesGeradas[i][0].resposta + ', Correto, Em andamento');
              gerarPassoQuestoes(questoesGeradas, i + 1);
            } else {
              animation = 3;
              changeAnimation();
              chatDiv.innerHTML = "Parabéns, questão completa!";
              registrarEventoNoLog('Questão:, ' + i + ', Resposta:, (A), ' + questoesGeradas[i][0].resposta + ', Correto, Concluída');
              setTimeout(atualizarProximaQuestao, 3000);
            }
          } else {
            animation = 3;
            changeAnimation();
            chatDiv.innerHTML = "A resposta está incorreta, o possível erro foi: " + questoesGeradas[i][0].tipo;
            registrarEventoNoLog('Questão:, ' + i + ', Resposta:, (A), ' + questoesGeradas[i][0].resposta + ', Incorreta, possível erro:, ' + questoesGeradas[i][0].tipo);
          }
        });
        document.getElementById('botaoANao').addEventListener('click', function () {
          balao.setAttribute("hidden", "");
        });
      });

      stepElement = document.createElement('p');
      stepElement.innerHTML = "B) " + questoesGeradas[i][1].resposta;
      stepsDiv.appendChild(stepElement);
      stepElement.addEventListener('click', function () {

        var balao = document.querySelector(".balao-de-conversa");

        balao.removeAttribute("hidden");

        animation = 3;
        changeAnimation();

        const chatDiv = document.getElementById('conteudoBalao');
        chatDiv.innerHTML = "Escolheu a alternativa B?";

        let bootomSB = document.createElement('p');
        bootomSB.innerHTML = '<button id="botaoBSim">Sim</button>';
        chatDiv.appendChild(bootomSB);

        let bootomNB = document.createElement('p');
        bootomNB.innerHTML = '<button id="botaoBNao">Não</button>';
        chatDiv.appendChild(bootomNB);

        document.getElementById('botaoBSim').addEventListener('click', function () {
          const chatDiv = document.getElementById('conteudoBalao');
          if (questoesGeradas[i][1].tipo == "Certo") {
            if (questoesGeradas.length > i + 1) {
              animation = 3;
              changeAnimation();
              chatDiv.innerHTML = "Parabéns, está correto.";
              setTimeout(fecharBalao, 3000);
              registrarEventoNoLog('Questão:, ' + i + ', Resposta:, (B), ' + questoesGeradas[i][1].resposta + ', Correto, Em andamento');
              gerarPassoQuestoes(questoesGeradas, i + 1);
            } else {
              animation = 3;
              changeAnimation();
              chatDiv.innerHTML = "Parabéns, questão completa!";
              registrarEventoNoLog('Questão:, ' + i + ', Resposta:, (B), ' + questoesGeradas[i][1].resposta + ', Correto, Concluída');
              setTimeout(atualizarProximaQuestao, 3000);
            }
          } else {
            animation = 3;
            changeAnimation();
            chatDiv.innerHTML = "A resposta está incorreta, o possível erro foi: " + questoesGeradas[i][1].tipo;
            registrarEventoNoLog('Questão:, ' + i + ' Resposta:, (B), ' + questoesGeradas[i][1].resposta + ', Incorreta, possível erro:, ' + questoesGeradas[i][1].tipo);
          }
        });
        document.getElementById('botaoBNao').addEventListener('click', function () {
          balao.setAttribute("hidden", "");
        });
      });

      stepElement = document.createElement('p');
      stepElement.innerHTML = "C) " + questoesGeradas[i][2].resposta;
      stepsDiv.appendChild(stepElement);
      stepElement.addEventListener('click', function () {

        var balao = document.querySelector(".balao-de-conversa");

        balao.removeAttribute("hidden");

        animation = 3;
        changeAnimation();

        const chatDiv = document.getElementById('conteudoBalao');
        chatDiv.innerHTML = "Escolheu a alternativa C?";

        let bootomSC = document.createElement('p');
        bootomSC.innerHTML = '<button id="botaoCSim">Sim</button>';
        chatDiv.appendChild(bootomSC);

        let bootomNC = document.createElement('p');
        bootomNC.innerHTML = '<button id="botaoCNao">Não</button>';
        chatDiv.appendChild(bootomNC);

        document.getElementById('botaoCSim').addEventListener('click', function () {
          const chatDiv = document.getElementById('conteudoBalao');
          if (questoesGeradas[i][2].tipo == "Certo") {
            if (questoesGeradas.length > i + 1) {
              animation = 3;
              changeAnimation();
              chatDiv.innerHTML = "Parabéns, está correto.";
              setTimeout(fecharBalao, 3000);
              registrarEventoNoLog('Questão:, ' + i + ', Resposta:, (C), ' + questoesGeradas[i][2].resposta + ', Correto, Em andamento');
              gerarPassoQuestoes(questoesGeradas, i + 1);
            } else {
              animation = 3;
              changeAnimation();
              chatDiv.innerHTML = "Parabéns, questão completa!";
              registrarEventoNoLog('Questão:, ' + i + ', Resposta:, (C), ' + questoesGeradas[i][2].resposta + ', Correto, Concluída');
              setTimeout(atualizarProximaQuestao, 3000);
            }
          } else {
            animation = 3;
            changeAnimation();
            chatDiv.innerHTML = "A resposta está incorreta, o possível erro foi: " + questoesGeradas[i][2].tipo;
            registrarEventoNoLog('Questão:, ' + i + ', Resposta:, (C), ' + questoesGeradas[i][2].resposta + ', Incorreta, possível erro:, ' + questoesGeradas[i][2].tipo);
          }
        });
        document.getElementById('botaoCNao').addEventListener('click', function () {
          balao.setAttribute("hidden", "");
        });
      });

      stepElement = document.createElement('p');
      stepElement.innerHTML = "D) " + questoesGeradas[i][3].resposta;
      stepsDiv.appendChild(stepElement);
      stepElement.addEventListener('click', function () {

        var balao = document.querySelector(".balao-de-conversa");

        balao.removeAttribute("hidden");

        animation = 3;
        changeAnimation();

        const chatDiv = document.getElementById('conteudoBalao');
        chatDiv.innerHTML = "Escolheu a alternativa D?";

        let bootomSD = document.createElement('p');
        bootomSD.innerHTML = '<button id="botaoDSim">Sim</button>';
        chatDiv.appendChild(bootomSD);

        let bootomND = document.createElement('p');
        bootomND.innerHTML = '<button id="botaoDNao">Não</button>';
        chatDiv.appendChild(bootomND);

        document.getElementById('botaoDSim').addEventListener('click', function () {
          const chatDiv = document.getElementById('conteudoBalao');
          if (questoesGeradas[i][3].tipo == "Certo") {
            if (questoesGeradas.length > i + 1) {
              animation = 3;
              changeAnimation();
              chatDiv.innerHTML = "Parabéns, está correto.";
              setTimeout(fecharBalao, 3000);
              registrarEventoNoLog('Questão:, ' + i + ', Resposta:, (D), ' + questoesGeradas[i][3].resposta + ', Correto, Em andamento');
              gerarPassoQuestoes(questoesGeradas, i + 1);
            } else {
              animation = 3;
              changeAnimation();
              chatDiv.innerHTML = "Parabéns, questão completa!";
              registrarEventoNoLog('Questão:, ' + i + ', Resposta:, (D), ' + questoesGeradas[i][3].resposta + ', Correto, Concluída');
              setTimeout(atualizarProximaQuestao, 3000);
            }
          } else {
            animation = 3;
            changeAnimation();
            chatDiv.innerHTML = "A resposta está incorreta, o possível erro foi: " + questoesGeradas[i][3].tipo;
            registrarEventoNoLog('Questão:, ' + i + ', Resposta:, (D), ' + questoesGeradas[i][3].resposta + ', Incorreta, possível erro:, ' + questoesGeradas[i][3].tipo);
          }
        });
        document.getElementById('botaoDNao').addEventListener('click', function () {
          balao.setAttribute("hidden", "");
        });
      });

      stepElement = document.createElement('p');
      stepElement.innerHTML = "E) " + questoesGeradas[i][4].resposta;
      stepsDiv.appendChild(stepElement);
      stepElement.addEventListener('click', function () {

        var balao = document.querySelector(".balao-de-conversa");

        balao.removeAttribute("hidden");

        animation = 3;
        changeAnimation();

        const chatDiv = document.getElementById('conteudoBalao');
        chatDiv.innerHTML = "Escolheu a alternativa E?";

        let bootomSE = document.createElement('p');
        bootomSE.innerHTML = '<button id="botaoESim">Sim</button>';
        chatDiv.appendChild(bootomSE);

        let bootomNE = document.createElement('p');
        bootomNE.innerHTML = '<button id="botaoENao">Não</button>';
        chatDiv.appendChild(bootomNE);

        document.getElementById('botaoESim').addEventListener('click', function () {
          const chatDiv = document.getElementById('conteudoBalao');
          if (questoesGeradas[i][4].tipo == "Certo") {
            if (questoesGeradas.length > i + 1) {
              animation = 3;
              changeAnimation();
              chatDiv.innerHTML = "Parabéns, está correto.";
              setTimeout(fecharBalao, 3000);
              registrarEventoNoLog('Questão:, ' + i + ', Resposta:, (E), ' + questoesGeradas[i][4].resposta + ', Correto, Em andamento');
              gerarPassoQuestoes(questoesGeradas, i + 1);
            } else {
              animation = 3;
              changeAnimation();
              chatDiv.innerHTML = "Parabéns, questão completa!";
              registrarEventoNoLog('Questão:, ' + i + ', Resposta:, (E), ' + questoesGeradas[i][4].resposta + ', Correto, Concluída');
              setTimeout(atualizarProximaQuestao, 3000);
            }
          } else {
            animation = 3;
            changeAnimation();
            chatDiv.innerHTML = "A resposta está incorreta, o possível erro foi: " + questoesGeradas[i][4].tipo;
            registrarEventoNoLog('Questão:, ' + i + ', Resposta:, (E), ' + questoesGeradas[i][4].resposta + ', Incorreta, possível erro:, ' + questoesGeradas[i][4].tipo);
          }
        });
        document.getElementById('botaoENao').addEventListener('click', function () {
          balao.setAttribute("hidden", "");
        });
      });
    }
  } else {
    registrarEventoNoLog('Formato certo ou errado.');
    let i = j;
    const stepsDiv = document.getElementById('conteudoTexto');

    if (questoesGeradas.length > 1) {
      if (i == 0) {
        stepsDiv.innerHTML =
          getQuestaoAcessoGlobal() + "<br><br><br>O problema atual é: " + questoesGeradas[0].original + ". A equação a seguir é o próximo passo correto? (Clique em uma das opções para selecioná-la) ";
        registrarEventoNoLog('Questão:, ' + i + ', Passo atual:, ' + questoesGeradas[0].original);
        i = i + 1;
      } else {
        const resposta = questoesGeradas[i - 1].find(elemento => elemento.tipo === "Certo");
        stepsDiv.innerHTML =
          getQuestaoAcessoGlobal() + "<br><br><br>O passo atual é: " + resposta.resposta + ". A equação a seguir é o próximo passo correto? ";
        registrarEventoNoLog('Questão:, ' + i + ', Passo atual:, ' + resposta.resposta);
      }

      // Crie uma cópia das alternativas para trabalhar com elas
      const alternativas = [...questoesGeradas[i]];

      // Escolha uma alternativa aleatoriamente
      const indiceAleatorio = Math.floor(Math.random() * alternativas.length);
      const alternativaAleatoria = alternativas[indiceAleatorio];

      const questoesGeradasAtualizadas = questoesGeradas.map((passo, index) => {
        if (index === i) {
          return passo.filter((_, j) => j !== indiceAleatorio); // Exclua a alternativa escolhida
        } else {
          return passo;
        }
      });

      let stepElement = document.createElement('p');
      stepElement.innerHTML = alternativaAleatoria.resposta;
      stepsDiv.appendChild(stepElement);

      // Adicione botões "Certo" e "Errado"
      let certoButtonPasso = document.createElement('p');
      //certoButtonPasso.innerHTML = '<button id="certoButtonPasso">Certo</button>';
      certoButtonPasso.innerHTML = '&#x1F44D;'; // Símbolo de polegar para cima (legal)
      stepsDiv.appendChild(certoButtonPasso);

      let erradoButtonPasso = document.createElement('p');
      //erradoButtonPasso.innerHTML = '<button id="erradoButtonPasso">Errado</button>';
      erradoButtonPasso.innerHTML = '&#x1F44E;'; // Símbolo de polegar para baixo (não gostei)
      stepsDiv.appendChild(erradoButtonPasso);

      certoButtonPasso.classList.add('certo-button-passo');
      erradoButtonPasso.classList.add('errado-button-passo');

      certoButtonPasso.addEventListener('click', function () {
        // Remova os ouvintes de eventos dos botões
        certoButtonPasso.removeEventListener('click', certoButtonPasso);
        erradoButtonPasso.removeEventListener('click', erradoButtonPasso);

        // Remova os elementos do DOM
        erradoButtonPasso.remove();

        const chatDiv = document.getElementById('conteudoBalao');
        chatDiv.innerHTML = "";

        var balao = document.querySelector(".balao-de-conversa");

        balao.removeAttribute("hidden");

        animation = 3;
        changeAnimation();

        if (alternativaAleatoria.tipo == "Certo") {
          if (questoesGeradas.length > i + 1) {
            animation = 3;
            changeAnimation();
            chatDiv.innerHTML = "Parabéns, está correto.";
            setTimeout(fecharBalao, 3000);
            registrarEventoNoLog('Questão:, ' + i + ', Resposta:, (CERTO), ' + alternativaAleatoria.resposta + ', Correto, Em andamento');
            setTimeout(function () {
              setTimeout(atualizarProximaQuestao, 3000);
              gerarPassoQuestoes(questoesGeradas, i + 1);
            }, 3000);
          } else {
            animation = 3;
            changeAnimation();
            chatDiv.innerHTML = "Parabéns, questão completa!";
            registrarEventoNoLog('Questão:, ' + i + ', Resposta:, (CERTO), ' + alternativaAleatoria.resposta + ', Correto, Concluída');
            setTimeout(atualizarProximaQuestao, 3000);
          }
        } else {
          animation = 3;
          changeAnimation();
          //console.log(questoesGeradas);
          chatDiv.innerHTML = "A resposta está incorreta, o possível erro foi: " + alternativaAleatoria.tipo;
          registrarEventoNoLog('Questão:, ' + i + ', Resposta:, (CERTO), ' + alternativaAleatoria.resposta + ', Incorreta, possível erro:, ' + alternativaAleatoria.tipo);
          setTimeout(function () {
            fecharBalao();
            gerarPassoQuestoes(questoesGeradas, j);
          }, 3000);
        }
      });

      erradoButtonPasso.addEventListener('click', function () {
        // Remova os ouvintes de eventos dos botões
        certoButtonPasso.removeEventListener('click', certoButtonPasso);
        erradoButtonPasso.removeEventListener('click', erradoButtonPasso);

        // Remova os elementos do DOM
        certoButtonPasso.remove();

        const chatDiv = document.getElementById('conteudoBalao');
        chatDiv.innerHTML = "";

        var balao = document.querySelector(".balao-de-conversa");

        balao.removeAttribute("hidden");

        animation = 3;
        changeAnimation();

        if (alternativaAleatoria.tipo != "Certo") {
          animation = 3;
          changeAnimation();
          chatDiv.innerHTML = "Parabéns, está correto. ";
          setTimeout(fecharBalao, 3000);
          registrarEventoNoLog('Questão:, ' + i + ', Resposta: (ERRADO) ' + alternativaAleatoria.resposta + ' Correto. Em andamento');
          setTimeout(function () {
            fecharBalao();
            gerarPassoQuestoes(questoesGeradasAtualizadas, j);
          }, 3000);
        } else {
          animation = 3;
          changeAnimation();
          chatDiv.innerHTML = "A resposta está incorreta, o possível erro foi: " + alternativaAleatoria.tipo;
          registrarEventoNoLog('Questão:, ' + i + ', Resposta:, (ERRADO), ' + alternativaAleatoria.resposta + ', Incorreta, possível erro:, Erro de operação ou Troca de operador');
          setTimeout(function () {
            fecharBalao();
            gerarPassoQuestoes(questoesGeradas, j);
          }, 3000);
        }
      });
    }
  }
}

function hasSingleModification(original, combination) {
  // Remove espaços em branco e comparação de strings sem espaços
  original = preprocessInput(original);
  combination = preprocessInput(combination);
  // Conta o número de diferenças entre a expressão original e a combinação
  let differences = 0;
  for (let i = 0; i < original.length; i++) {
    if (original[i] !== combination[i]) {

      differences++;
      if (differences > 1) {
        return false; // Mais de uma diferença encontrada, não é uma única modificação
      }
    }
  }

  return true; // Apenas uma diferença encontrada, é uma única modificação
}

function preprocessInput(input) {
  let output = "";
  let prevChar = ""; // Para verificar o caractere anterior

  for (let i = 0; i < input.length; i++) {
    const char = input.charAt(i);

    if (i === 0 && /[({[]\d\w]/.test(char)) {
      output += "+"; // Adicionar + no primeiro caractere se for ({[ ou alfanumérico
    }

    if (/[({[]/.test(char) && !/[-+*/\d\w]/.test(prevChar)) {
      output += "+"; // Adicionar + antes de ({[ se não houver um símbolo antes
    }

    if (/[-+*/\d\w]/.test(char) && /[({[]/.test(prevChar)) {
      output += "+"; // Adicionar + entre ({[ e números/variáveis
    }

    if (/[)\]}]/.test(char) && /[-+*/\d\w]/.test(prevChar)) {
      output += "+"; // Adicionar + entre números/variáveis e )}] se não houver símbolo depois
    }

    if (/[a-zA-Z0-9/]/.test(char) && /[=]/.test(prevChar)) {
      output += "+";
    }

    output = output.replace(/([+*])([)}\]])/g, '$2');

    output += char;
    prevChar = char;
  }

  return output;
}

function processSolutionSteps(solutionSteps, answer, original) {
  const outputData = []; // Para armazenar os resultados de cada interação
  const stepsDiv = document.getElementById('steps');
  for (let i = 0; i < solutionSteps.length; i++) {
    const solucao = solutionSteps[i].solucao;
    const solucaoString = solucao.replace(/\s+/g, ''); // Convert to string without spaces

    const isolatedTerms = isolateTerms(solucao);

    const combinations = [];
    generateSignCombinations(isolatedTerms, 0, '', combinations);
    const uniqueCombinations = [...new Set(combinations.filter(combination => combination !== solucaoString && combination !== ''))];

    const singleModifications = [];
    //console.log(uniqueCombinations);
    //console.log(`Passo ${solutionSteps[i].passo}:`);
    uniqueCombinations.forEach(combination => {
      if (hasSingleModification(solucaoString, combination)) {
        //console.log("Combinação única: " + combination);
        singleModifications.push({ expressao: combination, erro: "Troca de operador" });
      } else {
        //console.log("Combinação variada: " + combination);

      }
    });

    const listaSolucaoNumerica = randomizarExpressaoNumericaListaUnica(solucao);
    const arrayCombinado = singleModifications.concat(listaSolucaoNumerica);
    //console.log(arrayCombinado);
    const stepData = {
      passo: solutionSteps[i].passo,
      combinacao: {
        arrayCombinado
      }
    };
    outputData.push(stepData);
  }
  console.log(outputData);
  fetch('/valid', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ outputData, answer }), // Passando os valores como um objeto
  })
    .then(response => response.json())
    .then(data => {
      stepsDiv.innerHTML = stepsDiv.innerHTML;
      let stepElement = document.createElement('p');
      if (data.length > 0) {
        data.forEach(step => {
          stepElement = document.createElement('p');
          stepElement.innerHTML =
            `<br> &nbsp;&nbsp;&nbsp;&nbsp; Possível erro identificado no passo: ${step.passo} como: 》${step.erro}《, motivo: ${step.tipo} `;
          registrarEventoNoLog(`Possível erro identificado no passo:, ${step.passo}, como:, ${step.erro}, motivo:, ${step.tipo}`);
          stepsDiv.appendChild(stepElement);
        });
        stepElement = document.createElement('p');

        var balao = document.querySelector(".balao-de-conversa");

        balao.removeAttribute("hidden");

        animation = 3;
        changeAnimation();

        const chatDiv = document.getElementById('conteudoBalao');
        chatDiv.innerHTML = "Consegui identificar alguns erros possíveis, observe o quadro ao lado e tente investigar em sua solução se algum dos erros sugeridos é igual ao possível erro cometido. Após investigar os erros, você gostaria de fazer esse problema passo-a-passo?";
        registrarEventoNoLog('Tutor conseguiu indentificar automaticamente mas quer fazer passo-a-passo');
        let bootomS = document.createElement('p');
        bootomS.innerHTML = '<button id="botaoSim">Sim</button>';
        chatDiv.appendChild(bootomS);

        let bootomN = document.createElement('p');
        bootomN.innerHTML = '<button id="botaoNao">Não</button>';
        chatDiv.appendChild(bootomN);


        document.getElementById('botaoSim').addEventListener('click', function () {
          registrarEventoNoLog(`Aceitou usar o tutor para identificar o erro`);
          var balao = document.querySelector(".balao-de-conversa");

          balao.setAttribute("hidden", "");

          const questoesGeradas = criarQuestoes(original, data, outputData);

          gerarPassoQuestoes(questoesGeradas, 0);

          //console.log(questoesGeradas);
        });
        document.getElementById('botaoNao').addEventListener('click', function () {
          registrarEventoNoLog(`Não aceitou usar o tutor para identificar o erro`);
          var balao = document.querySelector(".balao-de-conversa");

          balao.setAttribute("hidden", "");

          atualizarProximaQuestao();
        });

      } else {

        var balao = document.querySelector(".balao-de-conversa");

        balao.removeAttribute("hidden");

        animation = 3;
        changeAnimation();

        const chatDiv = document.getElementById('conteudoBalao');
        chatDiv.innerHTML = "Não consegui identificar possíveis erros que geraram a resposta incorreta";
        registrarEventoNoLog('Tutor não conseguiu indentificar automaticamente mas quer fazer passo-a-passo');

        let stepElement1 = document.createElement('p');
        stepElement1.innerHTML = "Vamos tentar identificar o erro realizando os passo-a-passo juntos?";
        chatDiv.appendChild(stepElement1);

        let bootomS = document.createElement('p');
        bootomS.innerHTML = '<button id="botaoSim">Sim</button>';
        chatDiv.appendChild(bootomS);

        let bootomN = document.createElement('p');
        bootomN.innerHTML = '<button id="botaoNao">Não</button>';
        chatDiv.appendChild(bootomN);


        document.getElementById('botaoSim').addEventListener('click', function () {
          registrarEventoNoLog(`Aceitou usar o tutor para identificar o erro`);
          var balao = document.querySelector(".balao-de-conversa");

          balao.setAttribute("hidden", "");

          const questoesGeradas = criarQuestoes(original, data, outputData);

          gerarPassoQuestoes(questoesGeradas, 0);

          //console.log(questoesGeradas);
        });
        document.getElementById('botaoNao').addEventListener('click', function () {
          registrarEventoNoLog(`Não aceitou usar o tutor para identificar o erro`);
          var balao = document.querySelector(".balao-de-conversa");

          balao.setAttribute("hidden", "");

          atualizarProximaQuestao();
        });
      }
    });
}

function submiteTutor(event) {
  event.preventDefault();
  const equationInput = document.getElementById('equation');
  const equation = equationInput.value;
  const answerInput = document.getElementById('answer');
  let answer_ = answerInput.value;

  // Remover qualquer ponto utilizado como separador de milhares
  answer_ = answer_.replace(/\./g, '');

  // Substituir ',' por '.'
  answer_ = answer_.replace(',', '.');
  const answer = answer_;
  const stepsDiv = document.getElementById('steps');

  if (equation != "" && answer != "") {
    // Enviar a equação para o servidor
    fetch('/solve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ equation, answer }),
    })
      .then(response => response.json())
      .then(data => {

        //(equation + " aqui a respsota");

        stepsDiv.innerHTML = '';
        let solutionSteps = [];

        data.forEach(step => {
          const stepElement = document.createElement('p');
          if (step.descricao == "RESPOSTA INCORRETA" || step.descricao == "RESPOSTA CORRETA") {
            stepElement.innerHTML =
              `Resultado final: ${step.descricao} <p />`;
            if (step.descricao == "RESPOSTA INCORRETA") {
              registrarEventoNoLog('Resposta incorreta. Identificando causas do erro');
              stepElement.innerHTML = stepElement.innerHTML +
                `<br> Identificando causas do erro, aguarde por favor!`;
              processSolutionSteps(solutionSteps, answer, data);
            } else {

              animation = 3;
              changeAnimation();

              var balao = document.querySelector(".balao-de-conversa");

              balao.setAttribute("hidden", "");

              const chatDiv = document.getElementById('conteudoBalao');

              chatDiv.innerHTML = "Parabéns, está correto!";

              registrarEventoNoLog('Resposta correta. Reiniciando tutor');

              setTimeout(atualizarProximaQuestao, 5000);

              balao.removeAttribute("hidden");

            }
          } else if (step.passo == 1) {
            /*stepElement.innerHTML =
              `Passo ${step.passo}: 
                <br> &nbsp;&nbsp;&nbsp;&nbsp; Descrição: ${step.descricao},
                <br> &nbsp;&nbsp;&nbsp;&nbsp; Problema: 》${step.original}《,
                <br> &nbsp;&nbsp;&nbsp;&nbsp; Resultado do passo atual: 》${step.resposta}《 
              <p />`;*/
            solutionSteps.push(
              {
                passo: step.passo,
                solucao: step.resposta
              }
            )
          } else {
            /*stepElement.innerHTML =
              `Passo ${step.passo}: 
                <br> &nbsp;&nbsp;&nbsp;&nbsp; Descrição: ${step.descricao},
                <br> &nbsp;&nbsp;&nbsp;&nbsp; Valor do passo anterior: 》${step.original}《,
                <br> &nbsp;&nbsp;&nbsp;&nbsp; Resultado do passo atual: 》${step.resposta}《
              <p />`;*/
            solutionSteps.push(
              {
                passo: step.passo,
                solucao: step.resposta
              }
            )
          }

          stepsDiv.appendChild(stepElement);
        });
      });
  } else {
    alert("ERRO: Campos vazios");
  }
}

