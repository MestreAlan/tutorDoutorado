const express = require('express');
const bodyParser = require('body-parser');
const mathsteps = require('mathsteps');
const os = require('os');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Carregar as questões do arquivo JSON

app.use(express.static(__dirname));

const fs = require('fs');

const questions = JSON.parse(fs.readFileSync('base.json', 'utf8'));

app.post('/solve', (req, res) => {
  const equation = req.body.equation;
  let tempAnswer = req.body.answer

  // Substituir ',' por '.' para garantir que o parseFloat funcione corretamente
  tempAnswer = tempAnswer.replace(',', '.');

  // Arredondar o número para duas casas decimais
  if (/\.\d{3,}/.test(tempAnswer)) {
    // Arredondar o número para duas casas decimais
    tempAnswer = parseFloat(tempAnswer).toFixed(2);
  }

  const answer = tempAnswer;

  // Resolver a equação usando mathsteps
  const steps = mathsteps.solveEquation(equation);

  let solutionSteps = [];
  let contador = 1;
  let resposta_final = 'x = ?';

  steps.forEach(step => {
    solutionSteps.push({
      passo: contador,
      descricao: step.changeType,
      original: step.oldEquation.ascii(),
      resposta: step.newEquation.ascii()
    });

    resposta_final = step.newEquation.ascii();
    contador++;
  });

  let parts = resposta_final.split("=");
  let valueAfterEqualSign = parts[1].trim();

  if (parseFloat(valueAfterEqualSign) == parseFloat(answer)) {
    solutionSteps.push({ passo: contador, descricao: "RESPOSTA CORRETA" });
  } else {
    let valueAfterEqualSignEval = eval(valueAfterEqualSign);

    if (/\.\d{3,}/.test(valueAfterEqualSignEval)) {
      // Arredondar o número para duas casas decimais
      valueAfterEqualSignEval = valueAfterEqualSignEval.toFixed(2);
    }

    if (parseFloat(valueAfterEqualSignEval) != parseFloat(valueAfterEqualSign)) {
      solutionSteps.push({
        passo: contador,
        descricao: "OPERATION",
        original: parts[0] + "=" + valueAfterEqualSign,
        resposta: parts[0] + "=" + valueAfterEqualSignEval
      });
      if (parseFloat(valueAfterEqualSignEval) == parseFloat(answer)) {
        solutionSteps.push({ passo: contador, descricao: "RESPOSTA CORRETA" });
      } else {
        solutionSteps.push({ passo: contador, descricao: "RESPOSTA INCORRETA" });
      }
    } else {
      solutionSteps.push({ passo: contador, descricao: "RESPOSTA INCORRETA" });
    }
  }

  res.json(solutionSteps);
});

app.post('/valid', (req, res) => {
  const outputData = req.body.outputData;

  let tempAnswer = req.body.answer;

  // Substituir ',' por '.' para garantir que o parseFloat funcione corretamente
  tempAnswer = tempAnswer.replace(',', '.');

  if (/\.\d{3,}/.test(tempAnswer)) {
    // Arredondar o número para duas casas decimais
    tempAnswer = parseFloat(tempAnswer).toFixed(2);
  }

  const answer = tempAnswer;

  let solutionSteps = [];

  outputData.forEach(lista => {
    lista.combinacao.arrayCombinado.forEach(r_passos => {
      const steps = mathsteps.solveEquation(r_passos.expressao);

      let resposta_final = 'x = ?';
      steps.forEach(step => {
        resposta_final = step.newEquation.ascii();
      });

      let parts = resposta_final.split("=");
      let valueAfterEqualSign = parts[1].trim();

      if (parseFloat(valueAfterEqualSign) == parseFloat(answer)) {
        solutionSteps.push({ passo: lista.passo, erro: r_passos.expressao, tipo: r_passos.erro });
      } else {
        let expressao_i = r_passos.expressao.split("=");
        let expressao_f = expressao_i[1].trim();
        if (parseFloat(expressao_f) == parseFloat(answer)) {
          solutionSteps.push({ passo: lista.passo, erro: r_passos.expressao, tipo: r_passos.erro });
        }
      }
    });
  });
  res.json(solutionSteps);
});

// Função para embaralhar um array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

