/* ==================================================================
   DADOS DA FORMATURA
   ------------------------------------------------------------------
   Este é o único arquivo que você precisa editar.
   Já são reais: hospital, data, horário de início, local e a regra do ingresso.
   O que ainda é EXEMPLO está marcado com "EXEMPLO" no comentário.

   Dicas:
   - Mantenha as aspas "..." e as vírgulas no fim de cada linha.
   - Datas no formato "AAAA-MM-DD"; horários no formato "HH:MM".
   - Para tirar um campo opcional, apague a linha inteira.
   - Para tirar uma seção inteira do site, deixe a lista dela vazia: [].
   ================================================================== */

window.FORMATURA = {
  // Mostra um aviso "dados de exemplo" no canto da tela. Mude para false quando terminar.
  exemplo: true,

  // Tela de abertura com o selo ("Abrir convite"). Mude para false para entrar direto no site.
  abertura: true,

  instituicao: "Hospital Infantil Cândido Fontoura",
  programa: "Residência Médica em Pediatria",
  especialidade: "Pediatria",
  turma: "2024-2027", // EXEMPLO: confirmar os anos da turma

  capa: {
    // Opcional: foto da turma no fundo da capa (fica escurecida e em preto e branco).
    // Coloque a imagem em assets/fotos/ e escreva o caminho, ex.: "assets/fotos/turma.jpg".
    foto: "",
  },

  evento: {
    data: "2027-02-26",
    inicio: "20:00",
    fim: "02:00", // EXEMPLO: horário de término (se passar da meia-noite, o site entende que é no dia seguinte)
    fuso: -3, // horas em relação ao UTC. Brasília = -3, Manaus = -4, Acre = -5
  },

  // EXEMPLO: texto do convite
  convite: {
    titulo: "Depois de três anos de residência, chegou a hora de comemorar.",
    texto: [
      "Foram três anos de plantão que virava madrugada, de puericultura, de UTI neonatal e de muita mãe perguntando “doutora, ele está bem?”.",
      "Agora a gente quer comemorar com quem esteve perto: a família, os amigos, os preceptores e todo mundo que segurou as pontas enquanto a gente estudava. Venha jantar e dançar com a gente.",
    ],
    assinatura: "Com carinho, a turma",
  },

  // EXEMPLO: só o início às 20h é real. Troque pelos horários de verdade.
  programacao: [
    { hora: "20:00", titulo: "Recepção", texto: "Chegada dos convidados." },
    { hora: "20:30", titulo: "Cerimônia", texto: "Entrada da turma, juramento e entrega dos certificados." },
    { hora: "21:30", titulo: "Jantar", texto: "" },
    { hora: "23:00", titulo: "Festa", texto: "Pista aberta." },
  ],

  // São 8 residentes. Só o primeiro nome é real; troque os outros quando tiver.
  // "proximoPasso" e "frase" são opcionais: apague a linha ou deixe "" para não aparecer.
  // "foto": coloque a imagem em assets/fotos/ e escreva o caminho, ex.: "assets/fotos/ana.jpg".
  formandos: [
    { nome: "Ana Luisa", proximoPasso: "Próximo passo", frase: "Uma frase dela aqui.", foto: "" },
    { nome: "Fulano de Tal", proximoPasso: "Próximo passo", frase: "Uma frase dele aqui.", foto: "" },
    { nome: "Ciclano de Tal", proximoPasso: "Próximo passo", frase: "Uma frase dele aqui.", foto: "" },
    { nome: "Beltrano de Tal", proximoPasso: "Próximo passo", frase: "Uma frase dele aqui.", foto: "" },
    { nome: "Fulana de Tal", proximoPasso: "Próximo passo", frase: "Uma frase dela aqui.", foto: "" },
    { nome: "Ciclana de Tal", proximoPasso: "Próximo passo", frase: "Uma frase dela aqui.", foto: "" },
    { nome: "Beltrana de Tal", proximoPasso: "Próximo passo", frase: "Uma frase dela aqui.", foto: "" },
    { nome: "Sicrana de Tal", proximoPasso: "Próximo passo", frase: "Uma frase dela aqui.", foto: "" },
  ],

  // EXEMPLO. Um cartão por ano da residência.
  retrospectiva: [
    { ano: "2024", titulo: "R1", texto: "O primeiro plantão sozinho na enfermaria e a descoberta de que criança não é adulto pequeno." },
    { ano: "2025", titulo: "R2", texto: "Um ano entre a UTI neonatal e a sala de parto, fazendo conta de dose por quilo de madrugada." },
    { ano: "2026", titulo: "R3", texto: "Ambulatórios de especialidade e a vez de ensinar os R1 que chegavam." },
  ],

  // EXEMPLO. Fotos da turma. "foto" é o caminho da imagem; sem ela aparece só a moldura com a legenda.
  galeria: [
    { legenda: "Primeiro dia de R1", foto: "" },
    { legenda: "Plantão de Natal", foto: "" },
    { legenda: "Congresso de Pediatria", foto: "" },
    { legenda: "Churrasco da turma", foto: "" },
    { legenda: "Último plantão", foto: "" },
  ],

  // A turma não tem paraninfa, patrono nem homenageados, então a lista fica vazia e a seção some.
  // Se mudar de ideia: { papel: "Paraninfa", nome: "Dra. Fulana", descricao: "Neonatologista" },
  homenageados: [],

  // EXEMPLO. Agradecimentos da turma. A lista é livre: dá para incluir "A Deus", "Aos amigos" etc.
  agradecimentos: [
    { a: "Aos nossos pais", texto: "Vocês pagaram a conta de muita coisa, inclusive da nossa ausência nos almoços de domingo. Metade deste certificado é de vocês." },
    { a: "Aos preceptores", texto: "Vocês ensinaram à beira do leito e corrigiram prescrição às três da manhã. Confiaram na gente antes de a gente confiar." },
    { a: "Aos pequenos pacientes e suas famílias", texto: "Obrigado por deixarem a gente aprender cuidando de vocês, muitas vezes no pior dia da família." },
    { a: "À enfermagem", texto: "Por cada veia difícil pega de primeira e por cada aviso dado a tempo." },
  ],

  // Frase de destaque (opcional). Apague o bloco inteiro para tirar.
  epigrafe: {
    texto: "Prometo que, ao exercer a arte de curar, mostrar-me-ei sempre fiel aos preceitos da honestidade, da caridade e da ciência.",
    fonte: "Juramento de Hipócrates",
  },

  local: {
    nome: "Oca Tupiniquim",
    endereco: "Rua Fradique Coutinho, 1379 · Vila Madalena · CEP 05416-011",
    cidade: "São Paulo/SP",
    // Texto usado para buscar no mapa (pode ser o nome do lugar + cidade)
    busca: "Oca Tupiniquim, Rua Fradique Coutinho, 1379, Vila Madalena, São Paulo, SP",
    traje: "Black tie", // EXEMPLO: confirmar o traje
  },

  duvidas: [
    { pergunta: "Posso levar acompanhante?", resposta: "Não. A entrada é só com ingresso." },
    { pergunta: "A que horas começa?", resposta: "Às 20h." },
    { pergunta: "Onde é?", resposta: "Na Oca Tupiniquim, Rua Fradique Coutinho, 1379, Vila Madalena." },
    // EXEMPLO: confirmar o traje
    { pergunta: "Qual é o traje?", resposta: "Black tie: vestido longo ou smoking. Terno escuro com gravata também vale." },
  ],
};
