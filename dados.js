/* ==================================================================
   DADOS DA FORMATURA
   ------------------------------------------------------------------
   Este é o único arquivo que você precisa editar.
   Já são reais: hospital, data, horário, local, traje, nomes das residentes e a regra do ingresso.
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

  // Tela de abertura: a porta de cobogó com o selo ("Abrir convite"). Mude para false para entrar direto no site.
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
      "Agora a gente quer comemorar com quem esteve perto: a família, os amigos, os preceptores e todo mundo que segurou as pontas enquanto a gente estudava. Venha dançar com a gente.",
    ],
    assinatura: "Com carinho, a turma",
  },

  // As 8 residentes, em ordem alfabética.
  // EXEMPLO: "proximoPasso" e "frase" ainda são texto provisório. Apague a linha ou deixe "" para não aparecer.
  // "foto": coloque a imagem em assets/fotos/ e escreva o caminho, ex.: "assets/fotos/ana.jpg".
  formandos: [
    { nome: "Ana Clara", proximoPasso: "Próximo passo", frase: "Uma frase dela aqui.", foto: "" },
    { nome: "Ana Luisa", proximoPasso: "Próximo passo", frase: "Uma frase dela aqui.", foto: "" },
    { nome: "Bruna", proximoPasso: "Próximo passo", frase: "Uma frase dela aqui.", foto: "" },
    { nome: "Eduarda", proximoPasso: "Próximo passo", frase: "Uma frase dela aqui.", foto: "" },
    { nome: "Elena", proximoPasso: "Próximo passo", frase: "Uma frase dela aqui.", foto: "" },
    { nome: "Gabriela", proximoPasso: "Próximo passo", frase: "Uma frase dela aqui.", foto: "" },
    { nome: "Karine", proximoPasso: "Próximo passo", frase: "Uma frase dela aqui.", foto: "" },
    { nome: "Leticia", proximoPasso: "Próximo passo", frase: "Uma frase dela aqui.", foto: "" },
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
    { a: "Aos pequenos pacientes e suas famílias", texto: "Agradecemos por deixarem a gente aprender cuidando de vocês, muitas vezes no pior dia da família." },
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
    bairro: "Vila Madalena",
    cidade: "São Paulo/SP",
    // Número da casa, que aparece na marquise da tela de abertura.
    numero: "1379",
    // Um parágrafo sobre o lugar (opcional).
    sobre: "A Oca Tupiniquim é uma casa de eventos na Vila Madalena, aberta em 2007. Tem salão, mezanino, pista de dança, bar e um quintal coberto cheio de plantas, com uma mangueira grande e palmeiras logo na entrada.",
    // Texto usado para buscar no mapa (pode ser o nome do lugar + cidade)
    busca: "Oca Tupiniquim, Rua Fradique Coutinho, 1379, Vila Madalena, São Paulo, SP",
    traje: "Social (passeio completo)",
  },

  duvidas: [
    { pergunta: "Posso levar acompanhante?", resposta: "Não. A entrada é só com ingresso." },
    { pergunta: "A que horas começa?", resposta: "A festa começa às 20h. Não há cerimônia antes." },
    { pergunta: "Onde é?", resposta: "Na Oca Tupiniquim, Rua Fradique Coutinho, 1379, Vila Madalena." },
    { pergunta: "Qual é o traje?", resposta: "Social, também chamado de passeio completo: terno e gravata para os homens, vestido ou conjunto elegante para as mulheres." },
  ],
};