app.post('/selecionarQuestoesEMontarProva', (req, res) => {

  const numeroQuestoesInput = req.body.numeroQuestoesInput;

  // Verifique se o número de questões solicitadas é válido
  if (isNaN(numeroQuestoesInput) || numeroQuestoesInput <= 0 || numeroQuestoesInput > questions.length) {
    return res.status(400).json({ error: 'Número de questões inválido' });
  }

  const questoesEmbaralhadas = shuffleArray(questions);

  const questoesSelecionadas = questoesEmbaralhadas.slice(0, numeroQuestoesInput);

  const html = '<h1>Simulado <label id="contadorProva">1</label></h1>' +
    '<form id="equationForm">' +
    '<p><label for="titulo">Título:</label>' +
    '<label id="titulo" name="titulo"> Carregando...</label></p>' +

    '<p><label for="problema">Problema:</label>' +
    '<label id="problema" name="problema">Carregando...</label></p>' +

    '<p><label for="equation" hidden>Equação:</label>' +
    '<input type="text" id="equation" name="equation" hidden></p>' +

    '<p><label for="answer">Resposta:</label>' +
    '<input type="text" id="answer" name="answer" required></p>' +

    '<button type="submit" class="button" onclick="submiteTutor(event)">Resolver</button>' +
    '</form>' +
    '<h2>Passos:</h2>' +
    '<div id="steps"></div>';

  // Retornar o HTML das questões juntamente com outras informações, se necessário
  res.json({ html: html, vetor: questoesSelecionadas });
});

app.post('/inicio', (req, res) => {
  res.json(
    '<h1>Escolha uma opção a seguir:</h1>' +
    '<a href="#" onclick="iniciarProva(1);" class="button menu">Fazer simulado R/R</a><br>' +
    '<a href="#" onclick="iniciarProblemaUnitario(1);" class="button menu">Inserir problema e resposta R/R</a><br>' +
    '<a href="#" onclick="iniciarProva(0);" class="button menu">Fazer simulado</a><br>' +
    '<a href="#" onclick="iniciarProblemaUnitario(0);" class="button menu">Inserir problema e resposta</a>'
  );
});

app.post('/prova', (req, res) => {
  let resposta =
    '<h1>Quantas questões você quer no simulado?</h1>' +
    '<form onsubmit="gerarProva(); return false;">' +
    '<input type="number" value="1" id="numeroQuetoesProvaGet" name="numeroQuetoesProvaGet" min="1" max="' + questions.length + '" required>' +
    '<input type="submit" value="Gerar simulado" >' +
    '</form>'
  res.json(resposta);

});

app.post('/tutor1', (req, res) => {
  let resposta =
    '<h1>Insira o problema e sua resposta a seguir:</h1>' +
    '<form id="equationForm">' +
    '<label for="equation">Equação:</label>' +
    '<input type="text" id="equation" name="equation" required>' +

    '<label for="answer">Resposta:</label>' +
    '<input type="text" id="answer" name="answer" required>' +

    '<button type="submit" class="button" onclick="submiteTutor(event)">Resolver</button>' +
    '</form>' +
    //'<h2>Passos:</h2>' +
    '<div id="steps"></div>';
  res.json(resposta);

});

const logFilePath = 'log.json';

app.post('/log', (req, res) => {
  const { dateTime, text } = req.body;

  const networkInterfaces = os.networkInterfaces();

  // Procura por um endereço IP público
  let clientIP = '';
  for (const key in networkInterfaces) {
    for (const iface of networkInterfaces[key]) {
      if (!iface.internal && iface.family === 'IPv4') {
        clientIP = iface.address;
        break;
      }
    }
  }

  if (!clientIP) {
    // Caso não encontre um IP público, você pode definir um valor padrão
    clientIP = 'IP desconhecido';
  }

  // Ler o arquivo JSON existente (se houver)
  let logs = [];
  try {
    const data = fs.readFileSync(logFilePath, 'utf8');
    logs = JSON.parse(data);
  } catch (err) {
    // O arquivo não existe ou está vazio
  }

  // Adicionar o novo log aos registros
  logs.push({ ip: clientIP, dateTime, text });

  // Salvar os registros atualizados de volta no arquivo JSON
  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));

  res.send('Log salvo com sucesso!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
