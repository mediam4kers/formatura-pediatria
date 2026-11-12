/* ==================================================================
   Formatura da Pediatria · comportamento do site
   Lê window.FORMATURA (dados.js) e monta a página.
   Não precisa editar este arquivo para trocar textos ou datas.
   ================================================================== */
(function () {
  "use strict";

  var raiz = document.documentElement;
  var D = window.FORMATURA;
  if (!D) {
    raiz.classList.remove("com-abertura");
    raiz.classList.add("mostra-tudo");
    console.error("Não encontrei os dados da formatura. Confira se o arquivo dados.js existe e não tem erro de digitação.");
    return;
  }

  /* ---------------- utilidades ---------------- */

  var SVGNS = "http://www.w3.org/2000/svg";
  var movimento = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var temMouse = window.matchMedia("(hover: hover)").matches;
  var telaEstreita = window.matchMedia("(max-width: 720px)");

  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }

  function criar(ns, tag, attrs, filhos) {
    var n = ns ? document.createElementNS(ns, tag) : document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "texto") n.textContent = v;
        else n.setAttribute(k, v);
      });
    }
    (filhos || []).forEach(function (f) { if (f) n.appendChild(f); });
    return n;
  }
  function el(tag, attrs, filhos) { return criar(null, tag, attrs, filhos); }
  function sv(tag, attrs, filhos) { return criar(SVGNS, tag, attrs, filhos); }

  function campo(nome, valor) {
    $$('[data-campo="' + nome + '"]').forEach(function (n) { n.textContent = valor; });
  }
  function esconder(sel) { $$(sel).forEach(function (n) { n.hidden = true; n.style.display = "none"; }); }
  function limpar(no) { while (no.firstChild) no.removeChild(no.firstChild); }
  function maiuscula(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  function dois(n) { return String(n).padStart(2, "0"); }
  function f1(n) { return Math.round(n * 10) / 10; }
  function limitar(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function atraso(i, passo) { return "--atraso:" + (i * (passo || 0.08)).toFixed(2) + "s"; }

  // sorteio com semente: o desenho da folhagem sai sempre igual
  function semente(n) {
    var s = n >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function copiarTexto(texto) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(texto);
    return new Promise(function (ok, erro) {
      var caixa = el("textarea", { style: "position:fixed;opacity:0", texto: texto });
      document.body.appendChild(caixa);
      caixa.select();
      try { document.execCommand("copy"); ok(); } catch (e) { erro(e); }
      caixa.remove();
    });
  }
  function trocarRotulo(botao, texto) {
    var original = botao.textContent;
    botao.textContent = texto;
    setTimeout(function () { botao.textContent = original; }, 2200);
  }

  /* ---------------- versões do site ---------------- */

  var VERSOES = [
    { id: "1", nome: "Jardim à noite", cor: "#08130E" },
    { id: "2", nome: "Papel claro", cor: "#FFFBF4" },
    { id: "3", nome: "Laranja cobogó", cor: "#E9742B" }
  ];
  function versaoAtual() { return raiz.getAttribute("data-versao") || "1"; }
  function dadosDaVersao(id) { return VERSOES.filter(function (v) { return v.id === id; })[0] || VERSOES[0]; }
  var metaCor = $('meta[name="theme-color"]');
  var botaoVersao = null, avisoVersao = null, cortinaVersao = null, tempoAviso = null;

  function aplicarVersao(id, guardar) {
    var v = dadosDaVersao(String(id));
    raiz.setAttribute("data-versao", v.id);
    if (metaCor) metaCor.setAttribute("content", v.cor);
    if (botaoVersao) $("b", botaoVersao).textContent = v.id;
    if (guardar) { try { localStorage.setItem("formatura-versao", v.id); } catch (e) { /* sem armazenamento, segue */ } }
  }
  // Enquanto a turma escolhe (escolherVersao: true), vale a versão do endereço ou a última escolhida
  // no aparelho, que o script do <head> já aplicou. Depois de decidido, vale a de dados.js.
  var versaoDoEndereco = null;
  try { versaoDoEndereco = new URLSearchParams(location.search).get("versao"); } catch (e) { /* segue */ }
  if (D.escolherVersao && raiz.hasAttribute("data-versao-escolhida")) aplicarVersao(versaoAtual(), false);
  else aplicarVersao(versaoDoEndereco || D.versao || "1", false);

  function proximaVersao() {
    var i = VERSOES.map(function (v) { return v.id; }).indexOf(versaoAtual());
    var nova = VERSOES[(i + 1) % VERSOES.length];
    var trocar = function () {
      aplicarVersao(nova.id, true);
      window.dispatchEvent(new Event("resize"));
    };
    if (movimento && cortinaVersao) {
      cortinaVersao.style.background = nova.cor;
      cortinaVersao.classList.add("fechada");
      setTimeout(function () { trocar(); cortinaVersao.classList.remove("fechada"); }, 240);
    } else {
      trocar();
    }
    if (avisoVersao) {
      avisoVersao.textContent = "Versão " + nova.id + " · " + nova.nome;
      avisoVersao.classList.add("visivel");
      clearTimeout(tempoAviso);
      tempoAviso = setTimeout(function () { avisoVersao.classList.remove("visivel"); }, 2400);
    }
  }

  var doca = $("[data-doca]");
  if (D.escolherVersao && doca) {
    botaoVersao = el("button", { class: "doca__versao", type: "button", "aria-label": "Trocar a versão do site" }, [
      el("small", { texto: "Versão" }),
      el("b", { texto: versaoAtual() })
    ]);
    botaoVersao.addEventListener("click", proximaVersao);
    doca.appendChild(botaoVersao);
    doca.classList.add("tem-versao");
    avisoVersao = el("p", { class: "aviso-versao", role: "status" });
    cortinaVersao = el("i", { class: "cortina-versao", "aria-hidden": "true" });
    document.body.appendChild(avisoVersao);
    document.body.appendChild(cortinaVersao);
  }

  /* ---------------- datas ---------------- */

  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  var DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  var EXTENSO = ["zero", "Um", "Dois", "Três", "Quatro", "Cinco", "Seis", "Sete", "Oito", "Nove", "Dez", "Onze", "Doze", "Treze", "Catorze", "Quinze", "Dezesseis", "Dezessete", "Dezoito", "Dezenove", "Vinte"];

  var ev = D.evento || {};
  var fuso = typeof ev.fuso === "number" ? ev.fuso : -3; // horas em relação ao UTC (Brasília = -3)
  var partesData = String(ev.data || "").split("-").map(Number);
  var ano = partesData[0], mes = partesData[1], dia = partesData[2];

  function paraMinutos(hhmm) {
    var p = String(hhmm || "0:0").split(":").map(Number);
    return (p[0] || 0) * 60 + (p[1] || 0);
  }
  function formatarHora(min) {
    var h = Math.floor(min / 60) % 24, m = min % 60;
    return h + "h" + (m ? dois(m) : "");
  }
  function dataUTC(minutosNoDia) {
    return new Date(Date.UTC(ano, mes - 1, dia, 0, minutosNoDia - fuso * 60));
  }

  var minInicio = paraMinutos(ev.inicio);
  var minFim = paraMinutos(ev.fim || "23:59");
  if (minFim <= minInicio) minFim += 1440;
  var inicioUTC = dataUTC(minInicio);
  var fimUTC = dataUTC(minFim);

  var diaSemana = DIAS[new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay()];
  var dataExtenso = dia + " de " + MESES[mes - 1] + " de " + ano;
  var hora = formatarHora(minInicio);

  /* ---------------- textos simples ---------------- */

  var L = D.local || {};
  var C = D.convite || {};
  var formandos = D.formandos || [];
  var homenageados = D.homenageados || [];
  var retrospectiva = D.retrospectiva || [];
  var galeria = D.galeria || [];
  var agradecimentos = D.agradecimentos || [];
  var duvidas = D.duvidas || [];
  var destaques = D.destaques || [];
  var especialidade = D.especialidade || "Pediatria";
  var tituloEvento = "Formatura · " + (D.programa || "Residência em " + especialidade);
  var bairroCidade = [L.bairro, L.cidade].filter(Boolean).join(" · ");
  var localCompleto = [L.nome, L.endereco, L.cidade].filter(Boolean).join(", ");

  // aviso de dados de exemplo: some sozinho depois de um tempo, ou com um toque
  var aviso = $("[data-aviso]");
  if (D.exemplo && aviso) {
    aviso.hidden = false;
    var sumirAviso = function () { aviso.classList.add("some"); };
    aviso.addEventListener("click", sumirAviso);
    setTimeout(sumirAviso, 7000);
  }

  document.title = "Formatura da " + especialidade + " · Turma " + D.turma;
  campo("marca", especialidade + " · " + D.turma);
  campo("numeroLocal", L.numero || "");
  campo("programa", D.programa);
  campo("especialidade", especialidade);
  campo("instituicao", D.instituicao);
  campo("turma", D.turma);
  campo("dia", dia);
  campo("mesAno", MESES[mes - 1] + " · " + ano);
  campo("diaSemana", diaSemana);
  campo("hora", hora);
  campo("quandoLeitor", maiuscula(diaSemana) + ", " + dataExtenso + ", às " + hora + ".");
  campo("localNome", L.nome);
  campo("localSigla", String(L.nome || "").split(/\s+/)[0].toUpperCase());
  campo("localEndereco", L.endereco);
  campo("localBairro", bairroCidade);
  campo("localSobre", L.sobre || "");
  campo("rodapeQuando", diaSemana + ", " + dataExtenso + " · " + hora + " · " + (L.nome || ""));
  campo("rodapeTurma", "Turma de " + especialidade + " " + D.turma + " · " + D.instituicao);

  // convite
  campo("conviteTitulo", C.titulo || "");
  campo("conviteAssinatura", C.assinatura || "");
  var caixaConvite = $('[data-lista="convite"]');
  (C.texto || []).forEach(function (t) { caixaConvite.appendChild(el("p", { texto: t })); });

  // turma
  var n = formandos.length;
  campo("turmaSub", n ? (EXTENSO[n] || n) + (n === 1 ? " residente" : " residentes") : "");

  // epígrafe
  var E = D.epigrafe;
  if (E && E.texto) {
    campo("epigrafeTexto", E.texto);
    campo("epigrafeFonte", E.fonte || "");
  }

  // foto de capa (opcional)
  var fotoCapa = D.capa && D.capa.foto;
  if (fotoCapa) {
    var caixaFoto = $("[data-capa-foto]");
    caixaFoto.style.backgroundImage = 'url("' + String(fotoCapa).replace(/"/g, "%22") + '")';
    caixaFoto.classList.add("tem-foto");
  }

  /* ---------------- selo ---------------- */

  $$("[data-selo]").forEach(function (svg, k) {
    var id = "selo-arco-" + k;
    var raio = 78;
    var texto = (D.programa + " · Turma " + D.turma + " · ").toUpperCase();
    svg.appendChild(sv("defs", null, [
      sv("path", { id: id, d: "M100 100 m-" + raio + " 0 a" + raio + " " + raio + " 0 1 1 " + raio * 2 + " 0 a" + raio + " " + raio + " 0 1 1 -" + raio * 2 + " 0" })
    ]));
    svg.appendChild(sv("circle", { class: "selo__anel", cx: 100, cy: 100, r: 97 }));
    svg.appendChild(sv("circle", { class: "selo__anel selo__anel--fino", cx: 100, cy: 100, r: 91 }));
    svg.appendChild(sv("circle", { class: "selo__anel selo__anel--fino", cx: 100, cy: 100, r: 61 }));
    svg.appendChild(sv("g", { class: "selo__giro" }, [
      sv("text", { class: "selo__texto" }, [
        sv("textPath", { href: "#" + id, textLength: Math.floor(2 * Math.PI * raio) - 4, lengthAdjust: "spacing", texto: texto })
      ])
    ]));
    // símbolo do hospital, redesenhado em vetor a partir do logo original (ver assets/logo-hospital.svg)
    svg.appendChild(sv("g", { class: "selo__cheio", transform: "translate(33.85 52.41) scale(1.05)" }, [
      sv("path", { d: "M23.030 26.500A6.500 6.500 0 0 1 36.030 26.500A27.100 27.100 0 1 0 89.970 26.500A6.500 6.500 0 0 1 102.970 26.500A40.400 40.400 0 1 1 23.030 26.500Z" }),
      sv("path", { d: "M43 62h40v18H43z" }),
      sv("path", { "fill-rule": "evenodd", d: "M42.800 31.800a20.200 20.200 0 1 0 40.400 0a20.200 20.200 0 1 0 -40.400 0ZM56.200 28.900a2.200 4 0 1 0 4.400 0a2.200 4 0 1 0 -4.400 0ZM65.400 28.900a2.200 4 0 1 0 4.400 0a2.200 4 0 1 0 -4.400 0ZM52.200 38Q63 44.400 73.800 38Q63 49.800 52.200 38Z" }),
      sv("path", { d: "M27 68h16v12H27zM83 68h16v12H83z", opacity: "0.3" }),
      sv("path", { d: "M27 79h72v1H27z" })
    ]));
  });

  /* ---------------- folhagem ---------------- */

  // uma fronde: haste curva com folíolos dos dois lados, como samambaia ou palmeira
  function fronde(o) {
    var ang = (o.ang * Math.PI) / 180;
    var giro = (o.curva * Math.PI) / 180 / o.pares;
    var passo = o.comp / o.pares;
    var x = o.x, y = o.y;
    var haste = "M" + f1(x) + " " + f1(y);
    var folhas = "";
    for (var i = 1; i <= o.pares; i++) {
      var t = i / o.pares;
      ang += giro;
      x += Math.cos(ang) * passo;
      y += Math.sin(ang) * passo;
      haste += "L" + f1(x) + " " + f1(y);
      var comprimento = o.larg * (0.3 + 0.7 * Math.sin(Math.PI * Math.pow(t, 0.72))) * (1 - 0.55 * Math.pow(t, 5));
      var largura = comprimento * 0.19;
      for (var lado = -1; lado <= 1; lado += 2) {
        var a = ang + lado * (1.12 - 0.42 * t);
        var px = x + Math.cos(a) * comprimento, py = y + Math.sin(a) * comprimento;
        var mx = x + Math.cos(a) * comprimento * 0.45, my = y + Math.sin(a) * comprimento * 0.45;
        var nx = -Math.sin(a) * largura, ny = Math.cos(a) * largura;
        folhas += "M" + f1(x) + " " + f1(y) + "Q" + f1(mx + nx) + " " + f1(my + ny) + " " + f1(px) + " " + f1(py) +
          "Q" + f1(mx - nx) + " " + f1(my - ny) + " " + f1(x) + " " + f1(y) + "Z";
      }
    }
    return { folhas: folhas, haste: haste };
  }

  // x, y, comprimento, ângulo inicial, arqueamento, pares de folíolos, tamanho do folíolo, tom, camada (0 = fundo)
  var MACICOS = {
    // pendurada no canto de cima, como as samambaias do jardim
    pendente: [
      [-12, -14, 520, 6, 48, 27, 62, 0, 0], [46, -22, 470, 36, 42, 25, 58, 1, 0], [-22, 34, 430, 60, 36, 23, 54, 0, 0],
      [2, -16, 430, 16, 54, 25, 50, 1, 1], [24, -12, 380, 46, 46, 23, 46, 2, 1], [-16, 12, 330, 72, 32, 21, 42, 1, 1],
      [64, -26, 300, 26, 60, 21, 40, 3, 1], [-10, 62, 250, 84, 26, 17, 36, 2, 1], [110, -30, 220, 44, 52, 16, 32, 4, 1]
    ],
    // subindo do canto de baixo e arqueando
    ascendente: [
      [-12, 532, 500, -84, 46, 27, 60, 0, 0], [34, 542, 450, -60, 42, 25, 56, 1, 0], [-22, 502, 400, -36, 32, 23, 52, 0, 0],
      [2, 536, 420, -76, 52, 25, 48, 1, 1], [42, 532, 360, -50, 44, 23, 44, 2, 1], [-12, 512, 300, -26, 30, 19, 40, 1, 1],
      [72, 542, 280, -68, 62, 21, 38, 3, 1], [12, 482, 220, -12, 22, 15, 34, 2, 1], [120, 548, 210, -58, 54, 16, 30, 4, 1]
    ]
  };

  $$("[data-folhagem]").forEach(function (svg, k) {
    var lista = MACICOS[svg.getAttribute("data-folhagem")];
    if (!lista) return;
    var sorte = semente(977 + k * 131);
    svg.setAttribute("viewBox", "0 0 520 520");
    var fundo = sv("g", { class: "fundo" });
    var frente = sv("g", { class: "frente" });
    lista.forEach(function (c) {
      var f = fronde({
        x: c[0], y: c[1],
        comp: c[2] * (0.94 + sorte() * 0.12),
        ang: c[3] + (sorte() - 0.5) * 8,
        curva: c[4] * (0.9 + sorte() * 0.2),
        pares: c[5], larg: c[6]
      });
      var grupo = sv("g", {
        class: "fronde",
        style: "transform-origin:" + c[0] + "px " + c[1] + "px;--dur:" + (6 + sorte() * 5).toFixed(1) + "s;--at:-" + (sorte() * 6).toFixed(1) + "s;--amp:" + (0.7 + sorte() * 1.1).toFixed(2) + "deg"
      }, [
        sv("path", { class: "tom-" + c[7], d: f.folhas }),
        sv("path", { class: "haste", d: f.haste })
      ]);
      (c[8] ? frente : fundo).appendChild(grupo);
    });
    svg.appendChild(fundo);
    svg.appendChild(frente);
  });

  // raminho que abre cada seção: duas frondes pequenas e um miolo
  $$("[data-ramo]").forEach(function (svg) {
    svg.setAttribute("viewBox", "0 0 210 36");
    var esq = fronde({ x: 96, y: 20, comp: 88, ang: 180, curva: 14, pares: 9, larg: 13 });
    var dir = fronde({ x: 114, y: 20, comp: 88, ang: 0, curva: -14, pares: 9, larg: 13 });
    svg.appendChild(sv("path", { class: "ramo__folhas", d: esq.folhas + dir.folhas }));
    svg.appendChild(sv("path", { class: "ramo__haste", d: esq.haste + dir.haste }));
    svg.appendChild(sv("circle", { class: "ramo__miolo", cx: 105, cy: 20, r: 3.4 }));
  });

  /* ---------------- cordão de luzes ---------------- */

  var cordoes = $$("[data-luzes]");
  function desenharLuzes() {
    cordoes.forEach(function (caixa, k) {
      var W = Math.round(caixa.clientWidth);
      if (!W || caixa.getAttribute("data-largura") === String(W)) return;
      caixa.setAttribute("data-largura", W);
      limpar(caixa);
      var fio = sv("svg", { class: "luzes__fio", viewBox: "0 0 " + W + " 130", preserveAspectRatio: "none" });
      caixa.appendChild(fio);
      var barriga = limitar(26 + W * 0.035, 34, 78);
      var sorte = semente(41 + k);
      [[0, 30, W / 2, 6], [W / 2, 6, W, 30]].forEach(function (tr) {
        var x0 = tr[0], y0 = tr[1], x1 = tr[2], y1 = tr[3];
        var cx = (x0 + x1) / 2, cy = Math.max(y0, y1) + barriga * 1.7;
        fio.appendChild(sv("path", { d: "M" + x0 + " " + y0 + "Q" + f1(cx) + " " + f1(cy) + " " + x1 + " " + y1 }));
        var qtd = Math.max(4, Math.round((x1 - x0) / 92));
        for (var i = 1; i < qtd; i++) {
          var t = i / qtd, u = 1 - t;
          var x = u * u * x0 + 2 * u * t * cx + t * t * x1;
          var y = u * u * y0 + 2 * u * t * cy + t * t * y1;
          caixa.appendChild(el("i", { class: "luzes__lampada", style: "left:" + f1(x) + "px;top:" + f1(y + 6) + "px;--at:-" + (sorte() * 3.4).toFixed(2) + "s" }));
        }
      });
    });
  }
  desenharLuzes();

  /* ---------------- título letra por letra ---------------- */

  var caps = $("[data-letras]");
  if (caps && movimento) {
    var palavraTitulo = caps.textContent;
    limpar(caps);
    caps.classList.add("partida");
    caps.appendChild(el("span", { class: "sr", texto: palavraTitulo }));
    palavraTitulo.split("").forEach(function (letra, i) {
      caps.appendChild(el("span", { class: "lockup__letra", "aria-hidden": "true", style: "--i:" + i, texto: letra }));
    });
  }

  /* ---------------- faixas que correm ---------------- */

  function encherFaixa(seletor, itens) {
    var trilho = $(seletor);
    if (!trilho) return;
    itens = itens.filter(Boolean);
    if (!itens.length) { trilho.parentNode.style.display = "none"; return; }
    var sequencia = itens.slice();
    while (sequencia.length < 10) sequencia = sequencia.concat(itens);
    // a sequência entra duas vezes para o laço não ter emenda
    sequencia.concat(sequencia).forEach(function (texto) {
      trilho.appendChild(el("span", { class: "faixa__item", texto: texto }));
    });
  }
  encherFaixa('[data-lista="faixa"]', formandos.map(function (f) { return f.nome; }));
  encherFaixa('[data-lista="faixaData"]', [dataExtenso, "às " + hora, L.nome, L.bairro]);

  /* ---------------- palavras que acendem ao rolar ---------------- */

  var blocosPalavras = [];
  $$("[data-palavras]").forEach(function (bloco) {
    var texto = bloco.textContent.trim();
    if (!texto) return;
    limpar(bloco);
    var palavras = texto.split(/\s+/).map(function (p, i, todas) {
      var s = el("span", { class: "palavra", texto: p });
      bloco.appendChild(s);
      if (i < todas.length - 1) bloco.appendChild(document.createTextNode(" "));
      return s;
    });
    blocosPalavras.push({
      no: bloco,
      palavras: palavras,
      acesas: -1,
      // "fixo": a seção inteira prende na tela e o avanço vem da rolagem dela
      cena: bloco.getAttribute("data-palavras") === "fixo" ? bloco.closest("[data-epigrafe]") : null
    });
  });
  function acenderPalavras() {
    var vh = window.innerHeight;
    blocosPalavras.forEach(function (b) {
      var p;
      if (b.cena) {
        var c = b.cena.getBoundingClientRect();
        p = limitar((vh * 0.55 - c.top) / Math.max(1, c.height - vh * 0.8), 0, 1);
      } else {
        var r = b.no.getBoundingClientRect();
        p = limitar((vh * 0.9 - r.top) / (r.height + vh * 0.36), 0, 1);
      }
      var qtd = Math.round(p * b.palavras.length * 1.12);
      if (qtd === b.acesas) return;
      b.acesas = qtd;
      b.palavras.forEach(function (s, i) { s.classList.toggle("acesa", i < qtd); });
    });
  }

  /* ---------------- confete ---------------- */

  function soltarConfete() {
    var tela = $("[data-confete]");
    if (!tela || !tela.getContext || !movimento) return;
    var ctx = tela.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var W = window.innerWidth, H = window.innerHeight;
    tela.width = Math.round(W * dpr);
    tela.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tela.classList.add("ativo");
    var cores = ["#F2853F", "#FFB877", "#7CC68A", "#BFE9C5", "#FCF4E6", "#F8CE7E", "#E8672A", "#4FA76B"];
    var estreito = W < 640;
    var total = estreito ? 120 : 230;
    var impulso = Math.min(H, 900) * 1.35;
    var pecas = [];
    for (var i = 0; i < total; i++) {
      var ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.95;
      var vel = (0.45 + Math.random() * 0.8) * impulso;
      pecas.push({
        x: W / 2 + (Math.random() - 0.5) * W * 0.1,
        y: H * 0.5,
        vx: Math.cos(ang) * vel * (estreito ? 0.55 : 1),
        vy: Math.sin(ang) * vel,
        w: 6 + Math.random() * 8,
        h: 3 + Math.random() * 5,
        rot: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 9,
        giro: Math.random() * 6.28,
        vg: 4 + Math.random() * 8,
        cor: cores[i % cores.length],
        redondo: Math.random() < 0.2,
        espera: Math.random() * 0.3
      });
    }
    var inicio = performance.now(), anterior = inicio, DURACAO = 5200;
    function quadro(t) {
      var dt = Math.min(0.04, (t - anterior) / 1000);
      anterior = t;
      var vida = t - inicio;
      ctx.clearRect(0, 0, W, H);
      var geral = vida > DURACAO - 1000 ? Math.max(0, (DURACAO - vida) / 1000) : 1;
      for (var k = 0; k < pecas.length; k++) {
        var p = pecas[k];
        if (vida / 1000 < p.espera) continue;
        p.vy += 1500 * dt;
        p.vx *= 1 - 1.3 * dt;
        if (p.vy > 230) p.vy = 230 + (p.vy - 230) * (1 - 6 * dt); // o papel plana quando cai
        p.x += (p.vx + Math.sin(p.giro) * 46) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        p.giro += p.vg * dt;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.giro));
        ctx.globalAlpha = geral;
        ctx.fillStyle = p.cor;
        if (p.redondo) { ctx.beginPath(); ctx.arc(0, 0, p.h, 0, 6.2832); ctx.fill(); }
        else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (vida < DURACAO) requestAnimationFrame(quadro);
      else { ctx.clearRect(0, 0, W, H); tela.classList.remove("ativo"); }
    }
    requestAnimationFrame(quadro);
  }

  /* ---------------- tela de abertura ---------------- */

  var abertura = $("[data-abertura]");
  var palavraFoil = $("[data-brilha]");
  function entrar() {
    raiz.classList.remove("com-abertura");
    desenharLuzes();
    aoRolar();
    focarCarrossel();
    if (palavraFoil) setTimeout(function () { palavraFoil.classList.add("brilhou"); }, 2700);
  }
  function abrirConvite() {
    if (!abertura || abertura.classList.contains("abrindo")) return;
    abertura.classList.add("abrindo");
    if (navigator.vibrate) { try { navigator.vibrate(14); } catch (e) { /* sem vibração, segue */ } }
    setTimeout(soltarConfete, 420);
    // a capa começa a aparecer por trás enquanto a porta ainda desliza
    setTimeout(entrar, movimento ? 900 : 0);
    setTimeout(function () { abertura.remove(); }, movimento ? 2700 : 800);
  }

  /* ---------------- contagem regressiva ---------------- */

  var caixaContagem = $("[data-contagem]");
  var fimContagem = $("[data-contagem-fim]");
  var saidas = { dias: $('[data-c="dias"]'), horas: $('[data-c="horas"]'), min: $('[data-c="min"]'), seg: $('[data-c="seg"]') };
  var relogio = null;
  function por(no, valor) {
    valor = String(valor);
    if (no.textContent === valor) return;
    no.textContent = valor;
    if (!movimento) return;
    no.classList.remove("troca");
    void no.offsetWidth; // reinicia a animação do dígito
    no.classList.add("troca");
  }
  function contar() {
    var falta = inicioUTC.getTime() - Date.now();
    if (falta <= 0) {
      caixaContagem.hidden = true;
      fimContagem.hidden = false;
      fimContagem.textContent = Date.now() < fimUTC.getTime() ? "É hoje. Estamos esperando você." : "Foi uma noite e tanto. Que bom que você veio.";
      if (relogio) clearInterval(relogio);
      return;
    }
    var s = Math.floor(falta / 1000);
    por(saidas.dias, Math.floor(s / 86400));
    por(saidas.horas, dois(Math.floor((s % 86400) / 3600)));
    por(saidas.min, dois(Math.floor((s % 3600) / 60)));
    por(saidas.seg, dois(s % 60));
  }
  contar();
  relogio = setInterval(contar, 1000);

  /* ---------------- partículas do palco: vaga-lumes, confete de papel ou nada ---------------- */

  (function () {
    var canvas = $("[data-brilho]");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var W = 0, H = 0, pontos = [], quadro = null, anterior = 0;
    var PASTEL = ["#F2853F", "#5FB878", "#F5C45A", "#F29AA6", "#7DB7E8"];

    function novo(inicial) {
      var sorteio = Math.random();
      var tipo = sorteio < 0.16 ? "bokeh" : sorteio < 0.4 ? "vagalume" : "po";
      return {
        tipo: tipo,
        x: Math.random() * W,
        y: inicial ? Math.random() * H : H + 30,
        r: tipo === "bokeh" ? 5 + Math.random() * 13 : tipo === "vagalume" ? 1.3 + Math.random() * 1.1 : 0.5 + Math.pow(Math.random(), 2.2) * 1.7,
        v: tipo === "bokeh" ? 3 + Math.random() * 5 : tipo === "vagalume" ? 2 + Math.random() * 6 : 5 + Math.random() * 14,
        fase: Math.random() * 6.28,
        ritmo: 0.4 + Math.random() * 1.1,
        alfa: tipo === "bokeh" ? 0.05 + Math.random() * 0.07 : tipo === "vagalume" ? 0.75 + Math.random() * 0.25 : 0.2 + Math.random() * 0.5,
        cor: PASTEL[Math.floor(Math.random() * PASTEL.length)]
      };
    }
    function medir() {
      var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var total = Math.round(limitar((W * H) / 20000, 26, 60));
      pontos = [];
      for (var i = 0; i < total; i++) pontos.push(novo(true));
      desenhar(0, 0);
    }
    function desenhar(t, dt) {
      ctx.clearRect(0, 0, W, H);
      var versao = versaoAtual();
      if (versao === "3") return; // a versão laranja não tem partículas
      for (var i = 0; i < pontos.length; i++) {
        var p = pontos[i];
        var onda = Math.sin(t * 0.0011 * p.ritmo + p.fase);
        p.y -= p.v * dt;
        if (p.tipo === "vagalume") {
          p.x += Math.cos(t * 0.0005 * p.ritmo + p.fase) * 16 * dt;
          p.y += Math.sin(t * 0.0007 * p.ritmo + p.fase * 2) * 9 * dt;
        } else {
          p.x += Math.sin(t * 0.0004 * p.ritmo + p.fase) * 8 * dt;
        }
        if (p.y < -30) pontos[i] = p = novo(false);
        var raioDesenho = p.r;
        if (versao === "2") {
          // papel claro: bolinhas de cor, como confete parado no ar
          ctx.globalAlpha = (p.tipo === "bokeh" ? 0.16 : 0.5) * (0.6 + 0.4 * onda);
          ctx.fillStyle = p.cor;
          raioDesenho = p.tipo === "bokeh" ? p.r * 1.3 : p.r * 2.1 + 1;
        } else if (p.tipo === "vagalume") {
          var pulso = Math.pow(Math.max(0, onda), 2.2);
          ctx.globalAlpha = p.alfa * pulso * 0.3;
          ctx.fillStyle = "#D9F28C";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 5.5, 0, 6.2832);
          ctx.fill();
          ctx.globalAlpha = p.alfa * (0.12 + 0.88 * pulso);
          ctx.fillStyle = "#F2FFC2";
        } else if (p.tipo === "bokeh") {
          ctx.globalAlpha = p.alfa * (0.55 + 0.45 * onda);
          var g = ctx.createRadialGradient(p.x, p.y, p.r * 0.2, p.x, p.y, p.r);
          g.addColorStop(0, "rgba(255,226,170,0.55)");
          g.addColorStop(0.8, "rgba(255,206,130,0.75)");
          g.addColorStop(1, "rgba(255,206,130,0)");
          ctx.fillStyle = g;
        } else {
          ctx.globalAlpha = p.alfa * (0.55 + 0.45 * onda);
          ctx.fillStyle = "#FFE7BD";
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, raioDesenho, 0, 6.2832);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    function passo(t) {
      var dt = Math.min(0.05, (t - anterior) / 1000 || 0);
      anterior = t;
      desenhar(t, dt);
      quadro = requestAnimationFrame(passo);
    }
    function ligar() {
      if (quadro || !movimento || document.hidden) return;
      anterior = performance.now();
      quadro = requestAnimationFrame(passo);
    }
    function desligar() {
      if (quadro) cancelAnimationFrame(quadro);
      quadro = null;
    }

    medir();
    var tempoMedir = null;
    window.addEventListener("resize", function () {
      clearTimeout(tempoMedir);
      tempoMedir = setTimeout(function () {
        if (canvas.clientWidth !== W || Math.abs(canvas.clientHeight - H) > 120) medir();
        else if (!quadro) desenhar(0, 0);
        desenharLuzes();
        focarCarrossel();
      }, 200);
    });
    document.addEventListener("visibilitychange", function () { if (document.hidden) desligar(); else ligar(); });
    ligar();
  })();

  /* ---------------- a turma ---------------- */

  var listaTurma = $('[data-lista="formandos"]');
  var cartoesTurma = [];
  formandos.forEach(function (f, i) {
    var partes = String(f.nome || "").trim().split(/\s+/);
    var iniciais = (partes[0] || "").charAt(0) + (partes.length > 1 ? partes[partes.length - 1].charAt(0) : "");
    var li = el("li", { class: "formando", "data-revela": "", style: atraso(i % 4) }, [
      el("div", { class: "formando__foto vidro-leve", "data-inclina": "9" }, [
        f.foto
          ? el("img", { src: f.foto, alt: "Foto de " + f.nome, loading: "lazy", width: "600", height: "820" })
          : el("span", { class: "foil", "aria-hidden": "true", texto: iniciais }),
        el("i", { class: "formando__brilho", "aria-hidden": "true" })
      ]),
      el("p", { class: "formando__ordem", texto: (i + 1) + " de " + formandos.length }),
      el("h3", { class: "formando__nome", texto: f.nome }),
      f.proximoPasso ? el("p", { class: "formando__passo", texto: f.proximoPasso }) : null,
      f.frase ? el("p", { class: "formando__frase", texto: "“" + f.frase + "”" }) : null
    ]);
    cartoesTurma.push(li);
    listaTurma.appendChild(li);
  });

  // no celular a turma é um carrossel: o cartão do meio ganha destaque
  var caixaPontos = $("[data-pontos]");
  var pontosTurma = formandos.map(function () { var p = el("i"); if (caixaPontos) caixaPontos.appendChild(p); return p; });
  var focoAgendado = false;
  function focarCarrossel() {
    focoAgendado = false;
    if (!telaEstreita.matches) {
      cartoesTurma.forEach(function (li) { li.style.removeProperty("--foco"); });
      return;
    }
    var caixa = listaTurma.getBoundingClientRect();
    var meio = caixa.left + caixa.width / 2;
    var melhor = 0, menor = Infinity;
    cartoesTurma.forEach(function (li, i) {
      var r = li.getBoundingClientRect();
      var dist = Math.abs(r.left + r.width / 2 - meio);
      li.style.setProperty("--foco", limitar(1 - dist / (r.width * 0.95), 0, 1).toFixed(3));
      if (dist < menor) { menor = dist; melhor = i; }
    });
    pontosTurma.forEach(function (p, i) { p.classList.toggle("ativo", i === melhor); });
  }
  listaTurma.addEventListener("scroll", function () {
    if (focoAgendado) return;
    focoAgendado = true;
    requestAnimationFrame(focarCarrossel);
  }, { passive: true });

  /* ---------------- história: linha do tempo e varal ---------------- */

  var trilha = $("[data-trilha]");
  var listaAnos = $('[data-lista="retrospectiva"]');
  var marcos = [];
  retrospectiva.forEach(function (r, i) {
    var li = el("li", { class: "marco", "data-revela": "", style: atraso(0) }, [
      el("i", { class: "marco__no", "aria-hidden": "true" }),
      el("span", { class: "marco__ano", texto: r.ano }),
      el("div", { class: "marco__cartao vidro-leve" }, [
        el("h3", { class: "marco__titulo", texto: r.titulo }),
        r.texto ? el("p", { class: "marco__texto", texto: r.texto }) : null
      ])
    ]);
    marcos.push(li);
    listaAnos.appendChild(li);
  });
  if (retrospectiva.length) {
    var primeiro = retrospectiva[0].titulo, ultimo = retrospectiva[retrospectiva.length - 1].titulo;
    campo("historiaTitulo", retrospectiva.length > 1 ? "De " + primeiro + " a " + ultimo : primeiro);
    campo("historiaSub", (EXTENSO[retrospectiva.length] || retrospectiva.length) + (retrospectiva.length === 1 ? " ano de residência" : " anos de residência"));
  } else {
    campo("historiaTitulo", "A turma em fotos");
    campo("historiaSub", "");
    if (trilha) trilha.style.display = "none";
  }
  if (!movimento) marcos.forEach(function (m) { m.classList.add("ativo"); });

  var listaGaleria = $('[data-lista="galeria"]');
  var GIROS = [-2.6, 1.8, -1.2, 2.7, -2, 1.3];
  var sorteVaral = semente(73);
  galeria.forEach(function (g, i) {
    var item = typeof g === "string" ? { foto: g } : g;
    listaGaleria.appendChild(el("li", { class: "foto" }, [
      el("i", { class: "foto__pregador", "aria-hidden": "true" }),
      el("div", {
        class: "foto__papel",
        style: "--giro:" + GIROS[i % GIROS.length] + "deg;--dur:" + (4 + sorteVaral() * 2.5).toFixed(1) + "s;--at:-" + (sorteVaral() * 4).toFixed(1) + "s"
      }, [
        el("div", { class: "foto__imagem" }, [
          item.foto
            ? el("img", { src: item.foto, alt: item.legenda || "Foto da turma", loading: "lazy" })
            : el("i", { class: "foto__vazio", "aria-hidden": "true" })
        ]),
        item.legenda ? el("p", { class: "foto__legenda", texto: item.legenda }) : null
      ])
    ]));
  });

  /* ---------------- homenagens ---------------- */

  var listaHomenagens = $('[data-lista="homenageados"]');
  homenageados.forEach(function (h) {
    listaHomenagens.appendChild(el("li", { class: "homenagem" }, [
      h.papel ? el("p", { class: "homenagem__papel", texto: h.papel }) : null,
      el("h3", { class: "homenagem__nome", texto: h.nome }),
      h.descricao ? el("p", { class: "homenagem__desc", texto: h.descricao }) : null,
      h.nota ? el("p", { class: "homenagem__nota", texto: h.nota }) : null
    ]));
  });

  /* ---------------- agradecimentos: cartões que se empilham ---------------- */

  var listaAgradecimentos = $('[data-lista="agradecimentos"]');
  var cartoesPilha = [];
  agradecimentos.forEach(function (a, i) {
    var folha = sv("svg", { class: "pilha__folha", viewBox: "0 0 200 200", "aria-hidden": "true" });
    [[206, 206, 190, -150, 34, 15, 30], [206, 206, 170, -118, 40, 14, 27], [206, 206, 140, -176, 24, 12, 24]].forEach(function (c) {
      var f = fronde({ x: c[0], y: c[1], comp: c[2], ang: c[3], curva: c[4], pares: c[5], larg: c[6] });
      folha.appendChild(sv("path", { d: f.folhas }));
      folha.appendChild(sv("path", { class: "haste", d: f.haste }));
    });
    var li = el("li", { class: "pilha__cartao", style: "--i:" + i }, [
      folha,
      el("p", { class: "pilha__ordem", texto: (i + 1) + " de " + agradecimentos.length }),
      el("h3", { class: "pilha__a", texto: a.a }),
      el("p", { class: "pilha__texto", texto: a.texto })
    ]);
    cartoesPilha.push(li);
    listaAgradecimentos.appendChild(li);
  });

  /* ---------------- local ---------------- */

  var busca = encodeURIComponent(L.busca || localCompleto);
  var iframe = $("[data-mapa]");
  if (iframe) iframe.src = "https://maps.google.com/maps?q=" + busca + "&z=16&hl=pt-BR&output=embed";
  var linkMaps = $('[data-link="maps"]');
  var linkWaze = $('[data-link="waze"]');
  if (linkMaps) linkMaps.href = "https://www.google.com/maps/search/?api=1&query=" + busca;
  if (linkWaze) linkWaze.href = "https://waze.com/ul?q=" + busca + "&navigate=yes";

  var listaAmbientes = $('[data-lista="ambientes"]');
  (L.ambientes || []).forEach(function (a) { listaAmbientes.appendChild(el("li", { texto: a })); });

  var botaoCopiar = $("[data-copiar]");
  if (botaoCopiar) {
    botaoCopiar.addEventListener("click", function () {
      copiarTexto(localCompleto.replace(/ · /g, ", ")).then(
        function () { trocarRotulo(botaoCopiar, "Endereço copiado"); },
        function () { trocarRotulo(botaoCopiar, "Não deu para copiar"); }
      );
    });
  }

  /* ---------------- bom saber ---------------- */

  var ICONES = {
    relogio: ["M12 3.500a8.500 8.500 0 1 0 0 17a8.500 8.500 0 0 0 0-17Z", "M12 7.300V12l3.200 2"],
    traje: ["M3.500 7.500l7 4.500-7 4.500v-9Z", "M20.500 7.500l-7 4.500 7 4.500v-9Z", "M10.500 10.300h3v3.400h-3z"],
    ingresso: ["M3.500 9.200a2.800 2.800 0 0 0 0 5.600V17.500h17v-2.700a2.800 2.800 0 0 0 0-5.600V6.500h-17v2.700Z", "M14.500 8.300v1.600M14.500 11.200v1.600M14.500 14.100v1.600"],
    local: ["M12 21s-6.500-5.600-6.500-11a6.500 6.500 0 0 1 13 0c0 5.400-6.500 11-6.500 11Z", "M12 7.600a2.400 2.400 0 1 0 0 4.800a2.400 2.400 0 0 0 0-4.800Z"]
  };
  var listaDestaques = $('[data-lista="destaques"]');
  destaques.forEach(function (d, i) {
    var icone = sv("svg", { class: "destaque__icone", viewBox: "0 0 24 24", "aria-hidden": "true" });
    (ICONES[d.icone] || ICONES.relogio).forEach(function (caminho) { icone.appendChild(sv("path", { d: caminho })); });
    listaDestaques.appendChild(el("li", { class: "destaque", "data-revela": "", style: atraso(i, 0.1) }, [
      icone,
      el("strong", { class: "destaque__titulo", texto: d.titulo }),
      d.texto ? el("span", { class: "destaque__texto", texto: d.texto }) : null
    ]));
  });

  var listaDuvidas = $('[data-lista="duvidas"]');
  duvidas.forEach(function (d, i) {
    var corpo = el("div", { class: "duvida__corpo" }, [el("p", { class: "duvida__resposta", texto: d.resposta })]);
    var resumo = el("summary", { texto: d.pergunta });
    var item = el("details", { class: "duvida vidro-leve", "data-revela": "", style: atraso(i, 0.06) }, [resumo, corpo]);
    // abre e fecha com altura animada
    resumo.addEventListener("click", function (e) {
      if (!movimento || !corpo.animate) return;
      e.preventDefault();
      if (item.hasAttribute("data-animando")) return;
      item.setAttribute("data-animando", "");
      var abrindo = !item.open;
      if (abrindo) item.open = true;
      var altura = corpo.scrollHeight;
      var anim = corpo.animate(
        abrindo ? [{ height: "0px", opacity: 0 }, { height: altura + "px", opacity: 1 }] : [{ height: altura + "px", opacity: 1 }, { height: "0px", opacity: 0 }],
        { duration: 420, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );
      anim.onfinish = anim.oncancel = function () {
        if (!abrindo) item.open = false;
        item.removeAttribute("data-animando");
      };
    });
    listaDuvidas.appendChild(item);
  });

  /* ---------------- agenda e compartilhar ---------------- */

  function utcCompacto(d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
  var descricao = "Formatura da " + D.programa + " · Turma " + D.turma + " · " + D.instituicao + ". Traje: " + (L.traje || "a combinar") + ".";
  var enderecoSite = location.href.split("#")[0].split("?")[0];

  var linkGoogle = $('[data-agenda="google"]');
  if (linkGoogle) {
    linkGoogle.href = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(tituloEvento) +
      "&dates=" + utcCompacto(inicioUTC) + "/" + utcCompacto(fimUTC) +
      "&details=" + encodeURIComponent(descricao + " " + enderecoSite) +
      "&location=" + encodeURIComponent(localCompleto);
  }
  var linkIcs = $('[data-agenda="ics"]');
  if (linkIcs) {
    var esc = function (t) { return String(t).replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;"); };
    var ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Formatura Pediatria//PT-BR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:formatura-" + utcCompacto(inicioUTC) + "@pediatria",
      "DTSTAMP:" + utcCompacto(new Date()),
      "DTSTART:" + utcCompacto(inicioUTC),
      "DTEND:" + utcCompacto(fimUTC),
      "SUMMARY:" + esc(tituloEvento),
      "LOCATION:" + esc(localCompleto),
      "DESCRIPTION:" + esc(descricao),
      "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:" + esc(tituloEvento), "END:VALARM",
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    linkIcs.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  }
  var menuAgenda = $(".agenda");
  document.addEventListener("click", function (e) {
    if (menuAgenda && menuAgenda.open && !menuAgenda.contains(e.target)) menuAgenda.open = false;
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && menuAgenda && menuAgenda.open) {
      menuAgenda.open = false;
      $("summary", menuAgenda).focus();
    }
  });
  $$(".agenda__menu a").forEach(function (a) {
    a.addEventListener("click", function () { setTimeout(function () { menuAgenda.open = false; }, 50); });
  });

  var botaoCompartilhar = $("[data-compartilhar]");
  if (botaoCompartilhar) {
    botaoCompartilhar.addEventListener("click", function () {
      var conteudo = { title: document.title, text: "Convite da formatura da " + especialidade, url: enderecoSite };
      if (navigator.share) {
        navigator.share(conteudo).catch(function () { /* a pessoa desistiu de compartilhar */ });
      } else {
        copiarTexto(enderecoSite).then(
          function () { trocarRotulo(botaoCompartilhar, "Link copiado"); },
          function () { trocarRotulo(botaoCompartilhar, "Não deu para copiar"); }
        );
      }
    });
  }

  /* ---------------- seções sem conteúdo ---------------- */

  function semSecao(id) {
    esconder("#" + id);
    $$('.barra__links a[href="#' + id + '"], .doca a[href="#' + id + '"]').forEach(function (a) {
      (a.parentNode.tagName === "LI" ? a.parentNode : a).style.display = "none";
    });
  }
  if (!formandos.length) semSecao("turma");
  if (!retrospectiva.length && !galeria.length) semSecao("historia");
  if (!homenageados.length) semSecao("homenagens");
  if (!agradecimentos.length) semSecao("agradecimentos");
  if (!E || !E.texto) semSecao("epigrafe");
  if (!duvidas.length && !destaques.length) semSecao("duvidas");
  if (!C.texto || !C.texto.length) semSecao("convite");

  /* ---------------- revelação ao rolar ---------------- */

  var revelaveis = $$("[data-revela]");
  if (movimento && "IntersectionObserver" in window) {
    var obsRevela = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visto"); obsRevela.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revelaveis.forEach(function (r) { obsRevela.observe(r); });
  } else {
    revelaveis.forEach(function (r) { r.classList.add("visto"); });
  }

  if ("IntersectionObserver" in window) {
    // fora da tela, as animações de folhagem e luzes param
    var obsCena = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) { en.target.classList.toggle("fora", !en.isIntersecting); });
    }, { rootMargin: "80px 0px" });
    $$("[data-cena]").forEach(function (c) { obsCena.observe(c); });

    // o atalho da seção que está na tela fica marcado
    var atalhos = {};
    $$("[data-atalho]").forEach(function (a) { atalhos[a.getAttribute("data-atalho")] = a; });
    var obsAtalho = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        var a = atalhos[en.target.id];
        if (a) a.classList.toggle("ativo", en.isIntersecting);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(atalhos).forEach(function (id) { var s = document.getElementById(id); if (s) obsAtalho.observe(s); });
  }

  /* ---------------- rolagem: progresso, capa, palavras, linha do tempo e pilha ---------------- */

  var progresso = $("[data-progresso]");
  var capa = $(".capa");
  var rolagemAgendada = false;
  function aoRolar() {
    rolagemAgendada = false;
    var vh = window.innerHeight, sy = window.scrollY;
    var total = document.documentElement.scrollHeight - vh;
    if (progresso) progresso.style.setProperty("--p", total > 0 ? limitar(sy / total, 0, 1).toFixed(4) : "0");
    if (!movimento) return;

    if (capa) {
      var alturaCapa = capa.offsetHeight;
      if (sy < alturaCapa * 1.1) capa.style.setProperty("--rol", limitar(sy / alturaCapa, 0, 1).toFixed(3));
    }
    acenderPalavras();

    if (trilha && marcos.length) {
      var rt = trilha.getBoundingClientRect();
      if (rt.top < vh && rt.bottom > 0) {
        trilha.style.setProperty("--p", limitar((vh * 0.62 - rt.top) / rt.height, 0, 1).toFixed(3));
        marcos.forEach(function (m) {
          var q = m.getBoundingClientRect();
          m.classList.toggle("ativo", q.top + q.height * 0.5 < vh * 0.68);
        });
      }
    }

    for (var i = 0; i < cartoesPilha.length - 1; i++) {
      var a = cartoesPilha[i].getBoundingClientRect();
      if (a.bottom < -200 || a.top > vh + 200) continue;
      var b = cartoesPilha[i + 1].getBoundingClientRect();
      cartoesPilha[i].style.setProperty("--coberto", limitar(1 - (b.top - a.top) / (a.height * 0.9), 0, 1).toFixed(3));
    }
  }
  window.addEventListener("scroll", function () {
    if (rolagemAgendada) return;
    rolagemAgendada = true;
    requestAnimationFrame(aoRolar);
  }, { passive: true });

  /* ---------------- início ---------------- */

  if (D.abertura === false || !abertura) {
    if (abertura) abertura.remove();
    entrar();
  } else {
    abertura.addEventListener("click", abrirConvite);
    var botaoAbrir = $("[data-abrir]");
    if (botaoAbrir) botaoAbrir.focus({ preventScroll: true });
    aoRolar();
  }

  /* ---------------- efeitos de mouse: luz no vidro, inclinação e luz de fundo ---------------- */

  if (temMouse) {
    var inclinado = null;
    var luzCursor = $("[data-luz-cursor]");
    var alvoX = window.innerWidth / 2, alvoY = window.innerHeight / 3, luzX = alvoX, luzY = alvoY, luzLigada = false;
    var seguir = function () {
      luzX += (alvoX - luzX) * 0.07;
      luzY += (alvoY - luzY) * 0.07;
      luzCursor.style.transform = "translate3d(" + luzX.toFixed(1) + "px," + luzY.toFixed(1) + "px,0)";
      if (!document.hidden) requestAnimationFrame(seguir);
      else luzLigada = false;
    };

    document.addEventListener("pointermove", function (e) {
      alvoX = e.clientX;
      alvoY = e.clientY;
      if (luzCursor && movimento && !luzLigada) { luzLigada = true; luzCursor.classList.add("ativa"); requestAnimationFrame(seguir); }

      var alvo = e.target.closest ? e.target.closest("[data-luz], [data-inclina]") : null;
      if (alvo) {
        var r = alvo.getBoundingClientRect();
        alvo.style.setProperty("--mx", (e.clientX - r.left) + "px");
        alvo.style.setProperty("--my", (e.clientY - r.top) + "px");
      }
      var comInclina = e.target.closest ? e.target.closest("[data-inclina]") : null;
      if (inclinado && inclinado !== comInclina) {
        inclinado.style.setProperty("--rx", "0deg");
        inclinado.style.setProperty("--ry", "0deg");
      }
      inclinado = comInclina;
      if (comInclina && movimento) {
        var q = comInclina.getBoundingClientRect();
        var forca = Number(comInclina.getAttribute("data-inclina")) || 4;
        var px = (e.clientX - q.left) / q.width - 0.5, py = (e.clientY - q.top) / q.height - 0.5;
        comInclina.style.setProperty("--ry", (px * forca * 2).toFixed(2) + "deg");
        comInclina.style.setProperty("--rx", (-py * forca * 2).toFixed(2) + "deg");
      }
    }, { passive: true });
  }
})();
