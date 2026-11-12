/* ==================================================================
   DADOS DA FORMATURA
   ------------------------------------------------------------------
   Este é o único arquivo que você precisa editar.
   Tudo que está aqui é EXEMPLO: troque pelos dados reais.

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

  instituicao: "Hospital Universitário Exemplo",
  programa: "Residência Médica em Pediatria",
  especialidade: "Pediatria",
  turma: "2024-2027",

  capa: {
    // Opcional: foto da turma no fundo da capa (fica escurecida e em preto e branco).
    // Coloque a imagem em assets/fotos/ e escreva o caminho, ex.: "assets/fotos/turma.jpg".
    foto: "",
  },

  evento: {
    data: "2027-02-20",
    inicio: "18:30",
    fim: "02:00", // se passar da meia-noite, o site entende que é no dia seguinte
    confirmarAte: "2027-01-31",
    fuso: -3, // horas em relação ao UTC. Brasília = -3, Manaus = -4, Acre = -5
  },

  convite: {
    titulo: "Depois de três anos de residência, chegou a hora de comemorar.",
    texto: [
      "Foram três anos de plantão que virava madrugada, de puericultura, de UTI neonatal e de muita mãe perguntando “doutora, ele está bem?”.",
      "Agora a gente quer comemorar com quem esteve perto: a família, os amigos, os preceptores e todo mundo que segurou as pontas enquanto a gente estudava. Venha jantar e dançar com a gente.",
    ],
    assinatura: "Com carinho, a turma",
  },

  programacao: [
    { hora: "18:30", titulo: "Recepção", texto: "Chegada dos convidados." },
    { hora: "19:00", titulo: "Cerimônia", texto: "Entrada da turma, juramento e entrega dos certificados." },
    { hora: "20:30", titulo: "Homenagens", texto: "Discursos da paraninfa e do patrono." },
    { hora: "21:00", titulo: "Jantar", texto: "Servido no salão principal." },
    { hora: "22:30", titulo: "Festa", texto: "Pista aberta até as 2h." },
  ],

  // "foto": coloque a imagem em assets/fotos/ e escreva o caminho, ex.: "assets/fotos/ana.jpg".
  // "whatsapp" (opcional): se o convidado escolher esta pessoa no formulário,
  //    a confirmação vai para o WhatsApp dela em vez do número geral.
  formandos: [
    { nome: "Ana Beatriz Moraes", proximoPasso: "Neonatologia", frase: "Aprendi que todo choro tem um motivo.", foto: "" },
    { nome: "Camila Rezende", proximoPasso: "Pediatria geral", frase: "Puericultura é ver o futuro de pertinho.", foto: "" },
    { nome: "Gabriel Antunes", proximoPasso: "UTI pediátrica", frase: "Plantão bom é aquele em que todo mundo vai para casa.", foto: "" },
    { nome: "Isabela Fontes", proximoPasso: "Gastroenterologia pediátrica", frase: "Obrigada, mãe, por todas as marmitas.", foto: "" },
    { nome: "Juliana Prado", proximoPasso: "Alergia e imunologia", frase: "Três anos, mil carimbos e nenhum arrependimento.", foto: "" },
    { nome: "Larissa Teixeira", proximoPasso: "Cardiologia pediátrica", frase: "Cada batimento conta, e eu contei muitos.", foto: "" },
    { nome: "Mariana Lopes", proximoPasso: "Infectologia pediátrica", frase: "Lavem as mãos. Sempre.", foto: "" },
    { nome: "Rafael Carvalho", proximoPasso: "Emergência pediátrica", frase: "Calma, que pediatra também chora.", foto: "" },
  ],

  // Um cartão por ano da residência.
  retrospectiva: [
    { ano: "2024", titulo: "R1", texto: "O primeiro plantão sozinho na enfermaria e a descoberta de que criança não é adulto pequeno." },
    { ano: "2025", titulo: "R2", texto: "Um ano entre a UTI neonatal e a sala de parto, fazendo conta de dose por quilo de madrugada." },
    { ano: "2026", titulo: "R3", texto: "Ambulatórios de especialidade e a vez de ensinar os R1 que chegavam." },
  ],

  // Fotos da turma. "foto" é o caminho da imagem; sem ela aparece só a moldura com a legenda.
  galeria: [
    { legenda: "Primeiro dia de R1", foto: "" },
    { legenda: "Plantão de Natal", foto: "" },
    { legenda: "Congresso de Pediatria", foto: "" },
    { legenda: "Churrasco da turma", foto: "" },
    { legenda: "Último plantão", foto: "" },
  ],

  // Padrão em formatura de residência: paraninfo(a), patrono(a), preceptor(a) homenageado(a),
  // coordenação do programa, amigo(a) da turma. "descricao" e "nota" são opcionais.
  homenageados: [
    { papel: "Paraninfa", nome: "Dra. Helena Duarte", descricao: "Neonatologista" },
    { papel: "Patrono", nome: "Dr. Otávio Lima", descricao: "Intensivista pediátrico" },
    { papel: "Preceptora homenageada", nome: "Dra. Regina Castro", descricao: "Enfermaria de pediatria" },
    { papel: "Coordenação do programa", nome: "Dr. Marcos Vilela", descricao: "Supervisor da residência" },
    { papel: "Amiga da turma", nome: "Enf. Cláudia Reis", descricao: "Enfermagem da pediatria" },
  ],

  // Agradecimentos da turma. A lista é livre: dá para incluir "A Deus", "Aos amigos" etc.
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
    nome: "Espaço de Eventos Exemplo",
    endereco: "Av. Paulista, 1000 · Bela Vista",
    cidade: "São Paulo/SP",
    // Texto usado para buscar no mapa (pode ser o nome do lugar + cidade)
    busca: "Av. Paulista, 1000, São Paulo, SP",
    traje: "Black tie",
  },

  duvidas: [
    { pergunta: "A que horas devo chegar?", resposta: "A recepção abre às 18h30 e a cerimônia começa às 19h em ponto. Quem chegar depois entra, mas perde a entrada da turma." },
    { pergunta: "Qual é o traje?", resposta: "Black tie: vestido longo ou smoking. Terno escuro com gravata também vale." },
    { pergunta: "Tem estacionamento?", resposta: "Tem manobrista na porta. Para quem vem de carro de aplicativo, o desembarque é na entrada principal." },
    { pergunta: "Posso levar acompanhante?", resposta: "Pode, desde que a pessoa esteja contada na sua confirmação. Os lugares são reservados por mesa." },
    { pergunta: "Criança pode ir?", resposta: "Pode, é formatura de pediatra. Avise na confirmação quantas vêm." },
    { pergunta: "Tenho restrição alimentar. O que faço?", resposta: "Escreva no campo de restrição alimentar da confirmação, para o buffet se preparar com antecedência." },
  ],

  confirmacao: {
    // Número que recebe as confirmações: código do país + DDD + número, só dígitos.
    whatsapp: "5511999999999",
    perguntarCriancas: true,
    perguntarRestricao: true,
    perguntarMusica: true,
  },
};
